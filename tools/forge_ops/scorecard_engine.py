"""
scorecard_engine.py -- generate daily and weekly scorecards from structured state.

CLI usage:
  python3 -m forge_ops scorecard daily [--date 2026-03-27] [--json]
  python3 -m forge_ops scorecard weekly [--week 2026-W13] [--json]
  python3 -m forge_ops scorecard compare --date-a 2026-03-26 --date-b 2026-03-27
"""
from __future__ import annotations

import json
from collections import Counter
from datetime import datetime, date, timedelta
from pathlib import Path
from typing import Optional

from forge_ops.config import (
    queue_path, lessons_dir, scorecards_dir, experiments_dir,
    offers_dir, review_root,
)


# ── Data collectors ───────────────────────────────────────────────────────────

def _load_queue() -> dict:
    try:
        return json.loads(queue_path().read_text())
    except Exception:
        return {"tasks": []}


def _count_lessons(date_str: str) -> int:
    d = lessons_dir()
    if not d.exists():
        return 0
    return sum(1 for f in d.glob(f"lesson-{date_str}*.md"))


def _list_experiments(status_filter: str | None = None) -> list[dict]:
    d = experiments_dir()
    if not d.exists():
        return []
    results = []
    for f in sorted(d.glob("exp-*.md")):
        content = f.read_text(errors="replace")
        m_status = _extract_field(content, "Status")
        if status_filter and m_status != status_filter:
            continue
        results.append({
            "slug": f.stem,
            "status": m_status or "unknown",
            "lane": _extract_field(content, "Lane") or "unknown",
        })
    return results


def _list_offers() -> list[dict]:
    d = offers_dir()
    if not d.exists():
        return []
    results = []
    for f in sorted(d.glob("offer-*.md")):
        content = f.read_text(errors="replace")
        results.append({
            "slug": f.stem,
            "status": _extract_field(content, "Status") or "draft",
            "lane": _extract_field(content, "Lane") or "unknown",
        })
    return results


def _extract_field(content: str, field: str) -> Optional[str]:
    import re
    m = re.search(rf"^{re.escape(field)}:\s*(.+)", content, re.MULTILINE)
    return m.group(1).strip() if m else None


def _count_review_items_by_decision(date_str: str | None = None) -> dict:
    from forge_ops.approval_engine import export as export_approvals
    records = export_approvals(date_str=date_str)
    counts: Counter = Counter(r.get("decision") for r in records)
    return dict(counts)


# ── Daily scorecard ───────────────────────────────────────────────────────────

def _daily_data(date_str: str) -> dict:
    data = _load_queue()
    tasks = data.get("tasks", [])

    completed_today = [
        t for t in tasks
        if t.get("status") == "DONE"
        and (t.get("completed_at") or "").startswith(date_str)
    ]
    blocked = [t for t in tasks if t.get("status") == "BLOCKED"]
    ready = [t for t in tasks if t.get("status") == "READY"]
    in_progress = [t for t in tasks if t.get("status") == "IN_PROGRESS"]

    blocked_by_type: Counter = Counter(t.get("blocked_type", "unknown") for t in blocked)
    ready_by_lane: Counter = Counter(t.get("lane", "unknown") for t in ready)

    # Stale check
    from forge_ops.queue_engine import _find_stale
    stale = _find_stale(data)

    lessons = _count_lessons(date_str)
    active_experiments = _list_experiments("active")
    closed_experiments = [
        e for e in _list_experiments()
        if e["status"].startswith("closed")
    ]
    active_offers = [o for o in _list_offers() if o["status"] == "active"]
    review_decisions = _count_review_items_by_decision(date_str)

    # Revenue proximity score (simple heuristic)
    # Service tasks + product tasks in completed = higher proximity
    revenue_tasks = [
        t for t in completed_today
        if t.get("lane") in {"service", "productized_asset"}
    ]

    return {
        "date": date_str,
        "tasks_completed": len(completed_today),
        "tasks_completed_detail": [
            {"id": t["id"], "title": t["title"][:60], "lane": t.get("lane")}
            for t in completed_today
        ],
        "tasks_blocked": len(blocked),
        "blocked_by_type": dict(blocked_by_type),
        "tasks_ready": len(ready),
        "ready_by_lane": dict(ready_by_lane),
        "tasks_in_progress": len(in_progress),
        "stale_in_progress": len(stale),
        "lessons_captured": lessons,
        "active_experiments": len(active_experiments),
        "experiments_closed_today": len(closed_experiments),
        "active_offers": len(active_offers),
        "review_decisions_today": review_decisions,
        "revenue_adjacent_tasks": len(revenue_tasks),
    }


def daily(date_str: str | None = None) -> dict:
    """Generate and save a daily scorecard. Returns the data dict."""
    ds = date_str or datetime.now().strftime("%Y-%m-%d")
    d = _daily_data(ds)

    md = _render_daily_md(d)
    out_dir = scorecards_dir()
    out_dir.mkdir(parents=True, exist_ok=True)
    md_path = out_dir / f"daily-{ds}.md"
    json_path = out_dir / f"daily-{ds}.json"
    md_path.write_text(md)
    json_path.write_text(json.dumps(d, indent=2))

    d["_files"] = {"markdown": str(md_path), "json": str(json_path)}
    return d


