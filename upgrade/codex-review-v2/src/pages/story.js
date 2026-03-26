const storyHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Forge Story</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="preconnect" href="https://cdnjs.cloudflare.com">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --bg-void: #04070c;
      --bg-surface: rgba(10, 19, 30, 0.88);
      --bg-raised: rgba(15, 27, 41, 0.96);
      --text-primary: #f4f8fc;
      --text-secondary: #a5b7cb;
      --text-tertiary: #6d839b;
      --border: rgba(164, 188, 214, 0.12);
      --border-strong: rgba(164, 188, 214, 0.24);
      --accent: #6ab3ff;
      --accent-strong: #95ceff;
      --sun: #ff8a2d;
      --success: #32d4a4;
      --warning: #ffb144;
      --danger: #ff6b7a;
      --radius-xl: 30px;
      --radius-lg: 24px;
      --radius-md: 18px;
      --shadow-lg: 0 28px 90px rgba(0, 0, 0, 0.42);
      --shadow-md: 0 18px 48px rgba(0, 0, 0, 0.28);
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      min-height: 100%;
      background:
        radial-gradient(circle at 12% 12%, rgba(106, 179, 255, 0.16), transparent 24%),
        radial-gradient(circle at 84% 12%, rgba(255, 138, 45, 0.22), transparent 18%),
        linear-gradient(180deg, #03060a 0%, #08111a 38%, #050910 100%);
      color: var(--text-primary);
      font-family: "Space Grotesk", "Segoe UI", sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: 0.045;
      background-image:
        linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
      background-size: 88px 88px;
      mask-image: linear-gradient(180deg, rgba(0,0,0,0.94), transparent 86%);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .app-shell {
      max-width: 1520px;
      margin: 0 auto;
      padding: 24px 24px 40px;
    }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 60;
      isolation: isolate;
      overflow: hidden;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 18px;
      align-items: center;
      padding: 16px 18px;
      margin-bottom: 14px;
      background: linear-gradient(180deg, rgba(2, 7, 12, 0.98), rgba(7, 16, 25, 0.94));
      border: 1px solid var(--border);
      border-radius: 999px;
      backdrop-filter: blur(24px) saturate(1.28);
      box-shadow:
        0 28px 78px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }

    .topbar::before {
      content: "";
      position: absolute;
      inset: -58% -10% auto;
      height: 210%;
      border-radius: inherit;
      background:
        radial-gradient(circle at 50% 0%, rgba(6, 10, 15, 0.96), transparent 72%),
        linear-gradient(180deg, rgba(3, 7, 12, 0.94), rgba(3, 7, 12, 0));
      filter: blur(34px);
      opacity: 0.96;
      pointer-events: none;
      z-index: -2;
    }

    .topbar::after {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)),
        radial-gradient(circle at 84% 0%, rgba(255, 158, 82, 0.12), transparent 24%);
      pointer-events: none;
      z-index: -1;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .brand-mark {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      background:
        radial-gradient(circle at 32% 34%, rgba(255, 164, 84, 0.46), transparent 36%),
        linear-gradient(145deg, rgba(22, 35, 53, 0.98), rgba(6, 12, 19, 0.96));
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.12),
        0 0 30px rgba(255, 138, 45, 0.12);
      color: #f6f9fc;
      font-weight: 700;
      font-size: 20px;
      letter-spacing: -0.06em;
    }

    .brand-copy {
      min-width: 0;
    }

    .brand-kicker {
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--accent-strong);
      margin-bottom: 4px;
      white-space: nowrap;
    }

    .brand-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.03em;
      white-space: nowrap;
    }

    .nav {
      display: inline-flex;
      justify-content: center;
      gap: 8px;
      padding: 6px;
      border-radius: 999px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .nav::-webkit-scrollbar {
      display: none;
    }

    .nav a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 16px;
      border-radius: 999px;
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      transition: background 180ms ease, color 180ms ease, transform 180ms ease;
    }

    .nav a:hover {
      color: var(--text-primary);
      background: rgba(255,255,255,0.04);
      transform: translateY(-1px);
    }

    .nav a.active {
      color: white;
      background: linear-gradient(135deg, rgba(106, 179, 255, 0.2), rgba(255, 138, 45, 0.12));
      border: 1px solid rgba(149, 206, 255, 0.18);
    }

    .topbar-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .heartbeat-strip {
      width: 160px;
      height: 38px;
      display: grid;
      grid-template-columns: repeat(20, minmax(0, 1fr));
      gap: 3px;
      padding: 7px 10px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.03);
      overflow: hidden;
    }

    .heartbeat-strip span {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02));
      transform-origin: bottom center;
      animation: beat 1.7s ease-in-out infinite;
      animation-delay: calc(var(--i) * 70ms);
    }

    .heartbeat-strip.active span {
      background: linear-gradient(180deg, rgba(105, 200, 255, 0.95), rgba(255, 138, 45, 0.5));
      box-shadow: 0 0 14px rgba(105, 200, 255, 0.16);
    }

    .heartbeat-strip.blocked span {
      background: linear-gradient(180deg, rgba(255, 177, 68, 0.95), rgba(255, 107, 122, 0.52));
      box-shadow: 0 0 14px rgba(255, 107, 122, 0.16);
    }

    .sync-chip,
    .clock {
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.03);
      white-space: nowrap;
      font-size: 13px;
    }

    .clock {
      font-family: "IBM Plex Mono", ui-monospace, monospace;
      color: var(--text-primary);
    }

    .sync-chip {
      color: var(--text-secondary);
    }

    .sync-chip strong {
      color: var(--text-primary);
      font-weight: 600;
    }

    .panel {
      position: relative;
      overflow: hidden;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(16px);
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.12fr) minmax(320px, 0.88fr);
      gap: 20px;
      padding: 30px;
      margin-bottom: 18px;
      background:
        radial-gradient(circle at 12% 18%, rgba(106, 179, 255, 0.12), transparent 28%),
        radial-gradient(circle at 86% 12%, rgba(255, 138, 45, 0.16), transparent 24%),
        linear-gradient(145deg, rgba(10, 19, 30, 0.96), rgba(6, 12, 19, 0.96));
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      border-radius: 999px;
      background: rgba(106, 179, 255, 0.09);
      border: 1px solid rgba(149, 206, 255, 0.14);
      color: var(--accent-strong);
      font-size: 12px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }

    .hero h1 {
      margin: 0;
      font-size: clamp(3rem, 6vw, 6rem);
      line-height: 0.9;
      letter-spacing: -0.08em;
      max-width: 9ch;
    }

    .hero p {
      margin: 18px 0 0;
      max-width: 60ch;
      color: var(--text-secondary);
      font-size: 1.02rem;
      line-height: 1.8;
    }

    .hero-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }

    .button-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 14px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      color: var(--text-primary);
      font-size: 14px;
      font-weight: 600;
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
    }

    .button-link:hover {
      transform: translateY(-1px);
      border-color: rgba(149, 206, 255, 0.22);
      background: rgba(106, 179, 255, 0.08);
    }

    .button-link.primary {
      background: linear-gradient(135deg, rgba(106, 179, 255, 0.2), rgba(255, 138, 45, 0.12));
      border-color: rgba(149, 206, 255, 0.2);
    }

    .hero-stack {
      display: grid;
      gap: 16px;
    }

    .hero-card {
      padding: 18px;
      border-radius: var(--radius-lg);
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-md);
    }

    .hero-label {
      color: var(--text-tertiary);
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .hero-value {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      letter-spacing: -0.06em;
      margin-bottom: 10px;
    }

    .hero-copy-small {
      color: var(--text-secondary);
      font-size: 14px;
      line-height: 1.7;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 18px;
    }

    .metric-card {
      padding: 18px;
      border-radius: var(--radius-lg);
      background: rgba(10, 18, 28, 0.84);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-md);
    }

    .metric-label {
      color: var(--text-tertiary);
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .metric-value {
      font-size: clamp(2rem, 3vw, 3.1rem);
      line-height: 0.95;
      letter-spacing: -0.06em;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .metric-copy {
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 14px;
    }

    .main-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
      gap: 18px;
    }

    .section-card {
      padding: 24px;
      border-radius: var(--radius-xl);
      background: var(--bg-surface);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }

    .section-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.04em;
    }

    .section-subtle {
      color: var(--text-tertiary);
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .timeline {
      position: relative;
      display: grid;
      gap: 18px;
      padding-left: 24px;
    }

    .timeline::before {
      content: "";
      position: absolute;
      left: 8px;
      top: 6px;
      bottom: 6px;
      width: 2px;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(106, 179, 255, 0.32), rgba(255, 138, 45, 0.22));
    }

    .timeline-item {
      position: relative;
      padding-left: 18px;
      padding-bottom: 2px;
    }

    .timeline-item::before {
      content: "";
      position: absolute;
      left: -24px;
      top: 7px;
      width: 14px;
      height: 14px;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(106, 179, 255, 0.98), rgba(255, 138, 45, 0.84));
      box-shadow: 0 0 0 6px rgba(106, 179, 255, 0.08);
    }

    .timeline-date {
      color: var(--accent-strong);
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .timeline-title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.04em;
      margin-bottom: 10px;
    }

    .timeline-copy {
      color: var(--text-secondary);
      line-height: 1.8;
      font-size: 15px;
      margin-bottom: 12px;
    }

    .timeline-evidence {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .evidence-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 999px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.05);
      color: var(--text-secondary);
      font-size: 12px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .stack {
      display: grid;
      gap: 18px;
      align-content: start;
    }

    .quote-card,
    .status-card,
    .proof-card {
      padding: 18px;
      border-radius: var(--radius-lg);
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
    }

    .quote-card blockquote {
      margin: 0;
      font-size: 1.2rem;
      line-height: 1.7;
      letter-spacing: -0.02em;
    }

    .quote-card cite {
      display: block;
      margin-top: 12px;
      color: var(--text-tertiary);
      font-style: normal;
      font-size: 13px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .status-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: baseline;
      padding-top: 12px;
      border-top: 1px solid var(--border);
      margin-top: 12px;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .status-row:first-of-type {
      border-top: none;
      margin-top: 0;
      padding-top: 0;
    }

    .status-row strong {
      color: var(--text-primary);
      font-weight: 600;
      text-align: right;
    }

    .proof-list {
      display: grid;
      gap: 10px;
      margin-top: 14px;
    }

    .proof-item {
      padding: 14px;
      border-radius: var(--radius-md);
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
    }

    .proof-item strong {
      display: block;
      margin-bottom: 8px;
      font-size: 15px;
      letter-spacing: -0.02em;
    }

    .proof-item span {
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 14px;
    }

    .runway-card {
      padding: 18px;
      border-radius: var(--radius-lg);
      background:
        radial-gradient(circle at 88% 16%, rgba(255, 138, 45, 0.12), transparent 26%),
        rgba(255,255,255,0.03);
      border: 1px solid var(--border);
    }

    .runway-summary {
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 14px;
      margin-top: 10px;
    }

    .runway-list {
      display: grid;
      gap: 10px;
      margin-top: 14px;
    }

    .runway-item {
      padding: 14px;
      border-radius: var(--radius-md);
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
    }

    .runway-kicker {
      color: var(--accent-strong);
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .runway-title {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }

    .runway-copy {
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 14px;
    }

    .footer-callout {
      margin-top: 18px;
      padding: 24px;
      border-radius: var(--radius-xl);
      background:
        radial-gradient(circle at 86% 18%, rgba(255, 138, 45, 0.18), transparent 28%),
        linear-gradient(145deg, rgba(10, 18, 28, 0.94), rgba(6, 12, 19, 0.94));
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: var(--shadow-md);
    }

    .footer-callout h3 {
      margin: 0 0 8px;
      font-size: 28px;
      letter-spacing: -0.05em;
    }

    .footer-callout p {
      margin: 0 0 16px;
      color: var(--text-secondary);
      line-height: 1.8;
      font-size: 15px;
      max-width: 70ch;
    }

    @keyframes beat {
      0%, 100% { transform: scaleY(0.32); opacity: 0.42; }
      20% { transform: scaleY(0.88); opacity: 0.9; }
      50% { transform: scaleY(0.48); opacity: 0.65; }
      74% { transform: scaleY(1); opacity: 1; }
    }

    @media (max-width: 1180px) {
      .hero,
      .metrics-grid,
      .main-grid,
      .topbar {
        grid-template-columns: 1fr;
      }

      .topbar-meta {
        justify-content: flex-start;
      }
    }

    @media (max-width: 760px) {
      .app-shell {
        padding: 16px 16px 28px;
      }

      .hero,
      .section-card,
      .footer-callout {
        padding: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">F</div>
        <div class="brand-copy">
          <div class="brand-kicker">Autonomous Business Operating System</div>
          <div class="brand-title">Forge Command</div>
        </div>
      </div>
      <nav class="nav" aria-label="Primary">
        <a href="/"><i class="fa-solid fa-satellite-dish"></i> Command</a>
        <a href="/review"><i class="fa-solid fa-shield-halved"></i> Review</a>
        <a href="/x-posts"><i class="fa-brands fa-x-twitter"></i> Broadcast</a>
        <a class="active" href="/story"><i class="fa-solid fa-timeline"></i> Story</a>
        <a href="/launchpad"><i class="fa-solid fa-rocket"></i> Launch</a>
      </nav>
      <div class="topbar-meta">
        <div class="heartbeat-strip" id="heartbeat-strip"></div>
        <div class="clock" id="clock">--:--:-- --</div>
        <div class="sync-chip" id="sync-chip"><strong>Live sync pending</strong></div>
      </div>
    </header>

    <section class="panel hero">
      <div>
        <div class="eyebrow"><i class="fa-solid fa-fire"></i> The receipts behind Forge</div>
        <h1>Built In Public. Logged In Public. Getting Better In Public.</h1>
        <p>Forge is not a fake demo. It is a real autonomous operator that started on March 23, 2026, burned real money, hit real failure modes, and turned those mistakes into a system other builders can actually learn from.</p>
        <div class="hero-actions">
          <a class="button-link primary" href="/"><i class="fa-solid fa-arrow-left"></i> Back to command</a>
          <a class="button-link" href="/review"><i class="fa-solid fa-shield-halved"></i> See the review loop</a>
          <a class="button-link" href="/story-mobile"><i class="fa-solid fa-mobile-screen-button"></i> Open mobile story</a>
        </div>
      </div>
      <div class="hero-stack">
        <div class="hero-card">
          <div class="hero-label">Documented spend</div>
          <div class="hero-value" id="hero-spend">$809</div>
          <div class="hero-copy-small">By March 24, 2026, the experiment had already become expensive enough to force honesty and better system design.</div>
        </div>
        <div class="hero-card">
          <div class="hero-label">Model correction</div>
          <div class="hero-value" id="hero-savings">47x</div>
          <div class="hero-copy-small">Forge documented the move from an Anthropic-heavy autonomous lane to DeepSeek for approximately $75/day down to $1.60/day.</div>
        </div>
        <div class="hero-card">
          <div class="hero-label">Live status</div>
          <div class="hero-copy-small" id="hero-live-copy">Waiting for current state so the story page can anchor the narrative in the live system.</div>
        </div>
      </div>
    </section>

    <section class="metrics-grid">
      <article class="metric-card">
        <div class="metric-label">Documented Lessons</div>
        <div class="metric-value" id="metric-lessons">6</div>
        <div class="metric-copy">Structured lessons are already part of the content plan, turning pain points into products and posts.</div>
      </article>
      <article class="metric-card">
        <div class="metric-label">Today’s Broadcast</div>
        <div class="metric-value" id="metric-posts">0</div>
        <div class="metric-copy" id="metric-posts-copy">Waiting for X distribution state.</div>
      </article>
      <article class="metric-card">
        <div class="metric-label">Review Universe</div>
        <div class="metric-value" id="metric-reviews">0</div>
        <div class="metric-copy" id="metric-reviews-copy">Live state becomes proof that the system is producing real artifacts.</div>
      </article>
      <article class="metric-card">
        <div class="metric-label">DeepSeek Fuel</div>
        <div class="metric-value" id="metric-balance">--</div>
        <div class="metric-copy" id="metric-balance-copy">Waiting for live worker state.</div>
      </article>
    </section>

    <section class="main-grid">
      <section class="section-card">
        <div class="section-header">
          <div class="section-title">Timeline</div>
          <div class="section-subtle">March 23-26, 2026</div>
        </div>
        <div class="timeline" id="timeline"></div>
      </section>

      <div class="stack">
        <section class="quote-card">
          <div class="hero-label">Core Positioning</div>
          <blockquote>"Everybody is posting theory. Forge has receipts."</blockquote>
          <cite>From the Forge content strategy handoff</cite>
        </section>

        <section class="status-card">
          <div class="section-header">
            <div class="section-title">Live Readout</div>
            <div class="section-subtle">Current system posture</div>
          </div>
          <div class="status-row"><span>System status</span><strong id="status-system">--</strong></div>
          <div class="status-row"><span>Next session</span><strong id="status-next-session">--</strong></div>
          <div class="status-row"><span>Review backlog</span><strong id="status-backlog">--</strong></div>
          <div class="status-row"><span>Revenue target</span><strong id="status-revenue">--</strong></div>
        </section>

        <section class="proof-card">
          <div class="section-header">
            <div class="section-title">What Makes This Different</div>
            <div class="section-subtle">Proof points</div>
          </div>
          <div class="proof-list">
            <div class="proof-item">
              <strong>Real operational history</strong>
              <span>Three consecutive days of timestamped logs, queue changes, cost mistakes, fixes, and product output.</span>
            </div>
            <div class="proof-item">
              <strong>Actual model economics</strong>
              <span>The model switch is not branding copy. It is a documented cost correction with a clear before-and-after outcome.</span>
            </div>
            <div class="proof-item">
              <strong>Human review as product discipline</strong>
              <span>Forge did not stay in "fully autonomous" fantasy land. It built a review OS so bad output stops before it ships.</span>
            </div>
            <div class="proof-item">
              <strong>Distribution tied to output</strong>
              <span>Broadcast is part of operations. Posts, products, and lessons all come from the same machine, not separate marketing theater.</span>
            </div>
          </div>
        </section>

        <section class="runway-card">
          <div class="section-header">
            <div class="section-title">What Is Loading Now</div>
            <div class="section-subtle">Forward pressure</div>
          </div>
          <div class="runway-summary" id="runway-summary">Waiting for live state to show what the machine can turn into the next visible story.</div>
          <div class="runway-list" id="runway-list"></div>
        </section>
      </div>
    </section>

    <section class="footer-callout">
      <h3>Why People Will Care</h3>
      <p>Most people trying to build autonomous agents do not want inspiration. They want fewer mistakes, lower cost, a review loop that catches garbage, and a brutally honest answer to "what actually happened when you tried this?" Forge is turning that answer into the brand.</p>
      <div class="hero-actions">
        <a class="button-link primary" href="/"><i class="fa-solid fa-satellite-dish"></i> Open the live command deck</a>
        <a class="button-link" href="https://x.com/Forge_Builds" target="_blank" rel="noreferrer"><i class="fa-brands fa-x-twitter"></i> Follow @Forge_Builds</a>
      </div>
    </section>
  </div>

  <script>
    const STORY_TIMELINE = [
      {
        date: 'March 23, 2026',
        title: 'Forge was born as a real autonomous experiment',
        copy: 'Day 1 was not a mockup. Forge ran on a Mac Mini in Wake Forest, North Carolina, read a huge amount of material, generated 210K characters, built 46 files, and immediately proved that autonomous systems can burn real money before they earn any.',
        evidence: ['Day 1 logs', 'Mac Mini operator', 'real spend']
      },
      {
        date: 'March 24, 2026',
        title: 'The business reality showed up fast',
        copy: 'By March 24, 2026, the system had APIs breaking, accidental posts, a reversed pricing strategy, $809 invested, and still $0 revenue. That is exactly why the story matters: the mistakes were paid for, not invented for content.',
        evidence: ['$809 invested', '$0 revenue', 'APIs broke']
      },
      {
        date: 'March 25, 2026',
        title: 'The $75 per day mistake got caught',
        copy: 'The team discovered a silent model-cost bleed that was running the autonomous lane at roughly $75 per day. That became the turning point for a documented move to DeepSeek at about $1.60 per day for the same class of autonomous work.',
        evidence: ['$75/day mistake', '$1.60/day after fix', '47x reduction']
      },
      {
        date: 'March 25, 2026',
        title: 'Mission control stopped being AI slop',
        copy: 'Lucas called out the original dashboard as generic. The response was not defensive copy. The system got rebuilt again and again until the mission control surface started feeling worthy of the actual operation underneath it.',
        evidence: ['6+ rebuilds', 'live data integration', 'quality standard reset']
      },
      {
        date: 'March 25, 2026',
        title: 'The review OS made autonomy accountable',
        copy: 'Forge built a human review loop with previews, decisions, deduplication, and analytics so the machine could keep producing without pretending that every artifact should ship untouched.',
        evidence: ['review queue', 'dedup logic', 'approve / revise / reject']
      },
      {
        date: 'March 25-26, 2026',
        title: 'The output engine started to become visible',
        copy: 'Three X posts were logged for @Forge_Builds, NotebookLM graphics entered review, the Autonomous Agent Setup Checklist was created, and the AI Agent Security Checklist entered the queue. The system started turning operations into distribution and products.',
        evidence: ['3 X posts logged', 'NotebookLM visuals', 'Security checklist in review']
      }
    ];

    const app = {
      state: null,
      animations: new Map(),
    };

    function safeNumber(value) {
      const next = Number(value);
      return Number.isFinite(next) ? next : 0;
    }

    function escapeHtml(value) {
      return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function formatCurrency(value, digits) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: digits == null ? 2 : digits,
        maximumFractionDigits: digits == null ? 2 : digits,
      }).format(safeNumber(value));
    }

    function formatInteger(value) {
      return new Intl.NumberFormat('en-US').format(Math.round(safeNumber(value)));
    }

    function setStaticMetricValue(id, text) {
      const node = document.getElementById(id);
      if (!node) {
        return;
      }
      if (app.animations.has(id)) {
        cancelAnimationFrame(app.animations.get(id));
        app.animations.delete(id);
      }
      node.textContent = text;
      node.dataset.value = '0';
    }

    function formatRelative(iso) {
      if (!iso) {
        return 'awaiting sync';
      }
      const target = new Date(iso);
      if (Number.isNaN(target.getTime())) {
        return 'awaiting sync';
      }
      const diffMinutes = Math.round((Date.now() - target.getTime()) / 60000);
      if (Math.abs(diffMinutes) < 1) {
        return 'just now';
      }
      if (Math.abs(diffMinutes) < 60) {
        return diffMinutes > 0 ? diffMinutes + 'm ago' : 'in ' + Math.abs(diffMinutes) + 'm';
      }
      const diffHours = Math.round(diffMinutes / 60);
      if (Math.abs(diffHours) < 24) {
        return diffHours > 0 ? diffHours + 'h ago' : 'in ' + Math.abs(diffHours) + 'h';
      }
      const diffDays = Math.round(diffHours / 24);
      return diffDays > 0 ? diffDays + 'd ago' : 'in ' + Math.abs(diffDays) + 'd';
    }

    function renderHeartbeatBars() {
      const strip = document.getElementById('heartbeat-strip');
      if (!strip || strip.children.length) {
        return;
      }
      let markup = '';
      for (let index = 0; index < 20; index += 1) {
        markup += '<span style="--i:' + index + ';"></span>';
      }
      strip.innerHTML = markup;
    }

    function classifySystemState(state) {
      const queueTasks = Array.isArray(state && state.queue && state.queue.tasks) ? state.queue.tasks : [];
      const sessions = Array.isArray(state && state.sessions) ? state.sessions : [];
      const blocked = queueTasks.some(function(task) {
        return String(task.status || '').toUpperCase() === 'BLOCKED';
      });
      if (sessions.length) {
        return 'active';
      }
      if (blocked) {
        return 'blocked';
      }
      return state && state.system && state.system.status === 'online' ? 'online' : 'offline';
    }

    function updateTopbarPulse(state) {
      const strip = document.getElementById('heartbeat-strip');
      if (!strip) {
        return;
      }
      const posture = classifySystemState(state);
      strip.classList.remove('active', 'blocked');
      if (posture === 'active') {
        strip.classList.add('active');
      } else if (posture === 'blocked') {
        strip.classList.add('blocked');
      }
    }

    function animateNumber(id, nextValue, formatter, duration) {
      const node = document.getElementById(id);
      if (!node) {
        return;
      }

      const target = safeNumber(nextValue);
      const previous = safeNumber(node.dataset.value || target);
      const start = performance.now();
      const total = duration || 700;

      if (app.animations.has(id)) {
        cancelAnimationFrame(app.animations.get(id));
      }

      function tick(now) {
        const progress = Math.min(1, (now - start) / total);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = previous + (target - previous) * eased;
        node.textContent = formatter(value);
        node.dataset.value = String(value);
        if (progress < 1) {
          app.animations.set(id, requestAnimationFrame(tick));
        } else {
          node.textContent = formatter(target);
          node.dataset.value = String(target);
          app.animations.delete(id);
        }
      }

      app.animations.set(id, requestAnimationFrame(tick));
    }

    function setClock() {
      const node = document.getElementById('clock');
      if (!node) {
        return;
      }
      node.textContent = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date()) + ' ET';
    }

    function renderTimeline() {
      const root = document.getElementById('timeline');
      root.innerHTML = STORY_TIMELINE.map(function(item) {
        return '<article class="timeline-item">' +
          '<div class="timeline-date">' + escapeHtml(item.date) + '</div>' +
          '<div class="timeline-title">' + escapeHtml(item.title) + '</div>' +
          '<div class="timeline-copy">' + escapeHtml(item.copy) + '</div>' +
          '<div class="timeline-evidence">' +
            item.evidence.map(function(bit) {
              return '<span class="evidence-pill"><i class="fa-solid fa-circle-check"></i> ' + escapeHtml(bit) + '</span>';
            }).join('') +
          '</div>' +
        '</article>';
      }).join('');
    }

    function classifyUpcomingItem(item) {
      const haystack = [item && item.name, item && item.path, item && item.type].join(' ').toLowerCase();
      if (/x|tweet|graphic|notebook|banner|thumbnail|infographic/.test(haystack)) {
        return {
          kicker: 'Broadcast asset',
          copy: 'A visible distribution asset is already in the queue, waiting to become the next proof point.',
        };
      }
      if (/checklist|guide|product|pdf/.test(haystack)) {
        return {
          kicker: 'Product surface',
          copy: 'This looks like an artifact that can become a downloadable proof-of-work, not just another internal file.',
        };
      }
      return {
        kicker: 'System artifact',
        copy: 'The machine is still producing new surfaces that can become content, product, or both.',
      };
    }

    function renderRunway(state) {
      const root = document.getElementById('runway-list');
      const summary = document.getElementById('runway-summary');
      if (!root || !summary) {
        return;
      }

      const reviews = Array.isArray(state && state.reviews && state.reviews.items) ? state.reviews.items : [];
      const xPosts = state && state.xPosts ? state.xPosts : {};
      const livePosts = safeNumber(xPosts.forge && xPosts.forge.postsToday) + safeNumber(xPosts.lucas && xPosts.lucas.postsToday);
      const pendingItems = reviews.filter(function(item) {
        const decision = String(item && (item.current_decision || item.status || '')).toLowerCase();
        return !decision || decision === 'pending' || decision === 'needs_revision';
      });
      const prioritized = pendingItems.slice().sort(function(left, right) {
        const leftText = [left && left.name, left && left.path].join(' ').toLowerCase();
        const rightText = [right && right.name, right && right.path].join(' ').toLowerCase();
        const leftScore = /x|tweet|graphic|notebook|checklist|guide|product/.test(leftText) ? 1 : 0;
        const rightScore = /x|tweet|graphic|notebook|checklist|guide|product/.test(rightText) ? 1 : 0;
        return rightScore - leftScore;
      }).slice(0, 4);

      summary.textContent = livePosts
        ? livePosts + ' live post' + (livePosts === 1 ? ' is' : 's are') + ' already out, and ' + pendingItems.length + ' more artifacts are still waiting to become the next chapter.'
        : pendingItems.length
          ? pendingItems.length + ' visible artifacts are still in the machine, which means the story is still moving forward even before the next post lands.'
          : 'The story surface is live, but the current state does not expose new upcoming artifacts yet.';

      if (!prioritized.length) {
        root.innerHTML = '<div class="runway-item"><div class="runway-copy">No upcoming artifacts are visible in state right now.</div></div>';
        return;
      }

      root.innerHTML = prioritized.map(function(item) {
        const classified = classifyUpcomingItem(item);
        return '<div class="runway-item">' +
          '<div class="runway-kicker">' + escapeHtml(classified.kicker) + '</div>' +
          '<div class="runway-title">' + escapeHtml(item.name || 'Untitled artifact') + '</div>' +
          '<div class="runway-copy">' + escapeHtml(classified.copy) + '</div>' +
        '</div>';
      }).join('');
    }

    function renderState(state) {
      const system = state.system || {};
      const reviews = state.reviews && state.reviews.stats ? state.reviews.stats : {};
      const revenue = state.revenue || {};
      const xPosts = state.xPosts || {};
      const apis = state.apis || {};
      const postCount = safeNumber(xPosts.forge && xPosts.forge.postsToday) + safeNumber(xPosts.lucas && xPosts.lucas.postsToday);
      const reviewUniverse = safeNumber(reviews.unique_items) || safeNumber(reviews.pending) + safeNumber(reviews.needs_revision) + safeNumber(reviews.approved) + safeNumber(reviews.rejected);
      const backlog = safeNumber(reviews.pending) + safeNumber(reviews.needs_revision);
      const deepseekOnline = String(apis.deepseek || '').toLowerCase() === 'online';
      const deepseekBalance = safeNumber(system.deepseekBalance);

      animateNumber('metric-posts', postCount, function(value) { return formatInteger(value); }, 650);
      animateNumber('metric-reviews', reviewUniverse, function(value) { return formatInteger(value); }, 650);
      if (deepseekOnline || deepseekBalance > 0) {
        animateNumber('metric-balance', deepseekBalance, function(value) { return formatCurrency(value, 2); }, 800);
      } else {
        setStaticMetricValue('metric-balance', '--');
      }
      animateNumber('hero-spend', 809, function(value) { return formatCurrency(value, 0); }, 900);
      animateNumber('hero-savings', 47, function(value) { return formatInteger(value) + 'x'; }, 900);
      animateNumber('metric-lessons', 6, function(value) { return formatInteger(value); }, 600);

      document.getElementById('metric-posts-copy').textContent = postCount
        ? postCount + ' posts are visible in the current state payload.'
        : 'No posts are currently visible in state.';
      document.getElementById('metric-reviews-copy').textContent = reviewUniverse
        ? reviewUniverse + ' unique review items are currently visible.'
        : 'The review queue is not currently populated.';
      document.getElementById('metric-balance-copy').textContent = deepseekOnline
        ? 'Live fuel reserve last synced ' + formatRelative(state.lastUpdated) + '.'
        : 'DeepSeek balance is unavailable in the current state payload. Check the worker sync if this stays offline.';
      document.getElementById('hero-live-copy').textContent =
        (system.status || 'unknown') + ' -- ' + (system.nextSession && system.nextSession.name || 'No session scheduled') + ' -- DeepSeek ' + (deepseekOnline ? 'online' : 'offline') + ' -- sync ' + formatRelative(state.lastUpdated) + '.';

      document.getElementById('status-system').textContent = system.status || 'unknown';
      document.getElementById('status-next-session').textContent =
        (system.nextSession && system.nextSession.name || 'No session scheduled') + ' -- ' + (system.nextSession && system.nextSession.in || '--');
      document.getElementById('status-backlog').textContent = formatInteger(backlog) + ' waiting';
      document.getElementById('status-revenue').textContent =
        formatCurrency(revenue.total || 0, 0) + ' / ' + formatCurrency(revenue.target || 100, 0);
      document.getElementById('sync-chip').innerHTML = '<strong>Synced ' + escapeHtml(formatRelative(state.lastUpdated)) + '</strong>';
      updateTopbarPulse(state);
      renderRunway(state);
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
      if (!response.ok) {
        throw new Error('Unable to load state');
      }
      return response.json();
    }

    async function refreshState() {
      const state = await fetchState();
      app.state = state;
      renderState(state);
    }

    async function boot() {
      renderTimeline();
      renderHeartbeatBars();
      setClock();
      setInterval(setClock, 1000);
      try {
        await refreshState();
      } catch (error) {
        document.getElementById('hero-live-copy').textContent = error.message;
      }
      setInterval(function() {
        refreshState().catch(function() {});
      }, LIVE_REFRESH_INTERVAL_MS);
      wireLiveRefresh(refreshState);
    }

    boot();
  </script>
</body>
</html>`;

export default storyHtml;
