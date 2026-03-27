"""
Content Dispatch Engine for the CLARITY launch.

Reads from the content calendar, asset registry, link registry, and execution
packs to produce a machine-readable dispatch manifest that answers:
- what is next to prepare / review / publish
- what is blocked by links, visuals, or date window
- what is approved and ready for today

Usage via CLI:
  python3 -m forge_ops content-dispatch refresh
  python3 -m forge_ops content-dispatch today
  python3 -m forge_ops content-dispatch next
  python3 -m forge_ops content-dispatch blocked
"""
import datetime
import json
import os
from pathlib import Path

WORKSPACE = Path(os.environ.get(
    "FORGE_WORKSPACE",
    Path(__file__).resolve().parents[2] / "data" / "workspace",
))
DISPATCH_DIR = WORKSPACE / "clarity-launch" / "dispatch"
LINK_REGISTRY = WORKSPACE / "clarity-launch" / "LINK-REGISTRY.md"
EXEC_PACKS = Path(os.environ.get(
    "CLARITY_MARKETING",
    Path(__file__).resolve().parents[2].parent
    / "IAC" / "build-what-lasts" / "clarity" / "marketing" / "06-assets",
))

# ── Phase logic ──────────────────────────────────────────────────────────────

PHASE_B_START = datetime.date(2026, 4, 10)
PHASE_C_START = datetime.date(2026, 4, 17)


def current_phase(d=None):
    d = d or datetime.date.today()
    if d >= PHASE_C_START:
        return "C"
    if d >= PHASE_B_START:
        return "B"
    return "A"


def phase_for_date(d):
    if d >= PHASE_C_START:
        return "C"
    if d >= PHASE_B_START:
        return "B"
    return "A"


# ── Link status ──────────────────────────────────────────────────────────────

def _read_link_status():
    """Returns dict of link_key -> status (LIVE | PLACEHOLDER | BLOCKED)."""
    links = {
        "kindle_preorder": "BLOCKED",
        "kindle_buy": "BLOCKED",
        "paperback": "BLOCKED",
        "hardcover": "BLOCKED",
        "all_format": "BLOCKED",
        "lead_magnet": "BLOCKED",
        "bwl_company_page": "BLOCKED",
    }
    if LINK_REGISTRY.exists():
        text = LINK_REGISTRY.read_text()
        if "| Kindle pre-order |" in text and "LIVE" in text.split("Kindle pre-order")[1][:200]:
            links["kindle_preorder"] = "LIVE"
        if "buildwhatlasts.app" in text and "LIVE" in text.split("buildwhatlasts.app")[0][-100:]:
            links["bwl_website"] = "LIVE"
    return links


# ── Master asset list ────────────────────────────────────────────────────────

