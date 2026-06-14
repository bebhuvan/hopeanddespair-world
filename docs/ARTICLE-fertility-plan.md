# Article plan — *Is the world running out of children?*

The fertility / population deep-dive. Promotes fertility from a cross-cutting *denominator*
([[DATASET-ATLAS.md]] §Cross-cutting) to a full question, because the decline is now a story in
its own right: a real, near-global fall that is simultaneously a liberation and a reckoning.
Built at `src/content/questions/is-the-world-running-out-of-children.md`. Companion to Q2 (health,
the child-survival cause) and the keystone's demography dimension.

## 1. The spine — the one-sentence answer

**A liberation and a reckoning at once — and which you see depends on whether you count women's
freedoms or future workers.** Fertility is falling almost everywhere, fast, and mostly for good
reasons (children survive, women choose). But it has already carried the richest societies below
replacement, the world will stop growing within most readers' lifetimes (~2084), and no country
has found either the floor or the way back up. The verdict is **hard balance, held unresolved** —
the honest center for the one domain the registry already tags *confusion*.

The thesis made visible: progress and catastrophe coexist; the answer depends on the lens. Here
they are the *same fact* read two ways.

## 2. The verdict discipline (the main judgment call)

The user chose **no overall lean**. Guard against the lazy both-sidesism WRITING.md rule 8
forbids: **each movement's `take` still weighs locally** (says which read is heavier *for that
chart*); only the article-level synthesis refuses to pick, and says *why* it can't — because the
benign cause (M1, M10) and the structural cost (M7–M9) are genuinely incommensurable, and the
future (M11) is the widest fan on the atlas. The balance is the earned conclusion, not a dodge.

## 3. The honest-frame move

The title asks "running out of children," then the data refuses the panic *and* the complacency.
"The world" is not running out — its TFR (2.25) is the midpoint of a 0.7–6.0 spread nobody lives
at (M4–M5). But specific worlds are: East Asia at 1.0–1.3, on a halving-each-generation path
(M6). And the benign framing ("by choice") hides the desire gap — across surveys people want more
children than they have (M12-as-prose / back matter). Three honesty moves, each a finding.

## 3b. EXPANDED to canonical (2026-06-13) — six acts, sixteen movements

The first build (eleven movements, below) was a strong skeleton but thin on the *why* — the
load-bearing question, since the whole "liberation vs reckoning" verdict turns on whether the
fall is chosen or constrained. Expanded the same day to **sixteen movements across six acts**,
adding a **Why-it-fell act** (child survival · the girl effect: adolescent fertility + girls'
schooling · the contested rich-world reversal: female labour flat + Myrskylä/Doepke), the
**migration release valve** (net migration by income group), the **missing-girls** sex-ratio
chart, and the **full UN projection fan** (low/med/high, 7→14bn), with named research woven
through the takes, lenses, and a research-tagged methodology/sources block (Notestein, Becker,
Lesthaeghe & van de Kaa, Myrskylä·Kohler·Billari 2009, Doepke et al. 2022, Lutz low-fertility
trap, Pritchett, Charles Jones 2022, plus IHME 2020 as the link-only rival projection).

**Adapter reality (the deviation from "build the big three"):** `unwpp` BUILT and powering three
movements (fan, sex ratio, migration) — the authoritative source, re-hostable via the bulk CSV
(the portal API turned out to be token-gated). **`census-idb` dropped** (API key-gated + no world
aggregate) — the UN's own low/high variant fan (re-hostable) plus IHME link-only is a better,
more authoritative contested-future story. **`oecd` not built** — SDMX dataflow-hunting was a
rabbit-hole; the policy-graveyard point is made with the Korea canary series we already have +
OECD family-spending cited link-only. Both pivots honor *don't-belabor-failures* and the
*cite-and-tag link-only* model. Gap register: OECD family-spending and the DHS desire gap remain
the obvious next ingests if deepened further; the fertility-vs-driver **scatter** awaits a join
(convergence-style) artifact.

## 4. Original structure — evidence panel + four acts, eleven movements (the v1 skeleton)

Every movement reads at the magnifications the data honestly allows (world → region/country →
future). History is drawn solid; the UN WPP medium projection is drawn **dashed**, same line.

