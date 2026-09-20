#!/usr/bin/env Rscript
# Validate the 161.251 course repository structure.
#
# Usage:
#   Rscript scripts/validate-course.R
#
# Exits with status 1 if any validation check fails.

repo_root <- getwd()
errors <- character()
warnings <- character()

add_error <- function(msg) errors <<- c(errors, msg)
add_warning <- function(msg) warnings <<- c(warnings, msg)

# ---------------------------------------------------------------------------
# 1. Metadata file exists and parses
# ---------------------------------------------------------------------------
meta_path <- file.path(repo_root, "course", "lectures.csv")
if (!file.exists(meta_path)) {
  add_error("course/lectures.csv not found")
  quit(status = 1)
}

meta <- tryCatch(
  read.csv(meta_path, stringsAsFactors = FALSE, strip.white = TRUE),
  error = function(e) {
    add_error(paste("Failed to parse course/lectures.csv:", conditionMessage(e)))
    data.frame()
  }
)

if (nrow(meta) == 0) {
  add_error("course/lectures.csv is empty or failed to parse")
  quit(status = 1)
}

# ---------------------------------------------------------------------------
# 2. Required metadata columns exist
# ---------------------------------------------------------------------------
required_cols <- c(
  "LectureNo", "Week", "LectureTitle", "Slug", "Presenter",
  "IncludeInBook", "IncludeInSlides"
)
missing_cols <- setdiff(required_cols, names(meta))
if (length(missing_cols) > 0) {
  add_error(paste("Missing required columns in lectures.csv:",
                  paste(missing_cols, collapse = ", ")))
}

# ---------------------------------------------------------------------------
# 3. Lecture numbers are unique
# ---------------------------------------------------------------------------
if (any(duplicated(meta$LectureNo))) {
  dups <- meta$LectureNo[duplicated(meta$LectureNo)]
  add_error(paste("Duplicate LectureNo values:", paste(unique(dups), collapse = ", ")))
}

# ---------------------------------------------------------------------------
# 4. Slugs are unique
# ---------------------------------------------------------------------------
if (any(duplicated(meta$Slug))) {
  dups <- meta$Slug[duplicated(meta$Slug)]
  add_error(paste("Duplicate Slug values:", paste(unique(dups), collapse = ", ")))
}

# ---------------------------------------------------------------------------
# Helper: build expected filenames
# ---------------------------------------------------------------------------
meta$Filename <- sprintf("%02d-%s.Rmd", meta$LectureNo, meta$Slug)

# ---------------------------------------------------------------------------
# 5. All expected lecture files exist (lecture-content/, lectures/, book/, slides/)
# ---------------------------------------------------------------------------
for (i in seq_len(nrow(meta))) {
  fname <- meta$Filename[i]
  for (dir_name in c("lecture-content", "lectures", "book")) {
    fpath <- file.path(repo_root, dir_name, fname)
    if (!file.exists(fpath)) {
      add_error(paste("Missing file:", file.path(dir_name, fname)))
    }
  }
  if (tolower(trimws(meta$IncludeInSlides[i])) == "yes") {
    fpath <- file.path(repo_root, "slides", fname)
    if (!file.exists(fpath)) {
      add_error(paste("Missing file:", file.path("slides", fname)))
    }
  }
}

# ---------------------------------------------------------------------------
# 6. No unregistered lecture files exist
# ---------------------------------------------------------------------------
for (dir_name in c("lecture-content", "lectures", "book", "slides")) {
  dir_path <- file.path(repo_root, dir_name)
  rmd_files <- list.files(dir_path, pattern = "\\.Rmd$", full.names = FALSE)
  # Exclude index.Rmd in book/
  if (dir_name == "book") {
    rmd_files <- setdiff(rmd_files, "index.Rmd")
  }
  expected <- meta$Filename
  if (dir_name == "slides") {
    expected <- meta$Filename[tolower(trimws(meta$IncludeInSlides)) == "yes"]
  }
  extra <- setdiff(rmd_files, expected)
  if (length(extra) > 0) {
    add_error(paste("Unregistered .Rmd files in", dir_name, ":",
                    paste(extra, collapse = ", ")))
  }
}

