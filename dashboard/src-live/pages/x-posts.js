const xPostsHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Forge X Posts</title>
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
    .container { max-width: 1360px; margin: 0 auto; padding: 24px; }
    .nav, .stats, .column, .rules {
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
    .stat-label { color: var(--muted); margin-bottom: 8px; }
    .stat-value { font-size: 2rem; font-weight: 700; color: var(--primary); }
    .columns {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .column { overflow: hidden; }
    .column-header {
      padding: 16px 18px;
      font-weight: 700;
      color: white;
    }
    .column-header.forge { background: var(--accent); }
    .column-header.lucas { background: #4a5568; }
    .post-list {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .post-card {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px;
      background: #f8fafc;
    }
    .post-text {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 10px;
      line-height: 1.5;
    }
    .post-meta {
      color: var(--muted);
      font-size: 0.9rem;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .rules { padding: 18px; }
    .empty {
      padding: 22px;
      border: 1px dashed var(--border);
      border-radius: 14px;
      text-align: center;
      color: var(--muted);
    }
    @media (max-width: 900px) {
      .stats, .columns { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <a href="/">Mission Control</a>
      <a href="/review">Review</a>
      <a class="active" href="/x-posts">X Posts</a>
    </nav>

    <section class="stats">
      <div>
        <div class="stat-label">@Forge_Builds posts today</div>
        <div class="stat-value" id="forge-count">0</div>
      </div>
      <div>
        <div class="stat-label">@LucasJOliver_78 posts today</div>
        <div class="stat-value" id="lucas-count">0</div>
      </div>
      <div>
        <div class="stat-label">Posting cadence</div>
        <div class="stat-value" id="cadence">No data</div>
      </div>
    </section>

    <section class="columns">
      <article class="column">
        <div class="column-header forge">Forge Posts</div>
        <div class="post-list" id="forge-posts"></div>
      </article>
      <article class="column">
        <div class="column-header lucas">Lucas Posts</div>
        <div class="post-list" id="lucas-posts"></div>
      </article>
    </section>

    <section class="rules">
      <h2>Posting Rules</h2>
      <p>Live post activity syncs from Forge every 60 seconds. Use thoughtful cadence, keep copy concise, and avoid duplicate topics in the same cycle.</p>
    </section>
  </div>

  <script>
    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderPosts(containerId, account) {
      const root = document.getElementById(containerId);
      const posts = account && Array.isArray(account.recentPosts) ? account.recentPosts : [];
      if (posts.length === 0) {
        root.innerHTML = '<div class="empty">No data</div>';
        return;
      }

      root.innerHTML = posts.map((post) => {
        return '<div class="post-card">' +
          '<div class="post-text">' + escapeHtml(post.text || '') + '</div>' +
          '<div class="post-meta"><span>' + escapeHtml(post.time || '--') + '</span><span>' + escapeHtml(String(post.chars ?? 0)) + ' chars</span></div>' +
        '</div>';
      }).join('');
    }

    async function fetchState() {
      try {
        const response = await fetch('/api/state', { cache: 'no-store' });
        if (!response.ok) throw new Error('Request failed');
        const state = await response.json();
        const xPosts = state && state.xPosts ? state.xPosts : {};
        const forge = xPosts.forge || {};
        const lucas = xPosts.lucas || {};

        document.getElementById('forge-count').textContent = String(forge.postsToday ?? 0);
        document.getElementById('lucas-count').textContent = String(lucas.postsToday ?? 0);
        const totalPosts = Number(forge.postsToday || 0) + Number(lucas.postsToday || 0);
        document.getElementById('cadence').textContent = totalPosts > 0 ? totalPosts + ' posts today' : 'No data';

        renderPosts('forge-posts', forge);
        renderPosts('lucas-posts', lucas);
      } catch (error) {
        document.getElementById('cadence').textContent = 'Offline -- data unavailable';
        renderPosts('forge-posts', null);
        renderPosts('lucas-posts', null);
      }
    }

    fetchState();
    setInterval(fetchState, 60000);
  </script>
</body>
</html>`;

export default xPostsHtml;
