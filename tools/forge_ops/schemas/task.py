"""Canonical task schema helpers."""
from datetime import datetime, timezone


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")


def task_template(
    id: str,
    title: str,
    objective: str = "",
    priority: int = 70,
    lane: str = "distribution",
    expected_value: str = "medium",
    revenue_hypothesis: str = "",
    estimated_minutes: int = 30,
    source_of_task: str = "manager",
    task_type: str = "content",
    requires_review: bool = True,
    publish_allowed: bool = False,
    acceptance_criteria = None,
) -> dict:
    """Return a fully-formed READY task dict with all required fields."""
    return {
        "id": id,
        "status": "READY",
        "priority": priority,
        "created_at": now_iso(),
        "started_at": None,
        "completed_at": None,
        "title": title,
        "objective": objective,
        "acceptance_criteria": acceptance_criteria or [],
        "task_type": task_type,
        "lane": lane,
        "expected_value": expected_value,
        "estimated_minutes": estimated_minutes,
        "revenue_hypothesis": revenue_hypothesis,
        "source_of_task": source_of_task,
        "requires_review": requires_review,
        "publish_allowed": publish_allowed,
        "blocked_type": None,
        "blocked_reason": None,
        "artifact_paths": [],
        "lease_owner": None,
        "lease_expires_at": None,
        "last_progress_at": now_iso(),
        "attempt_count": 0,
        "parent_id": None,
        "notes": "",
    }


def validate_task(task: dict) -> list[str]:
    """Return a list of validation errors for a task dict. Empty = valid."""
    errors = []
    from forge_ops.config import REQUIRED_TASK_FIELDS, VALID_STATUSES, VALID_BLOCKED_TYPES, VALID_LANES

    for f in REQUIRED_TASK_FIELDS:
        if not task.get(f):
            errors.append(f"missing required field: {f}")

    status = task.get("status")
    if status and status not in VALID_STATUSES:
        errors.append(f"invalid status: {status!r} (valid: {sorted(VALID_STATUSES)})")

    bt = task.get("blocked_type")
    if bt not in VALID_BLOCKED_TYPES:
        errors.append(f"invalid blocked_type: {bt!r}")

    lane = task.get("lane")
    if lane and lane not in VALID_LANES:
        errors.append(f"invalid lane: {lane!r}")

    return errors
