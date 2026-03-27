"""
review_engine.py -- canonical index and packaging for review artifacts.

Two distinct concepts:
  - full index: crawls data/workspace/review/ for all artifacts (used by push-state.js)
  - active queue: reads ACTIVE-QUEUE.json manifest of current actionable items (used by mobile/approval)

Canonical review root: /Users/lucas/Forge/openclaw/data/workspace/review/
Active queue manifest: /Users/lucas/Forge/openclaw/data/workspace/review/ACTIVE-QUEUE.json

CLI usage:
  python3 -m forge_ops review index       -- full crawl, all 480+ items
  python3 -m forge_ops review list        -- alias for index
  python3 -m forge_ops review active      -- items in ACTIVE-QUEUE.json only
  python3 -m forge_ops review pending     -- active items with no decision
  python3 -m forge_ops review status      -- summary stats
  python3 -m forge_ops review package --artifact <path> --task-id <id> [--title "..."]
  python3 -m forge_ops review sync        -- rebuild PENDING.md from active queue
  python3 -m forge_ops review add-item --path <path> --task-id <id> [--title "..."] [--priority N]
"""
from __future__ import annotations

import json
import os
import re
import tempfile
from datetime import datetime, timezone
from pathlib import Path

from forge_ops.config import review_root, pending_index_path, queue_path
from forge_ops.schemas.review_item import review_item_from_path, classify_type, now_iso

# ── Active queue manifest ─────────────────────────────────────────────────────

def active_queue_path() -> Path:
    return review_root() / "ACTIVE-QUEUE.json"


def _read_active_queue() -> dict:
    p = active_queue_path()
    if p.exists():
        try:
            return json.loads(p.read_text())
        except Exception:
            pass
    return {"version": 1, "updated_at": now_iso(), "items": []}


def _write_active_queue(data: dict) -> None:
    data["updated_at"] = now_iso()
    serialized = json.dumps(data, indent=2)
    json.loads(serialized)  # validate
    p = active_queue_path()
    with tempfile.NamedTemporaryFile("w", dir=p.parent, delete=False, suffix=".tmp") as tf:
        tf.write(serialized)
        tmp = tf.name
    os.replace(tmp, p)


# ── Active queue operations ───────────────────────────────────────────────────

def register_item(
    artifact_path: str | Path,
    task_id: str = "",
    title: str = "",
    priority: int = 70,
    lane: str = "",
) -> dict:
    """
    Add an artifact to the active review queue manifest.
    Called automatically by package(). Can also be called directly for items
    that were packaged without going through the engine.
    Returns the item dict.
    """
    p = Path(artifact_path)
    data = _read_active_queue()
    existing_ids = {i["id"] for i in data["items"]}

    rtype = classify_type(str(p))
    item_id = re.sub(r"[^a-z0-9-]", "-", p.stem.lower())[:60]
    # Make ID unique if collision
    base_id = item_id
    suffix = 0
    while item_id in existing_ids:
        suffix += 1
        item_id = f"{base_id}-{suffix}"

    inferred_title = title or p.stem.replace("-", " ").replace("_", " ").title()
    item = {
        "id": item_id,
        "path": str(p),
        "title": inferred_title,
        "type": rtype,
        "review_content_type": rtype,
        "task_id": task_id,
        "priority": priority,
        "lane": lane,
        "created_at": now_iso(),
        "current_decision": None,
        "review_comment": "",
        "reviewer": None,
        "reviewed_at": None,
        "resolved_at": None,
    }
    data["items"].append(item)
    _write_active_queue(data)
    return item


def update_decision(item_id: str, decision: str, comment: str = "", reviewer: str = "lucas") -> bool:
    """Update a decision on an active queue item. Returns True if found."""
    data = _read_active_queue()
    found = False
    for item in data["items"]:
        if item["id"] == item_id or item.get("task_id") == item_id:
            item["current_decision"] = decision
            item["review_comment"] = comment
            item["reviewer"] = reviewer
            item["reviewed_at"] = now_iso()
            if decision in ("approve", "reject"):
                item["resolved_at"] = now_iso()
            found = True
            break
    if found:
        _write_active_queue(data)
    return found


def active(root: Path | None = None) -> list[dict]:
    """Return all items in the active queue manifest."""
    return _read_active_queue().get("items", [])


def pending(root: Path | None = None) -> list[dict]:
    """Return active queue items with no current_decision, sorted by priority descending."""
    items = [i for i in active() if not i.get("current_decision")]
    return sorted(items, key=lambda i: (-i.get("priority", 0), i.get("created_at", "")))


