# Flagship article plan — *Is humanity becoming less violent?*

The first real publish. A maximal, long-form piece: **20 charts, five vantages, one question.**
This doc is the working blueprint — edit it as we iterate. The article itself lives at
`src/content/questions/is-humanity-becoming-less-violent.md`.

Status as of 2026-06-10: **8 of 20 charts on real ingested data** (7 unique series — the recent-war
zoom reuses the battle-deaths series). The remaining 12 are genuinely **link-only or conceptual** (see
§4) and are cited, not re-hosted. Build is green (`pnpm verify`).

---

## 1. The spine — the one-sentence answer

**Yes, dramatically — and the trend is fragile, uneven, and partly a trick of better counting.**

The whole piece is the thesis made visible: *progress and catastrophe coexist; the answer depends
on the lens.* The four-magnification hero encodes it — the verdict flips cool→warm as you zoom from
ten millennia to one lived day. We never have to hedge in prose, because the charts carry the
contradiction.

- Stand 10,000 years back → lethal violence per person has collapsed.
- Stand at 1945 → great powers stopped fighting; arsenals shrank; execution and torture receded.
- Stand at 2020 → the calm broke (Ukraine, Tigray, Gaza); displacement and conflicts hit records.
- Stand at one lived day, one place → the global average is obscene to anyone inside Sudan; and whole
  categories (violence against women, slavery, structural harm) were never in the famous curve.

## 2. Structure — five acts, mapped to the schema

The 20 movements group into five acts. Each act is a **different vantage**, not a different topic —
that is what keeps 20 charts a single argument instead of a gallery.

| Act | Vantage | Movements |
|-----|---------|-----------|
| I — The long descent | time | M1 homicide 7 centuries · M2 prehistoric floor · M3 homicide by region |
| II — The long peace, and its end | collective / war | M4 battle deaths · M5 great-power war · M6 active conflicts · M7 the 2020 break · M8 displacement |
| III — The state stops killing | state violence | M9 nuclear stockpiles · M10 military spending · M11 death penalty · M12 slavery |
| IV — Who the average hides | geographic / demographic | M13 global mean vs. country · M14 who dies (age/sex) · M15 birth-cohort exposure |
| V — What the curve never counted | epistemic | M16 violence against women · M17 the measurement trap · M18 terrorism · M19 share of all deaths · M20 attitudes |

Back matter (already authored, refine later): pull-quote · 5 disciplinary lenses · steelmanned
hope/despair cases · what-would-change-the-verdict · methodology · sources · revisions ·
"Still lost? Read this." closing box.

## 3. Chart roster & data status

`real` = ingested through the pipeline with downloadable lineage; `illus` = placeholder series in the
article frontmatter; `link-only` = source forbids re-hosting, cite + link instead.

| # | Sub-question | Chart job | Source | Status |
|---|---|---|---|---|
| M1 | Homicide over 7 centuries | slope/area | Eisner/WHO via OWID | **real** `homicide-western-europe` |
| M2 | Violence in non-state societies | spread | Pinker/Keeley, archaeology | illus (no clean OWID series) |
| M3 | Homicide by region today | multi-line | UNODC | illus · **link-only (403)** |
| M4 | World battle deaths since 1946 | line | UCDP/PRIO via OWID | **real** `battle-deaths-world` (sum of 4 conflict types) |
| M5 | Great-power war years/decade | step | Levy & Brecke | illus (no OWID slug found) |
| M6 | Active conflicts count | line | UCDP `number-of-armed-conflicts` | **real** `active-conflicts-world` (sum of state-based types) |
| M7 | The 2020 break (recent zoom) | line | UCDP | **real** — `battle-deaths-world` windowed 2010–2024 |
| M8 | Refugees (by origin) | line | UNHCR via OWID | **real** `refugees-world` (sum across origins); refugees only, not total displaced |
| M9 | Nuclear stockpiles | line | FAS via OWID | **real** `nuclear-warheads-world` |
| M10 | Military spending | line | SIPRI via OWID | **real** `military-spending-world` |
| M11 | Death-penalty abolition | cumulative | Amnesty/OWID | illus · slug renamed |
| M12 | Modern slavery | line | Walk Free / ILO | illus · link-only |
| M13 | Global mean vs. country | multi-line | UCDP | illus (multi-series, see §5) |
| M14 | Who dies (age × sex) | profile | IHME GBD | illus · link-only |
| M15 | Birth-cohort exposure | multi-line | composite | illus |
| M16 | Intimate-partner violence | spread | WHO/UN via OWID | illus · 2018 cross-section only |
| M17 | The measurement trap | dual-line | UNODC + surveys | illus |
| M18 | Terrorism deaths | line | GTD/START via OWID | **real** `terrorism-deaths-world` |
| M19 | Share of all deaths from violence | line | IHME GBD | illus · link-only |
| M20 | Attitudes to violence | line | World Values Survey | illus · link-only |

## 4. Databases — integration status

