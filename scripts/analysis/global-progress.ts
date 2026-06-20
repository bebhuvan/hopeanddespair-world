import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/* "Is human progress slowing down?" — the counterfactual derivation (docs/ARTICLE-progress-plan.md).

   We borrow the *idea* of the World Bank's Atlas of Global Development 2026 ("development is advancing
   at its slowest pace in generations") but NOT its method. The Atlas uses a stage-conditional,
   country-level relative-speed model — un-auditable for a one-person atlas. Instead we take a simpler,
   fully transparent, world-aggregate trend comparison we own end to end, and disclose the difference:

     • PACE  = least-squares slope of a world series over a window, in native units per year, signed so
               that POSITIVE always means "improving" (for "lower-is-better" series we flip the sign).
     • We compare the pace of the pre-slowdown decade [2000–2013] against the slowdown decade
       [2013–2024] — i.e. "did the last decade keep the previous decade's pace?".
     • COUNTERFACTUAL: continue the 2000–2013 pace past 2013. The gap between that line and the actual
       latest value is "the cost of the slowdown". For extreme poverty we multiply the rate gap by world
       population to state it in people — our own number, not the Atlas's.

   Everything reads series already on disk (src/data/derived/*.json) plus the two Data360 pulls
   (women-parliament-world, population-world). No invented numbers: the audit block prints every figure
   the article is allowed to cite. */

const ROOT = process.cwd();
const D = join(ROOT, 'src/data/derived');
const read = (id: string) => JSON.parse(readFileSync(join(D, `${id}.json`), 'utf8'));
type Pt = { t: number; value: number };

/** Linear interpolation/clamp to read a series at an exact year. */
function valueAt(points: Pt[], year: number): number {
  const p = [...points].sort((a, b) => a.t - b.t);
  if (year <= p[0].t) return p[0].value;
  if (year >= p[p.length - 1].t) return p[p.length - 1].value;
  for (let i = 1; i < p.length; i++) {
    if (p[i].t >= year) {
      const a = p[i - 1], b = p[i];
      return a.value + (b.value - a.value) * ((year - a.t) / (b.t - a.t));
    }
  }
  return p[p.length - 1].value;
}

/** Least-squares slope (units/year) over the inclusive window [a, b]. */
function slope(points: Pt[], a: number, b: number): number {
  const w = points.filter((p) => p.t >= a && p.t <= b);
  const n = w.length;
  if (n < 2) return NaN;
  const mx = w.reduce((s, p) => s + p.t, 0) / n;
  const my = w.reduce((s, p) => s + p.value, 0) / n;
  let num = 0, den = 0;
  for (const p of w) { num += (p.t - mx) * (p.value - my); den += (p.t - mx) ** 2; }
  return num / den;
}

const HIST: [number, number] = [2000, 2013]; // the pre-slowdown decade
const SPLIT = 2013;
const r2 = (x: number) => Math.round(x * 100) / 100;

interface Spec { id: string; label: string; file: string; lowerBetter: boolean; unit: string; }
// Rate-like, bounded indicators only — GDP/GNI per capita are exponential, so a ratio of linear
// slopes would mislead; they carry the "engine" movement as levels instead, not the pace bars.
const SPECS: Spec[] = [
  { id: 'life_exp', label: 'Life expectancy', file: 'life-expectancy-world', lowerBetter: false, unit: 'years' },
  { id: 'poverty', label: 'Extreme poverty', file: 'poverty-rate-300-world', lowerBetter: true, unit: '% at $3.00/day' },
  { id: 'child_mort', label: 'Child mortality', file: 'child-mortality-world', lowerBetter: true, unit: 'deaths / 100 births' },
  { id: 'maternal', label: 'Maternal mortality', file: 'maternal-mortality-world', lowerBetter: true, unit: 'per 100k births' },
  { id: 'stunting', label: 'Child stunting', file: 'stunting-world', lowerBetter: true, unit: '% of under-5s' },
  { id: 'undernourish', label: 'Undernourishment', file: 'undernourishment-world', lowerBetter: true, unit: '%' },
  { id: 'literacy', label: 'Adult literacy', file: 'literacy-rate-world', lowerBetter: false, unit: '%' },
  { id: 'tertiary', label: 'Tertiary enrolment', file: 'tertiary-world', lowerBetter: false, unit: '% gross' },
  { id: 'immunization', label: 'Measles vaccination', file: 'immunization-world', lowerBetter: false, unit: '%' },
  { id: 'sanitation', label: 'Safe sanitation', file: 'safe-sanitation-world', lowerBetter: false, unit: '%' },
  { id: 'electricity', label: 'Electricity access', file: 'electricity-access-world', lowerBetter: false, unit: '% of pop' },
  { id: 'internet', label: 'Internet use', file: 'internet-users-world', lowerBetter: false, unit: '%' },
  { id: 'mobile', label: 'Mobile subscriptions', file: 'mobile-subscriptions-world', lowerBetter: false, unit: 'per 100' },
  { id: 'women_parl', label: 'Women in parliament', file: 'women-parliament-world', lowerBetter: false, unit: '% of seats' },
];

