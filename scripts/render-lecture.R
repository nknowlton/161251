#!/usr/bin/env Rscript
# Render a single standalone lecture to build/lectures/<slug>/index.html
#
# Usage:
#   Rscript scripts/render-lecture.R 3
#   Rscript scripts/render-lecture.R 03-simple-linear-regression
#
# The script resolves the lecture from course/lectures.csv, renders it with
# rmarkdown::render() in a clean environment, and writes the output to
# build/lectures/<slug>/index.html.

args <- commandArgs(trailingOnly = TRUE)
if (length(args) != 1) {
  stop("Usage: Rscript scripts/render-lecture.R <lecture-number-or-slug>")
}

repo_root <- normalizePath(file.path(getwd(), "..", ".."))
if (!file.exists(file.path(repo_root, "course", "lectures.csv"))) {
  # Maybe we're already at the repo root
  repo_root <- getwd()
}

meta <- read.csv(file.path(repo_root, "course", "lectures.csv"),
                 stringsAsFactors = FALSE, strip.white = TRUE)

request <- args[1]

# Resolve the lecture: by number or by slug
if (grepl("^[0-9]+$", request)) {
  row <- meta[meta$LectureNo == as.integer(request), ]
} else {
  row <- meta[meta$Slug == request, ]
}

if (nrow(row) == 0) {
  stop(sprintf("No lecture found for '%s'. Available: %s",
               request, paste(meta$Slug, collapse = ", ")))
}

no <- row$LectureNo
slug <- row$Slug
title <- row$LectureTitle

lecture_file <- file.path(repo_root, "lectures",
                          sprintf("%02d-%s.Rmd", no, slug))

if (!file.exists(lecture_file)) {
  stop(sprintf("Lecture file not found: %s", lecture_file))
}

output_dir <- file.path(repo_root, "build", "lectures", slug)

cat(sprintf("Rendering lecture %d: %s\n", no, title))
cat(sprintf("  Source: %s\n", lecture_file))
cat(sprintf("  Output: %s\n", file.path(output_dir, "index.html")))

# Render in a clean environment
result <- tryCatch({
  rmarkdown::render(
    input = lecture_file,
    output_dir = output_dir,
    output_file = "index.html",
    envir = new.env(),
    clean = FALSE,
    quiet = FALSE
  )
}, error = function(e) {
  message("Rendering failed: ", conditionMessage(e))
  quit(status = 1)
})

# Rename output if needed (rmarkdown uses the input basename)
expected_output <- file.path(output_dir, "index.html")
actual_output <- result
if (normalizePath(actual_output) != normalizePath(expected_output)) {
  file.rename(actual_output, expected_output)
}

cat(sprintf("\nDone: %s\n", expected_output))