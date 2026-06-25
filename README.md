# 161.251 Regression Modelling — Course Materials

## What is this?

This repository contains all lecture materials for **161.251 Regression Modelling** at Massey University. The course is co-taught:

- **Jonathan Godfrey** — Weeks 1–8 (lectures 1–24) plus appendix material
- **Nick Knowlton** — Weeks 9–12 (lectures 25–34)

## How the materials are organised

There are three layers to the course materials:

### 1. Content (the source of truth)

All lecture content lives in `godfrey/Content/`. Each file contains just the teaching material — no formatting, no headers, no metadata. This is where you edit lectures.

A companion file `godfrey/TopicList.csv` holds the metadata for each lecture: its number, which week it's taught in, the title, who presents it, and a short label used for filenames.

### 2. Build script

`godfrey/MakeFiles.R` reads the content files and the topic list, then automatically generates:

- **In-class slides** (`godfrey/InClass/Lecture1.Rmd` through `Lecture39.Rmd`) — formatted as presentation slides with titles, author names, and dates
- **Bookdown chapters** (`godfrey/AsBook/01PaperOverview.Rmd` through `39Nonlinear.Rmd`) — formatted for the compiled reference book
- **Index page** (`godfrey/InClass/Index.Rmd`) — a week-by-week listing of all lectures with links

### 3. Compiled output

Running bookdown on the AsBook chapters produces a navigable HTML book (and optionally PDF) that students can browse online.

## How to edit a lecture

1. Open the relevant file in `godfrey/Content/` (e.g. `GeneralLinearModel.Rmd`)
2. Make your changes — this is just the teaching content
3. Run the build script:

   ```r
   setwd("godfrey")
   Rscript MakeFiles.R
   ```

4. Rebuild the book (if needed):

   ```r
   setwd("AsBook")
   bookdown::render_book("index.Rmd", output_format = "bookdown::gitbook")
   ```

**Never edit files in `InClass/` or `AsBook/` directly** — they are generated and will be overwritten.

## How to add or restructure a lecture

1. Edit `godfrey/TopicList.csv` — add or modify a row with the lecture number, week, title, label, and presenter
2. If adding a new lecture, create `godfrey/Content/<Label>.Rmd` with the content
3. Run `Rscript MakeFiles.R` to regenerate all files

### TopicList.csv columns

| Column | Description | Example |
|--------|-------------|---------|
| `LectureNo` | Lecture display number | `25` |
| `Week` | Teaching week (1–12), or 0 for appendix | `9` |
| `LectureTitle` | Full title | `The General Linear Model` |
| `Label` | Short label for filenames | `GeneralLinearModel` |
| `Presenter` | Name and email | `Nick Knowlton <N.Knowlton@massey.ac.nz>` |
| `Tidyverse` | Whether tidyverse is used | `yes` |

## Directory structure

```
161251/
├── AGENTS.md                  ← Technical guide for AI agents
├── README.md                  ← This file
├── data/                      ← Course datasets (CSV files)
├── godfrey/
│   ├── Content/               ← Lecture body content (EDIT THESE)
│   │   ├── Setup.Rmd          ← Shared knitr setup chunk
│   │   ├── PaperOverview.Rmd
│   │   ├── GeneralLinearModel.Rmd
│   │   └── ...
│   ├── TopicList.csv          ← Lecture metadata (EDIT TO RESTRUCTURE)
│   ├── MakeFiles.R            ← Build script (RUN TO REGENERATE)
│   ├── InClass/               ← Generated presentation slides
│   │   ├── Index.Rmd
│   │   ├── Lecture1.Rmd
│   │   └── ...
│   ├── AsBook/                ← Generated bookdown chapters
│   │   ├── _bookdown.yml
│   │   ├── _output.yml
│   │   ├── index.Rmd
│   │   ├── 01PaperOverview.Rmd
│   │   └── ...
│   └── Old/                   ← Archived materials from previous years
├── labs/                      ← Computer lab exercises
├── assessment/                ← Assignment materials
└── Part 2 Lectures/           ← Sergio's Quarto slides (supplementary)
```

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
| 11 | Splines/LOESS/Regularized, Time Models, Autocorrelated Errors | Nick Knowlton |
| 12 | Autoregressive Errors | Nick Knowlton |

## Questions?

Contact Nick Knowlton (`N.Knowlton@massey.ac.nz`) or Jonathan Godfrey (`a.j.godfrey@massey.ac.nz`).
