# The dataset atlas — every big question, mapped to its open data

> The site's mission is question-first: assemble every open dataset that bears on one honest
> question, globally *and* regionally. This file maps each planned question to the datasets
> that can answer it, with access path and license gate. Companion to [[DATA.md]] (the
> architecture and the gate rules) and [[NORTH_STAR.md]] (why these questions).
>
> **Reading the tables:** *Path* = how we'd actually ingest it. "OWID" means the existing
> OWID adapter + a grapher slug (cheapest, do first). "WB" means the existing World Bank
> adapter + a WDI code (also already built). Anything else needs a new adapter — only build
> it when an article demands it. *Gate* = re-host (mirror CSV, generate downloads) vs
> link-only (chart if terms allow, never re-host) per [[DATA.md]] §9. Licenses marked
> **verify** must be checked at ingest time, not assumed.

---

## The question backlog (the atlas, in intended order)

1. Is humanity becoming less violent? — **published**
2. Are we beating disease and death? — draft
3. Is the climate stabilizing or breaking? — draft
4. Is the green transition actually happening — and where?
5. Is the world still getting richer — and who is being left behind?
6. Is the world becoming more tolerant, or less?
7. Is scientific progress speeding up or slowing down?
8. Is hunger ending or returning?
9. Is the world becoming more free?
10. Are we getting smarter? (education & knowledge)
11. Are we happier?
12. Is the living world dying? (biodiversity & nature)
13. Is inflation under control — and whose currency decides? — **planned** (dollar spine; new question, 2026-06-16)
14. Is the air getting cleaner or deadlier? — **planned** (air pollution; new question, 2026-06-26)
15. Is AI making the world better or worse? — **planned** (two-exponentials spine; new question, 2026-06-27)

Each question below lists its **sub-questions** (every chart is a sub-question) and the data
that answers them. The regional cut is not an afterthought: every question must answer both
*"what is the world doing?"* and *"where is it true, and where is it the opposite?"*

---

## Cross-cutting: the denominators & backbones (needed by everything)

| Dataset | Gives | Path | License → Gate |
|---|---|---|---|
| **UN World Population Prospects** | population, age structure, fertility — the denominator of every per-capita rate | OWID, or bulk CSV adapter | CC BY 3.0 IGO → re-host |
| **Maddison Project Database** | GDP per capita back to 1 CE — the deep-history income spine | OWID re-publishes | free w/ citation → re-host via OWID |
| **OWID entity table** | canonical country/region harmonization | already adopted | CC BY → in repo |
| **World Bank income/region classifications** | the "who" groupings for every regional cut | WB adapter | CC BY 4.0 → re-host |

---

## Q1 · Violence (published) — gaps still open

Already live: Eisner/WHO homicide, UCDP battle deaths & conflicts, UNHCR refugees, SIPRI
spending, FAS warheads, terrorism deaths (all via OWID), UNODC homicide via WB mirror.

| Still missing | Dataset | Path | Gate |
|---|---|---|---|
| Violence against women (IPV) | WHO/OWID 2018 cross-section | OWID (needs bar renderer, [[CHARTS.md]]) | re-host |
| One-sided violence / civilians | UCDP one-sided dataset | OWID or UCDP bulk | re-host |
| Political terror / repression | V-Dem physical-violence index | V-Dem bulk CSV | CC BY-SA **verify** → likely re-host |

---

## Q4 · The green transition — is it happening, and where?

The question with the strongest *pace* dimension: direction alone is a half-truth. Every
chart here should carry both verdicts — happening? fast enough? ([[EXPLAINERS.md]] ·
direction-and-pace). And the regional split IS the story: the transition is several
transitions at different speeds.

Sub-questions: Is electricity decarbonizing? Is total energy (not just electricity)?
Are renewables *adding to* or *replacing* fossils? Where is coal growing? Are costs still
collapsing? Is transport electrifying? Is the money flowing? Who is transitioning and who
is locked out?

| Dataset | Gives | Path | License → Gate |
|---|---|---|---|
| **Ember — Yearly Electricity Data** | per-country electricity generation by source, 2000– (monthly too) | OWID, or Ember bulk CSV (clean) | CC BY 4.0 → re-host |
| **OWID Energy dataset** (`owid/energy-data` on GitHub) | one tidy CSV: primary energy, mix, per-capita, by country — built from Ember + Energy Institute | direct CSV — easiest single win in the whole atlas | CC BY → re-host |
| **Global Carbon Budget** | CO₂ by country, by fuel, consumption vs production, 1750– | OWID (`owid/co2-data`) | CC BY 4.0 → re-host |
| **IRENA renewable capacity & costs** | installed capacity, LCOE declines (the solar cost collapse) | OWID re-publishes key series | IRENA terms **verify**; OWID-mirrored series CC BY → re-host those |
| **IEA — Global EV Data Explorer** (`api.iea.org/evs`) ✅ **LIVE** | EV sales/stock/share by country, by mode (cars, two/three-wheelers, vans, buses, trucks) and powertrain | **`iea` adapter** (`scripts/ingest/iea.ts`) | **CC BY 4.0 → re-host** (verified 2026-06-13). **Licence split:** the *Explorer* is CC BY 4.0 and re-hosted; the *Global EV Outlook report* data product is "Non-CC Material" (restricted) → cited only. |
| **IEA** (World Energy Outlook, investment, the EV Outlook *report*) | clean-energy investment, narrative analysis | **link-only** — cite, do not re-host | restricted (Non-CC) |
| **NASA GISTEMP / Berkeley Earth** | temperature anomaly (the "why it matters" spine) | OWID; Berkeley Earth direct CSV | PD / CC BY 4.0 → re-host |
| **World Bank** (`EG.*` codes) | energy access, electricity from coal %, renewables % | WB adapter, today | CC BY 4.0 → re-host |

