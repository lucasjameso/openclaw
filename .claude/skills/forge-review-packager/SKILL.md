---
name: forge-review-packager
description: Packages non-X output artifacts into the correct review folder with metadata and an approval summary. Use after completing any task that produces an external-facing artifact requiring human review.
---

# forge-review-packager

## Engine-First Rule

Prefer engine calls over manually copying files and writing metadata:

```bash
cd /Users/lucas/Forge/openclaw/tools

# Package an artifact into the correct review subfolder with metadata
python3 -m forge_ops review package \
  --artifact /path/to/artifact.md \
  --task-id T-xxx \
  --title "Human-readable title" \
  --metric "email signups" \
  --next-action "Publish to Gumroad after approval"

# See what is pending review
python3 -m forge_ops review pending

# Rebuild the PENDING.md index
python3 -m forge_ops review sync

# Get next item for mobile review
python3 -m forge_ops mobile-review next --json

# Get Slack deep-link for an item
python3 -c "from forge_ops.mobile_review_engine import slack_link; print(slack_link('item-id'))"
```

After packaging, update the task in QUEUE.json:
```bash
python3 -m forge_ops queue update --id T-xxx --status DONE
```

Use this skill after completing any task that produces an artifact that needs Lucas's review before broader publication or deployment.

X posts do not go through this flow. Everything else does.

**Canonical review root: `/Users/lucas/Forge/openclaw/data/workspace/review/`**
(also accessible as `/Users/lucas/Forge/openclaw/review/` via symlink -- same location)
(accessible from inside the OpenClaw container as `/workspace/review/`)

---

## Review Folder Map

| Artifact Type | Destination |
|---------------|-------------|
| Dashboard or Cloudflare Worker update | `data/workspace/review/dashboard/` |
| NotebookLM output or notebook artifact | `data/workspace/review/notebooklm/` |
| Product, PDF, checklist, guide | `data/workspace/review/products/` |
| Visual asset, image, graphic, template | `data/workspace/review/visuals/` |
| Blog post, long-form content, email | `data/workspace/review/content/` |

If unsure, default to `data/workspace/review/products/`.

---

## Packaging Steps

1. **Move or copy the artifact** to the correct review subfolder
2. **Create a metadata file** alongside it named `<artifact-name>-REVIEW.md`
3. **Update the task record** in QUEUE.json to set `requires_review: true` and `artifact_paths`

---

## Metadata File Template

```markdown
# Review: <artifact name>
Date: YYYY-MM-DD
Task ID: <queue task id>
Status: PENDING_REVIEW

## What This Is
<one sentence describing the artifact>

## Why It Matters
<one sentence on business relevance>

## Intended Metric
<what this is supposed to move -- signups, revenue, clicks, etc.>

## Approval Request
This artifact is ready for review. Please approve, request revisions, or reject.

Options:
- [ ] Approved -- proceed to publish/deploy
- [ ] Needs revision -- see notes below
- [ ] Rejected -- close task and log reason

## Recommended Next Action (if approved)
<specific publish/deploy/distribute step>

## Notes
<any relevant context, decisions made, alternatives considered>
```

---

## After Packaging

1. Confirm artifact file exists in destination folder
2. Confirm metadata file is created alongside it
3. Update QUEUE.json task: set `status: DONE`, `requires_review: true`, `artifact_paths`
4. Update `data/workspace/review/PENDING.md` index with the new item
5. Optionally notify #forge Slack channel that a review item is ready
6. Do not mark the task as "published" or "deployed" -- that requires explicit approval

## Pre-Review Quality Gate

Before packaging, run these checks in order. Do NOT package artifacts that fail.

### A. Dedup Check (prevents reappearance of already-reviewed content)

Before placing any artifact in the review folder:
1. Check if the same FILENAME already exists anywhere under `data/workspace/review/`
   ```bash
   find /Users/lucas/Forge/openclaw/data/workspace/review -name "$(basename ARTIFACT_PATH)" 2>/dev/null
   ```
2. If a match exists, check its review status. Do NOT create a new copy if the existing version is already approved or rejected.
3. If the artifact is a new VERSION of an existing reviewed item (e.g., a redesigned x-card), place it at the SAME path as the original so push-state merges the decision correctly. Do not create a new batch directory.

### B. Dimension Verification (for visual assets)

For any `.png`, `.jpg`, `.jpeg`, `.webp` image:
```bash
magick identify ARTIFACT_PATH | awk '{print $3}'
```

Expected dimensions by type:
- LinkedIn/X cards: 1080x1350
- Social preview / OG images: 1200x630
- Other: verify against the intended target spec

If dimensions are wrong, fix the asset BEFORE packaging. This is the #1 cause of revision churn (14 comments, 37 dimension tags in the review history).

### C. Brand and Content Check

1. Read `data/workspace/patterns/brand-constraints-inline.md` -- verify the asset matches current direction (darker/cleaner aesthetic preferred)
2. Verify required elements:
   - Brand footer ("Build What Lasts") present
   - Book title present if referencing CLARITY
   - Phase-correct launch dates and CTA language
   - No empty social proof ("Join 0+ leaders")
3. If the artifact is a visual, run through `data/workspace/playbooks/visual-review-playbook.md` checklist
4. If the artifact is launch content, run through `data/workspace/playbooks/launch-content-quality-playbook.md`

### D. Failure Pattern Check

Check `data/workspace/patterns/failure-patterns.md` -- does this artifact type have a known failure pattern? If yes, verify the fix strategy has been applied.

---

## Batch Packaging

If multiple artifacts need review from the same session:
1. Package each one individually with its own metadata file
2. Run the dedup check (A) for EACH artifact -- do not batch-skip
3. Update `data/workspace/review/PENDING.md` with all new items
