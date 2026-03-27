---
name: forge-queue-ops
description: Deterministic queue operations for Forge -- task selection, lease management, decomposition, blocker classification, and next-task discipline. Use this whenever reading from or writing to QUEUE.json.
---

# forge-queue-ops

## Engine-First Rule

Prefer engine calls over direct QUEUE.json mutation:

```bash
cd /Users/lucas/Forge/openclaw/tools

# Check queue health
python3 -m forge_ops queue status --json

# Get next task to work on
python3 -m forge_ops queue next --json

# Mark a task blocked
python3 -m forge_ops queue block --id T-xxx --type internal --reason "..."

# Mark a task done (use update for partial changes)
python3 -m forge_ops queue update --id T-xxx --status DONE

# Recover stale in-progress tasks
python3 -m forge_ops queue recover-stale

# Validate queue integrity
python3 -m forge_ops queue validate

# Backfill missing fields on READY tasks
python3 -m forge_ops queue normalize

# Decompose a task into children
python3 -m forge_ops queue decompose --id T-xxx --children "Child title 1" "Child title 2"
```

Direct QUEUE.json edits are only acceptable when the engine cannot do the operation.
If you write to QUEUE.json directly, validate afterward: `python3 -m forge_ops queue validate`

Use this skill whenever you interact with the Forge business queue at `/Users/lucas/Forge/openclaw/data/workspace/QUEUE.json`.

---

## Queue Read Checklist

Before selecting any task:

1. Read QUEUE.json completely
2. Filter to `status: READY` tasks only
3. Sort by `priority` descending, then `created_at` ascending (oldest high-priority first)
4. Skip any task where `lease_expires_at` is in the future (another worker owns it)
5. Select the first eligible task

Do not select a task while another task is `IN_PROGRESS` unless the `lease_expires_at` has passed and recovery is needed.

---

## Task Selection Declaration

After selecting a task, immediately write:

```
COMMIT_TASK: <task_id>
SUCCESS_CRITERIA: <1-3 measurable checks>
FIRST_ACTION: <literal next step>
```

Then execute immediately. Do not deliberate.

---

## Lease Ownership Convention

When starting a task:
1. Set `status: IN_PROGRESS`
2. Set `lease_owner` to the current session identifier
3. Set `lease_expires_at` to now + 55 minutes
4. Set `last_progress_at` to now

During execution, update `last_progress_at` every meaningful step.

When completing a task:
1. Set `status: DONE`
2. Set `completed_at` to now
3. Clear `lease_owner` and `lease_expires_at`
4. Set `artifact_paths` to actual file paths created
5. Write a one-sentence summary to `notes`

---

## Decomposition Rule

If you estimate a task will take more than 15 minutes to complete:

1. Split into 2-4 child tasks
2. Write child tasks into QUEUE.json with:
   - `parent_id` set to the parent task id
   - `priority` set to parent priority minus 1
   - `status: READY`
3. Set the parent task `status: DECOMPOSED`
4. Execute the first child task immediately

Too-large work is a decomposition event, not a block.

---

## Blocker Classification

When a task must be blocked, classify `blocked_type`:

- `external`: third-party API failure, waiting on credentials, waiting on human approval
- `internal`: Forge tried and failed, needs a different approach
- `invalid`: task should not exist in the autonomous queue

Rules:
- `external` blocks: escalate visibly via Slack or dashboard signal; continue other work
- `internal` blocks: retry with a different approach; escalate after 2 failures
- `invalid` tasks: close on the next manager pass

---

## Human Task Prohibition

Never create a queue task whose completion requires Lucas to perform the work.

Invalid examples:
- "Lucas reviews deliverables"
- "Lucas approves PDF"
- "Ask Lucas which option to choose"

If human input is needed:
1. Place the artifact in `data/workspace/review/` with a metadata summary
2. Send the appropriate Slack signal (#forge channel, bot token)
3. Continue autonomous work

---

## Stale Task Recovery

If a task is `IN_PROGRESS` and `lease_expires_at` has passed:
1. Set `status: READY`
2. Clear `lease_owner` and `lease_expires_at`
3. Increment `attempt_count`
4. Add a recovery note to `notes`
5. Re-select following normal priority rules

---

## Queue Integrity

After every write to QUEUE.json:
1. Confirm the file parses as valid JSON before continuing
2. Check that `updated_at` was set to now
3. Verify no duplicate task ids
