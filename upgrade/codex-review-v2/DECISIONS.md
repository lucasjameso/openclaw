# Decisions

## 1. Preview uploads flow through `/api/state`

Claude's storage model assumes `push-state.js` writes preview payloads into KV keys like `preview:{path}`.

Because the push script runs outside Cloudflare and does not have direct KV access, this implementation sends changed preview payloads as `preview_payloads` on the authenticated `POST /api/state` request.

The Worker writes those preview payloads into individual KV keys before updating `forge-state`.

Why:
- avoids inventing a second write API unless needed
- keeps the push flow to a single authenticated sync request
- still preserves the KV-per-preview storage model

## 2. Existing review decisions are preserved during push sync

`push-state.js` first reads the current live state from `/api/state` and merges existing review fields like:
- `current_decision`
- `revision_count`
- `latest_event_id`
- `resolved_at`

Why:
- prevents the 5-minute sync from wiping out review actions recorded in the dashboard

## 3. Mission Control and X pages were reused from the live modular dashboard

The primary build target here is Review V2. The mission-control and X pages were carried forward from the live `src-live` baseline to avoid unnecessary drift.

Why:
- faster delivery
- lower regression risk
- keeps focus on the review operating system

## 4. `.md` and `.json` are attached as metadata, not queue items

The push script keeps review queue items restricted to previewable artifacts and attaches sidecar/debug files into metadata structures shown in the inspector panel.

Why:
- aligns with Lucas's stated review workflow
- keeps the queue visually clean

## 5. Analytics are built into the review page drawer, not a separate route page

The first wave of analytics lives in a collapsible drawer below the main review layout.

Why:
- keeps review context and analytics together
- makes it easy to inspect performance without navigating away
