import missionControlHtml from './pages/mission-control.js';
import launchpadHtml from './pages/launchpad.js';
import reviewHtml from './pages/review.js';
import storyMobileHtml from './pages/story-mobile.js';
import xPostsHtml from './pages/x-posts.js';
import storyHtml from './pages/story.js';
import videoLabHtml from './pages/video-lab.js';
import { handlePreviewRequest, handlePreviewUpload } from './api/preview.js';
import {
  handleCreateReviewEvent,
  handleGetReviewEvent,
  handleListReviewEvents,
} from './api/review-events.js';
import { handleAnalyticsSummary } from './api/analytics.js';

const STATE_KEY = 'forge-state';

function corsHeaders(extraHeaders = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...extraHeaders,
  };
}

function freshHeaders(extraHeaders = {}) {
  return corsHeaders({
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0',
    Pragma: 'no-cache',
    Expires: '0',
    ...extraHeaders,
  });
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: freshHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    }),
  });
}

function htmlResponse(html) {
  return new Response(html, {
    status: 200,
    headers: freshHeaders({
      'Content-Type': 'text/html; charset=utf-8',
    }),
  });
}

function noContentResponse() {
  return new Response(null, {
    status: 204,
    headers: freshHeaders(),
  });
}

function unauthorizedResponse() {
  return jsonResponse({ error: 'Unauthorized' }, 401);
}

function notFoundResponse(message = 'Not found') {
  return jsonResponse({ error: message }, 404);
}

