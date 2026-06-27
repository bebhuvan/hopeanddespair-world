import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* World Bank adapter — the second keystone (DATA.md §11). A JSON REST API with a totally
   different shape from OWID's CSV — proving the adapter framework is genuinely multi-source.
   ~1,400 indicators across economy/health/education/infrastructure, CC BY 4.0. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

// Per-run memo: regional indicators reuse one indicator response (all countries), fetched once.
const _cache = new Map<string, string>();

export const worldbank: Adapter = {
  id: 'worldbank',
  homepage: 'https://data.worldbank.org',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    // spec.slug is the WB indicator code, e.g. "SP.DYN.LE00.IN"
    const api = `https://api.worldbank.org/v2/country/all/indicator/${spec.slug}?format=json&per_page=25000&date=1960:2024`;
    let text = _cache.get(api);
    if (!text) {
      const res = await fetch(api);
      if (!res.ok) throw new Error(`World Bank ${spec.slug}: HTTP ${res.status}`);
      text = await res.text();
      _cache.set(api, text);
    }
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed) || parsed[0]?.message) throw new Error(`World Bank ${spec.slug}: ${JSON.stringify(parsed[0])}`);
    return {
      source: 'worldbank', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url: `https://data.worldbank.org/indicator/${spec.slug}`,
      checksum: sha256(text), license: 'CC BY 4.0',
      body: text, ext: 'json', meta: { pagination: parsed[0] },
      fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const rows = (JSON.parse(raw.body)[1] ?? []) as any[];
    const indicatorName = rows.find((r) => r?.indicator?.value)?.indicator?.value || spec.title;
    const byEntity = new Map<string, CanonicalSeries>();
    for (const row of rows) {
      const entityName: string = row?.country?.value;
      // WB leaves countryiso3code empty for income-group aggregates (High income, etc.) while
      // populating it for countries and region aggregates; fall back to the 2-letter WB id (XD,
      // XT, XN, XM) so income cuts resolve. Only rescues rows that were being skipped.
      const entity: string = row?.countryiso3code || row?.country?.id;
      if (!entity || !entityName) continue; // skip malformed
      if (spec.entityFilter && !spec.entityFilter.includes(entityName)) continue;
      if (row.value == null) continue;
      const year = parseInt(row.date, 10);
      const value = Number(row.value);
      if (!Number.isFinite(year) || !Number.isFinite(value)) continue;
      if (!byEntity.has(entity)) {
        byEntity.set(entity, {
          indicatorId: spec.id, entity, entityName, unit: spec.unit, points: [],
          provenance: {
            source: 'worldbank', sourceIndicator: spec.slug, url: raw.url, license: raw.license,
            vintage: raw.vintage, checksum: raw.checksum, definition: indicatorName,
            attribution: 'World Bank — World Development Indicators', primarySource: spec.primarySource,
          },
        });
      }
      byEntity.get(entity)!.points.push({ t: year, value });
    }
    for (const s of byEntity.values()) s.points.sort((a, b) => a.t - b.t);
    return [...byEntity.values()];
  },
};
