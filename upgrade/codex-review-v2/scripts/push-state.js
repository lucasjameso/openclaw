#!/usr/bin/env node

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { spawnSync } = require('child_process');

let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  try {
    sharp = require('/app/node_modules/sharp');
  } catch (fallbackError) {
    sharp = null;
  }
}

const DERIVATIVE_MAX_WIDTH = 1400;
const DERIVATIVE_JPEG_QUALITY = 82;

const DASHBOARD_API_URL = process.env.DASHBOARD_API_URL;
const DASHBOARD_API_TOKEN = process.env.DASHBOARD_API_TOKEN;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const FORGE_MODEL = process.env.FORGE_MODEL || 'deepseek-chat';
const WORKSPACE = process.env.OPENCLAW_WORKSPACE || '/home/node/.openclaw/workspace';

const PATHS = {
  queue: path.join(WORKSPACE, 'QUEUE.json'),
  sessions: path.join(WORKSPACE, 'data/session-log.json'),
  tweetDrafts: path.join(WORKSPACE, 'data/tweet-drafts.json'),
  postedLog: path.join(WORKSPACE, 'content/x/posted-log.md'),
  reviewDir: path.join(WORKSPACE, 'review'),
  previewHashes: path.join(WORKSPACE, 'data/preview-hashes.json'),
};

const INLINE_IMAGE_MAX_BYTES = 400000;
const PDF_MAX_BYTES = 2000000;
const HTML_MAX_BYTES = 500000;
const DIRECT_EMBED_MAX_BYTES = 24 * 1024 * 1024;
const REVIEWABLE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.pdf', '.html']);
const METADATA_EXTENSIONS = new Set(['.md', '.json', '.txt', '.log']);
const COLLAPSIBLE_SUFFIXES = ['-optimized', '-compressed', '-social', '-v2', '-v3', '-fixed', '-final', '-draft'];
const FORMAT_PRIORITY = {
  pdf: 1,
  html: 2,
  png: 3,
  jpg: 4,
  jpeg: 4,
  webp: 5,
};

function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return fallback;
  }
}

function readTextFile(filePath, fallback = '') {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return fallback;
  }
}

function writeJsonFile(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function requestJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const request = https.request(url, options, (response) => {
      let raw = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        raw += chunk;
      });
      response.on('end', () => {
        let parsed = null;
        if (raw) {
          try {
            parsed = JSON.parse(raw);
          } catch (error) {
            parsed = raw;
          }
        }

        if ((response.statusCode || 500) >= 200 && (response.statusCode || 500) < 300) {
          resolve(parsed);
          return;
        }

        const error = new Error(typeof parsed === 'string' ? parsed : JSON.stringify(parsed || { error: 'Request failed' }));
        error.statusCode = response.statusCode || 500;
        reject(error);
      });
    });

    request.on('error', reject);
    if (body) {
      request.write(body);
    }
    request.end();
  });
}

function etDateKey(dateInput = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateInput));
}

function formatEtTime(dateInput) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date) + ' ET';
}

function relativeEtCountdown(targetDate) {
  const target = new Date(targetDate);
  if (Number.isNaN(target.getTime())) {
    return '--';
  }

  const diffMs = target.getTime() - Date.now();
  if (diffMs <= 0) {
    return 'now';
  }

  const minutes = Math.round(diffMs / 60000);
  if (minutes < 60) {
    return minutes + 'm';
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? hours + 'h ' + remainder + 'm' : hours + 'h';
}

function formatUptimeFromSessions(sessions) {
  const dates = sessions
    .map((entry) => new Date(entry.created_at || entry.started_at || entry.timestamp || 0))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => left - right);

  if (!dates.length) {
    return 'No data';
  }

  const diffDays = Math.max(0, Math.floor((Date.now() - dates[0].getTime()) / 86400000));
  return diffDays === 1 ? '1 day' : diffDays + ' days';
}

function humanFileSize(bytes) {
  if (!Number.isFinite(bytes)) {
    return '--';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1) + ' ' + units[unitIndex];
}

function sha256(content) {
  return `sha256:${crypto.createHash('sha256').update(content).digest('hex')}`;
}

function mimeTypeForExtension(extension) {
  switch (extension.toLowerCase()) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.pdf':
      return 'application/pdf';
    case '.html':
      return 'text/html; charset=utf-8';
    default:
      return 'application/octet-stream';
  }
}

function categoryForPath(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.includes('notebook')) return 'notebooklm';
  if (lower.includes('dashboard')) return 'dashboard';
  if (/\.(png|jpg|jpeg|webp)$/i.test(lower) || lower.includes('visual')) return 'visuals';
  return 'product';
}