Regional story to build: the four-speed world — (1) rich decarbonizers (EU/UK/US), (2)
build-everything giants (China: most solar *and* most coal), (3) late industrializers
(India, SE Asia), (4) the unelectrified (Sub-Saharan Africa, where the question is access,
not transition). One chart job, four entities, repeated across the article.

---

## Q5 · Wealth & poverty — who is being left behind?

**Full build plan: [[ARTICLE-wealth-poverty-plan.md]]** (~18 charts, five vantages). Much of the
roster is already on disk; the gap was the *distribution and multidimensional* story, now mapped.

| Dataset | Gives | Path | License → Gate |
|---|---|---|---|
| **World Bank PIP** (lines $3.00/$4.20/$8.30, 2021 PPP — was $2.15/$3.65/$6.85, 2017 PPP) ✅ **LIVE** | poverty at every line + **number of poor (millions)** + mean income + societal/relative rate + nowcasts — the "which poverty?" and "how many?" charts | **`pip` adapter** (`scripts/ingest/pip.ts`, `/pip-grp`) — counts/mean/societal, World + 10 regions, 1981→2026; WDI (`SI.POV.*`) for the historical rate hero | CC BY 4.0 → re-host |
| **OPHI Global MPI** | poverty as deprivation (health/education/living standards); **disagrees with the dollar line** — the second opinion | OWID-mirrored series first; OPHI bulk for decomposition | **CC BY 4.0 → re-host** (verified 2026-06-11) |
| **World Inequality Database (WID)** | top-1% / bottom-50% income shares *and wealth* (bottom 50% owns ~2%), 1900– | OWID path (CC BY); WID-direct non-commercial **verify** | OWID-mirrored → re-host |
| **World Bank Gini** (`SI.POV.GINI`) + **shared prosperity** (`SI.SPR.*`, bottom-40 growth) | within-country inequality; is growth reaching the poor? | WB adapter, today | CC BY 4.0 → re-host |
| **Maddison** | the 2,000-year arc; the Great Divergence and the catch-up | OWID | re-host |
| **UNICEF / WB child poverty** | the demographic face — children ~2× as likely to be extreme-poor | UNICEF tables / WB | verify → likely re-host |
| **ILO ILOSTAT** ✅ **LIVE** | working poverty (world→income→region→country, +youth/sex), informality, vulnerable employment, child labour — the flagship of *"Is work getting better or worse?"* (kicker 15, built 2026-06-20) | **`ilostat` adapter** (`scripts/ingest/ilostat.ts`, SDMX 2.1; v1.1.0 keeps all ILO aggregate X-codes per snapshot) + `scripts/analysis/work-and-jobs.ts` composites; per-country via the cross-section script | CC BY 4.0 → re-host |
| **World Bank Findex** | financial inclusion (account ownership) | WB adapter | CC BY 4.0 → re-host |

> **Vintage note (2026-06-11):** PIP rebased to 2021 PPP in June 2025; the extreme line is now
> **$3.00/day** and ~125M more people fall under it (713M→838M for 2022) with nobody getting poorer.
> Our snapshots are a vintage behind — re-ingest is a revision event *and* a chart (the line moved,
> not the people). See the plan doc §5.

---

## Q16 · The global jobs challenge — *can the world create enough jobs?* — BUILT (2026-06-27)

**Full build plan: [[ARTICLE-jobs-challenge-plan.md]]** (kicker 16, 15 movements). The companion to
Q15: *future quantity* of jobs (the 1.2bn youth wave, the dividend-or-drag fork) vs Q15's *current
quality*. Built entirely from one CC BY 3.0 IGO report's own figure workbooks — not the registry.

| Dataset | Gives | Path | License → Gate |
|---|---|---|---|
| **World Bank — The Global Jobs Challenge (2026)** ✅ **LIVE** | the whole article: youth wave (ES.1.A), youth-by-region handoff (1.2.B), working-age change (1.2.D) + WAP-growth time series (2.3.B), peak-cohort proof (2.2.F) + Korea/Singapore employment (A.4.A/A.5.A), potential growth (ES.1.D), income-at-peak (3.3.B) + schooling gap (4.3.B), AI preparedness (3.4.A) + internet divide (3.4.B), young NEET (1.2.C), 3-way jobs estimates (2.7.A), country bulges (2.8.C), recession scarring (3.2.B), sectoral shift (2.5.E), female participation (2.4.B), investment↔jobs lever (ES.1.F) | snapshot `data/sources/worldbank-jobs/2026-06-27/` (7 xlsx workbooks + transcribed CSVs); `scripts/analysis/global-jobs-challenge.ts` → `jobs-*` derived series + `jobs-challenge-facts.json` | **CC BY 3.0 IGO → re-host w/ attribution** |
| underlying primaries | **UN WPP 2024** (demography), **ILOSTAT** (NEET/employment), **WDI** (income/internet), **Kose & Ohnsorge 2024** (potential growth) — all re-hostable | re-derived *through* the report's figures (exact WB regional groupings) | open → re-host |
| proprietary co-sources | **IMF AI Preparedness Index** (Cazzaniga et al. 2024) for 3.4.A; **Haver Analytics** for ES.1.F | shown as the WB published them — **cite/credit-only, not re-hosted as data** | © original authors → cite |

