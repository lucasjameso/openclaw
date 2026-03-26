# AGENTS Draft Addendum

Apply these changes to the live Forge `AGENTS.md`.

## New Task Status

Add `DECOMPOSED` as a valid task status.

Meaning:
- the parent task was too large for a single worker window
- the worker split it into smaller child tasks
- the parent is no longer directly executable

## Decomposition Rule

If a worker estimates that a task will take more than 15 minutes, it must not mark the task `BLOCKED` for size alone.

Instead it must:

1. split the task into 2-4 child tasks
2. write those child tasks into `QUEUE.json`
3. set each child task `parent_id` to the parent task id
4. inherit the parent priority minus 1
5. mark the parent task `DECOMPOSED`
6. execute the first child task immediately in the same session

Too-large work is not a block. It is a decomposition event.

## Human Task Prohibition

Workers must never create a queue task whose acceptance criteria requires Lucas to perform the work.

Examples of invalid worker-created tasks:
- "Lucas reviews deliverables"
- "Lucas approves this PDF"
- "Ask Lucas which option to choose"

If human input is needed, the worker must:

1. place the artifact in the correct review folder
2. send the appropriate Slack notification or dashboard signal
3. continue autonomous work

## blocked_type

Add `blocked_type` to the task schema with these valid values:

- `external`
  - third-party API failure
  - waiting on credentials
  - waiting on human approval

- `internal`
  - Forge tried and failed
  - needs a different approach

- `invalid`
  - task should not have existed in the autonomous queue

Rules:
- `external` blocks should be escalated visibly
- `internal` blocks should be retried with a different approach
- `invalid` tasks should be closed on the next manager pass

## Throughput Quality Note

Workers should optimize for meaningful progress, not just task count.

Short sessions are not automatically good sessions.

The dashboard will surface average session duration and shallow-work patterns separately. Use that signal to adjust task sizing and quality expectations.
