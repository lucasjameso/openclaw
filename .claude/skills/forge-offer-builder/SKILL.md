---
name: forge-offer-builder
description: Converts a solved pain or proven workflow into a concrete offer definition with promise, proof, pricing, delivery model, and onboarding. Use when a revenue opportunity is ready to be packaged for sale or test.
---

# forge-offer-builder

## Engine Note

Offers are written as markdown files in `data/workspace/offers/`.
The scorecard engine reads them automatically.

When an offer is ready for review, package it:
```bash
cd /Users/lucas/Forge/openclaw/tools
python3 -m forge_ops review package \
  --artifact data/workspace/offers/offer-<slug>.md \
  --task-id T-xxx \
  --title "Offer: <name>" \
  --metric "first sale or signup"
```

Check active offers in scorecards:
```bash
python3 -m forge_ops scorecard daily --json | python3 -c "import json,sys; d=json.load(sys.stdin); print('active_offers:', d['active_offers'])"
```

Use this skill when converting a revenue opportunity into an actual offer that can be tested or sold.

---

## Before Building the Offer

Confirm the following before writing anything:

1. Is there evidence of demand? (conversations, searches, pain signals)
2. Has Forge actually solved this problem at least once?
3. Is the delivery burden light enough to be sustainable?
4. Is there a clear recurring or repeat dimension?

If demand evidence is weak, create an experiment first using `forge-experiment-runner`.

---

## Offer Definition File

Write offer definitions to:
```
data/workspace/offers/offer-<slug>.md
```

```markdown
# Offer: <slug>
Date created: YYYY-MM-DD
Status: draft | active | paused | retired
Lane: service | productized_asset | subscription_monitoring

## One-Line Promise
<What the buyer gets and why it matters -- 15 words or less>

## Who It Is For
<Specific audience description -- not "anyone" or "businesses">

## The Problem It Solves
<One paragraph on the pain this removes>

## What Is Delivered
<Concrete deliverables -- list format>

## Proof
<Why this is credible: built something similar, past result, demo output>

## Pricing
- Price: $<amount> or free/lead magnet
- Billing: one-time | monthly | per-deliverable
- Trial or sample: <yes/no and what>

## Delivery Model
- How it is delivered: <file download, dashboard access, Slack, email, etc.>
- Time to deliver: <hours/days after purchase>
- Ongoing maintenance: <none | light | heavy>

## Onboarding
<What happens immediately after purchase -- first 5 minutes>

## Recurring Logic (if applicable)
<What brings the buyer back every month>

## First Test
<Smallest thing that validates this offer without full build>

## Risks
<Top 2-3 things that could cause this to fail>
```

---

## After Writing

1. Place the offer file in `data/workspace/offers/`
2. If the offer requires a landing page, product page, or PDF: create those as READY tasks in QUEUE.json
3. If the offer is ready to test: tag it `requires_review: true` and run `forge-review-packager`
