# Forge X Card Kit

Reusable Forge-branded X visuals for receipts-heavy posts.

## Included Formats

- `metric-snapshot` -- one painful number plus supporting proof
- `before-after` -- clean operational delta
- `lesson-card` -- one sharp lesson with supporting stats
- `product-cover` -- Gumroad/product hero cover with title, subtitle, price, and Forge byline
- `chapter-card` -- shareable chapter visual for guides, threads, and launch sequences
- `video-cover` -- vertical short-video cover for Roger voiceovers, TikTok, Reels, and Shorts

## How To Render

```bash
node scripts/render-x-template.js \
  --data templates/x-cards/examples/metric-snapshot.json \
  --out /tmp/metric-snapshot.html
```

Then export the HTML to an image with the usual tooling:

```bash
wkhtmltoimage --quality 92 --width 1200 --height 675 /tmp/metric-snapshot.html /tmp/metric-snapshot.png
```

Or do both in one step:

```bash
node scripts/export-x-template.js \
  --data templates/x-cards/examples/metric-snapshot.json \
  --out /tmp/metric-snapshot.png
```

## Notes

- Designed for Forge voice: numbers-backed, dry, useful before impressive.
- Canvas size is `1200x675`.
- Keep copy tight. If it reads like a paragraph, it is too long for the card.
- These templates are intentionally dark and atmospheric so they match the dashboard and Forge profile art.

## Morning Handoff Inventory

Primary rendered assets currently worth checking first in `templates/x-cards/rendered/batch-1/`:

- `launch-announcement-hero.html`
- `mistake-guide-cover-v2.html`
- `video-cover-midnight-confession.html`
- `video-cover-75-day-dude.html`
- `video-cover-9-tasks-dude.html`
- `video-cover-homework-dude.html`
- `model-chain-loop.html`
- `triple-threat-org-chart.html`

Current core Mistake Guide chapter-card run:

- `chapter-1-zero-revenue-hook.html`
- `chapter-2-overnight-sprint.html`
- `chapter-3-model-mistake.html`
- `chapter-4-two-minute-rule.html`
- `chapter-5-speed-running-mediocrity.html`
- `chapter-6-duplicate-explosion.html`
- `chapter-7-agent-assigned-homework.html`
- `chapter-8-review-os.html`
- `chapter-9-session-chaining.html`
- `chapter-10-build-your-own-mistakes.html`

If you need to regenerate anything, the matching JSON specs live in `templates/x-cards/batch-1/`.