function normalizedStemName(filename) {
  let stem = filename.toLowerCase().replace(/[_\s]+/g, '-');
  let changed = true;
  while (changed) {
    changed = false;
    for (const suffix of COLLAPSIBLE_SUFFIXES) {
      if (stem.endsWith(suffix)) {
        stem = stem.slice(0, -suffix.length);
        changed = true;
      }
    }
  }
  return stem.replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function formatPriority(type) {
  return FORMAT_PRIORITY[type] || 99;
}

function choosePrimaryCandidate(candidates) {
  return candidates.slice().sort((left, right) => {
    const formatDelta = formatPriority(left.type) - formatPriority(right.type);
    if (formatDelta !== 0) return formatDelta;
    const modifiedDelta = String(right.modified_at || '').localeCompare(String(left.modified_at || ''));
    if (modifiedDelta !== 0) return modifiedDelta;
    return String(left.path).localeCompare(String(right.path));
  })[0];
}

function appendUnique(list, values) {
  const next = Array.isArray(list) ? list.slice() : [];
  for (const value of values) {
    if (value && !next.includes(value)) {
      next.push(value);
    }
  }
  return next;
}

function mapTask(rawTask, index) {
  return {
    id: String(rawTask.id || rawTask.task_id || 'T-' + String(index + 1).padStart(3, '0')),
    title: rawTask.title || rawTask.name || rawTask.task || 'Untitled task',
    status: String(rawTask.status || rawTask.state || 'READY').toUpperCase(),
    priority: Number(rawTask.priority || rawTask.score || 0),
    notes: rawTask.notes || rawTask.description || rawTask.summary || '',
  };
}

function buildQueueState(queueJson) {
  const candidateTasks = Array.isArray(queueJson)
    ? queueJson
    : Array.isArray(queueJson.tasks)
      ? queueJson.tasks
      : Array.isArray(queueJson.queue)
        ? queueJson.queue
        : [];
  const tasks = candidateTasks.map(mapTask).sort((a, b) => b.priority - a.priority);
  return {
    tasks,
    stats: {
      ready: tasks.filter((task) => task.status === 'READY').length,
      done: tasks.filter((task) => task.status === 'DONE').length,
      blocked: tasks.filter((task) => task.status === 'BLOCKED').length,
    },
  };
}

function mapSession(rawSession, index) {
  return {
    session_id: rawSession.session_id || rawSession.id || 'session-' + String(index + 1).padStart(3, '0'),
    task_id: rawSession.task_id || rawSession.taskId || rawSession.queue_id || '--',
    outcome: rawSession.outcome || rawSession.status || 'UNKNOWN',
    duration_minutes: Number(rawSession.duration_minutes || rawSession.duration || rawSession.minutes || 0),
    notes: rawSession.notes || rawSession.summary || rawSession.result || 'No notes',
    created_at: rawSession.created_at || rawSession.started_at || rawSession.timestamp || null,
  };
}

function buildSessionsState(sessionJson) {
  const items = Array.isArray(sessionJson)
    ? sessionJson
    : Array.isArray(sessionJson.sessions)
      ? sessionJson.sessions
      : [];

  return items.map(mapSession).sort((a, b) => {
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });
}

function getCronSchedule() {
  const result = spawnSync('openclaw', ['cron', 'list', '--json'], {
    encoding: 'utf8',
    timeout: 20000,
  });

  if (result.error || result.status !== 0) {
    return [];
  }

  let parsed;
  try {
    parsed = JSON.parse(result.stdout);
  } catch (error) {
    return [];
  }

  const jobs = Array.isArray(parsed) ? parsed : Array.isArray(parsed.jobs) ? parsed.jobs : [];
  return jobs.map((job, index) => mapCronJob(job, index));
}

function mapCronJob(job, index) {
  const name = job.name || job.id || 'schedule-' + String(index + 1).padStart(2, '0');
  return {
    hour: inferHour(job),
    type: name.includes('manager') ? 'manager' : 'worker',
    name,
    status: inferScheduleStatus(job),
    nextRun: job.next_run || job.nextRun || null,
  };
}

function inferHour(job) {
  const candidate = job.hour ?? job.byhour ?? job.scheduleHour;
  if (Number.isFinite(candidate)) {
    return candidate;
  }

  const text = [job.name, job.schedule, job.cron].filter(Boolean).join(' ');
  const match = text.match(/(?:^|[^0-9])([01]?[0-9]|2[0-3])(?::|00\b)/);
  return match ? Number(match[1]) : 0;
}

function inferScheduleStatus(job) {
  const raw = String(job.status || '').toLowerCase();
  if (raw.includes('run') || raw.includes('current')) return 'current';
  if (raw.includes('complete') || raw.includes('success')) return 'completed';
  return 'upcoming';
}

function buildNextSession(schedule) {
  const upcoming = schedule
    .filter((entry) => entry.nextRun)
    .map((entry) => ({ name: entry.name, nextRun: entry.nextRun }))
    .sort((a, b) => new Date(a.nextRun) - new Date(b.nextRun))[0];

  if (!upcoming) {
    return { name: 'No session scheduled', in: '--' };
  }

  return {
    name: upcoming.name,
    in: relativeEtCountdown(upcoming.nextRun),
  };
}

function percentEncode(value) {
  return encodeURIComponent(String(value)).replace(/[!'()*]/g, (character) => '%' + character.charCodeAt(0).toString(16).toUpperCase());
}

function getXCredentials(account) {
  const isForge = account === 'forge';
  const credentials = isForge
    ? {
        consumerKey: process.env.FORGE_X_API_KEY,
        consumerSecret: process.env.FORGE_X_API_SECRET,
        token: process.env.FORGE_X_ACCESS_TOKEN,
        tokenSecret: process.env.FORGE_X_ACCESS_SECRET,
      }
    : {
        consumerKey: process.env.X_API_KEY,
        consumerSecret: process.env.X_API_SECRET,
        token: process.env.X_ACCESS_TOKEN,
        tokenSecret: process.env.X_ACCESS_SECRET,
      };

  if (!credentials.consumerKey || !credentials.consumerSecret || !credentials.token || !credentials.tokenSecret) {
    return null;
  }

  return credentials;
}

function signOAuthRequest(method, baseUrl, params, credentials) {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${percentEncode(key)}=${percentEncode(params[key])}`)
    .join('&');
  const baseString = `${method.toUpperCase()}&${percentEncode(baseUrl)}&${percentEncode(sortedParams)}`;
  const signingKey = `${percentEncode(credentials.consumerSecret)}&${percentEncode(credentials.tokenSecret)}`;
  return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
}

function buildOAuthHeader(method, baseUrl, queryParams, credentials) {
  const oauthParams = {
    oauth_consumer_key: credentials.consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: credentials.token,
    oauth_version: '1.0',
  };
  const signature = signOAuthRequest(method, baseUrl, { ...oauthParams, ...queryParams }, credentials);
  oauthParams.oauth_signature = signature;

  return 'OAuth ' + Object.keys(oauthParams)
    .sort()
    .map((key) => `${percentEncode(key)}="${percentEncode(oauthParams[key])}"`)
    .join(', ');
}

async function xApiGetJson(url, queryParams, credentials) {
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  return requestJson(fullUrl, {
    method: 'GET',
    headers: {
      Authorization: buildOAuthHeader('GET', url, queryParams, credentials),
    },
  });
}

function normalizeTweet(rawTweet, source) {
  if (!rawTweet) {
    return null;
  }

  const text = String(rawTweet.text || rawTweet.full_text || '').trim();
  const createdAt = rawTweet.created_at || rawTweet.createdAt || null;
  const tweetId = rawTweet.id || rawTweet.tweet_id || rawTweet.tweetId || null;

  return {
    text,
    time: createdAt ? formatEtTime(createdAt) : '--',
    chars: text.length,
    source,
    created_at: createdAt,
    tweet_id: tweetId,
  };
}

async function fetchRecentTweets(account) {
  const credentials = getXCredentials(account);
  if (!credentials) {
    return [];
  }

  try {
    const me = await xApiGetJson('https://api.twitter.com/2/users/me', {}, credentials);
    const userId = me && me.data && me.data.id;
    if (!userId) {
      return [];
    }

    const payload = await xApiGetJson(`https://api.twitter.com/2/users/${userId}/tweets`, {
      max_results: '10',
      'tweet.fields': 'created_at,text',
    }, credentials);

    const tweets = Array.isArray(payload && payload.data) ? payload.data : [];
    return tweets
      .map((tweet) => normalizeTweet(tweet, 'x_api'))
      .filter(Boolean)
      .sort((left, right) => new Date(right.created_at || 0).getTime() - new Date(left.created_at || 0).getTime());
  } catch (error) {
    return [];
  }
}

