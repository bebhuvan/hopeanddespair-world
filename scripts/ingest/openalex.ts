import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* OpenAlex adapter — the open catalogue of scholarly works (api.openalex.org). CC0: the freest
   licence there is, re-host without restriction. We use the `group_by` aggregation, which returns
   a whole time series (counts per publication_year) in one request — no paging, trivially
   snapshottable. spec.slug is the query after the host, e.g. "works?group_by=publication_year". */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const MAILTO = 'r.bhuvanesh2007@gmail.com'; // OpenAlex "polite pool" courtesy header — not a secret

export const openalex: Adapter = {
  id: 'openalex',
  homepage: 'https://openalex.org',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const url = `https://api.openalex.org/${spec.slug}`;
    const res = await fetch(`${url}&mailto=${MAILTO}`);
    if (!res.ok) throw new Error(`OpenAlex ${spec.slug}: HTTP ${res.status}`);
    const parsed = JSON.parse(await res.text());
    // Snapshot only the group_by payload — the `meta` block carries a per-request response time
    // that would change the checksum every run and defeat revision detection (DATA.md §10).
    const body = JSON.stringify(parsed.group_by ?? parsed);
    return {
      source: 'openalex', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url, checksum: sha256(body), license: 'CC0 1.0',
      body, ext: 'json', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const groups = JSON.parse(raw.body) as { key: string; count: number }[];
    const points = groups
      .map((g) => ({ t: parseInt(g.key, 10), value: g.count }))
      .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.value)
        && (spec.yearMin == null || p.t >= spec.yearMin) && (spec.yearMax == null || p.t <= spec.yearMax))
      .sort((a, b) => a.t - b.t);
    return [{
      indicatorId: spec.id, entity: 'World', entityName: 'World', unit: spec.unit, points,
      provenance: {
        source: 'openalex', sourceIndicator: spec.slug, url: raw.url, license: raw.license,
        vintage: raw.vintage, checksum: raw.checksum, definition: spec.title,
        attribution: 'OpenAlex', primarySource: spec.primarySource,
      },
    }];
  },
};
