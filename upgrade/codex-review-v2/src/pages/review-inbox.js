export default /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>Forge Review Inbox</title>
<style>
  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --surface2: #1c1c26;
    --border: #2a2a3a;
    --text: #e8e8f0;
    --muted: #6b6b80;
    --accent: #7c6af7;
    --green: #22c55e;
    --yellow: #f59e0b;
    --red: #ef4444;
    --blue: #3b82f6;
    --tap-min: 52px;
    --safe-bottom: env(safe-area-inset-bottom, 20px);
    --safe-top: env(safe-area-inset-top, 0px);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

  html, body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
    min-height: 100dvh;
    overscroll-behavior: none;
  }

  /* ── HEADER ── */
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(10,10,15,0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: calc(var(--safe-top) + 12px) 16px 12px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .header-title { font-size: 17px; font-weight: 600; flex: 1; }
  .header-count {
    font-size: 13px;
    color: var(--muted);
    background: var(--surface2);
    padding: 3px 8px;
    border-radius: 20px;
  }
  .header-refresh {
    width: 36px; height: 36px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: var(--muted);
    font-size: 16px;
    transition: color 0.15s;
  }
  .header-refresh:active { color: var(--text); transform: scale(0.92); }

  /* ── FILTER TABS ── */
  .filter-bar {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    overflow-x: auto;
    scrollbar-width: none;
    background: var(--bg);
  }
  .filter-bar::-webkit-scrollbar { display: none; }
  .filter-pill {
    flex-shrink: 0;
    height: 34px;
    padding: 0 14px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--muted);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
    display: flex; align-items: center; gap: 6px;
  }
  .filter-pill.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }
  .filter-pill:active { transform: scale(0.95); }

  /* ── ITEM LIST ── */
  .item-list {
    padding: 0 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .item-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    transition: border-color 0.15s;
  }
  .item-card.decided { opacity: 0.55; }
  .item-card.decided .item-body { text-decoration: line-through; }

  .item-header {
    padding: 14px 14px 0;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .item-type-badge {
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 3px 8px;
    border-radius: 6px;
    background: var(--surface2);
    color: var(--muted);
    margin-top: 2px;
  }
  .item-type-badge.product  { background: rgba(124,106,247,0.18); color: var(--accent); }
  .item-type-badge.content  { background: rgba(59,130,246,0.18); color: var(--blue); }
  .item-type-badge.dashboard{ background: rgba(245,158,11,0.18); color: var(--yellow); }
  .item-type-badge.visual   { background: rgba(34,197,94,0.18); color: var(--green); }
  .item-type-badge.notebooklm { background: rgba(239,68,68,0.18); color: var(--red); }

  .item-title {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.35;
    flex: 1;
  }

  .item-meta {
    padding: 6px 14px 10px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }
  .item-age { font-size: 12px; color: var(--muted); }
  .item-task-id {
    font-size: 11px;
    color: var(--muted);
    font-family: 'SF Mono', 'Fira Mono', monospace;
    background: var(--surface2);
    padding: 2px 6px;
    border-radius: 4px;
  }
  .item-decision-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .item-decision-badge.approve     { background: rgba(34,197,94,0.2); color: var(--green); }
  .item-decision-badge.needs_revision { background: rgba(245,158,11,0.2); color: var(--yellow); }
  .item-decision-badge.reject      { background: rgba(239,68,68,0.2); color: var(--red); }
  .item-decision-badge.later       { background: rgba(107,107,128,0.2); color: var(--muted); }

  /* ── ACTION BUTTONS ── */
  .item-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 0 12px 12px;
  }
  .action-btn {
    min-height: var(--tap-min);
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--surface2);
    color: var(--text);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.12s;
    -webkit-user-select: none;
  }
  .action-btn:active { transform: scale(0.96); }
  .action-btn.approve   { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.4); color: var(--green); }
  .action-btn.revise    { background: rgba(245,158,11,0.15); border-color: rgba(245,158,11,0.4); color: var(--yellow); }
  .action-btn.reject    { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.3); color: var(--red); }
  .action-btn.later     { background: var(--surface2); color: var(--muted); }
  .action-btn.approve:active  { background: rgba(34,197,94,0.28); }
  .action-btn.revise:active   { background: rgba(245,158,11,0.28); }
  .action-btn.reject:active   { background: rgba(239,68,68,0.22); }

  /* ── EMPTY / LOADING STATES ── */
  .state-center {
    text-align: center;
    padding: 60px 24px;
    color: var(--muted);
  }
  .state-center .icon { font-size: 40px; margin-bottom: 12px; }
  .state-center .heading { font-size: 17px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
  .state-center .sub { font-size: 14px; }

  /* ── TOAST ── */
  #toast {
    position: fixed;
    bottom: calc(var(--safe-bottom) + 24px);
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    font-size: 14px;
    font-weight: 500;
    padding: 10px 20px;
    border-radius: 24px;
    white-space: nowrap;
    opacity: 0;
    transition: all 0.2s;
    pointer-events: none;
    z-index: 200;
    max-width: calc(100vw - 48px);
    text-overflow: ellipsis;
    overflow: hidden;
  }
  #toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  /* ── BOTTOM PADDING ── */
  .bottom-spacer { height: calc(var(--safe-bottom) + 32px); }