function parsePostedLogTimestamp(rawValue) {
  const cleaned = String(rawValue || '').replace(/~/g, '').trim();
  const match = cleaned.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2})$/);
  if (!match) {
    return null;
  }

  const iso = new Date(`${match[1]}T${match[2]}:00Z`);
  return Number.isNaN(iso.getTime()) ? null : iso.toISOString();
}

function readPostedLogEntries(filePath) {
  const raw = readTextFile(filePath, '');
  if (!raw) {
    return { forge: [], lucas: [] };
  }

  const result = { forge: [], lucas: [] };
  let currentAccount = null;
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^##\s+@Forge_Builds/i.test(trimmed)) {
      currentAccount = 'forge';
      continue;
    }
    if (/^##\s+@LucasJOliver_78/i.test(trimmed)) {
      currentAccount = 'lucas';
      continue;
    }
    if (!currentAccount || !trimmed.startsWith('|')) {
      continue;
    }

    const cells = trimmed.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 3 || !/^\d{8,}$/.test(cells[1])) {
      continue;
    }

    const createdAt = parsePostedLogTimestamp(cells[0]);
    const text = cells[2].replace(/\s+\.\.\.$/, '...').trim();
    result[currentAccount].push({
      text,
      time: createdAt ? formatEtTime(createdAt) : 'Posted log',
      chars: text.length,
      source: 'posted_log',
      created_at: createdAt,
      tweet_id: cells[1],
    });
  }

  result.forge.sort((left, right) => new Date(right.created_at || 0).getTime() - new Date(left.created_at || 0).getTime());
  result.lucas.sort((left, right) => new Date(right.created_at || 0).getTime() - new Date(left.created_at || 0).getTime());
  return result;
}

