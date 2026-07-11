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
required_cols <- c("LectureNo", "Week", "LectureTitle", "Slug", "Presenter", "IncludeInBook")
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
# 5. All expected lecture files exist (lecture-content/, lectures/, book/)
# ---------------------------------------------------------------------------
for (i in seq_len(nrow(meta))) {
  fname <- meta$Filename[i]
  for (dir_name in c("lecture-content", "lectures", "book")) {
    fpath <- file.path(repo_root, dir_name, fname)
    if (!file.exists(fpath)) {
      add_error(paste("Missing file:", file.path(dir_name, fname)))
    }
  }
}

# ---------------------------------------------------------------------------
# 6. No unregistered lecture files exist
# ---------------------------------------------------------------------------
for (dir_name in c("lecture-content", "lectures", "book")) {
  dir_path <- file.path(repo_root, dir_name)
  rmd_files <- list.files(dir_path, pattern = "\\.Rmd$", full.names = FALSE)
  # Exclude index.Rmd in book/
  if (dir_name == "book") {
    rmd_files <- setdiff(rmd_files, "index.Rmd")
  }
  extra <- setdiff(rmd_files, meta$Filename)
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
# 11. No generated output inside canonical source directories
# ---------------------------------------------------------------------------
for (dir_name in c("lecture-content", "lectures", "book")) {
  dir_path <- file.path(repo_root, dir_name)
  # Check for HTML, cache, figure files
  html_files <- list.files(dir_path, pattern = "\\.html$", recursive = TRUE,
                           full.names = FALSE)
  cache_dirs <- list.dirs(dir_path, recursive = TRUE, full.names = FALSE)
  cache_dirs <- cache_dirs[grepl("cache|_files|_main_files", cache_dirs)]
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
# 16. Output directories excluded from version control
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
# 17. No absolute local filesystem paths committed
# ---------------------------------------------------------------------------
for (dir_name in c("lecture-content", "lectures", "book", "shared", "scripts")) {
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
# 18. No case-sensitive path mismatch
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
# 19. No broken course navigation links
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
# 20. Deployment directory contains expected entry points (if it exists)
# ---------------------------------------------------------------------------
site_dir <- file.path(repo_root, "build", "site")
if (file.exists(site_dir)) {
  if (!file.exists(file.path(site_dir, "index.html"))) {
    add_warning("build/site/index.html not found")
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