def active_status() -> dict:
    """Summary of the active queue."""
    items = active()
    from collections import Counter
    by_decision = Counter(i.get("current_decision") or "pending" for i in items)
    by_type = Counter(i.get("type", "unknown") for i in items)
    return {
        "total": len(items),
        "by_decision": dict(by_decision),
        "by_type": dict(by_type),
        "pending_count": by_decision.get("pending", 0),
        "manifest": str(active_queue_path()),
    }


# ── Full index (legacy / push-state compatibility) ────────────────────────────

REVIEW_EXTENSIONS = {".md", ".html", ".pdf", ".png", ".jpg", ".jpeg", ".gif", ".json", ".txt"}
SKIP_SUFFIXES = {"-REVIEW.md", "PENDING.md", "README.md", "ACTIVE-QUEUE.json"}
SKIP_NAMES = {".DS_Store", ".gitkeep", ".gitignore", "Thumbs.db", "ACTIVE-QUEUE.json"}


def _is_artifact(path: Path) -> bool:
    if path.is_dir():
        return False
    if path.name.startswith("."):
        return False
    if path.name in SKIP_NAMES:
        return False
    if any(path.name.endswith(s) for s in SKIP_SUFFIXES):
        return False
    if path.name in {"PENDING.md", "ACTIVE-QUEUE.json"}:
        return False
    return path.suffix.lower() in REVIEW_EXTENSIONS


def index(root: Path | None = None) -> list[dict]:
    """
    Full crawl of the review root. Returns all artifacts (480+ items including legacy).
    Used by push-state.js compatibility layer.
    For actionable pending items, use pending() instead.
    """
    r = root or review_root()
    items = []
    if not r.exists():
        return items
    for p in sorted(r.rglob("*")):
        if not _is_artifact(p):
            continue
        item = review_item_from_path(str(p))
        # Enrich from adjacent -REVIEW.md
        review_meta = p.parent / (p.stem + "-REVIEW.md")
        if review_meta.exists():
            content = review_meta.read_text(errors="replace")
            m = re.search(r"Task ID:\s*(\S+)", content)
            if m:
                item["task_id"] = m.group(1)
            if "approved" in content.lower():
                item["current_decision"] = "approve"
            elif "needs revision" in content.lower() or "needs_revision" in content.lower():
                item["current_decision"] = "needs_revision"
            elif "rejected" in content.lower():
                item["current_decision"] = "reject"
        # Also check active queue for known decisions
        items.append(item)
    return items


def status(root: Path | None = None) -> dict:
    """Returns both full-index and active-queue stats."""
    return {
        "full_index": _full_status(root),
        "active_queue": active_status(),
    }


def _full_status(root: Path | None = None) -> dict:
    items = index(root)
    from collections import Counter
    by_decision = Counter(i.get("current_decision") or "pending" for i in items)
    by_type = Counter(i.get("type", "unknown") for i in items)
    return {
        "total": len(items),
        "by_decision": dict(by_decision),
        "by_type": dict(by_type),
        "pending_count": by_decision.get("pending", 0),
    }


# ── Package ───────────────────────────────────────────────────────────────────

def package(
    artifact_path: str | Path,
    task_id: str = "",
    title: str = "",
    intended_metric: str = "",
    next_action: str = "",
    priority: int = 70,
    lane: str = "",
    root: Path | None = None,
) -> dict:
    """
    Copy an artifact to the correct review subfolder, create a -REVIEW.md metadata file,
    and register the item in ACTIVE-QUEUE.json.

    Returns the result dict with destination paths.
    Does NOT mark the task DONE in QUEUE.json -- caller must do that separately.
    """
    import shutil
    r = root or review_root()
    src = Path(artifact_path)
    if not src.exists():
        raise FileNotFoundError(f"Artifact not found: {src}")

    rtype = classify_type(str(src))
    subdir_map = {
        "dashboard": r / "dashboard",
        "notebooklm": r / "notebooklm",
        "products": r / "products",
        "visual": r / "visuals",
        "content": r / "content",
    }
    dest_dir = subdir_map.get(rtype, r / "products")
    dest_dir.mkdir(parents=True, exist_ok=True)

    dest = dest_dir / src.name
    if dest.resolve() != src.resolve():
        shutil.copy2(src, dest)

    inferred_title = title or src.stem.replace("-", " ").replace("_", " ").title()
    meta_path = dest_dir / (src.stem + "-REVIEW.md")
    _write_review_meta(
        meta_path,
        title=inferred_title,
        task_id=task_id,
        artifact_name=src.name,
        rtype=rtype,
        intended_metric=intended_metric,
        next_action=next_action,
    )

    # Register in active queue
    # Inherit priority from queue task if task_id is provided
    effective_priority = priority
    effective_lane = lane
    if task_id:
        try:
            q = json.loads(queue_path().read_text())
            for t in q.get("tasks", []):
                if t["id"] == task_id:
                    effective_priority = t.get("priority", priority)
                    effective_lane = t.get("lane", lane)
                    break
        except Exception:
            pass

    registered = register_item(
        dest, task_id=task_id, title=inferred_title,
        priority=effective_priority, lane=effective_lane,
    )

    _update_pending_index(inferred_title, str(dest), dest_dir.name, meta_path)

    return {
        "artifact_dest": str(dest),
        "meta_path": str(meta_path),
        "type": rtype,
        "task_id": task_id,
        "active_queue_id": registered["id"],
    }