> **Pattern note:** same as the GEP debt update — a World Bank CC BY 3.0 IGO report is re-derivable
> from its own chart pack, but vendor series *inside* its figures (Haver, ICRG, IMF indices, Penn World
> Table, Gallup) stay cite-only. The bar kit has no grouped bars, so 2000-vs-2035 comparisons are
> slopegraphs or directional bars-with-note.

---

## Q6 · Tolerance — the honest hard one

**Be upfront in the article itself:** this is the weakest open-data domain on the atlas.
Attitudes live in surveys that are mostly *not* re-hostable; what is genuinely open is
**laws and outcomes**. Structure the article around that honesty: what laws say (open data),
what people tell surveyors (link-only), and the gap between the two — the gap is itself a
finding. Epistemic-status tags do heavy lifting here ([[EXPLAINERS.md]]).

Sub-questions: Are rights expanding in law? Do attitudes follow laws or lead them? Is
acceptance of "the other" (neighbour questions) rising? Are women's legal rights converging
with men's? Is persecution rising even as average tolerance rises?

| Dataset | Gives | Path | License → Gate |
|---|---|---|---|
| **World Bank — Women, Business and the Law** | women's legal rights index, 190 countries, 1970– (superb long panel) | WB adapter, today | CC BY 4.0 → re-host |
| **V-Dem** | civil liberties, exclusion by social group, freedom of religion indices | bulk CSV adapter | **verify** (recent versions CC BY-SA) |
| **OWID human-rights & LGBT+ series** | same-sex relationship legality over time, etc. | OWID | CC BY → re-host |
| **World Values Survey / EVS** | trust, neighbour-tolerance items, 1981– | **link-only**; cite aggregates, never re-host micro | restricted |
| **European Social Survey** | immigration & minority attitudes (Europe, gold standard) | **link-only** | registration-gated |
| **Pew Global Attitudes** | cross-national attitude snapshots | **link-only** | restricted |
| **OSCE ODIHR hate-crime data** | reported hate crime (with all its reporting caveats) | **link-only / verify** | unclear |
| **UNHCR + Pew religious-restriction indices** | persecution trends | link-only | restricted |

---

## Q7 · Science — speeding up or slowing down?

Two sub-stories: **inputs** (are we funding more research? more researchers?) — easy, open —
and **outputs/productivity** (are ideas getting harder to find?) — genuinely contested, which
makes it a perfect hope/despair/confusion article. The confusion temperature is the point:
paper counts explode while breakthrough-per-dollar arguably falls.

Sub-questions: Is R&D spending rising (absolute, %GDP, per researcher)? Where is it shifting
(the China story)? Are publications growing — and does that mean anything? Are ideas getting
harder to find (Bloom et al.)? Is science getting less disruptive (Park et al.)? Are clinical
trials / new drugs / transistor-density holding their curves?

