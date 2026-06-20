import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

/* The danger zone, counted — how many low-income countries the IMF–World Bank rates as "in debt
   distress" or "at high risk" of it, over time. This is the scoreboard of the tightening trap: the
   countries the article's red-lines chart (FIG. 4) diagnoses one at a time, here totalled across all
   PRGT-eligible low-income countries and tracked year by year. The share in distress-or-high-risk
   roughly doubled, from about one in five LICs in 2013 to about one in two since 2020.

   The IMF rewrites its public "List of LIC DSAs" each month at a single fixed URL, overwriting the
   prior month, so there is no historical file to pull. We therefore read immutable Internet Archive
   captures of that PDF (one per year) and parse the IMF's own summary footnote ("N countries are in
   debt distress, M countries are at high risk, ..."). The counts are IMF facts, displayed and cited;
   the source PDF is not re-hosted. Requires `pdftotext` (poppler) on PATH. */

const ROOT = process.cwd();
const sha256 = (s: Buffer | string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const DSA = 'https://www.imf.org/external/pubs/ft/dsa/dsalist.pdf';

// One immutable Wayback capture per year (timestamp verified to return that year's list).
const CAPTURES: { ts: string }[] = [
  { ts: '20131203034420' }, { ts: '20150321171925' },
  { ts: '20170922145234' }, { ts: '20180225101117' }, { ts: '20190907004935' },
  { ts: '20201222041557' }, { ts: '20211205041810' }, { ts: '20221013094855' },
  { ts: '20231201021300' }, { ts: '20241202074611' }, { ts: '20251101212143' },
  { ts: '20260414120248' },
];

const snapDir = join(ROOT, 'data/sources/imf-dsf', VINTAGE);
mkdirSync(snapDir, { recursive: true });

const FOOT = /(\d+)\s+countr(?:y|ies)\s+(?:are\s+)?in debt distress,\s*(\d+)\s+countr(?:y|ies)\s+(?:are\s+)?at high risk,\s*(\d+)\s+countr(?:y|ies)\s+(?:are\s+)?at moderate risk,\s*and\s*(\d+)\s+countr(?:y|ies)\s+(?:are\s+)?at low risk/i;
const ASOF = /As of\s+([A-Za-z]+ \d{1,2}, \d{4})/;

type Row = { year: number; asOf: string; distress: number; high: number; moderate: number; low: number };
const rows: Row[] = [];

for (const c of CAPTURES) {
  const url = `http://web.archive.org/web/${c.ts}id_/${DSA}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Wayback ${c.ts}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const pdfPath = join(snapDir, `dsalist-${c.ts}.pdf`);
  writeFileSync(pdfPath, buf);

  const flat = execFileSync('pdftotext', [pdfPath, '-'], { encoding: 'utf8' }).replace(/\s+/g, ' ');
  const asOf = (flat.match(ASOF)?.[1]) ?? '?';
  const year = parseInt(asOf.match(/\d{4}/)?.[0] ?? '0', 10);

  let distress: number, high: number, moderate: number, low: number;
  const fm = flat.match(FOOT);
  if (fm) {
    [distress, high, moderate, low] = fm.slice(1, 5).map(Number);
  } else {
    // Newer lists (2024+) drop the summary footnote: count the rating column from the table layout.
    const lay = execFileSync('pdftotext', ['-layout', pdfPath, '-'], { encoding: 'utf8' });
    const cnt = { 'In debt distress': 0, High: 0, Moderate: 0, Low: 0 };
    for (const line of lay.split('\n')) {
      if (!/^\s*\d+\s+[A-Za-z]/.test(line)) continue;
      for (const k of ['In debt distress', 'High', 'Moderate', 'Low'] as const) {
        if (new RegExp(`\\b${k}\\b`).test(line)) { cnt[k]++; break; }
      }
    }
    distress = cnt['In debt distress']; high = cnt.High; moderate = cnt.Moderate; low = cnt.Low;
  }
  if (distress + high + moderate + low === 0) { console.warn(`⚠ skipped ${c.ts} (${asOf}): no ratings parsed`); continue; }
  rows.push({ year, asOf, distress, high, moderate, low });
}
rows.sort((a, b) => a.year - b.year);

const checksum = sha256(JSON.stringify(rows));
const prov = (def: string) => ({
  source: 'imf-dsf', sourceIndicator: 'List of LIC DSAs for PRGT-Eligible Countries — risk-of-debt-distress ratings',
  url: 'https://www.imf.org/external/pubs/ft/dsa/dsalist.pdf',
  license: 'IMF — published DSA risk ratings (facts); displayed and cited, source PDF not re-hosted',
  vintage: VINTAGE, checksum, definition: def,
  attribution: 'IMF–World Bank Debt Sustainability Framework for Low-Income Countries',
  primarySource: 'IMF List of LIC DSAs for PRGT-Eligible Countries (Internet Archive captures, one per year)',
});

const total = (r: Row) => r.distress + r.high + r.moderate + r.low;
const mk = (id: string, name: string, def: string, pick: (r: Row) => number) => ({
  indicatorId: id, entity: 'LIC', entityName: name, unit: 'number of low-income countries',
  points: rows.map((r) => ({ t: r.year, value: pick(r) })),
  provenance: prov(def), recipe: [{ op: 'count_ratings', detail: 'count of PRGT-eligible LICs by IMF risk-of-debt-distress rating, by year' }],
});

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/distress-zone.json'), JSON.stringify(
  mk('debt.distress_zone.lic', 'In debt distress or at high risk',
    'Number of PRGT-eligible low-income countries the IMF–World Bank DSF rates as in debt distress OR at high risk of debt distress, by year.',
    (r) => r.distress + r.high), null, 2));
writeFileSync(join(ROOT, 'src/data/derived/distress-indefault.json'), JSON.stringify(
  mk('debt.in_distress.lic', 'Already in debt distress',
    'Number of PRGT-eligible low-income countries the IMF–World Bank DSF rates as already in debt distress, by year.',
    (r) => r.distress), null, 2));

console.log('✓ IMF DSF distress counts (in distress / high / total rated):');
for (const r of rows) {
  const t = total(r);
  console.log(`   ${r.asOf.padEnd(20)} distress ${String(r.distress).padStart(2)} · high ${String(r.high).padStart(2)} · D+H ${String(r.distress + r.high).padStart(2)} / ${t}  (${Math.round((r.distress + r.high) / t * 100)}%)`);
}
