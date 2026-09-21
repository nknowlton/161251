The overall sequence can be very good, but I would lock a much clearer spine before polishing individual slides. At the moment Lectures 25–30 contain nearly all the right material, but some ideas arrive too early, some are repeated, and the distinction between **testing a prespecified model change** and **searching for a model** is not yet sharp enough.

I would make the whole block answer a sequence of increasingly difficult questions:

> **25:** What model can we write?
> **26:** Does this specific added structure improve the model?
> **27:** How do we choose among several plausible models?
> **28:** What happens when we automate selection or shrink coefficients?
> **29:** What happens when predictors contain overlapping information?
> **30:** What happens when observations contain unequal amounts of information?

That is a strong progression.

| Lecture                                   | Core job                                                                         | What I would change / expand                                                                                                                                                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **25 General linear models**              | Factors + covariates; intercept vs slope changes; interactions; parameterisation | This is now in good shape. Keep Samara as the running example. Do not make this a model-selection lecture.                                                                                                                              |
| **26 Model comparison**                   | **Nested models and partial F tests**                                            | Make this very focused. Add the nesting lattice, connect hypotheses directly to the fitted-line pictures, and explain what RSS reduction is being tested. Remove AIC/BIC. Add a short bridge back to orthogonal/non-orthogonal designs. |
| **27 Variable selection**                 | Moving from one prespecified comparison to choosing among candidate models       | Start with **what is the modelling goal: inference/explanation or prediction?** Then bias–variance, adjusted \(R^2\), residual SE, coefficient changes and scientific judgement. Add hierarchy and whole-term selection.                |
| **28 Automated selection / penalisation** | Stepwise, AIC, lasso/ridge, complexity control                                   | This is currently overloaded. Cross-validation needs to be taught properly. Compare methods using out-of-sample/CV error, not training MSE. Detailed ridge algebra could move into 29.                                                  |
| **29 Multicollinearity / ridge**          | Overlapping predictors and instability                                           | Distinguish **exact collinearity** from **near collinearity**. Emphasise that multicollinearity does not bias OLS but makes individual coefficients unstable/imprecise. Ridge then has a very natural reason to exist.                  |
| **30 Weighted regression**                | Unequal variance / unequal information                                           | Explicitly pivot from changing the **mean model** to changing the **error/variance structure**. Distinguish sample-size weighting from inverse-variance weighting and make the assumptions behind each explicit.                        |

The biggest conceptual addition I would make is in Lecture 26. Your current draft describes one chain,

> Null ⊂ Intercepts-only ⊂ Parallel slopes ⊂ Separate slopes

but the full structure is actually a lattice.  You want students to see:

```text
                     Separate lines
                    Y ~ A * x
                     /       \
                    /         \
          Parallel lines       ...
          Y ~ A + x
             /    \
            /      \
      Y ~ A          Y ~ x
   factor only      single line
            \        /
             \      /
              Y ~ 1
               null
```

More precisely, both `Y ~ A` and `Y ~ x` are nested in `Y ~ A + x`, but they are not generally nested in each other.

That diagram does much more than another formula. It answers:

> “Can I use `anova(model1, model2)` here?”

If one model is reached by constraining parameters in the larger one, yes. If not, the partial F test is not the right comparison.

### Lecture 26 should be narrower than it currently is

I would remove the AIC and BIC columns from the Samara model-summary table. Right now Lecture 26 shows RSS, \(R^2\), adjusted \(R^2\), AIC and BIC before AIC is actually taught later.  That muddies the progression.

For Lecture 26, the comparison table should probably contain only:

```text
Model        Formula               Parameters    Residual df    RSS
M0           Load
M1           Tree + Load
M2           Tree * Load
```

Then the intellectual question is simply:

> How much RSS did the additional terms remove, and was that reduction large relative to the residual variation in the larger model?

That is exactly what the partial \(F\) statistic measures.

Then the three Samara comparisons should not just be three `anova()` calls. Each should explicitly pair a **visual change** with a **null hypothesis**:

```text
M1 vs M2
parallel → separate slopes

H0: interaction coefficients = 0
Question: Do we need different slopes for the trees?
```

then

```text
M0 vs M1
one line → parallel lines

H0: Tree coefficients = 0
Question: After accounting for Load, do the trees need different intercepts?
```

and only then perhaps

```text
M0 vs M2
one line → fully separate lines

H0: all Tree and Tree:Load terms = 0
Question: Does allowing Tree to affect either intercept or slope improve the model?
```

That is much clearer than treating the three ANOVA outputs as independent calculations.

