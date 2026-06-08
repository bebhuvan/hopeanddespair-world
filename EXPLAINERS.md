# Explainers — how we stand out

> Anyone can show a chart. The whole project lives in *how we explain it.*
> Companion to [[WRITING.md]] (the voice), [[CHARTS.md]] (the kit), [[NORTH_STAR.md]] (the why).

## The positioning, in one line

Most data sites do **charts + captions**. Our differentiator is the combination of three
things almost nobody puts together:

1. **The thesis, *shown* — statically first.** We demonstrate "the answer depends on the
   lens" by placing the same data at every magnification side by side, with the verdict
   flipping across them in plain sight. No slider required to get the point. (Interactivity is
   an optional *later* enhancement — never load-bearing, never day-one; see Pillar 1.)
2. **Radical epistemic honesty, made visible** — we don't bury uncertainty in a methodology
   footer; we put our confidence, our blind spots, and our falsifiability *on the surface.*
3. **Layperson-first scaffolding** — every barrier to a non-expert is removed by design, not
   left to the reader to climb.

A chart can fail on its own. A chart wrapped in these three rarely does. That triple is the
moat — not any single widget.

---

## The repertoire

Each is a reusable format (a component the pipeline can emit), not a one-off. **★ = signature**
(do these everywhere; they define us). The rest are supporting; use where the material asks.

### Pillar 1 — show the thesis, statically first

The default is **static and fast**. Beautiful charts + brilliant prose are the permanent
core; an article must be complete, fast, and fully understandable with **zero JavaScript**.
(Decision, 2026-06-08: interactivity is never load-bearing or day-one — see [[PERFORMANCE.md]]
· static-first.)

- **★ The four-magnification row (static).** The signature move: the same metric shown at
  four windows side by side — *deep history → since 1900 → since 2020 → a lived day* — each
  with its own verdict word, coloured by temperature. The reader's eye travels left to right
  and *sees* the verdict flip from YES (cool) to NO (warm). The thesis, enacted, with nothing
  to discover or operate — and often clearer for a layperson than a slider. (Demonstrated in
  `mockups/article-v5.html`.)
- **★ Two readings of one line (static).** The same chart annotated twice — the optimist's
  reference points and the pessimist's — stacked. Same numbers, both honest stories.
- **The small-multiple signal grid (static).** Five signals at a glance; the composite
  "4 of 5 point to deterioration" read straight off them.

**Optional progressive enhancements (post-launch, never required, never day-one):** a *lens
slider* that re-windows in place, and *"in your lifetime"* (enter a birth year, re-anchor to
your lived window — the origin insight made literal). These layer onto the static page as a
tiny island that hydrates only if present; the page works fully without them. They are the
*cherry, not the cake.*

### Pillar 2 — epistemic honesty, made visible

- **★ The Take strip.** Under every chart, three short reads — **hope / despair / confusion** —
  so nuance is structural, not editorialising. Confusion is first-class. (Built.)
- **★ Epistemic-status tag.** A small, visible label on each chart/claim: *measured ·
  estimated · reconstructed · contested.* We tell the reader how solid the ground is *before*
  they stand on it. Almost no consumer data site does this; it is the honesty creed, made UI.
- **What would change my mind.** A falsifiability note — per article (built, §III) and, where
  it earns it, per chart. Stating what would overturn the claim is the strongest trust signal
  there is.
- **★ "What the data can't see."** A recurring box for the **illegible** — where the numbers
  run out and human experience begins. A data site that marks its own blind spots as a
  *feature* is rare and unmistakably ours. (Honours the brief's "fuzziness of human existence.")
- **The honest caveats panel.** Disclosure *before* the evidence, not buried after. (Built.)

### Pillar 3 — layperson-first scaffolding

- **★ "Still lost? Read this."** The closing box: 2–4 warm, jargon-free paragraphs that
  re-explain the whole article from zero, so a reader who bounced off every chart still leaves
  able to hold the gist at a bar. The one openly playful moment. (Spec in [[WRITING.md]].)
- **"How to read this."** A one-tap micro-guide on any non-trivial chart: what the axes mean,
  what to look for, in one sentence. We assume *zero* chart literacy and remove the barrier
  instead of pretending it isn't there.
- **Definition boxes (auto).** The first time a hard term appears, a quiet inline gloss. (Spec
  in [[WRITING.md]].)
- **Generous Wikipedia links.** One unobtrusive link per important concept — Wikipedia is a
  deliberate ally of the layperson mission. (Spec in [[WRITING.md]].)

### Structural format (cuts across all three)

- **★ Progressive depth.** Every section is readable at three depths, reader's choice:
  the **one-line claim** (skim) → the **prose explainer** (read) → the **methodology & source**
  (dig). The "Still lost?" box is the floor; methodology is the ceiling. This is how we serve
  the bus-rider *and* the obsessive in the same article — Smart-Brevity spine, long-form body.
- **Question-driven flow.** The article is a question; each chart is a sub-question whose
  answer raises the next. The reader is led by curiosity, not lectured — that is how one
  question honestly holds 10–50 charts ([[WRITING.md]] · anatomy).

---

## What to build first (so the moat shows early)

In leverage order — **all static**, no island required:

1. **The four-magnification row** — the static signature; carries the thesis on its own.
2. **Epistemic-status tag** — cheap (a data field + a chip), instantly differentiating.
3. **"Two readings of one line"** — two static annotations of the same chart; pure thesis.
4. **"What the data can't see"** + **"How to read this"** — small components, big trust.

None require JavaScript. *Optional, later:* the lens slider and "in your lifetime" as a tiny
hydrate-only-if-present island ([[PERFORMANCE.md]]) — the page is already complete without them.

> The test for any new explainer format: does it make the reader **more honestly uncertain**,
> or just more entertained? Keep the first kind.
