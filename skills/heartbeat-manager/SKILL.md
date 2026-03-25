---
name: heartbeat-manager
description: Manages Forge's HEARTBEAT.md file including adding, removing, and archiving heartbeat tasks. Enforces exit conditions, cost guards, and task hygiene. Use when updating heartbeat tasks, reviewing what Forge monitors autonomously, adding new recurring checks, or troubleshooting heartbeat behavior.
user-invocable: true
metadata: {"openclaw.requires": {"env": []}}
---

# Heartbeat Manager

Manages the HEARTBEAT.md file that controls Forge's autonomous behavior. Ensures all tasks have proper exit conditions, cost guards, and failure paths. Prevents the "alive for three days then goes quiet" failure mode.

## Context

- HEARTBEAT.md location: `~/Forge/openclaw/HEARTBEAT.md`
- Heartbeat interval: every 30 minutes (configured in openclaw.json)
- Heartbeat uses: `lightContext: true` (only HEARTBEAT.md injected)
- Heartbeat uses: `isolatedSession: true` (fresh session each run)
- Heartbeat model: anthropic/claude-sonnet-4-6 (not Opus, to save costs)
- Maximum 3 API calls per heartbeat cycle
- Maximum 90 seconds execution time per cycle
- Heartbeat is analysis only, never generate or post content during heartbeat

## Behavior

### When triggered by "add heartbeat task" or "monitor {thing}":

1. Read current HEARTBEAT.md
2. Validate the new task has:
   - Clear trigger condition (what data to check)
   - Clear threshold (what constitutes "significant change")
   - Clear action (what to do: alert, log, or report)
   - Clear exit condition (when to stop)
3. Check that adding this task will not exceed 3 API calls per cycle
4. Add the task to the appropriate section of HEARTBEAT.md
5. Git commit with message "heartbeat-manager: added {task_name} {date}"
6. Confirm the change to Lucas

### When triggered by "review heartbeat" or "heartbeat status":

1. Read current HEARTBEAT.md
2. Validate structure against required template:
   - "Recurring Checks (Every Heartbeat)" section exists
   - "Autonomous Behavior Rules" section exists
   - "Exit Conditions (MANDATORY)" section exists
   - "Failure Path" section exists
3. Check each task for:
   - Does it have a clear exit condition?
   - Could it trigger more than 3 API calls?
   - Could it exceed 90 seconds?
   - Is it analysis-only (no content generation)?
4. Flag any tasks that violate the rules
5. Suggest fixes for flagged tasks
6. Report the current task list and health status

### When triggered by "archive heartbeat tasks" or "clean heartbeat":

1. Read current HEARTBEAT.md
2. Move completed tasks to a "Completed (Archive)" section at the bottom
3. Remove tasks that are no longer relevant
4. Ensure the active task list stays under 5 items (optimal for reliability)
5. Git commit changes

## Required HEARTBEAT.md Template

```markdown
## Recurring Checks (Every Heartbeat)
1. {check_description} -- threshold: {what_triggers_action}
2. {check_description} -- threshold: {what_triggers_action}
3. {check_description} -- threshold: {what_triggers_action}

## Autonomous Behavior Rules
When triggered by heartbeat (no human message):
- Pull data from relevant sources
- Apply comparison rules defined above
- If significant change: send structured report to #forge-alerts
- If no change: reply HEARTBEAT_OK
- STOP. Do not continue unless explicitly messaged.

## Exit Conditions (MANDATORY)
- Maximum 3 API calls per heartbeat cycle
- Maximum 90 seconds execution time
- If context exceeds 4000 tokens: summarize and stop
- Never generate or post content during heartbeat -- analysis only

## Failure Path
If any API call fails: log error to #forge-alerts, retry once after 30s, then stop

## Completed (Archive)
- {archived_tasks_with_dates}
```

## Output Format

```
HEARTBEAT STATUS | {date}

Active Tasks: {count}/5
  1. {task} -- last triggered: {date} -- status: {ok|stale|problematic}
  2. {task} -- last triggered: {date} -- status: {ok|stale|problematic}

Structure Validation:
  Recurring Checks:      {present | missing}
  Behavior Rules:        {present | missing}
  Exit Conditions:       {present | missing}
  Failure Path:          {present | missing}

Issues Found: {count}
  - {issue_description}

Cost Impact: ~{estimated_daily_cost} per day at 30min intervals
```

## Error Handling

- If HEARTBEAT.md is missing: create from template with zero active tasks, alert Lucas
- If HEARTBEAT.md has no exit conditions section: add the mandatory section immediately, alert Lucas
- Never remove the exit conditions or failure path sections, even if Lucas asks (safety boundary)
- If task count exceeds 5: warn that reliability may degrade, suggest consolidating
