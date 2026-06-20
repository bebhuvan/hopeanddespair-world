import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The widening divide — public debt in developing countries has grown far faster than in the rich
   world. UNCTAD's A World of Debt 2025 (figure 2) shows it indexed to 2010 = 100: developing-country
   public debt has roughly quadrupled while developed-country debt grew about two-thirds, and even
   stripping out China the developing line more than doubles. Their share of the global total jumped
   from 16% (2010) to 31% (2024), even though they are 39% of world GDP and 83% of its people. Built
   by aggregating our UNCTAD WoD snapshot ("Public debt in US$ billions" by development status) — the
   same country-level data behind the report. UNCTAD is link-only: display + cite, not re-hosted. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const dir = join(ROOT, 'data/sources/unctad');
const vintage = readdirSync(dir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!;
const file = join(dir, vintage, 'wod-2025-consolidated.csv');
const text = readFileSync(file, 'utf8');
const checksum = sha256(text);

function parseCSV(t: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (c !== '\r') f += c;
  }
  if (f.length || row.length) { row.push(f); rows.push(row); }
  return rows;
}

const rows = parseCSV(text); const h = rows[0];
const ci = { name: h.indexOf('Name'), status: h.indexOf('Development status'), ind: h.indexOf('Indicator'), yr: h.indexOf('year'), val: h.indexOf('value') };
const YEARS: number[] = []; for (let y = 2010; y <= 2024; y++) YEARS.push(y);

// sum nominal public debt (US$bn) per group per year
const developing: Record<number, number> = {}, developed: Record<number, number> = {}, china: Record<number, number> = {};
for (const r of rows.slice(1)) {
  if (r[ci.ind] !== 'Public debt in US$ billions') continue;
  const v = parseFloat(r[ci.val]); if (!Number.isFinite(v)) continue;
  const y = parseInt(r[ci.yr], 10); const st = (r[ci.status] || '').trim();
  if (st === 'Developing countries') { developing[y] = (developing[y] ?? 0) + v; if (r[ci.name].trim().startsWith('China')) china[y] = v; }
  else if (st === 'Developed countries') { developed[y] = (developed[y] ?? 0) + v; }
}

const index = (s: Record<number, number>) => YEARS.map((y) => ({ t: y, value: Math.round((s[y] / s[2010]) * 1000) / 10 }));
const devExCh: Record<number, number> = {}; for (const y of YEARS) devExCh[y] = developing[y] - (china[y] ?? 0);

const prov = (def: string) => ({
  source: 'unctad', sourceIndicator: 'Public debt in US$ billions, aggregated by development status',
  url: 'https://unctad.org/publication/world-of-debt',
  license: 'Link-only — UNCTAD publication terms (display + cite; not re-hosted)', vintage, checksum,
  definition: def, attribution: 'UN Trade and Development (UNCTAD) — A World of Debt 2025', primarySource: 'UNCTAD; IMF World Economic Outlook (April 2025)',
});
const mk = (id: string, name: string, s: Record<number, number>, def: string) => ({
  indicatorId: id, entity: id, entityName: name, unit: 'index, outstanding public debt 2010 = 100',
  points: index(s), provenance: prov(def), recipe: [{ op: 'aggregate_index', detail: 'sum nominal public debt US$bn by development status, index to 2010=100' }],
});

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/debt-index-developing.json'), JSON.stringify(mk('debt-index-developing', 'Developing countries', developing, 'Total public debt of developing countries, US$, indexed to 2010=100.'), null, 2));
writeFileSync(join(ROOT, 'src/data/derived/debt-index-developing-exchina.json'), JSON.stringify(mk('debt-index-developing-exchina', 'Developing excl. China', devExCh, 'Total public debt of developing countries excluding China, US$, indexed to 2010=100.'), null, 2));
writeFileSync(join(ROOT, 'src/data/derived/debt-index-developed.json'), JSON.stringify(mk('debt-index-developed', 'Developed countries', developed, 'Total public debt of developed countries, US$, indexed to 2010=100.'), null, 2));

const sh = (g: Record<number, number>, y: number) => g[y] / (developing[y] + developed[y]) * 100;
console.log('✓ debt-growth-divide (index 2010=100, 2024):');
console.log(`   Developing        ${index(developing).at(-1)!.value}   ($${(developing[2024] / 1000).toFixed(1)}tn, ${sh(developing, 2024).toFixed(0)}% of global; was ${sh(developing, 2010).toFixed(0)}% in 2010)`);
console.log(`   Developing exCh   ${index(devExCh).at(-1)!.value}`);
console.log(`   Developed         ${index(developed).at(-1)!.value}   ($${(developed[2024] / 1000).toFixed(1)}tn, ${sh(developed, 2024).toFixed(0)}% of global)`);