Built on the OWID-first, snapshot-everything architecture (`DATA.md`). One adapter per source;
re-host only open licenses; the registry (`registry/indicators.ts`) is the backbone.

**Wired and live (registry → pipeline → derived JSON → article `dataRef`):**

| Indicator id | OWID slug | DB | Span | Notes |
|---|---|---|---|---|
| `violence.homicide_rate.western_europe` | homicide-rates-across-western-europe | Eisner/WHO | 1250–2023 | mean of countries |
| `violence.battle_deaths.world` | battle-related-deaths-…-since-1946 | UCDP | 1946–2024 | World |
| `violence.nuclear_warheads.world` | nuclear-warhead-stockpiles | FAS | 1945–2026 | World total |
| `violence.military_spending.world` | military-spending-sipri | SIPRI | 1988–2025 | col `constant_usd` |
| `violence.terrorism_deaths.world` | terrorism-deaths | GTD/START | 1970–2021 | col `total_killed` |
| `violence.active_conflicts.world` | number-of-armed-conflicts | UCDP | 1989–2024 | **sum** of 3 state-based type columns |
| `violence.refugees.world` | refugee-population-…-of-origin | UNHCR | 1960–2024 | **sum across** ISO3 origins |

Seven databases now flow through the pipeline (incl. World Bank from earlier work). Re-run anytime with
`pnpm data`; each writes `src/data/derived/<id>.json` + `public/charts/<id>/{data.csv,datapackage,lineage}`.

**Bug fixed (2026-06-10):** `battle-deaths-world` had no `sourceColumns`, so the adapter read only the
*last* CSV column (`interstate`) — undercounting world battle deaths badly (2016 read ~90 instead of
~90,000; the Syrian war is internationalized-intrastate). Now sums all four conflict-type columns.
Lesson: **any OWID grapher with multiple value columns needs an explicit `sourceColumn(s)`** or the
adapter silently grabs the last one.

**Verified but not re-hostable / not yet wired (honest blockers, not omissions):**

- **UNODC `homicide-rate`** → OWID serves HTTP **403 non-redistributable**. Link-only per the license
  gate. Use for M3 with a cite, or reconstruct from a primary that permits re-hosting.
- **`share-of-deaths-from-homicide`** (GBD/IHME) → exists but has **no `World` aggregate** row; would
  need an entity-aggregate derive. M19.
- **Intimate-partner violence** (`…-intimate-partner-un`) → a single **2018 cross-section**, not a time
  series. Belongs in a country-spread chart (M16), not a line.
- **UCDP `number-of-armed-conflicts` / `deaths-in-armed-conflicts-by-type`** → multi-column (per
  conflict type). A single total needs a **`sum_columns`** derive op. M6, M7.
- **UNHCR displaced, death-penalty, modern slavery, WVS attitudes** → OWID slugs renamed or
  link-only. Resolve per-chart in a later pass (M8, M11, M12, M20).

## 5. Adapter features — done and still open

**Done (2026-06-10):**
- ✅ **`sourceColumns: string[]`** in the OWID adapter — sums several columns per row into one value.
  Powers battle deaths (4 types) and active conflicts (3 state-based types).
- ✅ **`sum_across_entities`** derive op — sums all ISO3 countries per year into a world total (excludes
  OWID aggregate rows). Powers refugees-by-origin.
- ✅ **`dataRef` point-windowing** — when a real chart sets `x0/x1`, the page filters the derived
  points to that span so a recent-years zoom (M7) doesn't draw off-canvas.
- ✅ **Compact axis ticks** (`70k`, `2.8T`) in `fullChart`.

**Still open:**
1. **`dataRef` swaps only `series[0]`** — multi-*line* real charts still can't wire (M13 country
   comparison, M17 dual-line). *Fix:* a `dataRefs[]` array mapping N derived series onto N lines.
2. **No bar/spread renderer** — single-year cross-sections (IPV, M16) need a non-line chart job.
3. **Unit must match source metadata exactly** or validation blocks. Watch the SIPRI constant-USD base
   year — it drifts (currently `constant 2024 US$`).
4. **Pipeline is all-or-nothing per run**; a fetch 404 throws and kills the whole run. Fine now;
   make `fetch` skip-and-warn if the indicator list grows.

## 6. Iteration roadmap

1. ✅ Spine + 5-act structure + 20-movement skeleton + open downloads.
2. ✅ `sourceColumns` sum → active conflicts + corrected battle-deaths total.
3. ✅ `sum_across_entities` → refugees world total. ✅ dataRef windowing → recent-war zoom (M7).
4. **`dataRefs[]` (multi-line)** → unlock M13 country comparison on real per-country data.
5. **Bar/spread renderer** → M16 intimate-partner violence (real CC BY cross-section is ready).
6. Resolve the link-only charts (M2 prehistoric, M3 UNODC homicide, M5 great-power, M12 slavery, M14
   IHME age/sex, M19 share-of-deaths, M20 WVS) — cite + link, or find re-hostable equivalents.
