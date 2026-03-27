#!/usr/bin/env bash
# SessionStart (compact) hook -- reinjects critical business context after compaction
# Outputs context as a system message that gets injected into the fresh session

WORKSPACE="/Users/lucas/Forge/openclaw/data/workspace"
QUEUE="$WORKSPACE/QUEUE.json"
QUEUE_SUMMARY=""

# Pull top 3 READY tasks from queue if jq is available
if command -v jq &>/dev/null && [ -f "$QUEUE" ]; then
  QUEUE_SUMMARY=$(jq -r '
    .tasks
    | map(select(.status == "READY"))
    | sort_by(-.priority)
    | .[0:3]
    | .[]
    | "  [\(.priority)] \(.id): \(.title)"
  ' "$QUEUE" 2>/dev/null || echo "  (could not read queue)")
fi

# Pull active experiments if file exists
ACTIVE_EXPERIMENTS=""
if [ -d "$WORKSPACE/experiments" ]; then
  ACTIVE_EXPERIMENTS=$(ls "$WORKSPACE/experiments/"*.md 2>/dev/null | xargs grep -l "status: active" 2>/dev/null | head -3 | xargs -I{} basename {} .md 2>/dev/null | tr '\n' ', ')
fi

# Build the reinjection message
cat <<EOF
CONTEXT_REINJECT: Session resumed after compaction. Critical business state:

Project: Forge -- autonomous business operator on Mac Mini M4, Wake Forest NC
Runtime: /Users/lucas/Forge/openclaw/data/workspace/
Queue: /Users/lucas/Forge/openclaw/data/workspace/QUEUE.json
Review staging: /Users/lucas/Forge/openclaw/review/
Claude OS: /Users/lucas/Forge/openclaw/.claude/

Top READY tasks:
$QUEUE_SUMMARY

Active experiments: ${ACTIVE_EXPERIMENTS:-none found}

Operating rules: see .claude/CLAUDE.md
Skills: .claude/skills/ | Subagents: .claude/agents/

Continue from the last known queue state. Do not restart from scratch.
EOF

exit 0
