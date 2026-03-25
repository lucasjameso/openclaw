# Slack + n8n Setup Handoff
**Session date:** 2026-03-21
**Project:** Clarity book launch — marketing automation
**Working directory:** `~/Forge/IAC/build-what-lasts/clarity/marketing`
**n8n instance:** https://n8n.iac-solutions.io

---

## What Was Completed This Session

### 1. Excalidraw Auto-Export Pipeline ✅
An end-to-end automation that watches `03-content-calendar/` for `.excalidraw` file changes and exports them to PNG and PDF automatically.

**Architecture:**
```
.excalidraw file saved/modified
  → macOS LaunchAgent (always-on server at localhost:3456)
  → n8n polls server every 5 minutes
  → Puppeteer renders via Excalidraw 0.17.6 UMD (unpkg CDN)
  → PNG saved → sips converts to PDF
  → Exports land in 03-content-calendar/exports/
  → Slack message posted to channel with week/day/slide info
```

**Files created:**
| File | Purpose |
|------|---------|
| `marketing/excalidraw-exporter.js` | HTTP server on :3456 — finds modified files, orchestrates export |
| `marketing/export-excalidraw.js` | Puppeteer renderer using Excalidraw 0.17.6 UMD bundle |
| `~/Library/LaunchAgents/app.buildwhatlasts.excalidraw-exporter.plist` | Auto-starts server on login, keeps it alive |
| `marketing/package.json` | npm package with `puppeteer` dependency |

**Server endpoints:**
- `GET  /health` — liveness check
- `GET  /poll`   — find + export new files since last run (called by n8n every 5 min)
- `POST /export` — `{ "filePath": "..." }` — force-export a specific file
- `POST /reset`  — reset state to epoch (next poll exports everything)

**Node binary:** `/opt/homebrew/bin/node` (v25.8.1)

**n8n Workflow:** `Clarity — Excalidraw Auto-Export Pipeline`
- **ID:** `Itpg5ctxd0usOjLe`
- **Status:** Active
- **Nodes:** Schedule (5 min) → HTTP GET localhost:3456/poll → IF count>0 → Split items → Format Slack message → POST to Slack webhook

---

### 2. Forge Alerts Slack App ✅
A Slack app configured for all Forge automation notifications.

**App details:**
| Field | Value |
|-------|-------|
| App ID | `A0AMY13R5AR` |
| Workspace ID | `T08DM1WTYA2` |
| Webhook URL | `https://hooks.slack.com/services/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` |
| Webhook Channel | `#all-lucasjamesoliver1_gmail_com_s-workspace` |
| Signing Secret | `356a825d22e5ed98a706c6d173c91ba0` |
| App Level Token | `xapp-1-A0AMY13R5AR-10734014984231-04cce48508b4d065f242184f85b9a008719800372ad4b746879c2d8b36b9089f` |
| Bot Token (xoxb-) | **NOT YET RETRIEVED — needed for next steps** |

**Credentials stored in `~/.zshrc`:**
```bash
SLACK_WEBHOOK_URL
SLACK_CHANNEL
SLACK_WORKSPACE_ID
SLACK_APP_ID
SLACK_SIGNING_SECRET
SLACK_APP_LEVEL_TOKEN
```

**n8n Credential:**
- **Name:** `Forge Alerts Slack`
- **ID:** `r8fAxdLL8qFgQipV`
- **Type:** `httpQueryAuth` (stores webhook URL — no bot token needed for posting)

---

### 3. Forge Notify Sub-Workflow ✅
A reusable n8n sub-workflow for all Forge notification needs. Every future workflow should call this instead of building Slack logic from scratch.

**n8n Workflow:** `Forge Notify`
- **ID:** `nkXQIwWxkUIZktZF`
- **Status:** Active
- **Trigger type:** `n8n-nodes-base.executeWorkflowTrigger`

**Input schema:**
```json
{
  "message":  "string — notification body",
  "urgency":  "info | success | warning | error",
  "filePath": "string — optional file reference"
}
```

**Color coding:**
| Urgency | Color | Icon |
|---------|-------|------|
| info | `#2196F3` (blue) | `:information_source:` |
| success | `#4CAF50` (green) | `:white_check_mark:` |
| warning | `#FF9800` (orange) | `:warning:` |
| error | `#F44336` (red) | `:x:` |

**How to call it from any other workflow:**
Add an `n8n-nodes-base.executeWorkflow` node with:
```json
{
  "source": "parameter",
  "workflowId": "nkXQIwWxkUIZktZF"
}
```
Pass `{ message, urgency, filePath }` as the input data.

> **TODO:** After channel IDs are saved, update this workflow to route to the correct channel based on the urgency/source. See routing rules below.

---

### 4. Claude Code Stop Hook ✅
`~/.claude/settings.json` updated with a Stop hook that sends a Slack notification every time a Claude Code session ends.

```json
"hooks": {
  "Stop": [{
    "hooks": [{
      "type": "command",
      "command": "curl -s -X POST 'https://hooks.slack.com/...' ..."
    }]
  }]
}
```

