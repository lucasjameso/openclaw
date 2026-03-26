#!/usr/bin/env node

'use strict';

const path = require('path');
const { pathToFileURL } = require('url');

const PAGE_FILES = [
  'src/pages/launchpad.js',
  'src/pages/mission-control.js',
  'src/pages/review.js',
  'src/pages/story-mobile.js',
  'src/pages/story.js',
  'src/pages/video-lab.js',
  'src/pages/x-posts.js',
];

function extractScripts(html) {
  const scripts = [];
  const pattern = /<script>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    scripts.push(match[1]);
  }
  return scripts;
}

async function main() {
  const root = path.resolve(__dirname, '..');

  for (const relativePath of PAGE_FILES) {
    const absolutePath = path.join(root, relativePath);
    const module = await import(pathToFileURL(absolutePath).href);
    const html = module && typeof module.default === 'string' ? module.default : '';
    if (!html) {
      throw new Error(`${relativePath} did not export an HTML string.`);
    }

    const scripts = extractScripts(html);
    if (!scripts.length) {
      throw new Error(`${relativePath} does not contain an embedded <script> block.`);
    }

    scripts.forEach((scriptSource, index) => {
      try {
        new Function(scriptSource);
      } catch (error) {
        throw new Error(`${relativePath} script #${index + 1} failed browser parse: ${error.message}`);
      }
    });
  }

  console.log(`ok: checked ${PAGE_FILES.length} page files`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
