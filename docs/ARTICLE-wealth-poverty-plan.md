# Article plan — *Is the world winning against poverty?*

The Q5 build (atlas: *"Is the world still getting richer — and who is being left behind?"*). A
maximal, long-form piece on the scale of the violence flagship: **~26 chart movements, five
vantages, one question.** Working blueprint — edit as we iterate. Template:
[[ARTICLE-violence-plan.md]]. Architecture: [[DATA.md]]. Datasets: [[DATASET-ATLAS.md]] §Q5.

Status 2026-06-12: **v1 SHIPPED & published** (`src/content/questions/is-the-world-winning-against-poverty.md`,
order 4, kicker 04). Twelve real-data movements across five acts, every chart wired through the pipeline
(0 inline-fallback series); prose passes `prose:lint` (0 fails); `pnpm build` green. See the build log.
The maximal ~26-movement roster below remains the backlog — v1 is the trimmed real-data core.

Status 2026-06-11: **planning.** Unusually, this article is more *assembly* than *ingest* — a large
share of the roster is already on disk from earlier work (poverty by region, income shares, basic
services, working poverty, undernourishment). Two new sources to wire (PIP-direct, OPHI MPI), two
free cuts via the existing WB adapter, several charts derivable from data on hand, and **one vintage
migration** (2017→2021 PPP) that is itself the article's sharpest chart.

---

## 1. The spine — the one-sentence answer

**Yes — the fastest fall in the recorded history of the species — and it stalled after 2020,
climbed up the income ladder faster than people climbed out of it, and reconcentrated into Africa
and the fragile states, so "how many are poor" is less a fact than a choice of where to draw the
line.**

The thesis made structural: *progress and catastrophe coexist; the answer depends on the lens.* Here
the lens is **literally a number** — `$3.00/day` — that a committee chose, and the choice swings the
verdict from *"all but beaten"* (9% of humanity) to *"half the planet"* (the upper line). We never
hedge in prose; every chart carries the contradiction.

The five vantages, each its own act:
- **The 2,000-year arc** → almost everyone was poor; then, after 1820, incomes detonated. *(hope)*
- **The line** → at $3.00, ~9% are extreme-poor; at $8.30, **roughly half the world still is**. The
  ruler makes the number. *(confusion)*
- **The map** → East Asia fell ~80%→~1%; Sub-Saharan Africa's *count* is still **rising**, and now
  holds ~60% of the world's poor, heading for ~9 in 10 by 2030. *(hope + despair)*
- **Beyond money** → ~1.1B are poor in health/education/living-standards terms a dollar never saw;
  ~2.6B can't afford a healthy diet. *(confusion)*
- **What the data can't see** → the whole edifice rests on household surveys that systematically
  miss the rich and, for India, went dark for eleven years. *(epistemic)*

## 2. Structure — five acts, mapped to vantage

Same discipline as the flagship: each act is a **different vantage on one question**, not a new
topic. That keeps ~26 movements one argument, not a gallery. Movements marked † are the maximal set
— trim toward ~18 for v1 (see §9).

| Act | Vantage | Movements |
|-----|---------|-----------|
| I — The long ascent | time / level | M1 the 2,000-year income arc · M2 extreme poverty since 1820 · M3 GDP/cap modern · M4† the pace (people/day leaving poverty) |
| II — How many, really | the line is a choice | M5 the ladder of lines · M6 number of poor (millions) at each line · M7 the line moved, not the people · M8† the line's pedigree ($1→$3) · M9 societal (relative) poverty |
| III — Who climbed, who didn't | region / country | M10 rate by region · M11 number of poor by region (the crossover) · M12 China · M13 India & the 11-year blackout · M14 the new poverty map (Nigeria/DRC/FCS) · M15 mean income by region |
| IV — Poverty isn't only money | definition | M16 MPI vs the dollar line · M17 what *kind* of deprivation · M18 can't afford a healthy diet · M19 the living-standards floor (water/sanitation/power) |
| V — Who the poor are, what holds them, what we can't see | demographic / structural / epistemic | M20 the child & gender face · M21 working poverty & informality · M22† the vulnerable middle · M23 inequality within vs between (the elephant curve) · M24 wealth, not income · M25 the stall & the 100-year horizon · M26 what the survey can't see |

Back matter (mirror the flagship): pull-quote · disciplinary lenses (development economist /
demographer / statistician-of-poverty) · steelmanned hope & despair cases ·
what-would-change-the-verdict · methodology · sources · revisions · "Still lost? Read this." box.

## 3. The analytical core — the eight tensions that make this hope/despair/confusion

