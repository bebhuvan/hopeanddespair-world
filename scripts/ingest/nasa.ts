import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* Global surface-temperature anomaly — NASA GISTEMP v4 (and NOAA GCAG), Public Domain → re-host
   freely (the OWID temperature series is OGL v3, outside the gate; this is the clean route).
   NASA's own host (data.giss.nasa.gov) is unreachable from some networks via Node's fetch even
   though curl succeeds, so we pull the *identical* GISTEMP numbers from the open datahub mirror on
   GitHub, which Node reaches reliably. Long-format CSV: "Source,Year,Mean". spec.slug picks the
   source — "GISTEMP" (NASA GISS) or "GCAG" (NOAA). The anomaly is vs the source's own baseline. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const MIRROR = 'https://raw.githubusercontent.com/datasets/global-temp/main/data/annual.csv';

export const nasa: Adapter = {
  id: 'nasa',
  homepage: 'https://data.giss.nasa.gov/gistemp/',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const res = await fetch(MIRROR);
    if (!res.ok) throw new Error(`GISTEMP mirror (${spec.slug}): HTTP ${res.status}`);
    const body = await res.text();
    return {
      source: 'nasa', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url: MIRROR, checksum: sha256(body), license: 'Public Domain (US Government)',
      body, ext: 'csv', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const lines = raw.body.trim().split('\n');
    const header = lines[0].split(',').map((h) => h.trim());
    const iSrc = header.indexOf('Source'), iYear = header.indexOf('Year'), iVal = header.indexOf('Mean');
    if (iSrc < 0 || iYear < 0 || iVal < 0) throw new Error(`GISTEMP mirror: unexpected header ${lines[0]}`);
    const want = spec.slug; // "GISTEMP" | "GCAG"
    const points: { t: number; value: number }[] = [];
    for (let r = 1; r < lines.length; r++) {
      const row = lines[r].split(',');
      if (row[iSrc]?.trim() !== want) continue;
      const year = parseInt(row[iYear], 10), value = parseFloat(row[iVal]);
      if (!Number.isFinite(year) || !Number.isFinite(value)) continue;
      if (spec.yearMin != null && year < spec.yearMin) continue;
      if (spec.yearMax != null && year > spec.yearMax) continue;
      points.push({ t: year, value });
    }
    points.sort((a, b) => a.t - b.t);
    return [{
      indicatorId: spec.id, entity: 'World', entityName: 'World', unit: spec.unit, points,
      provenance: {
        source: 'nasa', sourceIndicator: want, url: raw.url, license: raw.license,
        vintage: raw.vintage, checksum: raw.checksum, definition: spec.title,
        attribution: want === 'GCAG' ? 'NOAA NCEI — GlobalTemp' : 'NASA GISS — GISTEMP v4',
        primarySource: spec.primarySource, notes: 'Accessed via the open datahub global-temp mirror (GitHub).',
      },
    }];
  },
};