def _write_review_meta(
    path: Path,
    title: str,
    task_id: str,
    artifact_name: str,
    rtype: str,
    intended_metric: str = "",
    next_action: str = "",
) -> None:
    date_str = datetime.now().strftime("%Y-%m-%d")
    content = f"""# Review: {title}
Date: {date_str}
Task ID: {task_id or "(none)"}
Artifact: {artifact_name}
Type: {rtype}
Status: PENDING_REVIEW

## What This Is
{title}

## Why It Matters
(fill in)

## Intended Metric
{intended_metric or "(fill in -- what metric does this move?)"}

## Approval Request
This artifact is ready for review. Please approve, request revisions, or reject.

Options:
- [ ] Approved -- proceed to publish/deploy
- [ ] Needs revision -- see notes below
- [ ] Rejected -- close task and log reason

## Recommended Next Action (if approved)
{next_action or "(fill in -- specific next step after approval)"}

## Notes

"""
    path.write_text(content)


def _update_pending_index(title: str, artifact_path: str, folder: str, meta_path: Path) -> None:
    idx = pending_index_path()
    date_str = datetime.now().strftime("%Y-%m-%d")
    new_row = f"| {title[:45]} | {folder} | {date_str} | PENDING_REVIEW |\n"
    if idx.exists():
        content = idx.read_text()
        if title[:30] not in content:
            idx.write_text(content.rstrip("\n") + "\n" + new_row)
    else:
        idx.write_text(
            "# Review Pending\n\n"
            "| Artifact | Folder | Date Added | Status |\n"
            "|----------|--------|------------|--------|\n"
            + new_row
        )


# ── Lifecycle hygiene ─────────────────────────────────────────────────────────

def archive_resolved(*, keep_later: bool = True) -> dict:
    """
    Move approved and rejected items out of the active queue into an archive section.
    Items with decision='later' are kept pending by default (keep_later=True).
    Returns counts of archived and remaining items.
    """
    data = _read_active_queue()
    terminal_decisions = {"approve", "reject"}
    if not keep_later:
        terminal_decisions.add("later")

    prior_archived_count = len(data.get("archived", []))
    active_items = []
    newly_archived = []

    for item in data["items"]:
        dec = item.get("current_decision")
        if dec in terminal_decisions:
            newly_archived.append(item)
        else:
            active_items.append(item)

    all_archived = data.get("archived", []) + newly_archived
    data["items"] = active_items
    data["archived"] = all_archived
    _write_active_queue(data)

    return {
        "newly_archived": len(newly_archived),
        "remaining_pending": len([i for i in active_items if not i.get("current_decision")]),
        "remaining_active": len(active_items),
        "total_archived": len(all_archived),
    }


# ── Sync ─────────────────────────────────────────────────────────────────────

def sync(root: Path | None = None) -> dict:
    """Rebuild PENDING.md from the active queue (not the full legacy index)."""
    idx = pending_index_path()
    pending_items = pending()

    lines = [
        "# Review Pending\n",
        "\n",
        "Rebuilt by `python3 -m forge_ops review sync` -- do not edit manually.\n",
        f"Active queue: {active_queue_path()}\n",
        "\n",
        "| Artifact | Type | Lane | Priority | Status |\n",
        "|----------|------|------|----------|--------|\n",
    ]
    for item in pending_items:
        p = Path(item["path"])
        lines.append(
            f"| {item['title'][:45]} | {item.get('type','?')} | "
            f"{item.get('lane','?')} | {item.get('priority',0)} | PENDING_REVIEW |\n"
        )

    idx.write_text("".join(lines))

    all_items = active()
    by_decision = {}
    for i in all_items:
        d = i.get("current_decision") or "pending"
        by_decision[d] = by_decision.get(d, 0) + 1

    return {
        "active_total": len(all_items),
        "pending": len(pending_items),
        "decided": len(all_items) - len(pending_items),
        "by_decision": by_decision,
        "pending_index": str(idx),
    }