console.log(`\n=== PACE AUDIT  (improving = positive; hist ${HIST[0]}–${HIST[1]} vs recent ${SPLIT}–latest) ===`);
const rows = SPECS.map((s) => {
  const pts: Pt[] = read(s.file).points;
  const latest = Math.min(2024, Math.max(...pts.map((p) => p.t)));
  const sign = s.lowerBetter ? -1 : 1;
  const histStart = Math.max(HIST[0], Math.min(...pts.map((p) => p.t)));
  const histPace = sign * slope(pts, histStart, HIST[1]);
  const recentPace = sign * slope(pts, SPLIT, latest);
  const ratio = histPace !== 0 ? recentPace / histPace : NaN;
  const cfLatest = valueAt(pts, SPLIT) + slope(pts, histStart, HIST[1]) * (latest - SPLIT); // continue raw slope
  const actualLatest = valueAt(pts, latest);
  // "cost of the slowdown" in the improving direction (positive = we fell short of the historical pace)
  const shortfall = sign * (cfLatest - actualLatest) * -1; // >0 means worse than counterfactual
  console.log(
    `${s.label.padEnd(22)} hist=${r2(histPace).toString().padStart(7)}/yr  recent=${r2(recentPace).toString().padStart(7)}/yr  ` +
    `recent/hist=${(ratio * 100).toFixed(0).padStart(4)}%   actual ${latest}=${r2(actualLatest)}  cf=${r2(cfLatest)}  gap=${r2(Math.abs(cfLatest - actualLatest))} ${s.unit}`,
  );
  return { ...s, pts, latest, histStart, histPace, recentPace, ratio, cfLatest, actualLatest };
});

// ── Poverty: the HONEST headcount, not a counterfactual ─────────────────────────────────────
// A naive linear continuation of the 2000–2013 decline runs the rate below ZERO (poverty is floored
// at 0), which would manufacture a fake billion-person "cost". We refuse that. The defensible facts:
// (1) the *pace* of decline collapsed (see pace-ratio), and (2) the *actual* headcount today.
const pov = rows.find((r) => r.id === 'poverty')!;
const popPts: Pt[] = read('population-world').points;
const popLatest = valueAt(popPts, pov.latest);
const headcount = (pov.actualLatest / 100) * popLatest;        // people below $3.00/day, actual
console.log(`\n=== POVERTY HEADLINE (actual, not counterfactual) ===`);
console.log(`  ${pov.latest}: ${r2(pov.actualLatest)}% of ${(popLatest / 1e9).toFixed(2)} bn = ${(headcount / 1e6).toFixed(0)} million people in extreme poverty`);
console.log(`  pace of decline fell to ${(pov.ratio * 100).toFixed(0)}% of its 2000–2013 rate (NOT extrapolated to a people-count — see note in script)`);

