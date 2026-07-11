#!/usr/bin/env python3
"""One-time migration: generate lecture-content/, lectures/, and book/chapters/
from the old godfrey/Content/ + godfrey/TopicList.csv structure.

After running this script, the generated files are the canonical source of
truth and should be edited directly. Do NOT re-run this script after making
edits — it will overwrite your changes.

Usage:
    python3 scripts/migrate-lectures.py
"""
import csv
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(REPO, "godfrey", "Content")
TOPIC_CSV = os.path.join(REPO, "godfrey", "TopicList.csv")
BODY_DIR = os.path.join(REPO, "lecture-content")
LECTURES_DIR = os.path.join(REPO, "lectures")
CHAPTERS_DIR = os.path.join(REPO, "book")

SLUG_MAP = {
    "PaperOverview": "paper-overview",
    "BasicsRegression": "regression-basics",
    "Simple": "simple-linear-regression",
    "RegressionWithR": "regression-with-r",
    "CheckingAssumptions": "checking-assumptions",
    "Outliers": "outliers-influential-points",
    "AssumptionsFail": "assumptions-fail",
    "Prediction": "prediction-simple-regression",
    "Multiple": "multiple-regression",
    "Testing1": "testing-multiple-regression-1",
    "Testing2": "testing-multiple-regression-2",
    "Matrix1": "matrix-algebra",
    "Matrix2": "matrices-linear-regression",
    "ModelComparison1": "model-comparison-1",
    "Binary": "binary-predictors",
    "Polynomial": "polynomial-regression",
    "OrthogonalPolynomials": "orthogonal-polynomials",
    "Piecewise": "piecewise-regression",
    "OneWayModels1": "one-way-models-1",
    "OneWayModels2": "one-way-models-2",
    "FactorOrCovariate": "factor-or-covariate",
    "TwoFactorModel": "two-factor-model",
    "OrthogonalFactorialModels": "orthogonal-factorial-models",
    "Interactions": "factor-interactions",
    "GeneralLinearModel": "general-linear-model",
    "ModelComparison2": "model-comparison-2",
    "VariableSelection": "variable-selection",
    "Stepwise": "stepwise-penalised-regression",
    "Multicollinearity": "multicollinearity-ridge",
    "Weighted": "weighted-regression",
    "SplinesAndLOESS": "splines-loess",
    "TimeIndexedRegression": "time-indexed-regression",
    "TrendSeasonality": "trend-seasonality",
    "DiagnosingAutocorrelatedErrors": "diagnosing-autocorrelation",
    "AutoregressiveErrors": "autoregressive-errors",
    "RAndRStudio": "intro-r-rstudio",
    "RegressionOrigin": "regression-through-origin",
    "Transformations": "transformations",
    "ManyFactors": "many-factors",
    "Nonlinear": "nonlinear-least-squares",
}


def fix_paths(body: str) -> str:
    """Rewrite data and image paths for the new directory layout.

    lecture-content/ is one level below the repo root, so:
      ../../data/  (old: from godfrey/InClass/) -> ../data/
      ../Data/    (old: from godfrey/InClass/) -> ../data/
      ../graphics/ (old: from godfrey/InClass/) -> ../resources/
    """
    body = body.replace("../../data/", "../data/")
    body = body.replace("../Data/", "../data/")
    body = body.replace("../graphics/", "../resources/")
    return body


def make_lecture_wrapper(no: int, slug: str, title: str, is_appendix: bool) -> str:
    """Build the standalone lecture wrapper (YAML + setup + child include)."""
    date_line = ""
    if not is_appendix:
        date_line = "\ndate: |\n  `r format(Sys.Date(), '%Y')`"

    body_file = f"../lecture-content/{no:02d}-{slug}.Rmd"

    return f"""---
title: "{title}"
subtitle: "161.251 Regression Modelling"{date_line}
output:
  html_document:
    toc: true
    toc_float: true
    number_sections: false
    code_download: true
    css: ../shared/lecture.css
    includes:
      in_header: ../shared/course-header.html
---

```{{r setup, include=FALSE}}
source("../shared/setup.R")

lecture_slug <- "{slug}"

knitr::opts_chunk$set(
  fig.path = file.path(
    "../build/lectures",
    paste0(lecture_slug, "_files/figure-html/")
  ),
  cache.path = file.path(
    "../build/cache/lectures",
    paste0(lecture_slug, "/")
  )
)
```

```{{r child-{slug}, child="{body_file}"}}
```
"""


def make_chapter_wrapper(no: int, slug: str, title: str) -> str:
    """Build the Bookdown chapter wrapper (heading + setup + child include)."""
    body_file = f"../lecture-content/{no:02d}-{slug}.Rmd"

    return f"""# {title} {{{slug}}}

```{{r {slug}-chapter-setup, include=FALSE}}
source("../shared/setup.R")

knitr::opts_chunk$set(
  fig.path = "_main_files/figure-html/{slug}-",
  cache.path = "../build/cache/book/{slug}/"
)
```

```{{r child-{slug}, child="{body_file}"}}
```
"""


def main():
    for d in (BODY_DIR, LECTURES_DIR, CHAPTERS_DIR):
        os.makedirs(d, exist_ok=True)

    with open(TOPIC_CSV) as fh:
        rows = list(csv.DictReader(fh))

    for row in rows:
        label = row["Label"]
        slug = SLUG_MAP[label]
        no = int(row["LectureNo"])
        title = row["LectureTitle"]
        is_appendix = row["Week"] == "0"
        fname = f"{no:02d}-{slug}"

        content_file = os.path.join(CONTENT_DIR, f"{label}.Rmd")
        if not os.path.exists(content_file):
            print(f"WARNING: missing {content_file}", file=sys.stderr)
            continue

        with open(content_file) as fh:
            body = fh.read()

        body = fix_paths(body)
        if not body.startswith("\n"):
            body = "\n" + body
        if not body.endswith("\n"):
            body += "\n"

        # 1. lecture-content/ — the canonical body (no YAML, no setup chunk)
        body_path = os.path.join(BODY_DIR, f"{fname}.Rmd")
        with open(body_path, "w") as fh:
            fh.write(body)
        print(f"  lecture-content/{fname}.Rmd")

        # 2. lectures/ — standalone wrapper
        lecture_wrapper = make_lecture_wrapper(no, slug, title, is_appendix)
        lecture_path = os.path.join(LECTURES_DIR, f"{fname}.Rmd")
        with open(lecture_path, "w") as fh:
            fh.write(lecture_wrapper)
        print(f"  lectures/{fname}.Rmd")

        # 3. book/chapters/ — bookdown wrapper
        chapter_wrapper = make_chapter_wrapper(no, slug, title)
        chapter_path = os.path.join(CHAPTERS_DIR, f"{fname}.Rmd")
        with open(chapter_path, "w") as fh:
            fh.write(chapter_wrapper)
        print(f"  book/chapters/{fname}.Rmd")

    print(f"\nGenerated {len(rows)} lectures in all three directories.")


if __name__ == "__main__":
    main()