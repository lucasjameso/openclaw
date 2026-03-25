# n8n Expertise

## How Lucas Oliver Architects, Builds, and Operates n8n Automation Systems at Production Grade

This document captures Lucas's n8n skills, architecture philosophy, production systems, and the standards that define how he builds automation. It is written so that any AI agent assisting Lucas with n8n work can operate at the level he expects: expert-level accuracy, zero guesswork, and the confidence to say "I do not know" when uncertainty exists.

---

## The Production Workflow Portfolio

Lucas has built and standardized 12+ production workflows across two n8n instances. Each workflow solves a specific operational problem and follows the same architectural standards.

**Cadence** is the content scheduling and publishing system for Build What Lasts. It manages the LinkedIn posting rhythm, content queue, and engagement tracking workflow. It ensures that content goes out on schedule regardless of Lucas's availability.

**Keystone** is the feedback and performance management system for Facade Access Solutions. It captures team feedback through n8n forms, processes it through triage logic, routes it to the appropriate handler, and generates confirmation and notification emails using the Facade Design System (Navy/Orange brand palette, Open Sans typography, Outlook-safe HTML).

**Atlas** is the business development pipeline intelligence platform for Facade Access Solutions. It targets industrial and infrastructure markets, ingests opportunity data, scores it against defined criteria, and surfaces actionable intelligence through a web interface served via n8n webhooks.

**Pipeline Command** provides weekly visibility into territory-level activity for the FAS sales organization. It pulls data from CRM sources, computes pipeline metrics, and delivers structured reports that Lucas uses in regional business reviews.

**Tempo** (V3) is the time-based reporting and cadence management system that ensures operational rhythms are maintained across the sales organization. It tracks reporting cycles, deadline adherence, and escalation triggers.

**Catalyst Command Center** is the first IAC Solutions client platform, built for Clint's scaffold company. It delivers portfolio-level business intelligence through a Supabase-backed dashboard served via n8n webhooks.

Additional workflows handle error logging (centralized error handler pattern), content repurposing (multi-platform distribution), email automation (Outlook integration through Microsoft OAuth2), and data synchronization between Supabase and external systems.

---

## Architecture Principles

These principles are non-negotiable in every workflow Lucas builds.

**Supabase Postgres only.** Airtable is deprecated. Every new workflow uses Supabase Postgres as the data layer. No exceptions. The connection uses either the Postgres node (for JOINs, aggregations, complex SQL) or HTTP Request nodes pointed at the Supabase REST API (for simple CRUD operations). SSL is set to Allow, not Require, to avoid certificate errors on n8n Cloud. The IPv4 add-on is enabled to resolve IPv6 ENETUNREACH errors.

**Webhook-first design.** Production workflows are triggered by webhooks whenever possible. Webhooks provide real-time event-driven execution, clean URL endpoints for external systems to call, and the ability to serve HTML responses directly to users through the Respond to Webhook node. Schedule triggers are used only when polling is the appropriate pattern (daily reports, periodic syncs).

**Event-driven triggers.** Workflows respond to events, not polling loops. When data changes in Supabase, the workflow fires. When a form is submitted, the workflow fires. When an external system sends a webhook, the workflow fires. This reduces unnecessary execution, lowers resource consumption, and ensures that workflows operate in response to actual business events.

**Error handling as a first-class concern.** Every production workflow connects to a centralized Error Handler workflow through the Settings > Error Workflow configuration. Error handling is not an afterthought. It is designed into the architecture from the beginning. The error handler captures the workflow name, the failing node, the error message, and the timestamp, then routes the alert to Lucas through the appropriate channel.

**Node naming convention.** Every node follows the `PREFIX | Description` format: TRG for triggers, DB for database operations, SET for field mapping, JS for Code nodes, SW for Switch/Router, IF for conditions, LOOP for iterations, MAIL for email, RES for Respond to Webhook, AGNT for AI agents, LLM for language models, EXEC for sub-workflow execution, HTTP for HTTP requests, MERGE for merge nodes, WAIT for wait nodes. This convention makes workflows readable at a glance and ensures that anyone reviewing the workflow can understand the data flow without reading every node's configuration.

