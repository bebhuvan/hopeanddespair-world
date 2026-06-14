# Writing — the "Bifocal" house style

> Plain words, true nuance. Lead with the finding; complicate it immediately.
> Companion to [[NORTH_STAR.md]] and [[DESIGN.md]]. This file is also the spec the
> writing skill implements.

The audience is a layperson on a bus, not a scholar in a seminar ([[NORTH_STAR.md]] · Who).
Everything below serves one test: **a curious person with no background finishes the piece
genuinely understanding it — and able to say something true about it at a dinner table.**

---

## The name: Bifocal

We always show two distances at once — the long view and the close view, the global average
and the single life. The reader looks through both lenses in the same paragraph. That is the
voice and the thesis in one word. (Spirit-of-Smart-Brevity, but our own structure; Axios's
"Smart Brevity" is trademarked — we do not use the name or copy the format.)

---

## The ten rules

1. **Lead with the point.** First sentence of any section is the finding in plain words, not
   a wind-up. *"Homicide has fallen for seven centuries"* — then the nuance.
2. **One idea per paragraph. Short paragraphs.** White space is part of the argument.
3. **Every claim is immediately complicated.** A finding never stands alone; the very next
   beat gives the hope read, the despair read, or the catch. This is Bifocal: near and far
   in the same breath.
4. **Give every number a human scale.** Not "a 40-fold decline" alone — *"a medieval
   European was tens of times more likely to be murdered than a person in the same city
   today."* Numbers are felt through bodies, streets, lifetimes.
5. **Concrete over abstract, always.** Name the place, the year, the person. "Khartoum,
   today" beats "certain conflict-affected regions."
6. **Name the uncertainty out loud.** What the data can't say is said plainly, early, and
   without apology. Confusion is content, not a disclaimer.
7. **No throat-clearing, no hedging filler.** Cut "it's important to note," "it's worth
   remembering," "in today's world," "needless to say." Earn the sentence or delete it.
8. **Weigh, don't split.** Steelman hope and despair, then say which is heavier here and
   why. Refuse lazy both-sidesism — false balance is a lie with good manners.
9. **Warmth through specificity and rhythm, not adjectives.** Vary sentence length. A short
   one lands the point. The voice is a thoughtful friend who respects you, not a brand.
10. **Make reality harder to simplify.** Every piece should leave the reader *usefully more
    uncertain* — holding the contradiction, not handed a verdict to parrot.

---

## Article anatomy (one question → many sub-questions)

The article *is* a question; each chart is a sub-question. There is no target length: a piece
takes as many movements as the question demands ([[NORTH_STAR.md]] · creed 7), and what is not
yet charted is logged in the article's gap register, never silently skipped. Top to bottom —
reconciling the user's "zoom from macro → regional → granular" narrative with the apparatus
already built in `article-v3.html`:

1. **Opener** — kicker, the question as headline, a lede that frames the puzzle (no answer
   yet).
2. **Caveats & blind spots** — disclosure *before* the evidence: what's illustrative, what
   the measure excludes, where history is thin, that the verdict is editorial.
3. **The Evidence (the lens)** — the synchronized panel: hero chart + signal small-multiples,
   one time-lens re-windowing every chart at once (deep history → since 1900 → since 2020 →
   a lived day), a composite verdict whose *color-temperature* shifts with the lens, and a
   vantage toggle (global ↔ a hard place). This is the macro→micro zoom, made interactive.
4. **Movements** — the body, and the spine of the zoom narrative. Each movement: eyebrow +
   **claim headline** (the finding, plainly) + prose explainer + a full axed chart +
   a hope / despair / confusion "take" strip. Order them by magnification: the long global
   arc first, then the recent break, then *who the average hides* (regional/granular), then
   the other dimensions of the topic. This is how one question holds 10–50 charts.
5. **The multi-disciplinary read** — historian / statistician / forecaster / someone living
   it / ethicist, each with a hope and a despair reading and a stated confidence level.
6. **The two strongest cases** — steelmanned hope vs. despair, *weighted* (rule 8).
7. **What would change this verdict** — explicit falsifiability.
8. **Methodology** — every transformation disclosed; what's editorial vs. measured.
9. **Sources & references** — datasets, links, licenses, vintages.
10. **Revision history** — auto-generated from git; the living-atlas provenance trail.
11. **The closing plain-English box** — see below.

---

## Structural innovations (what makes us *us*)

These are first-class features, generated as part of the pipeline, not afterthoughts.

### Definition boxes (auto-generated)
The first time a piece uses a term a layperson might not know (e.g. *battle-related deaths*,
*population-weighted mean*, *structural violence*), a small inline **definition box** appears
— one or two sentences, plain words. Generated automatically by detecting jargon against a
plain-language threshold; reviewed in the writing skill. Quiet styling, never a popup.

