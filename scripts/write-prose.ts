import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { generate, providerInfo } from './lib/llm.ts';
import { lintExplainer } from './lib/prose-lint-lib.ts';
import { exemplarsBlock } from './lib/prose-exemplars.ts';

/* `pnpm prose` — (re)generate the article's prose with DeepSeek, in the Bifocal house voice.
   WRITING.md + ANTI-AI.md are handed to the model verbatim as the system prompt. Every number the
   model is allowed to use is fed to it as FACTS (drawn from the real derived series); illustrative
   charts are flagged so it stays qualitative and invents nothing. Offline authoring only — the
   output is committed prose, never produced at build or request time. A .bak is written first. */

const ROOT = process.cwd();
const ARTICLE = process.env.ARTICLE ?? 'src/content/questions/is-humanity-becoming-less-violent.md';
const rd = (p: string) => readFileSync(join(ROOT, p), 'utf8');

const info = providerInfo();
if (!info.keySet) { console.error('✗ DEEPSEEK_API_KEY not set — see .env'); process.exit(1); }
console.log(`provider · ${info.provider} · ${info.model}\n`);

const WRITING = rd('WRITING.md');
const ANTIAI = rd('ANTI-AI.md');
const SYSTEM = `You write for hopeanddespair.world. Follow these two specifications exactly.

=== WRITING.md (the house voice) ===
${WRITING}

=== ANTI-AI.md (banned tells — never produce these) ===
${ANTIAI}

AUDIENCE: an ordinary, curious person — a smart friend on a bus, not a scholar in a seminar. Scholars
are already well served; this is for everybody else. Never dumb it down, never condescend, never water
the idea down. Your job is to make a complicated thing beautiful and genuinely clear.

THE EXPLAINER RECIPE — follow it every time:
- Do NOT begin by restating the claim. The claim is already printed as the headline directly above your
  text; repeating it throws away the reader's first sentence. Open somewhere fresh — a concrete scene, a
  named place or year, or a single number turned into something a body can feel.
- Turn at least one number into lived scale ("in a town of 40,000, that is ten people a year"). A
  translation may use ONLY the numbers you were given and simple arithmetic on them (a rate times a
  stated population, a ratio of two given figures). Do NOT reach for an outside quantity you were not
  given — no car-crash odds, no other cause-of-death totals, no distance or "stack them to the moon"
  analogies — unless that exact number is in the FACTS.
- Bifocal: state the finding plainly, then complicate it in the next breath (the hopeful read, the grim
  read, or the catch).
- Vary the rhythm on purpose. Include at least one very short sentence (six words or fewer) and one
  longer one. If it ticks like a metronome, break it.
- Em-dashes: at most ONE in the whole explainer. Prefer commas, full stops, and semicolons.
- End on the strongest concrete thing — an image, a number, an honest tension — not a summary.
- You may ONLY use numbers that literally appear in the FACTS, CLAIM, or CAPTIONS given to you. Never
  invent a figure or recall one from memory. A ratio or percentage is allowed only if BOTH numbers it
  derives from are given. If a number is not in front of you, write around it qualitatively. If FACTS
  says the chart is ILLUSTRATIVE, state no specific statistic as measured fact.
- Plain words (use, not utilize; help, not facilitate). No rule-of-three lists, no tidy bows, no
  signpost adverbs (Moreover, Notably), no throat-clearing, none of the banned tells in ANTI-AI.md.
- Light inline HTML allowed: <em> and <b> only. Never use double-quote characters (use single quotes
  or curly quotes). Never use newlines inside a field.

Two examples at the bar we want — study how each opens on a hook (never the claim), makes a number
felt, varies its rhythm, takes a view, and barely uses em-dashes:

${exemplarsBlock()}`;

let text = rd(ARTICLE);
const origText = text;
const QUESTION = (text.match(/\nquestion: "([^"]*)"/)?.[1] ?? '').trim();