function normalizeDraftPosts(tweetDrafts, handle) {
  const drafts = Array.isArray(tweetDrafts && tweetDrafts.drafts) ? tweetDrafts.drafts : [];
  const filtered = drafts.filter((draft) => {
    if (!draft || draft.status !== 'posted' || !draft.posted_at) {
      return false;
    }
    const draftHandle = String(draft.handle || draft.account || '').toLowerCase();
    if (!draftHandle) {
      return handle === '@Forge_Builds';
    }
    return draftHandle.includes(handle.toLowerCase().replace('@', '')) || draftHandle === handle.toLowerCase().replace('@', '');
  });

  return filtered
    .map((draft) => normalizeTweet({
      text: draft.text || '',
      created_at: draft.posted_at,
      id: draft.tweet_id || draft.id || null,
    }, 'draft_log'))
    .filter(Boolean)
    .sort((left, right) => new Date(right.created_at || 0).getTime() - new Date(left.created_at || 0).getTime());
}

function buildAccountPostState(handle, recentPosts) {
  const today = etDateKey();
  const posts = Array.isArray(recentPosts) ? recentPosts.slice() : [];
  const postsToday = posts.filter((post) => post.created_at && etDateKey(post.created_at) === today).length;
  return {
    handle,
    postsToday,
    lastPosted: posts[0] ? posts[0].time : '--',
    recentPosts: posts.slice(0, 10),
  };
}

function extractQueueLoggedPosts(queueTasks) {
  const tasks = Array.isArray(queueTasks) ? queueTasks : [];
  const loggedPosts = [];
  const today = etDateKey();

  for (const task of tasks) {
    if (!task || task.status !== 'DONE') {
      continue;
    }

    const title = String(task.title || '');
    const notes = String(task.notes || '');
    const taskDateMatch = String(task.id || '').match(/^T-(\d{4}-\d{2}-\d{2})-/);
    const taskDate = taskDateMatch ? taskDateMatch[1] : null;
    const isXTask = /x tweets|x posts|twitter/i.test(title) || /posted\s+\d+\s+tweets?/i.test(notes);
    if (!isXTask || (taskDate && taskDate !== today)) {
      continue;
    }

    const listSectionMatch = notes.match(/posted\s+\d+\s+tweets?:\s*(.+?)(?:\.\s+[A-Z]|$)/i);
    const listSection = listSectionMatch ? listSectionMatch[1] : '';
    const numberedParts = listSection
      ? listSection.split(/,\s*(?=\d+\))/).map((part) => part.replace(/^\d+\)\s*/, '').trim()).filter(Boolean)
      : [];
    if (numberedParts.length) {
      for (const text of numberedParts) {
        if (!text) continue;
        loggedPosts.push({
          text,
          time: 'Queue log',
          chars: text.length,
          source: 'queue_log',
        });
      }
      continue;
    }

    const countMatch = notes.match(/posted\s+(\d+)\s+tweets?/i);
    const count = countMatch ? Number(countMatch[1]) : 0;
    for (let index = 0; index < count; index += 1) {
      loggedPosts.push({
        text: title || 'Posted from queue log',
        time: 'Queue log',
        chars: String(title || '').length,
        source: 'queue_log',
      });
    }
  }

  return loggedPosts.slice(0, 10);
}

async function buildXPostsState(tweetDrafts, queueTasks) {
  const postedLog = readPostedLogEntries(PATHS.postedLog);
  const draftForgePosts = normalizeDraftPosts(tweetDrafts, '@Forge_Builds');
  const draftLucasPosts = normalizeDraftPosts(tweetDrafts, '@LucasJOliver_78');
  const queueLoggedPosts = extractQueueLoggedPosts(queueTasks);
  const [forgeApiPosts, lucasApiPosts] = await Promise.all([
    fetchRecentTweets('forge'),
    fetchRecentTweets('lucas'),
  ]);

  const forgeRecentPosts = forgeApiPosts.length
    ? forgeApiPosts
    : postedLog.forge.length
      ? postedLog.forge
      : draftForgePosts.length
        ? draftForgePosts
        : queueLoggedPosts;
  const lucasRecentPosts = lucasApiPosts.length
    ? lucasApiPosts
    : postedLog.lucas.length
      ? postedLog.lucas
      : draftLucasPosts;

  return {
    forge: buildAccountPostState('@Forge_Builds', forgeRecentPosts),
    lucas: buildAccountPostState('@LucasJOliver_78', lucasRecentPosts),
  };
}