# ---------------------------------------------------------------------------
# 7. All Bookdown wrapper files exist (already checked in step 5 for book/)
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# 8. rmd_files order matches LectureNo
# ---------------------------------------------------------------------------
bookdown_path <- file.path(repo_root, "book", "_bookdown.yml")
if (file.exists(bookdown_path)) {
  bd_lines <- readLines(bookdown_path)
  rmd_entries <- grep('^\\s*-\\s+"', bd_lines, value = TRUE)
  rmd_entries <- sub('^\\s*-\\s+"', '', rmd_entries)
  rmd_entries <- sub('"\\s*$', '', rmd_entries)
  # Exclude index.Rmd
  rmd_entries <- setdiff(rmd_entries, "index.Rmd")

  expected_order <- meta$Filename[order(meta$LectureNo)]
  if (!identical(rmd_entries, expected_order)) {
    add_error("rmd_files order in _bookdown.yml does not match LectureNo order")
  }
}

# ---------------------------------------------------------------------------
# 9. All child document paths resolve
# ---------------------------------------------------------------------------
for (i in seq_len(nrow(meta))) {
  fname <- meta$Filename[i]
  slug <- meta$Slug[i]
  no <- meta$LectureNo[i]

  # Check lectures/ wrapper has a valid child path
  lec_file <- file.path(repo_root, "lectures", fname)
  if (file.exists(lec_file)) {
    content <- readLines(lec_file, warn = FALSE)
    child_match <- grep('child\\s*=\\s*"([^"]+)"', content, value = TRUE)
    if (length(child_match) > 0) {
      child_path <- sub('.*child\\s*=\\s*"([^"]+)".*', '\\1', child_match[1])
      # Resolve relative to lectures/
      resolved <- normalizePath(file.path(repo_root, "lectures", child_path),
                                mustWork = FALSE)
      if (!file.exists(resolved)) {
        add_error(paste("Broken child path in", fname, ":", child_path))
      }
    }
  }

  # Check book/ wrapper has a valid child path
  book_file <- file.path(repo_root, "book", fname)
  if (file.exists(book_file)) {
    content <- readLines(book_file, warn = FALSE)
    child_match <- grep('child\\s*=\\s*"([^"]+)"', content, value = TRUE)
    if (length(child_match) > 0) {
      child_path <- sub('.*child\\s*=\\s*"([^"]+)".*', '\\1', child_match[1])
      # Resolve relative to book/
      resolved <- normalizePath(file.path(repo_root, "book", child_path),
                                mustWork = FALSE)
      if (!file.exists(resolved)) {
        add_error(paste("Broken child path in book/", fname, ":", child_path))
      }
    }
  }
}

# ---------------------------------------------------------------------------
# 10. All referenced local data files resolve where practical
# ---------------------------------------------------------------------------
data_dir <- file.path(repo_root, "data")
for (i in seq_len(nrow(meta))) {
  fname <- meta$Filename[i]
  body_file <- file.path(repo_root, "lecture-content", fname)
  if (file.exists(body_file)) {
    content <- paste(readLines(body_file, warn = FALSE), collapse = "\n")
    # Find read.csv/read_csv/embed_file references
    refs <- regmatches(content, gregexpr(
      '(?:read\\.csv|read_csv|read\\.table|read\\.delim|embed_file)\\s*\\(?\\s*["\']([^"\']+)["\']',
      content
    ))[[1]]
    for (ref in refs) {
      path <- sub('.*["\']([^"\']+)["\'].*', '\\1', ref)
      # Skip URLs
      if (grepl("^https?://", path)) next
      # Skip bare filenames (not path-like) — these are display-only in eval=-1 chunks
      if (!grepl("/", path)) next
      # Resolve relative to lecture-content/
      resolved <- normalizePath(file.path(repo_root, "lecture-content", path),
                                 mustWork = FALSE)
      if (!file.exists(resolved)) {
        add_warning(paste("Data file not found:", path, "in", fname))
      }
    }
  }
}

# ---------------------------------------------------------------------------
# 11. No tracked generated output inside canonical source directories
# ---------------------------------------------------------------------------
for (dir_name in c("lecture-content", "lectures", "book", "slides")) {
  tracked_files <- tryCatch(
    system2("git", c("ls-files", "--", dir_name), stdout = TRUE, stderr = FALSE),
    error = function(e) character()
  )
  # Local Knit previews are allowed. Only committed generated files are errors.
  html_files <- tracked_files[grepl("\\.html$", tracked_files)]
  cache_dirs <- tracked_files[grepl("cache|_files|_main_files", tracked_files)]
  if (length(html_files) > 0) {
    add_error(paste("HTML files found in source directory", dir_name, ":",
                    paste(head(html_files, 5), collapse = ", ")))
  }
  if (length(cache_dirs) > 0) {
    add_error(paste("Cache/figure dirs found in source directory", dir_name, ":",
                    paste(head(cache_dirs, 5), collapse = ", ")))
  }
}

