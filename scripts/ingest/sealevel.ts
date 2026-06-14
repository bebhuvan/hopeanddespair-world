import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* Global mean sea level, 1880→present (Public Domain) — the long arc of the rising ocean. The U.S.
   EPA's compilation (republished via the datahub mirror that Node fetch reaches reliably) carries
   two columns on ONE shared 1880 = 0 datum: a CSIRO tide-gauge reconstruction (1880–~2013) and the
   NOAA satellite-altimetry record (1993→). Because they share a baseline they stitch without
   rebasing: each year takes the satellite value if present, otherwise the reconstruction. Source
   values are inches; we convert to centimetres (×2.54) so the rise reads in human units. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const URL = 'https://raw.githubusercontent.com/datasets/sea-level-rise/main/data/epa-sea-level.csv';
const IN_TO_CM = 2.54;

export const sealevel: Adapter = {
  id: 'sealevel',
  homepage: 'https://www.epa.gov/climate-indicators/climate-change-indicators-sea-level',

  async fetch(_spec: IndicatorSpec): Promise<RawSnapshot> {
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`Sea level (EPA/datahub): HTTP ${res.status}`);
    const body = await res.text();
    return {
      source: 'sealevel', slug: 'epa-sea-level',
      vintage: new Date().toISOString().slice(0, 10),
      url: URL, checksum: sha256(body), license: 'Public Domain',
      body, ext: 'csv', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const lines = raw.body.trim().split('\n');
    const header = lines[0].split(',').map((h) => h.trim());
    const iYear = header.indexOf('Year');
    const iCsiro = header.indexOf('CSIRO Adjusted Sea Level');
    const iNoaa = header.indexOf('NOAA Adjusted Sea Level');
    if (iYear < 0 || iCsiro < 0 || iNoaa < 0)
      throw new Error(`Sea level: unexpected header ${lines[0]}`);
    const points: { t: number; value: number }[] = [];
    for (let r = 1; r < lines.length; r++) {
      const row = lines[r].split(',');
      const year = parseInt(row[iYear], 10);
      if (!Number.isFinite(year)) continue;
      if (spec.yearMin != null && year < spec.yearMin) continue;
      if (spec.yearMax != null && year > spec.yearMax) continue;
      // Prefer the satellite record where it exists; fall back to the tide-gauge reconstruction.
      const noaa = parseFloat(row[iNoaa]);
      const csiro = parseFloat(row[iCsiro]);
      const inches = Number.isFinite(noaa) ? noaa : csiro;
      if (!Number.isFinite(inches)) continue;
      points.push({ t: year, value: inches * IN_TO_CM });
    }
    points.sort((a, b) => a.t - b.t);
    return [{
      indicatorId: spec.id, entity: 'World', entityName: 'World', unit: spec.unit, points,
      provenance: {
        source: 'sealevel', sourceIndicator: 'CSIRO reconstruction (1880–) + NOAA satellite altimetry (1993–)',
        url: raw.url, license: raw.license, vintage: raw.vintage, checksum: raw.checksum,
        definition: spec.title, attribution: 'CSIRO; NOAA — via U.S. EPA',
        primarySource: spec.primarySource,
        notes: 'Cumulative change vs 1880, centimetres. Satellite value used where available, else the tide-gauge reconstruction (same datum).',
      },
    }];
  },
};
