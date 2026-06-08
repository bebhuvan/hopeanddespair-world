# Design — hopeanddespair.world

> Minimal core. Quietly alive. Refined by subtraction, not addition.
> Companion to [[NORTH_STAR.md]] and [[WRITING.md]].

The bones are good. V3 (`mockups/home-v3.html`, `mockups/article-v3.html`) is the canonical
direction: cool near-white, the hope-teal / despair-coral / confusion-indigo temperature
triad, typographic hierarchy, a real interactive lens, no charting library. What follows is
how it gets from *good* to *graceful* — and the method for keeping it there.

---

## 1. The diagnosis — why V3 feels boxy and rigid

It isn't a vague feeling; it's measurable. In `article-v3.html`:

- **7 fully-enclosed boxes** (`border:1px solid` around a block).
- **The `gap:1px` cell-grid trick used 3 times** — `.lenses`, `.signals`, `.take` each draw
  a hairline-divided table of equal cells (`display:grid; gap:1px; background:var(--rule);
  border:1px`). This is the single biggest source of the "boxy" feel: it renders content as
  a *spreadsheet of compartments.*
- **19 uppercase, letter-spaced labels** (`text-transform:uppercase` + `.16–.32em`
  tracking). Relentless engineered labels read as a dashboard, not a publication. They are
  cold where the project wants warmth.
- **Sharp 90° corners everywhere**, equal-width columns, and a metronomic vertical rhythm
  (label → content → rule, repeated at one density for the whole page).

The root cause is a contradiction between intent and execution. The plan says
*"typography-led, decoration is hairline rules + whitespace."* In practice **the borders are
doing the structural work that whitespace and type were supposed to do.** Boxes enclose and
trap the eye; the page becomes a stack of rectangles. That is the rigidity.

> A box *contains*. A line *leads*. We have too many things that contain and too few that
> lead.

---

## 2. The principles — how to make it flow (without making it loud)

Fluidity here comes from **removing containers, not adding effects.** Each move below keeps
the minimal core and stays inside the anti-cliché bans (§4).

1. **Dissolve cells into open columns.** Replace every `gap:1px / background:rule / border`
   cell-grid (`.lenses`, `.signals`, `.take`) with borderless columns separated by
   *whitespace* and, at most, a *single* hairline between them. Compartments → a breathing
   row.
2. **Prefer the rule to the box.** A page wants at most one kind of divider: a horizontal
   hairline that *separates*, never a rectangle that *encloses*. Drop the box around
   `.figure`, `.caveats`, `.chart-frame`. Let the chart sit on the page on its own baseline.
   Charts breathe when they aren't framed.
3. **Let whitespace carry hierarchy.** Vary the rhythm. Big air between movements, tighter
   air within one. Elegance is contrast — dense vs. sparse, wide vs. narrow — not uniform
   spacing. The current page is too even to feel composed.
4. **Use the margin as a compositional device.** The `.sidenote` already gestures at an
   asymmetric margin column; lean into it. An off-center, asymmetric layout reads as
   *designed*; a centered stack of equal boxes reads as *generated.*
5. **Turn down the uppercase.** Cut the tracked-caps label count hard (target: ~5, not 19).
   Replace most with **small italic Fraunces** or quiet sentence-case. The serif italic is
   the most alive element in the whole system — the verdict word, the pull-quotes, the lens
   names already use it. Make it the connective tissue, not a garnish.
6. **Let the temperature actually flow.** Today the hope→confusion→despair gradient lives
   only in the scroll-spine. Let the color *temperature* (not stoplight, never a stoplight —
   see §4) carry quietly through the verdict word, an end-marker, a single rule — so the
   thesis is felt, not just diagrammed.
7. **Soften by openness, not by rounding.** The refined route for a literary atlas is
   *fewer borders + more air*, not rounded cards. Rounded rectangles trade "rigid box" for
   "app card" — still a box. Keep corners honest; remove the corners that don't need to
   exist.
8. **Keep the motion you have; add no more.** The ◐ flip, the live pulse, the one-shot
   chart fade-in, the spine — these are the right *kind* of life: quiet, meaningful,
   transform/opacity-only. Do not add a second vocabulary of motion.

