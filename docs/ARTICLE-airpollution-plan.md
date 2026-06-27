# ARTICLE — "Is the air getting cleaner or deadlier?" (Q14, air pollution)

> The build blueprint for the air-pollution flagship. Companion to [[DATASET-ATLAS.md]] §Q14
> (the source registry + gates) and [[NORTH_STAR.md]] (the creed). Follows the template of
> [[ARTICLE-debt-plan.md]] / [[ARTICLE-violence-plan.md]]: movements as verdict units, each at the
> magnification the data honestly allows, every quantitative claim tracing to a derived series.
>
> **Status:** planned, scoped + research-verified 2026-06-26. Not built. Two research passes
> (deep-research + a 12-territory deep-angle hunt, 45 beats, each dataset license-checked) underpin
> the movement list below.

## The verdict (non-negotiable for this article): hard balance, no lean

The honest answer is **both at once**, and the article must refuse to resolve it:

- **Cleaner:** PM2.5 *concentrations* are falling across much of the world; death *rates* per capita
  are down; China cut urban PM2.5 faster than any nation in history; the EU's PM2.5 deaths fell ~57%
  (2005–2023); leaded petrol is globally gone; secondhand-smoke exposure fell ~90% in the US.
- **Deadlier:** the *total* toll still climbs as populations grow and age; new and unregulated
  sources rise (ammonia, wildfire smoke); and the wins are unmasking warming (the aerosol paradox)
  and being *relocated* down the income ladder rather than eliminated.

This is the [[fertility-article-built]] move: "a liberation and a reckoning at once," held as the
center, not a fence-sit. The domain's registry temperature is **confusion** and the article earns it.

**The framing trap to open on (not the claim headline — see [[WRITING.md]]):** the same dataset that
says "cleaner" and the one that says "deadlier" are often *the same numbers read two ways*. The
article's spine is teaching the reader to hold both.

---

## The single most important gate fact (read before any ingest)

**IHME / Global Burden of Disease is link-only — even through OWID.** OWID's air-pollution and lead
graphers explicitly state *"the data is published under a license that doesn't allow us to
redistribute it."* OWID's CC BY 4.0 covers its **visualisations and code, not the IHME series**. So
every death / DALY / SDI / lead-burden / household-vs-ambient series sourced from GBD is **link-only**
(chart + cite + `↓ source`, never re-host the CSV) or **re-derived** from the GBD Results Tool
(vizhub.healthdata.org/gbd-results) and cited. Identical to the [[debt-article-built]] BIS pattern and
the Q2-health gate trap. **Current cycle is GBD 2023** (released Oct 2025), not GBD 2021 — update any
stale vintage. This touches roughly half the movements; the re-hostable load is carried by ACAG
(exposure), the emissions inventories, and the open academic supplementary tables.

---

## The data spine — what carries the verifiable load (all license-checked 2026-06-26)

| Tier | Dataset | Vintage | Gate | Role |
|---|---|---|---|---|
| **Exposure spine** | **ACAG / SatPM2.5 V6.GL.03** (WashU, AWS `s3://satpmdata/`) | 1998–2024 | **CC BY 4.0 → re-host** ✓ | the gridded PM2.5 truth; AQLI life-years re-derivable from it |
| **Burden** | **GBD 2023** via OWID graphers / GBD Results Tool | 2023 cycle | **link-only / re-derive** | deaths, DALYs, SDI gradient, lead, household-vs-ambient |
| **Transparency** | **OpenAQ** (API v3 + S3 archive + 2024 Landscape report) | 2024–25 | per-source (mostly re-host); report cite | the monitor-desert/secrecy spine |
| **Emissions** | **EDGAR v8.1** (EC JRC) | 1970–2022 | **EC reuse notice → re-host w/ attribution** (not CC BY) | sources, 9 AP species, ~26–30 sectors |
| **Emissions** | **CEDS v_2025_03_18** (Zenodo 15059443) | 1750–2023 | **CC BY 4.0 → re-host** | SO2/BC/OC/CH4 by sector — the aerosol-paradox + co-benefit spine |
| **Emissions** | **Climate TRACE V4.4.0** | Apr 2025 | open (verify) → re-host | asset/facility-level |
| **Satellite obs** | **Sentinel-5P/TROPOMI** (NO2, SO2) + **IASI** (NH3) via Copernicus / GEE | rolling to 2026 | **Copernicus terms → re-host w/ attribution**; IASI verify | source-resolved plumes |
| **Fire** | **GFED5** (Zenodo) + **CAMS GFAS** | to 2024 | CC BY 4.0 / Copernicus → re-host | wildfire-smoke spine |
| **Forcing** | **IGCC 2025** (Zenodo 20600829) | to 2025 | **CC BY 4.0 → re-host** | aerosol ERF for the masking paradox |
| **Standards** | **WHO Global AQ Standards DB** (WHO + Swiss TPH) | Feb 2025 | verify (likely CC BY-NC-SA IGO → link) | legal-limit-vs-WHO gap |
| **Indices** | **AQLI 2025** (EPIC/UChicago) | Aug 2025 (2023 data) | report cite; **re-derive from ACAG** | life-years-lost unit |

