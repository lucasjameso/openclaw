# Forge Claude/Codex Execution Contract

## Purpose

This is the working contract between Claude and Codex so Lucas does not have to translate between models.

It answers four questions:

1. Who owns what.
2. What each side must hand off.
3. What "done" means.
4. What gets built next.

## Non-Negotiable Principle

Forge wins when:

- Claude shapes strong content and clear operator decisions.
- Codex turns that into high-quality, validated, deployable outputs.

Forge loses when:

- both models touch the same problem from different angles without a contract
- visual quality is left to taste alone
- review decisions do not create downstream state transitions
- Lucas is forced to coordinate the machine manually

## Role Split

## Codex owns

- dashboard pages and routes in `src/pages/`
- review and render pipeline mechanics
- filesystem-heavy scripts
- HTML, PNG, PDF, and print/export systems
- Puppeteer and capture automation
- visual validators and screenshot tests
- dashboard deploys and route verification
- Gumroad/X/Kit plumbing and operational sync logic
- product/launch surfaces as software

## Claude owns

- all written content and content structure
- sequencing, campaign logic, and launch order
- review judgment and revision reasoning
- frontmatter and metadata discipline on content assets
- NotebookLM workflows
- offer framing and packaging logic
- morning brief and queue guidance
- content-side scripts where the core logic is editorial, not infrastructural

## Shared, with explicit split

### `push-state.js`

- Codex owns:
  - scanner behavior
  - renderer invocation
  - state schema
  - sorting and technical enrichment
- Claude owns:
  - business labels
  - launch relevance semantics
  - editorial meaning of status and grouping

### `render-review-to-html.js`

- Codex owns:
  - renderer engine
  - templates
  - print/output mechanics
  - file discovery
- Claude owns:
  - new content-type definitions
  - field expectations
  - content layout requirements when a new artifact type is introduced

### `OVERNIGHT-LOG.md`

- both append
- neither overwrites
- every entry should state:
  - what changed
  - where it lives
  - what is blocked
  - what the other model needs next

## Handoff Contract

## Claude must hand Codex

Before Codex should build or render an artifact, Claude must provide:

- artifact type
- title
- source lesson or strategic purpose
- target channel/account
- launch relevance
- paired asset or dependency if applicable
- required metadata/frontmatter
- what approval means for this asset

If those are missing, the asset is not truly specified yet.

## Codex must hand Claude

Before Claude should sequence or review an asset, Codex must provide:

- output path
- rendered/compiled format
- validator status
- preview route or screenshot path
- deploy or push-state receipt if applicable
- unresolved blockers

If those are missing, the asset is not truly shippable yet.

## Definition Of Done

An artifact is not done until all of the following are true:

1. The output file exists at the expected path.
2. The correct reviewable format exists.
3. Validation passed or the failure is explicitly logged.
4. The asset is visible in the right dashboard/review surface if applicable.
5. The log states what was built and what happens next.

## Premium Visual Standard

Visual work does not pass because it is "not bad."
It passes when it is:

- intentional
- legible at thumbnail size
- aligned cleanly
- platform-fit
- not generic
- not overloaded
- not dependent on luck

Any visual likely to trigger:

- "AI slop"
- "too corporate"
- "text not sized right"
- "alignment looks off"
- "wrong brand lane"

should fail before Lucas sees it.

That means the system needs:

- a validator
- constrained template families
- taste memory
- safe-zone rules

not more freeform experimentation.

## What Codex is taking responsibility for next

These are the next high-leverage Codex builds:

1. Review queue triage router.
2. Visual acceptance gate.
3. Approval-to-state-transition pipeline.
4. Dashboard execution-surface upgrades on `/review` and `/launchpad`.
5. Decision memory / lineage plumbing support.

This is the infrastructure lane: fewer bad assets, cheaper review, faster shipping.

## What Claude should take responsibility for next

These are the next high-leverage Claude builds:

1. Premium-design skill definition for visual briefs and review judgment.
2. Rejection taxonomy and revision-language standard.
3. Content metadata discipline for every asset entering review.
4. Morning brief system that compresses Lucas's daily decisions.
5. Offer packaging logic that turns approved assets into revenue bundles.

This is the editorial-operator lane: better briefs, clearer decisions, cleaner sequencing.

## Work Order For The Next Session

### Codex first

1. Build or spec the visual acceptance gate.
2. Build or spec the review queue triage router.
3. Define the approval state transition contract.

### Claude first

1. Stop writing vague premium-design language.
2. Produce a real skill spec with:
   - anti-patterns
   - approved visual systems
   - platform-specific rules
   - rejection examples
   - acceptable density/hierarchy rules
3. Define the revision taxonomy that can become machine-readable later.

## Communication Rule

If either model finishes something that changes the other model's next step, it must log:

- `Built:`
- `Path:`
- `Validated:`
- `Blocked by:`
- `Next for Claude:` or `Next for Codex:`

No prose fog. No implied handoff. No silent completion.