// ── The divergence: extreme poverty TODAY, by region (the frontier left behind) ─────────────
const REGIONS: [string, string][] = [
  ['ssf', 'Sub-Saharan Africa'], ['sas', 'South Asia'], ['eas', 'East Asia & Pacific'], ['lcn', 'Latin America'],
];
console.log(`\n=== POVERTY BY REGION (latest, % under $3.00/day) ===`);
const regionBars = REGIONS.map(([code, name]) => {
  const pts: Pt[] = read(`poverty-300-${code}`).points;
  const latest = Math.min(2024, Math.max(...pts.map((p) => p.t))); // cap at 2024 — 2025/26 are projections
  const v = valueAt(pts, latest);
  const first = pts[0];
  console.log(`  ${name.padEnd(22)} ${first.t}=${r2(first.value)}% → ${latest}=${r2(v)}%`);
  return { label: name, value: r2(v), color: v > 25 ? 'despair' : v > 8 ? 'ochre' : 'hope' };
}).sort((a, b) => b.value - a.value);

// ── Artifacts ──────────────────────────────────────────────────────────────────────────────
mkdirSync(D, { recursive: true });
const VINTAGE = read('poverty-rate-300-world').provenance?.vintage ?? '2026-06-17';
const prov = (definition: string, attribution: string, primarySource: string) => ({
  source: 'derived', sourceIndicator: 'global-progress (counterfactual)', url: 'https://data360.worldbank.org/en/atlas/global-progress/',
  license: 'CC BY 4.0', vintage: VINTAGE, checksum: 'derived',
  definition, attribution, primarySource,
});

function writeArtifact(id: string, obj: any) {
  writeFileSync(join(D, `${id}.json`), JSON.stringify(obj, null, 2));
  console.log(`✓ ${id}`);
}

// 1) The deceleration bars — recent pace as % of the pre-slowdown pace, one bar per indicator.
// The two REVERSALS (negative ratio — undernourishment, measles) are pulled out: a clamped-to-zero
// bar would misrepresent "went backwards" as "barely moved". They get their own movement as lines.
const REVERSED = new Set(['undernourish', 'immunization']);
const bars = rows
  .filter((r) => !REVERSED.has(r.id))
  .map((r) => ({ label: r.label, value: Math.round(r.ratio * 100), color: r.ratio < 0.85 ? 'despair' : r.ratio > 1.1 ? 'hope' : 'ochre' }))
  .sort((a, b) => a.value - b.value);
const reversedNote = rows.filter((r) => REVERSED.has(r.id)).map((r) => `${r.label} ${Math.round(r.ratio * 100)}%`).join(', ');
console.log(`\n  (reversals excluded from pace bars, shown as lines: ${reversedNote})`);
writeArtifact('progress-pace-ratio', {
  chartId: 'progress-pace-ratio', kind: 'bars',
  title: 'Pace of progress, 2013–2024 as a share of the 2000–2013 pace',
  unit: '% of the previous decade’s pace · red = slowed · green = sped up',
  xmax: Math.max(120, Math.ceil(Math.max(...bars.map((b) => b.value)) / 20) * 20), xTicks: [0, 25, 50, 75, 100],
  refLines: [{ y: 100, label: 'same pace as the 2000s' }],
  bars,
  provenance: prov(
    'For each world series, the least-squares annual rate of improvement over 2013–2024 divided by the rate over 2000–2013 (signed so improving is positive). Below 100% = the gain slowed; above = it sped up. Two measures whose rate turned negative (undernourishment, measles coverage) are shown separately as lines. A transparent world-aggregate measure — not the Atlas’s stage-conditional country model.',
    'Author’s calculation on World Bank / OWID series', 'World Bank WDI, Our World in Data',
  ),
  recipe: [{ op: 'pace_ratio', detail: 'slope(2013..latest)/slope(2000..2013) per indicator; sign flipped for lower-is-better; reversals excluded' }],
});

