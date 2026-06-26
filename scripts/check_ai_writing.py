#!/usr/bin/env python3
"""Lightweight heuristic checker for AI-style prose patterns.

This script is intentionally conservative. It flags patterns worth reviewing;
it does not decide whether text was AI-generated.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


AI_VOCAB = {
    "crucial",
    "delve",
    "dynamic",
    "foster",
    "landscape",
    "leverage",
    "multifaceted",
    "notably",
    "nuanced",
    "realm",
    "robust",
    "showcase",
    "streamline",
    "tapestry",
    "underscores",
    "vibrant",
}

PATTERNS = [
    (
        "negative_parallelism",
        re.compile(r"\bnot just\b.*?\bbut also\b", re.IGNORECASE),
        "Repeated `not just X, but also Y` phrasing can feel canned.",
    ),
    (
        "contrast_template",
        re.compile(r"\bnot\b[^.?!\n]{0,80}\bbut\b", re.IGNORECASE),
        "Frequent `not X, but Y` constructions can sound synthetic.",
    ),
    (
        "rather_than",
        re.compile(r"\brather than\b", re.IGNORECASE),
        "Repeated `rather than` contrasts can become formulaic.",
    ),
    (
        "vague_attribution",
        re.compile(
            r"\b(many believe|it is widely regarded|critics say|some argue|many argue|widely seen as)\b",
            re.IGNORECASE,
        ),
        "Vague attribution weakens accountability and evidence.",
    ),
    (
        "future_wrapup",
        re.compile(
            r"\b(challenges and opportunities|future directions|looking ahead|in conclusion)\b",
            re.IGNORECASE,
        ),
        "Generic wrap-up language is often low-information.",
    ),
    (
        "assistant_filler",
        re.compile(
            r"\b(let'?s dive in|great question|here'?s a polished version|absolutely|certainly)\b",
            re.IGNORECASE,
        ),
        "Assistant-style filler can make prose sound canned.",
    ),
]


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p.strip() for p in parts if p.strip()]


def normalize_markdown(text: str) -> str:
    normalized_lines = []
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped:
            normalized_lines.append("")
            continue
        stripped = re.sub(r"^#{1,6}\s*", "", stripped)
        stripped = re.sub(r"^\s*[-*+]\s*", "", stripped)
        stripped = re.sub(r"^\s*\d+\.\s*", "", stripped)
        normalized_lines.append(stripped)
    return "\n".join(normalized_lines)


def find_ai_vocab(sentences: list[str]) -> list[tuple[str, list[str]]]:
    flagged = []
    for sentence in sentences:
        words = re.findall(r"[A-Za-z][A-Za-z'-]*", sentence.lower())
        hits = sorted({word for word in words if word in AI_VOCAB})
        if len(hits) >= 2:
            flagged.append((sentence, hits))
    return flagged


def count_em_dashes(text: str) -> int:
    return text.count("—")


def count_bold_markdown(text: str) -> int:
    return len(re.findall(r"\*\*[^*]+\*\*", text))


def find_title_case_headings(lines: list[str]) -> list[str]:
    headings = []
    for line in lines:
        stripped = line.strip()
        if not stripped.startswith("#"):
            continue
        text = stripped.lstrip("#").strip()
        words = [w for w in re.findall(r"[A-Za-z][A-Za-z'-]*", text) if len(w) > 2]
        if len(words) >= 3 and sum(w[0].isupper() for w in words) / len(words) > 0.8:
            headings.append(text)
    return headings


def analyze(text: str) -> str:
    normalized_text = normalize_markdown(text)
    lines = text.splitlines()
    sentences = split_sentences(normalized_text)
    results: list[str] = []

    results.append("AI-style prose audit")
    results.append("")
    results.append("Caveat: these are heuristic flags, not proof of AI authorship.")
    results.append("")

    dash_count = count_em_dashes(text)
    if dash_count >= 3:
        results.append(f"- overuse_em_dash: found {dash_count} em dashes")

    bold_count = count_bold_markdown(text)
    if bold_count >= 4:
        results.append(f"- overuse_bold: found {bold_count} bold markdown spans")

    title_case = find_title_case_headings(lines)
    for heading in title_case:
        results.append(f"- title_case_heading: `{heading}`")

    for name, pattern, explanation in PATTERNS:
        matches = []
        for sentence in sentences:
            if pattern.search(sentence):
                matches.append(sentence)
        if matches:
            results.append(f"- {name}: {len(matches)} hit(s)")
            results.append(f"  note: {explanation}")
            for sentence in matches[:3]:
                results.append(f"  example: {sentence}")

    vocab_hits = find_ai_vocab(sentences)
    if vocab_hits:
        results.append(f"- ai_vocabulary_cluster: {len(vocab_hits)} sentence(s)")
        for sentence, hits in vocab_hits[:3]:
            results.append(f"  words: {', '.join(hits)}")
            results.append(f"  example: {sentence}")

    if len(results) == 4:
        results.append("- no obvious high-signal heuristic flags found")

    return "\n".join(results)


def main() -> int:
    parser = argparse.ArgumentParser(description="Check prose for AI-style heuristics.")
    parser.add_argument("path", nargs="?", help="Text or markdown file to inspect. Reads stdin if omitted.")
    args = parser.parse_args()

    if args.path:
        text = Path(args.path).read_text(encoding="utf-8")
    else:
        text = sys.stdin.read()

    print(analyze(text))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
