Below is a **Claude Code-ready Markdown build brief**. I’ve included current Cloudflare constraints so Claude does not accidentally build a slow React dashboard or exceed Pages file limits. Cloudflare Pages Free currently has a **20,000-file limit** and **500 builds/month**; Workers Free has **100,000 requests/day**; R2 Free includes **10 GB-month storage, 1M Class A ops, 10M Class B ops, and free egress**; D1 Free has **500 MB per database** and **5 GB max storage per account**. ([Cloudflare Docs](https://developers.cloudflare.com/pages/platform/limits/?utm_source=chatgpt.com "Limits · Cloudflare Pages docs"))

```markdown
# hopeanddespair.world — Build Plan for Claude Code

## 0. Project Summary

Build `hopeanddespair.world`: a beautiful, fast, static-first editorial data website about the contradictory state of humanity.

The site should not answer the simplistic question:

> Is the world getting better or worse?

Instead, it should show that many things can be true at once:

> The world is getting better.  
> The world is getting worse.  
> The world is getting harder to understand.  
> All three can be true at the same time.

This is not a generic dashboard. It is a philosophical data publication: part data atlas, part editorial magazine, part live contradiction engine.

The site organizes global data and news into thematic pages such as:

- War and peace
- Climate
- Health
- Poverty
- Energy
- Technology
- Democracy
- Food
- Education
- Mental health
- Inequality
- Demography

Each theme should explain the tension between long-run progress, recent deterioration, distributional pain, and genuine uncertainty.

Example:

## War and Peace

Long-run view:
- Humanity may be less violent than in much of recorded history.
- Interstate conquest is rarer.
- Everyday life in many societies is safer.

Recent view:
- Since 2020, the picture has darkened: Ukraine, Gaza, Sudan, Myanmar, Armenia-Azerbaijan, coups in parts of Africa, Red Sea disruptions, rising great-power tension.

Distributional view:
- A person in Singapore or Bengaluru may experience a peaceful world.
- A person in Khartoum, Gaza, eastern Ukraine, or parts of Myanmar experiences a catastrophic world.
- Both are true.

Future fragility:
- Drones, cyber conflict, AI targeting, autonomous weapons, and disinformation may make future conflict cheaper, stranger, and more scalable.

The editorial frame:

> War and Peace: Safer Than History, More Dangerous Than Yesterday

The site’s tagline:

> The world is getting better. The world is getting worse. Both are true.

Alternative tagline:

> A living atlas of human progress, suffering, and uncertainty.

---

## 1. Core Product Philosophy

Do not build a binary “hope vs despair” classifier.

Build a thematic atlas of contradictory truths.

Every theme should answer:

1. What does the long arc show?
2. What does the recent trend show?
3. Who is hidden by the aggregate?
4. What has become newly fragile?
5. What do optimists get right?
6. What do pessimists get right?
7. What remains unknowable?

The site should avoid fake precision. Do not create a grand “Hope Index” or “Despair Index” in v1.

Instead, use labels like:

- Better than it feels
- Worse than it looks
- Progress, but fragile
- Improvement in aggregate, suffering in distribution
- Technologically hopeful, politically dangerous
- Long-run progress, short-run reversal
- Too early to know
- Data says hope; lived experience says despair

---

## 2. Technical Constraint

This must run comfortably on Cloudflare Free tier initially.

Important constraints:

- Cloudflare Pages Free has a 20,000-file limit per site.
- Cloudflare Pages Free has 500 builds/month.
- Cloudflare Workers Free has 100,000 requests/day.
- Cloudflare R2 Free includes 10 GB-month storage, 1M Class A operations/month, 10M Class B operations/month, and free egress.
- Cloudflare D1 Free gives 500 MB per database and 5 GB max storage per account.

Therefore:

Do not build a giant React dashboard.

Do not render thousands of charts client-side.

Do not fetch live datasets from APIs on every page load.

Do not generate LLM summaries on request.

Do not put thousands of chart files directly into Cloudflare Pages.

Correct architecture:

- Static editorial pages on Cloudflare Pages.
- Heavy chart artifacts stored in R2.
- Chart metadata stored in local JSON or D1.
- Most charts served as static SVG/PNG.
- Interactive charts loaded only on demand.
- Data ingestion and chart generation happen offline or in scheduled scripts.
- The browser should do very little work.

Mental model:

> Static magazine frontend + data warehouse behind it.

Not:

> Live BI dashboard.

---

## 3. Recommended Stack

Use:

- Astro for the frontend.
- TypeScript.
- Cloudflare Pages for static hosting.
- Cloudflare R2 for generated chart images, JSON data, and dataset snapshots.
- Cloudflare D1 only for metadata/search/index tables if needed.
- GitHub Actions or local scripts for scheduled ingestion.
- Observable Plot, Vega-Lite, or Python/Node chart generation for static SVGs.
- Pagefind for static site search in v1.
- MDX or Markdown content files for editorial pages.

Avoid:

- Next.js SSR.
- Large client-side React dashboards.
- Client-side rendering of every chart.
- Storing thousands of chart files inside the Pages build.
- Live LLM calls on page requests.

---

## 4. Repository Structure

Create this structure:

```txt
hopeanddespair-world/
  README.md
  package.json
  astro.config.mjs
  tsconfig.json
  wrangler.toml

  src/
    layouts/
      BaseLayout.astro
      ThemeLayout.astro
      ChartLayout.astro

    pages/
      index.astro
      themes/
        [slug].astro
      charts/
        [id].astro
      about.astro
      methodology.astro
      sources.astro

    components/
      Header.astro
      Footer.astro
      ThemeHero.astro
      ContradictionPanel.astro
      ChartCard.astro
      StaticChart.astro
      DataSourceList.astro
      VerdictBadge.astro
      RelatedCharts.astro
      NewsCard.astro
      ThemeGrid.astro

    content/
      themes/
        war-and-peace.md
        climate.md
        health.md
        poverty.md
        energy.md
        technology.md
        democracy.md
        food.md
        education.md
        mental-health.md

      charts/
        war-deaths-long-run.md
        child-mortality-global.md
        solar-cost-decline.md

    data/
      themes.json
      chart-index.json
      source-index.json
      news-index.json

    styles/
      global.css
      typography.css

    lib/
      types.ts
      chartRegistry.ts
      themeRegistry.ts
      format.ts
      r2.ts

  scripts/
    ingest/
      owid.ts
      worldbank.ts
      imf.ts
      gdelt.ts
      acled.ts

    transform/
      normalize-indicator.ts
      classify-theme.ts
      generate-chart-spec.ts

    render/
      render-chart-svg.ts
      render-chart-png.ts

    publish/
      upload-to-r2.ts
      build-index.ts

  public/
    favicon.svg
    social-card.png
```

---

## 5. Content Model

Create a type file at:

```txt
src/lib/types.ts
```

Use these types:

```ts
export type EmotionalFrame =
  | "hope"
  | "despair"
  | "confusion";

export type Verdict =
  | "better-than-it-feels"
  | "worse-than-it-looks"
  | "progress-but-fragile"
  | "long-run-progress-short-run-reversal"
  | "improving-in-aggregate-brutal-in-distribution"
  | "technologically-hopeful-politically-dangerous"
  | "too-early-to-know";

export interface Theme {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroChartId?: string;
  verdict: Verdict;
  longArc: string;
  recentTrend: string;
  distributionalReality: string;
  futureFragility: string;
  optimistCase: string;
  pessimistCase: string;
  unknowns: string;
  chartIds: string[];
  relatedThemeSlugs: string[];
}

export interface DataSource {
  id: string;
  name: string;
  organization: string;
  url: string;
  license?: string;
  updateFrequency?: string;
  notes?: string;
}

export interface Chart {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  themeSlug: string;
  sourceIds: string[];
  geography: string;
  timeRange: string;
  chartType: "line" | "bar" | "map" | "scatter" | "area";
  staticImageUrl: string;
  dataUrl: string;
  methodology: string;
  hopeReading: string;
  despairReading: string;
  confusionReading: string;
  verdict: Verdict;
  lastUpdated: string;
}

export interface NewsStory {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  themeSlug: string;
  geography?: string;
  hopeAngle?: string;
  despairAngle?: string;
  confusionAngle?: string;
  relatedChartIds: string[];
  confidence: number;
}
```

---

## 6. Theme Page Structure

Each theme page should follow this structure:

```txt
Theme title
Subtitle

One-sentence thesis:
  “The long sweep suggests progress, the recent period complicates it, and the future is fragile.”

Hero chart

Section 1: The long arc
Section 2: The recent reversal or complication
Section 3: Who the aggregate hides
Section 4: What has become newly fragile
Section 5: What the optimist gets right
Section 6: What the pessimist gets right
Section 7: What remains unknowable

Chart cards
Related themes
Sources
```

Example theme page copy:

```md
---
slug: war-and-peace
title: War and Peace
subtitle: Safer than history, more dangerous than yesterday.
verdict: long-run-progress-short-run-reversal
heroChartId: war-deaths-long-run
---

The story of war and peace is not one story. Over the long sweep of history, large parts of humanity may have become less exposed to everyday violence. But the post-2020 world has made the optimistic story harder to tell simply.

The same world can be safer than history and more dangerous than yesterday.

## The long arc

Many societies are safer than they were in the deep past. Homicide rates have fallen in many countries, interstate conquest has become rarer, and the everyday experience of violence has declined for large parts of humanity.

## The recent complication

Since 2020, the picture has darkened. Ukraine, Gaza, Sudan, Myanmar, Armenia-Azerbaijan, coups in parts of Africa, Red Sea disruptions, and renewed great-power rivalry have made the world feel more violent and unstable.

## Who the aggregate hides

A global average can obscure catastrophe. A middle-class reader in a peaceful city may experience the world as stable. A civilian in Khartoum, Gaza, eastern Ukraine, or parts of Myanmar experiences a world of immediate danger.

## Future fragility

Drones, cyberattacks, AI targeting, autonomous weapons, and disinformation may transform the cost and character of violence. War may be less common in some long-run sense while becoming cheaper, stranger, and more scalable.
```

---

## 7. Chart Strategy

The site may eventually have thousands of charts.

Do not render thousands of charts as live JavaScript components.

Default chart strategy:

1. Generate static SVGs for all charts.

2. Store SVGs in R2.

3. Store chart JSON/data in R2.

4. Render static SVG on article pages.

5. Lazy-load images using `loading="lazy"`.

6. Provide an “Explore data” link to a dedicated chart page.

7. Load interactive chart JS only on dedicated chart pages or after user interaction.

Chart card HTML pattern:

```astro
<article class="chart-card">
  <div class="chart-copy">
    <p class="eyebrow">Long arc</p>
    <h2>{chart.title}</h2>
    <p>{chart.subtitle}</p>
  </div>

  <img
    src={chart.staticImageUrl}
    loading="lazy"
    width="900"
    height="520"
    alt={chart.title}
  />

  <div class="chart-readings">
    <p><strong>Hope:</strong> {chart.hopeReading}</p>
    <p><strong>Despair:</strong> {chart.despairReading}</p>
    <p><strong>Confusion:</strong> {chart.confusionReading}</p>
  </div>

  <a href={`/charts/${chart.slug}/`}>Explore data</a>
</article>
```

Do not include more than 3–8 visible charts per page initially.

If a theme has 100 charts, show:

- 1 hero chart

- 3 canonical charts

- 4 supporting charts

- “View all charts in this theme”

---

## 8. Storage Strategy

Cloudflare Pages should only contain:

- HTML pages

- CSS

- small JavaScript bundles

- icons

- core metadata JSON

Cloudflare R2 should contain:

- chart SVGs

- chart PNGs

- chart JSON

- raw data snapshots

- transformed datasets

- generated metadata blobs

Example R2 object structure:

```txt
r2://hopeanddespair-assets/
  charts/
    svg/
      war-deaths-long-run.svg
      child-mortality-global.svg
      solar-cost-decline.svg

    png/
      war-deaths-long-run.png

    data/
      war-deaths-long-run.json
      child-mortality-global.json

  datasets/
    owid/
      grapher/
        child-mortality.csv
    worldbank/
      poverty-headcount.csv

  metadata/
    chart-index.json
    source-index.json
```

Rationale:

Cloudflare Pages Free has a 20,000-file limit. Thousands of charts can exceed this quickly if each chart has an SVG, PNG, JSON, and page in the Pages build. Store heavy artifacts in R2 instead.

---

## 9. Homepage Design

The homepage should feel editorial, not dashboard-like.

Sections:

1. Hero

2. Three-column emotional frame

3. Featured contradiction

4. Theme grid

5. Latest data updates

6. Latest news contradictions

7. Methodology note

Homepage hero copy:

```txt
The world is getting better.
The world is getting worse.
Both are true.

Hope & Despair is a living atlas of human progress, suffering, and uncertainty.
```

Three-column frame:

```txt
Hope
What is improving over the long arc?

Despair
What is worsening, fragile, or still intolerable?

Confusion
What is uncertain, contradictory, or hidden by averages?
```

Featured contradiction example:

```txt
War and Peace
Safer than history, more dangerous than yesterday.

The long sweep suggests that many societies have become less violent.
The post-2020 world complicates that story.
```

---

## 10. Design Direction

The site should be:

- Minimal

- Severe

- Beautiful

- Literary

- Fast

- High-contrast

- Typography-led

- Data-rich but not dashboard-like

Avoid:

- Startup gradients

- Cartoon illustrations

- Emoji

- Gamified optimism/pessimism scores

- KPI-card clutter

- Fintech dashboard aesthetics

Suggested visual language:

- White background

- Near-black text

- Deep red/brown accent for despair

- Deep blue/green accent for hope

- Grey/fog accent for confusion

- Serif headlines

- Sans-serif body or vice versa

- Large whitespace

- Full-width editorial charts

- Thin rules

- Strong captions

Possible typography:

- System-first initially

- Later: source serif / inter / literata / charter-like font stack

CSS principles:

- Fast

- No heavy animation

- No hover dependency

- No sticky header initially

- Dark mode optional but nice

---

## 11. Data Source Plan

V1 should not integrate hundreds of datasets.

Start with 10–15 canonical sources.

Initial source list:

1. Our World in Data

2. World Bank WDI

3. IMF

4. UN SDG data

5. WHO

6. IHME / GBD, if licensing permits

7. Copernicus

8. Berkeley Earth

9. NASA / NOAA

10. FAO

11. UNHCR

12. ACLED

13. UCDP

14. GDELT

15. ReliefWeb

16. Ember / IEA for energy

V1 can start with only:

- OWID

- World Bank

- GDELT

- ReliefWeb

- ACLED/UCDP if access allows

- Copernicus/Berkeley Earth later

The ingestion layer should be modular.

Each source should have:

```ts
export interface SourceAdapter {
  id: string;
  name: string;
  fetchRaw(): Promise<void>;
  transform(): Promise<void>;
  generateCharts(): Promise<void>;
}
```

---

## 12. LLM Usage

LLMs should help with:

- Drafting chart captions

- Classifying hope/despair/confusion angles

- Summarizing news stories

- Suggesting related indicators

- Writing first-pass theme copy

- Detecting contradictions

- Generating metadata

LLMs should not be the source of truth.

Every factual claim must be traceable to:

- dataset

- source URL

- methodology note

- article

- official release

- paper

Do not generate LLM text during page requests.

All LLM work should happen offline in ingestion/build scripts.

LLM output should be stored as reviewed metadata:

```json
{
  "chartId": "child-mortality-global",
  "hopeReading": "Child mortality has fallen dramatically over the long run.",
  "despairReading": "Millions of children still die from preventable causes.",
  "confusionReading": "Progress varies sharply by geography, income, conflict, and health-system capacity.",
  "confidence": 0.86,
  "needsHumanReview": true
}
```

---

## 13. News Layer

News should be a secondary layer, not the main product.

The site should not become a news website.

News should contextualize data.

Possible sources:

- GDELT

- ReliefWeb

- selected RSS feeds

- official agency feeds

- research institute feeds

News item pipeline:

1. Fetch article metadata.

2. Extract title, summary, date, source, geography, theme.

3. Classify into:
   
   - hope angle
   
   - despair angle
   
   - confusion angle

4. Link to related charts.

5. Display on theme pages as “Recent signals”.

Example:

```json
{
  "title": "New malaria vaccine rollout expands in Africa",
  "themeSlug": "health",
  "hopeAngle": "Vaccine access is expanding.",
  "despairAngle": "Malaria still kills hundreds of thousands annually.",
  "confusionAngle": "Rollout, funding, resistance, and climate effects will determine impact.",
  "relatedChartIds": ["malaria-deaths-global", "child-mortality-global"]
}
```

Do not scrape full copyrighted articles into the site.

Use metadata, short summaries, and links.

---

## 14. Build Phases

## Phase 1 — Static Prototype

Goal:  
Build a beautiful static editorial site with no backend.

Tasks:

- Set up Astro.

- Create BaseLayout.

- Create homepage.

- Create ThemeLayout.

- Create 3 sample theme pages:
  
  - War and Peace
  
  - Climate
  
  - Health

- Create ChartCard component.

- Use placeholder static SVGs or simple generated SVGs.

- Create `themes.json` and `chart-index.json`.

- Add methodology page.

- Add sources page.

- Deploy to Cloudflare Pages.

Success criteria:

- Site loads fast.

- Homepage feels editorial.

- Theme pages show the hope/despair/confusion contradiction clearly.

- No heavy JavaScript.

---

## Phase 2 — Chart Registry and Static Chart Artifacts

Goal:  
Make chart rendering systematic.

Tasks:

- Create chart metadata schema.

- Create chart index file.

- Create local chart data JSON files.

- Write script to generate SVG chart artifacts.

- Store generated chart artifacts locally at first.

- Later upload to R2.

- Update ChartCard to use metadata from registry.

Success criteria:

- Adding a chart only requires adding metadata + data file.

- Chart pages are generated automatically.

- Theme pages render chart cards from chart IDs.

---

## Phase 3 — R2 Storage

Goal:  
Move chart artifacts out of Pages build.

Tasks:

- Configure Cloudflare R2 bucket.

- Add `wrangler.toml`.

- Write `scripts/publish/upload-to-r2.ts`.

- Upload chart SVGs, PNGs, and JSON to R2.

- Update chart metadata URLs to point to R2 public/custom domain.

- Keep Pages build under file limit.

Success criteria:

- Pages build remains small.

- Chart images load from R2.

- Site remains fast.

- No Pages file explosion.

---

## Phase 4 — Data Ingestion

Goal:  
Start ingesting real datasets.

Tasks:

- Implement OWID adapter.

- Implement World Bank adapter.

- Store raw snapshots.

- Normalize to common indicator schema.

- Generate initial charts.

- Track source and last updated fields.

Initial charts:

War and Peace:

- Conflict deaths over time

- Number of active conflicts

- Refugees/displacement

Health:

- Child mortality

- Life expectancy

- Maternal mortality

- Disease burden

Climate:

- Temperature anomaly

- CO2 emissions

- Renewable energy share

- Solar cost decline

Poverty:

- Extreme poverty

- GDP per capita

- Hunger/undernourishment

Success criteria:

- At least 25 real charts.

- Each chart has source metadata.

- Each chart has hope/despair/confusion readings.

---

## Phase 5 — News Signals

Goal:  
Add lightweight news context.

Tasks:

- Implement GDELT adapter or RSS adapter.

- Fetch recent article metadata.

- Classify theme.

- Link to related charts.

- Store only metadata and short generated summaries.

- Display recent signals on theme pages.

Success criteria:

- Theme pages show recent signals.

- News does not dominate the site.

- Stories link back to data.

---

## Phase 6 — Search and Discovery

Goal:  
Make the growing site navigable.

Tasks:

- Add Pagefind.

- Add theme grid.

- Add chart index page.

- Add source index page.

- Add tags:
  
  - long arc
  
  - recent reversal
  
  - distributional pain
  
  - future fragility
  
  - fragile progress
  
  - too early to know

Success criteria:

- Users can find themes, charts, and sources.

- Search works statically.

---

## Phase 7 — Optional Index Layer

Only after the site has enough reviewed material, consider lightweight indices.

Do not create one grand Hope Index.

Instead, create domain-specific signal panels:

Example:

War and Peace:

- Long-run violence signal

- Recent conflict signal

- Displacement signal

- Great-power risk signal

- Civilian harm signal

Climate:

- Clean energy signal

- Emissions signal

- Heat signal

- Adaptation signal

- Biodiversity signal

These should be qualitative or semi-quantitative.

Avoid fake precision.

---

## 15. Key Components to Build

## `ContradictionPanel.astro`

Purpose:  
Show the three readings of a theme.

Props:

```ts
interface Props {
  hope: string;
  despair: string;
  confusion: string;
}
```

Render:

```txt
Hope
What is improving?

Despair
What is worsening or still intolerable?

Confusion
What is uncertain, contradictory, or hidden?
```

---

## `VerdictBadge.astro`

Purpose:  
Show editorial verdict.

Input:

```ts
verdict: Verdict
```

Display labels:

```ts
const verdictLabels = {
  "better-than-it-feels": "Better than it feels",
  "worse-than-it-looks": "Worse than it looks",
  "progress-but-fragile": "Progress, but fragile",
  "long-run-progress-short-run-reversal": "Long-run progress, short-run reversal",
  "improving-in-aggregate-brutal-in-distribution": "Improving in aggregate, brutal in distribution",
  "technologically-hopeful-politically-dangerous": "Technologically hopeful, politically dangerous",
  "too-early-to-know": "Too early to know"
};
```

---

## `ChartCard.astro`

Purpose:  
Render static chart image + three readings + link.

Must use:

```html
<img loading="lazy">
```

Do not load interactive JS by default.

---

## `ThemeGrid.astro`

Purpose:  
Grid of theme cards on homepage.

Each card:

- Theme title

- Subtitle

- Verdict

- One-sentence contradiction

- Link

---

## `NewsCard.astro`

Purpose:  
Display recent signals.

Should show:

- Title

- Source

- Published date

- Hope/despair/confusion angle

- Related chart link

Do not display full article text.

---

## 16. Performance Rules

Hard rules:

- Homepage JS under 100 KB if possible.

- No charting library on homepage.

- No interactive chart JS unless user opens a chart page.

- Use static SVGs for chart previews.

- Use `loading="lazy"` for below-the-fold images.

- Use responsive image dimensions to avoid layout shift.

- Do not fetch raw data on article pages.

- Do not call external APIs from the client.

- Do not call LLM APIs from the client.

- Keep Cloudflare Pages file count below 20,000.

- Store generated artifacts in R2.

---

## 17. Initial Pages to Build

Create these pages first:

```txt
/
/themes/war-and-peace/
/themes/climate/
/themes/health/
/charts/war-deaths-long-run/
/charts/child-mortality-global/
/charts/global-temperature-anomaly/
/methodology/
/sources/
/about/
```

---

## 18. Homepage Draft Copy

Use this as initial homepage copy:

```txt
The world is getting better.
The world is getting worse.
Both are true.

Hope & Despair is a living atlas of human progress, suffering, and uncertainty.

It does not ask whether humanity is winning or losing.
It asks a harder question: what does the evidence allow us to hope, what does it force us to fear, and what remains too uncertain to name?
```

---

## 19. About Page Draft Copy

```txt
Hope & Despair is a data publication about contradictory truths.

Many arguments about the state of the world collapse into optimism or pessimism. Optimists point to long-run progress: fewer children dying, longer lives, more literacy, falling poverty, better technology. Pessimists point to climate change, war, ecological damage, loneliness, institutional decay, and new technological risks.

Both are often right.

This site tries to hold those truths together. Each theme is read through three lenses: hope, despair, and confusion.

Hope asks: what is improving?
Despair asks: what is worsening, fragile, or still intolerable?
Confusion asks: what is uncertain, contradictory, hidden by averages, or too early to understand?

The goal is not to produce a final score for humanity. The goal is to make reality harder to simplify.
```

---

## 20. Methodology Page Draft

```txt
This site uses public datasets, official statistical sources, research datasets, and selected news/event feeds.

The site distinguishes between:

1. Long-run trends
2. Recent changes
3. Distributional effects
4. Future fragility
5. Measurement uncertainty

A chart is not classified as simply hopeful or despairing. Instead, each chart can carry three simultaneous readings:

Hope:
What part of the data suggests progress?

Despair:
What part of the data suggests deterioration, suffering, fragility, or unfinished work?

Confusion:
What part of the data is uncertain, contradictory, badly measured, or dependent on assumptions?

Generated summaries may be assisted by large language models, but factual claims must remain traceable to underlying sources. LLMs are used for drafting, classification, and summarization, not as sources of truth.
```

---

## 21. Claude Code Implementation Instructions

When implementing, follow these priorities:

1. Build the static site first.

2. Make it beautiful and fast before adding data complexity.

3. Implement the content model.

4. Implement theme pages.

5. Implement chart cards with static images.

6. Add placeholder data.

7. Add R2 later.

8. Add ingestion later.

9. Avoid premature backend complexity.

10. Avoid indexes and scoring in v1.

Do not build:

- login

- comments

- accounts

- personalization

- subscriptions

- giant dashboard

- client-side BI tool

- real-time API system

- LLM request pipeline on page load

Build the simplest possible version that proves the editorial format.

---

## 22. V1 Acceptance Criteria

The v1 is successful if:

- The homepage clearly communicates the idea.

- Three theme pages exist and feel editorially strong.

- Each theme uses the structure:
  
  - long arc
  
  - recent trend
  
  - distributional reality
  
  - future fragility
  
  - optimist case
  
  - pessimist case
  
  - unknowns

- At least 9 chart cards exist.

- Charts are static SVGs or placeholder SVGs.

- The site loads fast.

- The design feels like an elegant data publication, not a SaaS dashboard.

- The project can later scale to thousands of charts without changing the core architecture.

---

## 23. Final Product Direction

Build this as:

> A devastatingly beautiful editorial atlas of human progress, suffering, and uncertainty.

Not:

> A dashboard.

Not:

> A sentiment classifier.

Not:

> A fake quantitative index of optimism and pessimism.

The site should make one idea unavoidable:

> Humanity is not a line chart.  
> Progress and catastrophe coexist.  
> The honest work is to hold both in view.
