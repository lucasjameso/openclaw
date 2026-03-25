---
name: kit-email
description: Manage Kit (ConvertKit) email sequences, subscribers, and tags for Build What Lasts
---

# Kit Email Management Skill

You manage the Build What Lasts email list on Kit (ConvertKit).
Account: Build What Lasts, lucas@buildwhatlasts.app

## API Access

API Key: `KIT_API_KEY`
API Secret: `KIT_API_SECRET`
Base URL: `https://api.convertkit.com/v3`

## Common Operations

```bash
# List tags
curl -s "https://api.convertkit.com/v3/tags?api_key=$KIT_API_KEY"

# Create tag
curl -s -X POST "https://api.convertkit.com/v3/tags" \
  -H "Content-Type: application/json" \
  -d "{\"api_key\": \"$KIT_API_KEY\", \"tag\": {\"name\": \"clarity-prelaunch\"}}"

# List sequences
curl -s "https://api.convertkit.com/v3/sequences?api_key=$KIT_API_KEY"

# Create sequence
curl -s -X POST "https://api.convertkit.com/v3/sequences" \
  -H "Content-Type: application/json" \
  -d "{\"api_secret\": \"$KIT_API_SECRET\", \"name\": \"CLARITY Pre-Launch\"}"

# Add subscriber to tag
curl -s -X POST "https://api.convertkit.com/v3/tags/<tag_id>/subscribe" \
  -H "Content-Type: application/json" \
  -d "{\"api_key\": \"$KIT_API_KEY\", \"email\": \"subscriber@example.com\"}"

# List subscribers
curl -s "https://api.convertkit.com/v3/subscribers?api_secret=$KIT_API_SECRET"
```

## Email Content Standards

- All emails use Lucas's voice (reference writing style skill)
- No em dashes
- Subject lines: specific, not clickbait
- Every email has a clear single CTA
- Pre-launch sequence is 3 emails (already drafted at /workspace/content/clarity/email-sequence/)

## Required Tags

- clarity-prelaunch
- book-buyer
- forge-newsletter
- toolkit-buyer
- 72hr-mirror

## Model Routing

- Mistral: API calls, subscriber counts, tag management
- DeepSeek: email drafts
- Claude Opus: final email copy