| Dataset | Gives | Path | License → Gate |
|---|---|---|---|
| **UNESCO UIS R&D** | GERD % of GDP, researchers per million, worldwide | OWID re-publishes; UIS bulk | CC BY-SA 3.0 IGO **verify share-alike implications** |
| **OECD MSTI** | detailed R&D for OECD+ (gov/business split) | OECD API (CC BY 4.0 since 2024) | re-host **verify per-dataset** |
| **OpenAlex** | ALL publications, citations, fields, institutions — CC0, full dump | new adapter (API or snapshot); the most powerful open dataset in this domain | **CC0 → re-host freely** |
| **WIPO IP Statistics** | patent applications/grants by country, 1883– | bulk CSV | free w/ attribution → re-host **verify** |
| **ClinicalTrials.gov** | registered trials over time | API/bulk | public domain → re-host |
| **FDA novel drug approvals** | new molecular entities per year (Eroom's-law chart) | small CSV, hand-curated from FDA | PD → re-host |
| **Bloom et al. "Ideas harder to find" / Park et al. disruptiveness** | the pessimist case, as published data | paper replication data, cite-and-chart | academic → link-only, chart with epistemic tag *contested* |
| **World Bank** (`GB.XPD.RSDV.GD.ZS`) | R&D % GDP — works in the WB adapter *today* | WB adapter | CC BY 4.0 → re-host |

---

## Q2 · Health (draft → build next) — confirmed plan

| Dataset | Gives | Path | Gate |
|---|---|---|---|
| **WHO GHO** | life expectancy, cause-of-death, vaccines | prefer OWID mirrors (CC BY); WHO direct is CC BY-NC-SA → **link-only if direct** | mixed |
| **UN IGME** | child mortality, 1950– (the single most hopeful series on earth) | OWID | re-host |
| **OWID burden-of-disease mirrors** | DALYs, causes (IHME-derived; some restricted) | OWID where CC BY | per-series gate |
| **GAVI/WHO immunization** | vaccine coverage | OWID / WB adapter | re-host |
| **UNAIDS / WHO TB & malaria** | the three epidemics' arcs | OWID | re-host |
| Obesity, mental health, opioids, antibiotic resistance | the despair counter-arc | OWID various | per-series |

## Q3 · Climate — BUILT (2026-06-13)

`src/content/questions/is-the-climate-stabilizing-or-breaking.md`, published. The climate
*system* article (carbon → heat → damage → who caused it), kept distinct from Q4 (the energy
transition): the energy turn appears once, as the hopeful hinge (M6), and hands off to Q4 for
depth. Seven movements + evidence panel + back matter, on real ingested data (CC-BY/PD, plus two
link-only series in M5).

Realized spine (each at the magnifications the data honestly allows):
- **M1 concentration** (CO₂ ppm, 278→426) — global-only *by nature* (well-mixed gas, no regional
  cut exists); the honest-gap move, named as such.
- **M2 temperature** (GISTEMP world line) **+ land-vs-ocean strip** (Berkeley Earth land +1.8 vs
  land+ocean +1.3, same 1951–80 baseline) — the "uneven heating" second magnification.
- **M3 emissions** (GCB, 38.6 Gt record) at **three levels**: world + 6-continent four-speed
  strip + per-capita country bar (`co2-per-capita-by-country`) — the fairness flip.
- **M4 consequences**: sea level (CSIRO+NOAA via EPA, 0→26 cm) + Arctic September ice (NSIDC,
  7.0→4.7 M km²) — both global-by-nature.
- **M5 the human cost** (**link-only**): recorded disasters excl. quakes (EM-DAT, 5→335/yr, mostly
  reporting) + deaths (IHME, flat ~9k, 2000–21) — the decoupling; events up, toll not.
- **M6 the energy hinge** (solar price + wind/solar share) — hope, defers to Q4.
- **M7 forests** (FAO world hectares + WB regional % strip) — tropics fall / temperate greens.

New adapters built for this article (DATA.md): **`copernicus`** (ERA5 global mean via the ECMWF
Climate Pulse flat CSV, C3S licence — daily→annual, re-baselined to 1951–80 to overlay GISTEMP as
M2's second, most-current line), **`berkeley`** (Berkeley Earth land & land+ocean summary files,
CC BY) and **`sealevel`** (EPA datahub CSIRO+NOAA sea-level CSV, PD). Arctic ice rides the
existing `owid` adapter (NSIDC underneath, PD, license override). ERA5 publishes only a global
series via Climate Pulse, so the land/ocean split stays on Berkeley; Copernicus for *extremes*
remains the next ingest.

Still link-only / not yet ingested (gap register): **Copernicus/ERA5 extremes** (open w/
attribution), **EM-DAT disasters** (**link-only**, restricted — cited in sources), **IEA**
sectoral emissions (**link-only**), **crop yields under warming** via FAOSTAT/OWID.

## Population · Fertility — BUILT (2026-06-13)

`src/content/questions/is-the-world-running-out-of-children.md`, published. Promotes fertility
from a cross-cutting *denominator* (above) to a full question. Plan: [[ARTICLE-fertility-plan.md]].
Verdict held as a deliberate **hard balance** ("a liberation and a reckoning at once") — the
honest center for the domain the registry tags *confusion*. Device: history drawn solid, the UN
WPP medium projection drawn **dashed**, on the same line; the "world stops growing ~2084" lands
three ways (growth rate → 0, births/deaths crossover, population peak).

**Sixteen movements, six acts** (expanded same day from an eleven-movement v1). The spine rode
**existing** demography series; **15 OWID/WB indicators** were added (no new adapter) for the
descent + reckoning: history+medium-projection pairs for growth rate (`population-growth-rates`),
births (`number-of-births-per-year`), deaths (`births-and-deaths-projected-to-2100`), median age
(`median-age`), population (`population-long-run-with-projections`); old-age dependency
(`SP.POP.DPND.OL`); four canary country picks (`children-per-woman-un` — Korea, China, Japan,
Niger); and the drivers (girls' secondary `SE.SEC.ENRR.FE`, female labour `SL.TLF.CACT.FE.ZS`,
adolescent fertility `SP.ADO.TFRT`). The **why act**, **migration valve**, **missing girls**, and
**projection fan** are powered by the **new `unwpp` adapter** (UN WPP 2024 bulk CSVs, CC BY 3.0 IGO):
sex ratio at birth (China's 117.8 spike), net migration by income group, and the low/med/high
population fan (7→10.3→14.4bn at 2100). Named research (Notestein, Becker, Myrskylä, Doepke, Lutz,
Pritchett, Jones; IHME 2020 link-only) is cited throughout. `census-idb` dropped, `oecd` link-only
(see [[ARTICLE-fertility-plan.md]] §3b).

> **Adapter gotcha logged (DATA.md):** the `owid` adapter takes its unit from the *first* metadata
> column, not the picked `sourceColumn`. Births therefore come from `number-of-births-per-year`
> (col0 = births) and deaths from `births-and-deaths-projected-to-2100` (col0 = deaths); each
> registry `unit` is pinned to its slug's col0 unit to keep validation green. Same family as the
> battle-deaths multi-column trap.

**Gap register (named in the piece, not charted):** desired-vs-achieved fertility (DHS/OWID
cross-section — verify CC BY before any ingest; qualitative for now) · pronatalist-policy *outcomes*
(no clean panel — the failure is the finding) · contraceptive prevalence + female schooling as a
fuller M10 mechanism (one OWID ingest away) · the post-2024 Korea nadir (named in prose; series ends 2023).

## Q13 · Inflation & the dollar — planned (dollar spine)

**Full build plan: [[ARTICLE-inflation-plan.md]]** (~12 movements, four acts). A new question
earned by the 2021–23 surge. The spine is **the dollar**: the world prices, borrows, and saves in
a currency the US Fed controls, so the same shock breaks unevenly. Verdict (recommended, confirm):
*confusion with a despair spine* — "under control" is a rich-world sentence.

| Dataset | Gives | Path | License → Gate |
|---|---|---|---|
| **World Bank** (`FP.CPI.TOTL.ZG`, `FP.CPI.TOTL`, `NY.GDP.DEFL.KD.ZG`) | CPI inflation + index + deflator cross-check, by country & income-group, 1960– | WB adapter, today | CC BY 4.0 → re-host — **verify IMF-IFS third-party flag** per indicator; OWID own-processed is the clean fallback |
| **OWID** own-processed inflation series | clean CC-BY inflation where WB carries the IMF third-party flag | OWID adapter | CC BY → re-host |
| **FAO Food Price Index** + WB/OWID energy prices | the M3 trigger overlay (the supply-shock spark) | OWID/FAO | CC BY → re-host |
| **Federal Reserve H.10 — Nominal Broad USD Index** | the dollar-strength spine line (M8) | **new small `fed` adapter**, direct from federalreserve.gov (**not** FRED) | US-gov **PD → re-host** |
| **BIS Global Liquidity Indicators** — USD credit to non-banks outside the US | the ~$13tn "global dollar debt" (M9) — genuinely BIS-unique, no open mirror | **new `bis` adapter** (bulk CSV preferred over SDMX) | BIS custom terms → **link-only** (chart + cite + link out) |
| **BIS central-bank policy rates** | the synchronized global hiking cycle, Fed-led (M7) | `bis` adapter | **link-only** |
| **BIS debt-service ratios + credit to non-financial sector** | the EM debt-burden mechanism (M10) | `bis` adapter | **link-only** |
| **IMF WEO** advanced-vs-emerging aggregates & projections | the canonical split | **link-only** — cite; chart the WB income-group cut instead | restricted |
| **DXY** (ICE) | the headline dollar index | **link-only** — Fed broad index is the re-hostable stand-in | proprietary |
| Real wages (prices vs pay), Argentina/Venezuela "true" estimates | the lived squeeze; the contested-number honesty move (M6) | WB/ILO (verify CC BY); academic reconstructions | gap register / link-only |

> **The license headline (researched 2026-06-16):** BIS is **link-only** across the board — a
> custom BIS-copyright licence, not CC BY/CC0/PD. Its statistics terms permit *display* with
> attribution, so we chart from BIS and link `↓ source` to `data.bis.org`, but we never re-host
> the CSV. Identical to the EM-DAT pattern in Q3 (M5). The dollar spine is therefore fully
> tellable; its charts carry a link-out, while the re-hostable CPI + Fed-dollar-index spine carries
> the verifiable load. IMF and FRED are likewise link-only for re-hosting.

## Q14 · Air pollution — is the air getting cleaner or deadlier? — planned

**Full build plan: [[ARTICLE-airpollution-plan.md]]** (8 acts, ~22 movements; the hard-balance verdict,
the data-transparency signature act, the forgotten-poisons act). A new question, scoped 2026-06-26. Air pollution is the **best-served topic on the whole atlas** —
the problem is not finding data but the *license gate* and reconciling three data **types** that
don't agree: modeled *burden* (deaths), measured/modeled *concentration* (exposure), inventoried
*emissions* (sources). Verdict held as a deliberate **hard balance** (like fertility): the wins are
real and fast (China's plunge, clean-cooking, cleanup pays) and the catastrophe is real and vast
(~7M deaths/yr, ~99% breathing unsafe air, the monitor deserts) — both true, no overall lean.
Kept distinct from Q3/climate: the **Q3 boundary** is wildfire smoke (climate-driven PM2.5 erasing
cleanup) — that beat hands *to* this article, as the energy hinge hands Q3 to Q4.

> **Research vintage (2026-06-26):** scoped via a deep-research pass; the source facts below were
> then **adversarially verified** (3 independent web-checking skeptics per claim, 2/3-refute kills) —
> **23 of 25 claims confirmed**. Two EDGAR claims were **corrected** (folded in below): EDGAR carries
> **9** air-pollutant species (not 10 — CH4 is a GHG, not in the AP set), is split into **~26–30 IPCC
> sectors** (not 8), and is licensed under the **EC reuse notice** (acknowledge source), **not CC BY
> 4.0**. ACAG **CC BY 4.0 confirmed** (the load-bearing one). Still carry a manual number-audit before
> any figure enters prose, per the invariant; licenses marked **verify** below remain unconfirmed.

### Burden — deaths & DALYs (the despair half)
| Dataset | Gives | Path | License → Gate |
|---|---|---|---|
| **IHME / GBD 2023** (rel. Oct 2025; current cycle) | deaths & DALYs attributable to ambient PM2.5, ozone, household air, **lead** — by country/age/sex/**SDI** (the income lens), with uncertainty intervals, 1990– | GBD Results Tool (vizhub) | **IHME Free-of-Charge Non-Commercial User Agreement** → **link-only / re-derive**, never re-host raw bulk |
| **State of Global Air** (HEI+IHME) | the journalist-friendly packaged cut (rankings, country profiles); confirmed it **mirrors GBD**, not independent | SoGA CSV | inherits IHME terms → link-only; historically the friendliest *face* |
| **WHO** attributable deaths + GHE | WHO's own toll (~**7M/yr**, vs GBD/IHME ~**6.7M/yr**) — the divergence is a *confusion* beat | OWID mirror; WHO direct CC BY-NC-SA → link-only | mixed |
| **OWID air-pollution** | deaths, DALYs, indoor-vs-outdoor split — **GBD-sourced**; PM2.5 exposure — ACAG/WB-sourced | **OWID adapter** (append `.csv`) | **⚠ split gate:** OWID's **GBD/IHME** graphers are **link-only** ("a license that doesn't allow us to redistribute it" — CC BY covers only OWID's *viz/code*, not the series). Only the **WB/ACAG-sourced** OWID series (exposure) are CC BY → re-host. |

### Exposure — concentrations (what people actually breathe)
| Dataset | Gives | Path | License → Gate |
|---|---|---|---|
| **ACAG / SatPM2.5** (Van Donkelaar, WashU) | satellite-derived global surface **PM2.5** grids, **V6.GL.03 (1998–2024)**, 0.01°+0.1° (V6.GL.02.04/1998–2023 now retired); regional country/state summary files for global+US+Canada+China+India; the V5 product carries explicit uncertainty grids | **open AWS S3 `s3://satpmdata/`** (`--no-sign-request`, no account); new small adapter or direct | **CC BY 4.0 → re-host** ✓ verified 2026-06-26 |
| **WHO Ambient AQ Database** | ground-monitor city-level PM2.5/PM10/NO2, ~6,000+ cities | WHO direct / OWID | WHO CC → re-host **verify** |
| **OpenAQ** | live + historical ground-sensor PM2.5/NO2/O3/SO2/CO worldwide; coverage-biased to rich countries (the bias is a story) | OpenAQ REST API | **CC BY 4.0 → re-host** |
| **SPARTAN** | reference-grade ground PM2.5/PM10 + AERONET, sited for the **Global South** — the ground-truth that *validates* the satellite models (and a hope beat: closing the gap) | research network | open **verify** |
| **Copernicus CAMS** (ECMWF) | reanalysis/forecast concentration fields, all pollutants | heavy grids; `copernicus` adapter exists (Q3) | Copernicus (free, attribution) → re-host |

### Emissions — sources (the hope levers; where it comes from)
| Dataset | Gives | Path | License → Gate |
|---|---|---|---|
| **EDGAR** (EC JRC) | **v8.1 Air Pollutants**, annual **1970–2022** + monthly 2000–2022, **9 species** (CO, NOx, NMVOC, NH3, SO2, PM10, PM2.5, BC, OC — *no CH4*; that's EDGAR's separate GHG product); country series + **0.1° gridded**, ~26–30 IPCC sectors | bulk CSV adapter | **EC reuse notice** (reuse authorised, source acknowledged) → **re-host w/ attribution** — *not* labelled CC BY 4.0 |
| **Climate TRACE** | **V4.4.0 (Apr 2025)** — **asset/facility-level** emissions, GHGs *and* air pollutants, ~**2.76M sources from ~745M assets** — the "this *specific* plant/port" capability EDGAR lacks | bulk CSV / API | open data → re-host **verify CC BY 4.0** |
| **CEDS** | historical anthropogenic emissions by sector (the model-feeding inventory) | bulk CSV | CC BY → re-host |

### Regional / country
| Dataset | Gives | Path | Gate |
|---|---|---|---|
| **World Bank WDI** (`EN.ATM.PM25.MC.*`) | "PM2.5 mean annual exposure" (sourced from ACAG) + % exposed above WHO guideline, by country/income group | WB adapter, today | CC BY 4.0 → re-host |
| **EEA** (Europe) | Europe air-quality + emissions, exceedances | EEA direct | re-usable w/ attribution **verify** |
| **US EPA AQS** | US monitor network, the Clean-Air-Act trend (and the wildfire reversal) | EPA bulk/API | PD → re-host |
| **India CPCB / China MEE** | the two ambient-pollution heavyweights' national networks | OpenAQ often mirrors; national portals | varying openness **verify** → likely link-only |

### Data gaps & honest-disclosure (the article's spine — a three-act movement)
The **transparency/governance story is the meta-finding**, quantified by the **OpenAQ 2024 report**
(*Open Air Quality Data: The Global Landscape 2024*, the primary source):
- Only **27%** of countries share **fully transparent** AQ data; **55%** share publicly in some form.
- **36%** of countries **do not monitor at all** (only 64% run continuous monitoring — up just 3% since 2022).
- **~1 billion people across 71 countries** have **no government monitoring** — **9 of 10 of them in
  low / lower-middle-income countries.** Only **54 countries** share maximally-open station-level data.

The three acts: **deserts** (capacity gap — can't afford monitors) → **secrets** (the monitor-but-
don't-share band — political-will gap, distinct from capacity) → **the fix** (SPARTAN, Afri-SET,
satellites, low-cost sensors closing both). The inequity *is* the finding: **the least-measured and
least-shared places are the worst-affected.** Other honest gaps to name in-piece: the **WHO vs
IHME** death-toll divergence; **ambient toll spans 3M–9M/yr** across the literature (modeled point
estimate hiding a wide band); **rising tolls reflect steeper exposure-response science, not worse
air**; PM2.5 dominates while **ozone / NO2 / SO2 / ultrafines / indoor** are far thinner; burden
estimates **lag years** behind (GBD 2021 published 2024).

### The under-asked angles (each with its dataset)
| Angle | Temperature | Best open dataset |
|---|---|---|
| **Wildfire smoke erasing gains** — since ~2016 it shaped PM2.5 in ~¾ of contiguous US states, eroding ~25% of decades of cleanup (Nature 2023, `s41586-023-06522-6`) | despair (**Q3 boundary**) | ACAG + the Nature paper; US EPA AQS |
| **Indoor falling as clean-cooking spreads** vs ambient rising in industrializing Asia | the bifocal tension | OWID/WB clean-cooking access + GBD household split |
| **Monitor-desert + data-secrecy equity** | despair/confusion | OpenAQ 2024 report |
| **Environmental Kuznets / China's post-2013 plunge** (dirty-then-clean — law or excuse?) | hope, with a catch | ACAG China summary files |
| **Ozone rising while PM falls** (the pollutant heat worsens, controls miss) | hidden divergence | EDGAR precursors + CAMS |
| **Legal standards vs WHO guidelines** (India's limit ~4× WHO) + **WHO 2021 tightening → ~99% non-compliant** | confusion | WHO 2021 guidelines + national standards + ACAG exposure |
| **Beyond lungs** — cardiovascular, dementia/cognition, birth outcomes, mental health | reframes the toll | GBD cause linkages + Lancet Countdown |
| **Within-country inequity** — poorer/minority neighborhoods near highways/ports/industry | justice | OpenAQ station-level + EPA |
| **The unlegislated sources** — shipping/port NO2/SO2, agriculture/ammonia, crop-burning | sources nobody fixes | EDGAR / Climate TRACE sector splits |
| **COVID-2020 natural experiment** (what-if-we-stopped — air recovers fast, toll barely dents) | confusion | OpenAQ + CAMS time series |
| **Economic cost** — GDP / labour productivity lost (cleaning *pays*) | hope lever | World Bank cost-of-pollution |

**Still to verify individually** (the verify pass didn't reach these — vintage + license unconfirmed):
**AQLI** (EPIC/UChicago — the life-expectancy framing), **NASA SEDAC**, **Lancet Countdown**,
**PurpleAir** low-cost sensors, **Aclima/Google** mobile monitoring, **clean-cooking** access
panels (WB/IEA/WHO — the household-air hope beat's spine).

**Priority path:** OWID air-pollution graphers + WB `EN.ATM.PM25.*` first (zero/cheap, CC BY, cover
burden + exposure + the income cut). Then the **ACAG S3 adapter** (the gridded exposure spine, *if*
CC BY 4.0 confirms). EDGAR + Climate TRACE when the sources act needs facility detail. OpenAQ 2024
report powers the transparency movement with no ingest (cite + the four-category map).

---

## Q17 · AI — is AI making the world better or worse? — planned

**Full build plan: [[ARTICLE-ai-plan.md]]** (8 movements, the *two-exponentials* spine, the
**twin-curve** signature device, verdict held as **confusion — earned, not forced**). A new
question, scoped 2026-06-27. AI is the **most-measured technology in history**: the problem is not
finding data but that the data splits cleanly into *two layers that mirror the spine* — a
re-hostable CC-BY **inputs** layer (compute, capability, cost, infrastructure — Epoch + OWID) and a
link-only **outcomes** layer (what it does to lives — all forecast or one-vendor sample). The thesis
lives in the gap: the inputs are exponential and certain; the outcomes diverge by a *quadrillion
dollars*. Two axes run through it and **do not line up** — economics (boom-vs-bust) and existential
risk (p(doom) ~0 → ~99%); plotting researchers across both is the M7 artifact.

### Inputs — compute, capability, cost (the re-hostable CC-BY spine)
| Dataset | Gives | Path | License → Gate |
|---|---|---|---|
| **OWID — AI page** | ~60 graphers re-publishing Epoch + AI Index: capability-vs-human, compute/params/data, hardware $/perf, data-centre electricity share, models-by-country, investment (CSET), AI job postings, adoption-vs-GDP, public opinion, governance bills, incidents | **existing `owid` adapter** — cheapest, **do first** (carries M1–M4 + M8 with zero new code) | CC BY → re-host |
| **Epoch — Models / Capabilities / Data Centers / Chip Sales / GPU Clusters / Hardware / Polling** | 3,500+ models (1950–), benchmark scores, **data-centre power & build timelines** (satellite+permits), chip deployment, 500+ clusters, 170+ accelerators, usage polling | **new small `epoch` adapter** — *only* for series OWID doesn't mirror (power, chip owners, inference price) | CC BY → re-host (verified 2026-06-27) |
| **Epoch — Trends** | the headline growth rates: compute **5×/yr**, training cost **3.5×/yr**, inference price **−40×/yr**, algorithmic efficiency **3×/yr**, context **30×/yr**; ~$38B/GW, 800k-H100 largest cluster | quoted as facts (cite the trend page) | CC BY → re-host |

### Outcomes — what it does to lives (the contested, link-only layer)
| Dataset | Gives | Path | License → Gate |
|---|---|---|---|
| **Forecasting Research Institute — *Economic Effects of AI*** (Karger et al., surveyed Oct 2025–Feb 2026) | the **five-camp** forecast spread (economists/industry/policy/superforecasters/public) conditioned on capability scenarios; the variance-decomposition reveal (disagreement is the *economics*, not the *tech*); the policy split (retraining vs job-guarantee); top-10% wealth share → 80% rapid | **transcribe-chart-pack** → inline SVG; cite + link | **link-only** (no open-data licence stated) |
| **Anthropic Economic Index** | **measured** Claude usage by task/occupation: augmentation **52%** vs automation **45%**; ~**49%** of jobs have ≥¼ of tasks touched; mid-high-wage skew broadening down | transcribe; Hugging Face tables **verify licence** before any re-host | link-only until verified |
| **METR — task time horizon** | autonomous-task length doubling **~every 7 months**, 2019→Nov 2025 — the cleanest capability-as-agency curve | cite published numbers; chart from them | **link-only** (GitHub data carries a do-not-train *canary*, not a reuse licence) |
| **Field et al. 2025 — *Why do experts disagree on p(doom)?*** + signed statements | the existential-axis distribution (LeCun ~0, Hinton 10–20%, Bengio ~20%, mean ~14%, Yudkowsky >95%, Yampolskiy ~99%) + the tool-vs-agent split that explains it | **take-strip** from published figures | link-only / cite |
| **Stanford HAI — AI Index** (2026) | the master compendium (investment, opinion, education, policy) — cross-check only | cite; re-derive from underlying where raw is offered | **CC BY-ND** → **never re-host the figures** |
| **AI Incident Database** | catalogued real-world AI harms (snapshot download) — optional despair texture | snapshot; **verify licence** | unconfirmed → cite/link |

> **The licence headline (researched 2026-06-27):** the split *is* the spine. **Epoch is CC BY
> across all 11 datasets** (the re-hostable inputs backbone, and OWID already mirrors most of it —
> so the `owid` adapter does the heavy lifting before any new code). The **outcomes** layer is
> uniformly link-only: FRI has no data licence, METR ships a do-not-train canary (not a reuse
> grant), Anthropic's tables need verifying, and the **AI Index is CC BY-*ND*** — figures cite-only,
> re-derive from underlying. Same transcribe-chart-pack + epistemic-tag discipline as the debt/jobs
> builds. The thesis survives the gate intact: the measured half is fully re-hostable, the contested
> half is charted-and-linked behind loud "this is a forecast / one model's users" tags.

---

## Q8–12 · Shortlists (one line each, build when scheduled)

- **Hunger:** FAOSTAT undernourishment (license modernizing — **verify**; OWID mirrors CC BY),
  Global Hunger Index, famine mortality (OWID/WPF, the most hopeful forgotten chart), food
  prices (FAO FPI), micronutrients.
- **Freedom:** V-Dem (the spine; "third wave of autocratization" is the despair read),
  Freedom House (**link-only, verify**), RSF press freedom, internet shutdowns (#KeepItOn,
  verify).
- **Education:** UNESCO UIS literacy & schooling (1820– via OWID/van Zanden), WB enrollment
  (WB adapter today), PISA/TIMSS scores (OECD, the "quantity up, quality flat?" tension),
  Barro-Lee attainment.
- **Happiness:** World Happiness Report aggregates (re-host **verify**; Gallup micro never),
  OWID life-satisfaction series; suicide rates (WHO→OWID) as the despair counterpoint.
- **Nature:** IUCN Red List Index (**link-only**), Living Planet Index (**link-only,
  contested — epistemic tag**), Global Forest Watch / Hansen tree cover (CC BY), protected
  areas WDPA (verify), fish stocks FAO. Pair extinction despair with conservation-win hope
  (OWID species-saved series).
- **Gender** (keystone dimension today; deep-article later): carrying = UNDP Gender Inequality
  Index (CC BY 3.0 IGO, OWID mirror, regional aggregates), school parity (UIS/WB), labour ratio
  (ILO/WB), maternal mortality (MMEIG), women in parliament (IPU). **Signature movement —
  "Wages, accounts, and assets: three clocks":** the economic gap closes at three different
  speeds — paid work (flat), financial accounts (Findex, CC BY, closing fast via *mobile money*
  leapfrogging in Africa/South Asia), and land/house ownership (WB Gender Data Portal, survey
  cross-section → **link-only/bar**, stays overwhelmingly male). Hope-with-a-mechanism vs. the
  asset that won't move.
  **Other deep-article movements (the gaps the keystone can't fit):**
  (1) **Violence / safety** — intimate-partner violence prevalence, child marriage (WB Gender Data
  Portal / WHO). The biggest hole in the keystone: every line we show is rights-&-access, none is
  *safety*. Cross-section → **bar renderer** ([[CHARTS.md]]). Honesty fix: keystone despair-take now
  names it (no series yet — qualitative only until ingested). (2) **Law vs. life** — Women, Business
  and the Law legal-rights index (CC BY, 1970– panel) against the stalled *outcomes*: rights on paper
  raced ahead of pay, power, and safety. (3) **The missing women** — sex ratio at birth (clean time
  series); sex-selective abortion in parts of Asia, a distinct despair signal. (4) **Technology** —
  the digital / mobile-money gender gap *is* the leapfrog mechanism in the assets movement above; fold
  it in, don't run it standalone. Already-covered portal topics (skip): education, employment, health,
  leadership, SDGs — all keystone lines, all folded into the GII composite.

---

## Priority order (what to actually do next)

1. **OWID energy + CO₂ GitHub CSVs** — two files, CC BY, unlock Q3 and Q4 almost entirely.
2. **WB codes already reachable today** (zero new code): R&D spend, Gini, poverty lines,
   energy access, WBL index — five questions get their first real series for free.
3. **Ember bulk** when Q4 needs per-country electricity mix beyond OWID's mirrors.
4. **V-Dem bulk adapter** — one CSV powers Q6, Q9, and the violence gaps.
5. **OpenAlex** — the one genuinely new-build adapter that's worth it (CC0, powers all of Q7).
6. Everything else when its article is scheduled. Resist building adapters speculatively
   ([[DATA.md]] §1.7 — refine by subtraction).

> The test, per question: can a reader see the world line, see who the line hides, download
> every CSV we're allowed to give them, and click through to every source we're not? If a
> domain can't clear that bar openly (tolerance attitudes), the article says so out loud —
> the gap in the data is part of the answer.
