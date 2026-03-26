#!/usr/bin/env node

'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const STEPS = [
  {
    name: 'render',
    label: 'Render markdown review artifacts',
    script: 'render-review-to-html.js',
    exitCode: 1,
  },
  {
    name: 'validate',
    label: 'Validate rendered review HTML',
    script: 'validate-review-html.js',
    exitCode: 2,
  },
  {
    name: 'push',
    label: 'Push review state',
    script: 'push-state.js',
    exitCode: 3,
  },
];

function runStep(step) {
  const scriptPath = path.join(__dirname, step.script);
  console.log(`[review-pipeline] ${step.label}`);

  const result = spawnSync(process.execPath, [scriptPath], {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    console.error(`[review-pipeline] ${step.name} failed to execute: ${result.error.message}`);
    process.exit(step.exitCode);
  }

  if (result.status !== 0) {
    console.error(`[review-pipeline] ${step.name} failed with exit code ${result.status}`);
    process.exit(step.exitCode);
  }
}

function main() {
  for (const step of STEPS) {
    runStep(step);
  }

  console.log('[review-pipeline] complete');
}

main();
