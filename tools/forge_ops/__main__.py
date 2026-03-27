"""
forge_ops CLI dispatcher.

Usage: python3 -m forge_ops <engine> <command> [options]

Engines:
  queue         Queue state management (QUEUE.json)
  review        Review artifact indexing and packaging
  approval      Apply and track review decisions
  scorecard     Generate daily/weekly scorecards
  mobile-review Compact mobile review payloads

Global flags:
  --json        Output as JSON (all commands support this)
  --help        Show help

Examples:
  python3 -m forge_ops queue status --json
  python3 -m forge_ops queue next
  python3 -m forge_ops queue validate
  python3 -m forge_ops queue normalize
  python3 -m forge_ops queue recover-stale
  python3 -m forge_ops review index --json
  python3 -m forge_ops review pending
  python3 -m forge_ops review sync
  python3 -m forge_ops review package --artifact path/to/file.md --task-id T-xxx
  python3 -m forge_ops approval apply --item <id> --decision approve
  python3 -m forge_ops approval list --pending-only
  python3 -m forge_ops scorecard daily
  python3 -m forge_ops scorecard daily --date 2026-03-27 --json
  python3 -m forge_ops scorecard weekly
  python3 -m forge_ops mobile-review export --json
  python3 -m forge_ops mobile-review next
  python3 -m forge_ops content-dispatch mark-published --id W1-D1
  python3 -m forge_ops content-dispatch mark-published --id W1-D1 --url https://linkedin.com/...
"""
import argparse
import json
import sys


def _out(data, as_json: bool) -> None:
    if as_json:
        print(json.dumps(data, indent=2, default=str))
    else:
        if isinstance(data, dict):
            for k, v in data.items():
                if not k.startswith("_"):
                    print(f"  {k}: {v}")
        elif isinstance(data, list):
            for item in data:
                print(f"  {item}")
        else:
            print(data)


def _err(msg: str) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


# ── Queue ─────────────────────────────────────────────────────────────────────

def cmd_queue(args: list[str]) -> None:
    from forge_ops import queue_engine
    p = argparse.ArgumentParser(prog="forge_ops queue")
    p.add_argument("command", choices=["status", "next", "update", "block",
                                        "decompose", "recover-stale",
                                        "bootstrap", "validate", "normalize"])
    p.add_argument("--json", action="store_true")
    p.add_argument("--id", dest="task_id", help="Task ID")
    p.add_argument("--status", help="New status")
    p.add_argument("--notes", help="Notes to set")
    p.add_argument("--type", dest="blocked_type", help="blocked_type: external|internal|invalid")
    p.add_argument("--reason", help="Block reason")
    p.add_argument("--children", nargs="+", help="Child task titles for decompose")
    p.add_argument("--path", help="Override QUEUE.json path")
    ns = p.parse_args(args)

    from pathlib import Path
    qpath = Path(ns.path) if ns.path else None

    try:
        if ns.command == "status":
            _out(queue_engine.status(qpath), ns.json)

        elif ns.command == "next":
            task = queue_engine.next_task(qpath)
            if task is None:
                print("No READY tasks available.")
            else:
                _out({
                    "id": task["id"],
                    "priority": task["priority"],
                    "title": task["title"],
                    "lane": task.get("lane"),
                    "estimated_minutes": task.get("estimated_minutes"),
                    "revenue_hypothesis": task.get("revenue_hypothesis", "")[:80],
                }, ns.json)

        elif ns.command == "update":
            if not ns.task_id:
                _err("--id required")
            result = queue_engine.update(ns.task_id, status=ns.status, notes=ns.notes, path=qpath)
            _out({"updated": result["id"], "status": result["status"]}, ns.json)

        elif ns.command == "block":
            if not ns.task_id:
                _err("--id required")
            if not ns.blocked_type:
                _err("--type required (external|internal|invalid)")
            if not ns.reason:
                _err("--reason required")
            result = queue_engine.block(ns.task_id, ns.blocked_type, ns.reason, path=qpath)
            _out({"blocked": result["id"], "type": result["blocked_type"]}, ns.json)

        elif ns.command == "decompose":
            if not ns.task_id:
                _err("--id required")
            if not ns.children:
                _err("--children required (list of child task titles)")
            children = queue_engine.decompose(ns.task_id, ns.children, path=qpath)
            _out({"parent": ns.task_id, "children_created": [c["id"] for c in children]}, ns.json)

        elif ns.command == "recover-stale":
            recovered = queue_engine.recover_stale(path=qpath)
            _out({"recovered": recovered, "count": len(recovered)}, ns.json)

        elif ns.command == "validate":
            result = queue_engine.validate(path=qpath)
            if not ns.json:
                if result["valid"]:
                    print(f"  Queue valid. {result['task_count']} tasks, 0 errors.")
                else:
                    print(f"  INVALID: {result['error_count']} error(s) in {result['task_count']} tasks")
                    for tid, errs in result["errors"].items():
                        for e in errs:
                            print(f"    {tid}: {e}")
            else:
                _out(result, True)

        elif ns.command == "normalize":
            result = queue_engine.normalize(path=qpath)
            _out(result, ns.json)

        elif ns.command == "bootstrap":
            print("bootstrap: use queue_engine.bootstrap() in Python code with task_template() objects.")
            print("See tools/forge_ops/schemas/task.py for task_template().")

    except Exception as e:
        _err(str(e))


