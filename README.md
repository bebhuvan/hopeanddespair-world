# hopeanddespair.world

**Live at → [hopeanddespair.world](https://hopeanddespair.world)**

A living atlas of human progress, suffering, and uncertainty. One honest question per article —
*is the world getting better or worse?* — answered across many dimensions with open data and
plain-spoken narrative. **The world is getting better. The world is getting worse. Both are true.**

## The docs (read these first — they are the project's spine)

- [`NORTH_STAR.md`](NORTH_STAR.md) — why this exists, the thesis, the creed. The anchor.
- [`DESIGN.md`](DESIGN.md) — visual philosophy; refine by subtraction.
- [`WRITING.md`](WRITING.md) — the "Bifocal" voice, article anatomy, anti-AI-tells.
- [`CHARTS.md`](CHARTS.md) — the chart kit (by job, not type).
- [`EXPLAINERS.md`](EXPLAINERS.md) — the explainer formats; our moat.
- [`PERFORMANCE.md`](PERFORMANCE.md) — **static-first**, the speed budget, enforcement.
- [`PLAN.md`](PLAN.md) — build plan, scaling architecture, content schema, phases.

## Stack

Astro (static output) · self-hosted fonts · **no client charting library** · charts are inline
SVG rendered at build time. Static-first: every article is complete and understandable with
**zero JavaScript**; interactivity is opt-in progressive enhancement only.

## Develop

```sh
pnpm install
pnpm dev        # local dev server
pnpm build      # static build → dist/
pnpm preview    # serve the build
pnpm verify     # build + size budget + zero-JS + no-chart-lib guards
```

## Layout

```
src/
  content/questions/*.md   # one question per article (frontmatter = structured data)
  content.config.ts        # Zod schema — the single source of truth
  lib/                     # smooth.ts, charts.ts (build-time SVG renderers)
  layouts/  components/  pages/  styles/
mockups/                   # design source of truth (article-v5, home-v4, charts.html)
```

Original prose, code, and chart designs: **CC BY 4.0**. Source datasets carry their own
(typically CC BY) licenses, credited per-article with license and vintage.
