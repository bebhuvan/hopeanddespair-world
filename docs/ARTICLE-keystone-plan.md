# Keystone article plan — *Is the world getting better or worse?*

The site's titular question, asked whole. Not a thirteenth topic — the **front door** that
stands above the twelve and shows that the verdict flips not just across *time windows*
(our four-magnification signature) but across *dimensions*: humanity is winning some of its
oldest fights and losing newer ones at the same time. This is the most important page on the
site, and its single failure mode is structural (a chart dump), not visual — so it is decided
on paper here before any chart or prose is built.

Companion to [[NORTH_STAR.md]] (the creed), [[docs/DATASET-ATLAS.md]] (the data per
dimension), [[ARTICLE-violence-plan.md]] (the template), [[EXPLAINERS.md]] (the formats),
[[CHARTS.md]] (the kit). The article itself will live at
`src/content/questions/is-the-world-getting-better-or-worse.md`.

Status: **planning** — structure under review, no charts built. Decisions taken with the
user 2026-06-11: **hub architecture · 12 dimensions · verdict-unit per dimension · synthesis
as the spine.**

---

## 1. The role decision (why hub, not epic)

This page is a **hub with a spine**, not a self-contained encyclopedia. Each dimension gets a
*compact* verdict unit, not its full 20–30-chart treatment, and links *down* into its own deep
single-question article (violence already exists; the other eleven are the atlas backlog).