These are the *insights* the charts exist to deliver. Each is a place where two true things point in
opposite directions — the article's whole reason to exist. (Figures here are for planning; every one
gets the **manual number audit** against `src/data/derived/*.json` before prose ships.)

1. **The line is a choice, and the choice is the verdict.** The international line has walked
   $1.02 (1990, 1985 PPP) → $1.08 → $1.25 → $1.90 (2011 PPP) → $2.15 (2017 PPP) → **$3.00 (2021
   PPP, June 2025)**. Each is the *mean of the national poverty lines of the ~15–28 poorest
   countries* — principled, but a definition, not a discovery. Move the ruler and ~125M people
   change category with nobody's life changing (M7, M8).

2. **Absolute poverty can be nearly eliminated while relative poverty barely moves.** The World
   Bank's **societal poverty line** = `max($2.15, $1.15 + 0.5 × median)` rises as countries grow,
   so ~**a quarter of humanity** is societally poor and the share has hardly fallen — because growth
   lifts the floor *and* the bar together. You cannot grow your way out of relative poverty (M9).

3. **Between-country inequality is falling; within-country inequality is rising.** Global inequality
   was historically ~⅔ *between* nations; Asia's catch-up shrank that, even as the gap *inside*
   countries widened — the **elephant curve** (Lakner–Milanovic): huge gains for the global middle
   (Asia) and the global top 1%, stagnation for the rich world's lower-middle (M23).

4. **The rate falls while the count rises — in the same place.** Sub-Saharan Africa's poverty *rate*
   declines, but population growth outruns it, so the *number* of poor climbs. The global poor have
   reconcentrated: SSA ~60% today → a projected ~9 in 10 by 2030 (M11, M14).

5. **One country bends the whole curve — twice.** China lifted ~**800M** out of extreme poverty
   since 1981 (the single largest driver of the global fall); India just removed ~**171M** more
   (2011/12–2022/23) — and India's eleven-year survey blackout meant the *global* count was partly a
   nowcast for the world's most populous poor country until 2024 (M12, M13).

6. **Money is one axis of poverty, not the axis.** ~**1.1B** are poor on the multidimensional index
   (health, education, living standards); ~**2.6B** (a third of humanity) can't afford a healthy
   diet. The dollar-poor and the deprivation-poor are overlapping but *different* people — the
   disagreement is a finding, not noise (M16–M19).

7. **The progress stalled, and the finish line receded.** COVID drove the first rise in extreme
   poverty since 1998; the recovery is uneven; the 2030 target (3%) will be missed (~7% projected).
   The Bank's new **prosperity gap** — the factor by which all incomes must multiply to reach
   $25/day — is ~**5×** globally and **flat since the pandemic**; a typical upper-middle-income
   country needs ~**100 years** to close it, and climate could push 68–135M back under the line by
   2030 (M25).

8. **The numbers themselves are softer than they look.** Survey means run ~**26% below** national-
   accounts consumption and ~**55% below** GDP/capita, the gap widens with income, and richer
   households dodge surveys — so inequality is understated and the "missing rich" are missing by
   construction. Poor-country poverty is measured by *consumption*, rich-country by *income*;
   PPP rebasing moves every line with no real-world change (M26).

## 4. Chart roster & data status (granular)

Status: `real` = ingested with lineage, on disk today · `free` = existing WB/OWID adapter, **no new
code** · `cut` = existing source, new query/derive · `src` = new adapter/source · `derive` =
computable from series on disk. Temp = hope / despair / confusion / epistemic. *Insight* = the single
thing the chart must make a layperson see.

### Act I — The long ascent *(hope)*

| # | Sub-question | Chart job | Series / code | Status | Insight (verify) |
|---|---|---|---|---|---|
| M1 | Income over 2,000 years | line, **log y** | `gdp-per-capita-maddison-world` (OWID Maddison) | **real** | ~$1,100 flat for millennia, then ~15× since 1820 — the hockey stick |
| M2 | Extreme poverty rate since 1820 | area | `extreme-poverty-world` (PIP `SI.POV.DDAY`) — migrate to $3.00 | **real** | ~76% (1820) → 44% (1981) → ~9% — then the line moved |
| M3 | GDP/capita, modern | line | `gdp-per-capita-world` (`NY.GDP.PCAP.KD`) | **real** | the level story under the rate story |
| M4† | The pace: people leaving poverty per day | line (deltas) | `derive` Δcount/365 from M6 | **derive** | ~128k/day at peak (2000s–10s); ≈0, even negative, 2020–22 |

### Act II — How many, really *(confusion)*

