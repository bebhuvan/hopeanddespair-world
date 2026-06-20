import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* Where the budget goes to creditors — public-debt interest as a share of government revenue, the
   single most direct measure of fiscal distress: how much of every dollar a government collects is
   owed straight back out before a teacher, a nurse or a road is paid for. Pakistan tops it at about
   three-fifths of revenue; Sri Lanka and Egypt over half. This is the honest country-level "who is
   in distress" view (CHARTS.md prefers a ranked spread to a choropleth). UNCTAD A World of Debt 2025
   ("Public debt interest payments as a share of revenues"); link-only, displayed not re-hosted. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const dir = join(ROOT, 'data/sources/unctad');
const vintage = readdirSync(dir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!;
const text = readFileSync(join(dir, vintage, 'wod-2025-consolidated.csv'), 'utf8');
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
const ci = { id: h.indexOf('ID'), name: h.indexOf('Name'), ind: h.indexOf('Indicator'), yr: h.indexOf('year'), val: h.indexOf('value') };
// real countries only — IMF/ISO 2-letter IDs; aggregate rows ("Lower middle income countries") have longer IDs
const isCountry = (id: string) => /^[A-Z]{2}$/.test(id);

const latest = new Map<string, { name: string; year: string; v: number }>();
for (const r of rows.slice(1)) {
  if (r[ci.ind] !== 'Public debt interest payments as a share of revenues') continue;
  if (!isCountry(r[ci.id])) continue;
  const v = parseFloat(r[ci.val]); if (!Number.isFinite(v)) continue;
  const prev = latest.get(r[ci.id]);
  if (!prev || r[ci.yr] > prev.year) latest.set(r[ci.id], { name: r[ci.name].trim(), year: r[ci.yr], v });
}

const all = [...latest.values()].map((e) => ({ ...e, pct: Math.round(e.v * 1000) / 10 }));
const over20 = all.filter((e) => e.pct >= 20).length;
const over10 = all.filter((e) => e.pct >= 10).length;
const color = (p: number) => (p >= 40 ? 'despair' : p >= 20 ? 'ochre' : 'stone');
const bars = all.sort((a, b) => b.pct - a.pct).slice(0, 14)
  .map((e) => ({ label: e.name, value: Math.round(e.pct), color: color(e.pct) }));

const artifact = {
  chartId: 'interest-revenue-by-country', kind: 'bars',
  title: 'Where the budget goes to creditors first',
  unit: '% of government revenue spent on public-debt interest · latest year',
  yearSpan: '2024', xmax: 70, xTicks: [0, 20, 40, 60], decimals: 0,
  refLines: [{ y: 20, label: 'a fifth of revenue' }],
  bars,
  provenance: {
    source: 'unctad', sourceIndicator: 'Public debt interest payments as a share of revenues',
    url: 'https://unctad.org/publication/world-of-debt',
    license: 'Link-only — UNCTAD publication terms (display + cite; not re-hosted)', vintage, checksum,
    definition: 'Public-debt interest payments as a share of general government revenue, latest year. The share of every dollar of revenue a government must hand to creditors before it can spend on anything else — the most direct fiscal-distress gauge.',
    attribution: 'UN Trade and Development (UNCTAD) — A World of Debt 2025', primarySource: 'UNCTAD; IMF WEO',
  },
  recipe: [{ op: 'cross_section_latest', detail: 'interest ÷ revenue by country, latest year, top 14; colour by severity, ref line at the one-fifth tripwire' }],
};

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/interest-revenue-by-country.json'), JSON.stringify(artifact, null, 2));
console.log(`✓ interest-revenue-by-country: ${bars[0].label} ${bars[0].value}% → ${bars.at(-1)!.label} ${bars.at(-1)!.value}%`);
console.log(`  countries ≥20% of revenue on interest: ${over20} · ≥10%: ${over10}`);
