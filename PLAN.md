# hopeanddespair.world — Build Plan

> A living atlas of human progress, suffering, and uncertainty.
> The world is getting better. The world is getting worse. Both are true.

**Doc set (keep aligned):** [`NORTH_STAR.md`](NORTH_STAR.md) (why & creed — the anchor) ·
[`DESIGN.md`](DESIGN.md) (visual philosophy + the V3 boxiness fix + refinement method) ·
[`WRITING.md`](WRITING.md) (the "Bifocal" voice, article anatomy, anti-AI-tells) ·
[`CHARTS.md`](CHARTS.md) (the chart vocabulary — kit by job, not type) ·
[`EXPLAINERS.md`](EXPLAINERS.md) (the explainer repertoire — our moat) ·
[`PERFORMANCE.md`](PERFORMANCE.md) (fast from day one — the budget + enforcement) ·
this file (build plan, scaling, schema, phases) · `idea.md` (original brief, superseded
where it conflicts).

---

## 0. Status (2026-06-08)

Interactive HTML **mockups are complete and validated** in-browser. They are the design
source of truth for the Astro build:

- `mockups/article-v5.html` + `mockups/home-v4.html` — **CANONICAL**. v5 is **static-first**:
  the interactive lens is replaced by the static *four-magnification row* (same metric at four
  windows, the verdict flipping cool→warm across it) — works with JS off. home-v4 is the "atlas
  spectrum." Both are the *fluid* refinement (open columns, unframed figures, Fraunces-italic
  eyebrows). See [`DESIGN.md`](DESIGN.md), [`PERFORMANCE.md`](PERFORMANCE.md) · static-first.
- `mockups/charts.html` — the **chart kit** (8 templates by job); visual spec for
  `render-charts.ts`. See [`CHARTS.md`](CHARTS.md).
- `mockups/article-v4.html` — interactive-lens reference (kept; superseded by static v5).
- `mockups/home-v3.html` + `mockups/article-v3.html` — prior modern look (superseded).
- `mockups/home-v2.html` + `mockups/article-v2.html` — warm "literary atlas" reference
  (kept for comparison; superseded).

**Decisions locked:**
- **Static-first (2026-06-08):** an article must be complete, fast, and understandable with
  **zero JS**. The thesis is carried by the static four-magnification row; interactivity (lens
  slider, "in your lifetime") is **optional progressive enhancement, never day-one, never
  load-bearing.** See [`PERFORMANCE.md`](PERFORMANCE.md) + [`EXPLAINERS.md`](EXPLAINERS.md).
- **Visual direction: MODERN (v3)** — cool white, teal accent (replaces gold), the
  hope-teal / despair-coral / confusion-indigo temperature triad, gradient "Both are true.",
  live-pulse, tighter/bolder type, no drop-cap/gold. Light is primary; dark toggle ships.
- **License: CC BY 4.0** for original prose + code (pairs with the chart watermark for
  attribution). Source data remains CC-BY and is credited in §V.

---

## 1. Context & intent

A static, editorial **data publication** around one honest question — *is the world getting
better or worse?* — for people who want to **make sense of the contradiction** rather than be
handed a comforting or despairing answer. Released under a permissive / public-domain license
as a civic resource.

The original brief (`idea.md`, from CODEX) had a strong concept but a back-to-front build
order (data infrastructure first, format last). **We flipped it:** prove the editorial format
first via mockups, keep every infrastructure seam swappable, and add ingestion/storage later.

---

## 2. The article format (as built)

One question per article. The thesis — *progress and catastrophe coexist; the answer depends
on the lens* — is **demonstrated, not asserted**. Top-to-bottom:

1. **Opener** — kicker, headline, lede.
2. **Caveats & blind spots** — a disclosure panel *before* the evidence (illustrative data,
   what the measure excludes, sparse history, "the verdict is editorial"). Transparency up
   front, not buried.
