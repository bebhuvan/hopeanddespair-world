import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { datapackage, lineage, toCSV } from '../lib/provenance.ts';
import type { CanonicalSeries, RawSnapshot } from '../../src/lib/data/types.ts';

/* OpenAlex "extras" — facets the main story script left on the table, plus a relabel fix.
   Adds: open-access route mix (gold/green/diamond/hybrid/bronze/closed), English-language share over
   time, and re-emits institution/source-type bars with Title-Case labels (OpenAlex returns those two
   facets' display names lowercased, unlike country/field names). All snapshotted under
   data/sources/openalex/<vintage>. Run: npx tsx scripts/analysis/openalex-extras.ts */

const ROOT = process.cwd();
const VINTAGE = new Date().toISOString().slice(0, 10);
const MAILTO = 'r.bhuvanesh2007@gmail.com';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const w = (p: string, c: string) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, c); };

type Group = { key: string; key_display_name: string; count: number };
type Bar = { label: string; value: number; color: string };
const COL = ['hope', 'hope', 'hope', 'ochre', 'ochre', 'ochre', 'stone', 'stone', 'stone'];
const num = (n: number, scale = 1, d = 1) => +(n / scale).toFixed(d);
const safeSlug = (q: string) => q.replace(/[^\w.-]+/g, '_').replace(/^_|_$/g, '');