| # | Sub-question | Chart job | Series / code | Status | Insight (verify) |
|---|---|---|---|---|---|
| M5 | Share poor at each line | nested areas | PIP `poverty-rate-{300,420,830}-world` | **real** | 10.9% / 20.5% / 48.3% (2022) — same world, three headlines |
| M6 | **Number** of poor (millions) at each line | stacked area | PIP `poor-count-{world,420,830}-world` (`pop_in_poverty`) | **real** | 870M / 1,641M / 3,856M (2022) — half the planet under the top line |
| M7 | The line moved, not the people | before/after bars | PIP both vintages ($2.15/2017 vs $3.00/2021) | **cut** | +125M overnight (713M→838M, 2022); nobody got poorer |
| M8† | The line's pedigree | annotated timeline | doc/values, no series | **derive** | $1→$3 across four PPP rebasings; mean of the poorest ~20 nations' lines |
| M9 | Societal (relative) poverty | dual line vs extreme | PIP `societal-poverty-*` (`spr`) | **real** | 25.5% of the world (2022); barely falls — can't grow out of relative poverty |

### Act III — Who climbed, who didn't *(hope + despair)*

| # | Sub-question | Chart job | Series / code | Status | Insight (verify) |
|---|---|---|---|---|---|
| M10 | Poverty rate by region | multi-line | `extreme-poverty-{eas,ecs,lcn,mea,sas,ssf}` | **real** (6 on disk) | East Asia ~80%→~1%; SSA still ~35% |
| M11 | **Number** of poor by region — the crossover | multi-line | PIP `poor-count-*` (`pop_in_poverty`, 10 regions) | **real** | East Asia 1,218M→57M; SSA 321M→562M (still rising); lines cross ~2007 |
| M12 | China's contribution | line | add `CHN` to extreme-poverty indicator | **free** | ~800M out since 1981 — the curve's main engine |
| M13 | India & the 11-year blackout | line + caveat band | add `IND`; flag 2011→2022 survey gap | **free** | 16.2%→2.3% ($2.15); ~171M out; the count was a guess until 2024 |
| M14 | The new poverty map | small-multiple / share | PIP-direct by country + FCS list | **src** | poverty is now African & fragile-state: Nigeria, DRC lead absolute |
| M15 | Mean income/consumption by region | multi-line | PIP `mean-income-*` (`mean`) | **real** | World $20.5/day, SSF $4.7 vs NAC $88 — a ~19× gap |

### Act IV — Poverty isn't only money *(confusion / despair)*

| # | Sub-question | Chart job | Series / code | Status | Insight (verify) |
|---|---|---|---|---|---|
| M16 | MPI-poor vs dollar-poor | paired bars / spread | OPHI MPI (CC BY) + PIP | **src** | ~1.1B MPI-poor; overlaps but ≠ the $-poor set |
| M17 | What *kind* of deprivation | stacked bar by region | OPHI MPI indicator decomposition | **src** | SSA: nutrition+schooling+cooking fuel; S Asia: nutrition+sanitation |
| M18 | Can't afford a healthy diet | line + region | OWID `share-healthy-diet-unaffordable` (FAO SOFI, CC BY) | **free** | ~2.6B (⅓ of world); *rose* in low-income countries (464→545M) as it fell globally |
| M19 | The living-standards floor | small-multiple | `safe-drinking-water-*`, `safe-sanitation-world`, `electricity-access-world`, `open-defecation-world` | **real** (on disk) | the MPI living-standards dimensions — big gains, SSA lags |

### Act V — Who the poor are, what holds them, what we can't see *(despair / epistemic)*

| # | Sub-question | Chart job | Series / code | Status | Insight (verify) |
|---|---|---|---|---|---|
| M20 | The child & gender face | paired bar | UNICEF/WB child poverty; WB gender gap | **src** | ~1B children; children ~2× as likely; women 25–34 poorer |
| M21 | Working poverty & informality | line + region | `working-poverty-world`, `vulnerable-employment-*` | **real** | most poor people *work*; informality ~60% of global jobs |
| M22† | The vulnerable middle | area band | `derive` pop in $2.15–$6.85 | **derive** | the largest group — not poor, one shock from it |
| M23 | Inequality within vs between | line + elephant curve | `income-share-bottom50-world`, Gini `SI.POV.GINI` | **real**/`free` | between-country ↓, within-country ↑ |
| M24 | Wealth, not income | line / bar | WID via OWID (wealth shares) | **cut** | bottom 50% owns ~2% of wealth vs ~8% of income |
| M25 | The stall & the 100-year horizon | line + projection band | PIP nowcast; WB prosperity gap | **src** | 2030 target missed (~7%); prosperity gap ~5×, flat; ~100 yrs for UMICs |
| M26 | What the survey can't see | epistemic box / dual line | survey vs national-accounts mean | **src**/box | survey means 26% below HFCE, 55% below GDP; the rich go uncounted |