def _build_asset_list():
    """Build the canonical asset list from the content calendar + execution packs."""
    links = _read_link_status()
    today = datetime.date.today()
    phase = current_phase(today)

    assets = []

    # ── Week 1: March 31 - April 3 ──
    w1 = [
        ("W1-D1", "The Number -- 67 interruptions", "2026-03-31", "linkedin"),
        ("W1-D2", "The Structural Trap", "2026-04-01", "linkedin"),
        ("W1-D3", "The Family Noticed First", "2026-04-02", "linkedin"),
        ("W1-D4", "The Sacred Cow -- killed my reports", "2026-04-03", "linkedin"),
    ]
    for aid, title, date_str, channel in w1:
        assets.append(_make_asset(aid, title, date_str, channel, "A", "none", "READY", links))

    # ── Week 2: April 7-11 ──
    w2 = [
        ("W2-D1", "Delegation failure -- SUBTRACT/DEFINE/DECIDE/DELEGATE", "2026-04-07", "linkedin", "A", "none"),
        ("W2-D2", "The 72-Hour Mirror -- track 3 days", "2026-04-08", "linkedin", "A", "lead_magnet"),
        ("W2-D3", "The $2.5M Lesson -- cost of ambiguity", "2026-04-09", "linkedin", "A", "lead_magnet"),
        ("W2-D4", "PRE-ORDER LIVE -- Kindle edition", "2026-04-10", "linkedin", "B", "kindle_preorder"),
        ("W2-D5", "Pre-order push -- chapter previews", "2026-04-11", "linkedin", "B", "kindle_preorder"),
    ]
    for item in w2:
        aid, title, date_str, channel = item[0], item[1], item[2], item[3]
        cta_phase, dep = item[4], item[5]
        a = _make_asset(aid, title, date_str, channel, cta_phase, dep, "READY", links)
        if aid == "W2-D4":
            a["copy_path"] = "06-assets/execution-packs/april-10-preorder.md"
            a["visual_path"] = "06-assets/launch-cards/pre-order-card.png"
            a["visual_status"] = "APPROVED"
        assets.append(a)

    # ── Week 3: April 13-17 ──
    w3 = [
        ("W3-D1", "4 days. Here's what's coming April 17.", "2026-04-13", "linkedin", "B", "kindle_preorder"),
        ("W3-D2", "3 days. The Hero is about to die.", "2026-04-14", "linkedin", "B", "kindle_preorder"),
        ("W3-D3", "2 days. Here's who this book is NOT for.", "2026-04-15", "linkedin", "B", "kindle_preorder"),
        ("W3-D4", "Tomorrow. 29 years of getting it wrong.", "2026-04-16", "linkedin", "B", "kindle_preorder"),
        ("W3-D5", "LAUNCH -- CLARITY is live. All formats.", "2026-04-17", "linkedin", "C", "all_format"),
    ]
    for item in w3:
        aid, title, date_str, channel, cta_phase, dep = item
        assets.append(_make_asset(aid, title, date_str, channel, cta_phase, dep, "READY", links))

    # ── Week 4: April 20-25 ──
    # Copy is staged. Posts 1-3 can be reviewed pre-launch; posts 4-5 need real week-1 data.
    w4 = [
        ("W4-D1", "First reactions / early proof", "2026-04-21", "linkedin", "C", "all_format"),
        ("W4-D2", "Reader reaction or first review", "2026-04-22", "linkedin", "C", "all_format"),
        ("W4-D3", "The thing nobody expected about chapter 10", "2026-04-23", "linkedin", "C", "all_format"),
        ("W4-D4", "21 hours. That's what the first week gave me.", "2026-04-24", "linkedin", "C", "all_format"),
        ("W4-D5", "Week 1 sales transparency report", "2026-04-25", "linkedin", "C", "all_format"),
    ]
    W4_NEEDS_DATA = {"W4-D1", "W4-D2", "W4-D4", "W4-D5"}  # require real post-launch data
    for item in w4:
        aid, title, date_str, channel, cta_phase, dep = item
        # D3 (Chapter 10) is fully draftable pre-launch; others need real reader/sales data
        copy_status = "NEEDS_DRAFT" if aid in W4_NEEDS_DATA else "READY"
        a = _make_asset(aid, title, date_str, channel, cta_phase, dep, copy_status, links)
        a["copy_path"] = "03-content-calendar/Week-8-Post-Launch/staged-posts.md"
        assets.append(a)

    # ── X posts (derivative of LinkedIn) ──
    x_posts = [
        ("X-APR10", "Kindle pre-order announcement (X)", "2026-04-10", "x", "B", "kindle_preorder", "READY"),
        ("X-APR17", "Launch thread (X)", "2026-04-17", "x", "C", "all_format", "READY"),
    ]
    for aid, title, date_str, channel, cta_phase, dep, status in x_posts:
        assets.append(_make_asset(aid, title, date_str, channel, cta_phase, dep, status, links))

    # ── Company page reposts ──
    cp_posts = [
        ("CP-MAR31", "Repost: The Number", "2026-03-31", "company_page", "A", "none", "READY"),
        ("CP-APR07", "Repost: Delegation failure", "2026-04-07", "company_page", "A", "none", "READY"),
        ("CP-APR10", "Repost: Kindle pre-order", "2026-04-10", "company_page", "B", "kindle_preorder", "READY"),
        ("CP-APR14", "Repost: Launch countdown", "2026-04-14", "company_page", "B", "kindle_preorder", "READY"),
        ("CP-APR17", "Repost: Full launch", "2026-04-17", "company_page", "C", "all_format", "READY"),
    ]
    for aid, title, date_str, channel, cta_phase, dep, status in cp_posts:
        assets.append(_make_asset(aid, title, date_str, channel, cta_phase, dep, status, links))

    # ── Execution packs (visuals, not posts) ──
    assets.append({
        "asset_id": "EXEC-APR10",
        "title": "April 10 Pre-Order Execution Pack",
        "channel": "linkedin+x",
        "content_type": "execution_pack",
        "campaign": "clarity_launch",
        "intended_date": "2026-04-10",
        "copy_status": "APPROVED",
        "visual_status": "APPROVED",
        "cta_phase": "B",
        "cta_dependency": "kindle_preorder",
        "link_status": links.get("kindle_preorder", "BLOCKED"),
        "dispatch_status": _dispatch_status("APPROVED", "APPROVED", links.get("kindle_preorder", "BLOCKED"), "2026-04-10", today, "B"),
        "copy_path": "06-assets/execution-packs/april-10-preorder.md",
        "visual_path": "06-assets/launch-cards/pre-order-card.png",
        "owner": "lucas",
    })
    assets.append({
        "asset_id": "EXEC-APR17",
        "title": "April 17 Launch Day Execution Pack",
        "channel": "linkedin+x",
        "content_type": "execution_pack",
        "campaign": "clarity_launch",
        "intended_date": "2026-04-17",
        "copy_status": "APPROVED",
        "visual_status": "APPROVED",
        "cta_phase": "C",
        "cta_dependency": "all_format",
        "link_status": links.get("all_format", "BLOCKED"),
        "dispatch_status": _dispatch_status("APPROVED", "APPROVED", links.get("all_format", "BLOCKED"), "2026-04-17", today, "C"),
        "copy_path": "06-assets/execution-packs/april-17-launch-day.md",
        "visual_path": "06-assets/launch-cards/launch-day-card.png",
        "owner": "lucas",
    })

    # ── Website CTA update moments ──
    assets.append({
        "asset_id": "SITE-PHASE-B",
        "title": "Update buildwhatlasts.app Phase B CTA href",
        "channel": "website",
        "content_type": "site_update",
        "campaign": "clarity_launch",
        "intended_date": "2026-04-10",
        "copy_status": "READY",
        "visual_status": "N/A",
        "cta_phase": "B",
        "cta_dependency": "kindle_preorder",
        "link_status": links.get("kindle_preorder", "BLOCKED"),
        "dispatch_status": "APPROVED_WAITING_LINK" if links.get("kindle_preorder") != "LIVE" else "READY_TO_PUBLISH",
        "copy_path": "build-forever-launch/src/pages/Index.tsx",
        "visual_path": None,
        "owner": "claude",
    })
    assets.append({
        "asset_id": "SITE-PHASE-C",
        "title": "Update buildwhatlasts.app Phase C CTA hrefs (all formats)",
        "channel": "website",
        "content_type": "site_update",
        "campaign": "clarity_launch",
        "intended_date": "2026-04-17",
        "copy_status": "READY",
        "visual_status": "N/A",
        "cta_phase": "C",
        "cta_dependency": "all_format",
        "link_status": links.get("all_format", "BLOCKED"),
        "dispatch_status": "APPROVED_WAITING_LINK" if links.get("all_format") != "LIVE" else "READY_TO_PUBLISH",
        "copy_path": "build-forever-launch/src/pages/Index.tsx",
        "visual_path": None,
        "owner": "claude",
    })

    # Apply durable published state
    pub_state = _load_published_state()
    for a in assets:
        if a["asset_id"] in pub_state:
            a["copy_status"] = "PUBLISHED"
            a["dispatch_status"] = "PUBLISHED"
            a["published_at"] = pub_state[a["asset_id"]]["published_at"]
            a["published_url"] = pub_state[a["asset_id"]]["published_url"]

    return assets


