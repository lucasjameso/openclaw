---
name: cost-tracking
description: Monitors Forge's daily API spend against the $20/day limit. Alerts at $15 threshold. Tracks cumulative cost per model, per heartbeat, and per session. Use when checking API costs, budget status, or when heartbeat needs cost guard enforcement.
user-invocable: true
metadata: {"openclaw.requires": {"env": ["ANTHROPIC_API_KEY", "SLACK_WEBHOOK_FORGE_ALERTS"]}}
---

# API Cost Tracking

Tracks Forge's API spend in real time against the $20/day hard limit. Sends alerts to #forge-alerts when spend hits $15 (75% threshold). Prevents runaway costs from long sessions, heartbeat loops, or sub-agent spawns.

## Behavior

1. Read the current date's cost log from `~/Forge/openclaw/logs/costs/YYYY-MM-DD.json`
2. If the log file does not exist for today, create it with zero values
3. Parse all entries: each entry contains `timestamp`, `model`, `input_tokens`, `output_tokens`, `estimated_cost`
4. Calculate totals:
   - Total spend today (sum of all estimated_cost values)
   - Spend by model (group by model field)
   - Spend by session type (heartbeat vs interactive vs sub-agent)
   - Average cost per heartbeat cycle
5. Compare total spend against thresholds:
   - Under $15: report status normally
   - $15 to $19.99: send WARNING to #forge-alerts via Slack webhook
   - $20 or above: send CRITICAL alert to #forge-alerts, recommend pausing non-essential heartbeats
6. Format the output as a cost report
7. If triggered during heartbeat: return only the threshold check (pass/fail), do not generate full report

## Output Format

```
FORGE COST REPORT | {YYYY-MM-DD}

Total Spend: ${total}
Daily Limit: $20.00
Remaining:   ${remaining}
Status:      {OK | WARNING | CRITICAL}

BY MODEL:
  anthropic/claude-opus-4-6:   ${amount} ({percentage}%)
  anthropic/claude-sonnet-4-6: ${amount} ({percentage}%)

BY SESSION TYPE:
  Interactive: ${amount} ({count} sessions)
  Heartbeat:   ${amount} ({count} cycles)
  Sub-agent:   ${amount} ({count} spawns)

Avg cost per heartbeat: ${avg}
```

## Cost Estimation Reference

Use these rates for estimation (update when pricing changes):
- Claude Opus input: $15.00 per 1M tokens
- Claude Opus output: $75.00 per 1M tokens
- Claude Sonnet input: $3.00 per 1M tokens
- Claude Sonnet output: $15.00 per 1M tokens

## Error Handling

- If cost log directory does not exist: create `~/Forge/openclaw/logs/costs/` and initialize today's file
- If Slack webhook fails: log error locally to `~/Forge/openclaw/logs/cost-alert-failures.log`
- If cost data seems impossibly high (>$50 in a single entry): flag as anomaly, do not include in totals, alert Lucas