// --- helpers -------------------------------------------------------------------------------------
const sanitize = (s: string) =>
  s.replace(/\s+/g, ' ').replace(/"/g, '’').replace(/\\/g, '').trim();

// Replace via a function so `$` in generated prose (e.g. "$2.77 trillion") is never treated as a
// capture-group reference. Using a replacement STRING here would corrupt the file.
const sub = (s: string, re: RegExp, val: string) => s.replace(re, (_m, a, b) => a + val + b);

const round = (v: number) =>
  Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('en-US') : (Math.round(v * 100) / 100).toString();

function facts(dataRef?: string, x0?: number, x1?: number): string {
  if (!dataRef) return '';
  const p = `src/data/derived/${dataRef}.json`;
  if (!existsSync(join(ROOT, p))) return '';
  const d = JSON.parse(rd(p));
  let pts = d.points as { t: number; value: number }[];
  // Honour the chart's visible window so a recent-zoom describes its own span, not the full series.
  if (x0 != null || x1 != null) pts = pts.filter((q) => (x0 == null || q.t >= x0) && (x1 == null || q.t <= x1));
  const f = pts[0], l = pts[pts.length - 1];
  const mx = pts.reduce((a, b) => (b.value > a.value ? b : a));
  const mn = pts.reduce((a, b) => (b.value < a.value ? b : a));
  return `REAL DATA (${d.unit}): ${f.t}=${round(f.value)}; latest ${l.t}=${round(l.value)}; peak ${mx.t}=${round(mx.value)}; low ${mn.t}=${round(mn.value)}. You may cite these.`;
}

// Multi-line (dataRefs) charts: first→latest for each named line, so a regional/dispersion chart's
// prose can cite each series instead of going qualitative.
function factsMulti(dataRefs: string[], names: string[], x0?: number, x1?: number): string {
  const parts = dataRefs.map((ref, i) => {
    const p = `src/data/derived/${ref}.json`;
    if (!existsSync(join(ROOT, p))) return '';
    let pts = (JSON.parse(rd(p)).points as { t: number; value: number }[]);
    if (x0 != null || x1 != null) pts = pts.filter((q) => (x0 == null || q.t >= x0) && (x1 == null || q.t <= x1));
    if (!pts.length) return '';
    const f = pts[0], l = pts[pts.length - 1];
    return `${names[i] ?? ref}: ${f.t}=${round(f.value)} → ${l.t}=${round(l.value)}`;
  }).filter(Boolean);
  return parts.length ? `REAL DATA (per line): ${parts.join('; ')}. You may cite these and only these.` : '';
}

// The scatter is not a {t,value} series — feed its fitted slopes (real, derived) as the facts.
function scatterFacts(): string {
  const p = 'src/data/derived/convergence-scatter.json';
  if (!existsSync(join(ROOT, p))) return '';
  const d = JSON.parse(rd(p));
  const w = d.fits.weighted.slope, u = d.fits.unweighted.slope;
  return `REAL DATA: ${d.n} countries, ${d.period[0]}–${d.period[1]}. The growth-on-initial-income slope is ${round(w)} weighted by population and ${round(u)} unweighted; both negative means poorer economies grew faster, and the population-weighted line is about three times steeper. You may cite these and only these.`;
}

async function genJSON(prompt: string, keys: string[], maxTokens = 700): Promise<Record<string, string>> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const raw = await generate(prompt, { system: SYSTEM, temperature: 0.6, maxTokens, json: true });
      const obj = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));
      if (keys.every((k) => typeof obj[k] === 'string' && obj[k].trim())) {
        return Object.fromEntries(keys.map((k) => [k, sanitize(obj[k])]));
      }
    } catch (e) {
      if (attempt === 3) throw e;
    }
  }
  throw new Error('genJSON: model did not return the required keys after retries');
}

const field = (chunk: string, re: RegExp) => (chunk.match(re)?.[1] ?? '').trim();

/* Self-correction: if a draft explainer trips the deterministic linter (restates the claim, an em-dash
   tic, a banned tell), hand the problems back to the model and rewrite. The same rules that grade the
   prose drive its repair — that's what makes the quality repeatable rather than luck of one draft. */
async function reviseExplainer(draft: string, claim: string, ctx: string, f: string, problems: string[]): Promise<string> {
  let cur = draft;
  for (let pass = 1; pass <= 2; pass++) {
    const out = await generate(
      `Revise this explainer so it fixes the listed problems, in the same voice, at the bar of the two
examples above. Keep every number exactly as written and add no new numbers.

PROBLEMS TO FIX: ${problems.join('; ')}
CLAIM (the headline above it — do NOT restate it; open on a concrete hook instead): ${claim}
CONTEXT: ${ctx}
FACTS: ${f || '(no numeric facts — stay qualitative)'}
CURRENT DRAFT: ${cur}

Return ONLY the revised explainer: one paragraph, 3 to 5 sentences, no quotes, no preamble.`,
      { system: SYSTEM, temperature: 0.5, maxTokens: 500 });
    cur = sanitize(out);
    const r = lintExplainer(cur, claim);
    problems = [...r.fails, ...r.warns];
    if (!r.fails.length && r.emDash <= 1.5) break;
  }
  return cur;
}

