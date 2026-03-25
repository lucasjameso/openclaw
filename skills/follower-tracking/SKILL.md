---
name: follower-tracking
description: Tracks follower counts and growth rates across LinkedIn and X (Twitter). Monitors daily deltas, weekly trends, and progress toward the 10,000 LinkedIn follower goal by December 31, 2026. Use when checking follower counts, growth metrics, social media performance, or progress toward audience goals.
user-invocable: true
metadata: {"openclaw.requires": {"env": ["N8N_BASE_URL", "N8N_API_KEY", "SLACK_WEBHOOK_FORGE_ALERTS"]}}
---

# Follower Tracking

Monitors and reports on audience growth across LinkedIn and X. Tracks progress toward the 10,000 LinkedIn follower target by December 31, 2026.

## Context

- LinkedIn: Lucas Oliver (currently 6,500+ followers, target 10,000 by Dec 31, 2026)
- X: @Forge_Builds
- Data source: n8n webhook that pulls platform metrics
- Report destination: #forge-alerts Slack channel

## Behavior

1. Call the n8n follower metrics webhook: `${N8N_BASE_URL}/webhook/openclaw/follower-metrics` with Bearer auth (`N8N_API_KEY`)
2. Parse response containing:
   - LinkedIn follower count (current)
   - LinkedIn follower count (previous day)
   - X follower count (current)
   - X follower count (previous day)
3. Calculate:
   - Daily delta for each platform
   - 7-day rolling average growth rate
   - 30-day rolling average growth rate
   - Projected date to hit 10,000 LinkedIn followers at current growth rate
   - Required daily growth rate to hit 10,000 by Dec 31, 2026
4. Compare actual growth rate against required growth rate:
   - On pace: actual >= required
   - Behind pace: actual < required (flag in report)
5. Append snapshot to `~/Forge/openclaw/logs/followers/YYYY-MM-DD.json`
6. Format and post to #forge-alerts
7. If LinkedIn delta > 5 in a single day: trigger a special notification (significant growth event)

## Output Format

```
FOLLOWER REPORT | {date}

LINKEDIN:
  Current:    {count}
  Today:      {+/-delta}
  7-Day Avg:  {avg}/day
  30-Day Avg: {avg}/day
  Target:     10,000 by Dec 31, 2026
  Pace:       {ON TRACK | BEHIND} (need {required}/day, getting {actual}/day)
  Projected:  Hit 10K by {projected_date}

X (@Forge_Builds):
  Current:    {count}
  Today:      {+/-delta}
  7-Day Avg:  {avg}/day
  30-Day Avg: {avg}/day
```

## Heartbeat Integration

When called during heartbeat cycle:
- Only check LinkedIn delta (cost-efficient)
- If delta > 5: post alert to #forge-alerts
- If delta <= 5: return HEARTBEAT_OK
- Do not generate full report during heartbeat

## Error Handling

- If n8n webhook fails: use last cached data from logs directory, note data is stale
- If follower count decreases: note it but do not treat as error (unfollows happen)
- If logs directory does not exist: create `~/Forge/openclaw/logs/followers/`
- If no historical data exists: start tracking from today, note "insufficient data for trends"
