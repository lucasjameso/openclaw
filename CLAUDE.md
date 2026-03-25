# OpenClaw on Forge

OpenClaw is a self-hosted AI assistant running permanently on Forge (Mac Mini M4, Wake Forest NC).
It connects to Slack as its primary interaction surface, uses Anthropic Claude as its LLM provider,
and delegates database/service operations to n8n via webhooks.

## Folder Structure

```
~/Forge/openclaw/
├── CLAUDE.md               # This file - persistent memory for Claude Code sessions
├── docker-compose.yml      # OpenClaw container config
├── .env.example            # Template with placeholders
├── .env                    # Real credentials (git-ignored)
├── SPEC.md                 # Architecture decisions and design rationale
├── data/                   # Persistent OpenClaw state (Docker volume mount)
├── skills/                 # Custom skill definitions (mounted into container)
│   ├── ridgeline-status/SKILL.md
│   ├── content-ready/SKILL.md
│   ├── daily-brief/SKILL.md
│   ├── book-launch/SKILL.md
│   └── forge-status/SKILL.md
├── scripts/
│   ├── start.sh            # Preflight checks + docker compose up
│   ├── update.sh           # Pull latest image + restart + notify Slack
│   └── health-check.sh     # Curl health endpoint + report
└── docs/
    ├── slack-setup.md       # Slack app creation walkthrough
    ├── cloudflare-setup.md  # Tunnel route setup for openclaw.iac-solutions.io
    └── multi-device.md      # Thin-client access from MacBook Pro/Air
```

## Credential Rules

**Always read ~/Forge/.env as the single source of truth.**

### Keys OpenClaw gets:
- ANTHROPIC_API_KEY
- SLACK_WEBHOOK_* (all webhooks) and all SLACK_CHANNEL_* IDs
- N8N_BASE_URL and N8N_API_KEY
- CF_ACCOUNT_ID and CF_API_TOKEN
- SLACK_BOT_TOKEN and SLACK_APP_TOKEN (for Slack Socket Mode)

### Keys that stay in n8n (never pull into OpenClaw):
- SUPABASE_* (all keys) -- OpenClaw calls n8n, n8n hits Supabase
- LINKEDIN_* -- lives in n8n
- GITHUB_TOKEN -- not needed yet
- ARCHER_SECRET_TOKEN -- not OpenClaw's concern

## Operations

```bash
# Start
./scripts/start.sh

# Stop
docker compose -f ~/Forge/openclaw/docker-compose.yml down

# Update to latest image
./scripts/update.sh

# Health check
./scripts/health-check.sh

# View logs
docker compose -f ~/Forge/openclaw/docker-compose.yml logs -f

# Restart
docker compose -f ~/Forge/openclaw/docker-compose.yml restart
```

## Slack Workspace: "Forge Alerts"

| Channel          | Purpose                                      |
|------------------|----------------------------------------------|
| #forge-alerts    | System notifications, health reports, alerts  |
| #content-ready   | Content approval workflow notifications       |
| #book-launch     | CLARITY book launch tracking and updates      |
| #claude-code     | Primary OpenClaw interaction channel          |
| #n8n-logs        | n8n workflow execution logs                   |

## n8n Webhook Bridge

OpenClaw never hits external services directly. Pattern:
1. OpenClaw skill triggers an n8n webhook (N8N_BASE_URL + webhook path)
2. n8n has the service keys (Supabase, LinkedIn, etc.)
3. n8n executes the operation and returns results
4. OpenClaw formats and presents the response

## Networking

- Local gateway: http://127.0.0.1:3000
- External access: https://openclaw.iac-solutions.io (Cloudflare tunnel)
- Health check: http://127.0.0.1:3000/healthz
- Readiness: http://127.0.0.1:3000/readyz

## Skills

Skills live in `~/Forge/openclaw/skills/`. Each skill is a directory with a SKILL.md file.
The skills directory is bind-mounted into the container at `/workspace/skills/`.

### Current Skill Inventory

| Skill              | Description                                           |
|--------------------|-------------------------------------------------------|
| ridgeline-status   | Ridgeline platform status via n8n webhook             |
| content-ready      | Post content approval messages to #content-ready      |
| daily-brief        | Morning digest: calendar + email via n8n              |
| book-launch        | CLARITY launch countdown and metrics tracker          |
| forge-status       | Infrastructure health: PM2, n8n, tunnel, Docker       |

### Adding a New Skill

1. Create `skills/<skill-name>/SKILL.md`
2. Add YAML frontmatter with `name`, `description`, and optional `metadata`
3. Write the skill prompt in the markdown body
4. Restart the gateway or wait for the skills watcher to pick it up

## Done Criteria (Healthy Instance)

- `docker ps` shows openclaw container running and healthy
- `curl http://127.0.0.1:3000/healthz` returns OK
- https://openclaw.iac-solutions.io resolves to the web UI
- Slack bot responds in #claude-code
- All 5 skills are discoverable

## macOS Docker Gotchas

- Docker Desktop must be running (not just installed) before docker compose
- File watching may have slight delays due to macOS VirtioFS
- Volume permissions: ensure ~/Forge/openclaw/data/ is owned by your user
- Docker Desktop auto-start: System Settings > General > Login Items
- If ports conflict, check `lsof -i :18789` before starting
