---
name: lab-editor
description: Design, audit, rewrite, and align university computer labs, workshops, practicals, and answer guides with their lectures using a self-contained Show, Follow, Independent teaching pattern. Use when asked to create or improve R/Quarto/R Markdown labs, map lab tasks to lecture objectives, combine or restructure weekly labs, improve practical flow, make instructions unambiguous, build student/guide pairs, simplify teaching code, or check whether a lab introduces material before it has been taught. Particularly suited to statistics, data science, coding, and quantitative teaching labs.
---

# Lab Editor

Build practical teaching material around a clear progression from demonstrated method to guided transfer to independent use. Treat the lab as a teaching document, not as a worksheet assembled from code fragments.

## Core workflow

1. Inspect the final lecture material for the week and enough neighbouring lectures to know prerequisites and handoffs.
2. State the lab's job in one sentence.
3. Inventory the core lecture capabilities that need practice.
4. Remove or defer material that belongs to a later lecture or week.
5. Choose the smallest useful set of datasets and examples.
6. Build each new method with the Show -> Follow -> Independent pattern.
7. Check that the lab is self-contained and that every required action is explicit.
8. Keep the student lab and answer guide aligned.
9. Run or otherwise verify code and numerical conclusions before finalising solutions.
10. After substantial revisions, inspect fences and chunk headers and knit both files. Keep unfinished student chunks knit-safe with `eval=FALSE` or valid runnable stubs.

When reviewing rather than editing, report the global alignment problem first, then missing practice, premature material, flow problems, and specific fixes.

## Show -> Follow -> Independent

Use this internally as the teaching architecture. It is not a visual template.

Do not normally expose headings such as `Instructor demonstration`, `Your turn`, or `Independent workflow` in the finished lab. Use question-driven headings that sound like the lecturer teaching the analysis.

### Show

Demonstrate a new idea or operation completely on one example.

A worked example should normally contain:

- enough context to understand the variables and units;
- an explicit action such as plot, fit, compare, calculate, or inspect;
- complete runnable code;
- a question to answer from the output;
- a short worked interpretation after the class has looked at the result.

Do not hide an action inside a discussion prompt.

### Follow

Repeat the same **logical block** on a closely matched example.

Choose the block at the level of the statistical reasoning, not the individual command. Do not alternate worked example and follow task after every plot, model fit, or test when those operations belong to one coherent comparison.

For example, if the teaching idea is comparing one common line, parallel lines, and separate lines, work through all three models on the first dataset, inspect and interpret the set, then repeat the whole three-model comparison on the second dataset.

If the teaching idea is candidate-model building, add and assess the full sequence of candidate predictors on the first dataset, make a model decision, then repeat the whole sequence on the second dataset.

If the teaching idea is diagnostics and repair, diagnose, revise, and re-check the first model as one block, then repeat that workflow on the second dataset.

The handoff from the worked example to the follow task must be visible. Do not rely on proximity or context to signal that responsibility has changed.

Use a small subheading or equally obvious transition such as:

```markdown
#### Repeat this for Auto MPG

Now plot mpg against weight, with origin shown by colour.
```

The follow task should:

- use the same method with a different variable, subgroup, or dataset;
- state the action explicitly;
- name the variables and object names when ambiguity is possible;
- provide a code stub only after the syntax has been shown;
- ask for interpretation as well as code;
- make it obvious where the worked example ends and the matched task begins.

Prefer:

```markdown
Now plot mpg against weight, with origin shown by colour.

Discuss: How does fuel economy vary with weight? Do the origin groups appear to have similar vertical positions and slopes?
```

Avoid:

```markdown
### Your turn

Repeat the previous analysis and discuss the results.
```

### Independent

After the method has been shown and followed, ask for a fuller workflow with less scaffolding.

The independent task must use only operations and concepts already demonstrated. Do not introduce a new package, model class, diagnostic, formula trick, or inferential concept inside the independent section.

## Action first, question second

Every practical question must say what to do before asking what the output means.

Use this pattern:

```text
Plot wage against age, with education shown by colour.

Discuss: How does wage vary with age? Do the education groups appear to have similar vertical positions and slopes?
```

Do not ask for interpretation of a graph or model that the lab has not explicitly told the class to create or fit.

Use `Discuss:` when a question is meant to be answered from the output. That is usually enough to distinguish discussion from action.

Do not rely on oral explanation to repair an incomplete written instruction.

## Voice

Write in the same direct, conversational lecturer voice as the lecture material. When the lecture-editor style guide is available, apply it to lab prose as well.

Use New Zealand spelling. Do not use em dashes.

Prefer natural live-teaching language:

- `Let's start by plotting...`
- `Let's fit three models.`
- `Discuss: What changed?`
- `Now ask the same question for the cars.`
- `Now repeat this with origin and weight.`

Avoid:

- `Instructor demonstration`;
- repeated `Your turn` headings;
- `Independent workflow` as a repeated heading;
- `The student should...`;
- `You should...`;
- `We will now...`;
- generic textbook summaries;
- prose that comments on the teaching design rather than teaching the statistics.

Use `Let's` naturally for lecturer-led actions. Do not force first-person phrasing into every paragraph.

## Self-contained lab rule

The lab must contain enough information to complete the work without reopening the lecture notes.

Include, at the point of use:

- the scientific or practical question;
- what one row represents;
- variable meanings and units;
- the minimal formula or definition needed;
- new syntax before it is used independently;
- how to read the relevant output;
- important limits on what can be concluded.

Links can add context, but essential reasoning stays in the lab.

## Dataset continuity

Prefer one coherent dataset for a lab or week when it can support the required concepts. Reusing one response while changing explanatory variables often improves flow.

Use a second dataset when it provides matched transfer or marks a genuine conceptual change.

When lectures use a strong running example, prefer a different but structurally similar lab dataset if transfer is important. Do not repeat the lecture analysis almost verbatim simply for familiarity.

## Live-teaching flow

Prefer question-driven sections over software-command sections.

Use the Markdown heading hierarchy to make the lab navigable:

- use `##` for the main statistical question or conceptual block;
- use `###` for each distinct task students need to complete;
- use `####` sparingly, only when a task genuinely needs a further visible subdivision;
- let Quarto or R Markdown build the table of contents from those headings rather than adding a manual contents list.

Headings should reflect coherent reasoning blocks rather than every command. Prefer headings such as `### Wage example: compare the three model structures`, `### Auto MPG: repeat the complete analysis`, `### Wage example: build a compact model`, and `### Auto MPG: repeat the model-building sequence`. Use `####` headings inside a block only when they clarify meaningful sub-comparisons such as `One common line`, `Parallel lines`, and `Separate lines`.

Do not use headings such as `Your turn` or `Instructor demonstration`.

Within a section, use:

**worked logical block -> interpretation or decision -> matched logical block on the parallel example**

A logical block may contain several actions, outputs, and discussion questions. Keep the class on one dataset until the block reaches a natural interpretation or decision point. Then hand over the whole matched block.

The heading tells students where they are; the prose tells them exactly what to do. Introduce each question when the relevant output is on screen. Do not alternate datasets after every individual plot, fit, test, or summary merely to preserve symmetry.

After several sections, reduce the scaffolding and finish with an integrated conclusion.

## Repeated reasoning routines

When several tasks share the same reasoning pattern, state the routine once and reuse it.

For diagnostics:

1. what pattern would be reassuring;
2. what is actually visible;
3. why the departure matters.

For model interpretation:

1. identify the quantity and units;
2. interpret sign and magnitude in context;
3. state what the result does not establish.

## Code should expose the statistics

Code supports the statistical reasoning. Prefer the simplest readable code that exposes the statistical operation.

Do not introduce machinery merely to make a polished figure or compact object.

### Keep statistical functions direct

Keep direct functions when they are already the clearest statement of the statistical task:

- `lm()`
- `anova()`
- `summary()`
- `predict()`
- `residuals()`
- standard `plot(model)` diagnostics