**Roster math (updated 2026-06-12):** of 26 movements, **~14 real on disk** — the Act I income/
poverty heroes plus, via the new PIP adapter, M5 (ladder), M6 (counts), M9 (societal), M11
(crossover, 10 regions) and M15 (mean income). Remaining new-source work collapses to **two
sources**: OPHI MPI (M16/M17) and UNICEF child poverty (M20); the rest are renderer/wiring tasks
(cross-section bars, `dataRefs[]`) or single-country PIP `/pip` cuts (M13 India, M14 the new map).
Cheaper to stand up than the flagship despite a denser roster.

## 5. The epistemic layer — what the data can't see (act V + methodology)

Poverty is the atlas's most *measured* domain and one of its least *certain*. Name the limits in the
piece; the limits are content.

- **The survey–national-accounts gap.** Poverty rests on household consumption surveys whose means
  run ~26% below national-accounts consumption and ~55% below GDP/cap; the gap widens with income
  and richer households under-respond → **the "missing rich"** → inequality understated and growth's
  reach overstated (Deaton; Prydz 2022; the PIP Innovation Hub is actively bridging it). *(M26)*
- **India's eleven-year blackout.** No comparable consumption survey from 2011/12 until the 2022/23
  HCES (new MMRP method). For a decade the world's largest poor population was *extrapolated* in the
  global count; the 2024–25 data both confirmed a huge fall (~171M out) and partly **offset the
  global upward revision** from the $3.00 line — India is the single biggest swing factor. *(M13)*
- **China's opacity.** Drives the headline fall, but micro-data access is limited and the survey-NA
  gap is large there — a hope story with a credibility asterisk. *(M12)*
- **PPP fragility.** International lines convert through ICP purchasing-power parities; each rebasing
  (2011→2017→2021) shifts every line with no real-world change. The 2025 jump is the demonstration. *(M7)*
- **Consumption vs income.** Poor countries measure poverty by consumption, rich ones by income —
  not strictly comparable, and it biases cross-country and relative-poverty comparisons. *(M9, M23)*
- **Timing & nowcasting.** Most countries survey every 3–5 years; "2024 global poverty" is a
  **nowcast** built on growth assumptions, not a count. PIP's `fill_gaps=true` interpolates — disclose
  it; never draw an interpolated point as observed. *(all PIP charts)*

## 6. Databases — integration status

OWID-first, snapshot-everything ([[DATA.md]]). The license gate (§9) is **clean across this entire
stack** — monetary, multidimensional, and inequality poverty are all re-hostable.

**License verification (done 2026-06-11, not assumed):**

| Source | License | Gate | Evidence |
|---|---|---|---|
| **World Bank PIP / WDI** | CC BY 4.0 | **re-host** | WB data-catalog public licenses |
| **OPHI Global MPI** | **CC BY 4.0** | **re-host** | Nature *Scientific Data* 2024; OPHI terms |
| **FAO healthy-diet (SOFI)** | CC BY (via OWID) | **re-host** | OWID `share-healthy-diet-unaffordable` |
| **WID (income & wealth)** | OWID-mirrored CC BY; WID-direct non-commercial **verify** | **re-host via OWID** | wid.world/data; OWID grapher CC BY |
| **UNICEF child poverty** | verify at ingest | likely re-host | — |
| **ILOSTAT** | CC BY 4.0 | re-host | (already flowing) |

**Already on disk — reuse, don't re-ingest:** `gdp-per-capita-maddison-world`,
`gdp-per-capita-world`, `extreme-poverty-world` + 6 regions, `poverty-685-world`,
`income-share-top1-world` + regions, `income-share-bottom50-world`, `working-poverty-world`,
`vulnerable-employment-*`, `child-labour-world`, `undernourishment-world`, `safe-drinking-water-*`,
`safe-sanitation-world`, `open-defecation-world`, `electricity-access-world`. **The
living-standards and livelihoods layers MPI is built from are already here** — wiring MPI
retroactively fuses scattered charts into one multidimensional verdict. Highest leverage in the
roster.

**Free today via existing adapters (registry edits only):**

- WB poverty lines: `SI.POV.DDAY` (extreme), `SI.POV.LMIC` ($4.20-band), `SI.POV.UMIC` ($8.30-band),
  poverty gap `SI.POV.GAPS`, **Gini** `SI.POV.GINI`, **shared prosperity** `SI.SPR.PCAP` /
  `SI.SPR.PC40` (bottom-40 growth).
