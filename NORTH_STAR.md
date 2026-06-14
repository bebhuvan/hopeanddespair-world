# North Star — hopeanddespair.world

> The one document that does not change when everything else does.
> When a decision is unclear, it is answered here or it is answered wrong.

---

## Why this exists

This began as a blog post about a single, ancient puzzle: why do people look at the
*same* world and walk away with opposite verdicts? Why is one person an optimist and the
next a pessimist? Why does Steven Pinker, reading the long time series back to the dawn of
record-keeping, conclude we live in the best of all times — while someone reading only the
data of their own lifetime concludes everything is coming apart?

Both are looking at real numbers. Both are, in a narrow sense, right. The disagreement is
not about the data; it is about **the lens** — how far back you stand, whose life you count,
which decade you anchor to. There is real psychology and neuroscience underneath it (loss
aversion, the availability of recent vivid harm, the fading of the past). The original blog
post argued that the optimism/pessimism war is, at root, an argument about magnification.

The first attempt at a website died, pre-LLM, under the weight of manual curation. It is
possible now because language models have become genuinely good at tool use, large-scale
computation, and — with a careful hand — prose. So the idea returns, sharper.

## What it is

A **living atlas** that answers one honest question per article — *is the world getting
better or worse?*, asked a hundred specific ways — by weaving open data and plain-spoken
narrative into a single, intellectually honest story. Not another Our World in Data (we
stand on their shoulders and credit them), but a different act: **we ask a question, then
answer it across every dimension the data allows**, and we tell you what the data says *and
what it cannot say.*

Each article is a question. Inside it, **every chart is a sub-question** — claim, evidence,
explanation — so one big question can hold ten, twenty, fifty charts without losing the
thread.

## The thesis (non-negotiable)

**Progress and catastrophe coexist. The answer depends on the lens.** We demonstrate this;
we never merely assert it. Three temperatures run through everything:

- **Hope** — what is quietly, measurably improving.
- **Despair** — what is worsening, fragile, or still intolerable.
- **Confusion** — what is uncertain, contradictory, or hidden by the average.

Confusion is a first-class citizen, not a hedge. Not everything is binary; the honest answer
is often "both, and here is why."

## Who it is for

**The average layperson.** Scholars and insiders are already well served. The mission is to
carry data down from the rarefied air of academia to a person on a bus, on a couch, on a
bar-stool — and to leave them genuinely understanding it, not just exposed to it. If a smart
sixteen-year-old or a curious sixty-year-old can't follow it, we have failed.

## The creed

1. **Intellectually honest, always.** We take no side we have not earned from the data. We
   steelman the strongest case for hope *and* for despair, then weigh them — we do not
   lazily split the difference (both-sidesism is its own dishonesty).
2. **Transparent about the unknown.** What the data *doesn't* say is stated as plainly as
   what it does. Caveats go *before* the evidence, not buried after.
3. **Honest about the fuzziness of being alive.** Much of human existence is not legible to
   statistics. We say so, on purpose, and make room for it.
4. **Open by default.** All data is open and credited. All prose and code ship under a
   permissive license (CC BY 4.0) so the work can be reused with attribution.
5. **Honest about how it's made.** This is a one-person project; the prose is
   LLM-assisted and that is disclosed plainly (see [[WRITING.md]] · Disclosure). No
   pretending a newsroom wrote it; no pretending a machine's draft is untouched human work.
6. **Auto-updating, in the open.** Each article is backed by a script that re-pulls its
   data on a schedule (every 6–12 months), refreshes the charts, asks an LLM to revise the
   prose, and commits to git — so every change to a number or a sentence is tracked publicly.
7. **It takes as many charts as it takes.** (Decided 2026-06-10.) These questions are too
   important to ration by length: an article runs as long, and holds as many charts, as its
   question honestly demands. Refine-by-subtraction applies to noise, ornament, and
   repetition — never to coverage. Two disciplines keep "exhaustive" from becoming "bloated":
   every chart must still earn its place as a sub-question, and **no silent gaps** — every
   obvious sub-question is either charted, logged in the article's gap register with its
   blocker, or named in the piece as something the data cannot see.

## What success looks like

- A reader finishes an article more *uncertain in a useful way* — they can hold the
  contradiction instead of collapsing it.
- A reader who understood almost nothing can read the closing **plain-English box** alone
  and still walk away able to hold the gist in a conversation.
- The site holds **thousands of charts** and an article page stays fast regardless of how
  big the whole catalog grows. (See [[PLAN.md]] §4 — page weight scales with charts *on the
  page*, never with the catalog.)
- It feels **alive and a little joyful** without being loud — minimal core, no gimmicks.

## What this is NOT

- Not a dashboard. Not a chart dump. Not a personality-driven hot-take blog.
- Not neutral-to-the-point-of-cowardice, and not a thesis in search of data.
- Not loud: no gradient soup, no bouncing, no dark patterns, no engagement bait.
- Not anonymous about its method. Disclosure is a feature, not fine print.

## Companion docs (keep aligned)

- [[DESIGN.md]] — the visual philosophy, the "keep the minimal core, keep refining" method,
  and the anti-cliché bans.
- [[WRITING.md]] — the house voice ("Bifocal"), the article anatomy, the structural
  innovations (definition boxes, Wikipedia links, the closing box), anti-AI-tells, and the
  disclosure language.
- [[PLAN.md]] — the build plan, scaling architecture, content schema, and phases.
- [[EXPLAINERS.md]] — the moat: the signature explainer formats.
- [[CHARTS.md]] — the chart kit (jobs, not types) and the composition grammar.
- [[DATA.md]] — ingestion, provenance, validation, license gates.
- `docs/DATASET-ATLAS.md` — every planned question mapped to its open datasets.
- `docs/PROSE-SYSTEM.md` — the repeatable prose pipeline and the depth bar.
- `CLAUDE.md` — the agent-facing context map (commands, invariants, gotchas).
- `idea.md` — the original CODEX brief, kept for provenance (superseded where it conflicts).

> If a future decision contradicts this file, change reality back — or change this file
> deliberately, and write down why.
