---
name: lab-editor
description: Design, audit, rewrite, and align university computer labs, workshops, practicals, and answer guides with their lectures using a self-contained Show, Follow, Independent teaching pattern. Use when asked to create or improve R/Quarto/R Markdown labs, map lab tasks to lecture objectives, combine or restructure weekly labs, improve practical flow, make student instructions unambiguous, build student/guide pairs, or check whether a lab introduces material before it has been taught. Particularly suited to statistics, data science, coding, and quantitative teaching labs.
---

# Lab Editor

Build practical teaching material around a clear progression from demonstrated method to guided transfer to independent use. Treat the lab as a teaching document, not as a worksheet assembled from code fragments.

## Core workflow

1. Inspect the final lecture material for the week and enough neighbouring lectures to know prerequisites and handoffs.
2. State the lab's job in one sentence.
3. Inventory the core lecture capabilities students should practise.
4. Remove or defer lab material that belongs to a later lecture or week.
5. Choose the smallest useful set of datasets and examples.
6. Build each new method with the Show -> Follow -> Independent pattern.
7. Check that the lab is self-contained and that every student action is explicit.
8. Create or update the answer guide in lockstep with the student lab.
9. Run or otherwise verify code and numerical conclusions before finalising solutions.

When reviewing rather than editing, report the global alignment problem first, then missing practice, premature material, flow problems, and specific fixes. Do not lead with cosmetic edits.

## Show -> Follow -> Independent

Use this as the default lab architecture internally. It is a design rule, not a visual template. Do not normally expose headings such as `Instructor demonstration`, `Your turn`, or `Independent workflow` in the finished lab. Use question-driven headings that sound like the lecturer teaching the analysis.

### Show

Demonstrate a new idea or operation completely on one example.

A demonstration should normally include:

- the question being answered;
- enough context to understand the variables and units;
- complete runnable code;
- a short `What to look for` cue before interpretation;
- an explicit discussion question;
- a worked interpretation after students have looked at the output.

Label it clearly, for example:

```markdown
### Demonstration: engine-size model
```

Do not mix hidden student tasks into a demonstration. If students must calculate or write something, say so directly.

### Follow

Immediately ask students to repeat the same reasoning on a parallel example.

Label it clearly, for example:

```markdown
### Your turn: power model
```

A follow task should:

- use the same method with a different variable, subgroup, or closely matched question;
- name the variables and object names students should use;
- provide code stubs only after the syntax has been demonstrated;
- point to the exact demonstrated chunk or operation as the template when helpful;
- ask for interpretation as well as code.

Good code-stub comments are specific:

```r
# Use fit-engine-model as your template.
# Fit fuel_use_l_per_100km ~ power_kw and save it as power_model.
# Your code here
```

Avoid vague prompts such as `Repeat the analysis` when multiple interpretations are possible.

### Independent

After the method has been shown and followed, ask students to carry out a complete workflow on a third example with less scaffolding.

The independent task must use only operations and concepts already demonstrated. Do not introduce a new package, diagnostic, model class, formula trick, or inferential concept inside the independent section.

A strong independent section asks students to integrate several previously practised steps and finish with a substantive conclusion.

## Responsibility must be obvious

At every point, the required action must be explicit. State the action first, then give the question to answer from the resulting output.

Use `Discuss:` when a question is meant to be answered from the output. Do not add pedagogical labels around every block. Prefer patterns such as `Plot wage against age, with education shown by colour.` followed by `Discuss: How does wage vary with age? Do the education groups appear to have similar vertical positions and slopes?` If prose could plausibly be read as either an instruction or an explanation, rewrite it.

Do not rely on an instructor to verbally clarify missing instructions.

## Self-contained lab rule

The lab must contain enough information for a student to complete it without reopening the lecture notes.

Include, at the point of use:

- the scientific or practical question;
- variable meanings and units;
- the minimal formula or definition needed for the task;
- the R function or syntax before students must use it;
- the interpretation rule students need;
- any important limits on what can be concluded.

Links to lectures or external sources can add context, but must not be the only place an essential explanation lives.

