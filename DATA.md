# Data — the ingestion & provenance architecture

> Trust is the product. Every number on the site must be traceable, reproducible, and honestly
> licensed — or it doesn't ship. Companion to [[PLAN.md]] §4, [[NORTH_STAR.md]] (the creed),
> [[CHARTS.md]], and [[PERFORMANCE.md]].

---

## 1. Principles (the invariants)

1. **Snapshot everything; never hit a live API at build or request time.** Each ingest pins a
   source at a **vintage** with a **checksum**; all downstream work reads the snapshot. The site
   is always the last good build. (This single rule buys reproducibility, honesty, resilience,
   and free provenance.)
2. **Offline & scheduled.** Ingestion runs on a cron (per-source cadence), not in the request
   path and not in the Astro build. The build only reads already-produced artifacts.
3. **Raw → normalized → derived, never skip a layer.** Every value traces back through recorded
   steps to a source byte. No magic numbers.
4. **Provenance is mandatory.** A series with no license, vintage, source URL, and definition is
   a bug — validation rejects it. No orphan data.
5. **License-gated.** "Open" ≠ "re-hostable." The license field decides whether we mirror the
   CSV or link-only. Attribution is generated from the registry, never hand-typed and forgotten.
6. **Human-gated publish.** Validation produces a report; flagged anomalies block auto-publish
   until a person signs off. Aligns with the editorial creed — the verdict is never a black box.
7. **Refine by subtraction (OWID-first).** Do not build 20 adapters on day one. Build one
   excellent keystone adapter (Our World in Data) that already harmonizes most of the world,
   then drop to primary sources only where you must. (See §3, §11.)

---

## 2. The pipeline & storage layout

```
fetch (snapshot+checksum) → normalize (canonical series) → validate → derive (recipes)
  → render artifacts (svg/png/csv/json) → index → commit → (human gate) → publish
```

```
data/
  sources/<source>/<vintage>/raw.*          # exact bytes (or pointer+checksum if huge → R2/LFS)
  sources/<source>/<vintage>/snapshot.json  # {fetchedAt, checksum, license, url, adapterVersion}
  normalized/<indicatorId>.json             # canonical series (the seam output) — IN GIT
  derived/<chartId>.json                    # transformed series + the recipe that made it — IN GIT
  registry/indicators.yaml                  # the backbone (§4)
  registry/entities.csv                     # canonical country/region table (§5)
scripts/
  ingest/<source>.ts                        # one adapter per source (§3)
  pipeline.ts                               # orchestrates fetch→normalize→validate→derive
  render-charts.ts                          # derived → svg/png/csv/json (CHARTS.md)
  validate.ts                               # the validation framework (§7)
public|R2/charts/<chartId>/{chart.svg,png,csv,json}
```

**Storage tiering (what lives where):**

| Layer | Holds | Where |
|---|---|---|
| **Git** | normalized series, derived series + **recipes**, registries, snapshot manifests (checksums) | repo |
| **R2 / Git-LFS** | raw bytes (can be GB), chart PNGs | object store, referenced by checksum |
| **Pages/CDN** | the static site + chart artifacts | CDN |

> Keep the **recipe + checksum + normalized series in git** (small, diffable, the lineage);
> keep **raw bytes out of git** (pointer + hash). You get full reproducibility without bloating
> the repo with gigabytes.

---

## 3. The adapter framework

One adapter per source. `normalize()` is **pure** (raw → canonical) so it is unit-testable with
fixtures. Prefer **bulk/catalog downloads over per-row API calls** (fewer rate limits, trivially
snapshottable).

