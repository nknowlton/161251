# 161.251 remaining lectures and labs: editorial handoff

Prepared 26 September 2026. Reviewed against `nknowlton/161251` at commit `7da3a54c0e987579a6317b58977587af8f971b09`.


## Implementation status

The source edits for Lectures 28–35 and Labs 11, 12A and 12B have been applied. Lecture 25–27 source files remain untouched. The new student/solution files, lab landing links and published-file checks are in place. Pandoc parsed the edited R Markdown sources and structural checks passed. Full R/Quarto rendering, numerical execution in R, visual inspection and `scripts/validate-course.R` remain unverified because neither `Rscript` nor Quarto is installed in the current environment. The planned local `data/hp.csv` file is also absent, so Lab 12B cannot be knitted or its output-dependent solution values checked here.

This document fixes the editorial and teaching decisions for Lectures 28–35. Lectures 25–27 have been delivered and are out of scope. Implement in the canonical `lecture-content/*.Rmd` files, not in the generated lecture, book, or slide wrappers. The lab changes follow the lectures. The text under **Use this wording** and **Student-facing lab wording** is final teaching prose: place it verbatim, subject only to changes required by verified numerical output, variable names or grammar. Do not ask another model to rephrase, expand or summarise it. The implementation model owns code, figures, file assembly, knitting, and mechanical consistency checks.

## Decisions already made

- Preserve the lecture sequence: automated search and penalisation (28), collinearity and ridge (29), weighted regression (30), flexible curves (31), time predictors (32), seasonality (33), dependence diagnostics (34), and AR(1) errors (35). Do not add new assessable methods.
- Keep the climate, Seoul bike, electricity, CPS5, supervisors, MoneyStock and tourism examples. Shorten or remove existing prose only where identified below as false, stale or redundant.
- Treat `hour` as a categorical predictor in the Lecture 28 Seoul example. Its original source was a factor; the CSV reload otherwise silently turns it into a numeric 0–23 linear term.
- Use the original `day_index` after excluding non-functioning Seoul days. Do not renumber surviving rows. Keep those days out of the Seoul *mean-model* examples in Lectures 32–35. For Seoul residual ACF and Ljung–Box, use the longest contiguous functioning-day run, 1 December 2017 through 10 April 2018 (131 days), from models fitted to the 352 eligible days. Do not feed the full gappy residual vector to `acf()` as though its rows were equally spaced days. The monthly tourism series remains the complete primary example for AR(1).
- Use the electricity residual-versus-time plot to discover seasonality, then fit and compare the full `Bill` models for inference. With both sine and cosine terms included, a phase-origin shift changes only their coefficients, not the fitted curve. Keep one origin after making that point. Add the second harmonic as a pair, compared in the complete model.
- Keep the sample-size weighting and heteroscedasticity examples. Introduce inverse-variance weighting before the sample-size special case. Be exact about the grouped-response estimand and inferential limitations.
- Limit spline teaching to LOESS as an exploratory smooth, unpenalised regression splines, degrees of freedom, and natural boundary behaviour. Do not introduce penalised splines or a new smoothing package.
- Treat the Lab 11 solutions already in the repository as the content base for a matching student lab. Retain the old Lab 11A/11B files as archived material, but make the new paired Lab 11 the primary route. Lab 12A gains a short worked flexible-mean block before autocorrelation. Lab 12B stays an independent application, with its part–whole predictor issue disclosed.

## Implementation order and gates

- [x] Correct the statistical claims and code in Lecture 33; phase invariance and the nested full `Bill` comparison were checked independently against the bundled CSV. R rendering remains pending.
- [x] Apply the shared Seoul filtering/time-index rule in Lectures 32–35 and update affected captions for the 13 excluded days.
- [x] Apply the wording and targeted code changes in Lectures 28–31; the climate search output and main numerical statements were checked independently. R execution remains pending.
- [x] Apply the mean-versus-dependence clarifications in Lectures 32, 34 and 35, with diagnostics using the stated observations and temporal spacing.
- [x] Create `labs/lab11.Rmd` from the solution document with the approved student wording, aligned data, object names, question order, and worked blocks.
- [x] Revise Labs 12A and 12B as specified and pair their student/solution structure. Lab 12B numerical claims remain omitted pending the missing `hp.csv` file.
- [x] Update the lab landing page, published artefact list, and solution links to surface the new Lab 11 and revised Lab 12 files. Site output regeneration remains pending.
- [ ] Render standalone notes and Slidy for Lectures 28–35, knit both versions of each changed lab, run the course validator, and visually inspect affected plots and slide overflow. Blocked locally: `Rscript` and Quarto are unavailable, and `data/hp.csv` is missing. Pandoc parsing and source-structure checks passed.