# ── Review ────────────────────────────────────────────────────────────────────

def cmd_review(args: list[str]) -> None:
    from forge_ops import review_engine
    p = argparse.ArgumentParser(prog="forge_ops review")
    p.add_argument("command", choices=["index", "list", "active", "pending", "status", "package", "sync", "add-item", "archive-approved"])
    p.add_argument("--json", action="store_true")
    p.add_argument("--artifact", help="Artifact path to package")
    p.add_argument("--task-id", dest="task_id", default="")
    p.add_argument("--title", default="")
    p.add_argument("--metric", dest="intended_metric", default="")
    p.add_argument("--next-action", dest="next_action", default="")
    ns = p.parse_args(args)

    try:
        if ns.command in ("index", "list"):
            items = review_engine.index()
            if ns.json:
                print(json.dumps(items, indent=2, default=str))
            else:
                print(f"  {len(items)} items in full review index (legacy + active)")
                print("  Use 'review active' for actionable items only.")

        elif ns.command == "active":
            items = review_engine.active()
            if ns.json:
                print(json.dumps(items, indent=2, default=str))
            else:
                print(f"  {len(items)} items in active queue (ACTIVE-QUEUE.json):")
                for i in items:
                    dec = i.get("current_decision") or "pending"
                    print(f"  [{dec:12s}] p={i.get('priority',0):3d} {i['title'][:50]}")

        elif ns.command == "pending":
            items = review_engine.pending()
            if ns.json:
                print(json.dumps(items, indent=2, default=str))
            else:
                print(f"  {len(items)} pending items (active queue, no decision):")
                for i in items:
                    print(f"  - p={i.get('priority',0):3d} [{i.get('lane','?')[:10]}] {i['title'][:55]}")

        elif ns.command == "status":
            result = review_engine.status()
            _out(result, ns.json)

        elif ns.command == "add-item":
            if not ns.artifact:
                _err("--artifact required")
            item = review_engine.register_item(
                ns.artifact,
                task_id=ns.task_id,
                title=ns.title,
            )
            _out({"registered": item["id"], "title": item["title"]}, ns.json)

        elif ns.command == "archive-approved":
            result = review_engine.archive_resolved()
            if not ns.json:
                print(f"  Newly archived this run: {result['newly_archived']}")
                print(f"  Total archived (all time): {result['total_archived']}")
                print(f"  Remaining pending: {result['remaining_pending']}")
                print(f"  Remaining active: {result['remaining_active']}")
            else:
                _out(result, True)

        elif ns.command == "package":
            if not ns.artifact:
                _err("--artifact required")
            result = review_engine.package(
                ns.artifact,
                task_id=ns.task_id,
                title=ns.title,
                intended_metric=ns.intended_metric,
                next_action=ns.next_action,
            )
            _out(result, ns.json)

        elif ns.command == "sync":
            result = review_engine.sync()
            _out(result, ns.json)

    except Exception as e:
        _err(str(e))


# ── Approval ──────────────────────────────────────────────────────────────────

def cmd_approval(args: list[str]) -> None:
    from forge_ops import approval_engine
    p = argparse.ArgumentParser(prog="forge_ops approval")
    p.add_argument("command", choices=["apply", "list", "export"])
    p.add_argument("--json", action="store_true")
    p.add_argument("--item", dest="item_id", help="Review item ID")
    p.add_argument("--decision", choices=["approve", "needs_revision", "reject", "later"])
    p.add_argument("--comment", default="")
    p.add_argument("--reviewer", default="lucas")
    p.add_argument("--create-revision-task", action="store_true")
    p.add_argument("--pending-only", action="store_true")
    p.add_argument("--date", dest="date_str", help="Filter export to date YYYY-MM-DD")
    ns = p.parse_args(args)

    try:
        if ns.command == "apply":
            if not ns.item_id:
                _err("--item required")
            if not ns.decision:
                _err("--decision required")
            result = approval_engine.apply(
                ns.item_id,
                ns.decision,
                comment=ns.comment,
                reviewer=ns.reviewer,
                create_revision_task=ns.create_revision_task,
            )
            _out(result, ns.json)

        elif ns.command == "list":
            items = approval_engine.list_approvals(pending_only=ns.pending_only)
            if ns.json:
                print(json.dumps(items, indent=2, default=str))
            else:
                for i in items:
                    if isinstance(i, dict):
                        print(f"  {i.get('item_id', '?')} | {i.get('decision') or 'pending'}")

        elif ns.command == "export":
            records = approval_engine.export(date_str=ns.date_str)
            _out(records if ns.json else {"count": len(records), "date": ns.date_str}, ns.json)

    except Exception as e:
        _err(str(e))


