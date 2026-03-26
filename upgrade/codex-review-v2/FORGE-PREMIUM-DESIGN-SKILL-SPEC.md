---
name: forge-premium-design-system
description: Use when creating, revising, or reviewing Forge launch-critical visuals so output is premium, platform-fit, mechanically clean, and not generic. Applies to cards, covers, banners, thumbnails, dashboard art, and product visuals.
---

# Forge Premium Design System

This is the skill spec Claude should use when defining or judging premium visual work for Forge.

It exists to prevent vague prompts like:

- "make it nicer"
- "make it more premium"
- "go harder"
- "less AI slop"

Those are not build instructions.

## Objective

Forge visuals must look:

- premium
- sharp
- intentional
- system-built
- modern but not trend-chasing
- branded without copying Lucas's personal palette unless explicitly requested

They must also survive review at three sizes:

- full-screen desktop
- dashboard iframe
- thumbnail/mobile glance

## Core Rule

A premium visual is not "more decoration."
It is better controlled hierarchy.

That means:

- fewer elements
- stronger type scale
- cleaner alignment
- more confident spacing
- one dominant idea per frame
- platform-safe composition

## Visual Systems Allowed

Launch-critical work should come from a limited set of systems.

### 1. Product Cover

Use for:

- guide/product art
- launch asset covers
- Gumroad hero image

Structure:

- one dominant title block
- one subordinate subtitle/tagline
- one price/date/status block
- one small Forge brand marker
- minimal secondary decoration

Must avoid:

- multi-cluster clutter
- fake UI chrome
- random gradients with no logic
- trying to explain the whole product on the cover

### 2. Metric Snapshot

Use for:

- cost breakdowns
- time saved
- revenue transparency
- before/after numbers

Structure:

- one primary stat
- max two supporting stats
- unit alignment locked
- labels visually secondary
- supporting sentence only if it sharpens interpretation

Must avoid:

- unaligned numerals
- inconsistent decimal widths
- labels floating off baseline
- too many data points

### 3. Editorial Poster

Use for:

- quote cards
- provocative hooks
- bold story statements

Structure:

- one statement
- one emphasis move
- one small attribution or system label

Must avoid:

- body-copy density
- too many font treatments
- faux-magazine chaos without grid discipline

### 4. Thread Explainer Stack

Use for:

- educational X cards
- process explainers
- architecture/story cards

Structure:

- one core concept per panel
- fixed vertical rhythm
- consistent callout treatment
- clear hierarchy between headline, explanation, and support

Must avoid:

- diagram density that collapses at thumbnail size
- too many parallel visual metaphors
- explanatory copy without anchors

### 5. Banner / Header

Use for:

- LinkedIn banners
- X headers
- profile-adjacent branding surfaces

Structure:

- one directional composition
- safe-zone protected text
- strong silhouette or typographic anchor
- zero dependency on fine-detail reading

Must avoid:

- center-weighted clutter
- crop-sensitive details
- important text in unsafe areas

### 6. Video Cover

Use for:

- Roger clips
- short-form vertical covers
- launch teasers

Structure:

- one hook
- one focal face/object zone
- one reinforcement line or badge max

Must avoid:

- tiny explanatory text
- overstuffed scene-building
- weak contrast around the hook

## Premium Design Heuristics

When reviewing a visual, score it mentally on these axes:

### Hierarchy

- Can the eye tell what matters in under one second?
- Is there a single dominant element?
- Are supporting elements clearly subordinate?

### Alignment

- Are numbers aligned consistently?
- Are labels sitting on intentional baselines?
- Does the grid feel locked?

### Density

- Is there too much copy for the format?
- Is any area doing more than one job?
- Would removing 20% improve it?

### Originality

- Does this look system-designed or template-generated?
- Is there a point of view in the layout?
- Does it avoid generic startup aesthetics?

### Platform Fit

- Does it hold up at the actual crop and size where it will be seen?
- Is the safe area honored?
- Does the text remain readable in a feed?

## Anti-Patterns

These should trigger immediate revision.

### AI slop signals

- decorative gradients with no structural role
- multiple weak focal points
- stock "futuristic" shapes used as filler
- visual busyness standing in for confidence
- trying to solve premium feel with more effects

### Corporate blandness signals

- flat dashboard-UI look on marketing art
- too much symmetry
- overuse of generic pill cards and feature-box layouts
- no tension, no scale contrast, no edge

### Mechanical failure signals

- text overflow
- uneven number alignment
- weak contrast
- clipping in export
- tiny text carrying important meaning
- heading lines too long for the frame

## Typography Rules

- one display voice, one support voice
- headlines should be short enough to dominate the frame
- supporting text should clarify, not narrate
- avoid using size changes where weight or spacing would do the job better
- avoid three or more competing emphasis styles in the same frame

## Composition Rules

- design from the focal point outward
- keep one visual thesis per frame
- use negative space as an active element
- if every area contains signal, the composition has no signal
- use asymmetry intentionally, not accidentally

## Color Rules

- dark is acceptable, but dark alone is not premium
- color should define hierarchy or mood, not just decorate
- one accent role is usually enough
- if the palette is loud, the layout must be quieter
- if the layout is complex, the palette must be tighter

## Platform Rules

### LinkedIn banner

- assume crop danger
- do not place critical text near edges
- branding should read in two seconds without scrolling

### X card

- optimize for feed glance first, full-size second
- headlines must remain readable on mobile
- one card should not try to carry the entire thread

### Thumbnail

- numbers and units must align perfectly
- every nonessential word should be suspect
- if a metric matters, isolate it visually

### Dashboard review card

- should be readable in iframe mode
- should not rely on hover or hidden details
- should still feel like a finished artifact, not a dev preview

## Revision Workflow

When a visual fails, the feedback should use one of these buckets:

- hierarchy failure
- alignment failure
- density failure
- platform-fit failure
- brand-lane failure
- originality failure
- export/format failure

Do not write:

- "just make it better"
- "it feels off"
- "more premium"

Write:

- "metric labels do not share a baseline"
- "banner text sits in unsafe crop area"
- "three focal points are competing"
- "headline density is too high for mobile feed read"
- "layout feels like generic SaaS promo, not Forge product art"

## Premium Design Output Contract

A premium visual brief should specify:

- artifact type
- target platform
- message priority
- dominant element
- supporting element
- forbidden patterns
- safe-zone requirement
- whether the lane is `safe`, `bold`, or `editorial`

If those are absent, the brief is incomplete.

## What Claude Should Produce From This Skill

Claude should use this to produce:

- cleaner visual briefs
- machine-usable rejection notes
- sharper revision comments
- a small set of approved visual lanes
- fewer vague quality adjectives

## What Codex Should Build Around This Skill

Codex should convert this into:

- validator rules
- template systems
- safe-zone overlays
- screenshot checks
- variant generation constraints

This is the bridge from taste language to actual system behavior.
