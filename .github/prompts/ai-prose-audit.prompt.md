---
description: Audit the current prose for generic AI-style writing artifacts and suggest cleaner rewrites.
mode: ask
---

Use `.github/instructions/ai-prose-audit.instructions.md` as the review rubric.

Audit the attached or active prose for AI-style writing artifacts.

Workflow:

1. If a local file is in scope, first use `python3 scripts/check_ai_writing.py <file>` as a quick triage step.
2. Review the prose manually.
3. Report findings with exact quoted evidence.
4. Classify each finding as `high confidence`, `possible`, or `not an issue`.
5. Suggest direct rewrites in plain English.

Return:

- `Overall read`
- `Findings`
- `Suggested rewrites`
- `Cleaned version` only if asked
