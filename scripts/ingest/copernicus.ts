import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* Copernicus / ECMWF ERA5 global temperature, via the ECMWF Climate Pulse flat-CSV service
   (Copernicus C3S, free reuse with attribution — within the re-host gate). The canonical
   reanalysis record and the most current one: daily global mean 2 m air temperature, 1940→today.
   We aggregate the daily values to an annual mean (complete years only) and re-express the anomaly
   against the same 1951–1980 baseline the rest of this site uses, so the ERA5 line overlays NASA
   GISTEMP on one axis. The CSV ships native anomalies vs 1991–2020; we ignore those and recompute
   vs 1951–1980 from the absolute column, a standard, disclosed baseline shift. Columns:
   date,2t,clim_91-20,ano_91-20,status. The host needs a browser User-Agent. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36';
const BASE = 'https://sites.ecmwf.int/data/climatepulse/data/series';
const BASE_FROM = 1951, BASE_TO = 1980;   // the site-wide anomaly baseline (matches GISTEMP/Berkeley)
const MIN_DAYS = 360;                       // a year needs near-full coverage to count as complete

export const copernicus: Adapter = {
  id: 'copernicus',
  homepage: 'https://pulse.climate.copernicus.eu/',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const url = `${BASE}/era5_daily_series_${spec.slug}.csv`;  // slug e.g. "2t_global"
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`Copernicus Climate Pulse (${spec.slug}): HTTP ${res.status}`);
    const body = await res.text();
    return {
      source: 'copernicus', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url, checksum: sha256(body),
      license: 'Copernicus Climate Change Service (C3S) — free reuse with attribution',
      body, ext: 'csv', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    // 1. Daily absolute 2 m temperature → per-year sum + count.
    const sum = new Map<number, number>(), count = new Map<number, number>();
    for (const line of raw.body.split('\n')) {
      if (!line || line.startsWith('#') || line.startsWith('date')) continue;
      const c = line.split(',');
      const year = parseInt(c[0]?.slice(0, 4), 10);
      const t2 = parseFloat(c[1]);
      if (!Number.isFinite(year) || !Number.isFinite(t2)) continue;
      sum.set(year, (sum.get(year) ?? 0) + t2);
      count.set(year, (count.get(year) ?? 0) + 1);
    }
    // 2. Annual mean for complete years only (drops the running, partial current year).
    const annual = new Map<number, number>();
    for (const [y, s] of sum) if ((count.get(y) ?? 0) >= MIN_DAYS) annual.set(y, s / count.get(y)!);
    // 3. Recompute the anomaly against the site baseline (1951–1980), from this series' own data.
    const baseVals = [...annual.entries()].filter(([y]) => y >= BASE_FROM && y <= BASE_TO).map(([, v]) => v);
    if (baseVals.length < (BASE_TO - BASE_FROM + 1)) throw new Error('Copernicus: incomplete 1951–1980 baseline');
    const baseline = baseVals.reduce((a, b) => a + b, 0) / baseVals.length;
    const points = [...annual.entries()]
      .map(([t, v]) => ({ t, value: Math.round((v - baseline) * 1000) / 1000 }))
      .filter((p) => spec.yearMin == null || p.t >= spec.yearMin)
      .filter((p) => spec.yearMax == null || p.t <= spec.yearMax)
      .sort((a, b) => a.t - b.t);
    return [{
      indicatorId: spec.id, entity: 'World', entityName: 'World', unit: spec.unit, points,
      provenance: {
        source: 'copernicus', sourceIndicator: `era5_daily_series_${spec.slug}`, url: raw.url, license: raw.license,
        vintage: raw.vintage, checksum: raw.checksum, definition: spec.title,
        attribution: 'Copernicus Climate Change Service (C3S) / ECMWF — ERA5, via Climate Pulse',
        primarySource: spec.primarySource,
        notes: 'Annual mean of daily ERA5 2 m air temperature (complete years only), expressed as an anomaly vs the 1951–1980 average computed from this series.',
      },
      recipe: [
        { op: 'annual_mean', detail: `mean of daily ERA5 2 m temperature per year (years with ≥ ${MIN_DAYS} days)` },
        { op: 'rebaseline', detail: `anomaly vs the ${BASE_FROM}–${BASE_TO} mean (${baseline.toFixed(3)}°C), recomputed from the absolute series` },
      ],
    }];
  },
};
