#!/usr/bin/env bash
# x-auth-doctor.sh -- verify Forge X auth env alignment in one command
# Usage: ./scripts/x-auth-doctor.sh

set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PASS=0; FAIL=0

check() {
  local label="$1" result="$2"
  if [ "$result" = "MATCH" ] || [ "$result" = "OK" ]; then
    echo "  [OK]  $label"
    PASS=$((PASS + 1))
  else
    echo "  [FAIL] $label -- $result"
    FAIL=$((FAIL + 1))
  fi
}

echo "Forge X Auth Doctor"
echo "==================="
echo ""

# 1. Check root .env has FORGE_X_ keys
echo "1. Root .env keys"
for key in FORGE_X_API_KEY FORGE_X_API_SECRET FORGE_X_ACCESS_TOKEN FORGE_X_ACCESS_SECRET; do
  if grep -q "^${key}=" "$ROOT_DIR/.env" 2>/dev/null; then
    check "$key in root .env" "OK"
  else
    check "$key in root .env" "MISSING"
  fi
done

echo ""

# 2. Container env matches root .env (fingerprint comparison)
echo "2. Container env vs root .env"
for key in FORGE_X_API_KEY FORGE_X_API_SECRET FORGE_X_ACCESS_TOKEN FORGE_X_ACCESS_SECRET; do
  root_val=$(grep "^${key}=" "$ROOT_DIR/.env" 2>/dev/null | cut -d= -f2- | tr -d '[:space:]')
  container_val=$(docker exec openclaw printenv "$key" 2>/dev/null | tr -d '[:space:]')
  if [ -z "$root_val" ]; then
    check "$key" "missing from root .env"
  elif [ -z "$container_val" ]; then
    check "$key" "missing from container"
  elif [ "$root_val" = "$container_val" ]; then
    check "$key" "MATCH"
  else
    check "$key" "MISMATCH (recreate container: docker compose up -d --force-recreate openclaw)"
  fi
done

echo ""

# 3. Live auth test
echo "3. Live auth"
forge_result=$(docker exec openclaw node /home/node/.openclaw/workspace/scripts/test-x-auth.js forge 2>&1)
if echo "$forge_result" | grep -q "credentials are VALID"; then
  forge_user=$(echo "$forge_result" | grep "Authenticated as:" | cut -d: -f2- | tr -d ' ')
  check "Forge auth (@${forge_user})" "OK"
else
  check "Forge auth" "401 -- credentials invalid or container env stale"
fi

lucas_result=$(docker exec openclaw node /home/node/.openclaw/workspace/scripts/test-x-auth.js lucas 2>&1)
if echo "$lucas_result" | grep -q "credentials are VALID"; then
  lucas_user=$(echo "$lucas_result" | grep "Authenticated as:" | cut -d: -f2- | tr -d ' ')
  check "Lucas auth (@${lucas_user})" "OK"
else
  check "Lucas auth" "401 -- credentials invalid or container env stale"
fi

echo ""
echo "Result: ${PASS} passed, ${FAIL} failed"
if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "Fix: docker compose -f $ROOT_DIR/docker-compose.yml up -d --force-recreate openclaw"
  exit 1
fi
