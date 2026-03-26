#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const renderScript = path.join(ROOT, 'scripts/render-x-template.js');

function readArgs(argv) {
  const options = {};
  for (let index = 2; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key || !key.startsWith('--') || typeof value === 'undefined') {
      continue;
    }
    options[key.slice(2)] = value;
  }
  return options;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const options = readArgs(process.argv);
const dataPath = options.data ? path.resolve(options.data) : '';
const outPath = options.out ? path.resolve(options.out) : '';

if (!dataPath || !outPath) {
  fail('Usage: node scripts/export-x-template.js --data path/to/input.json --out path/to/output.png');
}

const htmlPath = outPath.replace(/\.(png|jpg|jpeg|webp)$/i, '') + '.html';
fs.mkdirSync(path.dirname(outPath), { recursive: true });

let result = spawnSync('node', [renderScript, '--data', dataPath, '--out', htmlPath], {
  cwd: ROOT,
  encoding: 'utf8',
});

if (result.status !== 0) {
  fail((result.stderr || result.stdout || 'Failed to render template HTML').trim());
}

result = spawnSync('wkhtmltoimage', ['--quality', '92', '--width', '1200', '--height', '675', htmlPath, outPath], {
  cwd: ROOT,
  encoding: 'utf8',
});

if (result.error && result.error.code === 'ENOENT') {
  fail('wkhtmltoimage is not installed in this environment.');
}

if (result.status !== 0) {
  fail((result.stderr || result.stdout || 'Failed to export template image').trim());
}

console.log(`ok: exported ${outPath}`);
