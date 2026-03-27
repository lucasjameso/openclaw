# Forge Script Audit

Date: 2026-03-27

Three buckets: Promote (into engines), Keep (as adapters/wrappers), Retire (archive).

---

## Bucket A -- Promote Into Engines

These scripts perform generic operations that belong in the forge_ops engine layer.
They should be replaced by engine calls, then archived.

| Script | What It Does | Replace With |
|--------|-------------|--------------|
| `add_manager_tasks.py` | Adds manager-generated tasks to QUEUE.json | `queue_engine.bootstrap()` |
| `fix-queue.js` | Fixes duplicate IDs and malformed tasks | `queue_engine.validate()` + `queue_engine.normalize()` |
| `fix-queue2.js` | Variant of fix-queue.js | `queue_engine.validate()` |
| `fix-duplicate-task-ids.js` | Deduplicates task IDs | `queue_engine.validate()` |
| `update_blocked_task.py` | Updates a single task's blocked status | `queue_engine.block()` |
| `archive-done-tasks.js` | Moves DONE tasks to archive | Add `queue_engine.archive()` (future) |
| `archive-queue.js` | Archives the full queue | Add `queue_engine.archive()` (future) |
| `generate-review-state.js` | Generates review state from file system | `review_engine.sync()` |
| `weekly-report.js` | Generates weekly metrics | `scorecard_engine.weekly()` |
| `push-state.js` | Pushes dashboard state to KV | Keep as adapter but have it call `review_engine.sync()` for review data |

**Action**: On the next manager pass that touches any of these scripts, use the engine instead.
Do not delete yet -- keep for reference until engine usage is confirmed in production.

---

## Bucket B -- Keep As Adapters / Wrappers

These scripts call external APIs or do platform-specific work that belongs at the integration layer, not in engines.

| Script | What It Does | Notes |
|--------|-------------|-------|
| `gumroad-manager.js` | Gumroad product management | Keep. Secret fallback removed. Use as integration adapter. |
| `x-post-controller.js` | X API posting controller | Keep. Core distribution plumbing. |
| `post-tweet.js` | Posts single tweets | Keep as wrapper. |
| `post-tweet-v2.js` | Posts tweets v2 API | Keep as wrapper. |
| `post-tweet-with-image.py` | Posts tweet with media | Keep. |
| `post-tweet-media.py` | Media upload for tweets | Keep. |
| `post-thread.py` | Posts X thread | Keep. Generic thread poster. |
| `post-reply.js` | Posts reply to a tweet | Keep. |
| `push-state.js` | Pushes forge-state to Cloudflare KV | Keep as deploy adapter. |
| `update-dashboard-state.js` | Updates dashboard state | Keep as deploy adapter. |
| `deploy-dashboard.sh` | Wrangler deploy wrapper | Keep. |
| `test-x-auth.js` | Tests X API credentials | Keep for diagnostics. |
| `get-recent-tweets.js` | Fetches recent Forge tweets | Keep for diagnostics. |
| `schedule-engagement.js` | Schedules X engagement tasks | Keep as cron helper. |
| `create-x-thread-cron-jobs.sh` | Creates cron jobs for X threads | Keep as cron helper. |
| `setup-x-thread-cron.js` | Sets up X thread cron | Keep. |
| `run-forge-scheduled-posts.js` | Runs scheduled post queue | Keep as scheduler. |
| `search-x-conversations.js` | Searches X for relevant conversations | Keep for engagement. |
| `tweet-queue.js` | Manages a local tweet queue | Keep as queue adapter. |
| `watchdog.js` | Monitors system health | Keep. |
| `track-followers.js` | Tracks X follower counts | Keep for analytics. |
| `track-followers-simple.js` | Simpler follower tracker | Keep if used by cron. |
| `update-follower-data.js` | Updates follower data file | Keep. |
| `generate-task-id.js` | Generates a task ID | Minor utility -- fine to keep. |
| `visual-pre-screener.js` | Pre-screens visuals for review | Keep as review pipeline step. |
| `stage-forge-post.js` | Stages a post for review | Keep as review adapter. |

