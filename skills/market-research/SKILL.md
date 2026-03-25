---
name: market-research
description: Conducts market research including competitor analysis, pricing benchmarks, and industry trend analysis for Build What Lasts products and Ridgeline Intelligence. Use when researching competitors, comparing pricing, analyzing market positioning, evaluating product-market fit, or preparing go-to-market data.
user-invocable: true
metadata: {"openclaw.requires": {"env": []}}
---

# Market Research

Structured research skill for competitor analysis, pricing benchmarks, and industry positioning. Supports both Build What Lasts (books, playbooks, digital products) and Ridgeline Intelligence (SaaS for specialty trade contractors).

## Context

- Build What Lasts: Leadership and systems content brand (buildwhatlasts.app)
- Ridgeline Intelligence: Full web application platform for specialty trade contractors (CRM, project management, job tracking, scheduling, estimating + BI analytics bolt-on)
- IAC Solutions: Parent entity (iac-solutions.io)
- Key competitors vary by product line

## Behavior

1. Receive research request with target category:
   - "book" = CLARITY and leadership book market
   - "digital-products" = Playbooks, templates, courses in the B2B/leadership space
   - "saas" = Ridgeline competitors (specialty trade contractor software)
   - "general" = Open-ended market research
2. For the target category, execute the appropriate research template:

### Book Research Template
1. Search for comparable titles in the leadership/construction/systems niche
2. Collect: title, author, price points (Kindle, paperback, hardcover), Amazon BSR, review count, publication date
3. Analyze pricing distribution (what is the median, what is premium positioning)
4. Identify gaps in the market that CLARITY fills
5. Note marketing tactics used by top performers (launch strategy, review solicitation, category selection)

### Digital Products Research Template
1. Search Gumroad, Teachable, and direct-sale sites for comparable products
2. Collect: product name, creator, price, platform, estimated sales (if visible), content type
3. Map pricing tiers across the market
4. Identify underserved niches

### SaaS Research Template
1. Search for specialty trade contractor software platforms
2. Collect: company name, pricing tiers, feature set, target market, funding status, review scores (G2, Capterra)
3. Build feature comparison matrix against Ridgeline's capabilities
4. Identify pricing floor and ceiling in the market
5. Note integration capabilities (QuickBooks, payroll, estimating tools)

### General Research Template
1. Accept free-form research query
2. Structure findings into: market size, key players, trends, opportunities, risks
3. Cite all sources

3. Format findings into structured report
4. Save report to `~/Forge/openclaw/data/research/YYYY-MM-DD-{topic}.md`
5. Post summary to #forge-alerts if triggered autonomously

## Output Format

```
MARKET RESEARCH | {category} | {date}

EXECUTIVE SUMMARY:
{2-3 sentence overview of key findings}

COMPETITIVE LANDSCAPE:
  {competitor_1}: {key_data_points}
  {competitor_2}: {key_data_points}
  {competitor_3}: {key_data_points}

PRICING ANALYSIS:
  Market Floor:   ${low}
  Market Median:  ${median}
  Market Ceiling: ${high}
  Lucas's Price:  ${current} ({positioning: budget|mid|premium})

KEY INSIGHTS:
  1. {insight}
  2. {insight}
  3. {insight}

RECOMMENDATIONS:
  1. {actionable recommendation}
  2. {actionable recommendation}

SOURCES:
  - {source_url or reference}
```

## Error Handling

- If web search returns limited results: note the data gap, do not fabricate competitor data
- If pricing data is unavailable: mark as "not publicly listed" rather than estimating
- If research directory does not exist: create `~/Forge/openclaw/data/research/`
- Always flag when data is older than 90 days as potentially outdated
