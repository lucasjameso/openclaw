"""
queue_engine.py -- canonical read/write interface for QUEUE.json.

All queue mutations go through this module. Never write to QUEUE.json directly
from ad hoc scripts -- use these functions or the CLI.

CLI usage:
  python3 -m forge_ops queue status
  python3 -m forge_ops queue next
  python3 -m forge_ops queue update --id T-xxx --status DONE
  python3 -m forge_ops queue block --id T-xxx --type internal --reason "..."
  python3 -m forge_ops queue decompose --id T-xxx
  python3 -m forge_ops queue recover-stale
  python3 -m forge_ops queue bootstrap
  python3 -m forge_ops queue validate
  python3 -m forge_ops queue normalize
"""
from __future__ import annotations

import json
import os
import shutil
import tempfile
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional

from forge_ops.config import (
    queue_path, VALID_STATUSES, VALID_BLOCKED_TYPES,
    VALID_LANES, ENRICHMENT_FIELDS,
)
from forge_ops.schemas.task import validate_task, now_iso, task_template


# ── Low-level I/O ─────────────────────────────────────────────────────────────

def _read_queue(path: Path | None = None) -> dict:
    p = path or queue_path()
    with open(p) as f:
        return json.load(f)


def _write_queue(data: dict, path: Path | None = None) -> None:
    """Atomic write: validate JSON, write to temp, then rename."""
    p = path or queue_path()
    data["updated_at"] = now_iso()
    data["last_progress_at"] = now_iso()
    # Validate by round-tripping through JSON
    serialized = json.dumps(data, indent=2)
    json.loads(serialized)  # raises on invalid
    # Atomic write
    with tempfile.NamedTemporaryFile("w", dir=p.parent, delete=False, suffix=".tmp") as tf:
        tf.write(serialized)
        tmp_path = tf.name
    os.replace(tmp_path, p)


def _find_task(data: dict, task_id: str) -> Optional[dict]:
    for t in data.get("tasks", []):
        if t["id"] == task_id:
            return t
    return None


# ── Status ────────────────────────────────────────────────────────────────────

def status(path: Path | None = None) -> dict:
    """Return a summary of queue health."""
    data = _read_queue(path)
    tasks = data.get("tasks", [])
    from collections import Counter
    by_status = Counter(t.get("status") for t in tasks)
    ready = [t for t in tasks if t.get("status") == "READY"]
    blocked = [t for t in tasks if t.get("status") == "BLOCKED"]
    in_progress = [t for t in tasks if t.get("status") == "IN_PROGRESS"]
    stale = _find_stale(data)

    # Lane coverage of READY
    lane_counts: Counter = Counter(t.get("lane", "unknown") for t in ready)

    # Normalization completeness
    incomplete = [
        t["id"] for t in ready
        if any(not t.get(f) for f in ENRICHMENT_FIELDS)
    ]

    # Lease health
    now_dt = datetime.now(timezone.utc)
    expired_leases = [
        t["id"] for t in in_progress
        if t.get("lease_expires_at")
        and datetime.fromisoformat(t["lease_expires_at"].replace("Z", "+00:00")) < now_dt
    ]

    return {
        "total": len(tasks),
        "by_status": dict(by_status),
        "ready_count": len(ready),
        "ready_by_lane": dict(lane_counts),
        "blocked_count": len(blocked),
        "in_progress_count": len(in_progress),
        "stale_in_progress": len(stale),
        "expired_leases": expired_leases,
        "normalization_incomplete": incomplete,
        "updated_at": data.get("updated_at"),
        "policy": data.get("policy", {}),
    }


# ── Next task ─────────────────────────────────────────────────────────────────

def next_task(path: Path | None = None) -> Optional[dict]:
    """Return the highest-priority READY task with no unexpired lease."""
    data = _read_queue(path)
    now_dt = datetime.now(timezone.utc)
    ready = [
        t for t in data.get("tasks", [])
        if t.get("status") == "READY"
        and not (
            t.get("lease_expires_at")
            and datetime.fromisoformat(t["lease_expires_at"].replace("Z", "+00:00")) > now_dt
        )
    ]
    if not ready:
        return None
    return sorted(ready, key=lambda t: (-t.get("priority", 0), t.get("created_at", "")))[0]