### Where "life and joy" comes from (the user's brief)

Joy here is **restraint with one or two warm gestures**, never volume. Permitted sources of
life: the ◐ emblem and its flip; the live-pulse "updated continuously" dot; the temperature
genuinely shifting as you read; a warm hand in the *prose* ([[WRITING.md]]); the closing
plain-English box, which is allowed to be the one openly playful moment on the page. That is
the budget. Everything else stays calm.

---

## 3. The method — "keep the minimal core, keep refining"

The way we improve without drifting into noise:

- **Refine by subtraction first.** Before adding anything, ask what can be *removed* (a
  border, a label, a box, a color). Most refinements on this project are deletions.
- **One change, one judgment.** Change a single thing; look at it; keep or revert. Don't
  ship a bundle of ten tweaks you can't individually defend.
- **Every addition pays rent.** A new element must earn its place against whitespace. If
  whitespace does the job, whitespace wins.
- **Version in the open.** Mockups are kept as `*-vN.html` so we can see the trajectory.
  Each version note records *what changed and why it felt better* — not just what changed.
- **The bans are a ratchet** (§4): once something is banned for being a cliché, it does not
  quietly return.
- **Show, don't tell.** Design arguments are settled in the browser, not in prose. Build the
  variant; compare side by side.

---

## 4. Anti-cliché bans (enforced in review)

Carried from [[PLAN.md]] §3 and owned here. No globe / world-map imagery. No beige/cream as
*primary*. No gradient blobs, mesh, or glassmorphism. No drop-shadowed card grids. **No
stoplight red/green** (color is a *temperature*, not a traffic light). No neon, no glow on
charts. No emoji. No stock photography. No KPI/metric cards. No `Inter`. No bouncing,
dancing, or attention-grabbing motion. Decoration is hairline rules + whitespace — and we
have learned (§1) to use *fewer* of even those.

**New bans, from the V3 diagnosis:**

- No `gap:1px` cell-grids rendering content as a table of compartments.
- No fully-enclosed content boxes where a single rule or plain whitespace would do.
- No more than ~5 uppercase tracked labels on a page; the serif italic carries tone instead.
- No uniform, metronomic vertical rhythm — vary the air deliberately.

---

## 5. The design system (tokens, type, charts)

The token sets, font stack (`Fraunces` / `Newsreader` / `Geist` / `Geist Mono`), and chart
rendering approach (inline `smooth()` monotone-cubic, no client charting library, baked SVG
watermark, lazy static artifacts) are specified in [[PLAN.md]] §3–4 and are the source of
truth for those. This file governs *how those parts are composed* — and the composition is
where the elegance is won or lost.

> Performance is a design constraint, not a footnote. A chart that janks is an ugly chart.
> Never animate an SVG filter/stroke per-frame over a fixed background (it thrashes the
> compositor). Transform/opacity-only entrances; composited fixed backgrounds. (See
> [[PLAN.md]] §3.)

---

## Progress

**`mockups/article-v4.html` (built 2026-06-08)** — first pass of §2, JS byte-identical to v3
(the lens still works). Changes, by the numbers:

| | v3 | v4 |
|---|---|---|
| Fully-enclosed boxes | 7 | 3 |
| `gap:1px` cell-grids | 1 (`.signals`) + bordered `.take` | 0 |
| Uppercase tracked labels | 19 | 13 |

What changed: `.signals` and `.take` dissolved into **open columns** (whitespace + one top
hairline, no compartments); `.figure` and `.chart-frame` **unframed** (chart sits on the
page); `.caveats` is now a **left-rule aside**, not a tinted box; the content eyebrows
(`.move .ey`, `.evi-head`, section labels, `.duel h3`, caveats/verdict labels) are now
**Fraunces italic** instead of uppercase Geist; section rhythm loosened for contrast.

**Still open (next passes, by subtraction):** push remaining uppercase toward ~5 (the rest
are genuine UI — nav, toggle, segment buttons, download tools — and may stay); introduce a
real **asymmetric margin column** (lean the `.sidenote` rail into a compositional device);
let the temperature flow into one or two more quiet places; then port the winner's tokens to
the Astro shell.