### Generous Wikipedia links
Important concepts, people, places, and events link out to Wikipedia. Wikipedia is a primary
ally for this project's mission — carrying knowledge to laypeople — and we lean on it
deliberately and gratefully. Links are unobtrusive (a hairline underline), never
link-spammed; one good link per concept, the first time it matters.

### Every chart is a sub-question
A movement's headline is phrased as (or answers) a question. The chart is the evidence; the
explainer is the answer; the take strip is the nuance. This keeps a 40-chart article from
becoming a gallery — it stays a single argument with forty steps.

### The closing box — *"Still lost? Read this."*
The signature ending. After every article, a single box of **2–4 short paragraphs** that
re-explains the whole thing from scratch, assuming the reader understood *nothing* above. If
someone bounced off every chart, they can read only this box and walk away with the gist —
enough to hold the idea confidently in a conversation, at dinner, at the bar.

This box is the **one openly warm, slightly irreverent moment** on the page — the project's
license to have a personality. (Working codename, kept in the markup as a wink: *the FYIDU
box* — "fine, you didn't understand." Public label stays friendly: **"Still lost? Read
this."** Final label is the user's call.) It must:
- assume zero prior understanding and use zero jargon (or define it on the spot);
- give the reader one true, repeatable takeaway they can say out loud;
- be honest — it simplifies, it does not lie or over-claim;
- be the warmest, most human paragraphs in the piece.

---

## Disclosure (non-negotiable, plainly worded)

Every article carries a clear note. Spirit, not boilerplate:

> *This is a one-person project. There is no way I could research, write, and keep hundreds
> of these pieces current by hand — so the prose here is written with the help of a large
> language model, working from open data and edited by a human. The data is open and cited.
> Every change is tracked in the open. Where the writing is uncertain, it says so.*

No pretending a newsroom wrote it. No pretending the machine's draft is untouched. The model
used and the pipeline are documented; see [[PLAN.md]]. (Prose generation currently targets
DeepSeek — strong at long-form prose — with the API key supplied via env/secret, never
committed. Provider is swappable behind one seam.)

---

## Anti-AI-tells (banned; enforced in the writing skill)

> **Full catalog: [[ANTI-AI.md]]** — the exhaustive blocklist (lexicon, constructions,
> structural / punctuation / voice tells), the antidotes, and the self-check protocol. The
> summary below is the short version; ANTI-AI.md is the reference the skill enforces.

The writing must not carry the lexical or semantic fingerprints of machine prose.

**Banned phrases and constructions:**
- "It's not just X, it's Y." / "isn't merely a … it's a …"
- "In a world where …", "In today's fast-paced …", "Now more than ever."
- "Let's dive in", "Let's unpack", "Buckle up."
- "delve", "tapestry", "testament to", "navigate the landscape", "underscore",
  "boasts", "robust", "leverage", "harness the power", "unlock", "elevate", "seamless",
  "game-changer", "at the end of the day", "the bottom line is."
- Chipper signpost adverbs as crutches: "Moreover", "Furthermore", "Notably", "Crucially",
  "Importantly" — use sparingly and only when literally true.
- "In conclusion" / "In summary" summaries that restate what was just said.
- The symmetric hedge: "While it's true that X, it's important to remember Y" used to dodge a
  real verdict.

**Banned patterns (semantic tells):**
- Rule-of-three everywhere; perfectly parallel lists; three-adjective stacks.
- Uniform paragraph length and uniform sentence length (metronomic prose).
- Hollow even-handedness — balance with no specific detail and no real judgment.
- Over-signposting ("First… Second… Finally…" when the prose should just flow).
- Restating the prompt/headline back at the reader.
- Emotional throat-clearing ("It's a fascinating and complex topic…").
- Concluding every section with a tidy, falsely resolved bow.

**The test:** read it aloud. If it sounds like a confident person who has actually thought
about this telling you what they found — and occasionally surprising you — it passes. If it
sounds like a press release or a competent intern hedging, rewrite it.

---

## What the writing skill must do (spec)

When built, the skill takes a question + the article's structured data (charts, signals,
sources) and produces Bifocal prose that:
1. follows the article anatomy and the ten rules above;
2. generates definition boxes and Wikipedia links inline;
3. writes the closing *"Still lost? Read this."* box;
4. self-checks against the anti-AI-tells list and rewrites any hit;
5. never invents a number — every quantitative claim traces to a cited series;
6. flags its own uncertainty in the prose rather than smoothing it over.

See [[PLAN.md]] for where the skill and CLAUDE.md / AGENTS.md live in the build sequence.
