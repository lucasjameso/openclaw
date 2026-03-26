import { renderSharedShellStyles, renderTopbar } from './shared/shell.js';
import { renderStandardTokenDeclarations } from './shared/tokens.js';

const xPostsHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Forge Broadcast Console</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="preconnect" href="https://cdnjs.cloudflare.com">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --bg-void: #081018;
      --bg-surface: rgba(10, 22, 33, 0.88);
      --bg-raised: rgba(18, 34, 49, 0.98);
      --bg-panel: rgba(14, 29, 42, 0.9);
      --bg-soft: rgba(100, 166, 255, 0.1);
      --bg-soft-warm: rgba(255, 159, 67, 0.12);
      --text-primary: #f3f7fb;
      --text-secondary: #a3b4c8;
      --text-tertiary: #6e8299;
      --border: rgba(164, 188, 214, 0.14);
      --border-strong: rgba(164, 188, 214, 0.24);
      --accent: #69a7ff;
      --accent-strong: #8ec5ff;
      --forge: #6dc8ff;
      --lucas: #ffb86b;
      --success: #32d4a4;
      --warning: #ffb144;
      --danger: #ff6b7a;
      --shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
      --radius-xl: 28px;
      --radius-lg: 22px;
      --radius-md: 16px;
      --radius-sm: 12px;
${renderStandardTokenDeclarations({
  '--shell-max-width': '1560px',
  '--shell-padding': '28px',
  '--shell-text-primary': 'var(--text-primary)',
  '--shell-text-secondary': 'var(--text-secondary)',
  '--shell-text-tertiary': 'var(--text-tertiary)',
  '--shell-border': 'var(--border)',
  '--shell-border-strong': 'var(--border-strong)',
  '--shell-accent': 'var(--accent)',
  '--shell-accent-strong': 'var(--accent-strong)',
  '--shell-topbar-margin': '18px',
  '--shell-nav-active-start': 'rgba(105, 167, 255, 0.22)',
  '--shell-nav-active-end': 'rgba(105, 167, 255, 0.08)',
  '--shell-nav-active-border': 'rgba(142, 197, 255, 0.26)',
})}
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      min-height: 100%;
      background:
        radial-gradient(circle at top left, rgba(105, 167, 255, 0.18), transparent 34%),
        radial-gradient(circle at 85% 18%, rgba(255, 184, 107, 0.16), transparent 28%),
        linear-gradient(180deg, #081018 0%, #09131d 35%, #071018 100%);
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
        linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px);
      background-size: 72px 72px;
      mask-image: linear-gradient(180deg, rgba(0,0,0,0.8), transparent 85%);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

