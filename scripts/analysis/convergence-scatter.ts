import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/* Emit the convergence-scatter artifact (src/data/derived/convergence-scatter.json) consumed by
   src/lib/scatter.ts. Per country: initial GDP/cap (PPP) vs annualized growth over a period, bubble
   = population, plus population-weighted and unweighted OLS fit lines (growth on ln initial level).
   Period 2000→2024 — the "post-2000" window where the unconditional-convergence debate lives.

   Not a CanonicalSeries (points carry region/pop, not {t,value}) → it lives outside the registry
   pipeline as a committed artifact, but snapshots its WB inputs per the snapshot-everything rule. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const INCOME = 'NY.GDP.PCAP.PP.KD', POP = 'SP.POP.TOTL';
const Y0 = 2000, Y1 = 2024;

async function wb(slug: string, isInd = true): Promise<any> {
  const url = isInd
    ? `https://api.worldbank.org/v2/country/all/indicator/${slug}?format=json&per_page=25000&date=1990:2024`
    : `https://api.worldbank.org/v2/country?format=json&per_page=400`;
  const dir = join(ROOT, 'data/sources/worldbank', VINTAGE, (isInd ? slug : 'country-meta').replace(/[^\w.-]/g, '_'));
  const raw = join(dir, 'raw.json');
  let text: string;
  if (existsSync(raw)) text = readFileSync(raw, 'utf8');
  else {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`WB ${slug}: HTTP ${res.status}`);
    text = await res.text();
    mkdirSync(dir, { recursive: true });
    writeFileSync(raw, text);
    writeFileSync(join(dir, 'snapshot.json'), JSON.stringify({ source: 'worldbank', slug, vintage: VINTAGE, url, checksum: sha256(text), license: 'CC BY 4.0', fetchedAt: new Date().toISOString() }, null, 2));
  }
  return JSON.parse(text);
}
function panel(json: any): Record<string, Record<number, number>> {
  const o: Record<string, Record<number, number>> = {};
  for (const r of (json[1] ?? []) as any[]) {
    const c = r?.countryiso3code; if (!c || r.value == null) continue;
    const y = +r.date, v = +r.value; if (!isFinite(y) || !isFinite(v)) continue;
    (o[c] ??= {})[y] = v;
  }
  return o;
}

const [incJ, popJ, metaJ] = await Promise.all([wb(INCOME), wb(POP), wb('', false)]);
const inc = panel(incJ), pop = panel(popJ);
const region: Record<string, string> = {}, name: Record<string, string> = {};
for (const c of (metaJ[1] ?? []) as any[]) {
  if (c?.id && c?.region?.value && c.region.value !== 'Aggregates') { region[c.id] = c.region.value; name[c.id] = c.name; }
}

const ln = Math.log;
const GIANTS: Record<string, string> = { CHN: 'China', IND: 'India', USA: 'United States', IDN: 'Indonesia', NGA: 'Nigeria', BRA: 'Brazil', PAK: 'Pakistan', RUS: 'Russia', JPN: 'Japan' };

const set = Object.keys(region).filter((c) => inc[c]?.[Y0] != null && inc[c]?.[Y1] != null && pop[c]?.[Y0] != null && pop[c]?.[Y1] != null);
const points = set.map((c) => ({
  x: inc[c][Y0],
  y: (ln(inc[c][Y1]) - ln(inc[c][Y0])) / (Y1 - Y0) * 100,
  pop: (pop[c][Y0] + pop[c][Y1]) / 2,
  region: region[c],
  ...(GIANTS[c] ? { label: GIANTS[c] } : {}),
}));

// OLS of y on ln(x), weights w → {slope, intercept}
function fit(w: number[]) {
  const X = points.map((p) => ln(p.x)), Yv = points.map((p) => p.y);
  const sw = w.reduce((a, b) => a + b, 0);
  const xm = X.reduce((a, b, i) => a + w[i] * b, 0) / sw, ym = Yv.reduce((a, b, i) => a + w[i] * b, 0) / sw;
  let num = 0, den = 0;
  for (let i = 0; i < X.length; i++) { num += w[i] * (X[i] - xm) * (Yv[i] - ym); den += w[i] * (X[i] - xm) ** 2; }
  const slope = num / den;
  return { slope, intercept: ym - slope * xm };
}
const fits = { weighted: fit(points.map((p) => p.pop)), unweighted: fit(points.map(() => 1)) };

// region → palette hex (mirrors tokens.css; data-driven so the renderer stays generic)
const regionColors: Record<string, string> = {
  'East Asia & Pacific': '#C0492B',
  'South Asia': '#C7901A',
  'Sub-Saharan Africa': '#0F7A52',
  'Latin America & Caribbean': '#5A55E6',
  'Europe & Central Asia': '#6E7E92',
  'Middle East, North Africa, Afghanistan & Pakistan': '#2B8C8C',
  'North America': '#14130F',
};

const artifact = {
  chartId: 'convergence-scatter',
  title: `Growth vs starting income, ${Y0}–${Y1} — do poorer economies grow faster?`,
  period: [Y0, Y1],
  n: points.length,
  unit: 'GDP per capita PPP at start ($) vs annualized growth (%/yr); bubble = population',
  points,
  fits,
  xTicks: [1000, 3000, 10000, 30000, 100000],
  yTicks: [-4, -2, 0, 2, 4, 6, 8],
  regionColors,
  provenance: {
    source: 'worldbank', sourceIndicator: `${INCOME} × ${POP}`,
    url: `https://data.worldbank.org/indicator/${INCOME}`, license: 'CC BY 4.0', vintage: VINTAGE,
    checksum: sha256(JSON.stringify({ points, fits })),
    definition: `Annualized growth of GDP per capita (PPP, constant 2021 international $) ${Y0}–${Y1} vs initial level, ${points.length} countries; OLS fits of growth on ln(initial level), population-weighted and unweighted.`,
    attribution: 'World Bank — World Development Indicators (ICP PPP & population)',
    primarySource: 'World Bank, International Comparison Program / OECD',
  },
  recipe: [{ op: 'convergence_scatter', detail: `per-country growth ${Y0}–${Y1} vs ln(initial); weighted slope ${fits.weighted.slope.toFixed(3)}, unweighted slope ${fits.unweighted.slope.toFixed(3)}` }],
};

const out = join(ROOT, 'src/data/derived/convergence-scatter.json');
writeFileSync(out, JSON.stringify(artifact, null, 2));
console.log(`✓ ${points.length} countries → ${out}`);
console.log(`  weighted slope   ${fits.weighted.slope.toFixed(3)} (${fits.weighted.slope < 0 ? 'converge' : 'DIVERGE'})`);
console.log(`  unweighted slope ${fits.unweighted.slope.toFixed(3)} (${fits.unweighted.slope < 0 ? 'converge' : 'DIVERGE'})`);
