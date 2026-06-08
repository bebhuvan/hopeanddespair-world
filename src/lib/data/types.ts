import { z } from 'zod';

/* Canonical data model — the single normalized form every source converges to (DATA.md §3, §6).
   Shared by the offline pipeline and the site (so the site reads exactly what was validated). */

export const Provenance = z.object({
  source: z.string(),            // adapter id, e.g. "owid"
  sourceIndicator: z.string(),   // the source's own column/code
  url: z.string().url(),
  license: z.string(),           // drives the re-host vs link-only gate (DATA.md §9)
  vintage: z.string(),           // ISO date we pinned the snapshot
  checksum: z.string(),          // sha256 of the raw bytes
  definition: z.string(),        // what the indicator actually measures
  attribution: z.string(),       // human credit line (generated into Sources)
  primarySource: z.string().optional(), // underlying producer beyond the aggregator
  notes: z.string().optional(),
});
export type Provenance = z.infer<typeof Provenance>;

export const CanonicalPoint = z.object({
  t: z.number(),                 // year (int) — canonical time; daily/monthly use ISO via `date`
  value: z.number(),
});
export type CanonicalPoint = z.infer<typeof CanonicalPoint>;

export const CanonicalSeries = z.object({
  indicatorId: z.string(),       // internal stable id, e.g. "violence.homicide_rate.western_europe"
  entity: z.string(),            // canonical entity code (ISO3 / "World" / region)
  entityName: z.string(),
  unit: z.string(),
  points: z.array(CanonicalPoint).min(1),
  provenance: Provenance,
  /** the recorded recipe, if this is a derived series (DATA.md §4) */
  derivedFrom: z.array(z.string()).optional(),
  recipe: z.array(z.object({ op: z.string(), detail: z.string() })).optional(),
});
export type CanonicalSeries = z.infer<typeof CanonicalSeries>;

export interface RawSnapshot {
  source: string;
  slug: string;
  vintage: string;
  url: string;
  checksum: string;
  license: string;
  csv: string;                   // raw CSV text (or pointer to R2 if huge — DATA.md §2)
  meta: any;                     // raw metadata json
  fetchedAt: string;
  adapterVersion: string;
}

/** Registry entry: decouples an article from a source's quirks (DATA.md §4). */
export interface IndicatorSpec {
  id: string;
  title: string;
  unit: string;
  chartId?: string;              // clean slug for public artifacts + article dataRef
  adapter: 'owid';
  slug: string;                  // source chart/dataset slug
  sourceColumn?: string;         // which column to read (default: the single value column)
  entityFilter?: string[];       // restrict to these source entity names
  derive?: { op: 'mean_across_entities' | 'pick_entity' | 'identity'; entity?: string; minEntities?: number };
  validate: { min?: number; max?: number; monotonicJump?: number; requireProvenance?: boolean };
  primarySource?: string;
}

export type Severity = 'pass' | 'warn' | 'block';
export interface ValidationIssue { layer: string; severity: Severity; indicatorId: string; message: string; }

export interface Adapter {
  id: string;
  homepage: string;
  fetch(spec: IndicatorSpec): Promise<RawSnapshot>;
  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[]; // PURE
}
