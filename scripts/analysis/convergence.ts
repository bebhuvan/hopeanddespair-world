import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

/* Convergence — empirical test against our own World Bank panel (exploration, not a registry
   indicator yet). Mirrors the GS "Is Convergence Really Over?" method on OPEN data we can re-host:
   β-convergence (growth vs initial level, weighted/unweighted) by sub-period, σ-convergence
   (dispersion of log income over time), and population-weighted between-country inequality with a
   China/India sensitivity. Snapshots raw bytes per the snapshot-everything invariant.

   Primary income measure: NY.GDP.PCAP.PP.KD — GDP per capita, PPP (constant 2021 international $),
   the welfare-relevant series (matches GS's PPP framing). Coverage begins ~1990.
   Robustness measure:    NY.GDP.PCAP.KD — GDP per capita, constant 2015 US$ (market FX), from 1960,
   to extend the long view (clearly market-exchange, which overstates poor-country gaps). */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);

async function wbFetch(slug: string, isIndicator = true): Promise<any> {
  const url = isIndicator
    ? `https://api.worldbank.org/v2/country/all/indicator/${slug}?format=json&per_page=25000&date=1960:2024`
    : `https://api.worldbank.org/v2/country?format=json&per_page=400`;
  const safeSlug = (isIndicator ? slug : 'country-meta').replace(/[^\w.-]/g, '_');
  const snapDir = join(ROOT, 'data/sources/worldbank', VINTAGE, safeSlug);
  const rawPath = join(snapDir, 'raw.json');
  let text: string;
  if (existsSync(rawPath)) {
    text = readFileSync(rawPath, 'utf8');
  } else {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`WB ${slug}: HTTP ${res.status}`);
    text = await res.text();
    mkdirSync(snapDir, { recursive: true });
    writeFileSync(rawPath, text);
    writeFileSync(join(snapDir, 'snapshot.json'), JSON.stringify({
      source: 'worldbank', slug, vintage: VINTAGE, url, checksum: sha256(text),
      license: 'CC BY 4.0', fetchedAt: new Date().toISOString(),
    }, null, 2));
  }
  return JSON.parse(text);
}

// ── load panels ───────────────────────────────────────────────────────────────────────────────
type Panel = Map<string, Map<number, number>>; // iso3 → year → value

function toPanel(json: any): Panel {
  const rows = (json[1] ?? []) as any[];
  const p: Panel = new Map();
  for (const r of rows) {
    const iso3 = r?.countryiso3code;
    if (!iso3 || r.value == null) continue;
    const y = parseInt(r.date, 10);
    const v = Number(r.value);
    if (!Number.isFinite(y) || !Number.isFinite(v)) continue;
    if (!p.has(iso3)) p.set(iso3, new Map());
    p.get(iso3)!.set(y, v);
  }
  return p;
}

const [gdpPppJson, gdpMktJson, popJson, metaJson] = await Promise.all([
  wbFetch('NY.GDP.PCAP.PP.KD'),
  wbFetch('NY.GDP.PCAP.KD'),
  wbFetch('SP.POP.TOTL'),
  wbFetch('', false),
]);

const gdpPpp = toPanel(gdpPppJson);
const gdpMkt = toPanel(gdpMktJson);
const pop = toPanel(popJson);

// Country metadata: which iso3 are real countries (region.value !== 'Aggregates') + their region.
const region = new Map<string, string>();
const realCountry = new Set<string>();
for (const c of (metaJson[1] ?? []) as any[]) {
  const iso3 = c?.id;
  const reg = c?.region?.value;
  if (!iso3 || !reg) continue;
  if (reg === 'Aggregates') continue;
  realCountry.add(iso3);
  region.set(iso3, reg);
}

