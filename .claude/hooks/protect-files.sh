#!/usr/bin/env bash
# PreToolUse hook -- blocks writes to protected files and unsafe publish/deploy commands
# Reads tool input from stdin as JSON

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // ""')
TOOL_INPUT=$(echo "$INPUT" | jq -r '.tool_input // {}')

# Protected file patterns -- never allow direct edits without explicit confirmation
PROTECTED_PATTERNS=(
  "\.env$"
  "\.env\."
  "docker-compose\.yml$"
  "settings\.json$"
  "QUEUE\.json$"
  "AGENTS\.md$"
  "MISSION\.md$"
  "SOUL\.md$"
  "IDENTITY\.md$"
)

# Dangerous bash command patterns (case-insensitive match)
DANGEROUS_COMMANDS=(
  "gumroad"
  "stripe"
  "payment"
  "billing"
  "drop table"
  "docker volume rm"
  "docker system prune"
  "rm -rf /Users/lucas/Forge"
  "publish.*product"
  "create.*product.*gumroad"
)

# Helper: check a path against protected patterns
check_path() {
  local path="$1"
  for pattern in "${PROTECTED_PATTERNS[@]}"; do
    if echo "$path" | grep -qE "$pattern"; then
      echo "BLOCK: Protected file -- $path requires explicit human approval before editing" >&2
      exit 2
    fi
  done
}

# --- Edit / Write / MultiEdit ---
if [[ "$TOOL_NAME" == "Edit" || "$TOOL_NAME" == "Write" ]]; then
  FILE_PATH=$(echo "$TOOL_INPUT" | jq -r '.file_path // ""')
  check_path "$FILE_PATH"
fi

if [[ "$TOOL_NAME" == "MultiEdit" ]]; then
  # MultiEdit has a top-level file_path
  FILE_PATH=$(echo "$TOOL_INPUT" | jq -r '.file_path // ""')
  check_path "$FILE_PATH"
fi

# --- Bash: dangerous command detection ---
if [[ "$TOOL_NAME" == "Bash" ]]; then
  CMD=$(echo "$TOOL_INPUT" | jq -r '.command // ""')

  # Named dangerous patterns
  for pattern in "${DANGEROUS_COMMANDS[@]}"; do
    if echo "$CMD" | grep -qi "$pattern"; then
      echo "BLOCK: Dangerous command pattern detected -- requires explicit human approval: $pattern" >&2
      exit 2
    fi
  done

  # cp/mv targeting a protected file
  if echo "$CMD" | grep -qE "(^|[[:space:]])(cp|mv)[[:space:]].*\.(env|json)"; then
    # Extract destination (last argument in simple cp/mv calls)
    DEST=$(echo "$CMD" | grep -oE "[^ ]+$")
    for pattern in "${PROTECTED_PATTERNS[@]}"; do
      if echo "$DEST" | grep -qE "$pattern"; then
        echo "BLOCK: cp/mv targeting protected file -- $DEST requires explicit human approval" >&2
        exit 2
      fi
    done
  fi

  # python3 / node writing to protected file via open() or fs.writeFile
  if echo "$CMD" | grep -qE "(python3|python|node)[[:space:]]"; then
    for pattern in "\.env" "QUEUE\.json" "AGENTS\.md" "MISSION\.md" "SOUL\.md" "IDENTITY\.md" "docker-compose\.yml" "settings\.json"; do
      if echo "$CMD" | grep -qE "$pattern"; then
        echo "BLOCK: Script targeting protected file ($pattern) -- requires explicit human approval" >&2
        exit 2
      fi
    done
  fi

  # sed -i targeting a protected file
  if echo "$CMD" | grep -qE "sed[[:space:]]+-i"; then
    for pattern in "\.env" "QUEUE\.json" "AGENTS\.md" "MISSION\.md" "SOUL\.md" "IDENTITY\.md" "docker-compose\.yml" "settings\.json"; do
      if echo "$CMD" | grep -qE "$pattern"; then
        echo "BLOCK: sed -i targeting protected file ($pattern) -- requires explicit human approval" >&2
        exit 2
      fi
    done
  fi

  # tee overwriting a protected file
  if echo "$CMD" | grep -qE "\|\s*tee[[:space:]]"; then
    TEEDEST=$(echo "$CMD" | grep -oE "tee[[:space:]]+[^ ]+" | awk '{print $2}')
    for pattern in "${PROTECTED_PATTERNS[@]}"; do
      if echo "$TEEDEST" | grep -qE "$pattern"; then
        echo "BLOCK: tee targeting protected file -- $TEEDEST requires explicit human approval" >&2
        exit 2
      fi
    done
  fi

  # git operations that could overwrite workspace state destructively
  if echo "$CMD" | grep -qE "git[[:space:]]+(checkout[[:space:]]+--|restore[[:space:]]+--|reset[[:space:]]+--hard|push[[:space:]]+.*--force)"; then
    echo "BLOCK: Destructive git operation requires explicit human approval: $CMD" >&2
    exit 2
  fi
fi

exit 0
