const missionControlHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Forge Command</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="preconnect" href="https://cdnjs.cloudflare.com">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --bg-void: #04070c;
      --bg-deep: #08111a;
      --bg-surface: rgba(11, 20, 31, 0.88);
      --bg-raised: rgba(16, 29, 43, 0.96);
      --bg-soft: rgba(255, 255, 255, 0.04);
      --bg-success: rgba(50, 212, 164, 0.14);
      --bg-warning: rgba(255, 177, 68, 0.14);
      --bg-danger: rgba(255, 107, 122, 0.16);
      --text-primary: #f4f8fc;
      --text-secondary: #a7b8cc;
      --text-tertiary: #6e849d;
      --border: rgba(164, 188, 214, 0.12);
      --border-strong: rgba(164, 188, 214, 0.24);
      --accent: #6ab3ff;
      --accent-strong: #95ceff;
      --forge: #69c8ff;
      --sun: #ff8a2d;
      --success: #32d4a4;
      --warning: #ffb144;
      --danger: #ff6b7a;
      --shadow-lg: 0 28px 90px rgba(0, 0, 0, 0.42);
      --shadow-md: 0 18px 48px rgba(0, 0, 0, 0.28);
      --radius-xl: 30px;
      --radius-lg: 24px;
      --radius-md: 18px;
      --radius-sm: 14px;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      min-height: 100%;
      background:
        radial-gradient(circle at 12% 16%, rgba(106, 179, 255, 0.2), transparent 24%),
        radial-gradient(circle at 82% 12%, rgba(255, 138, 45, 0.22), transparent 20%),
        radial-gradient(circle at 88% 24%, rgba(255, 138, 45, 0.12), transparent 18%),
        linear-gradient(180deg, #03060a 0%, #061019 40%, #050a11 100%);
      color: var(--text-primary);
      font-family: "Space Grotesk", "Segoe UI", sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: 0.05;
      background-image:
        linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px);
      background-size: 80px 80px;
      mask-image: linear-gradient(180deg, rgba(0,0,0,0.94), transparent 88%);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button {
      font: inherit;
    }

    .app-shell {
      max-width: 1560px;
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
      gap: 9px;
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

    .clock,
    .sync-chip {
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

    .panel::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(180deg, rgba(255,255,255,0.03), transparent 40%);
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.18fr) minmax(360px, 0.82fr);
      gap: 20px;
      padding: 30px;
      margin-bottom: 18px;
      background:
        radial-gradient(circle at 12% 18%, rgba(106, 179, 255, 0.12), transparent 28%),
        radial-gradient(circle at 88% 12%, rgba(255, 138, 45, 0.14), transparent 24%),
        linear-gradient(145deg, rgba(11, 21, 31, 0.94), rgba(8, 14, 22, 0.96));
    }

    .hero-copy {
      position: relative;
      z-index: 1;
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
      font-size: clamp(3rem, 6vw, 5.6rem);
      line-height: 0.9;
      letter-spacing: -0.07em;
      max-width: 8.5ch;
    }

    .hero p {
      margin: 18px 0 0;
      max-width: 62ch;
      color: var(--text-secondary);
      font-size: 1.02rem;
      line-height: 1.8;
    }

    .status-row {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 22px;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 999px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      font-size: 13px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--success);
      box-shadow: 0 0 0 0 rgba(50, 212, 164, 0.4);
      animation: pulse 2s ease-in-out infinite;
      flex: 0 0 auto;
    }

    .status-dot.warning {
      background: var(--warning);
      box-shadow: 0 0 0 0 rgba(255, 177, 68, 0.4);
    }

    .status-dot.danger {
      background: var(--danger);
      box-shadow: 0 0 0 0 rgba(255, 107, 122, 0.42);
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

    .hero-side {
      display: grid;
      gap: 16px;
      position: relative;
      z-index: 1;
    }

    .telemetry-card {
      padding: 18px;
      border-radius: var(--radius-lg);
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-md);
    }

    .telemetry-label {
      color: var(--text-tertiary);
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .telemetry-title {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.04em;
      margin-bottom: 10px;
    }

    .telemetry-copy {
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 14px;
    }

    .heartbeat-field {
      display: grid;
      grid-template-columns: repeat(28, minmax(0, 1fr));
      gap: 4px;
      align-items: end;
      height: 98px;
      margin-top: 12px;
    }

    .heartbeat-field span {
      display: block;
      width: 100%;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(106, 179, 255, 0.9), rgba(255, 138, 45, 0.4));
      box-shadow: 0 0 18px rgba(106, 179, 255, 0.08);
      animation: beat 1.7s ease-in-out infinite;
      animation-delay: calc(var(--i) * 55ms);
      min-height: 14px;
    }

    .telemetry-list {
      display: grid;
      gap: 12px;
      margin-top: 6px;
    }

    .telemetry-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
      color: var(--text-secondary);
      font-size: 14px;
    }

    .telemetry-row strong {
      color: var(--text-primary);
      font-weight: 600;
      text-align: right;
    }

    .glance-row {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 18px;
    }

    .metric-card {
      padding: 18px 18px 20px;
      border-radius: var(--radius-lg);
      background: rgba(10, 18, 28, 0.84);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }

    .metric-card::after {
      content: "";
      position: absolute;
      inset: auto -10% -40% 35%;
      height: 60%;
      background: radial-gradient(circle, rgba(106, 179, 255, 0.16), transparent 70%);
      pointer-events: none;
    }

    .metric-card.warning::after {
      background: radial-gradient(circle, rgba(255, 177, 68, 0.18), transparent 70%);
    }

    .metric-card.danger::after {
      background: radial-gradient(circle, rgba(255, 107, 122, 0.18), transparent 70%);
    }

    .metric-label {
      position: relative;
      z-index: 1;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--text-tertiary);
      margin-bottom: 12px;
    }

    .metric-value {
      position: relative;
      z-index: 1;
      font-size: clamp(2rem, 3vw, 3rem);
      line-height: 0.95;
      letter-spacing: -0.06em;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .metric-copy {
      position: relative;
      z-index: 1;
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 14px;
    }

    .bar-track {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 8px;
      border-radius: 999px;
      background: rgba(255,255,255,0.06);
      overflow: hidden;
      margin-top: 12px;
      border: 1px solid rgba(255,255,255,0.03);
    }

    .bar-fill {
      height: 100%;
      width: 0%;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(106, 179, 255, 0.92), rgba(255, 138, 45, 0.92));
      box-shadow: 0 0 18px rgba(106, 179, 255, 0.18);
      transition: width 380ms ease;
    }

    .main-grid {
      display: grid;
      grid-template-columns: minmax(320px, 1fr) minmax(360px, 1.05fr) minmax(300px, 0.9fr);
      gap: 18px;
      align-items: start;
    }

    .stack {
      display: grid;
      gap: 18px;
      align-content: start;
    }

    .section-card {
      padding: 20px;
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
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.04em;
    }

    .section-subtle {
      color: var(--text-tertiary);
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .blocked-list,
    .review-list,
    .money-list,
    .task-list,
    .post-list,
    .completed-list,
    .fabric-list,
    .story-rail {
      display: grid;
      gap: 12px;
    }

    .task-card {
      position: relative;
      padding: 16px;
      border-radius: var(--radius-md);
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
      overflow: hidden;
    }

    .task-card.blocked {
      border-color: rgba(255, 177, 68, 0.26);
      box-shadow:
        inset 0 0 0 1px rgba(255, 177, 68, 0.08),
        0 0 0 1px rgba(255, 107, 122, 0.06),
        0 14px 30px rgba(255, 107, 122, 0.08);
      animation: blockedPulse 2.9s ease-in-out infinite;
    }

    .task-card.review {
      border-left: 4px solid rgba(106, 179, 255, 0.84);
      padding-left: 14px;
    }

    .task-card.done {
      border-left: 4px solid rgba(50, 212, 164, 0.84);
      padding-left: 14px;
    }

    .task-card.money {
      border-left: 4px solid rgba(255, 138, 45, 0.84);
      padding-left: 14px;
      background:
        radial-gradient(circle at 100% 0%, rgba(255, 138, 45, 0.08), transparent 34%),
        rgba(255,255,255,0.03);
    }

    .task-top {
      display: flex;
      gap: 10px;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.05);
      color: var(--text-secondary);
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .pill.blocked { color: #ffd59a; }
    .pill.approve { color: #8fe7c7; }
    .pill.revision { color: #ffcf85; }
    .pill.reject { color: #ff9eaa; }

    .task-title {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.4;
      letter-spacing: -0.02em;
    }

    .task-copy {
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 14px;
    }

    .task-actions {
      margin-top: 14px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .mini-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 12px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 600;
    }

    .live-card {
      padding: 20px;
      border-radius: var(--radius-xl);
      background:
        linear-gradient(145deg, rgba(10, 18, 28, 0.94), rgba(6, 13, 20, 0.94));
      border: 1px solid var(--border);
      box-shadow: var(--shadow-md);
    }

    .live-card.active {
      border-color: rgba(106, 179, 255, 0.24);
      box-shadow:
        0 22px 54px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(106, 179, 255, 0.08),
        0 0 60px rgba(106, 179, 255, 0.12);
    }

    .live-headline {
      font-size: clamp(1.8rem, 3vw, 2.6rem);
      line-height: 1;
      letter-spacing: -0.06em;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .live-copy {
      color: var(--text-secondary);
      line-height: 1.8;
      font-size: 15px;
      margin-bottom: 16px;
    }

    .timeline {
      display: grid;
      gap: 14px;
      position: relative;
      padding-left: 18px;
    }

    .timeline::before {
      content: "";
      position: absolute;
      left: 7px;
      top: 3px;
      bottom: 3px;
      width: 2px;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(106, 179, 255, 0.28), rgba(255, 138, 45, 0.18));
    }

    .timeline-item {
      position: relative;
      padding: 0 0 0 14px;
    }

    .timeline-item::before {
      content: "";
      position: absolute;
      left: -18px;
      top: 7px;
      width: 12px;
      height: 12px;
      border-radius: 999px;
      background: rgba(106, 179, 255, 0.9);
      box-shadow: 0 0 0 5px rgba(106, 179, 255, 0.1);
    }

    .timeline-item.blocked::before {
      background: rgba(255, 177, 68, 0.95);
      box-shadow: 0 0 0 5px rgba(255, 177, 68, 0.1);
    }

    .timeline-item.done::before {
      background: rgba(50, 212, 164, 0.95);
      box-shadow: 0 0 0 5px rgba(50, 212, 164, 0.1);
    }

    .timeline-kicker {
      color: var(--text-tertiary);
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .timeline-title {
      font-size: 15px;
      font-weight: 600;
      line-height: 1.45;
      margin-bottom: 6px;
    }

    .timeline-copy {
      color: var(--text-secondary);
      line-height: 1.65;
      font-size: 14px;
    }

    .sparkline {
      display: grid;
      grid-template-columns: repeat(8, minmax(0, 1fr));
      gap: 8px;
      align-items: end;
      height: 84px;
      margin-top: 16px;
    }

    .sparkline span {
      display: block;
      border-radius: 12px 12px 6px 6px;
      background: linear-gradient(180deg, rgba(106, 179, 255, 0.92), rgba(106, 179, 255, 0.18));
      min-height: 12px;
      transition: height 240ms ease;
    }

    .sparkline span.warning {
      background: linear-gradient(180deg, rgba(255, 177, 68, 0.92), rgba(255, 177, 68, 0.18));
    }

    .sparkline span.danger {
      background: linear-gradient(180deg, rgba(255, 107, 122, 0.92), rgba(255, 107, 122, 0.18));
    }

    .fabric-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .fabric-card {
      padding: 16px;
      border-radius: var(--radius-md);
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
    }

    .fabric-card.full {
      grid-column: 1 / -1;
    }

    .fabric-label {
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--text-tertiary);
      margin-bottom: 8px;
    }

    .fabric-value {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.05em;
      margin-bottom: 8px;
    }

    .fabric-copy {
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 14px;
    }

    .api-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .api-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 999px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      font-size: 12px;
      color: var(--text-secondary);
      text-transform: lowercase;
    }

    .api-pill i {
      font-size: 8px;
    }

    .api-pill.online i { color: var(--success); }
    .api-pill.offline i { color: var(--danger); }
    .api-pill.degraded i { color: var(--warning); }

    .post-card {
      padding: 15px;
      border-radius: var(--radius-md);
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
    }

    .post-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
      margin-bottom: 10px;
    }

    .post-handle {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .post-time {
      color: var(--text-tertiary);
      font-size: 12px;
    }

    .post-body {
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 14px;
      margin-bottom: 12px;
    }

    .post-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .post-meta span {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 10px;
      border-radius: 999px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.05);
      color: var(--text-secondary);
      font-size: 12px;
    }

    .schedule-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
    }

    .slot {
      padding: 14px;
      border-radius: var(--radius-md);
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
      min-height: 110px;
    }

    .slot-hour {
      font-family: "IBM Plex Mono", ui-monospace, monospace;
      font-size: 13px;
      color: var(--text-tertiary);
      margin-bottom: 10px;
    }

    .slot-name {
      font-size: 15px;
      font-weight: 600;
      line-height: 1.4;
      margin-bottom: 8px;
    }

    .slot-meta {
      color: var(--text-secondary);
      font-size: 13px;
      line-height: 1.5;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .footer-row {
      margin-top: 18px;
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
      gap: 18px;
    }

    .empty {
      padding: 16px;
      border-radius: var(--radius-md);
      border: 1px dashed rgba(164, 188, 214, 0.18);
      color: var(--text-secondary);
      background: rgba(255,255,255,0.02);
      line-height: 1.7;
      font-size: 14px;
    }

    .story-callout {
      padding: 18px;
      border-radius: var(--radius-lg);
      background:
        radial-gradient(circle at 86% 16%, rgba(255, 138, 45, 0.18), transparent 28%),
        linear-gradient(145deg, rgba(9, 18, 28, 0.96), rgba(6, 12, 19, 0.94));
      border: 1px solid rgba(255,255,255,0.08);
    }

    .story-callout h3 {
      margin: 0 0 8px;
      font-size: 24px;
      letter-spacing: -0.05em;
    }

    .story-callout p {
      margin: 0 0 14px;
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 15px;
    }

    .story-rail {
      margin-top: 14px;
    }

    .story-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.07);
      background: rgba(255,255,255,0.04);
      color: var(--text-secondary);
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(50, 212, 164, 0.42); }
      70% { box-shadow: 0 0 0 12px rgba(50, 212, 164, 0); }
      100% { box-shadow: 0 0 0 0 rgba(50, 212, 164, 0); }
    }

    @keyframes beat {
      0%, 100% { transform: scaleY(0.32); opacity: 0.42; }
      20% { transform: scaleY(0.88); opacity: 0.9; }
      50% { transform: scaleY(0.48); opacity: 0.65; }
      74% { transform: scaleY(1); opacity: 1; }
    }

    @keyframes blockedPulse {
      0%, 100% { box-shadow: inset 0 0 0 1px rgba(255, 177, 68, 0.08), 0 0 0 1px rgba(255, 107, 122, 0.06), 0 14px 30px rgba(255, 107, 122, 0.08); }
      50% { box-shadow: inset 0 0 0 1px rgba(255, 177, 68, 0.12), 0 0 0 1px rgba(255, 107, 122, 0.12), 0 18px 34px rgba(255, 107, 122, 0.12), 0 0 26px rgba(255, 177, 68, 0.12); }
    }

    @media (max-width: 1240px) {
      .hero,
      .main-grid,
      .footer-row,
      .glance-row {
        grid-template-columns: 1fr;
      }

      .topbar {
        grid-template-columns: 1fr;
      }

      .topbar-meta {
        justify-content: flex-start;
      }
    }

    @media (max-width: 820px) {
      .app-shell {
        padding: 16px 16px 30px;
      }

      .hero,
      .section-card,
      .live-card {
        padding: 18px;
      }

      .schedule-grid,
      .fabric-grid {
        grid-template-columns: 1fr;
      }

      .heartbeat-strip {
        width: 100%;
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
        <a class="active" href="/"><i class="fa-solid fa-satellite-dish"></i> Command</a>
        <a href="/review"><i class="fa-solid fa-shield-halved"></i> Review</a>
        <a href="/x-posts"><i class="fa-brands fa-x-twitter"></i> Broadcast</a>
        <a href="/story"><i class="fa-solid fa-timeline"></i> Story</a>
        <a href="/launchpad"><i class="fa-solid fa-rocket"></i> Launch</a>
      </nav>
      <div class="topbar-meta">
        <div class="heartbeat-strip" id="heartbeat-strip"></div>
        <div class="clock" id="clock">--:--:-- --</div>
        <div class="sync-chip" id="sync-chip"><strong>Awaiting sync</strong></div>
      </div>
    </header>

    <section class="panel hero">
      <div class="hero-copy">
        <div class="eyebrow"><i class="fa-solid fa-wave-square"></i> Live operational command surface</div>
        <h1>Forge Is Running The Story In Public.</h1>
        <p id="hero-copy">Waiting for live state.</p>
        <div class="status-row">
          <div class="status-pill"><span class="status-dot" id="status-dot"></span><span id="status-pill-text">Initializing</span></div>
          <div class="status-pill"><i class="fa-solid fa-layer-group"></i> <span id="model-pill-text">Model lane --</span></div>
          <div class="status-pill"><i class="fa-solid fa-calendar-day"></i> <span id="sessions-pill-text">Sessions today --</span></div>
        </div>
        <div class="hero-actions">
          <a class="button-link primary" href="/review"><i class="fa-solid fa-arrow-right"></i> Clear the review queue</a>
          <a class="button-link" href="/story"><i class="fa-solid fa-up-right-from-square"></i> Open the shareable story</a>
          <a class="button-link" href="/launchpad"><i class="fa-solid fa-rocket"></i> Open launchpad</a>
        </div>
      </div>
      <div class="hero-side">
        <div class="telemetry-card">
          <div class="telemetry-label">Heartbeat</div>
          <div class="telemetry-title" id="heartbeat-title">Standby</div>
          <div class="telemetry-copy" id="heartbeat-copy">Waiting on the first state refresh.</div>
          <div class="heartbeat-field" id="heartbeat-field"></div>
        </div>
        <div class="telemetry-card">
          <div class="telemetry-label">Operator Readout</div>
          <div class="telemetry-list">
            <div class="telemetry-row"><span>Current posture</span><strong id="telemetry-posture">--</strong></div>
            <div class="telemetry-row"><span>Next session</span><strong id="telemetry-next-session">--</strong></div>
            <div class="telemetry-row"><span>Review pressure</span><strong id="telemetry-review-pressure">--</strong></div>
            <div class="telemetry-row"><span>Distribution today</span><strong id="telemetry-distribution">--</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section class="glance-row">
      <article class="panel metric-card">
        <div class="metric-label">Revenue Target</div>
        <div class="metric-value" id="metric-revenue">$0</div>
        <div class="metric-copy" id="metric-revenue-copy">Waiting for commerce data.</div>
        <div class="bar-track"><div class="bar-fill" id="metric-revenue-bar"></div></div>
      </article>
      <article class="panel metric-card">
        <div class="metric-label">DeepSeek Balance</div>
        <div class="metric-value" id="metric-balance">$0</div>
        <div class="metric-copy" id="metric-balance-copy">Fuel gauge for autonomous work.</div>
        <div class="bar-track"><div class="bar-fill" id="metric-balance-bar"></div></div>
      </article>
      <article class="panel metric-card warning">
        <div class="metric-label">Review Pressure</div>
        <div class="metric-value" id="metric-review">0</div>
        <div class="metric-copy" id="metric-review-copy">Pending items waiting on Lucas.</div>
        <div class="bar-track"><div class="bar-fill" id="metric-review-bar"></div></div>
      </article>
      <article class="panel metric-card danger">
        <div class="metric-label">Blocked Work</div>
        <div class="metric-value" id="metric-blocked">0</div>
        <div class="metric-copy" id="metric-blocked-copy">Human attention bottlenecks.</div>
        <div class="bar-track"><div class="bar-fill" id="metric-blocked-bar"></div></div>
      </article>
    </section>

    <section class="main-grid">
      <div class="stack">
        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Action Required</div>
            <div class="section-subtle" id="action-count">0 waiting</div>
          </div>
          <div class="blocked-list" id="blocked-list"></div>
        </section>

        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Ready For Review</div>
            <div class="section-subtle" id="review-count">0 live</div>
          </div>
          <div class="review-list" id="review-list"></div>
        </section>
      </div>

      <div class="stack">
        <section class="live-card" id="execution-card">
          <div class="section-header">
            <div class="section-title">Execution Lane</div>
            <div class="section-subtle" id="execution-kicker">Live machine state</div>
          </div>
          <div class="live-headline" id="execution-title">Waiting for state</div>
          <div class="live-copy" id="execution-copy">As soon as the worker sync lands, this panel shows whether Forge is actively working, waiting on human decisions, or lining up the next run.</div>
          <div class="telemetry-list">
            <div class="telemetry-row"><span>Primary model</span><strong id="execution-model">--</strong></div>
            <div class="telemetry-row"><span>System uptime</span><strong id="execution-uptime">--</strong></div>
            <div class="telemetry-row"><span>Queue posture</span><strong id="execution-queue-posture">--</strong></div>
          </div>
        </section>

        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Operational Timeline</div>
            <div class="section-subtle" id="timeline-kicker">Newest pressure + output</div>
          </div>
          <div class="timeline" id="timeline"></div>
        </section>

        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Review Velocity</div>
            <div class="section-subtle" id="velocity-kicker">Queue clearance signal</div>
          </div>
          <div class="fabric-grid">
            <div class="fabric-card">
              <div class="fabric-label">Items reviewed</div>
              <div class="fabric-value" id="velocity-reviewed">0</div>
              <div class="fabric-copy" id="velocity-reviewed-copy">Decision count currently visible in state.</div>
            </div>
            <div class="fabric-card">
              <div class="fabric-label">Backlog</div>
              <div class="fabric-value" id="velocity-backlog">0</div>
              <div class="fabric-copy" id="velocity-backlog-copy">What still needs Lucas.</div>
            </div>
            <div class="fabric-card full">
              <div class="fabric-label">Clearance pulse</div>
              <div class="sparkline" id="velocity-sparkline"></div>
              <div class="fabric-copy" id="velocity-summary" style="margin-top:12px;">Waiting for review analytics.</div>
            </div>
          </div>
        </section>
      </div>

      <div class="stack">
        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Distribution Output</div>
            <div class="section-subtle" id="distribution-kicker">Broadcast console</div>
          </div>
          <div class="post-list" id="post-list"></div>
        </section>

        <section class="section-card">
          <div class="section-header">
            <div class="section-title">Revenue Attack Board</div>
            <div class="section-subtle" id="money-kicker">First dollars > vanity</div>
          </div>
          <div class="money-list" id="money-list"></div>
        </section>

        <section class="section-card">
          <div class="section-header">
            <div class="section-title">System Fabric</div>
            <div class="section-subtle">What the stack looks like right now</div>
          </div>
          <div class="fabric-grid">
            <div class="fabric-card">
              <div class="fabric-label">Queue</div>
              <div class="fabric-value" id="fabric-queue">--</div>
              <div class="fabric-copy" id="fabric-queue-copy">Ready, blocked, done.</div>
            </div>
            <div class="fabric-card">
              <div class="fabric-label">Commerce</div>
              <div class="fabric-value" id="fabric-commerce">--</div>
              <div class="fabric-copy" id="fabric-commerce-copy">Products and subscribers tracked.</div>
            </div>
            <div class="fabric-card full">
              <div class="fabric-label">API heartbeat</div>
              <div class="api-grid" id="api-grid"></div>
            </div>
          </div>
        </section>

        <section class="story-callout">
          <div class="story-chip"><i class="fa-solid fa-fire"></i> Shareable Layer</div>
          <h3>Forge Is More Interesting Than The Dashboard Shows.</h3>
          <p>The new story page turns the receipts into a public demo: the $75/day mistake, the DeepSeek pivot, the review OS, the first scheduled posts, and the first products.</p>
          <a class="button-link primary" href="/story"><i class="fa-solid fa-timeline"></i> Open the story page</a>
          <div class="story-rail" id="story-rail"></div>
        </section>
      </div>
    </section>

    <section class="footer-row">
      <section class="section-card">
        <div class="section-header">
          <div class="section-title">24 Hour Schedule</div>
          <div class="section-subtle" id="schedule-kicker">Execution runway</div>
        </div>
        <div class="schedule-grid" id="schedule-grid"></div>
      </section>

      <section class="section-card">
        <div class="section-header">
          <div class="section-title">Completed Work</div>
          <div class="section-subtle" id="completed-kicker">Latest shipped motion</div>
        </div>
        <div class="completed-list" id="completed-list"></div>
      </section>
    </section>
  </div>

  <script>
    const STORY_BEATS = [
      { date: 'March 23, 2026', title: 'Forge goes live', copy: 'Day 1 established the experiment: a real autonomous operator running on a Mac Mini with full logs and real money on the line.' },
      { date: 'March 24, 2026', title: '$809 invested, $0 revenue', copy: 'APIs broke, pricing reversed, and the business reality became impossible to ignore.' },
      { date: 'March 25, 2026', title: '$75/day model bleed discovered', copy: 'The team caught a silent cost problem and pivoted the autonomous lane to DeepSeek for a documented 47x cost reduction.' },
      { date: 'March 25, 2026', title: 'Review OS rebuilt', copy: 'Forge stopped shipping blind by putting every asset through a human review surface with previews, decisions, and analytics.' },
      { date: 'March 25-26, 2026', title: 'Broadcast and product pipeline light up', copy: 'Three X posts were logged, a second security checklist shipped into review, and the product engine became visible.' }
    ];

    const MONEY_MOVES = [
      {
        rank: '01',
        title: 'Launch The $809 Mistake Guide',
        urgency: 'right now',
        detail: 'This is the closest thing to first-dollar revenue already sitting on disk: 10 drafted chapters, Gumroad copy, launch posts, voice clips, and visual cards. Finish the cover, assemble the PDF, and publish.',
      },
      {
        rank: '02',
        title: 'Lead With The $75/Day Leak',
        urgency: 'today',
        detail: 'Use the strongest painful number to earn trust. The $75/day to $1.60/day pivot is the cleanest post-to-product bridge in the whole system.',
      },
      {
        rank: '03',
        title: 'Turn Roger Clips Into Short Video Hooks',
        urgency: 'today',
        detail: 'The voiceovers are already made. Pair them with brutal one-stat covers and push them to TikTok, Reels, and X for reach beyond text posts.',
      },
      {
        rank: '04',
        title: 'Sell AI Ops Teardowns',
        urgency: 'this week',
        detail: 'Offer a paid teardown of someone’s agent stack, queue, routing, and review loop. It is fast to deliver, numbers-backed, and directly connected to what Forge is learning live.',
      },
      {
        rank: '05',
        title: 'Open The Advisor Waitlist',
        urgency: 'this week',
        detail: 'Capture demand before the full product is built. The waitlist itself is a signal engine, a CTA, and a way to learn which problems people will pay to solve.',
      }
    ];

    const app = {
      state: null,
      analytics: null,
      animations: new Map(),
    };

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

    function clampPercent(value) {
      return Math.max(0, Math.min(100, Number(value) || 0));
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

    function formatRelative(iso) {
      if (!iso) {
        return 'awaiting sync';
      }

      const target = new Date(iso);
      if (Number.isNaN(target.getTime())) {
        return 'awaiting sync';
      }

      const diffMs = Date.now() - target.getTime();
      const diffMinutes = Math.round(diffMs / 60000);
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

    function renderHeartbeatBars() {
      const strip = document.getElementById('heartbeat-strip');
      const field = document.getElementById('heartbeat-field');
      if (strip && !strip.children.length) {
        let markup = '';
        for (let index = 0; index < 20; index += 1) {
          markup += '<span style="--i:' + index + ';"></span>';
        }
        strip.innerHTML = markup;
      }
      if (field && !field.children.length) {
        let markup = '';
        for (let index = 0; index < 28; index += 1) {
          markup += '<span style="--i:' + index + '; height:' + (16 + (index % 7) * 9) + 'px;"></span>';
        }
        field.innerHTML = markup;
      }
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

    function classifySystem(state) {
      const queueTasks = Array.isArray(state.queue && state.queue.tasks) ? state.queue.tasks : [];
      const blocked = queueTasks.filter(function(task) {
        return String(task.status || '').toUpperCase() === 'BLOCKED';
      }).length;
      const sessions = Array.isArray(state.sessions) ? state.sessions : [];
      if (sessions.length) {
        return 'active';
      }
      if (blocked > 0) {
        return 'blocked';
      }
      return state.system && state.system.status === 'online' ? 'online' : 'offline';
    }

    function deriveBroadcastPosts(state) {
      const xPosts = state.xPosts || {};
      const forge = xPosts.forge || {};
      const lucas = xPosts.lucas || {};
      const posts = [];
      (Array.isArray(forge.recentPosts) ? forge.recentPosts : []).slice(0, 3).forEach(function(post) {
        posts.push({
          handle: forge.handle || '@Forge_Builds',
          text: post.text || '',
          time: post.time || post.created_at || 'Recent',
          chars: post.chars || (post.text || '').length,
          source: post.source || 'state',
        });
      });
      (Array.isArray(lucas.recentPosts) ? lucas.recentPosts : []).slice(0, 2).forEach(function(post) {
        posts.push({
          handle: lucas.handle || '@LucasJOliver_78',
          text: post.text || '',
          time: post.time || post.created_at || 'Recent',
          chars: post.chars || (post.text || '').length,
          source: post.source || 'state',
        });
      });
      return posts.slice(0, 5);
    }

    function deriveSummary(state) {
      const queueTasks = Array.isArray(state.queue && state.queue.tasks) ? state.queue.tasks : [];
      const reviewStats = state.reviews && state.reviews.stats ? state.reviews.stats : {};
      const reviewItems = Array.isArray(state.reviews && state.reviews.items) ? state.reviews.items : [];
      const revenue = state.revenue || {};
      const system = state.system || {};
      const xPosts = state.xPosts || {};
      const blockedTasks = queueTasks.filter(function(task) { return String(task.status || '').toUpperCase() === 'BLOCKED'; });
      const readyTasks = queueTasks.filter(function(task) {
        const status = String(task.status || '').toUpperCase();
        return status === 'READY' || status === 'DECOMPOSED';
      });
      const doneTasks = queueTasks.filter(function(task) { return String(task.status || '').toUpperCase() === 'DONE'; });
      const pendingReviewItems = reviewItems.filter(function(item) {
        return !item.current_decision || item.current_decision === 'needs_revision';
      });
      const reviewedCount = safeNumber(reviewStats.approved) + safeNumber(reviewStats.rejected) + safeNumber(reviewStats.needs_revision);
      const reviewPressure = safeNumber(reviewStats.pending) + safeNumber(reviewStats.needs_revision);
      const totalReviewUniverse = safeNumber(reviewStats.unique_items) || reviewItems.length || reviewPressure || 1;
      const xCount = safeNumber(xPosts.forge && xPosts.forge.postsToday) + safeNumber(xPosts.lucas && xPosts.lucas.postsToday);

      return {
        queueTasks: queueTasks,
        blockedTasks: blockedTasks,
        readyTasks: readyTasks,
        doneTasks: doneTasks,
        pendingReviewItems: pendingReviewItems,
        reviewedCount: reviewedCount,
        reviewPressure: reviewPressure,
        totalReviewUniverse: totalReviewUniverse,
        revenueTotal: safeNumber(revenue.total),
        revenueTarget: Math.max(1, safeNumber(revenue.target) || 100),
        balance: safeNumber(system.deepseekBalance),
        sessionsToday: safeNumber(system.sessionsToday),
        xCount: xCount,
        status: system.status || 'unknown',
        nextSession: system.nextSession || { name: 'No session scheduled', in: '--' },
        model: system.model || 'unknown',
        uptime: system.uptime || 'No data',
        products: safeNumber(revenue.gumroadProducts),
        subscribers: safeNumber(revenue.emailSubscribers),
        apis: state.apis || {},
        broadcastPosts: deriveBroadcastPosts(state),
        schedule: Array.isArray(state.schedule) ? state.schedule : [],
      };
    }

    function renderHero(summary) {
      const posture = classifySystem(app.state);
      const heroCopy = document.getElementById('hero-copy');
      const heartbeatTitle = document.getElementById('heartbeat-title');
      const heartbeatCopy = document.getElementById('heartbeat-copy');
      const statusDot = document.getElementById('status-dot');
      const statusPillText = document.getElementById('status-pill-text');
      const modelPillText = document.getElementById('model-pill-text');
      const sessionsPillText = document.getElementById('sessions-pill-text');
      const heartbeatStrip = document.getElementById('heartbeat-strip');

      heroCopy.textContent = posture === 'active'
        ? 'Forge is actively executing work right now. The panels below show the queue pressure, the review bottlenecks, the output already shipped, and the next decisions Lucas can make to speed the whole machine up.'
        : posture === 'blocked'
          ? 'Forge is online, but the bottleneck is human. Blocked work is pulsing below because the system has already done its part and is waiting on a decision.'
          : 'Forge is online and watching the runway. Even while idle, the dashboard shows what is blocked, what is ready for review, what already shipped, and what comes next.';

      heartbeatTitle.textContent = posture === 'active' ? 'Forge is working' : posture === 'blocked' ? 'Human bottleneck detected' : 'Standby but live';
      heartbeatCopy.textContent = posture === 'active'
        ? 'The live heartbeat intensifies when a worker session is running. This is the cockpit view for what the machine is doing.'
        : posture === 'blocked'
          ? 'The machine is waiting on approvals, API fixes, or decisions. That pressure is surfaced instead of hidden.'
          : 'No active session is reported, but the command surface still tracks schedule, queue state, output, and stack health.';

      statusDot.className = 'status-dot';
      if (posture === 'blocked') {
        statusDot.classList.add('warning');
      } else if (summary.status !== 'online') {
        statusDot.classList.add('danger');
      }

      statusPillText.textContent = posture === 'active'
        ? 'Live execution'
        : posture === 'blocked'
          ? 'Waiting on Lucas'
          : summary.status === 'online' ? 'Online standby' : 'Offline';
      modelPillText.textContent = 'Model lane ' + summary.model;
      sessionsPillText.textContent = 'Sessions today ' + formatInteger(summary.sessionsToday);

      heartbeatStrip.classList.remove('active');
      heartbeatStrip.classList.remove('blocked');
      if (posture === 'active') {
        heartbeatStrip.classList.add('active');
      } else if (posture === 'blocked') {
        heartbeatStrip.classList.add('blocked');
      }

      document.getElementById('telemetry-posture').textContent = statusPillText.textContent;
      document.getElementById('telemetry-next-session').textContent = (summary.nextSession.name || 'No session scheduled') + ' -- ' + (summary.nextSession.in || '--');
      document.getElementById('telemetry-review-pressure').textContent = formatInteger(summary.reviewPressure) + ' items';
      document.getElementById('telemetry-distribution').textContent = formatInteger(summary.xCount) + ' posts today';
    }

    function renderMetrics(summary) {
      animateNumber('metric-revenue', summary.revenueTotal, function(value) {
        return formatCurrency(value, 0);
      }, 850);
      animateNumber('metric-balance', summary.balance, function(value) {
        return formatCurrency(value, 2);
      }, 850);
      animateNumber('metric-review', summary.reviewPressure, function(value) {
        return formatInteger(value);
      }, 720);
      animateNumber('metric-blocked', summary.blockedTasks.length, function(value) {
        return formatInteger(value);
      }, 720);

      document.getElementById('metric-revenue-copy').textContent =
        formatCurrency(summary.revenueTotal, 0) + ' of ' + formatCurrency(summary.revenueTarget, 0) + ' target -- ' +
        formatInteger(summary.products) + ' products tracked and ' + formatInteger(summary.subscribers) + ' subscribers visible.';
      document.getElementById('metric-balance-copy').textContent =
        summary.balance >= 30
          ? 'Healthy fuel reserve for autonomous work.'
          : summary.balance >= 10
            ? 'Fuel is still workable, but deserves attention.'
            : 'Low balance. The system can work, but the margin is getting thin.';
      document.getElementById('metric-review-copy').textContent =
        formatInteger(summary.reviewedCount) + ' of ' + formatInteger(summary.totalReviewUniverse) + ' items have a visible decision signal.';
      document.getElementById('metric-blocked-copy').textContent =
        summary.blockedTasks.length
          ? summary.blockedTasks.length + ' tasks are currently blocked by approvals, broken APIs, or missing human input.'
          : 'No blocked work is visible right now.';

      document.getElementById('metric-revenue-bar').style.width = clampPercent((summary.revenueTotal / summary.revenueTarget) * 100) + '%';
      document.getElementById('metric-balance-bar').style.width = clampPercent((summary.balance / 50) * 100) + '%';
      document.getElementById('metric-review-bar').style.width = clampPercent((summary.reviewPressure / Math.max(summary.totalReviewUniverse, 1)) * 100) + '%';
      document.getElementById('metric-blocked-bar').style.width = clampPercent((summary.blockedTasks.length / Math.max(summary.queueTasks.length || 1, 1)) * 100) + '%';
    }

    function renderBlocked(summary) {
      const root = document.getElementById('blocked-list');
      const blocked = summary.blockedTasks.slice(0, 4);
      document.getElementById('action-count').textContent = blocked.length + ' blocked -- ' + summary.reviewPressure + ' review pressure';
      if (!blocked.length) {
        root.innerHTML = '<div class="empty">No blocked tasks are visible in the current state. That means the machine is either in standby or everything is currently moving without a human stop sign.</div>';
        return;
      }

      root.innerHTML = blocked.map(function(task) {
        return '<article class="task-card blocked">' +
          '<div class="task-top">' +
            '<span class="pill blocked"><i class="fa-solid fa-triangle-exclamation"></i> blocked</span>' +
            '<span class="pill">P' + escapeHtml(task.priority || '--') + '</span>' +
          '</div>' +
          '<div class="task-title">' + escapeHtml(task.title || task.id || 'Blocked task') + '</div>' +
          '<div class="task-copy">' + escapeHtml(task.notes || 'No block reason recorded.') + '</div>' +
          '<div class="task-actions">' +
            '<a class="mini-link" href="/review"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Review</a>' +
          '</div>' +
        '</article>';
      }).join('');
    }

    function renderReviewList(summary) {
      const root = document.getElementById('review-list');
      const items = summary.pendingReviewItems.slice(0, 4);
      document.getElementById('review-count').textContent = summary.reviewPressure + ' in queue';
      if (!items.length) {
        root.innerHTML = '<div class="empty">The current state does not report any pending review artifacts. Once new products, visuals, or pages land in the queue, this area becomes Lucas\\'s jump point.</div>';
        return;
      }

      root.innerHTML = items.map(function(item) {
        const decisionClass = item.current_decision === 'approve'
          ? 'approve'
          : item.current_decision === 'reject'
            ? 'reject'
            : item.current_decision === 'needs_revision'
              ? 'revision'
              : '';
        const decisionLabel = item.current_decision ? item.current_decision.replace(/_/g, ' ') : 'pending';
        return '<article class="task-card review">' +
          '<div class="task-top">' +
            '<span class="pill ' + decisionClass + '">' + escapeHtml(decisionLabel) + '</span>' +
            '<span class="pill">' + escapeHtml(item.type || 'file') + '</span>' +
          '</div>' +
          '<div class="task-title">' + escapeHtml(item.name || item.path || 'Review item') + '</div>' +
          '<div class="task-copy">' + escapeHtml(item.path || 'No path recorded') + '</div>' +
          '<div class="task-actions">' +
            '<a class="mini-link" href="/review"><i class="fa-solid fa-eye"></i> Review this surface</a>' +
          '</div>' +
        '</article>';
      }).join('');
    }

    function renderExecution(summary) {
      const posture = classifySystem(app.state);
      const card = document.getElementById('execution-card');
      const executionTitle = document.getElementById('execution-title');
      const executionCopy = document.getElementById('execution-copy');
      const executionKicker = document.getElementById('execution-kicker');

      card.classList.remove('active');
      if (posture === 'active') {
        card.classList.add('active');
      }

      executionTitle.textContent = posture === 'active'
        ? 'Worker session active'
        : posture === 'blocked'
          ? 'Queue is waiting on a human'
          : summary.status === 'online'
            ? 'Idle, synced, and ready'
            : 'System offline';

      executionCopy.textContent = posture === 'active'
        ? 'At least one live session is currently reported. The pulse rail is showing active movement instead of a static dashboard snapshot.'
        : posture === 'blocked'
          ? 'The machine is not confused. It knows what to do next, but it needs approvals, a token fix, or a human decision before it can continue.'
          : summary.status === 'online'
            ? 'No active session is reported. The next useful move is to clear review pressure or resolve the blocked items so the next run has a clean runway.'
            : 'The worker is not reporting as online. Use the other panels to spot whether this is just stale data or a deeper outage.';

      executionKicker.textContent = posture === 'active'
        ? 'Live session signal'
        : posture === 'blocked'
          ? 'Human dependency detected'
          : 'Standby status';

      document.getElementById('execution-model').textContent = summary.model;
      document.getElementById('execution-uptime').textContent = summary.uptime;
      document.getElementById('execution-queue-posture').textContent =
        summary.blockedTasks.length + ' blocked / ' + summary.readyTasks.length + ' ready / ' + summary.doneTasks.length + ' done';
    }

    function renderTimeline(summary) {
      const root = document.getElementById('timeline');
      const candidates = summary.queueTasks.slice(0, 6);
      document.getElementById('timeline-kicker').textContent = candidates.length + ' recent queue events';
      if (!candidates.length) {
        root.innerHTML = '<div class="empty">No queue history is available yet.</div>';
        return;
      }

      root.innerHTML = candidates.map(function(task) {
        const status = String(task.status || '').toUpperCase();
        const statusClass = status === 'BLOCKED' ? 'blocked' : status === 'DONE' ? 'done' : '';
        return '<article class="timeline-item ' + statusClass + '">' +
          '<div class="timeline-kicker">' + escapeHtml(status || 'unknown') + ' -- priority ' + escapeHtml(task.priority || '--') + '</div>' +
          '<div class="timeline-title">' + escapeHtml(task.title || task.id || 'Queue event') + '</div>' +
          '<div class="timeline-copy">' + escapeHtml(task.notes || 'No notes captured.') + '</div>' +
        '</article>';
      }).join('');
    }

    function renderVelocity(summary) {
      const analytics = app.analytics;
      const reviewedToday = safeNumber(analytics && analytics.throughput && analytics.throughput.reviewed_today);
      const submittedToday = safeNumber(analytics && analytics.throughput && analytics.throughput.submitted_today);
      const backlog = safeNumber((analytics && analytics.throughput && analytics.throughput.backlog) || summary.reviewPressure);
      const firstPass = safeNumber(analytics && analytics.revision_depth && analytics.revision_depth.first_pass_approval_pct);

      animateNumber('velocity-reviewed', reviewedToday || summary.reviewedCount, function(value) {
        return formatInteger(value);
      }, 620);
      animateNumber('velocity-backlog', backlog, function(value) {
        return formatInteger(value);
      }, 620);

      document.getElementById('velocity-reviewed-copy').textContent =
        analytics
          ? formatInteger(reviewedToday) + ' decisions logged today and ' + formatInteger(submittedToday) + ' items submitted.'
          : 'Using visible queue state because review analytics are not currently available.';
      document.getElementById('velocity-backlog-copy').textContent =
        firstPass
          ? 'First-pass approval is sitting at ' + firstPass + ' percent.'
          : 'Backlog is currently the clearest review-health signal.';

      const sparklineValues = analytics
        ? [
            reviewedToday,
            submittedToday,
            safeNumber(analytics.decision_distribution && analytics.decision_distribution.approve),
            safeNumber(analytics.decision_distribution && analytics.decision_distribution.needs_revision),
            safeNumber(analytics.decision_distribution && analytics.decision_distribution.reject),
            summary.reviewPressure,
            summary.blockedTasks.length,
            summary.xCount
          ]
        : [
            summary.reviewedCount,
            summary.reviewPressure,
            safeNumber(summary.doneTasks.length),
            safeNumber(summary.blockedTasks.length),
            safeNumber(summary.readyTasks.length),
            safeNumber(summary.xCount),
            safeNumber(summary.products),
            safeNumber(summary.sessionsToday)
          ];
      const maxValue = Math.max.apply(null, sparklineValues.concat([1]));
      const sparkline = document.getElementById('velocity-sparkline');
      sparkline.innerHTML = sparklineValues.map(function(value, index) {
        const height = Math.max(12, Math.round((safeNumber(value) / maxValue) * 84));
        const className = index === 3 || index === 6 ? 'warning' : index === 4 ? 'danger' : '';
        return '<span class="' + className + '" style="height:' + height + 'px;"></span>';
      }).join('');

      document.getElementById('velocity-summary').textContent = analytics
        ? 'Analytics are live: ' + formatInteger(backlog) + ' items remain in backlog, ' + reviewedToday + ' decisions were recorded today, and first-pass approval is ' + firstPass + ' percent.'
        : 'Analytics endpoint is not returning data yet, so this panel falls back to visible state signals: review pressure, blocked work, output, and completed tasks.';
      document.getElementById('velocity-kicker').textContent = analytics ? 'Live analytics summary' : 'State-derived fallback';
    }

    function renderPosts(summary) {
      const root = document.getElementById('post-list');
      const posts = summary.broadcastPosts;
      document.getElementById('distribution-kicker').textContent = summary.xCount + ' posts detected today';
      if (!posts.length) {
        root.innerHTML = '<div class="empty">No recent posts are visible in state. Once the posting manager syncs output, this becomes the broadcast rail instead of a dead page.</div>';
        return;
      }

      root.innerHTML = posts.map(function(post) {
        return '<article class="post-card">' +
          '<div class="post-head">' +
            '<div class="post-handle">' + escapeHtml(post.handle) + '</div>' +
            '<div class="post-time">' + escapeHtml(post.time) + '</div>' +
          '</div>' +
          '<div class="post-body">' + escapeHtml(post.text) + '</div>' +
          '<div class="post-meta">' +
            '<span><i class="fa-solid fa-text-width"></i> ' + escapeHtml(String(post.chars || 0)) + ' chars</span>' +
            '<span><i class="fa-solid fa-wave-square"></i> ' + escapeHtml(post.source || 'state') + '</span>' +
          '</div>' +
        '</article>';
      }).join('');
    }

    function renderMoneyMoves(summary) {
      const root = document.getElementById('money-list');
      document.getElementById('money-kicker').textContent =
        summary.revenueTotal > 0
          ? 'Revenue is live -- keep compounding'
          : '0 revenue visible -- first dollars are the mission';

      root.innerHTML = MONEY_MOVES.map(function(move) {
        return '<article class="task-card money">' +
          '<div class="task-top">' +
            '<span class="pill revision"><i class="fa-solid fa-bolt"></i> ' + escapeHtml(move.urgency) + '</span>' +
            '<span class="pill">move ' + escapeHtml(move.rank) + '</span>' +
          '</div>' +
          '<div class="task-title">' + escapeHtml(move.title) + '</div>' +
          '<div class="task-copy">' + escapeHtml(move.detail) + '</div>' +
        '</article>';
      }).join('');
    }

    function renderFabric(summary) {
      document.getElementById('fabric-queue').textContent = summary.readyTasks.length + ' / ' + summary.blockedTasks.length + ' / ' + summary.doneTasks.length;
      document.getElementById('fabric-queue-copy').textContent = 'Ready, blocked, done across the visible autonomous queue.';
      document.getElementById('fabric-commerce').textContent = formatInteger(summary.products) + ' / ' + formatInteger(summary.subscribers);
      document.getElementById('fabric-commerce-copy').textContent = 'Products tracked vs email subscribers visible in state.';

      const apiGrid = document.getElementById('api-grid');
      const entries = Object.entries(summary.apis || {});
      if (!entries.length) {
        apiGrid.innerHTML = '<div class="empty">No API health data reported.</div>';
        return;
      }

      apiGrid.innerHTML = entries.map(function(entry) {
        const name = entry[0];
        const status = String(entry[1] || 'unknown').toLowerCase();
        const level = status === 'online' ? 'online' : status === 'offline' ? 'offline' : 'degraded';
        return '<span class="api-pill ' + level + '"><i class="fa-solid fa-circle"></i> ' + escapeHtml(name) + ' ' + escapeHtml(status) + '</span>';
      }).join('');
    }

    function renderSchedule(summary) {
      const root = document.getElementById('schedule-grid');
      const schedule = summary.schedule.slice(0, 8);
      document.getElementById('schedule-kicker').textContent = schedule.length + ' visible schedule entries';
      if (!schedule.length) {
        root.innerHTML = '<div class="empty">No schedule entries found.</div>';
        return;
      }

      root.innerHTML = schedule.map(function(slot) {
        const hour = String(slot.hour == null ? '--' : slot.hour).padStart(2, '0') + ':00';
        return '<article class="slot">' +
          '<div class="slot-hour">' + escapeHtml(hour) + '</div>' +
          '<div class="slot-name">' + escapeHtml(slot.name || 'Unnamed slot') + '</div>' +
          '<div class="slot-meta">' + escapeHtml(slot.type || 'worker') + '</div>' +
          '<div class="task-copy" style="margin-top:8px;">' + escapeHtml(slot.status || 'upcoming') + (slot.nextRun ? ' -- ' + escapeHtml(slot.nextRun) : '') + '</div>' +
        '</article>';
      }).join('');
    }

    function renderCompleted(summary) {
      const root = document.getElementById('completed-list');
      const tasks = summary.doneTasks.slice(0, 4);
      document.getElementById('completed-kicker').textContent = summary.doneTasks.length + ' tasks marked done';
      if (!tasks.length) {
        root.innerHTML = '<div class="empty">No completed work is visible in the current payload yet.</div>';
        return;
      }

      root.innerHTML = tasks.map(function(task) {
        return '<article class="task-card done">' +
          '<div class="task-top">' +
            '<span class="pill approve"><i class="fa-solid fa-check"></i> done</span>' +
            '<span class="pill">P' + escapeHtml(task.priority || '--') + '</span>' +
          '</div>' +
          '<div class="task-title">' + escapeHtml(task.title || task.id || 'Completed task') + '</div>' +
          '<div class="task-copy">' + escapeHtml(task.notes || 'No completion notes captured.') + '</div>' +
        '</article>';
      }).join('');
    }

    function renderStoryRail() {
      const root = document.getElementById('story-rail');
      root.innerHTML = STORY_BEATS.slice(0, 3).map(function(beat) {
        return '<div class="task-card">' +
          '<div class="timeline-kicker">' + escapeHtml(beat.date) + '</div>' +
          '<div class="task-title">' + escapeHtml(beat.title) + '</div>' +
          '<div class="task-copy">' + escapeHtml(beat.copy) + '</div>' +
        '</div>';
      }).join('');
    }

    function renderSyncMeta(state) {
      const lastUpdated = state.lastUpdated || null;
      const syncChip = document.getElementById('sync-chip');
      syncChip.innerHTML = '<strong>Synced ' + escapeHtml(formatRelative(lastUpdated)) + '</strong>';
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

    async function fetchAnalyticsSummary() {
      try {
        const response = await liveFetch('/api/analytics/summary');
        if (!response.ok) {
          return null;
        }
        const payload = await response.json();
        return payload.analytics || null;
      } catch (error) {
        return null;
      }
    }

    async function fetchState() {
      const response = await liveFetch('/api/state');
      if (!response.ok) {
        throw new Error('Unable to load command state');
      }
      return response.json();
    }

    async function refresh() {
      const results = await Promise.all([fetchState(), fetchAnalyticsSummary()]);
      app.state = results[0];
      app.analytics = results[1];
      const summary = deriveSummary(app.state);
      renderSyncMeta(app.state);
      renderHero(summary);
      renderMetrics(summary);
      renderBlocked(summary);
      renderReviewList(summary);
      renderExecution(summary);
      renderTimeline(summary);
      renderVelocity(summary);
      renderPosts(summary);
      renderMoneyMoves(summary);
      renderFabric(summary);
      renderSchedule(summary);
      renderCompleted(summary);
      renderStoryRail();
    }

    async function boot() {
      renderHeartbeatBars();
      setClock();
      setInterval(setClock, 1000);
      try {
        await refresh();
      } catch (error) {
        document.getElementById('hero-copy').textContent = error.message;
      }
      setInterval(function() {
        refresh().catch(function() {});
      }, LIVE_REFRESH_INTERVAL_MS);
      wireLiveRefresh(refresh);
    }

    boot();
  </script>
</body>
</html>`;

export default missionControlHtml;
