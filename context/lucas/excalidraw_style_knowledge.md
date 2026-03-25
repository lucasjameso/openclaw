# Excalidraw Style Knowledge Base
## Lucas Oliver Approved Style — Synthesized from 62 Carousel Files

---

## 1. Approved Style JSON

The following JSON block defines the exact property values for a Lucas Oliver approved Excalidraw slide. Every slide must match these constraints.

```json
{
  "appState": {
    "viewBackgroundColor": "#FAF8F5"
  },
  "canvas_frame": {
    "type": "rectangle",
    "x": 0,
    "y": 0,
    "width": 1080,
    "height": 1350,
    "strokeColor": "#1B3A52",
    "backgroundColor": "#FAF8F5",
    "fillStyle": "solid",
    "strokeWidth": 4,
    "roughness": 0,
    "opacity": 100
  },
  "approved_fontFamilies": [2, 5],
  "approved_roughness": 0,
  "approved_fillStyle": "solid",
  "approved_strokeColors": ["#1B3A52", "#C75B3F", "#8a9aa8"],
  "approved_backgroundColors": ["#FAF8F5", "transparent"],
  "approved_strokeWidths": [1, 2, 3, 4],
  "approved_strokeStyles": ["solid", "dashed"],
  "approved_fontSizes": [22, 24, 28, 32, 36, 38, 42, 48, 56, 72],
  "approved_opacityScale": [8, 12, 15, 20, 25, 40, 45, 50, 55, 60, 70, 80, 85, 100]
}
```

---

## 2. Font Family Reference

| ID | Renders As | Use In Approved Work |
|----|-----------|---------------------|
| 1  | Virgil (hand-drawn) | NEVER — appears only in rejected archive files (OptionA, OptionB) |
| 2  | Helvetica (clean sans-serif) | YES — used for UI text, slide counters, checkmarks, secondary labels |
| 3  | Cascadia Code (monospace) | NEVER — not present in approved work |
| 4  | Comic Shanns | NEVER — not present in approved work |
| 5  | Excalifont (custom, added in newer Excalidraw versions) | YES — primary display font for headlines, body text, footer brand name |

**Rule:** Approved slides always use fontFamily 2 AND 5 together. Never use fontFamily 1, 3, or 4.

**Usage split:**
- fontFamily 5 (Excalifont): Headlines, main body text, CTAs, labels, brand footer signature
- fontFamily 2 (Helvetica): Slide counters ("1 / 4"), checkmarks (✓), supporting UI elements

---

## 3. Roughness Rules

- **roughness: 0** — ALWAYS. Every single element across all 62 approved files uses roughness 0. Perfectly crisp, perfectly smooth edges.
- roughness 1 or roughness 2 — appear ONLY in the rejected archive files (W2_Tue_slide1_OptionB_HandDrawn.excalidraw). These files were explicitly rejected.
- There is no "sometimes rough" exception. If roughness > 0, the slide is wrong.

---

## 4. Color Palette

| Hex | Name | Role |
|-----|------|------|
| `#1B3A52` | Navy / Deep Ink | Primary color. Canvas frame border. Main headline text. Body text. Structural divider lines. |
| `#C75B3F` | Burnt Orange / Terracotta | Accent color. Secondary headlines. Emphasis lines. Dashed container borders. Section markers. CTA text. |
| `#8a9aa8` | Steel Blue-Gray | Tertiary color. Slide counter text. Supporting labels. Subtle decorative lines. |
| `#FAF8F5` | Warm Cream / Off-White | Canvas background. Primary fill for the canvas frame. appState viewBackgroundColor. |
| `transparent` | Transparent | Fill for most text elements and non-background rectangles. |

**What NOT to use:** `#ffffff` (pure white), `#1B3A52` as a fill for the entire canvas background (only in OptionC dark mode — rejected), `#ffc9c9`, `#ffd8a8`, `#fff3bf` (pastels from rejected OptionA).

