---
name: notebooklm
description: Create and manage Google NotebookLM notebooks for research, content generation, and audio/visual assets
---

# NotebookLM Skill

You have access to Google NotebookLM via the nlm CLI tool installed on the host machine.

## Important

NotebookLM runs on the HOST (Mac Mini), not inside your container. To use it, you need to request
Claude Code to run nlm commands on your behalf, OR use the NotebookLM MCP tools if available.

## What NotebookLM Can Do

- Create notebooks from source documents (PDFs, text, URLs, YouTube)
- Generate audio overviews (podcast-style discussions of your content)
- Generate video overviews
- Generate slide decks
- Generate quizzes and flashcards
- Generate research reports, infographics, data tables, mind maps
- Download outputs as MP3, MP4, PDF, PPTX, PNG, CSV, Markdown

## Workflow for Content Generation

1. Request notebook creation with source documents (CLARITY PDF, context files)
2. Generate the desired output type (audio, slides, infographic)
3. Download the output to /workspace/content/notebooklm/
4. Review and post to #forge or #content-ready for Lucas's approval

## Naming Convention

All Forge notebooks should be prefixed with "Forge -" to keep them separate from Lucas's personal notebooks.
Example: "Forge - CLARITY Marketing Assets"

## Model Routing

- This skill runs through Google's infrastructure (Gemini), not through our API budget
- Free with Lucas's NotebookLM Plus account
- Use liberally for content generation -- it does not cost API tokens

## When to Use

- Need a podcast clip about a CLARITY topic? NotebookLM.
- Need an infographic for social media? NotebookLM.
- Need a slide deck for a presentation? NotebookLM.
- Need to research a topic with verified sources? NotebookLM.
- Need to summarize a large document? Consider NotebookLM before using Claude tokens.