Academic supplementary tables that are **re-hostable (CC BY)**: Ghosh 2021 PLOS Med (birth outcomes),
Xue 2022 Nat Commun (stillbirths), Xu 2025 NSR (dust child-mortality), Pure Earth 2024 Sci Rep (lead
in goods). **Link-only / verify:** SEDA (test scores), Eora MRIO, CEADs, Illinois IDB (verify per
record — IDB-3251572 confirmed **CC BY 4.0**), Science Advances gas-stove (CC BY-NC, fine for a
noncommercial atlas).

---

## The movements — 8 acts, ~22 movements

Each movement: **claim → magnification(s) → dataset(s) + gate → why it's under-told.** Temperatures
tagged (hope / despair / confusion). The bifocal cut — *"where is it the opposite?"* — is mandatory.

### ACT I · The toll, and why no one agrees on it  *(confusion anchor)*

**M1 · The headline that hides a range.** WHO ~7M vs GBD ~6.7M deaths/yr; outdoor *alone* spans
**3M–9M** across the literature (Lelieveld 3.3M → Vohra 8.7M). The number is **modeled, not counted** —
show the band, not a point. *Mag:* the four published estimates as a range strip. *Data:* OWID
data-review (GBD parts **link-only**). *Under-told:* journalism quotes one number as fact.

**M2 · Rising tolls are better science, not worse air.** The toll rose between GBD cycles because the
exposure-response curve *steepened*, not because air worsened — OWID states this verbatim. The honesty
keystone. *Data:* OWID/GBD (link-only). *Temp:* confusion.

**M3 · It was never a lung story.** PM2.5's burden is mostly **cardiovascular** (heart attacks,
stroke), plus dementia, and — the kicker — lead's body count is **~94% cardiovascular** too (see M14).
*Mag:* cause-of-death decomposition. *Data:* GBD 2023 by cause (link-only). *Temp:* despair.

### ACT II · Who breathes what  *(the lens — bifocal)*

**M4 · The unit that makes it legible: years off your life.** AQLI converts PM2.5 to life-expectancy
lost — globally ~1.9 yr, India ~3.5 yr (more than tobacco + malnutrition + unsafe water combined).
Puts dirty air on the *same axis as smoking*. *Mag:* world → region → country, **re-derived from
ACAG V6 (CC BY ✓)** using AQLI's published coefficient — fully re-hostable. *Temp:* despair.

**M5 · The income gradient.** Death *rates* by GBD SDI quintile; the exposure gap world-average hides.
*Data:* GBD 2023 by SDI (link-only) + WB `EN.ATM.PM25.*` (re-host) for the re-hostable cut. *Temp:*
despair. *Bifocal:* rich-world ambient falling, South-Asian ambient rising.

