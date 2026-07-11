# 161.251 Regression Modelling — Course Materials

## What is this?

This repository contains all lecture materials for **161.251 Regression Modelling** at Massey University. The course is co-taught:

- **Jonathan Godfrey** — Weeks 1–8 (lectures 1–24) plus appendix material
- **Nick Knowlton** — Weeks 9–12 (lectures 25–34)

## How the materials are organised

There is **one canonical copy of each lecture**. The teaching content (code,
figures, equations, explanation) lives in `lecture-content/` as a body-only
`.Rmd` file — no YAML, no setup chunk. Two tiny wrapper files reference it:

1. **`lectures/`** — a standalone `.Rmd` with YAML header that you can open in
   RStudio and click **Knit** to preview a single lecture.
2. **`book/`** — a Bookdown chapter wrapper that includes the same body file
   via a child document.

The teaching content is never duplicated. Only the ~15-line wrapper
configuration is repeated per lecture.

### Directory structure

```
161251/
├── course/
│   └── lectures.csv              ← Lecture metadata (number, week, title, slug, presenter)
│
├── lecture-content/             ← Canonical lecture bodies (EDIT THESE)
│   ├── 01-paper-overview.Rmd
│   ├── 02-regression-basics.Rmd
│   └── ...
│
├── lectures/                    ← Standalone lecture wrappers (Knit in RStudio)
│   ├── 01-paper-overview.Rmd
│   └── ...
│
├── book/                        ← Bookdown configuration and chapter wrappers
│   ├── index.Rmd                ← Book preface and bibliography setup
│   ├── _bookdown.yml             ← Explicit chapter order (committed, not generated)
│   ├── _output.yml               ← Gitbook/PDF/EPUB output formats
│   ├── style.css                 ← Bookdown styling
│   ├── sandstone.css             ← Bootswatch sandstone theme
│   ├── book.bib                  ← Bibliography
│   ├── 01-paper-overview.Rmd     ← Chapter wrapper (child include)
│   └── ...
│
├── shared/
│   ├── setup.R                   ← Common packages and knitr options
│   ├── lecture.css               ← Standalone lecture styling
│   ├── course-header.html        ← Navigation header for standalone lectures
│   └── book-header.html          ← Navigation header for Bookdown pages
│
├── data/                         ← Course datasets (CSV files)
├── labs/                         ← Computer lab exercises
├── resources/                    ← Images and downloadable teaching resources
│
├── scripts/
│   ├── render-lecture.R           ← Render a single lecture
│   ├── render-book.R              ← Render the full Bookdown site
│   ├── generate-book-wrappers.R   ← Regenerate book/ wrappers (when restructuring)
│   ├── validate-course.R          ← Validate repository structure
│   └── assemble-site.R            ← Assemble deployment directory
│
└── build/                        ← Generated output (gitignored)
    ├── lectures/
    ├── book/
    ├── cache/
    └── site/
```

## How to edit a lecture

1. Open the relevant file in `lecture-content/` (e.g. `03-simple-linear-regression.Rmd`)
2. Make your changes — this is the teaching content
3. Preview by opening `lectures/03-simple-linear-regression.Rmd` in RStudio and clicking **Knit**

You do not need to run any script to preview a single lecture.

## How to build the full Bookdown site

```bash
Rscript scripts/render-book.R
```

This changes into `book/` and calls `bookdown::render_book("index.Rmd")`.
Output is written to `build/book/`.

You can also build directly:

```bash
cd book
Rscript -e 'bookdown::render_book("index.Rmd")'
```

## How to render a single lecture from the command line

```bash
Rscript scripts/render-lecture.R 3
Rscript scripts/render-lecture.R 03-simple-linear-regression
```

Output is written to `build/lectures/<slug>/index.html`.

## How to add or restructure a lecture

1. Edit `course/lectures.csv` — add or modify a row with the lecture number,
   week, title, slug, and presenter
2. If adding a new lecture, create `lecture-content/NN-slug.Rmd` with the
   teaching content
3. Run `Rscript scripts/generate-book-wrappers.R` to regenerate the book
   chapter wrappers and `_bookdown.yml`
4. Create a `lectures/NN-slug.Rmd` wrapper (copy an existing one and update
   the slug and child path)
5. Commit the new files

### lectures.csv columns

| Column | Description | Example |
|--------|-------------|---------|
| `LectureNo` | Lecture display number | `25` |
| `Week` | Teaching week (1–12), or 0 for appendix | `9` |
| `LectureTitle` | Full title | `The General Linear Model` |
| `Slug` | Kebab-case slug for filenames | `general-linear-model` |
| `Presenter` | Presenter name | `Nick Knowlton` |
| `IncludeInBook` | Whether to include in Bookdown | `yes` |

Filenames use `sprintf("%02d-%s", LectureNo, Slug)`.

## How to validate the repository

```bash
Rscript scripts/validate-course.R
```

This checks metadata consistency, file existence, child document paths, data
file references, chunk label uniqueness, figure/cache isolation, and more.

## How to assemble the deployment site

```bash
Rscript scripts/render-book.R
Rscript scripts/assemble-site.R
```

This assembles `build/site/` with the Bookdown output, data files, labs, and
resources.

## What about the old `godfrey/` directory?

The `godfrey/` directory contains the previous build pipeline (`Content/`,
`InClass/`, `AsBook/`, `MakeFiles.R`). These are preserved for reference but
are no longer part of the build. The canonical content has been migrated to
`lecture-content/`.

## Course outline

| Week | Lectures | Presenter |
|------|----------|-----------|
| 1 | Paper Overview, Basics, Simple LR, Regression with R | Jonathan Godfrey |
| 2 | Checking Assumptions, Outliers, Assumptions Fail | Jonathan Godfrey |
| 3 | Prediction, Multiple LR, Testing (1) | Jonathan Godfrey |
| 4 | Testing (2), Matrix Algebra, Matrices & LR | Jonathan Godfrey |
| 5 | Model Comparison, Binary Predictors | Jonathan Godfrey |
| 6 | Polynomial, Orthogonal Polynomials, Piecewise | Jonathan Godfrey |
| 7 | One Factor, Diagnostics & Multiple Comparisons, Factor or Covariate | Jonathan Godfrey |
| 8 | Two Factor, Orthogonal Factorial, Interactions | Jonathan Godfrey |
| 9 | General Linear Model, Comparing GLMs, Variable Selection | Nick Knowlton |
| 10 | Stepwise, Multicollinearity, Weighted Regression | Nick Knowlton |
| 11 | Splines/LOESS, Time-Indexed Regression, Trend & Seasonality | Nick Knowlton |
| 12 | Diagnosing Autocorrelation, Autoregressive Errors | Nick Knowlton |

## Questions?

Contact Nick Knowlton (`N.Knowlton@massey.ac.nz`) or Jonathan Godfrey (`a.j.godfrey@massey.ac.nz`).