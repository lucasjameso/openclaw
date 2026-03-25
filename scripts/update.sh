#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== OpenClaw Update ==="

cd "$PROJECT_DIR"

# Pull latest image
echo "Pulling latest OpenClaw image..."
docker compose pull

# Restart with new image
echo "Restarting with updated image..."
docker compose up -d

# Prune old images
echo "Pruning unused images..."
docker image prune -f

# Wait for health
echo "Waiting for health check..."
sleep 10

if curl -fsS http://127.0.0.1:18789/healthz &>/dev/null; then
  STATUS="healthy"
else
  STATUS="starting (health check not yet passing)"
fi

# Notify Slack
WEBHOOK_URL=$(grep SLACK_WEBHOOK_FORGE_ALERTS "$PROJECT_DIR/.env" | cut -d= -f2-)
if [ -n "$WEBHOOK_URL" ]; then
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  IMAGE_ID=$(docker inspect --format='{{.Image}}' openclaw 2>/dev/null | cut -c8-19)
  curl -sS -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "{\"text\":\"OpenClaw updated at $TIMESTAMP. Status: $STATUS. Image: $IMAGE_ID\"}" \
    &>/dev/null || echo "WARNING: Could not notify Slack"
fi

echo ""
echo "=== Update Complete ==="
echo "Status: $STATUS"