Tidy style should simplify the surrounding data work, not obscure the statistics.

### Prefer tidyverse for data work

When the course already uses tidyverse:

- prefer pipelines for data manipulation and plotting;
- avoid unnecessary dollar-sign extraction, manual indexing, loops, and helper functions;
- give important objects stable names;
- prefer local course data files to fragile external URLs;
- avoid duplicated code with no teaching purpose.

### Use observed-row predictions when sufficient

For fitted straight lines, prefer:

```r
data |>
  mutate(fitted = predict(model)) |>
  arrange(group, x) |>
  ggplot(aes(x = x, y = y, colour = group)) +
  geom_point() +
  geom_line(aes(y = fitted, group = group))
```

Do not build a synthetic prediction grid merely to draw the line:

```r
x_values <- seq(min(data$x), max(data$x), length.out = 100)

grid <- data |>
  group_by(group) |>
  summarise(x = list(seq(min(x), max(x), length.out = 100))) |>
  unnest(x)
```

Use a prediction grid only when the grid itself serves the teaching goal, such as predictions at specified values, extrapolation boundaries, smooth nonlinear curves, or a response surface.

### Prefer tidy model summaries when already available

If `broom` is already available and only model-level quantities are needed, prefer:

```r
bind_rows(
  m1 = broom::glance(m1),
  m2 = broom::glance(m2),
  .id = "model"
) |>
  select(model, adj.r.squared, sigma, AIC)
```

over:

```r
tibble(
  model = c("m1", "m2"),
  adjusted_R2 = c(summary(m1)$adj.r.squared, summary(m2)$adj.r.squared),
  residual_SE = c(sigma(m1), sigma(m2)),
  AIC = c(AIC(m1), AIC(m2))
)
```

Do not introduce `broom` solely for elegance if it has not appeared in the course and the base statistical code is already simple.

### Prefer simple residual pipelines

Use:

```r
data |>
  mutate(residual = residuals(model)) |>
  ggplot(aes(x = x, y = residual)) +
  geom_point() +
  geom_smooth(se = FALSE) +
  geom_hline(yintercept = 0)
```

Do not create residual vectors separately and merge them back by row number unless that operation is itself being taught.

## Output standards

- Show `summary()` at least once when learners need to recognise standard model output elsewhere.
- Prefer compact output once the reading skill has been demonstrated.
- Do not suppress warnings or messages indiscriminately.
- Use proper mathematical notation where supported.
- Keep chunk labels informative.
- Keep unfinished student chunks knit-safe.

## Lecture-to-lab alignment

Before editing a weekly lab, map the lecture capabilities to the lab.

Classify each capability as:

- core and must be practised;
- useful but lecture-only;
- deliberately deferred;
- legacy lab material to remove.

Do not turn the lab into a checklist containing every lecture detail.

If a lab teaches next week's method, push it forward rather than keeping it for historical reasons.

## Student lab and answer guide

Keep both files parallel.

Student version:

- complete code for worked examples;
- explicit actions and knit-safe stubs for matched tasks;
- discussion prompts visible;
- final synthesis substantially unfilled.

Answer guide:

- same order, models, variable names, and chunk labels where practical;
- every code stub completed;
- actual numerical results;
- concise interpretations in context.

After revising one file, check its pair for drift.

## Interpretation standards

Tie numerical answers to context and units.

Do not:

- confuse correlation with slope;
- claim diagnostics prove an assumption;
- interpret an intercept practically when zero is far outside the data without saying so;
- turn an observational association into a causal claim;
- claim in-sample fit establishes out-of-sample performance;
- treat influence cutoffs as automatic deletion rules.

## End-of-lab handoff

Finish with:

1. an integrated conclusion;
2. a boundary on what can currently be concluded;
3. one natural unresolved question that the next lecture or week answers.

Do not end on a raw code task.

## Supporting reference

Read `references/show-follow-pattern.md` when creating or substantially restructuring a lab. It records the 297.101 Week 10-12 pattern and the refinements learned from 161.251 Lab 10.