7. **Prose pass**, movement by movement, against `ANTI-AI.md`; expand explainers and lenses. Drop
   `illustrative: true` only when a chart is real.
8. Refine the evidence-panel hero/signals to stitch from the real series rather than hand-entered points.

## 7. Open questions for the next session

- M2 (prehistoric) and M15 (birth-cohort): strong insight, contested/composite data. Keep with loud
  caveats, or hold for v2?
- Act V epistemic charts (M17 measurement trap, M19 lived-day) are the most distinctive and the
  hardest to source. Worth the adapter work, or trim to ship sooner?
- Flip to `status: published` only after the prose pass and a real-data majority — until then it
  renders locally for review but shouldn't deploy.

---

## Addendum (2026-06-10) — the five-act restructure

The published article now orders its 14 movements as five acts by magnification, per the
composition grammar in [[CHARTS.md]]: **the long arc** (homicide, then war, both deep-history)
→ **the break** (battle deaths, the 2010s zoom, the conflict count, refugees) → **who the
average hides** (war by region, the named wars, homicide by region, homicide by sex) →
**the state's two hands** (warheads down, spending up, massacres never zero) → **what we
fear, what we miss** (terrorism). Seams where two things change at once are explained in
place (the rates-to-bodies sidenote at FIG. 8; the war-to-murder bridge at FIG. 14).

---

## Gap register (2026-06-10) — what this article still misses, honestly

An audit of obvious missing charts, ordered by cost. The rule: a gap is either **charted,**
**registered here with its blocker,** or **named in the article as something the data cannot
see.** No silent gaps.

### A. Ingested and sitting unused — **CLOSED 2026-06-10**

All three wired the same day: the non-state movement is now FIG. 14, ECS joined the regional
homicide chart (now FIG. 15), Burkina Faso joined the named wars (FIG. 13). Two platform fixes
shipped alongside: label-collision dodging in `fullChart` and the `stone` fifth series colour.
(Note: figure numbers in tiers B–C below predate the insertion — regional homicide is now
FIG. 15, war-by-region FIG. 12, conflict count FIG. 10 unchanged.)

| Series on disk | The missing chart | Why it matters |
|---|---|---|
| `nonstate-deaths-world` (1989–2025, peak 2017: 31,051) | a whole **type** of violence absent from the taxonomy: armed groups fighting each other with no state involved — cartels, communal militias | Mexico's drug war and Nigeria's communal violence are invisible: not "state-based conflict," diluted inside homicide averages. The article currently implies war + murder + terror = the whole picture; it is not |
| `homicide-rate-ecs` (Europe & C. Asia, 2010–23) | a fifth line on FIG. 14 | derived for the chart and never plotted |
| `war-burkina-faso` (2018–25, peak 2023: 4,806) | the Sahel line on FIG. 13 | the prose names the Sahel insurgency; the chart does not show it |

### B. One registry entry away (existing OWID/WB adapters)

- **Battle deaths — Americas** region: FIG. 12 plots four regions and omits the Americas entirely — notable since Latin America is the homicide epicentre elsewhere in the article. (UCDP via OWID.)
- **Homicide — North America, South Asia, MENA** regional lines (WB `VC.IHR.PSRC.P5` aggregates): FIG. 14 shows 4 of ~7 world regions.
- **United States long-run homicide** (OWID, ~1900–): the deep-history act is Europe-only and says so; one non-European long series would soften the biggest stated caveat.
- **Internally displaced people** (IDMC via OWID — **verify license**): the refugee chart's own sidenote admits the fuller figure (>100M displaced) and we never chart it.
- **UN peacekeeping personnel** (OWID): the article has no "machinery of peace" chart at all — the hope side is structurally under-charted vs the despair side.
- **Arms transfers** (SIPRI via OWID): pairs with military spending in act IV.

### C. Blocked on a renderer (specced in CHARTS.md v2, not yet in charts.ts)

- **Violence against women / IPV** (2018 cross-section) → needs the **cross-section bar**. The single most acknowledged gap in the caveats; currently prose-only.
- **Conflict composition by type** (interstate vs civil vs internationalized — we already ingest the 4 columns summed for FIG. 10) → needs the **stacked area**. This is THE mechanism chart: interstate war nearly vanished while internationalized civil wars drive the rise; FIG. 10's new explainer asserts it in prose without showing it.

### D. Link-only, restricted, or not found (cite, never re-host)

UNODC homicide counts & femicide (403 / restricted); death-penalty & great-power-war OWID slugs (not found 2026-06-10); Amnesty executions; Walk Free slavery; WVS attitudes to violence; World Prison Brief incarceration; police killings (no comparable global series).

### E. Permanently illegible (belongs in a "What the data can't see" box, not a chart)

Unreported domestic and sexual violence; non-lethal assault (definitions incomparable across countries); coercion and structural violence; the dead of massacres no one documented. The EXPLAINERS.md box format exists for exactly this and the article does not use it yet.
