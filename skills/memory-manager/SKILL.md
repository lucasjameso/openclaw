---
name: memory-manager
description: Manages Forge's memory system including tiering (HOT/WARM/COLD), daily log organization, MEMORY.md curation, and vector index maintenance. Use when organizing memories, archiving old data, curating long-term facts, cleaning up memory files, or when memory search seems degraded.
user-invocable: true
metadata: {"openclaw.requires": {"env": []}}
---

# Memory Manager

Manages Forge's markdown-based memory system with structured tiering, curation, and cleanup. Keeps MEMORY.md focused on durable facts while archiving time-sensitive data through HOT/WARM/COLD tiers.

## Context

- Source of truth: Markdown files in `~/Forge/openclaw/memory/`
- Vector index: `~/.openclaw/memory/<agentId>.sqlite` (auto-rebuilds from markdown)
- MEMORY.md: Long-term curated facts, loaded in private/main sessions
- Daily logs: `memory/YYYY-MM-DD.md` files
- Context files: 51 files in `~/Forge/openclaw/context/`

## Behavior

### When triggered by "organize memory" or "clean up memory":

1. Scan all files in `~/Forge/openclaw/memory/`
2. Apply tiering rules:
   - **HOT (Active):** Files from the last 7 days, or files referenced in the last 3 sessions. Keep in place.
   - **WARM (Recent):** Files from 8 to 30 days ago with no recent references. Move to `memory/archive/warm/`
   - **COLD (Archive):** Files older than 90 days with no references in 60+ days. Move to `memory/archive/cold/`
3. Before moving any file: extract durable facts (names, decisions, preferences, project milestones) and promote them to MEMORY.md if not already present
4. Update the memory index: list all current files with their tier and last-referenced date in `memory/index.md`
5. Report what was moved, what was promoted to MEMORY.md, and current memory file count

### When triggered by "curate MEMORY.md":

1. Read current MEMORY.md
2. Check each fact for:
   - Is it still accurate? (Cross-reference with recent conversations)
   - Is it a durable fact or time-sensitive? (Remove time-sensitive items that have passed)
   - Is it duplicated? (Merge duplicates)
   - Is it well-organized? (Group by category: Lucas personal, FAS work, IAC/Ridgeline, Build What Lasts, CLARITY, technical preferences)
3. Rewrite MEMORY.md with clean organization
4. Git commit the changes with message "memory-manager: curated MEMORY.md {date}"

### When triggered by "memory health":

1. Count total memory files
2. Count files by tier (HOT/WARM/COLD)
3. Check MEMORY.md line count (flag if >200 lines as too large)
4. Check if vector index exists and is recent
5. If vector index is missing or stale: note it (auto-rebuilds on next memory access)
6. Report memory system health

## Output Format

```
MEMORY MANAGER | {action} | {date}

FILES:
  Total:  {count}
  HOT:    {count} (last 7 days)
  WARM:   {count} (8-30 days)
  COLD:   {count} (90+ days)

ACTIONS TAKEN:
  Promoted to MEMORY.md: {count} facts
  Moved to WARM:         {count} files
  Moved to COLD:         {count} files

MEMORY.MD:
  Lines:      {count}
  Categories: {list}
  Status:     {healthy | needs curation | oversized}

VECTOR INDEX:
  Status: {current | stale | missing}
  Last rebuilt: {date}
```

## Error Handling

- Never delete memory files. COLD tier is archive, not deletion.
- If MEMORY.md is missing: create a new one from the most recent daily logs, alert Lucas
- If archive directories do not exist: create `memory/archive/warm/` and `memory/archive/cold/`
- Always git commit before and after memory operations for rollback safety
- If a promoted fact contradicts an existing MEMORY.md entry: keep both and flag the conflict for Lucas to resolve