def _make_asset(aid, title, date_str, channel, cta_phase, cta_dep, copy_status, links):
    today = datetime.date.today()
    link_status = links.get(cta_dep, "N/A") if cta_dep != "none" else "N/A"
    return {
        "asset_id": aid,
        "title": title,
        "channel": channel,
        "content_type": "post",
        "campaign": "clarity_launch",
        "intended_date": date_str,
        "copy_status": copy_status,
        "visual_status": "NOT_PAIRED",
        "cta_phase": cta_phase,
        "cta_dependency": cta_dep,
        "link_status": link_status,
        "dispatch_status": _dispatch_status(copy_status, "NOT_PAIRED", link_status, date_str, today, cta_phase),
        "copy_path": None,
        "visual_path": None,
        "owner": "lucas" if channel == "linkedin" else "claude",
    }


def _dispatch_status(copy_status, visual_status, link_status, date_str, today, cta_phase):
    d = datetime.date.fromisoformat(date_str)
    cp = current_phase(today)

    if copy_status == "PUBLISHED":
        return "PUBLISHED"
    if copy_status in ("NEEDS_DRAFT", "PENDING", "NOT_READY"):
        return "NOT_READY"
    if copy_status == "NEEDS_REVISION":
        return "NOT_READY"

    # Copy is READY or APPROVED
    if link_status == "BLOCKED" and cta_phase != "A":
        return "APPROVED_WAITING_LINK"
    if d > today:
        return "APPROVED_WAITING_DATE"
    # Phase gate: do not allow publishing if current phase < asset's required phase
    if cta_phase == "B" and cp == "A":
        return "APPROVED_WAITING_DATE"
    if cta_phase == "C" and cp in ("A", "B"):
        return "APPROVED_WAITING_DATE"
    return "READY_TO_PUBLISH"


