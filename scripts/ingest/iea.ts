import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* IEA adapter — the Global EV Data Explorer (api.iea.org/evs), licensed CC BY 4.0 (verified on the
   Explorer, 2026). NOTE the licence split: the Explorer is CC BY 4.0 and re-hostable; the Global EV
   Outlook *report* data product is separately "Terms of Use for Non-CC Material" (restricted). We
   take data ONLY from the CC BY 4.0 Explorer and attribute it; the report is cited, never re-hosted
   (DATA.md §9). No API key required. One CSV per region carries every parameter/mode/powertrain;
   fetch once per region, reuse across indicators. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

// Minimal RFC-4180 line tokenizer — the `parameter` column is quoted when it holds a comma
// (e.g. "Oil displacement, Mbd"), so a naive split on ',' would mis-align every later column.
function splitCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += c;
    } else {
      if (c === '"') q = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

// One region's CSV serves every (parameter, mode, powertrain) indicator for that region.
const _cache = new Map<string, string>();

export const iea: Adapter = {
  id: 'iea',
  homepage: 'https://www.iea.org/data-and-statistics/data-tools/global-ev-data-explorer',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const base = (process.env.IEA_BASE_URL || 'https://api.iea.org').replace(/\/$/, '');
    const region = spec.entityFilter?.[0] ?? 'World';
    const url = `${base}/evs?region=${encodeURIComponent(region)}&csv=true`;
    let body = _cache.get(url);
    if (!body) {
      const res = await fetch(url, { headers: { 'User-Agent': 'hopeanddespair.world data pipeline' } });
      if (!res.ok) throw new Error(`IEA evs (${region}): HTTP ${res.status}`);
      body = await res.text();
      _cache.set(url, body);
    }
    return {
      source: 'iea', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url, checksum: sha256(body), license: 'CC BY 4.0',
      body, ext: 'csv', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const sel = spec.iea;
    if (!sel) throw new Error(`IEA ${spec.id}: spec.iea { parameter, mode, powertrain } is required`);
    const category = sel.category ?? 'Historical';
    const lines = raw.body.trim().split('\n');
    // Columns: region,category,parameter,mode,powertrain,year,unit,value
    const header = splitCSVLine(lines[0]).map((h) => h.trim());
    const col = (n: string) => header.indexOf(n);
    const iCat = col('category'), iParam = col('parameter'), iMode = col('mode'),
      iPow = col('powertrain'), iYear = col('year'), iUnit = col('unit'), iVal = col('value');
    const region = spec.entityFilter?.[0] ?? 'World';
    const points: { t: number; value: number }[] = [];
    let unit = spec.unit;
    for (let r = 1; r < lines.length; r++) {
      const f = splitCSVLine(lines[r]);
      if (f.length < header.length) continue;
      if (f[iCat] !== category) continue;
      if (f[iParam] !== sel.parameter || f[iMode] !== sel.mode || f[iPow] !== sel.powertrain) continue;
      const year = parseInt(f[iYear], 10);
      const value = Number(f[iVal]);
      if (!Number.isFinite(year) || !Number.isFinite(value)) continue;
      unit = f[iUnit] || unit;            // carry the source's declared unit (validation checks it)
      points.push({ t: year, value });
    }
    if (!points.length)
      throw new Error(`IEA ${spec.id}: no ${category} rows for "${sel.parameter}" · ${sel.mode} · ${sel.powertrain} in ${region}`);
    points.sort((a, b) => a.t - b.t);
    return [{
      indicatorId: spec.id, entity: region, entityName: region, unit, points,
      provenance: {
        source: 'iea', sourceIndicator: `${sel.parameter} · ${sel.mode} · ${sel.powertrain}`,
        url: raw.url, license: raw.license, vintage: raw.vintage, checksum: raw.checksum,
        definition: spec.title, attribution: 'IEA — Global EV Data Explorer',
        primarySource: spec.primarySource,
      },
    }];
  },
};
