# Article plan — *Is it too early to know if AI is good or bad?*

**Status: PLANNED (scoped 2026-06-27).** A new question, earned by the fact that AI is now the
single most-measured technology in human history — and we still cannot agree what it *is*, let alone
what it is doing to us. **The title makes earliness + uncertainty the subject** (chosen over "is AI
making the world better or worse?", which over-promises a verdict, and "what might it do?", which
over-invites a forecast — the two failure modes the spine exists to refuse). The honest answer to
the title is *"yes — and learning to hold that is the most useful thing this piece can give you."* Companion to [[NORTH_STAR.md]], [[WRITING.md]], [[CHARTS.md]], [[DATA.md]], [[EXPLAINERS.md]].
Template: [[ARTICLE-violence-plan.md]] / the debt + jobs-challenge builds. Atlas roster: see
[[DATASET-ATLAS.md]] §Q17.

## The question and why it's distinct

Not "will AI kill us?" (that is one *axis inside* this piece, not the frame) and not "can the world
create enough jobs?" ([[ARTICLE-jobs-challenge-plan.md]], Q16 — where AI is a two-beat *act*, the
exposure + connectivity-divide fork). This is the whole-question front door for AI itself: **a
living atlas of what we can and cannot measure about the most instrumented technology ever built.**

## The spine — *a map of our not-knowing* (uncertainty is the subject, not the tiebreaker)

The article **refuses to take a side on what happens.** The honest center is not a balanced
hope/despair scorecard — it is **radical, structural uncertainty, made the subject of the piece.**
Three admissions, front and centre, before any chart earns the right to appear:

> **(1) Nobody agrees what "AI" even means** — the word smears across LLMs, machine learning,
> automation, and AGI sci-fi; the referent moves every time something works (the "AI effect"). **(2)
> We have mistaken transformations like this before, in *both* directions** — over-predicting doom
> *and* dismissing real upheaval; history rhymes but counsels humility, not a number. **(3) The
> credible forecasts diverge more wildly than for almost any question we have ever posed** — by a
> *quadrillion dollars*. This is a map of that uncertainty, not a verdict on it.

The two-exponentials finding (compute + capability soar and we measure them beautifully; the human
outcome is unmeasured and contested) is **no longer the whole frame — it is one act**: the *island
of things we can actually measure* inside the sea of not-knowing. The data backbone and the
twin-curve device survive intact; they simply stop pretending to be the answer.

Verdict: **confusion — not as a balance struck between hope and despair, but as the honest
description of the epistemic situation.** Like fertility's hard-balance and Q16's refusal to
predict, but deeper: the piece is *about* the limits of our knowing. The form must *enact* the
uncertainty (epistemic tags, refused numbers, the dashed forecast fan), not merely describe it.

### Two intellectual moves the data layer can't supply (new — a research pass owes these)

- **The definition problem** is an *opening act*, not a caveat. McCarthy's 1955–56 coinage
  (Dartmouth); Tesler's "AI effect" (*AI is whatever hasn't been done yet* — chess, OCR, spam
  filters became "just software"). You cannot measure or argue about a thing you cannot define.
- **The historical-analogy act** carries the "we've been wrong both ways" lesson: the **dynamo lag**
  (Paul David 1990 — electrification took ~40 yrs to hit productivity; factories had to be
  redesigned) and the **Solow paradox** (1987); **Engels' pause** (Allen — flat wages through early
  industrialization: the transition can immiserate a generation even when the technology eventually
  lifts everyone); the panics that *didn't* pan out (Luddites, the 1964 Triple-Revolution scare,
  **Bessen's ATMs-and-tellers**); **Amara's Law**. The honest yield is humility, not a forecast.
  Refuse-both has a named home in the literature: **Narayanan & Kapoor, *AI as Normal Technology*
  (2025)** + Acemoglu (skeptic of boom *and* doom). *All historical claims here go through the
  number-audit + an adversarial verify pass before prose — vintages/attributions unconfirmed.*