---

## 5. Text Case Rules

- **ALL CAPS**: Use for headlines, section labels, hook titles, key terms being introduced. Examples: "MOST PEOPLE", "BUILD", "BACKWARDS.", "SURFACE", "THE FOUNDATION", "BEFORE YOU".
- **Title Case / Mixed Case**: Use for body content, supporting explanation text, subtitles. Examples: "What we ask for:", "Build What Lasts", "The information that runs the business."
- **Do NOT mix randomly**: Headlines stay caps. Body stays mixed. The contrast between ALL CAPS headlines and sentence-case body text is intentional and creates visual hierarchy.

---

## 6. Canvas Dimensions and Safe Zones

**Confirmed canvas size: 1080 × 1350 px** (LinkedIn portrait aspect ratio — 4:5)

This is confirmed from direct element inspection across W2_Tue_Slide1, W2_Tue_Slide4, W4_Tue_Slide4, and W3_Thu_Slide4. Every slide has the background rectangle at x:0, y:0, width:1080, height:1350.

**Safe zones (inferred from element positioning):**

| Zone | Coordinates | Notes |
|------|------------|-------|
| Canvas frame | x:0, y:0 → 1080×1350 | The outer rectangle, strokeWidth:4, strokeColor:#1B3A52 |
| Top margin | y: 50–80 | Slide counter sits at x:940, y:50 |
| Left margin | x: 80 | Standard left edge for all body content |
| Right margin | x: 1000 max | Right-aligned elements reach to ~x:1030 |
| Header zone | y: 50–300 | Slide counter top-right; main headline top-left starting ~y:50–200 |
| Body zone | y: 300–1050 | All diagrams, lists, callout boxes, and body text |
| Lower body | y: 1050–1230 | Closing statements, summary callouts |
| Footer zone | y: 1240–1320 | Footer separator line at y:1240; brand text at y:1267–1290 |
| Bottom padding | y: 1310–1350 | Empty breathing room |

---

## 7. Layout Zones

### Top Header Zone (y: 50–300)
- Slide counter: top-right corner, x:940, y:50, width:90, fontSize:22, fontFamily:2, textAlign:right, strokeColor:#8a9aa8, opacity:100
- Main headline: starts at x:80, y:50–200 depending on slide type
- Hook slides often begin the headline at y:50 and stack 2–3 lines through y:300
- CTA/Takeaway slides may start the headline lower (~y:200) to give breathing room

### Body Zone (y: 300–1050)
- A horizontal divider line often separates header from body (e.g., x:80, y:310, width:920, strokeWidth:4, opacity:20)
- Body content uses consistent left margin (x:80) or centered layout (x:80, width:920, textAlign:center)
- Lists, dashed containers, diagrams, and comparison blocks all live here
- Section labels (ALL CAPS, small, opacity:55–70) introduce sub-sections

### Footer Zone (y: 1240–1290)
- Separator line: x:80, y:1240, width:920, strokeWidth:2, strokeColor:#1B3A52, opacity:25
- Brand signature text: centered, x:~340, y:1267–1270, width:~400, text:"Build What Lasts", fontSize:28–36, fontFamily:5, strokeColor:#1B3A52, opacity:45, textAlign:center
- This footer is IDENTICAL across every slide in a carousel (same position, same text, same opacity)

---

## 8. Opacity Layering System

Opacity creates the entire visual hierarchy. This is the most important system.

| Opacity Range | Tier | Usage |
|--------------|------|-------|
| 100 | Primary — full attention | Main headlines, key accent lines, canvas frame, slide counter |
| 80–90 | Near-primary | Strong secondary callouts, important labels ("THE FOUNDATION" at 80%, "That is the slab." at 85%) |
| 55–70 | Secondary | Body explanation text, sub-labels, supporting content. Most body text reads at 55% |
| 40–55 | Tertiary / supporting | Context text, secondary body lines, less important labels |
| 20–35 | Structural lines | Divider lines, separator lines, horizontal rules that organize layout (opacity:20–25 is the standard) |
| 8–15 | Background elements | Faint background rectangles, ghost shapes, very subtle context fills |