// 1b) The divergence bars — extreme poverty rate today, by region.
writeArtifact('progress-poverty-by-region', {
  chartId: 'progress-poverty-by-region', kind: 'bars',
  title: 'Extreme poverty today, by region',
  unit: '% living on under $3.00 a day · latest available year',
  xmax: Math.ceil(Math.max(...regionBars.map((b) => b.value)) / 10) * 10, xTicks: [0, 15, 30, 45],
  bars: regionBars,
  provenance: prov(
    'Share of each region living on under $3.00 a day (2021 PPP), latest available year. The world average fell because Asia and Latin America all but eliminated extreme poverty; Sub-Saharan Africa did not.',
    'World Bank — Poverty and Inequality Platform', 'World Bank PIP',
  ),
  recipe: [{ op: 'cross_section_latest', detail: 'latest-year extreme-poverty rate per region' }],
});

// 2) Poverty: the actual line only — still falling, but the slope visibly flattens after 2013.
// No counterfactual line: extrapolating a floored rate is invalid (it goes negative). The deceleration
// is carried by the two-decade slope annotations and the pace-ratio bar, not a fabricated line.
const povActual = pov.pts.filter((p) => p.t >= 1990 && p.t <= pov.latest).map((p) => ({ t: p.t, value: r2(p.value) }));
const povHistSlope = slope(pov.pts, pov.histStart, HIST[1]);
const povRecentSlope = slope(pov.pts, SPLIT, pov.latest);
writeArtifact('progress-poverty-actual', {
  unit: '% in extreme poverty ($3.00/day, 2021 PPP)', points: povActual,
  provenance: prov('World extreme-poverty headcount ratio at $3.00/day (2021 PPP).', 'World Bank — Poverty & Inequality Platform', 'World Bank PIP'),
  recipe: [{ op: 'note', detail: `decline ${r2(-povHistSlope)} pts/yr in 2000–2013, ${r2(-povRecentSlope)} pts/yr in 2013–${pov.latest}` }],
});

// 3) Life expectancy: actual vs counterfactual — same construction.
const le = rows.find((r) => r.id === 'life_exp')!;
const leActual = le.pts.filter((p) => p.t >= 1960 && p.t <= le.latest).map((p) => ({ t: p.t, value: r2(p.value) }));
const leSlope = slope(le.pts, le.histStart, HIST[1]);
const leCf: Pt[] = [];
for (let y = SPLIT; y <= le.latest; y++) leCf.push({ t: y, value: r2(valueAt(le.pts, SPLIT) + leSlope * (y - SPLIT)) });
writeArtifact('progress-lifeexp-actual', {
  unit: 'years', points: leActual,
  provenance: prov('World life expectancy at birth.', 'Our World in Data / World Bank', 'UN WPP; World Bank WDI'),
});
writeArtifact('progress-lifeexp-counterfactual', {
  unit: 'years', points: leCf,
  provenance: prov(`Counterfactual: the 2000–2013 rate of gain (${r2(leSlope)} yrs/yr) continued past 2013.`, 'Author’s calculation', 'UN WPP; World Bank WDI'),
  recipe: [{ op: 'extrapolate', detail: `from ${SPLIT} value, slope of ${HIST[0]}–${HIST[1]}` }],
});

// 4) Stash the audited headline numbers for the article single-facts (so prose can't drift).
writeArtifact('progress-headline-facts', {
  note: 'Audited figures the article may cite. Regenerate with scripts/analysis/global-progress.ts. No counterfactual people-count: extrapolating a floored poverty rate is invalid.',
  povertyLatestYear: pov.latest,
  povertyActualPct: r2(pov.actualLatest),
  povertyDeclineHist: r2(-povHistSlope), povertyDeclineRecent: r2(-povRecentSlope),
  worldPopulation: Math.round(popLatest), peopleInExtremePovertyMillions: Math.round(headcount / 1e6),
  lifeExpActual: r2(le.actualLatest), lifeExpCounterfactual: r2(le.cfLatest), lifeExpGapYears: r2(le.cfLatest - le.actualLatest),
  paceRatios: Object.fromEntries(rows.map((r) => [r.id, Math.round(r.ratio * 100)])),
});

