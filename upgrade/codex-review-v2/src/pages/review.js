const reviewHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Forge Review OS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="preconnect" href="https://cdnjs.cloudflare.com">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --bg-app: #071019;
      --bg-panel: rgba(10, 22, 33, 0.88);
      --bg-muted: rgba(255, 255, 255, 0.04);
      --bg-preview: #040b12;
      --bg-active: rgba(105, 167, 255, 0.12);
      --text-primary: #f3f7fb;
      --text-secondary: #9cb1c8;
      --text-tertiary: #6d8297;
      --border: rgba(157, 182, 209, 0.14);
      --border-strong: rgba(157, 182, 209, 0.26);
      --accent: #69a7ff;
      --accent-soft: rgba(105, 167, 255, 0.14);
      --success: #32d4a4;
      --success-soft: rgba(50, 212, 164, 0.16);
      --warning: #ffb144;
      --warning-soft: rgba(255, 177, 68, 0.16);
      --error: #ff6b7a;
      --error-soft: rgba(255, 107, 122, 0.16);
      --shadow-card: 0 18px 42px rgba(0, 0, 0, 0.26);
      --shadow-float: 0 24px 64px rgba(0, 0, 0, 0.45);
      --radius-card: 20px;
      --radius-control: 14px;
      --panel-queue: 280px;
      --panel-inspector: 360px;
      --workspace-height: 1060px;
      --nav-height: 86px;
      --space-1: 4px;
      --space-2: 8px;
      --space-3: 12px;
      --space-4: 16px;
      --space-5: 20px;
      --space-6: 24px;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      min-height: 100%;
      background:
        radial-gradient(circle at top left, rgba(105, 167, 255, 0.14), transparent 28%),
        radial-gradient(circle at top right, rgba(255, 177, 68, 0.14), transparent 24%),
        linear-gradient(180deg, #061018 0%, #071019 100%);
      color: var(--text-primary);
      font-family: "Space Grotesk", "Segoe UI", sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow: auto;
    }

    button, input, textarea {
      font: inherit;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .app-shell {
      min-height: 100vh;
      max-width: 1520px;
      margin: 0 auto;
      padding: 16px 18px 18px;
      display: grid;
      grid-template-rows: auto auto auto;
      align-content: start;
      gap: 12px;
      overflow: visible;
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
      color: var(--accent);
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
      font-weight: 600;
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
      font-family: "IBM Plex Mono", ui-monospace, monospace;
    }

    .sync-chip {
      color: var(--text-secondary);
    }

    .sync-chip strong {
      color: var(--text-primary);
      font-weight: 600;
    }

    .token-wrap {
      display: grid;
      gap: 8px;
    }

    .token-wrap label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .token-wrap input {
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.03);
      outline: none;
      width: 100%;
      min-height: 44px;
      color: var(--text-primary);
      padding: 0 12px;
      border-radius: var(--radius-control);
    }

    .main-grid {
      display: grid;
      grid-template-columns: var(--panel-queue) minmax(0, 1fr) var(--panel-inspector);
      gap: var(--space-4);
      padding: 12px;
      height: var(--workspace-height);
      min-height: var(--workspace-height);
      max-height: var(--workspace-height);
      align-items: stretch;
      align-self: start;
    }

    .panel {
      min-height: 0;
      background: var(--bg-panel);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-card);
      border-radius: var(--radius-card);
      overflow: hidden;
      backdrop-filter: blur(18px);
    }

    .queue-panel, .preview-panel, .inspector-panel {
      display: grid;
      min-height: 0;
    }

    .queue-panel {
      grid-template-rows: auto auto auto auto minmax(0, 1fr);
    }

    .preview-panel {
      grid-template-rows: auto minmax(0, 1fr);
      background: var(--bg-preview);
    }

    .preview-panel.has-context {
      grid-template-rows: auto auto minmax(0, 1fr);
    }

    .inspector-panel {
      grid-template-rows: auto minmax(0, 1fr);
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
      background: var(--bg-panel);
    }

    .panel-title {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .panel-subtle {
      color: var(--text-tertiary);
      font-size: 11px;
      font-weight: 500;
    }

    .stats-strip {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      border-bottom: 1px solid var(--border);
      background: var(--bg-panel);
      text-align: center;
    }

    .stat-cell {
      display: grid;
      place-items: center;
      align-content: center;
      gap: 6px;
      min-height: 74px;
      padding: 10px 8px 9px;
      border-right: 1px solid var(--border);
    }

    .stat-cell:last-child {
      border-right: none;
    }

    .stat-label {
      width: 100%;
      font-family: "IBM Plex Mono", ui-monospace, monospace;
      font-size: 9px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0;
      line-height: 1.05;
      white-space: nowrap;
      text-align: center;
    }

    .stat-value {
      font-size: 21px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.03em;
    }

    .queue-progress {
      display: grid;
      gap: 8px;
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));
    }

    .queue-progress-copy {
      display: flex;
      justify-content: space-between;
      gap: var(--space-3);
      align-items: center;
      font-size: 11px;
      color: var(--text-secondary);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .queue-progress-copy strong {
      color: var(--text-primary);
      font-size: 12px;
      letter-spacing: normal;
      text-transform: none;
    }

    .queue-progress-track {
      width: 100%;
      height: 7px;
      border-radius: 999px;
      overflow: hidden;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.04);
    }

    .queue-progress-fill {
      height: 100%;
      width: 0%;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(106, 179, 255, 0.95), rgba(255, 138, 45, 0.9));
      box-shadow: 0 0 18px rgba(106, 179, 255, 0.16);
      transition: width 280ms ease;
    }

    .filters {
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);
      background: var(--bg-panel);
      display: grid;
      gap: 10px;
    }

    .filter-row {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .filter-pill {
      border: 1px solid var(--border);
      background: var(--bg-panel);
      color: var(--text-secondary);
      border-radius: var(--radius-control);
      padding: 6px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
    }

    .filter-pill:hover {
      border-color: var(--border-strong);
    }

    .filter-pill.active {
      background: var(--accent);
      border-color: var(--accent);
      color: white;
    }

    .search-input, .comment-box {
      width: 100%;
      border: 1px solid var(--border);
      border-radius: var(--radius-control);
      background: var(--bg-panel);
      color: var(--text-primary);
      outline: none;
      transition: border-color 150ms ease, box-shadow 150ms ease;
    }

    .search-input {
      padding: 9px 11px;
      font-size: 12px;
    }

    .comment-box {
      min-height: 88px;
      resize: vertical;
      padding: 10px 12px;
      font-size: 12px;
      line-height: 1.5;
    }

    .search-input:focus, .comment-box:focus, .token-wrap input:focus {
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    .queue-list {
      min-height: 0;
      overflow: auto;
      background: var(--bg-panel);
      scrollbar-gutter: stable;
      overscroll-behavior: contain;
    }

    .queue-item {
      width: 100%;
      display: grid;
      grid-template-columns: 34px 1fr auto;
      gap: 10px;
      align-items: center;
      padding: 10px 12px;
      border: none;
      border-left: 3px solid transparent;
      border-bottom: 1px solid var(--border);
      background: transparent;
      text-align: left;
      cursor: pointer;
      transition: background 150ms ease, border-color 150ms ease, transform 180ms ease, opacity 180ms ease;
    }

    .queue-item:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .queue-item.active {
      background: var(--bg-active);
      border-left-color: var(--accent);
    }

    .queue-item.resolved {
      transform: scale(0.985);
      opacity: 0.72;
    }

    .queue-thumb, .queue-icon {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      overflow: hidden;
      border: 1px solid var(--border);
      background: var(--bg-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-tertiary);
      flex-shrink: 0;
    }

    .queue-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .queue-name {
      font-size: 13px;
      font-weight: 600;
      line-height: 1.28;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .queue-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
      flex-wrap: wrap;
    }

    .tiny-badge, .revision-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      border-radius: 999px;
      padding: 2px 7px;
      font-size: 10px;
      font-weight: 600;
    }

    .tiny-badge {
      background: var(--bg-muted);
      color: var(--text-secondary);
    }

    .revision-pill {
      background: var(--accent-soft);
      color: var(--accent);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      flex-shrink: 0;
    }

    .status-pending { background: var(--warning); }
    .status-approve { background: var(--success); }
    .status-needs_revision { background: var(--warning); }
    .status-reject { background: var(--error); }

    .preview-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
      background: rgba(6, 14, 22, 0.72);
    }

    .preview-context-bar {
      display: none;
      gap: var(--space-3);
      padding: 9px 14px;
      border-bottom: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(10, 20, 31, 0.94), rgba(7, 16, 25, 0.86));
    }

    .preview-context-bar.active {
      display: grid;
    }

    .preview-context-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--space-2);
    }

    .preview-context-chip {
      border: 1px solid var(--border);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.04);
      padding: 8px 10px;
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .preview-context-chip span:first-child {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-tertiary);
    }

    .preview-context-chip span:last-child {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .preview-context-actions {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
      align-items: center;
    }

    .preview-toolbar-actions {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .preview-canvas {
      min-height: 0;
      display: grid;
      place-items: stretch;
      padding: 12px;
      position: relative;
      overflow: hidden;
    }

    .preview-canvas::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0;
    }

    .preview-canvas.flash-approve::after {
      background: radial-gradient(circle at center, rgba(50, 212, 164, 0.36), rgba(50, 212, 164, 0.08) 40%, transparent 70%);
      animation: previewFlash 360ms ease-out;
    }

    .preview-canvas.flash-needs_revision::after {
      background: radial-gradient(circle at center, rgba(255, 177, 68, 0.34), rgba(255, 177, 68, 0.08) 40%, transparent 70%);
      animation: previewFlash 360ms ease-out;
    }

    .preview-canvas.flash-reject::after {
      background: radial-gradient(circle at center, rgba(255, 107, 122, 0.36), rgba(255, 107, 122, 0.08) 40%, transparent 70%);
      animation: previewFlash 360ms ease-out;
    }

    .preview-inner {
      width: 100%;
      height: 100%;
      min-height: 0;
      display: grid;
      place-items: stretch;
      border: 1px solid rgba(157, 182, 209, 0.12);
      background:
        radial-gradient(circle at top right, rgba(255, 177, 68, 0.14), transparent 26%),
        radial-gradient(circle at top left, rgba(105, 167, 255, 0.12), transparent 28%),
        linear-gradient(180deg, rgba(8, 18, 28, 0.96), rgba(6, 13, 20, 0.98));
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
      transition: transform 220ms ease, opacity 220ms ease, box-shadow 220ms ease;
    }

    .preview-inner.advance-out-left {
      transform: translateX(-28px) scale(0.985);
      opacity: 0.14;
    }

    .preview-inner.advance-out-right {
      transform: translateX(28px) scale(0.985);
      opacity: 0.14;
    }

    .preview-inner.advance-in-left {
      animation: advanceInLeft 260ms ease;
    }

    .preview-inner.advance-in-right {
      animation: advanceInRight 260ms ease;
    }

    .preview-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block;
      box-shadow: var(--shadow-float);
      border-radius: 4px;
    }

    .preview-frame {
      width: 100%;
      height: 100%;
      min-height: 0;
      border: none;
      background: white;
    }

    .preview-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 12px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }

    .preview-link.hidden {
      display: none;
    }

    .empty-preview {
      display: grid;
      gap: var(--space-3);
      justify-items: center;
      text-align: center;
      color: var(--text-tertiary);
      padding: var(--space-6);
    }

    .empty-preview i {
      font-size: 36px;
      color: var(--text-tertiary);
    }

    .inspector-content {
      min-height: 0;
      overflow: auto;
      padding: 12px;
      display: grid;
      gap: 14px;
      background: var(--bg-panel);
      scrollbar-gutter: stable;
      overscroll-behavior: contain;
    }

    .auth-card {
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius-card);
      background: rgba(255, 255, 255, 0.03);
      box-shadow: var(--shadow-card);
    }

    .item-title {
      font-size: 18px;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -0.02em;
      margin: 0 0 var(--space-2);
    }

    .stack {
      display: grid;
      gap: var(--space-3);
    }

    .meta-grid {
      display: grid;
      gap: var(--space-2);
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      gap: var(--space-3);
      font-size: 11px;
    }

    .meta-row span:first-child {
      color: var(--text-tertiary);
      font-weight: 500;
    }

    .meta-row span:last-child {
      color: var(--text-primary);
      font-weight: 600;
      text-align: right;
    }

    .decision-tabs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--space-2);
    }

    .decision-tab {
      display: grid;
      place-items: center;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-secondary);
      border-radius: var(--radius-control);
      min-height: 54px;
      cursor: pointer;
      padding: 10px 8px;
      font-size: 12px;
      line-height: 1.2;
      font-weight: 700;
      transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
    }

    .decision-tab:hover {
      border-color: var(--border-strong);
      color: var(--text-primary);
    }

    .decision-tab.active[data-decision="approve"] {
      background: var(--success-soft);
      border-color: rgba(22, 163, 74, 0.35);
      color: var(--success);
    }

    .decision-tab.active[data-decision="needs_revision"] {
      background: var(--warning-soft);
      border-color: rgba(202, 138, 4, 0.35);
      color: var(--warning);
    }

    .decision-tab.active[data-decision="reject"] {
      background: var(--error-soft);
      border-color: rgba(220, 38, 38, 0.35);
      color: var(--error);
    }

    .tag-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-2);
    }

    .tag-pill {
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-secondary);
      border-radius: var(--radius-control);
      padding: 7px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
    }

    .tag-pill.selected {
      background: var(--accent-soft);
      border-color: rgba(37, 99, 235, 0.35);
      color: var(--accent);
    }

    .action-button {
      width: 100%;
      min-height: 48px;
      border: none;
      border-radius: var(--radius-control);
      color: white;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.01em;
      cursor: pointer;
      transition: transform 150ms ease, filter 150ms ease, box-shadow 150ms ease;
      box-shadow: var(--shadow-card);
    }

    .action-button:hover {
      transform: translateY(-1px);
      filter: brightness(1.02);
    }

    .action-button:disabled {
      opacity: 0.55;
      cursor: default;
      transform: none;
    }

    .action-approve { background: linear-gradient(135deg, #23b26d, #32d4a4); }
    .action-revision { background: linear-gradient(135deg, #d68913, #ffb144); color: #1d1202; }
    .action-reject { background: linear-gradient(135deg, #d93648, #ff6b7a); }
    .action-button.confirmed {
      box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08), var(--shadow-card);
    }

    .decision-summary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary);
      font-size: 12px;
    }

    .inspector-panel[data-decision="approve"] .decision-summary,
    .inspector-panel[data-decision="approve"] .section-heading {
      color: var(--success);
    }

    .inspector-panel[data-decision="needs_revision"] .decision-summary,
    .inspector-panel[data-decision="needs_revision"] .section-heading {
      color: var(--warning);
    }

    .inspector-panel[data-decision="reject"] .decision-summary,
    .inspector-panel[data-decision="reject"] .section-heading {
      color: var(--error);
    }

    .section-block {
      border-top: 1px solid var(--border);
      padding-top: var(--space-4);
    }

    .section-heading {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: var(--space-3);
    }

    .history-list {
      display: grid;
      gap: var(--space-2);
      max-height: 220px;
      overflow: auto;
    }

    .history-item {
      border: 1px solid var(--border);
      border-radius: var(--radius-card);
      padding: var(--space-3);
      background: var(--bg-muted);
      display: grid;
      gap: var(--space-2);
    }

    .history-title {
      font-size: 12px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      gap: var(--space-2);
    }

    .history-meta, .history-comment {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.45;
    }

    .context-actions {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .context-button {
      min-height: 38px;
      border-radius: var(--radius-control);
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      padding: 0 10px;
    }

    .context-button:hover {
      border-color: var(--border-strong);
      background: rgba(255, 255, 255, 0.07);
    }

    .context-button:disabled {
      opacity: 0.45;
      cursor: default;
    }

    .context-visual {
      border: 1px dashed var(--border-strong);
      border-radius: var(--radius-card);
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.03);
      display: grid;
      gap: 6px;
      text-align: left;
      min-width: min(320px, 100%);
    }

    .context-visual-title {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .context-visual-copy {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.45;
    }

    .metadata-box {
      border: 1px solid var(--border);
      border-radius: var(--radius-card);
      overflow: hidden;
      background: var(--bg-muted);
    }

    .metadata-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
      width: 100%;
      border: none;
      background: transparent;
      padding: 11px 12px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-secondary);
    }

    .metadata-content {
      display: none;
      border-top: 1px solid var(--border);
      padding: var(--space-3);
    }

    .metadata-box.open .metadata-content {
      display: block;
    }

    .metadata-pre {
      margin: 0;
      font-family: "SF Mono", "JetBrains Mono", ui-monospace, monospace;
      font-size: 11px;
      line-height: 1.55;
      color: var(--text-secondary);
      white-space: pre-wrap;
      word-break: break-word;
    }

    .analytics-strip {
      display: grid;
      grid-template-columns: 1.3fr 1fr auto;
      gap: var(--space-4);
      align-items: center;
      padding: 10px 12px;
      border-top: 1px solid var(--border);
      background: rgba(8, 18, 28, 0.82);
      backdrop-filter: blur(10px);
    }

    .analytics-inline {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
    }

    .analytics-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 10px;
      border-radius: 999px;
      background: var(--bg-panel);
      border: 1px solid var(--border);
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      box-shadow: var(--shadow-card);
    }

    .analytics-summary {
      font-size: 12px;
      color: var(--text-secondary);
      display: flex;
      justify-content: flex-end;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .analytics-toggle {
      border: 1px solid var(--border);
      background: var(--bg-panel);
      border-radius: var(--radius-control);
      min-height: 38px;
      padding: 0 12px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .analytics-drawer {
      display: none;
      padding: 0 var(--space-4) var(--space-4);
      background: var(--bg-app);
    }

    .analytics-drawer.open {
      display: block;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--space-4);
    }

    .analytics-card {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-card);
      border-radius: var(--radius-card);
      padding: var(--space-4);
      display: grid;
      gap: var(--space-3);
    }

    .analytics-card h3 {
      margin: 0;
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .metric-list, .bar-list {
      display: grid;
      gap: var(--space-2);
    }

    .metric-row {
      display: flex;
      justify-content: space-between;
      gap: var(--space-2);
      font-size: 12px;
      color: var(--text-secondary);
    }

    .bar-row {
      display: grid;
      gap: 6px;
    }

    .bar-line {
      position: relative;
      height: 8px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, #69a7ff, #4e8cf6);
    }

    .skeleton {
      position: relative;
      overflow: hidden;
      background: linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(105,167,255,0.12) 50%, rgba(255,255,255,0.04) 100%);
      background-size: 200% 100%;
      animation: shimmer 1.2s infinite linear;
      border-radius: 4px;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @keyframes beat {
      0%, 100% { transform: scaleY(0.32); opacity: 0.42; }
      20% { transform: scaleY(0.88); opacity: 0.9; }
      50% { transform: scaleY(0.48); opacity: 0.65; }
      74% { transform: scaleY(1); opacity: 1; }
    }

    @keyframes previewFlash {
      0% { opacity: 0; }
      15% { opacity: 1; }
      100% { opacity: 0; }
    }

    @keyframes advanceInLeft {
      0% { transform: translateX(-26px) scale(0.985); opacity: 0.16; }
      100% { transform: translateX(0) scale(1); opacity: 1; }
    }

    @keyframes advanceInRight {
      0% { transform: translateX(26px) scale(0.985); opacity: 0.16; }
      100% { transform: translateX(0) scale(1); opacity: 1; }
    }

    .mobile-inspector-toggle {
      display: none;
      border: 1px solid var(--border);
      background: var(--bg-panel);
      border-radius: var(--radius-control);
      min-height: 38px;
      padding: 0 12px;
      font-size: 12px;
      font-weight: 700;
    }

    @media (max-width: 1200px) {
      .main-grid {
        grid-template-columns: 250px minmax(0, 1fr) 320px;
      }
    }

    @media (max-width: 900px) {
      .main-grid {
        grid-template-columns: 220px minmax(0, 1fr);
      }

      .inspector-panel {
        position: fixed;
        top: var(--nav-height);
        right: 0;
        bottom: 64px;
        width: min(360px, 92vw);
        z-index: 60;
        box-shadow: var(--shadow-float);
        transform: translateX(100%);
        transition: transform 180ms ease;
      }

      .inspector-panel.open {
        transform: translateX(0);
      }

      .mobile-inspector-toggle {
        display: inline-flex;
        align-items: center;
      }

      .analytics-grid {
        grid-template-columns: 1fr;
      }

      .analytics-strip {
        grid-template-columns: 1fr;
        align-items: start;
      }
    }

    @media (max-width: 1240px) {
      :root {
        --workspace-height: auto;
      }
    }

    @media (max-width: 720px) {
      .topbar {
        grid-template-columns: 1fr;
      }

      .main-grid {
        grid-template-columns: 1fr;
        height: auto;
        min-height: auto;
        max-height: none;
      }

      .queue-panel {
        max-height: 40vh;
      }

      html, body {
        overflow: auto;
      }

      .app-shell {
        height: auto;
        min-height: 100vh;
        overflow: visible;
      }

      .main-grid {
        overflow: visible;
        align-items: start;
      }

      .preview-context-grid {
        grid-template-columns: 1fr;
      }

      .preview-inner,
      .preview-frame,
      .preview-image {
        max-height: 54vh;
        min-height: 360px;
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
        <a class="active" href="/review"><i class="fa-solid fa-shield-halved"></i> Review</a>
        <a href="/x-posts"><i class="fa-brands fa-x-twitter"></i> Broadcast</a>
        <a href="/story"><i class="fa-solid fa-timeline"></i> Story</a>
        <a href="/launchpad"><i class="fa-solid fa-rocket"></i> Launch</a>
      </nav>
      <div class="topbar-meta">
        <div class="heartbeat-strip" id="topbar-heartbeat"></div>
        <div id="live-clock" class="clock">--:--:-- ET</div>
        <div class="sync-chip" id="topbar-sync-chip"><strong>Awaiting sync</strong></div>
      </div>
    </header>

    <main class="main-grid">
      <section class="panel queue-panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Review Queue</div>
            <div class="panel-subtle" id="queue-count">0 items ready</div>
          </div>
          <button class="mobile-inspector-toggle" id="mobile-inspector-toggle">Inspect</button>
        </div>
        <div class="stats-strip">
          <div class="stat-cell">
            <div class="stat-label">Pending</div>
            <div class="stat-value" style="color: var(--warning)" id="pending-count">0</div>
          </div>
          <div class="stat-cell">
            <div class="stat-label">Approved</div>
            <div class="stat-value" style="color: var(--success)" id="approved-count">0</div>
          </div>
          <div class="stat-cell">
            <div class="stat-label">Revision</div>
            <div class="stat-value" style="color: var(--warning)" id="revision-count">0</div>
          </div>
          <div class="stat-cell">
            <div class="stat-label">Rejected</div>
            <div class="stat-value" style="color: var(--error)" id="rejected-count">0</div>
          </div>
        </div>
        <div class="queue-progress">
          <div class="queue-progress-copy">
            <span>Review Progress</span>
            <strong id="review-progress-copy">0 of 0 reviewed</strong>
          </div>
          <div class="queue-progress-track">
            <div class="queue-progress-fill" id="review-progress-fill"></div>
          </div>
        </div>
        <div class="filters">
          <div class="filter-row" id="category-filters">
            <button class="filter-pill active" data-filter="all">All</button>
            <button class="filter-pill" data-filter="product">Products</button>
            <button class="filter-pill" data-filter="visuals">Visuals</button>
            <button class="filter-pill" data-filter="notebooklm">NotebookLM</button>
            <button class="filter-pill" data-filter="dashboard">Dashboard</button>
          </div>
          <div class="filter-row" id="queue-mode-filters">
            <button class="filter-pill active" data-queue-mode="active">Active</button>
            <button class="filter-pill" data-queue-mode="hold">Hold</button>
            <button class="filter-pill" data-queue-mode="approved">Approved</button>
            <button class="filter-pill" data-queue-mode="all">All</button>
          </div>
          <input id="search-input" class="search-input" type="search" placeholder="Search review items">
        </div>
        <div id="queue-list" class="queue-list"></div>
      </section>

      <section class="panel preview-panel">
        <div class="preview-toolbar">
          <div>
            <div class="panel-title" id="preview-title">Select a review item</div>
            <div class="panel-subtle" id="preview-subtitle">Images render inline. PDFs and HTML render in-place.</div>
          </div>
          <div class="preview-toolbar-actions">
            <a id="open-preview-link" class="preview-link hidden" href="#" target="_blank" rel="noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Raw</a>
            <div class="panel-subtle" id="sync-status">Sync unknown</div>
          </div>
        </div>
        <div id="preview-context-bar" class="preview-context-bar">
          <div id="preview-context-grid" class="preview-context-grid"></div>
          <div class="preview-context-actions">
            <button id="paired-visual-button" class="context-visual" type="button" style="display:none;">
              <span class="context-visual-title" id="paired-visual-title">No paired visual</span>
              <span class="context-visual-copy" id="paired-visual-copy">No clickable preview available.</span>
            </button>
            <button id="copy-post-button" class="context-button" type="button" disabled>Copy post text</button>
            <button id="copy-thread-button" class="context-button" type="button" disabled>Copy thread</button>
          </div>
        </div>
        <div class="preview-canvas">
          <div id="preview-surface" class="preview-inner">
            <div class="empty-preview">
              <i class="fa-regular fa-image"></i>
              <div>
                <div class="panel-title">Select an item to preview</div>
                <div class="panel-subtle">Move through the queue with arrow keys or click any item on the left.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside id="inspector-panel" class="panel inspector-panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Decisions</div>
            <div class="panel-subtle">Structured feedback for Forge</div>
          </div>
          <button class="mobile-inspector-toggle" id="mobile-inspector-close">Close</button>
        </div>
        <div class="inspector-content">
          <div class="stack">
            <div>
              <h1 class="item-title" id="item-title">No item selected</h1>
              <div id="item-badges" class="queue-meta"></div>
            </div>
            <div class="meta-grid" id="item-meta"></div>
          </div>

          <div class="auth-card">
            <div class="token-wrap">
              <label for="auth-token">Reviewer Token</label>
              <input id="auth-token" type="password" autocomplete="off" placeholder="Bearer token">
            </div>
          </div>

          <div class="section-block stack">
            <div class="section-heading">Decision</div>
            <div class="decision-tabs">
              <button class="decision-tab" data-decision="approve"><span><i class="fa-solid fa-check"></i> Approve</span></button>
              <button class="decision-tab active" data-decision="needs_revision"><span><i class="fa-solid fa-rotate-left"></i> Needs Revision</span></button>
              <button class="decision-tab" data-decision="reject"><span><i class="fa-solid fa-xmark"></i> Reject</span></button>
            </div>
          </div>

          <div class="stack">
            <div class="section-heading">Issue Tags</div>
            <div id="issue-tags" class="tag-grid"></div>
          </div>

          <div class="stack">
            <div class="section-heading">Reviewer Notes</div>
            <textarea id="comment-box" class="comment-box" placeholder="Add notes for Forge..."></textarea>
          </div>

          <div class="stack">
            <div class="decision-summary" id="decision-summary"><i class="fa-solid fa-circle"></i> Selected: Needs Revision</div>
            <button id="submit-button" class="action-button action-revision"><i class="fa-solid fa-paper-plane"></i> Submit Needs Revision</button>
          </div>

          <div class="section-block stack">
            <div class="section-heading">Revision History</div>
            <div id="history-list" class="history-list"></div>
          </div>

          <div class="section-block stack" id="variants-section" style="display:none;">
            <div class="section-heading">Variants</div>
            <div id="variants-list" class="history-list"></div>
          </div>

          <div class="metadata-box" id="metadata-box">
            <button class="metadata-header" id="metadata-toggle">
              <span>Metadata</span>
              <i class="fa-solid fa-chevron-down"></i>
            </button>
            <div class="metadata-content">
              <pre id="metadata-pre" class="metadata-pre">{}</pre>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <footer class="analytics-strip">
      <div id="analytics-inline" class="analytics-inline"></div>
      <div id="analytics-summary" class="analytics-summary"></div>
      <button id="analytics-toggle" class="analytics-toggle">Show Analytics</button>
    </footer>

    <section id="analytics-drawer" class="analytics-drawer">
      <div id="analytics-grid" class="analytics-grid"></div>
    </section>
  </div>

  <script>
    const ISSUE_TAGS = {
      needs_revision: ['layout', 'design', 'branding', 'copy', 'clarity', 'formatting', 'dimensions', 'missing_content', 'accuracy', 'typography', 'whitespace'],
      reject: ['wrong_approach', 'off_strategy', 'low_value', 'wrong_format', 'duplicate', 'not_reviewable', 'hallucinated', 'wrong_audience', 'ai_slop'],
      approve: [],
    };

    const DECISION_META = {
      approve: {
        label: 'Approve',
        submitLabel: 'Submit Approval',
        icon: 'fa-check',
        className: 'action-approve',
      },
      needs_revision: {
        label: 'Needs Revision',
        submitLabel: 'Submit Revision Notes',
        icon: 'fa-pen',
        className: 'action-revision',
      },
      reject: {
        label: 'Reject',
        submitLabel: 'Submit Rejection',
        icon: 'fa-xmark',
        className: 'action-reject',
      },
    };

    const app = {
      state: null,
      items: [],
      metadata: {},
      filteredItems: [],
      selectedItemId: null,
      selectedDecision: 'needs_revision',
      selectedIssues: new Set(),
      historyByItem: new Map(),
      analytics: null,
      filter: 'all',
      queueMode: 'active',
      search: '',
      fetchStartedAt: Date.now(),
      selectedAt: 0,
      submitting: false,
    };

    const LIVE_REFRESH_INTERVAL_MS = 60000;

    function escapeHtml(value) {
      return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function formatDate(value) {
      if (!value) return '--';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '--';
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    }

    function formatBytes(bytes) {
      const value = Number(bytes || 0);
      if (!value) return '--';
      const units = ['B', 'KB', 'MB', 'GB'];
      let amount = value;
      let unitIndex = 0;
      while (amount >= 1024 && unitIndex < units.length - 1) {
        amount /= 1024;
        unitIndex += 1;
      }
      return amount.toFixed(amount >= 10 || unitIndex === 0 ? 0 : 1) + ' ' + units[unitIndex];
    }

    function wait(ms) {
      return new Promise((resolve) => window.setTimeout(resolve, ms));
    }

    function renderHeartbeatBars() {
      const strip = document.getElementById('topbar-heartbeat');
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
      const blocked = queueTasks.some((task) => String(task.status || '').toUpperCase() === 'BLOCKED');
      if (sessions.length) {
        return 'active';
      }
      if (blocked) {
        return 'blocked';
      }
      return state && state.system && state.system.status === 'online' ? 'online' : 'offline';
    }

    function updateTopbarPulse() {
      const strip = document.getElementById('topbar-heartbeat');
      if (!strip) {
        return;
      }
      const posture = classifySystemState(app.state);
      strip.classList.remove('active', 'blocked');
      if (posture === 'active') {
        strip.classList.add('active');
      } else if (posture === 'blocked') {
        strip.classList.add('blocked');
      }
    }

    function flashPreview(decision) {
      const canvas = document.querySelector('.preview-canvas');
      if (!canvas) {
        return;
      }
      canvas.classList.remove('flash-approve', 'flash-needs_revision', 'flash-reject');
      void canvas.offsetWidth;
      canvas.classList.add('flash-' + decision);
      window.setTimeout(() => {
        canvas.classList.remove('flash-approve', 'flash-needs_revision', 'flash-reject');
      }, 420);
    }

    async function animateAdvance(decision, nextId) {
      const surface = document.getElementById('preview-surface');
      const outClass = decision === 'reject' ? 'advance-out-right' : 'advance-out-left';
      const inClass = decision === 'reject' ? 'advance-in-left' : 'advance-in-right';

      if (surface) {
        surface.classList.remove('advance-out-left', 'advance-out-right', 'advance-in-left', 'advance-in-right');
        surface.classList.add(outClass);
      }

      const activeQueueItem = document.querySelector('.queue-item.active');
      if (activeQueueItem) {
        activeQueueItem.classList.add('resolved');
      }

      await wait(190);

      if (surface) {
        surface.classList.remove(outClass);
      }

      selectItem(nextId);

      const nextSurface = document.getElementById('preview-surface');
      if (nextSurface) {
        nextSurface.classList.add(inClass);
        window.setTimeout(() => {
          nextSurface.classList.remove(inClass);
        }, 260);
      }
    }

    function debounce(fn, delay) {
      let timer = null;
      return (...args) => {
        clearTimeout(timer);
        timer = window.setTimeout(() => fn(...args), delay);
      };
    }

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

    let layoutFrame = 0;

    function syncWorkspaceHeight() {
      if (layoutFrame) {
        window.cancelAnimationFrame(layoutFrame);
      }

      layoutFrame = window.requestAnimationFrame(() => {
        layoutFrame = 0;

        const grid = document.querySelector('.main-grid');
        if (!grid) {
          return;
        }

        if (window.innerWidth <= 1240) {
          grid.style.height = '';
          grid.style.minHeight = '';
          grid.style.maxHeight = '';
          return;
        }

        const inspectorPanel = document.getElementById('inspector-panel');
        const metadataToggle = document.getElementById('metadata-toggle');
        const queuePanel = document.querySelector('.queue-panel');
        const queueList = document.getElementById('queue-list');
        if (!inspectorPanel || !metadataToggle || !queuePanel || !queueList) {
          return;
        }

        const inspectorRect = inspectorPanel.getBoundingClientRect();
        const metadataRect = metadataToggle.getBoundingClientRect();
        const metadataTarget = Math.ceil(metadataRect.bottom - inspectorRect.top + 18);

        const queueRect = queuePanel.getBoundingClientRect();
        const listRect = queueList.getBoundingClientRect();
        const queueChrome = Math.max(0, listRect.top - queueRect.top) + Math.max(0, queueRect.bottom - listRect.bottom);
        const firstQueueItem = queueList.querySelector('.queue-item');
        const queueRowHeight = firstQueueItem ? firstQueueItem.getBoundingClientRect().height : 56;
        const queueTarget = Math.ceil(queueChrome + (queueRowHeight * 16.75));

        const nextHeight = Math.max(880, metadataTarget, queueTarget);
        grid.style.height = nextHeight + 'px';
        grid.style.minHeight = nextHeight + 'px';
        grid.style.maxHeight = nextHeight + 'px';
      });
    }

    function authToken() {
      return document.getElementById('auth-token').value.trim();
    }

    function persistToken(value) {
      window.localStorage.setItem('forge-review-token', value);
    }

    function currentItem() {
      return app.filteredItems.find((item) => item.id === app.selectedItemId) || app.items.find((item) => item.id === app.selectedItemId) || null;
    }

    function metadataForItem(item) {
      if (!item) return {};
      return app.metadata[item.id] || item.metadata || {};
    }

    function frontmatterForItem(item) {
      const metadata = metadataForItem(item);
      return metadata.__frontmatter__ && metadata.__frontmatter__.content ? metadata.__frontmatter__.content : {};
    }

    function markdownBodyForItem(item) {
      const metadata = metadataForItem(item);
      return metadata.__markdown_body__ && typeof metadata.__markdown_body__.content === 'string'
        ? metadata.__markdown_body__.content
        : '';
    }

    function normalizeWhitespace(value) {
      return String(value || '').replace(/\\r/g, '').trim();
    }

    function markdownSections(body) {
      const text = normalizeWhitespace(body);
      if (!text) {
        return { single: '', thread: '' };
      }

      const sectionPattern = /^#{1,6}\\s+(.+)$/gm;
      const sections = [];
      let match;
      let lastIndex = 0;
      let lastHeading = '';

      while ((match = sectionPattern.exec(text))) {
        if (lastHeading || lastIndex > 0) {
          sections.push({
            heading: lastHeading,
            content: text.slice(lastIndex, match.index).trim(),
          });
        }
        lastHeading = match[1].trim();
        lastIndex = sectionPattern.lastIndex;
      }

      sections.push({
        heading: lastHeading,
        content: text.slice(lastIndex).trim(),
      });

      const singleSection = sections.find((section) => /forge single|single/.test(section.heading.toLowerCase()));
      const threadSection = sections.find((section) => /thread/.test(section.heading.toLowerCase()));

      if (singleSection || threadSection) {
        return {
          single: singleSection ? normalizeWhitespace(singleSection.content) : '',
          thread: threadSection ? normalizeWhitespace(threadSection.content) : '',
        };
      }

      if (text.includes('[Thread]')) {
        const parts = text.split('[Thread]');
        return {
          single: normalizeWhitespace(parts[0]),
          thread: normalizeWhitespace(parts.slice(1).join('[Thread]')),
        };
      }

      return { single: text, thread: '' };
    }

    function targetAccountForItem(item, frontmatter) {
      return frontmatter.target_account || frontmatter.account || (String(item && item.path || '').includes('lucas') ? '@LucasJOliver_78' : '@Forge_Builds');
    }

    function launchDayForItem(frontmatter) {
      return frontmatter.launch_day || frontmatter.post_day || 'Needs scheduling';
    }

    function pairedVisualForItem(frontmatter) {
      const filename = frontmatter.pairs_with_card;
      if (!filename) return null;
      return app.items.find((entry) => String(entry.path || '').endsWith('/' + filename) || String(entry.path || '').endsWith(filename)) || null;
    }

    async function copyToClipboard(text, button, defaultLabel, successLabel) {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        if (button) {
          button.textContent = successLabel;
          window.setTimeout(() => {
            button.textContent = defaultLabel;
          }, 1400);
        }
      } catch (error) {
        if (button) {
          button.textContent = 'Clipboard blocked';
          window.setTimeout(() => {
            button.textContent = defaultLabel;
          }, 1400);
        }
      }
    }

    function itemIcon(item) {
      const type = String(item.type || '').toLowerCase();
      if (type === 'pdf') return 'fa-file-pdf';
      if (['png', 'jpg', 'jpeg', 'webp'].includes(type)) return 'fa-file-image';
      if (type === 'html') return 'fa-globe';
      return 'fa-file';
    }

    function statusClass(decision) {
      if (decision === 'approve') return 'status-approve';
      if (decision === 'reject') return 'status-reject';
      return 'status-needs_revision';
    }

    function queueModeLabel(mode) {
      if (mode === 'hold') return 'hold items';
      if (mode === 'approved') return 'approved items';
      if (mode === 'all') return 'items';
      return 'active items';
    }

    function queueItemsForScope() {
      return app.items
        .filter((item) => app.filter === 'all' || (item.artifact_category || item.category) === app.filter)
        .filter((item) => {
          const haystack = [item.name, item.path, item.artifact_category, item.type].join(' ').toLowerCase();
          return !app.search || haystack.includes(app.search);
        });
    }

    function queueItemsForView() {
      return queueItemsForScope()
        .filter((item) => {
          if (app.queueMode === 'hold') {
            return item.current_decision === 'needs_revision' || item.current_decision === 'reject';
          }
          if (app.queueMode === 'approved') {
            return item.current_decision === 'approve';
          }
          if (app.queueMode === 'all') {
            return true;
          }
          return !item.current_decision;
        })
        .sort((left, right) => {
          if (app.queueMode === 'hold') {
            const leftPriority = left.current_decision === 'needs_revision' ? 0 : 1;
            const rightPriority = right.current_decision === 'needs_revision' ? 0 : 1;
            if (leftPriority !== rightPriority) return leftPriority - rightPriority;
          }
          if (app.queueMode === 'all') {
            const leftPending = !left.current_decision;
            const rightPending = !right.current_decision;
            if (leftPending !== rightPending) return leftPending ? -1 : 1;
          }
          return String(right.modified_at || right.created_at || '').localeCompare(String(left.modified_at || left.created_at || ''));
        });
    }

    function ensureSelection() {
      app.filteredItems = queueItemsForView();
      if (!app.filteredItems.length) {
        app.selectedItemId = null;
        return;
      }

      if (!app.selectedItemId || !app.filteredItems.some((item) => item.id === app.selectedItemId)) {
        app.selectedItemId = app.filteredItems[0].id;
      }

      app.selectedAt = performance.now();
    }

    function renderQueue() {
      ensureSelection();
      const root = document.getElementById('queue-list');
      const items = app.filteredItems;
      const scopedItems = queueItemsForScope();
      const stats = app.state && app.state.reviews && app.state.reviews.stats ? app.state.reviews.stats : {};
      const collapsed = Number(stats.collapsed_variants || 0);
      document.getElementById('queue-count').textContent = items.length + ' ' + queueModeLabel(app.queueMode) + ' in current view' + (collapsed ? ' -- ' + collapsed + ' variants collapsed' : '');
      const reviewed = scopedItems.filter((item) => Boolean(item.current_decision)).length;
      const total = Math.max(scopedItems.length, 1);
      document.getElementById('review-progress-copy').textContent = reviewed + ' of ' + scopedItems.length + ' reviewed';
      document.getElementById('review-progress-fill').style.width = Math.round((reviewed / total) * 100) + '%';

      if (!items.length) {
        const emptyTitle = app.queueMode === 'hold'
          ? 'Hold lane is clear'
          : app.queueMode === 'approved'
            ? 'No approved items in this slice'
            : app.queueMode === 'all'
              ? 'No matching artifacts'
              : 'Active queue is clear';
        const emptyCopy = app.queueMode === 'hold'
          ? 'Nothing is currently waiting on agent fixes in this filtered view.'
          : app.queueMode === 'approved'
            ? 'Nothing approved matches the current filters.'
            : app.queueMode === 'all'
              ? 'Adjust filters or wait for the next sync.'
              : 'Everything in this filtered lane has already been decided.';
        root.innerHTML = '<div class="empty-preview" style="min-height: 240px;"><i class="fa-regular fa-folder-open"></i><div><div class="panel-title">' + emptyTitle + '</div><div class="panel-subtle">' + emptyCopy + '</div></div></div>';
        return;
      }

      root.innerHTML = items.map((item) => {
        const badge = item.revision_count > 0 ? '<span class="revision-pill">v' + escapeHtml(item.revision_count) + '</span>' : '';
        const thumb = item.preview_type === 'inline' && item.preview_data
          ? '<span class="queue-thumb"><img src="' + item.preview_data + '" alt=""></span>'
          : '<span class="queue-icon"><i class="fa-solid ' + itemIcon(item) + '"></i></span>';

        return '<button class="queue-item ' + (item.id === app.selectedItemId ? 'active' : '') + '" data-item-id="' + escapeHtml(item.id) + '">' +
          thumb +
          '<span>' +
            '<div class="queue-name">' + escapeHtml(item.name || item.path || 'Unnamed artifact') + '</div>' +
            '<div class="queue-meta">' +
              '<span class="tiny-badge">' + escapeHtml(item.artifact_category || item.category || 'artifact') + '</span>' +
              '<span class="tiny-badge">' + escapeHtml(item.type || 'file') + '</span>' +
            '</div>' +
          '</span>' +
          '<span style="display:grid;justify-items:end;gap:8px;">' +
            '<span class="status-dot ' + statusClass(item.current_decision) + '"></span>' +
            badge +
          '</span>' +
        '</button>';
      }).join('');

      syncWorkspaceHeight();
    }

    function renderPreview() {
      const item = currentItem();
      const surface = document.getElementById('preview-surface');
      const title = document.getElementById('preview-title');
      const subtitle = document.getElementById('preview-subtitle');
      const openLink = document.getElementById('open-preview-link');

      function setOpenLink(url) {
        if (!url) {
          openLink.href = '#';
          openLink.classList.add('hidden');
          return;
        }
        openLink.href = url;
        openLink.classList.remove('hidden');
      }

      if (!item) {
        title.textContent = 'Select a review item';
        subtitle.textContent = 'Images render inline. PDFs and HTML render in-place.';
        setOpenLink(null);
        surface.innerHTML = '<div class="empty-preview"><i class="fa-regular fa-image"></i><div><div class="panel-title">Select an item to preview</div><div class="panel-subtle">Move through the queue with arrow keys or click any item on the left.</div></div></div>';
        return;
      }

      title.textContent = item.name || item.path || 'Review Item';
      subtitle.textContent = item.path || 'No path';
      setOpenLink(item.preview_url || null);

      if (item.preview_type === 'inline' && item.preview_data) {
        surface.innerHTML = '<img class="preview-image" src="' + item.preview_data + '" alt="' + escapeHtml(item.name || 'Preview') + '">';
        return;
      }

      if (item.preview_type === 'kv' && item.preview_url) {
        surface.innerHTML = '<img class="preview-image" src="' + item.preview_url + '" alt="' + escapeHtml(item.name || 'Preview') + '">';
        return;
      }

      if (item.preview_type === 'iframe' && item.preview_url) {
        if (item.type === 'pdf') {
          surface.innerHTML = '<iframe class="preview-frame" src="' + item.preview_url + '#view=FitH"></iframe>';
        } else {
          surface.innerHTML = '<iframe class="preview-frame" sandbox="allow-scripts" src="' + item.preview_url + '"></iframe>';
        }
        return;
      }

      if (item.previewable && item.preview_url) {
        if (item.type === 'pdf') {
          surface.innerHTML = '<iframe class="preview-frame" src="' + item.preview_url + '#view=FitH"></iframe>';
        } else {
          surface.innerHTML = '<iframe class="preview-frame" sandbox="allow-scripts" src="' + item.preview_url + '"></iframe>';
        }
        return;
      }

      surface.innerHTML = '<div class="empty-preview"><i class="fa-solid ' + itemIcon(item) + '"></i><div><div class="panel-title">Preview unavailable</div><div class="panel-subtle">' + escapeHtml(item.path || 'No path') + '</div><div class="panel-subtle">File size: ' + escapeHtml(formatBytes(item.artifact_size_bytes)) + '</div></div></div>';
    }

    function renderInspector() {
      const item = currentItem();
      const previewPanel = document.querySelector('.preview-panel');
      document.getElementById('inspector-panel').dataset.decision = app.selectedDecision;
      document.getElementById('item-title').textContent = item ? (item.name || item.path || 'Unnamed artifact') : 'No item selected';

      const badges = document.getElementById('item-badges');
      if (!item) {
        if (previewPanel) previewPanel.classList.remove('has-context');
        badges.innerHTML = '';
        document.getElementById('item-meta').innerHTML = '';
        document.getElementById('preview-context-bar').classList.remove('active');
        document.getElementById('preview-context-grid').innerHTML = '';
        document.getElementById('paired-visual-button').style.display = 'none';
        document.getElementById('copy-post-button').disabled = true;
        document.getElementById('copy-thread-button').disabled = true;
        document.getElementById('metadata-pre').textContent = '{}';
        document.getElementById('history-list').innerHTML = '<div class="panel-subtle">No revision history yet.</div>';
        document.getElementById('variants-section').style.display = 'none';
        document.getElementById('variants-list').innerHTML = '';
        renderIssueTags();
        renderSubmitButton();
        return;
      }

      badges.innerHTML = [
        '<span class="tiny-badge">' + escapeHtml(item.artifact_category || item.category || 'artifact') + '</span>',
        '<span class="tiny-badge">' + escapeHtml(item.type || 'file') + '</span>',
        '<span class="tiny-badge">' + escapeHtml(item.current_decision || 'pending') + '</span>',
        item.revision_count > 0 ? '<span class="revision-pill">v' + escapeHtml(item.revision_count) + '</span>' : ''
      ].filter(Boolean).join('');

      document.getElementById('item-meta').innerHTML = [
        ['Size', formatBytes(item.artifact_size_bytes)],
        ['Created', formatDate(item.created_at)],
        ['Modified', formatDate(item.modified_at)],
        ['Synced', formatDate(app.state && app.state.lastUpdated)],
      ].map(([label, value]) => '<div class="meta-row"><span>' + escapeHtml(label) + '</span><span>' + escapeHtml(value) + '</span></div>').join('');

      const frontmatter = frontmatterForItem(item);
      const markdownBody = markdownBodyForItem(item);
      const sections = markdownSections(markdownBody);
      const isPostCopy = item.review_content_type === 'post-copy' || item.review_content_type === 'gumroad-copy' || String(item.path || '').includes('post-copy/');
      const pairedVisual = pairedVisualForItem(frontmatter);
      const contextBar = document.getElementById('preview-context-bar');
      const contextGrid = document.getElementById('preview-context-grid');
      const pairedVisualButton = document.getElementById('paired-visual-button');
      const pairedVisualTitle = document.getElementById('paired-visual-title');
      const pairedVisualCopy = document.getElementById('paired-visual-copy');
      const copyPostButton = document.getElementById('copy-post-button');
      const copyThreadButton = document.getElementById('copy-thread-button');

      if (isPostCopy) {
        if (previewPanel) previewPanel.classList.add('has-context');
        contextBar.classList.add('active');
        contextGrid.innerHTML = [
          ['Target account', targetAccountForItem(item, frontmatter)],
          ['Launch slot', launchDayForItem(frontmatter)],
          ['Pairing', frontmatter.pairs_with_card || 'No visual linked yet'],
        ].map(([label, value]) => '<div class="preview-context-chip"><span>' + escapeHtml(label) + '</span><span>' + escapeHtml(value) + '</span></div>').join('');

        if (pairedVisual) {
          pairedVisualButton.style.display = 'grid';
          pairedVisualButton.dataset.itemId = pairedVisual.id;
          pairedVisualTitle.textContent = pairedVisual.name || frontmatter.pairs_with_card;
          pairedVisualCopy.textContent = 'Open the paired visual in the review queue.';
        } else if (frontmatter.pairs_with_card) {
          pairedVisualButton.style.display = 'grid';
          pairedVisualButton.dataset.itemId = '';
          pairedVisualTitle.textContent = frontmatter.pairs_with_card;
          pairedVisualCopy.textContent = 'Paired visual metadata exists, but the matching review item is not loaded yet.';
        } else {
          pairedVisualButton.style.display = 'none';
          pairedVisualButton.dataset.itemId = '';
        }

        copyPostButton.disabled = !sections.single;
        copyThreadButton.disabled = !sections.thread;
        copyPostButton.dataset.copy = sections.single || '';
        copyThreadButton.dataset.copy = sections.thread || '';
      } else {
        if (previewPanel) previewPanel.classList.remove('has-context');
        contextBar.classList.remove('active');
        contextGrid.innerHTML = '';
        pairedVisualButton.style.display = 'none';
        pairedVisualButton.dataset.itemId = '';
        copyPostButton.disabled = true;
        copyThreadButton.disabled = true;
        copyPostButton.dataset.copy = '';
        copyThreadButton.dataset.copy = '';
      }

      const metadata = {
        path: item.path || null,
        task_id: item.task_id || null,
        session_id: item.session_id || null,
        model_used: item.model_used || null,
        artifact_hash: item.artifact_hash || null,
        artifact_dimensions: item.artifact_dimensions || null,
        metadata: app.metadata[item.id] || item.metadata || {},
      };
      document.getElementById('metadata-pre').textContent = JSON.stringify(metadata, null, 2);

      const history = app.historyByItem.get(item.id) || [];
      document.getElementById('history-list').innerHTML = history.length
        ? history.map((event) => {
            const issues = Array.isArray(event.issues) && event.issues.length ? 'Issues: ' + event.issues.join(', ') : 'No issue tags';
            const comment = event.comment ? escapeHtml(event.comment) : 'No comment provided.';
            return '<article class="history-item">' +
              '<div class="history-title"><span>v' + escapeHtml(event.revision_number || 0) + ' -- ' + escapeHtml(event.decision) + '</span><span>' + escapeHtml(formatDate(event.reviewed_at)) + '</span></div>' +
              '<div class="history-meta">' + escapeHtml(issues) + '</div>' +
              '<div class="history-comment">' + comment + '</div>' +
            '</article>';
          }).join('')
        : '<div class="panel-subtle">No revision history yet.</div>';

      const variants = [
        ...(Array.isArray(item.variant_paths) ? item.variant_paths.map((variantPath, index) => ({
          path: variantPath,
          type: Array.isArray(item.variant_types) ? item.variant_types[index] || 'variant' : 'variant',
          source: 'variant',
        })) : []),
        ...(Array.isArray(item.duplicate_paths) ? item.duplicate_paths.map((duplicatePath) => ({
          path: duplicatePath,
          type: 'duplicate',
          source: 'duplicate',
        })) : []),
      ];

      if (variants.length) {
        document.getElementById('variants-section').style.display = 'grid';
        document.getElementById('variants-list').innerHTML = variants.map((variant) =>
          '<article class="history-item">' +
            '<div class="history-title"><span>' + escapeHtml(variant.source === 'duplicate' ? 'Duplicate hidden' : 'Variant hidden') + '</span><span>' + escapeHtml(variant.type) + '</span></div>' +
            '<div class="history-comment">' + escapeHtml(variant.path) + '</div>' +
          '</article>'
        ).join('');
      } else {
        document.getElementById('variants-section').style.display = 'none';
        document.getElementById('variants-list').innerHTML = '';
      }

      renderIssueTags();
      renderSubmitButton();
      syncWorkspaceHeight();
    }

    function renderIssueTags() {
      const tags = ISSUE_TAGS[app.selectedDecision] || [];
      const root = document.getElementById('issue-tags');
      if (!tags.length) {
        root.innerHTML = '<div class="panel-subtle">No tags required for approval.</div>';
        return;
      }

      root.innerHTML = tags.map((tag) => '<button class="tag-pill ' + (app.selectedIssues.has(tag) ? 'selected' : '') + '" data-tag="' + escapeHtml(tag) + '">' + escapeHtml(tag.replace(/_/g, ' ')) + '</button>').join('');
    }

    function renderSubmitButton() {
      const button = document.getElementById('submit-button');
      const summary = document.getElementById('decision-summary');
      const meta = DECISION_META[app.selectedDecision] || DECISION_META.needs_revision;
      const item = currentItem();

      document.getElementById('inspector-panel').dataset.decision = app.selectedDecision;
      button.className = 'action-button ' + meta.className;
      button.innerHTML = '<i class="fa-solid fa-paper-plane"></i> ' + meta.submitLabel;
      button.disabled = !item || app.submitting;
      summary.innerHTML = '<i class="fa-solid ' + meta.icon + '"></i> Selected: ' + meta.label;
    }

    function renderDecisionTabs() {
      Array.from(document.querySelectorAll('.decision-tab')).forEach((button) => {
        button.classList.toggle('active', button.dataset.decision === app.selectedDecision);
      });
      renderSubmitButton();
    }

    function setSelectedDecision(decision) {
      app.selectedDecision = decision;
      app.selectedIssues = new Set();
      renderDecisionTabs();
      renderIssueTags();
    }

    function renderStats() {
      const items = app.items;
      const pending = items.filter((item) => !item.current_decision).length;
      const approved = items.filter((item) => item.current_decision === 'approve').length;
      const revision = items.filter((item) => item.current_decision === 'needs_revision').length;
      const rejected = items.filter((item) => item.current_decision === 'reject').length;
      document.getElementById('pending-count').textContent = String(pending);
      document.getElementById('approved-count').textContent = String(approved);
      document.getElementById('revision-count').textContent = String(revision);
      document.getElementById('rejected-count').textContent = String(rejected);
    }

    function renderAnalytics() {
      const analytics = app.analytics;
      const inline = document.getElementById('analytics-inline');
      const summary = document.getElementById('analytics-summary');
      const grid = document.getElementById('analytics-grid');

      if (!analytics) {
        inline.innerHTML = '<span class="analytics-chip">Analytics unavailable</span>';
        summary.innerHTML = '';
        grid.innerHTML = '';
        return;
      }

      const decisions = analytics.decision_distribution || {};
      inline.innerHTML = [
        ['Approve', decisions.approve || 0],
        ['Revision', decisions.needs_revision || 0],
        ['Reject', decisions.reject || 0],
        ['Backlog', analytics.throughput ? analytics.throughput.backlog : 0],
      ].map(([label, value]) => '<span class="analytics-chip">' + escapeHtml(label) + ': <strong>' + escapeHtml(value) + '</strong></span>').join('');

      summary.innerHTML = [
        'First-pass approval: ' + escapeHtml((analytics.revision_depth && analytics.revision_depth.first_pass_approval_pct || 0) + '%'),
        'Avg revisions: ' + escapeHtml(analytics.revision_depth ? analytics.revision_depth.avg_revisions : 0),
        'Reviewed today: ' + escapeHtml(analytics.throughput ? analytics.throughput.reviewed_today : 0),
      ].map((value) => '<span>' + value + '</span>').join('');

      grid.innerHTML = [
        analyticsCard('Issue Frequency', issueFrequencyMarkup(analytics.issue_frequency || [])),
        analyticsCard('Category Performance', categoryPerformanceMarkup(analytics.category_performance || [])),
        analyticsCard('Model Performance', modelPerformanceMarkup(analytics.model_performance || [])),
      ].join('');
    }

    function analyticsCard(title, body) {
      return '<section class="analytics-card"><h3>' + escapeHtml(title) + '</h3>' + body + '</section>';
    }

    function issueFrequencyMarkup(rows) {
      if (!rows.length) return '<div class="panel-subtle">No review data yet.</div>';
      const max = Math.max(...rows.map((row) => Number(row.count || 0)), 1);
      return '<div class="bar-list">' + rows.slice(0, 8).map((row) => {
        const width = Math.max(8, Math.round((Number(row.count || 0) / max) * 100));
        return '<div class="bar-row"><div class="metric-row"><span>' + escapeHtml(row.tag.replace(/_/g, ' ')) + '</span><strong>' + escapeHtml(row.count) + '</strong></div><div class="bar-line"><div class="bar-fill" style="width:' + width + '%"></div></div></div>';
      }).join('') + '</div>';
    }

    function categoryPerformanceMarkup(rows) {
      if (!rows.length) return '<div class="panel-subtle">No category data yet.</div>';
      return '<div class="metric-list">' + rows.slice(0, 6).map((row) =>
        '<div class="metric-row"><span>' + escapeHtml(row.category) + '</span><span>' +
        escapeHtml(row.total) + ' total -- ' +
        escapeHtml(row.approved) + ' approved -- ' +
        escapeHtml(row.revision_rate) + '% revision</span></div>'
      ).join('') + '</div>';
    }

    function modelPerformanceMarkup(rows) {
      if (!rows.length) return '<div class="panel-subtle">No model data yet.</div>';
      return '<div class="metric-list">' + rows.slice(0, 6).map((row) =>
        '<div class="metric-row"><span>' + escapeHtml(row.model) + '</span><span>' +
        escapeHtml(row.approval_rate) + '% approval -- ' +
        escapeHtml(row.avg_revision_count) + ' avg revisions</span></div>'
      ).join('') + '</div>';
    }

    async function fetchState() {
      const response = await liveFetch('/api/state');
      if (!response.ok) throw new Error('Unable to load review state');
      const payload = await response.json();
      if (payload && payload.status === 'no data yet') {
        app.state = { lastUpdated: null };
        app.items = [];
        app.metadata = {};
      } else {
        app.state = payload;
        app.items = Array.isArray(payload.reviews && payload.reviews.items) ? payload.reviews.items : [];
        app.metadata = payload.reviews && payload.reviews.metadata ? payload.reviews.metadata : {};
      }
      renderStats();
      renderQueue();
      renderPreview();
      renderInspector();
      updateSyncStatus();
    }

    async function fetchAnalytics() {
      const response = await liveFetch('/api/analytics/summary');
      if (!response.ok) throw new Error('Unable to load analytics');
      const payload = await response.json();
      app.analytics = payload.analytics || null;
      renderAnalytics();
    }

    async function fetchHistory(itemId) {
      if (!itemId) return;
      const response = await liveFetch('/api/review-events?item_id=' + encodeURIComponent(itemId) + '&limit=20');
      if (!response.ok) return;
      const payload = await response.json();
      app.historyByItem.set(itemId, Array.isArray(payload.events) ? payload.events : []);
      if (currentItem() && currentItem().id === itemId) {
        renderInspector();
      }
    }

    async function refreshLiveData() {
      await Promise.all([fetchState(), fetchAnalytics()]);
      if (app.selectedItemId) {
        await fetchHistory(app.selectedItemId);
      }
    }

    function updateSyncStatus() {
      const updatedAt = app.state && app.state.lastUpdated ? new Date(app.state.lastUpdated) : null;
      if (!updatedAt || Number.isNaN(updatedAt.getTime())) {
        document.getElementById('sync-status').textContent = 'Sync unknown';
        document.getElementById('topbar-sync-chip').innerHTML = '<strong>Awaiting sync</strong>';
        return;
      }
      const ageMinutes = Math.floor((Date.now() - updatedAt.getTime()) / 60000);
      const syncText = ageMinutes > 5
        ? 'Last synced ' + ageMinutes + 'm ago'
        : 'Synced ' + ageMinutes + 'm ago';
      document.getElementById('sync-status').textContent = syncText;
      document.getElementById('topbar-sync-chip').innerHTML = '<strong>' + escapeHtml(syncText) + '</strong>';
      updateTopbarPulse();
    }

    function selectItem(itemId) {
      const item = app.items.find((entry) => entry.id === itemId) || null;
      app.selectedItemId = itemId;
      app.selectedAt = performance.now();
      app.selectedIssues = new Set();
      app.selectedDecision = item && item.current_decision ? item.current_decision : 'needs_revision';
      renderQueue();
      renderPreview();
      renderDecisionTabs();
      renderInspector();
      fetchHistory(itemId);
      if (window.innerWidth <= 900) {
        document.getElementById('inspector-panel').classList.add('open');
      }
    }

    function nextQueueItemId(currentItemId) {
      const items = queueItemsForView();
      if (!items.length) return null;
      if (items.length === 1) {
        return items[0].id === currentItemId ? null : items[0].id;
      }
      const index = items.findIndex((item) => item.id === currentItemId);
      if (index === -1) return items[0].id;
      return items[(index + 1) % items.length].id;
    }

    async function submitDecision(decision, button) {
      const item = currentItem();
      if (!item) return;
      const token = authToken();
      if (!token) {
        window.alert('Enter the dashboard token before submitting review decisions.');
        return;
      }

      app.submitting = true;
      renderSubmitButton();
      button.disabled = true;
      button.classList.add('confirmed');
      window.setTimeout(() => button.classList.remove('confirmed'), 220);

      const payload = {
        item_id: item.id,
        item_path: item.path,
        item_type: item.type,
        review_content_type: item.review_content_type || null,
        artifact_category: item.artifact_category || item.category,
        decision,
        issues: Array.from(app.selectedIssues),
        comment: document.getElementById('comment-box').value.trim(),
        reviewer: 'lucas',
        time_to_decision_seconds: Math.max(1, Math.round((performance.now() - app.selectedAt) / 1000)),
        artifact_size_bytes: item.artifact_size_bytes || 0,
        artifact_hash: item.artifact_hash || null,
        artifact_dimensions: item.artifact_dimensions || null,
        task_id: item.task_id || null,
        session_id: item.session_id || null,
        model_used: item.model_used || null,
        is_overwritten_revision: decision === 'needs_revision',
      };

      try {
        const response = await fetch('/api/review-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorPayload = await response.json().catch(() => ({ error: 'Failed to save review event' }));
          throw new Error(errorPayload.error || 'Failed to save review event');
        }

        const result = await response.json();
        const index = app.items.findIndex((entry) => entry.id === item.id);
        if (index >= 0) {
          app.items[index] = result.item;
        }
        const nextId = nextQueueItemId(item.id);
        document.getElementById('comment-box').value = '';
        app.selectedIssues = new Set();
        renderStats();
        await fetchHistory(item.id);
        await fetchAnalytics();
        flashSyncStatus(decision === 'approve' ? 'Approved' : (decision === 'reject' ? 'Rejected' : 'Marked for revision'));
        flashPreview(decision);

        if (nextId && nextId !== item.id) {
          await animateAdvance(decision, nextId);
        } else {
          app.selectedItemId = null;
          renderQueue();
          renderPreview();
          renderInspector();
        }
      } catch (error) {
        window.alert(error.message);
      } finally {
        app.submitting = false;
        renderSubmitButton();
        button.disabled = false;
      }
    }

    function updateClock() {
      document.getElementById('live-clock').textContent = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date()) + ' ET';
    }

    function flashSyncStatus(message) {
      const node = document.getElementById('sync-status');
      const previous = node.textContent;
      const topbarNode = document.getElementById('topbar-sync-chip');
      const topbarPrevious = topbarNode.innerHTML;
      node.textContent = message;
      topbarNode.innerHTML = '<strong>' + escapeHtml(message) + '</strong>';
      window.setTimeout(() => {
        node.textContent = previous;
        topbarNode.innerHTML = topbarPrevious;
      }, 1400);
    }

    function toggleAnalyticsDrawer() {
      const drawer = document.getElementById('analytics-drawer');
      const button = document.getElementById('analytics-toggle');
      drawer.classList.toggle('open');
      button.textContent = drawer.classList.contains('open') ? 'Hide Analytics' : 'Show Analytics';
      syncWorkspaceHeight();
    }

    function moveSelection(delta) {
      if (!app.filteredItems.length) return;
      const index = app.filteredItems.findIndex((item) => item.id === app.selectedItemId);
      const nextIndex = index === -1
        ? 0
        : (index + delta + app.filteredItems.length) % app.filteredItems.length;
      selectItem(app.filteredItems[nextIndex].id);
    }

    function bindEvents() {
      document.getElementById('auth-token').value = window.localStorage.getItem('forge-review-token') || '';
      document.getElementById('auth-token').addEventListener('input', (event) => persistToken(event.target.value));

      document.getElementById('category-filters').addEventListener('click', (event) => {
        const button = event.target.closest('[data-filter]');
        if (!button) return;
        app.filter = button.dataset.filter;
        Array.from(document.querySelectorAll('#category-filters .filter-pill')).forEach((node) => node.classList.toggle('active', node === button));
        renderQueue();
        renderPreview();
        renderInspector();
      });

      document.getElementById('queue-mode-filters').addEventListener('click', (event) => {
        const button = event.target.closest('[data-queue-mode]');
        if (!button) return;
        app.queueMode = button.dataset.queueMode || 'active';
        Array.from(document.querySelectorAll('#queue-mode-filters .filter-pill')).forEach((node) => node.classList.toggle('active', node === button));
        renderQueue();
        renderPreview();
        renderInspector();
      });

      document.getElementById('search-input').addEventListener('input', debounce((event) => {
        app.search = event.target.value.trim().toLowerCase();
        renderQueue();
        renderPreview();
        renderInspector();
      }, 200));

      document.getElementById('queue-list').addEventListener('click', (event) => {
        const itemButton = event.target.closest('[data-item-id]');
        if (!itemButton) return;
        selectItem(itemButton.dataset.itemId);
      });

      document.querySelector('.decision-tabs').addEventListener('click', (event) => {
        const button = event.target.closest('[data-decision]');
        if (!button) return;
        setSelectedDecision(button.dataset.decision);
      });

      document.getElementById('issue-tags').addEventListener('click', (event) => {
        const button = event.target.closest('[data-tag]');
        if (!button) return;
        const tag = button.dataset.tag;
        if (app.selectedIssues.has(tag)) {
          app.selectedIssues.delete(tag);
        } else {
          app.selectedIssues.add(tag);
        }
        renderIssueTags();
      });

      document.getElementById('submit-button').addEventListener('click', (event) => submitDecision(app.selectedDecision, event.currentTarget));
      document.getElementById('analytics-toggle').addEventListener('click', toggleAnalyticsDrawer);
      document.getElementById('metadata-toggle').addEventListener('click', () => {
        document.getElementById('metadata-box').classList.toggle('open');
        syncWorkspaceHeight();
      });
      document.getElementById('mobile-inspector-toggle').addEventListener('click', () => document.getElementById('inspector-panel').classList.add('open'));
      document.getElementById('mobile-inspector-close').addEventListener('click', () => document.getElementById('inspector-panel').classList.remove('open'));
      document.getElementById('copy-post-button').addEventListener('click', (event) => {
        copyToClipboard(event.currentTarget.dataset.copy || '', event.currentTarget, 'Copy post text', 'Post copied');
      });
      document.getElementById('copy-thread-button').addEventListener('click', (event) => {
        copyToClipboard(event.currentTarget.dataset.copy || '', event.currentTarget, 'Copy thread', 'Thread copied');
      });
      document.getElementById('paired-visual-button').addEventListener('click', (event) => {
        const itemId = event.currentTarget.dataset.itemId;
        if (!itemId) return;
        selectItem(itemId);
      });

      window.addEventListener('keydown', (event) => {
        const target = event.target;
        const editing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
        if (event.key === 'Escape') {
          if (editing) target.blur();
          document.getElementById('inspector-panel').classList.remove('open');
          return;
        }
        if (editing) return;

        if (event.key === 'ArrowDown' || event.key === 'j') {
          event.preventDefault();
          moveSelection(1);
        } else if (event.key === 'ArrowUp' || event.key === 'k') {
          event.preventDefault();
          moveSelection(-1);
        } else if (event.key === 'a') {
          event.preventDefault();
          setSelectedDecision('approve');
        } else if (event.key === 'n') {
          event.preventDefault();
          setSelectedDecision('needs_revision');
        } else if (event.key === 'r') {
          event.preventDefault();
          setSelectedDecision('reject');
        } else if (event.key === 'Enter' || event.key === 's') {
          if (!currentItem() || !authToken()) return;
          event.preventDefault();
          submitDecision(app.selectedDecision, document.getElementById('submit-button'));
        } else if (event.key === '/') {
          event.preventDefault();
          document.getElementById('search-input').focus();
        }
      });

      window.addEventListener('resize', debounce(syncWorkspaceHeight, 80));
    }

    async function boot() {
      renderHeartbeatBars();
      updateClock();
      window.setInterval(updateClock, 1000);
      bindEvents();

      document.getElementById('queue-list').innerHTML = '<div style="padding:16px;display:grid;gap:12px;">' +
        '<div class="skeleton" style="height:64px;"></div>' +
        '<div class="skeleton" style="height:64px;"></div>' +
        '<div class="skeleton" style="height:64px;"></div>' +
      '</div>';

      try {
        await refreshLiveData();
        syncWorkspaceHeight();
      } catch (error) {
        document.getElementById('queue-list').innerHTML = '<div class="empty-preview" style="min-height:240px;"><i class="fa-solid fa-triangle-exclamation"></i><div><div class="panel-title">Review data unavailable</div><div class="panel-subtle">' + escapeHtml(error.message) + '</div></div></div>';
      }
      window.setInterval(() => {
        refreshLiveData().catch(() => {});
      }, LIVE_REFRESH_INTERVAL_MS);
      wireLiveRefresh(refreshLiveData);
    }

    boot();
  </script>
</body>
</html>`;

export default reviewHtml;
