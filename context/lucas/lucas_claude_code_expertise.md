# Claude Code Expertise

## How Lucas Oliver Architects, Manages, and Executes Agentic Development with Claude Code

This document captures Lucas's Claude Code skills, his session management philosophy, his multi-agent architecture, and the operational standards that govern every development session. It is written so that any AI assisting Lucas within or alongside Claude Code understands exactly how he works, what he expects, and where the guardrails are.

---

## The Core Philosophy: Context Is Fuel

Every Claude Code session operates within a finite context window. When that window fills, quality degrades. This is not a theoretical concern. It is the single most important operational reality of working with Claude Code, and Lucas treats it with the same rigor he applies to budget management in a sales organization: spend it on what matters, track what you have spent, and refill before you run empty.

The metaphor Lucas uses: "Context is fuel. Waste it and Claude gets dumb." This is not a joke. It is the governing principle of every session.

---

## Multi-Agent Architecture

Lucas does not use Claude Code as a single-thread chatbot. He orchestrates parallel workstreams using subagents, each operating in isolated context that does not pollute the main thread.

**The three core subagent patterns:**

**Explore + Build.** The main Claude instance spawns an Explorer subagent to audit a codebase, analyze a data structure, or investigate a bug. Simultaneously, it spawns a Builder subagent to construct new code in a separate context. The main thread integrates the results from both. Neither subagent's exploration or construction costs eat into the main thread's context budget.

**Multi-Branch via git worktrees.** The main Claude instance runs subagents on separate git branches simultaneously. One subagent works on authentication. Another works on the API layer. A third works on the frontend. All three work in parallel, none blocking the others, and the main thread coordinates the merge.

**Write + Review.** One Claude instance writes code. A second Claude instance reviews it in a separate context. The reviewer has no bias from having written the code, which produces cleaner, more honest code review than self-review ever could.

**Subagent instructions template.** Every subagent delegation includes: the specific task or question, the exact scope (files or directories to touch), the explicit boundaries (files to avoid, operations to skip), the expected return format (bullet list, JSON, summary paragraph), and the model assignment (Haiku by default unless the task requires more reasoning).

---

## CLAUDE.md as Project Memory

CLAUDE.md is the most important file in every project Lucas builds with Claude Code. It loads into context automatically at every session start, which means it encodes the project's entire operating context into a single file that never needs to be repeated.

**What belongs in CLAUDE.md:**

The project purpose (one paragraph: what this project does and why it exists). The tech stack (React + Vite + Tailwind + Supabase, or whatever the project uses). The active branch. The file read rules that protect context (read only what is needed for the current task, do not preload entire directories, read file headers and exports first, pull full content only when modifying). The current sprint (what is being built right now). The "Do Not Touch" list (files or systems that are locked or production-only). The session start protocol (read RESUME_HERE.md if it exists, check PROGRESS.md for completed work, begin the next incomplete task only, never re-audit completed work). The commit convention (feat: / fix: / wip: / chore: / docs:).

**Why CLAUDE.md matters beyond organization:** CLAUDE.md is cached. After the first request, it costs 90% less to load than uncached context. Encoding project instructions here instead of typing them every session is both faster and dramatically cheaper. This is not just good practice. It is cost engineering.

Every project in Lucas's portfolio (Ridgeline Intelligence, Atlas Intelligence, IAC Solutions, Build What Lasts tools) has its own CLAUDE.md before the first Claude Code session begins.

---

## The GSD Command System

GSD (Get Stuff Done) is the slash command system Lucas uses for phase-based development in Claude Code. It provides a structured workflow for planning, executing, verifying, and shipping work.

**Core commands and when to use them:**

`/gsd:progress` shows the current position across all phases: what is complete, what is planned, what needs to execute next. Run this at the start of any session when unsure where the previous session ended.

`/gsd:resume-work` picks up exactly where the last session stopped. It reads RESUME_HERE.md and PROGRESS.md, identifies the next incomplete task, and begins execution without re-auditing completed work.

`/gsd:plan` creates a structured plan for the next phase of work. It breaks a large task into executable steps with defined deliverables, estimates, and dependencies.

