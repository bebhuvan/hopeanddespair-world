import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* Two new share-worthy cross-sections for the Money & Debt chart gallery, both from World Bank
   International Debt Statistics (CC BY 4.0), latest common year 2023, ranked across real countries:
   (1) bilateral public debt owed to China — who leans on Beijing most (the official bilateral figure;
       it undercounts loans routed through Chinese commercial/policy banks, so it is a floor);
   (2) debt service as a share of exports — how much of what a country earns abroad goes straight
       back out to creditors, the classic external-liquidity tripwire (a quarter is the warning line). */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const YEAR = 2023;

const AGG = new Set(['LMY', 'LIC', 'LMC', 'UMC', 'MIC', 'IDX', 'IBD', 'IBT', 'LDC', 'HIC', 'WLD', 'EAP', 'ECA', 'LAC', 'MNA', 'SAS', 'SSA', 'AFR', 'ARB', 'EAR', 'PRE', 'TEA', 'TEC', 'TLA', 'TMN', 'TSA', 'TSS', 'SST', 'EAS', 'ECS', 'MEA', 'OED', 'FCS', 'HPC', 'IDA', 'IDB', 'LTE', 'MID', 'PSS', 'SSF', 'LCN', 'EMU', 'INX']);
const snapDir = join(ROOT, 'data/sources/worldbank-ids', VINTAGE);
mkdirSync(snapDir, { recursive: true });
const NICE: Record<string, string> = { 'Egypt, Arab Rep.': 'Egypt', 'Congo, Dem. Rep.': 'DR Congo', 'Lao PDR': 'Laos', "Cote d'Ivoire": "Côte d'Ivoire", 'Venezuela, RB': 'Venezuela', 'Kyrgyz Republic': 'Kyrgyzstan' };

async function pull(series: string, counterpart: string): Promise<[number, string][]> {
  const url = `https://api.worldbank.org/v2/sources/6/country/all/series/${series}/counterpart-area/${counterpart}/time/YR${YEAR}/data?format=json&per_page=500`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WB IDS ${series}: HTTP ${res.status}`);
  const raw = await res.text();
  writeFileSync(join(snapDir, `${series}-${counterpart}-${YEAR}.json`), raw);
  const d = JSON.parse(raw);
  const rows: [number, string][] = [];
  for (const r of d.source?.data ?? []) {
    const v = Object.fromEntries((r.variable as any[]).map((x: any) => [x.concept, x]));
    const cc = v.Country.id;
    if (r.value == null || AGG.has(cc) || cc.length !== 3) continue;
    rows.push([r.value, NICE[v.Country.value] ?? v.Country.value]);
  }
  rows.sort((a, b) => b[0] - a[0]);
  return rows;
}

const mkBars = (rows: [number, string][], n: number, scale: (v: number) => number, color: (v: number) => string) =>
  rows.slice(0, n).map(([v, nm]) => ({ label: nm, value: Math.round(scale(v) * 10) / 10, color: color(scale(v)) }));

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });

// (1) Bilateral debt owed to China, US$bn
const china = await pull('DT.DOD.BLAT.CD', '730');
const chinaBars = mkBars(china, 14, (v) => v / 1e9, (v) => (v >= 15 ? 'despair' : v >= 5 ? 'ochre' : 'stone'));
writeFileSync(join(ROOT, 'src/data/derived/debt-owed-china-by-country.json'), JSON.stringify({
  chartId: 'debt-owed-china-by-country', kind: 'bars',
  title: 'Who owes China the most', unit: 'bilateral public debt owed to China · US$ billions · 2023',
  yearSpan: String(YEAR), xmax: 25, xTicks: [0, 5, 10, 15, 20, 25], decimals: 1, bars: chinaBars,
  provenance: {
    source: 'worldbank-ids', sourceIndicator: 'World Bank IDS DT.DOD.BLAT.CD, counterpart-area = China',
    url: 'https://databank.worldbank.org/source/international-debt-statistics', license: 'CC BY 4.0',
    vintage: VINTAGE, checksum: sha256(JSON.stringify(chinaBars)),
    definition: 'Outstanding bilateral public & publicly guaranteed debt owed to China, by country, 2023, US$ billions. Official bilateral figure; excludes loans classified to Chinese commercial or policy banks, so it is a lower bound.',
    attribution: 'World Bank International Debt Statistics', primarySource: 'WB IDS (source 6), counterpart-area China (730)',
  },
  recipe: [{ op: 'rank', detail: 'DT.DOD.BLAT.CD, counterpart China, top 14 borrowers, US$bn' }],
}, null, 2));

// (2) Debt service as % of exports
const dsx = await pull('DT.TDS.DECT.EX.ZS', 'WLD');
const dsxBars = mkBars(dsx, 14, (v) => v, (v) => (v >= 40 ? 'despair' : v >= 25 ? 'ochre' : 'stone'));
writeFileSync(join(ROOT, 'src/data/derived/debt-service-exports-by-country.json'), JSON.stringify({
  chartId: 'debt-service-exports-by-country', kind: 'bars',
  title: 'How much of export earnings goes to creditors', unit: 'total debt service as a share of exports · % · 2023',
  yearSpan: String(YEAR), xmax: 90, xTicks: [0, 25, 50, 75], decimals: 0,
  refLines: [{ y: 25, label: 'warning line' }], bars: dsxBars,
  provenance: {
    source: 'worldbank-ids', sourceIndicator: 'World Bank IDS DT.TDS.DECT.EX.ZS — debt service to exports',
    url: 'https://databank.worldbank.org/source/international-debt-statistics', license: 'CC BY 4.0',
    vintage: VINTAGE, checksum: sha256(JSON.stringify(dsxBars)),
    definition: 'Total external debt service (principal + interest) as a percentage of exports of goods, services and primary income, by country, 2023. A quarter of exports is a commonly cited warning threshold.',
    attribution: 'World Bank International Debt Statistics', primarySource: 'WB IDS (source 6), DT.TDS.DECT.EX.ZS',
  },
  recipe: [{ op: 'rank', detail: 'DT.TDS.DECT.EX.ZS, top 14, % of exports, ref line at 25%' }],
}, null, 2));

console.log('✓ China borrowers:', chinaBars.slice(0, 4).map((b) => `${b.label} ${b.value}`).join(', '));
console.log('✓ Debt service/exports:', dsxBars.slice(0, 4).map((b) => `${b.label} ${b.value}%`).join(', '));