- **China / India** (M12, M13): add `CHN`/`IND` entities to the existing extreme-poverty indicator.
- **Healthy diet** (M18): OWID grapher slug `share-healthy-diet-unaffordable`, CC BY.

**PIP-direct adapter — ✅ BUILT & INGESTED (2026-06-12).** `scripts/ingest/pip.ts` against
`api.worldbank.org/pip/v1`. The `/pip-grp?group_by=wb` endpoint returns World + all WB regions
(incl. combined `SSF`, the `AFE`/`AFW` split, and `NAC`) in one payload; one (povline) fetch carries
every measure (`pop_in_poverty`, `headcount`, `mean`, `spr`), memoised. 35 indicators live (counts,
mean income, societal rate × 10 regions + the 3-line ladder), 1981→2026. The `/pip` single-country
endpoint (M13 India, M14 the new map) is supported via `pipEndpoint: 'pip'` — not yet wired.

**New sources still to build (two, both re-hostable):**

1. **OPHI Global MPI** — CC BY 4.0. Take **OWID-mirrored MPI series first** (cheap, CC BY); add an
   OPHI bulk adapter only if M17's deprivation decomposition needs cuts OWID doesn't expose. Note:
   MPI is survey-based and sparse in time — treat as cross-sectional (spread/bar), not trend lines.
   Powers M16, M17.
2. **UNICEF child poverty** — verify license at ingest; likely re-host. Powers M20.

**Derivable from data on hand (no new source) — the cheapest big wins:**

- `headcount_to_count`: ratio × population → **number of poor** (M6, M11) and the regional crossover,
  the single most powerful chart, from series already on disk.
- `pop_in_band`: population between two lines → the **vulnerable middle** $2.15–$6.85 (M22).
- `delta_per_day`: yearly Δcount → **people leaving poverty per day** (M4).

## 7. The 2017→2021 PPP migration (the vintage event *and* a chart)

June 2025: PIP rebased to **2021 PPP**, lines **$2.15→$3.00 / $3.65→$4.20 / $6.85→$8.30**. Our
snapshots are a vintage behind. This is a **revision event** ([[DATA.md]] §10) *and* M7:

- **Re-ingest at 2021-PPP vintage; keep the 2017-PPP snapshot** (PIP still serves it) so M7 shows
  both. **Never mix vintages on one axis** — a $2.15 point beside a $3.00 point is a unit bug.
- **Label every poverty chart with its line + PPP base** in the unit/subtitle. Registry titles say
  `$2.15/day, 2017 PPP`; update to the line each chart actually uses.
- The migration is content: ~125M "added" (713M→838M, 2022) with nobody poorer — the cleanest
  one-chart proof of the spine.

## 8. Adapter / renderer features needed

**Reused from the flagship (shipped):** `sum_across_entities`, `sourceColumns`, `dataRef` windowing,
compact axis ticks.

**New for this article:**

1. **`headcount_to_count` derive** — ratio × population → millions of poor. Needs the population
   denominator wired as a transform input. Unlocks M4, M6, M11, M22 with no new source. *Highest ROI.*
2. **Cross-section / paired-bar renderer** — MPI, child poverty, and the line-ladder are bar/spread
   jobs, not lines. **Same blocker as the flagship's stranded IPV chart (M16 there)** — build once,
   both articles unlock. [[CHARTS.md]] v2.
3. **Log-scale y-axis** — M1 over 2,000 years is a flat line then a cliff on a linear axis. If the
   kit lacks log axes, that's a renderer task or a "since 1820" trim.
4. **Projection-band rendering** — M25 must distinguish observed from nowcast/projected (dashed +
   shaded), disclosed as projection, never as data. Also flags PIP `fill_gaps` interpolation.
5. **PIP-direct adapter** — §6.

## 9. Iteration roadmap (cheapest-first)

1. **Migrate M2/M10 to 2021 PPP** (re-ingest, keep old vintage) + relabel. Ship act I almost
   entirely from disk.
2. **`headcount_to_count` derive** → M6 + **M11 the regional crossover** + M4 pace + M22 vulnerable
   middle. Highest impact for lowest cost — all from data on hand.
3. **Free WB cuts** → M5 ladder (`SI.POV.LMIC/UMIC`), Gini, shared prosperity, M12 China, M13 India.
   Registry edits only.
