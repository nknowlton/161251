# AI Prose Audit Checklist

Source inspiration:

- Wikipedia: "Signs of AI writing" — https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing

Important caveats:

- These signs are heuristics, not proof of AI authorship.
- Do not use detector-style claims as evidence on their own.
- Focus on concrete writing problems first: vagueness, puffery, repetition, canned structure, and unsupported claims.

## High-value checks

### Content

- Overstated significance, legacy, impact, or broader trends without evidence
- Canned emphasis on notability, importance, or media attention
- Superficial analysis that sounds polished but says little
- Promotional or advertisement-like wording
- Vague attribution like "critics say", "many believe", or "it is widely regarded"
- Generic wrap-up sections about challenges, opportunities, or future directions

### Language

- Dense clusters of "AI vocabulary" such as `delve`, `showcase`, `underscores`, `foster`, `vibrant`, `crucial`, `notably`, `tapestry`, `realm`, `landscape`, `robust`, `nuanced`
- Repeated negative parallelisms:
  - `not just X, but also Y`
  - `not X, but Y`
  - `X rather than Y`
- Rule-of-three phrasing used too often
- Excessive lexical variation that avoids repeating simple, natural wording
- Avoidance of direct, plain `is` / `are` statements in favor of ornate constructions

### Style and formatting

- Title Case headings where sentence case would be more natural
- Overuse of boldface
- Inline mini-headings followed by vertical lists
- Overuse of em dashes
- Odd tables used for layout rather than data
- Markdown artifacts in prose that should not be there

### Assistant-style user communication

- Overly collaborative canned framing like `let's dive in`, `here's a polished version`, `absolutely`, `great question`
- Knowledge-cutoff disclaimers or speculation about missing sources
- Placeholder templates and stock section labels

## Review output format

For each issue:

1. Name the pattern
2. Quote or point to the exact sentence
3. Mark confidence as `high confidence`, `possible`, or `not an issue`
4. Explain the real writing problem
5. Suggest a plain-language rewrite

## What not to do

- Do not accuse the author of using AI.
- Do not "humanize" prose by making it sloppier.
- Do not reward false positives for harmless features used sparingly.
- Do not strip all structure from good technical writing.
