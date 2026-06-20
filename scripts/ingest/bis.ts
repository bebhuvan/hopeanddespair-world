import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* BIS adapter — the Bank for International Settlements over the SDMX 2.1 REST API (stats.bis.org/
   api/v1), the *only* source for the global-dollar-debt story (Global Liquidity Indicators, debt-
   service ratios, central-bank policy rates). LINK-ONLY: BIS statistics are a custom BIS-copyright
   licence, not CC BY/CC0/PD — their terms permit *display with attribution* but fail the re-host
   whitelist (DATA.md §9). So every BIS indicator MUST set `gate: 'link-only'`: we chart it and link
   `↓ source` to data.bis.org, and the pipeline emits NO downloadable CSV. Same pattern as EM-DAT.

   The SDMX-CSV endpoint returns one row per (series key × measure × period). `spec.bis.key` is the
   series key embedded in the URL to keep the payload small (e.g. "Q.USD.3P.N.A.I.B"); a key can
   still return two rows per period — a level (UNIT_MEASURE = currency code, e.g. USD) and a growth
   rate (UNIT_MEASURE 771) — so `spec.bis.measure` picks one. UNIT_MULT scales to base units
   (millions → ×1e6); `valueScale` then converts to human units (e.g. ×1e-12 → US$ trillion).

   BIS data is quarterly (2025-Q4) or monthly (2025-01); the site is annual, so we fold to annual
   END-OF-PERIOD — the latest sub-period present in each calendar year (Q4 / December), which is how
   BIS itself reports stocks and rates ("end of period"). Disclosed in the provenance note. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const BASE = 'https://stats.bis.org/api/v1';
const LICENSE = 'BIS terms (display with attribution; not re-hostable)';

/** Minimal RFC-4180 CSV parser — BIS TITLE fields are quoted and contain commas. */
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

/** Sub-period rank within a year: "-Q4"→4, "-12"→12, bare annual→0. Higher = later in the year. */
function subPeriod(timePeriod: string): number {
  const m = timePeriod.match(/-Q?(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
}

export const bis: Adapter = {
  id: 'bis',
  homepage: 'https://data.bis.org',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    if (!spec.bis) throw new Error(`BIS ${spec.id}: spec.bis { key, measure? } is required`);
    const key = spec.bis.key;
    const url = `${BASE}/data/${spec.slug}/${key}?startPeriod=${spec.yearMin ?? 1990}`;
    // The SDMX server 500s without Accept-Language (browsers/curl send it; undici omits it).
    const res = await fetch(url, { headers: { Accept: 'application/vnd.sdmx.data+csv', 'Accept-Language': 'en' } });
    if (!res.ok) throw new Error(`BIS ${spec.slug} [${key}]: HTTP ${res.status}`);
    const body = await res.text();
    return {
      source: 'bis', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url, checksum: sha256(body), license: LICENSE,
      body, ext: 'csv', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const rows = parseCSV(raw.body);
    const header = rows[0];
    const ix = (name: string) => header.indexOf(name);
    const iTime = ix('TIME_PERIOD'), iVal = ix('OBS_VALUE'), iMult = ix('UNIT_MULT'),
      iMeas = ix('UNIT_MEASURE'), iTitle = ix('TITLE') >= 0 ? ix('TITLE') : ix('TITLE_TS');
    if (iTime < 0 || iVal < 0) throw new Error(`BIS ${spec.id}: unexpected header ${header.join(',')}`);
    const measure = spec.bis?.measure;
    const scale = spec.valueScale ?? 1;

    // Fold to annual end-of-period: keep, per year, the row with the latest sub-period.
    const byYear = new Map<number, { rank: number; value: number }>();
    let title = '';
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (measure && iMeas >= 0 && row[iMeas] !== measure) continue;
      const tp = row[iTime];
      const year = parseInt(tp.slice(0, 4), 10);
      const mult = iMult >= 0 ? parseInt(row[iMult], 10) || 0 : 0;
      const value = parseFloat(row[iVal]) * 10 ** mult * scale;
      if (!Number.isFinite(year) || !Number.isFinite(value)) continue;
      if (spec.yearMin != null && year < spec.yearMin) continue;
      if (spec.yearMax != null && year > spec.yearMax) continue;
      const rank = subPeriod(tp);
      const prev = byYear.get(year);
      if (!prev || rank >= prev.rank) byYear.set(year, { rank, value });
      if (iTitle >= 0 && row[iTitle]) title = row[iTitle].trim();
    }
    const points = [...byYear.entries()].map(([t, v]) => ({ t, value: v.value })).sort((a, b) => a.t - b.t);
    if (!points.length)
      throw new Error(`BIS ${spec.id}: no rows for key "${spec.bis?.key}"${measure ? ` measure ${measure}` : ''}`);
    return [{
      indicatorId: spec.id, entity: spec.entityFilter?.[0] ?? 'World', entityName: spec.entityFilter?.[0] ?? 'World',
      unit: spec.unit, points,
      provenance: {
        source: 'bis', sourceIndicator: `${spec.slug} [${spec.bis?.key}]${measure ? ` · ${measure}` : ''}`,
        url: raw.url, license: raw.license, vintage: raw.vintage, checksum: raw.checksum,
        definition: title || spec.title, attribution: 'Bank for International Settlements (BIS)',
        primarySource: spec.primarySource,
        notes: 'Annual end-of-period (latest quarter/month in each calendar year). Link-only: displayed with attribution, not re-hosted, per BIS terms.',
      },
    }];
  },
};