async function fetchDeepSeekBalance() {
  if (!DEEPSEEK_API_KEY) {
    return { balance: 0, status: 'offline' };
  }

  try {
    const payload = await requestJson('https://api.deepseek.com/user/balance', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + DEEPSEEK_API_KEY },
    });

    const info = Array.isArray(payload && payload.balance_infos) ? payload.balance_infos : [];
    const balance = info.reduce((sum, item) => sum + Number(item.total_balance || item.balance || 0), 0);
    return { balance, status: 'online' };
  } catch (error) {
    return { balance: 0, status: 'offline' };
  }
}

function buildApiStatus(deepseekStatus) {
  return {
    deepseek: deepseekStatus,
    slack: process.env.SLACK_STATUS || 'online',
    x: process.env.X_STATUS || 'online',
    gumroad: process.env.GUMROAD_STATUS || 'online',
    kit: process.env.KIT_STATUS || 'online',
    ollama: process.env.OLLAMA_STATUS || 'offline',
  };
}

function loadPreviewHashes() {
  return readJsonFile(PATHS.previewHashes, {});
}

function savePreviewHashes(hashes) {
  writeJsonFile(PATHS.previewHashes, hashes);
}

async function generateDerivative(buffer, extension) {
  if (!sharp) {
    return null;
  }

  try {
    const derivative = await sharp(buffer)
      .resize(DERIVATIVE_MAX_WIDTH, null, { withoutEnlargement: true })
      .jpeg({ quality: DERIVATIVE_JPEG_QUALITY, mozjpeg: true })
      .toBuffer();
    return derivative;
  } catch (error) {
    return null;
  }
}

function uploadPreviewRaw(previewPath, buffer, mime, artifactHash, dimensions) {
  const url = DASHBOARD_API_URL.replace(/\/$/, '') + '/api/preview/' + encodeURIComponent(previewPath);
  const headers = {
    'Content-Type': 'application/octet-stream',
    'Content-Length': buffer.length,
    'Authorization': 'Bearer ' + DASHBOARD_API_TOKEN,
    'X-Preview-Mime': mime,
  };

  if (artifactHash) {
    headers['X-Preview-Hash'] = artifactHash;
  }
  if (dimensions) {
    headers['X-Preview-Dimensions'] = dimensions;
  }

  return new Promise((resolve, reject) => {
    const request = https.request(url, { method: 'PUT', headers }, (response) => {
      let raw = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { raw += chunk; });
      response.on('end', () => {
        if ((response.statusCode || 500) >= 200 && (response.statusCode || 500) < 300) {
          resolve({ status: 'ok', path: previewPath, size: buffer.length });
          return;
        }
        const error = new Error(raw || 'Preview upload failed');
        error.statusCode = response.statusCode || 500;
        reject(error);
      });
    });
    request.on('error', reject);
    request.write(buffer);
    request.end();
  });
}

function readExistingState() {
  return requestJson(DASHBOARD_API_URL.replace(/\/$/, '') + '/api/state', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).catch(() => null);
}

function scanReviewDirectory(dirPath) {
  const previewItems = [];
  const metadataByDir = new Map();

  function visit(currentDir) {
    let entries = [];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (error) {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }
      if (!entry.isFile()) {
        continue;
      }

      const stats = fs.statSync(fullPath);
      const extension = path.extname(entry.name).toLowerCase();
      const relativePath = path.relative(dirPath, fullPath).split(path.sep).join('/');
      const parentDir = path.dirname(relativePath);

      if (REVIEWABLE_EXTENSIONS.has(extension)) {
        previewItems.push({
          id: relativePath.replace(/[\\/]/g, '__').replace(/[^a-zA-Z0-9_]/g, '_'),
          name: path.basename(entry.name, extension).replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
          path: relativePath,
          absolute_path: fullPath,
          type: extension.slice(1),
          artifact_category: categoryForPath(relativePath),
          artifact_size_bytes: stats.size,
          size: humanFileSize(stats.size),
          created_at: stats.birthtime.toISOString(),
          modified_at: stats.mtime.toISOString(),
          previewable: false,
          preview_type: null,
          preview_data: null,
          preview_url: null,
          metadata: {},
          current_decision: null,
          revision_count: 0,
          latest_event_id: null,
          status: 'pending',
          task_id: null,
          session_id: null,
          model_used: FORGE_MODEL,
          artifact_hash: null,
          artifact_dimensions: null,
        });
        continue;
      }

      if (METADATA_EXTENSIONS.has(extension)) {
        const metadataEntry = {
          path: relativePath,
          type: extension.slice(1),
          content: extension === '.json' ? readJsonFile(fullPath, null) : fs.readFileSync(fullPath, 'utf8'),
          size: humanFileSize(stats.size),
          modified_at: stats.mtime.toISOString(),
        };
        const bucket = metadataByDir.get(parentDir) || [];
        bucket.push(metadataEntry);
        metadataByDir.set(parentDir, bucket);
      }
    }
  }

  visit(dirPath);
  return { previewItems, metadataByDir };
}

