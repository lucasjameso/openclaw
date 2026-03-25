# Multi-Device Access

## Architecture

OpenClaw runs as a single instance on Forge (Mac Mini M4). There is nothing to install
on any other device. All state, memory, and configuration lives in one place:

```
~/Forge/openclaw/data/
```

## Accessing OpenClaw

### From Any Device via Slack (Primary)

Open Slack on any device and message @OpenClaw in #claude-code or DM it directly.
This is the recommended interaction method because:

- Works on phone, tablet, laptop, desktop
- No VPN, tunnel, or browser needed
- Conversation history is in Slack
- Channel-based context (different channels for different workflows)

### From MacBook Pro or MacBook Air via Web UI

Open a browser and go to:

```
https://openclaw.iac-solutions.io
```

This routes through the Cloudflare tunnel to the OpenClaw gateway on Forge.
If Zero Trust access is configured, you will authenticate before reaching the UI.

### From the Local Network

If on the same network as Forge:

```
http://forge.local:18789
```

(Replace `forge.local` with Forge's actual hostname or IP)

## What Lives Where

| Component              | Location                      |
|------------------------|-------------------------------|
| OpenClaw container     | Forge only                    |
| Persistent data        | ~/Forge/openclaw/data/        |
| Skills definitions     | ~/Forge/openclaw/skills/      |
| Environment variables  | ~/Forge/openclaw/.env         |
| Docker Compose config  | ~/Forge/openclaw/             |

## Switching Devices

There is no sync step. Because OpenClaw is server-side:

1. Close your laptop
2. Open Slack on your phone
3. Continue the conversation

The assistant has full context because all state is on Forge.

## Editing Skills or Configuration

To modify skills or configuration, you need access to the Forge filesystem:

- **SSH:** `ssh forge.local` (if SSH is configured)
- **VS Code Remote:** Connect to Forge via VS Code Remote SSH extension
- **Screen Sharing:** macOS Screen Sharing to Forge
- **Claude Code:** Run Claude Code on Forge directly (the preferred method)

After editing, restart the container or wait for the skills watcher:

```bash
# On Forge
cd ~/Forge/openclaw
docker compose restart
```
