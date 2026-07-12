#!/usr/bin/env Rscript
# Generate single-file, student-facing .Rmd files from canonical lecture content.
#
# Usage:
#   Rscript scripts/generate-student-rmd.R
#
# The generated files contain their YAML and setup code directly. Course data
# and images use published URLs, so students can download one .Rmd file and knit
# it without also recreating this repository's directory structure.

repo_root <- getwd()
metadata_file <- file.path(repo_root, "course", "lectures.csv")
template_file <- file.path(repo_root, "templates", "student-lecture.Rmd")
setup_file <- file.path(repo_root, "shared", "setup.R")
content_dir <- file.path(repo_root, "lecture-content")
out_dir <- file.path(repo_root, "build", "student-lectures")
course_url <- "https://knowlton.co.nz/161251"

required_files <- c(metadata_file, template_file, setup_file)
missing_files <- required_files[!file.exists(required_files)]
if (length(missing_files) > 0) {
  stop("Required file(s) not found: ", paste(missing_files, collapse = ", "))
}

metadata <- read.csv(metadata_file, stringsAsFactors = FALSE, strip.white = TRUE)
metadata <- metadata[order(metadata$LectureNo), ]
template <- readLines(template_file, warn = FALSE)
setup <- readLines(setup_file, warn = FALSE)

yaml_quote <- function(value) {
  value <- gsub("\\\\", "\\\\\\\\", value)
  value <- gsub('"', '\\\\"', value, fixed = TRUE)
  paste0('"', value, '"')
}

replace_line <- function(lines, marker, replacement) {
  location <- which(lines == marker)
  if (length(location) != 1) {
    stop("Template marker must occur exactly once: ", marker)
  }
  c(lines[seq_len(location - 1)], replacement, lines[-seq_len(location)])
}

rewrite_course_paths <- function(lines) {
  in_r_chunk <- FALSE

  for (i in seq_along(lines)) {
    starts_r_chunk <- grepl("^```[[:space:]]*\\{r(?:[ ,}])", lines[i], perl = TRUE)
    if (starts_r_chunk) in_r_chunk <- TRUE

    has_inline_r <- grepl("`r[[:space:]]", lines[i])
    has_markdown_asset <- grepl("\\]\\(\\.\\./(?:data|resources)/", lines[i],
                                perl = TRUE)

    if (in_r_chunk || has_inline_r || has_markdown_asset) {
      lines[i] <- gsub("../data/", paste0(course_url, "/data/"),
                       lines[i], fixed = TRUE)
      lines[i] <- gsub("../resources/", paste0(course_url, "/resources/"),
                       lines[i], fixed = TRUE)
      lines[i] <- gsub("xfun::embed_file", "student_embed_file",
                       lines[i], fixed = TRUE)
    }

    if (in_r_chunk && grepl("^```[[:space:]]*$", lines[i])) {
      in_r_chunk <- FALSE
    }
  }

  lines
}

if (dir.exists(out_dir)) {
  unlink(out_dir, recursive = TRUE)
}
dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)
cat(sprintf("Generating student .Rmd files in %s\n", out_dir))

for (i in seq_len(nrow(metadata))) {
  number <- metadata$LectureNo[i]
  slug <- metadata$Slug[i]
  title <- metadata$LectureTitle[i]
  filename <- sprintf("%02d-%s.Rmd", number, slug)
  content_file <- file.path(content_dir, filename)

  if (!file.exists(content_file)) {
    stop("Canonical lecture content not found: ", content_file)
  }

  content <- rewrite_course_paths(readLines(content_file, warn = FALSE))
  output <- template
  output <- replace_line(output, "@@TITLE@@", paste0("title: ", yaml_quote(title)))
  output <- replace_line(output, "@@SETUP@@", setup)
  output <- replace_line(output, "@@SLUG@@", paste0('lecture_slug <- "', slug, '"'))
  output <- replace_line(output, "@@CONTENT@@", content)

  writeLines(output, file.path(out_dir, filename))
  cat("  ", filename, "\n", sep = "")
}

cat(sprintf("Done. %d student .Rmd files written.\n", nrow(metadata)))
