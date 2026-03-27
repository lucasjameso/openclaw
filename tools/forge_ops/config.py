"""
config.py -- path resolution and shared configuration for forge_ops engines.

Path resolution precedence (per engine/command):
  1. explicit CLI argument
  2. environment variable
  3. project-root default (host path)

Container vs host paths:
  Container mount: /home/node/.openclaw/workspace  ->  /Users/lucas/Forge/openclaw/data/workspace
  Always use the host path from tools; the container handles its own mapping.
"""
import os
from pathlib import Path

# ── Project root detection ────────────────────────────────────────────────────
# Walk up from this file's location to find the project root (contains docker-compose.yml)
def _find_project_root() -> Path:
    candidate = Path(__file__).resolve().parent
    for _ in range(6):
        if (candidate / "docker-compose.yml").exists():
            return candidate
        candidate = candidate.parent
    # Fallback to env or hardcoded
    return Path(os.environ.get("FORGE_PROJECT_ROOT", "/Users/lucas/Forge/openclaw"))

PROJECT_ROOT = _find_project_root()

# ── Key paths ─────────────────────────────────────────────────────────────────
def workspace_dir() -> Path:
    env = os.environ.get("FORGE_WORKSPACE_DIR")
    return Path(env) if env else PROJECT_ROOT / "data" / "workspace"

def queue_path() -> Path:
    env = os.environ.get("FORGE_QUEUE_PATH")
    return Path(env) if env else workspace_dir() / "QUEUE.json"

def review_root() -> Path:
    env = os.environ.get("FORGE_REVIEW_ROOT")
    return Path(env) if env else workspace_dir() / "review"

def lessons_dir() -> Path:
    return workspace_dir() / "lessons"

def scorecards_dir() -> Path:
    return workspace_dir() / "scorecards"

def experiments_dir() -> Path:
    return workspace_dir() / "experiments"

def offers_dir() -> Path:
    return workspace_dir() / "offers"

def plans_dir() -> Path:
    return workspace_dir() / "plans"

def research_dir() -> Path:
    return workspace_dir() / "research"

def approvals_dir() -> Path:
    """Durable approval records written by the approval engine."""
    d = workspace_dir() / "approvals"
    d.mkdir(parents=True, exist_ok=True)
    return d

def pending_index_path() -> Path:
    return review_root() / "PENDING.md"

# ── Required task fields ──────────────────────────────────────────────────────
REQUIRED_TASK_FIELDS = ["id", "status", "priority", "title"]
ENRICHMENT_FIELDS = ["lane", "expected_value", "revenue_hypothesis", "estimated_minutes", "source_of_task"]
VALID_STATUSES = {"READY", "IN_PROGRESS", "DONE", "BLOCKED", "DECOMPOSED", "ESCALATED"}
VALID_BLOCKED_TYPES = {"external", "internal", "invalid", None}
VALID_LANES = {"service", "productized_asset", "subscription_monitoring", "distribution"}
VALID_DECISIONS = {"approve", "needs_revision", "reject", "later"}
