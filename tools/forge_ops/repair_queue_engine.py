"""
Repair Queue Engine.

Reads needs_revision items from the dashboard, classifies them into
repair clusters, generates a prioritized repair queue and per-cluster
repair briefs for Claude to work from.

Usage via CLI:
  python3 -m forge_ops repair-queue build
  python3 -m forge_ops repair-queue list --json
"""
import collections
import datetime
import json
import os
import textwrap
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
REPAIRS = WORKSPACE / "review-repairs"

CLUSTER_LABELS = {
    "visual_system": "Visual System (dimensions, layout, brand styling)",
    "launch_copy": "Launch Copy (phase language, dates, CTAs)",
    "voice_and_specificity": "Voice and Specificity (hooks, generics, proof)",
    "cta_and_offer": "CTA and Offer (clarity, audience, value exchange)",
    "packaging_and_format": "Packaging and Format (headers, footers, missing elements)",
    "other": "Other",
}

CLUSTER_OWNERS = {
    "visual_system": "claude",
    "launch_copy": "claude",
    "voice_and_specificity": "codex",
    "cta_and_offer": "codex",
    "packaging_and_format": "claude",
    "other": "human",
}


def _api_get(path):
    url = f"{DASHBOARD_API_URL.rstrip('/')}{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "forge_ops/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def _fetch_items():
    return _api_get("/api/reviews").get("items", [])


def _fetch_events(limit=500):
    return _api_get(f"/api/review-events?limit={limit}").get("events", [])


def _classify_cluster(issues, reason_tags, comment):
    tags = set(issues + reason_tags)
    c = (comment or "").lower()

    if tags & {"dimensions", "layout", "formatting", "design", "visual_hierarchy_weak",
               "visual_clutter", "not_shippable"} or "taller" in c or "cut off" in c or "not the right size" in c:
        return "visual_system"
    if tags & {"timing_mismatch", "launch_language_wrong"} or "phase" in c or "launch" in c:
        return "launch_copy"
    if tags & {"voice_mismatch", "hook_weak", "too_generic", "repetitive_angle",
               "needs_tighter_edit", "proof_weak"} or "generic" in c or "voice" in c:
        return "voice_and_specificity"
    if tags & {"cta_unclear", "offer_unclear", "audience_unclear"} or "cta" in c or "offer" in c:
        return "cta_and_offer"
    if tags & {"branding", "typography", "brand_outdated"} or "branding" in c or "darker" in c or "new branding" in c:
        return "visual_system"
    if tags & {"missing_content"} or "missing" in c or "header" in c or "footer" in c:
        return "packaging_and_format"
    return "other"


def build():
    """Build the repair queue from current needs_revision items. Returns summary."""
    items = _fetch_items()
    events = _fetch_events()
    REPORTS.mkdir(parents=True, exist_ok=True)
    REPAIRS.mkdir(parents=True, exist_ok=True)

    # Build event lookup
    event_by_item = {}
    for e in events:
        iid = e.get("item_id")
        if iid not in event_by_item or (e.get("reviewed_at") or "") > (event_by_item[iid].get("reviewed_at") or ""):
            event_by_item[iid] = e

    revision_items = [i for i in items if i.get("current_decision") == "needs_revision"]

    # Build repair records
    repair_records = []
    for item in revision_items:
        ev = event_by_item.get(item["id"], {})
        issues = ev.get("issues") or []
        reason_tags = ev.get("reason_tags") or []
        comment = ev.get("comment") or ""
        improvement_note = ev.get("improvement_note") or ""
        template_action = ev.get("template_action") or "none"
        cluster = _classify_cluster(issues, reason_tags, comment)

        repair_records.append({
            "item_id": item["id"],
            "title": item.get("name") or item.get("title") or item["id"],
            "artifact_path": item.get("path", ""),
            "latest_decision": "needs_revision",
            "review_comment": comment,
            "reason_tags": reason_tags,
            "issue_tags": issues,
            "improvement_note": improvement_note,
            "template_action": template_action,
            "revision_count": item.get("revision_count", 0),
            "cluster": cluster,
            "recommended_owner": CLUSTER_OWNERS.get(cluster, "human"),
        })

    # Sort by cluster, then by revision_count desc (highest churn first)
    repair_records.sort(key=lambda r: (r["cluster"], -r["revision_count"]))

    # Cluster stats
    cluster_counts = collections.Counter(r["cluster"] for r in repair_records)

    # Write JSON
    queue_data = {
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "total_items": len(repair_records),
        "cluster_counts": dict(cluster_counts),
        "items": repair_records,
    }
    json_path = REPORTS / "repair-queue-latest.json"
    json_path.write_text(json.dumps(queue_data, indent=2) + "\n")

    # Write markdown
    md_lines = [
        "# Repair Queue",
        "",
        f"Generated: {datetime.date.today().isoformat()}",
        f"Items needing repair: {len(repair_records)}",
        "",
        "## Cluster Summary",
        "",
        "| Cluster | Count | Owner |",
        "|---------|-------|-------|",
    ]
    for cluster, count in cluster_counts.most_common():
        label = CLUSTER_LABELS.get(cluster, cluster)
        owner = CLUSTER_OWNERS.get(cluster, "human")
        md_lines.append(f"| {label} | {count} | {owner} |")

    md_lines += ["", "---", ""]

    for cluster, count in cluster_counts.most_common():
        label = CLUSTER_LABELS.get(cluster, cluster)
        cluster_items = [r for r in repair_records if r["cluster"] == cluster]
        md_lines.append(f"## {label} ({count} items)")
        md_lines.append("")
        for r in cluster_items:
            md_lines.append(f"### {r['title'][:60]}")
            md_lines.append(f"- Path: `{r['artifact_path'][:70]}`")
            md_lines.append(f"- Issue tags: {', '.join(r['issue_tags']) if r['issue_tags'] else 'none'}")
            md_lines.append(f"- Revision count: {r['revision_count']}")
            if r["review_comment"]:
                md_lines.append(f"- Comment: {r['review_comment'][:120]}")
            if r["improvement_note"]:
                md_lines.append(f"- Fix: {r['improvement_note'][:120]}")
            if r["template_action"] != "none":
                md_lines.append(f"- Template action: {r['template_action']}")
            md_lines.append("")

    md_path = REPORTS / "repair-queue-latest.md"
    md_path.write_text("\n".join(md_lines) + "\n")

    # Write per-cluster repair briefs
    _write_cluster_briefs(repair_records, cluster_counts)

    return {
        "status": "ok",
        "total_items": len(repair_records),
        "cluster_counts": dict(cluster_counts),
        "files": {
            "json": str(json_path),
            "markdown": str(md_path),
            "briefs_dir": str(REPAIRS),
        },
    }


