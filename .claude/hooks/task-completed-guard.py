#!/usr/bin/env python3
"""
TaskCompleted hook -- prevents teammates from marking work complete without usable output.
Reads task data from stdin as JSON.
Exits 2 to block, 0 to allow.
"""
import json
import sys
import os

def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    task = data.get("task", {})
    output = task.get("output", "").strip()
    artifact_paths = task.get("artifact_paths", [])
    findings = task.get("findings", "").strip()
    test_results = task.get("test_results", "").strip()
    review_note = task.get("review_note", "").strip()
    handoff_summary = task.get("handoff_summary", "").strip()

    # At least one of these must exist to mark complete
    has_output = len(output) >= 50
    has_artifact = len(artifact_paths) > 0
    has_findings = len(findings) >= 30
    has_test_results = len(test_results) >= 10
    has_review_note = len(review_note) >= 20
    has_handoff = len(handoff_summary) >= 30

    if not any([has_output, has_artifact, has_findings, has_test_results, has_review_note, has_handoff]):
        print("BLOCK: Task cannot be marked complete without usable output.", file=sys.stderr)
        print("  Provide at least one of:", file=sys.stderr)
        print("  - output (50+ chars summary of what was produced)", file=sys.stderr)
        print("  - artifact_paths (list of file paths created)", file=sys.stderr)
        print("  - findings (30+ chars research/analysis findings)", file=sys.stderr)
        print("  - test_results (pass/fail with context)", file=sys.stderr)
        print("  - review_note (note for review folder)", file=sys.stderr)
        print("  - handoff_summary (30+ chars handoff for lead)", file=sys.stderr)
        sys.exit(2)

    # Verify artifact paths actually exist if provided
    missing = []
    for path in artifact_paths:
        if not os.path.exists(path):
            missing.append(path)

    if missing:
        print("BLOCK: Artifact paths listed but files do not exist:", file=sys.stderr)
        for m in missing:
            print(f"  - {m}", file=sys.stderr)
        sys.exit(2)

    sys.exit(0)

if __name__ == "__main__":
    main()
