import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { INDICATORS } from '../registry/indicators.ts';
import { owid } from './ingest/owid.ts';
import { worldbank } from './ingest/worldbank.ts';
import { ucdp } from './ingest/ucdp.ts';
import { ember } from './ingest/ember.ts';
import { openalex } from './ingest/openalex.ts';
import { nasa } from './ingest/nasa.ts';
import { ilostat } from './ingest/ilostat.ts';
import { convergence } from './ingest/convergence.ts';
import { pip } from './ingest/pip.ts';
import { who } from './ingest/who.ts';
import { berkeley } from './ingest/berkeley.ts';
import { sealevel } from './ingest/sealevel.ts';
import { copernicus } from './ingest/copernicus.ts';
import { iea } from './ingest/iea.ts';
import { unwpp } from './ingest/unwpp.ts';
import { noaagml } from './ingest/noaagml.ts';
import { oceanheat } from './ingest/oceanheat.ts';
import { icesheet } from './ingest/icesheet.ts';
import { wgms } from './ingest/wgms.ts';
import { validateSeries, report } from './lib/validate.ts';
import { derive } from './lib/derive.ts';
import { toCSV, datapackage, lineage } from './lib/provenance.ts';
import type { Adapter, ValidationIssue } from '../src/lib/data/types.ts';

/* The offline ingestion pipeline (DATA.md §2): fetch → snapshot → normalize → validate →
   derive → validate → write artifacts. Run with `pnpm data`. Static build reads the output. */

const adapters: Record<string, Adapter> = { owid, worldbank, ucdp, ember, openalex, nasa, ilostat, convergence, pip, who, berkeley, sealevel, copernicus, iea, unwpp, noaagml, oceanheat, icesheet, wgms };
const ROOT = process.cwd();
const w = (p: string, c: string) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, c); };

let blocked = false;

// Dev convenience: `ONLY=energy pnpm data` processes just the indicators whose id contains the
// substring — fast iteration on one source without refetching the whole atlas.
const only = process.env.ONLY;
const specs = only ? INDICATORS.filter((s) => s.id.includes(only)) : INDICATORS;
if (only) console.log(`(ONLY=${only} → ${specs.length} of ${INDICATORS.length} indicators)`);

for (const spec of specs) {
  console.log(`\n▶ ${spec.id}  (${spec.adapter}:${spec.slug})`);
  try {
  const adapter = adapters[spec.adapter];
  const raw = await adapter.fetch(spec);

  // 1. Snapshot — pin the raw bytes by vintage + checksum (DATA.md §1, §2)
  const safeSlug = spec.slug.replace(/[^\w.-]/g, '_');
  const snapDir = join(ROOT, 'data/sources', raw.source, raw.vintage, safeSlug);
  w(join(snapDir, `raw.${raw.ext}`), raw.body);
  w(join(snapDir, 'snapshot.json'), JSON.stringify({
    source: raw.source, slug: raw.slug, vintage: raw.vintage, url: raw.url,
    checksum: raw.checksum, license: raw.license, fetchedAt: raw.fetchedAt, adapterVersion: raw.adapterVersion,
  }, null, 2));
  console.log(`  snapshot ${raw.checksum.slice(0, 12)}… (${(raw.body.length / 1024).toFixed(0)} kB, ${raw.vintage})`);

  // 2. Normalize (pure) + validate every entity series
  const series = adapter.normalize(raw, spec);
  const issues: ValidationIssue[] = series.flatMap((s) => validateSeries(s, spec));

  // 3. Derive + validate the result
  const derived = derive(series, spec);

  // 3b. Optional stitch: extend a deep-history series with a modern source after a cutoff year.
  if (spec.stitch) {
    const ss = { ...spec, slug: spec.stitch.slug, sourceColumn: spec.stitch.sourceColumn, sourceColumns: spec.stitch.sourceColumns };
    const raw2 = await adapter.fetch(ss);
    const d2 = derive(adapter.normalize(raw2, ss), ss);
    const tail = d2.points.filter((p) => p.t > spec.stitch!.after);
    derived.points = derived.points.filter((p) => p.t <= spec.stitch!.after).concat(tail);
    (derived.recipe ??= []).push({ op: 'stitch', detail: `extended with ${spec.stitch.slug} after ${spec.stitch.after}` });
    console.log(`  stitched +${tail.length} pts from ${spec.stitch.slug} (after ${spec.stitch.after} → ${derived.points[derived.points.length - 1].t})`);
  }

  issues.push(...validateSeries(derived, spec));

  const rep = report(issues);
  console.log(rep.text);
  if (rep.blocked) { blocked = true; continue; }

  // 3c. License override + gate. A 'link-only' source (e.g. FAO CC BY-NC-SA) may be charted but
  // NOT re-hosted — record the true license and skip the downloadable artifacts (DATA.md §9).
  if (spec.license) { derived.provenance.license = spec.license; for (const s of series) s.provenance.license = spec.license; }
  const linkOnly = spec.gate === 'link-only';

  // 4. Write artifacts: normalized (git), derived (Astro-importable), openness (public)
  const cid = spec.chartId ?? spec.id.replace(/\./g, '-');
  w(join(ROOT, 'data/normalized', spec.id + '.json'), JSON.stringify(series, null, 2));
  w(join(ROOT, 'src/data/derived', cid + '.json'), JSON.stringify(derived, null, 2));
  if (!linkOnly) {
    w(join(ROOT, 'public/charts', cid, 'data.csv'), toCSV(derived));
    w(join(ROOT, 'public/charts', cid, 'datapackage.json'), JSON.stringify(datapackage(derived), null, 2));
    w(join(ROOT, 'public/charts', cid, 'lineage.json'), JSON.stringify(lineage(derived, raw), null, 2));
  }
  console.log(`  ✓ ${derived.points.length} points → src/data/derived/${cid}.json${linkOnly ? ' (link-only — no downloads)' : ' + public/charts/' + cid + '/'}`);
  } catch (e) {
    // A failed fetch/ingest flags staleness, it does not block publish: the last good build
    // stands and unrelated indicators still run (DATA.md §10). Resilient as the list grows.
    console.error(`  ✗ ingest failed: ${(e as Error).message} — skipping`);
  }
}

if (blocked) { console.error('\n✗ pipeline blocked by validation — nothing published for blocked indicators'); process.exit(1); }
console.log('\n✓ pipeline complete');