Do not write `See Lecture X for what this means` when the concept is required to complete the lab. Give the short explanation in the lab, then optionally link back.

## Dataset continuity

Prefer one coherent dataset for a lab or week when it can support the required concepts. Reusing one response while changing explanatory variables often improves flow because students spend less time relearning context.

Use a second dataset only when it marks a genuine conceptual change or the first dataset cannot demonstrate the method naturally.

When lectures use a strong running example, prefer a different but structurally similar lab dataset if transfer is an important learning goal. Do not repeat the lecture analysis almost verbatim merely for familiarity.

For every dataset, make the lab usable on its own:

- explain what one row represents;
- identify the source when relevant;
- define variables and units actually used;
- state important filtering or preprocessing;
- distinguish observational association from causation when necessary;
- keep the supplied local data file or reproducible preparation source with the course repository when possible.

## Just-in-time scaffolding

Introduce an operation immediately before it is needed, then use it repeatedly.

Examples:

- demonstrate `lm()` before asking students to fit a model;
- demonstrate `coef()` before asking them to extract slopes;
- demonstrate `augment()` before asking them to work with `.fitted` and `.resid`;
- show the meaning of a confidence interval before asking students to construct another one;
- show one diagnostic plot and its reading routine before asking students to recreate the equivalent plot for a parallel model.

Do not front-load a page of syntax that will not be used until much later.

## Repeated reasoning routines

When several tasks share the same reasoning pattern, state the routine once and reuse it.

For model diagnostics, a strong default routine is:

1. state what pattern would support the assumption;
2. describe what is actually visible;
3. judge why the departure matters for inference or prediction.

For model interpretation, a useful routine is:

1. identify the quantity and its units;
2. interpret its sign and magnitude in context;
3. state what the result does not establish.

Make repeated questions feel structurally familiar while varying the data or substantive interpretation.

## Lab flow

Prefer a question-driven structure over a software-command structure.

Good section headings ask what students are trying to learn, for example:

- `How large is the association?`
- `How uncertain is that estimate?`
- `What can we predict for another observation?`
- `What patterns does the straight line miss?`

Avoid organising the whole lab around functions such as `lm()`, `summary()`, `predict()`, and `plot()` unless the function itself is the learning objective.

Within a section, prefer the live-teaching sequence:

**explicit action -> output -> Discuss question -> short interpretation -> matched action on the parallel example**

After several sections, finish with an independent synthesis rather than another near-duplicate exercise.

## Lecture-to-lab alignment

Before editing a weekly lab, build a compact map:

| Lecture capability | Practised in lab? | Where? | Action |
|---|---|---|---|

Classify each capability as:

- core and must be practised;
- useful but lecture-only;
- deliberately deferred;
- legacy lab material to remove.

A lab should not become a checklist containing every lecture detail. Practise the capabilities students need to perform and interpret, not every caveat or derivation.

If a lab currently teaches next week's method, push it forward rather than keeping it for historical reasons.

If a later lab depends on an unstated prerequisite, add the smallest bridge needed before the advanced task. For example, show a factor-only model before expecting students to interpret a factor after adjustment if that simpler meaning has not yet been made concrete.

## Student lab and answer guide

When both are requested, maintain two parallel files.

### Student version

- Keep complete code for demonstrations.
- Leave explicit code stubs for `Your turn` tasks.
- Keep discussion prompts visible.
- Put demonstration answers in collapsible worked-interpretation callouts when the platform supports it.
- Leave the final independent task substantially unfilled.

### Answer guide

- Preserve the same conceptual order and questions.
- Fill every student code stub.
- Show actual numerical results and interpretations.
- Make worked interpretations visible.
- Do not create a separate analysis with different models or variable names.
- Keep student and guide chunk labels aligned where practical.

After revising one file, check its pair for drift.

## Code and output standards

Code supports the statistical reasoning. Prefer the simplest readable code that exposes the statistical operation. Do not introduce machinery merely to produce a polished figure or compact object.

Use complete, readable teaching code.

