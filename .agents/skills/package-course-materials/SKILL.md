---
name: package-course-materials
description: Package specifically named lectures and labs as a source-only zip with the assets and data needed to reproduce them. Use when preparing course material for transfer or integration into another course site.
---

# Package Course Materials

Use this skill when Nick names the lectures and/or labs to package. Treat those identifiers as the scope; do not add neighbouring material.

## Choose source files

- Lectures: use the body files in `lecture-content/`. Do not package generated wrappers from `lectures/`, `book/`, or `slides/`.
- Labs: use the named source file or files in `labs/`. Include a paired solution only when Nick asks for solutions or names it.
- Keep the source files in a folder layout that preserves their existing relative paths.

## Include only reproduction dependencies

Trace each chosen source for referenced images, media, data files, and source assets. Include only the files needed to render or run that material:

- Include checked-in images and other static assets that the source references.
- Include CSV and other data files that code reads or embeds, including data stored under `resources/`.
- Keep code that generates figures in the source document. Do not include rendered HTML/PDF, build output, caches, or generated plot files that are recreated when the source is rendered.
- Include a separate asset-generation source only when it is required to regenerate an asset needed by the document.
- Do not copy whole `data/` or `resources/` directories when only a subset is used.

If a dependency is ambiguous or an external file is missing, resolve it from the repository when possible. If it cannot be resolved, state the missing dependency in the README and ask Nick only if it prevents a useful package.

## Build the hand-off zip

Create a zip in the repository workspace with a clear name based on the selected lecture and lab identifiers. Put the selected source files and their dependencies under one top-level folder, retaining repository-relative subfolders so paths such as `../data/` continue to make sense. Do not include repository templates or the packaging skill itself.

Add a concise `README.md` inside the zip with:

- the included lecture and lab sources;
- a short summary of material changes relevant to this hand-off;
- any source filename changes, written as `old-name → new-name`;
- extra R packages needed beyond the repository's shared setup;
- included CSV/data files and their uses, plus referenced image/assets.

Derive change notes and renames from the repository diff and relevant history when available. Distinguish required dependencies from files that are newly added, and do not claim a rename or content change without evidence. Mention when a package relies on the recipient's own setup or relative-path conventions.

Before finishing, inspect the zip listing and run `unzip -t` (or an equivalent archive integrity check). Confirm that every referenced static asset and data file is present. Do not render the course material or run unrelated tests unless Nick asks.

This skill only prepares a local archive. Do not email, upload, or otherwise send it unless Nick explicitly requests that action in the current conversation.
