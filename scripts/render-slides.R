#!/usr/bin/env Rscript
# Render one lecture as Slidy HTML, Beamer PDF, or both.
#
# Usage:
#   Rscript scripts/render-slides.R 26
#   Rscript scripts/render-slides.R model-comparison-2 beamer
#   Rscript scripts/render-slides.R 26 all
#   Rscript scripts/render-slides.R all slidy

args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 1 || length(args) > 2) {
  stop("Usage: Rscript scripts/render-slides.R <lecture-number-or-slug|all> [slidy|beamer|all]")
}

repo_root <- getwd()
metadata_path <- file.path(repo_root, "course", "lectures.csv")
if (!file.exists(metadata_path)) {
  stop("course/lectures.csv not found. Run this script from the repository root.")
}

meta <- read.csv(metadata_path, stringsAsFactors = FALSE, strip.white = TRUE)
if (!"IncludeInSlides" %in% names(meta)) {
  stop("course/lectures.csv is missing the IncludeInSlides column")
}

request <- args[1]
format_request <- if (length(args) == 2) tolower(args[2]) else "slidy"
if (!format_request %in% c("slidy", "beamer", "all")) {
  stop("Format must be one of: slidy, beamer, all")
}

if (!requireNamespace("rmarkdown", quietly = TRUE)) {
  stop("The rmarkdown package is required to render slides")
}

formats <- if (format_request == "all") c("slidy", "beamer") else format_request

if (tolower(request) == "all") {
  rows <- meta[tolower(trimws(meta$IncludeInSlides)) == "yes", , drop = FALSE]
  rows <- rows[order(rows$LectureNo), , drop = FALSE]
  if (nrow(rows) == 0) {
    stop("No lectures are marked IncludeInSlides=yes")
  }
} else {
  if (grepl("^[0-9]+$", request)) {
    rows <- meta[meta$LectureNo == as.integer(request), , drop = FALSE]
  } else {
    rows <- meta[meta$Slug == request, , drop = FALSE]
  }

  if (nrow(rows) == 0) {
    stop(sprintf("No lecture found for '%s'", request))
  }
  if (nrow(rows) > 1) {
    stop(sprintf("Multiple lectures found for '%s'", request))
  }
  if (tolower(trimws(rows$IncludeInSlides)) != "yes") {
    stop(sprintf("Lecture %s is not marked IncludeInSlides=yes", rows$LectureNo))
  }
}

render_lecture <- function(row) {
  no <- row$LectureNo
  slug <- row$Slug
  wrapper <- file.path(repo_root, "slides", sprintf("%02d-%s.Rmd", no, slug))
  if (!file.exists(wrapper)) {
    stop(sprintf("Slide wrapper not found: %s. Run scripts/generate-slide-wrappers.R first.", wrapper))
  }

  output_dir <- file.path(repo_root, "build", "slides", slug)
  dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

  render_one <- function(format_name) {
    if (format_name == "beamer" && !nzchar(Sys.which("xelatex"))) {
      stop("XeLaTeX is required for Beamer output but was not found on PATH")
    }

    output_format <- switch(
      format_name,
      slidy = "slidy_presentation",
      beamer = "beamer_presentation"
    )
    output_base <- sprintf("%02d-%s", no, slug)

    cat(sprintf("Rendering lecture %d as %s...\n", no, format_name))
    result <- rmarkdown::render(
      input = wrapper,
      output_format = output_format,
      output_dir = output_dir,
      output_file = output_base,
      envir = new.env(),
      clean = TRUE,
      quiet = FALSE
    )
    cat(sprintf("Done: %s\n", result))
  }

  for (format_name in formats) render_one(format_name)
}

tryCatch({
  for (i in seq_len(nrow(rows))) {
    render_lecture(rows[i, , drop = FALSE])
  }
}, error = function(e) {
  message("Slide rendering failed: ", conditionMessage(e))
  quit(status = 1)
})
