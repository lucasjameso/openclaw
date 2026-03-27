"""
approval_engine.py -- apply human review decisions and write durable records.

Decisions written here stay consistent with the Cloudflare Worker's
/api/review-event flow. Both systems read from the same review root and
write to compatible formats.

CLI usage:
  python3 -m forge_ops approval apply --item <id> --decision approve [--comment "..."]
  python3 -m forge_ops approval list [--pending-only]
  python3 -m forge_ops approval export [--date 2026-03-27]
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from forge_ops.config import (
    review_root, approvals_dir, pending_index_path, queue_path,
    VALID_DECISIONS,
)
from forge_ops.schemas.review_item import now_iso


# ── Decision record ───────────────────────────────────────────────────────────

def _decision_record(item_id: str, decision: str, comment: str, reviewer: str, artifact_path: str = "") -> dict:
    return {
        "item_id": item_id,
        "artifact_path": artifact_path,   # relative path from review root, for push-state matching
        "decision": decision,
        "comment": comment,
        "reviewer": reviewer,
        "reviewed_at": now_iso(),
    }


def _write_durable_record(record: dict) -> Path:
    """Write a JSON approval record to the approvals dir."""
    d = approvals_dir()
    fname = f"approval-{record['reviewed_at'][:10]}-{record['item_id'][:40]}.json".replace(":", "-")
    path = d / fname
    path.write_text(json.dumps(record, indent=2))
    return path


# ── Find review item ──────────────────────────────────────────────────────────

def _find_review_meta(item_id: str, root: Path | None = None) -> Optional[Path]:
    """Locate a -REVIEW.md file by item_id prefix match."""
    r = root or review_root()
    for meta in r.rglob("*-REVIEW.md"):
        if item_id.lower() in meta.stem.lower():
            return meta
    return None


def _find_artifact_path(item_id: str, root: Path | None = None) -> Optional[Path]:
    """Locate an artifact (non-REVIEW) file by id/stem match."""
    r = root or review_root()
    for p in r.rglob("*"):
        if p.is_dir():
            continue
        if "-REVIEW" in p.name:
            continue
        if item_id.lower() in p.stem.lower():
            return p
    return None


# ── Apply ─────────────────────────────────────────────────────────────────────

def apply(
    item_id: str,
    decision: str,
    *,
    comment: str = "",
    reviewer: str = "lucas",
    create_revision_task: bool = False,
    root: Path | None = None,
) -> dict:
    """
    Apply a review decision to an item.

    1. Writes a durable JSON record to approvals/
    2. Updates the -REVIEW.md metadata file with the decision
    3. If needs_revision and create_revision_task=True, creates a READY follow-up task

    Returns a result dict.
    """
    if decision not in VALID_DECISIONS:
        raise ValueError(f"Invalid decision: {decision!r}. Valid: {sorted(VALID_DECISIONS)}")

    # Resolve artifact path for push-state matching
    # Check both active items and archived items
    artifact_path = ""
    from forge_ops.review_engine import _read_active_queue
    from forge_ops.config import review_root
    aq_data = _read_active_queue()
    all_aq_items = aq_data.get("items", []) + aq_data.get("archived", [])
    for aq_item in all_aq_items:
        if aq_item["id"] == item_id or aq_item.get("task_id") == item_id:
            p = Path(aq_item.get("path", ""))
            try:
                artifact_path = str(p.relative_to(review_root()))
            except ValueError:
                artifact_path = p.name
            break

    record = _decision_record(item_id, decision, comment, reviewer, artifact_path=artifact_path)
    record_path = _write_durable_record(record)

    # Update the -REVIEW.md file if it exists
    meta = _find_review_meta(item_id, root)
    meta_updated = False
    if meta:
        _patch_review_meta(meta, decision, comment, reviewer)
        meta_updated = True

    # Update the active queue manifest
    from forge_ops.review_engine import update_decision as aq_update
    aq_updated = aq_update(item_id, decision, comment=comment, reviewer=reviewer)

    # Optionally create a revision follow-up task
    revision_task_id = None
    if decision == "needs_revision" and create_revision_task:
        revision_task_id = _create_revision_task(item_id, comment)

    return {
        "item_id": item_id,
        "decision": decision,
        "reviewer": reviewer,
        "reviewed_at": record["reviewed_at"],
        "record_path": str(record_path),
        "meta_updated": meta_updated,
        "active_queue_updated": aq_updated,
        "revision_task_id": revision_task_id,
    }


def _patch_review_meta(meta: Path, decision: str, comment: str, reviewer: str) -> None:
    """Update the status line and add a decision block to a -REVIEW.md file."""
    content = meta.read_text(errors="replace")
    decision_labels = {
        "approve": "APPROVED",
        "needs_revision": "NEEDS_REVISION",
        "reject": "REJECTED",
        "later": "SNOOZED",
    }
    label = decision_labels.get(decision, decision.upper())

    # Replace Status line
    content = re.sub(r"Status:.*", f"Status: {label}", content)

    # Append decision block if not already present
    if "## Decision" not in content:
        block = f"""
## Decision
- Decision: {label}
- Reviewer: {reviewer}
- Date: {datetime.now().strftime("%Y-%m-%d")}
- Comment: {comment or "(none)"}
"""
        content += block
    meta.write_text(content)


def _create_revision_task(item_id: str, comment: str) -> Optional[str]:
    """Create a READY follow-up revision task in QUEUE.json."""
    try:
        from forge_ops.queue_engine import bootstrap
        from forge_ops.schemas.task import task_template
        import time
        task_id = f"T-revision-{item_id[:20]}-{int(time.time())}"
        task = task_template(
            id=task_id,
            title=f"Revise artifact: {item_id[:40]}",
            objective=f"Revise based on review decision. Comment: {comment or '(see review meta)'}",
            priority=80,
            lane="distribution",
            source_of_task="approval_engine",
            estimated_minutes=20,
            revenue_hypothesis="Revision improves quality before publication",
        )
        result = bootstrap([task])
        return task_id if task_id in result["added"] else None
    except Exception:
        return None


# ── List ──────────────────────────────────────────────────────────────────────

def list_approvals(*, pending_only: bool = False, root: Path | None = None) -> list[dict]:
    """
    Return approval records or pending review items.
    pending_only=True: returns active queue items with no decision (from ACTIVE-QUEUE.json, not the legacy 480-item index).
    pending_only=False: returns durable approval records from approvals/.
    """
    if pending_only:
        from forge_ops.review_engine import pending as active_pending
        return active_pending(root)

    d = approvals_dir()
    records = []
    for f in sorted(d.glob("approval-*.json")):
        try:
            records.append(json.loads(f.read_text()))
        except Exception:
            pass
    return records


# ── Export ────────────────────────────────────────────────────────────────────

def export(*, date_str: str | None = None) -> list[dict]:
    """Export approval records, optionally filtered to a date (YYYY-MM-DD)."""
    records = list_approvals()
    if date_str:
        records = [r for r in records if r.get("reviewed_at", "").startswith(date_str)]
    return records
