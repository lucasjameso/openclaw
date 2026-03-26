const launchpadHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Forge Launchpad</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
  <style>
    :root {
      --bg: #050c13;
      --bg-soft: rgba(7, 16, 25, 0.84);
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

    a {
      color: inherit;
      text-decoration: none;
    }

    .app-shell {
      max-width: 1540px;
      margin: 0 auto;
      padding: 24px 24px 44px;
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

    .brand-kicker,
    .pill,
    .eyebrow,
    .section-subtle,
    .detail-label {
      font-family: "IBM Plex Mono", monospace;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 11px;
    }

    .brand-kicker,
    .eyebrow {
      color: var(--blue);
    }

    .brand-title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.05em;
    }

    .nav {
      display: inline-flex;
      gap: 10px;
      padding: 6px;
      border-radius: 999px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      justify-self: center;
      flex-wrap: nowrap;
      max-width: 100%;
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
      padding: 10px 14px;
      border-radius: 999px;
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
    }

    .nav a.active {
      color: var(--text);
      background: linear-gradient(135deg, rgba(121, 188, 255, 0.18), rgba(255, 158, 82, 0.12));
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
    }

    .topbar-meta {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      justify-self: end;
      flex-wrap: wrap;
    }

    .heartbeat-strip {
      width: 132px;
      height: 28px;
      display: grid;
      grid-template-columns: repeat(18, minmax(0, 1fr));
      gap: 4px;
      align-items: end;
    }

    .heartbeat-strip span {
      display: block;
      width: 100%;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(121, 188, 255, 0.96), rgba(255, 158, 82, 0.62));
      height: 26%;
      opacity: 0.46;
      transform-origin: center bottom;
      animation: beat 1.8s ease-in-out infinite;
      animation-delay: calc(var(--i) * 90ms);
    }

    .clock,
    .sync-chip {
      padding: 10px 12px;
      border-radius: 999px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      white-space: nowrap;
      font-size: 13px;
    }

    .clock {
      font-family: "IBM Plex Mono", monospace;
    }

    .sync-chip strong {
      color: var(--text);
      font-weight: 600;
    }

    .panel {
      position: relative;
      overflow: hidden;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      backdrop-filter: blur(16px);
    }

    .panel::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(180deg, rgba(255,255,255,0.03), transparent 40%);
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
      gap: 20px;
      padding: 30px;
      margin-bottom: 18px;
      background:
        radial-gradient(circle at 10% 18%, rgba(121, 188, 255, 0.12), transparent 28%),
        radial-gradient(circle at 90% 10%, rgba(255, 158, 82, 0.16), transparent 24%),
        linear-gradient(145deg, rgba(11, 21, 31, 0.94), rgba(8, 14, 22, 0.96));
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      border-radius: 999px;
      background: rgba(106, 179, 255, 0.09);
      border: 1px solid rgba(149, 206, 255, 0.14);
      margin-bottom: 18px;
    }

    .hero h1 {
      margin: 0;
      font-size: clamp(3rem, 6vw, 5.4rem);
      line-height: 0.9;
      letter-spacing: -0.07em;
      max-width: 8ch;
    }

    .hero-copy p,
    .hero-copy .copy {
      margin: 18px 0 0;
      max-width: 62ch;
      color: var(--muted);
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
      color: var(--text);
      font-size: 14px;
      font-weight: 600;
    }

    .button-link.primary {
      background: linear-gradient(135deg, rgba(121, 188, 255, 0.18), rgba(255, 158, 82, 0.12));
    }

    .hero-side,
    .stack {
      display: grid;
      gap: 16px;
    }

    .telemetry-card,
    .section-card {
      padding: 20px;
      border-radius: var(--radius);
      background: var(--panel-2);
      border: 1px solid var(--border);
      box-shadow: 0 20px 54px rgba(0, 0, 0, 0.24);
    }

    .telemetry-label,
    .section-subtle,
    .detail-label {
      color: var(--soft);
    }

    .telemetry-title {
      font-size: 30px;
      font-weight: 700;
      letter-spacing: -0.05em;
      margin: 10px 0;
    }

    .telemetry-copy {
      color: var(--muted);
      font-size: 14px;
      line-height: 1.7;
    }

    .telemetry-list,
    .detail-list,
    .asset-list,
    .move-list,
    .offer-list,
    .hook-list,
    .strike-list {
      display: grid;
      gap: 12px;
    }

    .telemetry-row,
    .detail-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.6;
    }

    .telemetry-row strong,
    .detail-row strong {
      color: var(--text);
      font-weight: 600;
      text-align: right;
    }

    .metric-grid,
    .main-grid,
    .revenue-ladder {
      display: grid;
      gap: 16px;
      margin-top: 18px;
    }

    .metric-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .main-grid {
      grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
      align-items: start;
      gap: 20px;
    }

    .main-grid > .stack:last-child {
      grid-column: span 2;
    }

    .metric-card {
      padding: 20px;
      border-radius: var(--radius-md);
      background: var(--panel-2);
      border: 1px solid var(--border);
      box-shadow: 0 16px 38px rgba(0, 0, 0, 0.22);
    }

    .metric-label {
      color: var(--soft);
      margin-bottom: 10px;
    }

    .metric-value {
      font-size: 42px;
      letter-spacing: -0.06em;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .metric-copy {
      color: var(--muted);
      line-height: 1.6;
      font-size: 14px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: baseline;
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.04em;
    }

    .card {
      padding: 18px;
      border-radius: var(--radius-md);
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
    }

    .card.blocker {
      border-left: 4px solid rgba(255, 108, 123, 0.84);
      padding-left: 14px;
    }

    .card.asset {
      border-left: 4px solid rgba(121, 188, 255, 0.84);
      padding-left: 14px;
    }

    .card.move {
      border-left: 4px solid rgba(255, 158, 82, 0.84);
      padding-left: 14px;
    }

    .card.offer {
      border-left: 4px solid rgba(53, 211, 163, 0.84);
      padding-left: 14px;
    }

    .card.hook {
      border-left: 4px solid rgba(121, 188, 255, 0.84);
      padding-left: 14px;
      background:
        linear-gradient(135deg, rgba(121, 188, 255, 0.08), rgba(255, 158, 82, 0.03)),
        rgba(255,255,255,0.03);
    }

    .card.strike {
      border-left: 4px solid rgba(255, 158, 82, 0.84);
      padding-left: 14px;
      background:
        linear-gradient(135deg, rgba(255, 158, 82, 0.1), rgba(121, 188, 255, 0.04)),
        rgba(255,255,255,0.03);
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.05);
      color: var(--muted);
      white-space: nowrap;
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .card-title {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.4;
      letter-spacing: -0.02em;
    }

    .card-copy {
      color: var(--muted);
      font-size: 14px;
      line-height: 1.7;
    }

    .ladder-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }

    .ladder-step {
      padding: 16px;
      border-radius: var(--radius-md);
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
    }

    .ladder-step strong {
      display: block;
      font-size: 15px;
      margin-bottom: 8px;
    }

    .ladder-step span {
      color: var(--muted);
      font-size: 14px;
      line-height: 1.6;
    }

    @keyframes beat {
      0%, 100% { transform: scaleY(0.32); opacity: 0.42; }
      20% { transform: scaleY(0.88); opacity: 0.9; }
      50% { transform: scaleY(0.48); opacity: 0.65; }
      74% { transform: scaleY(1); opacity: 1; }
    }

    @media (max-width: 1240px) {
      .hero,
      .main-grid,
      .metric-grid,
      .ladder-grid,
      .topbar {
        grid-template-columns: 1fr;
      }

      .topbar-meta {
        justify-self: start;
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
          <div class="brand-title">Forge Launchpad</div>
        </div>
      </div>
      <nav class="nav" aria-label="Primary">
        <a href="/"><i class="fa-solid fa-satellite-dish"></i> Command</a>
        <a href="/review"><i class="fa-solid fa-shield-halved"></i> Review</a>
        <a href="/x-posts"><i class="fa-brands fa-x-twitter"></i> Broadcast</a>
        <a href="/story"><i class="fa-solid fa-timeline"></i> Story</a>
        <a class="active" href="/launchpad"><i class="fa-solid fa-rocket"></i> Launch</a>
      </nav>
      <div class="topbar-meta">
        <div class="heartbeat-strip" id="heartbeat-strip"></div>
        <div class="clock" id="clock">--:--:-- ET</div>
        <div class="sync-chip" id="sync-chip"><strong>Awaiting sync</strong></div>
      </div>
    </header>

    <section class="panel hero">
      <div class="hero-copy">
        <div class="eyebrow"><i class="fa-solid fa-bolt"></i> First dollars command surface</div>
        <h1>Turn The Machine Into Money.</h1>
        <div class="copy" id="hero-copy">Waiting for live state.</div>
        <div class="hero-actions">
          <a class="button-link primary" href="/x-posts"><i class="fa-brands fa-x-twitter"></i> Open broadcast console</a>
          <a class="button-link" href="/story"><i class="fa-solid fa-timeline"></i> Open shareable story</a>
          <a class="button-link" href="/review"><i class="fa-solid fa-shield-halved"></i> Review launch assets</a>
          <a class="button-link" href="/video-lab"><i class="fa-solid fa-film"></i> Open video lab</a>
        </div>
      </div>
      <div class="hero-side">
        <div class="telemetry-card">
          <div class="telemetry-label">Launch posture</div>
          <div class="telemetry-title" id="launch-posture">Loading</div>
          <div class="telemetry-copy" id="launch-copy">This panel turns the overnight work into a visible sequence: assets, blockers, revenue ladder, and first-dollar moves.</div>
        </div>
        <div class="telemetry-card">
          <div class="telemetry-label">Launch Readout</div>
          <div class="telemetry-list">
            <div class="telemetry-row"><span>Revenue visible</span><strong id="launch-revenue">$0</strong></div>
            <div class="telemetry-row"><span>Posts today</span><strong id="launch-posts">--</strong></div>
            <div class="telemetry-row"><span>Review pressure</span><strong id="launch-review">--</strong></div>
            <div class="telemetry-row"><span>Primary offer</span><strong id="launch-offer">$809 Guide</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section class="metric-grid">
      <article class="metric-card">
        <div class="metric-label detail-label">Guide chapters</div>
        <div class="metric-value">10</div>
        <div class="metric-copy">Mistake Guide draft is complete and ready for assembly.</div>
      </article>
      <article class="metric-card">
        <div class="metric-label detail-label">Voice clips</div>
        <div class="metric-value">9</div>
        <div class="metric-copy">Roger clips ready for TikTok, Reels, and X video pairing.</div>
      </article>
      <article class="metric-card">
        <div class="metric-label detail-label">Video covers</div>
        <div class="metric-value">3</div>
        <div class="metric-copy">Short-form cover assets are now rendered and waiting for export.</div>
      </article>
      <article class="metric-card">
        <div class="metric-label detail-label">Revenue target</div>
        <div class="metric-value" id="target-metric">$100</div>
        <div class="metric-copy">The whole point now is first dollars, then compounding dollars.</div>
      </article>
    </section>

    <section class="main-grid">
      <div class="stack">
        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Launch Blockers</div>
            <div class="section-subtle">What still stands between the work and money</div>
          </div>
          <div class="detail-list" id="blocker-list"></div>
        </section>

        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Revenue Moves</div>
            <div class="section-subtle">Do these first</div>
          </div>
          <div class="move-list" id="move-list"></div>
        </section>

        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Top Hooks Ready To Post</div>
            <div class="section-subtle" id="hooks-kicker">Best launch ammo loaded</div>
          </div>
          <div class="hook-list" id="hook-list"></div>
        </section>
      </div>

      <div class="stack">
        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Media Arsenal</div>
            <div class="section-subtle">Already built overnight</div>
          </div>
          <div class="asset-list" id="asset-list"></div>
        </section>

        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Featured Strike Package</div>
            <div class="section-subtle" id="strike-kicker">Three assets. One clean launch hit.</div>
          </div>
          <div class="strike-list" id="strike-list"></div>
        </section>

        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Offer Ladder</div>
            <div class="section-subtle">Free attention to paid trust</div>
          </div>
          <div class="offer-list" id="offer-list"></div>
        </section>
      </div>

      <div class="stack">
        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Launch Sequence</div>
            <div class="section-subtle">What happens next</div>
          </div>
          <div class="ladder-grid">
            <div class="ladder-step"><strong>1. Hook</strong><span>Post the $75/day leak story with the hardest number first.</span></div>
            <div class="ladder-step"><strong>2. Product</strong><span>Publish the $809 Mistake Guide and point every hook at it.</span></div>
            <div class="ladder-step"><strong>3. Service</strong><span>Offer AI ops teardown calls while the software products mature.</span></div>
            <div class="ladder-step"><strong>4. Waitlist</strong><span>Open the Advisor waitlist so curiosity becomes demand capture.</span></div>
          </div>
        </section>

        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Live Receipts</div>
            <div class="section-subtle">This is why the launch matters</div>
          </div>
          <div class="detail-list">
            <div class="detail-row"><span>$809 invested</span><strong>real experiment cost</strong></div>
            <div class="detail-row"><span>$75/day leak</span><strong>best launch hook</strong></div>
            <div class="detail-row"><span>47x savings</span><strong>best trust-building stat</strong></div>
            <div class="detail-row"><span>0 visible revenue</span><strong>why this page exists</strong></div>
          </div>
        </section>
      </div>
    </section>
  </div>

  <script>
    const LAUNCH_BLOCKERS = [
      { level: 'critical', title: 'Finalize product cover image', copy: 'The guide has copy, chapters, hooks, voiceovers, and visual drafts. The single highest-signal missing asset is the final cover export for the listing.' },
      { level: 'critical', title: 'Assemble the 10 chapters into one PDF', copy: 'The content already exists. It still needs to be assembled into one product someone can buy instead of ten markdown files someone can admire.' },
      { level: 'important', title: 'Create the Gumroad product', copy: 'Listing copy is done. The account still needs the product created, cover uploaded, price set, and link made real.' },
      { level: 'important', title: 'Post the first launch announcement', copy: 'The system has the story, the visuals, and the hooks. The launch is not real until the first post ships.' }
    ];

    const REVENUE_MOVES = [
      { rank: '01', label: 'right now', title: 'Launch The $809 Mistake Guide', copy: 'Closest path to first dollars. The work is already done; now the packaging has to catch up.' },
      { rank: '02', label: 'today', title: 'Lead with the $75/day leak story', copy: 'That one number is the sharpest way to earn trust and drive people toward the guide.' },
      { rank: '03', label: 'today', title: 'Turn Roger clips into short-form videos', copy: 'The audio exists. Short-video covers now exist. That is distribution fuel sitting on disk.' },
      { rank: '04', label: 'this week', title: 'Sell AI ops teardown offers', copy: 'Productized expertise can start earning before the Advisor ships.' },
      { rank: '05', label: 'this week', title: 'Open the Advisor waitlist', copy: 'Capture intent while the main content engine builds trust in public.' }
    ];

    const MEDIA_ARSENAL = [
      { count: '10', title: 'Mistake Guide chapters', copy: 'Complete first draft from overview through setup guide.' },
      { count: '9', title: 'Roger voiceovers', copy: 'Hooks and chapter intros already recorded in relaxed, deadpan Forge voice.' },
      { count: '3', title: 'Vertical video covers', copy: 'Short-form cover drafts ready for export and pairing with the Roger clips.' },
      { count: '10+', title: 'Launch visuals', copy: 'Guide cover, chapter cards, crossover cards, and org-chart style posts.' }
    ];

    const FEATURED_STRIKE = [
      {
        stage: '01',
        label: 'hero visual',
        title: 'Launch announcement card',
        copy: 'Lead with the $809 spent, the $75/day leak, and the line that the machine finally has something to sell besides the lesson itself.'
      },
      {
        stage: '02',
        label: 'product visual',
        title: 'Mistake Guide cover v2',
        copy: 'Dark cover, $19 price tag, Forge badge, and just enough product confidence to make the guide look buyable instead of internal.'
      },
      {
        stage: '03',
        label: 'video hook',
        title: 'Midnight confession cover',
        copy: 'Pair the funniest late-night Roger line with a brutal caption card so the video lane gets something sharp, weird, and memorable.'
      }
    ];

    const TOP_HOOKS = [
      {
        lane: 'guide launch',
        format: 'single + cover',
        title: 'We were leaking $75 a day while we slept.',
        copy: 'One silent model fallback turned a cheap autonomous stack into a slow financial injury. That mistake is the guide hook because it is painfully easy to understand.'
      },
      {
        lane: 'thread / short video',
        format: 'receipts thread',
        title: 'Forty-six files in one overnight sprint is either momentum or a cry for help.',
        copy: 'This one works because it sounds unhinged, but it is true. The dashboard, the story page, the launchpad, the mobile story, the visuals, the covers. All in one run.'
      },
      {
        lane: 'single / clip',
        format: 'deadpan humor',
        title: 'Our autonomous agent assigned the human an approval task.',
        copy: 'It is a clean joke because it is also an operational truth. The future did not remove management overhead. It recreated it immediately.'
      },
      {
        lane: 'video / carousel',
        format: 'lesson card',
        title: 'Nine tasks in forty-three minutes looked productive until quality collapsed.',
        copy: 'That is the shallow-task trap in one sentence: velocity without standards is just speed-running mediocrity.'
      },
      {
        lane: 'brand narrative',
        format: 'single / story opener',
        title: 'Claude sharpens the story. Codex sharpens the system. Forge generates enough chaos to keep both honest.',
        copy: 'This is the cleanest explanation of the model-chain loop, and it is weird enough to make people stop scrolling.'
      }
    ];

    const OFFER_LADDER = [
      { phase: 'free', title: 'X posts + story page', copy: 'Prove the machine is real and interesting before asking for money.' },
      { phase: '$19', title: 'The $809 Mistake Guide', copy: 'Small first purchase built around the best live receipts in the system.' },
      { phase: '$150+', title: 'AI ops teardown', copy: 'Service offer for builders who want direct help fixing their stack.' },
      { phase: 'waitlist', title: 'Forge Advisor', copy: 'Capture demand for the higher-trust answer layer before full buildout.' }
    ];

    function escapeHtml(value) {
      return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function safeNumber(value) {
      const next = Number(value);
      return Number.isFinite(next) ? next : 0;
    }

    function formatCurrency(value, digits) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: digits == null ? 0 : digits,
        maximumFractionDigits: digits == null ? 0 : digits,
      }).format(safeNumber(value));
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

    function derivePostsToday(state) {
      const xPosts = state.xPosts || {};
      const forge = xPosts.forge || {};
      const lucas = xPosts.lucas || {};
      return safeNumber(forge.postsToday) + safeNumber(lucas.postsToday);
    }

    function renderStaticSections() {
      document.getElementById('blocker-list').innerHTML = LAUNCH_BLOCKERS.map(function(item) {
        return '<article class="card blocker">' +
          '<div class="card-top">' +
            '<span class="pill"><i class="fa-solid fa-triangle-exclamation"></i> ' + escapeHtml(item.level) + '</span>' +
          '</div>' +
          '<div class="card-title">' + escapeHtml(item.title) + '</div>' +
          '<div class="card-copy">' + escapeHtml(item.copy) + '</div>' +
        '</article>';
      }).join('');

      document.getElementById('move-list').innerHTML = REVENUE_MOVES.map(function(item) {
        return '<article class="card move">' +
          '<div class="card-top">' +
            '<span class="pill"><i class="fa-solid fa-bolt"></i> ' + escapeHtml(item.label) + '</span>' +
            '<span class="pill">move ' + escapeHtml(item.rank) + '</span>' +
          '</div>' +
          '<div class="card-title">' + escapeHtml(item.title) + '</div>' +
          '<div class="card-copy">' + escapeHtml(item.copy) + '</div>' +
        '</article>';
      }).join('');

      document.getElementById('asset-list').innerHTML = MEDIA_ARSENAL.map(function(item) {
        return '<article class="card asset">' +
          '<div class="card-top">' +
            '<span class="pill"><i class="fa-solid fa-clapperboard"></i> inventory</span>' +
            '<span class="pill">' + escapeHtml(item.count) + '</span>' +
          '</div>' +
          '<div class="card-title">' + escapeHtml(item.title) + '</div>' +
          '<div class="card-copy">' + escapeHtml(item.copy) + '</div>' +
        '</article>';
      }).join('');

      document.getElementById('offer-list').innerHTML = OFFER_LADDER.map(function(item) {
        return '<article class="card offer">' +
          '<div class="card-top">' +
            '<span class="pill"><i class="fa-solid fa-sack-dollar"></i> ' + escapeHtml(item.phase) + '</span>' +
          '</div>' +
          '<div class="card-title">' + escapeHtml(item.title) + '</div>' +
          '<div class="card-copy">' + escapeHtml(item.copy) + '</div>' +
        '</article>';
      }).join('');

      document.getElementById('strike-list').innerHTML = FEATURED_STRIKE.map(function(item) {
        return '<article class="card strike">' +
          '<div class="card-top">' +
            '<span class="pill"><i class="fa-solid fa-crosshairs"></i> ' + escapeHtml(item.label) + '</span>' +
            '<span class="pill">asset ' + escapeHtml(item.stage) + '</span>' +
          '</div>' +
          '<div class="card-title">' + escapeHtml(item.title) + '</div>' +
          '<div class="card-copy">' + escapeHtml(item.copy) + '</div>' +
        '</article>';
      }).join('');

      document.getElementById('hook-list').innerHTML = TOP_HOOKS.map(function(item) {
        return '<article class="card hook">' +
          '<div class="card-top">' +
            '<span class="pill"><i class="fa-solid fa-sparkles"></i> ' + escapeHtml(item.lane) + '</span>' +
            '<span class="pill">' + escapeHtml(item.format) + '</span>' +
          '</div>' +
          '<div class="card-title">' + escapeHtml(item.title) + '</div>' +
          '<div class="card-copy">' + escapeHtml(item.copy) + '</div>' +
        '</article>';
      }).join('');
    }

    function renderState(state) {
      const revenue = state.revenue || {};
      const reviewItems = Array.isArray(state.reviews && state.reviews.items) ? state.reviews.items : [];
      const postsToday = derivePostsToday(state);
      const revenueTotal = safeNumber(revenue.total);
      const revenueTarget = safeNumber(revenue.target) || 100;

      document.getElementById('hero-copy').textContent =
        revenueTotal > 0
          ? 'Forge has visible revenue now. This page is about protecting momentum, shipping the next offer, and turning the content engine into a repeatable revenue engine.'
          : 'Forge has the story, the hooks, the visuals, the guide draft, the audio, and the launch copy. The mission now is brutally simple: turn all of that into the first dollar.';

      document.getElementById('launch-posture').textContent =
        revenueTotal > 0 ? 'Compounding' : 'First dollar hunt';
      document.getElementById('launch-copy').textContent =
        postsToday > 0
          ? 'Broadcast is live today, which means the attention engine is already moving. The launch page exists to convert that motion into offers and receipts.'
          : 'Even if live posting is quiet right now, the asset stack is loaded. This surface shows how to turn it into money instead of more drafts.';

      document.getElementById('launch-revenue').textContent = formatCurrency(revenueTotal, 0);
      document.getElementById('launch-posts').textContent = String(postsToday);
      document.getElementById('launch-review').textContent = String(reviewItems.length);
      document.getElementById('target-metric').textContent = formatCurrency(revenueTarget, 0);
      document.getElementById('strike-kicker').textContent = FEATURED_STRIKE.length + ' asset strike stack ready to ship';
      document.getElementById('hooks-kicker').textContent = TOP_HOOKS.length + ' sharp hooks loaded for launch';
      document.getElementById('sync-chip').innerHTML = '<strong>Synced ' + escapeHtml(formatRelative(state.lastUpdated)) + '</strong>';
    }

    async function fetchState() {
      const response = await fetch('/api/state', { cache: 'no-store' });
      if (!response.ok) throw new Error('Unable to load launch state');
      return response.json();
    }

    async function boot() {
      renderHeartbeat();
      renderStaticSections();
      setClock();
      setInterval(setClock, 1000);
      try {
        const state = await fetchState();
        renderState(state);
      } catch (error) {
        document.getElementById('hero-copy').textContent = error.message;
      }
    }

    boot();
  </script>
</body>
</html>`;

export default launchpadHtml;
