# Article plan — *Is the climate stabilizing or breaking?*

The Q3 build (dataset atlas §Q3). **BUILT & published 2026-06-13** at
`src/content/questions/is-the-climate-stabilizing-or-breaking.md`. This file is the blueprint and
the post-hoc record. Companion to, and deliberately distinct from, Q4 (the green transition).

## 1. The spine — the one-sentence answer

**Long-run despair, a hopeful recent turn.** Every measure of the problem — carbon in the air,
the heat, the sea, the ice, the emissions still being added — points the wrong way and most are
accelerating. The one line bending in our favour is the *price* of the fix: clean power is now
the cheap option. It is real, and not yet enough to turn the others.

The thesis made visible: progress and catastrophe coexist; the answer depends on the lens.

## 2. The Q3 / Q4 boundary (the main judgment call)

Q4 (`is-the-green-transition-happening.md`) owns the **energy** story in full (clean share,
solar's exponential, demand-vs-fossil, the coal record, the four-speed deployment world,
electricity access). Q3 is the climate **system**: carbon → heat → damage → who caused it. The
energy turn appears here as **one compressed hinge movement (M5)** that shows the two iconic
curves (solar price, wind/solar share) and explicitly hands off to Q4 for "is it fast enough,
and where?" That restraint is the boundary. The emissions chart (M3) legitimately lives in both;
Q3's distinct contribution is its full regional + per-capita treatment, which Q4 doesn't do.

## 3. The honest-gap move (the COVID-section equivalent)

Two headline charts are **global by physical nature, not data poverty**, and saying so is the
move: CO₂ is well-mixed (no regional concentration exists); global mean temperature *is* the
metric. M1 and the sea-level/ice of M4 are global-only on purpose, named as such. Temperature's
uneven distribution is instead shown via the land-vs-ocean cut.

## 4. Structure — evidence panel + seven movements (mirrors the Health article)

| # | Sub-question | Magnifications | Temp | Headline figure (real, ingested) |
|---|---|---|---|---|
| M1 | How much carbon is in the air? | global-only (well-mixed) | despair | 278 → **426 ppm**; ¾ of the rise since 1950 |
| M2 | Has it warmed, and is the heat even? | **two records (GISTEMP + ERA5)** + **land-vs-ocean strip** | despair | +1.3°C, NASA & Copernicus agree to ~0.1°C; +1.8°C land |
| M3 | Who is heating it? | world + **6-continent strip** + **per-capita country bar** | despair | **38.6 Gt** record; Asia >half; US 14.2 vs India 2.2 t/person |
| M4 | Is the warming doing anything? | global-only (sea + ice) | despair | sea **+26 cm**; Arctic Sept ice 7.0→**4.7 M km²** |
| M5 | Is it killing more people? | events + deaths strip (**link-only**) | mixed | disasters 5→335/yr (mostly reporting); deaths flat ~9k, decoupled |
| M6 | Is anything bending right? | price + share strip; defers to Q4 | hope | solar **$128→$0.26/W**; wind+solar **0.21→17.3%** |
| M7 | Can the land pull carbon back? | world hectares + **regional % strip** | mixed | **−200 Mha**; tropics fall, China/India/Europe green |

Back matter: pull-quote · 5 lenses (climate scientist, energy economist, someone on a low-lying
coast, a negotiator, an intergenerational-justice ethicist) · steelmanned hope/despair ·
what-would-change-it · methodology · sources · "Still lost? Read this."

## 5. Data — integration status (all real unless noted)

New adapters (see DATA.md): **`copernicus`** (ERA5 global mean via the ECMWF Climate Pulse flat
CSV, C3S licence — daily→annual, re-baselined to 1951–80 to overlay GISTEMP; M2's second line and
the most current record) · **`berkeley`** (land + land+ocean temperature, CC BY) for M2's
land/ocean strip · **`sealevel`** (CSIRO+NOAA via EPA datahub, PD) for M4. Arctic ice via the
existing **`owid`** adapter (`arctic-sea-ice`, NSIDC/PD, license override). Everything else pre-existed:
concentration / emissions (+ 6 regional) / per-capita bar (Global Carbon Budget via OWID),
GISTEMP world temperature, solar price (OWID), wind+solar share world/China/India (Ember),
forest world (FAO/OWID) + regional % (World Bank).

**Honest blockers (cited, not re-hosted):** EM-DAT disasters and IEA sectoral emissions are
restricted → link-only (in the Sources list). Copernicus/ERA5 extremes and FAOSTAT crop-yield
series are the obvious next ingests if the article is ever deepened.

## 6. The recurring device

The despair side is five charts of one-way traffic; the hope is one curve (M5) plus the catch in
prose (clean added on top, not replacing — which is *why* M3 still set a record). The verdict is
never resolved in prose; the charts carry the contradiction. The number to watch, stated in
what-would-change-it, is the emissions line in M3 and the year it turns down for good.
