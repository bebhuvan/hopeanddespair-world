# Performance — fast from day one

> Speed is a feature and a design constraint, not a later optimisation. A page that janks is
> an ugly page. Companion to [[PLAN.md]] §4, [[CHARTS.md]], and [[DESIGN.md]].

## The invariant (the whole game)

**A page's weight scales with the charts *on that page* (~5–10), never with the size of the
whole catalogue.** At 50 charts or 50,000 charts, an article page costs the same. If a change
would make page weight grow with the catalogue, it is wrong by definition.

This is why the answer to "will it croak at 200 / 2,000 / 20,000 charts?" is *no* — scale
lives in **storage + CDN**, not in the client.

## Static-first (the default, decided 2026-06-08)

**An article must be complete, fast, and fully understandable with zero JavaScript.** Beautiful
charts + brilliant prose are the permanent core; charts are static SVG, the argument is in the
words and the composition. Interactivity is **progressive enhancement only** — it layers onto a
page that already works, hydrates *only if present*, and is **never load-bearing for
understanding and never shipped on day one.**

The thesis ("the answer depends on the lens") is carried **statically** by the
**four-magnification row** — the same metric shown at four windows side by side, the verdict
flipping across them ([[EXPLAINERS.md]] · Pillar 1). No slider needed; works with JS off; often
clearer for a layperson. Optional later enhancements (a lens slider, "in your lifetime") are the
*cherry, not the cake* — a tiny island that, if it fails to load, costs the reader nothing.

> Why this is also a speed decision: every interactive element is JS to parse, state to manage,
> and a way to jank on a cheap phone. Static-first means the fast path *is* the only required
> path. Enhancements can never regress the baseline because the baseline doesn't depend on them.

## The budget (enforced, not aspirational)

Per article page, on a mid-range mobile over 4G:

| Metric | Budget |
|---|---|
| HTML + CSS + JS (excl. fonts), gzipped | **≤ 100 KB** |
| Client JS shipped & parsed | **≤ 40 KB** (the lens island + tiny helpers) |
| Fonts (woff2, subset), total | **≤ 120 KB** across all faces |
| Largest Contentful Paint | **< 1.5 s** |
| Cumulative Layout Shift | **≈ 0** |
| Charting library on the client | **0 bytes** (there is none) |

Build **fails** if a budget is exceeded (see Enforcement). Numbers are a starting line — tighten
as we measure, never loosen silently.

**The one declared exception (2026-06-13):** the keystone hub
(`is-the-world-getting-better-or-worse`) is not one article but the 23-dimension front door, with the
world→region→country lens on every dimension. It runs ~105 KB brotli (~176 KB gzip) and is gated
**separately at 120 KB brotli** in the `size-limit` config — tracked tightly so creep is caught, but
held above the 100 KB page budget on purpose. It carries **zero client JS** like every other page, so
the cost is download + a larger static SVG DOM (~7.5k nodes), not execution. Every *other* page stays
held to the strict budget; this is the deliberate one-off, not a loosening of the rule.

## How each layer earns its speed

**Charts — pre-baked, never computed at request time.**
- Every chart is a static artifact (`svg/png/csv/json`) produced offline by
  `render-charts.ts`, content-hashed, cached on the CDN ([[CHARTS.md]], [[PLAN.md]] §4).
- On the page: inline SVG for above-the-fold, `<img loading="lazy">` for the rest. No client
  charting library, ever.
- Re-render is **incremental** — only charts whose (data + spec) hash changed.

**JS — almost none, and only where it must hydrate.**
- The site is static HTML/CSS. The **only** interactive component is the EvidenceLens, an
  Astro **island** that hydrates on the article page alone and swaps *pre-rendered* SVGs per
  zoom-stop (it does not draw charts at runtime).
- Everything else (theme toggle, scroll-spine, figure fade-in) is a few lines of
  transform/opacity-only vanilla JS.

**Fonts — the usual silent tax, paid down deliberately.**
- Self-host `woff2`, **subset** to the glyphs we use; `font-display:swap`; `preload` only the
  two display cuts that paint first. No render-blocking font CSS. (Mockups use Google Fonts
  for convenience; the Astro build self-hosts — a real win vs. the mockups.)

**CSS — small and critical-inlined.**
- One token sheet + global + typography. Inline the critical slice in `<head>`; defer the
  rest. Hairline-rule aesthetic ([[DESIGN.md]]) is cheap by nature — no shadows to composite,
  no images to decode.

**No layout shift.**
- Every chart frame reserves its space via `aspect-ratio` (already in the mockups) so lazy
  charts never reflow text. Fonts swap without metric jump where possible.

**Storage tiering** ([[PLAN.md]] §4) — Pages holds HTML/CSS/tiny-JS/markdown (scales with
*articles*); R2 + CDN holds every SVG/PNG/CSV/JSON + datasets (scales with *charts*, cheap,
unbounded); a JSON/D1 index holds chart metadata. This also dodges Cloudflare Pages' 20k-file
limit. Cache artifacts `immutable` (they're content-hashed).

## The compositor rule (learned in mockups)

Never animate an SVG filter or per-frame stroke over a `position:fixed` background — it
thrashes the compositor and the scroll judders. Use a **composited fixed `::before`** for
background gradients and **transform/opacity-only** entrance animations. Respect
`prefers-reduced-motion`. (Carried from [[PLAN.md]] §3.)

## Enforcement (in CI, from the first commit)

1. **Size budget** — a check (e.g. `size-limit` / a tiny script) on the built page bundle;
   exceeding the table above fails the build.
2. **Lighthouse CI** — assert LCP / CLS / total-byte budgets on a representative article;
   fail the PR on regression.
3. **"No client chart lib" guard** — grep the built JS for known chart libs; fail if present.
4. Track the numbers over time so a slow creep is visible before it's a problem.

> Day-one cost: wire the budget check and Lighthouse CI into the Astro scaffold *before* the
> first real article. It is far cheaper to never regress than to claw speed back at 300 charts.
