import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* Debt levels — public debt as a share of GDP, a curated cross-section (UNCTAD "A World of Debt").
   The "level isn't the danger" reframe (docs/ARTICLE-debt-plan.md M3): Japan rolls ~230% of GDP in
   its own currency without crisis; Sri Lanka defaulted near 100%. High debt sits in calm advanced
   economies AND in the distress tail — the bar height alone predicts nothing. Link-only (UNCTAD
   publication terms): displayed + cited, not re-hosted. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
function parseCSV(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; } else field += c; }
    else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1);
}

const dir = join(ROOT, 'data/sources/unctad');
const vintage = readdirSync(dir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!;
const csv = readFileSync(join(dir, vintage, 'wod-2025-consolidated.csv'), 'utf8');
const checksum = sha256(csv);
const rows = parseCSV(csv); const h = rows[0];
const cId = h.indexOf('ID'), cInd = h.indexOf('Indicator'), cYear = h.indexOf('year'), cVal = h.indexOf('value');
const PD = 'Public debt as a share of GDP';
const latestByIso = new Map<string, { year: string; value: number }>();
for (let r = 1; r < rows.length; r++) {
  if (rows[r][cInd] !== PD) continue;
  const v = parseFloat(rows[r][cVal]); if (!Number.isFinite(v)) continue;
  const iso = rows[r][cId], yr = String(rows[r][cYear]); const cur = latestByIso.get(iso);
  if (!cur || yr > cur.year) latestByIso.set(iso, { year: yr, value: v });
}

// Curated spread. 'calm' = advanced, own-currency borrower, no crisis (hope); 'distress' = recent
// default/restructuring or acute strain (despair); 'mid' = neither (stone). The point: height ≠ danger.
const SET: [string, string, 'calm' | 'distress' | 'mid'][] = [
  ['JP', 'Japan', 'calm'], ['IT', 'Italy', 'calm'], ['US', 'United States', 'calm'],
  ['FR', 'France', 'calm'], ['GB', 'United Kingdom', 'calm'], ['SG', 'Singapore', 'calm'],
  ['LB', 'Lebanon', 'distress'], ['LK', 'Sri Lanka', 'distress'], ['ZM', 'Zambia', 'distress'],
  ['AR', 'Argentina', 'distress'], ['GH', 'Ghana', 'distress'], ['EG', 'Egypt', 'distress'],
  ['DE', 'Germany', 'mid'], ['ID', 'Indonesia', 'mid'], ['NG', 'Nigeria', 'mid'],
];
const COLOR = { calm: 'hope', distress: 'despair', mid: 'stone' } as const;
const bars = SET.map(([iso, label, cls]) => ({ iso, label, cls, v: latestByIso.get(iso)?.value }))
  .filter((b) => b.v != null)
  .map((b) => ({ label: b.label, value: Math.round(b.v! * 1000) / 10, color: COLOR[b.cls] }))  // fraction → %
  .sort((a, b) => b.value - a.value);

const artifact = {
  chartId: 'debt-gdp-by-country', kind: 'bars',
  title: 'Public debt as a share of GDP, latest year', unit: '% of GDP · green = calm advanced borrower · red = in debt distress',
  yearSpan: `${vintage}`, xmax: Math.ceil(Math.max(...bars.map((b) => b.value)) / 50) * 50, xTicks: [0, 60, 120, 180, 240],
  bars,
  provenance: {
    source: 'unctad', sourceIndicator: 'Public debt as a share of GDP', url: 'https://unctad.org/publication/world-of-debt',
    license: 'Link-only — UNCTAD publication terms (display + cite; not re-hosted)', vintage, checksum,
    definition: 'General government gross debt, % of GDP, latest available year; a curated spread of calm high-debt advanced economies against the distress tail. Link-only: charted and cited, not re-hosted.',
    attribution: 'UN Trade and Development (UNCTAD) — A World of Debt 2025', primarySource: 'UNCTAD; IMF WEO',
  },
  recipe: [{ op: 'cross_section_latest', detail: 'latest-year public-debt %GDP, curated spread, sorted descending; colour = distress status not debt level' }],
};
mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/debt-gdp-by-country.json'), JSON.stringify(artifact, null, 2));
console.log(`✓ debt-gdp-by-country: ${bars.length} · ${bars[0].label} ${bars[0].value}% → ${bars[bars.length - 1].label} ${bars[bars.length - 1].value}% (UNCTAD ${vintage})`);