- Load required packages explicitly.
- Do not suppress warnings or messages indiscriminately. Suppress only known, irrelevant noise and have a reason.
- Give important objects stable names that are reused later.
- Prefer local course data files to fragile external URLs for required work.
- Keep data-preparation scripts or provenance when introducing new course datasets.
- Use chunk labels that communicate the operation and can be referenced by later instructions.
- Avoid duplicated code blocks with no teaching purpose.
- Prefer compact model output when students only need selected quantities.
- Show `summary()` when students are expected to recognise standard model summaries elsewhere, even if tidy output is also used.
- Use proper mathematical notation rather than decorative Unicode where the course format supports MathJax/LaTeX.
- Prefer tidyverse pipelines for data manipulation and plotting when the course already uses tidyverse.
- Keep the statistical functions themselves direct: `lm()`, `anova()`, `summary()`, `predict()`, `residuals()`, and standard `plot(model)` diagnostics are usually clearer than wrapping them in abstractions.
- Avoid manual prediction grids, `seq(min(...), max(...))`, list-columns, `crossing()`, or `unnest()` solely to draw fitted straight lines when predictions on observed rows are sufficient.
- Avoid repeated `---
name: lab-editor
description: Design, audit, rewrite, and align university computer labs, workshops, practicals, and answer guides with their lectures using a self-contained Show, Follow, Independent teaching pattern. Use when asked to create or improve R/Quarto/R Markdown labs, map lab tasks to lecture objectives, combine or restructure weekly labs, improve practical flow, make student instructions unambiguous, build student/guide pairs, or check whether a lab introduces material before it has been taught. Particularly suited to statistics, data science, coding, and quantitative teaching labs.
---

# Lab Editor

Build practical teaching material around a clear progression from demonstrated method to guided transfer to independent use. Treat the lab as a teaching document, not as a worksheet assembled from code fragments.

## Core workflow

1. Inspect the final lecture material for the week and enough neighbouring lectures to know prerequisites and handoffs.
2. State the lab's job in one sentence.
3. Inventory the core lecture capabilities students should practise.
4. Remove or defer lab material that belongs to a later lecture or week.
5. Choose the smallest useful set of datasets and examples.
6. Build each new method with the Show -> Follow -> Independent pattern.
7. Check that the lab is self-contained and that every student action is explicit.
8. Create or update the answer guide in lockstep with the student lab.
9. Run or otherwise verify code and numerical conclusions before finalising solutions.

When reviewing rather than editing, report the global alignment problem first, then missing practice, premature material, flow problems, and specific fixes. Do not lead with cosmetic edits.

## Show -> Follow -> Independent

Use this as the default lab architecture internally. It is a design rule, not a visual template. Do not normally expose headings such as `Instructor demonstration`, `Your turn`, or `Independent workflow` in the finished lab. Use question-driven headings that sound like the lecturer teaching the analysis.

### Show

Demonstrate a new idea or operation completely on one example.

A demonstration should normally include:

- the question being answered;
- enough context to understand the variables and units;
- complete runnable code;
- a short `What to look for` cue before interpretation;
- an explicit discussion question;
- a worked interpretation after students have looked at the output.

Label it clearly, for example:

```markdown
### Demonstration: engine-size model
```

Do not mix hidden student tasks into a demonstration. If students must calculate or write something, say so directly.

### Follow

Immediately ask students to repeat the same reasoning on a parallel example.

Label it clearly, for example:

```markdown
### Your turn: power model
```

A follow task should:

- use the same method with a different variable, subgroup, or closely matched question;
- name the variables and object names students should use;
- provide code stubs only after the syntax has been demonstrated;
- point to the exact demonstrated chunk or operation as the template when helpful;
- ask for interpretation as well as code.

Good code-stub comments are specific:

```r
# Use fit-engine-model as your template.
# Fit fuel_use_l_per_100km ~ power_kw and save it as power_model.
# Your code here
```

Avoid vague prompts such as `Repeat the analysis` when multiple interpretations are possible.

### Independent

After the method has been shown and followed, ask students to carry out a complete workflow on a third example with less scaffolding.

The independent task must use only operations and concepts already demonstrated. Do not introduce a new package, diagnostic, model class, formula trick, or inferential concept inside the independent section.

A strong independent section asks students to integrate several previously practised steps and finish with a substantive conclusion.

## Responsibility must be obvious

At every point, the required action must be explicit. State the action first, then give the question to answer from the resulting output.

Use `Discuss:` when a question is meant to be answered from the output. Do not add pedagogical labels around every block. Prefer patterns such as `Plot wage against age, with education shown by colour.` followed by `Discuss: How does wage vary with age? Do the education groups appear to have similar vertical positions and slopes?` If prose could plausibly be read as either an instruction or an explanation, rewrite it.

Do not rely on an instructor to verbally clarify missing instructions.

## Self-contained lab rule

The lab must contain enough information for a student to complete it without reopening the lecture notes.

Include, at the point of use:

- the scientific or practical question;
- variable meanings and units;
- the minimal formula or definition needed for the task;
- the R function or syntax before students must use it;
- the interpretation rule students need;
- any important limits on what can be concluded.

Links to lectures or external sources can add context, but must not be the only place an essential explanation lives.

Do not write `See Lecture X for what this means` when the concept is required to complete the lab. Give the short explanation in the lab, then optionally link back.

## Dataset continuity

Prefer one coherent dataset for a lab or week when it can support the required concepts. Reusing one response while changing explanatory variables often improves flow because students spend less time relearning context.

Use a second dataset only when it marks a genuine conceptual change or the first dataset cannot demonstrate the method naturally.

When lectures use a strong running example, prefer a different but structurally similar lab dataset if transfer is an important learning goal. Do not repeat the lecture analysis almost verbatim merely for familiarity.

For every dataset, make the lab usable on its own:

- explain what one row represents;
- identify the source when relevant;
- define variables and units actually used;
- state important filtering or preprocessing;
- distinguish observational association from causation when necessary;
- keep the supplied local data file or reproducible preparation source with the course repository when possible.

## Just-in-time scaffolding

Introduce an operation immediately before it is needed, then use it repeatedly.

Examples:

- demonstrate `lm()` before asking students to fit a model;
- demonstrate `coef()` before asking them to extract slopes;
- demonstrate `augment()` before asking them to work with `.fitted` and `.resid`;
- show the meaning of a confidence interval before asking students to construct another one;
- show one diagnostic plot and its reading routine before asking students to recreate the equivalent plot for a parallel model.

Do not front-load a page of syntax that will not be used until much later.

## Repeated reasoning routines

When several tasks share the same reasoning pattern, state the routine once and reuse it.

For model diagnostics, a strong default routine is:

1. state what pattern would support the assumption;
2. describe what is actually visible;
3. judge why the departure matters for inference or prediction.

For model interpretation, a useful routine is:

1. identify the quantity and its units;
2. interpret its sign and magnitude in context;
3. state what the result does not establish.

Make repeated questions feel structurally familiar while varying the data or substantive interpretation.

## Lab flow

Prefer a question-driven structure over a software-command structure.

Good section headings ask what students are trying to learn, for example:

- `How large is the association?`
- `How uncertain is that estimate?`
- `What can we predict for another observation?`
- `What patterns does the straight line miss?`

Avoid organising the whole lab around functions such as `lm()`, `summary()`, `predict()`, and `plot()` unless the function itself is the learning objective.

Within a section, prefer the live-teaching sequence:

**explicit action -> output -> Discuss question -> short interpretation -> matched action on the parallel example**

After several sections, finish with an independent synthesis rather than another near-duplicate exercise.

## Lecture-to-lab alignment

Before editing a weekly lab, build a compact map:

| Lecture capability | Practised in lab? | Where? | Action |
|---|---|---|---|

Classify each capability as:

- core and must be practised;
- useful but lecture-only;
- deliberately deferred;
- legacy lab material to remove.

A lab should not become a checklist containing every lecture detail. Practise the capabilities students need to perform and interpret, not every caveat or derivation.

If a lab currently teaches next week's method, push it forward rather than keeping it for historical reasons.

If a later lab depends on an unstated prerequisite, add the smallest bridge needed before the advanced task. For example, show a factor-only model before expecting students to interpret a factor after adjustment if that simpler meaning has not yet been made concrete.

## Student lab and answer guide

When both are requested, maintain two parallel files.

### Student version

- Keep complete code for demonstrations.
- Leave explicit code stubs for `Your turn` tasks.
- Keep discussion prompts visible.
- Put demonstration answers in collapsible worked-interpretation callouts when the platform supports it.
- Leave the final independent task substantially unfilled.

### Answer guide

- Preserve the same conceptual order and questions.
- Fill every student code stub.
- Show actual numerical results and interpretations.
- Make worked interpretations visible.
- Do not create a separate analysis with different models or variable names.
- Keep student and guide chunk labels aligned where practical.

After revising one file, check its pair for drift.

## Code and output standards

Code supports the statistical reasoning. Prefer the simplest readable code that exposes the statistical operation. Do not introduce machinery merely to produce a polished figure or compact object.

Use complete, readable teaching code.

- Load required packages explicitly.
- Do not suppress warnings or messages indiscriminately. Suppress only known, irrelevant noise and have a reason.
- Give important objects stable names that are reused later.
- Prefer local course data files to fragile external URLs for required work.
- Keep data-preparation scripts or provenance when introducing new course datasets.
- Use chunk labels that communicate the operation and can be referenced by later instructions.
- Avoid duplicated code blocks with no teaching purpose.
- Prefer compact model output when students only need selected quantities.
- Show `summary()` when students are expected to recognise standard model summaries elsewhere, even if tidy output is also used.
 extraction chains and hand-built summary tibbles when a simple tidy model summary is already available.
- If `broom` is already available, prefer `broom::glance()` with `bind_rows()` and `select()` for small model-comparison tables. Do not introduce `broom` solely for style if it has not appeared in the course.

### Fence and knit checks

After substantial lab revisions, check the edited fences and chunk headers, then knit both student
and solution `.Rmd` files. Keep unfinished student code chunks knit-safe, using `eval=FALSE` or a
valid runnable stub where appropriate. These checks target malformed fences and likely knit
failures; skip style lint unless requested.

## Interpretation standards

Every numerical answer should be tied to context and units.

Do not:

- confuse correlation with slope;
- claim that a near-zero mean residual establishes model adequacy;
- interpret an intercept practically when zero is far outside the data without saying so;
- turn an observational association into a causal claim;
- claim in-sample fit establishes out-of-sample performance;
- treat diagnostics or influence cutoffs as automatic pass/fail rules.

Where useful, add a `Scope of today's conclusion` box that states what students can now conclude and what remains for a later week.

## End-of-lab handoff

Finish by consolidating the week's capability and creating the next question in the course sequence.

A good ending contains:

1. a short integrated conclusion or independent interpretation;
2. a boundary on current inference;
3. one natural unresolved question that the next lecture/week answers.

Do not end on a raw code task.

## Voice

Write in the same direct, conversational lecturer voice as the lecture material. When the lecture-editor style guide is available, apply it to lab prose as well. Use New Zealand spelling and no em dashes.

Prefer natural live-teaching phrasing such as `Let's start by plotting...`, `Discuss: ...`, `Now ask the same question for...`, and `Let's fit three models.` Avoid `Instructor demonstration`, repeated `Your turn` headings, `The student should`, `You should`, and `We will now`.

Prefer:

- `What changed?`
- `What should you look for?`
- `Use the previous model as your template.`
- `Now repeat the same reasoning for...`
- `What can we conclude from these data?`

Avoid stilted textbook-summary prose, generic scene-setting, and instructions that merely narrate the code.

## Supporting reference

Read `references/show-follow-pattern.md` when creating or substantially restructuring a lab. It records the observed design pattern and review lessons from the 297.101 Week 10-12 workshops that motivated this skill.
