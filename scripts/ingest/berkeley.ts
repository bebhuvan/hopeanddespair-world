import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* Berkeley Earth global surface temperature (CC BY 4.0) — the land-vs-ocean split that the global
   GISTEMP curve hides. Two summary files, same Jan 1951–Dec 1980 baseline as GISTEMP, so the
   land-only and land+ocean lines sit on one axis honestly:
     spec.slug = 'land'        → Complete_TAVG_summary.txt   (air temperature over land only)
     spec.slug = 'land_ocean'  → Land_and_Ocean_summary.txt  (the global average; ocean is the brake)
   Whitespace-delimited, '%'-commented header. Column 0 = year, column 1 = annual anomaly (°C);
   the file also carries uncertainty and 5-year columns we don't read. Recent years report the
   annual anomaly with the 5-year columns still 'NaN' (skipped, not an error). */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const BASE = 'https://berkeley-earth-temperature.s3.us-west-1.amazonaws.com/Global';
const FILES: Record<string, string> = {
  land: 'Complete_TAVG_summary.txt',
  land_ocean: 'Land_and_Ocean_summary.txt',
};

export const berkeley: Adapter = {
  id: 'berkeley',
  homepage: 'https://berkeleyearth.org/data/',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const file = FILES[spec.slug];
    if (!file) throw new Error(`Berkeley Earth: unknown slug "${spec.slug}" (want land | land_ocean)`);
    const url = `${BASE}/${file}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Berkeley Earth (${spec.slug}): HTTP ${res.status}`);
    const body = await res.text();
    return {
      source: 'berkeley', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url, checksum: sha256(body), license: 'CC BY 4.0',
      body, ext: 'txt', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const points: { t: number; value: number }[] = [];
    for (const line of raw.body.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('%')) continue;          // header / comment lines
      const cols = t.split(/\s+/);
      const year = parseInt(cols[0], 10);
      const value = parseFloat(cols[1]);              // annual anomaly, °C
      if (!Number.isFinite(year) || !Number.isFinite(value)) continue;
      if (spec.yearMin != null && year < spec.yearMin) continue;
      if (spec.yearMax != null && year > spec.yearMax) continue;
      points.push({ t: year, value });
    }
    points.sort((a, b) => a.t - b.t);
    const which = spec.slug === 'land' ? 'land-surface air' : 'land + ocean (global)';
    return [{
      indicatorId: spec.id, entity: 'World', entityName: 'World', unit: spec.unit, points,
      provenance: {
        source: 'berkeley', sourceIndicator: FILES[spec.slug], url: raw.url, license: raw.license,
        vintage: raw.vintage, checksum: raw.checksum, definition: spec.title,
        attribution: 'Berkeley Earth',
        primarySource: spec.primarySource,
        notes: `${which} temperature anomaly vs the Jan 1951–Dec 1980 average (Rohde & Hausfather, 2020).`,
      },
    }];
  },
};
