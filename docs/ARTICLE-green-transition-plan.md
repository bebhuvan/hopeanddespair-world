# Article plan — *Is the green transition actually happening — and where?*

The Q4 build (dataset atlas §Q4). The site's strongest *pace* article: direction alone is a
half-truth, so every chart carries both verdicts — happening? fast enough? The article itself
lives at `src/content/questions/is-the-green-transition-happening.md`. Companion to the climate
draft (Q3) but a distinct question: climate asks *is it breaking?*, this asks *is the fix
arriving, and where?*

Status as of 2026-06-13: **all 11 data charts on real ingested Ember/OWID/WB series**; the
12th (the link-only frontier) is cited, not re-hosted. Powered almost entirely by the Ember
adapter (CC BY 4.0, direct), which OWID can't give us cleanly because its energy graphers blend
in Energy Institute proprietary data.

---

## 1. The spine — the one-sentence answer

**Yes — electricity is decarbonizing faster than almost anyone forecast, and it now runs on
price, not policy. But it is four transitions at four speeds, and so far clean power has mostly
been *added on top of* fossil fuels rather than replacing them: the world burns more coal than
ever, and emissions are still rising.**

The thesis made visible: progress and catastrophe coexist; the answer depends on the lens.

- Stand at the cost curve → solar fell ~500× since 1975; the transition is now the cheap option.
- Stand at the share of electricity → wind and solar went from a rounding error to a sixth of
  the world's power in two decades. Real, fast, exponential.
- Stand at the absolute tonnes → demand grew faster than clean supply, so fossil generation
  nearly doubled and coal hit a record. The share fell while the burning rose.
- Stand at a map → the US retired half its coal; China built the most solar *and* the most coal
  on Earth; India's coal share is still rising; Sub-Saharan Africa's question is access, not mix.

## 2. Structure — five vantages, mapped to the schema (movements-only, like the catch-up piece)

| Act | Vantage | Movements |
|-----|---------|-----------|
| I — The engine | price | M1 wind+solar share (hero) · M2 the solar cost collapse |
| II — Is power decarbonizing? | share | M3 clean share of electricity · M4 solar's lonely exponential |
| III — The catch: adding, not replacing | absolute | M5 clean up, demand up faster · M6 record coal · M7 emissions still rising |
| IV — The four-speed world | geographic | M8 clean share by archetype · M9 the coal divergence · M10 who's deploying |
| V — Locked out / never counted | access / epistemic | M11 electricity access · M12 the link-only frontier (transport, heat, industry) |

Back matter: pull-quote · disciplinary lenses · steelmanned hope/despair · what-would-change-it ·
methodology · sources · "Still lost? Read this."

## 3. Chart roster & data status (all real unless noted)

| # | Sub-question | Job | dataRef(s) | Headline figure |
|---|---|---|---|---|
| M1 | Are wind & solar taking off? | line/hero | `wind-solar-share-world` | 0.21% → 17.3% of world electricity (2000–2025) |
| M2 | Why now? | decline | `solar-pv-price-world` | $128/W (1975) → $0.26/W (2024) |
| M3 | Is electricity decarbonizing overall? | line | `clean-share-world` | 35.3% → 42.6% low-carbon (flat for a decade first) |
| M4 | How fast is solar alone? | line | `solar-share-world` | 0.01% → 8.75% |
| M5 | Is clean replacing fossil, or adding? | multi-line | `electricity-demand-world`, `fossil-generation-world` | demand 15.3k→31.7k TWh; fossil 9.9k→18.2k TWh |
| M6 | Is coal finally falling? | line | `coal-generation-world` | 5.8k → 10.5k TWh; record in 2024 |
| M7 | Are emissions turning over? | line | `co2-emissions-world` | ~38.6B tonnes in 2024 — a record |
| M8 | Where is it true, where the opposite? | multi-line | `clean-share-{world,united-states,china,india,africa}` | the four speeds |
| M9 | Is "transition" the same everywhere? | multi-line | `coal-generation-{united-states,china,india}` | US 1,966→737; China 1,060→5,773; India 390→1,474 TWh |
| M10 | Who is actually deploying renewables? | multi-line | `wind-solar-share-{china,united-states,india}` | China now leads on share (21.8%) |
| M11 | Who is locked out? | line | `electricity-access-world` | 73% → 92%, but ~700M still without power |
| M12 | What the electricity story leaves out | cited | — (IEA, link-only) | electricity ≈ a fifth of final energy; transport/heat/industry barely begun → the EV article |

## 4. Data — integration status

All M1–M11 flow registry → pipeline → `src/data/derived/*.json` + downloadable lineage.

- **Ember — Yearly Electricity Data** (CC BY 4.0, direct): every share/TWh series above. New
  registry entries (2026-06-13): `solar_share.world`, `coal_generation.world`,
  `electricity_demand.world`, and clean-share / wind+solar-share / coal-generation for China,
  India, United States (one cached fetch per entity). Regional clean-share (Europe, N. America,
  Asia, Africa) and the three World headline series pre-existed.
- **OWID**: `solar-pv-prices` (IRENA/Lafond via OWID, CC BY) for M2; `annual-co2-emissions`
  (Global Carbon Budget via OWID, CC BY) for M7.
- **World Bank**: `EG.ELC.ACCS.ZS` electricity access for M11 (CC BY 4.0).

**Honest blockers (cited, not re-hosted):** IEA Global EV Outlook & World Energy Investment
(EV sales share, clean-energy investment) are restricted → **link-only**, and become the spine
of the companion EV article. IRENA capacity/LCOE beyond the OWID-mirrored price series is
terms-restricted → cite.

## 5. The recurring device — direction-and-pace, every chart

Each movement's `take` must split the verdict: the hope read (it's happening), the despair read
(not fast enough / not everywhere / not in absolute terms), and the confusion (what the measure
hides). The article never resolves the contradiction in prose — the charts carry it. M5 is the
keystone: it is the single chart where "yes" and "no" are the same data.

## 6. EV companion (Q4b, separate file) — scoped honest

`is-the-electric-car-revolution-real.md`. Upfront that the best EV data (IEA, BNEF) is
link-only: the article charts what IS open (electricity demand from Ember; the battery-cost
analogue to M2) and cites the rest. The bridge from M12: cars are the first big sector to
electrify; the question is whether it generalizes to trucks, heat, and steel.
