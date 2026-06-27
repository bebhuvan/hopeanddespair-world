import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { datapackage, lineage, toCSV } from '../lib/provenance.ts';
import type { CanonicalSeries, RawSnapshot } from '../../src/lib/data/types.ts';

/* The global jobs challenge (Q16) — derived from the World Bank's "The Global Jobs Challenge"
   (advance edition, 2026; CC BY 3.0 IGO), re-hosted with attribution. The report's own figure
   workbooks were transcribed into per-figure CSVs under data/sources/worldbank-jobs/<vintage>/; this
   script reads those CSVs and emits the article's derived series + an audited facts file. No registry
   adapter — same pattern as scripts/analysis/gep-emde-debt.ts. Most charts rest on UN World Population
   Prospects 2024 / ILOSTAT / WDI (all re-hostable); a couple co-source proprietary series (Haver,
   the IMF AI Preparedness Index) — those are attributed to the World Bank figure that published them.
   Data cutoff for the report was September 28, 2025. Run: npx tsx scripts/analysis/global-jobs-challenge.ts */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const w = (p: string, c: string) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, c); };
const CITE = 'https://www.worldbank.org/en/research/publication/global-jobs-challenge';
const ATTR = 'World Bank — The Global Jobs Challenge (2026), CC BY 3.0 IGO';
const LIC = 'CC BY 3.0 IGO — World Bank, re-hosted with attribution';

