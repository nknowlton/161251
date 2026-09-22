# Show -> Follow -> Independent reference

This reference records the reusable teaching pattern observed in the revised 297.101 Week 10-12 regression workshops and the associated upstream review discussion.

## Source pattern

### Week 10: relationships and first linear models

The workshop keeps one vehicle dataset throughout and repeats the same sequence across predictors.

For each new operation:

1. **Demonstration: engine size**
   - complete plot or model code;
   - `What to look for` cue;
   - `Discuss` prompt;
   - collapsed `Worked interpretation`.
2. **Your turn: engine power**
   - same operation on a matched predictor;
   - explicit target variable and object names;
   - comments such as `Use fit-engine-model as your template`.
3. **Independent workflow: gross vehicle mass**
   - students repeat the full workflow with much less scaffolding;
   - no method appears here that was not already demonstrated.

The independent workflow integrates exploration, model fitting, coefficient interpretation, residual inspection, and comparison rather than introducing another new command.

The lab ends with a `Scope of today's conclusion` box that explicitly defers confidence intervals, hypothesis tests, and future-observation intervals to Week 11.

### Week 11: inference and prediction

The lab states the teaching contract at the top:

- each new method is demonstrated using poverty rate;
- students then complete `Your turn` using median income;
- demonstrations are run and discussed before answers are opened;
- the demonstration is the template for the parallel task.

This structure repeats for:

- exploration;
- coefficient interpretation;
- confidence intervals;
- p-values;
- R-squared;
- point prediction;
- confidence and prediction intervals.

The week ends with an independent written interpretation that integrates the week's numerical results and limitations.

### Week 12: assumptions and diagnostics

Week 12 becomes less syntax-driven and more question-driven. The same poverty/income models are rebuilt so the workshop is self-contained.

For each diagnostic, the repeated reasoning routine is:

1. state what pattern would support the assumption;
2. describe what is visible;
3. judge whether the departure matters for inference or prediction.

A complete poverty diagnostic is shown first, then students recreate and interpret the matched income diagnostic.

The lab also explains what the supplied data cannot diagnose, such as spatial independence without adjacency or coordinate information. This is preferable to manufacturing an irrelevant diagnostic merely to fill a checklist.

## Upstream review lessons

The main review concern on the Week 10 pull request was clarity about what students were expected to do at each step.

Generalise that into these rules:

- Never blur demonstration and student work.
- Name the variable students should use.
- Say whether a sentence is a question they must answer.
- Demonstrate the model equation and interpretation before asking students to recreate it.
- If students will encounter standard output repeatedly, show them how to read it at least once.
- Remove duplicated tasks unless repetition has a clear learning purpose.
- Do not introduce unexplained quantities simply because they are available in software output.
- If a prompt is difficult to understand without oral explanation, rewrite the prompt.
- Add the smallest prerequisite bridge before a more complicated adjusted or interaction model.

The review also objected to globally silencing warnings/messages. Treat warnings as information unless a particular message is known to be irrelevant to the teaching goal.

## Self-contained means more than runnable

A lab is self-contained when students have enough conceptual and contextual information to reason through it, not merely enough code to execute it.

A self-contained section includes, when needed:

- why the question matters;
- what a row represents;
- variable definitions and units;
- where transformed variables came from;
- the minimal definition or formula needed;
- the new syntax before independent use;
- how to read the output;
- what conclusion is and is not supported.

External links are for provenance, context, or optional depth. Essential reasoning should remain in the lab.

## Preferred callout roles

When using Quarto callouts, keep roles stable:

```markdown
::: {.callout-note title="What to look for"}
[visual or numerical cue]
:::

::: {.callout-important title="Discuss"}
[question students discuss before opening the answer]
:::

::: {.callout-tip collapse="true" title="Worked interpretation - open after discussion"}
[short contextual interpretation]
:::
```

For a question-led diagnostic section, `Question` can replace `Discuss`.

Do not overload callouts. They should distinguish teaching roles, not decorate every paragraph.

## A useful section template

```markdown
## [Question-driven section heading]

[One short paragraph giving the concept needed for this task.]

### Demonstration: [example A]

[Complete code or worked method.]

::: {.callout-note title="What to look for"}
[Specific feature to inspect.]
:::

::: {.callout-important title="Discuss"}
[Interpretive question.]
:::

::: {.callout-tip collapse="true" title="Worked interpretation - open after discussion"}
[Contextual answer, units, limitations.]
:::

### Your turn: [parallel example B]

[Explicit instructions using the demonstrated method.]

```r
# Use [demonstration chunk] as your template.
# [State the target variables/object name.]
# Your code here
```

[Interpretive question.]
```

After several such sections:

```markdown
## Independent workflow: [example C]

Now complete the full workflow independently. Reuse only operations already
shown above.

### A. [step]
...
### B. [step]
...
### C. [step]
...

[Final integrated conclusion.]
```

## What not to copy mechanically

The 297.101 labs are examples, not a fixed visual template.

Do not force:

- three predictors when two or four suit the learning goal better;
- identical callout counts in every section;
- an independent section when the lab is itself already an advanced synthesis;
- a second dataset merely to imitate another week;
- the same balance of code and discussion across introductory and advanced courses.

Preserve the pedagogy: explicit responsibility, matched transfer, self-contained context, and decreasing scaffolding.
