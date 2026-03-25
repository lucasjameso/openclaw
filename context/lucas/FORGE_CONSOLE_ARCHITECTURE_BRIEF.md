# Forge Console — Architecture Brief
**Owner:** Lucas Oliver | Build What Lasts / IAC Solutions
**Date:** March 21, 2026
**Purpose:** Full system architecture review and design intent document for the Forge autonomous agent ecosystem. To be reviewed by Opus 4.6 for architectural recommendations.

---

## What Forge Is

Forge is Lucas Oliver's always-on Mac Mini M4 (2024) running as a personal AI operations center. It is the central hub for three parallel workstreams:

1. **Build What Lasts** -- book launch (CLARITY: Kill the Hero, April 17 2026), LinkedIn content, podcast outreach, platform growth
2. **IAC Solutions / Ridgeline** -- SaaS platform for specialty trade contractors (CRM, PM, scheduling, estimating + BI bolt-on)
3. **Facade Access Solutions** -- VP of Sales role, Atlas Intelligence BD platform, Meridian Intelligence pipeline analytics

Forge runs 24/7. It is the machine that works while Lucas works, travels, and sleeps.

---

## Current Tool Stack

| Tool | Role | How It's Used |
|------|------|---------------|
| **Claude Code** | Primary builder and autonomous agent | VS Code extension, --dangerously-skip-permissions, Haiku/Sonnet/Opus subagents, Stop hook logging |
| **Claude Cowork** | Browser agent and file manager | Scheduled tasks, Dispatch for phone-to-Forge, content building, plugin workflows |
| **n8n (local)** | Automation backbone | Runs at https://n8n.iac-solutions.io via Cloudflare tunnel, PM2 managed, handles all workflow automation |
| **Slack (Forge Alerts)** | Notification and approval layer | 5 channels: forge-alerts, content-ready, book-launch, claude-code, n8n-logs |
| **Cloudflare** | Tunnel and DNS | Routes n8n.iac-solutions.io to localhost:3456 and localhost:5678 |
| **Supabase** | Database (all projects) | Postgres, no Airtable, project-specific instances |
| **Excalidraw** | Visual content creation | LinkedIn carousel slides, auto-export pipeline |
| **GitHub** | Version control | All projects, strict branching (main = production, feature/agent branches) |
| **ImageMagick** | PNG to PDF conversion | Combines carousel slides into CAROUSEL_FINAL.pdf |

---

## What Has Been Built Today (March 21, 2026)

### Infrastructure
- n8n running locally via PM2, Cloudflare tunnel permanent
- Slack app "Forge Alerts" with 5 channels, bot token configured
- Claude Code Stop hook: logs session to ~/Forge/Logs/YYYY-MM-DD/session_HHMM.md AND posts to #claude-code
- File manager script running every 6 hours via LaunchAgent
- Forge Project Manager running hourly via Cowork scheduled task
- Master project index at ~/Forge/Logs/MASTER_INDEX.md

### Excalidraw Auto-Export Pipeline
- Watches ~/Forge/IAC/build-what-lasts/clarity/marketing/03-content-calendar/**/Diagrams/ for new .excalidraw files
- Exports each file to PNG at 2x resolution using Puppeteer + excalidraw.com
- Uploads PNGs to #content-ready in Slack with Block Kit interactive buttons
- Lucas taps Approve or Reject from phone
- Approve: ImageMagick combines slides into CAROUSEL_FINAL.pdf, notifies thread
- Reject: Opens modal for feedback text, logs rejection to excalidraw_feedback_log.md, triggers Claude Code headless to fix the file, re-exports, resubmits as revision N
- Feedback loop repeats until approved

### Style Knowledge Base
- 62 approved .excalidraw files analyzed by 6 parallel Haiku subagents
- Synthesized by Sonnet into excalidraw_style_knowledge.md (296 lines)
- Quick reference STYLE_SUMMARY.md (150 lines) for Cowork consumption