def _write_cluster_briefs(repair_records, cluster_counts):
    """Write one repair brief per cluster."""
    BRIEF_MAP = {
        "visual_system": "repair-brief-visuals.md",
        "launch_copy": "repair-brief-launch-content.md",
        "voice_and_specificity": "repair-brief-voice-and-hooks.md",
        "cta_and_offer": "repair-brief-cta-and-offer.md",
        "packaging_and_format": "repair-brief-packaging.md",
        "other": "repair-brief-other.md",
    }

    for cluster, filename in BRIEF_MAP.items():
        cluster_items = [r for r in repair_records if r["cluster"] == cluster]
        if not cluster_items:
            continue

        label = CLUSTER_LABELS.get(cluster, cluster)
        owner = CLUSTER_OWNERS.get(cluster, "human")

        lines = [
            f"# Repair Brief: {label}",
            "",
            f"Generated: {datetime.date.today().isoformat()}",
            f"Items: {len(cluster_items)}",
            f"Recommended owner: {owner}",
            "",
            "---",
            "",
            "## Repair Instructions",
            "",
        ]

        if cluster == "visual_system":
            lines += [
                "All items in this cluster have structural visual issues: wrong dimensions,",
                "content cutoff, brand styling mismatch, or typography drift.",
                "",
                "Before repairing any item, read:",
                "- `data/workspace/patterns/brand-constraints-inline.md` (hard constraints)",
                "- `data/workspace/playbooks/visual-review-playbook.md` (checklist)",
                "",
                "Common fix: verify canvas is 1080x1350, content fits within layout zones,",
                "palette is locked to the 4 brand colors, and footer is present.",
                "",
            ]
        elif cluster == "launch_copy":
            lines += [
                "All items have launch-phase language issues: wrong dates, wrong phase CTA,",
                "or format availability language that does not match the current launch state.",
                "",
                "Before repairing, read:",
                "- `data/workspace/playbooks/launch-content-quality-playbook.md`",
                "",
                "Check: what phase are we in? Does the CTA match? Are dates correct?",
                "",
            ]
        elif cluster == "voice_and_specificity":
            lines += [
                "Items need voice, hook, or specificity improvements.",
                "",
                "Key rules:",
                "- Every piece must have at least one specific number, named mechanism, or concrete contrast",
                "- Lucas voice: direct, operational. Forge voice: dark humor, self-deprecating",
                "- Avoid: 'Good leaders build systems' (generic). Use: 'The 72-hour audit found 40% was noise' (specific)",
                "",
            ]
        elif cluster == "packaging_and_format":
            lines += [
                "Items are missing required elements: headers, footers, book title, dates, or CTA.",
                "",
                "Fix: add the missing element from the brand constraints checklist.",
                "Every asset must have: brand footer, book title (if referencing CLARITY),",
                "phase-correct dates, and no empty social proof.",
                "",
            ]
        else:
            lines += ["Review each item individually. No cluster-level fix pattern identified.", ""]

        lines += ["---", "", "## Items to Repair", ""]

        for i, r in enumerate(cluster_items, 1):
            lines.append(f"### {i}. {r['title'][:60]}")
            lines.append(f"- **Path:** `{r['artifact_path']}`")
            lines.append(f"- **Issue tags:** {', '.join(r['issue_tags']) if r['issue_tags'] else 'none'}")
            if r["review_comment"]:
                lines.append(f"- **Lucas said:** {r['review_comment'][:200]}")
            if r["improvement_note"]:
                lines.append(f"- **Specific fix:** {r['improvement_note'][:200]}")
            if r["template_action"] != "none":
                lines.append(f"- **Template action:** {r['template_action']}")
            lines.append("")

        brief_path = REPAIRS / filename
        brief_path.write_text("\n".join(lines) + "\n")


def list_queue():
    """Read and return the current repair queue."""
    json_path = REPORTS / "repair-queue-latest.json"
    if not json_path.exists():
        return {"error": "No repair queue found. Run 'repair-queue build' first."}
    return json.loads(json_path.read_text())
