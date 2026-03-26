const storyMobileHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>Forge Story Mobile</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
  <style>
    :root {
      --bg: #04090f;
      --panel: rgba(11, 20, 30, 0.92);
      --panel-soft: rgba(14, 26, 39, 0.9);
      --border: rgba(148, 176, 206, 0.14);
      --text: #f5f8fc;
      --muted: #aab9cd;
      --soft: #73869b;
      --blue: #79bcff;
      --orange: #ff9e52;
      --green: #35d3a3;
      --red: #ff6c7b;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      min-height: 100%;
      background:
        radial-gradient(circle at 16% 12%, rgba(121, 188, 255, 0.16), transparent 28%),
        radial-gradient(circle at 88% 10%, rgba(255, 158, 82, 0.15), transparent 24%),
        linear-gradient(180deg, #04090f 0%, #08111a 56%, #0a121b 100%);
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
      background-size: 42px 42px;
      mask-image: linear-gradient(180deg, rgba(0,0,0,0.78), transparent 94%);
    }

    a { color: inherit; text-decoration: none; }

    .app {
      width: min(100%, 430px);
      margin: 0 auto;
      padding: 14px 14px 34px;
    }

    .badge-row {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
      margin-bottom: 12px;
    }

    .badge,
    .mini,
    .kicker {
      font-family: "IBM Plex Mono", monospace;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-size: 11px;
    }

    .badge {
      display: inline-flex;
      gap: 8px;
      align-items: center;
      padding: 8px 10px;
      border-radius: 999px;
      background: rgba(121, 188, 255, 0.1);
      border: 1px solid rgba(121, 188, 255, 0.16);
      color: var(--blue);
    }

    .mini {
      color: var(--soft);
    }

    .hero,
    .panel,
    .cta {
      position: relative;
      overflow: hidden;
      border-radius: 28px;
      border: 1px solid var(--border);
      background: var(--panel);
      box-shadow: 0 22px 54px rgba(0, 0, 0, 0.32);
    }

    .hero {
      padding: 24px 20px 22px;
      background:
        radial-gradient(circle at 88% 10%, rgba(255, 158, 82, 0.18), transparent 26%),
        radial-gradient(circle at 10% 80%, rgba(121, 188, 255, 0.14), transparent 28%),
        linear-gradient(180deg, rgba(12, 22, 33, 0.96), rgba(9, 17, 26, 0.96));
    }

    .mark {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      background:
        radial-gradient(circle at 32% 34%, rgba(255, 164, 84, 0.46), transparent 36%),
        linear-gradient(145deg, rgba(22, 35, 53, 0.98), rgba(6, 12, 19, 0.96));
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 0 30px rgba(255, 138, 45, 0.12);
      color: #f6f9fc;
      font-weight: 700;
      font-size: 20px;
      letter-spacing: -0.06em;
      margin-bottom: 14px;
    }

    .kicker {
      color: var(--blue);
      margin-bottom: 10px;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.5rem, 11vw, 4.2rem);
      line-height: 0.9;
      letter-spacing: -0.08em;
      max-width: 8ch;
    }

    .hero-copy {
      margin: 14px 0 0;
      color: var(--muted);
      line-height: 1.72;
      font-size: 15px;
    }

    .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 999px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.06);
      color: var(--muted);
      font-size: 12px;
    }

    .panel {
      margin-top: 14px;
      padding: 18px;
      background: var(--panel-soft);
    }

    .section-title {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.04em;
      margin-bottom: 12px;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .metric {
      padding: 14px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.06);
      background: rgba(255,255,255,0.03);
    }

    .metric strong {
      display: block;
      font-size: 28px;
      letter-spacing: -0.06em;
      margin-top: 8px;
    }

    .metric span {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
    }

    .roast-list,
    .timeline,
    .cta-list {
      display: grid;
      gap: 10px;
    }

    .roast,
    .event,
    .cta-item {
      padding: 14px;
      border-radius: 20px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
    }

    .roast strong,
    .event strong,
    .cta-item strong {
      display: block;
      font-size: 15px;
      margin-bottom: 6px;
    }

    .roast span,
    .event span,
    .cta-item span {
      color: var(--muted);
      font-size: 14px;
      line-height: 1.66;
    }

    .quote {
      font-size: 24px;
      line-height: 1.2;
      letter-spacing: -0.05em;
      margin: 0 0 10px;
    }

    .cta {
      margin-top: 16px;
      padding: 20px 18px 18px;
      background:
        radial-gradient(circle at 88% 10%, rgba(255, 158, 82, 0.16), transparent 24%),
        linear-gradient(180deg, rgba(13, 24, 36, 0.96), rgba(8, 15, 23, 0.96));
    }

    .cta-actions {
      display: grid;
      gap: 10px;
      margin-top: 14px;
    }

    .button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 14px 16px;
      border-radius: 16px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.04);
      font-weight: 600;
      font-size: 14px;
    }

    .button.primary {
      background: linear-gradient(135deg, rgba(121, 188, 255, 0.18), rgba(255, 158, 82, 0.12));
    }
  </style>
