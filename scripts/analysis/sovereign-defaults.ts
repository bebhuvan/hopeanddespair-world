import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* Sovereign defaults — the BoC–BoE Sovereign Default Database (1960–2024), via the Bank of Canada
   Valet API (group DEBT_2025). The modern default census: government debt in default, by creditor
   and instrument. Powers the debt article's "who do you owe" (the China-creditor shift) and the
   hope read ("Coming back" — the default stock is small and shrinking: ~US$425bn in 2024, 0.4% of
   world public debt). Display + cite with attribution to the Bank of Canada / Bank of England
   (BoC terms permit reuse with attribution); no re-hostable download artifact is emitted. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const URL = 'https://www.bankofcanada.ca/valet/observations/group/DEBT_2025/csv';

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
const n = (x: string | undefined): number | null => { const v = parseFloat(x ?? ''); return Number.isFinite(v) ? v : null; };

const res = await fetch(URL);
if (!res.ok) throw new Error(`BoC Valet DEBT_2025: HTTP ${res.status}`);
const body = await res.text();
const checksum = sha256(body);
const snapDir = join(ROOT, 'data/sources/boc-boe', VINTAGE);
mkdirSync(snapDir, { recursive: true });
writeFileSync(join(snapDir, 'raw.csv'), body);
writeFileSync(join(snapDir, 'snapshot.json'), JSON.stringify({
  source: 'boc-boe', slug: 'DEBT_2025', vintage: VINTAGE, url: URL, checksum,
  license: 'Bank of Canada terms — reuse permitted with attribution', fetchedAt: new Date().toISOString(),
  note: 'BoC–BoE Sovereign Default Database 1960–2024; values in US$ millions.',
}, null, 2));

const all = parseCSV(body);
const obsAt = all.findIndex((r) => r[0] === 'OBSERVATIONS');
const header = all[obsAt + 1];
const col = (name: string) => header.indexOf(name);
const cCountry = col('DEBT_COUNTRY'), cYear = col('DEBT_YEAR');
const idx = {
  total: col('DEBT_TOTAL_2025'), defrate: col('DEBT_DEFRATE_WORLD_PUBLIC_DEBT_2025'),
  gross: col('DEBT_GROSS_WORLD_PUBLIC_DEBT_2025'),
  china: col('DEBT_CHINA_2025'), paris: col('DEBT_PARIS_CLUB_2025'), imf: col('DEBT_IMF_2025'),
  ibrd: col('DEBT_IBRD_2025'), ida: col('DEBT_IDA_2025'), iadb: col('DEBT_IADB_2025'),
  otherOff: col('DEBT_OTHER_OFFICIAL_CREDITORS_2025'), priv: col('DEBT_PRIVATE_CREDITORS_2025'),
};
const world = all.slice(obsAt + 2).filter((r) => r[cCountry] === 'World').sort((a, b) => +a[cYear] - +b[cYear]);

const prov = (def: string, ind: string) => ({
  source: 'boc-boe', sourceIndicator: ind, url: 'https://www.bankofcanada.ca/2025/10/staff-analytical-note-2025-24/',
  license: 'Bank of Canada — reuse with attribution', vintage: VINTAGE, checksum, definition: def,
  attribution: 'Bank of Canada & Bank of England — Sovereign Default Database (Beers, Ferretti et al.)',
  primarySource: 'BoC–BoE Sovereign Default Database 2025',
});

// Line 1 — total sovereign debt in default, US$ billions, by year (the "coming back" hope chart).
const totalPts = world.map((r) => ({ t: +r[cYear], value: Math.round((n(r[idx.total]) ?? 0) / 1000 * 10) / 10 })).filter((p) => p.value > 0);
const totalSeries = {
  indicatorId: 'debt.defaults_total.world', entity: 'World', entityName: 'World', unit: 'US$ billions in default',
  points: totalPts, provenance: prov('Total stock of sovereign government debt in default worldwide, US$ billions, year-end.', 'DEBT_TOTAL'),
  recipe: [{ op: 'pick_entity', detail: 'World rows; US$ millions ÷ 1000 → billions' }],
};