# ── Scorecard ─────────────────────────────────────────────────────────────────

def cmd_scorecard(args: list[str]) -> None:
    from forge_ops import scorecard_engine
    p = argparse.ArgumentParser(prog="forge_ops scorecard")
    p.add_argument("command", choices=["daily", "weekly", "compare"])
    p.add_argument("--json", action="store_true")
    p.add_argument("--date", dest="date_str")
    p.add_argument("--week", dest="week_str")
    p.add_argument("--date-a", dest="date_a")
    p.add_argument("--date-b", dest="date_b")
    ns = p.parse_args(args)

    try:
        if ns.command == "daily":
            result = scorecard_engine.daily(ns.date_str)
            if ns.json:
                print(json.dumps(result, indent=2, default=str))
            else:
                f = result.get("_files", {})
                print(f"  Scorecard written: {f.get('markdown')}")
                print(f"  Tasks completed: {result['tasks_completed']}")
                print(f"  Ready tasks: {result['tasks_ready']}")
                print(f"  Lessons: {result['lessons_captured']}")

        elif ns.command == "weekly":
            result = scorecard_engine.weekly(ns.week_str)
            if ns.json:
                print(json.dumps(result, indent=2, default=str))
            else:
                f = result.get("_files", {})
                print(f"  Weekly written: {f.get('markdown')}")
                print(f"  Total completed: {result['tasks_completed']}")

        elif ns.command == "compare":
            if not ns.date_a or not ns.date_b:
                _err("--date-a and --date-b required")
            result = scorecard_engine.compare(ns.date_a, ns.date_b)
            _out(result, ns.json)

    except Exception as e:
        _err(str(e))


# ── Mobile review ─────────────────────────────────────────────────────────────

# ── Review Intelligence ───────────────────────────────────────────────────────

def cmd_review_intel(args: list[str]) -> None:
    from forge_ops import review_intelligence_engine
    p = argparse.ArgumentParser(prog="forge_ops review-intel")
    p.add_argument("command", choices=["refresh", "report"])
    p.add_argument("--json", action="store_true")
    ns = p.parse_args(args)

    try:
        if ns.command == "refresh":
            result = review_intelligence_engine.refresh()
            if not ns.json:
                print(f"  Status: {result['status']}")
                print(f"  Events: {result.get('event_count', 0)}")
                print(f"  Approval rate: {result.get('approval_rate_pct', '?')}%")
                print(f"  Needs revision: {result.get('needs_revision_count', 0)}")
                for label, path in result.get("files", {}).items():
                    print(f"  {label}: {path}")
            else:
                _out(result, True)

        elif ns.command == "report":
            result = review_intelligence_engine.report()
            _out(result, ns.json)

    except Exception as e:
        _err(str(e))


# ── Repair Queue ─────────────────────────────────────────────────────────────

def cmd_repair_queue(args: list[str]) -> None:
    from forge_ops import repair_queue_engine
    p = argparse.ArgumentParser(prog="forge_ops repair-queue")
    p.add_argument("command", choices=["build", "list"])
    p.add_argument("--json", action="store_true")
    ns = p.parse_args(args)

    try:
        if ns.command == "build":
            result = repair_queue_engine.build()
            if not ns.json:
                print(f"  Status: {result['status']}")
                print(f"  Items in repair queue: {result['total_items']}")
                print(f"  Clusters:")
                for cluster, count in result["cluster_counts"].items():
                    print(f"    {cluster}: {count}")
                for label, path in result.get("files", {}).items():
                    print(f"  {label}: {path}")
            else:
                _out(result, True)

        elif ns.command == "list":
            result = repair_queue_engine.list_queue()
            _out(result, ns.json)

    except Exception as e:
        _err(str(e))


# ── Content Dispatch ──────────────────────────────────────────────────────────