async function readState(env) {
  const raw = await env.STATE.get(STATE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

async function writeState(env, state) {
  await env.STATE.put(STATE_KEY, JSON.stringify(state));
}

function requireAuth(request, env) {
  return (request.headers.get('Authorization') || '') === `Bearer ${env.API_TOKEN}`;
}

function deepMerge(target, source) {
  if (Array.isArray(source)) {
    return source.slice();
  }

  if (!source || typeof source !== 'object') {
    return source;
  }

  const base = target && typeof target === 'object' && !Array.isArray(target) ? { ...target } : {};
  for (const [key, value] of Object.entries(source)) {
    base[key] = deepMerge(base[key], value);
  }
  return base;
}

function ensureStateShape(state) {
  const base = state && typeof state === 'object' ? state : {};
  return {
    lastUpdated: base.lastUpdated || null,
    system: base.system && typeof base.system === 'object' ? base.system : {},
    queue: base.queue && typeof base.queue === 'object' ? base.queue : { tasks: [], stats: {} },
    schedule: Array.isArray(base.schedule) ? base.schedule : [],
    sessions: Array.isArray(base.sessions) ? base.sessions : [],
    xPosts: base.xPosts && typeof base.xPosts === 'object' ? base.xPosts : {},
    reviews: base.reviews && typeof base.reviews === 'object'
      ? {
          stats: base.reviews.stats && typeof base.reviews.stats === 'object' ? base.reviews.stats : {},
          items: Array.isArray(base.reviews.items) ? base.reviews.items : [],
          metadata: base.reviews.metadata && typeof base.reviews.metadata === 'object' ? base.reviews.metadata : {},
        }
      : { stats: {}, items: [], metadata: {} },
    revenue: base.revenue && typeof base.revenue === 'object' ? base.revenue : {},
    apis: base.apis && typeof base.apis === 'object' ? base.apis : {},
  };
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
}

async function handleStatePost(request, env) {
  if (!requireAuth(request, env)) {
    return unauthorizedResponse();
  }

  const body = await parseJson(request);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const previewPayloads = Array.isArray(body.preview_payloads) ? body.preview_payloads : [];
  for (const preview of previewPayloads) {
    if (!preview || typeof preview.path !== 'string' || typeof preview.mime !== 'string' || typeof preview.data !== 'string') {
      continue;
    }
    await env.STATE.put(`preview:${preview.path}`, JSON.stringify({
      mime: preview.mime,
      data: preview.data,
    }));
  }

  const nextState = ensureStateShape({
    ...body,
    preview_payloads: undefined,
    lastUpdated: body.lastUpdated || new Date().toISOString(),
  });

  delete nextState.preview_payloads;
  await writeState(env, nextState);
  return jsonResponse({
    status: 'ok',
    lastUpdated: nextState.lastUpdated,
    previews_synced: previewPayloads.length,
  });
}

async function handleStatePatch(request, env) {
  if (!requireAuth(request, env)) {
    return unauthorizedResponse();
  }

  const patch = await parseJson(request);
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const currentState = ensureStateShape(await readState(env));
  const mergedState = ensureStateShape(
    deepMerge(currentState, {
      ...patch,
      lastUpdated: new Date().toISOString(),
    })
  );

  await writeState(env, mergedState);
  return jsonResponse({ status: 'ok', lastUpdated: mergedState.lastUpdated });
}

export default {
  async fetch(request, env) {
    if (!env.STATE) {
      return jsonResponse({ error: 'Missing KV binding: STATE' }, 500);
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    if (request.method === 'OPTIONS') {
      return noContentResponse();
    }

    if (request.method === 'GET' && pathname === '/') {
      return htmlResponse(missionControlHtml);
    }

    if (request.method === 'GET' && pathname === '/review') {
      return htmlResponse(reviewHtml);
    }

    if (request.method === 'GET' && pathname === '/story-mobile') {
      return htmlResponse(storyMobileHtml);
    }

    if (request.method === 'GET' && pathname === '/launchpad') {
      return htmlResponse(launchpadHtml);
    }

    if (request.method === 'GET' && pathname === '/video-lab') {
      return htmlResponse(videoLabHtml);
    }

    if (request.method === 'GET' && pathname === '/x-posts') {
      return htmlResponse(xPostsHtml);
    }

    if (request.method === 'GET' && pathname === '/story') {
      return htmlResponse(storyHtml);
    }

    if (pathname === '/api/state' && request.method === 'GET') {
      const state = await readState(env);
      if (!state) {
        return jsonResponse({
          status: 'no data yet',
          message: 'POST to /api/state to initialize',
        });
      }

      return jsonResponse(ensureStateShape(state));
    }

    if (pathname === '/api/state' && request.method === 'POST') {
      return handleStatePost(request, env);
    }

    if (pathname === '/api/state' && request.method === 'PATCH') {
      return handleStatePatch(request, env);
    }

    if (pathname === '/api/queue' && request.method === 'GET') {
      const state = ensureStateShape(await readState(env));
      return jsonResponse(state.queue || { tasks: [], stats: {} });
    }

    if (pathname === '/api/sessions' && request.method === 'GET') {
      const state = ensureStateShape(await readState(env));
      return jsonResponse(state.sessions || []);
    }

    if (pathname === '/api/reviews' && request.method === 'GET') {
      const state = ensureStateShape(await readState(env));
      return jsonResponse(state.reviews || { stats: {}, items: [], metadata: {} });
    }

    if (pathname.startsWith('/api/preview/') && request.method === 'GET') {
      return handlePreviewRequest(env, pathname.slice('/api/preview/'.length));
    }

    if (pathname.startsWith('/api/preview/') && request.method === 'PUT') {
      return handlePreviewUpload(request, env, pathname.slice('/api/preview/'.length));
    }

    if (pathname === '/api/review-event' && request.method === 'POST') {
      return handleCreateReviewEvent(request, env);
    }

    if (pathname === '/api/review-events' && request.method === 'GET') {
      return handleListReviewEvents(request, env);
    }

    const reviewEventMatch = pathname.match(/^\/api\/review-events\/([^/]+)$/);
    if (reviewEventMatch && request.method === 'GET') {
      return handleGetReviewEvent(env, decodeURIComponent(reviewEventMatch[1]));
    }

    if (pathname === '/api/analytics/summary' && request.method === 'GET') {
      return handleAnalyticsSummary(env);
    }

    return notFoundResponse();
  },
};
