import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The servicing squeeze — BIS debt-service ratios (WS_DSR), private non-financial sector. When a
   currency falls and rates rise, the share of income a country spends servicing debt jumps. Türkiye
   is the case: its private DSR climbed steeply through the 2022–23 lira slide, against a calm,
   stable United States. Mechanism behind the distress tail (docs/ARTICLE-debt-plan.md M10). BIS is
   LINK-ONLY: charted and cited with attribution, never re-hosted. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const BASE = 'https://stats.bis.org/api/v1';

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
const subPeriod = (tp: string) => { const m = tp.match(/-Q?(\d+)$/); return m ? parseInt(m[1], 10) : 0; };

async function dsr(cty: string, name: string, id: string) {
  const url = `${BASE}/data/WS_DSR/Q.${cty}.P?startPeriod=2005`;
  const res = await fetch(url, { headers: { Accept: 'application/vnd.sdmx.data+csv', 'Accept-Language': 'en' } });
  if (!res.ok) throw new Error(`BIS DSR ${cty}: HTTP ${res.status}`);
  const body = await res.text();
  const snapDir = join(ROOT, 'data/sources/bis-dsr', VINTAGE);
  mkdirSync(snapDir, { recursive: true });
  writeFileSync(join(snapDir, `${cty}.csv`), body);
  const rows = parseCSV(body); const hdr = rows[0];
  const iT = hdr.indexOf('TIME_PERIOD'), iV = hdr.indexOf('OBS_VALUE');
  const byYear = new Map<number, { rank: number; v: number }>();
  for (let r = 1; r < rows.length; r++) {
    const tp = rows[r][iT]; const yr = parseInt(tp.slice(0, 4), 10); const v = parseFloat(rows[r][iV]);
    if (!Number.isFinite(yr) || !Number.isFinite(v)) continue;
    const rank = subPeriod(tp); const prev = byYear.get(yr);
    if (!prev || rank >= prev.rank) byYear.set(yr, { rank, v });
  }
  const points = [...byYear.entries()].map(([t, x]) => ({ t, value: Math.round(x.v * 10) / 10 })).sort((a, b) => a.t - b.t);
  return {
    indicatorId: id, entity: cty, entityName: name, unit: '% of income to debt service (private non-financial sector)',
    points, provenance: {
      source: 'bis', sourceIndicator: `WS_DSR [Q.${cty}.P]`, url: 'https://data.bis.org/topics/DSR',
      license: 'BIS terms — link-only (display with attribution; not re-hosted)', vintage: VINTAGE, checksum: sha256(body),
      definition: `Debt-service ratio, private non-financial sector, ${name} — share of income devoted to debt service. Annual end-of-period (latest quarter each year).`,
      attribution: 'Bank for International Settlements (BIS)', primarySource: 'BIS debt service ratios',
    },
    recipe: [{ op: 'pick_entity', detail: `BIS DSR private non-financial sector, ${name}; quarterly folded to annual end-of-period` }],
  };
}

const TARGETS: [string, string, string][] = [
  ['TR', 'Türkiye', 'dsr-turkiye'], ['BR', 'Brazil', 'dsr-brazil'],
  ['ZA', 'South Africa', 'dsr-south-africa'], ['US', 'United States', 'dsr-us'],
];
mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
for (const [cty, name, chartId] of TARGETS) {
  const s = await dsr(cty, name, `debt.dsr.${cty.toLowerCase()}`);
  writeFileSync(join(ROOT, `src/data/derived/${chartId}.json`), JSON.stringify(s, null, 2));
  const last = s.points[s.points.length - 1];
  console.log(`✓ ${chartId}: ${s.points.length} yrs · ${last.t}=${last.value}% (peak ${Math.max(...s.points.map((p) => p.value))}%)`);
}