```ts
interface RawSnapshot {
  source: string;
  vintage: string;          // ISO date we pinned it, e.g. "2026-06-08"
  url: string;
  checksum: string;         // sha256 of raw bytes
  license: string;          // SPDX-ish, drives the license gate (§9)
  body: unknown;            // parsed raw (CSV rows / JSON), or a pointer to R2 if huge
  adapterVersion: string;
}

interface CanonicalPoint { t: number | string; value: number; }   // year-int or ISO date
interface CanonicalSeries {
  indicatorId: string;      // internal id, e.g. "health.life_expectancy.at_birth"
  entity: string;           // canonical entity code (ISO3 / OWID code) — §5
  unit: string;             // e.g. "years", "per_100k", "tCO2"
  points: CanonicalPoint[];
  provenance: {
    source: string; sourceIndicator: string; url: string;
    license: string; vintage: string; definition: string; notes?: string;
  };
}

interface Adapter {
  id: string;               // "owid" | "worldbank" | "ucdp" | ...
  homepage: string;
  fetch(spec: IndicatorSpec): Promise<RawSnapshot>;
  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[];  // PURE
}
```

**OWID-first strategy.** Our World in Data already standardizes entities, units, and time, and
re-publishes most primary sources under CC BY with consistent structure. **One well-built OWID
adapter unlocks the majority of the atlas.** Cite *both* OWID and the underlying source. Drop to
a primary-source adapter (UCDP, WHO, World Bank) only when OWID lacks the series or you need to
be closer to the metal. This is the honest, fast path for a one-person project.

---

## 4. The indicator registry (the backbone)

A declarative manifest is the heart of the system: it decouples an article from a source's
quirks. An article references a **stable internal indicator id**; the registry says where it
comes from and what to do to it.

```yaml
# registry/indicators.yaml
health.life_expectancy.at_birth:
  title: "Life expectancy at birth"
  unit: years
  adapter: owid
  sourceIndicator: "life_expectancy_0"
  transforms: []                       # recipes applied to the normalized series (§ derived)
  validate: { min: 0, max: 100, monotonicJump: 8 }   # per-indicator sanity bounds (§7)
  primarySource: "UN WPP 2024 / IGME"  # for attribution beyond OWID

violence.battle_deaths.rate:
  title: "Battle-related deaths"
  unit: per_100k
  adapter: ucdp
  sourceIndicator: "best_estimate"
  transforms: [{ op: rate_per_100k, denominator: demography.population.total }]
  validate: { min: 0, max: 5000, requireProvenance: true }
```

Transforms are **named, recorded recipes** (`rate_per_100k`, `deflate_to_2021usd`,
`per_capita`, `index_to_year`, `smooth_is_cosmetic_only`). The recipe is stored in
`derived/<chartId>.json` so the exact calculation is shareable and reproducible (§8). Smoothing
is never a transform — it's cosmetic at render time and disclosed ([[CHARTS.md]]).

---

## 5. Harmonization (the eternal headaches)

- **Entities.** Countries/regions are the #1 source of silent bugs (name variants, ISO codes,
  historical states, aggregates double-counting). Keep one **canonical entity table**
  (`registry/entities.csv`: code=ISO3 + OWID code, name, region, incomeGroup, validFrom/To for
  historical entities). Every adapter maps to it; an unmapped entity is a validation failure.
- **Time.** Canonicalize to `year:int` or ISO date; record granularity (annual/monthly) and
  whether a value is a point, an average, or a fiscal-year figure.
- **Units.** Units are declared and enforced; a per-1,000 vs per-100,000 mismatch must fail
  validation, not reach a chart.

Adopt **OWID's entity standardization** as the canonical baseline (it's the most complete open
one) rather than inventing your own.

---

## 6. The canonical series format (use a standard, don't invent one)

Normalized series are written as **Frictionless Data — Tabular Data Package**
(`datapackage.json` + CSV): a real, portable open-data standard that carries schema, units,
license, and sources. Benefits: instantly interoperable, downloadable as a clean package, and
validateable with off-the-shelf tools. Lineage (raw→normalized→derived) is recorded alongside as
a small **provenance manifest** (W3C PROV-style: entity, activity, agent, used/wasDerivedFrom).
Don't hand-roll a bespoke format the world has to learn.

---

## 7. Validation framework (layered; nothing ships unvalidated)

Run in `validate.ts` after normalize and after derive. Each layer emits pass / warn / **block**.

