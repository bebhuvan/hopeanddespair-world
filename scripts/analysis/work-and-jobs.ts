import { createHash } from 'node:crypto';
import { writeFileSync, readFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/* "Is work getting better or worse?" — the labour disaggregations the registry's world lines can't
   carry (docs/ARTICLE-work-plan.md). One question, three magnifications: world → income group /
   region → country. The spine is ILOSTAT working poverty (DF_SDG_0111, SDG 1.1.1), the despair
   counter-melody is informal employment (DF_EMP_2IFL, modelled). Every value is pulled from the
   ILO SDMX aggregate areas (X-codes), never typed.

   Reads the aggregates snapshot the pipeline adapter wrote (data/sources/ilostat/<vintage>/<flow>/),
   or fetches + snapshots it if absent (snapshot-everything, like the cross-section script). Emits
   single-entity CanonicalSeries files (one per income group / region — the multi-line `dataRefs`),
   the informality income-gap bars, an income×measure synthesis grid, and the audited fact sheet.
   Run: npx tsx scripts/analysis/work-and-jobs.ts */

const ROOT = process.cwd();
const D = join(ROOT, 'src/data/derived');
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);

type Row = { area: string; sex: string; age: string; year: number; value: number };

/** Newest snapshot dir for a source family (dates sort lexicographically). */
function latestDir(base: string, leaf: string): string {
  const root = join(ROOT, base);
  if (!existsSync(root)) return '';
  const vintages = readdirSync(root).filter((d) => existsSync(join(root, d, leaf))).sort();
  return vintages.length ? join(root, vintages[vintages.length - 1], leaf) : '';
}

/** Raw aggregate CSV text for a dataflow (X-codes only). Reads the pipeline snapshot if present,
    else fetches the full all-areas CSV and snapshots just the aggregate rows. Header-indexed; note
    columns trail OBS_VALUE so a plain comma split is safe for the leading dimensions. */
async function loadAggText(dataflow: string): Promise<string> {
  const snap = latestDir('data/sources/ilostat', join(dataflow, 'raw.csv'));
  let text = snap ? readFileSync(snap, 'utf8') : '';
  if (!text || !/^X/m.test(text)) {
    const url = `https://sdmx.ilo.org/rest/data/${dataflow}/all?startPeriod=1990`;
    const res = await fetch(url, { headers: { Accept: 'application/vnd.sdmx.data+csv', 'Accept-Language': 'en' } });
    if (!res.ok) throw new Error(`ILOSTAT ${dataflow}: HTTP ${res.status}`);
    const full = res.text ? await res.text() : '';
    const lines = full.trim().split('\n');
    const iRA = lines[0].split(',').indexOf('REF_AREA');
    text = [lines[0], ...lines.slice(1).filter((l) => /^X/.test(l.split(',')[iRA]))].join('\n');
    const dir = join(ROOT, 'data/sources/ilostat', VINTAGE, dataflow);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'raw.csv'), text);
    writeFileSync(join(dir, 'snapshot.json'), JSON.stringify({ source: 'ilostat', slug: dataflow, vintage: VINTAGE, url, checksum: sha256(text), license: 'CC BY 4.0', fetchedAt: new Date().toISOString() }, null, 2));
    console.log(`  ↓ fetched + snapshotted ILOSTAT ${dataflow} (aggregates)`);
  }
  return text;
}

/** ILO SDMX aggregate rows with SEX/AGE parsed — the working-poverty / informality shape. */
async function readAgg(dataflow: string): Promise<Row[]> {
  const lines = (await loadAggText(dataflow)).trim().split('\n');
  const head = lines[0].split(',');
  const ix = (n: string) => head.indexOf(n);
  const iRA = ix('REF_AREA'), iSex = ix('SEX'), iAge = ix('AGE'), iT = ix('TIME_PERIOD'), iV = ix('OBS_VALUE'), iM = ix('UNIT_MULT');
  const out: Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const f = lines[i].split(',');
    const area = f[iRA];
    if (!/^X/.test(area)) continue;
    const year = +f[iT], mult = iM >= 0 ? parseInt(f[iM], 10) || 0 : 0, value = +f[iV] * 10 ** mult;
    if (!isFinite(year) || !isFinite(value)) continue;
    out.push({ area, sex: iSex >= 0 ? f[iSex] : '', age: iAge >= 0 ? f[iAge] : '', year, value });
  }
  return out;
}

