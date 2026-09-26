# Lectures 28–35: prose review and implementation plan

Requested by Nick on 26 September 2026. Work directly on `main`.

## Scope and editorial standard

Polish the updated lectures in Nick's direct, conversational teaching voice. Preserve the lecture intentions, examples, sequence, mathematical depth and assessment scope. Leave good prose alone. Use natural prompts such as “Let's check…” where they introduce a real action. Replace vague diagnostic descriptions with a concrete observation and a proportionate judgement. Do not turn every sentence into a conversational prompt.

Use the lecture-editor, lecture-review-pipeline, lab-editor and nick-writing-style skills. Review technical meaning first, then continuity, then the relationship between prose and examples. Luna xhigh reviewers propose edits; the primary reviewer reads every proposed replacement before accepting it.

## Baseline

GitHub `main` was at `7da3a54` and did not contain the previously prepared updates. The earlier working copy contained the completed lecture and lab source revisions recorded in `remaining-lectures-handoff-2026-09-26.md`. These were recovered onto `main` before this review (`04acd64`, `de7f7e1`). The previous working copy was left intact. The prose-only review is measured against `de7f7e1`.

## Lecture-by-lecture plan

| Lecture | Teaching job to preserve | Targeted review |
|---|---|---|
| 28 | Move from manual model comparison to search and shrinkage. | Remove repeated narrator summaries; make search and validation explanations direct. Retain climate and Seoul. |
| 29 | Explain exact and near collinearity, coefficient precision and ridge. | Replace stiff diagnostic observations; retain the distinction between estimability, precision and prediction. |
| 30 | Explain inverse-variance weighting using grouped means and changing variance. | Clarify observations in the CPS5 and supervisors plots without strengthening diagnostic conclusions. Retain Seoul grouped summaries. |
| 31 | Explore nonlinear mean functions with LOESS and regression splines. | Remove abstract framing; make transitions and flexibility comparisons sound like live teaching. |
| 32 | Introduce time as a predictor, with trend and seasonal mean terms. | Replace teaching-design commentary and awkward diagnostic language. Preserve ski sales, outages and one-year limits. |
| 33 | Model seasonal shape using sine/cosine pairs and valid nested comparisons. | Shorten formal narration while preserving phase invariance and joint harmonic tests. |
| 34 | Diagnose dependence remaining after fitting the mean. | Use direct prompts and observations; keep diagnostic evidence distinct from proof of independence. |
| 35 | Fit regression with AR(1) errors using GLS. | Make the mean/error distinction and residual checks conversational, retaining uncertainty and temporal spacing. |

## Tasks

- [x] Locate current main and recover the earlier updated source.
- [x] Read repository instructions and the requested editorial skills.
- [x] Read all eight updated lectures and neighbouring Lecture 27.
- [x] Check the lecture-to-lab sequence and student/solution pairing.
- [x] Review technical meaning and record any remaining concerns.
- [x] Review every Luna suggestion; apply only worthwhile prose changes.
- [x] Read the edited lectures continuously and check that their voice and meaning remain coherent.
- [x] Verify executable chunks, equations, examples, headings and wrappers against the updated baseline.
- [x] Run available structural checks and inspect rendered output if the runtime permits.
- [x] Record validation limits and unresolved issues.
- [x] Commit and push the completed review on main.

## Lab 12 consolidation and assessment alignment

Nick clarified that Week 12 should have one student lab and one solution guide, covering the Lecture 31–35 sequence. Lab 11 already covers Lectures 28–30. Build `labs/lab12.Rmd` and `labs/lab12-sols.Rmd` from the revised 12A and 12B material, preserving the Seoul, tourism and Perth examples. Include flexible curves, time and seasonal mean models, dependence diagnostics and AR(1)/GLS. Match the final examination's emphasis on reading supplied output, distinguishing coefficient interpretation from prediction, comparing model specifications, and explaining a diagnostic–remedy–recheck decision. The final examination is in a separate restricted assessment repository; do not copy its questions or answers into public teaching materials.

The original Perth CSV was recovered from the historical Lab 12B's stated course-data URL and placed at `data/hp.csv` so the combined lab can execute locally. It contains quarterly observations from June 1986 to June 1997. Keep the explicit caveat that `WtAve` includes Perth.

- [x] Read the final exam blueprint and question coverage privately; map the relevant practical skills without duplicating assessed questions.
- [x] Recover and inspect the Perth dataset.
- [x] Consolidate 12A and 12B into one paired lab and solution guide; check every topic from Lectures 31–35.
- [x] Review all new lab prose against the lecturer voice and source examples.
- [x] Replace the public 12A/12B links and artefact expectations with Lab 12; configure both HTML pages for the site build.
- [x] Verify student and solution documents, data references and source links; leave figure and HTML review for the R-enabled build.

## Validation and review record

The edits preserve all eight lecture examples and concentrate on passages that were stiff, repetitive or technically imprecise. The corrected claims include the electricity conditional coefficients, the 13 CPS5 group means, the weighted residual formula, the distinct treatment of seasonal terms in a one-year series, and the limits of autocorrelation tests. Lab 11 now asks students to interpret a small difference in AIC, as the examination blueprint expects. Lab 12 covers the flexible mean, trend and Fourier terms, residual sequence diagnostics, and AR(1)/GLS through Seoul, tourism and Perth, ending with a new independent transfer exercise. The separate restricted examination was consulted only for coverage, and no question or marking content was copied.

Pandoc parsed all eight canonical lectures and both student/solution pairs for Labs 11 and 12. Chunk names are unique, code fences are balanced, referenced data files exist, and the Lab 12 pair has the same chunk names and order. Independent numerical checks used the bundled CSVs for climate search, electricity harmonic comparison, CPS5 grouped counts, Seoul consecutive dates and Fourier comparison, Perth coefficients, and the 180 monthly tourism and 45 quarterly Perth dates. `git diff --check` passed. Rscript and Quarto are unavailable locally, so execution of R chunks, full rendering and visual inspection remain to be checked by the GitHub Actions build after the push.
