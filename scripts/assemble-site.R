#!/usr/bin/env Rscript
# Assemble the static deployment directory build/site/
#
# Usage:
#   Rscript scripts/assemble-site.R
#
# Assembles:
#   build/site/
#   ├── index.html              (course landing page)
#   ├── 161251/
#   │   ├── index.html          (redirect or copy of course landing)
#   │   ├── notes/              (full Bookdown output)
#   │   ├── lectures/           (standalone lecture HTML, if available)
#   │   ├── data/               (course datasets)
#   │   ├── labs/               (lab Rmd files)
#   │   └── resources/          (images and downloadable resources)
#
# The script does NOT delete unrelated course outputs.

repo_root <- getwd()

site_dir <- file.path(repo_root, "build", "site")
course_dir <- file.path(site_dir, "161251")

# Clean and recreate the site directory
if (dir.exists(site_dir)) {
  unlink(site_dir, recursive = TRUE)
}
dir.create(course_dir, recursive = TRUE)

copy_dir <- function(from, to, pattern = NULL) {
  if (!dir.exists(from)) {
    message("  Skipping (not found): ", from)
    return(invisible())
  }
  dir.create(to, recursive = TRUE, showWarnings = FALSE)
  files <- list.files(from, full.names = TRUE, recursive = TRUE)
  if (length(files) == 0) return(invisible())
  for (f in files) {
    rel <- file.path(to, substring(f, nchar(from) + 2))
    # Skip intermediate .md files from bookdown
    if (grepl("\\.md$", f) && !grepl("index\\.md$", f)) next
    # Skip RDS files
    if (grepl("\\.rds$", f)) next
    dest_dir <- dirname(rel)
    dir.create(dest_dir, recursive = TRUE, showWarnings = FALSE)
    file.copy(f, rel, overwrite = TRUE)
  }
  invisible()
}

cat("Assembling site in", site_dir, "\n")

# 1. Course landing page
cat("  Copying course landing page...\n")
landing <- file.path(repo_root, "site", "index.html")
if (file.exists(landing)) {
  file.copy(landing, file.path(site_dir, "index.html"), overwrite = TRUE)
  file.copy(landing, file.path(course_dir, "index.html"), overwrite = TRUE)
}

# 2. Bookdown notes
cat("  Copying Bookdown output to notes/...\n")
book_out <- file.path(repo_root, "build", "book")
notes_dir <- file.path(course_dir, "notes")
if (dir.exists(book_out)) {
  copy_dir(book_out, notes_dir)
} else {
  message("  WARNING: build/book/ not found. Run scripts/render-book.R first.")
}

# 3. Standalone lecture outputs (if available)
cat("  Copying standalone lecture outputs...\n")
lec_out <- file.path(repo_root, "build", "lectures")
lec_dest <- file.path(course_dir, "lectures")
if (dir.exists(lec_out)) {
  copy_dir(lec_out, lec_dest)
}

# 4. Data files
cat("  Copying data files...\n")
data_src <- file.path(repo_root, "data")
data_dest <- file.path(course_dir, "data")
copy_dir(data_src, data_dest)

# 5. Lab files
cat("  Copying lab files...\n")
labs_src <- file.path(repo_root, "labs")
labs_dest <- file.path(course_dir, "labs")
copy_dir(labs_src, labs_dest)

# 6. Resources (images, downloadable files)
cat("  Copying resources...\n")
res_src <- file.path(repo_root, "resources")
res_dest <- file.path(course_dir, "resources")
copy_dir(res_src, res_dest)

# 7. Lab and widget landing pages
cat("  Copying lab/widget landing pages...\n")
for (page in c("labs", "widget")) {
  src <- file.path(repo_root, "site", page, "index.html")
  if (file.exists(src)) {
    dest_dir <- file.path(course_dir, page)
    dir.create(dest_dir, recursive = TRUE, showWarnings = FALSE)
    file.copy(src, file.path(dest_dir, "index.html"), overwrite = TRUE)
  }
}

# 8. Downloadable lecture Rmd files
cat("  Copying downloadable lecture Rmd files...\n")
downloads_dir <- file.path(notes_dir, "downloads")
if (!dir.exists(downloads_dir)) dir.create(downloads_dir, recursive = TRUE)
lec_rmd <- list.files(file.path(repo_root, "lectures"), pattern = "\\.Rmd$",
                      full.names = TRUE)
for (f in lec_rmd) {
  file.copy(f, file.path(downloads_dir, basename(f)), overwrite = TRUE)
}

cat("\nSite assembled in:", site_dir, "\n")
cat("Course entry point:", file.path(course_dir, "index.html"), "\n")