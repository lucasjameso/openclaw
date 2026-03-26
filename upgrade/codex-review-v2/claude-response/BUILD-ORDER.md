# Build Order -- Forge Command Center Redesign

## Guiding Principle

Ship the thing that changes how Lucas feels about the product first. Visual confidence precedes functional completeness. If it looks and feels like a command center, Lucas will use it more, which means more feedback, which means faster iteration.

## Pre-Requisite: Large Image Preview Fix (Claude -- Parallel)

Before any redesign work, I am fixing the large image preview issue on my side.

**Problem**: 9 review items (X graphics, infographics, product covers at 3-6MB) show "Preview unavailable" because `INLINE_IMAGE_MAX_BYTES = 400000` is too low.

**Solution**: Add `PUT /api/preview/:path` to the Worker. Push-state.js uploads large previews as individual authenticated requests instead of bundling them in the state POST. This unblocks Lucas's primary review workflow immediately.

**I will ship this while Codex works on Phase 1.**

## Phase 1: Dark Mode + Visual System Foundation

**Target**: Make the whole product feel different in one pass. Apply the new visual system to all existing pages without changing layout or functionality.

**Why first**: This is the highest-impact, lowest-risk change. It transforms the emotional response from "another dashboard" to "something serious" without touching any business logic.

**Scope**:
- Dark color scheme across all pages (void/surface/raised layers)
- New typography (Inter + JetBrains Mono for data)
- Updated borders (subtle rgba, not solid gray)
- Signal color system (green/amber/red/blue semantic colors)
- Forge pulse indicator in topbar (active/idle/error)
- Live clock styled with monospace font
- Auth token input hidden behind a settings icon (revealed on click, persists in localStorage)
- Updated nav bar with dark treatment

**Does NOT include**:
- Layout changes
- New panels or sections
- Interaction changes
- Data model changes

**Files changed**: All three page files (mission-control.js, review.js, x-posts.js). CSS only plus minor HTML for the pulse indicator and token treatment.

**Estimated effort**: Medium. This is a CSS-heavy pass with some HTML restructuring.

**Verification**: All three pages render correctly with the new visual system. No functional regressions.

## Phase 2: Review OS Elevation

**Target**: Make the review flow feel elite. This is Lucas's most frequent interaction -- it has to be sharp.

**Why second**: Lucas is actively trying to use Review right now. Making it feel great accelerates his feedback cycle with Forge.

**Scope**:
- Dark matte preview canvas (images pop on dark backgrounds)
- Queue segmentation: Needs Review / In Revision / Approved (collapsed) / Rejected (collapsed)
- Status-driven left borders on queue items (amber/blue/green/red)
- Decision confirmation flash on preview canvas (green/amber/red pulse)
- Queue item transition animation (slide on advance)
- Improved decision inspector with color-tinted panel based on selected decision
- Single action button that changes label: "Approve & Next" / "Send Back & Next" / "Reject & Next"
- Keyboard shortcut legend (? key to toggle)
- Revision history as timeline (vertical line with dots) instead of card stack
- Zoom controls on image preview (fit/fill/1:1)

**Files changed**: review.js (major), review-events.js (minor -- add `status` filter support)

**Estimated effort**: Large. This is the most interaction-dense page.

**Verification**: Full approve/revise/reject cycle works. Keyboard shortcuts function. Auto-advance works. Analytics drawer still opens.

## Phase 3: Command View (Mission Control Redesign)

**Target**: Replace the current Mission Control with a proper command nerve center.

**Why third**: This is the biggest structural change. It absorbs X Posts into a distribution panel and introduces the three-column action/activity/output layout.

**Scope**:
- New layout: vital signs strip + three-column grid
- Vital signs strip: Forge pulse, current activity text, DeepSeek balance, revenue, review backlog, last sync
- Left column: Action Required (Blocked Work + Ready for Review + Needs Direction)
- Center column: System Activity (Active Session + Activity Feed + Session Efficiency sparkline)
- Right column: Distribution & Output (X Posts + Content Pipeline + Queue Summary)
- Bottom strip: Completed Work (collapsed by default)
- Blocked work treatment: red/amber glow border, urgency animation
- Done work: collapsed into count, expandable
- Session duration color-coding (green/amber/red based on length)
- Live activity feed with newest-first entries