/** Generic aggregate reader — keeps the raw field array so any dimension (SOC, STU, …) can be
    filtered. `ptsG(reader, area, {COL: value, …})` returns the matching time series. */
type AggG = { head: string[]; rows: { area: string; year: number; value: number; f: string[] }[] };
async function readAggG(dataflow: string): Promise<AggG> {
  const lines = (await loadAggText(dataflow)).trim().split('\n');
  const head = lines[0].split(',');
  const iRA = head.indexOf('REF_AREA'), iT = head.indexOf('TIME_PERIOD'), iV = head.indexOf('OBS_VALUE'), iM = head.indexOf('UNIT_MULT');
  const rows: AggG['rows'] = [];
  for (let i = 1; i < lines.length; i++) {
    const f = lines[i].split(',');
    if (!/^X/.test(f[iRA])) continue;
    const year = +f[iT], mult = iM >= 0 ? parseInt(f[iM], 10) || 0 : 0, value = +f[iV] * 10 ** mult;
    if (!isFinite(year) || !isFinite(value)) continue;
    rows.push({ area: f[iRA], year, value, f });
  }
  return { head, rows };
}
function ptsG(g: AggG, area: string, filt: Record<string, string>, yearMax = 9999): { t: number; value: number }[] {
  const idx = Object.entries(filt).map(([k, v]) => [g.head.indexOf(k), v] as const);
  return g.rows
    .filter((r) => r.area === area && r.year <= yearMax && idx.every(([j, v]) => r.f[j] === v))
    .map((r) => ({ t: r.year, value: r2(r.value) }))
    .sort((a, b) => a.t - b.t);
}

const r2 = (x: number) => Math.round(x * 100) / 100;

/** A sorted, capped time series for one (area, sex, age) slice. */
function points(rows: Row[], area: string, sex: string, age: string, yearMax = 9999): { t: number; value: number }[] {
  return rows
    .filter((r) => r.area === area && (sex === '' || r.sex === sex) && (age === '' || r.age === age) && r.year <= yearMax)
    .map((r) => ({ t: r.year, value: r2(r.value) }))
    .sort((a, b) => a.t - b.t);
}
const latestOf = (pts: { t: number; value: number }[]) => pts[pts.length - 1];

const prov = (definition: string, sourceIndicator: string, primarySource: string) => ({
  source: 'ilostat', sourceIndicator, url: 'https://ilostat.ilo.org',
  license: 'CC BY 4.0', vintage: VINTAGE, checksum: 'derived',
  definition, attribution: 'ILOSTAT — International Labour Organization', primarySource,
});

function writeSeries(id: string, o: { entity: string; entityName: string; unit: string; points: { t: number; value: number }[]; provenance: any; recipe: any }) {
  writeFileSync(join(D, `${id}.json`), JSON.stringify({ indicatorId: id, ...o }, null, 2));
  const p = o.points;
  console.log(`✓ ${id.padEnd(34)} ${p.length} pts  ${p[0].t}=${p[0].value} → ${p[p.length - 1].t}=${p[p.length - 1].value}`);
}

// ── the spine: working poverty (SDG 1.1.1), share of the employed living on <$2.15/day ──────────
const WP = await readAgg('DF_SDG_0111_SEX_AGE_RT');
const WP_DEF = 'Share of employed people living in a household below the extreme-poverty line ($2.15/day, 2017 PPP). ILO SDG indicator 1.1.1.';
const wpSeries = (area: string, sex = 'SEX_T', age = 'AGE_YTHADULT_YGE15') => points(WP, area, sex, age);

