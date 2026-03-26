# Visual System -- Forge Command Center

## The Problem With Light Mode

The current light theme communicates "SaaS product." Flat white backgrounds, gray borders, blue accents. It is the visual equivalent of "we used a component library." There is nothing wrong with it technically. But it has no presence. It does not feel like a command center. It does not feel like something worth showing off.

We are not building a SaaS product. We are building an operational cockpit for an autonomous business agent. The visual system should communicate: power, precision, confidence, and aliveness.

## Color System

### Dark Foundation

The base is not black. Pure black is harsh and creates too much contrast with content. The base is a deep cool slate that feels rich and recedes behind the content.

```
--bg-void:      #0a0c10     /* deepest layer -- page background */
--bg-surface:   #111318     /* card/panel background */
--bg-raised:    #1a1d24     /* elevated elements, hover states */
--bg-overlay:   #22262e     /* modals, drawers, tooltips */
--bg-input:     #161920     /* form inputs, search boxes */
```

### Content Colors

Text should have clear hierarchy without relying solely on size.

```
--text-primary:    #e8eaed   /* primary content -- not pure white, slightly warm */
--text-secondary:  #9ca3af   /* labels, descriptions, secondary info */
--text-tertiary:   #6b7280   /* timestamps, metadata, disabled */
--text-inverse:    #0a0c10   /* text on light/colored backgrounds */
```

### Semantic Colors -- Signal, Not Decoration

Every color in the system means something. No color is used "because it looks nice." Colors are signals.

```
/* Health / Success / Approved */
--signal-green:      #22c55e
--signal-green-soft: rgba(34, 197, 94, 0.12)
--signal-green-glow: rgba(34, 197, 94, 0.25)

/* Warning / Needs Attention / In Revision */
--signal-amber:      #f59e0b
--signal-amber-soft: rgba(245, 158, 11, 0.12)
--signal-amber-glow: rgba(245, 158, 11, 0.25)

/* Critical / Blocked / Rejected */
--signal-red:        #ef4444
--signal-red-soft:   rgba(239, 68, 68, 0.12)
--signal-red-glow:   rgba(239, 68, 68, 0.25)

/* Information / Active / In Progress */
--signal-blue:       #3b82f6
--signal-blue-soft:  rgba(59, 130, 246, 0.12)
--signal-blue-glow:  rgba(59, 130, 246, 0.25)

/* Neutral / Pending / Unreviewed */
--signal-slate:      #64748b
--signal-slate-soft: rgba(100, 116, 139, 0.12)
```

### Accent

The primary interactive accent is a confident blue -- not the safe "link blue" but a deeper, more intentional one. Used sparingly for primary CTAs, active states, and selected items.

```
--accent:        #2563eb
--accent-hover:  #1d4ed8
--accent-soft:   rgba(37, 99, 235, 0.15)
```

## Typography

### Font Stack

```
--font-ui:    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-data:  'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
--font-title: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Inter for UI. JetBrains Mono for data, metrics, timestamps, metadata. No third font.

### Type Scale

This is a data-dense interface. The scale is tighter than a marketing site.

```
--text-xs:   11px   /* metadata, timestamps, tertiary labels */
--text-sm:   12px   /* badges, secondary text, table cells */
--text-base: 13px   /* body text, queue items, descriptions */
--text-md:   14px   /* panel titles, interactive elements */
--text-lg:   16px   /* section headers */
--text-xl:   20px   /* page title, item title in inspector */
--text-2xl:  28px   /* hero metrics (revenue, balance, backlog count) */
--text-3xl:  36px   /* the live clock */
```

### Weight Strategy

- 400: Body text, descriptions
- 500: Secondary labels, metadata keys
- 600: Interactive elements, badges, nav items
- 700: Panel titles, section headers, metric values
- 800: Hero metrics, page titles

### Monospace for Metrics

All numeric values (revenue, balance, counts, timestamps, durations) use `--font-data`. This creates a subtle but consistent signal: "this is live data" vs "this is UI chrome." It also gives tabular alignment for free.

## Panel Treatment

### Cards Are Dead. Long Live Panels.

No more floating white cards with box shadows. Panels are defined by subtle borders and background differentiation.

```
--border-default:  rgba(255, 255, 255, 0.06)    /* barely visible panel edges */
--border-strong:   rgba(255, 255, 255, 0.10)    /* emphasized separation */
--border-active:   rgba(37, 99, 235, 0.40)      /* selected/focused panel */
--border-signal:   var(--signal-*)               /* status-driven borders */
```

Panels sit on `--bg-surface` against a `--bg-void` page background. The contrast is subtle -- you feel the separation more than you see it.

### Depth Model

Three layers of depth. No box-shadow extravaganzas.

1. **Void** (page bg): `--bg-void` -- the deepest layer
2. **Surface** (panels): `--bg-surface` with `--border-default` -- the operational layer
3. **Raised** (active/hover/selected): `--bg-raised` with `--border-strong` -- the interactive layer

The only shadow in the system is on floating elements (modals, dropdowns, tooltips):
```
--shadow-float: 0 8px 32px rgba(0, 0, 0, 0.45), 0 0 1px rgba(255, 255, 255, 0.06);
```

## Iconography

Use Font Awesome 6 (already loaded). But use icons purposefully:

- **Status icons**: Solid circles, not outlined. A filled green circle means "healthy." A filled red circle means "blocked."
- **Navigation icons**: Outline style. Lighter visual weight than status.
- **Action icons**: Solid. Buttons with icons use solid variants.
- **Decorative icons**: None. No icons that exist purely for visual balance.

### Custom Status Indicators

For system status and Forge activity, go beyond static icons:

**Forge Pulse**: A small circle (12px) that pulses with a glow animation when Forge is actively working. Solid and still when idle. Red and pulsing if the system is in error state.

```css
@keyframes pulse-active {
  0%, 100% { box-shadow: 0 0 0 0 var(--signal-green-glow); }
  50% { box-shadow: 0 0 0 8px transparent; }
}