# ── Output generators ────────────────────────────────────────────────────────

def refresh():
    """Regenerate all dispatch outputs. Returns summary."""
    assets = _build_asset_list()
    DISPATCH_DIR.mkdir(parents=True, exist_ok=True)
    today = datetime.date.today()
    phase = current_phase(today)

    # ── Dispatch manifest ──
    manifest = {
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "current_date": today.isoformat(),
        "current_phase": phase,
        "total_assets": len(assets),
        "assets": assets,
    }
    (DISPATCH_DIR / "dispatch-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")

    # Status summary
    from collections import Counter
    statuses = Counter(a["dispatch_status"] for a in assets)

    md = [
        "# Dispatch Manifest",
        "",
        f"Date: {today.isoformat()}",
        f"Phase: {phase}",
        f"Total assets: {len(assets)}",
        "",
        "## Status Summary",
        "",
        "| Status | Count |",
        "|--------|-------|",
    ]
    for s, c in statuses.most_common():
        md.append(f"| {s} | {c} |")
    md += ["", "---", ""]

    for status_key in ["READY_TO_PUBLISH", "APPROVED_WAITING_DATE", "APPROVED_WAITING_LINK", "NOT_READY", "PUBLISHED"]:
        group = [a for a in assets if a["dispatch_status"] == status_key]
        if not group:
            continue
        md.append(f"## {status_key} ({len(group)})")
        md.append("")
        for a in group:
            md.append(f"- **{a['title']}** [{a['channel']}] {a['intended_date']} | {a['cta_phase']}")
        md.append("")

    (DISPATCH_DIR / "dispatch-manifest.md").write_text("\n".join(md) + "\n")

    # ── Publish queue today ──
    publishable = [a for a in assets if a["dispatch_status"] == "READY_TO_PUBLISH"]
    (DISPATCH_DIR / "publish-queue-today.json").write_text(json.dumps({"date": today.isoformat(), "phase": phase, "items": publishable}, indent=2) + "\n")

    pub_md = [
        f"# Publish Queue: {today.isoformat()}",
        f"Phase: {phase}",
        f"Items ready: {len(publishable)}",
        "",
    ]
    if publishable:
        for a in publishable:
            pub_md.append(f"- **{a['title']}** [{a['channel']}] CTA: {a['cta_phase']}")
    else:
        pub_md.append("No items ready to publish today.")
    pub_md.append("")
    (DISPATCH_DIR / "publish-queue-today.md").write_text("\n".join(pub_md) + "\n")

    # ── Blocked assets ──
    blocked = [a for a in assets if a["dispatch_status"] == "APPROVED_WAITING_LINK"]
    (DISPATCH_DIR / "blocked-assets.json").write_text(json.dumps({"items": blocked, "count": len(blocked)}, indent=2) + "\n")

    blocked_md = [
        "# Blocked Assets",
        "",
        f"Date: {today.isoformat()}",
        f"Blocked items: {len(blocked)}",
        "",
        "These assets are approved and ready except for missing links.",
        "",
    ]
    for a in blocked:
        blocked_md.append(f"- **{a['title']}** [{a['channel']}] {a['intended_date']}")
        blocked_md.append(f"  Waiting for: `{a['cta_dependency']}` (currently {a['link_status']})")
        blocked_md.append("")
    (DISPATCH_DIR / "blocked-assets.md").write_text("\n".join(blocked_md) + "\n")

    # ── Next up ──
    next_li = next((a for a in sorted(assets, key=lambda x: x["intended_date"]) if a["channel"] == "linkedin" and a["dispatch_status"] in ("READY_TO_PUBLISH", "APPROVED_WAITING_DATE") and a["intended_date"] >= today.isoformat()), None)
    next_x = next((a for a in sorted(assets, key=lambda x: x["intended_date"]) if a["channel"] == "x" and a["dispatch_status"] in ("READY_TO_PUBLISH", "APPROVED_WAITING_DATE", "APPROVED_WAITING_LINK") and a["intended_date"] >= today.isoformat()), None)
    next_cp = next((a for a in sorted(assets, key=lambda x: x["intended_date"]) if a["channel"] == "company_page" and a["dispatch_status"] in ("READY_TO_PUBLISH", "APPROVED_WAITING_DATE", "APPROVED_WAITING_LINK") and a["intended_date"] >= today.isoformat()), None)
    needs_prep = [a for a in assets if a["dispatch_status"] == "NOT_READY" and a["copy_status"] in ("NEEDS_DRAFT", "PENDING")]

    next_md = [
        "# Next Up",
        "",
        f"Date: {today.isoformat()} | Phase: {phase}",
        "",
        "## Next LinkedIn Post",
    ]
    if next_li:
        next_md.append(f"**{next_li['title']}** -- {next_li['intended_date']}")
        next_md.append(f"Status: {next_li['dispatch_status']} | CTA: {next_li['cta_phase']}")
    else:
        next_md.append("No upcoming LinkedIn posts.")
    next_md += ["", "## Next X Post"]
    if next_x:
        next_md.append(f"**{next_x['title']}** -- {next_x['intended_date']}")
        next_md.append(f"Status: {next_x['dispatch_status']} | CTA: {next_x['cta_phase']}")
    else:
        next_md.append("No upcoming X posts.")
    next_md += ["", "## Next Company Page Repost"]
    if next_cp:
        next_md.append(f"**{next_cp['title']}** -- {next_cp['intended_date']}")
    else:
        next_md.append("No upcoming company page reposts.")
    next_md += ["", "## Claude Should Prep Next"]
    if needs_prep:
        for a in sorted(needs_prep, key=lambda x: x["intended_date"])[:5]:
            next_md.append(f"- **{a['title']}** [{a['channel']}] {a['intended_date']} -- {a['copy_status']}")
    else:
        next_md.append("Nothing needs drafting right now.")

    blocked_by_links = [a for a in assets if a["dispatch_status"] == "APPROVED_WAITING_LINK"]
    if blocked_by_links:
        next_md += ["", "## Blocked by Amazon Links"]
        for a in blocked_by_links[:5]:
            next_md.append(f"- {a['title']} -- needs `{a['cta_dependency']}`")

    next_md.append("")
    (DISPATCH_DIR / "next-up.md").write_text("\n".join(next_md) + "\n")

    return {
        "status": "ok",
        "date": today.isoformat(),
        "phase": phase,
        "total_assets": len(assets),
        "statuses": dict(statuses),
        "publishable_today": len(publishable),
        "blocked_by_links": len(blocked),
        "needs_prep": len(needs_prep),
        "files": {
            "manifest_json": str(DISPATCH_DIR / "dispatch-manifest.json"),
            "manifest_md": str(DISPATCH_DIR / "dispatch-manifest.md"),
            "publish_queue": str(DISPATCH_DIR / "publish-queue-today.md"),
            "blocked": str(DISPATCH_DIR / "blocked-assets.md"),
            "next_up": str(DISPATCH_DIR / "next-up.md"),
        },
    }


