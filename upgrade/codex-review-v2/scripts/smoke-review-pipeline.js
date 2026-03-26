#!/usr/bin/env node

'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const REVIEW_RELATIVE_DIR = path.join('smoke');
const MARKDOWN_FILE = 'review-pipeline-smoke.md';
const HTML_FILE = 'review-pipeline-smoke.html';
const MARKDOWN_RELATIVE_PATH = path.join(REVIEW_RELATIVE_DIR, MARKDOWN_FILE);
const HTML_RELATIVE_PATH = path.join(REVIEW_RELATIVE_DIR, HTML_FILE);
const STATE_OUT_RELATIVE_PATH = path.join('data', 'review-pipeline-state.json');
const VALIDATION_REPORT_RELATIVE_PATH = path.join('data', 'render-validation-report.json');

const MARKDOWN_CONTENT = [
  '---',
  'title: Review Pipeline Smoke Check',
  'type: post-copy',
  'priority: 95',
  'target_account: "@Forge_Builds"',
  '---',
  '# Review Pipeline Smoke Check',
  '',
  '## Forge Single',
  'Forge is ready for a real pipeline smoke test, so this draft is intentionally long enough to verify that markdown survives rendering, validation, deduplication, and review-state generation without losing context or classification.',
  '',
  'The body includes enough natural language to clear the validator threshold while still looking like an actual review item Lucas might approve inside the queue.',
  '',
  '## Suggested CTA',
  'Reply with the cleanest next move, call out the proof, and keep the instruction direct so the review interface can still classify this as post-copy after the html sibling wins dedup.',
  '',
  '## Note',
  'This file exists only for the review pipeline smoke test and should be deleted automatically after the assertions pass.',
  '',
].join('\n');

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function buildSmokeEnv(workspace) {
  return {
    ...process.env,
    OPENCLAW_WORKSPACE: workspace,
    DASHBOARD_API_URL: '',
    DASHBOARD_API_TOKEN: '',
    DEEPSEEK_API_KEY: '',
    FORGE_X_API_KEY: '',
    FORGE_X_API_SECRET: '',
    FORGE_X_ACCESS_TOKEN: '',
    FORGE_X_ACCESS_SECRET: '',
    X_API_KEY: '',
    X_API_SECRET: '',
    X_ACCESS_TOKEN: '',
    X_ACCESS_SECRET: '',
  };
}

function runNodeScript(workspace, scriptName, args, label) {
  console.log(`[smoke-review-pipeline] ${label}`);

  const result = spawnSync(process.execPath, [path.join(__dirname, scriptName), ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    env: buildSmokeEnv(workspace),
  });

  const stdout = String(result.stdout || '').trim();
  const stderr = String(result.stderr || '').trim();

  if (stdout) {
    console.log(stdout);
  }

  if (stderr) {
    console.error(stderr);
  }

  if (result.error) {
    throw new Error(`${label} failed to execute: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
}

function createWorkspace() {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-review-pipeline-'));
  fs.mkdirSync(path.join(workspace, 'review', REVIEW_RELATIVE_DIR), { recursive: true });
  fs.mkdirSync(path.join(workspace, 'data'), { recursive: true });
  writeJson(path.join(workspace, 'QUEUE.json'), { tasks: [] });
  writeJson(path.join(workspace, 'data', 'session-log.json'), { sessions: [] });
  writeJson(path.join(workspace, 'data', 'tweet-drafts.json'), { drafts: [] });
  fs.writeFileSync(path.join(workspace, 'review', MARKDOWN_RELATIVE_PATH), MARKDOWN_CONTENT, 'utf8');
  return workspace;
}

function assertValidationReport(workspace) {
  const reportPath = path.join(workspace, VALIDATION_REPORT_RELATIVE_PATH);
  assert.ok(fs.existsSync(reportPath), 'render validation report missing');

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  assert.strictEqual(report.summary.blank, 0, 'validator reported blank rendered HTML');
  assert.strictEqual(report.summary.unknownTypes, 0, 'validator reported unknown review type');
  assert.ok(report.summary.ok >= 1, 'validator did not report any successful HTML files');
}

function assertStateShape(workspace) {
  const stateOutPath = path.join(workspace, STATE_OUT_RELATIVE_PATH);
  assert.ok(fs.existsSync(stateOutPath), 'push-state did not write a state output file');

  const payload = JSON.parse(fs.readFileSync(stateOutPath, 'utf8'));
  const reviews = payload && payload.state && payload.state.reviews;
  assert.ok(reviews, 'review state missing from push-state output');
  assert.ok(reviews.stats.family_collapsed >= 1, 'expected markdown/html family dedup to collapse at least one variant');

  const item = reviews.items.find((entry) => entry.path === HTML_RELATIVE_PATH);
  assert.ok(item, 'deduped html review item not found');
  assert.strictEqual(item.type, 'html', 'deduped review item should keep the html sibling');
  assert.strictEqual(item.review_content_type, 'post-copy', 'review_content_type should survive markdown dedup');
  assert.strictEqual(item.preview_type, 'iframe', 'html review preview should remain iframe-based');
  assert.strictEqual(item.previewable, true, 'html review item should stay previewable');
  assert.strictEqual(item.preview_url, `/api/preview/${encodeURIComponent(HTML_RELATIVE_PATH)}`, 'preview url should target the html sibling');
  assert.ok(Array.isArray(item.variant_paths) && item.variant_paths.includes(MARKDOWN_RELATIVE_PATH), 'html review item should retain the markdown variant path');
  assert.ok(Array.isArray(item.variant_types) && item.variant_types.includes('md'), 'html review item should retain the markdown variant type');

  assert.ok(item.metadata && item.metadata.__frontmatter__, 'frontmatter metadata missing from deduped html item');
  assert.ok(item.metadata && item.metadata.__markdown_body__, 'markdown body missing from deduped html item');
  assert.strictEqual(item.metadata.__frontmatter__.content.title, 'Review Pipeline Smoke Check', 'frontmatter title missing from deduped html item');
  assert.strictEqual(item.metadata.__frontmatter__.content.type, 'post-copy', 'frontmatter type missing from deduped html item');
  assert.ok(
    String(item.metadata.__markdown_body__.content || '').includes('Suggested CTA'),
    'markdown body content missing from deduped html item'
  );

  const mirroredMetadata = reviews.metadata && reviews.metadata[item.id];
  assert.ok(mirroredMetadata, 'reviews.metadata mirror missing for deduped html item');
  assert.strictEqual(mirroredMetadata.__frontmatter__.content.type, 'post-copy', 'mirrored frontmatter type missing');
}

function main() {
  let workspace = null;

  try {
    workspace = createWorkspace();
    const htmlPath = path.join(workspace, 'review', HTML_RELATIVE_PATH);

    runNodeScript(workspace, 'render-review-to-html.js', [], 'render review markdown');
    assert.ok(fs.existsSync(htmlPath), 'renderer did not create the html sibling');

    runNodeScript(workspace, 'validate-review-html.js', [], 'validate rendered review html');
    assertValidationReport(workspace);

    runNodeScript(
      workspace,
      'push-state.js',
      ['--dry-run', '--state-out', path.join(workspace, STATE_OUT_RELATIVE_PATH)],
      'build review state in dry-run mode'
    );
    assertStateShape(workspace);

    console.log('[smoke-review-pipeline] ok');
  } catch (error) {
    console.error(`[smoke-review-pipeline] fail: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (workspace) {
      fs.rmSync(workspace, { recursive: true, force: true });
    }
  }
}

main();
