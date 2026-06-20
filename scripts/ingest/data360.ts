import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* World Bank Data360 adapter — the surface behind the Atlas of Global Development
   (data360api.worldbank.org). Data360 sources, harmonises and re-documents hundreds of datasets
   (WDI, plus IMF/UN/OECD-sourced collections) behind one SDMX-shaped JSON API. We use it for series
   the classic WB v2 API and OWID don't expose cleanly.

   LICENCE IS PER-DATASET, NOT PER-PLATFORM. World-Bank-origin datasets (WB_WDI, …) are CC BY 4.0 and
   re-hostable — that's this adapter's default. Third-party datasets on Data360 "may not be
   redistributed without the consent of the original provider" (Data360 terms): for those a spec MUST
   set `gate: 'link-only'` and a `license` override, exactly like the BIS/EM-DAT pattern (DATA.md §9).

   Shape of the data endpoint (GET /data360/data):
     ?DATABASE_ID=WB_WDI&INDICATOR=WB_WDI_SP_DYN_LE00_IN&REF_AREA=WLD&timePeriodFrom=1960&timePeriodTo=2024&skip=0
   → { count, value: [ { OBS_VALUE (string), TIME_PERIOD, REF_AREA, UNIT_MULT (int),
                         SEX, AGE, URBANISATION, COMP_BREAKDOWN_1..3, INDICATOR, DATABASE_ID, … } ] }

   Two gotchas the normaliser guards:
   1. Disaggregation dims. A single indicator returns many rows per (area, year) — one per
      SEX × AGE × URBANISATION × COMP_BREAKDOWN slice. We keep ONLY the total slice (SEX/AGE/
      URBANISATION = _T, COMP_BREAKDOWN_* = _Z) so we never silently sum or pick an arbitrary
      breakdown (the OWID multi-column trap, CLAUDE.md). Override any dim via `spec.filter`
      (e.g. { SEX: 'F' }) to read a specific breakdown deliberately.
   2. Pagination. Each call returns at most 1000 records; `fetch` loops on `skip` until `count` is
      exhausted (a full multi-country pull is ~17k rows). Pin one `refArea` (e.g. WLD) to stay on a
      single page when only the World aggregate is needed. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const BASE = 'https://data360api.worldbank.org/data360/data';
const PAGE = 1000;
const LICENSE = 'CC BY 4.0'; // WB-origin default; third-party datasets override per spec (gate + license)

// The "total / not applicable" slice that yields one row per (area, year) for an undisaggregated series.
const TOTAL_DIMS: Record<string, string> = {
  SEX: '_T', AGE: '_T', URBANISATION: '_T',
  COMP_BREAKDOWN_1: '_Z', COMP_BREAKDOWN_2: '_Z', COMP_BREAKDOWN_3: '_Z',
};

// A handful of friendly names for the codes we expect most often; everything else falls back to its code.
const AREA_NAMES: Record<string, string> = { WLD: 'World' };

// Per-run memo: the full (possibly paginated) payload per indicator+area, so sibling specs reuse it.
const _cache = new Map<string, string>();

export const data360: Adapter = {
  id: 'data360',
  homepage: 'https://data360.worldbank.org',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    if (!spec.data360?.databaseId) throw new Error(`Data360 ${spec.id}: spec.data360.databaseId is required`);
    const { databaseId, refArea } = spec.data360;
    const params = new URLSearchParams({ DATABASE_ID: databaseId, INDICATOR: spec.slug });
    if (refArea) params.set('REF_AREA', refArea);
    if (spec.yearMin != null) params.set('timePeriodFrom', String(spec.yearMin));
    if (spec.yearMax != null) params.set('timePeriodTo', String(spec.yearMax));
    const baseUrl = `${BASE}?${params.toString()}`;

    let text = _cache.get(baseUrl);
    if (!text) {
      // Page through `skip` until we've collected `count` records, then re-wrap as one payload.
      const all: any[] = [];
      let count = Infinity;
      for (let skip = 0; skip < count; skip += PAGE) {
        const res = await fetch(`${baseUrl}&skip=${skip}`);
        if (!res.ok) throw new Error(`Data360 ${spec.slug}: HTTP ${res.status}`);
        const page = JSON.parse(await res.text());
        count = page.count ?? 0;
        const rows = page.value ?? [];
        all.push(...rows);
        if (!rows.length) break; // defensive: never loop forever on an empty page
      }
      text = JSON.stringify({ count: all.length, value: all });
      _cache.set(baseUrl, text);
    }

    return {
      source: 'data360', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url: `https://data360.worldbank.org/en/indicator/${spec.slug}`,
      checksum: sha256(text), license: LICENSE,
      body: text, ext: 'json', meta: { databaseId, refArea: refArea ?? null },
      fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const rows = (JSON.parse(raw.body).value ?? []) as any[];
    const scale = spec.valueScale ?? 1;
    // Resolve the wanted value for each disaggregation dim: spec.filter wins, else the total slice.
    const dims = { ...TOTAL_DIMS, ...(spec.filter ?? {}) };

    const byEntity = new Map<string, CanonicalSeries>();
    for (const row of rows) {
      // Keep only the wanted slice across every dimension present on the row.
      if (Object.entries(dims).some(([k, v]) => row[k] != null && row[k] !== v)) continue;
      const entity: string = row.REF_AREA;
      if (!entity) continue;
      const entityName = AREA_NAMES[entity] ?? entity;
      if (spec.entityFilter && !spec.entityFilter.includes(entity) && !spec.entityFilter.includes(entityName)) continue;
      const year = parseInt(row.TIME_PERIOD, 10);
      const mult = Number(row.UNIT_MULT) || 0;
      const value = parseFloat(row.OBS_VALUE) * 10 ** mult * scale;
      if (!Number.isFinite(year) || !Number.isFinite(value)) continue;
      if (!byEntity.has(entity)) {
        byEntity.set(entity, {
          indicatorId: spec.id, entity, entityName, unit: spec.unit, points: [],
          provenance: {
            source: 'data360', sourceIndicator: `${spec.data360!.databaseId} · ${spec.slug}`,
            url: raw.url, license: raw.license, vintage: raw.vintage, checksum: raw.checksum,
            definition: spec.title,
            attribution: 'World Bank Data360', primarySource: spec.primarySource,
          },
        });
      }
      byEntity.get(entity)!.points.push({ t: year, value });
    }
    for (const s of byEntity.values()) s.points.sort((a, b) => a.t - b.t);
    const series = [...byEntity.values()].filter((s) => s.points.length);
    if (!series.length)
      throw new Error(`Data360 ${spec.id}: no rows for ${spec.data360!.databaseId}/${spec.slug}${spec.data360!.refArea ? ` @ ${spec.data360!.refArea}` : ''}`);
    return series;
  },
};