def get_today():
    """Return what is publishable today."""
    assets = _build_asset_list()
    return [a for a in assets if a["dispatch_status"] == "READY_TO_PUBLISH"]


def get_next():
    """Return the next item per channel."""
    assets = _build_asset_list()
    today = datetime.date.today()
    result = {}
    for channel in ("linkedin", "x", "company_page", "website"):
        candidates = [a for a in sorted(assets, key=lambda x: x["intended_date"])
                      if a["channel"] == channel
                      and a["dispatch_status"] in ("READY_TO_PUBLISH", "APPROVED_WAITING_DATE", "APPROVED_WAITING_LINK")
                      and a["intended_date"] >= today.isoformat()]
        result[channel] = candidates[0] if candidates else None
    return result


def get_blocked():
    """Return assets blocked by missing links."""
    assets = _build_asset_list()
    return [a for a in assets if a["dispatch_status"] == "APPROVED_WAITING_LINK"]


# ── Published state (durable) ─────────────────────────────────────────────────

def _published_state_path():
    return DISPATCH_DIR / "published-state.json"


def _load_published_state():
    """Returns dict of asset_id -> {published_at, published_url}."""
    p = _published_state_path()
    if p.exists():
        try:
            return json.loads(p.read_text()).get("published", {})
        except Exception:
            return {}
    return {}


def mark_published(asset_id: str, published_url: str = None):
    """Mark an asset as published. Writes to published-state.json and refreshes dispatch."""
    DISPATCH_DIR.mkdir(parents=True, exist_ok=True)
    p = _published_state_path()
    state = {"published": _load_published_state()}
    state["published"][asset_id] = {
        "published_at": datetime.datetime.utcnow().isoformat() + "Z",
        "published_url": published_url,
    }
    p.write_text(json.dumps(state, indent=2) + "\n")
    # Rebuild dispatch outputs so the change propagates immediately
    result = refresh()
    result["marked_published"] = asset_id
    return result