4. **Healthy-diet OWID slug** (M18) — one CC BY grapher, big insight.
5. **Cross-section renderer** → unlocks MPI (M16/M17) *and* the flagship's stranded IPV chart.
6. **OWID-MPI series** (M16/M17) — re-host, CC BY.
7. **PIP-direct adapter** → M9 societal, M14 map, M15 mean, M25 stall/projection. The one real build.
8. **WID wealth** (M24) + **UNICEF child poverty** (M20).
9. **Prose pass**, movement by movement, against [[ANTI-AI.md]]; **manual number audit** of every $
   figure and "X million" against `src/data/derived/*.json`. **Watch the `$`-in-`replace` bug** —
   poverty prose is wall-to-wall dollar signs; function replacers only ([[CLAUDE.md]] gotchas).
10. Back matter, lenses, steelmans; flip `status: published` only after the prose pass and a
    real-data majority.

## 10. Open questions for the next session

- **Headline line:** open on the **$2.15 curve everyone knows** ("halved since 1990") and let M7
  pull the rug, or lead on $3.00 from the top? Lean: open on the familiar curve; the reveal is a
  stronger confusion beat than starting honest-but-unfamiliar.
- **Roster size:** 26 is the maximal set. Trim to ~18 for v1 by deferring M4/M8/M22 (derived
  niceties), M15 (needs PIP-direct), M24 (wealth — arguably its own article)? Keep M7, M11, M13,
  M16, M25, M26 — they carry the eight tensions.
- **MPI as trend vs snapshot:** the harmonised MPI level-change series (Nature 2024) gives *some*
  over-time movement, but most country-MPI is one or two survey points. Commit to cross-sectional
  "second opinion" framing and say so.
- **Wealth article split:** WID wealth (bottom 50% owns ~2%) is the sharpest inequality stat but a
  different concept from income poverty. One framed chart here (M24), or hold for a dedicated
  inequality piece? Lean: one chart — "poor in income / owns nothing" is the despair counterweight
  the hopeful headcount curve needs.
- **The stall's framing:** is the post-2020 plateau the story's *ending* (despair) or a *chapter*
  (the long arc resumes)? The honest answer is "unknown," which is itself the confusion temperature
  — M25 should show the projection band wide, not a point forecast.

---

## Build log