// Line 1b — the COUNT of sovereigns in default each year (answers "how many countries are in
// trouble?"). The contrast with the dollar share is the point: tiny money, many small countries.
const cnt = col('DEBT_TOTAL_DEF_SOVEREIGNS_2025');
const countPts = world.map((r) => ({ t: +r[cYear], value: Math.round(n(r[cnt]) ?? 0) })).filter((p) => p.value > 0);
const countSeries = {
  indicatorId: 'debt.defaults_count.world', entity: 'World', entityName: 'World', unit: 'sovereigns in default',
  points: countPts, provenance: prov('Number of sovereign governments in default on some external obligation, each year.', 'DEBT_TOTAL_DEF_SOVEREIGNS'),
  recipe: [{ op: 'pick_entity', detail: 'World rows, count of sovereigns in default' }],
};

// Line 2 — debt in default as a share of world public debt (the verdict: ~0.4%).
const ratePts = world.map((r) => ({ t: +r[cYear], value: n(r[idx.defrate]) })).filter((p) => p.value != null).map((p) => ({ t: p.t, value: Math.round(p.value! * 100) / 100 }));
const rateSeries = {
  indicatorId: 'debt.default_rate.world', entity: 'World', entityName: 'World', unit: '% of world public debt in default',
  points: ratePts, provenance: prov('Sovereign debt in default as a share of total world public debt, %.', 'DEBT_DEFRATE_WORLD_PUBLIC_DEBT'),
  recipe: [{ op: 'pick_entity', detail: 'World rows, default rate vs world public debt' }],
};

// Bars — who is owed the defaulted debt, latest year (the China-creditor shift).
const last = world[world.length - 1]; const yr = last[cYear];
const cred: [string, number, string][] = [
  ['Private creditors', n(last[idx.priv]) ?? 0, 'despair'], ['China', n(last[idx.china]) ?? 0, 'ochre'],
  ['Paris Club', n(last[idx.paris]) ?? 0, 'uncertain'], ['IMF', n(last[idx.imf]) ?? 0, 'stone'],
  ['World Bank (IBRD+IDA)', (n(last[idx.ibrd]) ?? 0) + (n(last[idx.ida]) ?? 0), 'stone'],
  ['Other official', n(last[idx.otherOff]) ?? 0, 'stone'],
];
const credBars = {
  chartId: 'defaults-by-creditor', kind: 'bars', title: 'Who is owed the debt in default?',
  unit: `US$ billions in default, by creditor, ${yr}`, yearSpan: `${yr}–${yr}`,
  bars: cred.map(([label, v, color]) => ({ label, value: Math.round(v / 1000 * 10) / 10, color }))
    .filter((b) => b.value > 0).sort((a, b) => b.value - a.value),
  xmax: Math.ceil(Math.max(...cred.map(([, v]) => v / 1000)) / 50) * 50, xTicks: [0, 50, 100, 150, 200],
  provenance: prov(`Sovereign debt in default by creditor class, ${yr}, US$ billions.`, 'DEBT_<creditor>'),
  recipe: [{ op: 'cross_section_latest', detail: `creditor split of defaulted debt, ${yr}` }],
};

// (A gross-world-public-debt line was attempted from DEBT_GROSS_WORLD_PUBLIC_DEBT but that column's
//  units don't resolve cleanly; dropped rather than ship a wrong series. The default-rate line below
//  carries the "where we are now" verdict instead.)

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/defaults-total-world.json'), JSON.stringify(totalSeries, null, 2));
writeFileSync(join(ROOT, 'src/data/derived/defaults-count-world.json'), JSON.stringify(countSeries, null, 2));
writeFileSync(join(ROOT, 'src/data/derived/default-rate-world.json'), JSON.stringify(rateSeries, null, 2));
writeFileSync(join(ROOT, 'src/data/derived/defaults-by-creditor.json'), JSON.stringify(credBars, null, 2));
const latest = totalPts[totalPts.length - 1], lr = ratePts[ratePts.length - 1];
console.log(`✓ defaults-total-world: ${totalPts.length} yrs · ${latest.t} = $${latest.value}bn`);
console.log(`✓ default-rate-world: ${lr.t} = ${lr.value}% of world public debt`);
console.log(`✓ defaults-by-creditor (${yr}): ${credBars.bars.map((b) => `${b.label} $${b.value}bn`).join(' · ')}`);