### CLARITY Book Launch
- Full launch command center at ~/Forge/IAC/build-what-lasts/clarity/marketing/
- 6 Dispatch task briefs ready to fire
- Week 5 batch HTML built and approved (posts Tuesday-Saturday March 25-29)
- LinkedIn post history analyzed (500 posts, engagement patterns identified)

---

## Current Architecture Diagram

```
LUCAS (phone/Mac)
       |
       | Slack (approve/reject/review)
       |
  FORGE ALERTS (Slack)
  ├── #forge-alerts     ← system health, file manager alerts
  ├── #content-ready    ← carousel approval loop
  ├── #book-launch      ← dispatch task completions
  ├── #claude-code      ← session stop notifications
  └── #n8n-logs         ← workflow errors
       |
  FORGE MAC MINI
  ├── n8n (localhost:5678) ── Cloudflare tunnel ── n8n.iac-solutions.io
  │   ├── Excalidraw Auto-Export Pipeline
  │   ├── Clarity — Excalidraw Auto-Export Pipeline  
  │   ├── Forge Notify (sub-workflow)
  │   └── n8n Approval Checker
  │
  ├── Excalidraw Server (localhost:3456) ── /slack-actions endpoint
  │   ├── /poll — detects new .excalidraw files, exports PNGs
  │   ├── /check-replies — monitors Slack for responses
  │   ├── /approve — combines PDFs
  │   └── /reject — logs feedback, triggers Claude Code fix cycle
  │
  ├── Claude Code (VS Code)
  │   ├── Stop hook → Slack #claude-code + session log
  │   ├── Subagent architecture (Haiku/Sonnet/Opus)
  │   └── apply-excalidraw-feedback.sh (headless fix cycle)
  │
  ├── LaunchAgents
  │   ├── forge-file-manager (every 6 hours)
  │   └── PM2 (n8n + cloudflare-tunnel, auto-restart)
  │
  └── Cowork Scheduled Tasks
      ├── Forge Project Manager (hourly)
      ├── Screenshot Cleanup (every 4 hours)
      └── Dispatch tasks (on demand)
```

---

## Current Problems and Friction Points

### 1. Slack Clutter
Every carousel approval creates multiple messages -- the initial post, revision posts, status updates. After a few weeks of daily carousels this becomes unmanageable. There is no archiving or cleanup system. Old approved messages pile up in #content-ready with no way to distinguish what is current vs. historical.

### 2. No Central Control Console
Everything is fragmented across Slack channels, Terminal, VS Code, n8n dashboard, and Cowork. There is no single place to see: what is running, what is pending, what needs attention, what completed. Lucas has to check multiple places to understand system state.

### 3. Rejection Loop Not Fully Wired
The feedback-to-fix cycle exists but the Claude Code headless step (apply-excalidraw-feedback.sh) is built but not yet proven to actually modify the .excalidraw file intelligently based on plain English feedback.

### 4. Cowork Context Limits
Cowork hits context limits on large tasks (62 file analysis failed). Current workaround is breaking tasks into smaller pieces or using Claude Code instead. No systematic solution.

### 5. Slack is Great for Notifications, Poor for Management
Slack is excellent for "hey, this needs your attention" but poor for "show me everything that's happening and let me manage it." Interactive buttons work for simple approve/reject but complex decisions need a richer interface.

### 6. No Web UI for Forge Console
There is no dashboard. Everything is CLI, Slack, or n8n's built-in UI. For a remote-friendly, always-accessible control center, a web UI is needed.

---

## The Vision: Forge Console

A lightweight web application, deployed on Cloudflare Pages, accessible from any browser, that serves as Lucas's mission control for everything Forge manages.

### What It Shows
- **Live system status**: n8n running, Cloudflare tunnel active, PM2 processes healthy
- **Active projects**: Each project with current sprint, completion percentage, last activity
- **Content pipeline**: This week's carousel status (pending/in-review/approved/posted)
- **Pending approvals**: Any content waiting for Lucas's review (with inline preview)
- **Session log**: What Claude Code and Cowork did today, in plain English
- **Upcoming**: What posts are scheduled for which days this week

