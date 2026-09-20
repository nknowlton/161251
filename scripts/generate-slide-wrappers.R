#!/usr/bin/env Rscript
# Generate presentation wrappers in slides/ from course/lectures.csv.
#
# Usage:
#   Rscript scripts/generate-slide-wrappers.R
#
# The wrappers include the canonical lecture bodies from lecture-content/ and
# provide Slidy and Beamer output formats without duplicating teaching content.

repo_root <- getwd()
metadata_path <- file.path(repo_root, "course", "lectures.csv")
if (!file.exists(metadata_path)) {
  stop("course/lectures.csv not found. Run this script from the repository root.")
}

meta <- read.csv(metadata_path, stringsAsFactors = FALSE, strip.white = TRUE)
if (!"IncludeInSlides" %in% names(meta)) {
  stop("course/lectures.csv is missing the IncludeInSlides column")
}

meta <- meta[order(meta$LectureNo), ]
meta <- meta[tolower(trimws(meta$IncludeInSlides)) == "yes", ]
slides_dir <- file.path(repo_root, "slides")
dir.create(slides_dir, recursive = TRUE, showWarnings = FALSE)

yaml_quote <- function(value) {
  value <- gsub("\\", "\\\\", value, fixed = TRUE)
  value <- gsub('"', '\\\\"', value, fixed = TRUE)
  paste0('"', value, '"')
}

for (i in seq_len(nrow(meta))) {
  no <- meta$LectureNo[i]
  slug <- meta$Slug[i]
  title <- meta$LectureTitle[i]
  presenter <- meta$Presenter[i]
  filename <- sprintf("%02d-%s.Rmd", no, slug)
  body_file <- sprintf("../lecture-content/%s", filename)

  content <- c(
    "---",
    sprintf("title: %s", yaml_quote(sprintf("Lecture %d: %s", no, title))),
    "subtitle: \"161.251 Regression Modelling\"",
    sprintf("author: %s", yaml_quote(presenter)),
    "date: \"`r format(Sys.Date(), '%Y')`\"",
    "output:",
    "  slidy_presentation:",
    "    slide_level: 2",
    "    incremental: false",
    "    highlight: tango",
    "    css: ../shared/slidy.css",
    "    self_contained: true",
    "  beamer_presentation:",
    "    toc: true",
    "    slide_level: 2",
    "    incremental: false",
    "    latex_engine: xelatex",
    "    extra_dependencies:",
    "      - longtable",
    "      - booktabs",
    "      - array",
    "    pandoc_args: [\"--lua-filter=../shared/beamer-caption.lua\"]",
    "---",
    "",
    "```{r slide-setup, include=FALSE}",
    "source(\"../shared/setup.R\")",
    "",
    sprintf('lecture_slug <- "%s"', slug),
    "slide_format <- if (knitr::is_latex_output()) \"beamer\" else \"slidy\"",
    "",
    "knitr::opts_chunk$set(",
    "  fig.width = 9,",
    "  fig.height = 5.5,",
    "  fig_caption = !knitr::is_latex_output(),",
    "  fig.path = file.path(",
    "    \"../build/slides\",",
    "    lecture_slug,",
    "    paste0(slide_format, \"_files/figure-\")",
    "  ),",
    "  cache.path = file.path(",
    "    \"../build/cache/slides\",",
    "    lecture_slug,",
    "    paste0(slide_format, \"/\")",
    "  )",
    ")",
    "```",
    "",
    sprintf("```{r child-%s, child=\"%s\"}", slug, body_file),
    "```"
  )

  writeLines(content, file.path(slides_dir, filename))
  cat("Generated slides/", filename, "\n", sep = "")
}

cat("\nGenerated ", nrow(meta), " slide wrappers\n", sep = "")
