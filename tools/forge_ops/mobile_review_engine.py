"""
mobile_review_engine.py -- compact review payloads for the iPhone inbox.

Reads from the ACTIVE-QUEUE.json manifest (not the full 480-item legacy index).
Does NOT replace the /review-inbox Cloudflare Worker page.
The Worker reads its review state from /api/reviews (Cloudflare KV).
This module drives the local approval CLI and provides deep-link helpers.

CLI usage:
  python3 -m forge_ops mobile-review export [--json]
  python3 -m forge_ops mobile-review next [--json]
  python3 -m forge_ops mobile-review item --id <item-id> [--json]
"""
from __future__ import annotations

from pathlib import Path
from typing import Optional

from forge_ops.review_engine import active, pending, active_status


# ── Compact item ──────────────────────────────────────────────────────────────

def _compact(item: dict) -> dict:
    p = Path(item.get("path", ""))
    return {
        "id": item["id"],
        "title": item.get("title", p.stem),
        "type": item.get("type", "products"),
        "review_content_type": item.get("review_content_type", item.get("type", "")),
        "task_id": item.get("task_id", ""),
        "priority": item.get("priority", 0),
        "lane": item.get("lane", ""),
        "created_at": item.get("created_at", ""),
        "current_decision": item.get("current_decision"),
        "review_comment": item.get("review_comment", ""),
        "path": str(p),
        "deep_link": slack_link(item["id"]),
    }


# ── Export ────────────────────────────────────────────────────────────────────

def export(root: Path | None = None) -> dict:
    """
    Return a mobile-optimized payload of active review items.
    Only items in ACTIVE-QUEUE.json -- not the full 480-item legacy index.
    """
    items = active(root)
    compact_items = [_compact(i) for i in items]
    s = active_status()
    return {
        "items": compact_items,
        "stats": {
            "pending": s["by_decision"].get("pending", 0),
            "approved": s["by_decision"].get("approve", 0),
            "rejected": s["by_decision"].get("reject", 0),
            "needs_revision": s["by_decision"].get("needs_revision", 0),
            "later": s["by_decision"].get("later", 0),
            "total": s["total"],
        },
        "source": "ACTIVE-QUEUE.json",
    }


# ── Next pending ──────────────────────────────────────────────────────────────

def next_pending(root: Path | None = None) -> Optional[dict]:
    """
    Return the next pending review item, sorted by priority descending.
    Only reads from ACTIVE-QUEUE.json.
    """
    items = pending(root)
    if not items:
        return None
    return _compact(items[0])  # pending() already sorted by priority desc


# ── Item lookup ───────────────────────────────────────────────────────────────

def item_by_id(item_id: str, root: Path | None = None) -> Optional[dict]:
    for i in active(root):
        if item_id.lower() in i["id"].lower() or item_id == i.get("task_id"):
            return _compact(i)
    return None


# ── Slack deep-link helper ────────────────────────────────────────────────────

def slack_link(item_id: str, base_url: str = "https://openclaw.iac-solutions.io") -> str:
    return f"{base_url}/review-inbox?item={item_id}"
