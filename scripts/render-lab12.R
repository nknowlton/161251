#!/usr/bin/env Rscript
# Render the unified Lab 12 student and solution pages.
# Usage: Rscript scripts/render-lab12.R (from the repository root)

repo_root <- getwd()
output_dir <- file.path(repo_root, "build", "labs")
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)

for (name in c("lab12", "lab12-sols")) {
  input <- file.path(repo_root, "labs", paste0(name, ".Rmd"))
  cat("Rendering ", input, "\n", sep = "")
  rmarkdown::render(
    input = input,
    output_file = paste0(name, ".html"),
    output_dir = output_dir,
    envir = new.env(),
    quiet = TRUE
  )
}