The architecture is chosen so the page gets **lighter as the atlas grows**: today, with only
violence deep, several dimensions carry extra inline prose to stand alone; as each deep article
ships, that depth moves *down* into the room and the keystone keeps just the verdict + link.
A self-contained epic does the opposite — every new dataset makes the monolith heavier and more
fragile, and a 12-domain piece pulling ~30 datasets on one 6-month refresh ([[NORTH_STAR.md]]
creed #6) is a fragility bomb. Hub = each dimension's data lives with its own article's pipeline;
the keystone *composes already-derived series*.

This keeps the two creed-#7 disciplines intact: every unit still earns its place as a
sub-question, and **no silent gaps** — a dimension we can't yet chart is named, not hidden.

## 2. The spine — the one-sentence answer

**Both, and not at random: humanity is winning the fights it has fought the longest — death,
disease, hunger, poverty, everyday violence — and losing the ones that are the bill for that
success — a heating climate, an emptying living world, and arguably its own freedoms under
strain. The optimist and the pessimist are reading different *columns* of the same table.**

This is the thesis at civilizational scale. We never split the difference (both-sidesism is its
own dishonesty, [[NORTH_STAR.md]] creed #1): the synthesis *weighs* the columns — the despair
items are largely the externalities of the hope items (we beat scarcity by burning carbon and
clearing habitat; we beat early death by building a scale that now strains the planet and the
polity). That asymmetry is the argument, and it is what only this page can make.

## 3. The twelve dimensions — verdict, best series, readiness

Ordered by **temperature cluster**, not topic — so the page *enacts* the thesis (see §4). Each
row: the honest sub-question, the single best re-hostable series to carry it, its path+gate from
the atlas, and data-readiness. `live` = derived JSON already on disk; `today` = reachable now via
the existing OWID/WB adapters (no new code); `adapter` = needs a new bulk adapter; `link-only` =
source forbids re-host, chart-and-cite or name as a gap.

### Cluster A — the verdict is clearly *better* (hope)

| Dim | The sub-question | Carrying series | Path · gate | Ready |
|---|---|---|---|---|
| **Health** | Are we beating early death? | UN IGME child mortality (the single most hopeful series on earth) + life expectancy | OWID · re-host | life-exp **live**; IGME **today** |
| **Poverty** | Is the world escaping extreme poverty? | WB extreme poverty ($2.15) + GDP per capita | WB · re-host | both **live** |
| **Hunger** | Is hunger ending? | Undernourishment % (WB FAOSTAT mirror) + famine deaths by decade | WB · **re-host (CC BY)**; famine link-only | **today** ✓ verified |
| **Education** | Are more people learning to read? | Literacy 1820– (van Zanden/OWID) + enrollment | OWID/WB · re-host | **today** |

*Honest tail in each:* poverty's "who is left behind" (sub-Saharan share rising), education's
"quantity up, quality flat?" (PISA/TIMSS, link-only), hunger's post-2015 reversal. The hope is
real and the tail is charted, not buried.

### Cluster B — the verdict is clearly *worse* (despair)

| Dim | The sub-question | Carrying series | Path · gate | Ready |
|---|---|---|---|---|
| **Climate** | Is the climate breaking? | Atmospheric CO₂ (NOAA, 800k-yr) + annual emissions (GCP) — temp anomaly secondary | OWID · **re-host (CC BY/PD)** | **today** ✓ verified |
| **Nature** | Is the living world dying? | IUCN Red List Index + Living Planet Index (tag *contested*), vs forest area / tree-cover loss | OWID · **re-host** | **today** ✓ verified |
| **Freedom** | Is the world becoming less free? | V-Dem liberal-democracy index (1789–) + people living under each regime | OWID · **re-host (CC BY, *not* share-alike)** | **today** ✓ verified |

*Honest counter-arc in each:* climate's **green-transition** sub-beat (rising low-carbon share —
the one real hope lever; folded into Climate, **link-only** so cited not re-hosted, §7), nature's
forest-area + protected-area recovery, freedom's long rise since 1789 before the post-2010s
reversal. Despair earned from data, not asserted. *(Green energy is not a 13th column — it is
Climate's "are we acting, fast enough?" beat, the direction-and-pace verdict in miniature.)*

### Cluster C — genuinely *both* (confusion — the first-class citizen)

| Dim | The sub-question | Carrying series | Path · gate | Ready |
|---|---|---|---|---|
| **Violence** | Is humanity less violent? | Homicide (deep history) + battle deaths (the 2020 break) | OWID · re-host | **live** (deep article) |
| **Wealth & inequality** | Richer — but who gains? | GDP/extreme-poverty (live) vs WID top-1% & bottom-50% shares (1820–) + the $6.85 line | OWID/WB · **re-host (CC BY, *not* SA)** | GDP **live**; shares **today** ✓ |
| **Science** | Speeding up or slowing down? | R&D %GDP + publications rising vs declining disruptiveness (Park/Bloom) | OWID/WB · re-host; Park/Bloom **link-only** | inputs+outputs **today** ✓; disruptiveness link-only |
| **Tolerance** | More tolerant, or less? | Women Business & the Law (1970–) + V-Dem social-group power, vs marriage/attitudes — the law/attitude gap *is* the finding | OWID · **re-host (CC BY)**; attitudes link-only | law **today** ✓; attitudes link-only |
| **Happiness** | Are we happier? | Cantril life-satisfaction (flat, real World row) vs the falling suicide rate | OWID · **re-host (CC BY/WHO)** | **today** ✓ verified |

Confusion is not a hedge here — it is where the site's whole method (epistemic tags, the
disagreement panel, the two-readings format) does its heaviest lifting. These five are the
intellectual core of the page.

**Readiness summary (verified against ground truth, 2026-06-11 — see Appendix A).** Five research
passes curl-fetched every candidate OWID/WB series' real CSV header + metadata license. The result
is far stronger than first assumed: **all 12 dimensions have a re-hostable (CC BY/CC0/PD) carrying
series ingestable *today* with zero new adapter code** — only registry entries. Three already live
(violence, health, poverty); nine more verified ready (climate, education, freedom, tolerance,
nature, happiness, inequality, science, **hunger** via the WB FAOSTAT mirror). **Two assumptions in
earlier drafts were wrong and are corrected:** V-Dem and WID are published on OWID as *plain CC BY
4.0, not share-alike*, so freedom / inequality / science need **no new adapter** (OpenAlex is
unnecessary). **Green-energy is now re-hostable too** — a new **Ember adapter** (CC BY 4.0, built 2026-06-11) ingests it directly, sidestepping OWID’s Energy-Institute blend; three World series are live on disk (wind+solar, low-carbon, fossil generation). So **every dimension now has a re-hostable carrying series — nothing link-only-blocked.** Full per-series specs, columns, spans, and gates in **Appendix A**; only the (non-load-bearing) temp-anomaly OGL-v3 licence call remains open in §7.

## 4. Page structure — the argument arc

Five movements. The order is the argument: establish *why* honest people disagree, walk the
reader through the three temperature clusters so the colours visibly group, then *weigh* them.

| Movement | Job | What's on it |
|---|---|---|
| **0 — The trap** | Why the same world yields opposite verdicts | The origin insight ([[NORTH_STAR.md]]): magnification. One four-magnification row of a single metric to *teach the move* before applying it twelve times. |
| **I — What we are winning** | Cluster A, four verdict units | Health · poverty · hunger · education. The reader sees four cool-toned verdicts in a row and feels the optimist's honest case. |
| **II — What we are losing** | Cluster B, three verdict units | Climate · nature · freedom. Warm-toned. The pessimist's honest case, equally earned. |
| **III — What is genuinely both** | Cluster C, five verdict units | Violence · inequality · science · tolerance · happiness. Where the verdict word splits, and where the article is most itself. |
| **IV — The synthesis** | Weigh the columns | The payload (§2): the pattern is not noise. We win the ancient fights and lose the fights with our own scale. Plus **"What the data can't see"** (whole-world version) and the **"Still lost? Read this."** closing box. |

The verdict-unit clustering is the four-magnification signature *promoted one level*: instead of
one metric's verdict flipping left-to-right across time windows, the *whole page's* verdict flips
top-to-bottom across dimensions, the temperature colours arguing in plain sight. That visible
flip is the thing only this page can show.

## 5. The verdict-unit spec — a multi-chart mini-suite (decided 2026-06-11)

**Chart density: full suite, ~8 charts per dimension → ~100+ charts total.** The hub model
compresses *prose* (compact take + a link down to the deep article), **not charts**. Each
dimension is a *mini-suite of sub-questions*, every one its own chart — that is how the keystone is
the "mother of all articles" (creed #7) without being a dump: each chart still earns its place as a
sub-question, and there are **no silent gaps**.

Every dimension's verdict unit renders, in order:

1. **Verdict word(s) + temperature** — one/two coloured words (e.g. *Receding · cool*; the split
   *Happening · cool / Too slowly · warm* for energy/climate, the direction-and-pace format).
2. **Four-magnification hero** — the signature 4-spark row (deep history → since 1900 → since 2020
   → a lived day), *where the metric has deep history* (CO₂ 800k yr, literacy 1820, V-Dem 1789,
   inequality 1820, life-exp, violence). Shallow-history metrics (happiness 2011, energy/science/
   hunger ~2000) get a **2–3 window** row over their real span, or skip to the carrying line.
3. **The carrying line** — the dimension's spine, full-axed (the long arc).
4. **The counter line** — the honest opposite (CO₂ share down *but total up*; renewables soaring
   *but fossil generation still rising*; literacy up *but learning flat*). Already ingested for most.
5. **The divergence pair (regional)** — the same metric for ~4–6 world regions, "who the average
   hides" — the question laypeople actually ask ([[EXPLAINERS.md]] · divergence pair).
5b. **The country lens — the third magnification (added 2026-06-13).** world → region → *country*.
   Regions are a technocrat's unit ("East Asia & Pacific"); laypeople anchor on countries they can
   name. A ranked bar strip (`bars.ts`) of a curated ~12-country spread at the latest year makes the
   regional abstraction concrete and shows the within-region spread a regional average launders away
   — on-thesis ("depends on the lens"). Built by the generalized, config-driven
   `scripts/analysis/country-cross-sections.ts` (reads already-snapshotted OWID/WB sources, fetches +
   snapshots any that aren't; real values only, curated ISO3 set authored per dimension; range-based
   tri-colour by direction, log-scale for income/emissions, `neutral` tone for no-verdict measures
   like fertility & trade openness; a `MIN_YEAR` floor drops stale "latest" values). Wired via the
   `countries:` (bar snapshot) and `countryTrend:` (focused 2-country journey, e.g. India vs Nigeria)
   dimension fields → `buildDimensions()`. **Selective by design:** strips on every eligible dimension;
   trajectory pairs only where a divergence is the story. Skipped where a country bar is meaningless
   (inherently-global metrics) or the source isn't snapshot-able. Gated by `prose:lint` (now sweeps
   every article's chart `note:` prose, not just movements).
6. **A signal grid** — 3–5 corroborating measures as small-multiples, read at a glance.
7. **A two-temperature take** + **epistemic-status tag** (*measured · estimated · reconstructed ·
   contested* — real work in nature/LPI, science, tolerance) + **"Go deeper →"** link to the room.

That is ~6 full charts + ~8 sparklines per dimension. The discipline that keeps ~100 charts from
becoming a dump: **every chart answers a distinct sub-question** (the long arc / now / the
counterpoint / *where* / the corroboration), and any sub-question we cannot yet chart is logged in
the §7 gap register or named in the piece — never silently dropped.

**What this costs in data (the second ingestion push, §8 step 2b):** carrying + counter are mostly
in already; the *new* needs are (a) **regional cuts** — same OWID/WB slug, new `entityFilter` +
`pick_entity` per region (mostly mechanical, no new code, reusing the `dataRefs[]` multi-line
pattern from the violence article), and (b) **2–3 secondary indicators per dimension** for the
signal grids. Both are mapped in `docs/DATASET-ATLAS.md` and verified per Appendix A as they land.

## 6. Cross-dimension synthesis — the payload (Movement IV)

The one thing the rooms cannot write. Draft argument, to be earned from the assembled verdicts:

- The hope cluster (health, poverty, hunger, everyday violence, literacy) is humanity's record
  against **scarcity and early death** — the fights it has organized against for centuries.
- The despair cluster (climate, biodiversity, and the strain on freedom) is largely the
  **externality of that very success**: the scale, energy, and extraction that beat scarcity now
  bill us back; the information scale that connected everyone now strains the polity.
- So the honest answer is not "50/50." It is: *better at the things we have long known how to
  fight, worse at the consequences of how we won.* Whether that nets to hope or despair depends
  on whether the second set is the kind of problem we can also organize against — which is
  exactly **the open question**, and where the **"what would change my mind"** note lives.

This refuses both Pinker-triumphalism and collapse-doomerism without splitting the difference.

## 7. Gap register — what the keystone will not (yet) show, honestly

Per creed #7, every obvious sub-question is charted, registered here with its blocker, or named
in the piece as illegible.

**The two real blockers (verified) — each needs a decision, neither sinks a dimension:**

1. **Green-energy transition → RESOLVED to re-host.** OWID's energy graphers blend in **Energy
   Institute © 2025** proprietary data (link-only), but the **Ember API** (api.ember-energy.org)
   serves Ember's *own* electricity data as **CC BY 4.0**. A new **Ember adapter** (`scripts/ingest/ember.ts`,
   built 2026-06-11) ingests it directly. Three World series are live on disk: wind+solar share
   (0.2%→17.3%, the hope), low-carbon share (35→43%, rising slowly), and fossil generation
   (9.9k→18.2k TWh, *still climbing* — renewables add, don't yet replace). That trio **is** the
   direction-and-pace verdict — *Happening · cool / Too slowly · warm* — folded into Climate, now
   fully re-hostable with downloads. (Key in gitignored `.env`; never snapshotted.) No decision
   pending. *Open editorial option:* promote green-energy to its own 13th column now that the data
   is this clean and the story this sharp.
2. **Hunger → RESOLVED to re-host.** FAO's OWID series is CC BY-**NC-SA** (link-only), but the
   World Bank FAOSTAT mirror `SN.ITK.DEFC.ZS` (undernourishment %) is **CC BY 4.0 with a clean
   `WLD` row** — *curl-confirmed 2026-06-11* (2020: 8.2 → 2022: 8.6 → 2023: 8.5, the post-2015
   reversal intact). Use the WB mirror as hunger's carrying series. Only **famine-deaths-by-decade**
   (WPF, the hope counterpoint) stays link-only. No decision needed — hunger ingests today.
   *FAO-direct (faostatservices.fao.org, domain `FS` Suite of Food Security Indicators) is
   available as **link-only, image-only enrichment** for the deep hunger article — token-verified
   2026-06-11 — but it is **CC BY-NC-SA 3.0 IGO**: chart-and-cite only, no download, the chart
   tagged CC BY-NC-SA, the site non-commercial where it appears. Needs `FAO_USERNAME`/`FAO_PASSWORD`
   for a reproducible per-run token (access tokens expire ~60 min). Not used for the keystone's
   carrying hunger number — the clean WB mirror is.*

**One licence-policy call:**

- **Climate temperature anomaly is OGL v3**, not strictly CC BY/CC0/PD. OGL v3 permits
  redistribution with attribution but is outside the current gate list. CO₂ (CC BY/PD) carries the
  climate dimension regardless, so temp-anomaly can be link-only or we **widen the gate to admit
  OGL v3** ([[DATA.md]] §9). **Decision needed:** widen the gate, or keep temp link-only?

**Link-only by design (the gap *is* content, via the disagreement / law-vs-attitude formats):**

- **Tolerance attitudes** (World Values Survey, Pew same-sex-marriage count, Velasco LGBT index)
  → restricted; the **open-law / restricted-attitude split is the finding**, surfaced not hidden.
- **Living Planet Index** → re-hostable but **contested** (WWF/ZSL vs mean-of-ratios critics);
  ships with a `contested` epistemic tag beside the uncontested Red List Index.
- **Science productivity** (Park 2023 disruptiveness, Bloom 2020 "ideas harder to find") →
  academic replication data; quote the figures (manual number audit), link, never re-host.
- **Education quality** (PISA/TIMSS, OECD), **mental-health prevalence** (IHME GBD, HTTP 403),
  **happiness micro** (Gallup) → restricted; cite aggregates, never re-host.
- **Permanently illegible** → meaning, loneliness, dignity, the texture of a life — the
  whole-world **"What the data can't see"** box, Movement IV. The honesty move at species scale.

## 8. Build order (what to actually do, when we start)

Structure first, then the cheapest real data, then the adapters — never speculative.

1. **Agree this doc.** No charts until the five-movement arc and the verdict-unit spec are signed
   off — structure is the failure mode.
2. ✅ **DONE 2026-06-11 — verified re-host series ingested.** 18 new series across all nine
   not-yet-live dimensions (climate, hunger, education, freedom, tolerance, nature, happiness,
   inequality, science + the Ember green-energy trio) now on disk under `src/data/derived/`, all
   **CC BY 4.0**, validated, with downloads. Manual number audit passed (literacy 12→87%, WBL
   45.7→77.9, undernourishment 12.8→8.5%, libdem 0.07→0.37, top-1% 19.7→20.7%, Red List 0.82→0.72,
   LPI 100→27, CO₂ 277→426 ppm, R&D 1.96→2.67%, wind+solar 0.2→17.3% …). Two tiny framework adds:
   `yearMin` (trims deep-time CO₂) and the `ONLY=` dev filter. **Every one of the 12 dimensions now
   has real, re-hostable data.**
2b. **The full-suite data passes (Appendix B) — toward ~100 charts.** *Started 2026-06-11:*
   climate's regional CO₂ cut ingested (6 regions, one `.map` block, zero new code — the proof).
   Remaining: the **regional pass** (`.map` blocks over the regional aggregates already inside each
   carrying slug — ~55 indicators, mechanical) and the **signal pass** (~30 secondary slugs via the
   Appendix-A verify treatment; some land link-only). Run by `pnpm data`; audit each batch.
3. ✅ **DONE 2026-06-11 — the mini-suite component is built and rendering.** `src/lib/keystone-charts.ts`
   (`buildDimensions`) renders each dimension from real derived series with **auto-computed axes**
   (so ~140 charts need no hand-authored axis configs), driven by an optional `dimensions[]` block on
   the content schema; `[slug].astro` lays them out in temperature clusters. Proven on three
   dimensions (education/inequality/climate, one per cluster): the four-magnification hero, carrying +
   counter, the regional divergence pair, and the signal grid all render from real data, zero client
   JS, fully on-brand. **Next: author the remaining ~15 dimensions** into the keystone frontmatter
   (mechanical — reference the chartIds already on disk) + the synthesis (Movement IV) + prose pass.
4. ✅ **DONE 2026-06-11 — the full article is authored and rendering.** 22 dimensions across the
   three temperature clusters, **44 full charts + 49 sparklines**, plus the complete back matter:
   the two strongest cases, "what would change the verdict", methodology, sources, and the closing
   synthesis with the **"What the data cannot see"** box (which surfaces the Information/Trust/
   Housing finding — the unmeasured frontier). Passes `pnpm verify` (zero JS, no chart lib, size,
   prose lint). Seven open sources. `status: draft` until a human review + publish decision.
4b. ✅ **DONE 2026-06-12 — the link-only gate is built, and Animal Welfare is in.** The pipeline now
   honours `gate: 'link-only'` + a `license` override: it writes the derived series (so the chart
   renders) but **no downloadable artifacts**, and records the true restricted licence. First use:
   `animals.land_slaughtered.world` (FAO CC BY-NC-SA, 7 species summed, 7.9B→86.3B) — the
   honesty-test dimension, now the third column in "what we are losing". **23 dimensions total.**
   *(Information & Trust and Housing-affordability remain genuinely unmeasured — named in the
   closing "What the data can't see" box rather than forced into thin charts.)*
5. **Resolve the blockers** per §7: confirm the WB FAOSTAT mirror for hunger; decide Ember-adapter
   vs link-only for energy; decide the OGL-v3 gate call for temp anomaly.
6. **Prose pass** Movement by Movement against [[ANTI-AI.md]]; manual number audit against
   `src/data/derived/*.json` (never invent a number); LLM disclosure on the page.
7. **Flip to `status: published`** only when the synthesis (Movement IV) is real and a majority of
   the twelve carry an honest verdict — the rest visibly registered, not hidden.

## 9. Open questions for the next session

- **Movement 0's teaching metric:** which single dimension best teaches "magnification flips the
  verdict" before we apply it twelve times? Violence (we have the deepest series) vs life
  expectancy (the most intuitive to a layperson)?
- **Cluster ordering within a movement:** lead Cluster A with the strongest hope (child
  mortality) or the most surprising (famine mortality)? Lead Cluster B with climate (familiar) or
  nature (under-known)?
- **How heavy may a not-yet-deep dimension's inline prose get** before it stops being a hub and
  starts being the epic we rejected? Propose a hard cap (e.g. one carrying chart + ≤2 paragraphs)
  and hold it.
- **Does the keystone get its own auto-update script, or does it inherit** each dimension's
  refresh and re-compose on any change? (Leaning: re-compose — it owns no series of its own.)

---

## Appendix A — verified ingestion dossier (registry-ready)

Every row below was **curl-verified against ground truth on 2026-06-11**: the real OWID grapher
CSV header (`?csvType=full&useColumnShortNames=true`) confirms the value column and a `World` row;
the `.metadata.json` confirms the licence. These are copy-ready `registry/indicators.ts` entries —
match the existing `IndicatorSpec` shape (`pick_entity` on `World`/`OWID_WRL`, or the WB ISO3
`WLD`). **Multi-column graphers are flagged ⚠ — they MUST set `sourceColumn(s)` or the adapter
silently reads the last column** (the battle-deaths bug, CLAUDE.md gotcha).

**RE-HOST — ingest today (CC BY / CC0 / PD), zero new adapter code:**

| Dim | suggested id | adapter | slug / WDI code | value column | gate | span | role · temp |
|---|---|---|---|---|---|---|---|
| Climate | `climate.co2_concentration.world` | owid | `co2-long-term-concentration` | `co2_concentration` | CC BY+PD | filter ≥1750 → 2025 | carrying · despair |
| Climate | `climate.co2_emissions.world` | owid | `annual-co2-emissions-per-country` | `emissions_total` | CC BY | 1750–2024 | secondary · despair |
| Energy | `energy.wind_solar_share_electricity.world` | **ember** | `electricity-generation/yearly` (seriesName `Wind and solar`) | `share_of_generation_pct` | **CC BY** ✓ ingested | 2000–2025 | carrying · hope |
| Energy | `energy.clean_share_electricity.world` | **ember** | `electricity-generation/yearly` (seriesName `Clean`) | `share_of_generation_pct` | **CC BY** ✓ ingested | 2000–2025 | secondary · confusion |
| Energy | `energy.fossil_generation.world` | **ember** | `electricity-generation/yearly` (seriesName `Fossil`) | `generation_twh` | **CC BY** ✓ ingested | 2000–2025 | counter · despair |
| Hunger | `hunger.undernourishment_share.world` | worldbank | `SN.ITK.DEFC.ZS` (FAOSTAT mirror) | (WB value) | CC BY | 2000–2023 | carrying · confusion |
| Education | `education.literacy_rate_longrun.world` | owid | `cross-country-literacy-rates` | `literacy_rate` | CC BY | 1820–2023 | carrying · hope |
| Education | `education.primary_enrollment.world` | worldbank | `SE.PRM.ENRR` | (WB value) | CC BY | ~1970–2024 | secondary |
| Freedom | `freedom.liberal_democracy_index.world` | owid | `liberal-democracy-index` | `libdem_vdem__estimate_best` | CC BY *(not SA)* | 1789–2025 | carrying · confusion |
| Freedom | `freedom.population_by_regime.world` | owid | `people-living-in-democracies-autocracies` ⚠ | pin one `population_regime__category_*` | CC BY | 1789–2025 | counter · despair |
| Tolerance | `rights.women_business_law_index.world` | owid | `women-business-and-the-law-index` | `sg_law_indx` | CC BY | 1970–2023 | carrying · hope |
| Tolerance | `rights.social_group_power_equality.world` | owid | `equality-of-political-power-across-social-groups-score` | `socgr_pow_vdem__estimate_best` | CC BY | 1789–2025 | counter · confusion |
| Nature | `nature.red_list_index.world` | owid | `red-list-index` | `_15_5_1__er_rsk_lst` | re-host | 1993–2024 | carrying · despair |
| Nature | `nature.living_planet_index.world` | owid | `living-planet-index-by-region` | `lpi_final` | re-host **+ tag `contested`** | 1970–2024 | carrying · despair |
| Nature | `nature.forest_area.world` | owid | `forest-area-km` | `_1a_forestarea` *(verify ha units)* | re-host | 1990–2025 | counter · confusion |
| Nature | `nature.tree_cover_loss.world` | owid | `tree-cover-loss` ⚠ | `tree_cover_loss_ha__category_total` | re-host | 2001–2024 | counter · despair |
| Happiness | `wellbeing.cantril_ladder.world` | owid | `happiness-cantril-ladder` | `cantril_ladder_score` *(World is pop-weighted)* | re-host | 2011–2025 | carrying · confusion |
| Happiness | `wellbeing.suicide_rate.world` | owid | `death-rate-from-suicides-gho` ⚠ | `death_rate100k__age_group_age_standardized__sex_both_sexes__cause_self_harm` | re-host (WHO GHO) | 2000–2021 | counter · hope-in-despair |
| Inequality | `inequality.income_share_top1.world` | owid | `income-share-top-1-before-tax-wid` | `share_top_1__welfare_type_before_tax__extrapolated_no` | CC BY *(not SA)* | 1820–2024 | carrying · despair |
| Inequality | `inequality.income_share_bottom50.world` | owid | `income-share-distribution-before-tax-wid` ⚠ | `share_bottom_50__welfare_type_before_tax__extrapolated_no` | CC BY | →2024 | carrying · despair |
| Inequality | `economy.poverty_685.world` | worldbank | `SI.POV.UMIC` | (WB value) | CC BY | ~1990–2024 | secondary · confusion |
| Science | `science.rnd_spend_gdp.world` | owid | `research-spending-gdp` | `gb_xpd_rsdv_gd_zs` | CC BY | 1996–2023 | carrying · hope |
| Science | `science.publications_total.world` | owid | `scientific-and-technical-journal-articles` | `ip_jrn_artc_sc` | CC BY | 1996–2022 | carrying · confusion |
| Science | `science.researchers_per_million.world` | worldbank | `SP.POP.SCIE.RD.P6` | (WB value) | CC BY | 2000–2020 | secondary · hope |
| Water | `water.safe_drinking_water.world` | worldbank | `SH.H2O.SMDW.ZS` | (WB) | CC BY ✓ ingested | 2000–2024 | carrying · hope (61→74%) |
| Water | `water.open_defecation.world` | worldbank | `SH.STA.ODFC.ZS` | (WB) | CC BY ✓ | 2000–2024 | counter · hope (22→4%) |
| Tech | `technology.internet_users.world` | owid | `share-of-individuals-using-the-internet` | `it_net_user_zs` | CC BY ✓ | 2005–2025 | carrying · hope (16→74%) |
| Tech | `technology.electricity_access.world` | owid | `share-of-the-population-with-access-to-electricity` | `eg_elc_accs_zs` | CC BY ✓ | 1998–2023 | secondary · hope |
| Work | `work.vulnerable_employment.world` | worldbank | `SL.EMP.VULN.ZS` | (WB) | CC BY ✓ | 1991–2024 | carrying · confusion (42%) |
| Gender | `gender.education_parity.world` | worldbank | `SE.ENR.PRSC.FM.ZS` | (WB) | CC BY ✓ | 1970–2020 | carrying · hope (0.79→0.99) |
| Gender | `gender.maternal_mortality.world` | worldbank | `SH.STA.MMRT` | (WB) | CC BY ✓ | 1985–2023 | secondary · hope (460→197) |
| Gender | `gender.women_in_parliament.world` | worldbank | `SG.GEN.PARL.ZS` | (WB) | CC BY ✓ | 1997–2024 | secondary · hope (12→27%) |
| Demography | `demography.fertility_rate.world` | owid | `children-per-woman-un` | `fertility_rate__sex_all__age_all__variant_estimates` | CC BY ✓ | 1950–2023 | carrying · confusion (4.9→2.3) |
| Demography | `demography.pop_65plus.world` | worldbank | `SP.POP.65UP.TO.ZS` | (WB) | CC BY ✓ | 1960–2024 | counter · despair (5→10%) |

**New source adapters (built 2026-06-11) — stories OWID/WB can't re-host:**

| Dim | id | adapter | source | gate | the story |
|---|---|---|---|---|---|
| Climate | `climate.temperature_anomaly.world` | **nasa** | NASA GISTEMP v4 (via datahub mirror) | **Public Domain** ✓ | the iconic warming curve, −0.18→+1.19 °C (the OWID temp is OGL v3; this is PD-clean) |
| Science | `science.works_total.world` | **openalex** | OpenAlex `group_by` | **CC0** ✓ | scholarly output exploding, 92k→10.6M works/yr — "more papers ≠ more progress" |
| Science | `science.works_open_access.world` | **openalex** | OpenAlex (is_oa filter) | **CC0** ✓ | open access now ~6.5M of 10.6M — knowledge opening up |

*(NASA's own host times out under Node's fetch in some environments though curl succeeds — the
adapter pulls the identical GISTEMP numbers from the open datahub GitHub mirror, which Node reaches
reliably; attribution stays NASA GISS.)* Next adapter candidates: **ILOSTAT** (child-labour gap),
**IRENA** (solar-cost collapse), **Global Energy Monitor** (coal pipeline), **Maddison** (2,000-yr
income arc).

**Animal welfare — LINK-ONLY (the honesty dimension).** Carrying = `animals-slaughtered-for-meat`
(~80B land animals/yr, multi-column → sum or pick chicken) + `meat-supply-per-person`, both **FAO
CC BY-NC-SA 3.0 IGO → link-only** (image-only, no download — the treatment the user OK'd). The hope
counter `eggs-cage-free` is re-host (EU/USDA/CC BY) but **has no World row** (country small-multiples
only). `farmed-fish-killed` has a null source licence → link-only. **This dimension drives building
the link-only gate** (§8) — it cannot ship until the pipeline can render a chart without a download.

**Existential risk — a FRAME, not a column.** No verdict unit; it closes the synthesis (Movement IV):
nuclear (already in violence), plus AI / engineered-pandemic / climate-tail as "what could change
everything." Cited, not charted as a dimension.

*Already live on disk (no work):* violence (rich), `health.life_expectancy.world`,
`economy.extreme_poverty.world`, `economy.gdp_per_capita.world`. **Health upgrade worth adding:**
UN IGME child mortality — the single most hopeful series on earth — via OWID
`child-mortality` / `child-mortality-igme` (CC BY; verify the World column at ingest).

**LINK-ONLY — cite + link, never re-host (the gap is content):**

| Dim | source / slug | why link-only | use |
|---|---|---|---|
| Energy | OWID `share-electricity-low-carbon`, `fossil-fuel-primary-energy` | Energy Institute © blended in | **superseded** — re-hosted via the Ember adapter (CC BY), see above |
| Hunger | OWID `prevalence-of-undernourishment`, `number-undernourished` | FAO **CC BY-NC-SA 3.0 IGO** | superseded — ingest WB `SN.ITK.DEFC.ZS` (CC BY) instead |
| Hunger | `deaths-from-famines-by-decade` | WPF permission-only (no CC grant) | the forgotten-good-news chart, cited |
| Tolerance | `same-sex-marriage-country-count` (Pew), `lgbt-rights-index` (Velasco) | non-CC publisher terms | the law-vs-attitude gap; quote the 0→39 count |
| Science | Park 2023 (CD-index), Bloom 2020 | academic replication archives; OWID 404 | quote figures (number audit), link |
| Climate | `temperature-anomaly` | **OGL v3**, outside the CC gate | secondary to CO₂; or widen the gate (§7 decision) |
| Health/Happiness | IHME GBD mental-health/disease (HTTP 403) | IHME non-redistributable | "What the data can't see" / cite |

**Slug traps caught (would have 404'd or mis-read silently):** the real slugs are
`co2-long-term-concentration` (not `…-concentration-long-term`), `number-undernourished` (not
`number-of-people-undernourished`), `deaths-from-famines-by-decade` (not `famine-deaths`),
`cross-country-literacy-rates` (not `literacy-rate`), `living-planet-index-by-region` (not
`living-planet-index`), `forest-area-km` (not `forest-area`), `income-share-top-1-before-tax-wid`
(not `income-share-of-the-top-1`), `scientific-and-technical-journal-articles` (not
`annual-scientific-publications`), `annual-patent-applications` (not `patent-applications`),
`death-rate-from-suicides-gho` (the `suicide-death-rates` slug is 403). **No global aggregate
exists** for Gini (`economic-inequality-gini-index`) or per-country happiness
(`share-of-people-who-say-they-are-happy`) — use per-country only, never a naive World mean.

---

## Appendix B — the chart budget (~100 charts, mapped)

The full-suite decision (§5) in concrete terms: each dimension is a mini-suite of sub-questions.
`✓` = ingested · `R` = regional cut, mechanical (same slug, `.map` over the regional aggregates
already in it — proven on climate, zero new code) · `S` = secondary slug, needs a verify+ingest
pass · `L` = link-only (cite, no download). Hero = four-magnification row where deep history
exists, else a 2–3 window row over the real span.

| Dimension | Hero | Carrying | Counter | Regional (divergence) | Signal grid (3–5) | ~n | Status |
|---|---|---|---|---|---|---|---|
| **Violence** | ✓ deep | homicide ✓ | battle-deaths ✓ | ✓ homicide/battle by region | ✓ nuclear·military·terror·refugees·nonstate | ~12 | **largely done** |
| **Health** | ✓ life-exp deep | life-exp ✓ | obesity/mental S | R life-exp by region | child-mortality·vaccines·maternal S | ~8 | carrying done |
| **Poverty** | Maddison deep S | extreme pov ✓ | $6.85 ✓ | R poverty by region | GDP ✓·Gini·Findex S | ~8 | strong |
| **Hunger** | window (2000+) | undernourish ✓ | famine-deaths L | R by region | stunting·food-supply S/L | ~6 | carrying done |
| **Education** | ✓ literacy 1820 | literacy ✓ | mean-years S / PISA L | R SDG regions | enrollment·schooling S | ~8 | carrying+hero done |
| **Climate** | ✓ CO₂ conc deep | CO₂ emissions ✓ | concentration ✓ | **✓ CO₂ by region (done)** | temp L·sea-level·methane·energy S | ~10 | **regional done** |
| **Energy** | window (2000+) | wind+solar ✓ | fossil-gen ✓ | R Ember by region | clean ✓·coal·EV·capacity S | ~9 | strong |
| **Nature** | window (1970+) | Red List ✓ | LPI ✓ (contested) | R LPI/forest by region | forest ✓·protected-area·tree-loss S | ~9 | strong |
| **Freedom** | ✓ V-Dem 1789 | libdem ✓ | regime-population S | R pop-weighted regions | electoral-dem·press L·corruption S | ~8 | carrying+hero done |
| **Tolerance** | window (1970+) | WBL ✓ | V-Dem social-power S | R WBL by region | marriage L·LGBT L·V-Dem S | ~7 | carrying done |
| **Inequality** | ✓ top-1% 1820 | top-1% ✓ | $6.85 ✓ | R income shares by region | top-10%·bottom-50%·Gini S | ~9 | strong |
| **Science** | window (1996+) | R&D % ✓ | publications ✓ | R R&D by region | researchers·patents S | ~7 | carrying done |
| **Happiness** | window (2011+) | life-satisfaction ✓ | suicide ✓ | R satisfaction by region | mental-health L·depression L | ~6 | carrying done |
| **Water & san.** | window (2000+) | safe water ✓ | open-defecation ✓ | R by region | sanitation ✓·handwashing S | ~7 | carrying done |
| **Technology** | window (1990+) | internet ✓ | offline billions (derive) | R rich regions in slug | mobile ✓·electricity ✓·misinfo L | ~8 | strong |
| **Work & jobs** | window (1991+) | vulnerable-emp ✓ | unemployment ✓ | R WB regions | working-hours S·child-labour **gap** | ~6 | carrying done |
| **Gender** | ✓ parity 1970 | education-parity ✓ | labour-ratio ✓ | R by region | maternal ✓·parliament ✓·sex-ratio S | ~8 | **strong** |
| **Demography** | ✓ fertility 1950 | fertility ✓ | 65+ aging ✓ | R rich regions in slug | population·median-age S | ~7 | strong |
| **Animal welfare** | window (1961+) | slaughter **L** | meat/capita **L** | R continents (L) | farmed-fish L·cage-free (no World) | ~6 | **link-only — needs gate** |

**Total ≈ 140 charts** (≈ 95 full + ≈ 45 magnification sparklines) across **18 data dimensions +
the existential-risk frame**. **Already on disk: ~55** (every carrying + most counters + the whole
violence suite + climate's regional cut + the six new dimensions' carrying/counter lines). The rest
is the same two lightweight passes, not bespoke builds:

- **Regional pass (`R`): ~80% done (2026-06-11).** 50 regional series now on disk — climate (6) +
  education, freedom, inequality (OWID continental aggregates) + poverty, water, gender, work (the
  6 standard WB regions, via a `flatMap`). Total registry now **111 indicators / 111 derived series**.
  One real catch: the WB renamed the MEA aggregate to "Middle East, North Africa, Afghanistan &
  Pakistan" — fixed. Remaining regional cuts (health, nature, happiness, science, tolerance, hunger,
  energy, demography, technology) follow the same two patterns.
- **Signal pass (`S`):** ~2–3 secondary slugs × 13 ≈ 30 — needs the Appendix-A verify treatment
  (curl the column/World-row/licence), some land link-only (`L`). The discovery agents handle it.

So ~100 charts is **mapped and mostly mechanical**, not aspirational — and every chart answers a
distinct sub-question (long arc / now / counterpoint / *where* / corroboration), so it stays
exhaustive, never a dump. Charts that can't clear the licence gate are `L` (cite, no download);
sub-questions with no open series are named in the gap register — no silent gaps (creed #7).
