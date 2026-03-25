#!/usr/bin/env python3
"""Post a tweet with an image via X API v1.1 media upload + v2 tweet create.

Usage:
  python3 /workspace/scripts/post-tweet-media.py "Tweet text" /path/to/image.png [--account forge|lucas]

Supports: PNG, JPG, GIF (under 5MB)
"""
import os, sys, json, hmac, hashlib, base64, time, urllib.request, urllib.parse, uuid

def get_keys(account):
    if account == "forge":
        return {
            "api_key": os.environ["FORGE_X_API_KEY"],
            "api_secret": os.environ["FORGE_X_API_SECRET"],
            "access_token": os.environ["FORGE_X_ACCESS_TOKEN"],
            "access_secret": os.environ["FORGE_X_ACCESS_SECRET"],
        }
    else:
        return {
            "api_key": os.environ["X_API_KEY"],
            "api_secret": os.environ["X_API_SECRET"],
            "access_token": os.environ["X_ACCESS_TOKEN"],
            "access_secret": os.environ["X_ACCESS_SECRET"],
        }

def oauth_sign(method, url, keys, extra_params=None):
    timestamp = str(int(time.time()))
    nonce = uuid.uuid4().hex
    params = {
        "oauth_consumer_key": keys["api_key"],
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": timestamp,
        "oauth_token": keys["access_token"],
        "oauth_version": "1.0",
    }
    if extra_params:
        all_params = {**params, **extra_params}
    else:
        all_params = dict(params)

    param_string = "&".join(
        f"{k}={urllib.parse.quote(str(v), safe='')}" for k, v in sorted(all_params.items())
    )
    base_string = f"{method}&{urllib.parse.quote(url, safe='')}&{urllib.parse.quote(param_string, safe='')}"
    signing_key = f"{urllib.parse.quote(keys['api_secret'], safe='')}&{urllib.parse.quote(keys['access_secret'], safe='')}"
    signature = base64.b64encode(
        hmac.new(signing_key.encode(), base_string.encode(), hashlib.sha1).digest()
    ).decode()
    params["oauth_signature"] = signature
    return "OAuth " + ", ".join(
        f'{k}="{urllib.parse.quote(v, safe="")}"' for k, v in sorted(params.items())
    )

def upload_media(image_path, keys):
    """Upload image to X via v1.1 media/upload endpoint."""
    url = "https://upload.twitter.com/1.1/media/upload.json"

    with open(image_path, "rb") as f:
        image_data = f.read()

    media_b64 = base64.b64encode(image_data).decode()

    # Determine media type
    ext = image_path.lower().rsplit(".", 1)[-1]
    media_types = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "gif": "image/gif"}
    media_type = media_types.get(ext, "image/png")

    # Build multipart form data
    boundary = uuid.uuid4().hex
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="media_data"\r\n\r\n'
        f"{media_b64}\r\n"
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="media_category"\r\n\r\n'
        f"tweet_image\r\n"
        f"--{boundary}--\r\n"
    ).encode()

    auth_header = oauth_sign("POST", url, keys)

    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Authorization": auth_header,
            "Content-Type": f"multipart/form-data; boundary={boundary}",
        },
    )
    try:
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read().decode())
        media_id = data["media_id_string"]
        print(f"Media uploaded: {media_id}", file=sys.stderr)
        return media_id
    except urllib.error.HTTPError as e:
        error = e.read().decode()
        print(f"Media upload error {e.code}: {error}", file=sys.stderr)
        return None

def post_tweet_with_media(text, media_id, keys, account):
    """Post tweet with attached media via v2 API."""
    url = "https://api.twitter.com/2/tweets"
    auth_header = oauth_sign("POST", url, keys)

    payload = {"text": text}
    if media_id:
        payload["media"] = {"media_ids": [media_id]}

    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Authorization": auth_header, "Content-Type": "application/json"},
    )
    try:
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read().decode())
        tweet_id = data["data"]["id"]
        handle = "Forge_Builds" if account == "forge" else "LucasJOliver_78"
        print(json.dumps({
            "success": True,
            "tweet_id": tweet_id,
            "url": f"https://x.com/{handle}/status/{tweet_id}",
            "account": f"@{handle}",
            "media_id": media_id,
            "text": text,
        }, indent=2))
        return True
    except urllib.error.HTTPError as e:
        error = e.read().decode()
        print(json.dumps({"success": False, "error": error, "code": e.code}))
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3 or sys.argv[1] in ("--help", "-h"):
        print("Usage: post-tweet-media.py 'tweet text' /path/to/image.png [--account forge|lucas]")
        sys.exit(0)

    text = sys.argv[1]
    image_path = sys.argv[2]

    if text.startswith("--"):
        print("Error: first argument must be the tweet text, not a flag")
        sys.exit(1)

    if not os.path.exists(image_path):
        print(f"Error: image file not found: {image_path}")
        sys.exit(1)

    account = "lucas"
    if "--account" in sys.argv:
        idx = sys.argv.index("--account")
        if idx + 1 < len(sys.argv):
            account = sys.argv[idx + 1]

    keys = get_keys(account)
    media_id = upload_media(image_path, keys)
    if media_id:
        success = post_tweet_with_media(text, media_id, keys, account)
        sys.exit(0 if success else 1)
    else:
        print("Failed to upload media. Posting text-only as fallback.")
        success = post_tweet_with_media(text, None, keys, account)
        sys.exit(0 if success else 1)