// ── stats helpers ───────────────────────────────────────────────────────────────────────────────
const ln = Math.log;
function weightedMean(xs: number[], w: number[]) {
  let sw = 0, s = 0;
  for (let i = 0; i < xs.length; i++) { s += w[i] * xs[i]; sw += w[i]; }
  return s / sw;
}
function weightedSD(xs: number[], w: number[]) {
  const m = weightedMean(xs, w);
  let sw = 0, s = 0;
  for (let i = 0; i < xs.length; i++) { s += w[i] * (xs[i] - m) ** 2; sw += w[i]; }
  return Math.sqrt(s / sw);
}
function sd(xs: number[]) { return weightedSD(xs, xs.map(() => 1)); }
// slope of OLS/WLS regression of y on x with weights w
function slope(xs: number[], ys: number[], w: number[]) {
  const xm = weightedMean(xs, w), ym = weightedMean(ys, w);
  let num = 0, den = 0;
  for (let i = 0; i < xs.length; i++) { num += w[i] * (xs[i] - xm) * (ys[i] - ym); den += w[i] * (xs[i] - xm) ** 2; }
  return num / den;
}

// ── σ-convergence: dispersion of ln(GDPpc) across countries, per year (balanced set) ───────────
function sigmaTrajectory(panel: Panel, years: number[]) {
  // balanced set: countries (real) with data in every listed year AND population
  const countries = [...panel.keys()].filter((c) =>
    realCountry.has(c) && years.every((y) => panel.get(c)!.has(y) && pop.get(c)?.has(y)));
  const out = years.map((y) => {
    const xs = countries.map((c) => ln(panel.get(c)!.get(y)!));
    const w = countries.map((c) => pop.get(c)!.get(y)!);
    return { y, n: countries.length, unweighted: sd(xs), weighted: weightedSD(xs, w) };
  });
  return { countries: countries.length, out };
}

// ── β-convergence: annualized growth vs initial ln(level), per sub-period ─────────────────────
function betaPeriod(panel: Panel, y0: number, y1: number, drop: string[] = []) {
  const countries = [...panel.keys()].filter((c) =>
    realCountry.has(c) && !drop.includes(c) &&
    panel.get(c)!.has(y0) && panel.get(c)!.has(y1) && pop.get(c)?.has(y0));
  const x = countries.map((c) => ln(panel.get(c)!.get(y0)!));            // initial log level
  const g = countries.map((c) => (ln(panel.get(c)!.get(y1)!) - ln(panel.get(c)!.get(y0)!)) / (y1 - y0) * 100); // %/yr
  const w = countries.map((c) => pop.get(c)!.get(y0)!);
  const ones = countries.map(() => 1);
  return {
    y0, y1, n: countries.length,
    unwSlope: slope(x, g, ones),
    wtSlope: slope(x, g, w),
  };
}

// ── population-weighted between-country inequality: mean log deviation GE(0) ───────────────────
function mld(panel: Panel, year: number, drop: string[] = []) {
  const countries = [...panel.keys()].filter((c) =>
    realCountry.has(c) && !drop.includes(c) && panel.get(c)!.has(year) && pop.get(c)?.has(year));
  const y = countries.map((c) => panel.get(c)!.get(year)!);
  const p = countries.map((c) => pop.get(c)!.get(year)!);
  const ybar = weightedMean(y, p); // population-weighted mean income
  let sw = 0, s = 0;
  for (let i = 0; i < y.length; i++) { s += p[i] * ln(ybar / y[i]); sw += p[i]; }
  return { year, n: countries.length, mld: s / sw, popMean: ybar };
}

// ── regional growth & initial level by sub-period ─────────────────────────────────────────────
function regionalGrowth(panel: Panel, y0: number, y1: number) {
  const byReg = new Map<string, { g: number[]; lvl: number[]; pop: number[] }>();
  for (const c of panel.keys()) {
    if (!realCountry.has(c) || !panel.get(c)!.has(y0) || !panel.get(c)!.has(y1) || !pop.get(c)?.has(y0)) continue;
    const r = region.get(c)!;
    if (!byReg.has(r)) byReg.set(r, { g: [], lvl: [], pop: [] });
    byReg.get(r)!.g.push((ln(panel.get(c)!.get(y1)!) - ln(panel.get(c)!.get(y0)!)) / (y1 - y0) * 100);
    byReg.get(r)!.lvl.push(panel.get(c)!.get(y0)!);
    byReg.get(r)!.pop.push(pop.get(c)!.get(y0)!);
  }
  return [...byReg.entries()].map(([r, d]) => ({
    region: r, n: d.g.length,
    popWtGrowth: weightedMean(d.g, d.pop),
    medLevel: d.lvl.slice().sort((a, b) => a - b)[Math.floor(d.lvl.length / 2)],
  })).sort((a, b) => b.popWtGrowth - a.popWtGrowth);
}