### What You Can Do From It
- Approve or reject carousel slides (with feedback modal)
- Trigger Dispatch tasks
- View and update project STATUS.md files
- See all Slack channel activity without opening Slack
- Trigger n8n workflows manually
- View the weekly log

### Where It Lives
- Deployed: forge-console.iac-solutions.io (Cloudflare Pages)
- Backend: n8n webhooks serve data, Supabase stores state
- Auth: Simple token auth (just Lucas, no multi-user needed)
- Stack: Vite + React + Tailwind (same as Ridgeline)

### Slack Role After Console Exists
Slack becomes alerts-only. Not management. The console is where you manage. Slack is where Forge gets your attention. After a message gets acted on (approved, rejected, noted), it gets archived automatically via the Slack API.

---

## Slack Cleanup Strategy

Every message in #content-ready and #book-launch should be archived (not deleted) after one of these conditions:
1. Carousel is approved and PDF is created
2. 48 hours have passed with no action
3. Lucas explicitly dismisses it

Archiving means: reactions added + message moved to a thread in #forge-alerts with a summary. The channel stays clean. History is preserved in the archive thread.

This can be a nightly n8n workflow that scans channels and archives resolved messages.

---

## Questions for Opus 4.6 Architecture Review

1. **Forge Console backend**: Should the console read directly from Forge filesystem via a local API server, or should all state be written to Supabase and the console reads Supabase? What are the tradeoffs?

2. **Excalidraw fix cycle**: The headless Claude Code approach to fixing .excalidraw files based on plain English feedback -- is this the right architecture or is there a more reliable approach? What would fail at scale?

3. **n8n vs direct scripting**: Some of these automation pieces (file manager, session logger) are shell scripts running via LaunchAgent. Others are n8n workflows. What is the right dividing line between "use n8n" and "use a shell script"?

4. **Slack message lifecycle**: What is the cleanest way to manage Slack message state (pending/approved/archived) without building a full database? Can n8n handle this reliably?

5. **Cowork vs Claude Code for content**: Cowork keeps hitting context limits on complex tasks. Should content building (batch HTML, Excalidraw files) move entirely to Claude Code? What does Cowork do better?

6. **The approval loop reliability**: The current loop depends on Puppeteer + excalidraw.com being available and Chrome being open on Forge. What happens when Chrome crashes or excalidraw.com is slow? What is the fallback?

7. **Overall simplification**: Looking at the full architecture, what would you remove? What is over-engineered for the actual use case?

---

## Recommended Next Session Priorities

1. Build Forge Console MVP (Vite + React + Tailwind, Cloudflare Pages)
2. Wire apply-excalidraw-feedback.sh fully and test rejection loop end to end
3. Build Slack message archiving workflow in n8n
4. Set up MacBook Pro with same Claude Code configuration as Forge
5. Complete remaining Cowork plugin customizations (Sales, Engineering, Data, Marketing)
6. Fire CLARITY launch Dispatch tasks (Platform Audit, Podcast Research)
7. Supabase database consolidation (6 projects need to be rationalized)

---

## File Locations Reference

```
~/Forge/
├── Projects/
│   ├── ridgeline-intelligence/     ← PRIMARY BUILD
│   ├── atlas-intelligence/
│   ├── iac-solutions/
│   └── build-what-lasts/
├── FAS/
│   ├── pipeline/
│   ├── reports/
│   ├── team/
│   └── automation/
├── IAC/
│   ├── build-what-lasts/
│   │   ├── clarity/
│   │   │   └── marketing/          ← CLARITY LAUNCH COMMAND CENTER
│   │   ├── playbooks/
│   │   ├── content/
│   │   └── series/
│   └── consulting/
├── Knowledge-Base/
│   ├── memory/                     ← 15 KB files + style knowledge base
│   └── skills/
├── Logs/
│   ├── MASTER_INDEX.md
│   ├── Weekly/
│   ├── filesystem/
│   └── YYYY-MM-DD/                 ← daily session logs
├── Scripts/
│   ├── forge-file-manager.sh
│   └── apply-excalidraw-feedback.sh
└── Inbox/
    ├── screenshots/
    ├── _review-delete/
    └── excalidraw-source/
```
