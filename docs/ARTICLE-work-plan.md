# Article plan — *Is work getting better or worse?*

**Status: BUILT 2026-06-20.** Lives at `src/content/questions/is-work-getting-better-or-worse.md`
(kicker 15, theme "Work & Jobs"). Promotes the keystone **work** dimension to its own article.
Companion to [[NORTH_STAR.md]], [[WRITING.md]], [[CHARTS.md]], [[DATA.md]]. Template:
[[ARTICLE-progress-plan.md]] (the world→region→country divergence build) + the debt build's
"composites via `scripts/analysis/*`, not the registry" pattern.

## The question and the verdict

**Is work getting better or worse? — Confusion, leaning hope on destitution and despair on
security.** The honest answer is a divergence inside the same statistic: the chance that a job
*fails to lift a family out of extreme poverty* has collapsed (a third of the world's workers in
2000, about one in thirteen now), while the chance that a job comes with *a contract, a wage floor,
a safety net* has barely improved (informal work is still ~58% of all employment, almost unmoved
since 2004). Fewer workers are destitute; most are still precarious. Both are true at once, and
which one you see depends on the income level of the country you're standing in.

## The spine — working poverty, read at three altitudes

The thesis rides on **ILOSTAT working poverty (DF_SDG_0111, SDG 1.1.1)** because its units are
consistent from World down to income group, region, and country — so the same line carries the
whole magnification (CHARTS.md grammar: world → who-the-average-hides → the hardest place).

- **World**: 34.7% (2000) → 7.9% (2025).
- **Income ladder** (the hero divergence): Low income still **50.5%**, Lower-middle 10.1%,
  Upper-middle 1.4%, High ~0%. The world average fell because the middle of the ladder emptied;
  the bottom rung barely moved.
- **Region**: Eastern Asia **47% → 0.7%** (ran the race to the line); Sub-Saharan Africa
  **61% → 40%** (barely halved); Southern Asia 43% → 5%; and the **Arab States went backwards,
  2% → 9%** (Syria, Yemen) — the one region moving the wrong way, the proof there is no single
  global pace.
- **Country**: Madagascar 86%, DR Congo 80%, Mozambique 80% … down to China 0.1%.

## The despair counter-melody — informality (and its cousins)

- **Informal employment** (DF_EMP_2IFL, modelled): World ~58%, flat since 2004; **Low-income 89%,
  High-income 9%**. The single chart that says "destitution fell, insecurity didn't."
- **Vulnerable employment** (WB/ILO, reused regional series): 42.5% of the world's workers are
  own-account or unpaid family labour — not even an employer-employee relationship. ~7 in 10 in
  South Asia and Sub-Saharan Africa.
- **Youth**: working poverty 16% vs 7% for adults; youth unemployment *rose* (11.5→13.3%).
- **Gender**: women slightly more likely to be working-poor (8.9 vs 7.9%), but the larger gap is
  participation — only ~49% of women are in the labour force at all, and that share *fell*.
- **Child labour** (ILO/UNICEF): 160M (2020) → 138M (2024). A count, two datapoints — disclosed.

## The eleven movements (all data-backed, verify green)

1. **The collapse** (FIG.1, hero line) — `working-poverty-world`. A third → one in thirteen.
2. **Who the average hides: the income ladder** (FIG.2, multi-line) — `working-poverty-income-*`.
   The collapse is real everywhere except the one rung that matters most.
3. **The divergence by region** (FIG.3, multi-line + country bars) — `working-poverty-region-*`
   + `working-poverty-by-country`. East Asia finished; Africa barely moved; the Arab States rose.
4. **The counter-melody: informality** (FIG.4, income bars) — `informal-employment-by-income`
   + the flat world line. Fewer destitute, no more secure.
5. **The net that exists: social protection** (FIG.5, income multi-line) — `social-protection-income-*`
   (SDG 1.3.1). Coverage rose 39→52% since 2009 but is <10% in low-income countries; the *positive*
   proof of the security gap. The one clearly-improving security measure (a hope note).
6. **Not even employees** (FIG.6, reused WB regional multi-line) — `vulnerable-employment-*`.
   Own-account and unpaid family labour, still the norm across the global South.
7. **Whose gains? the labour income share** (FIG.7, world line + income strip) — `labour-share-*`
   (SDG 10.4.1). Labour's slice of output slipped 54→52.5%; low-income workers keep just 38%. The
   distribution axis — poverty fell because the pie grew, not because labour won a bigger cut.
