import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* NOAA NCEI — global ocean heat content, 0–2000 m (Public Domain, U.S. Government). The single most
   robust measure of global warming: the ocean has absorbed more than 90% of the planet's extra heat,
   so this is where the energy imbalance actually accumulates. Fixed-width / whitespace .dat with a
   header row "YEAR WO WOse NH NHse SH SHse"; YEAR is mid-year (e.g. 2005.500) so we floor it. We read
   the WO (world ocean) column, in units of 10^22 joules. Global by nature. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const URL = 'https://www.ncei.noaa.gov/data/oceans/woa/DATA_ANALYSIS/3M_HEAT_CONTENT/DATA/basin/yearly/h22-w0-2000m.dat';

export const oceanheat: Adapter = {
  id: 'oceanheat',
  homepage: 'https://www.ncei.noaa.gov/access/global-ocean-heat-content/',

  async fetch(_spec: IndicatorSpec): Promise<RawSnapshot> {
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`NOAA NCEI ocean heat: HTTP ${res.status}`);
    const body = await res.text();
    return {
      source: 'oceanheat', slug: 'h22-w0-2000m',
      vintage: new Date().toISOString().slice(0, 10),
      url: URL, checksum: sha256(body), license: 'Public Domain (NOAA NCEI)',
      body, ext: 'dat', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const points: { t: number; value: number }[] = [];
    for (const line of raw.body.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('YEAR')) continue;       // header
      const c = t.split(/\s+/);
      const year = Math.floor(parseFloat(c[0]));      // 2005.500 → 2005
      const value = parseFloat(c[1]);                 // WO = world ocean heat content
      if (!Number.isFinite(year) || !Number.isFinite(value)) continue;
      points.push({ t: year, value });
    }
    points.sort((a, b) => a.t - b.t);
    return [{
      indicatorId: spec.id, entity: 'World', entityName: 'World', unit: spec.unit, points,
      provenance: {
        source: 'oceanheat', sourceIndicator: 'WO (world ocean, 0–2000 m)', url: raw.url, license: raw.license,
        vintage: raw.vintage, checksum: raw.checksum, definition: spec.title,
        attribution: 'NOAA National Centers for Environmental Information',
        primarySource: spec.primarySource,
        notes: 'World-ocean heat content anomaly, 0–2000 m, in 10^22 joules. The ocean holds >90% of the planet’s accumulated extra heat.',
      },
    }];
  },
};