| Act | # | Sub-question | Magnifications | Temp | Headline (real, ingested) |
|---|---|---|---|---|---|
| **I · The descent** | M1 | Has the world's fertility really fallen? | world line + 2.1 replacement | confusion | TFR **4.85 (1950) → 2.25 (2023)**, past peak **5.31 (1963)** |
| | M2 | Didn't we fear the opposite? | world, history+projection (dashed) | hope→confusion | growth **2.28%/yr (1963) → 0.86 (2024) → <0 (~2084)** |
| | M3 | Are fewer babies being born? | world births, hist+proj | confusion | **peak baby ≈ 2012, ~146M/yr**, drifting down |
| **II · Who the average hides** | M4 | Is the fall the same everywhere? | 6-region divergence | confusion | SSA **4.26** vs East Asia **1.34** (2024) |
| | M5 | Where are the extremes? | country bar (both tails) | confusion | DR Congo **5.98** → South Korea **0.75** |
| | M6 | What does the bottom look like? | Korea·China·Japan·Niger lines | despair | Korea **5.99 (1960) → 0.72 (2023)**; China <1.0 |
| **III · The reckoning** | M7 | What does a low-fertility world become? | 65+ world + 6-region strip | despair | 65+ **5.0% (1960) → 10.2% (2024)**; Europe 18% |
| | M8 | How old is the median person? | median age, hist+proj | despair | **22 (1950) → 30 (2023) → 42 (2100)** |
| | M9 | Who supports the old? | old-age dependency, world | despair | **15.7 retirees per 100 workers (2024)**, climbing |
| **IV · Why, & what we can't see** | M10 | Why did people stop? | child mortality (the cause) | hope | under-5 deaths collapsed → the survival → fewer-births chain |
| | M11 | So is the world running out? | population peak-and-decline + births/deaths crossover | confusion | peaks **~10.29bn ~2084**, then falls; deaths overtake births |

"What the data can't see" (desire gap; the policy graveyard — no rich country bought its way back
above 2.1; the unknown floor) is carried in M6/M11 takes, a caveat, a lens, and the back matter,
**not** a chartless movement (the schema requires a chart per movement; refine by subtraction).

Back matter: pull-quote · 5 lenses (demographer, a 33-year-old who wants a third child and can't
afford one, pension-system actuary, an Anti-natalist environmentalist, a Nigerian planner) ·
steelmanned hope/despair · what-would-change-it · methodology · sources · "Still lost? Read this."

## 5. The named tensions (the insights the charts exist to deliver)

1. **The same fall is liberation and loss** — fewer births = women's freedom + child survival, *and* = the aging bill. (the core balance)
2. **The world average lives nowhere** — 2.25 is the midpoint of a 0.75–5.98 spread.
3. **The rate sinks below replacement while the count still climbs** — momentum keeps population rising for ~60 more years (M11).
4. **Replacement is a line nobody controls** — every rich country that paid to climb back above 2.1 failed; the floor keeps dropping (Korea 0.72).
5. **Peak baby has passed; peak people hasn't** — annual births peaked ~2012; total population peaks ~2084.
6. **Good news with a 30-year fuse** — the benign cause creates a delayed cost the choice-makers don't pay; their children do.
7. **The numbers are confident; the future isn't** — TFR is well-measured; 2100 projections swing billions on whether low fertility is a floor or a trap.
8. **People want more children than they have** — desired exceeds achieved across surveys; part of the fall is unmet desire, not pure preference.

## 6. Data — integration status (all real, all CC BY / via OWID + WB)

**Already on disk, zero new code (the spine):** `fertility-rate-world` + 6 WB regions ·
`fertility-by-country` (bars) · `pop-65plus-world` + 6 regions · `child-mortality-world`
(M10 mechanism). These alone make M1, M4, M5, M7, M10 fully real.

**New indicators (15), all via the existing `owid`/`worldbank` adapters — no new adapter:**
history + medium-projection pairs for growth rate (`population-growth-rates`), births
(`number-of-births-per-year`), deaths (`births-and-deaths-projected-to-2100`), median age
(`median-age`), and population (`population-long-run-with-projections`); old-age dependency
(`SP.POP.DPND.OL`, WB); and four canary country picks (`children-per-woman-un`, same slug as the
world line) — South Korea, China, Japan, Niger.

> **Adapter gotcha logged:** the `owid` adapter takes its unit from the *first* metadata column,
> not the picked `sourceColumn`. So births are sourced from `number-of-births-per-year` (col0 *is*
> births → unit "births") and deaths from `births-and-deaths-projected-to-2100` (col0 *is* deaths →
> unit "deaths"); pinning the registry `unit` to each slug's col0 unit keeps validation green.

**Gap register (named in the piece, not charted):** desired-vs-achieved fertility (DHS/OWID
cross-section — verify CC BY before any future ingest; for now qualitative) · pronatalist-policy
*outcomes* (no clean panel — the failure is the finding, in prose) · contraceptive-prevalence and
female-schooling as fuller M10 mechanism series (one OWID ingest away if M10 is ever deepened) ·
the post-2024 Korea nadir (named in prose; series ends 2023).

## 7. The recurring device

History solid, future dashed, on the *same* line — the reader watches every demographic series
cross from measured into projected, and the projection is where the despair and the hope both
live. The three "the world stops growing ~2084" signals (growth rate hits zero, births/deaths
cross, population peaks) are deliberately repeated across M2, M3, M11 so the date lands. The
verdict is never resolved in prose; the charts carry the contradiction. The number to watch
(what-would-change-it): not TFR but **whether any society sustainably climbs back through 2.1** —
none has yet.