function deriveArtifactDimensions(extension, buffer) {
  try {
    if (extension === '.png' && buffer.length >= 24) {
      return buffer.readUInt32BE(16) + 'x' + buffer.readUInt32BE(20);
    }
    if ((extension === '.jpg' || extension === '.jpeg') && buffer.length > 4) {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xFF) break;
        const marker = buffer[offset + 1];
        const size = buffer.readUInt16BE(offset + 2);
        if (marker >= 0xC0 && marker <= 0xC3) {
          return buffer.readUInt16BE(offset + 7) + 'x' + buffer.readUInt16BE(offset + 5);
        }
        offset += 2 + size;
      }
    }
    if (extension === '.webp' && buffer.length >= 30) {
      if (buffer.toString('ascii', 12, 16) === 'VP8X') {
        const width = 1 + buffer.readUIntLE(24, 3);
        const height = 1 + buffer.readUIntLE(27, 3);
        return width + 'x' + height;
      }
    }
  } catch (error) {
    return null;
  }
  return null;
}

function mergeExistingReviewState(items, existingState) {
  const existingItems = Array.isArray(existingState?.reviews?.items) ? existingState.reviews.items : [];
  const byPath = new Map(existingItems.map((item) => [item.path, item]));

  return items.map((item) => {
    const previous = byPath.get(item.path);
    if (!previous) {
      return item;
    }

    return {
      ...item,
      current_decision: previous.current_decision || null,
      revision_count: Number(previous.revision_count || 0),
      latest_event_id: previous.latest_event_id || null,
      status: previous.status || item.status,
      review_comment: previous.review_comment || '',
      reviewer: previous.reviewer || null,
      resolved_at: previous.resolved_at || null,
      task_id: previous.task_id || null,
      session_id: previous.session_id || null,
      model_used: previous.model_used || item.model_used,
    };
  });
}

function deduplicateReviewItems(items) {
  const byHash = new Map();
  for (const item of items) {
    const bucket = byHash.get(item.artifact_hash) || [];
    bucket.push(item);
    byHash.set(item.artifact_hash, bucket);
  }

  const hashDeduped = [];
  let hashCollapsed = 0;

  for (const bucket of byHash.values()) {
    if (bucket.length === 1) {
      hashDeduped.push(bucket[0]);
      continue;
    }

    const primary = choosePrimaryCandidate(bucket);
    const duplicates = bucket.filter((entry) => entry !== primary);
    hashCollapsed += duplicates.length;
    hashDeduped.push({
      ...primary,
      duplicate_paths: appendUnique(primary.duplicate_paths, duplicates.map((entry) => entry.path)),
      dedup_reasons: appendUnique(primary.dedup_reasons, ['hash']),
      primary_selection_reason: primary.primary_selection_reason || 'hash_duplicate_primary',
    });
  }

  const byFamily = new Map();
  for (const item of hashDeduped) {
    const key = `${item.directory_key}::${item.family_key}`;
    const bucket = byFamily.get(key) || [];
    bucket.push(item);
    byFamily.set(key, bucket);
  }

  const familyDeduped = [];
  let familyCollapsed = 0;

  for (const bucket of byFamily.values()) {
    if (bucket.length === 1) {
      familyDeduped.push(bucket[0]);
      continue;
    }

    const primary = choosePrimaryCandidate(bucket);
    const variants = bucket.filter((entry) => entry !== primary);
    familyCollapsed += variants.length;
    familyDeduped.push({
      ...primary,
      variant_paths: appendUnique(primary.variant_paths, variants.map((entry) => entry.path)),
      variant_types: appendUnique(primary.variant_types, variants.map((entry) => entry.type)),
      dedup_reasons: appendUnique(primary.dedup_reasons, ['family']),
      primary_selection_reason: primary.primary_selection_reason || 'same_directory_format_priority',
    });
  }

  return {
    items: familyDeduped.map((item) => ({
      ...item,
      duplicate_paths: item.duplicate_paths || [],
      variant_paths: item.variant_paths || [],
      variant_types: item.variant_types || [],
      dedup_reasons: item.dedup_reasons || [],
      variant_count: (item.variant_paths || []).length + (item.duplicate_paths || []).length,
    })),
    stats: {
      unique_items: familyDeduped.length,
      collapsed_variants: hashCollapsed + familyCollapsed,
      hash_collapsed: hashCollapsed,
      family_collapsed: familyCollapsed,
    },
  };
}

