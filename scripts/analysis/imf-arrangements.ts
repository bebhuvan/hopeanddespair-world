import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The serial borrowers — how many IMF financing arrangements each country has signed. The IMF is
   the lender of last resort; for some countries it has become a near-permanent fixture. Built from
   the IMF MONA database (Monitoring of Fund Arrangements): the "historical" file (1992–2003) merged
   with the "current" file (2000–2026), deduplicated by country + approval date. MONA does not reach
   before ~1992, so this is a three-decade count, NOT a lifetime one (Argentina's famous ~21 reach
   back to 1958; over the past three decades Ukraine and Pakistan lead). Colour marks whether a
   country's programmes are mostly crisis bailouts (Stand-By / Extended Fund) or concessional
   low-income facilities (ECF/PRGF), which behave very differently. IMF source — link-only. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const dir = join(ROOT, 'data/sources/imf-mona');
const vintage = readdirSync(dir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!;

function parseCSV(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (c !== '\r') f += c;
  }
  if (f.length || row.length) { row.push(f); rows.push(row); }
  return rows;
}

const MON: Record<string, string> = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
function toISO(s: string): string {
  s = s.trim();
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);                 // M/D/YYYY (historical)
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  m = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/);                   // D-Mon-YY (current)
  if (m) return `20${m[3]}-${MON[m[2].toLowerCase()]}-${m[1].padStart(2, '0')}`;
  return s;
}

const CRISIS = ['SBA', 'EFF', 'FCL', 'PLL', 'PCL'];
const CONCESS = ['ECF', 'PRGF', 'SCF', 'PSI', 'PCI', 'ESF', 'ESAF', 'SAF'];
const isConcessional = (t: string) => CONCESS.some((k) => t.includes(k)) && !(CRISIS.includes(t));

// clean the ALL-CAPS, comma-suffixed MONA country names → display form. Distinct countries that
// share a pre-comma token (Congo, Korea) must NOT collapse — aggregation keys on the unique IMF
// code, and the label keeps them apart explicitly.
function clean(name: string): string {
  const up = name.toUpperCase();
  if (up.includes('CONGO')) return up.includes('DEM') ? 'DR Congo' : 'Congo, Rep.';
  if (up.includes('KOREA')) return up.includes('DEM') ? 'North Korea' : 'Korea';
  const base = name.split(',')[0].trim().toLowerCase();
  return base.replace(/\b([a-z])/g, (c) => c.toUpperCase()).replace(/\bAnd\b/g, 'and').replace(/\bThe\b/g, 'the');
}

type Arr = { code: string; country: string; type: string; iso: string };
const merged = new Map<string, Arr>();   // key: code + approval ISO date (dedupe the 2000–03 seam)
let raw = '';

for (const file of ['mona-historical.csv', 'mona-current.csv']) {
  const text = readFileSync(join(dir, vintage, file), 'utf8'); raw += text;
  const rows = parseCSV(text); const h = rows[0];
  const ci = { num: h.indexOf('Arrangement Number'), name: h.indexOf('Country Name'), code: h.indexOf('Country Code'), type: h.indexOf('Arrangement Type'), date: h.indexOf('Approval date') };
  for (const r of rows.slice(1)) {
    if (!r[ci.num]) continue;
    const iso = toISO(r[ci.date]);
    merged.set(`${r[ci.code]}|${iso}`, { code: r[ci.code], country: clean(r[ci.name]), type: r[ci.type].trim(), iso });
  }
}

// count + classify per country — keyed on the unique IMF country code, never the display name
const agg = new Map<string, { country: string; total: number; concess: number }>();
for (const a of merged.values()) {
  const g = agg.get(a.code) ?? { country: a.country, total: 0, concess: 0 };
  g.total++; if (isConcessional(a.type)) g.concess++;
  agg.set(a.code, g);
}

const TOP = 14;
const ranked = [...agg.values()].sort((a, b) => b.total - a.total).slice(0, TOP);
const bars = ranked.map((g) => ({
  label: g.country, value: g.total,
  // mostly concessional low-income programmes (stone) vs mostly crisis bailouts (despair)
  color: g.concess > g.total / 2 ? 'stone' : 'despair',
}));

const years = [...merged.values()].map((a) => parseInt(a.iso.slice(0, 4), 10)).filter((y) => y > 1900);
const checksum = sha256(raw);
const artifact = {
  chartId: 'imf-arrangements-by-country', kind: 'bars',
  title: 'Countries with the most IMF arrangements since 1992',
  unit: `number of IMF financing arrangements, ${Math.min(...years)}–${Math.max(...years)}`,
  yearSpan: `${Math.min(...years)}–${Math.max(...years)}`,
  xmax: 15, xTicks: [0, 5, 10, 15], decimals: 0,
  bars,
  provenance: {
    source: 'imf-mona', sourceIndicator: 'MONA — count of Fund arrangements approved, by member',
    url: 'https://www.imf.org/external/np/fin/mona/',
    license: 'IMF — arrangement records (facts); displayed and cited, source files not re-hosted', vintage, checksum,
    definition: 'Number of distinct IMF financing arrangements (Stand-By, Extended Fund Facility, ECF/PRGF and other facilities) a country has had approved, 1992 onward, from the IMF Monitoring of Fund Arrangements database (historical 1992–2003 + current 2000–present, deduplicated). MONA does not extend before ~1992, so lifetime totals (e.g. Argentina from 1958) are larger. Red = mostly crisis bailouts; grey = mostly concessional low-income programmes.',
    attribution: 'International Monetary Fund — Monitoring of Fund Arrangements (MONA)', primarySource: 'IMF MONA historical + current arrangement files',
  },
  recipe: [{ op: 'count_arrangements', detail: 'merge MONA historical + current, dedupe by country + approval date, count arrangements per country, rank top 14; colour = dominant facility class' }],
};

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/imf-arrangements-by-country.json'), JSON.stringify(artifact, null, 2));
console.log(`✓ imf-arrangements-by-country: ${merged.size} arrangements ${Math.min(...years)}–${Math.max(...years)}, ${agg.size} countries`);
for (const b of bars) console.log(`   ${String(b.value).padStart(2)}  ${b.label.padEnd(22)} ${b.color === 'despair' ? '(crisis)' : '(concessional)'}`);
