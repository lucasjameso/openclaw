#!/usr/bin/env python3
"""Get X/Twitter follower counts using OAuth 1.0a for both accounts.

Usage:
  python3 /workspace/scripts/get-x-followers.py

Returns JSON with follower counts for both accounts.
"""
import os, json, hmac, hashlib, base64, time, urllib.request, urllib.parse, uuid

def get_user_info(api_key, api_secret, access_token, access_secret):
    url = "https://api.twitter.com/2/users/me?user.fields=public_metrics"
    method = "GET"
    timestamp = str(int(time.time()))
    nonce = uuid.uuid4().hex

    params = {
        "oauth_consumer_key": api_key,
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": timestamp,
        "oauth_token": access_token,
        "oauth_version": "1.0",
    }

    # Include query params in signature base
    all_params = dict(params)
    all_params["user.fields"] = "public_metrics"

    param_string = "&".join(
        f"{k}={urllib.parse.quote(v, safe='')}" for k, v in sorted(all_params.items())
    )
    base_url = "https://api.twitter.com/2/users/me"
    base_string = f"{method}&{urllib.parse.quote(base_url, safe='')}&{urllib.parse.quote(param_string, safe='')}"
    signing_key = f"{urllib.parse.quote(api_secret, safe='')}&{urllib.parse.quote(access_secret, safe='')}"
    signature = base64.b64encode(
        hmac.new(signing_key.encode(), base_string.encode(), hashlib.sha1).digest()
    ).decode()

    params["oauth_signature"] = signature
    auth_header = "OAuth " + ", ".join(
        f'{k}="{urllib.parse.quote(v, safe="")}"' for k, v in sorted(params.items())
    )

    req = urllib.request.Request(url, headers={"Authorization": auth_header})
    try:
        resp = urllib.request.urlopen(req)
        return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return {"error": e.read().decode(), "code": e.code}

if __name__ == "__main__":
    results = {}

    # Lucas account
    lucas = get_user_info(
        os.environ.get("X_API_KEY", ""),
        os.environ.get("X_API_SECRET", ""),
        os.environ.get("X_ACCESS_TOKEN", ""),
        os.environ.get("X_ACCESS_SECRET", ""),
    )
    if "data" in lucas:
        m = lucas["data"].get("public_metrics", {})
        results["lucas"] = {
            "username": lucas["data"]["username"],
            "followers": m.get("followers_count", 0),
            "following": m.get("following_count", 0),
            "tweets": m.get("tweet_count", 0),
        }
    else:
        results["lucas"] = {"error": lucas}

    # Forge account
    forge = get_user_info(
        os.environ.get("FORGE_X_API_KEY", ""),
        os.environ.get("FORGE_X_API_SECRET", ""),
        os.environ.get("FORGE_X_ACCESS_TOKEN", ""),
        os.environ.get("FORGE_X_ACCESS_SECRET", ""),
    )
    if "data" in forge:
        m = forge["data"].get("public_metrics", {})
        results["forge"] = {
            "username": forge["data"]["username"],
            "followers": m.get("followers_count", 0),
            "following": m.get("following_count", 0),
            "tweets": m.get("tweet_count", 0),
        }
    else:
        results["forge"] = {"error": forge}

    print(json.dumps(results, indent=2))
