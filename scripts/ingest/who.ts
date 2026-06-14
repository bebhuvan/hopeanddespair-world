import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* WHO Global Health Observatory adapter — the OData API (https://www.who.int/data/gho/info/gho-odata-api).
   A keyless JSON REST API: GET /api/{IndicatorCode} returns every spatial entity (World, the six WHO
   regions, ~190 countries) × year × sex in one payload. Carries what the World Bank mirror does NOT —
   healthy life expectancy (HALE, lifespan vs healthspan) and the NCD premature-mortality frontier.

   LICENCE: WHO GHO is CC BY-NC-SA 3.0 IGO (non-commercial, share-alike) → LINK-ONLY under our gate
   (DATASET-ATLAS §168, DATA.md §9). Specs MUST set `gate: 'link-only'`; the pipeline then charts the
   series but writes no downloadable CSV. We display and cite WHO; we never re-host its files. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

// Per-run memo: regional specs reuse one indicator response (every entity), fetched once.
const _cache = new Map<string, string>();

// WHO spatial codes → display names. Countries keep their ISO3 (not used by the regional/world cuts).
const WHO_ENTITY: Record<string, string> = {
  GLOBAL: 'World',
  AFR: 'Africa (WHO)', AMR: 'Americas (WHO)', SEAR: 'South-East Asia (WHO)',
  EUR: 'Europe (WHO)', EMR: 'Eastern Mediterranean (WHO)', WPR: 'Western Pacific (WHO)',
};

export const who: Adapter = {
  id: 'who',
  homepage: 'https://www.who.int/data/gho',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    // spec.slug is the GHO indicator code, e.g. "WHOSIS_000002" (healthy life expectancy at birth).
    const api = `https://ghoapi.azureedge.net/api/${spec.slug}`;
    let text = _cache.get(api);
    if (!text) {
      const res = await fetch(api);
      if (!res.ok) throw new Error(`WHO GHO ${spec.slug}: HTTP ${res.status}`);
      text = await res.text();
      _cache.set(api, text);
    }
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed?.value)) throw new Error(`WHO GHO ${spec.slug}: no value array`);
    return {
      source: 'who', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url: `https://www.who.int/data/gho/data/indicators/indicator-details/GHO/${spec.slug}`,
      checksum: sha256(text),
      license: 'CC BY-NC-SA 3.0 IGO',
      body: text, ext: 'json', meta: { count: parsed.value.length },
      fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const rows = (JSON.parse(raw.body).value ?? []) as any[];
    // GHO disaggregates by sex on Dim1 (SEX_BTSX / SEX_MLE / SEX_FMLE). Default to both sexes; a spec
    // may override via filter.SEX. Indicators with no sex split (Dim1 null) pass through untouched.
    const sex = spec.filter?.SEX ?? 'SEX_BTSX';
    const byEntity = new Map<string, CanonicalSeries>();
    const seen = new Set<string>(); // entity|year — guard against duplicate disaggregation rows
    for (const row of rows) {
      if (row?.Dim1 != null && row.Dim1 !== sex) continue;
      const code: string = row?.SpatialDim;
      const year = Number(row?.TimeDim);
      const value = Number(row?.NumericValue);
      if (!code || !Number.isFinite(year) || !Number.isFinite(value)) continue;
      const key = `${code}|${year}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (!byEntity.has(code)) {
        byEntity.set(code, {
          indicatorId: spec.id, entity: code, entityName: WHO_ENTITY[code] ?? code, unit: spec.unit, points: [],
          provenance: {
            source: 'who', sourceIndicator: spec.slug, url: raw.url, license: raw.license,
            vintage: raw.vintage, checksum: raw.checksum, definition: spec.title,
            attribution: 'WHO Global Health Observatory', primarySource: spec.primarySource,
            notes: 'CC BY-NC-SA 3.0 IGO — link-only; charted but not re-hosted.',
          },
        });
      }
      byEntity.get(code)!.points.push({ t: year, value });
    }
    for (const s of byEntity.values()) s.points.sort((a, b) => a.t - b.t);
    return [...byEntity.values()];
  },
};
