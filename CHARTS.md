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

## The two earned additions (v2 — real articles demanded them)

Per the growth rule below, two jobs have earned a template:

| The job (sub-question) | Chart | Earned by |
|---|---|---|
| **The pace** — it's moving, but is it moving *fast enough*? | line + labeled benchmark path (ghost/dashed) | the green-transition article: direction alone is a half-truth there; the verdict is the *gap* between the actual line and the needed line, widening or closing. The benchmark must be a named, sourced target (e.g. a stated scenario), never our invention |
| **The cross-section** — how does it stand *now*, place by place? | ranked horizontal bars (`src/lib/bars.ts`, `barChart()`) | one-vintage data with no time series; "where it is / isn't happening" rankings. **Built 2026-06-12** by the poverty article's MPI and Gini spreads (`mpi-by-country` / `gini-by-country`, emitted by `scripts/analysis/poverty-cross-sections.ts` as bespoke `kind: 'bars'` artifacts, special-cased in `buildMovements`). The flagship's stranded IPV 2018 cross-section can now use it. Colours are temperature tokens resolved to literal hex; the smoothing disclaimer is gated off for bars |

Same bake-ins as the eight (temperature colours, watermark, four artifacts, text summary).
The pace template carries a mandatory figure note naming whose benchmark it is.

## The third earned addition (2026-06-18)

| The job (sub-question) | Chart | Earned by |
|---|---|---|
| **The divergence grid** — across many measures at once, where does each place stand *relative to the others*? | heat grid, region × measure (`src/lib/heatgrid.ts`, `heatGrid()`, `kind: 'heatgrid'`) | the progress article's closing synthesis: every movement reads one measure across regions, but the *thesis* is the region×measure interaction, which no single line can show. One cell per region/measure, **shaded per-row** from the worst region (despair red) to the best (hope green). **Hard rule against the dashboard trap:** each row is scaled independently — there is **no cross-row composite**, because colour must never imply a year of life and a point of poverty share a scale. Columns ordered by one *declared* variable (GDP per person), not a hidden ranking. Use only as an end-of-piece synthesis of measures already shown, never as a substitute for the narrative charts |

Same bake-ins (temperature colours, watermark, portrait mobile twin). Cell text colour is set via inline
`style="fill:…"`, never the `fill` attribute — Chart.astro's `.chart text { fill }` rule would otherwise
override it. No CSV/PNG twins (like bars/area, it sets `dataRef: undefined`).

## The grammar — how charts compose into one answer

A single chart answers a sub-question; the *sequence* answers the question. The order is not
aesthetic — it is the argument. Default arc (the magnification narrative, macro → micro):

1. **The long arc** — the deep, global line. Establish the trend before anyone argues with it.
2. **The break** — zoom to the recent window; date and name what changed. (Same metric,
   new window.)
3. **Who the average hides** — disaggregate: regions, then the hardest-hit entity. The
   world line stays in the frame, flat and false-looking, while a real place diverges.
4. **The mechanics** — why it moves: composition, spread, relationship, pace. (New metrics
   enter only here, once the headline metric is fully understood.)
5. **The single fact** — close the section at human scale: one number in prose, felt.

Three rules make a 20-chart article read as one argument instead of a gallery:

- **Change one thing at a time.** Between adjacent charts, vary exactly one of: time window,
  entity set, metric, or job. If two change at once, the reader silently loses the thread —
  insert the intermediate chart or cut one of the changes.
- **No orphan world-lines.** Any chart showing a global average owes the reader its
  disaggregation before the vantage ends ("who the average hides" is a debt, not an option).
- **Temperature continuity.** A verdict flip (cool→warm) between adjacent charts is the
  thesis working — but it must be *explained at the seam* by the prose, never silently.
  The lens did the flipping; say which lens.

## What every template bakes in (once)