async function buildReviewState(scanResult, existingState) {
  const hashes = loadPreviewHashes();
  const previewPayloads = [];
  const largePreviewUploads = [];
  const nextHashes = { ...hashes };
  const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

  const mergedItems = mergeExistingReviewState(scanResult.previewItems, existingState);
  const scannedItems = [];

  for (const item of mergedItems) {
    const extension = path.extname(item.path).toLowerCase();
    const buffer = fs.readFileSync(item.absolute_path);
    const artifactHash = sha256(buffer);
    const mime = mimeTypeForExtension(extension);
    const isImage = IMAGE_EXTENSIONS.includes(extension);
    const isSmallImage = isImage && buffer.length < INLINE_IMAGE_MAX_BYTES;
    const isLargeImage = isImage && buffer.length >= INLINE_IMAGE_MAX_BYTES;
    const shouldInlineIframe = extension === '.pdf'
      ? buffer.length < PDF_MAX_BYTES
      : extension === '.html'
        ? buffer.length < HTML_MAX_BYTES
        : false;
    const canDirectUploadIframe = (extension === '.pdf' || extension === '.html') && buffer.length <= DIRECT_EMBED_MAX_BYTES;
    const dimensions = deriveArtifactDimensions(extension, buffer);
    const relativePath = item.path;

    const metadataEntries = scanResult.metadataByDir.get(path.dirname(relativePath)) || [];
    const itemMetadata = metadataEntries.reduce((accumulator, entry) => {
      accumulator[entry.path] = {
        type: entry.type,
        size: entry.size,
        modified_at: entry.modified_at,
        content: entry.content,
      };
      return accumulator;
    }, {});

    const commonFields = {
      ...item,
      artifact_hash: artifactHash,
      artifact_dimensions: dimensions,
      metadata: itemMetadata,
      absolute_path: undefined,
      directory_key: path.dirname(relativePath),
      family_key: normalizedStemName(path.basename(relativePath, extension)),
      duplicate_paths: item.duplicate_paths || [],
      variant_paths: item.variant_paths || [],
      variant_types: item.variant_types || [],
      dedup_reasons: item.dedup_reasons || [],
      primary_selection_reason: item.primary_selection_reason || null,
    };

    if (isSmallImage) {
      if (hashes[relativePath] !== artifactHash) {
        previewPayloads.push({ path: relativePath, mime, data: buffer.toString('base64') });
        nextHashes[relativePath] = artifactHash;
      }
      scannedItems.push({
        ...commonFields,
        previewable: true,
        preview_type: 'inline',
        preview_data: `data:${mime};base64,${buffer.toString('base64')}`,
        preview_url: null,
      });
    } else if (isLargeImage) {
      let uploaded = false;
      if (hashes[relativePath] !== artifactHash) {
        const derivative = await generateDerivative(buffer, extension);
        if (derivative) {
          try {
            await uploadPreviewRaw(relativePath, derivative, 'image/jpeg', artifactHash, dimensions);
            nextHashes[relativePath] = artifactHash;
            uploaded = true;
            largePreviewUploads.push({ path: relativePath, originalSize: buffer.length, derivativeSize: derivative.length });
          } catch (error) {
            uploaded = false;
          }
        }
      } else {
        uploaded = true;
      }

      scannedItems.push({
        ...commonFields,
        previewable: uploaded,
        preview_type: uploaded ? 'kv' : null,
        preview_data: null,
        preview_url: uploaded ? `/api/preview/${encodeURIComponent(relativePath)}` : null,
      });

      if (!uploaded) {
        delete nextHashes[relativePath];
      }
    } else if (shouldInlineIframe) {
      if (hashes[relativePath] !== artifactHash) {
        previewPayloads.push({ path: relativePath, mime, data: buffer.toString('base64') });
        nextHashes[relativePath] = artifactHash;
      }
      scannedItems.push({
        ...commonFields,
        previewable: true,
        preview_type: 'iframe',
        preview_data: null,
        preview_url: `/api/preview/${encodeURIComponent(relativePath)}`,
      });
    } else if (canDirectUploadIframe) {
      let uploaded = false;
      if (hashes[relativePath] !== artifactHash) {
        try {
          await uploadPreviewRaw(relativePath, buffer, mime, artifactHash, dimensions);
          nextHashes[relativePath] = artifactHash;
          uploaded = true;
          largePreviewUploads.push({
            path: relativePath,
            originalSize: buffer.length,
            derivativeSize: buffer.length,
            kind: extension === '.pdf' ? 'pdf' : 'html',
          });
        } catch (error) {
          uploaded = false;
        }
      } else {
        uploaded = true;
      }

      scannedItems.push({
        ...commonFields,
        previewable: uploaded,
        preview_type: uploaded ? 'iframe' : null,
        preview_data: null,
        preview_url: uploaded ? `/api/preview/${encodeURIComponent(relativePath)}` : null,
      });

      if (!uploaded) {
        delete nextHashes[relativePath];
      }
    } else {
      delete nextHashes[relativePath];
      scannedItems.push({
        ...commonFields,
        previewable: false,
        preview_type: null,
        preview_data: null,
        preview_url: null,
      });
    }
  }

  const deduped = deduplicateReviewItems(scannedItems);
  const processedItems = deduped.items.map((item) => {
    const nextItem = { ...item };
    delete nextItem.directory_key;
    delete nextItem.family_key;
    return nextItem;
  });
  processedItems.sort((a, b) => String(b.modified_at).localeCompare(String(a.modified_at)));
  savePreviewHashes(nextHashes);

  const metadata = {};
  for (const item of processedItems) {
    metadata[item.id] = item.metadata;
  }

  return {
    previewPayloads,
    largePreviewUploads,
    reviews: {
      stats: {
        pending: processedItems.filter((item) => !item.current_decision).length,
        approved: processedItems.filter((item) => item.current_decision === 'approve').length,
        rejected: processedItems.filter((item) => item.current_decision === 'reject').length,
        needs_revision: processedItems.filter((item) => item.current_decision === 'needs_revision').length,
        unique_items: deduped.stats.unique_items,
        collapsed_variants: deduped.stats.collapsed_variants,
        hash_collapsed: deduped.stats.hash_collapsed,
        family_collapsed: deduped.stats.family_collapsed,
      },
      items: processedItems,
      metadata,
    },
  };
}