### The signature device — **the twin curve** ([[EXPLAINERS.md]] candidate)

One artifact carries the thesis: capability and cost drawn as two near-parallel exponentials
(both racing up, both *certain*), then the line we'd actually want — AI's contribution to human
welfare — drawn as a **fan of dashed forecast paths** that splay from ~0 to off-the-top, *quoted
not modelled* (the progress-plan FIG. 17 / [[CHARTS.md]] line 39 benchmark-path pattern). Two solid
curves we trust, one dashed delta we can't. The picture *is* the argument.

## Method — re-host the inputs, transcribe the contested outputs

The licence split maps exactly onto the spine, which is why it works:

- **The two solid exponentials (M1–M4) ride re-hostable CC-BY data** — Epoch + OWID. Cheapest path
  first: **OWID re-publishes most of Epoch under CC BY**, so the existing `owid` adapter carries the
  capability/compute/adoption/electricity/public-opinion load with *zero new code*. Build the new
  `epoch` adapter only for series OWID doesn't mirror (data-centre power, chip owners, inference
  price, cluster detail).
- **The contested outputs (M5–M8) are link-only** — FRI, Anthropic Economic Index, METR, the
  p(doom) survey, AI Index, AI Incident DB. Charted via the **transcribe-chart-pack pattern**
  (jobs-challenge / debt builds): re-create the figure as our own inline SVG from the source's
  *published numbers*, link `↓ source` out, never re-host their data. Every transcribed number goes
  through the manual number-audit invariant before it touches prose.

The discipline to hold: **never let the contested layer borrow the authority of the measured
layer.** M5–M8 must wear their epistemic tags loudly — these are forecasts and one-vendor samples,
not the firm ground of M1–M4.

## The eight movements (the arc)

1. **Two exponentials** (M1) — open on the hope curve at its cleanest: AI capability crossing human
   baselines across tasks (OWID *test-scores-vs-human-performance*, CC BY) over Epoch's
   training-compute climb (5×/yr since 2020). The thing we measure best is racing, and we're *sure*.
2. **Cheap as water** (M2) — the democratizing exponential: inference price falling ~40×/yr (Epoch),
   generative-AI adoption vs GDP-per-capita (OWID). As fast as it centralizes, it spreads.
3. **The bill** (M3) — the despair exponential, same shape inverted: training cost 3.5×/yr, the
   ~$38B-per-gigawatt data centres, rising data-centre share of electricity (Epoch data-centres +
   OWID electricity-share). Capability isn't free; someone pays in power and carbon. **Q3/Q4
   boundary** — the energy cost hands *to* the climate/transition articles, as air-pollution's
   wildfire beat hands to Q3.
4. **Where the power sits** (M4) — concentration: industry built >90% of 2025's notable models; the
   US shipped ~50, the rest of the world ~7 (OWID *cumulative-models-by-country* + Epoch chip
   owners). The most powerful general technology ever, owned by a handful of firms and one country.
5. **What it does to work — today, measured** (M5, *link-only*) — leave forecasts, show the one real
   measurement: Anthropic Economic Index — augmentation 52% still leads automation 45%, but ~49% of
   jobs have a quarter of their tasks touched, the use skewing mid-to-high wage then broadening down.
   The honesty beat: *this is one model's users, not "AI" — the best evidence we have is a keyhole.*
6. **The quadrillion-dollar guess** (M6, *link-only*) — pivot to the future and the article's
   thesis-in-miniature: the FRI five-camp forecast spread (economists / industry / policy /
   superforecasters / public), conditioned on capability scenarios — and the reveal that **the
   disagreement is about the economics, not the technology** (even inside the rapid scenario, 2050
   labour-participation forecasts span 45–65%). The twin-curve's dashed fan lives here.