## Lecture 28: search, penalisation and validation

**Changes.** Preserve the two-part structure and all fitted methods. The current climate section says forward and backward searches may differ but shows only `drop1()`. Fit and display both paths on the same complete-case climate sample; report the actual paths and ending formulas. Do not manufacture disagreement if these data produce the same result. Convert Seoul `hour` to a factor immediately after `read_csv()`, before `lm()` and `model.matrix()`. Use the same fold assignment for ridge and lasso so the two plots can be compared without an additional random-fold difference. `cv.glmnet()` still tunes lambda, and its minimum should not be presented as an unbiased final performance estimate. The Seoul hourly observations are serially related, so random row folds do not test future forecasting.

**Use this wording** after the climate backward-search code, replacing the paragraph beginning “We could do the whole sequence by hand” and the following path-dependence paragraphs:

> Let us run the search from both ends of the candidate set. Forward selection starts with an intercept and asks which term to add next. Backward elimination starts with the full model and asks which term to remove. Each step is local: the algorithm compares models it can reach from its current position.
>
> Compare the paths and final formulas before looking at any P-values. If they differ, the starting point has changed the answer. If they agree, that is reassuring about this particular search, but it does not prove that the resulting formula is the best model among every possible combination. We still have to decide whether the predictors and assumptions make sense for the scientific question.

The implementation should place an output-dependent sentence immediately below the two paths in the form “Here the forward and backward searches [converge on the same formula / retain different formulas]; [name the actual terms and final AICs].” This is the only sentence in this section whose words depend on executing the code. Use `step()` paths with equal scope and a stated AIC criterion. A `drop1(..., test = "F")` illustration may remain, but its F-test table must not be described as the AIC path.

**Use this wording** immediately before the Seoul candidate models:

> `hour` records a position in the day. We will treat it as a factor so each hour can have its own mean shift, rather than forcing demand to change in one straight line from midnight to 11 pm. A CSV does not preserve R's factor class, so we convert it after import. The same coding must be used when we build the model matrix for ridge and lasso.

**Use this wording** after the ridge and lasso CV curves, replacing the current one-sentence explanation of `lambda.min` and `lambda.1se`:

> `lambda.min` is the penalty with the lowest average error across these held-out folds. `lambda.1se` is the largest penalty whose estimated error is within one standard error of that minimum. The latter accepts an estimated error close to the minimum in exchange for a more strongly regularised model. The CV curve selects a penalty from this dataset; it is not an untouched final test of the selected model's performance.

**Use this wording** before the lecture's final comparison or as its last paragraph:

> There is one limitation to the Seoul example. Hours close together share weather, calendar conditions and demand patterns. Randomly splitting rows across folds allows the training and validation sets to contain near neighbours. That is enough to illustrate how `cv.glmnet()` chooses a penalty, but it is not a credible test of forecasting future days. Once time becomes the modelling question, validation must keep later observations out of the training set.

Keep the factor-term warning already near the end: `step()` handles `season` as a whole term whereas lasso can zero individual model-matrix columns. Add after it: “Neither a stepwise coefficient P-value nor the chosen lasso set has the same inferential interpretation it would have had if that model had been specified before looking at the outcome.”

## Lecture 29: exact dependence, unstable coefficients and ridge

**Changes.** Replace the stale paragraphs stating that correlated predictors should not coexist, that high VIF dictates deletion, or that the whole model is “not estimable” when only individual coefficients are unidentified. Preserve the simulation and electric/SAP/Seoul examples. The displayed VIF factor compares variance under fixed error variance and predictor spread; it is not, in general, the ratio of empirical standard errors from two separately fitted models. Do not teach VIF > 10 as a universal deletion threshold. Remove the claim that Lecture 28 compared training MSEs and the reference to an orthogonal ridge formula previously taught there. Ensure the OLS–ridge table has meaningful column labels and compatible coefficient scales; the model's internally standardised predictors are reported by `glmnet` on the original scales by default. Check numerical claims after code execution.

**Use this wording** at the end of the opening “Idea of Collinearity and Orthogonality” section:

> Two cases need to be kept separate. With exact linear dependence, one predictor is an exact combination of the others. The model cannot identify every coefficient separately, although it may still identify fitted values or particular combinations of coefficients. With near dependence, the coefficients are identifiable, but their separate estimates can be very imprecise and can change markedly when the sample or formula changes. Neither case says, by itself, that the predictors are scientifically unnecessary or that the model cannot predict.