def cmd_content_dispatch(args: list[str]) -> None:
    from forge_ops import content_dispatch_engine
    p = argparse.ArgumentParser(prog="forge_ops content-dispatch")
    p.add_argument("command", choices=["refresh", "today", "next", "blocked", "mark-published"])
    p.add_argument("--json", action="store_true")
    p.add_argument("--id", dest="asset_id", help="Asset ID to mark published")
    p.add_argument("--url", dest="published_url", default=None, help="Published URL (optional)")
    ns = p.parse_args(args)

    try:
        if ns.command == "refresh":
            result = content_dispatch_engine.refresh()
            if not ns.json:
                print(f"  Phase: {result['phase']} | Date: {result['date']}")
                print(f"  Total assets: {result['total_assets']}")
                print(f"  Publishable today: {result['publishable_today']}")
                print(f"  Blocked by links: {result['blocked_by_links']}")
                print(f"  Needs prep: {result['needs_prep']}")
                for label, path in result.get("files", {}).items():
                    print(f"  {label}: {path}")
            else:
                _out(result, True)

        elif ns.command == "today":
            items = content_dispatch_engine.get_today()
            if not ns.json:
                if items:
                    print(f"  {len(items)} item(s) ready to publish today:")
                    for a in items:
                        print(f"    {a['title']} [{a['channel']}]")
                else:
                    print("  Nothing publishable today.")
            else:
                _out(items, True)

        elif ns.command == "next":
            result = content_dispatch_engine.get_next()
            if not ns.json:
                for channel, item in result.items():
                    if item:
                        print(f"  {channel}: {item['title']} ({item['intended_date']}) -- {item['dispatch_status']}")
                    else:
                        print(f"  {channel}: nothing scheduled")
            else:
                _out(result, True)

        elif ns.command == "blocked":
            items = content_dispatch_engine.get_blocked()
            if not ns.json:
                if items:
                    print(f"  {len(items)} item(s) blocked by missing links:")
                    for a in items:
                        print(f"    {a['title']} -- needs {a['cta_dependency']}")
                else:
                    print("  Nothing blocked.")
            else:
                _out(items, True)

        elif ns.command == "mark-published":
            if not ns.asset_id:
                _err("--id required (use asset_id from dispatch manifest)")
            result = content_dispatch_engine.mark_published(ns.asset_id, published_url=ns.published_url)
            if not ns.json:
                print(f"  Marked published: {ns.asset_id}")
                if ns.published_url:
                    print(f"  URL: {ns.published_url}")
                print(f"  Dispatch refreshed. Phase: {result['phase']}")
            else:
                _out(result, True)

    except Exception as e:
        _err(str(e))


# ── Mobile review ─────────────────────────────────────────────────────────

def cmd_mobile_review(args: list[str]) -> None:
    from forge_ops import mobile_review_engine
    p = argparse.ArgumentParser(prog="forge_ops mobile-review")
    p.add_argument("command", choices=["export", "next", "item"])
    p.add_argument("--json", action="store_true")
    p.add_argument("--id", dest="item_id")
    ns = p.parse_args(args)

    try:
        if ns.command == "export":
            result = mobile_review_engine.export()
            if ns.json:
                print(json.dumps(result, indent=2, default=str))
            else:
                print(f"  Total: {result['stats']['total']}")
                print(f"  Pending: {result['stats']['pending']}")
                print(f"  Approved: {result['stats']['approved']}")

        elif ns.command == "next":
            item = mobile_review_engine.next_pending()
            if item is None:
                print("  No pending review items.")
            else:
                _out(item, ns.json)
                if not ns.json:
                    link = mobile_review_engine.slack_link(item["id"])
                    print(f"  Deep-link: {link}")

        elif ns.command == "item":
            if not ns.item_id:
                _err("--id required")
            item = mobile_review_engine.item_by_id(ns.item_id)
            if item is None:
                print(f"  Item not found: {ns.item_id}")
            else:
                _out(item, ns.json)

    except Exception as e:
        _err(str(e))


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)

    engine = sys.argv[1]
    rest = sys.argv[2:]

    dispatch = {
        "queue": cmd_queue,
        "review": cmd_review,
        "approval": cmd_approval,
        "scorecard": cmd_scorecard,
        "mobile-review": cmd_mobile_review,
        "review-intel": cmd_review_intel,
        "repair-queue": cmd_repair_queue,
        "content-dispatch": cmd_content_dispatch,
    }

    if engine not in dispatch:
        print(f"Unknown engine: {engine!r}. Available: {', '.join(dispatch)}")
        sys.exit(1)

    dispatch[engine](rest)


if __name__ == "__main__":
    main()
