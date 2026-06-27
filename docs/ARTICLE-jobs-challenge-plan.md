# Article plan — *Can the world create enough jobs?*

**Status: BUILT 2026-06-27.** Lives at `src/content/questions/can-the-world-create-enough-jobs.md`
(kicker 16, theme "Work & Jobs"). The companion to Q15 [[ARTICLE-work-plan.md]]: where Q15 asks
whether *current* work is good (quality — working poverty, informality), this asks whether there will
be *enough* work (future quantity — the demographic jobs gap). Template: the GEP build's "transcribe a
World Bank report's own figure workbooks → `scripts/analysis/*`, not the registry" pattern (see
[[debt-article-built.md]]). Companions: [[NORTH_STAR.md]], [[WRITING.md]], [[CHARTS.md]], [[DATA.md]].

## The question and the verdict

**Can the world create enough jobs? — An open question, leaning anxious.** Over the decade to 2035,
~1.2 billion young people in EMDEs reach working age — the largest youth cohort ever, and the last of
its size this century. The report's own framing *is* the site thesis: the same wave is a demographic
**dividend** (hope) or a **drag** (despair), and "population sets the stage, but policy writes the
script." On an unchanged path ~300M of the 1.2bn are NEET in 2035. Confusion is first-class here, so
the verdict refuses to predict — it names the fork and the lever.

## The source

World Bank, **The Global Jobs Challenge** (advance edition, 2026; eds. Chrimes, Kose, Stamm).
**CC BY 3.0 IGO → re-host with attribution.** Cite URL:
https://www.worldbank.org/en/research/publication/global-jobs-challenge . Data cutoff 2025-09-28.
The user supplied the 252-page PDF + the official per-chapter chart workbooks (xlsx). Most figures rest
on **UN WPP 2024 / ILOSTAT / WDI** (all re-hostable); a few co-source proprietary series (Haver
Analytics, the IMF AI Preparedness Index of Cazzaniga et al. 2024) — those are shown *as the World Bank
published them* and credited to the original authors, not re-hosted as raw data.

## The twelve movements (world → region → country; CHARTS grammar)

Each chart re-derives one report figure (sheet in parens). Lines get download packages; bars are
image-download only (transformative artifact, data still CC BY 3.0 IGO via attribution).

1. **The wave** (line, `ES.1.A`) — EMDE youth 1955–2095, crest ~1.23bn at 2035 then declines.
2. **The handoff** (slopegraph, `1.2.B`) — youth by region 2000→2035; SSA ×2.4 (136→332M), EAP/ECA shrink.
3. **Who is on the clock** (bars, `1.2.D`) — working-age change 2025–35: SSA +234M … EAP −25M.
4. **The proof it can work** (bars, `2.2.F`) — peak youth inflow by region+date; EAP ~346M to 1988.
5. **Harder now** (line, `ES.1.D`) — EMDE potential growth 5.9→5.2→4.1% vs AE; ~⅓ lower than the 2000s.
6. **Least equipped** (bars, `3.3.B`) — GDP/capita on the eve of each region's peak; SSA ~$1.2k, debt ~57%.
7. **The new uncertainty** (segmented bars, `3.4.A`) — IMF AI-preparedness index; jobs-wave EMDEs 0.29 vs 0.44; +40%/60% AI exposure cited.
8. **The divide beneath it** (bars, `3.4.B`) — internet use 29% vs 81%; 2.7bn offline, <0.1% data capacity, <1% ChatGPT cited.
9. **The gap already showing** (bars, `1.2.C`) — young NEET by region 2005→2025; ~240M total, SSA 33→61M.
10. **Depends on the lens** (bars, `2.7.A`) — jobs estimates 269M / 447M / 1.2bn by method. The thesis chart.
11. **Where it lands** (bars, `2.8.C`) — largest WAP increases by country; India +90.6M, Nigeria +39.9M …
    (+ the ~270M-in-fragile-states / one-fifth stat in prose).
