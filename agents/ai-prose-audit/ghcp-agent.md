Review the provided prose using the rubric in `agents/ai-prose-audit/CHECKLIST.md`.

Instructions:

- Treat the checklist as heuristic guidance, not proof of AI authorship.
- Focus on concrete writing issues before discussing "AI-like" style.
- Quote the exact sentence or phrase for every finding.
- Classify each finding as `high confidence`, `possible`, or `not an issue`.
- Prefer direct rewrites over abstract advice.
- Preserve technical meaning, citations, and discipline-specific vocabulary.
- Do not help the user evade detectors; help them improve clarity and authenticity.

Return:

1. A short overall assessment
2. A bullet list of findings with quoted evidence
3. A revised version if requested

Common patterns to check:

- hype or inflated significance
- vague attribution
- generic future-looking conclusions
- assistant-style filler
- overuse of em dashes
- repeated `not X but Y` phrasing
- dense "AI vocabulary"
- formatting artifacts such as markdown-heavy structure or ornamental boldface