---

## Bucket C -- Archive / Retire

These are campaign-specific, date-specific, or one-off scripts that no longer serve a general purpose.

| Script | Reason |
|--------|--------|
| `post-x-thread-L-001.js` through `L-014.js` | Campaign-specific. Each hardcodes a specific thread. Archive after threads are posted. |
| `post-x-thread-L001.js`, `L002.js` | Same as above. |
| `render-agent-lesson-L-001-card.js` | Hardcoded lesson card renderer. Superseded by `render-agent-lesson-cards.js`. Archive. |
| `render-agent-lesson-L-011-card.js` through `L-021-card.js` | Same as above. Use batch renderers. |
| `render-agent-lesson-cards-L005-L008.js` | Campaign batch. Archive after use. |
| `render-agent-lesson-cards-L009-L010.js` | Campaign batch. Archive after use. |
| `render-agent-lesson-cards-L021-L023.js` | Campaign batch. Archive after use. |
| `render-agent-lesson-cards-batch-5.js` | Campaign batch. Archive after use. |
| `update_blocked_task.py` | One-off ID-specific task update. Replaced by `queue_engine.block()`. |
| `add_manager_tasks.py` | One-off task add. Replaced by `queue_engine.bootstrap()`. |
| `analyze-viral-strategy.js` | One-off analysis. Archive. |
| `check-mobile-responsive.js` | One-off check. Archive. |
| `create-guide-googledoc.py` | One-off guide creation. Archive. |
| `schedule-lucas-week1.sh` | Date-specific schedule. Archive. |
| `update-x-thread-schedule.js` | One-off schedule update. Archive. |
| `create-cron-jobs-from-definitions.js` | Run-once cron setup. Archive after run. |
| `build-elimination-list.js`, `build-elimination-list-backup.js` | Campaign-specific. Archive. |
| `build-72hr-mirror.js`, `build-72hr-mirror-openpyxl.py` | Campaign-specific. Archive. |
| `build-free-preview.js` | Campaign-specific. Archive. |
| `build-printable-sheets.js` | Campaign-specific. Archive. |
| `build-forge-banner-v3.py`, `build-forge-linkedin-banner.py` | Campaign-specific. Archive. |
| `build-linkedin-banner-v2.py`, `build-linkedin-banner.py` | Campaign-specific. Archive. |
| `build-forge-banner-v3.py` | Campaign-specific. Archive. |
| `build-product-thumbnail.py` | Campaign-specific. Archive. |
| `build-quickstart-html.js` | One-off. Archive. |
| `export-forge-post-card.js` | One-off. Archive. |
| `convert-dod-to-pdf.sh` | One-off conversion. Archive. |
| `convert-free-products.sh` | One-off conversion. Archive. |
| `fix-pdfs.sh` | One-off fix. Archive. |
| `generate-guide-pdf.js` | One-off PDF generation. Archive after PDF is confirmed good. |
| `generate-x-thread-script.js` | One-off thread generator. Archive. |
| `launch-guide.js` | One-off launch. Archive. |
| `resize-graphics.sh` | One-off resize. Archive. |
| `create-visuals.sh` | One-off visual creation. Archive. |
| `google-credentials.json` | NOT a script. Credentials file. Verify this is excluded from git and not leaking secrets. |

---

## Immediate Action Items

1. **`google-credentials.json`**: Verify this file is in `.gitignore` and does not contain live credentials. If it does, remove from version history.
2. **Bucket A scripts**: Any future queue mutation should use `forge_ops queue` commands instead of these scripts. Mark scripts with a `# DEPRECATED: use forge_ops` comment on next touch.
3. **Bucket C scripts**: Create a `scripts/archive/` directory. Move campaign-specific scripts there rather than deleting -- they have reference value.

---

## Archive Directory

When retiring Bucket C scripts, move them to:
```
data/workspace/scripts/archive/
```

Do not delete. Historical record is useful.
