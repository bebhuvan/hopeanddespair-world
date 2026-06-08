import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* Our World in Data adapter — the keystone (DATA.md §3, OWID-first).
   Bulk grapher CSV + metadata JSON; one snapshot per slug, pinned by checksum. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

/** Minimal RFC-4180-ish CSV parser (entity names contain commas, e.g. "Korea, Rep."). */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''));
}

export const owid: Adapter = {
  id: 'owid',
  homepage: 'https://ourworldindata.org',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const base = `https://ourworldindata.org/grapher/${spec.slug}`;
    const csvUrl = `${base}.csv?csvType=full&useColumnShortNames=true`;
    const metaUrl = `${base}.metadata.json`;
    const [csvRes, metaRes] = await Promise.all([fetch(csvUrl), fetch(metaUrl)]);
    if (!csvRes.ok) throw new Error(`OWID csv ${spec.slug}: HTTP ${csvRes.status}`);
    const csv = await csvRes.text();
    const meta = metaRes.ok ? await metaRes.json() : {};
    return {
      source: 'owid', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url: base, checksum: sha256(csv), license: 'CC BY 4.0',
      csv, meta, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const rows = parseCSV(raw.csv);
    const header = rows[0];
    const iEntity = header.indexOf('entity');
    const iCode = header.indexOf('code');
    const iYear = header.indexOf('year');
    const valueCol = spec.sourceColumn ?? header[header.length - 1];
    const iVal = header.indexOf(valueCol);
    if (iEntity < 0 || iYear < 0 || iVal < 0) throw new Error(`OWID ${spec.slug}: unexpected columns ${header.join(',')}`);

    // Provenance pulled from the metadata, with OWID's CC BY default.
    const colMeta = (raw.meta?.columns && Object.values(raw.meta.columns)[0]) as any || {};
    const origins = (colMeta.origins as any[]) || [];
    const producers = [...new Set(origins.map((o) => o.producer).filter(Boolean))];
    const definition = colMeta.descriptionShort || spec.title;
    const attribution = colMeta.attributionShort || producers.join('; ') || 'Our World in Data';
    const sourceUnit = colMeta.unit || spec.unit; // the source's declared unit — validated vs registry

    const byEntity = new Map<string, CanonicalSeries>();
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const entityName = row[iEntity];
      if (spec.entityFilter && !spec.entityFilter.includes(entityName)) continue;
      const year = parseInt(row[iYear], 10);
      const raw_v = row[iVal];
      if (raw_v === '' || raw_v == null) continue;
      const value = Number(raw_v);
      if (!Number.isFinite(value) || !Number.isFinite(year)) continue;
      const entity = (iCode >= 0 && row[iCode]) ? row[iCode] : entityName;
      if (!byEntity.has(entity)) {
        byEntity.set(entity, {
          indicatorId: spec.id, entity, entityName, unit: sourceUnit, points: [],
          provenance: {
            source: 'owid', sourceIndicator: valueCol, url: raw.url, license: raw.license,
            vintage: raw.vintage, checksum: raw.checksum, definition, attribution,
            primarySource: spec.primarySource ?? (producers.join('; ') || undefined),
          },
        });
      }
      byEntity.get(entity)!.points.push({ t: year, value });
    }
    for (const s of byEntity.values()) s.points.sort((a, b) => a.t - b.t);
    return [...byEntity.values()];
  },
};
