import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { datapackage, lineage, toCSV } from '../lib/provenance.ts';
import type { CanonicalSeries, RawSnapshot } from '../../src/lib/data/types.ts';

/* OpenAlex story artifacts: not just "how many papers?", but the graph of scientific power.
   These are derived from official OpenAlex group_by queries and snapshotted into the repo so the
   article stays static and reproducible. Run: npx tsx scripts/analysis/openalex-story.ts */

const ROOT = process.cwd();
const VINTAGE = new Date().toISOString().slice(0, 10);
const MAILTO = 'r.bhuvanesh2007@gmail.com';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const w = (p: string, c: string) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, c); };

type Group = { key: string; key_display_name: string; count: number };
type Bar = { label: string; value: number; color: string; note?: string };

const COL = ['hope', 'hope', 'hope', 'ochre', 'ochre', 'ochre', 'stone', 'stone', 'stone', 'despair', 'despair', 'despair'];

function safeSlug(q: string) {
  return q.replace(/[^\w.-]+/g, '_').replace(/^_|_$/g, '');
}

async function groupBy(slug: string, perPage = 200): Promise<{ groups: Group[]; body: string; url: string; checksum: string }> {
  const sep = slug.includes('?') ? '&' : '?';
  const apiSlug = `${slug}${sep}per-page=${perPage}&mailto=${encodeURIComponent(MAILTO)}`;
  const url = `https://api.openalex.org/${apiSlug}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const body = await res.text();
  const parsed = JSON.parse(body);
  if (!Array.isArray(parsed.group_by)) throw new Error(`${slug}: no group_by in response`);
  const dir = join(ROOT, 'data/sources/openalex', VINTAGE, safeSlug(slug));
  const groupBody = JSON.stringify(parsed.group_by);
  w(join(dir, 'raw.json'), groupBody);
  w(join(dir, 'snapshot.json'), JSON.stringify({
    source: 'openalex', slug, vintage: VINTAGE, url: url.replace(/&mailto=.*$/, ''),
    checksum: sha256(groupBody), license: 'CC0 1.0', fetchedAt: new Date().toISOString(),
    adapterVersion: 'openalex-story-1.0.0',
  }, null, 2));
  return { groups: parsed.group_by, body: groupBody, url: url.replace(/&mailto=.*$/, ''), checksum: sha256(groupBody) };
}

function num(n: number, scale = 1, decimals = 1) {
  return +(n / scale).toFixed(decimals);
}

function barsArtifact(opts: {
  chartId: string; title: string; unit: string; yearSpan: string; bars: Bar[];
  xmax: number; xTicks: number[]; sourceIndicator: string; url: string; checksum: string;
  definition: string; recipe: string;
}) {
  return {
    chartId: opts.chartId,
    kind: 'bars',
    title: opts.title,
    unit: opts.unit,
    yearSpan: opts.yearSpan,
    bars: opts.bars,
    xmax: opts.xmax,
    xTicks: opts.xTicks,
    provenance: {
      source: 'openalex',
      sourceIndicator: opts.sourceIndicator,
      url: opts.url,
      license: 'CC0 1.0',
      vintage: VINTAGE,
      checksum: opts.checksum,
      definition: opts.definition,
      attribution: 'OpenAlex',
      primarySource: 'OpenAlex',
    },
    recipe: [{ op: 'openalex_group_by', detail: opts.recipe }],
  };
}

function writeBars(chartId: string, artifact: any) {
  w(join(ROOT, `src/data/derived/${chartId}.json`), JSON.stringify(artifact, null, 2));
}

function writeSeries(chartId: string, series: CanonicalSeries, raw: RawSnapshot) {
  w(join(ROOT, `src/data/derived/${chartId}.json`), JSON.stringify(series, null, 2));
  w(join(ROOT, 'public/charts', chartId, 'data.csv'), toCSV(series));
  w(join(ROOT, 'public/charts', chartId, 'datapackage.json'), JSON.stringify(datapackage(series), null, 2));
  w(join(ROOT, 'public/charts', chartId, 'lineage.json'), JSON.stringify(lineage(series, raw), null, 2));
}

function seriesFromYearGroups(opts: {
  chartId: string; indicatorId: string; title: string; unit: string; groups: Group[];
  slug: string; url: string; checksum: string; definition: string; recipe: string;
  scale?: number; decimals?: number;
}) {
  const scale = opts.scale ?? 1;
  const decimals = opts.decimals ?? 0;
  const series: CanonicalSeries = {
    indicatorId: opts.indicatorId,
    entity: 'World',
    entityName: 'World',
    unit: opts.unit,
    points: opts.groups
      .map((g) => ({ t: +g.key, value: num(g.count, scale, decimals) }))
      .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.value))
      .sort((a, b) => a.t - b.t),
    provenance: {
      source: 'openalex',
      sourceIndicator: opts.slug,
      url: opts.url,
      license: 'CC0 1.0',
      vintage: VINTAGE,
      checksum: opts.checksum,
      definition: opts.definition,
      attribution: 'OpenAlex',
      primarySource: 'OpenAlex',
    },
    recipe: [{ op: 'openalex_group_by', detail: opts.recipe }],
  };
  writeSeries(opts.chartId, series, rawFor(opts.slug, opts.url, opts.checksum));
}

function writePointSeries(opts: {
  chartId: string; indicatorId: string; unit: string; points: { t: number; value: number }[];
  sourceIndicator: string; url: string; checksum: string; definition: string; recipe: string;
}) {
  const series: CanonicalSeries = {
    indicatorId: opts.indicatorId,
    entity: 'World',
    entityName: 'World',
    unit: opts.unit,
    points: opts.points.sort((a, b) => a.t - b.t),
    provenance: {
      source: 'openalex',
      sourceIndicator: opts.sourceIndicator,
      url: opts.url,
      license: 'CC0 1.0',
      vintage: VINTAGE,
      checksum: opts.checksum,
      definition: opts.definition,
      attribution: 'OpenAlex',
      primarySource: 'OpenAlex',
    },
    recipe: [{ op: 'derived_transform', detail: opts.recipe }],
  };
  writeSeries(opts.chartId, series, rawFor(opts.sourceIndicator, opts.url, opts.checksum));
}

function rawFor(slug: string, url: string, checksum: string): RawSnapshot {
  return {
    source: 'openalex', slug, vintage: VINTAGE, url, checksum, license: 'CC0 1.0',
    body: '', ext: 'json', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: 'openalex-story-1.0.0',
  };
}

function top(groups: Group[], n: number, scale = 1, decimals = 1): Bar[] {
  return groups.slice(0, n).map((g, i) => ({ label: cleanLabel(g.key_display_name), value: num(g.count, scale, decimals), color: COL[i] ?? 'stone' }));
}

function cleanLabel(s: string) {
  return s
    .replace('United States of America', 'United States')
    .replace('United Kingdom of Great Britain and Northern Ireland', 'United Kingdom')
    .replace('Russian Federation', 'Russia')
    .replace('Korea, Republic of', 'South Korea')
    .replace('Iran, Islamic Republic of', 'Iran');
}

// OpenAlex lowercases the institution/source-type facet display names (unlike country/field names);
// Title-Case them for display. Mirrors titleType in openalex-extras.ts — keep the two in sync.
function titleType(s: string) {
  const o: Record<string, string> = { igsnCatalog: 'IGSN catalog', 'ebook platform': 'Ebook platform' };
  return o[s] ?? s.charAt(0).toUpperCase() + s.slice(1);
}
const titleBars = (bars: Bar[]) => bars.map((b) => ({ ...b, label: titleType(b.label) }));

function byName(groups: Group[]) {
  const out: Record<string, number> = {};
  for (const g of groups) out[cleanLabel(g.key_display_name)] = g.count;
  return out;
}

function byYear(groups: Group[]) {
  return new Map(groups.map((g) => [+g.key, g.count]).filter(([y, v]) => Number.isFinite(y) && Number.isFinite(v)));
}

async function main() {
  const totalYearAll = await groupBy('works?filter=from_publication_date:2000-01-01,to_publication_date:2024-12-31&group_by=publication_year', 100);
  const totalByYear = byYear(totalYearAll.groups);

  // 1. Where the works come from.
  const countries2024 = await groupBy('works?filter=from_publication_date:2024-01-01,to_publication_date:2024-12-31&group_by=authorships.institutions.country_code');
  writeBars('openalex-works-by-country-2024', barsArtifact({
    chartId: 'openalex-works-by-country-2024',
    title: 'OpenAlex works by author-country, 2024',
    unit: 'works, million',
    yearSpan: '2024',
    bars: top(countries2024.groups, 12, 1_000_000, 2),
    xmax: 1.4,
    xTicks: [0, 0.35, 0.7, 1.05, 1.4],
    sourceIndicator: 'works group_by authorships.institutions.country_code',
    url: countries2024.url,
    checksum: countries2024.checksum,
    definition: 'Works published in 2024, grouped by countries attached to authorship institutions. A multi-country paper can count once for each country represented.',
    recipe: 'group 2024 works by author institution country; show the top 12 in millions',
  }));

  // 1b. How the geography moved: selected countries as counts, indexed growth, and world share.
  const countrySeries = [
    ['china', 'China', 'CN'],
    ['united-states', 'United States', 'US'],
    ['india', 'India', 'IN'],
    ['indonesia', 'Indonesia', 'ID'],
    ['united-kingdom', 'United Kingdom', 'GB'],
    ['germany', 'Germany', 'DE'],
    ['japan', 'Japan', 'JP'],
    ['brazil', 'Brazil', 'BR'],
  ] as const;
  for (const [slugName, label, code] of countrySeries) {
    const slug = `works?filter=from_publication_date:2000-01-01,to_publication_date:2024-12-31,authorships.institutions.country_code:${code}&group_by=publication_year`;
    const res = await groupBy(slug, 100);
    const counts = byYear(res.groups);
    seriesFromYearGroups({
      chartId: `openalex-country-${slugName}`,
      indicatorId: `science.openalex_country_${slugName.replace(/-/g, '_')}.world`,
      title: `${label} country-attributed works per year`,
      unit: 'works per year, million',
      groups: res.groups,
      slug,
      url: res.url,
      checksum: res.checksum,
      definition: `OpenAlex works per year with at least one authorship institution in ${label}.`,
      recipe: `filtered works to author-institution country ${label}, grouped by publication year, 2000-2024, shown in millions`,
      scale: 1_000_000,
      decimals: 2,
    });
    const base = counts.get(2000) ?? [...counts.values()][0];
    writePointSeries({
      chartId: `openalex-country-${slugName}-index`,
      indicatorId: `science.openalex_country_${slugName.replace(/-/g, '_')}_index.world`,
      unit: 'index, 2000 = 100',
      points: [...counts.entries()].map(([t, count]) => ({ t, value: +((count / base) * 100).toFixed(1) })),
      sourceIndicator: slug,
      url: res.url,
      checksum: sha256(res.body + String(base)),
      definition: `${label} country-attributed OpenAlex works, indexed to 2000 = 100.`,
      recipe: `divided ${label} yearly country-attributed work count by its 2000 value and multiplied by 100`,
    });
    writePointSeries({
      chartId: `openalex-country-${slugName}-multiple`,
      indicatorId: `science.openalex_country_${slugName.replace(/-/g, '_')}_multiple.world`,
      unit: 'multiple of 2000 output',
      points: [...counts.entries()].map(([t, count]) => ({ t, value: +(count / base).toFixed(2) })),
      sourceIndicator: slug,
      url: res.url,
      checksum: sha256(res.body + String(base) + 'multiple'),
      definition: `${label} country-attributed OpenAlex works as a multiple of its 2000 value.`,
      recipe: `divided ${label} yearly country-attributed work count by its 2000 value`,
    });
    writePointSeries({
      chartId: `openalex-country-${slugName}-share`,
      indicatorId: `science.openalex_country_${slugName.replace(/-/g, '_')}_share.world`,
      unit: '% of OpenAlex works',
      points: [...counts.entries()].map(([t, count]) => ({ t, value: +((count / (totalByYear.get(t) ?? count)) * 100).toFixed(2) })),
      sourceIndicator: `${slug} / all works`,
      url: res.url,
      checksum: sha256(res.body + totalYearAll.body),
      definition: `${label} country-attributed works as a share of all OpenAlex works in the same publication year.`,
      recipe: `divided ${label} yearly country-attributed work count by all OpenAlex works in the same year`,
    });
  }

  // 2. What fields dominate the visible literature.
  const fields2024 = await groupBy('works?filter=from_publication_date:2024-01-01,to_publication_date:2024-12-31&group_by=primary_topic.field.id');
  writeBars('openalex-fields-2024', barsArtifact({
    chartId: 'openalex-fields-2024',
    title: 'OpenAlex works by field, 2024',
    unit: 'works, million',
    yearSpan: '2024',
    bars: top(fields2024.groups, 12, 1_000_000, 2),
    xmax: 1.8,
    xTicks: [0, 0.45, 0.9, 1.35, 1.8],
    sourceIndicator: 'works group_by primary_topic.field.id',
    url: fields2024.url,
    checksum: fields2024.checksum,
    definition: 'Works published in 2024, grouped by OpenAlex primary topic field.',
    recipe: 'group 2024 works by primary topic field; show the top 12 in millions',
  }));

  // 2b. How the field mix changed: selected large fields over time.
  const fieldSeries = [
    ['medicine', 'Medicine', 'https://openalex.org/fields/27'],
    ['social-sciences', 'Social sciences', 'https://openalex.org/fields/33'],
    ['engineering', 'Engineering', 'https://openalex.org/fields/22'],
    ['computer-science', 'Computer science', 'https://openalex.org/fields/17'],
    ['environmental-science', 'Environmental science', 'https://openalex.org/fields/23'],
  ] as const;
  const fieldGrowthBars: Bar[] = [];
  for (const [slugName, label, fieldId] of fieldSeries) {
    const slug = `works?filter=from_publication_date:2000-01-01,to_publication_date:2024-12-31,primary_topic.field.id:${fieldId}&group_by=publication_year`;
    const res = await groupBy(slug, 100);
    seriesFromYearGroups({
      chartId: `openalex-field-${slugName}`,
      indicatorId: `science.openalex_field_${slugName.replace(/-/g, '_')}.world`,
      title: `${label} works per year`,
      unit: 'works per year, million',
      groups: res.groups,
      slug,
      url: res.url,
      checksum: res.checksum,
      definition: `OpenAlex works per year whose primary topic field is ${label}.`,
      recipe: `filtered works to primary topic field ${label}, grouped by publication year, 2000-2024, shown in millions`,
      scale: 1_000_000,
      decimals: 2,
    });
    const byFieldYear = byYear(res.groups);
    const base = byFieldYear.get(2000) ?? [...byFieldYear.values()][0];
    const latest = byFieldYear.get(2024) ?? [...byFieldYear.values()][byFieldYear.size - 1];
    const multiple = latest / base;
    fieldGrowthBars.push({
      label,
      value: +multiple.toFixed(1),
      color: multiple >= 4 ? 'hope' : multiple >= 2.5 ? 'ochre' : 'stone',
    });
    writePointSeries({
      chartId: `openalex-field-${slugName}-index`,
      indicatorId: `science.openalex_field_${slugName.replace(/-/g, '_')}_index.world`,
      unit: 'index, 2000 = 100',
      points: [...byFieldYear.entries()].map(([t, count]) => ({ t, value: +((count / base) * 100).toFixed(1) })),
      sourceIndicator: slug,
      url: res.url,
      checksum: sha256(res.body + String(base)),
      definition: `OpenAlex works in ${label}, indexed to 2000 = 100.`,
      recipe: `divided yearly ${label} work count by its 2000 value and multiplied by 100`,
    });
  }
  fieldGrowthBars.sort((a, b) => b.value - a.value);
  writeBars('openalex-field-growth-multiple-2000-2024', barsArtifact({
    chartId: 'openalex-field-growth-multiple-2000-2024',
    title: 'Field output growth, 2000-2024',
    unit: 'multiple of 2000 output',
    yearSpan: '2000-2024',
    bars: fieldGrowthBars,
    xmax: 6,
    xTicks: [0, 1, 2, 3, 4, 5, 6],
    sourceIndicator: 'selected field yearly counts / 2000 field counts',
    url: fields2024.url,
    checksum: sha256(fieldGrowthBars.map((b) => `${b.label}:${b.value}`).join('|')),
    definition: 'Selected OpenAlex fields, with 2024 output divided by 2000 output.',
    recipe: 'computed 2024/2000 output multiple for selected large fields',
  }));

  // 3. Which fields are open.
  const oaFields2024 = await groupBy('works?filter=from_publication_date:2024-01-01,to_publication_date:2024-12-31,is_oa:true&group_by=primary_topic.field.id');
  const totalByField = byName(fields2024.groups);
  const oaByField = byName(oaFields2024.groups);
  const oaBars = Object.entries(totalByField)
    .map(([label, total]) => ({ label, value: +(((oaByField[label] ?? 0) / total) * 100).toFixed(1), color: 'hope' }))
    .filter((b) => totalByField[b.label] >= 100_000)
    .sort((a, b) => b.value - a.value)
    .slice(0, 12)
    .map((b, i) => ({ ...b, color: b.value >= 70 ? 'hope' : b.value >= 55 ? 'ochre' : i > 8 ? 'despair' : 'stone' }));
  writeBars('openalex-open-access-by-field-2024', barsArtifact({
    chartId: 'openalex-open-access-by-field-2024',
    title: 'Open-access share by field, 2024',
    unit: 'open-access works, % of field output',
    yearSpan: '2024',
    bars: oaBars,
    xmax: 100,
    xTicks: [0, 25, 50, 75, 100],
    sourceIndicator: 'works is_oa:true / all works, group_by primary_topic.field.id',
    url: oaFields2024.url,
    checksum: sha256(fields2024.body + oaFields2024.body),
    definition: 'Open-access share of 2024 works by OpenAlex primary topic field. Only fields with at least 100,000 works are shown.',
    recipe: 'divide open-access 2024 field counts by total 2024 field counts; show fields with at least 100,000 works',
  }));

  // 4. Who gets the highly cited work? Use 2020 so papers have time to accumulate citations.
  const countries2020 = await groupBy('works?filter=from_publication_date:2020-01-01,to_publication_date:2020-12-31&group_by=authorships.institutions.country_code');
  const top10Countries2020 = await groupBy('works?filter=from_publication_date:2020-01-01,to_publication_date:2020-12-31,citation_normalized_percentile.is_in_top_10_percent:true&group_by=authorships.institutions.country_code');
  const totalCountry = byName(countries2020.groups);
  const topCountry = byName(top10Countries2020.groups);
  const influenceBars = Object.entries(totalCountry)
    .filter(([, total]) => total >= 75_000)
    .map(([label, total]) => ({ label, value: +(((topCountry[label] ?? 0) / total) * 100).toFixed(1), color: 'stone' }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 12)
    .map((b) => ({ ...b, color: b.value >= 18 ? 'hope' : b.value >= 12 ? 'ochre' : 'despair' }));
  writeBars('openalex-top10-share-by-country-2020', barsArtifact({
    chartId: 'openalex-top10-share-by-country-2020',
    title: 'Top-cited-paper share by country, 2020',
    unit: 'works in global top 10% by citation percentile, %',
    yearSpan: '2020',
    bars: influenceBars,
    xmax: 30,
    xTicks: [0, 5, 10, 15, 20, 25, 30],
    sourceIndicator: 'citation_normalized_percentile.is_in_top_10_percent:true by country / all works by country',
    url: top10Countries2020.url,
    checksum: sha256(countries2020.body + top10Countries2020.body),
    definition: 'Share of a country-attributed 2020 works that OpenAlex marks as being in the top 10 percent of citation-normalized percentile. Countries shown have at least 75,000 2020 works.',
    recipe: 'divide top-10-percent cited 2020 works by all 2020 works for each author-institution country',
  }));

  // 5. The institutional shape of science.
  const inst2024 = await groupBy('works?filter=from_publication_date:2024-01-01,to_publication_date:2024-12-31&group_by=authorships.institutions.type');
  writeBars('openalex-institution-types-2024', barsArtifact({
    chartId: 'openalex-institution-types-2024',
    title: 'Works by institution type, 2024',
    unit: 'works, million',
    yearSpan: '2024',
    bars: titleBars(top(inst2024.groups, 9, 1_000_000, 2)),
    xmax: 6,
    xTicks: [0, 1.5, 3, 4.5, 6],
    sourceIndicator: 'works group_by authorships.institutions.type',
    url: inst2024.url,
    checksum: inst2024.checksum,
    definition: 'Works published in 2024, grouped by type of authorship institutions attached in OpenAlex.',
    recipe: 'group 2024 works by authorship institution type; show counts in millions',
  }));

  // 6. Source type: where the visible record appears.
  const sourceTypes2024 = await groupBy('works?filter=from_publication_date:2024-01-01,to_publication_date:2024-12-31&group_by=primary_location.source.type');
  writeBars('openalex-source-types-2024', barsArtifact({
    chartId: 'openalex-source-types-2024',
    title: 'Works by source type, 2024',
    unit: 'works, million',
    yearSpan: '2024',
    bars: titleBars(top(sourceTypes2024.groups, 8, 1_000_000, 2)),
    xmax: 8,
    xTicks: [0, 2, 4, 6, 8],
    sourceIndicator: 'works group_by primary_location.source.type',
    url: sourceTypes2024.url,
    checksum: sourceTypes2024.checksum,
    definition: 'Works published in 2024, grouped by the source type of their primary location in OpenAlex.',
    recipe: 'group 2024 works by primary location source type; show counts in millions',
  }));

  // 7. International collaboration as a line: works with author institutions in more than one country.
  const intlYear = await groupBy('works?filter=from_publication_date:2000-01-01,to_publication_date:2024-12-31,countries_distinct_count:>1&group_by=publication_year', 100);
  const intlByYear = new Map(intlYear.groups.map((g) => [+g.key, g.count]));
  const intlPoints = [...totalByYear.entries()]
    .filter(([y]) => y >= 2000 && y <= 2024)
    .sort((a, b) => a[0] - b[0])
    .map(([y, total]) => ({ t: y, value: +(((intlByYear.get(y) ?? 0) / total) * 100).toFixed(2) }));
  const intlSeries: CanonicalSeries = {
    indicatorId: 'science.openalex_international_collaboration_share.world',
    entity: 'World',
    entityName: 'World',
    unit: '% of works',
    points: intlPoints,
    provenance: {
      source: 'openalex',
      sourceIndicator: 'countries_distinct_count:>1 / all works, group_by publication_year',
      url: intlYear.url,
      license: 'CC0 1.0',
      vintage: VINTAGE,
      checksum: sha256(totalYearAll.body + intlYear.body),
      definition: 'Share of OpenAlex works with authorship institutions in more than one country.',
      attribution: 'OpenAlex',
      primarySource: 'OpenAlex',
    },
    recipe: [{ op: 'ratio', detail: 'divided yearly works with countries_distinct_count > 1 by all yearly works, 2000-2024' }],
  };
  writeSeries('openalex-international-collaboration-share', intlSeries, rawFor('international collaboration share', intlYear.url, sha256(totalYearAll.body + intlYear.body)));

  // 8. Global South participation as a line.
  const southYear = await groupBy('works?filter=from_publication_date:2000-01-01,to_publication_date:2024-12-31,authorships.institutions.is_global_south:true&group_by=publication_year', 100);
  const southByYear = new Map(southYear.groups.map((g) => [+g.key, g.count]));
  const southPoints = [...totalByYear.entries()]
    .filter(([y]) => y >= 2000 && y <= 2024)
    .sort((a, b) => a[0] - b[0])
    .map(([y, total]) => ({ t: y, value: +(((southByYear.get(y) ?? 0) / total) * 100).toFixed(2) }));
  const southSeries: CanonicalSeries = {
    indicatorId: 'science.openalex_global_south_participation_share.world',
    entity: 'World',
    entityName: 'World',
    unit: '% of works',
    points: southPoints,
    provenance: {
      source: 'openalex',
      sourceIndicator: 'authorships.institutions.is_global_south:true / all works, group_by publication_year',
      url: southYear.url,
      license: 'CC0 1.0',
      vintage: VINTAGE,
      checksum: sha256(totalYearAll.body + southYear.body),
      definition: 'Share of OpenAlex works with at least one authorship institution marked Global South.',
      attribution: 'OpenAlex',
      primarySource: 'OpenAlex',
    },
    recipe: [{ op: 'ratio', detail: 'divided yearly works with a Global South authorship institution by all yearly works, 2000-2024' }],
  };
  writeSeries('openalex-global-south-share', southSeries, rawFor('global south share', southYear.url, sha256(totalYearAll.body + southYear.body)));

  console.log('✓ OpenAlex story artifacts written');
}

await main();