// income ladder (the hero divergence) and key regions — each a single-entity line file.
const INCOME: [string, string, string][] = [
  ['X02', 'Low income', 'low'], ['X03', 'Lower-middle income', 'lowermid'],
  ['X04', 'Upper-middle income', 'uppermid'], ['X05', 'High income', 'high'],
];
const REGION: [string, string, string][] = [
  ['X13', 'Sub-Saharan Africa', 'ssa'], ['X56', 'Southern Asia', 'southasia'],
  ['X45', 'Eastern Asia', 'eastasia'], ['X26', 'Latin America & Caribbean', 'latam'],
  ['X36', 'Arab States', 'arab'],
];
for (const [code, name, slug] of INCOME)
  writeSeries(`working-poverty-income-${slug}`, { entity: code, entityName: name, unit: '% of employed', points: wpSeries(code), provenance: prov(`${WP_DEF} ${name} economies.`, `DF_SDG_0111_SEX_AGE_RT [REF_AREA=${code}, SEX_T, 15+]`, 'ILOSTAT — ILO (SDG 1.1.1)'), recipe: [{ op: 'pick_area', detail: `ILO aggregate area ${code} (${name})` }] });
for (const [code, name, slug] of REGION)
  writeSeries(`working-poverty-region-${slug}`, { entity: code, entityName: name, unit: '% of employed', points: wpSeries(code), provenance: prov(`${WP_DEF} ${name}.`, `DF_SDG_0111_SEX_AGE_RT [REF_AREA=${code}, SEX_T, 15+]`, 'ILOSTAT — ILO (SDG 1.1.1)'), recipe: [{ op: 'pick_area', detail: `ILO aggregate area ${code} (${name})` }] });

// youth vs adults, women vs men (World) — same indicator, different SDMX dimensions.
writeSeries('working-poverty-youth-world', { entity: 'X01', entityName: 'Youth (15–24)', unit: '% of employed', points: wpSeries('X01', 'SEX_T', 'AGE_YTHADULT_Y15-24'), provenance: prov(`${WP_DEF} Employed youth aged 15–24, World.`, 'DF_SDG_0111_SEX_AGE_RT [X01, SEX_T, 15-24]', 'ILOSTAT — ILO (SDG 1.1.1)'), recipe: [{ op: 'pick_dims', detail: 'World, both sexes, ages 15–24' }] });
writeSeries('working-poverty-adult-world', { entity: 'X01', entityName: 'Adults (25+)', unit: '% of employed', points: wpSeries('X01', 'SEX_T', 'AGE_YTHADULT_YGE25'), provenance: prov(`${WP_DEF} Employed adults aged 25+, World.`, 'DF_SDG_0111_SEX_AGE_RT [X01, SEX_T, 25+]', 'ILOSTAT — ILO (SDG 1.1.1)'), recipe: [{ op: 'pick_dims', detail: 'World, both sexes, ages 25+' }] });
writeSeries('working-poverty-women-world', { entity: 'X01', entityName: 'Women', unit: '% of employed', points: wpSeries('X01', 'SEX_F'), provenance: prov(`${WP_DEF} Employed women aged 15+, World.`, 'DF_SDG_0111_SEX_AGE_RT [X01, SEX_F, 15+]', 'ILOSTAT — ILO (SDG 1.1.1)'), recipe: [{ op: 'pick_dims', detail: 'World, women, ages 15+' }] });
writeSeries('working-poverty-men-world', { entity: 'X01', entityName: 'Men', unit: '% of employed', points: wpSeries('X01', 'SEX_M'), provenance: prov(`${WP_DEF} Employed men aged 15+, World.`, 'DF_SDG_0111_SEX_AGE_RT [X01, SEX_M, 15+]', 'ILOSTAT — ILO (SDG 1.1.1)'), recipe: [{ op: 'pick_dims', detail: 'World, men, ages 15+' }] });

