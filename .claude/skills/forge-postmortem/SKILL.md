---
name: forge-postmortem
description: Structured analysis of failures, blocked work, and repeated inefficiencies. Use after a session ends with significant blocks, after an experiment closes with failure, or when the same mistake has happened more than once.
---

# forge-postmortem

Use this skill to analyze what went wrong and produce a concrete system adjustment.

A postmortem is not blame. It is signal extraction. The goal is one rule change or one system improvement that prevents recurrence.

---

## When to Run a Postmortem

Required when:
- A task was blocked with `blocked_type: internal` more than once
- An experiment closed as `closed-failure`
- The same lesson has been written more than once
- A session produced zero artifacts
- A queue task was `invalid` and should not have existed

Optional but useful when:
- A task took 3x longer than estimated
- A teammate produced no usable output

---

## Postmortem File Format

Write postmortems to:
```
data/workspace/lessons/postmortem-YYYY-MM-DD-<slug>.md
```

```markdown
# Postmortem: <slug>
Date: YYYY-MM-DD
Trigger: <what caused this postmortem>
Related tasks: <task ids>
Related experiments: <experiment slugs>

## What Happened
<Factual timeline -- what was attempted, when, what failed>

## Why It Happened
<Root cause -- not surface cause. Ask "why" at least 3 times>

## Impact
<What was not built, not shipped, or not learned as a result>

## Repeat Signal
<Has this type of failure happened before? Where?>

## System Adjustment

### Rule to change
<Specific change to AGENTS.md, a skill, a hook, or a queue policy>

### Where to apply it
<File path or system component>

### How to verify the fix
<How will you know this failure mode is gone>

## Follow-Up Tasks
<List any QUEUE.json tasks to create as a result>
```

---

## After Writing

1. Cross-reference with existing lessons to see if this is a repeat pattern
2. If a system adjustment is needed, create a task in QUEUE.json to implement it
3. If the same failure has occurred 3+ times, escalate to Lucas for a strategic review
