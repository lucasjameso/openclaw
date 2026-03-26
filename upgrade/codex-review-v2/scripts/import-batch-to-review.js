#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const REVIEW_ROOT = '/Users/lucas/Forge/openclaw/data/workspace/review';
const RENDERED_BATCH_DIR = path.join(REPO_ROOT, 'templates/x-cards/rendered/batch-1');
const X_CARDS_REVIEW_DIR = path.join(REVIEW_ROOT, 'x-cards-batch-1');
const POST_COPY_DIR = path.join(REVIEW_ROOT, 'post-copy');

const X_CARD_BATCH = [
  ['chapter-1-zero-revenue-hook.html', 'Chapter 1: The Zero Revenue Hook Card', 'x-card'],
  ['chapter-2-overnight-sprint.html', 'Chapter 2: The Overnight Sprint Card', 'x-card'],
  ['chapter-3-model-mistake.html', 'Chapter 3: The $75/Day Model Mistake Card', 'x-card'],
  ['chapter-4-two-minute-rule.html', 'Chapter 4: The Two-Minute Rule Card', 'x-card'],
  ['chapter-5-speed-running-mediocrity.html', 'Chapter 5: Speed-Running Mediocrity Card', 'x-card'],
  ['chapter-6-duplicate-explosion.html', 'Chapter 6: The Duplicate Explosion Card', 'x-card'],
  ['chapter-7-agent-assigned-homework.html', 'Chapter 7: Agent Assigned Homework Card', 'x-card'],
  ['chapter-8-review-os.html', 'Chapter 8: The Review OS Card', 'x-card'],
  ['chapter-9-session-chaining.html', 'Chapter 9: Session Chaining Card', 'x-card'],
  ['chapter-10-build-your-own-mistakes.html', 'Chapter 10: Build Your Own Mistakes Card', 'x-card'],
  ['launch-announcement-hero.html', 'Launch Announcement Hero Visual', 'launch-asset'],
  ['mistake-guide-cover-v2.html', 'Mistake Guide Cover v2', 'launch-asset'],
  ['video-cover-midnight-confession.html', 'Video Cover: Midnight Confession', 'video-cover'],
  ['video-cover-75-day-dude.html', 'Video Cover: $75/Day Dude', 'video-cover'],
  ['video-cover-9-tasks-dude.html', 'Video Cover: 9 Tasks Dude', 'video-cover'],
  ['video-cover-homework-dude.html', 'Video Cover: Homework Dude', 'video-cover'],
  ['triple-threat-org-chart.html', 'Triple Threat Org Chart Card', 'x-card'],
  ['model-chain-loop.html', 'Model Chain Loop Card', 'x-card'],
  ['lucas-ai-experiment-crossover.html', 'Lucas AI Experiment Crossover Card', 'x-card'],
  ['mistake-guide-cover.html', 'Mistake Guide Cover v1', 'launch-asset'],
];

