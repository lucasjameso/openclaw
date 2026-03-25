#!/bin/bash
# Deploy Forge Dashboard to Cloudflare Workers
# Run from inside the container: bash /workspace/dashboard/deploy.sh

cd /workspace/dashboard
npx wrangler deploy 2>&1

if [ $? -eq 0 ]; then
  echo "Dashboard deployed successfully to https://forge-dashboard.lucasjamesoliver1.workers.dev"
else
  echo "Deploy failed. Check CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID env vars."
fi
