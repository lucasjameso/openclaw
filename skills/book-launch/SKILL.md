---
name: book-launch
description: CLARITY book launch countdown and metrics tracker
user-invocable: true
---

# Book Launch Tracker

Track the CLARITY book launch progress. Currently uses static data with plans to
connect to n8n for live metrics in v2.

## Key Dates and Targets

- **Launch date:** April 17, 2026
- **LinkedIn followers current:** 6,100
- **LinkedIn followers target:** 10,000 by December 31, 2026
- **Pre-order status:** tracking (static for now)

## Behavior

1. Calculate days remaining until April 17, 2026
2. Calculate LinkedIn follower gap (target minus current)
3. Calculate required weekly follower growth rate to hit target by Dec 31, 2026
4. Format as a clean progress report
5. Optionally post to #book-launch channel if requested

## Output Format

```
CLARITY Launch Tracker
----------------------
Days until launch: {days}
Launch date: April 17, 2026

LinkedIn Growth:
  Current: 6,100 followers
  Target: 10,000 by Dec 31, 2026
  Gap: {gap} followers
  Required pace: ~{weekly_rate}/week

Pre-order Status: {status}
```

## v2 Plans

- Pull live LinkedIn follower count via n8n webhook
- Track pre-order numbers from publisher API via n8n
- Weekly trend charts posted to #book-launch
