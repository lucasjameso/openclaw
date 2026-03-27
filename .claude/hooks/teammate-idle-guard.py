#!/usr/bin/env python3
"""
TeammateIdle hook -- keeps teammates from going idle without a useful handoff.
Reads teammate state from stdin as JSON.
Exits 2 to inject a prompt back to the teammate, 0 to allow idle.
"""
import json
import sys

def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    teammate = data.get("teammate", {})
    last_output = teammate.get("last_output", "").strip()
    tasks_claimed = teammate.get("tasks_claimed", 0)
    tasks_completed = teammate.get("tasks_completed", 0)
    pending_tasks = teammate.get("pending_tasks", [])

    # If teammate claimed work but completed none, and is going idle
    if tasks_claimed > 0 and tasks_completed == 0:
        print("FEEDBACK: Teammate going idle without completing claimed work.", file=sys.stderr)
        print("  Before going idle you must:", file=sys.stderr)
        print("  1. Summarize your findings so far (even if incomplete)", file=sys.stderr)
        print("  2. Update any artifact or note file with partial progress", file=sys.stderr)
        print("  3. Return your task to pending with a handoff note if you cannot finish", file=sys.stderr)
        sys.exit(2)

    # If there are unblocked pending tasks available, prompt teammate to claim one
    if pending_tasks:
        unblocked = [t for t in pending_tasks if t.get("status") == "pending" and not t.get("blocked")]
        if unblocked:
            print(f"FEEDBACK: {len(unblocked)} unblocked tasks remain. Claim and execute the next task before going idle.", file=sys.stderr)
            sys.exit(2)

    # If teammate produced no useful output at all
    if not last_output or len(last_output) < 30:
        print("FEEDBACK: Teammate going idle with no usable output.", file=sys.stderr)
        print("  Write a minimum 30-character summary of what you found or produced before stopping.", file=sys.stderr)
        sys.exit(2)

    sys.exit(0)

if __name__ == "__main__":
    main()