**M6 · Dirty air makes us measurably dumber and poorer — below the legal limit.** The non-health toll:
a 10 µg/m³ PM2.5 rise makes expert chess players **26% more likely to blunder** (Künn 2023) and MLB
umpires 2.6% more wrong — *below* the US standard; exam-day air permanently reshuffles college
admission (Ebenstein/Israel, Carneiro/Brazil); OECD 2025 attributes up to **a third of Europe's
2011–22 productivity growth** to cleaner air; a 10 µg/m³ rise lifts violent crime ~1.4% (Burkhardt).
*Mag:* a "take strip" of four effects (cognition / exams / productivity / crime). *Data:* EPA AQS
(PD, re-host) + openICPSR pear-packer package (re-host) + SEDA (link-only) + NIBRS (CC0). *Under-told:*
filed under lungs-and-heart; the brain/economy hit has no body count so editors skip it. *Temp:*
despair (the harm) flipping to hope (cleaning air is an uncounted cognitive + GDP stimulus).

### ACT III · The youngest victims  *(despair, badly under-told)*

**M7 · The morbidity iceberg.** The ~500k newborn deaths are the visible sliver: PM2.5 caused **2.76M
low-birth-weight + 5.87M preterm births** in one year — **35.7% of ALL preterm births** worldwide
(Ghosh 2021, **CC BY → re-host the 204-country table**). And **~830k stillbirths** (39.7% of the total)
are PM2.5-attributable (Xue 2022, **CC BY**) — a category excluded from under-5 mortality *and* the
"7 million." *Temp:* despair. *Under-told:* the genre counts bodies; damaged-but-surviving births and
the never-born have no death number.

**M8 · The killer is in the kitchen, not the tailpipe — and it's why the newborn toll is falling.**
**~64%** of neonatal air-pollution deaths are **household** (cooking smoke), not ambient — and the
age-standardised neonatal rate fell ~36% (1990–2021) as clean cooking spread. The biggest lever is an
LPG cylinder. *Data:* GBD 2023 household-vs-ambient (re-derive via Results Tool) + WHO Household
Energy DB (CC BY). *Temp:* **hope** (the counter-melody). *Bifocal:* the despair of M7 and the hope of
M8 are the *same children*.

**M9 · The dust no factory closure can touch.** Wind-blown Saharan/desert dust drives **~21% of
under-5 deaths in LMICs** (~1.07M children, 2017), worst in Nigeria + India — a *natural* PM2.5 source
emission controls can't fix and aridification may worsen. *Data:* Xu 2025 NSR (**CC BY → re-host**) +
ACAG dust component. *Temp:* confusion (breaks the tidy "cut emissions" morality play).

### ACT IV · The data is the story  *(the signature/moat movement — confusion → hope)*

The three-act spine, expanded with the satellite + citizen-sensor turns. This is the beat no one else
writes; it carries the article's distinctiveness ([[EXPLAINERS.md]]).

**M10 · Deserts.** 36% of countries don't monitor; **~1 billion people across 71 countries** have no
government monitoring, **9 of 10 in low/lower-middle-income** countries. The cruel 2025 twist: the US
State Dept **switched off its embassy monitors (4 Mar 2025)**, which were the *sole* regulatory-grade
source in ≥13 countries (9 in Africa). *Data:* OpenAQ 2024 Landscape (cite) + OpenAQ S3 archive of the
frozen embassy series (re-derive). *Temp:* despair.

**M11 · Secrets.** Of the 55% who share publicly, only **27% are fully transparent**; only **54
countries** share maximally-open station-level data. The monitor-but-don't-share band is a
*governance/will* gap distinct from capacity. *Data:* OpenAQ 2024 Landscape four-category map. *Temp:*
confusion. *(All M10–M11 figures verified verbatim 2026-06-26.)*

**M12 · The citizens out-measure the governments — most where states measure least.** sensor.community
(~35,600 stations, 20B+ records) and PurpleAir out-count every regulatory network; on OpenAQ, low-cost
sensors are now a *larger* share of locations in poor countries than rich ones. **The catch:** cheap
optical sensors over-read with humidity, and the standard US "Barkjohn" correction fits the humid
tropics *worst* — so some alarming citizen numbers from data deserts are partly artifact. *Data:*
OpenAQ API v3 (per-source; re-host w/ caveat) + sensor.community archive (ODbL, re-host w/ share-alike)
+ EPA correction data (PD). *Temp:* hope, with a confusion sting. *Under-told:* framed as a rich-world
hobby; it's the *entire* dataset in the deserts.