</style>
</head>
<body>

<div class="header">
  <span class="header-title">Review Inbox</span>
  <span class="header-count" id="pending-count">--</span>
  <button class="header-refresh" id="refresh-btn" title="Refresh">↻</button>
</div>

<div class="filter-bar">
  <button class="filter-pill active" data-filter="pending">Pending</button>
  <button class="filter-pill" data-filter="all">All</button>
  <button class="filter-pill" data-filter="approve">Approved</button>
  <button class="filter-pill" data-filter="needs_revision">Needs revision</button>
  <button class="filter-pill" data-filter="reject">Rejected</button>
  <button class="filter-pill" data-filter="later">Later</button>
</div>

<div id="list-container">
  <div class="state-center">
    <div class="icon">⏳</div>
    <div class="heading">Loading…</div>
  </div>
</div>

<div id="toast"></div>

<script>
const BASE = '';
let allItems = [];
let activeFilter = 'pending';

// ── Deep-link: ?item=<id> opens directly to that card
const deepLinkId = new URLSearchParams(location.search).get('item');

function typeClass(item) {
  const t = (item.type || item.review_content_type || '').toLowerCase();
  if (t.includes('product') || t.includes('pdf')) return 'product';
  if (t.includes('content') || t.includes('blog') || t.includes('email') || t.includes('post') || t.includes('thread')) return 'content';
  if (t.includes('dashboard') || t.includes('worker')) return 'dashboard';
  if (t.includes('visual') || t.includes('image') || t.includes('graphic') || t.includes('x-card')) return 'visual';
  if (t.includes('notebook') || t.includes('nlm')) return 'notebooklm';
  return '';
}