Your fitted-line figure is therefore **central**, not decorative. It should probably come before any ANOVA table.

### One missing bridge: orthogonal versus non-orthogonal analysis

Given Lecture 23 and the biological reality you mentioned earlier, I would add one compact section to Lecture 26.

Students have already been taught that orthogonal balanced designs have clean sums-of-squares decomposition. The natural follow-on is:

> In an orthogonal design, the order in which terms enter the model does not affect their sums of squares. In a non-orthogonal design, it can.

Then show something like:

```r
anova(lm(y ~ A + B, data = dat))
anova(lm(y ~ B + A, data = dat))
```

and explain why the tables can differ in unbalanced data.

Then connect that directly to what you're teaching now:

```r
anova(reduced_model, full_model)
```

is valuable because **we explicitly state the comparison we want**.

That gives students a much more robust way of thinking than memorising Type I/II/III terminology.

I would mention Type I/II/III here, but I probably would not make them a major topic. Something like:

> Different ANOVA “types” are different ways of defining adjusted hypotheses in a non-orthogonal design. We will generally avoid ambiguity by writing the reduced and full models corresponding to the scientific question and comparing those directly.

That is rigorous and practically useful.

It also explains why `car` is loaded at the start of the current Lecture 26 despite not actually being used.  Either use that topic or remove `car`.

### Lecture 27 needs a stronger distinction between inference and prediction

This is probably the most important missing idea in the whole sequence.

At present Lecture 27 starts from:

> What is the best group of explanatory variables?

But there isn't one universal “best model”.

I would put a slide very early saying:

```text
Why are we building the model?

Inference / explanation
    Estimate and interpret particular effects.
    Variables may need to remain because of the scientific question,
    even if their p-values are large.

Prediction
    We care mainly about performance on new observations.
    Interpretability may be secondary.

Description
    We may want a compact representation of patterns in this dataset.
```

That then makes the rest of 27–29 make much more sense.

It also prevents students from learning the dangerous rule:

> delete anything with \(p>0.05\).

### A second missing idea in Lecture 27: model hierarchy

This follows directly from Lectures 24–26.

If you have

```r
Y ~ A * x
```

and the interaction is retained, you normally retain `A` and `x` as well, even if one of their coefficient p-values is large.

Similarly, a factor with four levels is **one model term**, not three unrelated dummy variables that you individually select based on p-values.

I would explicitly teach:

> **Select meaningful model terms, not arbitrary coefficients.**

This prepares them for `drop1()` in Lecture 28 and also explains one of the awkward differences between lasso and ordinary term-based model selection.

### Lecture 28 is currently trying to do too much

It contains:

* forward selection;
* backward selection;
* stepwise selection;
* F-test criteria;
* AIC;
* `step()`;
* ridge;
* lasso;
* orthogonal closed-form solutions;
* penalty geometry;
* standardisation;
* `glmnet`;
* cross-validated lambda selection;
* coefficient paths;
* Seoul model comparisons.

That is really dense.

I don't necessarily think you need another lecture, but I would simplify the job of Lecture 28 to:

> **How can we automate model complexity decisions, and why might we shrink instead of select?**

The biggest missing piece is **cross-validation**. At the moment `cv.glmnet()` appears and `lambda.min` is described, but students have not really been taught why this is different from training error.

That needs a simple visual:

```text
Data

Fold 1    validate here, train on the rest
Fold 2    validate here, train on the rest
Fold 3    validate here, train on the rest
...
         ↓
average validation error
```

Then:

* training RSS always favours flexibility;
* cross-validation asks how well the model predicts unseen observations;
* `lambda.min` minimises estimated prediction error;
* `lambda.1se` trades a little estimated accuracy for more regularisation.

This also means I would **remove the current training-MSE horse race** between stepwise, ridge and lasso, or redo it using a common resampling scheme. Your own lecture eventually says training MSE is not a fair estimate of future performance, which is correct. It should not first present the unfair comparison as though it were the main quantitative comparison.

### I would shift some ridge theory from 28 to 29

The orthogonal result

$$
\hat\beta_j^{ridge}
=
\frac{n}{n+\lambda}\hat\beta_j^{OLS}
$$

is nice, but it probably belongs better in Lecture 29.

Then the progression becomes:

**28:** shrinkage exists, ridge versus lasso, lasso can select, CV chooses lambda.

**29:** why shrinkage is especially useful when predictors overlap; orthogonal case gives simple shrinkage, correlated case gives coefficient rebalancing.

That makes 29 feel like a genuine continuation rather than a partial repeat of 28.

