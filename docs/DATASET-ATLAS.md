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
| **ILO ILOSTAT** | working poverty, informality, child labour | OWID or ILO API | CC BY 4.0 → re-host |
| **World Bank Findex** | financial inclusion (account ownership) | WB adapter | CC BY 4.0 → re-host |

> **Vintage note (2026-06-11):** PIP rebased to 2021 PPP in June 2025; the extreme line is now
> **$3.00/day** and ~125M more people fall under it (713M→838M for 2022) with nobody getting poorer.
> Our snapshots are a vintage behind — re-ingest is a revision event *and* a chart (the line moved,
> not the people). See the plan doc §5.

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
