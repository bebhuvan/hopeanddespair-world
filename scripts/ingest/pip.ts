import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* World Bank Poverty and Inequality Platform (PIP) — the authoritative global poverty surface the
   WDI REST API does NOT carry: the COUNT of poor (`pop_in_poverty`), mean income/consumption, and
   the societal (relative) poverty rate (`spr`) — at any poverty line and PPP vintage, 1981→nowcast.
   CC BY 4.0. Aggregates (World + WB regions) come from `/pip-grp?group_by=wb`; single countries
   from `/pip`. (DATA.md §3 — built only when an article demanded it; the Q5 poverty piece does.)

   One (povline, ppp_version) fetch returns EVERY measure for World + all regions in one payload, so
   count/rate/mean/societal indicators at the same line share a single memoised request. Pick the
   measure with `sourceColumn`, rescale to human units with `valueScale` (PIP gives headcount as a
   fraction and pop_in_poverty as absolute people). */

const ADAPTER_VERSION = '1.0.0';
const BASE = 'https://api.worldbank.org/pip/v1';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

// Per-run memo: every measure at one (endpoint, povline, ppp) reuses one response, fetched once.
const _cache = new Map<string, string>();

function apiUrl(spec: IndicatorSpec): string {
  const grp = (spec.pipEndpoint ?? 'pip-grp') === 'pip-grp';
  const p = new URLSearchParams({
    country: 'all',
    year: 'all',
    povline: String(spec.povline ?? 3.0),
    ppp_version: String(spec.pppVersion ?? 2021),
    format: 'json',
  });
  if (grp) p.set('group_by', 'wb');
  if (spec.fillGaps) p.set('fill_gaps', 'true');
  return `${BASE}/${grp ? 'pip-grp' : 'pip'}?${p}`;
}

export const pip: Adapter = {
  id: 'pip',
  homepage: 'https://pip.worldbank.org',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const url = apiUrl(spec);
    let text = _cache.get(url);
    if (!text) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`PIP ${spec.slug}: HTTP ${res.status}`);
      text = await res.text();
      _cache.set(url, text);
    }
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error(`PIP ${spec.slug}: unexpected payload ${text.slice(0, 120)}`);
    return {
      source: 'pip', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url, checksum: sha256(text), license: 'CC BY 4.0',
      body: text, ext: 'json', meta: { rows: parsed.length, ppp: spec.pppVersion ?? 2021, povline: spec.povline ?? 3.0 },
      fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const rows = JSON.parse(raw.body) as any[];
    const grp = (spec.pipEndpoint ?? 'pip-grp') === 'pip-grp';
    const field = spec.sourceColumn ?? 'pop_in_poverty';
    const scale = spec.valueScale ?? 1;
    const line = spec.povline ?? 3.0;
    const ppp = spec.pppVersion ?? 2021;
    const byEntity = new Map<string, CanonicalSeries>();
    for (const row of rows) {
      const entity: string = grp ? row.region_code : row.country_code;
      const entityName: string = grp ? row.region_name : row.country_name;
      if (!entity || !entityName) continue;
      // entityFilter matches on the PIP code (WLD/SSF/…) OR the long name.
      if (spec.entityFilter && !spec.entityFilter.includes(entity) && !spec.entityFilter.includes(entityName)) continue;
      const v = row[field];
      if (v == null) continue;
      const year = Number(row.reporting_year);
      const value = Number(v) * scale;
      if (!Number.isFinite(year) || !Number.isFinite(value)) continue;
      if (spec.yearMin != null && year < spec.yearMin) continue;
      if (spec.yearMax != null && year > spec.yearMax) continue;
      if (!byEntity.has(entity)) {
        byEntity.set(entity, {
          indicatorId: spec.id, entity, entityName, unit: spec.unit, points: [],
          provenance: {
            source: 'pip',
            sourceIndicator: `${field} @ $${line.toFixed(2)}/day (${ppp} PPP)`,
            url: raw.url, license: raw.license, vintage: raw.vintage, checksum: raw.checksum,
            definition: spec.title,
            attribution: 'World Bank — Poverty and Inequality Platform (PIP)',
            primarySource: spec.primarySource,
          },
        });
      }
      byEntity.get(entity)!.points.push({ t: year, value });
    }
    for (const s of byEntity.values()) s.points.sort((a, b) => a.t - b.t);
    return [...byEntity.values()];
  },
};