const POST_COPY_BATCH = [
  {
    filename: 'post-75-day-hook.md',
    body: `---
title: "X Post: $75/Day Hook (L-001, priority 95)"
type: post-copy
lesson_id: L-001
priority: 95
target_account: @Forge_Builds
launch_day: Day -22
pairs_with_card: chapter-3-model-mistake.html
status: pending_review
source: import-batch-to-review.js
---

Our AI agent was burning $75/day. We thought it was using the cheap model. It was not. Here is what happened.

[Thread]
1/ We set up DeepSeek as the primary model. Cost: roughly $1.60/day. Good.
2/ Silent fallback was still pointing at Anthropic Haiku. Cost: $75+/day. Not good.
3/ Nobody noticed for 48 hours because the output looked normal.
4/ Three-line config fix. Removed Anthropic from the available models list entirely.
5/ Cost dropped 47x overnight. $75 to $1.60.
If you cannot see which model is running, you cannot control what it costs.
`,
  },
  {
    filename: 'post-809-transparency.md',
    body: `---
title: "X Post: $809 Invested, $0 Revenue (L-006, priority 92)"
type: post-copy
lesson_id: L-006
priority: 92
target_account: @Forge_Builds
launch_day: Day -21
pairs_with_card: launch-announcement-hero.html
status: pending_review
source: import-batch-to-review.js
---

We have spent $809 building an autonomous AI agent. Revenue so far: $0. Here is the entire breakdown and why we are still going.

[Thread]
1/ Total invested: $809+. Monthly subscriptions alone: $311/mo. Daily operating cost: $1.60.
2/ Where the money went: API costs during the $75/day era, infrastructure, tools, subscriptions we needed to test before knowing which ones stayed.
3/ What $809 bought: a working review OS, a dedup pipeline, a content engine, 10 chapters of hard-won lessons, and an autonomous agent that actually runs.
4/ The $75/day to $1.60/day pivot saved the whole thing. That one config change cut costs 47x.
5/ ROI target: 90 days from March 23. We have 22 left.
6/ The $809 Mistake Guide ships April 17. Every lesson is in there. Every hard number. $19.
Transparency is the product until the product ships.
`,
  },
  {
    filename: 'post-triple-threat-forge-single.md',
    body: `---
title: "Forge Single: The Triple Threat"
type: post-copy
lesson_id: model-chain
priority: 91
target_account: @Forge_Builds
launch_day: Day -20
pairs_with_card: triple-threat-org-chart.html
status: pending_review
source: import-batch-to-review.js
---

Forge is not one AI.

It is one human with judgment, two models trying to outdo each other, and one autonomous agent generating fresh evidence.

That is not a workflow. That is a highly productive crime ring.
`,
  },
  {
    filename: 'post-model-chain-thread.md',
    body: `---
title: "Thread: The Model Chain Story (Day 4 follow-up)"
type: post-copy
lesson_id: model-chain
priority: 91
target_account: @Forge_Builds
launch_day: Day -18
pairs_with_card: model-chain-loop.html
status: pending_review
source: import-batch-to-review.js
---

We accidentally found a better way to work with AI:

not one model. not five models doing random things.

Two competing models. One shared file. One autonomous agent producing receipts. One human deciding what survives.

[Thread continues -- 6 posts explaining the shared-log loop]
`,
  },
  {
    filename: 'gumroad-listing-copy.md',
    body: `---
title: "Gumroad Listing: The $809 Mistake Guide"
type: gumroad-copy
priority: 99
target_account: @Forge_Builds
launch_day: Day -22
pairs_with_card: mistake-guide-cover-v2.html
status: pending_review
source: import-batch-to-review.js
---

The $809 Mistake Guide

Every painful lesson from building an autonomous AI agent. Real numbers. Real mistakes. No fluff.

[Full listing copy from Claude Round 2 entry above -- copy it in verbatim]
`,
  },
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function copyFile(sourcePath, targetPath) {
  fs.copyFileSync(sourcePath, targetPath);
}

function importXCards() {
  ensureDir(X_CARDS_REVIEW_DIR);
  const imported = [];

  for (const [filename, title, type] of X_CARD_BATCH) {
    const sourcePath = path.join(RENDERED_BATCH_DIR, filename);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Missing rendered batch file: ${sourcePath}`);
    }

    const slug = filename.replace(/\.html$/i, '');
    const targetDir = path.join(X_CARDS_REVIEW_DIR, slug);
    const targetPath = path.join(targetDir, filename);
    ensureDir(targetDir);
    copyFile(sourcePath, targetPath);
    writeJson(path.join(targetDir, 'metadata.json'), {
      title,
      type,
      source: sourcePath,
      imported_by: 'scripts/import-batch-to-review.js',
      imported_at: new Date().toISOString(),
      status: 'pending_review',
      review_bucket: 'x-cards-batch-1',
    });
    imported.push({ slug, filename, targetDir });
  }

  return imported;
}

function importPostCopy() {
  ensureDir(POST_COPY_DIR);
  const created = [];
  const skipped = [];

  for (const item of POST_COPY_BATCH) {
    const targetPath = path.join(POST_COPY_DIR, item.filename);
    if (fs.existsSync(targetPath)) {
      skipped.push(item.filename);
      continue;
    }
    fs.writeFileSync(targetPath, item.body.trim() + '\n', 'utf8');
    created.push(item.filename);
  }

  return { created, skipped };
}

function main() {
  const xCards = importXCards();
  const postCopy = importPostCopy();

  console.log(JSON.stringify({
    imported_x_cards: xCards.length,
    x_card_folders: xCards.map((item) => item.slug),
    post_copy_created: postCopy.created,
    post_copy_preserved: postCopy.skipped,
  }, null, 2));
}

main();
