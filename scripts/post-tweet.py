#!/usr/bin/env python3
"""Post a tweet via X API v2 with OAuth 1.0a signing.

Usage:
  python3 /workspace/scripts/post-tweet.py "Your tweet text" [--account forge|lucas]

Defaults to Lucas's account. Use --account forge for @Forge_Builds.
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

def sign_request(method, url, keys):
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
    param_string = "&".join(
        f"{k}={urllib.parse.quote(v, safe='')}" for k, v in sorted(params.items())
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

def post_tweet(text, account="lucas"):
    keys = get_keys(account)
    url = "https://api.twitter.com/2/tweets"
    auth_header = sign_request("POST", url, keys)
    body = json.dumps({"text": text}).encode()
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
            "text": text,
        }, indent=2))
        return True
    except urllib.error.HTTPError as e:
        error = e.read().decode()
        print(json.dumps({"success": False, "error": error, "code": e.code}))
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h"):
        print("Usage: post-tweet.py 'tweet text' [--account forge|lucas]")
        print("  --account forge  Post as @Forge_Builds")
        print("  --account lucas  Post as @LucasJOliver_78 (default)")
        sys.exit(0)

    text = sys.argv[1]
    if text.startswith("--"):
        print("Error: first argument must be the tweet text, not a flag")
        sys.exit(1)

    account = "lucas"
    if "--account" in sys.argv:
        idx = sys.argv.index("--account")
        if idx + 1 < len(sys.argv):
            account = sys.argv[idx + 1]

    success = post_tweet(text, account)
    sys.exit(0 if success else 1)