12. **The other half** (bars, `2.4.B`) — female-to-male labour-force participation; MENA 0.2, South Asia
    0.3; the 20–50% GDP lever. *(Added in the 2026-06-27 audit pass — the report's headline missing lever.)*
13. **Off the farm** (segmented bars, `2.5.E`) — sectoral employment shift 1991→2023: agriculture 52→30%,
    services 29→46%, industry ~flat — the skipped factory ladder. *(Added 2026-06-27.)*
14. **The lever** (bars, `ES.1.F`) — employment growth low- vs high-investment EMDEs (1.7 vs 2.7%/yr).

Also added in the same pass: **"Going backwards"** (bars, `3.2.B`) between least-equipped and the AI
act — share of economies poorer than before the pandemic (FCS 58%, LICs 43%), and the post-2008 →
post-2020 reversal onto the poorest. **Final count: 15 movements.**

**Historical-context strips (added per request — only where the report workbook carries a real time
series):** FIG.3 carries a `regional` line strip of working-age-population *growth rate* by group
2000–2050 (`2.3.B`: EMDEs decelerate, China negative, LICs hold ~3%); FIG.4 carries Korea + Singapore
employment-ratio through their surges (appendix `A.4.A`/`A.5.A`). The other bar movements are
genuinely cross-sectional in the source (income-at-peak, AI readiness, internet, estimates, country
bulges, female participation) — no time series exists to add, and none was invented. The schooling gap
(`4.3.B`: SSA 4.4 vs 12.4 yrs) is woven into FIG.6 prose.

Plus: pullQuote (the "policy writes the script" line), four lenses, hope/despair cases,
whatWouldChangeIt, methodology (6), sources (6, incl. WDI).

## Data build

- **Snapshot** `data/sources/worldbank-jobs/2026-06-27/`: the 7 original xlsx workbooks (faithful
  re-host) + 13 transcribed per-figure CSVs (`fig-ES1A-…`, …), extracted with a one-off Python
  (openpyxl) pass over the workbooks.
- **`scripts/analysis/global-jobs-challenge.ts`** reads the CSVs → 19 derived series in
  `src/data/derived/jobs-*` (12 chart artifacts: 9 `kind:'bars'`, 3 line families incl. 6 region
  slopegraph series + 2 potential-growth lines + the youth-wave hero) + **`jobs-challenge-facts.json`**
  (the audited cite list, including prose-only facts transcribed from the report text). Provenance:
  `license: 'CC BY 3.0 IGO — World Bank, re-hosted with attribution'`, `recipe: transcribe_chart_pack`.
- **No registry change, no adapter.** New source family only.

## Gotchas this build hit

- **Bar kit is single-value (+ stacked segments) only — no grouped bars.** Period comparisons became a
  slopegraph (handoff) or directional bars-with-note (NEET, WAP-change colour the negatives `stone`).
  The AI-preparedness 4-component split and the sectoral 3-sector split use `segments` + `legend`.
- **Legend overflow (fixed in `src/lib/bars.ts`).** The legend renderer laid all items on one
  un-wrapping row — the 4-item AI legend ran off the right edge on mobile. Added `legendRows()` to wrap
  the legend (reserving a row's height each); 2-item legends are unchanged. Also shortened the AI
  component labels (Digital / Innovation / Human capital / Regulation).
- **WPP units are thousands** in the workbooks (×÷1000 → millions); youth-wave is already billions;
  country WAP increase is thousands. All normalised in the script; documented in each `unit`.
- **Unrelated pre-existing fail:** `pnpm check:axes` flagged the *untracked* air-pollution article's
  `airpoll-burn-savanna` (ymax 200M < data 208.6M). Raised to 250M so the shared gate goes green —
  not part of this article.

## Regenerate

```
# (one-off) transcribe workbooks → CSVs: python3 + openpyxl over the chart pack
npx tsx scripts/analysis/global-jobs-challenge.ts   # derived series + jobs-challenge-facts.json
pnpm verify                                          # green
```
