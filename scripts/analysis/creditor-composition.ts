import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* Who each region owes — creditor composition of external public debt, by region (UNCTAD A World of
   Debt, an indicator set we had not been using). The divergent map: Latin America owes about seven
   in ten dollars to private bondholders, the markets that can flee fastest; Africa owes far more to
   governments and multilaterals, and increasingly to China. Same word, "debt", two different kinds
   of creditor and two different kinds of danger. Amount-weighted across each region's countries.
   Link-only (UNCTAD publication terms). Rendered as a magnification strip under the creditor movement. */

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
const ci = { name: h.indexOf('Name'), region: h.indexOf('Region'), ind: h.indexOf('Indicator'), yr: h.indexOf('year'), val: h.indexOf('value') };
const EXTUSD = 'External public debt in US$ billions', PRV = 'Private creditors as a share of external public debt';

// latest per country: external-debt amount + private share + region
const byCountry = new Map<string, { ext?: number; priv?: number; region: string; yE: string; yP: string }>();
for (let r = 1; r < rows.length; r++) {
  const ind = rows[r][ci.ind]; if (ind !== EXTUSD && ind !== PRV) continue;
  const v = parseFloat(rows[r][ci.val]); if (!Number.isFinite(v)) continue;
  const name = rows[r][ci.name], yr = String(rows[r][ci.yr]);
  const cur = byCountry.get(name) ?? { region: rows[r][ci.region], yE: '', yP: '' };
  if (ind === EXTUSD && yr > cur.yE) { cur.ext = v; cur.yE = yr; }
  if (ind === PRV && yr > cur.yP) { cur.priv = v; cur.yP = yr; }
  cur.region = rows[r][ci.region]; byCountry.set(name, cur);
}
const LABELS: Record<string, string> = {
  'Latin America and the Caribbean': 'Latin America', 'Developing Asia and Oceania': 'Developing Asia',
  'Africa': 'Africa', 'Europe and Central Asia*': 'Europe & C. Asia', 'Europe and Central Asia': 'Europe & C. Asia',
};
const agg = new Map<string, { extTot: number; privAmt: number }>();
for (const c of byCountry.values()) {
  if (!LABELS[c.region] || c.ext == null) continue;
  const a = agg.get(c.region) ?? { extTot: 0, privAmt: 0 };
  a.extTot += c.ext; if (c.priv != null) a.privAmt += c.ext * c.priv;
  agg.set(c.region, a);
}
const bars = [...agg.entries()].filter(([, a]) => a.extTot > 10).map(([region, a]) => {
  const priv = Math.round(a.privAmt / a.extTot * 100);
  return { label: LABELS[region], value: priv, color: 'uncertain', note: `· official + multilateral ${100 - priv}%` };
}).sort((a, b) => b.value - a.value);

const artifact = {
  chartId: 'debt-creditor-by-region', kind: 'bars',
  title: 'Who each region owes', unit: 'share of external public debt owed to private creditors, by region',
  yearSpan: `${vintage}`, xmax: 100, xTicks: [0, 25, 50, 75, 100],
  bars,
  provenance: {
    source: 'unctad', sourceIndicator: 'Private-creditor share of external public debt, amount-weighted by region',
    url: 'https://unctad.org/publication/world-of-debt',
    license: 'Link-only — UNCTAD publication terms (display + cite; not re-hosted)', vintage, checksum,
    definition: 'Share of external public debt owed to private creditors (bondholders, banks), amount-weighted across each region. The remainder is owed to official bilateral lenders (including China) and multilateral institutions. High private share = exposure to market runs; high official share = exposure to slow, fragmented restructuring.',
    attribution: 'UN Trade and Development (UNCTAD) — A World of Debt 2025', primarySource: 'UNCTAD; World Bank IDS',
  },
  recipe: [{ op: 'aggregate_by_region', detail: 'external-debt-weighted mean of private-creditor share across each region\'s countries, latest year' }],
};
mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/debt-creditor-by-region.json'), JSON.stringify(artifact, null, 2));
console.log(`✓ debt-creditor-by-region: ${bars.map((b) => `${b.label} ${b.value}% private`).join(' · ')}`);