# ---------------------------------------------------------------------------
# 12. No duplicate chunk labels within a standalone lecture
# ---------------------------------------------------------------------------
extract_chunk_labels <- function(file_path) {
  if (!file.exists(file_path)) return(character())
  content <- paste(readLines(file_path, warn = FALSE), collapse = "\n")
  # Match ```{r label, ...} or ```{r label}
  matches <- regmatches(content, gregexpr('```\\{r\\s+([^,}\\s]+)', content))[[1]]
  if (length(matches) == 0) return(character())
  sub('```\\{r\\s+', '', matches)
}

for (i in seq_len(nrow(meta))) {
  fname <- meta$Filename[i]
  # Check lecture-content/ body
  body_file <- file.path(repo_root, "lecture-content", fname)
  if (file.exists(body_file)) {
    labels <- extract_chunk_labels(body_file)
    dups <- labels[duplicated(labels)]
    if (length(dups) > 0) {
      add_warning(paste("Duplicate chunk labels in", fname, ":",
                        paste(unique(dups), collapse = ", ")))
    }
  }
}

# ---------------------------------------------------------------------------
# 13. No duplicate chunk labels after Bookdown chapter is assembled
# ---------------------------------------------------------------------------
for (i in seq_len(nrow(meta))) {
  fname <- meta$Filename[i]
  slug <- meta$Slug[i]
  # The chapter wrapper adds a setup chunk and a child chunk
  wrapper_file <- file.path(repo_root, "book", fname)
  body_file <- file.path(repo_root, "lecture-content", fname)
  if (file.exists(wrapper_file) && file.exists(body_file)) {
    wrapper_labels <- extract_chunk_labels(wrapper_file)
    body_labels <- extract_chunk_labels(body_file)
    all_labels <- c(wrapper_labels, body_labels)
    dups <- all_labels[duplicated(all_labels)]
    if (length(dups) > 0) {
      add_warning(paste("Duplicate chunk labels in assembled chapter", fname, ":",
                        paste(unique(dups), collapse = ", ")))
    }
  }
}

# ---------------------------------------------------------------------------
# 14. Figure paths are lecture-specific (in lecture wrappers)
# ---------------------------------------------------------------------------
for (i in seq_len(nrow(meta))) {
  fname <- meta$Filename[i]
  slug <- meta$Slug[i]
  lec_file <- file.path(repo_root, "lectures", fname)
  if (file.exists(lec_file)) {
    content <- paste(readLines(lec_file, warn = FALSE), collapse = "\n")
    if (!grepl(paste0("lecture_slug\\s*<-\\s*\"", slug, "\""), content)) {
      add_error(paste("Missing or incorrect lecture_slug in", fname))
    }
    if (!grepl("fig\\.path", content)) {
      add_error(paste("Missing fig.path in lecture wrapper", fname))
    }
  }
}

# ---------------------------------------------------------------------------
# 15. Cache paths are lecture-specific
# ---------------------------------------------------------------------------
for (i in seq_len(nrow(meta))) {
  fname <- meta$Filename[i]
  slug <- meta$Slug[i]
  lec_file <- file.path(repo_root, "lectures", fname)
  if (file.exists(lec_file)) {
    content <- paste(readLines(lec_file, warn = FALSE), collapse = "\n")
    if (!grepl("cache\\.path", content)) {
      add_error(paste("Missing cache.path in lecture wrapper", fname))
    }
  }
}

