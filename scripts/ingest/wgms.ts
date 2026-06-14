import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* World Glacier Monitoring Service — cumulative mass balance of the global reference glaciers
   (CC BY 4.0). The clearest single picture of glaciers melting: ~60 long-monitored glaciers across
   19 mountain regions, cumulative change relative to 1970, accelerating. CSV columns:
   "Year,MB_REF_count,REF_regionAVG,REF_regionAVG_cum-rel-1970". Source values are millimetres of
   water equivalent; we convert to metres (÷1000) so the ~30 m of lost ice reads cleanly. World only. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const URL = 'https://wgms.ch/data/faq/mb_ref.csv?db=2026-02-10';

export const wgms: Adapter = {
  id: 'wgms',
  homepage: 'https://wgms.ch/',

  async fetch(_spec: IndicatorSpec): Promise<RawSnapshot> {
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`WGMS glaciers: HTTP ${res.status}`);
    const body = await res.text();
    return {
      source: 'wgms', slug: 'mb_ref',
      vintage: new Date().toISOString().slice(0, 10),
      url: 'https://wgms.ch/', checksum: sha256(body), license: 'CC BY 4.0',
      body, ext: 'csv', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const rows = raw.body.trim().split('\n').map((r) => r.split(','));
    const header = rows[0].map((h) => h.trim());
    const iYear = header.indexOf('Year');
    const iVal = header.indexOf('REF_regionAVG_cum-rel-1970');
    if (iYear < 0 || iVal < 0) throw new Error(`WGMS: unexpected header ${header.join(',')}`);
    const points: { t: number; value: number }[] = [];
    for (let r = 1; r < rows.length; r++) {
      const year = parseInt(rows[r][iYear], 10), mm = parseFloat(rows[r][iVal]);
      if (!Number.isFinite(year) || !Number.isFinite(mm)) continue;
      points.push({ t: year, value: mm / 1000 });     // mm w.e. → m w.e.
    }
    points.sort((a, b) => a.t - b.t);
    return [{
      indicatorId: spec.id, entity: 'World', entityName: 'World', unit: spec.unit, points,
      provenance: {
        source: 'wgms', sourceIndicator: 'REF_regionAVG_cum-rel-1970', url: raw.url, license: raw.license,
        vintage: raw.vintage, checksum: raw.checksum, definition: spec.title,
        attribution: 'World Glacier Monitoring Service (WGMS)',
        primarySource: spec.primarySource,
        notes: 'Cumulative mean mass balance of the global reference glaciers, metres water equivalent, relative to 1970.',
      },
    }];
  },
};