Posts to `#all-lucasjamesoliver1_gmail_com_s-workspace` with session directory and timestamp.

> **TODO:** After `SLACK_CHANNEL_CLAUDE_CODE` is saved, update this curl command to post to `#claude-code` instead.

---

## All Steps Completed ✅
**Completed:** 2026-03-21

### Step 1 — Bot token saved ✅
`SLACK_BOT_TOKEN` added to `~/.zshrc`

### Step 2 — 5 channels created ✅
### Step 3 — Channel IDs saved to `~/.zshrc` ✅

| Channel | ID |
|---------|-----|
| `#forge-alerts` | `C0AMV6135V1` |
| `#content-ready` | `C0ANEEQAK7B` |
| `#book-launch` | `C0ANEEQ2YDP` |
| `#claude-code` | `C0AMY51SBHB` |
| `#n8n-logs` | `C0AMY51JH37` |

### Step 4 — Forge Notify updated with channel routing ✅
- Switched from webhook to `chat.postMessage` + bot token
- Accepts `source` field for routing: `excalidraw`/`content` → `#content-ready`, `book-launch`/`dispatch` → `#book-launch`, `claude-code` → `#claude-code`, `n8n`/error urgency → `#n8n-logs`, everything else → `#forge-alerts`
- Excalidraw Auto-Export Pipeline also updated to post to `#content-ready` via `chat.postMessage`

### Step 5 — Claude Code Stop hook updated ✅
Posts to `#claude-code` (`C0AMY51SBHB`) via `chat.postMessage` + bot token

### Step 6 — End-to-end test ✅
All 5 channels received test messages successfully

---

## Quick Reference Card

### n8n Workflows (https://n8n.iac-solutions.io)
| ID | Name | Status |
|----|------|--------|
| `Itpg5ctxd0usOjLe` | Clarity — Excalidraw Auto-Export Pipeline | ✅ Active |
| `RxQGgcVzV5HzN8wZ` | Excalidraw Approval Checker | ✅ Active |
| `nkXQIwWxkUIZktZF` | Forge Notify | ✅ Active |
| `HwO6qVQwvLrfrRAV` | Ridgeline — Daily Alert Digest | ✅ Active |

### n8n Credentials
| ID | Name | Type |
|----|------|------|
| `r8fAxdLL8qFgQipV` | Forge Alerts Slack | httpQueryAuth |
| `OZeqZsnxnucSq7br` | Anthropic | anthropicApi |
| `uOI5wuRvyuWo8AvN` | Google | googleOAuth2Api |

### Local Services
| Service | Port | How to restart |
|---------|------|----------------|
| Excalidraw Export Server | 3456 | `launchctl unload/load ~/Library/LaunchAgents/app.buildwhatlasts.excalidraw-exporter.plist` |

### Webhook URL
```
https://hooks.slack.com/services/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
```

---

## Slack Approval Workflow (added 2026-03-21)

### Architecture
```
.excalidraw file created/modified
  → n8n polls server /poll every 5 min
  → Puppeteer exports PNGs to per-day Exports/ folders
  → Server uploads PNGs to #content-ready thread
  → "Reply APPROVE or REJECT: [feedback]"
  → Approval Checker polls /check-replies every 2 min
  → APPROVE → magick combines PNGs → CAROUSEL_FINAL.pdf → Slack confirms
  → REJECT → logs to feedback file → deletes PNGs → triggers Claude Code fix
           → next /poll re-exports → resubmits as revision N
```

### Server Endpoints (http://127.0.0.1:3456)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Liveness check |
| `/list` | GET | Dry-run: what would /poll export |
| `/poll` | GET | Export new PNGs + submit for Slack review |
| `/export` | POST | Force-export a single file |
| `/submit-for-review` | POST | Upload PNGs to Slack for approval |
| `/pending` | GET | List items awaiting approval |
| `/check-replies` | GET | Scan Slack threads for APPROVE/REJECT |
| `/approve` | POST | Build carousel PDF, notify Slack |
| `/reject` | POST | Log rejection, delete PNGs, trigger Claude Code fix |
| `/reset` | POST | Clear all state |

### State Files
| File | Purpose |
|------|---------|
| `/tmp/pending-reviews.json` | Pending approval items with Slack thread_ts |
| `/tmp/re-export-queue.json` | Dirs queued for re-export with attempt number |
| `~/Forge/Knowledge-Base/memory/excalidraw_feedback_log.md` | Rejection reasons + fix history |

### How to Use
1. Create/modify `.excalidraw` files in `03-content-calendar/.../Diagrams/`
2. Wait for n8n poll (5 min) or hit `curl http://127.0.0.1:3456/poll`
3. Check `#content-ready` in Slack — review the uploaded slides
4. Reply **APPROVE** in the thread to generate the carousel PDF
5. Reply **REJECT: your feedback** to trigger a fix + re-export cycle
