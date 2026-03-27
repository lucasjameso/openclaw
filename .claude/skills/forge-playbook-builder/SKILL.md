---
name: forge-playbook-builder
description: Converts a repeated win or proven workflow into a reusable playbook. Use after a task or experiment produces a result worth repeating. Playbooks become skill templates and operating recipes.
---

# forge-playbook-builder

Use this skill when a workflow has been executed successfully enough times that it should become a repeatable recipe.

---

## When to Build a Playbook

Build a playbook when:
- The same type of task has been done well 2+ times
- A process produced an unusually good result
- A lesson was written that suggests a new standard approach
- A subagent produced results that should be repeatable

Do not build playbooks for one-off work. One success is an artifact. Two successes is a pattern. Three is a playbook.

---

## Playbook File Format

Write playbooks to:
```
data/workspace/playbooks/playbook-<slug>.md
```

```markdown
# Playbook: <slug>
Date: YYYY-MM-DD
Category: content | distribution | product | infrastructure | research | operations
Status: active | deprecated

## What This Is
<One sentence on the workflow this encodes>

## When To Use It
<Specific trigger conditions -- not "whenever" but specific situations>

## Prerequisites
<What must be true before starting>

## Steps

### Step 1: <name>
<What to do, including any specific tool calls, file paths, or decision rules>

### Step 2: <name>
...

## Success Check
<How to verify this worked correctly>

## Common Failure Modes
<What can go wrong and how to handle each>

## Notes
<Any important context, alternatives considered, or known edge cases>

## Source
<Links to lessons, experiments, or tasks that generated this playbook>
```

---

## After Writing

1. If this playbook makes an existing skill better, note the skill to update
2. If this playbook deserves its own skill, write a task to create it
3. Reference the playbook from related lesson files