// 5) The divergence grid — region × measure, where each region stands TODAY. One cell per region/
// measure, shaded within its OWN row from the worst region (red) to the best (green). No cross-row
// compositing: the colour never claims a year of life and a point of poverty share a scale. Columns
// are ordered by GDP per person (poorest → richest), a single declared variable, so the read is
// "outcomes track income" rather than a hidden composite ranking.
const GRID_COLS: [string, string, string][] = [
  ['ssf', 'Sub-Saharan Africa', 'Africa'], ['sas', 'South Asia', 'S. Asia'],
  ['mea', 'Middle East & N. Africa', 'MENA'], ['lcn', 'Latin America', 'L. Am.'],
  ['eas', 'East Asia & Pacific', 'E. Asia'], ['ecs', 'Europe & Central Asia', 'Europe'],
];
interface GRow { file: string; label: string; short: string; unit: string; lowerBetter: boolean; pct: boolean; }
const GRID_ROWS: GRow[] = [
  { file: 'extreme-poverty', label: 'Extreme poverty', short: 'Poverty', unit: '% under $3.00/day', lowerBetter: true, pct: true },
  { file: 'undernourishment', label: 'Undernourishment', short: 'Hunger', unit: '% of people', lowerBetter: true, pct: true },
  { file: 'child-mortality', label: 'Child mortality', short: 'Child deaths', unit: 'per 1,000 births', lowerBetter: true, pct: false },
  { file: 'maternal-mortality', label: 'Maternal mortality', short: 'Maternal', unit: 'per 100,000 births', lowerBetter: true, pct: false },
  { file: 'life-expectancy', label: 'Life expectancy', short: 'Life exp.', unit: 'years', lowerBetter: false, pct: false },
  { file: 'vaccine-measles', label: 'Measles vaccination', short: 'Measles', unit: '% of infants', lowerBetter: false, pct: true },
  { file: 'internet-users', label: 'Internet use', short: 'Internet', unit: '% of people', lowerBetter: false, pct: true },
];
const latestPt = (pts: Pt[], cap = 2024) => { const f = pts.filter((p) => p.t <= cap); const s = f.length ? f : pts; return s[s.length - 1]; };
console.log(`\n=== DIVERGENCE GRID (latest regional value per measure) ===`);
const gridRows = GRID_ROWS.map((r) => {
  const raw = GRID_COLS.map(([code]) => { const lp = latestPt(read(`${r.file}-${code}`).points); return { col: code, value: r2(lp.value), year: lp.t }; });
  const vals = raw.map((c) => c.value), vmin = Math.min(...vals), vmax = Math.max(...vals);
  const cells = raw.map((c) => {
    const t = vmax === vmin ? 0.5 : (r.lowerBetter ? (vmax - c.value) / (vmax - vmin) : (c.value - vmin) / (vmax - vmin));
    const display = r.pct ? (c.value >= 10 ? `${Math.round(c.value)}%` : `${c.value.toFixed(1)}%`) : `${Math.round(c.value)}`;
    return { col: c.col, value: c.value, year: c.year, t: r2(t), display };
  });
  console.log(`  ${r.label.padEnd(22)} ${cells.map((c) => `${c.col}=${c.display}`).join('  ')}`);
  return { label: r.label, short: r.short, unit: r.unit, cells };
});
writeArtifact('progress-divergence-grid', {
  chartId: 'progress-divergence-grid', kind: 'heatgrid',
  title: 'Where each region stands today, across the measures this piece tracks',
  cols: GRID_COLS.map(([key, label, short]) => ({ key, label, short })),
  rows: gridRows,
  provenance: prov(
    'Latest available value for each world region on each measure, shaded within each row from the worst region (red) to the best (green). The scaling is independent per row — there is no cross-measure composite. Columns are ordered by GDP per person, poorest to richest.',
    'World Bank, WHO, UNICEF, FAO, ITU (via WDI & PIP)', 'World Bank WDI; World Bank PIP',
  ),
  recipe: [{ op: 'row_minmax', detail: 'per-row min–max of the latest regional values; the better end (lower for poverty/mortality, higher for life expectancy/coverage/access) maps to green' }],
});

console.log('\n✓ global-progress artifacts written\n');