**Use this wording** in place of the “Not estimable” paragraph after the algebraic example:

> Here the dependence is exact. Many sets of intercept and slope coefficients produce the same fitted values, so we cannot estimate the individual coefficients uniquely from these data. In less extreme examples the dependence is only approximate: the model can be fitted, but separating the coefficients requires information that the observed predictors contain very little of.

**Use this wording** in place of the opening paragraphs under “Correlations among the predictors” through the “may not be able to have them all” claim:

> Pairwise correlations are a useful first check. A strong correlation tells us that two predictors tend to move together, so their separate conditional coefficients may be hard to estimate. It does not tell us to discard either variable. The scientific question may require both, and a predictor can also be nearly explained by several others even when no single pairwise correlation is striking. We will look at both the correlation matrix and what the fitted model says about coefficient precision.

**Use this wording** immediately after the VIF equation:

> VIF describes how much the variance of one coefficient is enlarged by linear overlap with the other predictors, with the error variance and the spread of that predictor held fixed. A high VIF flags limited information for that *separate conditional effect*. It is a diagnostic, not an instruction to delete the predictor. Whether we change the model depends on whether we need that coefficient, the available data and the modelling goal.

**Use this wording** to open the Seoul reprise, replacing the sentence about Lecture 28's training MSE comparison:

> Last lecture we used ridge and lasso to control model complexity. We now return to the Seoul weather predictors to ask a different question: how much information do they provide about each separate coefficient? Temperature, humidity and dew point overlap, so the model may describe demand reasonably well while being uncertain about which one carries a particular conditional association.

**Use this wording** directly after the OLS–ridge coefficient table, replacing “Notice how the ridge coefficients are pulled toward zero…” and the paragraph referring to an earlier orthogonal derivation:

> Ridge penalises the *whole coefficient vector*. With orthogonal predictors, each coefficient simply moves towards zero as the penalty grows. With correlated predictors, the coefficients are estimated jointly and can rebalance. An individual coefficient may even move away from zero relative to its OLS estimate. Judge the change in the collection of coefficients and the fitted predictions; do not expect every entry in this table to be a smaller copy of its OLS counterpart. Ridge can reduce instability, but it does not create independent information about highly overlapping predictors.

Remove the duplicate closing “Lecture Summary” paragraph after the final substantive conclusion; retain a short handoff to weighting: “So far we have asked how much each *predictor* contributes. Next we change a different part of the problem: some observed responses are measured more precisely than others.”

## Lecture 30: weighted regression

**Changes.** Put the variance principle before the CPS5 grouped example, then show group-size weights as its consequence. Preserve the worked decomposition if desired, but it must state that the equality of slopes depends on predictor values being constant within the groups. The Seoul temperature-band example is illustrative of weighted *grouped summaries*; its predictors vary within each band, so it cannot inherit the exact individual-data equivalence. Distinguish between-group R-squared from individual-level R-squared. Fix the “Education (hours)” axis to “Education (years)” and the broken quotation mark in “weighted or Pearson residuals”. Do not call a weighted residual “unimportant” solely because it is small; its size is a model-scaled discrepancy, not a full influence analysis.

**Use this wording** for the opening, replacing “Introduction” through the bullet list:

> So far we have changed the mean model: which predictors enter and how they enter. Weighted least squares changes the error model. Some responses are measured more precisely than others, so their deviations from the fitted mean need not contribute equally to the fit.
>
> If observation \(i\) has error variance \(\sigma_i^2\), the usual precision weight is proportional to \(1/\sigma_i^2\). A more precise observation receives a larger weight. We will start with means based on different numbers of people, then use the same rule when individual error variances change across the predictor range.

**Use this wording** before the first CPS5 plot:

> Each row here is a mean hourly wage for one education level, not one person. Suppose individual wages within the education groups have a common variance \(\sigma^2\) and are independent. A mean based on \(n_j\) people then has variance \(\sigma^2/n_j\), so inverse-variance weighting gives \(w_j \propto n_j\). This explains why the group containing three people should have less influence than a group containing many more.

**Use this wording** after the sum-of-squares decomposition and before the first weighted model:

> Because everyone in an education group has the same `ED` value, the within-group sum of squares does not depend on the regression coefficients. Minimising the individual-level sum of squares therefore gives the same intercept and slope as a regression of the group means weighted by group size. This equality of coefficient estimates depends on the predictor being constant within each group. It does not say that the two analyses have the same residual degrees of freedom, standard errors or R-squared: the grouped analysis has lost the within-group variation.