**M13 · The satellites audit the polluters who never filed.** Sentinel-5P/TROPOMI now resolves
individual ship and plant plumes; the NASA SO2 catalogue caught **759 point sources**, many *missing
from national inventories*; IASI maps **ammonia super-emitters** that appear in no inventory; when the
Red Sea closed in 2024 you could *watch* shipping NO2 migrate around the Cape from orbit. Open data
becomes a country-blind, consent-free emissions auditor. *Data:* Sentinel-5P L3 NO2/SO2 (Copernicus →
re-host w/ attribution), NASA SO2 catalogue v2 (re-host), IASI NH3 (verify). *Temp:* hope.

### ACT V · The forgotten poisons  *(under-indexed pollutants)*

**M14 · Lead: the heart, not the brain — and the toll doubled overnight.** The standard story is "lost
IQ points." But GBD attributes **~1.5M deaths/yr** to lead, **~94% cardiovascular**, and a 2023 Lancet
Planetary Health re-analysis put it **6× higher** than GBD-2019 with a **US$6.0 trillion (6.9% of GDP)**
cost. Leaded petrol ended in 2021 — but lead just **moved into the cupboard** (51% of metal foodware,
45% of ceramics over limits — Pure Earth 2024, **CC BY → re-host**); and ~170,000 US piston aircraft
**still legally burn leaded avgas** (~70% of US airborne lead), with no ban before 2030. **The hope
beat:** Bangladesh erased lead-chromate from turmeric with market testing + fines — turmeric samples
47%→0%, child blood-lead −30% in 16 months, at **~$1 per DALY averted**. *Data:* GBD lead (link-only)
+ Pure Earth Sci Rep (re-host) + EPA NEI (PD) + Forsyth 2023 (re-derive). *Temp:* despair + confusion +
hope braided. *Under-told:* lead is filed under "toxics," not air; the cardiovascular reframe is buried.

**M15 · Ammonia: the pollutant no clean-air law touches.** As SO2 and NOx fall, agricultural **NH3**
becomes the *limiting ingredient* in secondary PM2.5 — and it is essentially **unregulated worldwide**.
IASI maps 500+ hotspots, ~85% livestock/fertiliser, the biggest over the Indo-Gangetic Plain, many in
no inventory. *Data:* IASI NH3 (verify → link the hotspot map) + EDGAR NH3 (re-host). *Temp:* despair.