**Key examples from files:**
- Divider lines between sections: opacity 20
- Footer separator line: opacity 25
- Brand signature "Build What Lasts": opacity 45
- Body explanation sentences: opacity 55
- Section callout text (e.g., "That is the slab."): opacity 85
- Main headlines: opacity 100

---

## 9. Stroke Weight System

| strokeWidth | Weight Name | Usage |
|------------|-------------|-------|
| 4 | Heavy | Canvas frame border. Major section divider lines. Strong structural separators. |
| 3 | Medium | Dashed container outlines. Medium emphasis lines. Section break accent lines. |
| 2 | Standard | Regular connectors. Footer separator lines. Medium structural lines. |
| 1 | Fine / Subtle | All text element strokes. Arrows. Minor decorative lines. |

**Rule:** The outer canvas frame is always strokeWidth:4. Text elements are always strokeWidth:1. Dashed containers use strokeWidth:3. Footer separator uses strokeWidth:2.

---

## 10. Arrow and Connector Patterns

- **Arrows appear in**: W2_Thu series, W3_Thu series, Enhanced series, Sample series — primarily diagram and flow slides
- **Simpler content slides** (Hook, Takeaway, CTA): often use only lines and rectangles, no arrows
- **Arrow style**: roughness:0 always, strokeWidth:1 or 2, strokeColor:#1B3A52 or #C75B3F
- **Straight arrows**: Used for flow diagrams, before/after comparisons, step sequences
- **Curved arrows**: Used in compound/loop diagrams (W3_Thu_Slide4, Enhanced3_CompoundGap) — defined with multi-point curved paths
- **Arrow opacity**: Matches the element it's emphasizing — primary flow arrows at 70–100%, secondary/reference arrows at 40–55%
- **No arrowheads by default on lines** — pure `line` type elements are used as dividers; `arrow` type elements are used for directional flow

---

## 11. Container Patterns

