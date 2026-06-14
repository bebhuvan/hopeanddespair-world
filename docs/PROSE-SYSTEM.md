# The prose system — repeatable, accessible explainers

How we turn a chart and its data into prose a stranger on a bus understands and remembers, every
time, without it drifting into machine-blandness or inventing numbers. Sits on top of
[[WRITING.md]] (the voice), [[ANTI-AI.md]] (the tells), and [[EXPLAINERS.md]] (the moat).

## Who we write for

An ordinary, curious person. A smart friend on a bus, not a scholar in a seminar. **Scholars are
already well served — this is for everybody else.** That never means dumbing down, talking down, or
thinning the idea. It means taking something genuinely complicated and making it beautiful and clear.
The test (from `WRITING.md`): a curious person with no background finishes the piece understanding it,
and can say something true about it at dinner.

## The explainer recipe (codified)

Every explainer follows this. The generator enforces it; the linter checks it; the editor re-checks it.

1. **Never open by restating the claim.** The claim is already printed as the headline right above the
   prose. Repeating it throws away the first sentence — and it's the single loudest tell we had (13 of
   20 explainers did it before this system). Open somewhere fresh: a concrete scene, a named place or
   year, or one number turned into something a body can feel.
2. **Make one number felt.** Turn a figure into lived scale — "in a town of 40,000, that is ten people
   a year." Use **only numbers you were given**, and only simple arithmetic on them (a rate times a
   stated population, a ratio of two given figures). No outside comparisons you weren't handed — no
   car-crash odds, no other cause-of-death totals, no distance analogies. Those are where fabrications
   creep in (see Failure modes).
3. **Bifocal.** State the finding plainly, then complicate it in the next breath — the hopeful read,
   the grim read, or the catch. Two distances in one paragraph.
4. **Vary the rhythm on purpose.** At least one very short sentence and one long one. If it ticks like
   a metronome, break it. (Linted: sentence-length stdev should clear ~4.)
5. **Em-dashes: at most one.** Prefer commas, full stops, semicolons. The em-dash aside is the
   classic LLM tic.
6. **End on the strongest concrete thing** — an image, a number, an honest tension — not a summary.
7. **Plain words, real stance, owned uncertainty.** Use not utilize. Say which case is heavier. Name
   the doubt directly (not "we don't know…" twenty times).

The takes (hope / despair / confusion) are one sentence each, specific, no hedge-openers.

## The depth bar — what an explainer must ADD

The mission says the prose is never a "mechanical regurgitation of what's already obvious on
the chart." Make that testable. An explainer earns its place only if it adds **at least two**
of these five, none of which a reader can get from the chart alone:

1. **The mechanism** — *why* the line moves: the named cause (courts displacing feuds,
   nuclear deterrence, the vaccine rollout). The single highest-value sentence in any
   explainer.
2. **The named history** — a person, place, year, or event that anchors the curve to the
   world (Eisner's court rolls; Korea in the 1950 spike). Generic history ("over the
   centuries, societies changed") doesn't count.
3. **The catch** — what this measure excludes or distorts, said plainly (battle deaths
   don't count the hunger that wars drag behind them).
4. **The human scale** — one number converted to a body, a street, a lifetime (recipe §2).
5. **The collision** — where this chart rubs against another chart or another source, and
   what the friction means.

And one ban: **no chart narration.** A sentence that merely describes the geometry ("the
line rises sharply after 2010, then levels off") is dead weight unless it exists to name the
cause or the catch. Test: if the sentence could caption a different chart with the axes
swapped, cut it. Density comes from cutting narration, not from packing more clauses in.

Two hand-written exemplars live in `scripts/lib/prose-exemplars.ts` and are fed to the model as
few-shot. They are the bar. If generated prose isn't this good, the system isn't done. Sample:

> Take a town of 40,000 people. In Western Europe around 1250, about ten of them were murdered every
> year; by the 1370s, closer to fourteen. The same town today would go three or four years between
> killings. Per person, a medieval European faced roughly thirty-five times your odds of being
> murdered. The fall wasn't steady; it bottomed out near 1950 and has crept up a little since. But
> across seven centuries, the line only ever pointed down.

Note: opens on a hook (not the claim), the rate becomes "ten people a year," the rhythm swings short to
long, one number is felt, the stance is plain, and there's not a single em-dash.

## The pipeline

Three commands, offline only. Generated prose is committed, never produced at build or request time.

- **`pnpm prose`** (`scripts/write-prose.ts`) — generates all prose via the DeepSeek seam.
  - System prompt = `WRITING.md` + `ANTI-AI.md` verbatim + the recipe above + the two exemplars.
  - Each movement is fed its **real data facts** (first / latest / peak / low, computed from
    `src/data/derived/*.json`, **windowed to the chart's `x0`/`x1`** so a recent-zoom describes its own
    span). Illustrative charts are flagged to stay qualitative.
  - **Lint-and-revise gate:** every draft explainer is run through the deterministic linter; any that
    restates the claim, tics on em-dashes, or hits a banned tell is handed its own failures back and
    rewritten (up to two passes). This is what makes quality repeatable instead of luck-of-one-draft.
  - Writes in place with a `.bak`.
- **`pnpm prose:lint`** (`scripts/prose-lint.ts` + `scripts/lib/prose-lint-lib.ts`) — the objective
  gate, no LLM. Per explainer: claim-restatement overlap, banned lexicon/constructions (ANTI-AI §1–2),
  em-dash rate, sentence-length variance, reading grade, tricolons. Across movements: repeated openers.
  Exits non-zero on any FAIL, so it can guard a build. Thresholds: restatement > 0.5 = fail; reading
  grade aim ≤ 11; em-dash > 1.5/100 words = warn; sentence stdev < 4 = warn.
- **The number audit (manual, required).** The linter catches *tells*, not *fabricated facts*. After
  every `pnpm prose`, extract each real-data explainer and check every figure against its derived
  series. This is non-negotiable — see Failure modes.

Baseline → after the system, on the violence flagship: **15 fails / avg reading grade 9.3 → 0 fails /
grade 7.3.** All claim-restatements gone; em-dash tics gone.

## Failure modes (what the linter can't catch — watch these by hand)

The model reaches for vivid outside numbers it was never given. Caught repeatedly:
- A global homicide total ("437,000 murdered that year") to contrast with terrorism — we don't re-host
  that figure (UNODC is link-only); it's invented.
- A risk ratio ("2,500× more likely than a car crash") — no source.
- A distance analogy ("refugees would stretch from London to Sydney and back") — wrong by ~2×.
- Saying a *falling* series is rising (nuclear warheads in the synthesis).
- Calling a Western-Europe figure (0.7/100k) the *global* average.

Prompt rules now forbid outside-number comparisons and name the falling series, but **the number audit
is still required** — feeding facts reduces fabrication, it doesn't eliminate it. Every quantitative
claim must trace to a cited series (`DATA.md`), and the disclosure box already tells readers the prose
is LLM-assisted and human-edited. That human edit is this audit.

## Adding the next article

1. Scaffold the movements (claims, charts, captions, `dataRef`s) with `illustrative: true`.
2. `pnpm data` to ingest real series.
3. `pnpm prose` → `pnpm prose:lint` → number audit → fix → `pnpm build`.
4. Flip `illustrative`/`status` only when the charts are real and the audit is clean.
