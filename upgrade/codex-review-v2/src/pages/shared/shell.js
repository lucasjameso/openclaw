const primaryNavItems = [
  { href: '/', icon: 'fa-solid fa-satellite-dish', label: 'Command' },
  { href: '/review', icon: 'fa-solid fa-shield-halved', label: 'Review' },
  { href: '/x-posts', icon: 'fa-brands fa-x-twitter', label: 'Broadcast' },
  { href: '/story', icon: 'fa-solid fa-timeline', label: 'Story' },
  { href: '/launchpad', icon: 'fa-solid fa-rocket', label: 'Launch' },
];

function renderNav(activePath, navItems) {
  return navItems
    .map((item) => {
      const activeClass = item.href === activePath ? ' class="active"' : '';
      return `        <a${activeClass} href="${item.href}"><i class="${item.icon}"></i> ${item.label}</a>`;
    })
    .join('\n');
}

export function renderSharedShellStyles({ wrapperSelector = '.app-shell' } = {}) {
  return `
    ${wrapperSelector} {
      max-width: var(--shell-max-width);
      min-height: var(--shell-min-height);
      margin: 0 auto;
      padding: var(--shell-padding);
      display: var(--shell-display);
      grid-template-rows: var(--shell-grid-template-rows);
      align-content: var(--shell-align-content);
      gap: var(--shell-gap);
      overflow: var(--shell-overflow);
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
      margin-bottom: var(--shell-topbar-margin);
      background: linear-gradient(180deg, rgba(2, 7, 12, 0.98), rgba(7, 16, 25, 0.94));
      border: 1px solid var(--shell-border);
      border-radius: 999px;
      backdrop-filter: blur(24px) saturate(1.28);
      box-shadow:
        0 28px 78px rgba(0, 0, 0, 0.5),
        var(--shell-topbar-separator),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }

    .topbar::before {
      content: "";
      position: absolute;
      inset: var(--shell-topbar-haze-inset);
      height: var(--shell-topbar-haze-height);
      border-radius: inherit;
      background:
        radial-gradient(circle at 50% 0%, rgba(6, 10, 15, 0.96), transparent 72%),
        linear-gradient(180deg, rgba(3, 7, 12, 0.94), rgba(3, 7, 12, 0));
      filter: blur(30px);
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
      color: var(--shell-brand-kicker-color);
      margin-bottom: 4px;
      white-space: nowrap;
    }

    .brand-title {
      font-size: var(--shell-brand-title-size);
      font-weight: 700;
      letter-spacing: var(--shell-brand-title-spacing);
      white-space: nowrap;
    }

    .nav {
      display: inline-flex;
      justify-content: center;
      gap: var(--shell-nav-gap);
      padding: var(--shell-nav-padding);
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
      gap: var(--shell-nav-link-gap);
      padding: var(--shell-nav-link-padding);
      border-radius: 999px;
      color: var(--shell-nav-text);
      font-size: var(--shell-nav-link-font-size);
      font-weight: 600;
      white-space: nowrap;
      transition: background 180ms ease, color 180ms ease, transform 180ms ease;
    }

    .nav a:hover {
      color: var(--shell-text-primary);
      background: rgba(255,255,255,0.04);
      transform: translateY(-1px);
    }

    .nav a.active {
      color: var(--shell-nav-active-text);
      background: linear-gradient(135deg, var(--shell-nav-active-start), var(--shell-nav-active-end));
      border: 1px solid var(--shell-nav-active-border);
    }

    .topbar-meta {
      display: inline-flex;
      align-items: center;
      gap: var(--shell-meta-gap);
      justify-self: end;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    .heartbeat-strip {
      width: var(--shell-heartbeat-width);
      height: var(--shell-heartbeat-height);
      display: grid;
      grid-template-columns: var(--shell-heartbeat-columns);
      gap: var(--shell-heartbeat-gap);
      padding: var(--shell-heartbeat-padding);
      border-radius: var(--shell-heartbeat-radius);
      border: var(--shell-heartbeat-border);
      background: var(--shell-heartbeat-bg);
      overflow: hidden;
      align-items: var(--shell-heartbeat-align);
    }

    .heartbeat-strip span {
      display: block;
      width: 100%;
      height: var(--shell-heartbeat-bar-height);
      border-radius: 999px;
      background: var(--shell-heartbeat-bar-bg);
      opacity: var(--shell-heartbeat-bar-opacity);
      transform-origin: var(--shell-heartbeat-origin);
      animation: beat var(--shell-heartbeat-duration) ease-in-out infinite;
      animation-delay: calc(var(--i) * var(--shell-heartbeat-delay-step));
    }

    .heartbeat-strip.active span {
      background: var(--shell-heartbeat-active-bg);
      box-shadow: var(--shell-heartbeat-active-shadow);
    }

    .heartbeat-strip.blocked span {
      background: var(--shell-heartbeat-blocked-bg);
      box-shadow: var(--shell-heartbeat-blocked-shadow);
    }

    .clock,
    .sync-chip {
      padding: var(--shell-chip-padding);
      border-radius: 999px;
      border: var(--shell-chip-border);
      background: var(--shell-chip-bg);
      white-space: nowrap;
      font-size: var(--shell-chip-font-size);
    }

    .clock {
      color: var(--shell-text-primary);
      font-family: var(--shell-clock-font-family);
      font-variant-numeric: tabular-nums;
    }

    .sync-chip {
      color: var(--shell-chip-text);
    }

    .sync-chip strong {
      color: var(--shell-chip-strong);
      font-weight: 600;
    }
  `;
}

export function renderTopbar({
  title,
  activePath,
  heartbeatId = 'heartbeat-strip',
  clockId = 'clock',
  clockText = '--:--:-- ET',
  syncId = 'sync-chip',
  syncClass = 'sync-chip',
  syncHtml = '<strong>Awaiting sync</strong>',
  brandKicker = 'Autonomous Business Operating System',
  navLabel = 'Primary',
  navItems = primaryNavItems,
} = {}) {
  return `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">F</div>
        <div class="brand-copy">
          <div class="brand-kicker">${brandKicker}</div>
          <div class="brand-title">${title}</div>
        </div>
      </div>
      <nav class="nav" aria-label="${navLabel}">
${renderNav(activePath, navItems)}
      </nav>
      <div class="topbar-meta">
        <div class="heartbeat-strip" id="${heartbeatId}"></div>
        <div class="clock" id="${clockId}">${clockText}</div>
        <div class="${syncClass}" id="${syncId}">${syncHtml}</div>
      </div>
    </header>`;
}
