import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { INDICATORS } from '../registry/indicators.ts';
import { owid } from './ingest/owid.ts';
import { validateSeries, report } from './lib/validate.ts';
import { derive } from './lib/derive.ts';
import { toCSV, datapackage, lineage } from './lib/provenance.ts';
import type { Adapter, ValidationIssue } from '../src/lib/data/types.ts';

/* The offline ingestion pipeline (DATA.md §2): fetch → snapshot → normalize → validate →
   derive → validate → write artifacts. Run with `pnpm data`. Static build reads the output. */

const adapters: Record<string, Adapter> = { owid };
const ROOT = process.cwd();
const w = (p: string, c: string) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, c); };

let blocked = false;

for (const spec of INDICATORS) {
  console.log(`\n▶ ${spec.id}  (${spec.adapter}:${spec.slug})`);
  const adapter = adapters[spec.adapter];
  const raw = await adapter.fetch(spec);

  // 1. Snapshot — pin the raw bytes by vintage + checksum (DATA.md §1, §2)
  const snapDir = join(ROOT, 'data/sources', raw.source, raw.vintage, spec.slug);
  w(join(snapDir, 'raw.csv'), raw.csv);
  w(join(snapDir, 'snapshot.json'), JSON.stringify({
    source: raw.source, slug: raw.slug, vintage: raw.vintage, url: raw.url,
    checksum: raw.checksum, license: raw.license, fetchedAt: raw.fetchedAt, adapterVersion: raw.adapterVersion,
  }, null, 2));
  console.log(`  snapshot ${raw.checksum.slice(0, 12)}… (${(raw.csv.length / 1024).toFixed(0)} kB, ${raw.vintage})`);

  // 2. Normalize (pure) + validate every entity series
  const series = adapter.normalize(raw, spec);
  const issues: ValidationIssue[] = series.flatMap((s) => validateSeries(s, spec));

  // 3. Derive + validate the result
  const derived = derive(series, spec);
  issues.push(...validateSeries(derived, spec));

  const rep = report(issues);
  console.log(rep.text);
  if (rep.blocked) { blocked = true; continue; }

  // 4. Write artifacts: normalized (git), derived (Astro-importable), openness (public)
  const cid = spec.chartId ?? spec.id.replace(/\./g, '-');
  w(join(ROOT, 'data/normalized', spec.id + '.json'), JSON.stringify(series, null, 2));
  w(join(ROOT, 'src/data/derived', cid + '.json'), JSON.stringify(derived, null, 2));
  w(join(ROOT, 'public/charts', cid, 'data.csv'), toCSV(derived));
  w(join(ROOT, 'public/charts', cid, 'datapackage.json'), JSON.stringify(datapackage(derived), null, 2));
  w(join(ROOT, 'public/charts', cid, 'lineage.json'), JSON.stringify(lineage(derived, raw), null, 2));
  console.log(`  ✓ ${derived.points.length} points → src/data/derived/${cid}.json + public/charts/${cid}/`);
}

if (blocked) { console.error('\n✗ pipeline blocked by validation — nothing published for blocked indicators'); process.exit(1); }
console.log('\n✓ pipeline complete');