# ── Update ────────────────────────────────────────────────────────────────────

def update(
    task_id: str,
    *,
    status: str | None = None,
    notes: str | None = None,
    artifact_paths: list[str] | None = None,
    lease_owner: str | None = None,
    lease_minutes: int | None = None,
    path: Path | None = None,
    **extra_fields,
) -> dict:
    """Update fields on a task. Returns the updated task."""
    data = _read_queue(path)
    task = _find_task(data, task_id)
    if task is None:
        raise KeyError(f"Task not found: {task_id}")

    if status is not None:
        if status not in VALID_STATUSES:
            raise ValueError(f"Invalid status: {status!r}")
        task["status"] = status
        if status == "DONE":
            task["completed_at"] = now_iso()
            task["lease_owner"] = None
            task["lease_expires_at"] = None
        elif status == "IN_PROGRESS":
            task["started_at"] = task.get("started_at") or now_iso()

    if notes is not None:
        task["notes"] = notes

    if artifact_paths is not None:
        task["artifact_paths"] = artifact_paths

    if lease_owner is not None:
        task["lease_owner"] = lease_owner
        minutes = lease_minutes or data.get("policy", {}).get("worker_lease_minutes", 55)
        expiry = datetime.now(timezone.utc) + timedelta(minutes=minutes)
        task["lease_expires_at"] = expiry.strftime("%Y-%m-%dT%H:%M:%S.000Z")
        task["started_at"] = task.get("started_at") or now_iso()

    for k, v in extra_fields.items():
        task[k] = v

    task["last_progress_at"] = now_iso()
    _write_queue(data, path)
    return task


# ── Block ─────────────────────────────────────────────────────────────────────

def block(
    task_id: str,
    blocked_type: str,
    reason: str,
    *,
    path: Path | None = None,
) -> dict:
    if blocked_type not in VALID_BLOCKED_TYPES:
        raise ValueError(f"Invalid blocked_type: {blocked_type!r}. Valid: {VALID_BLOCKED_TYPES}")
    data = _read_queue(path)
    task = _find_task(data, task_id)
    if task is None:
        raise KeyError(f"Task not found: {task_id}")
    task["status"] = "BLOCKED"
    task["blocked_type"] = blocked_type
    task["blocked_reason"] = reason
    task["lease_owner"] = None
    task["lease_expires_at"] = None
    task["last_progress_at"] = now_iso()
    task["attempt_count"] = task.get("attempt_count", 0) + 1
    _write_queue(data, path)
    return task


# ── Decompose ─────────────────────────────────────────────────────────────────

def decompose(
    task_id: str,
    child_titles: list[str],
    *,
    path: Path | None = None,
) -> list[dict]:
    """Mark a task DECOMPOSED and create child tasks. Returns child tasks."""
    data = _read_queue(path)
    parent = _find_task(data, task_id)
    if parent is None:
        raise KeyError(f"Task not found: {task_id}")

    date_str = datetime.now().strftime("%Y-%m-%d")
    children = []
    base_priority = max(parent.get("priority", 70) - 1, 1)

    for i, child_title in enumerate(child_titles):
        child_id = f"{task_id}-child-{i + 1}"
        child = task_template(
            id=child_id,
            title=child_title,
            priority=base_priority,
            lane=parent.get("lane", "distribution"),
            expected_value=parent.get("expected_value", "medium"),
            revenue_hypothesis=parent.get("revenue_hypothesis", ""),
            source_of_task="worker_discovery",
        )
        child["parent_id"] = task_id
        children.append(child)

    parent["status"] = "DECOMPOSED"
    parent["last_progress_at"] = now_iso()
    parent["notes"] = (parent.get("notes") or "") + f"\nDecomposed into {len(children)} children on {date_str}."

    data["tasks"].extend(children)
    _write_queue(data, path)
    return children


# ── Recover stale ─────────────────────────────────────────────────────────────