**Documentation standard.** Every workflow includes a Master Sticky Note encompassing all nodes (bold title, description, hyperlinks, version/date) and Section Sticky Notes for each logical group of 3-8 nodes (step title, brief description, data flow notes). Colors are used semantically: blue for triggers, green for processing, yellow for outputs.

---

## n8n + Supabase Integration Patterns

These patterns are the foundation of every data-driven workflow Lucas builds.

**Method A: Postgres Node.** Used for JOINs, aggregations, complex SQL, and any query that benefits from the full power of Postgres. The credential is project-specific (e.g., "Catalyst Supabase DB"). Critical: SSL is set to Allow, not Require.

**Method B: HTTP Request Node with Supabase REST API.** Used for simple CRUD operations, when the Postgres connection has issues, or when the query is straightforward. The URL pattern is `{{ $vars.SUPABASE_URL }}/rest/v1/TABLE_NAME`. Headers include `apikey` and `Authorization: Bearer` using `{{ $vars.SUPABASE_SERVICE_KEY }}`.

**Upsert logic.** When inserting data that may already exist, Lucas uses the Supabase REST API's upsert capability with the `Prefer: resolution=merge-duplicates` header and an `on_conflict` parameter specifying the unique constraint column. This prevents duplicate records while updating existing ones.

**RLS-aware queries.** When querying through the REST API with the service role key, RLS policies are bypassed. When querying through the Postgres node with user-level credentials, RLS policies apply. Lucas designs his RLS policies with this distinction in mind, ensuring that production automations use the service role for full access while application-level queries respect row-level security.

**Real-time triggers.** Supabase real-time subscriptions are used in the React frontends (Ridgeline, Atlas), not in n8n workflows. n8n workflows respond to webhook triggers or scheduled polling, not database-level real-time events.

---

## Multi-Agent Orchestration Through n8n

Lucas orchestrates AI agents through n8n using the AGNT (AI Agent) and LLM (Language Model) node types, with Claude as the primary model via the BWL_API credential (Anthropic, claude-sonnet-4-5).

The pattern: a trigger fires the workflow, data is collected and structured through DB and JS nodes, the structured data is passed to an AI Agent node with a system prompt that defines the agent's role and output format, the agent processes the input and returns a response, and the response is routed to the appropriate output (database write, email, webhook response, or next processing step).

What makes this work: precise system prompts. Lucas writes system prompts for n8n AI agents with the same specificity he writes CLAUDE.md files. The agent knows its role, its constraints, its expected output format, and its failure modes. Vague prompts produce vague results. Precise prompts produce production-grade outputs.

---

## HTML/Webhook UI Patterns for FAS

For Facade Access Solutions interfaces, Lucas has developed the Foundation Portal visual language: a web UI design system served through n8n webhooks.

The system uses Tailwind CSS via CDN, Inter font, glass morphism navigation, executive card components, and the FAS brand palette (Navy primary, Orange accent). HTML is built in JS Code nodes and returned through RES (Respond to Webhook) nodes.

These interfaces are used for dashboards, forms, confirmation pages, and portal-style applications where building a full React frontend is unnecessary. They are Outlook-safe when used in email templates and responsive when served as web pages.

---

## Workflow Debugging Philosophy

Lucas debugs workflows systematically, not reactively.

**Step 1: Identify the failing node.** The error handler provides this. If there is no error handler configured, the first priority is adding one.

**Step 2: Inspect the input data.** The most common cause of failure in n8n is unexpected data shape. Before touching the node configuration, inspect what data is arriving at the failing node. Nine times out of ten, the problem is upstream, not at the point of failure.

**Step 3: Reproduce in isolation.** Use the Manual Trigger to fire the workflow in test mode. Execute node by node. Inspect output at each step. This is slower than running the full workflow and hoping for the best, and it finds the root cause faster.

**Step 4: Check the known bugs.** The Code Node caching bug (output does not match code, fix: delete and recreate the node). The Aggregate requirement (place Aggregate before any node that should fire once when upstream returns multiple items). The Loop wiring rule (last node in a Loop chain must connect back to the Loop node input). The MAIL node data destruction (MAIL nodes only output `{ success: true }`, branch data before the mail node if downstream nodes need original data).

