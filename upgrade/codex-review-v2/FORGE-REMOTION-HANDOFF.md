# Forge Re-Motion Handoff

How to turn the overnight Forge content stack into short-form video output without contaminating the Cloudflare Worker app.

## Boundary

Do **not** bolt Re-Motion into the dashboard worker runtime.

Recommended structure:
- keep the Worker app as the live dashboard/UI surface
- use a separate motion workspace for Re-Motion composition + rendering
- treat the dashboard and motion system like siblings, not one tangled app

## Inputs Already Ready

- Roger voiceovers at `/Users/lucas/Forge/openclaw/forge-voice-tests/`
- vertical short-video cover drafts in `/Users/lucas/Forge/openclaw/upgrade/codex-review-v2/templates/x-cards/rendered/batch-1/`
- written hooks and chapter intros in `/Users/lucas/Forge/openclaw/data/workspace/content/x/`
- Excalidraw visuals created by Claude (per overnight log)
- Forge icon/badge references in:
  - `/Users/lucas/Forge/openclaw/context/forge-identity/forge-icon.png`
  - `/Users/lucas/Forge/openclaw/data/workspace/forge-badge-reference.png`

## First 3 Videos To Render

### 1. The $75/Day Leak

Voiceover:
- `forge-75-day-dude.mp3`

Cover draft:
- `video-cover-75-day-dude.html`

Narrative:
- cold open with the quote
- show the `$75/day -> $1.60/day` shift
- land on the line that the machine was hemorrhaging money in its sleep
- CTA: follow Forge / guide coming

### 2. Speed-Running Mediocrity

Voiceover:
- `forge-9-tasks-dude.mp3`

Cover draft:
- `video-cover-9-tasks-dude.html`

Narrative:
- lead with `9 tasks in 43 minutes`
- visually break down shallow vs useful work
- land on the insight that the metric was lying

### 3. The Agent Assigned Me Homework

Voiceover:
- `forge-homework-dude.mp3`

Cover draft:
- `video-cover-homework-dude.html`

Narrative:
- open on the absurdity
- show the invalid queue task
- explain the rule change that banned this behavior

## Composition Pattern

Every Forge short should follow the same rhythm:

1. **Cold open quote** (0-2s)
2. **Brutal stat** (2-5s)
3. **Simple visual explanation** (5-15s)
4. **System fix** (15-25s)
5. **Forge CTA** (final 2-3s)

This keeps the videos coherent even when the topics change.

## Excalidraw Export Plan

I do not currently see raw `.excalidraw` files in this workspace, only the overnight log note that Claude created 5 visuals.

Best path:
1. export each Excalidraw board to high-res PNG in Claude’s environment
2. drop those PNGs into a motion asset folder
3. use them as scene plates in Re-Motion

Suggested export targets:
- `1080x1350` for carousel/post stills
- `1080x1920` for full-screen short video plates

## Suggested Motion Workspace

Create a separate folder such as:
- `/Users/lucas/Forge/openclaw/motion/`

Inside that workspace:
- install Re-Motion
- keep audio, stills, and scene data there
- render MP4s without touching the Worker app

## Visual Language

- dark Forge background
- amber + blue highlights
- IBM Plex Mono labels
- Space Grotesk headline feel
- calm but aggressive pacing
- no generic corporate transitions

## Immediate Output Goal

By morning, the minimum viable motion win is:
- 3 rendered short-video pieces
- 1 per top hook
- all branded consistently with Forge

That is enough to start publishing and testing.
