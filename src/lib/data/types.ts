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
  body: string;                  // raw payload as text (CSV or JSON — or pointer to R2 if huge)
  ext: string;                   // 'csv' | 'json' — how the snapshot is written to disk
  meta: any;                     // adapter-specific metadata
  fetchedAt: string;
  adapterVersion: string;
}

/** Registry entry: decouples an article from a source's quirks (DATA.md §4). */
export interface IndicatorSpec {
  id: string;
  title: string;
  unit: string;
  chartId?: string;              // clean slug for public artifacts + article dataRef
  adapter: 'owid' | 'worldbank' | 'ucdp' | 'ember' | 'openalex' | 'nasa' | 'ilostat' | 'convergence' | 'pip' | 'who' | 'berkeley' | 'sealevel' | 'copernicus' | 'iea' | 'unwpp' | 'censusidb' | 'oecd' | 'noaagml' | 'oceanheat' | 'icesheet' | 'wgms' | 'bis' | 'unctad' | 'boc' | 'data360';
  slug: string;                  // OWID chart slug · WB code · UCDP key · Ember path · OpenAlex query · NASA file · ILOSTAT dataflow · WHO GHO indicator code · BIS dataflow (WS_CBPOL/WS_GLI/WS_DSR)
  // IEA Global EV Data Explorer (CC BY 4.0): one CSV per region, picked by these three dimensions.
  iea?: { parameter: string; mode: string; powertrain: string; category?: string };
  // BIS SDMX (link-only — chart, cite, never re-host): the SDMX series key selects the dimensions
  // (FREQ.DIM…, e.g. "M.US" for the Fed policy rate, "Q.USD.3P.N.A.I.B" for dollar credit outside
  // the US); `measure` keeps one UNIT_MEASURE when a key returns both a level and a growth row.
  // Sub-annual data is folded to annual end-of-period (last quarter/month present in each year).
  bis?: { key: string; measure?: string };
  // World Bank Data360 (the Atlas of Global Development surface — data360api.worldbank.org). `slug`
  // is the INDICATOR id (e.g. "WB_WDI_SP_DYN_LE00_IN"); `databaseId` is the dataset (e.g. "WB_WDI").
  // `refArea` pins one reference area (e.g. "WLD" = World) to keep the payload to one page; omit it to
  // pull every area (paginated) and select downstream with entityFilter/derive. Rows carry SDMX-style
  // disaggregation dims (SEX/AGE/URBANISATION/COMP_BREAKDOWN_1..3); the adapter keeps only the total
  // slice (_T / _Z) unless `filter` overrides a dim. WB-origin datasets are CC BY 4.0 (re-hostable);
  // third-party datasets on Data360 may be restricted → set gate: 'link-only' + a `license` override.
  data360?: { databaseId: string; refArea?: string };
  filter?: Record<string, string>; // SDMX dimension filter, e.g. { REF_AREA: 'X01', SEX: 'SEX_T', AGE: 'AGE_YTHADULT_YGE15' }
  seriesName?: string;           // Ember: which energy source row to read (e.g. "Clean", "Fossil", "Wind and solar")
  sourceColumn?: string;         // which column to read (default: the single value column; Ember: the metric field)
  sourceColumns?: string[];      // OWID: sum these columns per row into one value (e.g. conflict types)
  entityFilter?: string[];       // restrict to these source entity names
  yearMin?: number;              // drop rows before this year (e.g. trim deep-time ice-core CO₂ to 1750+)
  yearMax?: number;              // drop rows after this year (e.g. OpenAlex tags works to future/incomplete years)
  valueScale?: number;           // multiply each normalized value (e.g. PIP pop_in_poverty ×1e-6 → millions; headcount fraction ×100 → %)
  // PIP (World Bank Poverty & Inequality Platform) query knobs — the authoritative poverty surface
  // (counts, mean, societal rate) the WDI REST API doesn't carry. One (povline, ppp) fetch serves
  // every measure for World + all regions; pick the measure with sourceColumn, scale with valueScale.
  povline?: number;              // poverty line in PPP$/day (e.g. 3.00 extreme, 4.20 LMIC, 8.30 UMIC)
  pppVersion?: number;           // PPP base year (2021 current; 2017 prior — for the rebasing chart)
  pipEndpoint?: 'pip-grp' | 'pip'; // 'pip-grp' = aggregates (World/regions, default); 'pip' = single countries
  fillGaps?: boolean;            // interpolate non-survey years (disclosed; never drawn as observed)
  derive?: { op: 'mean_across_entities' | 'pick_entity' | 'sum_across_entities' | 'identity'; entity?: string; minEntities?: number };
  // Extend a deep-history series with a modern source after a cutoff year (e.g. Brecke 1400–2000
  // continued by UCDP 2001+). Appended points carry a recipe note; the join is honest, not hidden.
  stitch?: { slug: string; sourceColumns?: string[]; sourceColumn?: string; after: number };
  validate: { min?: number; max?: number; monotonicJump?: number; requireProvenance?: boolean };
  primarySource?: string;
  // License gate (DATA.md §9). 'link-only' = chart it but DON'T generate downloadable artifacts
  // (CC BY-NC-SA / restricted sources we may display but not re-host). Default: re-host.
  gate?: 'rehost' | 'link-only';
  license?: string;              // override the adapter's default license (e.g. FAO's CC BY-NC-SA)
}

export type Severity = 'pass' | 'warn' | 'block';
export interface ValidationIssue { layer: string; severity: Severity; indicatorId: string; message: string; }

export interface Adapter {
  id: string;
  homepage: string;
  fetch(spec: IndicatorSpec): Promise<RawSnapshot>;
  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[]; // PURE
}
