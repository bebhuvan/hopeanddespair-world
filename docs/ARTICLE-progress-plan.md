# Article plan — *Is human progress slowing down?*

**Status: BUILT 2026-06-17, reframed to divergence 2026-06-18, source-backed pass 2026-06-20.** Lives at
`src/content/questions/is-human-progress-slowing-down.md` (kicker 14, theme "Human Development").

**2026-06-20 — back-to-the-source pass (no rebuild, prose/sources only):** Re-read the Atlas and its
sub-pages and folded in its *own* (link-only, attributed) figures rather than deriving new ones —
honouring the number-audit invariant by quoting, not recomputing. Changes: (1) the Atlas's forward
projection now appears in `despairCase` and methodology — *600M more poor / rate toward 15% by 2050*;
(2) FIG. 3 enlists the Atlas's corroboration of the divergence — *>½ the poor now live where poverty
isn't falling, 43 stalled countries* — so the piece agrees with the source instead of implicitly
out-honesting it (caveat 2 updated to say the *shape* agrees too); (3) FIG. 9 adds the Atlas's
*>3 centuries to paid-work parity*; (4) `whatWouldChangeIt` gains a concrete "speed is possible"
case (Singapore/South Korea, the Atlas's own example — *not* the unverifiable "Türkiye 36 years");
(5) the borrowed **speed-score** is now made concrete in methodology ("80 = faster than 80% of past
cases"); (6) fixed a soft overclaim — FIG. 13's "the lone line that accelerated" → "standout
accelerator", since our own pace ratios show electricity (110%) and sanitation (105%) also rose.
Discarded on verification: the "150M→69M escape-rate" and "Türkiye 36-year" figures (could not be
confirmed in the source). `pnpm verify` green; article = 0 prose-lint fails / 0 warnings.

**2026-06-20 — FIG. 17 "The fork ahead" (new closing movement):** recreated the Atlas's fan chart
("Global poverty could increase if current trends continue") as our own inline SVG, the project's
*first forward-looking chart*. **Solid line = our PIP world series** (`progress-poverty-actual`,
re-hostable CC BY, 2000=36%→2024=10.4% with the COVID bump); **four dashed paths to 2050 = the
Atlas's published scenarios, quoted not modelled** — Current 15.5, Typical 8.5, Brazil's 4.8,
Korea's 1.2 — fanning from our last actual point. Sanctioned by [[CHARTS.md]] line 39 ("line +
labeled benchmark path… a named, sourced target, never our invention"). Placed last (after the map)
so the piece closes on agency — the future of the frontier is a question of pace — paying off the
Korea reference added to `whatWouldChangeIt` the same day. Disclosure in a dedicated methodology
term. Renderer note: missing `dataRefs` slots (empty strings) fall back to the inline 2-point series
data, so one real historical ref + four inline dashed projections coexist in one chart. Movements
now **17**.
Companion to [[NORTH_STAR.md]], [[WRITING.md]], [[CHARTS.md]], [[DATA.md]]. Template:
[[ARTICLE-violence-plan.md]] / the debt build.

## The question and why it's distinct from the keystone

Prompted by the World Bank's **Atlas of Global Development 2026** ("development is advancing at its
slowest pace in generations"). This is **not** the keystone ("is the world getting better or worse
*across dimensions*?", [[ARTICLE-keystone-plan.md]]). This one is about **pace/deceleration** of the
broadly-improving dimensions.

## The spine — divergence, not a single line

The first build read "the world slowed" off world-aggregate lines. That was a false universality, and
the user named it: *"I don't think the story is universal."* The piece was rebuilt around the truer
claim:

**Progress did not slow evenly — it split apart. The regions that drove the great surge (East and
South Asia) ran so close to the finish there is little distance left; the frontier that needs it most
(Sub-Saharan Africa) has barely moved. Average those opposite motions and you get a gentle global
fade nobody actually lives in. The verdict is divergence, not decline.** Two gains (hunger, measles)
reversed outright; one (the internet) accelerated.

This reframe answers all three of the user's critiques at once: the confusing opening chart (replaced
by four regional poverty lines with opposite endings), the thinness (now reads world→region→country),
and the false universality.

## Method — borrowed idea, our own (simpler, transparent) construction

The Atlas uses a stage-conditional, country-level relative-speed model — un-auditable for us. We use a
**world-and-region trend comparison** (`scripts/analysis/global-progress.ts`), disclosed plainly:

- **Pace** = least-squares slope of a world series over a window, sign-flipped so improving = positive.
- Compare **2000–2013** (the pre-slowdown decade) to **2013–latest**; ratio < 100% = the gain slowed.
- **The one counterfactual we keep:** life expectancy (no hard ceiling) — continue the 2000s slope a
  decade; gap to actual ≈ **1.7 yrs**. Labelled a projection, never observed.
- **The counterfactual we REFUSED:** a poverty "extra people" number. Extrapolating a floored rate
  (bounded at 0) runs it *negative* within a decade and manufactures a fake ~1bn. We state pace
  (decline fell to ~26% of the 2000s rate) and the **actual headcount** (~847M) instead. This refusal
  is itself disclosed in the methodology panel — the number-audit invariant working as designed.
- **Reversals shown as lines, not bars:** undernourishment and measles have a negative recent rate; a
  bar clamped to zero reads as "barely moved", so they are pulled out of the pace chart into their own
  movements (FIG. 9, FIG. 10).

## The sixteen movements (all data-backed, verify green)

World → region → country, with the divergence carried on the series whose units are consistent
across all three altitudes (poverty, life expectancy, maternal mortality, literacy, internet).
Three additions on 2026-06-18 (below): FIG. 3 (absolute poor counts), FIG. 10 (women's empowerment
index — the *exact* V-Dem metric, replacing the parliament proxy), and FIG. 16 (the divergence grid).

1. **The reframe** (FIG. 1) — four regional extreme-poverty lines, opposite endings (East Asia 67→2,
   Sub-Saharan Africa 61.5→45.1). Replaces the old world-line opener.
2. **The frontier** (FIG. 2) — poverty-by-region bars (`progress-poverty-by-region`) + India/Nigeria
   country pair: same start, two endings.
3. **The number that grew** (FIG. 3, NEW 2026-06-18) — absolute poor *counts* by region
   (`poor-count-*`, 1990→2024): every region's headcount collapsed except Sub-Saharan Africa's, which
   nearly doubled (321M→582M). SSA went from 14% to 69% of the world's extreme poor. The rate-vs-count
   gut-punch; distinct from FIG. 1/2 (rates). Same $3.00 (2021 PPP) line.
4. **The engine** (FIG. 4) — GDP per capita by region (Africa and East Asia began level, now 8×
   apart) + GDP-by-country bars. The machine under every other chart.
5. **The clearest cost** (FIG. 5) — life-exp actual vs counterfactual (~73 vs ~75) + regional spread
   + country bars. The one kept counterfactual.
6. **The deepest victory** (FIG. 6) — child mortality world line (42.8→3.67 per 100 births), still
   falling, slowed; child-mortality-by-country bars (per 1,000 — kept as a separate captioned lens to
   avoid the unit clash).
7. **The starkest gap** (FIG. 7) — maternal mortality by region + Nigeria/Sweden (~250×). The widest
   gap on the page.
8. **Schooling** (FIG. 8) — adult literacy by region, near-universal except the frontier (~69%).
9. **The women's frontier** (FIG. 9) — women in parliament (11.7→27.2) + girls' secondary enrolment;
   the gains that barely slowed because they started far from finished.
10. **The fuller measure** (FIG. 10, NEW 2026-06-18) — V-Dem **women's political empowerment index**
    (`women-empowerment-*`, the *exact* Atlas metric via OWID, not the parliament proxy): world
    0.33→0.71, + continental regional. The twist: this index does **not** track income — Asia (0.62)
    sits *below* Africa (0.67, climbed from 0.13, lowest in 1950); Europe/S.America lead. The one
    domain where the poorest region isn't last. Mild post-2019 plateau (democratic backsliding).
11. **The reversals** (FIG. 11) — undernourishment, fell then climbed after the mid-2010s.
12. **The unprotected** (FIG. 12) — measles coverage, rose for decades then a pandemic dip.
13. **The exception** (FIG. 13) — internet use, the lone line that *accelerated*, + regional gap
    (Africa ~⅓).
14. **Did the poor catch up?** (FIG. 14) — convergence scatter (`convergence-scatter`, reused
    artifact): population-weighted fit slopes down (China/India), equal-country fit nearly flat. The
    analytical capstone.
15. **The verdict** (FIG. 15) — pace-ratio bars (`progress-pace-ratio`): most measures at a quarter to
    two-fifths of their 2000s pace; access measures held or beat it. Divergence, not decline.
16. **The map** (FIG. 16, NEW 2026-06-18) — the **divergence grid** (`progress-divergence-grid`,
    `kind: 'heatgrid'`, new `src/lib/heatgrid.ts`): 7 measures × 6 regions, each cell shaded per-row
    worst-region-red → best-region-green, columns ordered by income. SSA is worst on all 7; no other
    region is worst on even one. The closing synthesis — a callback to the intro's "It is not a fade.
    It is a map." Per-row scaling only, **no cross-measure composite** (the dashboard trap). See
    [[CHARTS.md]] "third earned addition".

## Data — what's new vs reused

- **New, via the `data360` adapter** (WB-origin, CC BY 4.0): `women-parliament-world`
  (`WB_WDI_SG_GEN_PARL_ZS`), `population-world` (`WB_WDI_SP_POP_TOTL`), plus stunting/immunization/
  tertiary specs under `progress.*`. See [[DATA.md]] §11 data360 note and [[data360-adapter]].
- **Reused from disk:** world + regional poverty (`poverty-300-*` / `extreme-poverty-*`), absolute
  poor counts (`poor-count-*`), GDP per capita (`gdp-per-capita-*`), life expectancy
  (`life-expectancy-*`), child mortality, literacy, maternal mortality, internet, undernourishment,
  measles (`vaccine-measles-*`), female-secondary, and the `convergence-scatter` artifact.
- **Derived 2026-06-18:** `progress-divergence-grid` (the FIG. 15 heat grid) — built by
  `global-progress.ts` from the latest regional value of 7 measures across the WB-6 regions, shaded
  per-row. The `heatGrid()` renderer + `kind: 'heatgrid'` dispatch were added the same day.
- **Derived by the analysis script:** the pace-ratio bars, both life-exp lines, the poverty-by-region
  bars, and `progress-headline-facts.json` (the audited figures the prose is allowed to cite).

## Gotchas this build hit (each cost real debugging time)

- **Fabricated poverty counterfactual** — see the refusal above; the number audit caught it.
- **Child-mortality unit clash** — world series is per-100 births, regional/by-country are per-1,000.
  Kept the world line per-100; used by-country bars (per-1,000) only as a separate captioned lens.
- **Negative pace bars** — `bars.ts` clamps x to ≥0, so the two reversals were pulled into their own
  line movements; `refLines` support added to `bars.ts` for the "same pace = 100%" rule.
- **Projection years in region bars** — capped at 2024 (`Math.min(2024, max)`).

## Regenerate

```
pnpm data ONLY=progress.            # re-pull the Data360 series
npx tsx scripts/analysis/global-progress.ts   # recompute artifacts + print number audit
pnpm verify
```