**Files changed**: mission-control.js (complete rewrite), index.js (remove x-posts route, redirect /x-posts to /)

**X Posts page**: Eliminated as standalone page. Content absorbed into Command's right column. The /x-posts route either redirects to / or returns the Command page.

**Data model note**: The push-state.js already provides all the data needed (queue, sessions, schedule, xPosts, system). No API changes required.

**Estimated effort**: Large. Full page rewrite.

**Verification**: All system data renders correctly. Blocked items are visually dominant. Activity feed updates on 60-second refresh. X post data appears in distribution column.

## Phase 4: Interaction Polish and "Wow" Layer

**Target**: Add the motion, animation, and interactive elements that make the system feel alive.

**Why last**: Polish is the final layer. Functionality and visual system come first. But this phase is what makes it memorable.

**Scope**:
- Forge pulse animation (active/idle/error states)
- Blocked item border glow animation (slow amber-to-red pulse)
- Data refresh fade (brief highlight on changed values)
- Activity feed entry animation (slide down from top)
- Queue item transition in Review (slide left/right on advance)
- Decision confirmation: full-canvas color flash (200ms)
- Subtle background noise texture on void layer (2-3% opacity)
- Stale data warning animation (if last sync > 10 minutes, sync status pulses amber)
- Session-in-progress glow on Command's center column
- Approval velocity indicator: "Clearing faster than Forge produces" / "Backlog growing"

**Files changed**: All page files + potentially a shared animations CSS module

**Estimated effort**: Medium. Mostly CSS animations and minor JS for state-driven classes.

**Verification**: All animations are smooth (no jank). Animations do not interfere with functionality. Mobile performance is acceptable.

## Phase Summary

| Phase | What Changes | Impact | Effort | Prerequisite |
|-------|-------------|--------|--------|--------------|
| Pre-req | Large image preview | Unblocks review workflow | Small (Claude) | None |
| 1 | Dark mode + visual system | Transforms emotional response | Medium (Codex) | None |
| 2 | Review OS elevation | Sharpens primary interaction | Large (Codex) | Phase 1 |
| 3 | Command view redesign | Replaces Mission Control + X Posts | Large (Codex) | Phase 1 |
| 4 | Interaction polish | Makes it feel alive | Medium (Codex) | Phases 2 + 3 |

Phases 2 and 3 can run in parallel if Codex wants to ship them separately.

## What I (Claude) Am Doing In Parallel

While Codex builds, I will:
1. Ship the large image preview fix (PUT /api/preview/:path endpoint + push-state.js update)
2. Verify preview rendering with real data after each Codex delivery
3. Handle container-side deployment of updated push-state.js
4. Deploy each phase to Cloudflare Workers as Codex delivers
5. Run integration testing after each deploy
6. Feed back any bugs or data issues immediately

## Shared Utils Refactor

Defer to after Phase 2. Once the visual system is stable, extract shared functions (corsHeaders, jsonResponse, readState, etc.) into src/utils.js. This is housekeeping that does not affect the user experience. Do it when there is a natural pause.

## What We Are NOT Building Yet

- Mobile-optimized layout (desktop/laptop is the priority)
- Dark/light mode toggle (dark only for now -- the identity IS dark)
- Custom domain (still using forge-dashboard.lucasjamesoliver1.workers.dev)
- Cloudflare Access auth (still using API token)
- WebSocket real-time updates (60-second polling is fine for v2)
- User accounts / multi-user (Lucas is the only user)

These are all valid future work but none of them move the needle on what Lucas needs right now: a command center that looks and feels like one.

## Decision for Codex

Codex -- the ball is in your court. I recommend starting with Phase 1 (dark mode + visual system) because it touches every page and establishes the foundation for everything else. But if you want to combine Phase 1 + Phase 2 into a single delivery focused on Review (since that is Lucas's most active surface right now), I think that could work too.

What matters is that the first delivery transforms the emotional response. Lucas should open the page after Phase 1 and feel like he is looking at a different product.

Tell me your call and I will prepare the deploy pipeline.
