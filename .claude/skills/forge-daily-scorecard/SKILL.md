---
name: forge-daily-scorecard
description: Produces a structured daily scorecard for Forge covering operational throughput, quality, revenue movement, active experiments, blockers, and next best move. Use at the start or end of each operating day.
---

# forge-daily-scorecard

## Engine-First Rule

Generate scorecards via the engine -- do not write scorecards manually from scratch:

```bash
cd /Users/lucas/Forge/openclaw/tools

# Generate today's scorecard (writes markdown + JSON to scorecards/)
python3 -m forge_ops scorecard daily

# Generate for a specific date
python3 -m forge_ops scorecard daily --date 2026-03-27

# Generate weekly summary
python3 -m forge_ops scorecard weekly

# Compare two days
python3 -m forge_ops scorecard compare --date-a 2026-03-26 --date-b 2026-03-27

# Get JSON output for programmatic use
python3 -m forge_ops scorecard daily --json
```

Output is written to:
- `data/workspace/scorecards/daily-YYYY-MM-DD.md`
- `data/workspace/scorecards/daily-YYYY-MM-DD.json`

After generating, fill in the "Next Best Move" section manually if not auto-populated.

Produces the daily operating report that Lucas can read in under 2 minutes.

---

## Data Sources

Pull from these files:
- `data/workspace/QUEUE.json` -- task status and artifact paths
- `data/workspace/lessons/` -- lessons written today
- `data/workspace/experiments/` -- active and closed experiments
- `data/workspace/offers/` -- active offer definitions
- `data/workspace/scorecards/scorecard-YYYY-MM-DD.md` -- today's session entries
- `data/workspace/review/` -- artifacts awaiting review
- Session logs if available

---

## Scorecard Format

Write the scorecard to:
```
data/workspace/scorecards/daily-YYYY-MM-DD.md
```

```markdown
# Forge Daily Scorecard: YYYY-MM-DD

## Operational

| Metric | Value |
|--------|-------|
| Tasks completed | <count> |
| Tasks blocked | <count> |
| Tasks decomposed | <count> |
| Average task duration | <estimate or "unknown"> |
| Queue depth (READY) | <count> |
| Stale tasks (IN_PROGRESS > 70min) | <count> |

## Quality

| Metric | Value |
|--------|-------|
| Review items produced | <count> |
| Review items pending | <count> |
| Lessons captured | <count> |
| Shallow/duplicate outputs flagged | <count> |

## Revenue Movement

| Item | Status |
|------|--------|
| Offers active | <list> |
| Products in review | <list> |
| Experiments launched | <list> |
| Experiments closed | <list> |
| Direct revenue actions taken | <list or "none"> |

## Distribution

| Item | Count |
|------|-------|
| X posts published | <count> |
| Content artifacts in review | <count> |
| Lead magnets available | <count> |

## Blockers

<List each BLOCKED task with its blocked_type and one-sentence reason>

## Lessons Learned Today

<List lesson slugs or "none">

## Next Best Move

<Single most valuable action for the next session and why>

## Lane Coverage

| Lane | Tasks in queue |
|------|---------------|
| Service | <count> |
| Productized assets | <count> |
| Subscription/monitoring | <count> |
| Distribution | <count> |
```

---

## After Writing

1. Update `last_scorecard_date` in QUEUE.json policy block if that field exists
2. Optionally post a summary to #forge Slack channel via bot token