</head>
<body>
  <div class="app">
    <div class="badge-row">
      <div class="badge"><i class="fa-solid fa-fire"></i> Forge Story Mobile</div>
      <div class="mini" id="sync-chip">Sync pending</div>
    </div>

    <section class="hero">
      <div class="mark">F</div>
      <div class="kicker">AI experiment, zero fake guru energy</div>
      <h1>The AI was not magic. It was a very fast way to find our dumbest mistakes.</h1>
      <p class="hero-copy">Everybody is busy either worshipping AI or screaming that it is coming for their job. Meanwhile ours mostly burned money, duplicated content, assigned a human homework, and forced us to build better systems. That is why Forge is worth following.</p>
      <div class="chip-row">
        <div class="chip"><i class="fa-solid fa-sack-dollar"></i> $809 invested</div>
        <div class="chip"><i class="fa-solid fa-bolt"></i> $75/day leak caught</div>
        <div class="chip"><i class="fa-solid fa-arrows-rotate"></i> 47x cheaper after fix</div>
      </div>
    </section>

    <section class="panel">
      <div class="section-title">Why Forge Is Funny</div>
      <div class="roast-list">
        <div class="roast">
          <strong>AI is not replacing you. It is recreating your management problems at machine speed.</strong>
          <span>Forge produced too much, chased the wrong priorities, duplicated work, and needed a review loop. In other words: congratulations, it became an employee.</span>
        </div>
        <div class="roast">
          <strong>Everybody says AI will change the world. Ours handed the boss a to-do list.</strong>
          <span>The team had to write a literal rule saying the agent is not allowed to assign human approval tasks. The future remains deeply unserious.</span>
        </div>
        <div class="roast">
          <strong>People hate AI until someone actually shows the receipts.</strong>
          <span>Forge publishes the spend, the mistakes, the fixes, and the postmortems. No fake thought-leader cosplay. Just operational damage and what we learned from it.</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="section-title">The 90-Day Bet</div>
      <div class="metric-grid">
        <div class="metric">
          <div class="mini">start</div>
          <strong>Mar 23</strong>
          <span>Forge went live as a real autonomous experiment on a Mac Mini.</span>
        </div>
        <div class="metric">
          <div class="mini">damage</div>
          <strong>$809</strong>
          <span>Real spend before real revenue. Better than faking competence.</span>
        </div>
        <div class="metric">
          <div class="mini">leak</div>
          <strong>$75/day</strong>
          <span>Silent model fallback tried to beat the budget to death.</span>
        </div>
        <div class="metric">
          <div class="mini">fix</div>
          <strong>$1.60/day</strong>
          <span>DeepSeek pivot and routing discipline made the machine sustainable.</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="section-title">What Actually Happened</div>
      <div class="timeline">
        <div class="event">
          <strong>March 23: Forge went feral</strong>
          <span>46 files, 210K characters, 27 commits, and enough chaos to make “AI productivity” sound like a legal defense.</span>
        </div>
        <div class="event">
          <strong>March 24: the money got loud</strong>
          <span>APIs broke, pricing changed, the revenue stayed at zero, and the business got honest fast.</span>
        </div>
        <div class="event">
          <strong>March 25: the machine got accountable</strong>
          <span>The team rebuilt the dashboard, added the review OS, fixed the cost bleed, and turned the mess into a system.</span>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="mini" style="color: var(--blue);">Follow the build, not the hype</div>
      <p class="quote">Who is going to be laughing in 90 days: the people yelling about AI, or the people publishing every mistake until it turns into revenue?</p>
      <div class="cta-list">
        <div class="cta-item">
          <strong>Follow Forge</strong>
          <span>Watch the machine build in public, break in public, and get sharper in public.</span>
        </div>
        <div class="cta-item">
          <strong>Open the full story</strong>
          <span>See the receipts, the timeline, the review loop, and the cost corrections that made the experiment worth paying attention to.</span>
        </div>
      </div>
      <div class="cta-actions">
        <a class="button primary" href="https://x.com/Forge_Builds" target="_blank" rel="noreferrer"><i class="fa-brands fa-x-twitter"></i> Follow @Forge_Builds</a>
        <a class="button" href="/story"><i class="fa-solid fa-timeline"></i> Open full story</a>
      </div>
    </section>
  </div>

  <script>
    function formatRelative(iso) {
      if (!iso) return 'Sync pending';
      const target = new Date(iso);
      if (Number.isNaN(target.getTime())) return 'Sync pending';
      const diffMinutes = Math.round((Date.now() - target.getTime()) / 60000);
      if (Math.abs(diffMinutes) < 1) return 'Just now';
      if (Math.abs(diffMinutes) < 60) return diffMinutes > 0 ? 'Synced ' + diffMinutes + 'm ago' : 'Sync in ' + Math.abs(diffMinutes) + 'm';
      const diffHours = Math.round(diffMinutes / 60);
      if (Math.abs(diffHours) < 24) return diffHours > 0 ? 'Synced ' + diffHours + 'h ago' : 'Sync in ' + Math.abs(diffHours) + 'h';
      const diffDays = Math.round(diffHours / 24);
      return diffDays > 0 ? 'Synced ' + diffDays + 'd ago' : 'Sync in ' + Math.abs(diffDays) + 'd';
    }

    async function boot() {
      try {
        const response = await fetch('/api/state', { cache: 'no-store' });
        if (!response.ok) throw new Error('state unavailable');
        const state = await response.json();
        document.getElementById('sync-chip').textContent = formatRelative(state.lastUpdated);
      } catch (error) {
        document.getElementById('sync-chip').textContent = 'Live state offline';
      }
    }

    boot();
  </script>
</body>
</html>`;

export default storyMobileHtml;