**Use this wording** in place of the “Basic rule for Weighting” section and its equation:

> The rule is inverse variance: \(w_i \propto 1/\operatorname{Var}(Y_i \mid X_i)\). If a row is an independent group mean based on \(n_i\) people with individual variance \(\sigma_i^2\), then \(\operatorname{Var}(\bar Y_i) = \sigma_i^2/n_i\) and \(w_i \propto n_i/\sigma_i^2\). Sample size alone is enough only when the individual variances are approximately common. These are precision weights, not a general measure of whether a point is scientifically important.

**Use this wording** after the Seoul grouped plot:

> These temperature bands summarise unequal numbers of hours. Weighting a band's mean by its count changes how much that summary influences the line. Here temperature also varies *within* each band, so the line through weighted band means need not be identical to a line fitted to all the hourly observations. The exact equality in the education example relied on everybody in a group having the same predictor value.

Delete the meta-analysis aside if slide density requires space; it is not needed for the weighting objective. Keep the supervisors example to show why a variance model can motivate `1/X^2` weights.

## Lecture 31: flexible curves

**Changes.** Add one explanation connecting the already-taught piecewise and polynomial models to spline bases. Show a compact diagram of several smoothly joined pieces with knots. Explain that `df = 5` is a flexibility choice, not fifth-degree polynomial regression. A natural cubic spline is constrained to be linear beyond its boundary knots; the existing phrase about “trusting” extremes is imprecise. LOESS in this lecture explores shape. The examples do not fit penalised splines, so replace objective 5 (“regularisation”) with “Explain how degrees of freedom control the flexibility of a regression spline.” Keep a simple repeated comparison on identical axes, with the same observed points and enough visual contrast near boundaries.

**Use this wording** immediately before the LOESS example:

> We have already fitted polynomials and piecewise regression models. A polynomial uses one global curve, so changing its coefficients can alter the fit across the entire range. A piecewise model lets the shape change at selected predictor values. LOESS takes a more local approach: at each temperature, it fits a small regression using nearby observations, with closer observations contributing more. It is a way to inspect the shape before committing to a particular regression formula.

**Use this wording** immediately before the `bs()`/`ns()` model code:

> A regression spline joins polynomial pieces at *knots*, with constraints that keep the fitted curve smooth. R constructs basis functions for those pieces and `lm()` estimates their coefficients. The result is curved as a function of temperature, but still linear in the unknown coefficients. The `df = 5` argument controls the size of the basis and therefore the permitted flexibility; it does not mean a fifth-degree polynomial. We should compare curves at the same predictor values before judging whether that flexibility helps.

**Use this wording** in place of “Natural Splines vs Ordinary Splines” explanatory paragraph:

> An ordinary cubic regression spline can continue curving at the edges. A natural cubic spline imposes a boundary restriction: its fitted function is linear beyond the boundary knots. This limits one form of unstable tail behaviour, but it does not guarantee reliable extrapolation. We have few observations at extreme temperatures, so uncertainty there still matters.

**Use this wording** after the curve comparison and before the second predictor:

> A flexible curve will usually fit the observations used to build it more closely. That alone is not a reason to prefer it. We should ask whether the departure from a line is systematic, whether the shape is stable where there are fewer observations, and whether the extra flexibility serves the description or prediction we are trying to make.

Do not add an unrelated penalised-spline derivation to satisfy the old objective.

## Lecture 32: explicit time predictors

**Changes.** Keep the ski-sales example and the first-harmonic Seoul demonstration. At import, parse and order `date`, then distinguish observed consecutive dates from consecutive rows after filtering. Show the 13 removed non-functioning days in a count or caption. Maintain the original `day_index`. State that the one-year Seoul record can show a within-year pattern, not demonstrate recurring annual seasonality or a persistent multi-year trend. Lecture 33 will explain the sine/cosine phase more fully; Lecture 32 needs only an intuitive bridge.

**Use this wording** after the filtered Seoul time plot:

> We removed 13 days when the system was not fully functioning. Those days cannot tell us what ordinary demand would have been. The retained observations still have their original dates and `day_index` values; two consecutive *rows* are not always two consecutive *days*. We will keep that distinction when we turn to residual dependence.
>
> This dataset covers one year. Its rise and fall within that year are visible, but one year cannot establish that the same annual cycle will recur or that a fitted linear trend persists over several years.