// ── the counter-melody: informal employment by income group (the gulf), latest settled year ─────
const INF = await readAgg('DF_EMP_2IFL_SEX_RT');
const infBars = INCOME.map(([code, name]) => {
  const lp = latestOf(points(INF, code, 'SEX_T', '', 2024));
  return { label: name, value: r2(lp.value), color: lp.value > 70 ? 'despair' : lp.value > 35 ? 'ochre' : 'hope' };
});
const infWorld = latestOf(points(INF, 'X01', 'SEX_T', '', 2024));
writeFileSync(join(D, 'informal-employment-by-income.json'), JSON.stringify({
  chartId: 'informal-employment-by-income', kind: 'bars',
  title: 'Informal work, by national income level',
  unit: `% of all jobs that are informal · ${infBars[0] && latestOf(points(INF, 'X02', 'SEX_T', '', 2024)).t} · world average ${r2(infWorld.value)}%`,
  xmax: 100, xTicks: [0, 25, 50, 75, 100],
  bars: infBars,
  provenance: prov('Share of total employment that is informal — no contract, no social-insurance coverage, outside the reach of labour law — by national income group, latest settled year. ILO modelled estimates.', 'DF_EMP_2IFL_SEX_RT [REF_AREA=X02..X05, SEX_T]', 'ILOSTAT — ILO (modelled)'),
  recipe: [{ op: 'cross_section_latest', detail: 'latest-year informal employment rate per ILO income aggregate' }],
}, null, 2));
console.log(`✓ informal-employment-by-income          ${infBars.map((b) => `${b.label.split(' ')[0]}=${b.value}`).join(' ')}`);

// ── child labour — scale the registry count series to millions for a legible two-estimate line ───
try {
  const cl = JSON.parse(readFileSync(join(D, 'child-labour-world.json'), 'utf8'));
  writeSeries('child-labour-world-mn', { entity: 'X01', entityName: 'World', unit: 'million children', points: cl.points.map((p: any) => ({ t: p.t, value: r2(p.value / 1e6) })), provenance: prov('Children aged 5–17 in child labour worldwide, in millions — the ILO & UNICEF Global Estimates (two rounds, 2020 and 2024).', 'DF_CLD_XCHL_SEX_AGE_NB [X01, SEX_T, 5–17]', 'ILO & UNICEF — Global Estimates of Child Labour'), recipe: [{ op: 'scale', detail: 'child-labour-world count ÷ 1e6' }] });
} catch { console.log('  (child-labour-world.json absent — skip child-labour-world-mn)'); }

// ── synthesis: the three faces of bad work across the income ladder (income × measure grid) ──────
// Each row scaled on its own (no cross-row composite — a point of poverty and a point of informality
// don't share a scale); columns ordered poorest→richest so the eye reads "this is what poverty buys".
const TRU = await readAgg('DF_EMP_2TRU_SEX_AGE_RT'); // time-related underemployment (want more hours)
const truAge = TRU.some((r) => r.age === 'AGE_YTHADULT_YGE15') ? 'AGE_YTHADULT_YGE15' : '';
type GRow = { label: string; short: string; unit: string; rows: Row[]; sex: string; age: string };
const GRID: GRow[] = [
  { label: 'Working poverty', short: 'Working poor', unit: '% of employed under $2.15/day', rows: WP, sex: 'SEX_T', age: 'AGE_YTHADULT_YGE15' },
  { label: 'Informal employment', short: 'Informal', unit: '% of jobs informal', rows: INF, sex: 'SEX_T', age: '' },
  { label: 'Underemployment', short: 'Want more hours', unit: '% wanting more hours', rows: TRU, sex: 'SEX_T', age: truAge },
];
const gridRows = GRID.map((g) => {
  const cells = INCOME.map(([code]) => { const lp = latestOf(points(g.rows, code, g.sex, g.age, 2024)); return { col: code.toLowerCase(), value: r2(lp.value), year: lp.t }; });
  const vals = cells.map((c) => c.value), vmin = Math.min(...vals), vmax = Math.max(...vals);
  return {
    label: g.label, short: g.short, unit: g.unit,
    cells: cells.map((c) => ({ col: c.col, value: c.value, year: c.year, t: r2(vmax === vmin ? 0.5 : (vmax - c.value) / (vmax - vmin)), display: c.value >= 10 ? `${Math.round(c.value)}%` : `${c.value.toFixed(1)}%` })),
  };
});
writeFileSync(join(D, 'work-quality-by-income.json'), JSON.stringify({
  chartId: 'work-quality-by-income', kind: 'heatgrid',
  title: 'The three faces of insecure work, across the income ladder',
  cols: INCOME.map(([code, name]) => ({ key: code.toLowerCase(), label: name, short: name.replace(' income', '') })),
  rows: gridRows,
  provenance: prov('Working poverty, informal employment and time-related underemployment for each national income group, latest settled year, shaded within each row from the worst group (red) to the best (green). No cross-row composite. Columns run poorest to richest.', 'DF_SDG_0111 · DF_EMP_2IFL · DF_EMP_2TRU [REF_AREA=X02..X05]', 'ILOSTAT — ILO'),
  recipe: [{ op: 'row_minmax', detail: 'per-row min–max of the latest income-group values; lower (less bad work) maps to green' }],
}, null, 2));
console.log(`✓ work-quality-by-income (grid)          ${gridRows.length} rows × ${INCOME.length} income groups`);

