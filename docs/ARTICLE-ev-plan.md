# Article plan — *Is the electric-car revolution real?*

The Q4 companion to the green transition (`docs/ARTICLE-green-transition-plan.md`). Where that
article asks whether the *grid* is cleaning, this asks whether the *car* is changing — the first
big slice of transport to electrify. Article lives at
`src/content/questions/is-the-electric-car-revolution-real.md`.

**The licence (settled 2026-06-13):** the EV numbers come from the **IEA Global EV Data Explorer**
(`api.iea.org/evs`), which is licensed **CC BY 4.0** → re-hostable, with downloads, via a dedicated
`iea` adapter. NOTE the split we verified: the Explorer is CC BY 4.0, but the separate **Global EV
Outlook *report* data product is "Non-CC Material" (restricted)**. We re-host only the CC BY
Explorer (attributed) and cite the report. Earlier drafts treated all IEA data as `link-only`; that
was over-conservative for the Explorer. The BEV/PHEV-share breakdown (Fig. 12) is taken from OWID's
pre-computed series of the same CC BY IEA data; the grid bridge (Fig. 13) is Ember (CC BY 4.0).
Every chart now clears the site's "download every number" bar.

---

## 1. The spine — the one-sentence answer

**Yes, faster than almost any forecast — one in four new cars sold in 2025 is electric, and in
China it is more than half. But it is wildly uneven (97% in Norway, 3% in Japan), the cars on
the road are still mostly petrol because fleets turn over slowly, and an electric car is only as
clean as the grid that charges it.**

The thesis made visible: the flow (new sales) has flipped fast; the stock (the fleet) has barely
begun to; and the win is real but conditional on the green transition next door.

## 2. Structure — six vantages (movements-only)

| Act | Vantage | Movements |
|-----|---------|-----------|
| I — The S-curve | global flow | M1 world sales share (hero) |
| II — The China engine | who is driving it | M2 China sales share · M3 units sold, World vs China |
| III — The leaders | saturation | M4 Norway / Iceland / Sweden / Netherlands |
| IV — The rich split | the laggards | M5 Europe / UK / Germany / US / Japan |
| V — The emerging world | the rest of humanity | M6 Turkey / Brazil / Mexico / India / Chile |
| VI — The catches | flow vs fleet, mix, grid | M7 sales share vs fleet share (World) · M8 fleet share by region · M9 stock counts by region · M10 BEV vs plug-in-hybrid split · M11 the grid behind the car |

**Update 2026-06-13:** added M7 (the flow-vs-fleet gap: 25% of new cars but 5% of the parc),
M8 (fleet share by region — Norway 36%, US 2%, India <1%), and M10 (BEV vs PHEV — a third of the
"electric" share is plug-in hybrids that still have an engine), via new `share-car-stocks-electric`
and `share-car-sales-battery-plugin` series (both link-only). Added the **IEA Global EV Data
Explorer** to sources/caveats so readers can reach the underlying numbers. Article now 11 charts.

Back matter: pull-quote · disciplinary lenses · steelmanned hope/despair · what-would-change-it ·
methodology · sources (IEA link-only + Ember) · "Still lost? Read this."

## 3. Chart roster & data status

| # | Sub-question | dataRef(s) | Headline | Gate |
|---|---|---|---|---|
| M1 | Are EVs actually selling? | `ev-sales-share-world` | 0.012% → 25% of new cars (2010–2025) | link-only |
| M2 | Who is driving the boom? | `ev-sales-share-china` | China 0.01% → 53% — majority electric | link-only |
| M3 | Where are the EVs sold? | `ev-sales-{world,china}` | China sells 13.3M of the world's 21.2M (≈⅔) | link-only |
| M4 | What does saturation look like? | `ev-sales-share-{norway,iceland,sweden,netherlands}` | Norway 97% | link-only |
| M5 | Why do rich countries differ so much? | `ev-sales-share-{europe,united-kingdom,germany,united-states,japan}` | US 10%, Japan 3% vs Europe 28% | link-only |
| M6 | Is the emerging world in or out? | `ev-sales-share-{turkey,brazil,mexico,india,chile}` | Turkey 22, Brazil 9, India 4 — and India's real story is 2-wheelers | link-only |
| M7 | Are the cars on the road electric yet? | `ev-stock-{world,china,europe,united-states,india}` | 76M on the road; China holds well over half | link-only |
| M8 | Does an EV actually cut carbon? | `electricity-demand-world` | EVs are new demand; clean only if the grid is | **re-host** (Ember CC BY) |

## 4. Data — integration status

> **The roster's "link-only" column above is superseded** (2026-06-13). Everything is now CC BY 4.0
> re-host with downloads, sourced direct from the IEA Explorer via the `iea` adapter. The article is
> 13 charts (two/three-wheeler + by-mode added).

- **IEA Global EV Data Explorer** (`iea` adapter, `api.iea.org/evs`, **CC BY 4.0 → re-host**):
  sales-share (17 entities), stock (5), units (2), fleet share (6), two/three-wheeler share (5),
  by-mode share (3). Picked by `iea: { parameter, mode, powertrain }`; units must match the
  Explorer's exactly (`percent` / `Vehicles`). IEA region quirks: `United States → USA`,
  `Turkey → Turkiye`. The Global EV Outlook *report* is Non-CC → cited, not re-hosted.
- **OWID** (`share-car-sales-battery-plugin`, **CC BY 4.0**): the BEV vs PHEV share-of-all-sales
  breakdown (Fig. 12), pre-computed from the same IEA data; `sourceColumn` mandatory (two columns).
- **Ember — Yearly Electricity Data** (CC BY 4.0): `electricity-demand-world`, the grid bridge (Fig. 13).

**Cited, never charted (no open series):** battery-pack cost decline (BloombergNEF) — folded into
the China explainer as mechanism, not a number, since it traces to no derived series.

## 5. The recurring honesty

Two metrics, two answers: **sales share** (the flow) has flipped fast; **stock** (the fleet on the
road) lags far behind because cars last ~15 years. M1/M3 are the flow; M7 is the stock; the gap is
the article's central caveat. And M8 hands the reader back to the green-transition article: the EV
is only a win to the extent the grid behind it is clean.