**2026-06-13 — wove in Roser's OWID essay "The end of progress against extreme poverty?"** Fits the
stall movement exactly. Two integrations, both grounded in real data: (1) the **daily pace**, derived
from our own `poor-count-world` series — ~115,000 people left extreme poverty *per day* averaged over
1990→2025 (matches Roser's figure to the digit), >200k at the 2000s peak, ~4k now. (2) Made the
projection line **real**: `scripts/analysis/poverty-projection.ts` ingests the WB forward projection
(OWID grapher `projections-extreme-poverty-wb`, World, 2026→2040) → `poor-count-projection-world.json`
(was an *authored placeholder* — the dashed line had been drawing inline points). **Extended the chart
to 2040**, where the count troughs at ~738M (2030) and **climbs back to ~888M by 2040** — Roser's
reversal, drawn from the Bank's own numbers, annotated "the projected turn." Roser added to sources
(s11). `prose:lint` 0 fails; `pnpm verify` green.

**2026-06-12 (night, 2) — regional refinement → 17 movements.** Rate fan (FIG. 12): **swapped Europe
& C. Asia → Middle East & N. Africa** (the palette is 5 tokens, so 5 lines is the legible max; ECS was
a flat near-zero line, MENA carries real signal — risen 12→14% since 2019 as war spread). New beat
(FIG. 14): **the two halves of Sub-Saharan Africa** (`poor-count-afe`/`afw`) — East & Southern nearly
tripled 142→402M, West & Central 89→185M; they sum to the SSF line, so shown as their own movement, not
stacked onto the crossover. The crossover's only other available regions (Europe, North America) are
flat-zero clutter — deliberately left off. `prose:lint` 0 fails; `pnpm verify` green.

**2026-06-12 (night) — +4 movements: modern GDP, poverty depth, and the bar renderer (MPI + Gini).**
- **Modern real-GDP beat** (FIG. 7) below the Maddison arc: `gdp-per-capita-world` (WB `NY.GDP.PCAP.KD`,
  constant 2015 US$, 1960→2024, ~3.2× — the 2008 & 2020 dips annotated). Sparked by a reader note that
  the WB site has newer data; the honest fix is the *inflation-adjusted* sibling of `NY.GDP.PCAP.CD`,
  not current-$ on a long real-income axis. The Maddison arc stays (2022 is the Maddison-2023 frontier).
- **Poverty-gap (depth) movement** — free: PIP already carries `poverty_gap`/`poverty_severity` in the
  same memoised payload. New registry block (`economy.poverty_gap.*`, World + 9 regions, ×100).
  Insight = incidence vs intensity: World gap 22.4→3.5%, East Asia 43→0.4 (poor sit just under the line),
  **Sub-Saharan Africa stuck ~16%** — its poverty is the deepest, not only the widest.
- **NEW chart job — the cross-section bar** (`src/lib/bars.ts`, `barChart()`), the same unlock the
  flagship's stranded IPV chart needs. Bespoke artifacts (kind: `bars`) via `scripts/analysis/
  poverty-cross-sections.ts` (fetches + snapshots OWID, like convergence-scatter); special-cased in
  `buildMovements`; the smoothing disclaimer is gated off for bars in `[slug].astro`.
  - **MPI cross-section** (FIG. 16) — OWID/OPHI Global MPI ×100, a curated 14-country spread Chad 51.7 →
    India 6.9 → China 1.6. The "more than money" second opinion; deprivation geography parallel to the
    income crossover. (OWID exposes only the MPI *index*, not the headcount — so it's a ranking, not a
    headcount-vs-dollar paired bar; that still needs an OPHI bulk adapter.)
  - **Gini cross-section** (FIG. 18) — OWID/WB Gini ×100, curated spread Namibia 59 → Slovenia 25;
    within-country inequality, the band-in-the-middle insight (Southern Africa & Latin America top).
- **Now 16 real movements**, 0 inline-fallback. `prose:lint` 0 fails; `pnpm verify` green (34.6 kB,
  zero JS, no chart lib). All new numbers audited against `src/data/derived/*.json`.
- **Still open:** apples-to-apples MPI *headcount* vs dollar (OPHI bulk adapter); single-country `/pip`
  cuts (M13 India, M14 the map); shared prosperity / prosperity gap (M25); the survey–NA "missing rich" (M26).

**2026-06-12 (eve) — article v1 built & published, twelve real-data movements.**
- `src/content/questions/is-the-world-winning-against-poverty.md` — full flagship-scale piece on the
  violence template: evidence panel + **12 movements**, five acts (the long ascent · how many really ·
  who climbed who didn't · more than money · what holds them / what we can't see), back matter (pull-
  quote, five lenses, hope/despair cases, what-would-change-it, methodology, 7 sources, revisions,
  "Still lost?" box + LLM disclosure).
- **Every chart is real** — 12 distinct derived series, 0 inline-fallback lines: M1 Maddison income
  arc · M2 `poverty-rate-300-world` · M3 ladder rates (300/420/830) · M4 ladder counts
  (`poor-count` world/420/830) · M5 societal vs extreme · M6 regional rate fan (`extreme-poverty-*`) ·
  **M7 the Asia–Africa crossover** (`poor-count-{eas,sas,ssf,mea,lcn}`, annot at 2007) · M8 mean income
  (nac/world/ssf) · M9 basic-services floor (electricity/water/sanitation) · M10 working poverty ·
  M11 income-share top10 vs bottom50 (WID) · M12 the post-2019 stall (`poor-count-world`, x0 2010).
- **Numbers all audited against `src/data/derived/*.json`** before authoring: $3/$4.20/$8.30 →
  10.9%/20.5%/48.3% & 870M/1.64bn/3.86bn (2022); societal 25.5%; crossover EAS 1218→39M vs SSF
  231→587M; mean income NAC $88 vs SSF $4.7 (~19×); working poverty 35%→8%; bottom-50 income share ~8%.
- **Gates green:** `prose:lint` 0 fails (avg grade 9.6; a few em-dash/grade warnings only), `pnpm build`
  passes, page renders 12 real chart artifacts with downloadable data/lineage.
- **Trimmed from the maximal roster (backlog):** M13 India & the blackout, M14 the new poverty map
  (both need single-country `/pip` cuts — adapter supports `pipEndpoint:'pip'`), M16/M17 MPI and M20
  child poverty (need the cross-section/bar renderer + OPHI/UNICEF sources), M24 wealth (WID), M4/M8/M22
  derived niceties. The eight tensions are all represented in v1 except the survey–NA "missing rich"
  (M26) and MPI's second opinion (M16) — next additions once the bar renderer lands.

**2026-06-12 (pm) — PIP-direct adapter shipped; counts/mean/societal/ladder all real, authoritative.**
- New **`pip` adapter** (`scripts/ingest/pip.ts`) against the real `api.worldbank.org/pip/v1`. The
  `/pip-grp?group_by=wb` endpoint returns World + all WB regions (incl. combined `SSF` *and* the
  `AFE`/`AFW` split *and* `NAC`) in one payload; one (povline) fetch carries every measure
  (`pop_in_poverty`, `headcount`, `mean`, `spr`), memoised. Spec knobs added to `IndicatorSpec`:
  `povline`, `pppVersion`, `pipEndpoint`, `fillGaps`, and a generic `valueScale`.
- **`headcount_to_count` derive REMOVED.** PIP publishes the count directly, so reconstructing it
  from rate×population would magic-number what the producer already gives (DATA.md §1.3) — reverted
  the `derive.denominator`/`scale` plumbing in types/derive/pipeline. *Direct beats derived where the
  source is authoritative; derivation stays only for genuinely-composed series (vulnerable middle =
  difference of two PIP counts; per-day = delta — both still PIP-sourced, not rate×pop).*
- **Registry rewritten PIP-native:** 35 indicators from **3 network calls** — `poor_count.*`
  (count, World + 9 regions), `mean_income.*`, `societal_poverty.*`, plus the `$3.00/$4.20/$8.30`
  ladder (rate + upper-line counts). All `✓` validated, 46 pts each (1981→2026 incl. nowcast).
- **Numbers verified against the Bank's published figures (no longer "verify"):**
  World extreme poor **870M (2022)** at $3.00; ladder $3.00→10.9%/870M · $4.20→20.5%/1,641M ·
  **$8.30→48.3%/3,856M** (half the planet); crossover East Asia 1,218M→57M vs SSA 321M→562M→**587M
  by 2026**; South Asia 503M→101M; mean income World $20.5 vs SSF $4.7 vs NAC $88/day; societal
  poverty **25.5%**. The earlier derived 871M was essentially exact — PIP-grp returns 870M too.
- **Roster now real via PIP:** M5 (ladder), M6 (counts at every line), M9 (societal), M11
  (crossover, 10 regions), M15 (mean income). M2/M10 historical rate stays WDI (`extreme-poverty-*`).
- **Still open:** cross-section/bar renderer (M16/M17, shared with the flagship's IPV chart);
  wiring these into article `dataRef`s (M11 multi-line → needs `dataRefs[]`, [[ARTICLE-violence-plan.md]]
  §5); single-country PIP cuts (M13 India, M14 the new map) via the `/pip` endpoint (adapter already
  supports `pipEndpoint: 'pip'`).

## Key external evidence (verified 2026-06-11)

- 2021-PPP rebasing, $3.00 line, +125M (713M→838M): [WB June 2025 factsheet](https://www.worldbank.org/en/news/factsheet/2025/06/05/june-2025-update-to-global-poverty-lines) · [OWID explainer](https://ourworldindata.org/new-international-poverty-line-3-dollars-per-day)
- Prosperity gap (~5×, flat since COVID, ~100 yrs): [WB Poverty, Prosperity & Planet 2024](https://www.worldbank.org/en/publication/poverty-prosperity-and-planet) · [WB blog](https://blogs.worldbank.org/en/opendata/global-prosperity-gap--the-world-bank-s-new-measure-for-shared-p)
- India 11-year survey gap, 16.2%→2.3%, ~171M out: [WB India poverty methodology note, May 2025](https://openknowledge.worldbank.org/server/api/core/bitstreams/1a3697f8-bb80-4246-8773-a27c78080a44/content)
- Healthy diet unaffordable ~2.6B (⅓), regional divergence: [FAO SOFI 2024](https://www.fao.org/newsroom/detail/healthy-diets-remain-unaffordable-for-a-third-of-the-world-s-population/en) · [OWID](https://ourworldindata.org/grapher/share-healthy-diet-unaffordable)
- Societal/relative poverty (~¼ of world), `max($2.15, $1.15+0.5×median)`: [WB blog](https://blogs.worldbank.org/en/opendata/quarter-world-lives-societal-poverty) · [Jolliffe & Prydz, WBER](https://academic.oup.com/wber/article-abstract/35/1/180/5611143)
- Survey–NA gap (26%/55%, the missing rich): [WB PIP Innovation Hub](https://blogs.worldbank.org/en/opendata/inside-the-pip-innovation-hub--bridging-the-survey-national-acco) · [Prydz 2022, *Review of Income and Wealth*](https://onlinelibrary.wiley.com/doi/10.1111/roiw.12577)
- OPHI Global MPI (~1.1B), CC BY 4.0: [OPHI Global MPI](https://ophi.org.uk/global-mpi) · [Nature *Scientific Data* 2024](https://www.nature.com/articles/s41597-024-04269-x)
- PIP API (`/v1/pip`, `povline`, `fill_gaps`): [How to use PIP's API](https://blogs.worldbank.org/en/opendata/how-use-pips-api) · [PIP API](https://pip.worldbank.org/api)