8. **The young pay first** (FIG.8, multi-line) — `working-poverty-youth-world` vs `-adult-world`.
9. **The gap that isn't where you'd look** (FIG.9, multi-line) — `working-poverty-women-world`
   vs `-men-world`; the real gender story is participation (`female-labour-world`, reused).
10. **The floor** (FIG.10, line, 2 pts + schooling sidenote) — `child-labour-world`. 138M children,
    falling but vast; of them ~86M attend school, ~51M don't (out-of-school share rose 35→37%).
11. **The synthesis** (FIG.11, heatgrid) — `work-quality-by-income`: poverty, informality and
    underemployment all stack onto the same low-income workers. Income × measure, shaded per-row.

## Data — what's new vs reused

- **New ILOSTAT adapter capability**: the adapter now keeps **all ILO aggregate areas (X-codes)**
  in one snapshot per slug (was: trim to one REF_AREA), with an `AREA_NAMES` map so income groups
  and regions get real entity names. This is what lets a single dataflow feed world + income +
  region specs without slug-keyed snapshot collisions. `ADAPTER_VERSION` → 1.1.0.
- **New registry line**: `work.informal_employment.world` (DF_EMP_2IFL_SEX_RT, `yearMax: 2024` to
  drop the modelled nowcast to 2027).
- **New composites** via `scripts/analysis/work-and-jobs.ts` (one fetch per dataflow, snapshot-aware):
  the income/region/youth/sex working-poverty line series, `informal-employment-by-income` bars,
  the `work-quality-by-income` heatgrid, and `work-headline-facts.json` (the audited cite-list).
  **Deepening (2026-06-20):** added `social-protection-income-*` / `-world` (DF_SDG_0131, SDG 1.3.1,
  SOC_CONTIG_TOTAL + the unemployment/children/pension branches as facts) and `labour-share-*`
  (DF_SDG_1041, SDG 10.4.1, capped 2024), plus the child-labour school-attendance split (read from
  `DF_CLD_XCHL_SEX_AGE_STU_NB`, audited in facts). A generic `readAggG`/`ptsG` reader handles the
  SOC/STU dimensions the SEX/AGE `readAgg` can't.
- **Per-country bars** (the country lens, one per section that has distinct per-country data) via an
  `ilostat` source kind added to `scripts/analysis/country-cross-sections.ts` (snapshots under its own
  `data/sources/ilostat-countries/` family so it never clobbers the aggregates snapshot):
  `working-poverty-by-country` (FIG.3), `social-protection-by-country` (FIG.5 — Denmark 100 → DR Congo
  5), `vulnerable-employment-by-country` (FIG.6), `working-poverty-youth-by-country` (FIG.8),
  `female-labour-by-country` (FIG.9 — participation, the gender movement's real point).
  **Dropped:** `labour-share-by-country` — country-level labour share inverts (informal subsistence
  economies impute most income as labour, so Nigeria ~75% > Switzerland), which contradicts FIG.7's
  GDP-weighted income chart and would mislead. Informality (FIG.4) has no per-country data at all
  (modelled aggregates only) — disclosed, not faked.
- **Reused from disk**: `vulnerable-employment-*` (world + 6 WB regions), `female-labour-world`,
  `youth-unemployment-world`, `child-labour-world`.

## Gotchas this build hit

- **Slug-keyed snapshots + per-entity trim = collision.** Snapshots live at
  `data/sources/<src>/<vintage>/<slug>`; many specs share `DF_SDG_0111`. The old adapter trimmed to
  one REF_AREA, so the committed snapshot only reflected the last entity run. Fix: keep all
  aggregates in one faithful snapshot, filter in `normalize`. Per-country cuts snapshot separately.
- **ILO modelled series nowcast forward** (informality → 2027, working poverty → 2025). Capped
  informality at 2024; disclosed in methodology that recent working-poverty years are modelled.
- **Range-relative bar colour** on `working-poverty-by-country`: the four African outliers (73–86%)
  compress everyone else toward green, so 28% Nigeria reads "hope". The bar *values* carry the
  truth; the caption and prose carry the verdict (same trade-off as every cross-section bar).
- **`latestDir` throws on a missing base dir** — guard with `existsSync` for the new source family.

## Regenerate

```
pnpm data ONLY=work.                               # world working-poverty / child-labour / informality lines
npx tsx scripts/analysis/work-and-jobs.ts          # income/region/youth/sex series + bars + grid + facts
ONLY=working-poverty-by-country npx tsx scripts/analysis/country-cross-sections.ts
pnpm verify
```
