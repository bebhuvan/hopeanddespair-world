# Charts — the kit

> A small, opinionated vocabulary organised by the **job each chart does** — not a catalogue
> of types. Pick by the job; compose; grow only on real demand.
> Visual spec lives in `mockups/charts.html`. Companion to [[DESIGN.md]] and [[PERFORMANCE.md]].

## The principle

A *big list* of chart templates is the same trap as the boxy design: more surface area, more
ways to drift generic or loud, more to maintain — and it tempts the pipeline (and the LLM)
into a flashy type that breaks the minimal ethos. **Refine by subtraction applies to charts.**

So we don't organise by chart taxonomy (line/bar/pie). We organise by the **rhetorical job** —
because in our articles every chart answers a sub-question ([[WRITING.md]] · every chart is a
sub-question). The author/LLM picks the *job*; the template is fixed.

## The eight (v1)

| The job (sub-question) | Chart | Notes |
|---|---|---|
| **The long arc** — up or down over the long run? | single line / area | the core primitive; drawn small ×N = the lens signal grid |
| **The recent break** — did something change, and when? | line + dated annotation | one marker names the cause without a paragraph |
| **Who the average hides** — does one number mask different realities? | multi-series lines | the flat "world" line beside a country in crisis |
| **The spread** — how unequal across places/people? | range / dot strip | same primitive as the home atlas, on real values; mark the average |
| **Before & after** — who moved, who didn't? | slope chart | slope + colour, no legend; *needs label-collision dodging (see Refinements)* |
| **The composition** — what is it made of, over time? | stacked area | **used sparingly** — stacks mislead; never decorative |
| **The relationship** — does X track Y? | scatter | **handle with care**; highlight one point; prose must say correlation ≠ cause |
| **The single fact** — one number that should stop you | stat-in-prose | typography in the flow, **never a KPI card**; always paired with a human-scale line |

The lens **signal grid** is not a ninth type — it's "the long arc" primitive at small size,
×N. That's the whole point: **a few primitives that compose** beats fifty bespoke types.

## What every template bakes in (once)

- The **temperature** colours (hope/despair/uncertain), never a stoplight, no glow.
- The **`hopeanddespair.world` watermark** baked into the SVG (survives crops/exports).
- The four **artifacts**: `chart.svg` (page), `chart.png` (share/OG), `chart.csv` (download),
  `chart.json` (lens spec). Downloads are links to pre-baked artifacts, not client-generated.
- An **accessible text summary** (`aria-label` / `<desc>`) + the CSV as the data table —
  layperson- and screen-reader-friendly.
- **Monotone-cubic smoothing** (Fritsch–Carlson) — cosmetic only, cannot overshoot a real
  value (disclosed in methodology).

## Architecture fit

- **Schema:** add a `type` enum to the `charts` collection ([[PLAN.md]] §6). One source of truth.
- **Render:** each template is a pure `(series, spec) → {svg, csv, json, pngSpec}` in
  `scripts/render-charts.ts`, run **offline/incremental** — re-render only charts whose
  (data + spec) hash changed ([[PLAN.md]] §4).
- **Client:** static inline SVG / `<img loading="lazy">`. **No charting library client-side.**
  Only the interactive lens hydrates (one Astro island). See [[PERFORMANCE.md]].
- **LLM safety:** the author/model picks `type` from the enum — it *cannot* invent an
  off-brand or misleading chart. A constrained set is a feature, not a limit.

## The maps decision

No choropleths / world-map imagery in v1. The anti-cliché bans rule out globe/map decoration
([[DESIGN.md]] §4), **and** choropleths genuinely mislead laypeople (area ≠ population) and are
heavy. For "who the average hides" and "the spread," prefer **ranked bars / range strips /
disaggregated lines**. Revisit only if a question truly needs geography *and* we can do it
honestly and fast.

## Growth rule

Add a ninth template only when a **real article** needs a job none of the eight does — and
when it does, it must bake in everything above. `log()` nothing silently: if a chart is
downgraded to a simpler type for clarity, say so in the figure note.

## Refinements (known, tracked)

- **Slope** needs label-collision avoidance when two entities share a near value (visible in
  the mockup). Fix in `render-charts.ts`: dodge labels vertically; drop the value when the
  name is enough.
- **Stacked** top edges are smoothed but bottom edges are straight (fine at fill opacity);
  revisit if a band reads wrong.
- **Stat-in-prose** is HTML/CSS, not SVG — it has no downloadable artifact by design.

## Performance note

Template *count* has **zero** runtime cost — charts are pre-baked static artifacts, so this
is a build-time authoring concern only. The "fast even at thousands of charts" guarantee comes
from the architecture in [[PERFORMANCE.md]], not from limiting the kit.