def _find_stale(data: dict) -> list[dict]:
    now_dt = datetime.now(timezone.utc)
    stale_minutes = data.get("policy", {}).get("stale_in_progress_minutes", 70)
    stale = []
    for t in data.get("tasks", []):
        if t.get("status") != "IN_PROGRESS":
            continue
        lease_exp = t.get("lease_expires_at")
        if lease_exp:
            exp_dt = datetime.fromisoformat(lease_exp.replace("Z", "+00:00"))
            if exp_dt < now_dt:
                stale.append(t)
        else:
            last = t.get("last_progress_at") or t.get("started_at")
            if last:
                last_dt = datetime.fromisoformat(last.replace("Z", "+00:00"))
                if (now_dt - last_dt).total_seconds() > stale_minutes * 60:
                    stale.append(t)
    return stale


def recover_stale(*, path: Path | None = None) -> list[str]:
    """Reset expired IN_PROGRESS tasks back to READY. Returns list of recovered IDs."""
    data = _read_queue(path)
    stale = _find_stale(data)
    recovered = []
    for t in stale:
        t["status"] = "READY"
        t["lease_owner"] = None
        t["lease_expires_at"] = None
        t["attempt_count"] = t.get("attempt_count", 0) + 1
        note = f"\n[{now_iso()}] Recovered from stale IN_PROGRESS by recover_stale."
        t["notes"] = (t.get("notes") or "") + note
        t["last_progress_at"] = now_iso()
        recovered.append(t["id"])
    if recovered:
        _write_queue(data, path)
    return recovered


# ── Validate ──────────────────────────────────────────────────────────────────

def validate(*, path: Path | None = None) -> dict:
    """Validate all tasks in the queue. Returns dict of errors per task."""
    data = _read_queue(path)
    errors: dict[str, list[str]] = {}
    seen_ids: set[str] = set()

    for t in data.get("tasks", []):
        tid = t.get("id", "(no-id)")
        errs = validate_task(t)
        if tid in seen_ids:
            errs.append("duplicate task id")
        seen_ids.add(tid)
        if errs:
            errors[tid] = errs

    return {
        "valid": len(errors) == 0,
        "task_count": len(data.get("tasks", [])),
        "error_count": sum(len(v) for v in errors.values()),
        "errors": errors,
    }


# ── Normalize ─────────────────────────────────────────────────────────────────

FIELD_DEFAULTS = {
    "estimated_minutes": 30,
    "source_of_task": "manager",
}


def normalize(*, path: Path | None = None, statuses: list[str] | None = None) -> dict:
    """Backfill missing ENRICHMENT_FIELDS on tasks. Returns counts."""
    data = _read_queue(path)
    target_statuses = set(statuses) if statuses else {"READY", "IN_PROGRESS"}
    filled: dict[str, int] = {f: 0 for f in ENRICHMENT_FIELDS}

    for t in data.get("tasks", []):
        if t.get("status") not in target_statuses:
            continue
        for field in ENRICHMENT_FIELDS:
            if not t.get(field):
                default = FIELD_DEFAULTS.get(field)
                if default is not None:
                    t[field] = default
                    filled[field] += 1

    _write_queue(data, path)
    return {"filled": filled}


# ── Bootstrap ─────────────────────────────────────────────────────────────────

def bootstrap(
    new_tasks: list[dict],
    *,
    path: Path | None = None,
    dedup: bool = True,
) -> dict:
    """
    Add a list of new task dicts to the queue.
    If dedup=True, skips tasks whose id already exists.
    Each task dict should be built with task_template().
    """
    data = _read_queue(path)
    existing_ids = {t["id"] for t in data.get("tasks", [])}
    added = []
    skipped = []

    for t in new_tasks:
        errs = validate_task(t)
        if errs:
            raise ValueError(f"Invalid task {t.get('id')!r}: {errs}")
        if dedup and t["id"] in existing_ids:
            skipped.append(t["id"])
            continue
        data["tasks"].append(t)
        added.append(t["id"])

    if added:
        _write_queue(data, path)

    return {"added": added, "skipped": skipped}
