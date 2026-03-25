---
name: ridgeline-status
description: Query Ridgeline platform status via n8n webhook
user-invocable: true
metadata: {"openclaw.requires": {"env": ["N8N_BASE_URL", "N8N_API_KEY"]}}
---

# Ridgeline Status

Query the Ridgeline platform for current status including active clients, recent pipeline
activity, and open items. All data is fetched through the n8n webhook bridge -- this skill
never hits Supabase directly.

## Behavior

1. Call the n8n webhook at `${N8N_BASE_URL}/webhook/openclaw/ridgeline-status`
2. Include the `N8N_API_KEY` as a Bearer token in the Authorization header
3. Parse the JSON response which includes:
   - `active_clients`: count and list of active client accounts
   - `pipeline_activity`: recent pipeline runs with status
   - `open_items`: tasks or issues requiring attention
4. Format as a clean summary with sections for each category
5. If any section has zero items, say so explicitly rather than omitting it

## Output Format

```
Ridgeline Platform Status
-------------------------
Active Clients: {count}
{client list}

Recent Pipeline Activity (last 24h):
{pipeline runs with status indicators}

Open Items: {count}
{item list with priority}
```

## Error Handling

If the n8n webhook returns an error or is unreachable, report:
"Could not reach Ridgeline status endpoint. Check n8n at {N8N_BASE_URL} and the
ridgeline-status webhook."