def _render_daily_md(d: dict) -> str:
    ready_lanes = "\n".join(
        f"| {lane} | {count} |"
        for lane, count in d["ready_by_lane"].items()
    ) or "| (none) | 0 |"

    blocked_types = "\n".join(
        f"| {bt} | {count} |"
        for bt, count in d["blocked_by_type"].items()
    ) or "| none | 0 |"

    completed_list = "\n".join(
        f"- [{t['lane'] or '?'}] {t['title']}"
        for t in d["tasks_completed_detail"]
    ) or "- none"

    decisions_list = "\n".join(
        f"- {decision}: {count}"
        for decision, count in d["review_decisions_today"].items()
    ) or "- none"

    return f"""# Forge Daily Scorecard: {d['date']}

## Operational

| Metric | Value |
|--------|-------|
| Tasks completed | {d['tasks_completed']} |
| Tasks blocked | {d['tasks_blocked']} |
| Tasks ready | {d['tasks_ready']} |
| Tasks in progress | {d['tasks_in_progress']} |
| Stale in-progress | {d['stale_in_progress']} |

## Completed Today

{completed_list}

## Ready Queue by Lane

| Lane | Count |
|------|-------|
{ready_lanes}

## Blocked by Type

| Type | Count |
|------|-------|
{blocked_types}

## Revenue Signal

| Metric | Value |
|--------|-------|
| Revenue-adjacent tasks completed | {d['revenue_adjacent_tasks']} |
| Active offers | {d['active_offers']} |
| Active experiments | {d['active_experiments']} |

## Quality / Learning

| Metric | Value |
|--------|-------|
| Lessons captured today | {d['lessons_captured']} |
| Review decisions today | {sum(d['review_decisions_today'].values())} |

## Review Decisions

{decisions_list}

## Next Best Move

(fill in: what is the single highest-leverage action for the next session?)
"""


# ── Weekly scorecard ──────────────────────────────────────────────────────────

def weekly(week_str: str | None = None) -> dict:
    """
    Generate a weekly summary by aggregating daily scorecards.
    week_str format: "YYYY-WNN" e.g. "2026-W13"
    """
    if week_str:
        year, wk = week_str.split("-W")
        week_start = datetime.fromisocalendar(int(year), int(wk), 1).date()
    else:
        today = date.today()
        week_start = today - timedelta(days=today.weekday())

    days = [str(week_start + timedelta(days=i)) for i in range(7)]
    out_dir = scorecards_dir()

    daily_data = []
    for ds in days:
        json_path = out_dir / f"daily-{ds}.json"
        if json_path.exists():
            try:
                daily_data.append(json.loads(json_path.read_text()))
            except Exception:
                pass

    if not daily_data:
        # Generate today's if nothing exists
        daily_data = [daily()]

    totals = {
        "week": str(week_start),
        "days_with_data": len(daily_data),
        "tasks_completed": sum(d.get("tasks_completed", 0) for d in daily_data),
        "lessons_captured": sum(d.get("lessons_captured", 0) for d in daily_data),
        "revenue_adjacent_tasks": sum(d.get("revenue_adjacent_tasks", 0) for d in daily_data),
        "active_experiments": max((d.get("active_experiments", 0) for d in daily_data), default=0),
        "active_offers": max((d.get("active_offers", 0) for d in daily_data), default=0),
        "daily_breakdown": [
            {"date": d["date"], "completed": d.get("tasks_completed", 0)}
            for d in daily_data
        ],
    }

    md = _render_weekly_md(totals)
    week_label = f"{week_start.isocalendar()[0]}-W{week_start.isocalendar()[1]:02d}"
    md_path = out_dir / f"weekly-{week_label}.md"
    json_path = out_dir / f"weekly-{week_label}.json"
    out_dir.mkdir(parents=True, exist_ok=True)
    md_path.write_text(md)
    json_path.write_text(json.dumps(totals, indent=2))

    totals["_files"] = {"markdown": str(md_path), "json": str(json_path)}
    return totals


def _render_weekly_md(d: dict) -> str:
    daily_rows = "\n".join(
        f"| {row['date']} | {row['completed']} |"
        for row in d["daily_breakdown"]
    )
    return f"""# Forge Weekly Scorecard: Week of {d['week']}

| Metric | Total |
|--------|-------|
| Tasks completed | {d['tasks_completed']} |
| Lessons captured | {d['lessons_captured']} |
| Revenue-adjacent tasks | {d['revenue_adjacent_tasks']} |
| Active experiments (end) | {d['active_experiments']} |
| Active offers (end) | {d['active_offers']} |

## Daily Breakdown

| Date | Completed |
|------|-----------|
{daily_rows}

## Notes

(fill in: key wins, blockers, direction for next week)
"""


# ── Compare ───────────────────────────────────────────────────────────────────

def compare(date_a: str, date_b: str) -> dict:
    """Compare two daily scorecards."""
    out_dir = scorecards_dir()
    a = json.loads((out_dir / f"daily-{date_a}.json").read_text())
    b = json.loads((out_dir / f"daily-{date_b}.json").read_text())
    return {
        "date_a": date_a,
        "date_b": date_b,
        "tasks_completed_delta": b["tasks_completed"] - a["tasks_completed"],
        "lessons_delta": b["lessons_captured"] - a["lessons_captured"],
        "revenue_adjacent_delta": b["revenue_adjacent_tasks"] - a["revenue_adjacent_tasks"],
        "a": a,
        "b": b,
    }