### Lecture 29 has one technical distinction that needs sharpening

You currently move fairly quickly from exact dependence to “multicollinearity”.

I would explicitly distinguish:

**Exact collinearity**

$$
X_3 = X_1 + X_2
$$

The design matrix is rank deficient. Some parameters are not uniquely estimable.

versus

**near multicollinearity**

$$
X_3 \approx X_1 + X_2
$$

The parameters are estimable, but their variances can become very large.

That gives students a very clean reason for VIF.

And I would be careful with statements like:

> if two variables are highly correlated, it doesn't make sense to keep both.

That is too strong.

The better statement is:

> Strongly overlapping predictors can make their **separate coefficients** difficult to estimate precisely.

You may still need both predictors because of the scientific question, adjustment strategy, or prediction task.

Also worth saying explicitly:

> **Multicollinearity does not itself bias OLS estimates.**

It increases variance and makes coefficient attribution unstable.

### Lecture 30 is conceptually good, but it needs a clearer transition

I would open it with:

> Until now we have changed the **mean structure** of the model: which predictors are included and how they enter. Weighted least squares changes something different. It allows observations to have different error variances, so some observations contribute more information about the regression line than others.

Then teach the fundamental weight rule first:

$$
w_i \propto \frac{1}{\operatorname{Var}(Y_i)}.
$$

The sample-size case becomes a consequence:

If a point is a group mean based on \(n_i\) observations and the individual variance is common,

$$
\operatorname{Var}(\bar Y_i)=\frac{\sigma^2}{n_i},
$$

so

$$
w_i \propto n_i.
$$

If group variances differ,

$$
w_i \propto \frac{n_i}{\sigma_i^2}.
$$

That is cleaner than initially teaching “weight means amount of information” and only deriving the variance interpretation much later.

### There are also a few technical fixes already visible

These don't require changing the overall course design, but we should catch them during the detailed pass.

The current Lecture 26 learning objectives include centring as something recalled from Lecture 25, but the revised Lecture 25 doesn't actually teach centring.  Either remove that from 26 or deliberately add a small centring section to 25. I lean towards removing it unless you need the interpretation of main effects at \(x=0\).

In Lecture 27, the current formula labelled residual standard error \(S\) is actually an MSE expression. It needs the square root:

$$
S=\sqrt{\frac{RSS}{df_{\text{residual}}}}.
$$

Also, “we should include variables with slightly larger p-values to avoid bias” needs qualification. That can be reasonable in some inferential settings, but p-value based inclusion is not a general protection against omitted-variable bias.

### So the global architecture I would lock is

**23–24:** factors, orthogonality, interactions
↓
**25:** combine factors and continuous covariates into one linear-model framework
↓
**26:** compare **prespecified nested models** using partial F tests
↓
**27:** move from one comparison to the broader problem of **choosing a model**
↓
**28:** automated search and penalisation, with **cross-validation** as the bridge to prediction
↓
**29:** overlapping predictors explain why selection and coefficients can become unstable
↓
**30:** after sorting out the mean model, allow the **variance/information structure** to vary

I think that is a very coherent second-year regression sequence.

Once we agree on that architecture, I would go lecture by lecture in order, starting with 26, and for each one do three passes: **technical correctness → conceptual flow → visuals/examples**. Only after 25–30 are stable would I touch the weekly labs. Then we can explicitly map every core learning objective to at least one lab task, rather than patching the labs piecemeal.


Yes. I would redistribute rather than cut. Lecture 28 is heavy largely because it is currently introducing **the criteria, the algorithms, the prediction framework, and penalisation all at once**.

The cleanest redistribution would be:

| Lecture | What to move/add                                                                                                                                                                                                                                |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **25**  | Add only the idea that the five GLMs form a hierarchy of increasingly flexible models. No testing yet.                                                                                                                                          |
| **26**  | Nested models, partial F tests, RSS reduction, \(F=t^2\) for 1 df, orthogonal vs non-orthogonal comparisons. End with: “So far we have compared models we chose in advance.”                                                                    |
| **27**  | **Move AIC here.** Also introduce the distinction between training fit and future prediction, and introduce **cross-validation conceptually**. Cover bias/variance, adjusted \(R^2\), residual SE, AIC, and model hierarchy.                    |
| **28**  | Forward/backward/stepwise selection, then ridge/lasso as an alternative to discrete selection. Because AIC and CV are already known, you can immediately use `step()` and `cv.glmnet()` without teaching the evaluation machinery from scratch. |
| **29**  | Move the **orthogonal ridge/lasso mathematics** here, along with the geometric ridge/lasso picture if you want it. Then use multicollinearity to explain why ridge becomes especially useful.                                                   |
| **30**  | Weighted regression as currently planned, but explicitly shift from modelling the mean to modelling unequal precision.                                                                                                                          |

