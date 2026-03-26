const missionControlHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Forge Mission Control</title>
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
      --radius: 16px;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
    }
    a { color: inherit; text-decoration: none; }
    .container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 24px;
    }
    .nav {
      display: flex;
      gap: 12px;
      align-items: center;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 999px;
      box-shadow: var(--shadow-sm);
      padding: 10px;
      margin-bottom: 24px;
      overflow-x: auto;
    }
    .nav a {
      padding: 10px 16px;
      border-radius: 999px;
      color: var(--muted);
      white-space: nowrap;
    }
    .nav a.active {
      background: var(--primary);
      color: white;
    }
    .header-card, .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg), var(--shadow-sm);
    }
    .header-card {
      padding: 24px;
      display: grid;
      grid-template-columns: 1.8fr 1fr 1fr;
      gap: 20px;
      align-items: center;
      margin-bottom: 24px;
    }
    .title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
      margin: 0 0 8px;
    }
    .subtle {
      color: var(--muted);
      font-size: 0.95rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .badge.online { background: rgba(56, 161, 105, 0.12); color: var(--success); }
    .badge.idle { background: rgba(214, 158, 46, 0.12); color: var(--warning); }
    .badge.error { background: rgba(229, 62, 62, 0.12); color: var(--error); }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }
    .metric-card {
      padding: 20px;
    }
    .metric-label {
      color: var(--muted);
      font-size: 0.9rem;
      margin-bottom: 10px;
    }
    .metric-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
    }
    .task-card, .status-card, .split-card {
      padding: 20px;
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--primary);
      margin: 0 0 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px 10px;
      border-top: 1px solid var(--border);
      text-align: left;
      vertical-align: top;
      font-size: 0.95rem;
    }
    th {
      color: var(--muted);
      font-weight: 600;
      border-top: none;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 0.82rem;
      font-weight: 700;
    }
    .status-done { background: rgba(56, 161, 105, 0.12); color: var(--success); }
    .status-ready { background: rgba(49, 130, 206, 0.12); color: var(--accent); }
    .status-blocked { background: rgba(214, 158, 46, 0.16); color: var(--warning); }
    .split-grid {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }
    .schedule-grid {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 12px;
    }
    .schedule-item {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 12px;
      min-height: 92px;
      background: #f8fafc;
      position: relative;
    }
    .schedule-item.completed { background: rgba(56, 161, 105, 0.10); border-color: rgba(56, 161, 105, 0.25); }
    .schedule-item.current { background: rgba(49, 130, 206, 0.10); border-color: rgba(49, 130, 206, 0.35); animation: pulse 1.8s infinite; }
    .schedule-item.upcoming { background: #f8fafc; }
    .schedule-hour { font-size: 0.82rem; color: var(--muted); margin-bottom: 8px; }
    .schedule-name { font-weight: 700; font-size: 0.92rem; margin-bottom: 6px; }
    .schedule-type { font-size: 0.82rem; text-transform: uppercase; color: var(--muted); letter-spacing: 0.04em; }
    .history-list {
      max-height: 520px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .history-item {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px;
      background: #f8fafc;
    }
    .history-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 6px;
      font-weight: 600;
    }
    .status-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
    }
    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      display: inline-block;
    }
    .dot.online { background: var(--success); }
    .dot.offline { background: var(--error); }
    .empty {
      padding: 18px;
      border: 1px dashed var(--border);
      border-radius: 14px;
      color: var(--muted);
      text-align: center;
      background: #fbfdff;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(49, 130, 206, 0.25); }
      70% { box-shadow: 0 0 0 10px rgba(49, 130, 206, 0); }
      100% { box-shadow: 0 0 0 0 rgba(49, 130, 206, 0); }
    }
    @media (max-width: 900px) {
      .header-card, .metric-grid, .split-grid { grid-template-columns: 1fr; }
      .schedule-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    @media (max-width: 600px) {
      .container { padding: 16px; }
      .schedule-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .title { font-size: 1.6rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <a class="active" href="/">Mission Control</a>
      <a href="/review">Review</a>
      <a href="/x-posts">X Posts</a>
    </nav>

    <section class="header-card">
      <div>
        <h1 class="title">Forge Mission Control</h1>
        <div class="subtle" id="last-updated">No data</div>
      </div>
      <div>
        <div class="subtle">Eastern Time</div>
        <div class="metric-value" id="live-clock">--:--:--</div>
      </div>
      <div>
        <div id="status-badge" class="badge idle"><i class="fa-solid fa-circle-info"></i><span>Offline -- data unavailable</span></div>
        <div class="subtle" id="next-session">Next session -- No data</div>
      </div>
    </section>

    <section class="metric-grid">
      <article class="card metric-card">
        <div class="metric-label">Revenue</div>
        <div class="metric-value" id="revenue-total">$0</div>
      </article>
      <article class="card metric-card">
        <div class="metric-label">DeepSeek Balance</div>
        <div class="metric-value" id="deepseek-balance">$44.78</div>
      </article>
      <article class="card metric-card">
        <div class="metric-label">Queue</div>
        <div class="metric-value" id="queue-summary">No data</div>
      </article>
    </section>

    <section class="card task-card">
      <h2 class="section-title">Task Queue</h2>
      <div id="task-table-wrap" class="empty">No data</div>
    </section>

    <section class="split-grid">
      <article class="card split-card">
        <h2 class="section-title">Daily Schedule</h2>
        <div id="schedule-grid" class="schedule-grid"></div>
      </article>
      <article class="card split-card">
        <h2 class="section-title">Work History</h2>
        <div id="history-list" class="history-list"></div>
      </article>
    </section>

    <section class="card status-card">
      <h2 class="section-title">System Status</h2>
      <div id="status-bar" class="status-bar"></div>
    </section>
  </div>

  <script>
    const state = { data: null };

    function formatCurrency(value) {
      const amount = typeof value === 'number' ? value : Number(value || 0);
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    function updateClock() {
      const now = new Date();
      document.getElementById('live-clock').textContent = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      }).format(now);
    }

    function renderTasks(tasks) {
      const wrap = document.getElementById('task-table-wrap');
      if (!Array.isArray(tasks) || tasks.length === 0) {
        wrap.className = 'empty';
        wrap.textContent = 'No data';
        return;
      }

      wrap.className = '';
      const rows = tasks.map((task) => {
        const status = String(task.status || 'READY').toUpperCase();
        const statusClass = status === 'DONE' ? 'status-done' : (status === 'BLOCKED' ? 'status-blocked' : 'status-ready');
        return '<tr>' +
          '<td><span class="pill">' + (task.priority ?? '--') + '</span></td>' +
          '<td><strong>' + escapeHtml(task.title || 'Untitled task') + '</strong></td>' +
          '<td><span class="pill ' + statusClass + '">' + escapeHtml(status) + '</span></td>' +
          '<td>' + escapeHtml(task.notes || '--') + '</td>' +
        '</tr>';
      }).join('');

      wrap.innerHTML =
        '<table><thead><tr><th>Priority</th><th>Task</th><th>Status</th><th>Notes</th></tr></thead><tbody>' +
        rows +
        '</tbody></table>';
    }

    function renderSchedule(items) {
      const grid = document.getElementById('schedule-grid');
      const scheduleItems = Array.isArray(items) ? items : [];
      const byHour = new Map(scheduleItems.map((item) => [Number(item.hour), item]));
      const fullDay = Array.from({ length: 24 }, function(_, hour) {
        return byHour.get(hour) || { hour: hour, type: hour % 6 === 0 ? 'manager' : 'worker', name: 'Open slot', status: 'upcoming' };
      });

      grid.innerHTML = fullDay.map((item) => {
        const hour = Number.isFinite(item.hour) ? String(item.hour).padStart(2, '0') + ':00' : '--:--';
        const status = item.status || 'upcoming';
        return '<div class="schedule-item ' + escapeHtml(status) + '">' +
          '<div class="schedule-hour">' + escapeHtml(hour) + '</div>' +
          '<div class="schedule-name">' + escapeHtml(item.name || 'Unscheduled') + '</div>' +
          '<div class="schedule-type">' + escapeHtml(item.type || 'session') + '</div>' +
        '</div>';
      }).join('');
    }

    function renderHistory(items) {
      const list = document.getElementById('history-list');
      if (!Array.isArray(items) || items.length === 0) {
        list.innerHTML = '<div class="empty">No data</div>';
        return;
      }

      list.innerHTML = items.map((entry) => {
        return '<div class="history-item">' +
          '<div class="history-top"><span>' + escapeHtml(entry.session_id || 'Unknown session') + '</span><span>' + escapeHtml(entry.outcome || '--') + '</span></div>' +
          '<div class="subtle">Task ' + escapeHtml(entry.task_id || '--') + ' -- ' + escapeHtml(String(entry.duration_minutes ?? '--')) + ' min</div>' +
          '<div>' + escapeHtml(entry.notes || 'No notes') + '</div>' +
        '</div>';
      }).join('');
    }

    function renderApiStatus(apis) {
      const bar = document.getElementById('status-bar');
      const entries = apis && typeof apis === 'object' ? Object.entries(apis) : [];
      if (entries.length === 0) {
        bar.innerHTML = '<div class="empty">No data</div>';
        return;
      }

      bar.innerHTML = entries.map(([name, status]) => {
        const online = String(status).toLowerCase() === 'online';
        return '<span class="status-chip"><span class="dot ' + (online ? 'online' : 'offline') + '"></span>' +
          escapeHtml(name) + ': ' + escapeHtml(status) + '</span>';
      }).join('');
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderState(data, offlineMessage) {
      const status = data && data.system ? (data.system.status || 'idle') : 'idle';
      const badge = document.getElementById('status-badge');
      badge.className = 'badge ' + (status === 'online' ? 'online' : (status === 'error' ? 'error' : 'idle'));
      badge.innerHTML = '<i class="fa-solid fa-signal"></i><span>' + escapeHtml(offlineMessage || status) + '</span>';

      document.getElementById('last-updated').textContent =
        data && data.lastUpdated ? 'Last updated -- ' + new Date(data.lastUpdated).toLocaleString('en-US', { timeZone: 'America/New_York' }) : 'Last updated -- No data';
      document.getElementById('next-session').textContent =
        data && data.system && data.system.nextSession ? 'Next session -- ' + (data.system.nextSession.name || 'Unknown') + ' in ' + (data.system.nextSession.in || '--') : 'Next session -- No data';
      document.getElementById('revenue-total').textContent = formatCurrency(data && data.revenue ? data.revenue.total : 0);
      document.getElementById('deepseek-balance').textContent = formatCurrency(data && data.system ? data.system.deepseekBalance : 0);

      const stats = data && data.queue && data.queue.stats ? data.queue.stats : {};
      document.getElementById('queue-summary').textContent = (stats.ready ?? 0) + ' ready / ' + (stats.done ?? 0) + ' done';

      renderTasks(data && data.queue ? data.queue.tasks : []);
      renderSchedule(data && Array.isArray(data.schedule) ? data.schedule : []);
      renderHistory(data && Array.isArray(data.sessions) ? data.sessions : []);
      renderApiStatus(data && data.apis ? data.apis : {});
    }

    async function fetchState() {
      try {
        const response = await fetch('/api/state', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Request failed');
        }

        const payload = await response.json();
        if (payload && payload.status === 'no data yet') {
          renderState(null, 'Offline -- data unavailable');
          return;
        }

        state.data = payload;
        renderState(payload, payload.system && payload.system.status ? payload.system.status : 'online');
      } catch (error) {
        renderState(state.data, 'Offline -- data unavailable');
      }
    }

    updateClock();
    setInterval(updateClock, 1000);
    fetchState();
    setInterval(fetchState, 60000);
  </script>
</body>
</html>`;

export default missionControlHtml;
