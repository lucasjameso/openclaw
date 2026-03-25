---
name: health-check
description: Monitors Forge's system health, security integrity, and operational status. Checks SOUL.md and AGENTS.md for unauthorized modifications via SHA-256 hashing, verifies API connectivity, validates config files, and reports overall system status. Use when checking system health, security status, or verifying Forge is operating correctly.
user-invocable: true
metadata: {"openclaw.requires": {"env": ["SLACK_WEBHOOK_URL"]}}
---

# Forge Health Check

Comprehensive system health and security monitoring for Forge's OpenClaw deployment. Detects unauthorized file modifications, API connectivity issues, configuration drift, and resource problems.

## Behavior

1. Run security integrity checks:
   - Calculate SHA-256 hash of `~/Forge/openclaw/SOUL.md`
   - Calculate SHA-256 hash of `~/Forge/openclaw/AGENTS.md`
   - Compare against known-good hashes stored in `~/Forge/openclaw/data/integrity-hashes.json`
   - If mismatch detected: CRITICAL alert to #forge-alerts, do NOT proceed with other checks
2. Run API connectivity checks:
   - Verify Anthropic API responds (simple model list call)
   - Verify n8n is reachable at `${N8N_BASE_URL}/healthz`
   - Verify Slack webhook is functional (send test ping)
   - If DeepSeek is configured: verify OpenAI-compatible endpoint responds
   - If Ollama is configured: verify `http://host.docker.internal:11434/api/tags` responds
3. Run configuration validation:
   - Verify `~/.openclaw/openclaw.json` is valid JSON
   - Verify `~/.openclaw/agents/main/agent/auth-profiles.json` exists and is valid
   - Check that port 18789 is NOT exposed to public internet
   - Verify sub-agent config files are read-only to sub-agents
4. Run resource checks:
   - Check disk space on Mac Mini (alert if <10GB free)
   - Check Docker container memory usage
   - Check session file count (alert if >100 active sessions indicating leak)
   - Check memory file count in `~/Forge/openclaw/memory/`
5. Run skill inventory:
   - Count skills in `~/Forge/openclaw/skills/`
   - Verify each SKILL.md has valid YAML frontmatter
   - Flag any skill files over 500 lines
6. Format health report
7. Post to #forge-alerts if any issues found, otherwise log locally

## Output Format

```
FORGE HEALTH CHECK | {timestamp}

SECURITY:      {PASS | FAIL | CRITICAL}
  SOUL.md:     {hash_status}
  AGENTS.md:   {hash_status}

CONNECTIVITY:  {PASS | PARTIAL | FAIL}
  Anthropic:   {status} ({latency}ms)
  n8n:         {status} ({latency}ms)
  Slack:       {status} ({latency}ms)
  DeepSeek:    {status} ({latency}ms) or N/A
  Ollama:      {status} ({latency}ms) or N/A

CONFIG:        {PASS | WARNING | FAIL}
  openclaw.json:      {valid | invalid | missing}
  auth-profiles.json: {valid | invalid | missing}
  Port 18789:         {local_only | EXPOSED}

RESOURCES:     {OK | WARNING | CRITICAL}
  Disk:        {available}GB free
  Memory:      {usage}MB / {limit}MB
  Sessions:    {count} active
  Memory files: {count}

SKILLS:        {count} installed, {issues} issues
  {skill_name}: {ok | warning: reason}

OVERALL: {HEALTHY | DEGRADED | CRITICAL}
```

## Hash Management

On first run or when Lucas says "reset health baselines":
1. Calculate current hashes of SOUL.md and AGENTS.md
2. Store in `~/Forge/openclaw/data/integrity-hashes.json`
3. Git commit the hash file
4. These become the new known-good baselines

## Error Handling

- If integrity check fails: this is the highest priority alert. Post CRITICAL to #forge-alerts immediately. Do not suppress.
- If any API is unreachable: mark as FAIL, continue checking other systems
- If hash file does not exist: treat as first run, create baselines, warn Lucas to verify current files are clean
- If disk space check fails (permission issue): log and skip, do not block other checks
