---
name: forge-experiment-runner
description: Defines, runs, and archives bounded experiments. Use when testing a hypothesis about revenue, distribution, content, or operations. Enforces success/failure criteria before launch and outcome capture after close.
---

# forge-experiment-runner

## Engine Note

Experiments are written as markdown files in `data/workspace/experiments/`.
The scorecard engine reads them automatically -- no manual wiring needed.

After closing an experiment, run the scorecard to capture the result:
```bash
cd /Users/lucas/Forge/openclaw/tools
python3 -m forge_ops scorecard daily
```

If a closed experiment should generate a follow-up queue task:
```bash
python3 -m forge_ops queue bootstrap  # (use Python API with task_template())
# or
python3 -m forge_ops queue update --id T-xxx --status READY
```

Use this skill to run bounded experiments with clear hypotheses, measurable criteria, and captured outcomes.

---

## Before Launching an Experiment

Answer all of these before creating any files:

1. What is the hypothesis? (If we do X, then Y will happen because Z)
2. What is the minimum test? (Smallest thing that validates or invalidates the hypothesis)
3. What are the success criteria? (Specific, measurable -- not "see if it works")
4. What are the failure criteria? (When do you stop and call it failed?)
5. What is the time box? (Maximum days before you must close and decide)
6. What does it cost? (Token cost, time, Lucas attention)
7. What do you learn from a failure? (Failure must also produce signal)

If you cannot answer all 7, do not launch the experiment.

---

## Experiment File Format

Write active experiments to:
```
data/workspace/experiments/exp-YYYY-MM-DD-<slug>.md
```

```markdown
# Experiment: <slug>
Date: YYYY-MM-DD
Status: active | closed-success | closed-failure | closed-inconclusive
Lane: service | productized_asset | subscription_monitoring | distribution

## Hypothesis
If we <action>, then <outcome> because <mechanism>.

## Minimum Test
<Specific deliverable or action that validates/invalidates this>

## Success Criteria
- [ ] <measurable criterion 1>
- [ ] <measurable criterion 2>

## Failure Criteria
- [ ] <condition that means stop and call it failed>

## Time Box
Close by: YYYY-MM-DD

## Estimated Cost
- Time: <hours>
- Token cost: <estimate>
- Lucas attention required: <none | review only | decision required>

## Execution Log
<Append entries as the experiment progresses>

## Outcome
<Fill in when closing>

## What Was Learned
<Fill in when closing -- even failure must produce signal>
```

---

## Closing an Experiment

When the time box expires or criteria are met:
1. Set `status` to `closed-success`, `closed-failure`, or `closed-inconclusive`
2. Fill in Outcome and What Was Learned
3. Write a lesson if something surprising happened
4. If successful: create a follow-up task to productize or scale the winning behavior
5. If failed: confirm the failure is logged so the same experiment is not re-run

---

## After Closing

Update the experiment status in the file. Do not delete failed experiments -- they are signal.
