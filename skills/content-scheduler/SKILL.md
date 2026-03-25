---
name: content-scheduler
description: Batch schedules content across X (Twitter) posts and ConvertKit email sequences. Manages posting cadence, queues drafts, coordinates timing across platforms. Use when scheduling posts, batching content, planning content calendar, or managing the content pipeline for Build What Lasts.
user-invocable: true
metadata: {"openclaw.requires": {"env": ["N8N_BASE_URL", "N8N_API_KEY", "SLACK_WEBHOOK_FORGE_ALERTS"]}}
---

# Content Scheduler

Manages batch scheduling of content across X (Twitter) and ConvertKit (Kit) email sequences. Coordinates timing, prevents double-posting, and maintains a central content queue.

## Context

- Brand: Build What Lasts (buildwhatlasts.app)
- LinkedIn: Separate from this skill (managed directly by Lucas)
- X Account: @Forge_Builds
- Email: ConvertKit (Kit)
- Content approval: All content requires Lucas approval before publishing
- No em dashes in any content

## Behavior

1. Read the content queue from `~/Forge/openclaw/data/content-queue.json`
2. For each queued item, check:
   - Platform target (x-text, x-media, email-sequence)
   - Scheduled date/time
   - Approval status (draft, approved, posted, failed)
   - Content body and any attached media paths
3. For items due within the next scheduling window:
   - If status is "draft": post preview to #content-ready Slack channel for Lucas to approve
   - If status is "approved": trigger the appropriate n8n webhook to publish
   - If status is "posted": skip
   - If status is "failed": retry once, then escalate to #forge-alerts
4. After processing, update the queue file with new statuses and timestamps
5. Generate a schedule summary showing upcoming content for the next 7 days

## Scheduling Rules

- X text posts: maximum 3 per day, minimum 4 hours apart
- X media posts: maximum 2 per day, best times are 8 AM, 12 PM, 5 PM EST
- Email sequences: respect Kit's sending limits, minimum 48 hours between emails to the same segment
- Never post identical content to X within 30 days
- Never schedule content on the same day as a CLARITY launch milestone (check clarity-countdown status)

## Output Format

```
CONTENT SCHEDULE | Next 7 Days

TODAY ({date}):
  {time} | {platform} | {title/first_line} | Status: {status}

{date}:
  {time} | {platform} | {title/first_line} | Status: {status}

QUEUE SUMMARY:
  Total queued:  {count}
  Approved:      {count}
  Awaiting review: {count}
  Posted today:  {count}
```

## n8n Webhook Integration

- X text post: `${N8N_BASE_URL}/webhook/openclaw/x-post` with Bearer auth (`N8N_API_KEY`)
  - Body: `{"text": "...", "scheduled_time": "ISO-8601"}`
- X media post: `${N8N_BASE_URL}/webhook/openclaw/x-media-post` with Bearer auth (`N8N_API_KEY`)
  - Body: `{"text": "...", "media_path": "...", "scheduled_time": "ISO-8601"}`
- Kit email: `${N8N_BASE_URL}/webhook/openclaw/kit-email` with Bearer auth (`N8N_API_KEY`)
  - Body: `{"subject": "...", "body_html": "...", "segment_id": "...", "scheduled_time": "ISO-8601"}`

## Error Handling

- If content-queue.json does not exist: create empty queue, notify #forge-alerts
- If n8n webhook returns non-200: mark item as "failed", log error, retry once after 60 seconds
- If duplicate content detected (>80% text similarity to a post within last 30 days): block and alert #content-ready
- If posting outside 7 AM to 10 PM EST: hold until next valid window unless explicitly overridden by Lucas