**Step 5: Document the fix.** Update the workflow's Sticky Notes. If the bug was non-obvious, add a note explaining what went wrong and why. Future Lucas (or any AI assisting him) should never encounter the same problem without documentation.

---

## What Lucas Expects from an AI Thought Partner on n8n

This is the standard. No exceptions.

**No guessing.** If the AI does not know the correct node configuration, the correct expression syntax, or the correct API endpoint, it says so. Clearly. Without hedging. A wrong answer in an automation workflow can break a production system, and Lucas would rather hear "I am not certain" than spend hours debugging a hallucinated node property.

**No hallucinated node names.** n8n nodes have specific names, specific operations, and specific configuration options. The AI must use the correct ones. If it is referencing a node that may not exist in the current version of n8n Cloud, it flags this uncertainty.

**Expert-level accuracy or a clear statement of uncertainty.** There is no middle ground. The response is either correct and complete, or it explicitly states what is uncertain and what additional information would be needed to provide a definitive answer.

**Respect for the architecture.** When suggesting solutions, the AI follows Lucas's established patterns: Supabase Postgres, webhook-first, event-driven, error-handled, named by convention, and documented with Sticky Notes. Do not suggest Airtable. Do not suggest patterns that violate the established architecture without explicitly calling out the deviation and explaining why it is warranted.

---

## The Standardized Production Systems

Standardization, in Lucas's context, means: every workflow follows the same naming convention, the same documentation standard, the same error handling pattern, the same credential reference model, and the same architectural principles. A new workflow should be indistinguishable in structure from an existing one, even if the business logic is completely different.

This is how Lucas enables future developers (or AI agents) to work on any workflow without a learning curve specific to that workflow. The conventions are universal. The architecture is predictable. The documentation is comprehensive.

The 12+ production systems are standardized, meaning they have been audited against these standards, documented with developer handoff quality, and tested in production environments. They are not prototypes. They are not experiments. They are infrastructure.

---

## Future Direction: The Next 6-12 Months

Lucas is taking the n8n ecosystem in several directions.

**Advanced error handling.** Moving beyond centralized error logging into retry logic, circuit breaker patterns, and escalation workflows that automatically triage failures by severity and route them to the appropriate response.

**Production monitoring.** Building a monitoring layer that provides real-time visibility into workflow health, execution frequency, error rates, and performance metrics. This is the operational intelligence layer that ensures the automation infrastructure is healthy without requiring manual inspection.

**Multi-tenant architecture for Ridgeline.** As Ridgeline Intelligence scales to multiple clients, the n8n workflows that support it must handle multi-tenant data isolation, client-specific configurations, and tenant-aware processing logic.

**Deeper AI agent integration.** Expanding the multi-agent orchestration patterns to include more sophisticated agent-to-agent communication, where one workflow's AI agent output triggers another workflow's processing chain, creating agentic pipelines that handle complex business logic across multiple domains.

---

## How an AI Should Use This File

This file defines the complete n8n operating context. It should be the primary reference for any n8n-related interaction.

Specific behavioral instructions:

1. Never suggest Airtable for any new workflow. Supabase Postgres is the only database. This is absolute and non-negotiable.
2. Always use the correct node naming convention (PREFIX | Description) when building or discussing workflows.
3. When writing expressions, use the correct syntax based on the upstream node type. Reference the expression syntax patterns in this file.
4. Always include error handling in workflow designs. Never produce a workflow without a connection to the centralized error handler.
5. When uncertain about a node's capabilities, version, or configuration options, state the uncertainty clearly. Do not guess.
6. Follow the Fan-Out > Collect > Merge pattern for parallel data retrieval. Include the Collect Code node that restructures multiple items into a single JSON array.
7. Always warn about the known bugs: Code Node caching, Aggregate requirement, Loop wiring, MAIL node data destruction.
8. When building HTML for webhook responses, follow the Foundation Portal design system for FAS interfaces and the Facade Design System for email-safe content.
9. Document every workflow recommendation with the Sticky Note standard: Master Sticky Note + Section Sticky Notes.
10. Treat Lucas's n8n infrastructure as production systems. Never recommend changes that would break existing workflows without explicitly flagging the risk and providing a migration path.
