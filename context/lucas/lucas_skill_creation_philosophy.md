# Skill Creation Philosophy

## How Lucas Oliver Designs AI Skills That Transform General Assistants Into Domain Experts

This document captures the design principles, depth standards, quality gates, and strategic thinking that Lucas applies when building skill files for AI agents. It is written so that any AI assisting Lucas with skill creation understands what makes a skill worth building, what makes it excellent, and what makes it a waste of time.

---

## The Design Philosophy: A Skill Must Make the AI an Expert, Not a Participant

This is the line that separates Lucas's approach to skill creation from most people's approach. Most people write skill files that give the AI some context and hope for the best. Lucas writes skill files that transform the AI into a specialist who can operate in the domain at the level Lucas himself would operate.

A participant knows enough to follow instructions. An expert knows enough to make decisions, flag problems, anticipate needs, and produce work that meets the domain's standards without being told every detail of what those standards are.

The test is simple: if the AI, armed only with the skill file and no additional prompting, can produce work that Lucas would not need to significantly revise, the skill is working. If the AI produces work that requires Lucas to backfill context, correct assumptions, or explain standards that should have been in the skill, the skill has failed.

This standard is high. Lucas knows it is high. He maintains it anyway because the alternative, a library of shallow skills that require constant prompt engineering to produce acceptable results, defeats the entire purpose of having skills in the first place.

---

## The Anatomy of a Great Skill File

Every great skill file in Lucas's library contains the same structural components, though the specifics vary by domain.

**YAML frontmatter.** The name and description in the frontmatter are not metadata. They are the triggering mechanism. The description must be written to ensure the AI activates the skill in every relevant context, even when the user's request does not explicitly name the domain. Lucas writes descriptions that are deliberately "pushy," listing specific trigger phrases, use cases, and adjacent domains that should activate the skill. Under-triggering (failing to use a relevant skill) is more dangerous than over-triggering (using a skill that turns out to be unnecessary), because a missed skill means the AI responds without critical context.

**Trigger conditions.** The body of the skill opens with explicit "Use this skill when" conditions. These are not vague categories. They are specific scenarios: "When building an n8n workflow that connects to Supabase." "When writing a LinkedIn post in Lucas's voice." "When evaluating a partnership opportunity against Lucas's values." The more specific the trigger conditions, the more reliably the AI knows when the skill applies.

**Domain knowledge.** The core of the skill contains everything the AI needs to know to operate as an expert in the domain. This includes: foundational principles, specific standards and conventions, templates and patterns, decision frameworks, and the reasoning behind each element. The domain knowledge section is not a summary. It is a comprehensive reference that the AI can consult for any question that arises during operation.

**Behavioral instructions.** Every skill includes explicit instructions for how the AI should behave when the skill is active. Not just what to do, but how to do it. Tone, format, level of detail, escalation triggers, and the specific circumstances under which the AI should deviate from the default behavior.

**Examples.** The best skills include examples of correct output. A LinkedIn skill includes examples of posts that meet the standard. A n8n skill includes examples of correct node configurations. An email skill includes examples of messages that match the expected tone and structure. Examples give the AI a calibration point that abstract instructions cannot provide.

**Edge cases and known pitfalls.** Every domain has failure modes that are not obvious from the standard instructions. The n8n skill warns about the Code Node caching bug. The LinkedIn skill specifies the no-em-dash rule. The values skill defines what happens when values conflict. These edge cases are often the difference between a skill that works in ideal conditions and a skill that works in production.

**Cross-references.** Most skills do not operate in isolation. The writing style skill connects to the LinkedIn formatting skill. The values skill overrides all other skills when conflicts arise. The n8n skill references the Facade Design System for FAS interfaces. Cross-references ensure that the AI understands how skills interact and which takes precedence when they overlap.

---

## Why Depth Matters More Than Breadth

One expert-level skill is worth more than ten shallow ones. This is not a preference. It is an observation based on how AI agents actually use skill files.

A shallow skill gives the AI enough context to attempt the task but not enough to succeed independently. The result: the AI produces work that is directionally correct but wrong in the details. Lucas then spends time correcting the details that the skill should have covered. Repeated across dozens of interactions, this time cost exceeds the time it would have taken to write a comprehensive skill in the first place.

A deep skill gives the AI enough context to handle the nuances, the exceptions, the edge cases, and the domain-specific standards that define quality in that space. The result: the AI produces work that is correct on the first attempt or requires only minor refinement. The time saved compounds across every interaction that uses the skill.

Lucas's skill library is deep, not wide. He would rather have twenty expert-level skills than fifty surface-level ones. The investment in depth pays for itself every time the AI encounters a situation that a shallow skill would have missed.

---

## The Completion Standard

A skill is complete when it can answer every foreseeable question the AI will face in that domain without requiring the user to prompt-engineer around it.

This standard is aspirational. No skill file can anticipate every possible scenario. But the bar must be set high enough that the AI can handle the common cases, the uncommon-but-predictable cases, and the edge cases that Lucas has encountered in his own work.

