# Forge Advisor Spec

Updated: 2026-03-25

## Purpose

Forge Advisor is a customer-facing guidance product built from Forge's real operating history.

It is not the same thing as Forge's internal autonomous worker.

- Internal Forge runtime:
  - primary model can stay DeepSeek for cost efficiency
  - quality bar is internal
  - mistakes are recoverable

- Forge Advisor:
  - must use stronger models for customer trust
  - must meter real usage transparently
  - must cite Forge precedent when claiming "this is what we did"
  - must never surprise customers on limits or cost

This document replaces the old flat `$29-49/month unlimited-ish` idea from the earlier content strategy draft.

## Verified Model Inputs

Verified on 2026-03-25 from Anthropic's public pricing and model pages:

- Claude Sonnet 4.6
  - release date: February 17, 2026
  - API model id: `claude-sonnet-4-6`
  - input: `$3 / MTok`
  - output: `$15 / MTok`
  - prompt caching read: `$0.30 / MTok`
  - source:
    - [Anthropic Sonnet page](https://www.anthropic.com/claude/sonnet)
    - [Anthropic pricing page](https://claude.com/pricing)

- Claude Opus 4.6
  - release date: February 5, 2026
  - API model id: `claude-opus-4-6`
  - input: `$5 / MTok`
  - output: `$25 / MTok`
  - prompt caching read: `$0.50 / MTok`
  - source:
    - [Anthropic Opus 4.6 announcement](https://www.anthropic.com/news/claude-opus-4-6)
    - [Anthropic pricing page](https://claude.com/pricing)

Important note:

- Older Anthropic docs pages still list historical `Opus 4` and `Opus 4.1` pricing at `$15 / $75`.
- Current public pricing page lists `Opus 4.6` at `$5 / $25`.
- For this spec, use the current `Opus 4.6` pricing from the live pricing page as the source of truth.

## Product Rule

Forge Advisor should route customer requests like this:

- default model: `claude-sonnet-4-6`
- escalation model: `claude-opus-4-6`
- never route customer answers to DeepSeek

Why:

- Sonnet 4.6 is strong enough for the majority of setup, review, and troubleshooting questions.
- Opus 4.6 should be reserved for harder architecture, debugging, migration, and edge-case reasoning.
- This keeps quality high without turning the unit economics into a mess.

## Working Usage Assumption

We need a planning baseline for "what is one typical Advisor question worth?"

Recommended v1 planning profile:

- standard Advisor request:
  - input: `10,000` tokens
  - output: `2,000` tokens

Why this is the right planning assumption:

- user question
- short conversation history
- retrieved Forge context chunks
- answer with concrete guidance and citations

This is deliberately not the absolute minimum. It leaves room for:

- retrieval context
- source citations
- slightly longer answers than chat support fluff

Important refinement:

- this `10k in / 2k out` profile is intentionally conservative for pricing and margin planning
- early real-world usage will likely be lighter for many customers:
  - common short-form setup question:
    - input: `6,000` tokens
    - output: `1,500` tokens
- that means the paid tiers are likely slightly more generous in practice than the advertised standard-answer estimate
- this is good:
  - the business plans conservatively
  - the customer feels like they got more value than the headline estimate

### Cost Per Standard Answer

Using `10k in / 2k out`:

- Sonnet 4.6
  - input cost: `10,000 / 1,000,000 * $3 = $0.03`
  - output cost: `2,000 / 1,000,000 * $15 = $0.03`
  - total: `$0.06`

- Opus 4.6
  - input cost: `10,000 / 1,000,000 * $5 = $0.05`
  - output cost: `2,000 / 1,000,000 * $25 = $0.05`
  - total: `$0.10`

### Useful Range

For planning, think in three buckets:

- light:
  - `4k in / 800 out`
  - Sonnet: `$0.024`
  - Opus: `$0.040`

- standard:
  - `10k in / 2k out`
  - Sonnet: `$0.060`
  - Opus: `$0.100`

- heavy:
  - `25k in / 4k out`
  - Sonnet: `$0.135`
  - Opus: `$0.225`

### Practical Interpretation

Use the buckets like this:

- pricing math and margin review:
  - use `10k in / 2k out`
- early customer expectation setting:
  - communicate rough answer counts conservatively
- internal forecasting:
  - assume a meaningful share of real questions will land closer to `6k in / 1.5k out`

Do not advertise the lighter profile as the entitlement.

Use it as upside.

## Recommended V1 Pricing

Do not sell "unlimited."

Sell included monthly model usage with transparent pools and visible remaining balance.

### Tier 0: Free

- price: `$0 / month`
- audience:
  - people discovering Forge from X or shared links
  - prospects who want to test the answer quality before paying
- model access:
  - Sonnet 4.6 only
- included monthly pool:
  - Sonnet input: `50,000`
  - Sonnet output: `10,000`
- included model cost:
  - `$0.30`
- gross margin before infra/support:
  - negative by design on model cost alone
- rough standard-answer equivalent:
  - about `5` standard Sonnet questions
- role in funnel:
  - free content -> free Advisor trial -> Starter

### Tier 1: Starter

- price: `$19 / month`
- audience:
  - early builders
  - setup questions
  - occasional troubleshooting
- model access:
  - Sonnet 4.6 only
- included monthly pool:
  - Sonnet input: `1,000,000`
  - Sonnet output: `200,000`
- included model cost:
  - `$6.00`
- gross margin before infra/support:
  - `68.4%`
- rough standard-answer equivalent:
  - about `100` standard Sonnet questions
  - likely more like `130-150` lighter real-world answers for short early conversations

### Tier 2: Builder

- price: `$49 / month`
- audience:
  - active builders
  - regular config and architecture iteration
  - ongoing troubleshooting
- model access:
  - Sonnet 4.6 default
  - limited Opus 4.6 access with explicit user opt-in per answer
- included monthly pool:
  - Sonnet input: `2,000,000`
  - Sonnet output: `400,000`
  - Opus input: `500,000`
  - Opus output: `100,000`
- included model cost:
  - Sonnet pool: `$12.00`
  - Opus pool: `$5.00`
  - total: `$17.00`
- gross margin before infra/support:
  - `65.3%`
- rough standard-answer equivalent:
  - about `200` standard Sonnet questions
  - plus about `50` standard Opus escalations
  - likely materially more Sonnet answers for lighter real-world usage

### Tier 3: Operator

- price: `$99 / month`
- audience:
  - production operators
  - real architecture decisions
  - complex debugging
  - higher urgency and deeper answers
- model access:
  - Sonnet 4.6 default
  - full Opus 4.6 access within included pool, still presented as an explicit user choice per answer
- included monthly pool:
  - Sonnet input: `3,000,000`
  - Sonnet output: `600,000`
  - Opus input: `1,500,000`
  - Opus output: `300,000`
- included model cost:
  - Sonnet pool: `$18.00`
  - Opus pool: `$15.00`
  - total: `$33.00`
- gross margin before infra/support:
  - `66.7%`
- rough standard-answer equivalent:
  - about `300` standard Sonnet questions
  - plus about `150` standard Opus answers

## Why This Pricing Works Better Than A Flat Plan

It satisfies the real constraints:

- accessible:
  - Free creates a no-friction try path
  - Starter gives real value without forcing a `$49+` commitment

- cost-covered:
  - each tier has explicit included model cost

- margin-preserving:
  - each tier clears the user's requested `>=60%` model margin

- transparent:
  - tokens and model used can be shown on every answer

- scalable:
  - heavy users either upgrade or buy add-ons instead of quietly destroying margins

## What Customers Should See

Every customer answer should expose:

- model used
  - `Claude Sonnet 4.6` or `Claude Opus 4.6`
- input tokens used
- output tokens used
- cached prompt tokens used, if applicable
- cost of this answer
- monthly pool used and remaining
- what happens next if they run out

Example footer:

`Answered with Claude Sonnet 4.6 | 8,412 input | 1,604 output | $0.049 this answer | 412,000 / 1,200,000 tokens remaining this month`

The UI should also show:

- current plan
- next reset date
- booster/add-on option
- hard stop behavior once included usage is exhausted

No hidden overages by default.

Source citations should not be buried in an expandable "details" drawer.

The UI should render them prominently under the answer, especially when the answer claims `forge_precedent`.

## Limit Behavior

Recommended limit policy:

- included usage runs down in real time
- when user is near limit:
  - show warnings at `75%`, `90%`, and `100%`
- at `100%`:
  - do not silently bill overages
  - default behavior is:
    - block new answers
    - offer add-on pack purchase
    - or wait until monthly reset

Recommended add-on direction:

- Sonnet booster
- Opus booster
- mixed booster for Builder/Operator

But booster pricing can wait until launch prep.

## Advisor Knowledge Base Design

Forge Advisor should not just be "Claude with a vague prompt."

It needs a structured knowledge base with source provenance.

### Source Categories

#### 1. Forge Precedent

High-trust sources that describe what Forge actually did:

- `AGENTS.md` evolution
- queue schema drafts
- architecture decisions
- dashboard implementation notes
- memory snapshots after sanitization
- review workflow decisions
- `agent-lessons.json`

These are valid for answers like:

- "here's the contract Forge used"
- "here's the schema we ran"
- "here's the routing rule we adopted"

#### 2. Forge Voice / Framing

Use for tone and product positioning, not factual claims:

- `CONTENT-PILLAR-BRIEF.md`

This should influence:

- phrasing
- confidence level
- honest operator tone

It should not be treated as technical truth.

#### 3. General External Knowledge

Use only when Forge has no direct precedent.

When used:

- label it as general recommendation
- do not present it as "what Forge did"

## Answer Contract

Every Advisor answer should internally classify itself as one of these:

- `forge_precedent`
  - answer is grounded in specific Forge docs or configs

- `forge_inference`
  - answer is inferred from Forge patterns but not directly spelled out

- `general_guidance`
  - answer is standard best practice, not a Forge-specific precedent

If the answer is not `forge_precedent`, say so clearly.

This is the trust mechanism.

## Architecture

Recommended v1 stack:

- Cloudflare Worker
  - public Advisor API
  - session orchestration
  - model routing

- Anthropic API
  - `claude-sonnet-4-6`
  - `claude-opus-4-6`

- Cloudflare D1
  - subscriptions
  - monthly usage ledger
  - conversations
  - messages
  - answer-level cost records

- Cloudflare KV
  - fast monthly counters
  - rate limits
  - short-lived cache for plan state

- Cloudflare R2
  - sanitized source snapshots
  - ingestion artifacts
  - exported knowledge bundles

- Cloudflare Vectorize
  - embedded knowledge chunks
  - similarity search by source type and recency

- Scheduled ingest worker
  - imports fresh Forge knowledge on a cadence
  - sanitizes
  - chunks
  - embeds
  - reindexes

### Recommended Data Tables

#### `advisor_customers`

- `id`
- `email`
- `stripe_customer_id`
- `plan`
- `status`
- `billing_anchor_at`

#### `advisor_usage_monthly`

- `customer_id`
- `month_key`
- `sonnet_input_tokens`
- `sonnet_output_tokens`
- `opus_input_tokens`
- `opus_output_tokens`
- `cached_input_tokens`
- `billable_cost_usd`

#### `advisor_usage_events`

- `id`
- `customer_id`
- `conversation_id`
- `answer_id`
- `model`
- `input_tokens`
- `output_tokens`
- `cached_input_tokens`
- `cost_usd`
- `created_at`

#### `advisor_conversations`

- `id`
- `customer_id`
- `title`
- `created_at`
- `updated_at`

#### `advisor_messages`

- `id`
- `conversation_id`
- `role`
- `content`
- `model`
- `sources_json`
- `input_tokens`
- `output_tokens`
- `cost_usd`
- `created_at`

#### `advisor_kb_documents`

- `id`
- `source_path`
- `source_type`
- `source_date`
- `visibility`
- `sha256`
- `sanitized_text`
- `metadata_json`

#### `advisor_kb_chunks`

- `id`
- `document_id`
- `chunk_index`
- `chunk_text`
- `embedding_id`
- `tags_json`

## Retrieval And Routing Flow

### Ingestion

1. Pull new Forge source files from approved directories.
2. Sanitize:
   - remove secrets
   - remove private URLs
   - remove API keys
   - remove private balances
   - remove unsafe file paths where needed
3. Chunk by semantic section.
4. Tag:
   - `source_type`
   - `topic`
   - `date`
   - `confidence`
   - `visibility`
5. Write raw sanitized docs to R2.
6. Write chunk metadata to D1.
7. Write embeddings to Vectorize.

### Request Handling

1. Authenticate customer.
2. Load plan and remaining pool.
3. Classify request:
   - simple setup
   - troubleshooting
   - architecture
   - config review
   - high-risk production question
4. Retrieve relevant Forge chunks.
5. Route model:
   - Sonnet by default
   - Opus only when allowed by plan and explicitly selected by user
6. Generate answer with citations.
7. Record token usage and cost.
8. Return answer plus transparency footer.

### Escalation Rules To Opus

Opus should not silently consume a customer's premium pool.

Default behavior:

- classify whether the question appears to benefit from deeper reasoning
- if yes:
  - show a user-visible prompt such as:
    - "This question might benefit from deeper reasoning. Use Opus for this answer?"
  - explain that this uses Opus tokens from the monthly pool
- if user declines:
  - answer with Sonnet
- if user plan does not include Opus:
  - explain that the question may benefit from Opus-level reasoning
  - offer upgrade path to Builder or Operator

Signals that should trigger the Opus recommendation prompt:

- context package is large
- question spans architecture plus debugging plus migration
- user explicitly asks for highest-quality reasoning
- answer risk is high
- Sonnet first pass signals uncertainty

Otherwise use Sonnet and do not ask.

## Pricing-Safe Prompt Design

To keep the unit economics healthy:

- do not dump all Forge memory into every request
- always retrieve a small relevant set of chunks
- cache the stable system prompt and source-policy instructions
- summarize long conversations aggressively
- prefer source citations over giant raw context dumps

Prompt caching matters a lot here.

If the static instruction block and source-policy block are cached, effective input cost falls sharply:

- Sonnet cache read: `$0.30 / MTok`
- Opus cache read: `$0.50 / MTok`

That improves margin without weakening answer quality.

### Conversation Summarization Policy

This is not optional.

Without aggressive summarization, a long conversation can destroy margins through cumulative history replay.

Recommended policy:

- keep the last `3` message turns as full text
- replace older history with a rolling conversation summary
- target summary size:
  - about `500` tokens
- refresh the summary every `5` messages
- preserve:
  - goals
  - important config details
  - unresolved questions
  - confirmed constraints
- discard:
  - redundant back-and-forth phrasing
  - stale dead ends
  - duplicated citations already captured in summary

This keeps context quality high while limiting token creep on Builder and Operator conversations.

## Security And Privacy Rules

Advisor knowledge must be curated, not raw.

Never expose:

- API keys
- auth tokens
- private internal URLs
- private balances
- sensitive customer data
- exploitable infrastructure details

Allowed:

- sanitized config patterns
- queue schema structure
- architecture decisions
- lessons learned
- cost tradeoff explanations
- review system mechanics

This follows the same public/private line already defined in the Forge content pillar.

## Product Positioning

Forge Advisor's edge is not "ask Claude anything."

The edge is:

- real operating receipts
- real failure patterns
- real cost tradeoffs
- real configs and decision rules
- a system that says when it is giving precedent vs inference

That is the product.

## Recommended Launch Copy Direction

Do not position it as:

- unlimited AI consulting
- generic chatbot support
- magical autonomous agent guru

Position it as:

- "Ask the system that already paid for the mistakes"
- "Operator-grade answers from a live autonomous workflow"
- "Know exactly which model answered, what it cost, and what usage you have left"

## Decision Summary

Recommended launch posture:

- Free: `$0`
- Starter: `$19`
- Builder: `$49`
- Operator: `$99`
- Sonnet default
- Opus premium
- no silent overages
- visible monthly usage
- source-grounded answers
- knowledge base grows from sanitized Forge history

## Next Build Steps

When this moves from spec to implementation:

1. build sanitized ingest pipeline
2. define D1 schema and migration
3. define `/api/advisor/chat`
4. define `/api/advisor/usage`
5. implement model router
6. wire Stripe plans and add-ons
7. log answer-level cost and source citations
8. ship usage meter UI before public launch
9. ship an Advisor landing page with pricing, transparency promises, and a `Try 5 free questions` CTA

## Ingestion Cadence

The ingest worker should not run on a vague schedule.

Recommended cadence:

- daily:
  - `AGENTS.md`
  - queue schema and queue-contract docs
  - dashboard state snapshots
  - architecture/config references that change frequently

- weekly:
  - memory files after sanitization
  - `agent-lessons.json`
  - review analytics summaries
  - older operational summaries that benefit from stabilizing before ingestion

- on-demand:
  - whenever a major architecture change ships
  - whenever queue fields or agent rules materially change
  - whenever a new public-facing lesson or product artifact becomes part of Forge precedent

The goal:

- keep the knowledge base fresh enough to be useful
- avoid over-indexing on noisy transient state
- favor stable precedent over momentary chatter