${renderSharedShellStyles()}

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.03);
      color: var(--text-secondary);
      font-size: 12px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .chip strong {
      color: var(--text-primary);
      font-weight: 700;
      letter-spacing: normal;
      text-transform: none;
    }

    .clock {
      font-family: "IBM Plex Mono", ui-monospace, monospace;
      font-size: 13px;
      color: var(--text-primary);
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.03);
      white-space: nowrap;
    }

    .panel {
      position: relative;
      overflow: hidden;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.3fr) minmax(360px, 0.9fr);
      gap: 20px;
      padding: 28px;
      margin-bottom: 22px;
      background:
        linear-gradient(135deg, rgba(105, 167, 255, 0.12), transparent 48%),
        linear-gradient(135deg, rgba(255, 184, 107, 0.08), transparent 62%),
        var(--bg-surface);
    }

    .hero::after {
      content: "";
      position: absolute;
      inset: auto -10% -38% 35%;
      height: 60%;
      background: radial-gradient(circle, rgba(105, 167, 255, 0.18), transparent 68%);
      pointer-events: none;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      color: var(--accent-strong);
      font-size: 12px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .hero h1 {
      margin: 0 0 14px;
      font-size: clamp(2.5rem, 5vw, 4.6rem);
      line-height: 0.94;
      letter-spacing: -0.06em;
      max-width: 9.5ch;
    }

    .hero p {
      margin: 0 0 20px;
      max-width: 56ch;
      color: var(--text-secondary);
      font-size: 1rem;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .hero-chip {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.05);
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 500;
    }

    .hero-chip span {
      color: var(--text-secondary);
      font-weight: 400;
    }

    .hero-metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      align-content: start;
      position: relative;
      z-index: 1;
    }

    .metric-card {
      padding: 18px;
      border-radius: var(--radius-lg);
      background: var(--bg-panel);
      border: 1px solid rgba(255,255,255,0.06);
      min-height: 146px;
      display: grid;
      gap: 12px;
    }

    .metric-card.tall {
      grid-column: span 2;
      min-height: 168px;
    }

    .metric-label {
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 11px;
    }

    .metric-value {
      font-family: "IBM Plex Mono", ui-monospace, monospace;
      font-size: clamp(2rem, 4vw, 3.2rem);
      line-height: 0.95;
      letter-spacing: -0.05em;
    }

    .metric-value.small {
      font-size: 1.5rem;
      line-height: 1.1;
    }

    .metric-note {
      color: var(--text-secondary);
      font-size: 13px;
      line-height: 1.5;
    }

    .metric-note strong {
      color: var(--text-primary);
      font-weight: 700;
    }

    .tempo-pill {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      width: fit-content;
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border: 1px solid transparent;
    }

    .tempo-pill.hot {
      background: rgba(50, 212, 164, 0.12);
      color: var(--success);
      border-color: rgba(50, 212, 164, 0.18);
    }

    .tempo-pill.warm {
      background: rgba(255, 177, 68, 0.12);
      color: var(--warning);
      border-color: rgba(255, 177, 68, 0.2);
    }

    .tempo-pill.cold {
      background: rgba(105, 167, 255, 0.12);
      color: var(--accent-strong);
      border-color: rgba(105, 167, 255, 0.18);
    }

    .content-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 340px;
      gap: 18px;
      align-items: start;
    }

    .stream-panel {
      padding: 20px;
      min-height: 640px;
    }

    .stream-panel.forge {
      background:
        linear-gradient(180deg, rgba(109, 200, 255, 0.08), transparent 26%),
        var(--bg-surface);
    }

    .stream-panel.lucas {
      background:
        linear-gradient(180deg, rgba(255, 184, 107, 0.09), transparent 26%),
        var(--bg-surface);
    }

    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 18px;
    }

    .section-head h2,
    .rail-card h3 {
      margin: 0;
      font-size: 1.15rem;
      letter-spacing: -0.03em;
    }

    .section-subtitle {
      margin-top: 6px;
      color: var(--text-secondary);
      font-size: 13px;
      line-height: 1.5;
    }

    .handle-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 999px;
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border: 1px solid var(--border);
      color: var(--text-secondary);
      background: rgba(255,255,255,0.03);
      white-space: nowrap;
    }

    .stream-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 18px;
    }

    .stream-stat {
      padding: 14px;
      border-radius: var(--radius-md);
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
    }

    .stream-stat-label {
      color: var(--text-tertiary);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .stream-stat-value {
      font-family: "IBM Plex Mono", ui-monospace, monospace;
      font-size: 1.35rem;
      letter-spacing: -0.04em;
    }

    .post-list {
      display: grid;
      gap: 12px;
    }

    .post-card {
      position: relative;
      padding: 18px;
      border-radius: var(--radius-md);
      border: 1px solid rgba(255,255,255,0.07);
      background:
        linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)),
        rgba(255,255,255,0.03);
      overflow: hidden;
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
    }

    .post-card:hover {
      transform: translateY(-2px);
      border-color: var(--border-strong);
      background: rgba(255,255,255,0.05);
    }

    .post-card::before {
      content: "";
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, rgba(109, 200, 255, 0.9), rgba(255,255,255,0));
      opacity: 0.85;
    }

    .post-card.lucas::before {
      background: linear-gradient(90deg, rgba(255, 184, 107, 0.95), rgba(255,255,255,0));
    }

    .post-card.live {
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    .post-ribbon {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      margin-bottom: 14px;
      background: rgba(109, 200, 255, 0.1);
      border: 1px solid rgba(109, 200, 255, 0.16);
      color: var(--accent-strong);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .post-card.lucas .post-ribbon {
      background: rgba(255, 184, 107, 0.12);
      border-color: rgba(255, 184, 107, 0.22);
      color: #ffd3a7;
    }

    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 14px;
    }

    .post-author {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .post-avatar {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.06em;
      flex-shrink: 0;
      background:
        radial-gradient(circle at 30% 30%, rgba(255, 167, 92, 0.38), transparent 36%),
        linear-gradient(145deg, rgba(17, 30, 45, 0.98), rgba(8, 14, 20, 0.98));
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
    }

    .post-card.lucas .post-avatar {
      background:
        radial-gradient(circle at 30% 30%, rgba(255, 184, 107, 0.44), transparent 38%),
        linear-gradient(145deg, rgba(45, 30, 17, 0.98), rgba(19, 12, 7, 0.98));
    }

    .post-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 700;
      line-height: 1.2;
    }

    .post-name i {
      color: var(--accent-strong);
      font-size: 13px;
    }

    .post-card.lucas .post-name i {
      color: #ffd3a7;
    }

    .post-handle {
      margin-top: 4px;
      color: var(--text-secondary);
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .post-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      color: var(--text-primary);
      font-size: 12px;
      white-space: nowrap;
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
    }

    .post-link:hover {
      transform: translateY(-1px);
      border-color: var(--border-strong);
      background: rgba(255,255,255,0.06);
    }

    .post-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .post-order {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--text-secondary);
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .post-order .dot {
      width: 9px;
      height: 9px;
      border-radius: 999px;
      background: currentColor;
      opacity: 0.9;
    }

    .post-time {
      color: var(--text-tertiary);
      font-size: 12px;
    }

    .post-text {
      margin: 0 0 16px;
      color: var(--text-primary);
      font-size: 18px;
      line-height: 1.68;
      word-break: break-word;
    }

    .post-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .post-meta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .meta-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      color: var(--text-secondary);
      font-size: 12px;
    }

    .post-reason {
      color: var(--text-secondary);
      font-size: 12px;
      line-height: 1.5;
    }

    .empty-state {
      padding: 24px;
      border-radius: var(--radius-lg);
      border: 1px dashed rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.02);
      color: var(--text-secondary);
      min-height: 220px;
      display: grid;
      place-items: center;
      text-align: center;
      line-height: 1.7;
    }

    .rail {
      display: grid;
      gap: 16px;
    }

    .rail-card {
      padding: 18px;
      border-radius: var(--radius-lg);
      background: var(--bg-surface);
      border: 1px solid var(--border);
      box-shadow: 0 18px 46px rgba(0, 0, 0, 0.2);
    }

    .rail-card p {
      margin: 8px 0 0;
      color: var(--text-secondary);
      font-size: 13px;
      line-height: 1.6;
    }

    .split-stack {
      display: grid;
      gap: 12px;
      margin-top: 16px;
    }

    .split-row {
      display: grid;
      gap: 8px;
    }

    .split-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      color: var(--text-secondary);
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .split-bar {
      width: 100%;
      height: 10px;
      border-radius: 999px;
      overflow: hidden;
      background: rgba(255,255,255,0.06);
    }

    .split-fill {
      height: 100%;
      border-radius: inherit;
      transition: width 220ms ease;
    }

    .split-fill.forge { background: linear-gradient(90deg, #4ea7ff, #6dd1ff); }
    .split-fill.lucas { background: linear-gradient(90deg, #ff9b54, #ffc27a); }

    .signal-list {
      display: grid;
      gap: 12px;
      margin-top: 14px;
    }

    .signal-item {
      padding: 14px;
      border-radius: var(--radius-md);
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
    }

    .signal-kicker {
      color: var(--text-tertiary);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .signal-value {
      color: var(--text-primary);
      font-size: 14px;
      line-height: 1.5;
    }

    .signal-value strong {
      font-family: "IBM Plex Mono", ui-monospace, monospace;
      font-size: 1rem;
    }

    .signal-value.status {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--text-tertiary);
      box-shadow: 0 0 0 6px rgba(255,255,255,0.03);
      flex-shrink: 0;
    }

    .status-dot.ready { background: var(--success); }
    .status-dot.pending { background: var(--warning); }
    .status-dot.blocked { background: var(--danger); }
    .status-dot.live { background: var(--accent-strong); }

    .pipeline-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-top: 18px;
    }

    .pipeline-card {
      padding: 18px;
      border-radius: var(--radius-lg);
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      min-height: 260px;
      display: grid;
      align-content: start;
      gap: 12px;
    }

    .pipeline-label {
      color: var(--text-tertiary);
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .pipeline-count {
      font-family: "IBM Plex Mono", ui-monospace, monospace;
      font-size: clamp(1.8rem, 3vw, 2.6rem);
      line-height: 1;
      letter-spacing: -0.05em;
    }

    .pipeline-copy {
      color: var(--text-secondary);
      font-size: 13px;
      line-height: 1.65;
    }

    .pipeline-list {
      display: grid;
      gap: 10px;
    }

    .pipeline-item {
      padding: 12px 14px;
      border-radius: 14px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
    }

    .pipeline-item-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 6px;
    }

    .pipeline-item-title {
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 600;
      line-height: 1.45;
    }

    .pipeline-item-meta {
      color: var(--text-secondary);
      font-size: 12px;
      line-height: 1.5;
    }

    .mini-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 9px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.08);
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .mini-badge.live {
      color: var(--accent-strong);
      background: rgba(109, 200, 255, 0.1);
    }

    .mini-badge.ready {
      color: var(--success);
      background: rgba(50, 212, 164, 0.12);
    }

    .mini-badge.pending {
      color: var(--warning);
      background: rgba(255, 177, 68, 0.12);
    }

    .mini-badge.blocked {
      color: #ffb7bf;
      background: rgba(255, 107, 122, 0.12);
    }

    .insight-strip {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-top: 18px;
    }

    .insight-card {
      padding: 18px;
      border-radius: var(--radius-lg);
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
    }

    .insight-card h3 {
      margin: 0 0 10px;
      font-size: 0.98rem;
      letter-spacing: -0.02em;
    }

    .insight-card p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 14px;
      line-height: 1.65;
    }

    .flash {
      animation: flashValue 900ms ease;
    }

    @keyframes beat {
      0%, 100% { transform: scaleY(0.32); opacity: 0.42; }
      20% { transform: scaleY(0.88); opacity: 0.9; }
      50% { transform: scaleY(0.48); opacity: 0.65; }
      74% { transform: scaleY(1); opacity: 1; }
    }

    @keyframes flashValue {
      0% { background: rgba(105, 167, 255, 0.26); }
      100% { background: transparent; }
    }

    @media (max-width: 1260px) {
      .hero {
        grid-template-columns: 1fr;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }

      .rail {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (max-width: 860px) {
      .app-shell {
        padding: 18px;
      }

      .topbar {
        grid-template-columns: 1fr;
        border-radius: 28px;
      }

      .hero,
      .stream-panel,
      .rail-card {
        border-radius: 22px;
      }

      .hero-metrics,
      .stream-stats,
      .pipeline-grid,
      .insight-strip,
      .rail {
        grid-template-columns: 1fr;
      }

      .metric-card.tall {
        grid-column: span 1;
      }

      .section-head,
      .post-header,
      .post-top,
      .post-footer,
      .post-meta,
      .pipeline-item-top,
      .split-top {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  </style>
</head>
<body>
  <div class="app-shell">
${renderTopbar({
  title: 'Forge Command',
  activePath: '/x-posts',
  syncClass: 'sync-chip chip',
  syncHtml: '<i class="fa-solid fa-wave-square"></i> <strong>Waiting for sync</strong>',
})}

    <section class="hero panel">
      <div>
        <div class="eyebrow"><i class="fa-solid fa-tower-broadcast"></i> Broadcast Console</div>
        <h1>The audience is tiny. The runway is not.</h1>
        <p>Forge is still in its founding-audience phase, which is exactly why this page matters. Every live post resets the baseline, every approved visual becomes launch inventory, and every queued lesson is another chance to make the curve visible.</p>
        <div class="hero-actions">
          <div class="hero-chip"><i class="fa-brands fa-x-twitter"></i> <span>Posted live</span> <strong id="hero-total">0</strong></div>
          <div class="hero-chip"><i class="fa-solid fa-rocket"></i> <span>Pipeline loaded</span> <strong id="hero-pipeline">0</strong></div>
          <div class="hero-chip"><i class="fa-solid fa-forward"></i> <span>Next Forge run</span> <strong id="hero-next">--</strong></div>
        </div>
      </div>

      <div class="hero-metrics">
        <article class="metric-card">
          <div class="metric-label">Audience Phase</div>
          <div class="metric-value small" id="audience-phase">Founding audience</div>
          <div class="metric-note" id="audience-copy">This is the first handful of attention, not a dead page. Every strong post changes what “starting from zero” means.</div>
        </article>
        <article class="metric-card">
          <div class="metric-label">Launch Inventory</div>
          <div class="metric-value" id="launch-loaded">0</div>
          <div class="metric-note" id="launch-copy">No launch inventory is visible yet.</div>
        </article>
        <article class="metric-card tall">
          <div class="metric-label">Momentum Window</div>
          <div class="tempo-pill cold" id="tempo-pill">Cold start</div>
          <div class="metric-value small" id="tempo-headline">No posts yet</div>
          <div class="metric-note" id="tempo-note">Once posts land, this view will call out where the momentum is coming from.</div>
        </article>
      </div>
    </section>

    <section class="content-grid">
      <article class="stream-panel panel forge">
        <div class="section-head">
          <div>
            <h2>Forge Broadcast Lane</h2>
            <div class="section-subtitle">Live public proof that the machine is shipping. Even in the founding-audience phase, this lane should feel intentional, confident, and worth watching.</div>
          </div>
          <div class="handle-chip" id="forge-handle"><i class="fa-solid fa-bolt"></i> @Forge_Builds</div>
        </div>

        <div class="stream-stats">
          <div class="stream-stat">
            <div class="stream-stat-label">Posts Today</div>
            <div class="stream-stat-value" id="forge-count">0</div>
          </div>
          <div class="stream-stat">
            <div class="stream-stat-label">Last Drop</div>
            <div class="stream-stat-value" id="forge-last">--</div>
          </div>
          <div class="stream-stat">
            <div class="stream-stat-label">Share</div>
            <div class="stream-stat-value" id="forge-share">0%</div>
          </div>
        </div>

        <div class="post-list" id="forge-posts"></div>
      </article>

      <article class="stream-panel panel lucas">
        <div class="section-head">
          <div>
            <h2>Lucas Signal Lane</h2>
            <div class="section-subtitle">Founder-weighted amplification. This lane should hit when trust, context, or a personal story gives the system more force than autonomous cadence alone.</div>
          </div>
          <div class="handle-chip" id="lucas-handle"><i class="fa-solid fa-user-wave"></i> @LucasJOliver_78</div>
        </div>

        <div class="stream-stats">
          <div class="stream-stat">
            <div class="stream-stat-label">Posts Today</div>
            <div class="stream-stat-value" id="lucas-count">0</div>
          </div>
          <div class="stream-stat">
            <div class="stream-stat-label">Last Drop</div>
            <div class="stream-stat-value" id="lucas-last">--</div>
          </div>
          <div class="stream-stat">
            <div class="stream-stat-label">Share</div>
            <div class="stream-stat-value" id="lucas-share">0%</div>
          </div>
        </div>

        <div class="post-list" id="lucas-posts"></div>
      </article>

      <aside class="rail">
        <section class="rail-card">
          <h3>Launch Board</h3>
          <p id="launch-board-copy">A small audience does not mean an empty runway. It means every publish decision is still visibly moving the baseline.</p>
          <div class="signal-list">
            <div class="signal-item">
              <div class="signal-kicker">Live today</div>
              <div class="signal-value status"><span class="status-dot live"></span><span><strong id="rail-live-count">0</strong> posts are already on the board.</span></div>
            </div>
            <div class="signal-item">
              <div class="signal-kicker">Visuals staged</div>
              <div class="signal-value status"><span class="status-dot pending"></span><span><strong id="rail-staged-count">0</strong> assets are sitting in the content pipeline.</span></div>
            </div>
            <div class="signal-item">
              <div class="signal-kicker">Broadcast jobs shipped</div>
              <div class="signal-value status"><span class="status-dot ready"></span><span><strong id="rail-jobs-count">0</strong> workflow jobs have already fed this console.</span></div>
            </div>
            <div class="signal-item">
              <div class="signal-kicker">Current friction</div>
              <div class="signal-value status"><span class="status-dot blocked"></span><span id="rail-blocker-copy">No blockers detected in the broadcast lane.</span></div>
            </div>
          </div>
        </section>

        <section class="rail-card">
          <h3>Momentum Thesis</h3>
          <p>The point of this surface is not vanity metrics. It is knowing whether the machine feels loaded, alive, and pointed at the next shot.</p>
          <div class="signal-list">
            <div class="signal-item">
              <div class="signal-kicker">Lead Account</div>
              <div class="signal-value" id="lead-account">No active lead yet.</div>
            </div>
            <div class="signal-item">
              <div class="signal-kicker">Latest Post</div>
              <div class="signal-value" id="latest-post">Nothing has posted today.</div>
            </div>
            <div class="signal-item">
              <div class="signal-kicker">Next Forge Run</div>
              <div class="signal-value" id="next-run">No scheduled window detected.</div>
            </div>
            <div class="signal-item">
              <div class="signal-kicker">X API Status</div>
              <div class="signal-value" id="x-status">Waiting for state data.</div>
            </div>
          </div>
        </section>

        <section class="rail-card">
          <h3>Broadcast Rules</h3>
          <p>Broadcast should feel like launch energy, not backlog exhaust. Use the queue to create anticipation, not just receipts.</p>
          <div class="signal-list">
            <div class="signal-item">
              <div class="signal-kicker">Cadence</div>
              <div class="signal-value">Spread output through the day instead of clustering every post into one burst.</div>
            </div>
            <div class="signal-item">
              <div class="signal-kicker">Coverage</div>
              <div class="signal-value">Use the founder lane when a post needs authority, context, or personal narrative.</div>
            </div>
            <div class="signal-item">
              <div class="signal-kicker">Freshness</div>
              <div class="signal-value">If the sync chip goes stale, fix the pipeline before making editorial decisions from old data.</div>
            </div>
          </div>
        </section>
      </aside>
    </section>

    <section class="panel" style="margin-top: 18px; padding: 20px;">
      <div class="section-head">
        <div>
          <h2>Content Pipeline</h2>
          <div class="section-subtitle">The machine is not waiting for audience size to improve before it acts. This board shows what is already live, what is staged, and what is blocking the next push.</div>
        </div>
      </div>

      <div class="pipeline-grid">
        <article class="pipeline-card">
          <div class="pipeline-label">Live Now</div>
          <div class="pipeline-count" id="pipeline-live-count">0</div>
          <div class="pipeline-copy" id="pipeline-live-copy">No live posts are visible yet.</div>
          <div class="pipeline-list" id="pipeline-live-list"></div>
        </article>
        <article class="pipeline-card">
          <div class="pipeline-label">Ready / Staged</div>
          <div class="pipeline-count" id="pipeline-ready-count">0</div>
          <div class="pipeline-copy" id="pipeline-ready-copy">No ready or staged broadcast assets yet.</div>
          <div class="pipeline-list" id="pipeline-ready-list"></div>
        </article>
        <article class="pipeline-card">
          <div class="pipeline-label">Waiting On Lucas</div>
          <div class="pipeline-count" id="pipeline-review-count">0</div>
          <div class="pipeline-copy" id="pipeline-review-copy">Nothing in the broadcast lane currently needs a human call.</div>
          <div class="pipeline-list" id="pipeline-review-list"></div>
        </article>
        <article class="pipeline-card">
          <div class="pipeline-label">Friction</div>
          <div class="pipeline-count" id="pipeline-friction-count">0</div>
          <div class="pipeline-copy" id="pipeline-friction-copy">No delivery friction visible.</div>
          <div class="pipeline-list" id="pipeline-friction-list"></div>
        </article>
      </div>
    </section>

    <section class="panel" style="margin-top: 18px; padding: 20px;">
      <div class="section-head">
        <div>
          <h2>Broadcast Readout</h2>
          <div class="section-subtitle">A fast interpretation layer so the page still says something useful even on a low-volume day.</div>
        </div>
      </div>

      <div class="insight-strip">
        <article class="insight-card">
          <h3>Coverage</h3>
          <p id="coverage-copy">No channels have posted yet, so distribution is still waiting on its first signal.</p>
        </article>
        <article class="insight-card">
          <h3>Pressure</h3>
          <p id="pressure-copy">Posting tempo is idle right now. The next sync will show whether today is waking up or staying quiet.</p>
        </article>
        <article class="insight-card">
          <h3>Action Bias</h3>
          <p id="action-copy">Use this page to decide whether Forge should keep pushing autonomously or whether Lucas should add founder-weighted amplification.</p>
        </article>
      </div>
    </section>
  </div>

  <script>
    const REFRESH_INTERVAL_MS = 60000;

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

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function getEtClock() {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/New_York',
        timeZoneName: 'short',
      }).format(new Date());
    }

    function setClock() {
      document.getElementById('clock').textContent = getEtClock();
    }

    function formatAbsolute(iso) {
      if (!iso) return '--';
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return '--';
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/New_York',
      }).format(date) + ' ET';
    }

    function formatRelative(iso) {
      if (!iso) return 'just now';
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return 'recently';

      const diffMs = date.getTime() - Date.now();
      const diffMinutes = Math.round(diffMs / 60000);
      const absMinutes = Math.abs(diffMinutes);
      const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

      if (absMinutes < 60) return rtf.format(diffMinutes, 'minute');
      const diffHours = Math.round(diffMinutes / 60);
      if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
      const diffDays = Math.round(diffHours / 24);
      return rtf.format(diffDays, 'day');
    }

    function flashValue(id, nextValue) {
      const node = document.getElementById(id);
      if (!node) return;
      const currentValue = node.textContent;
      if (currentValue === nextValue) return;
      node.textContent = nextValue;
      node.classList.remove('flash');
      void node.offsetWidth;
      node.classList.add('flash');
    }

    function clampPercent(value) {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) return 0;
      return Math.max(0, Math.min(100, numeric));
    }

    function safeNumber(value) {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : 0;
    }

    function normalizeStatus(value) {
      const status = String(value || '').trim().toLowerCase();
      if (status === 'approve') return 'approved';
      if (status === 'reject') return 'rejected';
      return status;
    }

    function getAccountPosts(account) {
      return account && Array.isArray(account.recentPosts) ? account.recentPosts : [];
    }

    function getReviewItems(state) {
      return Array.isArray(state && state.reviews && state.reviews.items) ? state.reviews.items : [];
    }

    function isBroadcastTask(task) {
      const haystack = [
        task && task.title,
        task && task.notes,
        task && task.category,
      ].join(' ').toLowerCase();
      return /(^|\\W)x(\\W|$)|tweet|twitter|x posting|x post|notebooklm|x-graphics|architecture diagram|delegation poll|optimization paradox/.test(haystack);
    }

    function isBroadcastReviewItem(item) {
      const haystack = [
        item && item.name,
        item && item.path,
        item && item.type,
      ].join(' ').toLowerCase();
      return /x-graphics|dashboard-tweet|tweet|delegation poll|optimization paradox|3 tier|3-tier|architecture/.test(haystack);
    }

    function extractTweetInfo(text, explicitTweetId) {
      const raw = String(text || '').trim();
      const match = raw.match(/\\s*\\((\\d{8,})\\)\\s*$/);
      return {
        tweetId: explicitTweetId || (match ? match[1] : ''),
        displayText: match ? raw.slice(0, match.index).trim() : raw,
      };
    }

    function trimCopy(value, limit) {
      const text = String(value || '').trim();
      if (!text) return '';
      if (text.length <= limit) return text;
      return text.slice(0, Math.max(0, limit - 1)).trimEnd() + '...';
    }

    function renderHeartbeatBars() {
      const strip = document.getElementById('heartbeat-strip');
      if (!strip || strip.children.length) return;
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
      if (sessions.length) return 'active';
      if (blocked) return 'blocked';
      return state && state.system && state.system.status === 'online' ? 'online' : 'offline';
    }

    function deriveQueuePosts(tasks) {
      const queueTasks = Array.isArray(tasks) ? tasks : [];
      const loggedPosts = [];

      queueTasks.forEach(function(task) {
        if (!task || task.status !== 'DONE') return;

        const title = String(task.title || '');
        const notes = String(task.notes || '');
        const isXTask = /x tweets|x posts|twitter/i.test(title) || /posted\\s+\\d+\\s+tweets?/i.test(notes);
        if (!isXTask) return;

        const listSectionMatch = notes.match(/posted\\s+\\d+\\s+tweets?:\\s*(.+?)(?:\\.\\s+[A-Z]|$)/i);
        const listSection = listSectionMatch ? listSectionMatch[1] : '';
        const numberedParts = listSection
          ? listSection.split(/,\\s*(?=\\d+\\))/).map(function(part) {
              return part.replace(/^\\d+\\)\\s*/, '').trim();
            }).filter(Boolean)
          : [];
        if (numberedParts.length) {
          numberedParts.forEach(function(text) {
            if (!text) return;
            loggedPosts.push({
              text: text,
              time: 'Queue log',
              chars: text.length,
              source: 'queue_log',
            });
          });
          return;
        }

        const countMatch = notes.match(/posted\\s+(\\d+)\\s+tweets?/i);
        const count = countMatch ? Number(countMatch[1]) : 0;
        for (let index = 0; index < count; index += 1) {
          loggedPosts.push({
            text: title || 'Posted from queue log',
            time: 'Queue log',
            chars: String(title || '').length,
            source: 'queue_log',
          });
        }
      });

      return loggedPosts.slice(0, 10);
    }

    function deriveSummary(state) {
      const xPosts = state && state.xPosts ? state.xPosts : {};
      const queue = state && state.queue ? state.queue : {};
      const system = state && state.system ? state.system : {};
      const apis = state && state.apis ? state.apis : {};
      const queueTasks = Array.isArray(queue.tasks) ? queue.tasks : [];
      const reviewItems = getReviewItems(state);
      const fallbackForgePosts = deriveQueuePosts(queue.tasks);
      const rawForge = xPosts.forge || {};
      const forge = (!rawForge.postsToday && !getAccountPosts(rawForge).length && fallbackForgePosts.length)
        ? {
            handle: rawForge.handle || '@Forge_Builds',
            postsToday: fallbackForgePosts.length,
            lastPosted: 'Queue log',
            recentPosts: fallbackForgePosts,
          }
        : rawForge;
      const lucas = xPosts.lucas || {};
      const forgePosts = safeNumber(forge.postsToday || 0);
      const lucasPosts = safeNumber(lucas.postsToday || 0);
      const totalPosts = forgePosts + lucasPosts;
      const activeAccounts = (forgePosts > 0 ? 1 : 0) + (lucasPosts > 0 ? 1 : 0);
      const forgeShare = totalPosts > 0 ? Math.round((forgePosts / totalPosts) * 100) : 0;
      const lucasShare = totalPosts > 0 ? 100 - forgeShare : 0;
      const broadcastTasks = queueTasks.filter(isBroadcastTask);
      const completedBroadcastTasks = broadcastTasks.filter(function(task) {
        return String(task.status || '').toUpperCase() === 'DONE';
      });
      const blockedBroadcastTasks = broadcastTasks.filter(function(task) {
        return String(task.status || '').toUpperCase() === 'BLOCKED';
      });
      const broadcastReviewItems = reviewItems.filter(isBroadcastReviewItem);
      const readyReviewItems = broadcastReviewItems.filter(function(item) {
        return normalizeStatus(item.status) === 'approved';
      });
      const pendingReviewItems = broadcastReviewItems.filter(function(item) {
        const status = normalizeStatus(item.status);
        return status === 'pending' || status === 'needs_revision';
      });
      const rejectedReviewItems = broadcastReviewItems.filter(function(item) {
        return normalizeStatus(item.status) === 'rejected';
      });
      const queuedAssetJobs = completedBroadcastTasks.filter(function(task) {
        return /design|convert|create|generate/i.test(String(task.title || ''));
      });
      const failedBroadcastTasks = completedBroadcastTasks.filter(function(task) {
        return /failed|401|auth error|image upload/i.test(String(task.notes || ''));
      });
      const livePipeline = getAccountPosts(forge).concat(getAccountPosts(lucas)).map(function(post) {
        const tweet = extractTweetInfo(post.text, post.tweet_id);
        return {
          title: tweet.displayText || 'Live post',
          meta: post.source === 'queue_log'
            ? 'Posted live and recovered from the runtime log.'
            : 'Synced directly from broadcast state.',
          tone: 'live',
        };
      });
      const readyPipeline = readyReviewItems.map(function(item) {
        return {
          title: item.name || 'Approved asset',
          meta: 'Approved visual staged in review and ready for the next shot.',
          tone: 'ready',
        };
      }).concat(queuedAssetJobs.map(function(task) {
        return {
          title: task.title || 'Broadcast asset prepared',
          meta: trimCopy(task.notes || 'Workflow completed and handed output into the broadcast lane.', 110),
          tone: 'ready',
        };
      }));
      const reviewPipeline = pendingReviewItems.map(function(item) {
        const status = normalizeStatus(item.status);
        return {
          title: item.name || 'Broadcast asset',
          meta: status === 'needs_revision'
            ? 'Needs another pass before it should go public.'
            : 'Waiting on Lucas to decide whether it deserves airtime.',
          tone: 'pending',
        };
      });
      const frictionPipeline = [];

      failedBroadcastTasks.forEach(function(task) {
        frictionPipeline.push({
          title: task.title || 'Broadcast delivery issue',
          meta: trimCopy(task.notes || 'Workflow completed with a delivery failure.', 115),
          tone: 'blocked',
        });
      });

      blockedBroadcastTasks.forEach(function(task) {
        frictionPipeline.push({
          title: task.title || 'Blocked broadcast task',
          meta: trimCopy(task.notes || 'This task is blocked and needs intervention before the next launch window.', 115),
          tone: 'blocked',
        });
      });

      if (!frictionPipeline.length && rejectedReviewItems.length) {
        frictionPipeline.push({
          title: rejectedReviewItems[0].name || 'Rejected concept',
          meta: 'At least one broadcast concept was rejected, which is healthy pressure instead of false momentum.',
          tone: 'blocked',
        });
      }

      const launchInventory = totalPosts + readyPipeline.length + reviewPipeline.length;

      let tempoTone = 'cold';
      let tempoLabel = 'Cold start';
      let tempoHeadline = 'No posts yet';
      let tempoNote = 'Once posts land, this view will call out where the momentum is coming from.';

      if (totalPosts >= 6) {
        tempoTone = 'hot';
        tempoLabel = 'Running hot';
        tempoHeadline = 'High-output day';
        tempoNote = 'Distribution is active across the day. Watch for repetition before pushing more.';
      } else if (totalPosts >= 3) {
        tempoTone = 'warm';
        tempoLabel = 'Launch rhythm';
        tempoHeadline = 'The feed is visibly moving';
        tempoNote = 'There is enough live output on the board to make the next staged asset matter more, not less.';
      } else if (totalPosts >= 1) {
        tempoTone = 'warm';
        tempoLabel = 'Ignition';
        tempoHeadline = 'First signal on the board';
        tempoNote = 'The page has moved past zero. Now the job is to stack enough good shots that the audience feels momentum.';
      }

      let leadAccount = 'No active lead yet.';
      if (forgePosts > lucasPosts) {
        leadAccount = (forge.handle || '@Forge_Builds') + ' is carrying the day with ' + forgePosts + ' live post' + (forgePosts === 1 ? '' : 's') + '.';
      } else if (lucasPosts > forgePosts) {
        leadAccount = (lucas.handle || '@LucasJOliver_78') + ' is carrying the founder lane with ' + lucasPosts + ' post' + (lucasPosts === 1 ? '' : 's') + '.';
      } else if (totalPosts > 0) {
        leadAccount = 'Both lanes are balanced right now at ' + forgePosts + ' post' + (forgePosts === 1 ? '' : 's') + ' each.';
      }

      const forgeLast = forge.lastPosted || (getAccountPosts(forge)[0] && getAccountPosts(forge)[0].time) || '--';
      const lucasLast = lucas.lastPosted || (getAccountPosts(lucas)[0] && getAccountPosts(lucas)[0].time) || '--';
      const latestLive = livePipeline[0];

      const nextSession = system.nextSession || {};
      const nextRun = nextSession.name
        ? nextSession.name + (nextSession.in && nextSession.in !== '--' ? ' ' + nextSession.in : '')
        : 'No scheduled window detected.';
      const audiencePhase = totalPosts >= 3
        ? 'Founding audience'
        : totalPosts >= 1
          ? 'Ignition phase'
          : 'Runway warming';
      const audienceCopy = totalPosts >= 3
        ? 'This is still the beginning. With only a small audience watching, three good posts already change the baseline.'
        : totalPosts >= 1
          ? 'The account is still tiny enough that each post materially changes what the next visitor sees.'
          : 'This should read like anticipation, not emptiness. The point is to show a system loading up before the graph goes vertical.';
      const launchCopy = launchInventory
        ? totalPosts + ' live, ' + readyPipeline.length + ' staged, and ' + reviewPipeline.length + ' waiting on review.'
        : 'No launch inventory is visible yet.';
      const launchBoardCopy = totalPosts
        ? 'Live output is already moving. The next job is turning staged assets and review decisions into another visible burst.'
        : readyPipeline.length || reviewPipeline.length
          ? 'Nothing is live yet, but the machine is loaded with assets and decisions waiting to become distribution.'
          : 'A small audience does not mean an empty runway. It means every publish decision still visibly moves the baseline.';
      const blockerCopy = frictionPipeline.length
        ? trimCopy(frictionPipeline[0].title + ': ' + frictionPipeline[0].meta, 100)
        : 'No blockers detected in the broadcast lane.';
      const latestPost = latestLive
        ? latestLive.title + ' is already on the board.'
        : 'Nothing has posted today.';

      return {
        forge: forge,
        lucas: lucas,
        systemStatus: system.status || 'idle',
        totalPosts: totalPosts,
        launchInventory: launchInventory,
        activeAccounts: activeAccounts,
        forgeShare: forgeShare,
        lucasShare: lucasShare,
        tempoTone: tempoTone,
        tempoLabel: tempoLabel,
        tempoHeadline: tempoHeadline,
        tempoNote: tempoNote,
        audiencePhase: audiencePhase,
        audienceCopy: audienceCopy,
        launchCopy: launchCopy,
        launchBoardCopy: launchBoardCopy,
        blockerCopy: blockerCopy,
        railLiveCount: totalPosts,
        railStagedCount: readyPipeline.length + reviewPipeline.length,
        railJobsCount: completedBroadcastTasks.length,
        pipelineLive: livePipeline,
        pipelineReady: readyPipeline,
        pipelineReview: reviewPipeline,
        pipelineFriction: frictionPipeline,
        readyCount: readyPipeline.length,
        reviewCount: reviewPipeline.length,
        frictionCount: frictionPipeline.length,
        leadAccount: leadAccount,
        latestPost: latestPost,
        nextRun: nextRun,
        xStatus: String(apis.x || 'unknown'),
        lastUpdated: state && state.lastUpdated ? state.lastUpdated : null,
        forgeLast: forgeLast,
        lucasLast: lucasLast,
      };
    }

    function renderPosts(containerId, account, accentName) {
      const root = document.getElementById(containerId);
      const posts = getAccountPosts(account);
      const accountHandle = String(account && account.handle || (accentName === 'forge' ? '@Forge_Builds' : '@LucasJOliver_78'));
      const accountName = accentName === 'forge' ? 'Forge' : 'Lucas Oliver';
      if (posts.length === 0) {
        root.innerHTML = '<div class="empty-state">No live posts are synced in this lane yet.<br>This is runway, not failure. The next publish will turn this panel into visible momentum.</div>';
        return;
      }

      root.innerHTML = posts.map(function(post, index) {
        const tweet = extractTweetInfo(post.text, post.tweet_id);
        const chars = safeNumber(post.chars || String(tweet.displayText || '').length || 0);
        const sourceLabel = post.source === 'queue_log'
          ? 'Posted live · recovered from queue log'
          : 'Live in state';
        const handleSlug = accountHandle.replace(/^@/, '');
        const tweetUrl = tweet.tweetId
          ? 'https://x.com/' + encodeURIComponent(handleSlug) + '/status/' + encodeURIComponent(tweet.tweetId)
          : '';
        return '' +
          '<article class="post-card live ' + accentName + '">' +
            '<div class="post-ribbon"><i class="fa-solid fa-wave-square"></i> ' + escapeHtml(sourceLabel) + '</div>' +
            '<div class="post-header">' +
              '<div class="post-author">' +
                '<div class="post-avatar">' + escapeHtml(accentName === 'forge' ? 'F' : 'L') + '</div>' +
                '<div>' +
                  '<div class="post-name">' + escapeHtml(accountName) + ' <i class="fa-solid fa-circle-check"></i></div>' +
                  '<div class="post-handle">' + escapeHtml(accountHandle) + ' · ' + escapeHtml(post.time || '--') + '</div>' +
                '</div>' +
              '</div>' +
              (tweetUrl
                ? '<a class="post-link" href="' + escapeHtml(tweetUrl) + '" target="_blank" rel="noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open on X</a>'
                : '<div class="post-link"><i class="fa-solid fa-receipt"></i> Queue receipt</div>') +
            '</div>' +
            '<p class="post-text">' + escapeHtml(tweet.displayText || '') + '</p>' +
            '<div class="post-footer">' +
              '<div class="post-meta">' +
                '<span class="meta-pill"><i class="fa-solid fa-hashtag"></i> Post ' + String(index + 1).padStart(2, '0') + '</span>' +
                '<span class="meta-pill"><i class="fa-solid fa-text-width"></i> ' + escapeHtml(String(chars)) + ' chars</span>' +
                (tweet.tweetId ? '<span class="meta-pill"><i class="fa-brands fa-x-twitter"></i> #' + escapeHtml(tweet.tweetId.slice(-6)) + '</span>' : '') +
              '</div>' +
              '<div class="post-reason">' + escapeHtml(post.source === 'queue_log'
                ? 'Recovered from queue receipts so already-shipped work still feels alive on the page.'
                : 'Synced directly from runtime state.') + '</div>' +
            '</div>' +
          '</article>';
      }).join('');
    }

    function renderPipelineList(id, items, emptyCopy) {
      const root = document.getElementById(id);
      if (!root) return;
      if (!Array.isArray(items) || !items.length) {
        root.innerHTML = '<div class="pipeline-item"><div class="pipeline-item-meta">' + escapeHtml(emptyCopy) + '</div></div>';
        return;
      }

      root.innerHTML = items.slice(0, 4).map(function(item) {
        return '' +
          '<div class="pipeline-item">' +
            '<div class="pipeline-item-top">' +
              '<div class="pipeline-item-title">' + escapeHtml(item.title || 'Untitled item') + '</div>' +
              '<span class="mini-badge ' + escapeHtml(item.tone || 'pending') + '">' + escapeHtml(item.tone || 'pending') + '</span>' +
            '</div>' +
            '<div class="pipeline-item-meta">' + escapeHtml(item.meta || '') + '</div>' +
          '</div>';
      }).join('');
    }

    function renderSummary(summary) {
      flashValue('hero-total', String(summary.totalPosts));
      flashValue('hero-pipeline', String(summary.launchInventory));
      flashValue('hero-next', summary.nextRun);
      flashValue('audience-phase', summary.audiencePhase);
      flashValue('audience-copy', summary.audienceCopy);
      flashValue('launch-loaded', String(summary.launchInventory));
      flashValue('launch-copy', summary.launchCopy);
      flashValue('tempo-headline', summary.tempoHeadline);
      flashValue('tempo-note', summary.tempoNote);
      flashValue('forge-count', String(summary.forge.postsToday || 0));
      flashValue('forge-last', summary.forgeLast || '--');
      flashValue('lucas-count', String(summary.lucas.postsToday || 0));
      flashValue('lucas-last', summary.lucasLast || '--');
      flashValue('forge-share', summary.forgeShare + '%');
      flashValue('lucas-share', summary.lucasShare + '%');
      flashValue('launch-board-copy', summary.launchBoardCopy);
      flashValue('rail-live-count', String(summary.railLiveCount));
      flashValue('rail-staged-count', String(summary.railStagedCount));
      flashValue('rail-jobs-count', String(summary.railJobsCount));
      flashValue('rail-blocker-copy', summary.blockerCopy);
      flashValue('lead-account', summary.leadAccount);
      flashValue('latest-post', summary.latestPost);
      flashValue('next-run', summary.nextRun);
      flashValue('x-status', String(summary.xStatus).toUpperCase());
      const tempoPill = document.getElementById('tempo-pill');
      tempoPill.textContent = summary.tempoLabel;
      tempoPill.className = 'tempo-pill ' + summary.tempoTone;
      document.getElementById('forge-handle').innerHTML = '<i class="fa-solid fa-bolt"></i> ' + escapeHtml(summary.forge.handle || '@Forge_Builds');
      document.getElementById('lucas-handle').innerHTML = '<i class="fa-solid fa-user-wave"></i> ' + escapeHtml(summary.lucas.handle || '@LucasJOliver_78');

      const syncChip = document.getElementById('sync-chip');
      const lastUpdatedText = summary.lastUpdated
        ? 'Synced ' + formatRelative(summary.lastUpdated)
        : 'Waiting for sync';
      syncChip.innerHTML = '<i class="fa-solid fa-wave-square"></i> <strong>' + escapeHtml(lastUpdatedText) + '</strong>';

      const coverageCopy = summary.activeAccounts === 2
        ? 'Both channels are active. That gives the system room to alternate between autonomous output and founder amplification without making the feed feel one-note.'
        : summary.activeAccounts === 1
          ? 'One lane is visibly moving while the other stays available for a sharper shot. That is fine in the founding-audience phase as long as the next move feels deliberate.'
          : 'No channels have posted yet, so the console is still showing runway rather than lift-off.';

      const pressureCopy = summary.totalPosts >= 6
        ? 'Today already looks busy. The pressure is no longer about volume; it is about making sure the next post says something new.'
        : summary.totalPosts >= 3
          ? 'Tempo looks healthy. The question now is whether to fire the next staged asset immediately or hold it for a cleaner window.'
        : summary.totalPosts >= 1
            ? 'There is early movement, but the bigger signal is the launch inventory behind it. One or two more good shots would make the curve feel real.'
            : 'Posting tempo is idle, but the page can still show whether review inventory and workflow jobs are stacking into the next launch.';

      const actionCopy = summary.reviewCount > 0
        ? summary.reviewCount + ' broadcast asset' + (summary.reviewCount === 1 ? ' is' : 's are') + ' waiting on Lucas. Clearing those decisions is the fastest way to turn pipeline into visible growth.'
        : summary.readyCount > 0
          ? 'There are staged assets already in the system. The next move is choosing the sharpest one instead of overthinking the audience size.'
          : summary.totalPosts > 0
            ? 'The feed is moving. Use the founder lane only when a post needs extra authority or narrative force.'
            : 'Use this page to decide whether Forge should keep pushing autonomously or whether Lucas should add founder-weighted amplification.';

      flashValue('coverage-copy', coverageCopy);
      flashValue('pressure-copy', pressureCopy);
      flashValue('action-copy', actionCopy);

      flashValue('pipeline-live-count', String(summary.totalPosts));
      flashValue('pipeline-live-copy', summary.totalPosts
        ? summary.totalPosts + ' live post' + (summary.totalPosts === 1 ? '' : 's') + ' are already public.'
        : 'No live posts are visible yet.');
      flashValue('pipeline-ready-count', String(summary.readyCount));
      flashValue('pipeline-ready-copy', summary.readyCount
        ? summary.readyCount + ' staged asset' + (summary.readyCount === 1 ? '' : 's') + ' can feed the next launch window.'
        : 'No ready or staged broadcast assets yet.');
      flashValue('pipeline-review-count', String(summary.reviewCount));
      flashValue('pipeline-review-copy', summary.reviewCount
        ? summary.reviewCount + ' item' + (summary.reviewCount === 1 ? '' : 's') + ' need Lucas before they can ship.'
        : 'Nothing in the broadcast lane currently needs a human call.');
      flashValue('pipeline-friction-count', String(summary.frictionCount));
      flashValue('pipeline-friction-copy', summary.frictionCount
        ? summary.frictionCount + ' point' + (summary.frictionCount === 1 ? '' : 's') + ' of delivery friction are visible.'
        : 'No delivery friction visible.');

      renderPipelineList('pipeline-live-list', summary.pipelineLive, 'Live posts will appear here as soon as they ship.');
      renderPipelineList('pipeline-ready-list', summary.pipelineReady, 'When assets are approved or generated, they will appear here.');
      renderPipelineList('pipeline-review-list', summary.pipelineReview, 'Human decisions in the broadcast lane will show up here.');
      renderPipelineList('pipeline-friction-list', summary.pipelineFriction, 'If delivery or auth breaks, this card becomes the alarm.');
    }

    function setPulse(state) {
      const strip = document.getElementById('heartbeat-strip');
      if (!strip) return;
      const posture = classifySystemState(state);
      strip.classList.remove('active', 'blocked');
      if (posture === 'active') {
        strip.classList.add('active');
      } else if (posture === 'blocked') {
        strip.classList.add('blocked');
      }
    }

    async function fetchState() {
      try {
        const response = await liveFetch('/api/state');
        if (!response.ok) throw new Error('Request failed');

        const state = await response.json();
        const summary = deriveSummary(state);
        renderSummary(summary);
        renderPosts('forge-posts', summary.forge, 'forge');
        renderPosts('lucas-posts', summary.lucas, 'lucas');
        setPulse(state);
      } catch (error) {
        document.getElementById('sync-chip').innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <strong>Offline - data unavailable</strong>';
        document.getElementById('x-status').textContent = 'OFFLINE';
        setPulse({ system: { status: 'offline' } });
        renderPosts('forge-posts', null, 'forge');
        renderPosts('lucas-posts', null, 'lucas');
      }
    }

    renderHeartbeatBars();
    setClock();
    setInterval(setClock, 1000);
    fetchState();
    setInterval(fetchState, REFRESH_INTERVAL_MS);
    wireLiveRefresh(fetchState);
  </script>
</body>
</html>`;

export default xPostsHtml;
