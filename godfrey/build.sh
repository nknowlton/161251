#!/bin/bash
# Build the 161.251 Regression Modelling course materials
# Usage:
#   ./build.sh          — full clean build (MakeFiles.R + bookdown)
#   ./build.sh serve    — start auto-rebuilding server (watches for changes)
#   ./build.sh quick    — skip MakeFiles.R, just rebuild bookdown

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ "$1" != "quick" ]; then
    echo "=== Step 1: Regenerating InClass and AsBook files from Content ==="
    cd "$SCRIPT_DIR"
    Rscript MakeFiles.R
fi

echo "=== Step 2: Building bookdown ==="
cd "$SCRIPT_DIR/AsBook"

if [ "$1" = "serve" ]; then
    echo "=== Starting live-reload server (http://127.0.0.1:4321) ==="
    Rscript -e 'bookdown::serve_book(dir = getwd(), output_dir = "Final", preview = TRUE)'
else
    Rscript -e 'bookdown::render_book("index.Rmd", output_format = "bookdown::gitbook")'
    mkdir -p Final/downloads
    cp ../InClass/Lecture*.Rmd Final/downloads/
    echo "=== Done! Output in AsBook/Final/ ==="
fi