**M16 · Indoor air in the rich world — the unregulated 90%.** People spend ~90% of life indoors, where
there is **no enforceable standard and almost no monitoring**. A gas stove alone adds ~4 ppb NO2 (~75%
of the WHO limit) → ~50k pediatric asthma cases + ~19k US deaths/yr; radon (the #2 lung-cancer cause)
sits above the action level for **83.8M Americans, two-thirds in counties the EPA map calls "low."**
*The hope counterweight:* secondhand-smoke cotinine fell **~90%** by political will alone. *Data:*
Kashtan 2024 Sci Adv (CC BY-NC, ok) + EIA RECS (PD) + Li 2025 radon (verify) + NHANES cotinine (PD,
re-host). *Temp:* despair + a hope counter. *Bifocal:* the poor world's indoor problem is cooking
smoke (M8); the rich world's is stoves + radon.

### ACT VI · The turn  *(hope — the deaths-averted ledger)*

**M17 · The wins are real and fast.** China's post-2013 "war on pollution" cut urban PM2.5 faster than
any nation in history; the **lead phase-out averts ~1.2M deaths/yr**; EU PM2.5 deaths **−57%
(2005–2023)**, beating the 2030 target. The Kuznets question, posed honestly: is "dirty then clean" a
law or an excuse? *Data:* ACAG China (re-host) + EEA indicators (CC BY, re-host) + UNEP (cite). *Temp:*
hope. *Bifocal:* the EU's "same air, opposite verdicts" — deaths down 57% yet 95% of stations fail WHO.

**M18 · The cheapest health buys on the board.** Methane is the only *clean* win-win: a feasible ~45%
cut by 2030 avoids ~0.3 °C **and** ~260k deaths + ~25 Mt crop losses/yr (less methane → less
ground-level ozone over wheat + cities). Plus turmeric's $1/DALY. *Data:* CEDS CH4 (CC BY, re-host) +
UNEP Global Methane Assessment (cite). *Temp:* hope.

### ACT VII · The clawback and the paradoxes  *(despair counter-melody)*

**M19 · Wildfire smoke is global, upside-down, and clawing back the gains.** Landscape-fire smoke kills
**~1.53M/yr — >90% in LMICs, ~39% in sub-Saharan Africa** (savanna/crop burning, not the photogenic
megafires). **Smoke out-kills flame ~10:1** (Australia Black Summer: 417 smoke deaths vs 33 direct;
Indonesia 2015 peat haze ~100k, *denied by all three governments*). Paradox: **Earth burns ~25% LESS**
(savanna decline) even as the *dangerous* fires worsen. And the climate-fire feedback now has a
present-tense body count (~15k US smoke deaths attributed to warming; ~71k/yr projected by 2050). *The
Q3 climate boundary lives here* — wildfire hands *to* this article. *Data:* GFED5 (CC BY, re-host) +
CAMS GFAS (Copernicus, re-host) + Stanford ECHO-Lab smoke (verify). *Temp:* despair + confusion.

**M20 · The aerosol-masking paradox: we cleaned the air and the planet got hotter.** IMO 2020 cut ship
sulfur ~86% to save lungs — and removed a sulfate haze that was seeding cooling clouds, adding
~0.04–0.05 °C; East Asia's ~75% SO2 cut since 2013 saved hundreds of thousands of lives and is
attributed ~0.07 °C of warming, possibly *most* of the post-2010 acceleration. The dirty air was an
accidental, deadly sunscreen we're now removing. (Show the disagreement too — ACP 2025 argues it's
within variability — *that's* the confusion lens.) *Data:* CEDS SO2 (CC BY, re-host) + IGCC 2025 aerosol
ERF (CC BY, re-host); attribution numbers cite-only. *Temp:* confusion. *Sub-beat:* black carbon
isn't a clean win either — for cookstoves the co-emitted organics can flip the sign.

**M21 · Who consumes vs who breathes.** Switch from smokestack to shopping-cart accounting and **~800k
of the 5.1M annual PM2.5 deaths** happen because a richer country (≥50% higher GDP/capita) consumed
goods made in a poorer one's air — and the standard Value-of-Statistical-Life machinery **prices those
lives toward zero by construction**. The USA becomes the #1 net importer of "airborne disease"; the gap
is **widening** (+32%, 2007–17); the same offshoring runs *inside* China (coast → interior, 78,500 net
avoided coastal deaths) and now *cascades* China → Belt-and-Road. *Data:* Illinois IDB-3251572 (**CC BY
✓**) + EDGAR (re-host) + Eora/CEADs (link-only). *Temp:* despair + confusion. *Under-told:* framed as a
within-country governance failure; the structural offshoring + VSL-discounting is the real reason
policy never internalises it.

### ACT VIII · The verdict  *(hard balance)*

**M22 · Cleaner and deadlier, both true.** Bring the two threads together: concentrations down where
measured, total toll up; the wins relocated and unmasking warming. Then the standards-vs-reality close:
WHO halved its guideline in 2021 and pushed **~99% of humanity into non-compliance overnight with no
change in the air**; India's legal limit is **8× the current WHO guideline** (the widely-quoted "4×"
uses the *retired* 2005 number); **158 countries have no PM2.5 standard at all**, and of the 94 that do,
37 breach their own. The refused single answer: the question "cleaner or deadlier?" has no scalar
answer — it depends on whether you count concentrations or bodies, rates or totals, where you live, and
which yardstick you pick. *Data:* WHO Standards DB (verify/link) + ACAG (re-host) + AQLI (re-derive).
*Temp:* the hard balance, named.

---

## The chart manifest (~58 charts in ~50 slots)

One row = one chart = one sub-question. The test for every row: *does it tell something no other
chart does?* (if not, cut it — [[DATA.md]] §1.7). **Gate:** RH = re-host · LO = link-only · RD =
re-derive · V = verify. **Renderer:** ✓ = existing kit (line / bar / stacked / area); anything named
is a **new renderer or static** to schedule ([[CHARTS.md]]). Compositions (4-magnification row, take
strip) bundle several panels the reader scans as one unit.