3. **The Evidence (the lens)** — a synchronized panel: a hero "ZoomScope" chart plus a row of
   small-multiple **signal** charts. A single **time lens** (Deep history → Since 1900 →
   Since 2020 → A lived day) re-windows *every* chart at once; each signal casts an
   improving/worsening sub-verdict; a **composite verdict** + live tally ("4 of 5 signals
   point to deterioration") reads off them. A **vantage toggle** (Global ↔ a hard place)
   re-weights the closest stops. The verdict word changes **color-temperature** with the lens.
4. **Full-chart movements** — the body. Each movement = an eyebrow + claim headline + prose
   **explainer** + a **full axed chart** (real axes, gridlines, annotations) + a
   **hope / despair / confusion "take"** strip. Several per article ("The long arc", "The
   recent break", "Who the average hides", …) — this is how one question holds *many* charts.
5. **Pull-quote** interstitial (literary beat).
6. **§I The multi-disciplinary read (Lenses)** — historian / statistician / forecaster /
   someone-living-it / ethicist, each with hope + despair readings and a confidence level.
7. **§II The two strongest cases** — steelmanned hope vs despair, *weighted* (anti-both-sidesism).
8. **§III What would change this verdict** — explicit falsifiability.
9. **§IV Methodology** — every transformation disclosed (normalization, deflation; that line
   smoothing is *cosmetic*; that the verdict is *editorial, not a computed index*).
10. **§V Sources & references** — datasets with links, **licenses**, and **vintages**.
11. **§VI Revision history** — dated changelog with commit/diff links (auto-generated from git);
    the "living atlas" provenance trail.

Every chart carries a **`hopeanddespair.world` watermark baked into the SVG** (survives
crops/exports) and **download tools** (↓ CSV, ↓ SVG, ⧉ Permalink).

**Structural innovations (first-class features — see [`WRITING.md`](WRITING.md) for the spec):**
- **Definition boxes** — auto-generated the first time a layperson-unfriendly term appears.
- **Generous Wikipedia links** — one unobtrusive link per important concept, the first time
  it matters; Wikipedia is a deliberate ally of the layperson mission.
- **Every chart is a sub-question** — claim → evidence → explainer → take; keeps a 40-chart
  piece a single argument, not a gallery.
- **The closing "Still lost? Read this." box** — 2–4 short paragraphs re-explaining the whole
  article from zero; the one warm, slightly irreverent moment on the page. (Codename in
  markup: the *FYIDU* box.)
- **LLM-assisted prose, plainly disclosed** — DeepSeek by default behind a swappable seam,
  API key via env/secret (never committed); disclosure language in `WRITING.md`.

### v1 content — three questions, deliberately opposite polarities

| Slug | Polarity |
|------|----------|
| `is-humanity-becoming-less-violent` | long-zoom **hope**, short-zoom **despair** — *showcase* (built) |
| `are-we-beating-disease-and-death` | **hope at nearly every zoom** |
| `is-the-climate-stabilizing-or-breaking` | long-zoom **despair**, hopeful **recent** sub-trend |

---

## 3. Design system

**Light is the primary theme** (cool near-white, never beige); a dark theme ships behind a
toggle. Typography-led, generous whitespace, hairline rules only.

**Hard anti-cliché bans** (enforced in review): no globe/world-map imagery, no beige/cream as
*primary*, no gradient blobs/mesh, no glassmorphism, no drop-shadowed card grids, no
stoplight red/green, no neon, no emoji, no stock photography, no KPI cards, no Inter, **no
glow effects on charts**. Decoration is hairline rules + whitespace.

**Color is a *temperature*, not a stoplight:** hope = cool, despair = warm, uncertainty =
neutral. Two candidate token sets:

```css
/* WARM — "literary atlas" (home-v2 / article-v2), light primary */
--bg:#F6F7F4; --fg:#15171C; --fg-muted:#6A6F7B; --rule:rgba(20,22,30,.13);
--brass:#B08828;              /* antique-gold structural accent */
--hope:#0E9E7A; --despair:#E5482A; --ochre:#C7901F;  /* dark: brighter variants */

/* MODERN — (home-v3), light primary */
--bg:#FBFCFE; --fg:#0D1117; --fg-muted:#79828F; --rule:rgba(13,17,23,.09);
--accent:#0FA67E;            /* teal = brand/interactive (replaces gold) */
--hope:#0FA67E; --despair:#F0512E; --uncertain:#5B61E6;  /* teal/coral/indigo triad */
```

The **modern** set is what removes the "old-timey" feel: cool whites, **teal accent instead
of gold**, the **teal→indigo→coral gradient** on "Both are true.", a live-pulse indicator,
tighter/bolder labels, no drop-caps. The **warm** set keeps drop-caps, Roman numerals, and
gold for a print-almanac feel.

**Type:** `Fraunces` (display/headlines + the verdict word), `Newsreader` (prose body),
`Geist` (labels/UI), `Geist Mono` (axis numerals, dates, data). Self-host woff2,
`font-display:swap`. Fluid type; `64ch` prose measure.

**Charts (refined, no glow):** monotone-cubic **smooth curves**; **dotted hairline
gridlines** + a solid zero baseline; **ring end-markers** (fill + bg-colored stroke);
direct-labeled multi-series; lighter mono axes; a one-shot transform-only fade-in on scroll.
Renderer is a small inline function (`smooth()` + `fc()` for full charts, plus the lens
sparkline draw) — **no charting library client-side**.

**Flourishes (cohesive, quiet):** a left-margin **temperature scroll-spine** whose marker
shifts hope→uncertain→despair with reading depth; the **◐ emblem** (flips on hover);
**Tufte-style margin notes**; **footnotes** linking to numbered sources; pull-quotes;
editorial section numerals.

> Performance note learned in mockups: never animate an SVG filter/stroke per-frame over a
> `position:fixed` background — it thrashes the compositor. Use a composited fixed `::before`
> for background gradients and transform/opacity-only entrance animations.

---

## 4. Scaling architecture (thousands of charts)

**Invariant: a page's weight scales with charts *on that page* (~5–10), never with the total
catalog.** Charts are pre-baked static artifacts; scale lives in storage + CDN, not the client.

**Offline pipeline (scheduled, not at request time):**
```
ingest data → normalize to one series schema → per chart, emit:
  chart.svg (page) · chart.png (share/OG) · chart.csv (download) · chart.json (lens spec)
→ upload to R2 (content-hashed) → update a metadata index
```

**Storage tiering — also dodges Cloudflare Pages' 20k-file limit:**

| Layer | Holds | Scales with |
|---|---|---|
| **Pages** | HTML, CSS, tiny JS, article markdown | # articles (small) |
| **R2 + CDN** | every SVG/PNG/CSV/JSON + datasets | # charts (unbounded, cheap) |
| **D1 / JSON index** | chart metadata for listing & search | # charts |

**Client stays light forever:** content charts are static `<img>`/inline SVG with
`loading="lazy"` (no chart lib). The interactive lens is an **Astro island** that hydrates
only on the article page and swaps pre-rendered SVGs per zoom-stop.

**Consequences:**
- **Downloads are free** — `↓ CSV` / `↓ SVG` / `↓ PNG` are links to static R2 artifacts
  already produced at render time (the mockup generates them client-side only to demo).
- **Builds don't blow up** — chart rendering is decoupled and **incremental**: hash each
  chart's (data + spec), re-render only what changed, cache the rest in R2. The Astro build
  only turns markdown → HTML (scales with articles, not charts).
- **Big index/theme pages** paginate / infinite-scroll with lazy thumbnails; search via
  Pagefind (static) or D1.

The `lib/charts.ts` seam resolves `chartId → URL` (local now, R2 later) — one function to flip.

---

## 5. Repo structure

```txt
hopeanddespair-world/
  package.json  astro.config.mjs  tsconfig.json  LICENSE
  src/
    content/
      config.ts                 # Zod schemas — SINGLE source of truth
      questions/*.md            # one per question (frontmatter=structured, body=prose)
    layouts/   BaseLayout.astro  ArticleLayout.astro
    pages/
      index.astro               # homepage (no chart lib)
      questions/[slug].astro
      about.astro  methodology.astro  sources.astro
      charts/index.astro        # paginated chart catalogue (later)
    components/
      EvidenceLens.astro        # island: time lens + signal panel + composite verdict
      Movement.astro            # explainer + full chart + take strip
      ChartFigure.astro         # static SVG <img> + download tools + watermark
      Lenses.astro  SteelmanDuel.astro  Caveats.astro
      Methodology.astro  Sources.astro  RevisionHistory.astro
      ScrollSpine.astro  PullQuote.astro  Header.astro  Footer.astro
    lib/
      types.ts  charts.ts(seam)  csv.ts  smooth.ts  format.ts
    styles/  tokens.css(warm|modern)  global.css  typography.css
    data/series/*.json          # normalized series snapshots
  scripts/
    ingest/                     # source adapters (later)
    render-charts.ts            # data → svg/png/csv/json artifacts (incremental)
    build-changelog.ts          # git history → per-article revision list
  public/ (or R2)  charts/<id>/{chart.svg,png,csv,json}
```

---

## 6. Content schema (`src/content/config.ts`, Zod → single source of truth)

A `questions` collection:

- `question`, `dek`, `themeSlug`, `verdict`, `heroChartId`, `publishedAt`.
- `caveats: string[]`.
- `lens`: `{ stops: { id,timeLabel,rangeYears:[from,to],verdict,reading }[],
  signals: chartId[], vantages?: { id,label,readingModifier }[] }`.
- `movements`: `{ eyebrow, claim, explainer, chartId, take:{hope,despair,confusion} }[]`.
- `lenses`: `{ discipline, hope, despair, confidence }[]`.
- `hopeCase`, `despairCase`, `whatWouldChangeIt`.
- `methodology`: `{ term, detail }[]`.
- `sources`: `{ id, name, url, license, vintage, note? }[]`.
- Revision history is **generated from git**, not authored.

A `charts` collection (metadata): `{ id, title, unit, geography, sourceIds, seriesRef }`.

---

## 7. Licensing

**Decided: CC BY 4.0** for original prose + code — permissive with attribution back to
hopeanddespair.world, reinforced by the in-SVG chart watermark. Add a `LICENSE` (CC-BY-4.0)
and a short attribution line in the footer (done in mockups). Source data
(OWID/UCDP/UNHCR) is itself **CC-BY** and is credited per-source in §V with license + vintage.

---

## 8. Build phases

1. **Design sign-off** ✅ — mockups done; **modern (v3) chosen** as canonical, **CC-BY 4.0**.
2. **Astro shell** — scaffold; port the **modern** `tokens.css` (from `home-v3`/`article-v3`),
   layouts, homepage, static pages.
3. **Content model** — Zod schema (§6) + the three `questions/*.md` with real copy.
4. **Render pipeline** — `render-charts.ts`: data → svg/csv/json (+ watermark) artifacts,
   incremental; `lib/charts.ts` points local for now.
5. **Components** — `EvidenceLens` island, `Movement`, `ChartFigure` (+downloads), apparatus
   components (Caveats/Methodology/Sources/RevisionHistory), `ScrollSpine`.
6. **Real data** — hand-download OWID/UCDP/UNHCR series → `data/series/*.json`.
7. **R2 + scale** — move artifacts to R2 via the seam; add chart catalogue + Pagefind.
8. **Polish + verify** (§9).

---

## 9. Verification

1. `npm run build` renders all chart artifacts (svg/csv/json) with **no errors**; watermark
   present in every SVG; CSV columns match the series.
2. `npm run dev`, open the violence article: the **lens re-windows every chart at once**; the
   verdict **flips YES→NO** across zoom (opposite polarity for climate); the **vantage**
   toggle changes the reading; the **tally** matches the signals.
3. Downloads: `↓ CSV` returns the chart's data; `↓ SVG` includes the watermark; permalink copies.
4. Break a `questions/*.md` enum → build fails with a clear **Zod error**.
5. Homepage + article: **no charting library**, minimal JS, no layout shift; scroll stays
   smooth (no fixed-bg + per-frame-SVG thrash).
6. Read all three articles end-to-end — each shows the contradiction honestly, with caveats,
   methodology, sources, and a revision trail.

---

## 10. Deferred (additive on §4 seams)

D1, full ingestion adapters (OWID/WorldBank/IMF/GDELT/ACLED), the news/"recent signals"
layer, the paginated chart catalogue + Pagefind search, auto-generated OG share cards,
"index/score" panels. None require rework — they layer onto the storage/seam architecture.

## 11. Authoring toolchain (LLM prose pipeline)

Separable workstream, sequenced after the Astro shell exists:

- **`mockups/article-v4.html`** — apply [`DESIGN.md`](DESIGN.md) §2 (de-box `.signals` /
  `.take` / `.figure`, turn down uppercase labels, asymmetric margin) and compare to v3.
- **Writing skill** — implements [`WRITING.md`](WRITING.md): Bifocal prose, definition boxes,
  Wikipedia links, the closing box, anti-AI-tell self-check, no-invented-numbers guard.
- **`CLAUDE.md` + `AGENTS.md`** — kept linked (one is the source, the other a thin pointer)
  so both stay in sync; they point agents at NORTH_STAR / DESIGN / WRITING / PLAN.
- **DeepSeek seam** — `lib/llm.ts` (or a script env): provider behind one function, key via
  `.env` / Cloudflare secret, never committed; `.env.example` documents the var.
- **Auto-update** — each `questions/*.md` backed by an ingest+render+revise script run on a
  6–12 month schedule that refreshes data, re-renders charts, asks the LLM to revise prose,
  and commits — the "living atlas" loop from [`NORTH_STAR.md`](NORTH_STAR.md).
