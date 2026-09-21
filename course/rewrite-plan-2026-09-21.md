# Temporary rewrite plan: Lectures 26–30

This is a working record for the staged rewrite discussed on 21 September 2026. It is temporary planning material, not part of the course content. The source discussion is preserved in [`plan sept 21 2.md`](../plan%20sept%2021%202.md).

## Status and sequence

- [x] **Lecture 25: General linear models** — completed and already delivered.
- [ ] **Lecture 26: Model comparison** — prespecified nested models and partial F tests.
- [ ] **Lecture 27: Variable selection** — modelling goals, model terms, AIC and introductory cross-validation.
- [ ] **Lecture 28: Automated selection and penalisation** — selection algorithms, ridge and lasso in practice, and cross-validated complexity control.
- [ ] **Lecture 29: Multicollinearity and ridge** — overlapping predictors, instability, and ridge/lasso theory.
- [ ] **Lecture 30: Weighted regression** — unequal variance and unequal information.
- [ ] **After Lectures 26–30: labs** — map stable learning objectives to lab tasks.

Lecture 25 has no outstanding active rewrite tasks in this plan. Its deferred suggestion is recorded separately in [`future-lecture-updates.md`](future-lecture-updates.md).

## Intended redistribution

The later redistribution in the source discussion is the current direction:

- Move AIC and the conceptual basis of cross-validation into Lecture 27.
- Keep Lecture 28 focused on automated search and practical penalisation, using the AIC and cross-validation ideas introduced in Lecture 27.
- Move the orthogonal ridge/lasso mathematics and related geometric explanation into Lecture 29, where they support the discussion of overlapping predictors.

These allocations guide the staged work but do not settle the open teaching choices listed below.

## Stage 1: Lecture 26 — model comparison

Core job: compare prespecified nested models using partial F tests.

- [ ] Build the nesting lattice for the main factor-plus-covariate models.
- [ ] Put the fitted-line visual before the ANOVA output and pair each visual change with its null hypothesis.
- [ ] Use a focused comparison table containing model, formula, parameter count, residual degrees of freedom and RSS.
- [ ] Remove AIC and BIC from the Lecture 26 model-summary table.
- [ ] Explain RSS reduction and the partial F statistic, including the one-degree-of-freedom relationship \(F=t^2\).
- [ ] Add a compact bridge from orthogonal to non-orthogonal designs and explain why explicit reduced/full comparisons are useful.
- [ ] Check the learning objectives, including whether centring belongs here.
- [ ] Check technical correctness, conceptual flow, visuals/examples and rendering.

Open choices for discussion: how much Type I/II/III terminology to include; whether centring should be added to Lecture 25 in a future offering or removed from Lecture 26 objectives; whether the existing case studies need trimming.

## Stage 2: Lecture 27 — variable selection

Core job: move from one prespecified comparison to choosing among plausible models.

- [ ] Introduce inference/explanation, prediction and description as different modelling goals.
- [ ] Explain that model terms, meaningful factors and hierarchy should be selected rather than arbitrary dummy coefficients.
- [ ] Cover bias–variance, adjusted \(R^2\), residual standard error and coefficient changes with technically correct formulas.
- [ ] Introduce AIC as a model-selection criterion.
- [ ] Introduce cross-validation conceptually as an estimate of out-of-sample prediction error.
- [ ] Qualify any discussion of p-value-based inclusion and omitted-variable bias.
- [ ] Check technical correctness, conceptual flow, visuals/examples and rendering.

Open choices for discussion: the balance among inference, prediction and description; how much cross-validation detail belongs here before Lecture 28; the preferred order of the selection criteria.

## Stage 3: Lecture 28 — automated selection and penalisation

Core job: automate complexity decisions and introduce shrinkage as an alternative to discrete selection.

- [ ] Cover forward, backward and stepwise selection, referring back to AIC from Lecture 27.
- [ ] Introduce ridge and lasso at the level of penalising coefficient magnitude.
- [ ] Show that ridge shrinks coefficients while lasso can also set coefficients to zero.
- [ ] Use `cv.glmnet()` only after explaining the validation logic; distinguish `lambda.min` and `lambda.1se`.
- [ ] Replace the current training-MSE horse race with a common out-of-sample or cross-validation comparison.
- [ ] Move detailed orthogonal-case algebra, soft-thresholding and penalty geometry to Lecture 29 unless review shows a specific reason to retain them here.
- [ ] Check technical correctness, conceptual flow, visuals/examples and rendering.

Open choices for discussion: how much selection-algorithm detail to retain; whether penalty geometry is needed at all; which common resampling example best supports the comparison.

## Stage 4: Lecture 29 — multicollinearity and ridge

Core job: explain how overlapping predictors affect coefficient estimates and why shrinkage can help.

- [ ] Distinguish exact collinearity (rank deficiency) from near multicollinearity (large coefficient variances).
- [ ] State explicitly that multicollinearity does not itself bias OLS estimates; it makes individual coefficients unstable or imprecise.
- [ ] Explain VIF in that context and avoid treating correlation as an automatic reason to remove a predictor.
- [ ] Relocate and motivate the orthogonal ridge result and, if retained, the lasso geometry.
- [ ] Explain how correlated predictors compete to explain overlapping information.
- [ ] Check the Seoul example and its interpretation.
- [ ] Check technical correctness, conceptual flow, visuals/examples and rendering.

Open choices for discussion: the depth of ridge/lasso derivations; whether to include penalty geometry; which multicollinearity diagnostics are essential at this level.

## Stage 5: Lecture 30 — weighted regression

Core job: shift from changing the mean structure to modelling unequal error variance or precision.

- [ ] Open with the distinction between changing the mean model and changing the error/information structure.
- [ ] Teach \(w_i \propto 1/\operatorname{Var}(Y_i)\) as the fundamental rule.
- [ ] Derive sample-size weighting from \(\operatorname{Var}(\bar Y_i)=\sigma^2/n_i\).
- [ ] Distinguish sample-size weighting from inverse-variance weighting, including \(w_i \propto n_i/\sigma_i^2\) when group variances differ.
- [ ] Make the assumptions behind each weighting choice explicit.
- [ ] Check technical correctness, conceptual flow, visuals/examples and rendering.

Open choices for discussion: how much of the existing CPS5 and meta-analysis material to retain; which weighting case should anchor the lecture.

## Later lab pass

- [ ] Wait until Lectures 26–30 are stable.
- [ ] Map each core learning objective to at least one lab task.
- [ ] Check that lab exercises reinforce the distinction between prespecified tests, model selection, prediction, multicollinearity and variance weighting.

## Review convention

For each active stage, use three passes in order: technical correctness, conceptual flow, then visuals/examples. Render the relevant lecture or slides after substantive edits. Record completion notes here as the work proceeds.
