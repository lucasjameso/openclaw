import missionControlHtml from './pages/mission-control.js';
import reviewHtml from './pages/review.js';
import xPostsHtml from './pages/x-posts.js';

const STATE_KEY = 'forge-state';

function corsHeaders(extraHeaders = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...extraHeaders,
  };
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: corsHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    }),
  });
}

function htmlResponse(html) {
  return new Response(html, {
    status: 200,
    headers: corsHeaders({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    }),
  });
}

function noContentResponse() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
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
  const authHeader = request.headers.get('Authorization') || '';
  return authHeader === `Bearer ${env.API_TOKEN}`;
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
    reviews: base.reviews && typeof base.reviews === 'object' ? base.reviews : { stats: {}, items: [] },
    revenue: base.revenue && typeof base.revenue === 'object' ? base.revenue : {},
    apis: base.apis && typeof base.apis === 'object' ? base.apis : {},
  };
}

function recalculateReviewStats(reviews) {
  const items = Array.isArray(reviews.items) ? reviews.items : [];
  const approved = items.filter((item) => item.status === 'approved').length;
  const rejected = items.filter((item) => item.status === 'rejected').length;
  const pending = items.filter((item) => item.status !== 'approved' && item.status !== 'rejected').length;

  return {
    ...reviews,
    stats: {
      pending,
      approved,
      rejected,
    },
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

  const nextState = ensureStateShape({
    ...body,
    lastUpdated: body.lastUpdated || new Date().toISOString(),
  });

  await writeState(env, nextState);
  return jsonResponse({ status: 'ok', lastUpdated: nextState.lastUpdated });
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

async function handleReviewAction(request, env, action, id) {
  if (!requireAuth(request, env)) {
    return unauthorizedResponse();
  }

  const currentState = ensureStateShape(await readState(env));
  const items = Array.isArray(currentState.reviews.items) ? currentState.reviews.items.slice() : [];
  const index = items.findIndex((item) => String(item.id) === id);

  if (index === -1) {
    return notFoundResponse('Review item not found');
  }

  const body = request.method === 'POST' ? await parseJson(request) : null;
  const item = {
    ...items[index],
    status: action,
    updatedAt: new Date().toISOString(),
  };

  if (action === 'redo' && body && typeof body.comment === 'string' && body.comment.trim()) {
    item.comment = body.comment.trim();
  }

  items[index] = item;
  currentState.reviews = recalculateReviewStats({
    ...currentState.reviews,
    items,
  });
  currentState.lastUpdated = new Date().toISOString();

  await writeState(env, currentState);
  return jsonResponse({ status: 'ok', item });
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

    if (request.method === 'GET' && pathname === '/x-posts') {
      return htmlResponse(xPostsHtml);
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
      return jsonResponse(state.reviews || { stats: {}, items: [] });
    }

    const approveMatch = pathname.match(/^\/api\/review\/([^/]+)\/approve$/);
    if (approveMatch && request.method === 'POST') {
      return handleReviewAction(request, env, 'approved', decodeURIComponent(approveMatch[1]));
    }

    const rejectMatch = pathname.match(/^\/api\/review\/([^/]+)\/reject$/);
    if (rejectMatch && request.method === 'POST') {
      return handleReviewAction(request, env, 'rejected', decodeURIComponent(rejectMatch[1]));
    }

    const redoMatch = pathname.match(/^\/api\/review\/([^/]+)\/redo$/);
    if (redoMatch && request.method === 'POST') {
      return handleReviewAction(request, env, 'redo', decodeURIComponent(redoMatch[1]));
    }

    return notFoundResponse();
  },
};
