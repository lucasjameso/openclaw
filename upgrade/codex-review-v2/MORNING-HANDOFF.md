# Morning Handoff

## Ready Now

### Dashboard / Product Surfaces

- Command deck is live and visually upgraded
- Review OS is live with motion polish
- Broadcast is live with real X ingestion/fallback
- Story page is live
- Mobile story page exists at `/story-mobile`
- Launchpad exists at `/launchpad`
- Video Lab exists at `/video-lab`

### Highest-Signal Launch Assets

- Launch announcement hero:
  - `templates/x-cards/rendered/batch-1/launch-announcement-hero.html`
- Mistake Guide cover v2:
  - `templates/x-cards/rendered/batch-1/mistake-guide-cover-v2.html`
- Midnight confession video cover:
  - `templates/x-cards/rendered/batch-1/video-cover-midnight-confession.html`
- Best existing short-form covers:
  - `templates/x-cards/rendered/batch-1/video-cover-75-day-dude.html`
  - `templates/x-cards/rendered/batch-1/video-cover-9-tasks-dude.html`
  - `templates/x-cards/rendered/batch-1/video-cover-homework-dude.html`

### Mistake Guide Chapter Cards

Core chapter-card run is now covered 1 through 10:

- `templates/x-cards/rendered/batch-1/chapter-1-zero-revenue-hook.html`
- `templates/x-cards/rendered/batch-1/chapter-2-overnight-sprint.html`
- `templates/x-cards/rendered/batch-1/chapter-3-model-mistake.html`
- `templates/x-cards/rendered/batch-1/chapter-4-two-minute-rule.html`
- `templates/x-cards/rendered/batch-1/chapter-5-speed-running-mediocrity.html`
- `templates/x-cards/rendered/batch-1/chapter-6-duplicate-explosion.html`
- `templates/x-cards/rendered/batch-1/chapter-7-agent-assigned-homework.html`
- `templates/x-cards/rendered/batch-1/chapter-8-review-os.html`
- `templates/x-cards/rendered/batch-1/chapter-9-session-chaining.html`
- `templates/x-cards/rendered/batch-1/chapter-10-build-your-own-mistakes.html`

## Immediate Decisions For Lucas

1. Pick the morning launch stack:
   - one Guide cover
   - one launch hero
   - one midnight/funny video cover

2. Pick the top 3 chapter cards to approve first:
   - recommended candidates:
   - Chapter 3: `$75/day`
   - Chapter 5: `Speed-Running Mediocrity`
   - Chapter 7: `Assigned The Human Homework`

3. Decide whether the first public push is:
   - Guide launch
   - dashboard transformation post
   - funny Forge lore post

## Highest-Leverage Next Build Steps

### Claude

1. Finish the two remaining HeyGen renders and pair them with the right covers
2. Choose the strongest 3 chapter cards for approval priority
3. Decide whether `mistake-guide-cover-v2.html` is final or needs one nastier revision
4. Pick the exact first launch post copy that deserves the hero visual
5. If using Remotion today, confirm whether Codex should scaffold in `/Users/lucas/Forge/forge-videos/`

### Codex

1. If approved, scaffold the first Remotion composition in `/Users/lucas/Forge/forge-videos/`
2. If not, keep polishing Launchpad / Video Lab and companion launch visuals
3. If `puppeteer` gets installed, finish `scripts/capture-dashboard.js` end-to-end and output a real MP4

## Infrastructure / Tooling Status

- `scripts/check-embedded-scripts.js` is in place and should stay in deploy flow
- `scripts/predeploy-check.js` now prints a manual nav check reminder at `1200px`
- `scripts/capture-dashboard.js` exists but needs `puppeteer` installed before it can run end-to-end
- `ffmpeg` is available in the environment
- Remotion is installed at `/Users/lucas/Forge/forge-videos/`

## Recommendation

Do not start with more new ideas first thing.

Start by:
1. approving the best assets
2. publishing one strong post
3. shipping the Guide cover + listing
4. turning the motion work into one finished video lane
