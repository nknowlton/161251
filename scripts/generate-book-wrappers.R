#!/usr/bin/env Rscript
# Generate Bookdown chapter wrapper files in book/ from course/lectures.csv.
#
# Usage:
#   Rscript scripts/generate-book-wrappers.R
#
# This script regenerates the tiny chapter wrapper .Rmd files in book/
# that include the canonical lecture body via a child document.
# Run this only when lectures are added, removed, or reordered.
# After running, commit the updated book/*.Rmd and book/_bookdown.yml files.

repo_root <- getwd()

meta <- read.csv(file.path(repo_root, "course", "lectures.csv"),
                 stringsAsFactors = FALSE, strip.white = TRUE)
meta <- meta[order(meta$LectureNo), ]

book_dir <- file.path(repo_root, "book")

for (i in seq_len(nrow(meta))) {
  no <- meta$LectureNo[i]
  slug <- meta$Slug[i]
  title <- meta$LectureTitle[i]
  fname <- sprintf("%02d-%s.Rmd", no, slug)
  body_file <- sprintf("../lecture-content/%s", fname)

  content <- sprintf(
    '# %s {%s}\n\n```{r %s-chapter-setup, include=FALSE}\nsource("../shared/setup.R")\n\nknitr::opts_chunk$set(\n  fig.path = "_main_files/figure-html/%s-",\n  cache.path = "../build/cache/book/%s/"\n)\n```\n\n```{r child-%s, child="%s"}\n```\n',
    title, slug, slug, slug, slug, slug, body_file
  )

  writeLines(content, file.path(book_dir, fname))
  cat("Generated book/", fname, "\n", sep = "")
}

# Regenerate _bookdown.yml
bd_lines <- c(
  'book_filename: "regression-modelling"',
  'output_dir: "../build/book"',
  'delete_merged_file: true',
  'new_session: true',
  '',
  'rmd_files:',
  '  - "index.Rmd"'
)
for (i in seq_len(nrow(meta))) {
  fname <- sprintf("%02d-%s.Rmd", meta$LectureNo[i], meta$Slug[i])
  bd_lines <- c(bd_lines, sprintf('  - "%s"', fname))
}

writeLines(bd_lines, file.path(book_dir, "_bookdown.yml"))
cat("\nGenerated book/_bookdown.yml with", nrow(meta), "chapters\n")