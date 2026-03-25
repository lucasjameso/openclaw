---
name: agent-spawner
description: Manages Forge's multi-agent team including spawning new sub-agents, configuring workspaces, monitoring agent health, and coordinating agent-to-agent communication. Use when creating new agents, checking agent status, delegating tasks to sub-agents, or managing the agent team for parallel workstreams.
user-invocable: true
metadata: {"openclaw.requires": {"env": []}}
---

# Agent Spawner

Manages Forge's multi-agent team architecture. Handles spawning, configuration, health monitoring, and retirement of specialized sub-agents.

## Context

- Forge runs as the main orchestrator agent
- Sub-agents are registered via `openclaw agents add`
- Each sub-agent gets its own workspace directory under `~/Forge/agents/`
- Spawning must be explicitly enabled in openclaw.json via `allowAgents`
- Maximum concurrent sub-agents: 8 (configured in openclaw.json)
- Maximum spawn depth: 2 (sub-agents can spawn their own children)
- Sub-agents should use Claude Sonnet (cost efficiency), Forge main uses Opus for Lucas conversations

## Three Spawn Methods

### Method 1: Isolated Agents (Persistent, Parallel)
Best for: ongoing workstreams that run independently

```bash
openclaw agents add {agent-name} --workspace ~/Forge/agents/{agent-name}/
```

Each gets its own SOUL.md, AGENTS.md, tools, and memory. True separation.

### Method 2: Workspace Switching (Sequential)
Best for: different personas within one Forge process, sequential handoffs

### Method 3: Spawn and Report (Temporal Workers)
Best for: parallelizable one-off tasks, batch processing

Uses `sessions_spawn` tool to create temporary child agent, wait for report, continue.

## Behavior

### When triggered by "create agent" or "spawn {agent-name}":

1. Confirm with Lucas:
   - Agent name (kebab-case)
   - Agent purpose (one sentence)
   - Spawn method (isolated, workspace-switch, or spawn-and-report)
   - Model to use (default: anthropic/claude-sonnet-4-6)
   - Autonomy level (supervised, semi-autonomous, autonomous)
2. Create workspace directory: `~/Forge/agents/{agent-name}/`
3. Generate required workspace files:
   - `SOUL.md`: Focused personality for the agent's specific role
   - `AGENTS.md`: Operational rules, tool permissions, constraints
   - `HEARTBEAT.md`: If autonomous, otherwise skip
4. If isolated agent: register with `openclaw agents add`
5. Update Forge's openclaw.json `allowAgents` list to include new agent
6. Verify agent is discoverable via `sessions_list`
7. Report success to Lucas

### When triggered by "agent status" or "check agents":

1. List all registered agents via `sessions_list`
2. For each agent, report:
   - Name
   - Status (active, idle, error)
   - Last active timestamp
   - Current task (if any)
   - Model configured
   - Workspace path
3. Check for zombie agents (registered but not responding)
4. Check for resource waste (idle agents with running sessions)

### When triggered by "retire agent" or "remove {agent-name}":

1. Confirm with Lucas before proceeding
2. Stop the agent's sessions
3. Archive the agent's workspace to `~/Forge/agents/archive/{agent-name}/`
4. Remove from `allowAgents` in openclaw.json
5. Do NOT delete -- archive only

## Proposed Agent Team (from CLARITY Launch Plan)

```
Forge (Orchestrator)
  content-agent:     X posts, email drafts, TikTok scripts
  research-agent:    Market research, pricing data, competitor analysis
  book-launch-agent: CLARITY-specific tasks only
  analytics-agent:   Follower tracking, revenue dashboard
```

## Session Tools for Agent-to-Agent Communication

| Tool | Purpose |
|---|---|
| `sessions_list` | Discover active sessions |
| `sessions_send` | Message another agent session directly |
| `sessions_history` | Fetch transcripts from another agent |
| `sessions_spawn` | Create a new temporary child agent |

## Output Format

```
AGENT TEAM STATUS | {date}

Registered Agents: {count}
Active:   {count}
Idle:     {count}
Errored:  {count}

AGENT DETAILS:
  {agent-name}:
    Status:    {active | idle | error}
    Model:     {model}
    Last Active: {timestamp}
    Task:      {current_task | none}

RESOURCE USAGE:
  Concurrent sessions: {count}/{max}
  Estimated daily cost from sub-agents: ${estimate}
```

## Error Handling

- If `allowAgents` is not set in openclaw.json: warn that spawning is disabled, offer to enable
- If max concurrent agents reached: queue the request, alert Lucas
- If agent workspace creation fails (permissions): alert and provide manual commands
- Never delete agent workspaces. Always archive.
- If an agent modifies openclaw.json: CRITICAL alert (known issue #18237)
- Keep sub-agent config files read-only to prevent cross-agent config mutation
