/* Deterministic prose checks — the objective half of the quality bar (ANTI-AI.md §7). Pure, no
   LLM, no deps. Used by the linter CLI (`pnpm prose:lint`) and by the generator's revise loop, so
   the same rules that grade the prose also drive its repair. Thresholds are tuned for the Bifocal
   voice: accessible for a layperson, never academic, never metronomic. */

// ── Banned lexicon (ANTI-AI.md §1) — high-signal machine-prose words ──────────────────────────
export const BANNED_WORDS: string[] = [
  'delve', 'utilize', 'facilitate', 'leverage', 'harness', 'foster', 'showcase', 'underscore',
  'unlock', 'unleash', 'empower', 'spearhead', 'boasts', 'boast',
  'vibrant', 'bustling', 'nestled', 'robust', 'seamless', 'cutting-edge', 'state-of-the-art',
  'world-class', 'game-changing', 'transformative', 'pivotal', 'crucial', 'paramount',
  'multifaceted', 'holistic', 'myriad', 'plethora', 'ever-evolving', 'fast-paced', 'realm',
  'tapestry', 'landscape', 'beacon', 'cornerstone', 'bedrock', 'treasure trove', 'ecosystem',
  'synergy', 'paradigm', 'testament', 'double-edged sword',
  'needless to say', 'that being said', 'when it comes to', 'at the end of the day',
  'moreover', 'furthermore', 'consequently', 'as such', 'notably', 'crucially',
  'in conclusion', 'in summary', 'to sum up', 'all in all',
  'buckle up', 'picture this', 'imagine a world', "here's the thing", "here's the kicker",
  'now more than ever', 'in a world where', "it's important to note", "it's worth noting",
];

// Banned constructions (ANTI-AI.md §2) — templated syntax
export const BANNED_CONSTRUCTS: { re: RegExp; name: string }[] = [
  { re: /\bit'?s not (just|merely) [^,.]+,?\s*it'?s\b/i, name: '"it\'s not just X, it\'s Y"' },
  { re: /\bnot only [^,.]+ but also\b/i, name: '"not only … but also"' },
  { re: /\bstands as a testament\b/i, name: '"stands as a testament"' },
  { re: /\bplays? a (pivotal|crucial|key|vital|central) role\b/i, name: '"plays a pivotal role"' },
  { re: /\bat its core\b/i, name: '"at its core"' },
  { re: /\bso what does this mean\b/i, name: 'rhetorical-question-then-answer' },
  { re: /\bhere'?s where it gets interesting\b/i, name: '"here\'s where it gets interesting"' },
  { re: /\bthis is more than [^.]+\. this is\b/i, name: '"this is more than X. This is Y"' },
];

const STOP = new Set(['the', 'a', 'an', 'of', 'to', 'in', 'is', 'are', 'has', 'have', 'and', 'for',
  'on', 'at', 'by', 'it', 'its', 'that', 'this', 'as', 'was', 'were', 'been', 'be', 'with', 'than',
  'from', 'now', 'today', 'their', 'they', 'we', 'our', 'you', 'your']);

const words = (s: string) => (s.toLowerCase().match(/[a-z0-9']+/g) ?? []);
const contentWords = (s: string) => words(s).filter((w) => !STOP.has(w));
export const sentences = (s: string) =>
  s.replace(/<[^>]+>/g, '').split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean);

/** How much the explainer's opening just repeats the claim headline (0–1). >0.5 ≈ restatement. */
export function claimRestatement(explainer: string, claim: string): number {
  const first = sentences(explainer)[0] ?? explainer;
  const fw = new Set(contentWords(first));
  const cw = contentWords(claim);
  if (!cw.length || !fw.size) return 0;
  const shared = cw.filter((w) => fw.has(w)).length;
  return shared / cw.length;
}

/** Em-dashes per 100 words (the LLM-aside tic). */
export function emDashRate(text: string): number {
  const n = (text.match(/—/g) ?? []).length;
  return (n / Math.max(words(text).length, 1)) * 100;
}

/** Sentence-length spread. Low stdev (<4 words) = metronomic prose (ANTI-AI.md §7.4). */
export function sentenceStats(text: string): { mean: number; stdev: number; count: number } {
  const lens = sentences(text).map((s) => words(s).length);
  if (lens.length < 2) return { mean: lens[0] ?? 0, stdev: 99, count: lens.length };
  const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
  const stdev = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length);
  return { mean, stdev, count: lens.length };
}

const syllables = (w: string) => {
  w = w.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  return Math.max((w.match(/[aeiouy]{1,2}/g) ?? []).length, 1);
};

/** Flesch–Kincaid grade level. Target ≤ 11 (a layperson on a bus, not a seminar). */
export function readingGrade(text: string): number {
  const ws = words(text), ss = sentences(text);
  if (!ws.length || !ss.length) return 0;
  const syl = ws.reduce((a, w) => a + syllables(w), 0);
  return Math.round((0.39 * (ws.length / ss.length) + 11.8 * (syl / ws.length) - 15.59) * 10) / 10;
}

export function bannedHits(text: string): string[] {
  const hits: string[] = [];
  const low = ` ${text.toLowerCase()} `;
  for (const w of BANNED_WORDS) {
    const re = new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z]|$)`, 'i');
    if (re.test(low)) hits.push(w);
  }
  for (const c of BANNED_CONSTRUCTS) if (c.re.test(text)) hits.push(c.name);
  return hits;
}

/** Count "X, Y, and Z" tricolons (ANTI-AI.md §3 rule of three). */
export function tricolons(text: string): number {
  return (text.match(/\b[\w-]+,\s[\w-]+,\sand\s[\w-]+\b/g) ?? []).length;
}

export interface FieldReport {
  restatement: number; emDash: number; stdev: number; grade: number;
  banned: string[]; tricolon: number; fails: string[]; warns: string[];
}

/** Grade one explainer against its claim. Returns metrics + fail/warn lists. */
export function lintExplainer(explainer: string, claim: string): FieldReport {
  const restatement = claimRestatement(explainer, claim);
  const emDash = emDashRate(explainer);
  const { stdev } = sentenceStats(explainer);
  const grade = readingGrade(explainer);
  const banned = bannedHits(explainer);
  const tri = tricolons(explainer);
  const fails: string[] = [], warns: string[] = [];
  if (restatement > 0.5) fails.push(`restates the claim (${Math.round(restatement * 100)}% word overlap in sentence 1)`);
  if (banned.length) fails.push(`banned tell(s): ${banned.join(', ')}`);
  if (emDash > 1.5) warns.push(`em-dash tic (${emDash.toFixed(1)}/100 words)`);
  if (stdev < 4) warns.push(`metronomic rhythm (sentence stdev ${stdev.toFixed(1)})`);
  if (grade > 11) warns.push(`reading grade ${grade} (aim ≤ 11 — too academic)`);
  if (tri > 1) warns.push(`${tri} tricolons (rule-of-three)`);
  return { restatement, emDash, stdev, grade, banned, tricolon: tri, fails, warns };
}
