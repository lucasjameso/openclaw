#!/usr/bin/env python3
"""
TaskCreated hook -- rejects vague or low-quality agent-team tasks.
Reads task data from stdin as JSON.
Exits 2 to block, 0 to allow.
"""
import json
import sys

def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    task = data.get("task", {})
    title = task.get("title", "").strip()
    description = task.get("description", "").strip()
    success_criteria = task.get("success_criteria", "")

    errors = []

    # Reject empty or trivially short titles
    if len(title) < 10:
        errors.append("Task title is too vague (minimum 10 characters, describe the actual deliverable)")

    # Reject titles that are just action words with no object
    vague_titles = ["research", "investigate", "look into", "check", "review", "analyze", "think about", "explore"]
    if title.lower() in vague_titles or (len(title.split()) <= 2 and title.lower().split()[0] in vague_titles):
        errors.append(f"Task title '{title}' is too vague -- include what specifically is being produced or decided")

    # Require some description or success criteria
    if len(description) < 20 and not success_criteria:
        errors.append("Task requires either a description (20+ chars) or success criteria -- what does done look like?")

    # Reject human-do-the-work tasks
    human_task_patterns = [
        "lucas review", "lucas approve", "lucas decide", "lucas check",
        "ask lucas", "wait for lucas", "get lucas", "have lucas"
    ]
    combined = (title + " " + description).lower()
    for pattern in human_task_patterns:
        if pattern in combined:
            errors.append(f"Invalid: task requires Lucas to do the work ('{pattern}'). Place artifact in review/ and send Slack signal instead.")
            break

    if errors:
        print("BLOCK: Task rejected by quality guard:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(2)

    sys.exit(0)

if __name__ == "__main__":
    main()
