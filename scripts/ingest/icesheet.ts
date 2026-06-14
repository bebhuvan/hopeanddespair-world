import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* Greenland & Antarctica ice-sheet mass, from NASA/JPL GRACE & GRACE-FO satellites (Public Domain),
   via the OWID grapher 'ice-sheet-mass-balance'. Cumulative change in mass since 2002, in billion
   tonnes (Gt); negative = ice lost. The source is DAY-grained, so the standard OWID adapter (which
   needs a 'year' column) can't read it — we aggregate to the last observation of each calendar year
   (a cumulative series, so year-end is the right annual value). spec.entityFilter picks the sheet
   ('Greenland' or 'Antarctica'). */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

function parseCSV(text: string): string[][] {
  return text.trim().split('\n').map((r) => r.split(','));
}

export const icesheet: Adapter = {
  id: 'icesheet',
  homepage: 'https://climate.nasa.gov/vital-signs/ice-sheets/',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const base = `https://ourworldindata.org/grapher/${spec.slug}`;
    const u = `${base}.csv?csvType=full&useColumnShortNames=true`;
    const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`Ice sheets (${spec.slug}): HTTP ${res.status}`);
    const body = await res.text();
    return {
      source: 'icesheet', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url: base, checksum: sha256(body), license: 'Public Domain (NASA/JPL GRACE)',
      body, ext: 'csv', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const rows = parseCSV(raw.body);
    const header = rows[0];
    const iEntity = header.indexOf('entity');
    const iDay = header.indexOf('day');
    const iVal = header.indexOf(spec.sourceColumn ?? 'land_ice_mass_nasa');
    if (iEntity < 0 || iDay < 0 || iVal < 0) throw new Error(`Ice sheets ${spec.slug}: unexpected columns ${header.join(',')}`);
    const want = spec.entityFilter?.[0];
    // Keep the last (latest-day) observation per calendar year for the chosen sheet.
    const byYear = new Map<number, { day: string; value: number }>();
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (want && row[iEntity] !== want) continue;
      const day = row[iDay];
      const year = parseInt(day?.slice(0, 4), 10);
      const value = parseFloat(row[iVal]);
      if (!Number.isFinite(year) || !Number.isFinite(value)) continue;
      const cur = byYear.get(year);
      if (!cur || day > cur.day) byYear.set(year, { day, value });
    }
    const points = [...byYear.entries()].map(([t, v]) => ({ t, value: v.value })).sort((a, b) => a.t - b.t);
    if (!points.length) throw new Error(`Ice sheets: no rows for entity "${want}"`);
    return [{
      indicatorId: spec.id, entity: want ?? 'World', entityName: want ?? 'World', unit: spec.unit, points,
      provenance: {
        source: 'icesheet', sourceIndicator: 'land_ice_mass_nasa', url: raw.url, license: raw.license,
        vintage: raw.vintage, checksum: raw.checksum, definition: spec.title,
        attribution: 'NASA/JPL — GRACE & GRACE-FO, via Our World in Data',
        primarySource: spec.primarySource,
        notes: 'Cumulative ice-sheet mass change since 2002 (billion tonnes); year-end value of a daily series.',
      },
    }];
  },
};
