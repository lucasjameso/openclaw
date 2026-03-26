# Information Architecture & Experience Design

## Challenging the Three-Page Structure

The current three pages (Mission Control, Review, X Posts) exist because we thought in terms of "data categories." But Lucas does not think in categories. He thinks in modes:

- **"What's happening?"** -- awareness mode
- **"What needs me?"** -- action mode
- **"How's it going?"** -- confidence mode

These modes do not map cleanly to three separate pages. Mission Control tries to answer all three and does none well. Review is action mode but lacks awareness context. X Posts is a dead page unless content just posted.

### Proposed Structure: Two Views, Not Three

**View 1: Command** (replaces Mission Control + X Posts)
The nerve center. Everything that matters on one screen. This is the default landing page. It answers "what's happening" and "what needs me" simultaneously.

**View 2: Review** (evolves from current Review OS)
The human judgment surface. Deep focus on one artifact at a time. You enter Review mode when Command tells you there is work to approve.

The X Posts page gets absorbed into Command as a "Distribution" panel. It is not a separate concern -- it is part of the system's output, displayed alongside queue health and session status. A dead page with "No data" is worse than no page at all.

### Why Two Is Better Than Three

- Fewer clicks to reach any piece of information
- Lucas does not have to decide which page to check -- Command shows everything
- X Posts data is tiny (a few posts per day) and does not justify its own page
- Reduces the "which page am I on?" cognitive load
- Review remains a separate view because it requires deep focus and a different interaction pattern

## View 1: Command -- Information Architecture

### Top Strip: System Vital Signs
A persistent horizontal strip at the top of the viewport. Always visible. Never scrolls.

| Element | Purpose | Treatment |
|---------|---------|-----------|
| Forge Status | Is the system alive and working? | Animated pulse when active, static when idle |
| Current Activity | What is Forge doing RIGHT NOW? | Live text: "Working: Design X post graphics" or "Idle -- next session in 12m" |
| DeepSeek Balance | Fuel gauge | Number with color (green > $30, amber $10-30, red < $10) |
| Revenue | Scoreboard | Current vs target with progress bar |
| Review Backlog | Pressure gauge | Count with urgency color (green 0-5, amber 6-15, red 16+) |
| Last Sync | Freshness | Relative time with staleness warning |

This strip is the "glance row." Lucas should be able to read it from across the room.

### Left Column: Action Required (40% width)
Items that need Lucas's attention, sorted by urgency.

**Section 1: Blocked Work** (always visible if any exist)
- Red/amber left border
- Task name, why it is blocked, what Lucas needs to do
- Action affordance: "View in Review" button if it is a review item, or "Copy for relay" if it needs to go to Claude/Codex
- This section DOMINATES when populated. If there are blocked items, they are the first thing Lucas sees.

**Section 2: Ready for Review** (count badge)
- Items in the review queue that have not been touched
- Preview thumbnail, name, category
- Click to jump directly into Review view with that item selected

**Section 3: Needs Direction** (optional)
- Tasks that are READY but have no clear next step
- Forge is waiting for Lucas to prioritize or clarify

### Center Column: System Activity (35% width)
The live operational view. What the machine is doing.

**Active Session Panel**
- If Forge is currently working: show task name, duration so far, model being used
- If idle: show countdown to next session, what it will work on
- Animated border or subtle glow when a session is active

**Recent Activity Feed**
- Last 12-24 hours of activity, newest first
- Compact entries: timestamp, action, outcome
- Color-coded: green for success, amber for partial, red for failure
- Collapsible -- shows last 5 by default, expandable

**Session Efficiency Trend**
- Small sparkline or bar chart showing session durations over last 24 hours
- Average duration displayed
- Color trend: is it improving (green arrow) or degrading (red arrow)?

### Right Column: Distribution & Output (25% width)
The outward-facing activity. What Forge is publishing.

**X Posts Panel**
- Today's posts with text preview and timestamp
- Post count vs daily target
- Cadence indicator: "On pace" / "Behind" / "Ahead"
- Next scheduled post time

**Content Pipeline**
- Items approved in Review that are pending publication
- Items published today
- Revenue-generating items (Gumroad products listed, email sequences sent)

**Queue Summary**
- Compact view: Ready / Blocked / Done counts
- Done items are a single collapsed line: "3 completed today" -- expandable but not cluttering

### Bottom Strip: Completed Work (Collapsed by Default)
A thin strip at the bottom: "7 tasks completed today -- Show history"
Expands to a scrollable list of completed work. Never competes with active/blocked work for attention.

## View 2: Review -- Information Architecture

### Core Layout: Three Panels (Kept, But Elevated)
The three-panel layout (queue / preview / inspector) is correct for this interaction. Do not change the fundamental structure. But elevate every element.

### Left Panel: Review Queue