async function groupBy(slug: string, perPage = 200) {
  const sep = slug.includes('?') ? '&' : '?';
  const url = `https://api.openalex.org/${slug}${sep}per-page=${perPage}&mailto=${encodeURIComponent(MAILTO)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const parsed = JSON.parse(await res.text());
  if (!Array.isArray(parsed.group_by)) throw new Error(`${slug}: no group_by`);
  const cleanUrl = url.replace(/&mailto=.*$/, '');
  const body = JSON.stringify(parsed.group_by);
  const dir = join(ROOT, 'data/sources/openalex', VINTAGE, safeSlug(slug));
  w(join(dir, 'raw.json'), body);
  w(join(dir, 'snapshot.json'), JSON.stringify({ source: 'openalex', slug, vintage: VINTAGE, url: cleanUrl, checksum: sha256(body), license: 'CC0 1.0', fetchedAt: new Date().toISOString(), adapterVersion: 'openalex-extras-1.0.0' }, null, 2));
  return { groups: parsed.group_by as Group[], body, url: cleanUrl, checksum: sha256(body) };
}

// OpenAlex lowercases the institution/source-type facet display names; tidy them for display.
function titleType(s: string) {
  const o: Record<string, string> = { igsnCatalog: 'IGSN catalog', 'ebook platform': 'Ebook platform' };
  return o[s] ?? s.charAt(0).toUpperCase() + s.slice(1);
}

function writeBars(chartId: string, opts: { title: string; unit: string; yearSpan: string; bars: Bar[]; xmax: number; xTicks: number[]; sourceIndicator: string; url: string; checksum: string; definition: string; recipe: string }) {
  const artifact = {
    chartId, kind: 'bars', title: opts.title, unit: opts.unit, yearSpan: opts.yearSpan, bars: opts.bars,
    xmax: opts.xmax, xTicks: opts.xTicks,
    provenance: { source: 'openalex', sourceIndicator: opts.sourceIndicator, url: opts.url, license: 'CC0 1.0', vintage: VINTAGE, checksum: opts.checksum, definition: opts.definition, attribution: 'OpenAlex', primarySource: 'OpenAlex' },
    recipe: [{ op: 'openalex_group_by', detail: opts.recipe }],
  };
  w(join(ROOT, `src/data/derived/${chartId}.json`), JSON.stringify(artifact, null, 2));
}

function writeSeries(chartId: string, series: CanonicalSeries, raw: RawSnapshot) {
  w(join(ROOT, `src/data/derived/${chartId}.json`), JSON.stringify(series, null, 2));
  w(join(ROOT, 'public/charts', chartId, 'data.csv'), toCSV(series));
  w(join(ROOT, 'public/charts', chartId, 'datapackage.json'), JSON.stringify(datapackage(series), null, 2));
  w(join(ROOT, 'public/charts', chartId, 'lineage.json'), JSON.stringify(lineage(series, raw), null, 2));
}

async function main() {
  // A. Relabel fix: institution types + source types, Title-Cased, freshly snapshotted.
  const inst = await groupBy('works?filter=from_publication_date:2024-01-01,to_publication_date:2024-12-31&group_by=authorships.institutions.type');
  writeBars('openalex-institution-types-2024', {
    title: 'Works by institution type, 2024', unit: 'works, million', yearSpan: '2024',
    bars: inst.groups.slice(0, 9).map((g, i) => ({ label: titleType(g.key_display_name), value: num(g.count, 1_000_000, 2), color: COL[i] ?? 'stone' })),
    xmax: 6, xTicks: [0, 1.5, 3, 4.5, 6],
    sourceIndicator: 'works group_by authorships.institutions.type', url: inst.url, checksum: inst.checksum,
    definition: 'Works published in 2024, grouped by type of authorship institutions attached in OpenAlex.',
    recipe: 'group 2024 works by authorship institution type; show counts in millions',
  });
  const src = await groupBy('works?filter=from_publication_date:2024-01-01,to_publication_date:2024-12-31&group_by=primary_location.source.type');
  writeBars('openalex-source-types-2024', {
    title: 'Works by source type, 2024', unit: 'works, million', yearSpan: '2024',
    bars: src.groups.filter((g) => g.count > 0).slice(0, 7).map((g, i) => ({ label: titleType(g.key_display_name), value: num(g.count, 1_000_000, 2), color: COL[i] ?? 'stone' })),
    xmax: 8, xTicks: [0, 2, 4, 6, 8],
    sourceIndicator: 'works group_by primary_location.source.type', url: src.url, checksum: src.checksum,
    definition: 'Works published in 2024, grouped by the source type of their primary location in OpenAlex.',
    recipe: 'group 2024 works by primary location source type; show counts in millions',
  });

  // B. Open-access route mix, 2024. Colour by how open/durable each route is.
  const oa = await groupBy('works?filter=from_publication_date:2024-01-01,to_publication_date:2024-12-31&group_by=open_access.oa_status');
  const routeColor: Record<string, string> = { diamond: 'hope', green: 'hope', gold: 'ochre', hybrid: 'ochre', bronze: 'stone', closed: 'despair' };
  writeBars('openalex-oa-status-2024', {
    title: 'Works by open-access route, 2024', unit: 'works, million', yearSpan: '2024',
    bars: oa.groups.filter((g) => g.count > 0).map((g) => ({ label: titleType(g.key_display_name), value: num(g.count, 1_000_000, 2), color: routeColor[g.key] ?? 'stone' })),
    xmax: 5, xTicks: [0, 1, 2, 3, 4, 5],
    sourceIndicator: 'works group_by open_access.oa_status', url: oa.url, checksum: oa.checksum,
    definition: 'Works published in 2024 by open-access route. Diamond and gold are open journals (diamond charges no author fee); green is self-archived; hybrid and bronze are open articles in otherwise paywalled venues; closed is paywalled.',
    recipe: 'group 2024 works by open-access route (open_access.oa_status); show counts in millions',
  });

  // C. English-language share of works over time. Denominator: all works that year.
  const enYear = await groupBy('works?filter=from_publication_date:2000-01-01,to_publication_date:2024-12-31,language:en&group_by=publication_year', 100);
  const totYear = await groupBy('works?filter=from_publication_date:2000-01-01,to_publication_date:2024-12-31&group_by=publication_year', 100);
  const byYear = (g: Group[]) => new Map(g.map((x) => [+x.key, x.count]).filter(([y]) => Number.isFinite(y)));
  const en = byYear(enYear.groups); const tot = byYear(totYear.groups);
  const points = [...tot.entries()].filter(([y, t]) => y >= 2000 && y <= 2024 && t > 0)
    .map(([y, t]) => ({ t: y, value: +(((en.get(y) ?? 0) / t) * 100).toFixed(1) }))
    .sort((a, b) => a.t - b.t);
  const checksum = sha256(enYear.body + totYear.body);
  const series: CanonicalSeries = {
    indicatorId: 'science.openalex_english_share.world', entity: 'World', entityName: 'World', unit: '% of works', points,
    derivedFrom: [enYear.checksum, totYear.checksum],
    provenance: { source: 'openalex', sourceIndicator: 'works language:en / all works, group_by publication_year', url: enYear.url, license: 'CC0 1.0', vintage: VINTAGE, checksum, definition: 'Share of OpenAlex works detected as English, by publication year.', attribution: 'OpenAlex', primarySource: 'OpenAlex' },
    recipe: [{ op: 'ratio', detail: 'divided yearly works with language:en by all works in the same publication year, 2000-2024' }],
  };
  const raw: RawSnapshot = { source: 'openalex', slug: 'works?filter=language:en&group_by=publication_year', vintage: VINTAGE, url: enYear.url, checksum, license: 'CC0 1.0', body: '', ext: 'json', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: 'openalex-extras-1.0.0' };
  writeSeries('openalex-english-share-world', series, raw);

  console.log('✓ extras: institution+source types relabelled; oa-route bars; english share',
    `2000=${points.find((p) => p.t === 2000)?.value}% 2015=${points.find((p) => p.t === 2015)?.value}% 2024=${points.find((p) => p.t === 2024)?.value}%`);
}

await main();