# ---------------------------------------------------------------------------
# 16. Slide wrappers have valid output and child configuration
# ---------------------------------------------------------------------------
slide_rows <- which(tolower(trimws(meta$IncludeInSlides)) == "yes")
for (i in slide_rows) {
  fname <- meta$Filename[i]
  slug <- meta$Slug[i]
  slide_file <- file.path(repo_root, "slides", fname)
  if (!file.exists(slide_file)) next

  content <- paste(readLines(slide_file, warn = FALSE), collapse = "\n")
  if (!grepl("slidy_presentation", content, fixed = TRUE)) {
    add_error(paste("Missing Slidy output in slide wrapper", fname))
  }
  if (!grepl("beamer_presentation", content, fixed = TRUE)) {
    add_error(paste("Missing Beamer output in slide wrapper", fname))
  }
  if (!grepl("slide_level:[[:space:]]*2", content)) {
    add_error(paste("Slide level must be 2 in", fname))
  }
  if (!grepl(paste0("lecture_slug\\s*<-\\s*\"", slug, "\""), content)) {
    add_error(paste("Missing or incorrect lecture_slug in slide wrapper", fname))
  }
  if (!grepl("fig\\.path", content) || !grepl("cache\\.path", content)) {
    add_error(paste("Missing figure or cache path in slide wrapper", fname))
  }

  child_match <- grep('child\\s*=\\s*"([^"]+)"', readLines(slide_file), value = TRUE)
  if (length(child_match) == 0) {
    add_error(paste("Missing child path in slide wrapper", fname))
  } else {
    child_path <- sub('.*child\\s*=\\s*"([^"]+)".*', '\\1', child_match[1])
    resolved <- normalizePath(file.path(repo_root, "slides", child_path),
                              mustWork = FALSE)
    if (!file.exists(resolved)) {
      add_error(paste("Broken child path in slides/", fname, ": ", child_path, sep = ""))
    }
  }
}

# ---------------------------------------------------------------------------
# 17. Output directories excluded from version control
# ---------------------------------------------------------------------------
gitignore_path <- file.path(repo_root, ".gitignore")
if (file.exists(gitignore_path)) {
  gitignore <- paste(readLines(gitignore_path, warn = FALSE), collapse = "\n")
  if (!grepl("build/", gitignore)) {
    add_error("build/ not found in .gitignore")
  }
} else {
  add_error(".gitignore not found")
}

# ---------------------------------------------------------------------------
# 18. No absolute local filesystem paths committed
# ---------------------------------------------------------------------------
for (dir_name in c("lecture-content", "lectures", "book", "slides", "shared", "scripts")) {
  dir_path <- file.path(repo_root, dir_name)
  files <- list.files(dir_path, pattern = "\\.Rmd$|\\.R$|\\.yml$|\\.yaml$|\\.css$|\\.html$",
                      recursive = TRUE, full.names = TRUE)
  for (f in files) {
    # Skip this validation script itself (it contains path-checking patterns)
    if (basename(f) == "validate-course.R") next
    content <- readLines(f, warn = FALSE)
    # Check for /home/ or C:\ paths
    abs_matches <- grep("/home/|C:\\\\", content)
    if (length(abs_matches) > 0) {
      add_error(paste("Absolute path found in", f, "line", abs_matches[1]))
    }
  }
}

# ---------------------------------------------------------------------------
# 19. No case-sensitive path mismatch
# ---------------------------------------------------------------------------
data_files <- list.files(data_dir, pattern = "\\.csv$")
for (i in seq_len(nrow(meta))) {
  fname <- meta$Filename[i]
  body_file <- file.path(repo_root, "lecture-content", fname)
  if (file.exists(body_file)) {
    content <- paste(readLines(body_file, warn = FALSE), collapse = "\n")
    # Find data file references
    refs <- regmatches(content, gregexpr(
      '(?:read\\.csv|read_csv|embed_file)\\s*\\(?\\s*["\']([^"\']+)["\']',
      content
    ))[[1]]
    for (ref in refs) {
      path <- sub('.*["\']([^"\']+)["\'].*', '\\1', ref)
      if (grepl("^https?://", path)) next
      if (!grepl("/", path)) next
      basename_ref <- basename(path)
      # Check case-insensitive match
      matches <- data_files[tolower(data_files) == tolower(basename_ref)]
      exact <- data_files[data_files == basename_ref]
      if (length(matches) > 0 && length(exact) == 0) {
        add_error(paste("Case mismatch for", basename_ref, "in", fname,
                        "— file exists as", matches[1]))
      }
    }
  }
}

