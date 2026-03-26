const EVENT_INDEX_KEY = 'review-event-index';
const EVENT_PREFIX = 'review-event:';
const STATE_KEY = 'forge-state';
const MAX_EVENT_INDEX_ENTRIES = 500;

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

function unauthorizedResponse() {
  return jsonResponse({ error: 'Unauthorized' }, 401);
}

function notFoundResponse(message = 'Not found') {
  return jsonResponse({ error: message }, 404);
}

function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function todayKey(dateInput = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateInput));
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
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

async function readIndex(env) {
  const raw = await env.STATE.get(EVENT_INDEX_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

async function writeIndex(env, index) {
  await env.STATE.put(EVENT_INDEX_KEY, JSON.stringify(index));
}

async function readEvent(env, eventId) {
  const raw = await env.STATE.get(`${EVENT_PREFIX}${eventId}`);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function generateEventId() {
  const random = Math.random().toString(16).slice(2, 6);
  return `rev-${Date.now()}-${random}`;
}

function normalizeIssues(value) {
  return Array.isArray(value)
    ? value.filter((entry) => typeof entry === 'string' && entry.trim()).map((entry) => entry.trim())
    : [];
}

function ensureReviewsShape(reviews) {
  const base = isObject(reviews) ? reviews : {};
  return {
    stats: isObject(base.stats) ? base.stats : { pending: 0, approved: 0, rejected: 0, needs_revision: 0 },
    items: Array.isArray(base.items) ? base.items : [],
    metadata: isObject(base.metadata) ? base.metadata : {},
  };
}

function recalculateReviewStats(items) {
  return {
    pending: items.filter((item) => !item.current_decision).length,
    approved: items.filter((item) => item.current_decision === 'approve').length,
    rejected: items.filter((item) => item.current_decision === 'reject').length,
    needs_revision: items.filter((item) => item.current_decision === 'needs_revision').length,
  };
}

function updateReviewItemWithEvent(item, event) {
  const revisionCount = event.decision === 'needs_revision'
    ? Math.max(Number(item.revision_count || 0) + 1, Number(event.revision_number || 1))
    : Math.max(Number(item.revision_count || 0), Number(event.revision_number || 0));

  const updated = {
    ...item,
    current_decision: event.decision,
    latest_event_id: event.event_id,
    revision_count: revisionCount,
    reviewed_at: event.reviewed_at,
    reviewer: event.reviewer || item.reviewer || null,
    review_comment: event.comment || '',
    issues: event.issues,
    status: event.decision,
  };

  if (event.decision === 'approve') {
    updated.resolved_at = event.reviewed_at;
  }

  return updated;
}

export async function handleCreateReviewEvent(request, env) {
  if (!requireAuth(request, env)) {
    return unauthorizedResponse();
  }

  const body = await parseJson(request);
  if (!isObject(body)) {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (typeof body.item_id !== 'string' || !body.item_id.trim()) {
    return jsonResponse({ error: 'item_id is required' }, 400);
  }

  if (!['approve', 'needs_revision', 'reject'].includes(body.decision)) {
    return jsonResponse({ error: 'decision must be approve, needs_revision, or reject' }, 400);
  }

  const state = await readState(env);
  if (!state) {
    return jsonResponse({ error: 'forge-state is not initialized' }, 409);
  }

  const reviews = ensureReviewsShape(state.reviews);
  const itemIndex = reviews.items.findIndex((item) => String(item.id) === body.item_id);
  if (itemIndex === -1) {
    return notFoundResponse('Review item not found');
  }

  const item = reviews.items[itemIndex];
  const previousEventId = item.latest_event_id || null;
  const previousEvent = previousEventId ? await readEvent(env, previousEventId) : null;
  const revisionNumber = Number.isInteger(body.revision_number)
    ? body.revision_number
    : (body.decision === 'needs_revision' ? Number(item.revision_count || 0) + 1 : Number(item.revision_count || 0));

  const event = {
    event_id: typeof body.event_id === 'string' && body.event_id ? body.event_id : generateEventId(),
    item_id: String(body.item_id),
    item_path: typeof body.item_path === 'string' && body.item_path ? body.item_path : item.path || '',
    item_type: typeof body.item_type === 'string' && body.item_type ? body.item_type : item.type || '',
    artifact_category: typeof body.artifact_category === 'string' && body.artifact_category ? body.artifact_category : item.artifact_category || item.category || 'product',
    decision: body.decision,
    issues: normalizeIssues(body.issues),
    comment: typeof body.comment === 'string' ? body.comment.trim() : '',
    reviewer: typeof body.reviewer === 'string' && body.reviewer ? body.reviewer : 'lucas',
    reviewed_at: typeof body.reviewed_at === 'string' && body.reviewed_at ? body.reviewed_at : new Date().toISOString(),
    revision_number: revisionNumber,
    task_id: typeof body.task_id === 'string' ? body.task_id : item.task_id || null,
    session_id: typeof body.session_id === 'string' ? body.session_id : item.session_id || null,
    model_used: typeof body.model_used === 'string' ? body.model_used : item.model_used || state.system?.model || null,
    previous_decision: previousEvent ? previousEvent.decision : null,
    previous_event_id: previousEvent ? previousEvent.event_id : null,
    time_to_decision_seconds: Number(body.time_to_decision_seconds || 0),
    artifact_size_bytes: Number(body.artifact_size_bytes || item.artifact_size_bytes || 0),
    artifact_hash: typeof body.artifact_hash === 'string' ? body.artifact_hash : item.artifact_hash || null,
    artifact_dimensions: typeof body.artifact_dimensions === 'string' ? body.artifact_dimensions : item.artifact_dimensions || null,
    is_overwritten_revision: body.is_overwritten_revision === true,
    resolved_at: body.decision === 'approve' ? (typeof body.resolved_at === 'string' && body.resolved_at ? body.resolved_at : new Date().toISOString()) : null,
  };

  await env.STATE.put(`${EVENT_PREFIX}${event.event_id}`, JSON.stringify(event));

  const index = await readIndex(env);
  index.push({
    event_id: event.event_id,
    item_id: event.item_id,
    decision: event.decision,
    reviewed_at: event.reviewed_at,
  });
  index.sort((left, right) => String(right.reviewed_at).localeCompare(String(left.reviewed_at)));
  if (index.length > MAX_EVENT_INDEX_ENTRIES) {
    index.length = MAX_EVENT_INDEX_ENTRIES;
  }
  await writeIndex(env, index);

  reviews.items[itemIndex] = updateReviewItemWithEvent(item, event);
  reviews.stats = recalculateReviewStats(reviews.items);
  state.reviews = reviews;
  state.lastUpdated = new Date().toISOString();

  await writeState(env, state);

  return jsonResponse({
    status: 'ok',
    event_id: event.event_id,
    event,
    item: reviews.items[itemIndex],
  });
}

export async function handleListReviewEvents(request, env) {
  const url = new URL(request.url);
  const itemId = url.searchParams.get('item_id');
  const decision = url.searchParams.get('decision');
  const limit = Math.max(1, Math.min(200, Number(url.searchParams.get('limit') || 50)));

  const index = await readIndex(env);
  const filteredIndex = index
    .filter((entry) => !itemId || entry.item_id === itemId)
    .filter((entry) => !decision || entry.decision === decision)
    .slice(0, limit);

  const events = [];
  for (const entry of filteredIndex) {
    const event = await readEvent(env, entry.event_id);
    if (event) {
      events.push(event);
    }
  }

  return jsonResponse({
    events,
    total: filteredIndex.length,
  });
}

export async function handleGetReviewEvent(env, eventId) {
  const event = await readEvent(env, eventId);
  if (!event) {
    return notFoundResponse('Review event not found');
  }
  return jsonResponse(event);
}

export async function getReviewAnalyticsSource(env) {
  const index = await readIndex(env);
  const state = await readState(env);
  const events = [];
  for (const entry of index) {
    const event = await readEvent(env, entry.event_id);
    if (event) {
      events.push(event);
    }
  }

  return {
    state,
    index,
    events,
    today: todayKey(),
  };
}
