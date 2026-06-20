import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* External exposure — external public debt as a share of TOTAL public debt (UNCTAD A World of Debt).
   The honest original-sin measure (it replaces a misleading BIS-international-securities chart): what
   share of a government's debt is owed to foreigners, and so exposed to a foreign currency and a
   sudden stop. India and Brazil borrow overwhelmingly at home in their own currency (single digits to
   ~10%); the frontier and Sub-Saharan economies owe half or more abroad (Ethiopia 62%, Ghana/Kenya/
   Sri Lanka ~50%). The divide the flagship is built on, measured directly. Link-only (UNCTAD terms). */

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
const ci = { id: h.indexOf('ID'), ind: h.indexOf('Indicator'), yr: h.indexOf('year'), val: h.indexOf('value') };
const EXT = 'External public debt as a share of GDP', TOT = 'Public debt as a share of GDP';
function latest(ind: string) {
  const m = new Map<string, { y: string; v: number }>();
  for (let r = 1; r < rows.length; r++) {
    if (rows[r][ci.ind] !== ind) continue;
    const v = parseFloat(rows[r][ci.val]); if (!Number.isFinite(v)) continue;
    const k = rows[r][ci.id], y = String(rows[r][ci.yr]); const cur = m.get(k);
    if (!cur || y > cur.y) m.set(k, { y, v });
  }
  return m;
}
const ext = latest(EXT), tot = latest(TOT);

// Divergent spread: domestic-market borrowers (low) vs frontier / Sub-Saharan (high).
const SET: [string, string][] = [
  ['IN', 'India'], ['BR', 'Brazil'], ['TH', 'Thailand'], ['MX', 'Mexico'], ['NG', 'Nigeria'],
  ['AR', 'Argentina'], ['EG', 'Egypt'], ['MZ', 'Mozambique'], ['ZM', 'Zambia'], ['LK', 'Sri Lanka'],
  ['GH', 'Ghana'], ['KE', 'Kenya'], ['SN', 'Senegal'], ['ET', 'Ethiopia'],
];
const color = (s: number) => (s >= 40 ? 'despair' : s >= 20 ? 'ochre' : 'hope');
const bars = SET.map(([iso, name]) => {
  const e = ext.get(iso), t = tot.get(iso);
  if (!e || !t || t.v === 0) return null;
  return { label: name, value: Math.round((e.v / t.v) * 1000) / 10, color: color((e.v / t.v) * 100) };
}).filter(Boolean).sort((a: any, b: any) => b.value - a.value) as { label: string; value: number; color: string }[];

const artifact = {
  chartId: 'debt-external-share', kind: 'bars',
  title: 'External debt as a share of total public debt', unit: '% of public debt owed to foreign creditors · latest year',
  yearSpan: `${vintage}`, xmax: 70, xTicks: [0, 20, 40, 60],
  bars,
  provenance: {
    source: 'unctad', sourceIndicator: 'External public debt ÷ total public debt', url: 'https://unctad.org/publication/world-of-debt',
    license: 'Link-only — UNCTAD publication terms (display + cite; not re-hosted)', vintage, checksum,
    definition: 'External public debt as a share of total public debt, latest year. High = the government owes most of its debt to foreigners, in a currency it cannot print; low = it borrows at home in its own money. The real exposure to original sin and to a sudden stop.',
    attribution: 'UN Trade and Development (UNCTAD) — A World of Debt 2025', primarySource: 'UNCTAD; World Bank IDS',
  },
  recipe: [{ op: 'ratio', detail: 'external public debt %GDP ÷ total public debt %GDP, latest year; colour = exposure band' }],
};
mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/debt-external-share.json'), JSON.stringify(artifact, null, 2));
console.log(`✓ debt-external-share: ${bars.length} · ${bars[0].label} ${bars[0].value}% → ${bars[bars.length - 1].label} ${bars[bars.length - 1].value}%`);
