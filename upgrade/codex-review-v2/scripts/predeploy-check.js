#!/usr/bin/env node

'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

const CHECKS = [
  {
    label: 'Worker syntax',
    command: 'node',
    args: ['--check', path.join(ROOT, 'src/index.js')],
  },
  {
    label: 'Push-state syntax',
    command: 'node',
    args: ['--check', path.join(ROOT, 'scripts/push-state.js')],
  },
  {
    label: 'Embedded browser scripts',
    command: 'node',
    args: [path.join(ROOT, 'scripts/check-embedded-scripts.js')],
  },
  {
    label: 'Import smoke test',
    command: 'node',
    args: ['--input-type=module', '-e', "import('file://' + process.cwd() + '/src/index.js').then(() => console.log('ok'))"],
  },
];

for (const check of CHECKS) {
  const result = spawnSync(check.command, check.args, {
    cwd: ROOT,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    const stderr = (result.stderr || '').trim();
    const stdout = (result.stdout || '').trim();
    const details = stderr || stdout || 'Unknown failure';
    console.error(`[fail] ${check.label}`);
    console.error(details);
    process.exit(result.status || 1);
  }

  console.log(`[ok] ${check.label}`);
}

console.log('[manual] Verify cockpit nav at 1200px width on Command, Review, Broadcast, Story, and Launch before deploying.');
