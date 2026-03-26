import { sharedComponentStyles } from './shared/components.js';
import { renderSharedShellStyles, renderTopbar } from './shared/shell.js';
import { renderCompactTokenDeclarations } from './shared/tokens.js';

const videoLabHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Forge Video Lab</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
  <style>
    :root {
      --bg: #050c13;
      --panel: rgba(10, 20, 31, 0.9);
      --panel-2: rgba(13, 24, 36, 0.92);
      --border: rgba(149, 176, 206, 0.14);
      --text: #f5f8fc;
      --muted: #aab9cd;
      --soft: #70849b;
      --blue: #79bcff;
      --orange: #ff9e52;
      --green: #35d3a3;
      --red: #ff6c7b;
      --shadow: 0 28px 72px rgba(0, 0, 0, 0.34);
      --radius: 28px;
      --radius-md: 20px;
${renderCompactTokenDeclarations({
  '--shell-max-width': '1540px',
  '--shell-padding': '24px 24px 44px',
  '--shell-text-primary': 'var(--text)',
  '--shell-text-secondary': 'var(--muted)',
  '--shell-text-tertiary': 'var(--soft)',
  '--shell-border': 'var(--border)',
  '--shell-accent': 'var(--blue)',
  '--shell-accent-strong': 'var(--blue)',
  '--shell-topbar-margin': '14px',
  '--component-section-title-size': '22px',
  '--component-section-title-spacing': '-0.04em',
  '--component-metric-value-size': '42px',
})}
    }

    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      min-height: 100%;
      background:
        radial-gradient(circle at 10% 16%, rgba(121, 188, 255, 0.18), transparent 26%),
        radial-gradient(circle at 92% 12%, rgba(255, 158, 82, 0.14), transparent 24%),
        linear-gradient(180deg, #04090f 0%, #071019 52%, #09111a 100%);
      color: var(--text);
      font-family: "Space Grotesk", "Segoe UI", sans-serif;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: linear-gradient(180deg, rgba(0,0,0,0.75), transparent 92%);
    }
    a { color: inherit; text-decoration: none; }
${renderSharedShellStyles()}
    .brand-kicker, .eyebrow, .section-subtle, .pill, .detail-label {
      font-family: "IBM Plex Mono", monospace;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 11px;
    }
    .brand-kicker, .eyebrow { color: var(--blue); }
    .panel {
      position: relative; overflow: hidden; background: var(--panel); border: 1px solid var(--border);
      border-radius: var(--radius); box-shadow: var(--shadow); backdrop-filter: blur(16px);
    }
    .panel::before {
      content: ""; position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(180deg, rgba(255,255,255,0.03), transparent 40%);
    }
    .hero {
      display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr); gap: 20px;
      padding: 30px; margin-bottom: 18px;
      background:
        radial-gradient(circle at 10% 18%, rgba(121, 188, 255, 0.12), transparent 28%),
        radial-gradient(circle at 90% 10%, rgba(255, 158, 82, 0.16), transparent 24%),
        linear-gradient(145deg, rgba(11, 21, 31, 0.94), rgba(8, 14, 22, 0.96));
    }
    .eyebrow {
      display: inline-flex; align-items: center; gap: 10px; padding: 9px 14px; border-radius: 999px;
      background: rgba(106, 179, 255, 0.09); border: 1px solid rgba(149, 206, 255, 0.14); margin-bottom: 18px;
    }
    .hero h1 { margin: 0; font-size: clamp(3rem, 6vw, 5.2rem); line-height: 0.9; letter-spacing: -0.07em; max-width: 8ch; }
    .hero-copy p, .hero-copy .copy { margin: 18px 0 0; max-width: 62ch; color: var(--muted); font-size: 1.02rem; line-height: 1.8; }
    .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