### Act I · The toll, contested
| # | Sub-question (what's new) | Type | Data | Gate | Renderer |
|---|---|---|---|---|---|
| C1 | How wide is the "7 million"? (3M–9M, four published estimates) | range strip | OWID/GBD | LO | range-strip |
| C2 | WHO vs GBD — and the outdoor/indoor split inside each | grouped bar | OWID/WHO | LO | ✓ |
| C3 | Deaths rose while concentrations didn't — the decoupling | dual line | GBD + ACAG | LO | ✓ |
| C4 | Why: the exposure-response curve got steeper (old vs new) | two-curve line | GBD IER | LO | ✓ |
| C5 | It's the heart — cause decomposition (cardio/stroke/LRI/dementia) | stacked bar | GBD 2023 | LO | ✓ |

### Act II · Who breathes what
| # | Sub-question | Type | Data | Gate | Renderer |
|---|---|---|---|---|---|
| C6 | Life-years lost to PM2.5 — the world | choropleth | ACAG (re-derived AQLI) | RH | **map** |
| C7 | …by region | bar | ACAG | RH | ✓ |
| C8 | …top countries vs tobacco + malnutrition + unsafe water | grouped bar | ACAG/AQLI | RD | ✓ |
| C9 | …one city zoomed (Delhi) — *(C6–C9 = 4-magnification row)* | callout | ACAG | RH | ✓ |
| C10 | Death rate down the SDI (income) ladder | bar/slope | GBD SDI | LO | ✓ |
| C11 | Exposure rises with income, then falls (the curve) | scatter | WB PM2.5 + GDP | RH | **scatter** |
| C12 | PM2.5 by World Bank income group over time | line ×4 | WB `EN.ATM.PM25` | RH | ✓ |
| C13 | Dirty air makes us dumber & poorer — chess · exams · output · crime | take strip (4) | EPA AQS + openICPSR + NIBRS | mixed | **take-strip** |

