import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* What the world's debt is actually made of — the global pile split by who owes it: governments,
   non-financial corporations, and households. The headline "world debt at a record" hides that
   sovereign debt is only about a third of the total; roughly two-thirds is private. This is the
   reframe that justifies the rest of the article zooming into the sovereign slice, where the
   cross-border crises and the rich/poor divide actually live. BIS Total Credit (WS_TC), all
   reporting countries (5A), credit from all sectors, % of GDP at market value, adjusted for breaks.
   BIS terms are link-only: chart + cite + link, no re-hostable download. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const Y0 = 2008, Y1 = 2025;

// bottom → top; Government at the base so its rising slice reads off the lower edge
const BANDS: { code: string; name: string; color: string }[] = [
  { code: 'G', name: 'Governments', color: 'uncertain' },
  { code: 'N', name: 'Corporations', color: 'ochre' },
  { code: 'H', name: 'Households', color: 'stone' },
];

const snapDir = join(ROOT, 'data/sources/bis-tc', VINTAGE);
mkdirSync(snapDir, { recursive: true });

async function q4ByYear(code: string): Promise<Map<number, number>> {
  const url = `https://stats.bis.org/api/v1/data/WS_TC/Q.5A.${code}.A.M.770.A`;
  const res = await fetch(url, { headers: { Accept: 'application/vnd.sdmx.data+csv' } });
  if (!res.ok) throw new Error(`BIS WS_TC ${code}: HTTP ${res.status}`);
  const text = await res.text();
  writeFileSync(join(snapDir, `WS_TC.5A.${code}.csv`), text);
  const lines = text.trim().split('\n');
  const head = lines[0].split(',');
  const iT = head.indexOf('TIME_PERIOD'), iV = head.indexOf('OBS_VALUE');
  const m = new Map<number, number>();
  for (const ln of lines.slice(1)) {
    const c = ln.split(',');
    const tp = c[iT], v = parseFloat(c[iV]);
    if (tp?.endsWith('-Q4') && Number.isFinite(v)) {
      const y = parseInt(tp.slice(0, 4), 10);
      if (y >= Y0 && y <= Y1) m.set(y, Math.round(v * 10) / 10);
    }
  }
  return m;
}

const sectorData = new Map<string, Map<number, number>>();
let raw = '';
for (const b of BANDS) { const m = await q4ByYear(b.code); sectorData.set(b.code, m); raw += b.code + JSON.stringify([...m]); }

// years present in every band (so each year's stack is complete)
const years: number[] = [];
for (let y = Y0; y <= Y1; y++) if (BANDS.every((b) => sectorData.get(b.code)!.has(y))) years.push(y);

const bands = BANDS.map((b) => ({
  name: b.name, color: b.color,
  data: years.map((y) => [y, sectorData.get(b.code)!.get(y)!] as [number, number]),
}));

const checksum = sha256(raw);
const artifact = {
  chartId: 'debt-by-borrower', kind: 'area',
  title: 'What the world\'s debt is made of, by who owes it',
  unit: 'share of total world debt, by borrower',
  x0: years[0], x1: years[years.length - 1],
  xTicks: [2008, 2013, 2018, 2025].filter((t) => t >= years[0] && t <= years[years.length - 1]),
  bands,
  provenance: {
    source: 'bis', sourceIndicator: 'WS_TC — Credit to G/N/H from all sectors, % of GDP, all reporting countries',
    url: 'https://data.bis.org/topics/TOTAL_CREDIT',
    license: 'BIS terms — link-only (chart + cite + link, not re-hosted)', vintage: VINTAGE, checksum,
    definition: 'Total credit to governments, non-financial corporations, and households across all BIS-reporting economies, each as a share of the three-sector total, by year. Underlying values are credit as a percentage of GDP at market value, adjusted for breaks; the chart normalises them to borrower shares.',
    attribution: 'Bank for International Settlements — Total Credit Statistics', primarySource: 'BIS WS_TC, all reporting countries (5A)',
  },
  recipe: [{ op: 'composition_over_time', detail: 'BIS credit-to-GDP for government / corporations / households, all reporting countries, Q4 each year, normalised to borrower shares' }],
};

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/debt-by-borrower.json'), JSON.stringify(artifact, null, 2));

const last = years[years.length - 1];
const tot = (y: number) => BANDS.reduce((s, b) => s + sectorData.get(b.code)!.get(y)!, 0);
console.log(`✓ debt-by-borrower: ${years[0]}–${last} (${years.length} yrs)`);
for (const b of BANDS) {
  const sh = (y: number) => Math.round(sectorData.get(b.code)!.get(y)! / tot(y) * 100);
  console.log(`   ${b.name.padEnd(14)} ${years[0]}: ${sectorData.get(b.code)!.get(years[0])}% GDP (${sh(years[0])}% share) → ${last}: ${sectorData.get(b.code)!.get(last)}% GDP (${sh(last)}% share)`);
}
console.log(`   total credit ${years[0]}: ${tot(years[0]).toFixed(0)}% of GDP → ${last}: ${tot(last).toFixed(0)}% of GDP`);
