# OpenClaw Architecture Specification

## Why Forge is the Permanent Home

Forge is a Mac Mini M4 (2024) running 24/7 in Wake Forest, NC. It serves as the single
source of truth for all automation infrastructure. OpenClaw runs here because:

- Always-on availability for Slack responsiveness
- Co-located with n8n (already running via PM2)
- Cloudflare tunnel already configured for external access
- All persistent state in one place, backed up from one place

## Multi-Device Access Architecture

```
+-------------------+     +-------------------+     +-------------------+
| MacBook Pro       |     | MacBook Air       |     | Mobile / Any      |
| (thin client)     |     | (thin client)     |     | browser           |
+--------+----------+     +--------+----------+     +--------+----------+
         |                         |                          |
         +------------+------------+--------------------------+
                      |
            Cloudflare Tunnel
            openclaw.iac-solutions.io
                      |
         +------------+------------+
         |  Forge (Mac Mini M4)    |
         |  Docker: OpenClaw       |
         |  Port 3000 (local)     |
         |  ~/Forge/openclaw/data/ |
         +-----------+-------------+
                     |
              +------+------+
              | n8n (PM2)   |
              | Port 5678   |
              +------+------+
                     |
         +-----------+-----------+
         |           |           |
      Supabase   Google APIs  LinkedIn
```

**Key principle:** Nothing installs on client devices. MacBook Pro and MacBook Air access
OpenClaw through either:
1. https://openclaw.iac-solutions.io (web UI via Cloudflare tunnel)
2. Slack (primary interaction surface -- works from any device)

All state and memory lives in `~/Forge/openclaw/data/`. Switching devices is seamless
because there is no local state to sync.

## Why Slack is the Primary Interaction Surface

- Available on every device without additional setup
- Natural conversation interface for an AI assistant
- Channel-based organization matches workflow separation
- Webhooks enable n8n to push notifications back
- Works on mobile, desktop, and web -- no VPN or tunnel needed for basic use

## n8n Webhook Bridge Pattern

OpenClaw operates on a "read-only first" principle. It does not hold service credentials
for external systems. Instead:

```
OpenClaw Skill --> n8n Webhook --> External Service
                                       |
OpenClaw <-- n8n Callback/Response <---+
```

### Why This Pattern

1. **Key isolation:** Supabase service keys, LinkedIn credentials, and other sensitive
   tokens stay in n8n. If OpenClaw is compromised, those keys are not exposed.
2. **Audit trail:** n8n logs every webhook execution with inputs and outputs.
3. **Reusability:** The same n8n workflows serve OpenClaw, scheduled jobs, and other
   automations without duplicating integrations.
4. **Progressive trust:** Start read-only, add write operations per-skill as trust builds.

### Webhook Conventions

- Base URL: `N8N_BASE_URL` environment variable (https://n8n.iac-solutions.io)
- Webhook path pattern: `/webhook/openclaw/<skill-name>`
- Authentication: Bearer token via `N8N_API_KEY` header
- Response format: JSON with `status` and `data` fields

## Security Model

### Phase 1 (Current): Read-Only

- OpenClaw can query data through n8n but cannot modify external systems
- Skills are limited to read operations and Slack message posting
- No direct database access from OpenClaw

### Phase 2 (Planned): Controlled Writes

- Specific skills get write access via dedicated n8n workflows
- Each write operation requires its own n8n workflow with validation
- Content approval flows through #content-ready before publishing

### Phase 3 (Future): Autonomous Operations

- Scheduled skills (daily-brief) operate without human trigger
- Write operations with confirmation flows
- Error recovery and retry logic in n8n

## Key Isolation Rationale

| Key Category    | Location  | Reason                                              |
|-----------------|-----------|-----------------------------------------------------|
| ANTHROPIC_API_KEY | OpenClaw | LLM calls happen in OpenClaw directly               |
| SLACK_*         | OpenClaw  | OpenClaw is the Slack bot                           |
| N8N_*           | OpenClaw  | OpenClaw calls n8n webhooks                         |
| CF_*            | OpenClaw  | Tunnel management from the host                     |
| SUPABASE_*      | n8n only  | Database access is n8n's responsibility             |
| LINKEDIN_*      | n8n only  | Social posting is an n8n workflow                   |
| GITHUB_TOKEN    | Neither   | Not needed yet -- will go where needed when needed  |
| ARCHER_*        | Neither   | Separate system, not OpenClaw's concern             |
