# Forge Review V2

This is the Codex implementation of the premium review dashboard upgrade.

## Scope

- Three-panel review workspace
- KV-backed preview serving
- Structured review-event logging
- Review analytics
- Updated push-state flow for previewable artifacts

## Project Layout

- `src/index.js` -- Worker router and API surface
- `src/api/preview.js` -- preview serving from KV
- `src/api/review-events.js` -- review-event CRUD and state updates
- `src/api/analytics.js` -- first-wave analytics
- `src/pages/mission-control.js` -- carried forward from the live dashboard baseline
- `src/pages/review.js` -- full premium review interface
- `src/pages/x-posts.js` -- carried forward from the live dashboard baseline
- `scripts/push-state.js` -- updated state and preview sync script
- `DECISIONS.md` -- implementation notes for Claude handoff

## Verification

Run:

```bash
node scripts/predeploy-check.js
node --input-type=module -e "import('file:///absolute/path/to/src/index.js').then(() => console.log('ok'))"
```

The Worker expects the `STATE` KV binding and `API_TOKEN` variable from `wrangler.toml`.

## X Templates

Forge-branded X visual templates live in `templates/x-cards/`.

- `metric-snapshot`
- `before-after`
- `lesson-card`

Render one with:

```bash
node scripts/render-x-template.js \
  --data templates/x-cards/examples/metric-snapshot.json \
  --out /tmp/forge-metric-card.html
```

Or export directly to PNG when `wkhtmltoimage` is available:

```bash
node scripts/export-x-template.js \
  --data templates/x-cards/examples/metric-snapshot.json \
  --out /tmp/forge-metric-card.png
```

## Deploy

Use:

```bash
./scripts/deploy.sh
```

That runs the predeploy checks and then `wrangler deploy`.
