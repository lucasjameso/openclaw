"""Canonical review item schema helpers."""
from datetime import datetime, timezone
import re


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")


REVIEW_TYPE_MAP = {
    "dashboard": ["dashboard", "worker", "cloudflare"],
    "notebooklm": ["notebook", "nlm", "notebooklm"],
    "products": ["product", "pdf", "checklist", "guide", "kit"],
    "visual": ["visual", "image", "graphic", "card", "x-card", "banner"],
    "content": ["blog", "email", "thread", "post", "content", "copy", "dm"],
}


def classify_type(path_or_title: str) -> str:
    """Classify a review item type from its path or title."""
    s = path_or_title.lower()
    for rtype, keywords in REVIEW_TYPE_MAP.items():
        if any(k in s for k in keywords):
            return rtype
    return "products"  # default


def review_item_from_path(path: str, task_id: str = "", title: str = "") -> dict:
    """Build a review item dict from a file path."""
    from pathlib import Path
    p = Path(path)
    inferred_title = title or p.stem.replace("-", " ").replace("_", " ").title()
    rtype = classify_type(str(p))
    return {
        "id": re.sub(r"[^a-z0-9-]", "-", p.stem.lower())[:60],
        "path": str(p),
        "title": inferred_title,
        "type": rtype,
        "review_content_type": rtype,
        "task_id": task_id,
        "created_at": now_iso(),
        "current_decision": None,
        "review_comment": "",
        "reviewer": None,
        "reviewed_at": None,
        "resolved_at": None,
    }
