# Queue Schema Draft

Apply these additions to the live Forge queue schema.

## New Valid Status

```json
"status": "READY | IN_PROGRESS | DONE | BLOCKED | ESCALATED | DECOMPOSED"
```

## New Task Fields

```json
{
  "blocked_type": null,
  "parent_id": null
}
```

## Field Semantics

### `blocked_type`

- `external`
- `internal`
- `invalid`
- `null` when not blocked

### `parent_id`

- used only for child tasks created during decomposition
- references the original oversized parent task

## Example Parent Task After Decomposition

```json
{
  "id": "T-2026-03-25-011",
  "status": "DECOMPOSED",
  "priority": 85,
  "title": "Create second free product: AI Agent Security Checklist PDF",
  "blocked_type": null,
  "parent_id": null,
  "notes": "Split into 3 child tasks for outline, design, and export."
}
```

## Example Child Task

```json
{
  "id": "T-2026-03-25-011-A",
  "status": "READY",
  "priority": 84,
  "title": "Outline AI Agent Security Checklist PDF",
  "parent_id": "T-2026-03-25-011",
  "blocked_type": null
}
```

## Invalid Human Task Example

This should not be created as a worker task:

```json
{
  "title": "Review and approve pending deliverables"
}
```

This belongs in:
- review queue
- Slack notification
- dashboard backlog

Not in the autonomous execution queue.