- The **temperature** colours (hope/despair/uncertain), never a stoplight, no glow.
- The **`hopeanddespair.world` watermark** baked into the SVG (survives crops/exports).
- The four **artifacts**: `chart.svg` (page), `chart.png` (share/OG), `chart.csv` (download),
  `chart.json` (lens spec). Downloads are links to pre-baked artifacts, not client-generated.
  *Status 2026-06-11:* the standalone SVG ships — `/charts/<dataRef>/fig<N>.svg`, built by the
  `src/pages/charts/[ref]/[name].svg.ts` endpoint from the same `buildMovements()` the article
  page uses (vars resolved to literals, styles embedded). PNG remains pending (needs a
  build-time rasterizer).
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

## Mobile render — the portrait twin (2026-06-14)

A phone can't read a 920×466 chart scaled to ~360px: the plot becomes a 220px strip and a
multi-line chart's right-edge end-labels crush into 6px mush. Zero-JS rules out re-laying-out on
the client, so **each line/bar/scatter renderer bakes a second, portrait SVG** alongside the
desktop one (`Rendered.m`). `<Chart>` (`src/components/Chart.astro`) emits both and a CSS media
query (≤680px) swaps them; the downloadable artifact always uses the desktop `inner`, so the two
can't drift. The mobile twin:

- a near-1:1 viewBox (≈390 wide) so **baked** font-px ≈ rendered-px — no CSS scale-bump guessing;
- **a legend on top** (swatch + name + value, packed into rows) instead of crammed end-labels —
  the NAME in the display grotesk, the VALUE in mono (the editorial-data mix, not a spreadsheet);
- a **label-collision registry** (`fullChartMobile`): ticks, ref-lines, eras, callouts and the
  end value each book a box; movable labels nudge to the nearest free slot;
- a **white halo** (`paint-order: stroke`) on in-plot labels so they read over lines/area fill;
- subsampled x-ticks, thicker lines, bars with the name **above** each bar (no wide left gutter).

Cost: the dual render roughly doubles a page's chart payload (offset partly by dropping path
precision to 1 decimal — sub-pixel at 920u). Two deliberate-exception budgets were raised
(keystone 120→168 kB, climate 100→130 kB); regular article pages got *lighter*. 80% of readers
are on phones — the twin is the priority surface, not an afterthought.

**Verified.** A geometric audit (`getBBox` per label → clip-past-viewBox + pairwise overlap) was
run over every mobile chart on all ten pages (~220 charts): zero clipped or overlapping labels.
The footer under each figure was also calmed — the download links recede to the source's weight
(faint, hover-underline) instead of a button-bar, so the metadata never shouts.

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

- **Era-annotation dodging — done (2026-06-10, `src/lib/charts.ts` `fullChart`).** Era-line
  labels used to share one baseline and overprint when eras sit close (First/Second World
  War). Now: estimate the label box, flip it to the right of its line when it would clip the
  left margin, drop to a second row on overlap. Callout labels render in serif italic
  (13.5px); ticks 14px, series labels 14.5px — sized for the ~0.9× viewBox scale-down.
- **Slope** needs label-collision avoidance when two entities share a near value (visible in
  the mockup). Fix in `render-charts.ts`: dodge labels vertically; drop the value when the
  name is enough.
- **Stacked / 100%-stacked area** is built in `src/lib/area.ts` (`kind: 'area'`, normalised to
  share per year, bands directly labelled at the right edge, fill-opacity 0.74) — first used for
  the debt article's creditor-shift-over-time chart. The renderer draws **straight** segments
  between annual points; where a stock series whipsaws year to year (e.g. defaulted-debt shares
  jumping as one big country defaults or cures), **smooth the underlying amounts in the analysis
  script** (a centred multi-year moving average with edge replication so the true endpoints
  survive — see `creditor-history.ts`) rather than in the renderer, and **disclose it in the
  figure caption** ("· 5-year smoothed"). The endpoint must keep its real value: a plain shrinking
  window silently muted the China-overtakes-Paris-Club crossover, the chart's whole point.
- **Stat-in-prose** is HTML/CSS, not SVG — it has no downloadable artifact by design.

## Performance note

Template *count* has **zero** runtime cost — charts are pre-baked static artifacts, so this
is a build-time authoring concern only. The "fast even at thousands of charts" guarantee comes
from the architecture in [[PERFORMANCE.md]], not from limiting the kit.
