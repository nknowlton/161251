#!/usr/bin/env Rscript
# Render the full Bookdown site from book/index.Rmd
#
# Usage:
#   Rscript scripts/render-book.R
#
# This script changes into the book/ directory and calls bookdown::render_book().
# It does not regenerate chapters, metadata, or YAML — those are committed files.
# Output is written to build/book/.

original_dir <- getwd()
on.exit(setwd(original_dir), add = TRUE)

repo_root <- getwd()
book_dir <- file.path(repo_root, "book")

if (!file.exists(file.path(book_dir, "_bookdown.yml"))) {
  stop("_bookdown.yml not found in book/. Are you running from the repo root?")
}

setwd(book_dir)

cat("Rendering full Bookdown site...\n")
result <- tryCatch({
  bookdown::render_book("index.Rmd")
}, error = function(e) {
  message("Bookdown render failed: ", conditionMessage(e))
  quit(status = 1)
})

output_path <- file.path(repo_root, "build", "book", "index.html")
cat(sprintf("\nDone: %s\n", output_path))