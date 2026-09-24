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
#   │   ├── slides/             (browser-based presentation HTML)
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

html_escape <- function(value) {
  value <- as.character(value)
  value <- gsub("&", "&amp;", value, fixed = TRUE)
  value <- gsub("<", "&lt;", value, fixed = TRUE)
  value <- gsub(">", "&gt;", value, fixed = TRUE)
  value <- gsub('"', "&quot;", value, fixed = TRUE)
  value
}

write_slide_index <- function(destination) {
  metadata_path <- file.path(repo_root, "course", "lectures.csv")
  if (!file.exists(metadata_path)) {
    message("  WARNING: course/lectures.csv not found; slide index not generated.")
    return(invisible())
  }

  meta <- read.csv(metadata_path, stringsAsFactors = FALSE, strip.white = TRUE)
  rows <- meta[tolower(trimws(meta$IncludeInSlides)) == "yes", , drop = FALSE]
  rows <- rows[order(rows$LectureNo), , drop = FALSE]
  links <- character()
  if (nrow(rows) > 0) {
    links <- vapply(seq_len(nrow(rows)), function(i) {
      no <- rows$LectureNo[i]
      slug <- rows$Slug[i]
      filename <- sprintf("%02d-%s.html", no, slug)
      sprintf(
        '      <li><a class="slide-link" href="%s/%s">Lecture %d: %s</a></li>',
        html_escape(slug), html_escape(filename), no,
        html_escape(rows$LectureTitle[i])
      )
    }, character(1))
  }

  content <- c(
    "<!doctype html>",
    '<html lang="en">',
    "  <head>",
    '    <meta charset="utf-8">',
    '    <meta name="viewport" content="width=device-width, initial-scale=1">',
    "    <title>161.251 Regression Modelling Slides</title>",
    "    <style>",
    "      :root { color: #20313b; background: #f5f1e8; font-family: Georgia, serif; }",
    "      body { box-sizing: border-box; max-width: 52rem; margin: 0 auto; padding: 4rem 1.5rem; }",
    "      h1 { font-size: clamp(2rem, 6vw, 3.5rem); line-height: 1; margin: 0; }",
    "      p { font-size: 1.15rem; line-height: 1.6; }",
    "      ul { display: grid; gap: 0.8rem; list-style: none; padding: 0; margin-top: 2rem; }",
    "      a { display: block; background: #1d5b63; color: #fff; padding: 1rem 1.25rem; text-decoration: none; font-size: 1.1rem; }",
    "      a:hover, a:focus { background: #133f45; }",
    "      .back { background: transparent; color: #1d5b63; padding-left: 0; font-size: 1rem; }",
    "    </style>",
    "  </head>",
    "  <body>",
    "    <p><a class=\"back\" href=\"../\">← Back to course homepage</a></p>",
    "    <h1>Regression Modelling Slides</h1>",
    "    <p>Browser-based presentation slides for lectures 25–35.</p>",
    "    <ul>",
    links,
    "    </ul>",
    "  </body>",
    "</html>"
  )
  writeLines(content, file.path(destination, "index.html"))
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

# 4. Rendered browser-based presentation slides
cat("  Copying rendered presentation slides...\n")
slides_out <- file.path(repo_root, "build", "slides")
slides_dest <- file.path(course_dir, "slides")
if (dir.exists(slides_out)) {
  copy_dir(slides_out, slides_dest)
} else {
  message("  WARNING: build/slides/ not found. Run scripts/render-slides.R all slidy first.")
  dir.create(slides_dest, recursive = TRUE, showWarnings = FALSE)
}
write_slide_index(slides_dest)

# 5. Data files
cat("  Copying data files...\n")
data_src <- file.path(repo_root, "data")
data_dest <- file.path(course_dir, "data")
copy_dir(data_src, data_dest)

# 6. Lab files
cat("  Rendering Lab 10 pages...\n")
source(file.path(repo_root, "scripts", "render-lab10.R"), local = TRUE)

cat("  Copying lab files...\n")
labs_src <- file.path(repo_root, "labs")
labs_dest <- file.path(course_dir, "labs")
copy_dir(labs_src, labs_dest)
copy_dir(file.path(repo_root, "build", "labs"), labs_dest)
required_lab_files <- c("lab10.Rmd", "lab10.html", "lab10-sols.Rmd", "lab10-sols.html")
missing_lab_files <- required_lab_files[!file.exists(file.path(labs_dest, required_lab_files))]
if (length(missing_lab_files) > 0) {
  stop("Missing published Lab 10 files: ", paste(missing_lab_files, collapse = ", "))
}

# 7. Resources (images, downloadable files)
cat("  Copying resources...\n")
res_src <- file.path(repo_root, "resources")
res_dest <- file.path(course_dir, "resources")
copy_dir(res_src, res_dest)

# 8. Lab landing page and rendered Quarto/OJS widget site
cat("  Copying lab landing page...\n")
labs_page <- file.path(repo_root, "site", "labs", "index.html")
if (file.exists(labs_page)) {
  labs_dest <- file.path(course_dir, "labs")
  dir.create(labs_dest, recursive = TRUE, showWarnings = FALSE)
  file.copy(labs_page, file.path(labs_dest, "index.html"), overwrite = TRUE)
}

cat("  Copying rendered interactive widgets...\n")
widget_build <- file.path(repo_root, "build", "widgets")
widget_dest <- file.path(course_dir, "widget")
if (dir.exists(widget_build)) {
  copy_dir(widget_build, widget_dest)
} else {
  widget_page <- file.path(repo_root, "site", "widget", "index.html")
  if (file.exists(widget_page)) {
    dir.create(widget_dest, recursive = TRUE, showWarnings = FALSE)
    file.copy(widget_page, file.path(widget_dest, "index.html"), overwrite = TRUE)
  } else {
    message("  WARNING: build/widgets not found and widget fallback is missing.")
  }
}

# 9. Downloadable self-contained student .Rmd files
cat("  Copying downloadable student .Rmd files...\n")
downloads_dir <- file.path(notes_dir, "downloads")
if (!dir.exists(downloads_dir)) dir.create(downloads_dir, recursive = TRUE)
student_rmd_dir <- file.path(repo_root, "build", "student-lectures")
if (dir.exists(student_rmd_dir)) {
  student_rmd <- list.files(student_rmd_dir, pattern = "[.]Rmd$",
                            full.names = TRUE)
  for (f in student_rmd) {
    file.copy(f, file.path(downloads_dir, basename(f)), overwrite = TRUE)
  }
} else {
  message("  WARNING: build/student-lectures/ not found. Run scripts/generate-student-rmd.R first.")
}

cat("\nSite assembled in:", site_dir, "\n")
cat("Course entry point:", file.path(course_dir, "index.html"), "\n")
