import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* ILOSTAT adapter — the ILO's labour statistics over the SDMX 2.1 REST API (sdmx.ilo.org), CC BY
   4.0. The bulk files moved and the rplumber API returns empty, but SDMX works: a `DF_`-prefixed
   dataflow + the SDMX-CSV Accept header returns clean tidy rows. We keep what the World Bank's
   ILO mirror lacks — working poverty (annual) and the child-labour estimates. The download spans
   all countries, so we trim the snapshot to the requested entity (default World = REF_AREA X01).
   spec.filter selects the SDMX dimensions (SEX, AGE, …); UNIT_MULT scales the value. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const BASE = 'https://sdmx.ilo.org/rest/data/';

/** Minimal RFC-4180 CSV parser — SDMX note columns can contain quoted commas. */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = '', inQ = false;
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

export const ilostat: Adapter = {
  id: 'ilostat',
  homepage: 'https://ilostat.ilo.org',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const refArea = spec.filter?.REF_AREA ?? 'X01'; // X01 = World
    const url = `${BASE}${spec.slug}/all?startPeriod=1990`;
    // The SDMX server 500s without Accept-Language (curl/browsers send it; undici omits it).
    const res = await fetch(url, { headers: { Accept: 'application/vnd.sdmx.data+csv', 'Accept-Language': 'en' } });
    if (!res.ok) throw new Error(`ILOSTAT ${spec.slug}: HTTP ${res.status}`);
    const full = res.headers ? await res.text() : '';
    // Trim the snapshot to the requested entity so the committed bytes stay small (the source
    // returns every country); we record exactly the rows we use.
    const rows = parseCSV(full);
    const header = rows[0];
    const iRA = header.indexOf('REF_AREA');
    const kept = [header, ...rows.slice(1).filter((r) => r[iRA] === refArea)];
    const body = kept.map((r) => r.map((f) => (f.includes(',') || f.includes('"') ? `"${f.replace(/"/g, '""')}"` : f)).join(',')).join('\n');
    return {
      source: 'ilostat', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url, checksum: sha256(body), license: 'CC BY 4.0',
      body, ext: 'csv', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const rows = parseCSV(raw.body);
    const header = rows[0];
    const ix = (name: string) => header.indexOf(name);
    const iYear = ix('TIME_PERIOD'), iVal = ix('OBS_VALUE'), iMult = ix('UNIT_MULT');
    const filter = { REF_AREA: 'X01', ...(spec.filter ?? {}) };
    const points: { t: number; value: number }[] = [];
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (!Object.entries(filter).every(([k, v]) => row[ix(k)] === v)) continue;
      const year = parseInt(row[iYear], 10);
      const mult = iMult >= 0 ? parseInt(row[iMult], 10) || 0 : 0;
      const value = parseFloat(row[iVal]) * 10 ** mult;
      if (!Number.isFinite(year) || !Number.isFinite(value)) continue;
      if (spec.yearMin != null && year < spec.yearMin) continue;
      if (spec.yearMax != null && year > spec.yearMax) continue;
      points.push({ t: year, value });
    }
    points.sort((a, b) => a.t - b.t);
    return [{
      indicatorId: spec.id, entity: 'World', entityName: 'World', unit: spec.unit, points,
      provenance: {
        source: 'ilostat', sourceIndicator: `${spec.slug} [${Object.entries(filter).map(([k, v]) => `${k}=${v}`).join(', ')}]`,
        url: raw.url, license: raw.license, vintage: raw.vintage, checksum: raw.checksum,
        definition: spec.title, attribution: 'ILOSTAT — International Labour Organization', primarySource: spec.primarySource,
      },
    }];
  },
};
