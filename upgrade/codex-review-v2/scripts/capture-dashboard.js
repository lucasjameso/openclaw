#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

function readArgs(argv) {
  const options = {};
  for (let index = 2; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key || !key.startsWith('--')) {
      continue;
    }

    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      options[key.slice(2)] = 'true';
      continue;
    }

    options[key.slice(2)] = next;
    index += 1;
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

function safeBoolean(value, fallback = false) {
  if (typeof value === 'undefined') {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'y'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no', 'n'].includes(normalized)) {
    return false;
  }

  return fallback;
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

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function resolvePageUrl(baseUrl, target) {
  if (!target) {
    return baseUrl + '/';
  }

  if (/^https?:\/\//i.test(target)) {
    return target;
  }

  const normalized = String(target).startsWith('/') ? String(target) : `/${target}`;
  return baseUrl + normalized;
}

function runFfmpeg(args, failureMessage) {
  const ffmpegCheck = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' });
  if (ffmpegCheck.error && ffmpegCheck.error.code === 'ENOENT') {
    fail('ffmpeg is not installed in this environment.');
  }

  const ffmpegRun = spawnSync('ffmpeg', args, {
    cwd: ROOT,
    encoding: 'utf8',
  });

  if (ffmpegRun.status !== 0) {
    fail((ffmpegRun.stderr || ffmpegRun.stdout || failureMessage).trim());
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

async function openBrowser(width, height) {
  const puppeteer = await loadPuppeteer();
  return puppeteer.launch({
    headless: 'new',
    defaultViewport: { width, height, deviceScaleFactor: 1 },
  });
}

async function captureSingle(options) {
  const baseUrl = String(options.base || 'https://forge-dashboard.lucasjamesoliver1.workers.dev').replace(/\/$/, '');
  const width = safeNumber(options.width, 1440);
  const height = safeNumber(options.height, 1024);
  const waitMs = safeNumber(options.wait, 1000);
  const fullPage = safeBoolean(options.fullPage, false);
  const targetUrl = resolvePageUrl(baseUrl, options.url);
  const outPath = path.resolve(options.out || path.join(ROOT, 'artifacts', 'dashboard-capture.png'));

  ensureDir(path.dirname(outPath));
  const browser = await openBrowser(width, height);

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(45000);
  page.setDefaultTimeout(30000);

  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    await sleep(waitMs);
    await page.screenshot({
      path: outPath,
      type: 'png',
      fullPage,
      captureBeyondViewport: fullPage,
    });
  } finally {
    await browser.close();
  }

  console.log(`ok: wrote ${outPath}`);
}

async function captureTour(options) {
  const baseUrl = String(options.base || 'https://forge-dashboard.lucasjamesoliver1.workers.dev').replace(/\/$/, '');
  const outDir = path.resolve(options.out || path.join(ROOT, 'artifacts', 'dashboard-capture'));
  const framesDir = path.join(outDir, 'frames');
  const shotsDir = path.join(outDir, 'shots');
  const outVideo = path.join(outDir, 'dashboard-tour.mp4');
  const outSheet = path.join(outDir, 'contact-sheet.png');
  const width = safeNumber(options.width, 1440);
  const height = safeNumber(options.height, 1024);
  const pauseMs = safeNumber(options.pause, 5000);
  const frameIntervalMs = safeNumber(options.interval, 500);
  const fps = safeNumber(options.fps, Math.max(1, Math.round(1000 / frameIntervalMs)));
  const waitMs = safeNumber(options.wait, 1000);
  const routes = String(options.routes || '/,/review,/x-posts,/story,/launchpad,/video-lab')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  ensureDir(framesDir);
  ensureDir(shotsDir);

  const browser = await openBrowser(width, height);
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(45000);
  page.setDefaultTimeout(30000);

  const steps = routes.map((route, index) => {
    const slug = route === '/' ? 'command' : route.replace(/^\/+/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || `step-${index + 1}`;
    return {
      slug,
      url: resolvePageUrl(baseUrl, route),
    };
  });

  const manifest = [];
  const sequence = { count: 0 };

  try {
    for (const step of steps) {
      await page.goto(step.url, { waitUntil: 'networkidle2' });
      await sleep(waitMs);
      await page.screenshot({
        path: path.join(shotsDir, `${step.slug}.png`),
        type: 'png',
        fullPage: false,
        captureBeyondViewport: false,
      });
      await captureFrames(page, framesDir, sequence, { pauseMs, frameIntervalMs });
      manifest.push({
        step: step.slug,
        url: step.url,
        screenshot: path.join(shotsDir, `${step.slug}.png`),
        framesCaptured: Math.max(1, Math.round(pauseMs / frameIntervalMs)),
      });
    }
  } finally {
    await browser.close();
  }

  runFfmpeg([
    '-y',
    '-framerate', String(fps),
    '-i', path.join(framesDir, '%05d.png'),
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outVideo,
  ], 'ffmpeg failed to stitch dashboard frames');

  runFfmpeg([
    '-y',
    '-pattern_type', 'glob',
    '-i', path.join(shotsDir, '*.png'),
    '-filter_complex', 'scale=720:-1:force_original_aspect_ratio=decrease,pad=720:512:(ow-iw)/2:(oh-ih)/2:color=#050814,tile=2x3',
    '-frames:v', '1',
    outSheet,
  ], 'ffmpeg failed to build dashboard contact sheet');

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
        contactSheet: outSheet,
        steps: manifest,
      },
      null,
      2
    ) + '\n'
  );

  console.log('ok: wrote ' + outVideo);
  console.log('ok: wrote ' + outSheet);
}

async function main() {
  const options = readArgs(process.argv);
  const mode = String(options.mode || (options.video || options.tour ? 'tour' : 'single')).toLowerCase();

  if (mode === 'single') {
    await captureSingle(options);
    return;
  }

  if (mode === 'tour') {
    await captureTour(options);
    return;
  }

  fail(`Unsupported mode: ${mode}. Use --mode single or --mode tour.`);
}

main().catch((error) => {
  fail(error && error.stack ? error.stack : String(error));
});
