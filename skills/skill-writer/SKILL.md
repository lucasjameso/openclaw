---
name: skill-writer
description: Enables Forge to create new skills autonomously or on request. Validates skill structure, writes SKILL.md files with proper YAML frontmatter, creates supporting scripts and reference files, and ensures all new skills follow OpenClaw conventions. Use when creating a new skill, formalizing a recurring task into a skill, or when Forge identifies a capability gap.
user-invocable: true
metadata: {"openclaw.requires": {"env": []}}
---

# Skill Writer

Forge's self-improvement mechanism for creating new skills. Handles the full lifecycle: identify need, write SKILL.md, create supporting files, validate structure, and deploy.

## Context

- Skills directory: `~/Forge/openclaw/skills/`
- Skills are auto-discovered on next session start (not available in the session that creates them)
- SKILL.md must be under 500 lines for optimal performance
- Directory name IS the skill ID: use lowercase kebab-case
- Skills at workspace level override shared and bundled skills

## Behavior

### When triggered by "create a skill for {task}" or "formalize this as a skill":

1. Gather requirements:
   - What does the skill do? (one sentence)
   - When should it activate? (trigger conditions)
   - What tools does it need? (bash, web_search, file operations, APIs)
   - What environment variables are required?
   - Is it user-invocable (slash command) or internal only?
   - What is the expected output format?
2. Choose a skill name (lowercase kebab-case, descriptive, concise)
3. Create the directory: `~/Forge/openclaw/skills/{skill-name}/`
4. Write the SKILL.md with this exact structure:

```markdown
---
name: {skill-name}
description: {one-line description of what it does and when it activates}
user-invocable: {true|false}
metadata: {"openclaw.requires": {"env": [{env_vars}]}}
---

# {Skill Title}

{Brief explanation of what this skill does and why it exists.}

## Behavior

{Numbered steps describing exactly what the skill should do:}
1. First action
2. Second action
3. Format the output
4. Post/return the result

## Output Format

{Template showing the exact output structure with {placeholders}}

## Error Handling

{What to do when things fail.}
```

5. If the skill needs helper scripts: create `scripts/` directory with executable files
6. If the skill needs reference docs: create `references/` directory
7. Validate the skill:
   - YAML frontmatter is valid
   - `name` field matches directory name
   - `description` field is present and descriptive
   - Behavior section has numbered steps
   - Output format section has template with placeholders
   - Error handling section exists
   - Total lines under 500
   - No em dashes anywhere in the file
8. Git commit the new skill
9. Report to Lucas: skill created, will be available on next session restart

### When triggered by "Forge, this task keeps coming up":

1. Review the recurring task from conversation history
2. Identify the pattern: what inputs, what processing, what output
3. Propose a skill name and structure
4. Get Lucas's approval
5. Create the skill following the steps above

### When triggered by "improve skill {name}" or "upgrade {skill-name}":

1. Read the existing SKILL.md from `~/Forge/openclaw/skills/{skill-name}/`
2. Identify the improvement needed
3. Make the changes while preserving the core structure
4. Validate the updated skill
5. Git commit with message "skill-writer: updated {skill-name} -- {change_summary}"

## Validation Checklist

Before saving any skill, verify:
- [ ] Directory name is lowercase kebab-case
- [ ] SKILL.md has valid YAML frontmatter
- [ ] `name` field matches directory name exactly
- [ ] `description` field is present (this is what Forge sees when listing skills)
- [ ] Behavior section uses numbered steps
- [ ] Output Format section has {placeholder} template
- [ ] Error Handling section exists
- [ ] No em dashes in any text
- [ ] Total file is under 500 lines
- [ ] Environment variables referenced in body are declared in metadata
- [ ] If webhook-based: includes exact endpoint URL pattern
- [ ] If script-based: scripts are executable

## Skill Patterns

**Webhook-based (most common):**
```
1. Call ${N8N_BASE_URL}/webhook/openclaw/{endpoint} with Bearer auth
2. Parse the JSON response
3. Format as a clean report
4. Post to the appropriate Slack channel
```

**Script-based:**
```
python3 ~/Forge/openclaw/skills/{name}/scripts/{script}.py --args
```

**Tool-based (no API calls):**
```
Uses installed CLI tools: pandoc, tesseract, wkhtmltopdf, etc.
```

## Output Format

```
SKILL CREATED | {skill-name}

Location: ~/Forge/openclaw/skills/{skill-name}/SKILL.md
Lines:    {count}
Type:     {webhook | script | tool-based}
Invocable: {yes | no}
Env vars: {list or none}

Available on next session restart.
```

## Error Handling

- If skill directory already exists: warn Lucas, offer to update instead of overwrite
- If YAML frontmatter is invalid: fix and retry, do not save broken skills
- If skill exceeds 500 lines: split into SKILL.md + references/ directory
- If environment variable is referenced but not declared in metadata: add it to metadata
- Always git commit new skills for rollback safety
