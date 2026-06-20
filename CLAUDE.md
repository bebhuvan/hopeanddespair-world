# CLAUDE.md — agent context for hopeanddespair.world

A living atlas answering "is the world getting better or worse?" — one honest question per
article, open data + plain narrative, for the average layperson. **The thesis (non-negotiable):
progress and catastrophe coexist; the answer depends on the lens.** Three temperatures: hope /
despair / confusion (first-class). Read [[NORTH_STAR.md]] before changing anything that smells
like direction.

## The doc map (read the relevant one BEFORE working in its area)

| Doc | Owns |
|---|---|
| `NORTH_STAR.md` | the creed; what this is and is not |
| `DESIGN.md` | visual taste: minimal core, refine by subtraction, no loud effects |
| `WRITING.md` | the Bifocal voice, article anatomy, disclosure language |
| `ANTI-AI.md` | the exhaustive banned-tells catalog (enforced by the prose linter) |
| `EXPLAINERS.md` | the moat: signature formats (four-magnification row, take strips, …) |
| `CHARTS.md` | the chart kit (jobs not types) + the composition grammar |
| `DATA.md` | ingestion architecture: snapshots, registry, validation, license gates |
| `docs/DATASET-ATLAS.md` | every planned question → its open datasets + license gates |
| `docs/PROSE-SYSTEM.md` | the repeatable prose pipeline, recipe, depth bar, failure modes |
| `docs/ARTICLE-violence-plan.md` | the flagship's blueprint (template for future articles) |
| `docs/ARTICLE-keystone-plan.md` | the keystone hub's blueprint — the whole-question front door, twelve dimensions as verdict units |
| `docs/ARTICLE-wealth-poverty-plan.md` | the Q5 poverty blueprint — PIP + MPI + WID, line-is-a-choice spine, eight tensions, ~26 movements |
| `docs/ARTICLE-climate-plan.md` | the Q3 climate blueprint — carbon→heat→damage→who, the Q3/Q4 boundary, the honest-gap (global-only) move, `berkeley`/`sealevel` adapters |
| `docs/ARTICLE-fertility-plan.md` | the fertility/population build — "is the world running out of children?"; the two-clocks balance (no overall lean), history-solid/projection-dashed, peak-and-decline ~2084, eleven movements on existing demography data + 15 OWID/WB ingests |
| `docs/ARTICLE-progress-plan.md` | the "is human progress slowing down?" build — pace-not-level reframe (deceleration of the headline gains); borrows the World Bank Atlas's *question* but uses a simpler, fully-disclosed world-aggregate trend method; the refused poverty counterfactual; built (5 movements) on existing derived series + 2 new `data360` pulls (women-in-parliament, population) via `scripts/analysis/global-progress.ts` |
| `docs/ARTICLE-debt-plan.md` | the Q13 debt build — "is the world drowning in debt?"; the level-isn't-danger reframe, the vulnerability composites (Red Lines / cost-in-classrooms), the gauges-lie disclosure; built (7 movements) on UNCTAD (link-only) + WB IDS + BIS + BoC–BoE default census, via `scripts/analysis/*` not the registry |
| `PERFORMANCE.md` / `PLAN.md` | the speed budget / the build plan |

**Doc discipline:** when a decision changes reality, update the owning doc in the same change
— and `NORTH_STAR.md` only deliberately, writing down why. Mockups: `mockups/article-v5.html`
and `home-v4.html` are canonical.

## Commands

```
pnpm data        # run the ingestion pipeline (fetch→snapshot→normalize→validate→derive)
pnpm prose       # generate Bifocal prose via DeepSeek (needs .env key; pnpm llm:check)
pnpm prose:lint  # deterministic anti-tell gate (wired into verify)
pnpm verify      # build + size budget + zero-JS + no-chart-lib + prose lint
pnpm build / pnpm preview
```

## Invariants (violating any of these is a bug, not a choice)

- **Zero client JS for comprehension.** Charts are build-time inline SVG. No charting libs.
- **Snapshot everything;** never hit a live API at build/request time. Vintage + checksum.
- **License gate:** re-host only CC BY/CC0/PD; restricted sources are link-only. Attribution
  generated from the registry, never hand-typed.
- **Never invent a number.** Every quantitative claim traces to a derived series. After every
  `pnpm prose` run, a **manual number audit** against `src/data/derived/*.json` is required —
  the linter catches tells, not fabrications.
- **Prose carries no AI tells** (`ANTI-AI.md`); never open an explainer by restating the
  claim headline; LLM assistance is plainly disclosed on the site.
- **Refine by subtraction** — delete before adding, in design, charts, and code.

## Known gotchas (each cost real debugging time)

- **OWID multi-column graphers:** any grapher CSV with multiple value columns MUST set
  `sourceColumn(s)` in the registry or the adapter silently reads the LAST column
  (battle-deaths was undercounted ~1000× this way).
- **`String.replace` with model text:** LLM output containing `$` (e.g. "$2.77 trillion")
  corrupts string-arg replacements ($1 = capture ref). Always use function replacers.
- **OWID 403s:** some slugs (homicide-rate, share-of-deaths-by-cause) are non-redistributable
  → link-only; the World Bank mirror often has a CC BY equivalent.
- DeepSeek prose: model invents vivid outside numbers (totals, risk ratios, distance
  analogies) — exactly what the number audit exists to catch.
