---
name: content-ready
description: Post content approval message to #content-ready channel
user-invocable: true
metadata: {"openclaw.requires": {"env": ["SLACK_WEBHOOK_CONTENT_READY", "SLACK_CHANNEL_CONTENT_READY"]}}
---

# Content Ready

Post a formatted approval message to the #content-ready Slack channel when content is
ready to publish. This skill is the gateway for the content approval workflow.

## Input

- **content_title** (required): Title of the content piece
- **note** (optional): Additional context or instructions for reviewers

## Behavior

1. Accept the content title and optional note from the user
2. Format a structured approval message with:
   - Content title as the header
   - Timestamp of when it was marked ready
   - The optional note if provided
   - Clear call-to-action for reviewers
3. Post to #content-ready via the Slack webhook (`SLACK_WEBHOOK_CONTENT_READY`)
4. Confirm posting with a link to the channel

## Message Format

```
:page_facing_up: Content Ready for Review
------------------------------------------
Title: {content_title}
Submitted: {timestamp}
{note if provided}

Please review and approve or request changes.
```

## Error Handling

If `SLACK_WEBHOOK_CONTENT_READY` is empty or the post fails, inform the user that the
#content-ready webhook needs to be configured in the .env file.