The practical test: Lucas imagines the ten most likely requests an AI will receive in this domain and asks whether the skill file provides enough context to handle each one. Then he imagines the five most unusual requests and asks whether the skill file at least provides enough context for the AI to recognize the unusual case and flag it, even if it cannot handle it fully.

If the answer to both questions is yes, the skill is ready for production. If the answer to either question is no, the skill needs more depth before deployment.

---

## Testing a Skill Before Trusting It in Production

Lucas does not deploy a skill and hope it works. He tests it.

The testing process: draft the skill, then present it with a set of test prompts that cover the common cases, the edge cases, and the potential failure modes. Evaluate the AI's output against the standard: is it expert-level? Does it follow the behavioral instructions? Does it handle the edge cases correctly? Does it know when to flag uncertainty?

If the output meets the standard, the skill goes to production. If it does not, Lucas revises the skill based on the specific failures observed, then tests again. This iterative refinement continues until the skill produces consistent expert-level output across the full range of expected inputs.

This is the same quality assurance process Lucas applies to any system he builds. A workflow is not production-ready until it has been tested against expected and unexpected inputs. A skill is not production-ready until it has been tested against expected and unexpected prompts.

---

## The Current Skill Library

Lucas has built a substantial library of skills, each designed for a specific domain. The library includes: values and identity, personal journey, vision and direction, personal operating system, learning and growth, relationships and network, writing style, VP of Sales role, n8n workflow builder, Claude Code protocol, GSD command advisor, GitHub workflow, CLARITY book framework, Build What Lasts core conviction, Build What Lasts playbook editor, Build What Lasts playbook skill, LinkedIn content arc planning, LinkedIn formatting, LinkedIn comment response, Facade Design System, FAS Web UI, Vantage development, calendar assistant, and the Excalidraw builder.

Each skill serves a distinct domain. Some are operational (n8n, Claude Code, GitHub). Some are personal (values, journey, operating system). Some are creative (writing style, CLARITY book). Some are strategic (vision, exit plan, relationships). Together, they form a comprehensive knowledge infrastructure that enables an AI to operate as Lucas's thought partner across every dimension of his life and work.

---

## Skill Files vs. CLAUDE.md: When to Use Each

This distinction matters because they serve different purposes and operate at different levels.

**Skill files** encode domain expertise that is relatively stable. The n8n conventions do not change every session. The LinkedIn writing style evolves slowly. The values hierarchy is permanent. Skill files are the long-term memory of how to operate in a domain.

**CLAUDE.md files** encode project-specific context that changes frequently. The current sprint changes every week. The active branch changes every session. The "Do Not Touch" list evolves as the project matures. CLAUDE.md files are the working memory of a specific project's current state.

The relationship: skill files provide the expertise. CLAUDE.md files provide the context. An AI building a React component for Ridgeline Intelligence needs both: the skill file tells it how Lucas builds React components (conventions, patterns, standards), and the CLAUDE.md tells it what the current project state is (active branch, current sprint, file structure).

---

## The Vision: Tenant-Specific Skills at Scale

As Ridgeline Intelligence scales to multiple clients, Lucas envisions a skill architecture where each tenant has operator-specific knowledge bases.

The pattern: a base skill file defines how the Ridgeline platform works (data model, UI patterns, standard reports). Tenant-specific skill overlays define the unique aspects of each client's business (industry terminology, custom KPIs, specific data sources, unique reporting needs). When an AI agent operates on behalf of a specific tenant, it loads the base skill plus the tenant overlay, creating a context-aware agent that understands both the platform and the client.

This is the same architecture Lucas applies to his own skill library (general skills plus domain-specific skills), scaled to a multi-tenant SaaS platform. It is knowledge management as a product feature.

---

## How an AI Should Use This File

This file defines how Lucas thinks about skill creation, which means it defines the standard he holds for every skill file in his library and every new skill that gets built.

Specific behavioral instructions:

1. When creating or revising a skill file, follow the anatomy described in this document: YAML frontmatter with a pushy description, explicit trigger conditions, comprehensive domain knowledge, behavioral instructions, examples, edge cases, and cross-references.
2. Prioritize depth over breadth. One comprehensive skill section is worth more than three surface-level sections.
3. Apply the completion standard before recommending a skill for production: can it handle the ten most likely requests and the five most unusual requests?
4. When operating in a domain where a skill exists but is insufficient, surface the gap. Do not fake the answer. Identify what is missing from the skill and recommend what needs to be added.
5. When a new domain emerges that does not have a skill, recommend creating one before producing significant work in that domain. The upfront investment in a skill file pays for itself across every subsequent interaction.
6. Treat the skill library as living infrastructure. Skills that have not been updated in months may contain stale information. Flag potential staleness when using older skills.
7. Write skill descriptions to be triggering-aggressive. The risk of under-triggering is higher than the risk of over-triggering. When in doubt, activate the skill.
