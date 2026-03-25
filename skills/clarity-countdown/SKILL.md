---
name: clarity-countdown
description: Daily CLARITY book launch readiness check and countdown tracker. Monitors all launch workstreams, flags blockers, and reports status. Activates on any mention of CLARITY launch, book launch status, launch readiness, countdown, or April 17 2026 prep.
user-invocable: true
metadata: {"openclaw.requires": {"env": ["SLACK_WEBHOOK_URL"]}}
---

# CLARITY Launch Countdown

Tracks the CLARITY: Kill the Hero book launch (April 17, 2026) across all workstreams. Runs daily readiness checks, flags blockers, and posts countdown status to #book-launch Slack channel.

## Context

- Book: CLARITY: Kill the Hero (Book 1 of Build What Lasts series)
- Author: Lucas Oliver
- Launch Date: April 17, 2026
- Formats: Kindle ($9.99), Paperback ($19.99), Hardcover ($27.99)
- Distribution: KDP + IngramSpark with own Bowker ISBNs
- Publisher: HMD (handles KDP setup + 90-day marketing)
- Cover Designer: Allie (Lucas's sister)
- Editors: Ashleigh and Al

## Behavior

1. Calculate days remaining until April 17, 2026
2. Check each workstream against its readiness criteria:

   **Cover Files Workstream:**
   - KDP Paperback cover: received / not received
   - KDP Hardcover cover: received / not received
   - IngramSpark Paperback cover: received / not received
   - IngramSpark Hardcover Dust Jacket cover: received / not received
   - All files in Dropbox delivery folder: yes / no

   **Manuscript Workstream:**
   - Final manuscript approved: yes / no
   - Editorial feedback from Ashleigh incorporated: yes / no
   - Editorial feedback from Al incorporated: yes / no
   - Pre-publisher proof audit complete: yes / no

   **Distribution Workstream:**
   - KDP account setup by HMD: complete / pending
   - IngramSpark setup: complete / pending
   - ISBNs assigned to all formats: yes / no
   - Pricing confirmed across all channels: yes / no

   **Marketing Workstream:**
   - Pre-launch sales list built: yes / no
   - Amazon Author Central: set up / not set up
   - Goodreads author profile: set up / not set up
   - BookBub author profile: set up / not set up
   - B&N Press: set up / not set up
   - Medium account: set up / not set up
   - Substack account: set up / not set up
   - Podcast guest strategy: planned / not planned
   - Handle audit (consistent naming across platforms): complete / not complete

3. Identify blockers: any item marked "not received", "no", "pending", or "not set up" with fewer than 14 days remaining is a BLOCKER
4. Identify warnings: any item not complete with fewer than 30 days remaining is a WARNING
5. Format and post to #book-launch Slack channel
6. If triggered during heartbeat: only report blockers and day count, skip full status

## Output Format

```
CLARITY LAUNCH COUNTDOWN | {days_remaining} DAYS

Launch Date: April 17, 2026
Today: {current_date}
Status: {ON TRACK | AT RISK | BLOCKED}

BLOCKERS ({count}):
- {item}: {status} -- action needed: {suggested_action}

WARNINGS ({count}):
- {item}: {status} -- due by: {suggested_deadline}

WORKSTREAM SUMMARY:
  Cover Files:   {X}/{total} complete
  Manuscript:    {X}/{total} complete
  Distribution:  {X}/{total} complete
  Marketing:     {X}/{total} complete
```

## Data Source

Status data is maintained in `~/Forge/openclaw/memory/clarity-launch-status.md`. Forge updates this file as tasks are completed. If the file does not exist, create it with all items set to "pending" and alert Lucas.

## Error Handling

- If launch date has passed: switch to post-launch mode, report sales data instead of readiness
- If status file is missing: create default template, post alert to #book-launch asking Lucas to update
- If Slack post fails: retry once after 30 seconds, log failure to local file