${sharedComponentStyles}
    .telemetry-card {
      padding: 20px; border-radius: var(--component-section-radius); background: var(--component-section-bg);
      border: var(--component-section-border); box-shadow: var(--component-section-shadow);
    }
    .telemetry-label, .section-subtle, .detail-label { color: var(--soft); }
    .telemetry-title { font-size: 30px; font-weight: 700; letter-spacing: -0.05em; margin: 10px 0; }
    .telemetry-copy { color: var(--muted); font-size: 14px; line-height: 1.7; }
    .telemetry-list, .clip-list, .scene-list, .export-list, .detail-list { display: grid; gap: 12px; }
    .telemetry-row, .detail-row {
      display: flex; justify-content: space-between; gap: 12px; align-items: center;
      color: var(--muted); font-size: 14px; line-height: 1.6;
    }
    .telemetry-row strong, .detail-row strong { color: var(--text); font-weight: 600; text-align: right; }
    .main-grid { display: grid; gap: 18px; margin-top: 18px; }
    .metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .main-grid { grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr); align-items: start; }
    .main-grid > .section-card:last-child { grid-column: span 2; }
    .metric-value { font-size: 42px; letter-spacing: -0.06em; font-weight: 700; margin-bottom: 8px; }
    .metric-copy { color: var(--muted); line-height: 1.6; font-size: 14px; }
    .card {
      padding: 18px; border-radius: var(--radius-md); background: rgba(255,255,255,0.03); border: 1px solid var(--border);
    }
    .card.clip { border-left: 4px solid rgba(121, 188, 255, 0.84); padding-left: 14px; }
    .card.scene { border-left: 4px solid rgba(255, 158, 82, 0.84); padding-left: 14px; }
    .card.export { border-left: 4px solid rgba(53, 211, 163, 0.84); padding-left: 14px; }
    .card-top { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; margin-bottom: 10px; }
    .card-title { font-size: 16px; font-weight: 600; line-height: 1.4; letter-spacing: -0.02em; }
    .card-copy { color: var(--muted); font-size: 14px; line-height: 1.7; }
    @keyframes beat {
      0%, 100% { transform: scaleY(0.32); opacity: 0.42; }
      20% { transform: scaleY(0.88); opacity: 0.9; }
      50% { transform: scaleY(0.48); opacity: 0.65; }
      74% { transform: scaleY(1); opacity: 1; }
    }
    @media (max-width: 1240px) {
      .hero, .main-grid, .metric-grid, .topbar { grid-template-columns: 1fr; }
      .topbar-meta { justify-self: start; }
    }
  </style>
</head>
<body>
  <div class="app-shell">
