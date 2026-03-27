"""
Review Intelligence Engine.

Fetches review events from the dashboard API, analyzes patterns,
and writes structured reports to data/workspace/reports/.

Usage via CLI:
  python3 -m forge_ops review-intel refresh
  python3 -m forge_ops review-intel report --json
"""
import collections
import datetime
import json
import os
import urllib.request
from pathlib import Path

DASHBOARD_API_URL = os.environ.get(
    "DASHBOARD_API_URL",
    "https://forge-dashboard.lucasjamesoliver1.workers.dev",
)
WORKSPACE = Path(os.environ.get(
    "FORGE_WORKSPACE",
    Path(__file__).resolve().parents[2] / "data" / "workspace",
))
REPORTS = WORKSPACE / "reports"
PATTERNS = WORKSPACE / "patterns"


def _api_get(path):
    url = f"{DASHBOARD_API_URL.rstrip('/')}{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "forge_ops/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def _fetch_events(limit=500):
    return _api_get(f"/api/review-events?limit={limit}").get("events", [])


def _fetch_items():
    return _api_get("/api/reviews").get("items", [])


def _classify_cluster(issues, reason_tags, comment):
    """Classify an item into a repair cluster based on its tags and comment."""
    tags = set(issues + reason_tags)
    c = (comment or "").lower()

    if tags & {"dimensions", "layout", "formatting", "design", "visual_hierarchy_weak", "visual_clutter", "not_shippable"} or "taller" in c or "cut off" in c or "not the right size" in c:
        return "visual_system"
    if tags & {"timing_mismatch", "launch_language_wrong", "cta_unclear"} or "phase" in c or "launch" in c:
        return "launch_copy"
    if tags & {"voice_mismatch", "hook_weak", "too_generic", "repetitive_angle", "needs_tighter_edit", "proof_weak"} or "generic" in c or "voice" in c:
        return "voice_and_specificity"
    if tags & {"cta_unclear", "offer_unclear", "audience_unclear"} or "cta" in c or "offer" in c:
        return "cta_and_offer"
    if tags & {"branding", "typography", "brand_outdated"} or "branding" in c or "darker" in c:
        return "visual_system"
    if tags & {"missing_content"} or "missing" in c or "header" in c or "footer" in c:
        return "packaging_and_format"
    return "other"


def refresh():
    """Fetch events and items, produce all reports. Returns summary dict."""
    events = _fetch_events()
    items = _fetch_items()
    REPORTS.mkdir(parents=True, exist_ok=True)

    total = len(events)
    if total == 0:
        return {"status": "no_events", "event_count": 0}

    decs = collections.Counter(e.get("decision") for e in events)
    issue_events = [e for e in events if e.get("decision") in ("needs_revision", "reject")]
    approve_events = [e for e in events if e.get("decision") == "approve"]

    all_issues = [t for e in issue_events for t in (e.get("issues") or [])]
    reason_tags = [t for e in issue_events for t in (e.get("reason_tags") or [])]
    strength_tags = [t for e in approve_events for t in (e.get("strength_tags") or [])]
    template_actions = [e.get("template_action", "none") for e in events if e.get("template_action", "none") != "none"]
    improvement_notes = [e.get("improvement_note", "") for e in events if (e.get("improvement_note") or "").strip()]

    item_events = collections.Counter(e.get("item_id") for e in events)
    multi_review = {k: v for k, v in item_events.items() if v > 1}

    # Build event lookup for items
    event_by_item = {}
    for e in events:
        iid = e.get("item_id")
        if iid not in event_by_item or (e.get("reviewed_at") or "") > (event_by_item[iid].get("reviewed_at") or ""):
            event_by_item[iid] = e

    # Category breakdown
    cat_decisions = {}
    for e in events:
        cat = e.get("artifact_category", "unknown")
        dec = e.get("decision", "unknown")
        cat_decisions.setdefault(cat, collections.Counter())[dec] += 1

    report = {
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "event_count": total,
        "item_count": len(items),
        "approval_rate_pct": round(decs.get("approve", 0) / total * 100, 1),
        "revision_rate_pct": round(decs.get("needs_revision", 0) / total * 100, 1),
        "reject_rate_pct": round(decs.get("reject", 0) / total * 100, 1),
        "decisions": dict(decs),
        "category_breakdown": {k: dict(v) for k, v in cat_decisions.items()},
        "top_issue_tags": dict(collections.Counter(all_issues).most_common(10)),
        "top_reason_tags": dict(collections.Counter(reason_tags).most_common(10)),
        "top_strength_tags": dict(collections.Counter(strength_tags).most_common(10)),
        "template_actions": dict(collections.Counter(template_actions).most_common(5)),
        "improvement_notes_count": len(improvement_notes),
        "items_with_multiple_reviews": len(multi_review),
    }

    # Write JSON
    json_path = REPORTS / "review-intelligence-latest.json"
    json_path.write_text(json.dumps(report, indent=2) + "\n")

    # Write calibration note
    cal_path = REPORTS / "calibration-note-latest.md"
    cal_lines = [
        f"# Review Calibration Note: {datetime.date.today().isoformat()}",
        "",
        f"Events analyzed: {total}",
        f"Approval rate: {report['approval_rate_pct']}%",
        "",
        "## Top Issue Tags",
    ]
    for tag, count in collections.Counter(all_issues).most_common(5):
        cal_lines.append(f"- {tag.replace('_', ' ')}: {count}")
    cal_lines += ["", "## Top Reason Tags"]
    if reason_tags:
        for tag, count in collections.Counter(reason_tags).most_common(5):
            cal_lines.append(f"- {tag.replace('_', ' ')}: {count}")
    else:
        cal_lines.append("No taxonomy reason tags captured yet.")
    cal_lines += ["", "## Top Strength Tags"]
    if strength_tags:
        for tag, count in collections.Counter(strength_tags).most_common(5):
            cal_lines.append(f"- {tag.replace('_', ' ')}: {count}")
    else:
        cal_lines.append("No strength tags captured yet.")
    cal_lines += ["", "## Template Actions"]
    if template_actions:
        for action, count in collections.Counter(template_actions).most_common(5):
            cal_lines.append(f"- {action.replace('_', ' ')}: {count}")
    else:
        cal_lines.append("None recorded.")
    cal_lines.append("")
    cal_path.write_text("\n".join(cal_lines) + "\n")

    return {
        "status": "ok",
        "event_count": total,
        "item_count": len(items),
        "approval_rate_pct": report["approval_rate_pct"],
        "needs_revision_count": decs.get("needs_revision", 0),
        "files": {
            "json": str(json_path),
            "calibration": str(cal_path),
        },
    }


def report():
    """Read and return the latest intelligence report."""
    json_path = REPORTS / "review-intelligence-latest.json"
    if not json_path.exists():
        return {"error": "No report found. Run 'review-intel refresh' first."}
    return json.loads(json_path.read_text())
