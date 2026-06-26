## AI Prose Audit Agent Pack

This folder contains a shared prose-audit workflow for both Codex and GitHub Copilot Chat.

Files:

- `CHECKLIST.md`: shared review rubric distilled from Wikipedia's "Signs of AI writing" page.
- `codex-agent.md`: Codex-oriented system prompt for prose review.
- `ghcp-agent.md`: GitHub Copilot Chat prompt with the same review logic.

Use these prompts when you want an agent to review prose for likely AI-style artifacts without treating the result as proof of AI authorship.

Recommended workflow:

1. Run `python3 scripts/check_ai_writing.py path/to/file.md`
2. Paste the findings plus the prose into Codex or GHCP
3. Ask the agent to classify issues as `high confidence`, `possible`, or `not an issue`
4. Revise the prose with the agent, focusing on style and clarity rather than "hiding AI"