${renderTopbar({
  title: 'Forge Video Lab',
  activePath: '/launchpad',
})}

    <section class="panel hero">
      <div class="hero-copy">
        <div class="eyebrow"><i class="fa-solid fa-clapperboard"></i> Motion pipeline command surface</div>
        <h1>Turn Receipts Into Motion.</h1>
        <div class="copy" id="hero-copy">Waiting for live state.</div>
        <div class="hero-actions">
          <a class="button-link primary" href="/launchpad"><i class="fa-solid fa-rocket"></i> Open launchpad</a>
          <a class="button-link" href="/x-posts"><i class="fa-brands fa-x-twitter"></i> Open broadcast</a>
        </div>
      </div>
      <div class="hero-side">
        <div class="telemetry-card">
          <div class="telemetry-label">Motion posture</div>
          <div class="telemetry-title">Video stack loaded</div>
          <div class="telemetry-copy">Roger clips, vertical covers, story hooks, and Excalidraw assets are enough to start pushing short-form video immediately.</div>
        </div>
        <div class="telemetry-card">
          <div class="telemetry-label">Lab readout</div>
          <div class="telemetry-list">
            <div class="telemetry-row"><span>Voice clips</span><strong>16</strong></div>
            <div class="telemetry-row"><span>Vertical covers</span><strong>3+</strong></div>
            <div class="telemetry-row"><span>Excalidraw boards</span><strong>5+</strong></div>
            <div class="telemetry-row"><span>Format target</span><strong>1080x1920</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section class="metric-grid">
      <article class="metric-card">
        <div class="detail-label">Roger inventory</div>
        <div class="metric-value">16</div>
        <div class="metric-copy">Hooks and chapter intros ready for voice-led video.</div>
      </article>
      <article class="metric-card">
        <div class="detail-label">Production queue</div>
        <div class="metric-value">3</div>
        <div class="metric-copy">Highest-priority videos already mapped for immediate render.</div>
      </article>
      <article class="metric-card">
        <div class="detail-label">Scene recipe</div>
        <div class="metric-value">5</div>
        <div class="metric-copy">Cold open, stat, explanation, fix, CTA.</div>
      </article>
      <article class="metric-card">
        <div class="detail-label">Last sync</div>
        <div class="metric-value" id="sync-metric">live</div>
        <div class="metric-copy">Pulling state only for dashboard context. Motion stays separate.</div>
      </article>
    </section>

    <section class="main-grid">
      <div class="section-card">
        <div class="section-header">
          <div class="section-title">Immediate Video Queue</div>
          <div class="section-subtle">Render these first</div>
        </div>
        <div class="clip-list">
          <article class="card clip">
            <div class="card-top"><span class="pill"><i class="fa-solid fa-microphone-lines"></i> Roger</span><span class="pill">clip 01</span></div>
            <div class="card-title">The $75/Day Leak</div>
            <div class="card-copy">Use <strong>forge-75-day-dude.mp3</strong> with the vertical cover and land on the silent model fallback story.</div>
          </article>
          <article class="card clip">
            <div class="card-top"><span class="pill"><i class="fa-solid fa-microphone-lines"></i> Roger</span><span class="pill">clip 02</span></div>
            <div class="card-title">Speed-Running Mediocrity</div>
            <div class="card-copy">Use <strong>forge-9-tasks-dude.mp3</strong> and visually break shallow work vs useful work.</div>
          </article>
          <article class="card clip">
            <div class="card-top"><span class="pill"><i class="fa-solid fa-microphone-lines"></i> Roger</span><span class="pill">clip 03</span></div>
            <div class="card-title">The Agent Assigned Me Homework</div>
            <div class="card-copy">Use <strong>forge-homework-dude.mp3</strong> and show the queue rule that banned this behavior.</div>
          </article>
          <article class="card clip">
            <div class="card-top"><span class="pill"><i class="fa-solid fa-user-astronaut"></i> Vince</span><span class="pill">avatar 01</span></div>
            <div class="card-title">Forge Intro Avatar Cut</div>
            <div class="card-copy">Use <strong>forge-intro-dude.mp3</strong> first. If Vince looks right here, the rest of the avatar lane becomes worth scaling.</div>
          </article>
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <div class="section-title">Scene Recipe</div>
          <div class="section-subtle">Keep every short coherent</div>
        </div>
        <div class="scene-list">
          <article class="card scene"><div class="card-title">1. Cold open quote</div><div class="card-copy">Start with the funniest or most painful line immediately.</div></article>
          <article class="card scene"><div class="card-title">2. Brutal stat</div><div class="card-copy">One number on screen. No clutter. Let it hit.</div></article>
          <article class="card scene"><div class="card-title">3. Visual explanation</div><div class="card-copy">Use Excalidraw or a card to explain what actually happened.</div></article>
          <article class="card scene"><div class="card-title">4. Fix</div><div class="card-copy">Show the config, rule, or system change that solved it.</div></article>
          <article class="card scene"><div class="card-title">5. CTA</div><div class="card-copy">Follow Forge, open the story, or buy the guide.</div></article>
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <div class="section-title">Locked Scene Map</div>
          <div class="section-subtle">Claude handoff ready</div>
        </div>
        <div class="scene-list">
          <article class="card scene">
            <div class="card-top"><span class="pill"><i class="fa-solid fa-diagram-project"></i> B&G 01</span><span class="pill">clip 01</span></div>
            <div class="card-title">$75/Day Leak</div>
            <div class="card-copy">Open on the line, hit the leak number, flash the before/after cost plate, then land on the fix and guide CTA.</div>
          </article>
          <article class="card scene">
            <div class="card-top"><span class="pill"><i class="fa-solid fa-diagram-project"></i> B&G 02</span><span class="pill">clip 02</span></div>
            <div class="card-title">Speed-Running Mediocrity</div>
            <div class="card-copy">Pair the 9-in-43 stat with the shallow-task board, then show how the metric lied before landing on the review-loop fix.</div>
          </article>
          <article class="card scene">
            <div class="card-top"><span class="pill"><i class="fa-solid fa-user-astronaut"></i> Vince</span><span class="pill">avatar 03</span></div>
            <div class="card-title">Forge Intro / Credibility Cut</div>
            <div class="card-copy">Use Vince for the cold open and CTA, then cut to diagrams and stat plates so the avatar sells the thesis without carrying the whole video alone.</div>
          </article>
          <article class="card scene">
            <div class="card-top"><span class="pill"><i class="fa-solid fa-file-lines"></i> handoff</span><span class="pill">exact map</span></div>
            <div class="card-title">Use the scene map doc</div>
            <div class="card-copy"><strong>FORGE-EXCALIDRAW-VINCE-SCENE-MAP.md</strong> locks clip order, board pairing, CTA, and export notes so production stays consistent.</div>
          </article>
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <div class="section-title">Vince Avatar Runway</div>
          <div class="section-subtle">HeyGen production queue</div>
        </div>
        <div class="export-list">
          <article class="card export">
            <div class="card-title">1. Lock Vince as the recurring face</div>
            <div class="card-copy">One avatar, same outfit vibe, same background, same energy. If the face changes, the brand gets weaker immediately.</div>
          </article>
          <article class="card export">
            <div class="card-title">2. Start with the intro clip</div>
            <div class="card-copy">Do not start with the hardest script. Generate the intro first so you can judge whether the avatar feels believable or just expensive.</div>
          </article>
          <article class="card export">
            <div class="card-title">3. Then push the $75/day leak</div>
            <div class="card-copy">That is the strongest stat-driven hook and the best bridge into the guide, the story page, and the whole Forge experiment.</div>
          </article>
          <article class="card export">
            <div class="card-title">4. Use the production doc</div>
            <div class="card-copy"><strong>FORGE-HEYGEN-VINCE-PRODUCTION.md</strong> maps the first three avatar videos, the shot rhythm, and the CTA rules.</div>
          </article>
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <div class="section-title">Re-Motion Export Plan</div>
          <div class="section-subtle">Separate workspace, clean output</div>
        </div>
        <div class="export-list">
          <article class="card export">
            <div class="card-title">1. Keep motion separate</div>
            <div class="card-copy">Use a separate motion workspace. Do not bolt Re-Motion into the Worker app.</div>
          </article>
          <article class="card export">
            <div class="card-title">2. Export Excalidraw boards to PNG</div>
            <div class="card-copy">Prefer high-res PNG export first, then treat those as scene plates inside Re-Motion.</div>
          </article>
          <article class="card export">
            <div class="card-title">3. Render 1080x1920 first</div>
            <div class="card-copy">One format wins the fastest: vertical shorts for TikTok, Reels, and X video.</div>
          </article>
          <article class="card export">
            <div class="card-title">4. Follow the handoff doc</div>
            <div class="card-copy"><strong>FORGE-REMOTION-HANDOFF.md</strong> now maps the first 3 videos and the composition pattern.</div>
          </article>
        </div>
      </div>
    </section>

    <script>
      function escapeHtml(value) {
        return String(value == null ? '' : value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function formatRelative(iso) {
        if (!iso) return 'awaiting sync';
        const target = new Date(iso);
        if (Number.isNaN(target.getTime())) return 'awaiting sync';
        const diffMinutes = Math.round((Date.now() - target.getTime()) / 60000);
        if (Math.abs(diffMinutes) < 1) return 'just now';
        if (Math.abs(diffMinutes) < 60) return diffMinutes > 0 ? diffMinutes + 'm ago' : 'in ' + Math.abs(diffMinutes) + 'm';
        const diffHours = Math.round(diffMinutes / 60);
        if (Math.abs(diffHours) < 24) return diffHours > 0 ? diffHours + 'h ago' : 'in ' + Math.abs(diffHours) + 'h';
        const diffDays = Math.round(diffHours / 24);
        return diffDays > 0 ? diffDays + 'd ago' : 'in ' + Math.abs(diffDays) + 'd';
      }

      function renderHeartbeat() {
        const strip = document.getElementById('heartbeat-strip');
        if (!strip || strip.children.length) return;
        let markup = '';
        for (let index = 0; index < 18; index += 1) {
          markup += '<span style="--i:' + index + ';"></span>';
        }
        strip.innerHTML = markup;
      }

      function setClock() {
        const node = document.getElementById('clock');
        if (!node) return;
        node.textContent = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date()) + ' ET';
      }

      const LIVE_REFRESH_INTERVAL_MS = 60000;

      function liveUrl(path) {
        const separator = path.includes('?') ? '&' : '?';
        return path + separator + '__ts=' + Date.now();
      }

      function liveFetch(path) {
        return fetch(liveUrl(path), {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        });
      }

      function wireLiveRefresh(refreshFn) {
        const safeRefresh = () => refreshFn().catch(() => {});
        window.addEventListener('focus', safeRefresh);
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) safeRefresh();
        });
      }

      async function fetchState() {
        const response = await liveFetch('/api/state');
        if (!response.ok) throw new Error('Unable to load video lab state');
        return response.json();
      }

      async function refreshState() {
        const state = await fetchState();
        document.getElementById('hero-copy').textContent =
          'Motion is the next amplifier. The clips, covers, and diagrams now need to become videos that pull attention back into the guide, the story page, and the first paid offer.';
        document.getElementById('sync-chip').innerHTML = '<strong>Synced ' + escapeHtml(formatRelative(state.lastUpdated)) + '</strong>';
        document.getElementById('sync-metric').textContent = formatRelative(state.lastUpdated);
      }

      async function boot() {
        renderHeartbeat();
        setClock();
        setInterval(setClock, 1000);
        try {
          await refreshState();
        } catch (error) {
          document.getElementById('hero-copy').textContent = error.message;
        }
        setInterval(() => {
          refreshState().catch(() => {});
        }, LIVE_REFRESH_INTERVAL_MS);
        wireLiveRefresh(refreshState);
      }

      boot();
    </script>
</body>
</html>`;

export default videoLabHtml;
