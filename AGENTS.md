# AGENTS.md — 161.251 Regression Modelling Course Materials

## Architecture

This repository manages lecture content for Massey University course 161.251 (Regression Modelling). The system uses a single-source-of-truth pattern:

```
Content/*.Rmd          ← Body content only (the single source of truth)
TopicList.csv          ← Metadata: lecture numbers, weeks, titles, presenters
MakeFiles.R            ← Build script: generates InClass, AsBook, and Index from Content
  ↓
InClass/LectureNN.Rmd  ← Generated presentation slides (YAML + Setup + body)
AsBook/NNLabel.Rmd     ← Generated bookdown chapters (heading + link + Setup + body)
InClass/Index.Rmd      ← Generated week-by-week index page
site/                  ← Static landing pages for the deployed course site
```

## Key Files

| File | Purpose | Edit? |
|------|---------|-------|
| `godfrey/Content/*.Rmd` | Lecture body content (no YAML, no setup chunk) | **YES — edit these** |
| `godfrey/Content/Setup.Rmd` | Shared knitr setup chunk (libraries, chunk options) | Rarely |
| `godfrey/TopicList.csv` | Lecture metadata (number, week, title, label, presenter) | **YES — to restructure course** |
| `godfrey/MakeFiles.R` | Build script that assembles all output files | Rarely |
| `godfrey/InClass/LectureNN.Rmd` | Generated presentation slides | **NO — regenerated** |
| `godfrey/AsBook/NNLabel.Rmd` | Generated bookdown chapters | **NO — regenerated** |
| `godfrey/InClass/Index.Rmd` | Generated lecture index | **NO — regenerated** |
| `godfrey/AsBook/_bookdown.yml` | Bookdown configuration | YES |
| `godfrey/AsBook/_output.yml` | Bookdown output formats | YES |
| `godfrey/AsBook/index.Rmd` | Bookdown preface/bibliography setup | YES |
| `site/*.html` | Course, lab, and widget landing pages | YES |

## Workflow

### Editing lecture content

1. Edit the relevant `godfrey/Content/<Label>.Rmd` file
2. Run `Rscript MakeFiles.R` from the `godfrey/` directory
3. Run `bookdown::render_book("index.Rmd", output_format = "bookdown::gitbook")` from `godfrey/AsBook/`

### Restructuring the course (adding/removing/reordering lectures)

1. Edit `godfrey/TopicList.csv` — update lecture numbers, weeks, titles, labels, presenters
2. If adding a new lecture, create `godfrey/Content/<Label>.Rmd` with the body content
3. Run `Rscript MakeFiles.R` from the `godfrey/` directory
4. Run `bookdown::render_book("index.Rmd", output_format = "bookdown::gitbook")` from `godfrey/AsBook/`

### TopicList.csv format

```csv
LectureNo,Week,LectureTitle,Label,Presenter,Tidyverse
1,1,Paper Overview,PaperOverview,Jonathan Godfrey <a.j.godfrey@massey.ac.nz>,irrelevant
```

- **LectureNo**: Display number in YAML title (can differ from file sequence)
- **Week**: Teaching week (1-12), or 0 for appendices (no date line generated)
- **LectureTitle**: Full title shown in YAML and bookdown heading
- **Label**: Used for AsBook filename and bookdown anchor (e.g. `PaperOverview` → `01PaperOverview.Rmd`)
- **Presenter**: Full name with email in angle brackets
- **Tidyverse**: Whether the lecture uses tidyverse (informational only)

### MakeFiles.R behavior

- Reads `TopicList.csv` sorted by `LectureNo`
- For each row, generates:
  - `InClass/Lecture<i>.Rmd` — with YAML header (title, author, date, output formats) + Setup chunk + Content body
  - `AsBook/<NN><Label>.Rmd` — with markdown heading + "In class version" link + Setup chunk + Content body
- Only regenerates files when Content is newer than the existing output
- Regenerates `InClass/Index.Rmd` if any files were updated
- Appendices (Week 0) get no `date:` line in YAML
- Index includes presenter attribution per week

### Bookdown configuration

- `_bookdown.yml`: `new_session: yes` (each chapter runs in its own R session)
- Output directory: `Final/`
- Chapter naming: `chapter_name: "Lecture  "`
- Chapters are numbered 01-39, sorted alphabetically by filename

## Live Site Deployment

GitHub Pages deploys this repository as a standalone course site at
`https://knowlton.co.nz/161251/`. A push to `main` builds and deploys these
routes automatically:

| Route | Published content |
|------|-------------------|
| `/161251/` | Course landing page from `site/index.html` |
| `/161251/notes/` | Bookdown output and downloadable in-class Rmd files |
| `/161251/labs/` | Lab landing page and all lab Rmd files |
| `/161251/widget/` | Widget placeholder from `site/widget/index.html` |

The GitHub Actions workflow assembles `_site/` for Pages. Do not add a `CNAME`
file and do not use the Astro repository for this course. Lab solution files are
published but deliberately omitted from the lab index; this is not access
control.

## Teaching split

- **Jonathan Godfrey**: Weeks 1-8 (Lectures 1-24) + appendices (35-39)
- **Nick Knowlton**: Weeks 9-12 (Lectures 25-34)

## Data files

Course data files live in `/data/` at the repo root. Bookdown chapters reference
them via `../../data/<filename>.csv`. If a required data file is missing, add it
to `/data/` and commit it with the course material; builds must not depend on an
external data host.

## Archived materials

`godfrey/Old/` contains previous years' lecture files for reference. These are not part of the build pipeline.

## Common issues

- **Duplicate chunk label 'setup'**: Ensure `_bookdown.yml` has `new_session: yes`
- **Missing data files**: Add the required file to `/data/` and commit it.
- **Missing R packages**: Install with `install.packages(c("DescTools", "car", "emmeans", "nlme", "lmtest", "glmnet", "patchwork", "kableExtra"))`
- **Bookdown won't compile**: Run from `godfrey/AsBook/` directory, not repo root
