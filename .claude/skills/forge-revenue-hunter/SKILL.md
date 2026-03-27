---
name: forge-revenue-hunter
description: Generates and ranks monetization opportunities for Forge across all four revenue lanes. Produces a scored opportunity list with speed-to-test, reversibility, likely value, delivery burden, and recurring potential. Use when refilling the revenue pipeline or running a planning cycle.
---

# forge-revenue-hunter

Use this skill to surface and rank real monetization opportunities based on Forge's current capabilities and market position.

---

## Context To Read First

Before generating opportunities, read:
1. `data/workspace/MISSION.md` -- current strategic direction
2. `data/workspace/offers/` -- what offers already exist (avoid duplication)
3. `data/workspace/experiments/` -- what has already been tested
4. `data/workspace/lessons/` -- what has failed before
5. Recent scorecards for current revenue movement

---

## Four Revenue Lanes

Every opportunity must be tagged to one lane:

- **service**: direct value delivery to a client (monitoring, QA, content systems, automation)
- **productized_asset**: a sellable artifact (template, checklist, guide, skill pack, dashboard kit)
- **subscription_monitoring**: recurring value delivery (reporting, niche intelligence, monitoring)
- **distribution**: audience growth that feeds future revenue (X content, lead magnets, case studies)

---

## Opportunity Scoring Criteria

Score each opportunity 1-5 on each dimension:

| Dimension | 1 | 5 |
|-----------|---|---|
| Speed to test | Months | Days |
| Reversibility | Hard to undo | Fully reversible |
| Likely value | Low | High |
| Delivery burden | Heavy | Light |
| Recurring potential | One-time | Monthly |

Calculate a total score (max 25). Sort descending.

---

## Output Format

Write opportunities to:
```
data/workspace/research/opportunities-YYYY-MM-DD.md
```

```markdown
# Revenue Opportunities: YYYY-MM-DD

## Top Opportunities

### 1. <Opportunity Name> | Lane: <lane> | Score: <X>/25
- What it is: <one sentence>
- Who it is for: <specific audience>
- Speed to test: <X days>
- Reversible: <yes/no>
- Delivery burden: <light/medium/heavy>
- Recurring potential: <yes/no and how>
- Revenue hypothesis: <what you believe and why>
- Next concrete action: <specific deliverable to validate this>

### 2. ...
```

---

## Heuristics

When generating opportunities, apply these rules:
- Narrow offers outperform broad "AI help"
- Solved pains should become products
- Recurring value works best when monthly maintenance is light
- Content should support demand generation, not exist as vanity output
- Productized assets should start as things Forge has already done or could do in one session

Do not include opportunities that:
- Require capabilities Forge does not have
- Are already active in offers/
- Were failed experiments in the last 30 days without a new angle

---

## After Writing

Add the top 2-3 opportunities as READY tasks in QUEUE.json if they are not already queued.
Tag tasks with `lane` and `revenue_hypothesis` fields.