| Pattern | Usage |
|---------|-------|
| Solid stroke rectangle | Primary framing element — canvas border, filled background blocks (#1B3A52 or #C75B3F fill in diagram slides) |
| Dashed stroke rectangle | Secondary containers — callout boxes, "pillar" boxes, featured question boxes. Always strokeWidth:3, strokeColor:#C75B3F or #1B3A52, opacity:60–100 |
| fillStyle: "solid" | Used on ALL elements, always. Never "hachure" (that appears only in rejected OptionB) |
| backgroundColor: transparent | Default fill for most rectangles unless they are colored background blocks |
| backgroundColor: #FAF8F5 | The canvas frame's fill |
| backgroundColor: #1B3A52 or #C75B3F | Filled colored blocks in diagram slides (Enhanced series, Sample series) |

**Dashed containers signal "this is what we're zooming into"** — a CTA box, a key question, a highlighted concept. The dashed border says "this matters, look here."

---

## 12. How a Carousel Tells a Story

### What stays CONSTANT across all slides in a carousel:
- Canvas background: `#FAF8F5` (appState viewBackgroundColor)
- Canvas frame: 1080×1350, strokeColor:`#1B3A52`, strokeWidth:4, roughness:0
- Color palette: only `#1B3A52`, `#C75B3F`, `#8a9aa8`, `transparent`
- Font families: only 2 and 5
- Roughness: always 0
- Footer: "Build What Lasts" centered at y:1267–1270, opacity:45, with separator at y:1240, opacity:25
- Margin conventions: left edge at x:80, right edge at ~x:1000

### What CHANGES slide to slide:
- The headline text and its color emphasis (which word/phrase is in `#C75B3F`)
- The main body content (diagram, list, comparison, steps)
- The slide counter ("1 / 4", "2 / 4", etc.)
- Which elements are highlighted or at full opacity vs. de-emphasized
- The layout pattern (top-heavy hook vs. balanced body vs. centered CTA)
- Occasionally: presence of arrows (diagram slides) vs. no arrows (narrative slides)

### Slide type patterns:
1. **Hook (Slide 1)**: Bold headline stacked 2–3 lines, key word in `#C75B3F`, strong contrast. Body introduces the problem/tension. Separator line mid-slide.
2. **Content slides (2–3)**: Balanced layout, section labels, lists or diagrams in body zone.
3. **CTA / Takeaway (Last slide)**: Often centered text, question format or conclusion. Dashed callout box common. Ends with the brand footer.

---

## 13. Brand Footer Requirements

Every slide — without exception — must include the exact same footer structure:

```json
[
  {
    "type": "line",
    "x": 80,
    "y": 1240,
    "width": 920,
    "strokeColor": "#1B3A52",
    "strokeWidth": 2,
    "roughness": 0,
    "opacity": 25,
    "strokeStyle": "solid"
  },
  {
    "type": "text",
    "x": 340,
    "y": 1267,
    "width": 400,
    "text": "Build What Lasts",
    "fontSize": 28,
    "fontFamily": 5,
    "textAlign": "center",
    "strokeColor": "#1B3A52",
    "opacity": 45,
    "roughness": 0
  }
]
```

**Notes:**
- The footer separator line runs from x:80 to x:1000 (width:920), inset from the canvas edges
- "Build What Lasts" is the brand name — always Title Case, never ALL CAPS
- opacity:45 — present but deliberately understated; it doesn't compete with the content
- fontFamily:5 (Excalifont) — consistent with all primary text
- Centered horizontally within the canvas (~x:340, width:400 gives a centered block)
- The W4_Tue_Slide4 variant uses fontSize:36 for the footer text; the W2_Tue series uses fontSize:28. Either is acceptable but be consistent within a carousel.

---

## 14. The Single Most Important Rule

**Every element must feel deliberate — no randomness, no decoration for its own sake.**

Lucas's slides look the way they do because every visual decision is load-bearing:
- Opacity is not decorative — it communicates hierarchy. The reader's eye naturally moves from 100% to 85% to 55% to 25%, following exactly the information order intended.
- The color red (`#C75B3F`) is not used frequently — it marks the one thing the reader must not miss on that slide.
- The dashed border is not a style choice — it signals "this container holds the key idea."
- Roughness is always 0 because the work being communicated is about reliability, precision, and systems. A wobbly line would contradict the message.
- The cream background (`#FAF8F5`) is warm enough to not feel clinical, but neutral enough to let the navy and terracotta carry all the weight.

**If a slide feels like Lucas's work, it is because everything unnecessary has been removed and everything remaining has a reason.**

---

## Appendix: What NOT to Do — Rejected Archive Files

The following patterns appear ONLY in the rejected W2_Tue archive options (OptionA through OptionG) and must never be used:

| Property | Rejected Value | Found In |
|----------|---------------|----------|
| fontFamily | 1 (Virgil/hand-drawn) | OptionA, OptionB |
| roughness | 1 or 2 | OptionB (hand-drawn style) |
| backgroundColor (canvas) | `#ffffff` (pure white) | OptionA, OptionB |
| backgroundColor (canvas) | `#1B3A52` (dark mode) | OptionC |
| fillStyle | "hachure" | OptionB |
| strokeWidth | 6 | OptionB |
| Colors | `#ffc9c9`, `#ffd8a8`, `#fff3bf` | OptionA (pastels) |
| Colors | `#e5e5e5`, `#5a7a8a`, `#243f56`, `#aaaaaa`, `#999999` | OptionA, OptionC |
| fontSize | 80, 84, 96 | OptionC, OptionD2 (oversized) |

These files were tested and rejected. The approved style is what remained after that selection process.
