# Style and Pedagogy Reference

Use this reference as the detailed editorial standard for lecture work.

## Target voice

Write in a direct, analytical, conversational teaching voice. The lecturer should sound as though he understands the material well enough to explain it plainly without flattening the technical detail.

Lead with the concept or result rather than with ceremonial setup. A lecture can be informal without becoming imprecise. Prefer a confident explanation with appropriate caveats over either textbook stiffness or chatty filler.

Use New Zealand spelling. Do not use em dashes.

## What to preserve

Preserve the lecturer's:
- intended claim;
- degree of certainty;
- notation and terminology where already coherent;
- conceptual sequence;
- chosen examples and datasets;
- level of mathematical detail;
- relationship between slides and accompanying notes;
- explicit signals about examinable/testable content;
- existing pedagogical devices when they are purposeful.

Do not homogenise different lectures into a single template.

## What to remove

Remove or repair:
- dictation artefacts and obvious transcription errors;
- repeated phrases and duplicated qualifications;
- awkward sentence fragments when they are intended as prose;
- vague pronouns or antecedents;
- unnecessary passive constructions;
- transitions that merely announce the next heading;
- generic claims about a method being "powerful", "important", or "widely used" unless the claim has a teaching purpose;
- sentences that restate the heading without adding information;
- AI-style summaries that merely paraphrase the preceding paragraph.

## Good editing is not minimal editing

If a paragraph is structurally poor, rewrite the paragraph. Do not make a sequence of tiny substitutions that preserves a bad sentence structure.

For example, avoid this kind of weak repair:

Original:
"Residual plots are important because they allow us to see assumptions and they can be used for seeing problems in the model which might make the model not good."

Weak minimal edit:
"Residual plots are important because they allow us to assess assumptions and identify problems that might make the model poor."

Better lecture prose:
"Residual plots show us where the linear model is failing. We use them to look for systematic structure in the residuals, changes in variance, and observations that behave differently from the rest of the data."

The better version preserves the teaching purpose while replacing vague language with concrete interpretation.

## Do not turn lectures into commentary

Never replace weak content with statements such as:
- "Explain why this matters here."
- "Consider adding an example."
- "Students may need more context."
- "TODO: clarify assumption."

If the intended content is inferable, write the explanation or example into the lecture.

If doing so would require a substantive pedagogical decision, preserve the current lecture and raise the decision in chat instead.

## Scope changes require conversation

Examples of changes to discuss rather than silently make:

- introducing interaction terms into a lecture that currently stops at additive multiple regression;
- moving a derivation to a later lecture because it seems difficult;
- replacing a mathematical explanation with a purely intuitive one;
- deleting an example because it appears redundant when it may support assessment;
- adding a new method because it provides a more modern solution;
- changing the interpretation students are taught for a diagnostic plot;
- altering a worked example enough that it teaches a different concept;
- changing slide density in a way that removes material rather than rewriting it.

When raising a decision, be concrete. Say what the current lecture does, what alternative is available, and the consequence for students or scope.

## Teaching explanations

A good explanation usually answers the relevant subset of these questions naturally, not as a checklist:
- What is the thing?
- Why are we doing it?
- What does the quantity or graph mean?
- What would we expect to see if the model/assumption is reasonable?
- What pattern would indicate a problem?
- What conclusion are we allowed to draw?
- What conclusion are we not allowed to draw?
- How does this connect to the model or concept immediately before it?

Do not add all of these mechanically. Use only what the concept needs.

## Slides versus notes

Respect the existing distinction between slide text and speaker/lecture notes.

For slide text:
- favour compact, meaningful statements;
- avoid dense paragraphs unless the existing format intentionally uses them;
- retain equations and visual prompts;
- do not reduce everything to noun-phrase bullets.

For lecture notes:
- use connected prose;
- allow more explanation and nuance;
- make transitions explicit enough that the lecture can be followed independently;
- avoid writing a transcript unless the surrounding notes are already transcript-like.

If it is unclear whether text is intended for slides or notes, infer from the local file structure and neighbouring sections before editing.

## Statistical teaching

For statistics and data science lectures, prefer explanations that connect the mathematical object to what the student sees in data.

Examples:
- A residual is an observed-minus-fitted discrepancy, not simply "error" without qualification.
- A residual plot can reveal patterns inconsistent with a model assumption; it does not establish that an assumption is true.
- R-squared describes the proportion of outcome variation accounted for by the fitted model in the sample; it is not a general measure of whether a model is scientifically correct.
- Statistical significance is not effect size, predictive usefulness, or practical importance.

Do not inject advanced caveats into an introductory lecture unless they prevent a material misconception.

## Voice examples

Prefer:
"The fitted line is the model's best estimate of the mean response at each value of x. The residual tells us how far an individual observation sits above or below that fitted value."

Over:
"The regression line serves as a powerful tool for understanding the relationship between the predictor and response variables, while residuals provide valuable insights into model performance."

Prefer:
"Nothing in this plot should form an obvious pattern. A curve suggests that a straight line has missed systematic structure in the relationship."

Over:
"Ideally, the residuals should be randomly distributed, which highlights that the linearity assumption has been satisfied."

Prefer:
"These two models answer slightly different questions, so comparing their coefficients directly is not enough. First decide what change in the model specification means scientifically."

Over:
"It is important to carefully compare the models to gain a comprehensive understanding of their respective strengths and weaknesses."

## Interaction with the user

When the user is thinking aloud, resolve obvious false starts but engage with the underlying reasoning. Do not merely mirror the user's last sentence.

If the user proposes a weak teaching choice, say so and explain the mechanism. If the choice is defensible, do not create disagreement for its own sake.

When the user asks for a rewrite, return or implement the rewrite. Do not make the main response a critique unless critique was requested or a technical/pedagogical issue prevents a safe rewrite.

When a consequential choice is genuinely ambiguous, discuss it in ordinary prose. Do not bury it in an exhaustive checklist or leave a comment in the lecture source.
