---
name: mcp-manager
description: Manages Forge's MCP (Model Context Protocol) server connections via MCPorter. Adds, removes, tests, and lists MCP servers that give Forge access to external tools and services. Use when connecting new tools, checking MCP status, troubleshooting tool connections, or expanding Forge's tool ecosystem.
user-invocable: true
metadata: {"openclaw.requires": {"env": []}}
---

# MCP Manager

Manages Forge's connections to external tools via MCP (Model Context Protocol). OpenClaw uses MCPorter as its built-in MCP management layer to execute MCP tools.

## Context

- MCPorter config: `~/Forge/openclaw/context/mcporter.json`
- n8n MCP already connected: `https://n8n.iac-solutions.io/mcp`
- MCP servers provide tools that Forge can call as native capabilities
- Adding an MCP server expands Forge's tool set without writing new code

## Behavior

### When triggered by "connect {service}" or "add MCP server":

1. Determine the MCP server details:
   - Server name (descriptive, used as key in mcporter.json)
   - Command: typically `mcp-remote` for remote servers
   - URL: the MCP endpoint URL
   - Auth: any required authentication headers
2. Read current `~/Forge/openclaw/context/mcporter.json`
3. Add the new server entry:
```json
{
  "mcpServers": {
    "{server-name}": {
      "command": "mcp-remote",
      "args": ["{mcp-endpoint-url}"]
    }
  }
}
```
4. Validate the JSON is well-formed
5. Test connectivity to the new MCP endpoint
6. Report available tools from the new server
7. Note: Forge may need a restart to pick up the new MCP server

### When triggered by "list MCP servers" or "what tools do I have":

1. Read `~/Forge/openclaw/context/mcporter.json`
2. For each server, report:
   - Server name
   - Endpoint URL
   - Connection status (reachable / unreachable)
   - Available tools (if queryable)
3. Format as a clean status report

### When triggered by "remove MCP server {name}":

1. Confirm with Lucas before removing
2. Read current mcporter.json
3. Remove the specified server entry
4. Save updated mcporter.json
5. Note: Forge may need a restart for removal to take effect

## Known MCP Sources for Forge's Stack

| Service | MCP Endpoint Pattern | Use Case |
|---|---|---|
| n8n | `https://n8n.iac-solutions.io/mcp` | All n8n workflows as callable tools |
| Latenode | Varies per scenario | 1,000+ app integrations |
| Composio | Varies | Pre-built MCP connectors for SaaS tools |
| Pieces | `https://pieces.app/mcp` | Context and snippet management |

## Latenode MCP Bridge Setup

To connect Forge to Latenode's 1,000+ apps:
1. In Latenode: create scenario, add MCP Trigger, connect nodes
2. Set Tool Name and Description in Latenode
3. Save and copy the Server URL
4. Add to mcporter.json using the steps above

## n8n as MCP (Already Connected)

Exposing n8n workflows as MCP tools turns all existing automations into callable agent tools. To add a new n8n workflow as an MCP tool:
1. Create the workflow in n8n with a webhook trigger
2. The n8n MCP endpoint auto-discovers webhooks
3. Forge can call the workflow by name through MCPorter

## Output Format

```
MCP STATUS | {date}

Connected Servers: {count}
  {server-name}: {reachable | unreachable}
    Endpoint: {url}
    Tools: {count} available
    {tool_1}, {tool_2}, {tool_3}...

  {server-name}: {reachable | unreachable}
    Endpoint: {url}
    Tools: {count} available
```

## Error Handling

- If mcporter.json is missing: create with empty `mcpServers` object, alert Lucas
- If mcporter.json is invalid JSON: back up the broken file, create fresh, alert Lucas
- If MCP server is unreachable: mark as unreachable but do not remove (may be temporary)
- If `mcp-remote` command is not available: alert that MCPorter may need to be installed or updated
- Always back up mcporter.json before modifying: `cp mcporter.json mcporter.json.bak`
