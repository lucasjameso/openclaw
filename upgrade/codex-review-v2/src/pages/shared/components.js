export const sharedComponentStyles = `
    .button-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 14px;
      background: var(--component-button-bg);
      border: var(--component-button-border);
      color: var(--component-button-text);
      font-size: 14px;
      font-weight: 600;
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
    }

    .button-link:hover {
      transform: translateY(-1px);
      border-color: var(--component-button-hover-border);
      background: var(--component-button-hover-bg);
    }

    .button-link.primary {
      background: linear-gradient(135deg, var(--component-button-primary-start), var(--component-button-primary-end));
      border-color: var(--component-button-primary-border);
    }

    .glance-row,
    .metric-grid,
    .metrics-grid {
      display: grid;
      gap: var(--component-metrics-gap);
      margin-top: var(--component-metrics-margin-top);
      margin-bottom: var(--component-metrics-margin-bottom);
    }

    .metric-card {
      padding: var(--component-metric-padding);
      border-radius: var(--component-metric-radius);
      background: var(--component-metric-bg);
      border: var(--component-metric-border);
      box-shadow: var(--component-metric-shadow);
    }

    .section-card {
      padding: var(--component-section-padding);
      border-radius: var(--component-section-radius);
      background: var(--component-section-bg);
      border: var(--component-section-border);
      box-shadow: var(--component-section-shadow);
      overflow: hidden;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: baseline;
      margin-bottom: 16px;
    }

    .section-title {
      font-size: var(--component-section-title-size);
      font-weight: 700;
      letter-spacing: var(--component-section-title-spacing);
    }

    .section-subtle {
      color: var(--component-section-subtle-color);
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 999px;
      background: var(--component-pill-bg);
      border: var(--component-pill-border);
      color: var(--component-pill-text);
      white-space: nowrap;
    }
  `;