7. **The other argument entirely** (M7, *link-only / take-strip*) — the existential axis that
   *cross-cuts* the economic one: a positions strip from p(doom) ~0 (LeCun) → ~99% (Yampolskiy),
   with the builders'-flip beat (Hinton left Google 2023; Bengio redirected his research). The point
   is the non-alignment: optimism on jobs doesn't predict optimism on survival. Acemoglu anchors the
   *refuse-both* center (skeptic of boom and doom alike).
8. **The governance gap + verdict** (M8) — who gets protected is *itself* contested: experts back
   targeted retraining (~72%), the public wants broad job guarantees (57% vs 14%) (FRI policy split +
   OWID automation-worry / 20-year-impact opinion, CC BY). Close on **confusion, earned**: the
   inputs are exponential and certain, the outcomes unmeasured and contested — both camps are reading
   the same charts. The twin curve returns as the closing image.

## Data — what's new vs reused vs cited

| Layer | Source | Path | Gate |
|---|---|---|---|
| capability vs human, compute, parameters, adoption, electricity share, models-by-country, investment, incidents, public opinion | **OWID AI page** (re-publishes Epoch + AI Index) | **existing `owid` adapter** — do first | CC BY → re-host |
| data-centre power, chip owners/sales, inference pricing, GPU clusters, the trend headline rates | **Epoch AI** (11 datasets, all CC BY, daily) | **new `epoch` adapter** *only where OWID doesn't mirror* | CC BY → re-host |
| the five-camp forecast spread + variance decomposition + policy split | **Forecasting Research Institute** | transcribe-chart-pack → inline SVG, cite/link | link-only (no open-data licence) |
| measured augmentation/automation by task & occupation | **Anthropic Economic Index** | transcribe; Hugging Face tables **verify licence** before any re-host | link-only until verified |
| task-time-horizon doubling | **METR** | cite the published 7-month doubling; chart from numbers | link-only (carries a "do-not-train" canary, not a reuse licence) |
| p(doom) distribution + the why-experts-disagree split | **Field et al. 2025 survey** + signed statements | take-strip from published figures | link-only / cite |
| master compendium cross-checks (investment, opinion, policy) | **Stanford HAI AI Index** | cite; re-derive from underlying only | **CC BY-ND** → never re-host figures |
| real-world harms (optional despair texture) | **AI Incident Database** | snapshot; **verify licence** | unconfirmed → cite/link |

**Priority path:** OWID AI graphers first (M1–M4 + M8 almost entirely, zero new code) → the
`epoch` adapter for the power/cost/concentration detail M3–M4 want → the transcribed link-only
layer (M5–M7) last, each behind an epistemic tag.

## Honest gaps to name in-piece (the refused-counterfactual move)

- **No measured AI→GDP series exists.** Everything macro is forecast; M6 must *say* so. We refuse to
  manufacture an "AI added $X to GDP" number — the same refusal as progress-plan's poverty
  counterfactual.
- **The work evidence is one model's keyhole.** Anthropic Index = Claude users' tasks, not "AI's
  effect on work." Disclose the sampling bias as loudly as the finding (M5).
- **Benchmarks saturate and contaminate.** Capability measurement gets *harder* exactly as the
  stakes rise — a despair note hiding inside the hope curve (M1 caveat).
- **Compute/capability ≠ deployment ≠ impact.** The whole spine is the gap between what we measure
  (inputs) and what we mean (outcomes); the article never lets the first stand in for the third.

## Open questions to resolve at build time

- Title resolved 2026-06-27: ***"Is it too early to know if AI is good or bad?"*** The sharper,
  inequality-loaded *"Will AI make us richer — or just a few of us?"* (top-10% wealth-share → 80% in
  the rapid scenario) survives as **M6's kicker line**, not the title.
- Whether the twin-curve earns standalone-device status in [[EXPLAINERS.md]] or stays a one-off.
- Kicker number + theme assignment (proposed Q17, theme "Technology").

## Regenerate (once built)

```
pnpm data ONLY=ai.                 # pull the OWID AI graphers (+ epoch adapter if built)
npx tsx scripts/analysis/ai.ts     # transcribe the link-only figures + print number audit
pnpm verify
```