The two most useful things to move **earlier** are AIC and cross-validation.

AIC belongs naturally in Lecture 27 because that lecture already asks:

> How do we compare plausible models when there isn't one prespecified hypothesis test?

You already discuss \(R^2\), adjusted \(R^2\), \(S\), and p-values there. AIC is simply another model-selection criterion. Holding it until Lecture 28 means Lecture 28 has to explain AIC before it can even explain why `step()` is doing what it does.

So Lecture 27 can develop a progression like:

$$
\text{fit} \rightarrow \text{fit adjusted for complexity} \rightarrow
\text{estimated predictive performance}
$$

with roughly:

```text
RSS / R²
    ↓
Adjusted R² / residual SE
    ↓
AIC
    ↓
Validation / cross-validation
```

Not because those are mathematically the same thing, but because they represent increasingly explicit ways of asking whether added complexity is worthwhile.

Then when you reach Lecture 28:

```r
step(model, direction = "both")
```

you can simply say:

> Here we automate the model search using AIC, which we introduced last lecture.

Likewise:

```r
cv.glmnet(...)
```

becomes:

> We use cross-validation, introduced last lecture, to choose the amount of penalisation.

That saves a surprising amount of cognitive load.

I would also move **“select model terms, not individual dummy coefficients”** into Lecture 27. It belongs with general model selection and follows nicely from 24–26. Students should know before they meet automated selection that dropping one dummy from a four-level factor is not normally how we conceptualise selecting that factor.

Where I would *not* move material earlier is the ridge/lasso derivation. The current Lecture 28 has this whole sequence:

$$
RSS+\lambda\sum\beta_j^2
$$

orthogonal predictors,

$$
\hat\beta^{ridge}_j
=
\frac{n}{n+\lambda}\hat\beta^{OLS}_j,
$$

soft thresholding for lasso, then the circle/diamond geometry.

That is good material, but it interrupts the main story of Lecture 28.

I would introduce ridge and lasso much more simply in 28:

> Stepwise selection makes discrete decisions: a term is either retained or removed. Penalised regression takes another approach. Keep a larger model, but penalise coefficient magnitude.

Then show:

$$
RSS+\lambda\sum\beta_j^2
$$

versus

$$
RSS+\lambda\sum|\beta_j|
$$

and immediately show the consequences:

```text
Ridge → coefficients shrink
Lasso → coefficients shrink and some can become zero
```

Then fit them.

Save **why** ridge behaves especially nicely under orthogonality, why lasso has corners, and what happens when predictors are correlated for Lecture 29.

That actually makes Lecture 29 much better too. You can begin:

> Last lecture we saw that ridge shrinks coefficients. Why might that be particularly useful?

Then introduce multicollinearity.

You can contrast:

$$
X^TX \text{ nearly diagonal}
$$

with

$$
X^TX \text{ containing substantial off-diagonal structure}.
$$

Now the orthogonal ridge formula is not an isolated piece of mathematics. It establishes a baseline:

> With orthogonal predictors, ridge just shrinks each coefficient cleanly.

Then:

> With correlated predictors, things are more complicated because the coefficients are estimated jointly and compete to explain overlapping information.

That leads directly into VIFs and the Seoul example.

There is also a small thing I'd move into **Lecture 25**. Not model comparison itself, just the visual hierarchy:

```text
             A * x
            /     \
         A + x
        /     \
       A       x
        \     /
           1
```

Then 25 says:

> These are different possible mean structures.

Lecture 26 begins:

> Last lecture we saw that some of these models are special cases of others. That gives us a formal way to test whether the extra flexibility is needed.

That makes 26 feel like the inevitable next lecture rather than a new topic.

So the sequence becomes quite elegant:

**25:** What models could we fit?
**26:** Does adding these particular terms improve the fit enough to justify them?
**27:** What if there are many plausible models and no single prespecified comparison?
**28:** Can we automate the search, or avoid discrete search by shrinking coefficients?
**29:** What happens when predictors overlap, and why does ridge help?
**30:** What if observations themselves have different precision?

With that redistribution, I don't think 28 is too much. The current version is too much because it has to teach AIC, CV, stepwise, ridge, lasso, shrinkage mathematics and `glmnet`. Taking **AIC + CV earlier** and **ridge/lasso theory later** leaves 28 with one coherent job: **methods for controlling model complexity**.
