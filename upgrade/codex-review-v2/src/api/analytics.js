import { getReviewAnalyticsSource } from './review-events.js';

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

function todayKey(dateInput = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateInput));
}

function safeNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function percentage(part, total) {
  if (!total) {
    return 0;
  }
  return Number(((part / total) * 100).toFixed(1));
}

export async function handleAnalyticsSummary(env) {
  const { state, events, today } = await getReviewAnalyticsSource(env);
  const items = Array.isArray(state?.reviews?.items) ? state.reviews.items : [];

  const decisionCounts = events.reduce((accumulator, event) => {
    accumulator[event.decision] = (accumulator[event.decision] || 0) + 1;
    return accumulator;
  }, { approve: 0, needs_revision: 0, reject: 0 });

  const issueMap = new Map();
  for (const event of events) {
    for (const issue of Array.isArray(event.issues) ? event.issues : []) {
      issueMap.set(issue, (issueMap.get(issue) || 0) + 1);
    }
  }

  const issueFrequency = Array.from(issueMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 10);

  const firstPassApprovals = items.filter((item) => item.current_decision === 'approve' && safeNumber(item.revision_count) === 0).length;
  const approvedItems = items.filter((item) => item.current_decision === 'approve').length;
  const totalRevisions = items.reduce((sum, item) => sum + safeNumber(item.revision_count), 0);

  const categoryMap = new Map();
  const contentTypeMap = new Map();
  for (const item of items) {
    const category = item.artifact_category || item.category || 'uncategorized';
    const contentType = item.review_content_type || item.type || 'unknown';
    const record = categoryMap.get(category) || {
      category,
      total: 0,
      approved: 0,
      needs_revision: 0,
      rejected: 0,
      total_revisions: 0,
    };

    record.total += 1;
    record.total_revisions += safeNumber(item.revision_count);
    if (item.current_decision === 'approve') {
      record.approved += 1;
    } else if (item.current_decision === 'reject') {
      record.rejected += 1;
    } else if (item.current_decision === 'needs_revision' || !item.current_decision) {
      record.needs_revision += 1;
    }

    categoryMap.set(category, record);

    const contentRecord = contentTypeMap.get(contentType) || {
      content_type: contentType,
      total: 0,
      approved: 0,
      needs_revision: 0,
      rejected: 0,
      total_revisions: 0,
    };

    contentRecord.total += 1;
    contentRecord.total_revisions += safeNumber(item.revision_count);
    if (item.current_decision === 'approve') {
      contentRecord.approved += 1;
    } else if (item.current_decision === 'reject') {
      contentRecord.rejected += 1;
    } else if (item.current_decision === 'needs_revision' || !item.current_decision) {
      contentRecord.needs_revision += 1;
    }

    contentTypeMap.set(contentType, contentRecord);
  }

  const categoryPerformance = Array.from(categoryMap.values()).map((record) => ({
    category: record.category,
    total: record.total,
    approved: record.approved,
    revision_rate: percentage(record.needs_revision, record.total),
    reject_rate: percentage(record.rejected, record.total),
    avg_revisions: Number((record.total_revisions / Math.max(record.total, 1)).toFixed(2)),
  })).sort((left, right) => right.total - left.total);

  const contentTypePerformance = Array.from(contentTypeMap.values()).map((record) => ({
    content_type: record.content_type,
    total: record.total,
    approved: record.approved,
    approval_rate: percentage(record.approved, record.total),
    revision_rate: percentage(record.needs_revision, record.total),
    reject_rate: percentage(record.rejected, record.total),
    avg_revisions: Number((record.total_revisions / Math.max(record.total, 1)).toFixed(2)),
  })).sort((left, right) => right.total - left.total);

  const modelMap = new Map();
  for (const event of events) {
    const model = event.model_used || 'unknown';
    const record = modelMap.get(model) || {
      model,
      items_produced: 0,
      approved: 0,
      needs_revision: 0,
      rejected: 0,
      total_revision_number: 0,
    };

    record.items_produced += 1;
    record.total_revision_number += safeNumber(event.revision_number);
    if (event.decision === 'approve') {
      record.approved += 1;
    } else if (event.decision === 'needs_revision') {
      record.needs_revision += 1;
    } else if (event.decision === 'reject') {
      record.rejected += 1;
    }

    modelMap.set(model, record);
  }

  const modelPerformance = Array.from(modelMap.values()).map((record) => ({
    model: record.model,
    items_produced: record.items_produced,
    approval_rate: percentage(record.approved, record.items_produced),
    avg_revision_count: Number((record.total_revision_number / Math.max(record.items_produced, 1)).toFixed(2)),
    reject_rate: percentage(record.rejected, record.items_produced),
  })).sort((left, right) => right.items_produced - left.items_produced);

  const reviewedToday = events.filter((event) => todayKey(event.reviewed_at) === today).length;
  const submittedToday = items.filter((item) => todayKey(item.created_at || item.modified_at || item.reviewed_at || new Date()) === today).length;

  return jsonResponse({
    analytics: {
      decision_distribution: decisionCounts,
      issue_frequency: issueFrequency,
      revision_depth: {
        first_pass_approval_pct: percentage(firstPassApprovals, approvedItems || items.length),
        avg_revisions: Number((totalRevisions / Math.max(items.length, 1)).toFixed(2)),
        in_revision: items.filter((item) => item.current_decision === 'needs_revision').length,
      },
      content_type_performance: contentTypePerformance,
      category_performance: categoryPerformance,
      model_performance: modelPerformance,
      throughput: {
        submitted_today: submittedToday,
        reviewed_today: reviewedToday,
        backlog: items.filter((item) => !item.current_decision || item.current_decision === 'needs_revision').length,
      },
    },
    computed_at: new Date().toISOString(),
  });
}