`/gsd:execute` runs the planned work. In yolo mode (Lucas's default), it executes autonomously without confirmation prompts, which maximizes throughput for routine work.

`/gsd:verify` runs validation against completed work: linting, build checks, visual review, and functional testing. It catches regressions before they reach production.

`/gsd:ship` handles the production deployment workflow: final verification, commit with proper message, merge to main, and deployment trigger.

**Current project state (Ridgeline Intelligence):** GSD status is executing at 67% complete. Phases 1 (DB Schema) and 2 (Design System Lock) are complete. Phase 3 (Demo Data) has plans that are not yet executed. The stack is Vite + React 18, Supabase, Cloudflare Pages. GSD mode is yolo. The design library lock deadline is March 21, 2026.

---

## Context Window Management

This is where most Claude Code users fail, and where Lucas operates with deliberate discipline.

**The 60K token rule.** At approximately 60,000 tokens of context, quality begins to degrade. This is not a hard cutoff but a warning zone. Lucas checks context usage with `/context` and compacts with `/compact` proactively, before degradation begins. He never waits until errors start appearing. By then, the damage is already in the conversation.

**What destroys context fast:** Reading entire large JSON files (especially CRM exports from Dynamics 365). Loading full directories at session start. Running broad investigations on the main thread instead of delegating to subagents. Not compacting between phases of a long build.

**Context management decision tree:** Is context approaching 60K? Run `/compact` now. Is this a completely different task from the previous one? Run `/clear` after committing and updating PROGRESS.md. Is the task heavy on file reading? Use a subagent. Is the investigation broad? Narrow the search first, assign to a subagent with a specific question.

**File read rules (embedded in every CLAUDE.md):** Read only what is needed for the current task. Do not preload entire directories. Read file headers and exports first. Pull full content only when modifying. For large JSON, read schema and sample records only. Log key findings in PROGRESS.md instead of keeping them in context.

---

## GitHub Workflow Within Claude Code

Lucas maintains strict version control discipline within every Claude Code session.

**Branch strategy:** Never develop directly on main. Every feature gets a branch. Branch names follow the pattern `feature/description` or `fix/description`. Work is committed frequently with meaningful messages following the convention: feat: for new features, fix: for bug fixes, wip: for work in progress, chore: for maintenance, docs: for documentation.

**The commit rhythm:** Commit at natural breakpoints, not at session end. Each commit represents a logically complete unit of work. If the session ends unexpectedly, no work is lost because the last commit captured the last complete state.

**Production vs. development separation:** Main is production. Feature branches are development. Pull requests are the gate between them, even when Lucas is the only developer. The PR provides a review step that catches issues the build session might have missed.

**Session continuity through Git:** When a Claude Code session ends (whether by choice, context limit, or interruption), the RESUME_HERE.md and PROGRESS.md files capture the state. The next session reads these files, orients itself, and continues without re-discovering what was already done.

---

## How Lucas Uses Claude Code Across His Projects

**Ridgeline Intelligence:** The primary development project. Vite + React 18 + Tailwind + Supabase + Cloudflare Pages. Multi-tenant SaaS BI platform for specialty trade contractors. Claude Code handles component development, database schema work, design system implementation, and deployment pipeline management.

**Atlas Intelligence:** React-based BD pipeline platform for Facade Access Solutions. Built with a multi-agent Claude Code architecture where separate agents handle different modules of the application and the main thread integrates.

**IAC Solutions tools:** Various internal tools and automation interfaces built for IAC Solutions clients. Claude Code provides the development environment for rapid iteration on client-specific requirements.

**Build What Lasts infrastructure:** The pre-publisher proof audit system, content management tools, and brand infrastructure that supports the book launch and content ecosystem.

---

## The Overnight Session Architecture

When Lucas has a large body of work that can be executed without his real-time oversight, he sets up Claude Code to run tasks while he sleeps or handles corporate responsibilities.

The setup: a comprehensive CLAUDE.md and PROGRESS.md that define exactly what needs to be done. A GSD plan with clearly sequenced phases. Yolo mode enabled so execution does not pause for confirmation. Subagents configured for parallel work. Git configured for automatic commits at phase boundaries.

The result: Lucas returns to a codebase that has progressed through multiple phases of development while he was absent. He reviews the commits, checks the PROGRESS.md for completion status, runs verification, and continues from where the overnight session ended.

This is the closest thing to delegation that exists in solo development, and Lucas treats it with the same standards he applies to delegating work to his sales team: clear instructions, defined deliverables, and verification on return.

---

## Cost Control Philosophy

Claude Code costs money. Lucas treats token expenditure with the same discipline he applies to budget management in his corporate role.

**Model selection by task complexity:**

Haiku for subagent work: exploration, audits, data checks. At approximately $0.10 per session versus $2+ for Opus, this is the default for any task that does not require deep reasoning.

Sonnet for routine coding: components, functions, configurations, standard implementation work. Fast, capable, and cost-effective for the majority of development tasks.

Opus for hard architectural decisions: system design, complex debugging, strategic technical choices. Reserved exclusively for work that requires the highest level of reasoning. Using Opus for routine coding is burning money, and Lucas does not burn money.

**Model switching mid-session:** `/model sonnet` for routine work. `/model opus` for hard problems only. `/model haiku` for subagents and cheap tasks. The rule of thumb: if Claude could complete the task without much reasoning, it does not need Opus.

---

## What Lucas Expects from an AI Working Inside Claude Code

**Expert precision.** When the AI suggests a code pattern, it must be correct. When it references an API, that API must exist. When it configures a component, the props must be valid. Hallucinated APIs, fictional package methods, and incorrect TypeScript interfaces are not acceptable errors. They waste time, burn tokens on debugging, and erode trust in the development workflow.

**No hallucinated APIs.** This bears repeating because it is the most common and most costly failure mode. If the AI is not certain that a function, method, or endpoint exists, it states the uncertainty. "I believe this API exists but cannot confirm without checking the documentation" is infinitely more useful than silently producing code that calls a non-existent endpoint.

**Clear uncertainty flags.** When the AI encounters a situation where it is not confident in the correct approach, it says so explicitly. It describes what it knows, what it does not know, and what information would resolve the uncertainty. This is not weakness. This is the behavior that prevents expensive mistakes.

**Respect for the CLAUDE.md context.** The AI reads CLAUDE.md at session start and follows its instructions throughout the session. It does not overwrite the established patterns, naming conventions, or architectural decisions encoded in the project memory unless explicitly asked to do so.

**Context awareness.** The AI monitors its own context consumption and recommends compaction before degradation begins. It does not wait for Lucas to notice that responses are getting worse. It proactively says "context is getting heavy, recommend compacting" before the quality cliff arrives.

---

## Where Lucas Is Taking His Claude Code Capabilities

The trajectory is from effective user to architectural authority. In the next 6-12 months, Lucas is building toward:

Deeper multi-agent orchestration patterns, where multiple agents collaborate on complex systems with sophisticated handoff protocols. More robust error recovery in agentic workflows, where failures in one agent's work are caught, logged, and routed to recovery paths without manual intervention. Larger system architectures that maintain coherence across more parallel workstreams than current patterns support. And the ability to architect systems that other developers can inherit and extend, not just systems that work when Lucas is the one operating Claude Code.

---

## How an AI Should Use This File

This file defines the complete Claude Code operating context. It should inform every development interaction.

Specific behavioral instructions:

1. Respect the context management discipline. Monitor context consumption. Recommend compaction proactively. Never load unnecessary files into context.
2. Follow the model selection rules. Do not use Opus-level reasoning for Sonnet-level tasks. Do not assign Opus to subagents.
3. Always produce code with CLAUDE.md conventions in mind: naming, file structure, commit messages, and branch discipline.
4. When uncertain about an API, method, or package, flag the uncertainty explicitly before producing code that depends on it.
5. Support the GSD workflow by understanding the current phase, the completed work, and the next executable task. Never re-audit completed phases.
6. When building components, follow the project's tech stack precisely: React 18 with hooks, Vite build tool, Tailwind utility classes, Supabase client for data, Cloudflare Pages for deployment.
7. Treat RESUME_HERE.md and PROGRESS.md as sacred documents. Update them accurately at session boundaries. They are the continuity mechanism that makes multi-session development work.
8. Never hallucinate. If it does not exist, say so. The cost of a confident wrong answer in Claude Code is hours of debugging. The cost of an honest uncertainty flag is seconds of clarification.