function typeLabel(item) {
  const tc = typeClass(item);
  if (tc) return tc.charAt(0).toUpperCase() + tc.slice(1);
  return item.type || item.review_content_type || 'Item';
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

function decisionLabel(d) {
  if (!d) return null;
  if (d === 'approve') return { label: 'Approved', cls: 'approve' };
  if (d === 'needs_revision') return { label: 'Revise', cls: 'needs_revision' };
  if (d === 'reject') return { label: 'Rejected', cls: 'reject' };
  if (d === 'later') return { label: 'Later', cls: 'later' };
  return { label: d, cls: '' };
}

function filteredItems() {
  if (activeFilter === 'pending') return allItems.filter(i => !i.current_decision);
  if (activeFilter === 'all') return allItems;
  return allItems.filter(i => i.current_decision === activeFilter);
}

function renderItems() {
  const items = filteredItems();
  const container = document.getElementById('list-container');

  if (items.length === 0) {
    const msg = activeFilter === 'pending'
      ? { icon: '✅', heading: 'Inbox zero', sub: 'No pending items.' }
      : { icon: '📭', heading: 'Nothing here', sub: 'No items match this filter.' };
    container.innerHTML = \`<div class="state-center"><div class="icon">\${msg.icon}</div><div class="heading">\${msg.heading}</div><div class="sub">\${msg.sub}</div></div>\`;
    return;
  }

  // Sort: undecided first, then by created_at desc
  const sorted = [...items].sort((a, b) => {
    const aP = a.current_decision ? 1 : 0;
    const bP = b.current_decision ? 1 : 0;
    if (aP !== bP) return aP - bP;
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  const pending = allItems.filter(i => !i.current_decision).length;
  document.getElementById('pending-count').textContent = pending + ' pending';

  const tc = typeClass;
  const tl = typeLabel;

  container.innerHTML = '<div class="item-list">' + sorted.map(item => {
    const decided = !!item.current_decision;
    const dec = decisionLabel(item.current_decision);
    const tc2 = tc(item);
    return \`
      <div class="item-card\${decided ? ' decided' : ''}" data-id="\${item.id}" id="card-\${item.id}">
        <div class="item-header">
          <span class="item-type-badge \${tc2}">\${tl(item)}</span>
          <div class="item-title item-body">\${item.title || item.path || '(untitled)'}</div>
        </div>
        <div class="item-meta">
          <span class="item-age">\${timeAgo(item.created_at)}</span>
          \${item.task_id ? \`<span class="item-task-id">\${item.task_id}</span>\` : ''}
          \${dec ? \`<span class="item-decision-badge \${dec.cls}">\${dec.label}</span>\` : ''}
        </div>
        <div class="item-actions">
          <button class="action-btn approve" data-id="\${item.id}" data-decision="approve">✓ Approve</button>
          <button class="action-btn revise"  data-id="\${item.id}" data-decision="needs_revision">↻ Revise</button>
          <button class="action-btn reject"  data-id="\${item.id}" data-decision="reject">✕ Reject</button>
          <button class="action-btn later"   data-id="\${item.id}" data-decision="later">⋯ Later</button>
        </div>
      </div>
    \`;
  }).join('') + '</div>';

  // Deep-link scroll
  if (deepLinkId) {
    const el = document.getElementById('card-' + deepLinkId);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  }
}

function showToast(msg, duration = 2200) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

async function fetchItems() {
  try {
    const res = await fetch(BASE + '/api/reviews');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    allItems = data.items || [];
    renderItems();
  } catch (e) {
    document.getElementById('list-container').innerHTML =
      '<div class="state-center"><div class="icon">⚠️</div><div class="heading">Load failed</div><div class="sub">' + e.message + '</div></div>';
  }
}

async function submitDecision(itemId, decision) {
  // Optimistic update
  const item = allItems.find(i => String(i.id) === String(itemId));
  if (item) {
    item.current_decision = decision;
    renderItems();
  }

  try {
    const res = await fetch(BASE + '/api/review-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_id: String(itemId),
        decision,
        reviewer: 'lucas',
        reviewed_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const labels = { approve: '✓ Approved', needs_revision: '↻ Flagged for revision', reject: '✕ Rejected', later: '⋯ Snoozed' };
    showToast(labels[decision] || decision);
  } catch (e) {
    showToast('⚠️ Failed: ' + e.message, 3500);
    // Revert optimistic update
    if (item) { item.current_decision = null; renderItems(); }
  }
}

// ── Event delegation for action buttons
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-decision]');
  if (btn) {
    const id = btn.dataset.id;
    const decision = btn.dataset.decision;
    submitDecision(id, decision);
    return;
  }

  const pill = e.target.closest('.filter-pill');
  if (pill) {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeFilter = pill.dataset.filter;
    renderItems();
    return;
  }

  if (e.target.closest('#refresh-btn')) {
    fetchItems();
    showToast('Refreshing…', 1000);
  }
});

// Init
fetchItems();
</script>
<div class="bottom-spacer"></div>
</body>
</html>
`;