// --- movements -----------------------------------------------------------------------------------
const movStart = text.indexOf('\nmovements:');
const movEnd = text.indexOf('\npullQuote:');
const movBlock = text.slice(movStart, movEnd);
const starts = [...movBlock.matchAll(/^  - eyebrow:/gm)].map((m) => m.index!);
const chunks = starts.map((s, i) => movBlock.slice(s, starts[i + 1] ?? movBlock.length));
console.log(`${chunks.length} movements to write\n`);

for (let i = 0; i < chunks.length; i++) {
  const c = chunks[i];
  const fig = field(c, /\n    fig: "([^"]*)"/);
  const eyebrow = field(c, /\n  - eyebrow: "([^"]*)"/);
  const question = field(c, /\n    question: "([^"]*)"/);
  const claim = field(c, /\n    claim: "([^"]*)"/);
  const capL = field(c, /\n    captionLeft: "([^"]*)"/);
  const capR = field(c, /\n    captionRight: "([^"]*)"/);
  const source = field(c, /\n    source: "([^"]*)"/);
  const dataRef = field(c, /\n      dataRef: "([^"]*)"/);
  const dataRefsM = c.match(/\n      dataRefs: \[([^\]]*)\]/);
  const dataRefs = dataRefsM ? dataRefsM[1].split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')) : [];
  const seriesNames = [...c.matchAll(/\n        - \{ name: "([^"]*)"/g)].map((m) => m[1]);
  const x0m = c.match(/\n      x0: (-?\d+)/); const x1m = c.match(/\n      x1: (-?\d+)/);
  const x0 = x0m ? Number(x0m[1]) : undefined; const x1 = x1m ? Number(x1m[1]) : undefined;
  const illustrative = /illustrative/i.test(source);
  const f = dataRef === 'convergence-scatter' ? scatterFacts()
    : dataRef ? facts(dataRef, x0, x1)
    : dataRefs.length ? factsMulti(dataRefs, seriesNames, x0, x1)
    : (illustrative ? 'ILLUSTRATIVE chart — placeholder data; do NOT state specific numbers as fact.' : '');

  const prompt = `Write the prose for one movement (a chart + its explainer) of the article "${QUESTION}".

ACT / EYEBROW: ${eyebrow}
SUB-QUESTION (the chart answers this): ${question || '(none)'}
CLAIM HEADLINE (already set; your prose backs it up, do not restate it verbatim): ${claim}
CHART CAPTIONS: ${capL} | ${capR}
FACTS: ${f || '(no numeric facts — stay qualitative)'}

Return a JSON object with exactly these keys:
- "explainer": 3 to 5 sentences of Bifocal prose, following THE EXPLAINER RECIPE. Open on a concrete
  hook (NOT the claim restated), make one number felt, vary the rhythm, end on something concrete.
- "hope": one short sentence, the most honest hopeful read of this chart. Plain and specific.
- "despair": one short sentence, the most honest grim read.
- "confusion": one short sentence, what is genuinely uncertain here. Do not start it with "We don't
  know" or "It's unclear" — say the specific doubt directly.`;

  const out = await genJSON(prompt, ['explainer', 'hope', 'despair', 'confusion']);
  // Lint gate: auto-revise any explainer that restates the claim, tics on em-dashes, or hits a tell.
  const lr = lintExplainer(out.explainer, claim);
  let revised = '';
  if (lr.fails.length || lr.emDash > 1.8) {
    out.explainer = await reviseExplainer(out.explainer, claim,
      `${eyebrow} | ${question} | ${capL} ${capR}`, f, [...lr.fails, ...lr.warns]);
    const after = lintExplainer(out.explainer, claim);
    revised = after.fails.length ? ` ↻ revised (still: ${after.fails.join(', ')})` : ' ↻ revised';
  }
  let nc = c;
  nc = sub(nc, /(\n    explainer: ")[^"]*(")/, out.explainer);
  nc = sub(nc, /(\n      hope: ")[^"]*(")/, out.hope);
  nc = sub(nc, /(\n      despair: ")[^"]*(")/, out.despair);
  nc = sub(nc, /(\n      confusion: ")[^"]*(")/, out.confusion);
  text = text.replace(c, () => nc);
  console.log(`  ✓ ${fig}  ${claim.slice(0, 46)}${revised}`);
}

// --- evidence readout/synthesis/vantage + the two cases (only if the article has an evidence panel) --
if (text.includes('\n  readout:')) {
const heroFacts = [facts('homicide-western-europe'), facts('battle-deaths-world'), facts('nuclear-warheads-world')]
  .filter(Boolean).join('  ');

const scalars = await genJSON(
  `The article's Evidence panel reads one metric (violent deaths per 100k) at four magnifications — deep
history, since 1900, since 2020, a lived day — and the verdict flips from "yes, less violent" (far) to
"no" (near). It also shows five signal charts. Supporting real series: ${heroFacts}

Write Bifocal prose. Use almost no em-dashes (commas and full stops instead). Return JSON with these keys:
- "readout": 2 sentences on how the same evidence gives opposite verdicts at different zoom levels.
  Use a number only if it is in the FACTS above.
- "synthesis": 1 sentence on what the recent signals converging upward together means. No figures.
  Only name metrics that actually rise in our data (battle deaths, active conflicts, displacement,
  military spending). Do NOT say nuclear warheads are rising — they fell.
- "vantageNote": 1 sentence on how a global average hides the worst-hit places (name a real place like
  Khartoum or Gaza). Do NOT cite a specific global homicide rate — we have no such figure, and 0.7 is
  Western Europe, not the world. Speak qualitatively.
- "hopeCase": the single strongest steelmanned HOPE case, 2 to 3 sentences.
- "despairCase": the single strongest steelmanned DESPAIR case, 2 to 3 sentences.
- "whatWouldChangeIt": 2 sentences on what evidence would actually flip the verdict (falsifiability).`,
  ['readout', 'synthesis', 'vantageNote', 'hopeCase', 'despairCase', 'whatWouldChangeIt'], 900);

const subScalar = (key: string, indent: string) => {
  const re = new RegExp(`(\\n${indent}${key}: ")[^"]*(")`);
  if (re.test(text)) { text = sub(text, re, scalars[key]); console.log(`  ✓ ${key}`); }
};
subScalar('readout', '  '); subScalar('synthesis', '  '); subScalar('vantageNote', '  ');
subScalar('hopeCase', ''); subScalar('despairCase', ''); subScalar('whatWouldChangeIt', '');
}

// --- the closing "Still lost? Read this." box (body markdown) ------------------------------------
const claimsList = [...text.matchAll(/\n    claim: "([^"]*)"/g)].map((m) => m[1]).join(' / ');
const boxRaw = await generate(
  `Write the closing "Still lost? Read this." box for the article "${QUESTION}".
This is the one openly warm, plain-spoken moment: 3 short paragraphs that re-explain the whole thing to
someone who understood nothing above and uses zero jargon. The article's through-line, in its own chart
claims: ${claimsList}. End on one true, repeatable takeaway someone could say at dinner. Do NOT write the
words "Still lost" or any title or heading; begin directly with your first paragraph. Use almost no
em-dashes. Plain markdown paragraphs separated by a blank line, nothing else.`,
  { system: SYSTEM, temperature: 0.6, maxTokens: 700 });
const box = boxRaw.replace(/\r/g, '').replace(/"/g, '”')
  .replace(/^\s*#*\s*still lost\??[^\n]*\n+/i, '').trim();  // strip any echoed title
text = sub(text, /(### Still lost\? Read this\.\n\n)[\s\S]*?(\n\n> \*This is a one-person project)/, box);
console.log('  ✓ closing box');

// --- write (with backup) -------------------------------------------------------------------------
if (text === origText) { console.error('\n✗ nothing changed — aborting'); process.exit(1); }
writeFileSync(join(ROOT, ARTICLE + '.bak'), origText);
writeFileSync(join(ROOT, ARTICLE), text);
console.log(`\n✓ prose written. Backup at ${ARTICLE}.bak — run \`pnpm build\` to validate, then delete the .bak.`);
