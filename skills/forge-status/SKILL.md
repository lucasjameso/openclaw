---
name: forge-status
description: Forge infrastructure health check across all services
user-invocable: true
metadata: {"openclaw.requires": {"env": ["N8N_BASE_URL", "SLACK_WEBHOOK_FORGE_ALERTS"]}}
---

# Forge Status

Comprehensive health check of the Forge infrastructure. Checks PM2 processes, n8n
endpoint, Cloudflare tunnel status, and Docker containers. Posts results to #forge-alerts.

## Behavior

1. Check PM2 process list (`pm2 jlist` or via n8n webhook)
2. Ping n8n at `${N8N_BASE_URL}` and report response status
3. Check Cloudflare tunnel status (is openclaw.iac-solutions.io resolving?)
4. Check Docker container status for all Forge containers
5. Aggregate results into a clean health report
6. Post to #forge-alerts via `SLACK_WEBHOOK_FORGE_ALERTS`

## Output Format

```
Forge Infrastructure Status
============================
Timestamp: {timestamp}

PM2 Processes:
  {process_name}: {status} (uptime: {uptime}, restarts: {restarts})
  ...

n8n: {status} ({response_time}ms)
  URL: https://n8n.iac-solutions.io

Cloudflare Tunnel:
  openclaw.iac-solutions.io: {resolving/unreachable}
  n8n.iac-solutions.io: {resolving/unreachable}

Docker Containers:
  {container_name}: {status} (uptime: {uptime})
  ...

Overall: {HEALTHY / DEGRADED / DOWN}
```

## Error Handling

If individual checks fail, report them as degraded rather than failing the entire
health check. Always produce output even if some services are unreachable.
