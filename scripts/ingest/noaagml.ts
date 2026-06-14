import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* NOAA Global Monitoring Laboratory — globally-averaged atmospheric concentration of the other two
   big greenhouse gases, methane (CH₄) and nitrous oxide (N₂O), in parts per billion (CC0 / public
   domain, U.S. Government). Companion to the CO₂ concentration chart; like CO₂ these gases are
   well-mixed, so the series is global-only by nature. Whitespace annual-mean files with '#' comment
   headers: "year  mean  unc". spec.slug selects the gas ('ch4' | 'n2o'). */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const url = (gas: string) => `https://gml.noaa.gov/webdata/ccgg/trends/${gas}/${gas}_annmean_gl.txt`;

export const noaagml: Adapter = {
  id: 'noaagml',
  homepage: 'https://gml.noaa.gov/ccgg/trends/',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const u = url(spec.slug);
    const res = await fetch(u);
    if (!res.ok) throw new Error(`NOAA GML (${spec.slug}): HTTP ${res.status}`);
    const body = await res.text();
    return {
      source: 'noaagml', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url: u, checksum: sha256(body), license: 'Public Domain (NOAA GML)',
      body, ext: 'txt', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const points: { t: number; value: number }[] = [];
    for (const line of raw.body.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const c = t.split(/\s+/);
      const year = parseInt(c[0], 10), value = parseFloat(c[1]);
      if (!Number.isFinite(year) || !Number.isFinite(value)) continue;
      if (spec.yearMin != null && year < spec.yearMin) continue;
      if (spec.yearMax != null && year > spec.yearMax) continue;
      points.push({ t: year, value });
    }
    points.sort((a, b) => a.t - b.t);
    return [{
      indicatorId: spec.id, entity: 'World', entityName: 'World', unit: spec.unit, points,
      provenance: {
        source: 'noaagml', sourceIndicator: `${spec.slug}_annmean_gl`, url: raw.url, license: raw.license,
        vintage: raw.vintage, checksum: raw.checksum, definition: spec.title,
        attribution: 'NOAA Global Monitoring Laboratory',
        primarySource: spec.primarySource,
        notes: 'Globally-averaged annual mean dry-air mole fraction; a well-mixed gas, so one global number.',
      },
    }];
  },
};
