# Forge -- Claude Code Entrypoint

## Operating Instructions

**Claude Code operating rules live in `.claude/CLAUDE.md`.**

That file is the canonical source for:
- Forge's mission and identity
- solo vs subagent vs agent team decision rules
- protected actions and review-first policy
- artifact and lesson logging requirements
- queue discipline and revenue lane standards

Do not look to this file for operating rules. Look to `.claude/CLAUDE.md`.

---

## Docker / OpenClaw Ops Reference

This section is kept for quick reference when operating the OpenClaw container.
It is operational documentation, not Claude Code instructions.

### Container Operations

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

### Endpoints

- Local: http://127.0.0.1:3000
- External: https://openclaw.iac-solutions.io (Cloudflare tunnel)
- Health: http://127.0.0.1:3000/healthz

### Credential Rules

Single source of truth: `~/Forge/.env`

Keys OpenClaw uses: ANTHROPIC_API_KEY, SLACK_BOT_TOKEN, SLACK_APP_TOKEN, SLACK_WEBHOOK_*, SLACK_CHANNEL_*, N8N_BASE_URL, N8N_API_KEY, CF_ACCOUNT_ID, CF_API_TOKEN

Keys that stay in n8n only: SUPABASE_*, LINKEDIN_*, GITHUB_TOKEN, ARCHER_SECRET_TOKEN

### Slack Workspace: Forge Alerts

| Channel | Purpose |
|---------|---------|
| #forge | Primary Claude Code interaction and notifications |
| #forge-alerts | System alerts, health reports |
| #content-ready | Content approval workflow |
| #book-launch | CLARITY book tracking |
| #claude-code | OpenClaw interaction |
| #n8n-logs | n8n execution logs |

### Container Skills

OpenClaw skills live in `skills/` (bind-mounted at `/workspace/skills/` in container).
These are separate from Claude Code skills in `.claude/skills/`.

### Adding a Container Skill

1. Create `skills/<skill-name>/SKILL.md`
2. Add YAML frontmatter: `name`, `description`, optional `metadata`
3. Write skill prompt in markdown body
4. Restart container or wait for skill watcher
