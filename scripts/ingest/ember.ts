import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* Ember adapter — direct CC BY 4.0 electricity data (api.ember-energy.org). OWID's energy
   graphers blend in Energy Institute proprietary data, so they are LINK-ONLY; going to Ember
   directly is cleanly re-hostable. Yearly electricity generation by source, with a World
   aggregate and both absolute (generation_twh) and share (share_of_generation_pct) metrics.
   Needs EMBER_API_KEY in .env — the key is never logged, snapshotted, or committed. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

// Load .env for offline runs (the key lives there, gitignored). No-op if env is injected directly.
try { (process as any).loadEnvFile?.('.env'); } catch { /* .env optional */ }

// One World response carries every series; fetch once per (endpoint, entity), reuse across indicators.
const _cache = new Map<string, string>();

export const ember: Adapter = {
  id: 'ember',
  homepage: 'https://ember-energy.org',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const key = process.env.EMBER_API_KEY;
    if (!key) throw new Error('EMBER_API_KEY is not set. Copy .env.example to .env and add your Ember key.');
    const base = (process.env.EMBER_BASE_URL || 'https://api.ember-energy.org').replace(/\/$/, '');
    const entity = spec.entityFilter?.[0] ?? 'World';
    // The key-LESS url is what we record in the snapshot (committed to git); the key only ever
    // rides on the wire, appended to the request below — never persisted.
    const url = `${base}/v1/${spec.slug}?entity=${encodeURIComponent(entity)}&start_date=2000`;
    let body = _cache.get(url);
    if (!body) {
      const res = await fetch(`${url}&api_key=${key}`);
      if (!res.ok) throw new Error(`Ember ${spec.slug} (${entity}): HTTP ${res.status}`);
      const parsed = JSON.parse(await res.text());
      // Snapshot ONLY the data payload: the `stats` wrapper carries a per-request timestamp that
      // would change the checksum on every run and defeat revision detection (DATA.md §10).
      body = JSON.stringify(parsed.data ?? parsed);
      _cache.set(url, body);
    }
    return {
      source: 'ember', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url, checksum: sha256(body), license: 'CC BY 4.0',
      body, ext: 'json', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const rows = JSON.parse(raw.body) as any[];
    // Each row is {entity, entity_code, date, series, generation_twh, share_of_generation_pct}.
    // spec.seriesName picks the energy source ("Clean", "Fossil", "Wind and solar", …);
    // spec.sourceColumn picks the metric (defaults to the % share).
    const valueField = spec.sourceColumn ?? 'share_of_generation_pct';
    const seriesName = spec.seriesName;
    if (!seriesName) throw new Error(`Ember ${spec.id}: spec.seriesName is required (e.g. "Wind and solar")`);
    const byEntity = new Map<string, CanonicalSeries>();
    for (const row of rows) {
      const entityName: string = row.entity;
      if (spec.entityFilter && !spec.entityFilter.includes(entityName)) continue;
      if (row.series !== seriesName) continue;
      const v = row[valueField];
      if (v == null) continue;
      const year = parseInt(row.date, 10);
      const value = Number(v);
      if (!Number.isFinite(year) || !Number.isFinite(value)) continue;
      const entity = row.entity_code || entityName; // World aggregate has a null code → key on name
      if (!byEntity.has(entity)) {
        byEntity.set(entity, {
          indicatorId: spec.id, entity, entityName, unit: spec.unit, points: [],
          provenance: {
            source: 'ember', sourceIndicator: `${spec.slug}:${seriesName}:${valueField}`,
            url: raw.url, license: raw.license, vintage: raw.vintage, checksum: raw.checksum,
            definition: spec.title, attribution: 'Ember — Yearly Electricity Data',
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
