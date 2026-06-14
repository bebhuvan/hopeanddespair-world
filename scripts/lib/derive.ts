import type { CanonicalSeries, IndicatorSpec } from '../../src/lib/data/types.ts';

/* Derivations are named, recorded recipes (DATA.md §4). The recipe travels with the series so
   the exact calculation is shareable and reproducible. Smoothing is NEVER here — it's cosmetic
   at render time (CHARTS.md). */

export function derive(series: CanonicalSeries[], spec: IndicatorSpec): CanonicalSeries {
  const op = spec.derive?.op ?? 'identity';
  if (op === 'identity') return series[0];

  if (op === 'pick_entity') {
    const want = spec.derive!.entity!;
    const hit = series.find((s) => s.entity === want || s.entityName === want);
    if (!hit) throw new Error(`derive pick_entity: "${want}" not found for ${spec.id}`);
    return { ...hit, recipe: [{ op: 'pick_entity', detail: `selected entity ${want}` }], derivedFrom: [hit.entity] };
  }

  if (op === 'sum_across_entities') {
    // Sum every country (ISO3-coded) per year into a world total. Excludes OWID aggregate rows
    // (regions, "World") so nothing is double-counted. Used where the source has no World line.
    const countries = series.filter((s) => /^[A-Z]{3}$/.test(s.entity));
    if (!countries.length) throw new Error(`derive sum_across_entities: no ISO3 entities for ${spec.id}`);
    const byYear = new Map<number, number>();
    for (const s of countries) for (const p of s.points)
      byYear.set(p.t, (byYear.get(p.t) ?? 0) + p.value);
    const points = [...byYear.entries()].map(([t, value]) => ({ t, value })).sort((a, b) => a.t - b.t);
    const proto = countries[0];
    return {
      indicatorId: spec.id, entity: 'OWID_WRL', entityName: 'World (sum of countries)',
      unit: spec.unit, points,
      provenance: { ...proto.provenance, definition: `${spec.title} — summed across ${countries.length} countries per year` },
      derivedFrom: countries.map((s) => s.entity),
      recipe: [{ op: 'sum_across_entities', detail: `sum over ${countries.length} ISO3 countries of origin, by year` }],
    };
  }

  if (op === 'mean_across_entities') {
    const minE = spec.derive!.minEntities ?? 1;
    const byYear = new Map<number, number[]>();
    for (const s of series) for (const p of s.points) {
      if (!byYear.has(p.t)) byYear.set(p.t, []);
      byYear.get(p.t)!.push(p.value);
    }
    const points = [...byYear.entries()]
      .filter(([, vs]) => vs.length >= minE)
      .map(([t, vs]) => ({ t, value: vs.reduce((a, b) => a + b, 0) / vs.length }))
      .sort((a, b) => a.t - b.t);
    const proto = series[0];
    return {
      indicatorId: spec.id, entity: 'OWID_WEUR', entityName: 'Western Europe (unweighted mean)',
      unit: spec.unit, points,
      provenance: {
        ...proto.provenance,
        definition: `${proto.provenance.definition} — unweighted mean across ${series.length} Western European countries per year`,
      },
      derivedFrom: series.map((s) => s.entity),
      recipe: [{ op: 'mean_across_entities', detail: `unweighted mean of the homicide rate across ${series.length} Western European countries, by year (min ${minE} country present)` }],
    };
  }
  throw new Error(`unknown derive op: ${op}`);
}