const dir = join(ROOT, 'data/sources/worldbank-jobs');
const VINTAGE = readdirSync(dir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!;
const SRC = join(dir, VINTAGE);

const REGION: Record<string, string> = {
  EAP: 'East Asia & Pacific', ECA: 'Europe & Central Asia', LAC: 'Latin America & Caribbean',
  MNA: 'Middle East & North Africa', SAR: 'South Asia', SSA: 'Sub-Saharan Africa',
};
const COUNTRY: Record<string, string> = {
  IND: 'India', NGA: 'Nigeria', PAK: 'Pakistan', ETH: 'Ethiopia', COD: 'DR Congo',
  EGY: 'Egypt', BGD: 'Bangladesh', TZA: 'Tanzania', IDN: 'Indonesia', PHL: 'Philippines',
};

/** Read a committed figure CSV into rows of {col:value}; numeric cells coerced to numbers. */
function readCSV(name: string): { rows: Record<string, any>[]; checksum: string } {
  const text = readFileSync(join(SRC, name), 'utf8');
  const lines = text.trim().split('\n');
  const head = lines[0].split(',');
  const rows = lines.slice(1).map((ln) => {
    const cells = ln.split(',');
    const o: Record<string, any> = {};
    head.forEach((h, i) => { const v = cells[i]; const n = Number(v); o[h.trim()] = v !== '' && Number.isFinite(n) ? n : v; });
    return o;
  });
  return { rows, checksum: sha256(text) };
}

const prov = (checksum: string, figure: string, definition: string, primary: string) => ({
  source: 'worldbank-jobs',
  sourceIndicator: `The Global Jobs Challenge (2026) — ${figure}`,
  url: CITE, license: LIC, vintage: VINTAGE, checksum, definition, attribution: ATTR, primarySource: primary,
});
const rawFor = (figure: string, checksum: string): RawSnapshot => ({
  source: 'worldbank-jobs', slug: figure, vintage: VINTAGE, url: CITE, checksum, license: LIC,
  body: '', ext: 'csv', meta: {}, fetchedAt: `${VINTAGE}T00:00:00Z`, adapterVersion: 'jobs-1.0.0',
});

// Bars artifacts (kind:'bars') → derived only (image-download is transformative; data gated). Lines →
// derived + public/charts data package (data is re-hostable CC BY 3.0 IGO).
function writeBars(chartId: string, artifact: any) {
  w(join(ROOT, `src/data/derived/${chartId}.json`), JSON.stringify(artifact, null, 2));
}
function writeSeries(chartId: string, series: CanonicalSeries, figure: string, checksum: string) {
  const raw = rawFor(figure, checksum);
  w(join(ROOT, `src/data/derived/${chartId}.json`), JSON.stringify(series, null, 2));
  w(join(ROOT, 'public/charts', chartId, 'data.csv'), toCSV(series));
  w(join(ROOT, 'public/charts', chartId, 'datapackage.json'), JSON.stringify(datapackage(series), null, 2));
  w(join(ROOT, 'public/charts', chartId, 'lineage.json'), JSON.stringify(lineage(series, raw), null, 2));
}
const r1 = (n: number) => +n.toFixed(1);
const r2 = (n: number) => +n.toFixed(2);

const facts: Record<string, any> = {
  note: 'Audited figures the Q16 article may cite. Regenerate with scripts/analysis/global-jobs-challenge.ts. Source: World Bank, The Global Jobs Challenge (2026), CC BY 3.0 IGO. Numbers not tied to a charted figure are transcribed from the report text/figures noted.',
};

/* ── 1. The wave — EMDE youth (15–24) 1955–2095, billions (FIG ES.1.A / 2.2.B, UN WPP 2024) ── */
{
  const { rows, checksum } = readCSV('fig-ES1A-youth-wave.csv');
  const points = rows.map((x) => ({ t: x.year as number, value: r2(x.youth_billions) }));
  writeSeries('jobs-youth-wave-emde', {
    indicatorId: 'jobs.youth_wave.emde', entity: 'EMDEs', entityName: 'EMDEs',
    unit: 'young people aged 15–24 · billions',
    points,
    provenance: prov(checksum, 'figure ES.1.A', 'Number of young people aged 15–24 living in emerging market and developing economies, by year; the cohort crests in the decade to 2035 and is not projected to be matched again this century.', 'UN World Population Prospects 2024'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure ES.1.A, EMDE youth 15–24, billions' }],
  } as CanonicalSeries, 'figure ES.1.A', checksum);
  facts.youthWave = { peak: points.find((p) => p.t === 2035), y2025: points.find((p) => p.t === 2025), y1975: points.find((p) => p.t === 1975) };
}

/* ── 2. The handoff — youth by region 2000 vs 2035, millions (slopegraph, FIG 1.2.B, UN WPP) ── */
{
  const { rows, checksum } = readCSV('fig-12B-youth-by-region.csv');
  const byReg: Record<string, { y2000: number; y2035: number }> = {};
  for (const x of rows) byReg[x.region] = { y2000: r1(x.pop2000_thousands / 1000), y2035: r1(x.pop2035_thousands / 1000) };
  for (const [code, name] of Object.entries(REGION)) {
    const v = byReg[code];
    writeSeries(`jobs-youth-region-${code.toLowerCase()}`, {
      indicatorId: `jobs.youth_region.${code.toLowerCase()}`, entity: code, entityName: name,
      unit: 'young people aged 15–24 · millions',
      points: [{ t: 2000, value: v.y2000 }, { t: 2035, value: v.y2035 }],
      provenance: prov(checksum, 'figure 1.2.B', `Young people aged 15–24 living in ${name} in 2000 and (projected) 2035.`, 'UN World Population Prospects 2024'),
      recipe: [{ op: 'transcribe_chart_pack', detail: `figure 1.2.B, ${code} youth 2000 & 2035, thousands→millions` }],
    } as CanonicalSeries, 'figure 1.2.B', checksum);
  }
  facts.youthByRegion = byReg;
  facts.youthByRegion.ssaMultiple = r1(byReg.SSA.y2035 / byReg.SSA.y2000);
}

/* ── 3. Who is on the clock — working-age population change by region, 2025–35, millions (FIG 1.2.D) ── */
{
  const { rows, checksum } = readCSV('fig-12D-wap-change-region.csv');
  const recs = rows.map((x) => ({ code: x.region, name: REGION[x.region],
    c2535: r1(x.chg_2025_35 / 1000), c0025: r1(x.chg_2000_25 / 1000), c3550: r1(x.chg_2035_50 / 1000) }))
    .sort((a, b) => b.c2535 - a.c2535);
  writeBars('jobs-wap-change-region', {
    chartId: 'jobs-wap-change-region', kind: 'bars',
    title: 'Who has to find the work', unit: 'change in working-age population (15–64) · millions · 2025–35',
    yearSpan: '2025–35', xmax: 250, xTicks: [0, 50, 100, 150, 200, 250], decimals: 0,
    bars: recs.map((r) => ({ label: r.name, value: r.c2535,
      color: r.code === 'SSA' ? 'despair' : r.c2535 <= 0 ? 'stone' : r.code === 'EAP' || r.code === 'ECA' ? 'stone' : 'ochre',
      note: r.c2535 <= 0 ? '(shrinking)' : undefined })),
    provenance: prov(checksum, 'figure 1.2.D', 'Net change in the working-age population (aged 15–64) by EMDE region over 2025–35: new entrants minus those ageing out. Sub-Saharan Africa adds the most by far; East Asia & Pacific has begun to shrink.', 'UN World Population Prospects 2024'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure 1.2.D, working-age change 2025–35, thousands→millions' }],
  });
  facts.wapChange = Object.fromEntries(recs.map((r) => [r.code, { c2000_25: r.c0025, c2025_35: r.c2535, c2035_50: r.c3550 }]));
}

/* ── 4. The proof it can work — peak youth cohort by region, with dates (FIG 2.2.F, UN WPP) ── */
{
  const { rows, checksum } = readCSV('fig-22F-peak-cohort.csv');
  const recs = rows.map((x) => ({ code: x.region, name: REGION[x.region], period: String(x.period), max: r1(x.max_youth_millions) }))
    .sort((a, b) => b.max - a.max);
  writeBars('jobs-peak-cohort-region', {
    chartId: 'jobs-peak-cohort-region', kind: 'bars',
    title: 'Every region gets one peak', unit: 'largest 10-year youth inflow on record · millions (period shown)',
    yearSpan: '1978–2035', xmax: 360, xTicks: [0, 90, 180, 270, 360], decimals: 0,
    bars: recs.map((r) => ({ label: r.name, value: r.max,
      color: r.period.startsWith('2025') ? 'despair' : 'stone', note: r.period.replace('-', '–') })),
    provenance: prov(checksum, 'figure 2.2.F', "Each EMDE region's largest increase in the youth population (aged 15–24) over any 10-year period, and when it fell. East Asia & Pacific's peak (to 1988) powered its growth miracle; Sub-Saharan Africa and the Middle East & North Africa reach their largest-ever peaks only now.", 'UN World Population Prospects 2024'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure 2.2.F, peak youth cohort by region, millions + period' }],
  });
  facts.peakCohort = Object.fromEntries(recs.map((r) => [r.code, { period: r.period, max: r.max }]));
}

/* ── 5. Harder now — EMDE vs advanced-economy potential growth by decade (FIG ES.1.D, Kose & Ohnsorge) ── */
{
  const { rows, checksum } = readCSV('fig-ES1D-potential-growth.csv');
  const mid = (p: string) => ({ '2000-09': 2005, '2010-19': 2015, '2020-29': 2025 } as Record<string, number>)[p];
  const mk = (key: 'emde' | 'ae', name: string) => ({
    indicatorId: `jobs.potential_growth.${key}`, entity: key.toUpperCase(), entityName: name,
    unit: 'potential output growth · % per year',
    points: rows.map((x) => ({ t: mid(String(x.period)), value: r1(x[key]) })),
    provenance: prov(checksum, 'figure ES.1.D', `GDP-weighted potential output growth for ${name}, by decade (production-function estimates from Kose and Ohnsorge 2024). The tailwind that lifted earlier youth-bulge economies has weakened.`, 'Kose and Ohnsorge (2024)'),
    recipe: [{ op: 'transcribe_chart_pack', detail: `figure ES.1.D, ${key} potential growth by decade` }],
  } as CanonicalSeries);
  writeSeries('jobs-potential-growth-emde', mk('emde', 'EMDEs'), 'figure ES.1.D', checksum);
  writeSeries('jobs-potential-growth-ae', mk('ae', 'Advanced economies'), 'figure ES.1.D', checksum);
  facts.potentialGrowth = Object.fromEntries(rows.map((x) => [String(x.period), { emde: r1(x.emde), ae: r1(x.ae) }]));
}

/* ── 6. Least equipped — GDP per capita on the eve of each region's peak (FIG 3.3.B, WDI) ── */
{
  const g = readCSV('fig-33B-gdppc-eve.csv');
  const d = readCSV('fig-33D-debt-eve.csv');
  const debtBy: Record<string, number> = {};
  for (const x of d.rows) debtBy[x.region] = r1(x.debt_pct_gdp);
  const recs = g.rows.map((x) => ({ code: x.region, name: REGION[x.region], year: x.target_year, gdppc: r1(x.gdppc_thousand_usd), debt: debtBy[x.region] }))
    .sort((a, b) => b.gdppc - a.gdppc);
  writeBars('jobs-gdppc-eve-region', {
    chartId: 'jobs-gdppc-eve-region', kind: 'bars',
    title: 'Poorer at the starting line', unit: 'GDP per capita on the eve of the region’s peak youth surge · US$ thousands (year shown)',
    yearSpan: '1978–2024', xmax: 8, xTicks: [0, 2, 4, 6, 8], decimals: 1,
    bars: recs.map((r) => ({ label: r.name, value: r.gdppc,
      color: r.year >= 2024 ? 'despair' : 'stone', note: `${r.year}` })),
    provenance: prov(g.checksum, 'figure 3.3.B', 'Median GDP per capita in each EMDE region at the start of the decade when its largest youth inflow was (or is) recorded. Sub-Saharan Africa and the Middle East & North Africa reach their peaks now, at far lower incomes than East Asia or Europe & Central Asia had at theirs.', 'World Development Indicators'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure 3.3.B, median GDP per capita at peak, US$000' }],
  });
  facts.gdppcEve = Object.fromEntries(recs.map((r) => [r.code, { year: r.year, gdppc: r.gdppc, debtPctGdp: r.debt }]));
}

/* ── 7. The AI fork — preparedness (FIG 3.4.A, IMF AI Preparedness Index via World Bank) ── */
{
  const { rows, checksum } = readCSV('fig-34A-ai-prep.csv');
  const comps = [
    { key: 'digital', label: 'Digital', color: 'despair' },
    { key: 'innovation', label: 'Innovation', color: 'ochre' },
    { key: 'human_capital', label: 'Human capital', color: 'uncertain' },
    { key: 'regulation', label: 'Regulation', color: 'stone' },
  ];
  const label = (g: string) => g.includes('large jobs') ? 'EMDEs with a large jobs challenge' : 'Other EMDEs';
  const bars = rows
    .map((x) => ({ g: label(String(x.group)), total: r2(comps.reduce((s, c) => s + x[c.key], 0)),
      segments: comps.map((c) => ({ value: r2(x[c.key]), color: c.color })) }))
    .sort((a, b) => a.total - b.total)
    .map((b) => ({ label: b.g, value: b.total, color: 'stone', segments: b.segments }));
  writeBars('jobs-ai-prep', {
    chartId: 'jobs-ai-prep', kind: 'bars',
    title: 'Least ready for the next wave', unit: 'AI Preparedness Index (0–1), four components stacked · 2023',
    yearSpan: '2023', xmax: 0.5, xTicks: [0, 0.1, 0.2, 0.3, 0.4, 0.5], decimals: 2,
    legend: comps.map((c) => ({ label: c.label, color: c.color })),
    bars,
    provenance: prov(checksum, 'figure 3.4.A', 'Average score on the IMF AI Preparedness Index (Cazzaniga et al. 2024), as published by the World Bank, split into its four components. "EMDEs with a large jobs challenge" are those where young people are at least 30% of the 15+ population in 2035.', 'Cazzaniga et al. (2024), IMF'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure 3.4.A, AI Preparedness Index components' }],
  });
  facts.aiPrep = Object.fromEntries(bars.map((b) => [b.label, b.value]));
}

/* ── 8. The AI fork — the divide: internet use (FIG 3.4.B, WDI) ── */
{
  const { rows, checksum } = readCSV('fig-34B-internet.csv');
  const label = (g: string) => g.includes('large jobs') ? 'EMDEs with a large jobs challenge' : 'Other EMDEs';
  const bars = rows.map((x) => ({ label: label(String(x.group)), value: r1(x.internet_share),
    color: label(String(x.group)).includes('large') ? 'despair' : 'hope' })).sort((a, b) => a.value - b.value);
  writeBars('jobs-internet-divide', {
    chartId: 'jobs-internet-divide', kind: 'bars',
    title: 'You can’t catch what you can’t reach', unit: 'share of people using the internet · % · latest year',
    yearSpan: 'latest', xmax: 100, xTicks: [0, 25, 50, 75, 100], decimals: 0,
    bars,
    provenance: prov(checksum, 'figure 3.4.B', 'Median share of individuals using the internet across EMDEs, latest available year. Where the jobs challenge is largest, most people are still offline — so the productivity upside of AI is hardest to capture there.', 'World Development Indicators'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure 3.4.B, internet use, %' }],
  });
  facts.internet = Object.fromEntries(bars.map((b) => [b.label, b.value]));
}

/* ── 9. The gap already showing — young NEETs by region, 2005 vs 2025, millions (FIG 1.2.C, ILOSTAT) ── */
{
  const { rows, checksum } = readCSV('fig-12C-neet-region.csv');
  const by: Record<string, { y2005: number; y2025: number; rate2025: number }> = {};
  for (const x of rows) {
    by[x.region] ??= { y2005: 0, y2025: 0, rate2025: 0 };
    if (x.year === 2005) by[x.region].y2005 = r1(x.neet_thousands / 1000);
    else { by[x.region].y2025 = r1(x.neet_thousands / 1000); by[x.region].rate2025 = r1(x.neet_rate); }
  }
  const recs = Object.entries(by).map(([code, v]) => ({ code, name: REGION[code], ...v })).sort((a, b) => b.y2025 - a.y2025);
  writeBars('jobs-neet-region', {
    chartId: 'jobs-neet-region', kind: 'bars',
    title: 'The gap is not hypothetical', unit: 'young people not in employment, education or training · millions · 2025 (2005 in note)',
    yearSpan: '2025', xmax: 80, xTicks: [0, 20, 40, 60, 80], decimals: 0,
    bars: recs.map((r) => ({ label: r.name, value: r.y2025,
      color: r.y2025 > r.y2005 ? 'despair' : 'hope', note: `was ${r.y2005}` })),
    provenance: prov(checksum, 'figure 1.2.C', 'Number of young people (aged 15–24) not in employment, education or training (NEET) by EMDE region, 2005 and 2025 (2025 projected). Falling where the youth wave has passed; rising in Sub-Saharan Africa and the Middle East & North Africa.', 'ILOSTAT'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure 1.2.C, young NEET counts, thousands→millions' }],
  });
  facts.neet = Object.fromEntries(recs.map((r) => [r.code, { y2005: r.y2005, y2025: r.y2025, rate2025: r.rate2025 }]));
}

/* ── 10. The number depends on the lens — jobs-challenge estimates by method (FIG 2.7.A) ── */
{
  const { rows, checksum } = readCSV('fig-27A-jobs-estimates.csv');
  const order = ['Youth method', 'Working-age method', 'Ratio method'];
  const by: Record<string, number> = {};
  for (const x of rows) by[String(x.method).trim()] = r1(x.total_thousands / 1000);
  writeBars('jobs-challenge-estimates', {
    chartId: 'jobs-challenge-estimates', kind: 'bars',
    title: 'One decade, three answers', unit: 'jobs the decade to 2035 must absorb in EMDEs · millions · by counting method',
    yearSpan: '2025–35', xmax: 1300, xTicks: [0, 300, 600, 900, 1200], decimals: 0,
    bars: order.map((m) => ({ label: m, value: by[m], color: 'uncertain' })),
    provenance: prov(checksum, 'figure 2.7.A', 'Size of the EMDE jobs challenge over 2025–35 under three methods. Youth method: all new entrants to the working-age population. Working-age method: the net change in the working-age population. Ratio method: that net change scaled by each country’s 2010–19 employment ratio. The same decade looks four times larger or smaller depending on the lens.', 'ILOSTAT; UN World Population Prospects 2024; WEO'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure 2.7.A, jobs-challenge estimates, thousands→millions' }],
  });
  facts.estimates = by;
}

/* ── 11. Where it lands hardest — largest working-age increases by country, 2025–35 (FIG 2.8.C) ── */
{
  const { rows, checksum } = readCSV('fig-28C-wap-increase-country.csv');
  const recs = rows.map((x) => ({ code: x.iso3, name: COUNTRY[x.iso3] ?? x.iso3, v: r1(x.wap_increase_thousands_2025_35 / 1000) }))
    .sort((a, b) => b.v - a.v);
  const COLR = ['despair', 'despair', 'despair', 'ochre', 'ochre', 'ochre', 'ochre', 'stone', 'stone', 'stone'];
  writeBars('jobs-bulge-by-country', {
    chartId: 'jobs-bulge-by-country', kind: 'bars',
    title: 'Where the workforce swells most', unit: 'increase in working-age population (15–64) · millions · 2025–35',
    yearSpan: '2025–35', xmax: 95, xTicks: [0, 25, 50, 75], decimals: 1,
    bars: recs.map((r, i) => ({ label: r.name, value: r.v, color: COLR[i] ?? 'stone' })),
    provenance: prov(checksum, 'figure 2.8.C', 'The ten EMDEs whose working-age population (aged 15–64) grows most in absolute terms over 2025–35. India alone must absorb more than 90 million new working-age people.', 'UN World Population Prospects 2024'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure 2.8.C, working-age increase by country, thousands→millions' }],
  });
  facts.bulgeByCountry = Object.fromEntries(recs.map((r) => [r.code, r.v]));
}

/* ── 12. The playbook — employment growth, low vs high investment EMDEs (FIG ES.1.F) ── */
{
  const { rows, checksum } = readCSV('fig-ES1F-investment-employment.csv');
  const by: Record<string, number> = {};
  for (const x of rows) by[String(x.investment_group)] = r1(x.employment_growth_median);
  writeBars('jobs-investment-employment', {
    chartId: 'jobs-investment-employment', kind: 'bars',
    title: 'The lever that exists', unit: 'median employment growth · % per year · EMDEs, 2000–23',
    yearSpan: '2000–23', xmax: 3, xTicks: [0, 1, 2, 3], decimals: 1,
    bars: [
      { label: 'Low investment growth', value: by['Low'], color: 'stone' },
      { label: 'High investment growth', value: by['High'], color: 'hope' },
    ],
    provenance: prov(checksum, 'figure ES.1.F', 'Median annual employment growth in EMDEs in the bottom third versus the top third of investment growth, 2000–23 (difference significant at the 1% level). Investment is the closest thing to a lever on jobs.', 'Haver Analytics; ILOSTAT; WDI'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure ES.1.F, employment growth by investment tercile' }],
  });
  facts.investmentEmployment = by;
}

/* ── 13. The other lever — female-to-male labour-force participation by region (FIG 2.4.B, WDI) ── */
{
  const { rows, checksum } = readCSV('fig-24-female-participation.csv');
  const recs = rows.filter((x) => x.region !== 'AEs')
    .map((x) => ({ code: x.region, name: REGION[x.region], ratio: r2(x.female_to_male_ratio), lfp: r1(x.lfp_rate) }))
    .sort((a, b) => a.ratio - b.ratio);
  writeBars('jobs-female-participation', {
    chartId: 'jobs-female-participation', kind: 'bars',
    title: 'The half left out', unit: 'women in the labour force for every man · ratio · 2023',
    yearSpan: '2023', xmax: 0.6, xTicks: [0, 0.2, 0.4, 0.6], decimals: 2,
    bars: recs.map((r) => ({ label: r.name, value: r.ratio, color: r.ratio <= 0.3 ? 'despair' : r.ratio < 0.5 ? 'ochre' : 'stone' })),
    provenance: prov(checksum, 'figure 2.4.B', 'Median ratio of female to male labour-force participation by EMDE region, 2023. Where the ratio is lowest — the Middle East & North Africa and South Asia — a large share of working-age women are outside the labour force, the single largest untapped source of workers.', 'World Development Indicators'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure 2.4.B, female-to-male LFP ratio by region' }],
  });
  facts.femaleParticipation = Object.fromEntries(recs.map((r) => [r.code, { ratio: r.ratio, lfpRate: r.lfp }]));
  facts.femaleParticipation.AEsLfpRate = r1(rows.find((x) => x.region === 'AEs')!.lfp_rate);
}

/* ── 14. Off the farm — sectoral share of employment, 1991 vs 2023 (FIG 2.5.E, ILOSTAT/WDI) ── */
{
  const { rows, checksum } = readCSV('fig-25E-sectoral.csv');
  const seg = [
    { key: 'agriculture', label: 'Agriculture', color: 'ochre' },
    { key: 'industry', label: 'Industry', color: 'uncertain' },
    { key: 'services', label: 'Services', color: 'stone' },
  ];
  // order: EMDEs 1991, EMDEs 2023, Low-income 1991, Low-income 2023 (top→bottom)
  const ordered = [['EMDEs', 1991], ['EMDEs', 2023], ['Low-income', 1991], ['Low-income', 2023]] as const;
  const bars = ordered.map(([grp, yr]) => {
    const x = rows.find((r) => r.group === grp && r.year === yr)!;
    const segments = seg.map((s) => ({ value: r1(x[s.key]), color: s.color }));
    return { label: `${grp} · ${yr}`, value: r1(segments.reduce((a, b) => a + b.value, 0)), color: 'stone', segments };
  });
  writeBars('jobs-sectoral-shift', {
    chartId: 'jobs-sectoral-shift', kind: 'bars',
    title: 'Off the farm, into services', unit: 'share of employment by sector · % · 1991 vs 2023',
    yearSpan: '1991–2023', xmax: 100, xTicks: [0, 25, 50, 75, 100], decimals: 0,
    legend: seg.map((s) => ({ label: s.label, color: s.color })),
    bars,
    provenance: prov(checksum, 'figure 2.5.E', 'Share of total employment in agriculture, industry and services for EMDEs and low-income countries, 1991 and 2023. Work is leaving the farm — but moving mostly to services, while industry, the classic ladder out of poverty, barely grows.', 'ILOSTAT; UN World Population Prospects 2024'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure 2.5.E, sectoral employment shares' }],
  });
  facts.sectoral = Object.fromEntries(ordered.map(([grp, yr]) => {
    const x = rows.find((r) => r.group === grp && r.year === yr)!;
    return [`${grp}_${yr}`, { agriculture: r1(x.agriculture), industry: r1(x.industry), services: r1(x.services) }];
  }));
}

/* ── 15. Going backwards — economies poorer per capita than before the pandemic (FIG 3.2.B) ── */
{
  const { rows, checksum } = readCSV('fig-32B-scarring.csv');
  const NAME: Record<string, string> = { World: 'World', AEs: 'Advanced economies', EMDEs: 'EMDEs', LICs: 'Low-income countries', FCS: 'Fragile & conflict-affected' };
  const recs = rows.filter((x) => x.group !== 'IDA')
    .map((x) => ({ code: x.group, name: NAME[x.group] ?? x.group, post2020: r1(x.post2020), post2009: r1(x.post2009) }))
    .sort((a, b) => b.post2020 - a.post2020);
  writeBars('jobs-scarring', {
    chartId: 'jobs-scarring', kind: 'bars',
    title: 'Going backwards', unit: 'economies poorer per capita than before the pandemic · % of group · 2019 → 2025',
    yearSpan: '2019–25', xmax: 60, xTicks: [0, 20, 40, 60], decimals: 0,
    bars: recs.map((r) => ({ label: r.name, value: r.post2020,
      color: r.post2020 >= 40 ? 'despair' : r.post2020 >= 25 ? 'ochre' : 'stone' })),
    provenance: prov(checksum, 'figure 3.2.B', 'Share of economies in each group whose GDP per capita in 2025 remains below its 2019 level. After the 2008 crisis it was advanced economies that lagged (39.5%); after the pandemic the damage flipped to the poorest — most fragile states are poorer than before.', 'World Bank (2026a)'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure 3.2.B, economies poorer 5 years after recession, post-2020' }],
  });
  facts.scarring = Object.fromEntries(recs.map((r) => [r.code, { post2020: r.post2020, post2009: r.post2009 }]));
  facts.scarring.AEsPost2009 = r1(rows.find((x) => x.group === 'AEs')!.post2009);
}

/* ── Historical context strips for the bar movements (time series the report's workbooks carry) ── */

/* FIG.3 context — working-age population GROWTH RATE by group, 2000–2050 (FIG 2.3.B, UN WPP). The
   workforce is decelerating everywhere except low-income countries; China's has turned negative. */
{
  const { rows, checksum } = readCSV('fig-23B-wap-growth.csv');
  const mk = (key: 'emde' | 'lic' | 'china', name: string, def: string) => ({
    indicatorId: `jobs.wap_growth.${key}`, entity: key.toUpperCase(), entityName: name,
    unit: 'working-age population growth · % per year',
    points: rows.map((x) => ({ t: x.year as number, value: r2(x[key]) })),
    provenance: prov(checksum, 'figure 2.3.B', def, 'UN World Population Prospects 2024'),
    recipe: [{ op: 'transcribe_chart_pack', detail: `figure 2.3.B, ${key} working-age population growth` }],
  } as CanonicalSeries);
  writeSeries('jobs-wap-growth-emde', mk('emde', 'EMDEs', 'Annual growth of the working-age population (15–64) across emerging market and developing economies, 2000–2050.'), 'figure 2.3.B', checksum);
  writeSeries('jobs-wap-growth-lic', mk('lic', 'Low-income countries', 'Annual growth of the working-age population (15–64) in low-income countries, 2000–2050 — near 3% throughout, the only group that does not decelerate.'), 'figure 2.3.B', checksum);
  writeSeries('jobs-wap-growth-china', mk('china', 'China', 'Annual growth of the working-age population (15–64) in China, 2000–2050 — turning negative as it ages.'), 'figure 2.3.B', checksum);
}

/* FIG.4 context — employment ratio through the East Asian surge, Korea & Singapore (appendix A.4/A.5,
   ILOSTAT / Penn World Table via the report). What "absorbing the wave" actually looked like. */
{
  const k = readCSV('fig-A4A-korea-emp-ratio.csv');
  const s = readCSV('fig-A5A-singapore-emp-ratio.csv');
  writeSeries('jobs-korea-emp-ratio', {
    indicatorId: 'jobs.emp_ratio.korea', entity: 'KOR', entityName: 'Korea',
    unit: 'employment-to-population ratio · %',
    points: k.rows.map((x) => ({ t: x.year as number, value: r1(x.emp_ratio) })),
    provenance: prov(k.checksum, 'figure A.4.A', "Korea's employment-to-population ratio, 1979–2004 — rising through its youth-surge growth episode.", 'ILOSTAT; Feenstra, Inklaar & Timmer (2015)'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure A.4.A, Korea employment ratio' }],
  } as CanonicalSeries, 'figure A.4.A', k.checksum);
  writeSeries('jobs-singapore-emp-ratio', {
    indicatorId: 'jobs.emp_ratio.singapore', entity: 'SGP', entityName: 'Singapore',
    unit: 'employment-to-population ratio · %',
    points: s.rows.map((x) => ({ t: x.year as number, value: r1(x.emp_ratio) })),
    provenance: prov(s.checksum, 'figure A.5.A', "Singapore's employment-to-population ratio through its growth episode.", 'ILOSTAT; Feenstra, Inklaar & Timmer (2015)'),
    recipe: [{ op: 'transcribe_chart_pack', detail: 'figure A.5.A, Singapore employment ratio' }],
  } as CanonicalSeries, 'figure A.5.A', s.checksum);
}

/* ── Schooling by region (FIG 4.3.B, UIS) — prose support for the "least equipped" movement ── */
{
  const { rows } = readCSV('fig-43B-schooling-region.csv');
  facts.schoolingByRegion = Object.fromEntries(rows.map((x) => [x.region, r1(x.mean_years_schooling)]));
}

/* ── Facts only in prose (transcribed from the report text / figures; CC BY 3.0 IGO) ── */
facts.prose = {
  youthCohortBillion: { value: 1.2, unit: 'billion young people reach working age in EMDEs, 2025–35', where: 'Executive Summary' },
  illustrativeEmployed2035: { value: 400, unit: 'million of the 1.2bn would be employed in 2035 (illustrative)', where: 'Executive Summary / Ch.2 §2.4' },
  illustrativeNeet2035: { value: 300, unit: 'million of the 1.2bn would be NEET in 2035 (illustrative)', where: 'Executive Summary / Ch.1' },
  fcsYouth: { value: 'over one-fifth', count: '270 million', unit: 'young people in fragile and conflict-affected situations reach working age by 2035 — over one-fifth of the 1.2bn', where: 'figure 1.1.D / Ch.1' },
  femaleEmploymentLever: { value: '20–50%', unit: 'potential rise in GDP per capita from raising women’s employment to men’s level', where: 'Ch.4 / Pennings 2022' },
  ssaYouth2035: { value: 'over 330 million', unit: 'young people in Sub-Saharan Africa in 2035, ~2.5× the year-2000 figure', where: 'Executive Summary' },
  eastAsiaPeak: { value: 'almost 350 million', unit: 'young people entered working age in East Asia & Pacific in the decade to 1988', where: 'Executive Summary' },
  youngEmdeNeet2025: { value: '~240 million', unit: 'young EMDE NEETs as of 2025', where: 'figure 2.4 / Ch.2' },
  aiExposure: { world: 40, advanced: 60, unit: '% of jobs exposed to AI (≈60% in advanced economies)', where: 'figure 3.4 / Cazzaniga et al. 2024' },
  offline: { value: 2.7, unit: 'billion people remain offline', where: 'Ch.3' },
  licDataCapacity: { value: 'under 0.1%', unit: 'of global data-centre capacity is in low-income countries', where: 'Ch.3' },
  licChatgpt: { value: 'under 1%', unit: 'of global ChatGPT use is in low-income countries', where: 'Ch.3' },
  schoolingGap: { youthSurge: 4.3, otherEmde: 8.6, advanced: 12.4, unit: 'mean years of schooling', where: 'figure 4.3 / UIS' },
  koreaTertiary: { from: 31.3, to: 70.2, unit: '% tertiary enrollment, Korea 1985→1997', where: 'appendix A.4' },
  pandemicJobsLost: { value: 'over 250 million', unit: 'jobs lost globally in 2020 — about four times the global financial crisis', where: 'Ch.5' },
  threePillars: ['foundational infrastructure', 'a business-enabling environment', 'mobilizing private capital'],
  fiveSectors: ['infrastructure (including energy)', 'agribusiness and farming', 'health', 'tourism', 'value-added manufacturing'],
  bangaEpigraph: 'A job is the best way to drive a nail in the coffin of poverty.',
};

w(join(ROOT, 'src/data/derived/jobs-challenge-facts.json'), JSON.stringify(facts, null, 2));

console.log(`global-jobs-challenge: wrote derived series + jobs-challenge-facts.json from snapshot ${VINTAGE}`);