// ── social protection coverage (SDG 1.3.1) — the net that exists, by income over time ──────────
const SP = await readAggG('DF_SDG_0131_SEX_SOC_RT');
const spTotal = (area: string) => ptsG(SP, area, { SEX: 'SEX_T', SOC: 'SOC_CONTIG_TOTAL' });
const SP_DEF = 'Proportion of the population covered by at least one social protection cash benefit (SDG indicator 1.3.1).';
for (const [code, name, slug] of INCOME)
  writeSeries(`social-protection-income-${slug}`, { entity: code, entityName: name, unit: '% covered', points: spTotal(code), provenance: prov(`${SP_DEF} ${name} economies.`, `DF_SDG_0131_SEX_SOC_RT [REF_AREA=${code}, SEX_T, SOC_CONTIG_TOTAL]`, 'ILOSTAT — ILO (SDG 1.3.1)'), recipe: [{ op: 'pick_area', detail: `ILO aggregate area ${code} (${name})` }] });
writeSeries('social-protection-world', { entity: 'X01', entityName: 'World', unit: '% covered', points: spTotal('X01'), provenance: prov(`${SP_DEF} World.`, 'DF_SDG_0131_SEX_SOC_RT [X01, SEX_T, SOC_CONTIG_TOTAL]', 'ILOSTAT — ILO (SDG 1.3.1)'), recipe: [{ op: 'pick_dims', detail: 'World, both sexes, at least one benefit' }] });
const spWorld = spTotal('X01');
const spBranch = (soc: string) => latestOf(ptsG(SP, 'X01', { SEX: 'SEX_T', SOC: soc }));

// ── labour income share of GDP (SDG 10.4.1) — whose gains? the distribution axis ───────────────
const LS = await readAggG('DF_SDG_1041_NOC_RT');
const lsPts = (area: string) => ptsG(LS, area, {}, 2024); // cap the nowcast at the last settled year
const LS_DEF = 'Labour income share — the share of GDP paid to workers as wages plus the labour portion of self-employment income (SDG indicator 10.4.1). ILO modelled estimates.';
writeSeries('labour-share-world', { entity: 'X01', entityName: 'World', unit: '% of GDP', points: lsPts('X01'), provenance: prov(`${LS_DEF} World.`, 'DF_SDG_1041_NOC_RT [X01]', 'ILOSTAT — ILO (SDG 10.4.1)'), recipe: [{ op: 'pick_area', detail: 'World, capped at 2024' }] });
for (const [code, name, slug] of INCOME)
  writeSeries(`labour-share-income-${slug}`, { entity: code, entityName: name, unit: '% of GDP', points: lsPts(code), provenance: prov(`${LS_DEF} ${name} economies.`, `DF_SDG_1041_NOC_RT [REF_AREA=${code}]`, 'ILOSTAT — ILO (SDG 10.4.1)'), recipe: [{ op: 'pick_area', detail: `ILO aggregate area ${code} (${name}), capped at 2024` }] });

