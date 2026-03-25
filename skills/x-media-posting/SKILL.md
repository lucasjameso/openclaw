---
name: x-media-posting
description: Post tweets with images (PNG, JPG, GIF) to X/Twitter for both Lucas and Forge accounts
---

# X/Twitter Media Posting Skill

You can attach images to tweets. Use this for infographics, product covers, social cards, and any visual content.

## How It Works

Two scripts available at /workspace/scripts/:

**Text-only tweets:**
```bash
python3 /workspace/scripts/post-tweet.py "Tweet text" --account forge
python3 /workspace/scripts/post-tweet.py "Tweet text" --account lucas
```

**Tweets with images:**
```bash
python3 /workspace/scripts/post-tweet-media.py "Tweet text" /path/to/image.png --account forge
python3 /workspace/scripts/post-tweet-media.py "Tweet text" /path/to/image.png --account lucas
```

## Technical Details

- Media upload uses X API v1.1 (upload.twitter.com) with OAuth 1.0a signing
- Tweet creation uses X API v2 with the uploaded media_id attached
- Supports PNG, JPG, GIF under 5MB
- If media upload fails, automatically falls back to text-only
- Returns JSON with tweet ID, URL, and media ID

## Workflow for Visual Tweets

1. Generate your visual (NotebookLM infographic, Pillow image, wkhtmltoimage output, Excalidraw export)
2. Save it to /workspace/content/ or /tmp/
3. Post with: `python3 /workspace/scripts/post-tweet-media.py "Your caption" /path/to/image.png --account forge`
4. Log the tweet to /workspace/content/x/posted-log.md

## Example: NotebookLM Infographic to Tweet

```bash
# 1. Generate infographic from NotebookLM
nlm studio generate infographic <notebook-id> --prompt "CLARITY 72-Hour Mirror framework"
nlm download infographic <notebook-id> /workspace/content/notebooklm/

# 2. Post to X with the infographic
python3 /workspace/scripts/post-tweet-media.py \
  "Built this framework breakdown from the CLARITY manuscript. 67 interruptions in one day. That was the wake-up call." \
  /workspace/content/notebooklm/infographic.png \
  --account forge
```

## Both Scripts Survive Any Restart

These scripts live on the host filesystem at ~/Forge/openclaw/scripts/ and are mounted into your container at /workspace/scripts/. They are always available regardless of Docker restarts.
