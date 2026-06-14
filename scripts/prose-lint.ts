import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { lintExplainer, emDashRate, readingGrade, bannedHits, sentences } from './lib/prose-lint-lib.ts';

/* `pnpm prose:lint` — the objective quality gate (ANTI-AI.md §7), no LLM. Grades every explainer
   against its claim, flags machine-prose tells, and reports cross-movement repetition (the same
   opener twenty times). Sweeps EVERY question article (not just one), and on the keystone hub it also
   gates the chart `note:` prose — the world/region/country lens captions that live outside the
   movements block. Exits non-zero on any FAIL so it can guard the build. */

const ROOT = process.cwd();
const QDIR = 'src/content/questions';
const arg = process.argv[2];
const files = arg ? [arg] : readdirSync(join(ROOT, QDIR)).filter((f) => f.endsWith('.md')).map((f) => join(QDIR, f));
const field = (c: string, re: RegExp) => (c.match(re)?.[1] ?? '').trim();

let fails = 0, warns = 0, totalChunks = 0, totalNotes = 0;
const grades: number[] = [];

for (const rel of files) {
  const text = readFileSync(join(ROOT, rel), 'utf8');
  const name = rel.split('/').pop();

  // ── movements: grade each explainer against its claim, flag tells, catch templated openers ──
  if (text.includes('\nmovements:')) {
    const movBlock = text.slice(text.indexOf('\nmovements:'), text.indexOf('\npullQuote:') > -1 ? text.indexOf('\npullQuote:') : undefined);
    const starts = [...movBlock.matchAll(/^  - eyebrow:/gm)].map((m) => m.index!);
    const chunks = starts.map((s, i) => movBlock.slice(s, starts[i + 1] ?? movBlock.length));
    totalChunks += chunks.length;
    const openers = new Map<string, string[]>();
    for (const c of chunks) {
      const fig = field(c, /\n    fig: "([^"]*)"/);
      const claim = field(c, /\n    claim: "([^"]*)"/);
      const exp = field(c, /\n    explainer: "([^"]*)"/);
      if (!exp) continue;
      const r = lintExplainer(exp, claim);
      grades.push(r.grade);
      const opener = sentences(exp)[0]?.toLowerCase().split(/\s+/).slice(0, 4).join(' ') ?? '';
      if (!openers.has(opener)) openers.set(opener, []);
      openers.get(opener)!.push(fig);
      if (r.fails.length || r.warns.length) {
        console.log(`${r.fails.length ? '✗' : '⚠'} ${name} · ${fig}  ${claim.slice(0, 42)}`);
        for (const f of r.fails) { console.log(`    FAIL  ${f}`); fails++; }
        for (const w of r.warns) { console.log(`    warn  ${w}`); warns++; }
      }
    }
    for (const [op, figs] of openers) {
      if (figs.length > 1 && op) { console.log(`✗ ${name}: repeated opener "${op}…" in ${figs.join(', ')}`); fails += figs.length; }
    }
  }

  // ── scalar prose blocks — banned tells + em-dash tic (no claim to restate against) ──
  const others: [string, string][] = [];
  for (const k of ['readout', 'synthesis', 'vantageNote']) others.push([k, field(text, new RegExp(`\\n  ${k}: "([^"]*)"`))]);
  for (const k of ['hopeCase', 'despairCase', 'whatWouldChangeIt']) others.push([k, field(text, new RegExp(`\\n${k}: "([^"]*)"`))]);
  for (const [n, val] of others) {
    if (!val) continue;
    const b = bannedHits(val);
    if (b.length) { console.log(`✗ ${name} · ${n}: banned tell(s): ${b.join(', ')}`); fails += b.length; }
    if (emDashRate(val) > 1.5) { console.log(`⚠ ${name} · ${n}: em-dash tic`); warns++; }
  }

  // ── keystone chart notes (carrying/counter/secondary/regional/country/trend captions) — the prose
  //    under every figure, which never passed through the movements gate above. Banned tells fail the
  //    build; an em-dash tic or an over-academic note warns. ──
  const notes = [...text.matchAll(/\bnote: "((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
  totalNotes += notes.length;
  // Em-dash is deliberate in the Bifocal voice (it trips nearly every note), so the note gate is
  // banned tells (hard fail) + an over-academic reading-grade warn — the signals that actually matter.
  for (const n of notes) {
    const b = bannedHits(n);
    if (b.length) { console.log(`✗ ${name} · chart note: banned tell(s): ${b.join(', ')} — "${n.slice(0, 38)}…"`); fails += b.length; }
    const g = readingGrade(n);
    if (g > 13) { console.log(`⚠ ${name} · chart note grade ${g.toFixed(1)} (aim ≤ 13) — "${n.slice(0, 38)}…"`); warns++; }
  }
}

const avgGrade = grades.length ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) : 'n/a';
console.log(`\n${files.length} article(s) · ${totalChunks} movements · ${totalNotes} chart notes · avg grade ${avgGrade} · ${fails} fails · ${warns} warnings`);
if (fails) { console.error('✗ prose-lint FAILED'); process.exit(1); }
console.log('✓ prose-lint passed');