async function buildState() {
  const queueJson = readJsonFile(PATHS.queue, { tasks: [] });
  const sessionJson = readJsonFile(PATHS.sessions, { sessions: [] });
  const tweetDrafts = readJsonFile(PATHS.tweetDrafts, { drafts: [] });
  const existingState = await readExistingState();
  const reviewScan = scanReviewDirectory(PATHS.reviewDir);
  const reviewState = await buildReviewState(reviewScan, existingState && !existingState.status ? existingState : null);
  const queue = buildQueueState(queueJson);
  const sessions = buildSessionsState(sessionJson);
  const schedule = getCronSchedule();
  const deepseek = await fetchDeepSeekBalance();
  const xPosts = await buildXPostsState(tweetDrafts, queue.tasks);

  return {
    state: {
      lastUpdated: new Date().toISOString(),
      system: {
        status: 'online',
        model: FORGE_MODEL,
        deepseekBalance: Number(deepseek.balance.toFixed(2)),
        nextSession: buildNextSession(schedule),
        sessionsToday: sessions.filter((entry) => entry.created_at && etDateKey(entry.created_at) === etDateKey()).length,
        uptime: formatUptimeFromSessions(sessions),
      },
      queue,
      schedule,
      sessions: sessions.slice(0, 24),
      xPosts,
      reviews: reviewState.reviews,
      revenue: {
        total: Number(process.env.FORGE_REVENUE_TOTAL || 0),
        target: Number(process.env.FORGE_REVENUE_TARGET || 100),
        gumroadProducts: Number(process.env.GUMROAD_PRODUCTS || 0),
        emailSubscribers: Number(process.env.EMAIL_SUBSCRIBERS || 0),
      },
      apis: buildApiStatus(deepseek.status),
    },
    previewPayloads: reviewState.previewPayloads,
    largePreviewUploads: reviewState.largePreviewUploads,
  };
}

async function pushState(payload) {
  const body = JSON.stringify({
    ...payload.state,
    preview_payloads: payload.previewPayloads,
  });

  return requestJson(DASHBOARD_API_URL.replace(/\/$/, '') + '/api/state', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      Authorization: 'Bearer ' + DASHBOARD_API_TOKEN,
    },
  }, body);
}

async function main() {
  if (!DASHBOARD_API_URL || !DASHBOARD_API_TOKEN) {
    throw new Error('DASHBOARD_API_URL and DASHBOARD_API_TOKEN are required.');
  }

  const payload = await buildState();
  const result = await pushState(payload);

  console.log(JSON.stringify({
    status: 'ok',
    pushedAt: payload.state.lastUpdated,
    queueTasks: payload.state.queue.tasks.length,
    reviews: payload.state.reviews.items.length,
    previewsSynced: payload.previewPayloads.length,
    largePreviewsUploaded: payload.largePreviewUploads.length,
    largePreviewDetails: payload.largePreviewUploads,
    response: result,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