// ── child labour by school attendance (count) — deepens the floor: are working children in school? ──
const CLS = await readAggG('DF_CLD_XCHL_SEX_AGE_STU_NB');
const clsMn = (stu: string, year: number) => { const hit = ptsG(CLS, 'X01', { SEX: 'SEX_T', AGE: 'AGE_CLDVERSION_Y05-17', STU: stu }).find((q) => q.t === year); return hit ? r2(hit.value / 1e6) : NaN; };
const clSchool = (y: number) => ({ total: clsMn('STU_EDU_TOTAL', y), inSchool: clsMn('STU_EDU_YES', y), outSchool: clsMn('STU_EDU_NO', y) });
const cl2020 = clSchool(2020), cl2024 = clSchool(2024);
console.log(`✓ child labour schooling: 2024 in-school ${cl2024.inSchool}M / out ${cl2024.outSchool}M (out-share ${(100 * cl2024.outSchool / cl2024.total).toFixed(0)}%, 2020 was ${(100 * cl2020.outSchool / cl2020.total).toFixed(0)}%)`);

// ── the audited fact sheet — the only figures the prose may cite ─────────────────────────────────
const wp = (area: string, sex = 'SEX_T', age = 'AGE_YTHADULT_YGE15') => { const p = wpSeries(area, sex, age); return { first: p[0], last: latestOf(p) }; };
const world = wp('X01'), low = wp('X02'), high = wp('X05'), ssa = wp('X13'), eas = wp('X45'), sas = wp('X56');
const youth = wp('X01', 'SEX_T', 'AGE_YTHADULT_Y15-24'), adult = wp('X01', 'SEX_T', 'AGE_YTHADULT_YGE25');
const women = wp('X01', 'SEX_F'), men = wp('X01', 'SEX_M');
const facts = {
  note: 'Audited figures the article may cite. Regenerate with scripts/analysis/work-and-jobs.ts. ILOSTAT CC BY 4.0.',
  workingPoverty: {
    worldFirst: world.first, worldLast: world.last,
    lowIncomeLast: low.last, highIncomeLast: high.last,
    ssaFirst: ssa.first, ssaLast: ssa.last, eastAsiaFirst: eas.first, eastAsiaLast: eas.last, southAsiaLast: sas.last,
    youthLast: youth.last, adultLast: adult.last, womenLast: women.last, menLast: men.last,
  },
  informality: { worldLast: { t: infWorld.t, value: r2(infWorld.value) }, byIncome: infBars.map((b) => ({ group: b.label, value: b.value })) },
  socialProtection: {
    worldFirst: spWorld[0], worldLast: latestOf(spWorld),
    incomeLow: latestOf(spTotal('X02')), incomeHigh: latestOf(spTotal('X05')),
    unemploymentBranch: spBranch('SOC_CONTIG_UNE'), childrenBranch: spBranch('SOC_CONTIG_CHILD'), pensionBranch: spBranch('SOC_CONTIG_PENSION'),
  },
  labourShare: {
    worldFirst: lsPts('X01')[0], worldLast: latestOf(lsPts('X01')),
    incomeLow: latestOf(lsPts('X02')), incomeHigh: latestOf(lsPts('X05')),
  },
  childLabourSchool: { y2020: cl2020, y2024: cl2024 },
};
writeFileSync(join(D, 'work-headline-facts.json'), JSON.stringify(facts, null, 2));
console.log(`\n=== AUDIT ===`);
console.log(`  working poverty World ${world.first.t}=${world.first.value}% → ${world.last.t}=${world.last.value}%`);
console.log(`  by income (latest): low=${low.last.value}%  high=${high.last.value}%`);
console.log(`  by region: SSA ${ssa.first.t}=${ssa.first.value}→${ssa.last.t}=${ssa.last.value}  E.Asia ${eas.first.value}→${eas.last.value}  S.Asia→${sas.last.value}`);
console.log(`  youth=${youth.last.value}% adult=${adult.last.value}%  women=${women.last.value}% men=${men.last.value}%`);
console.log(`  informality World ${infWorld.t}=${r2(infWorld.value)}% · ${infBars.map((b) => `${b.label.split(' ')[0]}=${b.value}`).join(' ')}`);
console.log('\n✓ work-and-jobs artifacts written\n');
