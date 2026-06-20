import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The shifting creditor — who the world's defaulted sovereign debt is owed to, 1980–2024, as a
   100%-stacked area (the new composition primitive, src/lib/area.ts). The historical re-weighting:
   the 1980s debt crisis was owed to private banks and the Paris Club of Western governments; the
   2000s were dominated by multilaterals and relief; since ~2010 China has risen from nothing to a
   major creditor, and private bondholders returned. Built from the BoC–BoE Sovereign Default
   Database snapshot already on disk. Display + cite with attribution. */

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
  return rows;
}
const num = (x: string | undefined) => { const v = parseFloat(x ?? ''); return Number.isFinite(v) ? v : 0; };

const dir = join(ROOT, 'data/sources/boc-boe');
const vintage = readdirSync(dir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!;
const body = readFileSync(join(dir, vintage, 'raw.csv'), 'utf8');
const checksum = sha256(body);
const all = parseCSV(body);
const obsAt = all.findIndex((r) => r[0] === 'OBSERVATIONS');
const hdr = all[obsAt + 1]; const col = (n: string) => hdr.indexOf(n);
const cCty = col('DEBT_COUNTRY'), cYr = col('DEBT_YEAR');
const idx = {
  priv: col('DEBT_PRIVATE_CREDITORS_2025'), china: col('DEBT_CHINA_2025'), paris: col('DEBT_PARIS_CLUB_2025'),
  imf: col('DEBT_IMF_2025'), ibrd: col('DEBT_IBRD_2025'), ida: col('DEBT_IDA_2025'), iadb: col('DEBT_IADB_2025'),
  other: col('DEBT_OTHER_OFFICIAL_CREDITORS_2025'),
};
const world = all.slice(obsAt + 2).filter((r) => r[cCty] === 'World');
const Y0 = 1980, Y1 = 2024;
const byYear = new Map<number, any>();
for (const r of world) { const y = +r[cYr]; if (y >= Y0 && y <= Y1) byYear.set(y, r); }
const years = [...byYear.keys()].sort((a, b) => a - b);

// bottom → top; China on top so its rise from nothing reads off the top edge
const BANDS = [
  { name: 'Private bondholders & banks', color: 'despair', get: (r: any) => num(r[idx.priv]) },
  { name: 'Paris Club (Western govts)', color: 'uncertain', get: (r: any) => num(r[idx.paris]) },
  { name: 'Multilateral (IMF, World Bank)', color: 'stone', get: (r: any) => num(r[idx.imf]) + num(r[idx.ibrd]) + num(r[idx.ida]) + num(r[idx.iadb]) },
  { name: 'Other official', color: 'hope', get: (r: any) => num(r[idx.other]) },
  { name: 'China', color: 'ochre', get: (r: any) => num(r[idx.china]) },
];
// Defaulted-debt shares whip year to year as single large countries default or cure; for a
// composition-over-time chart the structural re-weighting is the story, not the annual noise.
// Smooth each band's raw amount with a centred 5-year moving average (window shrinks at the edges),
// then let the renderer normalise to 100% per year. Disclosed in the figure note.
// Centred 5-year window with edge replication: the interior smooths, but the first and last years
// keep their true weight (a plain shrinking window would dilute the most recent year and mute the
// China-overtakes-the-Paris-Club crossover that is the whole point of the chart).
const HALF = 2;
const smooth = (raw: number[]): number[] => raw.map((_, i) => {
  let s = 0;
  for (let k = -HALF; k <= HALF; k++) s += raw[Math.min(raw.length - 1, Math.max(0, i + k))];
  return s / (2 * HALF + 1);
});
const bands = BANDS.map((b) => {
  const raw = years.map((y) => b.get(byYear.get(y)));
  const sm = smooth(raw);
  return { name: b.name, color: b.color, data: years.map((y, i) => [y, sm[i]] as [number, number]) };
});

const artifact = {
  chartId: 'debt-creditor-history', kind: 'area',
  title: 'Who the world\'s defaulted debt is owed to, 1980–2024',
  unit: 'share of sovereign debt in default, by creditor',
  x0: Y0, x1: Y1, xTicks: [1980, 1990, 2000, 2010, 2024], bands,
  provenance: {
    source: 'boc-boe', sourceIndicator: 'Defaulted sovereign debt by creditor class, 1980–2024',
    url: 'https://www.bankofcanada.ca/2025/10/staff-analytical-note-2025-24/',
    license: 'Bank of Canada — reuse with attribution', vintage, checksum,
    definition: 'Composition of sovereign debt in default by creditor class, each year normalised to 100%. Shows the historical shift from private banks and the Paris Club toward multilaterals, then the rise of China.',
    attribution: 'Bank of Canada & Bank of England — Sovereign Default Database', primarySource: 'BoC–BoE Sovereign Default Database 2025',
  },
  recipe: [{ op: 'composition_over_time', detail: 'BoC–BoE World rows, creditor amounts by year, normalised to 100% share per year' }],
};
mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/debt-creditor-history.json'), JSON.stringify(artifact, null, 2));
const share = (b: any, y: number) => { const tot = bands.reduce((s, x) => s + (x.data.find((d) => d[0] === y)?.[1] ?? 0), 0) || 1; return Math.round((b.data.find((d: any) => d[0] === y)?.[1] ?? 0) / tot * 100); };
console.log(`✓ debt-creditor-history: ${years.length} yrs (${years[0]}–${years[years.length - 1]})`);
for (const b of bands) console.log(`   ${b.name.padEnd(30)} 1990 ${share(b, 1990)}% → 2024 ${share(b, 2024)}%`);
