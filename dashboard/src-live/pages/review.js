const reviewHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Forge Review Dashboard</title>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --bg: #f7fafc;
      --card: #ffffff;
      --text: #1a202c;
      --muted: #4a5568;
      --border: #e2e8f0;
      --primary: #1a365d;
      --accent: #3182ce;
      --success: #38a169;
      --warning: #d69e2e;
      --error: #e53e3e;
      --shadow-lg: 0 4px 12px rgba(0,0,0,0.08);
      --shadow-sm: 0 2px 4px rgba(0,0,0,0.04);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
    }
    .container { max-width: 1440px; margin: 0 auto; padding: 24px; }
    .nav, .filters, .stats, .card, .modal-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      box-shadow: var(--shadow-lg), var(--shadow-sm);
    }
    .nav {
      display: flex;
      gap: 12px;
      padding: 10px;
      border-radius: 999px;
      margin-bottom: 24px;
      overflow-x: auto;
    }
    .nav a { padding: 10px 16px; border-radius: 999px; color: var(--muted); text-decoration: none; white-space: nowrap; }
    .nav a.active { background: var(--primary); color: white; }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      padding: 18px;
      margin-bottom: 20px;
    }
    .stat-card { padding: 8px; }
    .stat-label { color: var(--muted); margin-bottom: 8px; }
    .stat-value { font-size: 2rem; font-weight: 700; color: var(--primary); }
    .amber { color: var(--warning); }
    .green { color: var(--success); }
    .filters {
      padding: 16px;
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }
    .filter-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .filter-btn, input, textarea, button {
      font: inherit;
    }
    .filter-btn {
      border: 1px solid var(--border);
      background: #f8fafc;
      color: var(--muted);
      padding: 10px 14px;
      border-radius: 999px;
      cursor: pointer;
    }
    .filter-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
    input, textarea {
      width: 100%;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px 14px;
      background: white;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }
    .card {
      padding: 18px;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 10px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 999px;
      padding: 6px 10px;
      background: #edf2f7;
      color: var(--muted);
      font-size: 0.85rem;
      font-weight: 600;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 16px;
    }
    .btn {
      border: none;
      border-radius: 10px;
      padding: 10px 12px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-preview { background: #ebf8ff; color: var(--accent); }
    .btn-approve { background: rgba(56, 161, 105, 0.12); color: var(--success); }
    .btn-redo { background: rgba(214, 158, 46, 0.14); color: var(--warning); }
    .btn-reject { background: rgba(229, 62, 62, 0.12); color: var(--error); }
    .empty {
      padding: 24px;
      text-align: center;
      color: var(--muted);
      border: 1px dashed var(--border);
      border-radius: 16px;
      background: #fbfdff;
    }
    .modal {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.48);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .modal.open { display: flex; }
    .modal-card {
      width: 80%;
      height: 80%;
      padding: 20px;
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: 16px;
      overflow: hidden;
    }
    .modal-body {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
      overflow: auto;
      background: #f8fafc;
    }
    .modal-footer {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .subtle { color: var(--muted); font-size: 0.95rem; }
    @media (max-width: 900px) {
      .stats, .filters, .grid { grid-template-columns: 1fr; }
      .modal-card { width: 94%; height: 86%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <a href="/">Mission Control</a>
      <a class="active" href="/review">Review</a>
      <a href="/x-posts">X Posts</a>
    </nav>

    <section class="stats">
      <div class="stat-card">
        <div class="stat-label">Pending</div>
        <div class="stat-value amber" id="pending-count">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Approved</div>
        <div class="stat-value green" id="approved-count">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Categories</div>
        <div class="stat-value" id="category-count">0</div>
      </div>
    </section>

    <section class="filters">
      <div class="filter-group" id="category-filters">
        <button class="filter-btn active" data-category="all">All</button>
        <button class="filter-btn" data-category="product">Products</button>
        <button class="filter-btn" data-category="notebooklm">NotebookLM</button>
        <button class="filter-btn" data-category="visuals">Visuals</button>
        <button class="filter-btn" data-category="dashboard">Dashboard</button>
      </div>
      <div><input id="search-input" type="search" placeholder="Search review items"></div>
      <div><input id="auth-token" type="password" placeholder="Admin token for actions"></div>
    </section>

    <div id="items-grid" class="grid"></div>
  </div>

  <div id="preview-modal" class="modal" aria-hidden="true">
    <div class="modal-card">
      <div>
        <h2 id="modal-title">Preview</h2>
        <div id="modal-path" class="subtle">No path</div>
      </div>
      <div id="modal-body" class="modal-body">No preview available.</div>
      <div class="modal-footer">
        <textarea id="redo-comment" rows="2" placeholder="Redo comment (optional)"></textarea>
        <div class="actions">
          <button class="btn btn-approve" id="modal-approve">Approve</button>
          <button class="btn btn-redo" id="modal-redo">Redo</button>
          <button class="btn btn-reject" id="modal-reject">Reject</button>
          <button class="btn" id="modal-close">Close</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const app = {
      items: [],
      filter: 'all',
      search: '',
      activeItem: null,
    };

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function itemIcon(type) {
      const normalized = String(type || '').toLowerCase();
      if (normalized.includes('pdf')) return 'fa-file-pdf';
      if (normalized.includes('json')) return 'fa-file-code';
      if (normalized.includes('image') || normalized.includes('png') || normalized.includes('jpg')) return 'fa-file-image';
      return 'fa-file-lines';
    }

    function categoryLabel(category) {
      const value = String(category || 'other');
      if (value === 'product') return 'Products';
      if (value === 'notebooklm') return 'NotebookLM';
      if (value === 'visuals') return 'Visuals';
      if (value === 'dashboard') return 'Dashboard';
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    function filteredItems() {
      return app.items.filter((item) => {
        const categoryMatch = app.filter === 'all' || String(item.category || '').toLowerCase() === app.filter;
        const haystack = [item.name, item.description, item.category, item.id].join(' ').toLowerCase();
        const searchMatch = !app.search || haystack.includes(app.search);
        return categoryMatch && searchMatch;
      });
    }

    function renderStats() {
      const pending = app.items.filter((item) => item.status === 'pending' || item.status === 'redo').length;
      const approved = app.items.filter((item) => item.status === 'approved').length;
      const categories = new Set(app.items.map((item) => String(item.category || 'other').toLowerCase())).size;
      document.getElementById('pending-count').textContent = String(pending);
      document.getElementById('approved-count').textContent = String(approved);
      document.getElementById('category-count').textContent = String(categories);
    }

    function renderGrid() {
      renderStats();
      const grid = document.getElementById('items-grid');
      const items = filteredItems();
      if (items.length === 0) {
        grid.innerHTML = '<div class="empty">No data</div>';
        return;
      }

      grid.innerHTML = items.map((item) => {
        return '<article class="card">' +
          '<div class="card-top">' +
            '<div><i class="fa-solid ' + itemIcon(item.type) + '"></i> <strong>' + escapeHtml(item.name || 'Untitled') + '</strong></div>' +
            '<span class="badge">' + escapeHtml(item.status || 'pending') + '</span>' +
          '</div>' +
          '<div class="subtle">' + escapeHtml(categoryLabel(item.category)) + ' -- ' + escapeHtml(item.size || '--') + '</div>' +
          '<div class="subtle">' + escapeHtml(item.date || item.modified || 'No date') + '</div>' +
          '<p>' + escapeHtml(item.description || 'No description') + '</p>' +
          '<div class="actions">' +
            '<button class="btn btn-preview" data-action="preview" data-id="' + escapeHtml(item.id) + '">Preview</button>' +
            '<button class="btn btn-approve" data-action="approve" data-id="' + escapeHtml(item.id) + '">Approve</button>' +
            '<button class="btn btn-redo" data-action="redo" data-id="' + escapeHtml(item.id) + '">Redo</button>' +
            '<button class="btn btn-reject" data-action="reject" data-id="' + escapeHtml(item.id) + '">Reject</button>' +
          '</div>' +
        '</article>';
      }).join('');
    }

    function openModal(item) {
      app.activeItem = item;
      document.getElementById('modal-title').textContent = item.name || 'Preview';
      document.getElementById('modal-path').textContent = item.path || 'No path';
      document.getElementById('modal-body').innerHTML =
        '<div><strong>Category:</strong> ' + escapeHtml(categoryLabel(item.category)) + '</div>' +
        '<div><strong>Type:</strong> ' + escapeHtml(item.type || '--') + '</div>' +
        '<div><strong>Size:</strong> ' + escapeHtml(item.size || '--') + '</div>' +
        '<div><strong>Status:</strong> ' + escapeHtml(item.status || 'pending') + '</div><hr>' +
        '<div>' + escapeHtml(item.description || 'No description') + '</div>';
      document.getElementById('preview-modal').classList.add('open');
      document.getElementById('preview-modal').setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
      app.activeItem = null;
      document.getElementById('preview-modal').classList.remove('open');
      document.getElementById('preview-modal').setAttribute('aria-hidden', 'true');
    }

    async function applyAction(id, action, comment) {
      const token = document.getElementById('auth-token').value.trim();
      if (!token) {
        alert('Admin token required for review actions.');
        return;
      }

      const payload = action === 'redo' && comment ? { comment } : {};
      const response = await fetch('/api/review/' + encodeURIComponent(id) + '/' + action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errorPayload.error || 'Request failed');
      }

      const result = await response.json();
      const index = app.items.findIndex((item) => item.id === id);
      if (index >= 0) {
        app.items[index] = result.item;
      }
      renderGrid();
      if (app.activeItem && app.activeItem.id === id) {
        openModal(result.item);
      }
    }

    async function fetchReviews() {
      const response = await fetch('/api/reviews', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Unable to load reviews');
      }

      const payload = await response.json();
      app.items = Array.isArray(payload.items) ? payload.items : [];
      renderGrid();
    }

    document.getElementById('category-filters').addEventListener('click', (event) => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      app.filter = button.getAttribute('data-category');
      Array.from(document.querySelectorAll('.filter-btn')).forEach((node) => node.classList.toggle('active', node === button));
      renderGrid();
    });

    document.getElementById('search-input').addEventListener('input', (event) => {
      app.search = event.target.value.trim().toLowerCase();
      renderGrid();
    });

    document.getElementById('items-grid').addEventListener('click', async (event) => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const id = button.getAttribute('data-id');
      const action = button.getAttribute('data-action');
      const item = app.items.find((entry) => entry.id === id);
      if (!item) return;

      if (action === 'preview') {
        openModal(item);
        return;
      }

      try {
        await applyAction(id, action, '');
      } catch (error) {
        alert(error.message);
      }
    });

    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('preview-modal').addEventListener('click', (event) => {
      if (event.target.id === 'preview-modal') closeModal();
    });
    document.getElementById('modal-approve').addEventListener('click', async () => {
      if (!app.activeItem) return;
      try {
        await applyAction(app.activeItem.id, 'approve', '');
      } catch (error) {
        alert(error.message);
      }
    });
    document.getElementById('modal-reject').addEventListener('click', async () => {
      if (!app.activeItem) return;
      try {
        await applyAction(app.activeItem.id, 'reject', '');
      } catch (error) {
        alert(error.message);
      }
    });
    document.getElementById('modal-redo').addEventListener('click', async () => {
      if (!app.activeItem) return;
      try {
        await applyAction(app.activeItem.id, 'redo', document.getElementById('redo-comment').value.trim());
      } catch (error) {
        alert(error.message);
      }
    });

    fetchReviews().catch(() => {
      document.getElementById('items-grid').innerHTML = '<div class="empty">No data</div>';
    });
  </script>
</body>
</html>`;

export default reviewHtml;
