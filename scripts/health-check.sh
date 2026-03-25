#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== OpenClaw Health Check ==="

# Check container status
CONTAINER_STATUS=$(docker inspect --format='{{.State.Status}}' openclaw 2>/dev/null || echo "not found")
echo "Container: $CONTAINER_STATUS"

# Check health endpoint
if curl -fsS http://127.0.0.1:3000/healthz &>/dev/null; then
  HEALTH="healthy"
  echo "Health endpoint: OK"
else
  HEALTH="unreachable"
  echo "Health endpoint: FAILED"
fi

# Check readiness
if curl -fsS http://127.0.0.1:3000/readyz &>/dev/null; then
  READY="ready"
  echo "Readiness: OK"
else
  READY="not ready"
  echo "Readiness: FAILED"
fi

# Build report
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
REPORT="OpenClaw Health Check -- $TIMESTAMP\nContainer: $CONTAINER_STATUS\nHealth: $HEALTH\nReadiness: $READY"

echo ""
echo -e "$REPORT"

# Post to Slack if webhook is configured
WEBHOOK_URL=$(grep SLACK_WEBHOOK_FORGE_ALERTS "$PROJECT_DIR/.env" | cut -d= -f2-)
if [ -n "$WEBHOOK_URL" ]; then
  curl -sS -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "{\"text\":\"$REPORT\"}" \
    &>/dev/null && echo "\nPosted to #forge-alerts" || echo "\nWARNING: Could not post to Slack"
fi

echo ""
echo "=== Done ==="