// ════ REPORT ════════════════════════════════════════════════════════════════════════════════
const f = (x: number, d = 2) => x.toFixed(d);
console.log(`\n# CONVERGENCE — empirical test on World Bank open data (vintage ${VINTAGE})`);
console.log(`Real countries with metadata: ${realCountry.size}\n`);

for (const [label, panel, periods, sigmaYears] of [
  ['PPP — GDP per capita, constant 2021 international $ (NY.GDP.PCAP.PP.KD)', gdpPpp,
    [[1990, 1999], [2000, 2009], [2010, 2019], [2019, 2024]], [1990, 1995, 2000, 2005, 2010, 2015, 2019, 2024]],
  ['MARKET FX — GDP per capita, constant 2015 US$ (NY.GDP.PCAP.KD)', gdpMkt,
    [[1980, 1989], [1990, 1999], [2000, 2009], [2010, 2019], [2019, 2024]], [1980, 1990, 2000, 2010, 2019, 2024]],
] as [string, Panel, number[][], number[]][]) {
  console.log(`\n${'═'.repeat(94)}\n## ${label}\n${'═'.repeat(94)}`);

  // σ-convergence
  const sig = sigmaTrajectory(panel, sigmaYears);
  console.log(`\nσ-CONVERGENCE — SD of ln(GDPpc) across ${sig.countries} balanced countries (falling = converging)`);
  console.log(`  year   unweighted   pop-weighted`);
  for (const r of sig.out) console.log(`  ${r.y}      ${f(r.unweighted)}         ${f(r.weighted)}`);

  // β-convergence
  console.log(`\nβ-CONVERGENCE — slope of annual growth (%/yr) on initial ln(GDPpc). NEGATIVE = poor grew faster.`);
  console.log(`  period        n    unweighted     pop-weighted`);
  for (const [a, b] of periods) {
    const r = betaPeriod(panel, a, b);
    const tag = (s: number) => (s < 0 ? 'converge' : 'DIVERGE ');
    console.log(`  ${a}-${b}   ${String(r.n).padStart(3)}    ${f(r.unwSlope).padStart(6)} ${tag(r.unwSlope)}  ${f(r.wtSlope).padStart(6)} ${tag(r.wtSlope)}`);
  }

  // β excluding China+India (the "it's just two countries" test) — on the widest period available
  const wide = periods[0][0];
  const last = periods[periods.length - 1][1];
  const full = betaPeriod(panel, wide, last);
  const exCI = betaPeriod(panel, wide, last, ['CHN', 'IND']);
  console.log(`\n  Sensitivity ${wide}-${last} (pop-weighted slope):  all = ${f(full.wtSlope)}   excl. China+India = ${f(exCI.wtSlope)}`);

  // between-country inequality (population-weighted MLD)
  console.log(`\nBETWEEN-COUNTRY INEQUALITY — population-weighted mean log deviation (falling = converging)`);
  const yA = sigmaYears[0], yB = sigmaYears[sigmaYears.length - 1];
  for (const [tag, drop] of [['all countries', []], ['excl. China+India', ['CHN', 'IND']]] as [string, string[]][]) {
    const a = mld(panel, yA, drop), b = mld(panel, yB, drop);
    console.log(`  ${tag.padEnd(20)} ${yA}: ${f(a.mld, 3)}  →  ${yB}: ${f(b.mld, 3)}   (${b.mld < a.mld ? 'narrowing' : 'WIDENING'}, ${f((b.mld / a.mld - 1) * 100, 0)}%)`);
  }

  // regional
  console.log(`\nREGIONAL — pop-weighted annual growth (%/yr), ${wide}-${last}, sorted fastest first`);
  for (const r of regionalGrowth(panel, wide, last))
    console.log(`  ${r.region.padEnd(28)} n=${String(r.n).padStart(2)}   growth ${f(r.popWtGrowth).padStart(5)}%/yr   median start $${Math.round(r.medLevel).toLocaleString()}`);
}
console.log('');
