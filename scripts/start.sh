#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== OpenClaw Start ==="
echo "Project: $PROJECT_DIR"

# Preflight: Docker running?
if ! docker info &>/dev/null; then
  echo "ERROR: Docker is not running. Start Docker Desktop first."
  exit 1
fi
echo "[OK] Docker is running"

# Preflight: .env exists?
if [ ! -f "$PROJECT_DIR/.env" ]; then
  echo "ERROR: .env file not found at $PROJECT_DIR/.env"
  echo "Copy .env.example to .env and fill in your credentials."
  exit 1
fi
echo "[OK] .env file found"

# Preflight: port 3000 clear?
if lsof -i :3000 &>/dev/null; then
  echo "WARNING: Port 3000 is already in use."
  echo "Check with: lsof -i :3000"
  echo "Proceeding anyway (Docker may rebind)..."
else
  echo "[OK] Port 3000 is clear"
fi

# Ensure data directory exists
mkdir -p "$PROJECT_DIR/data"
echo "[OK] Data directory ready"

# Start
echo ""
echo "Starting OpenClaw..."
cd "$PROJECT_DIR"
docker compose up -d

echo ""
echo "Waiting for health check..."
sleep 5

if curl -fsS http://127.0.0.1:3000/healthz &>/dev/null; then
  echo "[OK] OpenClaw is healthy"
else
  echo "WARNING: Health check not passing yet. Container may still be starting."
  echo "Check logs with: docker compose logs -f"
fi

echo ""
echo "=== OpenClaw Started ==="
echo "Local:    http://127.0.0.1:3000"
echo "External: https://openclaw.iac-solutions.io"
