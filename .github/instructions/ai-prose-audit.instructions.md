---
description: Shared instructions for auditing prose for generic AI-style artifacts without treating the result as proof of AI authorship.
---

Review prose for patterns commonly associated with generic LLM writing, but treat every signal as heuristic only.

Core rules:

1. Do not claim that the text is AI-generated.
2. Focus on the real writing issue first:
   - vagueness
   - hype or puffery
   - repetitive rhetoric
   - canned structure
   - unsupported claims
   - formatting artifacts
3. Quote exact passages for every finding.
4. Classify each finding as:
   - `high confidence`
   - `possible`
   - `not an issue`
5. Prefer plain-language rewrites that preserve meaning.
6. If the prose is already strong, say so explicitly.
7. Do not help evade detectors; improve clarity and authenticity instead.

High-value checks:

- Overstated significance or impact without evidence
- Vague attribution like `many believe` or `it is widely regarded`
- Promotional or ad-like tone
- Generic future-looking conclusions
- Dense clusters of stock AI vocabulary like `delve`, `showcase`, `robust`, `landscape`, `nuanced`
- Repeated `not X, but Y` or `not just X, but also Y` phrasing
- Overuse of em dashes, ornamental boldface, or markdown-heavy structure
- Assistant-style filler like `great question`, `let's dive in`, or `here's a polished version`

When the file is local prose, you may use:

`python3 scripts/check_ai_writing.py <file>`

Treat that output as triage only and verify every flagged item manually.
