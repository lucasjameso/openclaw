---
name: revenue-tracking
description: Tracks revenue and key metrics across Gumroad, ElevenLabs, and ConvertKit (Kit). Aggregates sales data, subscriber counts, and product performance into a single dashboard report. Use when checking revenue, sales numbers, subscriber growth, product performance, or financial metrics for Build What Lasts and IAC Solutions.
user-invocable: true
metadata: {"openclaw.requires": {"env": ["N8N_BASE_URL", "N8N_API_KEY", "SLACK_WEBHOOK_FORGE_ALERTS"]}}
---

# Revenue Tracking

Aggregates revenue and engagement metrics from Gumroad (product sales), ElevenLabs (voice/audio products), and ConvertKit/Kit (email subscribers and sequences) into a unified report.

## Context

- Gumroad: Build What Lasts products (playbooks, templates, digital products)
- ElevenLabs: Audio content products
- ConvertKit (Kit): Email list, sequences, subscriber metrics
- All revenue feeds into IAC Solutions LLC (Wyoming entity)
- Report destination: #forge-alerts Slack channel

## Behavior

1. Call the n8n revenue aggregation webhook: `${N8N_BASE_URL}/webhook/openclaw/revenue-snapshot` with Bearer auth (`N8N_API_KEY`)
2. Parse the JSON response containing data from all three platforms
3. Calculate:
   - Total revenue today, this week, this month, all-time
   - Revenue by platform (Gumroad, ElevenLabs, Kit)
   - Revenue by product (individual product breakdown)
   - Subscriber count and growth rate (Kit)
   - Top-performing product by revenue and by units sold
   - Week-over-week and month-over-month growth percentages
4. Compare against targets if targets are defined in `~/Forge/openclaw/data/revenue-targets.json`
5. Format the report
6. Post to #forge-alerts Slack channel
7. Append daily snapshot to `~/Forge/openclaw/logs/revenue/YYYY-MM-DD.json` for historical tracking

## Output Format

```
REVENUE REPORT | {date}

TOTAL REVENUE:
  Today:      ${today}
  This Week:  ${week} ({wow_change}% WoW)
  This Month: ${month} ({mom_change}% MoM)
  All-Time:   ${all_time}

BY PLATFORM:
  Gumroad:     ${amount} ({percentage}%)
  ElevenLabs:  ${amount} ({percentage}%)
  Kit:         ${amount} ({percentage}%)

TOP PRODUCTS:
  1. {product_name} -- ${revenue} ({units} sold)
  2. {product_name} -- ${revenue} ({units} sold)
  3. {product_name} -- ${revenue} ({units} sold)

SUBSCRIBERS (Kit):
  Total:    {count}
  New Today: +{count}
  Growth:   {rate}% weekly

{TARGET STATUS if targets defined}
  Monthly Target: ${target}
  Current:        ${current} ({percentage}% to target)
```

## Error Handling

- If n8n webhook returns non-200: report partial data from cached files, note which platforms failed
- If revenue-targets.json does not exist: skip target comparison, note "no targets set"
- If any platform returns zero data: flag as potential API issue, do not assume zero revenue
- If historical log directory does not exist: create `~/Forge/openclaw/logs/revenue/` and initialize
