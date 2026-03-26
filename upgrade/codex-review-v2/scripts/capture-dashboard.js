#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

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

function safeNumber(value, fallback) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadPuppeteer() {
  try {
    return require('puppeteer');
  } catch (error) {
    fail(
      'puppeteer is not installed for this workspace.\n' +
      'Install it with: npm install puppeteer\n' +
      'Then run this script again.'
    );
  }
}

async function captureFrames(page, framesDir, sequence, options) {
  const framesPerStep = Math.max(1, Math.round(options.pauseMs / options.frameIntervalMs));
  for (let frameIndex = 0; frameIndex < framesPerStep; frameIndex += 1) {
    const frameName = String(sequence.count).padStart(5, '0') + '.png';
    const framePath = path.join(framesDir, frameName);
    await page.screenshot({
      path: framePath,
      type: 'png',
      fullPage: false,
      captureBeyondViewport: false,
    });
    sequence.count += 1;
    await sleep(options.frameIntervalMs);
  }
}

async function main() {
  const options = readArgs(process.argv);
  const baseUrl = String(options.url || 'https://forge-dashboard.lucasjamesoliver1.workers.dev').replace(/\/$/, '');
  const outDir = path.resolve(options.out || path.join(ROOT, 'artifacts/dashboard-capture'));
  const framesDir = path.join(outDir, 'frames');
  const outVideo = path.join(outDir, 'dashboard-tour.mp4');
  const width = safeNumber(options.width, 1440);
  const height = safeNumber(options.height, 1024);
  const pauseMs = safeNumber(options.pause, 5000);
  const frameIntervalMs = safeNumber(options.interval, 500);
  const fps = safeNumber(options.fps, Math.max(1, Math.round(1000 / frameIntervalMs)));

  fs.mkdirSync(framesDir, { recursive: true });

  const ffmpegCheck = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' });
  if (ffmpegCheck.error && ffmpegCheck.error.code === 'ENOENT') {
    fail('ffmpeg is not installed in this environment.');
  }

  const puppeteer = await loadPuppeteer();
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width, height, deviceScaleFactor: 1 },
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(45000);
  page.setDefaultTimeout(30000);

  const steps = [
    { slug: 'command', url: baseUrl + '/' },
    { slug: 'review', url: baseUrl + '/review' },
    { slug: 'broadcast', url: baseUrl + '/x-posts' },
    { slug: 'story', url: baseUrl + '/story' },
  ];

  const manifest = [];
  const sequence = { count: 0 };

  try {
    for (const step of steps) {
      await page.goto(step.url, { waitUntil: 'networkidle2' });
      await sleep(1000);
      await captureFrames(page, framesDir, sequence, { pauseMs, frameIntervalMs });
      manifest.push({
        step: step.slug,
        url: step.url,
        framesCaptured: Math.max(1, Math.round(pauseMs / frameIntervalMs)),
      });
    }
  } finally {
    await browser.close();
  }

  const ffmpegArgs = [
    '-y',
    '-framerate', String(fps),
    '-i', path.join(framesDir, '%05d.png'),
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outVideo,
  ];

  const ffmpegRun = spawnSync('ffmpeg', ffmpegArgs, {
    cwd: ROOT,
    encoding: 'utf8',
  });

  if (ffmpegRun.status !== 0) {
    fail((ffmpegRun.stderr || ffmpegRun.stdout || 'ffmpeg failed to stitch dashboard frames').trim());
  }

  fs.writeFileSync(
    path.join(outDir, 'manifest.json'),
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        baseUrl,
        width,
        height,
        pauseMs,
        frameIntervalMs,
        fps,
        framesDir,
        outVideo,
        steps: manifest,
      },
      null,
      2
    ) + '\n'
  );

  console.log('ok: wrote ' + outVideo);
}

main().catch((error) => {
  fail(error && error.stack ? error.stack : String(error));
});