### Act III · The youngest victims
| # | Sub-question | Type | Data | Gate | Renderer |
|---|---|---|---|---|---|
| C14 | The morbidity iceberg: deaths ≪ LBW ≪ preterm ≪ stillbirths | iceberg | Ghosh 2021 + Xue 2022 | RH | **iceberg** |
| C15 | Share of all preterm births that are PM2.5-attributable, by region | bar | Ghosh 204-country | RH | ✓ |
| C16 | Neonatal toll: household vs ambient (it's the kitchen) | stacked bar | GBD | RD | ✓ |
| C17 | Neonatal death rate falling as clean cooking spreads | dual-axis line | GBD + WHO Household Energy | mixed | ✓ |
| C18 | Saharan-dust-attributable under-5 deaths by country | choropleth | Xu 2025 NSR | RH | **map** |
| C19 | Dust as a share of PM2.5 — the part no control can fix | choropleth | ACAG dust component | RH | **map** |

### Act IV · The data is the story  ⭐ *(signature act)*
| # | Sub-question | Type | Data | Gate | Renderer |
|---|---|---|---|---|---|
| C20 | **The hero map:** monitor & share / monitor not share / don't monitor | 4-cat choropleth | OpenAQ 2024 | RD | **map** |
| C21 | People with no government monitoring, by income group | stacked bar | OpenAQ 2024 | LO | ✓ |
| C22 | The embassy switch-off: data availability before/after Mar-2025 | timeline/slope | OpenAQ S3 archive | RD | ✓ |
| C23 | Of those who share, how many fully? (27% / 28% / 45%) | waffle/stacked | OpenAQ 2024 | LO | waffle→✓ |
| C24 | Low-cost vs reference sensor share, by income group (inverted) | grouped bar | OpenAQ API v3 | RH* | ✓ |
| C25 | Citizens out-count governments — station counts | bar (log) | sensor.community/PurpleAir | RH | ✓ |
| C26 | …but the cheap sensors are wrongest in the humid tropics | scatter (raw vs corrected) | EPA Barkjohn + Uganda | RD | **scatter** |
| C27 | A war reroutes pollution: Red Sea NO2 before/after | before/after raster | Sentinel-5P | RH | **raster-pair** |
| C28 | Satellites catch polluters absent from inventories (759 SO2 sources) | dot map | NASA SO2 catalogue v2 | RH | **map** |
| C29 | The pollutant no law touches: ammonia super-emitters | choropleth/dot | IASI NH3 | V | **map** (link) |

### Act V · The forgotten poisons
| # | Sub-question | Type | Data | Gate | Renderer |
|---|---|---|---|---|---|
| C30 | Lead's body count over time — and that it's ~94% cardiovascular | stacked area | GBD lead | LO | ✓ |
| C31 | The toll that doubled on paper (GBD-2019 vs 2021/2023) | bar compare | GBD/Lancet PH | LO | ✓ |
| C32 | Petrol's gone — lead moved to the cupboard (goods by category) | bar | Pure Earth 2024 | RH | ✓ |
| C33 | Bangladesh erased turmeric lead — child blood-lead shift | paired distribution | Forsyth 2023 | RD | **distribution** |
| C34 | Leaded avgas = ~70% of US airborne lead, still legal | bar | EPA NEI | RH | ✓ |
| C35 | Ammonia rises as SO2/NOx fall (the limiting ingredient) | indexed multi-line | EDGAR/CEDS | RH | ✓ |
| C36 | A gas stove alone ≈ 75% of the WHO NO2 limit | bar + threshold | Kashtan 2024 | RD | ✓ |
| C37 | Radon: two-thirds of the over-exposed live in "low" zones | choropleth | Li 2025 / CDC | V | **map** |
| C38 | The quiet win: secondhand-smoke cotinine −90% (+ the racial gap) | multi-line | NHANES | RH | ✓ |

### Act VI · The turn
| # | Sub-question | Type | Data | Gate | Renderer |
|---|---|---|---|---|---|
| C39 | China's post-2013 PM2.5 plunge — fastest in history | line | ACAG China | RH | ✓ |
| C40 | EU: deaths −57% yet 95% of stations fail WHO (same air, two verdicts) | dual line | EEA | RH | ✓ |
| C41 | Deaths averted by the lead phase-out (~1.2M/yr) | counterfactual area | UNEP/GBD | RD | ✓ |
| C42 | Dirty-then-clean: the environmental Kuznets curve, with country paths | scatter + paths | WB/ACAG | RH | **scatter** |
| C43 | The cheapest buy: methane → ozone → 0.3 °C + 260k deaths + 25Mt crops | combined bar | CEDS + UNEP | mixed | ✓ |

### Act VII · Clawback & paradoxes
| # | Sub-question | Type | Data | Gate | Renderer |
|---|---|---|---|---|---|
| C44 | Smoke deaths are upside-down: >90% LMIC, 39% sub-Saharan | bar/map | GFED5 + Chen 2024 | RD | ✓ /map |
| C45 | Smoke out-kills flame ~10:1 (Australia, Indonesia) | paired bar | Borchers/Koplitz | LO | ✓ |
| C46 | Earth burns *less* but smokier (savanna down, forest up) | dual line | GFED5/MODIS | RH | ✓ |
| C47 | The climate-fire feedback's body count, to 2050 (solid/dashed) | projection line | Qiu/ECHO-Lab | V | ✓ |
| C48 | We cleaned the air and warming sped up: aerosol ERF weakening | line | IGCC 2025 | RH | ✓ |
| C49 | IMO-2020 sulfur cap fades over the shipping lanes | before/after raster | Sentinel-5P/CEDS | RH | **raster-pair** |
| C50 | China's SO2 cliff vs the post-2010 warming acceleration | dual line | CEDS | RH | ✓ |
| C51 | Black carbon isn't a clean win: BC:OC by source (sign flips) | bar | CEDS | RH | ✓ |
| C52 | Who imports "airborne disease" — net flows (USA #1) | diverging bar/map | Illinois IDB-3251572 | RH | ✓ /map |
| C53 | The offshoring gap is *widening* (+32%, 2007–17) | line | Earth's Future 2025 | LO | ✓ |
| C54 | Offshoring without a border: China coast → interior | sankey/bar | CEADs | RD | sankey→✓ |

### Act VIII · The verdict
| # | Sub-question | Type | Data | Gate | Renderer |
|---|---|---|---|---|---|
| C55 | 99% non-compliant — but the guideline moved in 2021 (before/after) | step bar | WHO + ACAG | RD | ✓ |
| C56 | Legal limits as a multiple of WHO (India 8×) | ranked bar | WHO Standards DB | V | ✓ |
| C57 | 158 countries with no standard; 37 breach their own | waffle/map | AQLI/WHO | RD | **map** |
| C58 | Cleaner **and** deadlier: concentration down, total toll up | dual-axis line | ACAG + GBD | mixed | ✓ |

### Renderer build list (what the manifest demands beyond the existing kit)
- **Choropleth map** — *load-bearing*, ~10 charts incl. the C20 hero map (C6, C18, C19, C20, C28, C29, C37, C52, C57). **Build this first**; it gates the whole signature act. Must do 4-category categorical fills *and* sequential.
- **Before/after raster pair** — 2 charts (C27, C49), satellite imagery as **static side-by-side composites with `↓ source`**, not live tiles.
- **Scatter** — 3 charts (C11, C26, C42), incl. trajectory paths for the Kuznets curve.
- **One-offs** (build or gracefully fall back to bar): range-strip (C1), iceberg (C14), paired-distribution (C33), take-strip composition (C13), waffle (C23/C57 → bar), sankey (C54 → bar).

> `*` C24 OpenAQ per-source gate with the non-compete caveat; ~15 of the 58 are **link-only statics**
> (all GBD burden charts + the satellite rasters) — build-time SVG/raster + link-out, no CSV download.

## Adapters — what to actually build (resist speculative builds, [[DATA.md]] §1.7)

1. **ACAG S3 adapter** (`s3://satpmdata/`, `--no-sign-request`) — the **one genuinely load-bearing new
   build**: the re-hostable exposure spine + AQLI life-years re-derivation (M4, M5, M17, M22). CC BY 4.0.
2. **GBD via existing OWID adapter, flagged link-only** — no new code; charts render, but mark
   link-only and generate no download (M1–M3, M5, M7-partial, M8, M14). The license override must be
   *link-only*, not re-host (the gate trap above).
3. **Zenodo/paper-table ingests** (manual CSV, no adapter) — CEDS (15059443), GFED5, IGCC (20600829),
   Ghosh PLOS S2, Xue/ Xu supplementary, Pure Earth Sci Rep. All CC BY → re-host the derived tables.
4. **EDGAR bulk CSV** — EC reuse notice, re-host w/ attribution (M13, M15, M21).
5. **OpenAQ** — API v3 + S3 archive for the transparency act (M10–M12); cite the 2024 Landscape report.
6. **Satellite imagery (Sentinel-5P/IASI/CAMS)** — heavy; prefer **static re-derived composites as
   inline SVG/raster**, not a live adapter. Copernicus attribution form: "Contains modified Copernicus
   Sentinel data [year]." IASI NH3 → link the hotspot map (verify before re-hosting pixels).

## Gap register (named in the piece, not necessarily charted)

- **Ultrafine particles & VOCs** — thin coverage; mostly absent from open burden data.
- **Stillbirths & morbidity** — definitionally excluded from the headline toll (M7); the honesty is the point.
- **Indoor/personal exposure at population scale** — essentially unmeasured (M16); the 90%-of-life void.
- **Low-cost-sensor accuracy in the tropics** — the humidity-bias caveat must ride alongside any
  citizen-sensor number (M12); don't launder artifact as finding.
- **AQLI / WHO Standards DB / IASI / radon / ECHO-Lab licenses** — all **verify** before re-host; default
  to re-deriving from open inputs (ACAG, NHANES, EPA NEI) rather than re-hosting their processed products.
- **Eora / CEADs / SEDA** — link-only; rebuild the production-based side from EDGAR (CC BY) and publish
  only derived series.

## What changed in the atlas (corrections from the 2026-06-26 verify passes)

- **IHME/GBD → link-only even through OWID** (not CC-BY re-host); **GBD 2023** is the current cycle.
- **EDGAR → EC reuse notice**, not CC BY 4.0; **9** AP species (no CH4); **~26–30** sectors (not 8).
- **ACAG → V6.GL.03 (1998–2024)**, CC BY 4.0 confirmed; V6.GL.02.04 (behind AQLI 2025) retired.
