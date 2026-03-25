# Cloudflare Tunnel Setup for OpenClaw

OpenClaw is accessible externally via `openclaw.iac-solutions.io` through the existing
Cloudflare tunnel on Forge. The tunnel already serves `n8n.iac-solutions.io`.

## Prerequisites

- `cloudflared` installed on Forge (should already be present for n8n tunnel)
- Cloudflare account with `iac-solutions.io` domain
- Existing tunnel already running

## Step 1: Find the Existing Tunnel

```bash
cloudflared tunnel list
```

Note the tunnel name and ID that currently serves `n8n.iac-solutions.io`.

## Step 2: Add the DNS Route

```bash
cloudflared tunnel route dns <TUNNEL_NAME> openclaw.iac-solutions.io
```

This creates a CNAME record pointing `openclaw.iac-solutions.io` to the tunnel.

## Step 3: Update Tunnel Configuration

Edit the cloudflared config (typically at `~/.cloudflared/config.yml` or
`/etc/cloudflared/config.yml`):

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /path/to/credentials.json

ingress:
  - hostname: n8n.iac-solutions.io
    service: http://localhost:5678
  - hostname: openclaw.iac-solutions.io
    service: http://localhost:3000
  - service: http_status:404
```

## Step 4: Restart cloudflared

If running via brew services:
```bash
brew services restart cloudflared
```

If running via launchd or manually:
```bash
cloudflared tunnel run <TUNNEL_NAME>
```

## Step 5: Configure Zero Trust Access Policy (Optional)

For added security, create an Access policy in the Cloudflare dashboard:

1. Go to Cloudflare Zero Trust > Access > Applications
2. Click "Add an application" > "Self-hosted"
3. Application name: `OpenClaw`
4. Domain: `openclaw.iac-solutions.io`
5. Configure an access policy (e.g., email-based allow list)
6. Save

This adds an authentication layer before users can reach the OpenClaw web UI.

## Step 6: Verify

```bash
# DNS resolution
dig openclaw.iac-solutions.io

# HTTP access
curl -I https://openclaw.iac-solutions.io

# Should return a 200 or redirect to the OpenClaw UI
```

## Troubleshooting

- **DNS not resolving:** Wait a few minutes for propagation, then check the CNAME exists
  in Cloudflare DNS dashboard
- **502 Bad Gateway:** OpenClaw container is not running or not listening on port 18789
- **Connection refused:** cloudflared config may not include the new ingress rule;
  restart cloudflared after editing config