1. **Schema** — Zod over `CanonicalSeries` (types, units present, points well-formed).
2. **Provenance completeness** — license + vintage + url + definition present, else **block**.
3. **Range / sanity** — per-indicator bounds from the registry (life expectancy 0–100, % within
   0–100, counts ≥ 0). Out of range → **block**.
4. **Anomaly / continuity** — duplicate years, gaps, impossible YoY jumps, sign flips, outliers
   beyond N·σ → **warn + flag for human review** (don't auto-reject — a real spike is content).
5. **Unit consistency** — declared unit matches transform expectations; catch per-1k/per-100k.
6. **Cross-source corroboration** — where two sources cover one indicator, diff them; large
   divergence → **flag** (and it becomes an input to the epistemic-status tag, [[EXPLAINERS.md]]).
7. **Entity coverage** — every entity maps to the canonical table; coverage vs expected.
8. **Snapshot integrity** — re-fetch checksum vs recorded; a silent upstream revision is a
   **revision event** to log (§10), not to hide.
9. **Determinism** — golden tests: fixture raw → expected normalized; catches upstream schema
   drift and adapter regressions in CI.

The run produces a **validation report** per ingest. Blocks stop publish; warns/flags route to a
review queue. This *is* the editorial honesty creed, mechanized.

---

## 8. Openness & provenance — sharing the files and calculations

**Your instinct is right, and it's bigger than a nice-to-have — it's the moat.** Radical
transparency *is* the brand ([[NORTH_STAR.md]], [[EXPLAINERS.md]] · Pillar 2). Yes, link
everything. Design it **layered** so the casual reader isn't drowned and the curious can dig
(the progressive-depth principle):

- **Per chart:** `↓ data (CSV/JSON)`, `↓ source` (with vintage + license), and a quiet
  **"How this number was made"** panel — the recipe (raw → normalized → derived) in plain
  language *plus* a machine-readable lineage manifest. These are links to **pre-baked artifacts**
  (free at runtime — [[PERFORMANCE.md]]).
- **Per article:** the existing Methodology + Sources + Revision sections, extended with the
  exact **pipeline run** that produced the piece: vintages, the **git commit hash**, and adapter
  versions. "This article was built from these snapshots, by this code, on this date."
- **Per indicator:** a **dataset page** (the chart catalogue, [[PLAN.md]] §10) showing the
  series, its definition and sources, and *every article that uses it* — reverse-linkable, like
  OWID's per-chart pages.
- **The repo is the lineage.** normalized series + recipes + snapshot manifests live in git, so
  "share all calculations" = "the open repository," and the revision-history feature reads
  straight from it. Link article → commit → exact data → source.

One honesty caveat to design for: full transparency invites pedantic critique — which is
*good* for this project. The only rule is **layering**: don't make the bus-rider read a recipe;
don't make the obsessive guess.

---

## 9. Licensing hygiene (the part most projects get wrong)

Not all open data may be re-hosted. The registry's `license` drives a **gate**:

| Class | Examples | What we may do |
|---|---|---|
| **Re-hostable** (CC BY / CC0 / PD) | OWID, World Bank, NASA, Global Carbon Project, UCDP, Ember | mirror the CSV, generate downloads, attribute |
| **Link-only / restricted** | ACLED (registration), IEA, EM-DAT, some IHME (NC/ND) | chart from it if terms allow, **link** to source, **do not** re-host the file |

Encode this once; the pipeline refuses to publish a downloadable CSV for a link-only source and
emits a link instead. Attribution text is generated from the registry for every chart.

---

## 10. The update / revision loop (the "living atlas")

Per-source cadence (most annual; some quarterly). On a scheduled run: re-fetch → checksum. If
the source revised history, that's a **revision event**: re-normalize, re-derive, re-render, and
**log it in the article's revision history** with what changed and why. The LLM revises the prose
where the numbers moved enough to matter ([[WRITING.md]] disclosure). Nothing changes silently;
every edit to a number is in the open. The site, being static, is always the last good build —
a failed or schema-broken ingest never breaks production; it just flags staleness.

---

## 11. Must-have datasets

> **The full question-by-question map now lives in [[docs/DATASET-ATLAS.md]]** — every
> planned article mapped to its datasets, sub-questions, access paths, and license gates
> (including the domains this table is thin on: the green transition, tolerance, and
> science/R&D). This section stays as the day-1 summary.

The full landscape by domain — then the **tight day-1 set** (don't integrate all of this at
once).

| Domain | Source(s) | Gives | Access | License |
|---|---|---|---|---|
| **Keystone** | **Our World in Data** | most indicators, harmonized | catalog / grapher / bulk | CC BY |
| **Economy/poverty** | **World Bank WDI** + **PIP** (Poverty & Inequality Platform), IMF, WID, Maddison | GDP, poverty **counts**, mean income, societal poverty, inequality, infra | two REST APIs (WDI = rates; PIP = counts/mean/societal) + bulk | CC BY 4.0 |
| **Demography** | **UN WPP** | population (the denominators), fertility, urbanization | bulk | CC BY |
| **Health/mortality** | **WHO GHO**, UN IGME, IHME GBD | life exp, child/maternal mortality, disease, vaccines | OData API / bulk | mixed (IHME care) |
| **Violence/conflict** | **UCDP**, UNODC, UNHCR, SIPRI, ACLED | battle deaths, homicide, displacement, mil. spend | API / bulk | CC BY (ACLED restricted) |
| **Climate/energy** | **Global Carbon Project / OWID-CO2**, NASA GISTEMP, Ember, EM-DAT, IRENA | CO₂/GHG, temp anomaly, electricity, disasters, renewables | bulk | CC BY / PD (EM-DAT/IEA restricted) |
| **Governance/rights** | V-Dem, Freedom House, RSF, Transparency Intl | democracy, freedom, press, corruption | bulk | mostly CC BY |
| **Education** | UNESCO UIS, World Bank | literacy, schooling, enrollment | API / bulk | CC BY |
| **Food/agri** | FAO FAOSTAT, Global Hunger Index | undernourishment, yields | API / bulk | CC BY |
| **Wellbeing** | World Happiness Report (Gallup) | life satisfaction | bulk | CC BY (Gallup micro restricted) |

### Day-1 integration set (build these, in order)

1. **Our World in Data** — the keystone adapter; unlocks most of the atlas. *(do first)*
2. **World Bank WDI** — best official API; economy/health/education breadth.
3. **UN WPP (population)** — the denominators for every per-capita rate. **`unwpp` adapter BUILT
   (2026-06-13):** the Data Portal `/data` API now requires a bearer token, so the adapter pulls the
   ungated bulk **Demographic Indicators** CSVs instead (`…/CSV_FILES/WPP2024_Demographic_Indicators_{Medium,OtherVariants}.csv.gz`,
   CC BY 3.0 IGO). One gzip carries every indicator for every location, 1950–2100; `fetch()` gunzips,
   keeps only an allowlist of LocIDs (so the snapshot stays ~1 MB), and caches per-run so one download
   serves every WPP indicator. Pick the column with `sourceColumn` (TFR, MAC, SRB, CNMR, TPopulation1July…),
   the location with `entityFilter` (name / ISO3 / LocID), the projection variant with `filter.variant`
   (Low/High), and scale thousands→units with `valueScale`. Powers the fertility article's low/high
   projection fan, sex ratio at birth, and net migration by income group. **Gotcha:** the file is CRLF —
   the trailing `\r` is stripped on load.
4. **The three live articles' primaries:** **UCDP + UNHCR + UNODC** (violence), **WHO GHO / UN
   IGME** (health), **Global Carbon Project + NASA GISTEMP + Ember** (climate).

Everything else (V-Dem, SIPRI, FAOSTAT, UNESCO, WID, IRENA, EM-DAT, ACLED…) is phase 2 — add an
adapter when a real article needs it. **Watch the licenses flagged above** (ACLED, IEA, EM-DAT,
some IHME) — chart-and-link, don't re-host.

---

## 12. Day-1 build plan

> **Status (2026-06-08): the loop is built and proven end-to-end.** `pnpm data` runs the
> pipeline: the **OWID adapter** fetches real series, snapshots them (checksum + vintage),
> the validation core passes them, `derive` records the recipe, and artifacts are emitted
> (`src/data/derived/*.json`, `public/charts/<id>/{data.csv,datapackage.json,lineage.json}`).
> The violence article's "seven centuries" chart now renders **real Our World in Data**
> homicide data (Eisner + WHO, CC BY) with a working **"How this number was made"** panel and
> data downloads — at 8.8 kB, zero JS. Framework files: `registry/indicators.ts`,
> `scripts/ingest/{owid,worldbank}.ts`, `scripts/lib/{validate,derive,provenance}.ts`,
> `scripts/pipeline.ts`, `src/lib/data/types.ts`.
>
> **Multi-source proven:** the **World Bank** adapter (a JSON REST API — a totally different
> shape from OWID's CSV) now runs through the same pipeline, producing validated World extreme
> poverty (47.1%→10.4%, 1981–2024) and GDP-per-capita series with full provenance. `RawSnapshot`
> is generalized to `body`/`ext` (csv|json).
>
> **PIP adapter (2026-06-12):** the WDI REST API carries only poverty *rates*, never *counts*. The
> **Poverty & Inequality Platform** adapter (`scripts/ingest/pip.ts`, a *second, separate* World Bank
> API) pulls the authoritative **number of poor** (`pop_in_poverty`), **mean income**, and the
> **societal/relative rate** (`spr`) straight from the producer — at any poverty line and PPP base,
> 1981→nowcast. The lesson reinforced: **don't reconstruct what the source publishes** — a
> rate×population derive was prototyped, then deleted once PIP gave the count directly (§1.3). One
> `/pip-grp` fetch per poverty line serves every measure for World + all regions (memoised); 35
> poverty indicators issue 3 network calls. Confirmed against the Bank's figures: World 870M extreme
> poor (2022, $3.00/2021 PPP); 48.3% under the $8.30 line. **Extended 2026-06-12:** the same payload
> also carries `poverty_gap`/`poverty_severity` → a free **depth** indicator (`economy.poverty_gap.*`,
> ×100): World gap 22.4→3.5%, Sub-Saharan Africa stuck ~16% (incidence vs intensity).
>
> **Cross-section bars (2026-06-12):** MPI and Gini are one-or-two survey points per country, so they
> are **committed bespoke artifacts** (`kind: 'bars'`), not registry series — `scripts/analysis/
> poverty-cross-sections.ts` fetches + snapshots the OWID graphers (snapshot-everything) and emits
> `src/data/derived/{mpi,gini}-by-country.json`, rendered by `src/lib/bars.ts`. Same pattern as
> `convergence-scatter`: outside the pipeline, inputs still snapshotted.
>
> **Climate adapters (2026-06-13):** the Q3 climate article earned three small primary-source
> adapters where OWID's series sit outside the licence gate. **`copernicus`** (`scripts/ingest/
> copernicus.ts`, C3S free-reuse licence) reads the **ECMWF Climate Pulse** flat CSV of daily
> ERA5 global 2 m temperature, averages it to complete calendar years, and **re-baselines to
> 1951–80 inside `normalize()`** (a disclosed anomaly recompute from the absolute column) so the
> ERA5 line overlays GISTEMP — two independent records agreeing to ~0.1°C, and the most current of
> them. The Climate Data Store API (key + NetCDF) was deliberately avoided; Climate Pulse is a
> plain CSV reachable from Node with a browser User-Agent. ERA5 publishes only a **global** series
> there (no land/ocean), which is why the land-vs-ocean split stays on Berkeley. **`berkeley`**
> (`scripts/ingest/
> berkeley.ts`, CC BY) parses Berkeley Earth's whitespace summary files for the **land** and
> **land+ocean** temperature anomaly on one shared 1951–80 baseline — the land-vs-ocean split the
> single global curve hides (OWID's temperature series is OGL v3, link-only). **`sealevel`**
> (`scripts/ingest/sealevel.ts`, PD) reads the EPA datahub sea-level CSV, stitching the CSIRO
> reconstruction (1880–) and NOAA satellite altimetry (1993–) on a shared 1880 datum and
> converting inches→cm. Arctic September sea-ice rides the **existing `owid` adapter** (NSIDC
> data underneath, year-grained so it parses cleanly; PD via a `license` override). Slug `slug`
> selects the file in both new adapters; both return a single World series (derive defaults to
> `identity`). The `arctic-sea-ice` grapher's daily-grain *sea-level* sibling could **not** use
> the OWID adapter (no `year` column) — hence the dedicated `sealevel` adapter.
>
> **Climate physical-state adapters (2026-06-13):** the climate mega-article added four more small public-domain/CC-BY adapters for the parts of the Earth system OWID doesn't carry cleanly: **`noaagml`** (NOAA GML — CH₄ & N₂O concentration, annual global means), **`oceanheat`** (NOAA NCEI — global ocean heat content 0–2000m, fixed-width .dat), **`icesheet`** (NASA GRACE via OWID — Greenland/Antarctica mass, daily→year-end), and **`wgms`** (World Glacier Monitoring Service — reference-glacier mass balance CSV, mm→m w.e.). All global-by-nature. Pattern identical to berkeley/sealevel/copernicus.
>
> **`data360` adapter (2026-06-17):** the **World Bank Data360** API (`data360api.worldbank.org`)
> — the surface behind the *Atlas of Global Development* — is a public, no-auth SDMX-shaped JSON API
> harmonising hundreds of datasets (WDI + IMF/UN/OECD-sourced) under one schema. `spec.slug` is the
> INDICATOR id (e.g. `WB_WDI_SP_DYN_LE00_IN`), `spec.data360.databaseId` the dataset (`WB_WDI`), and
> `spec.data360.refArea` optionally pins one area (e.g. `WLD` = World) to a single page; omit it to
> pull every area (the adapter pages through `skip` — a full pull is ~17k rows) and select downstream
> with `entityFilter`/`derive`. Rows carry SDMX disaggregation dims (SEX/AGE/URBANISATION/
> COMP_BREAKDOWN_1..3); the adapter keeps **only the total slice** (`_T`/`_Z`) unless `spec.filter`
> overrides a dim — the same anti-double-count guard as the OWID multi-column gotcha. **Licence is
> per-dataset, not per-platform:** WB-origin datasets are CC BY 4.0 (the adapter default, re-hostable);
> third-party Data360 datasets "may not be redistributed without the provider's consent," so those
> specs MUST set `gate: 'link-only'` + a `license` override (BIS/EM-DAT pattern). Built for the planned
> keystone/"global progress" work; overlaps the classic `worldbank` adapter for WDI (use whichever
> exposes the series more cleanly).
>
> **OWID-first, deliberately:** we did *not* build bespoke adapters for UCDP / UNHCR / WHO /
> NASA / Ember — OWID already re-publishes those series cleanly under CC BY, so a separate
> adapter would duplicate work and maintenance for a one-person project. Add a primary-source
> adapter only where OWID lacks the series or being closer to the source matters. World Bank
> earned one (breadth + a real API OWID doesn't fully mirror).
>
> Next: wire the remaining article charts to real data (figB displacement, figC comparison)
> via OWID.


1. **Registry + canonical schema + entity table** — the backbone (§4–6), with Frictionless
   `datapackage.json` output.
2. **Validation core** (§7) with Zod + golden-test harness — wire into `pnpm verify`/CI.
3. **The OWID adapter** end-to-end on **real violence data**, replacing the illustrative series
   in `is-humanity-becoming-less-violent.md` — prove the whole loop on one article.
4. **Provenance manifest + chart download artifacts** (§8) — turn the deferred `↓CSV/↓SVG` into
   real links and ship the first "How this number was made" panel.
5. Then World Bank + WPP, then the remaining article primaries.

> The test for the whole framework: a stranger can take any chart on the site, click through to
> the exact data, the exact recipe, and the exact source vintage that produced it — and
> reproduce the number themselves. If they can't, we haven't shipped honesty.