.forge-pulse.active {
  background: var(--signal-green);
  animation: pulse-active 2s ease-in-out infinite;
}

.forge-pulse.idle {
  background: var(--signal-slate);
}

.forge-pulse.error {
  background: var(--signal-red);
  animation: pulse-active 1s ease-in-out infinite;
}
```

## Motion System

Motion is purposeful. Every animation communicates something.

### Principles
1. **Fast entrances** (150ms): Elements appear quickly. No lazy fades.
2. **Smooth transitions** (200-300ms): State changes (selected/deselected, expand/collapse) use ease-out curves.
3. **Subtle loops** (2-4s): Status indicators pulse slowly. The clock ticks. Data refreshes fade in.
4. **No gratuitous animation**: Panels do not bounce. Cards do not flip. Nothing spins unless it is loading.

### Specific Animations

**Decision confirmation**: When Lucas approves/rejects, a brief (200ms) color flash floods the preview panel -- green for approve, amber for revision, red for reject. Then fades back to normal. This is the "satisfying click" of the review flow.

**Queue item exit**: When an item is decided and auto-advances, the old item slides left (150ms) as the new one slides in from the right. Not a hard cut -- a smooth transition that communicates "next."

**Blocked item pulse**: Blocked task cards have a very slow (4s) glow animation on their left border. Amber to red to amber. Subtle but impossible to ignore. This is the "this needs you" signal.

**Data refresh fade**: When the 60-second auto-refresh updates data, changed values briefly highlight (background flash) then settle. This communicates "fresh data arrived" without being disruptive.

**Activity feed entries**: New entries slide down from the top of the feed with a 150ms ease-out. Older entries compress down. The feed feels alive and moving.

## Hierarchy and Density

### Information Density

This is a command interface, not a marketing page. Density should be high.

- **Spacing**: Use 4px/8px/12px/16px/20px/24px grid. Do not go above 32px between sections.
- **Panels**: Minimal internal padding (12px-16px). Let content breathe through typography hierarchy, not whitespace.
- **Tables/Lists**: Compact rows (40-48px height). Dense but scannable.
- **Metric cards**: Tight. Number + label, minimal padding. The number is the content.

### Visual Hierarchy Tools

In order of strength:
1. **Size**: Hero metrics are 28-36px. Body is 13px. That contrast does the work.
2. **Weight**: 700-800 for metrics and titles. 400 for body. Weight contrast reinforces size.
3. **Color**: Signal colors for status. Primary text for content. Secondary for labels. Tertiary for timestamps.
4. **Position**: Top-left dominance. Most important info is top-left of each panel.
5. **Border/Background**: Active items have `--border-active` or `--bg-raised`. Inactive items have `--border-default`.
6. **Opacity**: Disabled/historical items at 60% opacity. Active items at 100%.

Never rely on just one hierarchy tool. Combine at least two for every visual distinction.

## What Makes It Feel Expensive

1. **Consistency**: Every panel uses the same border radius (6px), the same spacing scale, the same type scale. No "close enough." Pixel-perfect alignment.
2. **Restraint**: The color palette is small. Accent blue is used in maybe 5% of the interface. The rest is slate, data, and signal colors. Restraint communicates confidence.
3. **Typography quality**: Font rendering matters. `-webkit-font-smoothing: antialiased`. Letter-spacing on uppercase labels (0.06em). Tabular numerics for data. Negative tracking (-0.02em) on large type.
4. **Subtle texture**: A very faint noise overlay on the void background (2-3% opacity) adds physical presence without being visible. The eye registers it subconsciously.
5. **Transition timing**: `ease-out` for entrances, `ease-in-out` for state changes. Never `linear`. Timing curves communicate quality.
6. **Data as decoration**: The system's own data -- the activity feed scrolling, the pulse animating, the clock ticking, the metrics updating -- IS the visual interest. We do not need illustrations or decorative elements. The data is alive. That is the decoration.
