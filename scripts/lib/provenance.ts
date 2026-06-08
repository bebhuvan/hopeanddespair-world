import type { CanonicalSeries, RawSnapshot } from '../../src/lib/data/types.ts';

/* Openness artifacts (DATA.md §8): a Frictionless Data package, a W3C-PROV-style lineage
   manifest, and the downloadable CSV. These are pre-baked so downloads are free at runtime. */

export function toCSV(series: CanonicalSeries): string {
  const head = `year,${series.indicatorId.replace(/\W+/g, '_')}\n`;
  return head + series.points.map((p) => `${p.t},${p.value}`).join('\n') + '\n';
}

/** Frictionless Tabular Data Package descriptor (portable, standard). */
export function datapackage(series: CanonicalSeries) {
  const p = series.provenance;
  return {
    name: series.indicatorId.replace(/\./g, '-'),
    title: p.definition,
    licenses: [{ name: p.license, path: 'https://creativecommons.org/licenses/by/4.0/' }],
    sources: [{ title: p.attribution, path: p.url }],
    created: p.vintage,
    resources: [{
      name: series.indicatorId.replace(/\./g, '-'),
      path: 'data.csv',
      format: 'csv',
      mediatype: 'text/csv',
      schema: {
        fields: [
          { name: 'year', type: 'integer' },
          { name: series.indicatorId.replace(/\W+/g, '_'), type: 'number', unit: series.unit },
        ],
      },
    }],
  };
}

/** W3C-PROV-style lineage: derived ← normalized ← raw ← source. */
export function lineage(series: CanonicalSeries, raw: RawSnapshot) {
  return {
    entity: { id: series.indicatorId, unit: series.unit, points: series.points.length },
    wasDerivedFrom: series.derivedFrom ?? [],
    wasGeneratedBy: {
      activity: 'pipeline',
      recipe: series.recipe ?? [{ op: 'identity', detail: 'normalized directly from source' }],
      agent: `adapter:${raw.source}@${raw.adapterVersion}`,
      used: { source: raw.source, slug: raw.slug, url: raw.url, vintage: raw.vintage, checksum: raw.checksum, license: raw.license },
    },
    primarySource: series.provenance.primarySource ?? null,
  };
}