**Use this wording** before the first Seoul Fourier fit:

> One sine term completes an annual cycle, and one cosine term completes the same cycle with a different starting position. Fitting them together lets the data determine where the seasonal peak falls. This adds two coefficients to the trend-only model. Next lecture we will unpack why the pair represents a shifted seasonal wave.

Replace “dramatically improves the fit” in the plot title with “captures much of the within-year pattern”. Replace any statement about long-term trend or repeated seasons with a within-year description.

## Lecture 33: seasonal mean model and valid comparisons

**Changes.** Keep the electricity and Seoul examples. Replace the “first guess / second guess” progression with one clear phase-invariance example: fit sine-plus-cosine models with shifts of four and five, demonstrate equal fitted values, then retain shift five for subsequent notation. Explain that a smaller cosine coefficient after recoding does not represent improved fit. Do not compare `anova(Electricity_lm4, Electricity_lm5)` as the definitive adjusted second-harmonic test. Build nested models on `Bill` with the original `Days + Estimate + Guestwks + Time` predictors plus first harmonic, then plus second harmonic. The current residual-regression test gives F = 6.21, P = 0.0042, while the correctly adjusted joint-model comparison on the bundled CSV gives F = 3.83, P = 0.0301. Verify these against the R output before placing numbers in the lecture. Keep only one Fourier nomenclature convention for Seoul and use the 352 functioning days consistently.

**Use this wording** after plotting residuals from the initial electricity model:

> The residual plot suggests a pattern that repeats across months. We are using it to decide what to add to the *mean* model. For a test of the added seasonal terms, we will fit those terms together with `Days`, `Estimate`, `Guestwks` and `Time` in the original regression for `Bill`.

**Use this wording** in place of the “initial guess near April” and the first/second guess explanations:

> We can choose any convenient month as the origin of the sine and cosine pair. With a 12-month period, shifting the origin changes the two coefficients, but it does not change the family of curves the pair can fit. To see this, fit the pair using `Time - 4`, then repeat using `Time - 5`. The fitted values agree to numerical precision. A smaller cosine coefficient in the second version therefore says something about how we labelled the two basis functions, not that we found a better seasonal model. We will use `Time - 5` from here on because its coefficients are easier to describe.

**Use this wording** immediately before the joint second-harmonic comparison:

> One sine/cosine pair produces a smooth cycle with one peak and one trough per year. The residual pattern suggests a sharper rise or fall than this pair can produce. Adding a second pair, at twice the frequency, allows that shape to change while keeping the original adjustment variables in the model. Compare the model with the first pair against the model with both pairs. The partial F test asks whether those *two additional coefficients* improve the fit after the other terms have already been included.

**Use this wording** after the verified nested `Bill` comparison:

> The second harmonic provides evidence of additional seasonal shape in these data. It is a two-degree-of-freedom comparison within the complete electricity model. The fitted pattern remains an association with month after the recorded covariates have been included; this single household does not establish that the same pattern applies elsewhere.

Delete the claim that the cosine term's individual P-value determines whether a phase guess is right. Delete the residual-on-seasonal-predictors model comparisons as inferential results; one residual plot may remain as a visual bridge.

## Lecture 34: diagnosing error dependence

**Changes.** Keep the MoneyStock series as the complete primary example and the Seoul comparison as a conditional transfer. Distinguish zero correlation from independence. Change the runs-test description to match `RunsTest()`'s median split, or explicitly give it the signs of residuals relative to zero. Simplest: use the median split and explain it accurately. Clarify the conditional-mean requirement for OLS unbiasedness and avoid saying standard errors are *always* too small. Residual patterns can also indicate an inadequately specified mean. For Seoul, apply the common functioning-day rule and avoid a naïve ACF on a gappy vector.

**Use this wording** in place of “What Is Autocorrelation?” and the following consequences paragraph:

> A time predictor can explain a pattern in the *mean* while nearby deviations from that mean remain related. Positive residual autocorrelation means a positive residual tends to be followed by another positive residual, and likewise for negative residuals. A negative correlation at lag one tends to produce alternation. The usual independent-error calculations then give unreliable conventional standard errors. Depending on the regressors and the dependence pattern, they can be too small or too large. If the conditional mean is correctly specified and the errors have mean zero given the predictors, autocorrelation alone need not bias the OLS coefficients. It can, however, make the apparent precision and tests wrong.

**Use this wording** under “Runs Test”:

> The default `RunsTest()` for a numerical vector divides residuals above and below their median and counts how often the sequence switches sides. A long run is a reason to look more closely at the time plot; the test does not tell us which time process produced it.

**Use this wording** at the end of the diagnostic section:

> We start with the residuals plotted against actual time, then inspect their ACF. A test can support what we see, but several small P-values do not identify the correct error model. First ask whether a missing trend, seasonal term or outage explains the pattern. If a reasonable mean model still leaves dependence, the next lecture changes the error model itself.

Do not ask students to infer autocorrelation from a mere failure to reject a randomness test, and do not describe residuals as proven independent after an apparently clean plot.

## Lecture 35: AR(1) errors and GLS

**Changes.** Keep tourism as the full worked example and Seoul as a shorter comparison. State \(|\phi| < 1\) for stationary AR(1) errors and the conditional-mean assumption for unbiased OLS. Avoid asserting a fixed direction of the SE change. `corAR1(form = ~ Time)` uses integer time distance, so verify that the tourism `Time` is consecutive months and the Seoul `day_index` remains the original day count. Fit Seoul `corAR1()` using the actual integer `day_index` gaps. Diagnose normalised residuals on the 131-day uninterrupted functioning-day run, while showing the full eligible series against actual dates. Do not interpret an improved residual ACF as proof the model is true.

**Use this wording** in place of the opening “Why Ordinary Least Squares Is Not Enough” section:

> If the mean model is correctly specified and the errors average to zero given the predictors, correlated errors do not by themselves force the OLS slope to be biased. They do make the usual independent-error standard errors unreliable; the direction of the error is not fixed. We now keep the trend and seasonal predictors and model the dependence among the remaining errors.

**Use this wording** under the AR(1) equation:

> For a stationary AR(1) process, \(|\phi| < 1\). A positive \(\phi\) makes nearby errors tend to share a sign; a negative value favours alternation. The lag-\(k\) correlation is \(\phi^k\), so it weakens as the time gap grows. This describes dependence *after* the mean predictors have been accounted for.

**Use this wording** immediately after the first `gls()` call:

> `Time` counts months, so observations one month apart have correlation \(\phi\) and observations two months apart have correlation \(\phi^2\) under this model. The regression formula still describes mean room nights. The `corAR1()` term describes the pattern left in the errors.

**Use this wording** below the OLS–GLS standard-error comparison:

> Compare the trend estimates *and* their standard errors. GLS may change the estimated trend as well as its precision because observations are no longer treated as providing independent information. The direction and size of the change are properties of these data and this fitted correlation model, not a universal correction factor.

**Use this wording** below the normalised-residual plot:

> We want much less remaining structure in the normalised residuals than in the OLS residuals. A quieter ACF makes AR(1) a more plausible working error model; it does not prove independence or rule out a missing part of the mean.

Replace the final Seoul paragraph with: “The daily Seoul example uses the same distinction between a model for expected demand and a model for residual dependence. We retain the actual day index after removing system outages so a gap of several days is not treated as one AR(1) step. We should not read an ordinary ACF of the shortened residual vector as though every retained row were exactly one day apart.”

## Lab 11: publish the student counterpart to the existing solutions

`labs/lab11-sols.Rmd` already contains the intended Auto MPG and magazine analysis. It is the answer guide, not a student exercise: every code block is complete and numerical solutions follow prompts. Create `labs/lab11.Rmd` by retaining its front matter adapted to “Computer Laboratory 11”, running imports, variable context, conceptual paragraphs, worked code blocks, and section order. Convert follow and independent tasks to explicit actions with knit-safe `eval=FALSE` stubs. Do not remove the answer from the solution file. Keep the same object names and chunk logic in both files. Do not copy the old WVS Lab 11A into the new student lab.

**Student-facing lab wording**, to replace or precede the corresponding solution-only material:

> ### Search from both ends
> Fit the null and full Auto MPG models shown below. Run forward search from the null model and backward search from the full model using the same AIC scope. Print each search path and final formula.
>
> Discuss: Did the two routes end at the same model? What would agreement or disagreement tell us about this particular search, and what would it *not* establish?

> ### Keep `origin` in every candidate model
> Fit a lower-bound model containing `origin`, then repeat backward search with that model as the lower scope limit. Print the selected formula.
>
> Discuss: What decision did we make before the search? Why could an automatic AIC step not remove `origin` this time?

