---
name: forge-agent-team-kickoff
description: Standardizes when and how the lead launches an agent team. Use this skill before spawning any teammate. It selects the right team template, defines role ownership, and enforces post-burst write-back discipline.
disable-model-invocation: true
---

# forge-agent-team-kickoff

This skill is manually invoked before launching an agent team. Do not auto-invoke.

---

## Decision Gate: Do You Actually Need a Team?

Answer all of these before spawning any teammate:

1. Are there genuinely independent work slices? (If yes, team may be justified)
2. Would multiple perspectives improve the answer? (If yes, team may be justified)
3. Would competing hypotheses produce a better result? (If yes, team may be justified)
4. Do the work slices touch different files? (If no, do not use a team)
5. Is the task sequential or tightly coupled? (If yes, do not use a team)
6. Would a focused subagent be enough? (If yes, use a subagent instead)
7. Is the token cost clearly worth the parallel gain? (If uncertain, use solo or subagent)

If you answered "no" to 1-3 or "yes" to 4-5, stop here. Use solo work or a subagent.

---

## Select a Team Template

### Template A: Revenue Research Team
Use when: exploring monetization opportunities
Roles: market-scanner, pain-analyst, skeptic
Output: ranked opportunities with next test for each

### Template B: Offer Design Team
Use when: defining a new offer
Roles: offer-architect, delivery-realist, conversion-skeptic
Output: offer spec with test-first path

### Template C: Debugging Team
Use when: root cause is unclear and competing hypotheses exist
Roles: hypothesis-A-investigator, hypothesis-B-investigator, hypothesis-C-investigator
Output: surviving theory with evidence and next change

### Template D: Review Team
Use when: evaluating a major artifact before publish or deploy
Roles: quality-reviewer, risk-reviewer, monetization-reviewer
Output: findings, revisions, go/no-go

### Template E: Independent Build Team
Use only when: file ownership is explicitly separable
Roles: implementation-owner-1, implementation-owner-2, verification-owner
Output: bounded code changes, tests, handoff summary

---

## Team Setup Rules

Before spawning:
1. Choose a template above
2. Assign explicit file ownership for each teammate (no overlapping files)
3. Write the lead task description that each teammate will receive
4. Confirm each teammate prompt is focused -- teammates load CLAUDE.md, MCP servers, and skills automatically
5. Default to 3 teammates. Go to 4-5 only with strong justification. Never exceed 5.

For risky changes (schema changes, deploy paths, security-sensitive work):
- Require plan approval before teammates implement

---

## During the Team Burst

- Wait for teammates to complete before synthesizing
- Do not jump in and do teammates' work yourself
- Monitor for idle teammates and use the TeammateIdle feedback
- The lead is the only one who can clean up the team

---

## After the Team Burst

These steps are required before the burst is considered complete:

1. Synthesize all teammate outputs into one lead summary
2. Write the synthesis to the appropriate durable file:
   - Research outputs: `data/workspace/` or `data/workspace/review/`
   - Offer designs: `data/workspace/offers/`
   - Debug conclusions: `data/workspace/lessons/`
   - Build outputs: artifact paths in QUEUE.json
3. Update the originating QUEUE.json task with `status: DONE` and `artifact_paths`
4. Write a lesson if the team process itself produced a useful finding
5. Clean up the team through the lead

---

## What Not to Do

- Do not use the team task list as the business queue
- Do not leave team results only in conversation history
- Do not launch a team for routine or sequential work
- Do not use more than 5 teammates
- Do not let a teammate clean up the team