**Segmented Sections:**
1. **Needs Review** (expanded) -- items with no decision
2. **In Revision** (expanded if any) -- items sent back for revision with revision count
3. **Approved** (collapsed) -- count badge, expandable
4. **Rejected** (collapsed) -- count badge, expandable

Within each section, sort by:
- Priority (if available from task queue)
- Recency (most recently modified first)

**Queue Item Treatment:**
- Thumbnail preview (for images) or type icon (for PDF/HTML)
- Name, category badge, type badge
- Status indicator: colored left border (amber = needs review, blue = in revision, green = approved, red = rejected)
- Revision count pill if > 0
- Time since last modified

**Search and Filter:**
- Keep the current filter pills and search box
- Add a "status" filter row: All / Needs Review / In Revision / Approved / Rejected

### Center Panel: Preview Canvas

**Image Preview:**
- Dark matte background (not white -- images pop more on dark)
- Image centered with subtle drop shadow
- Zoom controls: fit, fill, 1:1 pixel, zoom in/out
- For large images: progressive loading with blur-up placeholder

**PDF/HTML Preview:**
- Full iframe rendering
- Toolbar with: open in new tab, download, page navigation (for PDF)

**Empty State:**
- When no item is selected: show a brief instruction + keyboard shortcut legend
- Make it useful, not just a placeholder

### Right Panel: Decision Inspector

**Item Header:**
- Title (large, bold)
- Category, type, status badges
- File size, dimensions, created/modified dates

**Decision Block:**
- Three decision buttons, visually weighted
- The selected decision type changes the color theme of the entire inspector panel (green tint for approve, amber for revision, red for reject)
- Issue tags appear/disappear based on selected decision (current behavior -- keep it)

**Comment Box:**
- Pre-populated with suggested issues if tags are selected
- Rich enough for useful feedback, compact enough to not dominate

**Action Button:**
- Single primary action button that changes label based on selected decision
- "Approve & Next" / "Send Back & Next" / "Reject & Next"
- Confirmation flash on the preview canvas (not just the sync status text)
- Auto-advance to next pending item

**Revision History:**
- Timeline format, not card stack
- Visual: vertical line with dots at each decision point
- Each point shows: decision, reviewer, timestamp, issues, comment
- Most recent at top

**Metadata:**
- Collapsed by default (keep current behavior)
- Technical details: hash, dimensions, model used, task/session IDs

### Analytics Footer
Keep the collapsible analytics drawer. It works well as a "pull up for deeper analysis" gesture.

Add:
- Approval velocity chart (items reviewed per day over last 7 days)
- Review queue age distribution (how long have items been waiting?)
- Model quality comparison (which model produces the most first-pass approvals?)

## Experience Flow

### Flow 1: Morning Check-in (60 seconds)
1. Lucas opens Command
2. Glance row tells him: Forge is idle, next session in 8 minutes, DeepSeek at $44, 12 items need review
3. Left column shows: 2 blocked tasks (red), 12 review items (amber)
4. He reads the blocked items. One needs him to approve a Gumroad listing. He taps "View in Review."
5. Review opens with that item pre-selected. He approves it. Auto-advances.
6. He clears 5 more items using keyboard shortcuts (j/k to navigate, a to approve).
7. Back to Command. Blocked count is now 1. Review backlog is 6. He closes the tab.

### Flow 2: Deep Review Session (10-15 minutes)
1. Lucas goes directly to Review
2. Filters by "Visuals" category
3. Steps through each X graphic: preview renders large, he checks branding and copy
4. Approves 3, sends 2 back with issue tags (layout, dimensions)
5. Opens analytics drawer: sees first-pass approval rate trending up from 40% to 65%
6. Confident that Forge is learning from feedback

### Flow 3: Quick Pulse Check (10 seconds)
1. Lucas glances at Command on his phone or laptop
2. Sees: Forge is working, no blocked items, 4 items in review, revenue still $0
3. Closes tab. Everything is fine.

## Keyboard Shortcuts (Review View)

| Key | Action |
|-----|--------|
| j / Down | Next item |
| k / Up | Previous item |
| a | Approve & advance |
| n | Needs revision |
| r | Reject |
| / | Focus search |
| Escape | Close inspector (mobile) / blur input |
| ? | Toggle shortcut legend |
| Tab | Cycle between queue/preview/inspector focus |

## Responsive Strategy

**Desktop (1200px+):** Full three-column layout (Command) or three-panel layout (Review)
**Laptop (900-1200px):** Narrower columns, collapsible right panel
**Tablet (720-900px):** Two-column with slide-out inspector
**Mobile (< 720px):** Single column, card-based, swipe between items

Priority: Desktop and Laptop. This is primarily a Mac Mini + MacBook Pro interface. Mobile is a bonus for quick pulse checks, not the primary experience.