> ### How much do the numerical predictors overlap?
> Make a correlation matrix for `cylinders`, `displacement`, `horsepower`, `weight`, `acceleration` and `model_year`. Then compute the VIFs or adjusted GVIFs for the full model.
>
> Discuss: Which conditional coefficients might be hard to estimate separately? Why would a high VIF alone be an inadequate reason to delete one of them?

> ### Simple associations and conditional coefficients
> Fit separate simple regressions for `cylinders`, `displacement`, `horsepower` and `weight`. Compare each slope with the corresponding coefficient in the full model.
>
> Discuss: Which signs or magnitudes changed? Describe the full-model coefficient as an association conditional on the other included predictors; do not interpret a sign reversal as a causal benefit.

> ### Ridge and lasso on the same folds
> Build the model matrix shown below. Use one fold assignment for both `cv.glmnet()` fits. Plot both coefficient paths and both CV curves. Extract coefficients at `lambda.min` and `lambda.1se`.
>
> Discuss: Which coefficients are exactly zero under lasso? What trade-off does `lambda.1se` make? Why is a zero dummy coefficient for one `origin` level different from removing the `origin` term as a whole?

> ### Which magazine means are most precise?
> Plot `Avemags` against `Age`, marking `Sex`, group size `N` and within-group standard deviation `StDev`. Compute `N/StDev^2` and list the groups with the highest and lowest precision weights.
>
> Discuss: Why do both group size and within-group variation enter the weight?

> ### Hold the mean formula fixed and change the weights
> Fit the provided age-piece and sex formula once without weights and once with `weights = N/StDev^2`. Compare the fitted values and coefficients. Then plot ordinary residuals for the first fit and \(\sqrt{w_i}(y_i-\hat y_i)\) for the weighted fit.
>
> Discuss: Which fitted contrasts change? What assumption about the precision of a group mean justifies the weights? Why do the two residual panels have different scales?

> ### Final decision
> In one short paragraph, state when you would use term-based search, ridge or lasso, and weighted regression in these two examples. Explain what you would need to assess before claiming the selected Auto MPG model predicts new cars well.

Keep at least one complete worked search block, one complete worked penalised-regression block and one complete worked weighted-regression block in the student version. The wording above supplies the handoffs and questions; the implementer must decide which code stays shown and which becomes a matched stub without adding new methods. Apply the same student/solution changes to any output-dependent interpretations after recalculation.

## Lab 12A: add the missing mean-model practice before AR(1)

The current Lab 12A starts with autocorrelated errors and assumes students can reproduce lecture models. Add a concise opening Seoul section *before* the tourism exercise. It is a worked demonstration of a non-linear mean and a follow task on seasonality. Keep the subsequent tourism AR(1) practice. Use local `../data/...` files. Explain each row of the daily dataset and the absence of outage days, then use the same filtered observations throughout that example. Do not require students to invent new packages or formula syntax not demonstrated in the lecture. Remove the obsolete instruction “excluding the quadratic”, because Lecture 35 contains no quadratic tourism model.

**Student-facing lab wording** for the new opening:

> # Computer Laboratory 12: Curves, seasonality and dependent errors
>
> Last week we changed the shape of the fitted mean with splines and seasonal terms. This week we will first check that mean structure, then ask whether adjacent residuals still carry information about one another. The daily Seoul data describe one year of bike demand. Days when the system was not fully functioning are excluded from the demand analysis, and the original dates remain attached to the retained rows.
>
> ## Does temperature have a straight-line relationship with demand?
>
> Plot daily bike demand against mean temperature and add a LOESS curve. Fit a straight-line model and a natural spline with five basis degrees of freedom, using the same filtered daily observations. Plot their fitted means against temperature on the same axes and inspect residuals against temperature.
>
> Discuss: What shape does the LOESS curve suggest? Does the straight-line model leave a systematic pattern? What does the spline change, and where are observations sparse enough that you would be cautious about the curve?
>
> ## Can time explain the seasonal pattern?
>
> Plot demand against date. Add a linear `day_index` trend, then add the annual sine/cosine pair demonstrated in Lecture 32. Keep the same observations and plot the two fitted means over time.
>
> Discuss: Which visible pattern does the pair describe? Why do we include both sine and cosine? What can a record covering only one year tell us about future seasons?
>
> ## What remains in time after fitting the mean?
>
> Plot the residuals of the trend-plus-seasonal model against their actual dates. Identify any gaps left by non-functioning days. Describe visible runs or patterns before computing a dependence statistic.
>
> Discuss: Could a missed mean pattern still explain part of what you see? Why would an ordinary ACF of a gappy residual vector need care?

