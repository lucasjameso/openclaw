---
name: forge-session-closeout
description: Standardizes what happens at the end of any Forge work session -- artifact logging, lesson capture, scorecard update, queue state write-back, and follow-up task creation. Run this before ending any substantive work session.
---

# forge-session-closeout

Run this skill at the end of any substantive work session to ensure work compounds properly.

---

## Closeout Checklist

Complete every item before the session ends.

### 1. Artifact Logging

For every file created or significantly modified this session:
- Confirm the file exists at the path recorded
- Update the corresponding task's `artifact_paths` in QUEUE.json
- If no task exists, note the artifact in the session log

### 2. Lesson Capture

If any of the following happened this session, write a lesson:
- something failed or had to be retried
- a better approach was discovered mid-execution
- an assumption turned out to be wrong
- a task took significantly longer than estimated

Lesson file format:
```
/Users/lucas/Forge/openclaw/data/workspace/lessons/lesson-YYYY-MM-DD-<slug>.md
```

Lesson template:
```markdown
# Lesson: <slug>
Date: YYYY-MM-DD

## What Happened
<1-3 sentences describing the event>

## What Was Learned
<1-3 sentences on the insight>

## What To Do Differently
<1-3 concrete rule changes or action adjustments>

## Tags
<comma-separated: queue, content, distribution, offer, infrastructure, etc.>
```

### 3. Scorecard Update

Append an entry to `data/workspace/scorecards/` if any of these happened:
- a task reached DONE status
- revenue-related work was completed
- an experiment was launched or closed
- a review artifact was produced

Scorecard entry filename: `scorecard-YYYY-MM-DD.md`
If the file exists for today, append to it. Otherwise create it.

Minimum scorecard entry:
```markdown
## Session: <brief description> | <timestamp>
- Tasks completed: <count>
- Artifacts: <paths or "none">
- Revenue movement: <yes/no and what>
- Experiments active: <count>
- Next best move: <one sentence>
```

### 4. Queue State Write-Back

Before ending:
1. Ensure any IN_PROGRESS tasks are either DONE, BLOCKED, or DECOMPOSED
2. Clear expired leases
3. Update `updated_at` in QUEUE.json
4. Confirm queue has tasks in at least 2 of the 4 revenue lanes (service, productized assets, subscription, distribution)

### 5. Follow-Up Task Creation

If during this session you discovered work that should happen next:
1. Write it as a READY task in QUEUE.json with appropriate priority and lane
2. Keep follow-up tasks actionable -- not "research X" but "produce deliverable Y using approach Z"

---

## Minimum Viable Closeout

If the session was short or exploratory, minimum acceptable closeout:
- Confirm QUEUE.json `updated_at` is current
- Write one sentence to the notes field of any task touched
- Create a follow-up task if something useful was discovered
