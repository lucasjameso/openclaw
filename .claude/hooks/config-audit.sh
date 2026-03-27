#!/usr/bin/env bash
# ConfigChange hook -- audits changes to .claude settings, agents, and skills
# Reads change data from stdin as JSON

INPUT=$(cat)

CHANGED_FILE=$(echo "$INPUT" | jq -r '.file // ""')
CHANGE_TYPE=$(echo "$INPUT" | jq -r '.change_type // "unknown"')
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

AUDIT_LOG="/Users/lucas/Forge/openclaw/.claude/config-audit.log"

# Log the change
echo "[$TIMESTAMP] CONFIG_CHANGE type=$CHANGE_TYPE file=$CHANGED_FILE" >> "$AUDIT_LOG"

# Flag high-sensitivity changes
HIGH_SENSITIVITY_PATTERNS=(
  "settings\.json"
  "hooks/"
  "agents/"
  "skills/"
  "CLAUDE\.md"
)

for pattern in "${HIGH_SENSITIVITY_PATTERNS[@]}"; do
  if echo "$CHANGED_FILE" | grep -qE "$pattern"; then
    echo "[$TIMESTAMP] HIGH_SENSITIVITY: $CHANGED_FILE changed ($CHANGE_TYPE)" >> "$AUDIT_LOG"
    echo "CONFIG_AUDIT: High-sensitivity file changed: $CHANGED_FILE -- logged to config-audit.log" >&2
    break
  fi
done

exit 0