The existing tourism example becomes a matched, more independent block. **Use this wording** to introduce it:

> ## Repeat the mean-and-error workflow for monthly tourism
>
> Read the local motel data. Each row is one calendar month. Create an integer month index and an unordered month factor, then plot room nights over time. Fit `RoomNights ~ Time + Month` with `lm()`, plot its fitted values and residuals over time, and inspect the residual ACF. Fit the same mean model with `gls()` and an AR(1) error structure. Compare the trend coefficient and its standard error, then inspect the *normalised* GLS residual ACF.
>
> Discuss: Which patterns belong to the fitted mean, and which remain in the errors? Did allowing AR(1) errors change the estimate, its uncertainty, or both? What diagnostic evidence remains after GLS?

If the revised Lab 12A is too long to teach live, cut the optional `AvePrice` extension and the `intervals()` task before cutting the basic mean-versus-error sequence. Move those to an explicitly optional ending, not into the required middle. Keep final solution values conditional on verified output.

## Lab 12B: Perth transfer and the part–whole predictor

Keep Perth as an independent transfer exercise with local `../data/hp.csv`. Show the month/quarter parsing syntax before the first independent task, and make incomplete chunks knit-safe. Remove the answer “estimated lag-one correlation is 0.914” from the student lab; report it only in solutions after rerunning the revised model. Do not ask for a causal reading of the Australian average.

**Use this wording** after the `WtAve` definition:

> `WtAve` includes Perth in the eight-capital average. The predictor therefore contains a contribution from the response city. The regression can describe how Perth moves with that published average, but it is not a comparison with an independent measure of the rest of Australia. Keep that overlap in mind when interpreting its coefficient or predictive performance.

**Use this wording** for the final task:

> Compare the ordinary and AR(1)-error fits using the same `Perth ~ WtAve + Time` mean formula. Plot residuals against the actual quarter, inspect the ordinary residual ACF and the normalised GLS residual ACF, then compare coefficient estimates and standard errors.
>
> Discuss: Is there remaining evidence of serial dependence? What changed when the error model changed? State the association with `WtAve` without treating it as an independent external predictor of Perth prices.

## Verification and acceptance checklist

- [ ] No edits to Lecture 25, 26 or 27 canonical content. No changes to lecture numbering, learning scope outside the decisions above, or unrelated courses.
- [ ] Lecture 28: `hour` is a factor in both `lm()` and `model.matrix()`; climate paths and output prose agree; ridge/lasso use the same rows and folds; all CV and predictive claims are qualified.
- [ ] Lecture 29: exact dependence, near dependence and VIF have distinct interpretations; no claim that every ridge coefficient must move closer to zero; no stale reference to a Lecture 28 result that is not shown.
- [ ] Lecture 30: grouped coefficient equality is limited to constant predictors within groups; grouped and individual R-squared/SE are not conflated; weighting equations refer to the variance of the response being fitted.
- [ ] Lecture 31: the natural spline boundary statement and `df` explanation match the `bs()`/`ns()` plots; no penalised spline is implied by the objective.
- [ ] Lecture 32–35: same definition of eligible Seoul days; 13 removed days acknowledged; actual day indices and gaps respected; no claim that one observed year proves repeated annual seasonality.
- [ ] Lecture 33: sine/cosine phase-shift fitted values agree numerically; second harmonic is tested by nested *full* models on the same rows; numerical F and P agree with rendered R output. Any residual-only test is labelled exploratory or removed.
- [ ] Lecture 34–35: statements on OLS unbiasedness are conditional, standard-error direction is not universal, `RunsTest()` description matches code, AR(1) stationarity and time distance are stated, and the ACF uses equally spaced data or a method that respects gaps.
- [ ] Lab 11 student and solutions contain the same data, questions, code object names and section order. Student tasks specify the action before interpretation, show each new method before asking for transfer, and end with an integrated conclusion.
- [ ] Labs 12A and 12B use local datasets, knit safely, and have matching numerical solutions. No student version pre-reveals a computed answer. The lab landing page points to the current student and solution versions.
- [ ] Execute numerical analyses in R, render notes and slides, inspect layouts and plots, and run `Rscript scripts/validate-course.R`. Do not fix a failed render by suppressing a substantive warning or silently deleting the teaching content.

Only code, figure construction, mechanical file placement, data-driven numerical statements and verification remain for the implementation model. If execution contradicts a factual sentence here, correct the numbers and report the discrepancy; preserve the editorial reasoning and ask Nick only if a genuine change of teaching objective would be required.
