import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { datapackage, lineage, toCSV } from '../lib/provenance.ts';
import type { CanonicalSeries, RawSnapshot } from '../../src/lib/data/types.ts';

/* OpenAlex open-access share over time = (works marked is_oa) / (all works), per publication year.
   Derived offline from two already-snapshotted full-history series, so this adds no network call and
   no new vintage churn: it only divides series the pipeline already produced. The chart it feeds is
   the cleanest single "the door is opening" line in the article. Run: npx tsx scripts/analysis/openalex-oa-share.ts */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const w = (p: string, c: string) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, c); };
const readDerived = (id: string) => JSON.parse(readFileSync(join(ROOT, `src/data/derived/${id}.json`), 'utf8')) as CanonicalSeries;

const CHART_ID = 'openalex-open-access-share-world';

function main() {
  const total = readDerived('works-total-world');
  const oa = readDerived('works-open-access-world');
  const totalByYear = new Map(total.points.map((p) => [p.t, p.value]));

  // Share only where both years exist and the denominator is non-zero.
  const points = oa.points
    .filter((p) => (totalByYear.get(p.t) ?? 0) > 0)
    .map((p) => ({ t: p.t, value: +((p.value / (totalByYear.get(p.t) as number)) * 100).toFixed(1) }))
    .sort((a, b) => a.t - b.t);

  // The two parents share a vintage; carry it forward so the derived series is dated to its inputs,
  // not to whenever this transform last ran.
  const vintage = oa.provenance.vintage;
  const checksum = sha256(`${total.provenance.checksum}|${oa.provenance.checksum}`);

  const series: CanonicalSeries = {
    indicatorId: 'science.works_open_access_share.world',
    entity: 'World',
    entityName: 'World',
    unit: '% of works',
    points,
    derivedFrom: [total.provenance.checksum, oa.provenance.checksum],
    provenance: {
      source: 'openalex',
      sourceIndicator: 'works is_oa:true / all works, group_by publication_year',
      url: 'https://api.openalex.org/works?filter=is_oa:true&group_by=publication_year',
      license: 'CC0 1.0',
      vintage,
      checksum,
      definition: 'Share of OpenAlex works marked open access, by publication year.',
      attribution: 'OpenAlex',
      primarySource: 'OpenAlex',
    },
    recipe: [{ op: 'ratio', detail: 'divided yearly open-access works (is_oa:true) by all works in the same publication year' }],
  };

  const raw: RawSnapshot = {
    source: 'openalex', slug: 'works?filter=is_oa:true&group_by=publication_year',
    vintage, url: series.provenance.url, checksum, license: 'CC0 1.0',
    body: '', ext: 'json', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: 'openalex-oa-share-1.0.0',
  };

  w(join(ROOT, `src/data/derived/${CHART_ID}.json`), JSON.stringify(series, null, 2));
  w(join(ROOT, 'public/charts', CHART_ID, 'data.csv'), toCSV(series));
  w(join(ROOT, 'public/charts', CHART_ID, 'datapackage.json'), JSON.stringify(datapackage(series), null, 2));
  w(join(ROOT, 'public/charts', CHART_ID, 'lineage.json'), JSON.stringify(lineage(series, raw), null, 2));

  const span = `${points[0].t}-${points[points.length - 1].t}`;
  console.log(`✓ ${CHART_ID}: ${points.length} points (${span}); 2000=${points.find((p) => p.t === 2000)?.value}% 2024=${points.find((p) => p.t === 2024)?.value}%`);
}

main();
