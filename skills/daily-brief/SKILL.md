---
name: daily-brief
description: Morning summary with calendar and email digest via n8n
user-invocable: true
metadata: {"openclaw.requires": {"env": ["N8N_BASE_URL", "N8N_API_KEY", "SLACK_WEBHOOK_FORGE_ALERTS"]}}
---

# Daily Brief

Morning summary posted to #forge-alerts at 8am ET. Pulls today's Google Calendar events
and urgent Gmail messages through n8n webhooks, formats as a clean digest.

## Behavior

1. Call `${N8N_BASE_URL}/webhook/openclaw/daily-brief` with Bearer auth
2. n8n aggregates:
   - Today's Google Calendar events (time, title, attendees)
   - Urgent/unread Gmail messages (sender, subject, snippet)
3. Format the response as a clean morning digest
4. Post to #forge-alerts via `SLACK_WEBHOOK_FORGE_ALERTS`

## Output Format

```
Good morning -- here is your daily brief for {date}.

Calendar ({count} events):
  {time} - {title} ({attendees})
  ...

Urgent Email ({count} messages):
  From: {sender} -- {subject}
  {snippet}
  ...

{closing note if nothing urgent: "Clear morning -- no urgent items."}
```

## Scheduling

This skill can be triggered manually at any time. For automated 8am delivery,
configure a cron trigger in n8n that calls OpenClaw or posts directly to Slack.

## Error Handling

If n8n is unreachable, post a degraded brief to #forge-alerts:
"Daily brief unavailable -- could not reach n8n. Check PM2 status."