# ---------------------------------------------------------------------------
# 20. No broken course navigation links
# ---------------------------------------------------------------------------
header_files <- c(
  file.path(repo_root, "shared", "course-header.html"),
  file.path(repo_root, "shared", "book-header.html")
)
for (hf in header_files) {
  if (file.exists(hf)) {
    content <- paste(readLines(hf, warn = FALSE), collapse = "\n")
    # Check for expected links
    if (!grepl("/161251/", content)) {
      add_error(paste("Missing /161251/ link in", hf))
    }
    if (!grepl("/161251/notes/", content)) {
      add_error(paste("Missing /161251/notes/ link in", hf))
    }
  }
}

# ---------------------------------------------------------------------------
# 21. Interactive widget map and source pages are internally consistent
# ---------------------------------------------------------------------------
widget_map_path <- file.path(repo_root, "widgets", "lecture-map.json")
widget_labs_dir <- file.path(repo_root, "widgets", "labs")
if (!file.exists(widget_map_path)) {
  add_error("widgets/lecture-map.json not found")
} else if (!requireNamespace("jsonlite", quietly = TRUE)) {
  add_warning("jsonlite is not installed; interactive widget map was not parsed")
} else {
  widget_map <- tryCatch(
    jsonlite::fromJSON(widget_map_path, simplifyVector = FALSE),
    error = function(e) {
      add_error(paste("Failed to parse widgets/lecture-map.json:", conditionMessage(e)))
      NULL
    }
  )
  if (!is.null(widget_map)) {
    lab_ids <- names(if (is.null(widget_map$labs)) list() else widget_map$labs)
    if (length(lab_ids) == 0) add_error("Interactive widget map has no labs")
    for (lab_id in lab_ids) {
      page <- file.path(widget_labs_dir, paste0(lab_id, ".qmd"))
      if (!file.exists(page)) add_error(paste("Missing widget page:", file.path("widgets", "labs", basename(page))))
    }
    lecture_ids <- sprintf("%02d", meta$LectureNo)
    mapped_ids <- names(if (is.null(widget_map$lectures)) list() else widget_map$lectures)
    if (!identical(sort(mapped_ids), sort(lecture_ids))) {
      add_error("widgets/lecture-map.json lecture keys do not match course/lectures.csv")
    }
    for (lecture_id in intersect(mapped_ids, lecture_ids)) {
      entry <- widget_map$lectures[[lecture_id]]
      if (is.null(entry$lab) || !(entry$lab %in% lab_ids)) {
        add_error(paste("Lecture", lecture_id, "references an unknown widget lab"))
      }
      if (is.null(entry$mode) || !nzchar(entry$mode)) add_error(paste("Lecture", lecture_id, "has no widget mode"))
      if (is.null(entry$dataset) || !nzchar(entry$dataset)) add_error(paste("Lecture", lecture_id, "has no widget dataset"))
    }
  }
}

# ---------------------------------------------------------------------------
# 22. Deployment directory contains expected entry points (if it exists)
# ---------------------------------------------------------------------------
landing_path <- file.path(repo_root, "site", "index.html")
if (file.exists(landing_path) && any(tolower(trimws(meta$IncludeInSlides)) == "yes")) {
  landing_content <- paste(readLines(landing_path, warn = FALSE), collapse = "\n")
  if (!grepl('href="slides/"', landing_content, fixed = TRUE)) {
    add_error("site/index.html is missing the Slides link")
  }
}

site_dir <- file.path(repo_root, "build", "site")
if (file.exists(site_dir)) {
  if (!file.exists(file.path(site_dir, "index.html"))) {
    add_warning("build/site/index.html not found")
  }
  if (file.exists(file.path(repo_root, "build", "widgets")) &&
      !file.exists(file.path(site_dir, "161251", "widget", "index.html"))) {
    add_error("Rendered widgets were not assembled into build/site/161251/widget")
  }
  if (file.exists(file.path(repo_root, "build", "slides")) &&
      !file.exists(file.path(site_dir, "161251", "slides", "index.html"))) {
    add_error("Rendered slides were not assembled into build/site/161251/slides")
  }
}

# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------
cat("\n")
if (length(warnings) > 0) {
  cat("Warnings:\n")
  for (w in warnings) cat("  WARNING:", w, "\n")
}

if (length(errors) > 0) {
  cat("Errors:\n")
  for (e in errors) cat("  ERROR:", e, "\n")
  cat("\nValidation FAILED\n")
  quit(status = 1)
} else {
  cat("Validation passed\n")
  quit(status = 0)
}
