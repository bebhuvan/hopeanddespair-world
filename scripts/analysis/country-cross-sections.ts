import { createHash } from 'node:crypto';
import { writeFileSync, readFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/* Generalized country cross-section bars for the keystone country lens (the third magnification:
   world → region → country). Each dimension curates a recognizable ~12-country spread at the latest
   available year, rendered as a ranked bar (CHARTS.md, the bar job — a snapshot across categories, not
   a trend). Reads already-snapshotted sources where present (DATA.md snapshot-everything; license
   cleared at ingest); for a source not yet snapshotted it fetches once and snapshots it (OWID = CC BY).
   Real numbers only — the curated SET (ISO3 + display name) is authored here; every value is pulled
   from data, never typed. Add a dimension by appending to CONFIG.
   Run: npx tsx scripts/analysis/country-cross-sections.ts */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
// Drop any country whose newest datapoint predates this — a stale value (US literacy last surveyed
// 1950, Nigeria's trade share 1960) must never be shown as "latest". All legitimate series are ≥2017.
const MIN_YEAR = 2010;

/** Newest snapshot dir for a source family (dates sort lexicographically). */
function latestDir(base: string, leaf: string): string {
  const root = join(ROOT, base);
  const vintages = readdirSync(root).filter((d) => existsSync(join(root, d, leaf))).sort();
  if (!vintages.length) return '';
  return join(root, vintages[vintages.length - 1], leaf);
}

/** OWID grapher CSV text, fetched + snapshotted if not already on disk (snapshot-everything). */
async function owidCsv(slug: string): Promise<string> {
  const existing = latestDir('data/sources/owid', join(slug, 'raw.csv'));
  if (existing) return readFileSync(existing, 'utf8');
  const url = `https://ourworldindata.org/grapher/${slug}.csv`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OWID ${slug}: HTTP ${res.status}`);
  const text = await res.text();
  const dir = join(ROOT, 'data/sources/owid', VINTAGE, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'raw.csv'), text);
  writeFileSync(join(dir, 'snapshot.json'), JSON.stringify({ source: 'owid', slug, vintage: VINTAGE, url, checksum: sha256(text), license: 'CC BY 4.0', fetchedAt: new Date().toISOString() }, null, 2));
  console.log(`  ↓ fetched + snapshotted OWID ${slug}`);
  return text;
}

/** Parse latest value per ISO3 from an OWID grapher CSV. `col` is the value column (default 3 — the
    first; set it for multi-column graphers, the silent-last-column gotcha). `sumCols` sums an inclusive
    column range instead (e.g. species columns → total animals), anchored to the latest year with data. */
function parseOwid(csv: string, col = 3, sumCols?: [number, number]): Record<string, { year: number; value: number }> {
  const lines = csv.trim().split('\n');
  const out: Record<string, { year: number; value: number }> = {};
  for (let i = 1; i < lines.length; i++) {
    const f = lines[i].split(',');
    const code = f[1], year = +f[2];
    if (!code || code.length !== 3 || !isFinite(year)) continue;
    let value: number;
    if (sumCols) {
      let sum = 0, any = false;
      for (let c = sumCols[0]; c <= sumCols[1]; c++) if (f[c] !== '' && isFinite(+f[c])) { sum += +f[c]; any = true; }
      if (!any) continue;
      value = sum;
    } else {
      if (f[col] === '' || !isFinite(+f[col])) continue;
      value = +f[col];
    }
    if (!out[code] || year > out[code].year) out[code] = { year, value };
  }
  return out;
}

/** World Bank API JSON ([meta,[rows]]) → latest value per ISO3. Reads the snapshot if present;
    otherwise fetches all countries once and snapshots it (snapshot-everything, like owidCsv). */
async function wbLatest(indicator: string): Promise<Record<string, { year: number; value: number }>> {
  let text: string;
  const path = latestDir('data/sources/worldbank', join(indicator, 'raw.json'));
  if (path) text = readFileSync(path, 'utf8');
  else {
    const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&per_page=25000&date=2000:2024`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`WB ${indicator}: HTTP ${res.status}`);
    text = await res.text();
    const dir = join(ROOT, 'data/sources/worldbank', VINTAGE, indicator);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'raw.json'), text);
    writeFileSync(join(dir, 'snapshot.json'), JSON.stringify({ source: 'worldbank', slug: indicator, vintage: VINTAGE, url: `https://data.worldbank.org/indicator/${indicator}`, checksum: sha256(text), license: 'CC BY 4.0', fetchedAt: new Date().toISOString() }, null, 2));
  }
  const rows = (JSON.parse(text)[1] ?? []) as any[];
  const out: Record<string, { year: number; value: number }> = {};
  for (const r of rows) {
    const code = r.countryiso3code, year = +r.date, value = r.value;
    if (!code || value == null || !isFinite(year)) continue;
    if (!out[code] || year > out[code].year) out[code] = { year, value };
  }
  return out;
}

/** Latest value per ISO3 country from an ILOSTAT SDMX dataflow. Fetches the full all-areas CSV
    once and snapshots it under its OWN source family (`ilostat-countries`) so it never clobbers the
    aggregates-only snapshot the pipeline adapter writes under `ilostat`. Skips the X-prefixed
    aggregate areas; `dims` selects the SDMX dimensions (e.g. SEX=SEX_T, AGE=AGE_YTHADULT_YGE15). */
async function ilostatLatest(dataflow: string, dims: Record<string, string>): Promise<Record<string, { year: number; value: number }>> {
  let text: string;
  const base = 'data/sources/ilostat-countries';
  const path = existsSync(join(ROOT, base)) ? latestDir(base, join(dataflow, 'raw.csv')) : '';
  if (path) text = readFileSync(path, 'utf8');
  else {
    const url = `https://sdmx.ilo.org/rest/data/${dataflow}/all?startPeriod=1990`;
    const res = await fetch(url, { headers: { Accept: 'application/vnd.sdmx.data+csv', 'Accept-Language': 'en' } });
    if (!res.ok) throw new Error(`ILOSTAT ${dataflow}: HTTP ${res.status}`);
    text = await res.text();
    const dir = join(ROOT, 'data/sources/ilostat-countries', VINTAGE, dataflow);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'raw.csv'), text);
    writeFileSync(join(dir, 'snapshot.json'), JSON.stringify({ source: 'ilostat', slug: dataflow, vintage: VINTAGE, url, checksum: sha256(text), license: 'CC BY 4.0', fetchedAt: new Date().toISOString() }, null, 2));
    console.log(`  ↓ fetched + snapshotted ILOSTAT ${dataflow}`);
  }
  const lines = text.trim().split('\n');
  const head = lines[0].split(',');
  const ix = (n: string) => head.indexOf(n);
  const iRA = ix('REF_AREA'), iT = ix('TIME_PERIOD'), iV = ix('OBS_VALUE'), iM = ix('UNIT_MULT');
  const dimIx = Object.keys(dims).map((k) => [ix(k), dims[k]] as const);
  const out: Record<string, { year: number; value: number }> = {};
  for (let i = 1; i < lines.length; i++) {
    const f = lines[i].split(',');           // note columns trail OBS_VALUE; leading cols are comma-free
    const code = f[iRA];
    if (!code || code.length !== 3 || /^X/.test(code)) continue;   // ISO3 countries only, skip aggregates
    if (!dimIx.every(([j, v]) => f[j] === v)) continue;
    const year = +f[iT], mult = iM >= 0 ? parseInt(f[iM], 10) || 0 : 0, value = +f[iV] * 10 ** mult;
    if (!isFinite(year) || !isFinite(value)) continue;
    if (!out[code] || year > out[code].year) out[code] = { year, value };
  }
  return out;
}

/** Per-country ratio of two indicators (e.g. under-5 mortality, poorest fifth ÷ richest fifth) —
    the within-country lens: one number that says how much deadlier it is to be born poor. */
function ratioLatest(num: Record<string, { year: number; value: number }>, den: Record<string, { year: number; value: number }>): Record<string, { year: number; value: number }> {
  const out: Record<string, { year: number; value: number }> = {};
  for (const code in num) {
    if (den[code]?.value) out[code] = { year: Math.min(num[code].year, den[code].year), value: num[code].value / den[code].value };
  }
  return out;
}

type Src = { kind: 'owid'; slug: string; col?: number; sumCols?: [number, number] } | { kind: 'wb'; indicator: string } | { kind: 'wb-ratio'; num: string; den: string } | { kind: 'ilostat'; dataflow: string; dims: Record<string, string> };
interface Dim {
  chartId: string; title: string; unit: string; src: Src;
  set: [string, string][];
  dir: 'higher-good' | 'higher-bad' | 'neutral' | 'pivot';
  pivot?: number;          // for dir:'pivot' — the balanced value (e.g. replacement fertility 2.1)
  xmax: number; xTicks: number[];
  scale?: number; decimals?: number; logColor?: boolean;
  attribution: string; primarySource: string; license: string;
  sourceUrl: string; sourceIndicator: string; definition: string;
}

// colour by where a value sits in the displayed range, by direction. Range-based (not rank) so a
// bimodal spread doesn't split near-equal neighbours. 'neutral' measures (fertility, trade openness)
// carry no good/bad verdict → one calm tone.
function colorize(v: number, min: number, max: number, dir: Dim['dir'], log = false, pivot?: number): string {
  if (dir === 'neutral') return 'stone';
  // Diverging around a pivot (replacement fertility): near the pivot = balanced (hope), far BELOW =
  // despair (the lowest-low), far ABOVE = ochre (the still-high). Each side scaled to its own range
  // so the asymmetric spread (Niger ≈ 6 vs Korea ≈ 0.7) doesn't wash one tail out.
  if (dir === 'pivot' && pivot != null) {
    if (v < pivot) return (pivot - v) / Math.max(pivot - min, 1e-9) >= 0.4 ? 'despair' : 'hope';
    return (v - pivot) / Math.max(max - pivot, 1e-9) >= 0.4 ? 'ochre' : 'hope';
  }
  const t = log ? (x: number) => Math.log(Math.max(x, 1e-9)) : (x: number) => x;
  const frac = max === min ? 0.5 : (t(v) - t(min)) / (t(max) - t(min));
  const good = dir === 'higher-good' ? frac : 1 - frac;
  return good >= 0.66 ? 'hope' : good >= 0.33 ? 'ochre' : 'despair';
}

const CONFIG: Dim[] = [
  // ───────────────────────────── batch 1 ─────────────────────────────
  { chartId: 'child-mortality-by-country', title: 'Child mortality by country', unit: 'Deaths before age 5, per 1,000 live births',
    src: { kind: 'wb', indicator: 'SH.DYN.MORT' }, dir: 'higher-bad', xmax: 120, xTicks: [0, 30, 60, 90, 120],
    set: [['NGA', 'Nigeria'], ['SOM', 'Somalia'], ['TCD', 'Chad'], ['COD', 'DR Congo'], ['ETH', 'Ethiopia'], ['IND', 'India'], ['BGD', 'Bangladesh'], ['BRA', 'Brazil'], ['CHN', 'China'], ['USA', 'United States'], ['JPN', 'Japan'], ['FIN', 'Finland']],
    attribution: 'UN IGME, via World Bank', primarySource: 'UN Inter-agency Group for Child Mortality Estimation', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SH.DYN.MORT', sourceIndicator: 'SH.DYN.MORT', definition: 'Under-five mortality rate: deaths before age five per 1,000 live births, latest year per country.' },
  { chartId: 'gdp-per-capita-by-country', title: 'GDP per capita by country', unit: 'GDP per capita, $ thousand (constant 2015)', scale: 1000, logColor: true,
    src: { kind: 'wb', indicator: 'NY.GDP.PCAP.KD' }, dir: 'higher-good', xmax: 100, xTicks: [0, 25, 50, 75, 100],
    set: [['CHE', 'Switzerland'], ['USA', 'United States'], ['DEU', 'Germany'], ['JPN', 'Japan'], ['CHN', 'China'], ['BRA', 'Brazil'], ['IND', 'India'], ['BGD', 'Bangladesh'], ['NGA', 'Nigeria'], ['ETH', 'Ethiopia'], ['COD', 'DR Congo'], ['BDI', 'Burundi']],
    attribution: 'World Bank national accounts', primarySource: 'World Bank — World Development Indicators', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.KD', sourceIndicator: 'NY.GDP.PCAP.KD', definition: 'GDP per capita in constant 2015 US$, latest year per country, shown in $ thousand.' },
  { chartId: 'democracy-by-country', title: 'Democracy by country', unit: 'Liberal democracy index (0 = autocracy · 1 = full liberal democracy)', decimals: 2,
    src: { kind: 'owid', slug: 'liberal-democracy-index' }, dir: 'higher-good', xmax: 1, xTicks: [0, 0.25, 0.5, 0.75, 1],
    set: [['DNK', 'Denmark'], ['SWE', 'Sweden'], ['DEU', 'Germany'], ['USA', 'United States'], ['BRA', 'Brazil'], ['IND', 'India'], ['NGA', 'Nigeria'], ['TUR', 'Turkey'], ['RUS', 'Russia'], ['SAU', 'Saudi Arabia'], ['CHN', 'China']],
    attribution: 'V-Dem, via Our World in Data', primarySource: 'V-Dem (Varieties of Democracy) project', license: 'CC BY 4.0', sourceUrl: 'https://ourworldindata.org/grapher/liberal-democracy-index', sourceIndicator: 'liberal-democracy-index', definition: 'V-Dem liberal democracy index (0–1), latest year per country.' },
  { chartId: 'happiness-by-country', title: 'Life satisfaction by country', unit: 'Self-reported life satisfaction (0 = worst · 10 = best possible life)',
    src: { kind: 'owid', slug: 'happiness-cantril-ladder' }, dir: 'higher-good', xmax: 8, xTicks: [0, 2, 4, 6, 8],
    set: [['FIN', 'Finland'], ['DNK', 'Denmark'], ['USA', 'United States'], ['BRA', 'Brazil'], ['CHN', 'China'], ['IND', 'India'], ['NGA', 'Nigeria'], ['ETH', 'Ethiopia'], ['EGY', 'Egypt'], ['ZWE', 'Zimbabwe'], ['AFG', 'Afghanistan']],
    attribution: 'World Happiness Report, via Our World in Data', primarySource: 'World Happiness Report (Gallup World Poll)', license: 'CC BY 4.0', sourceUrl: 'https://ourworldindata.org/grapher/happiness-cantril-ladder', sourceIndicator: 'happiness-cantril-ladder', definition: 'Self-reported life satisfaction on a 0–10 Cantril ladder, latest survey per country.' },
  { chartId: 'homicide-by-country', title: 'Homicide by country', unit: 'Homicides per 100,000 people',
    src: { kind: 'wb', indicator: 'VC.IHR.PSRC.P5' }, dir: 'higher-bad', xmax: 50, xTicks: [0, 10, 20, 30, 40, 50],
    set: [['JAM', 'Jamaica'], ['ZAF', 'South Africa'], ['MEX', 'Mexico'], ['BRA', 'Brazil'], ['COL', 'Colombia'], ['USA', 'United States'], ['RUS', 'Russia'], ['IND', 'India'], ['FRA', 'France'], ['CHN', 'China'], ['JPN', 'Japan'], ['SGP', 'Singapore']],
    attribution: 'UNODC, via World Bank', primarySource: 'UN Office on Drugs and Crime (UNODC)', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/VC.IHR.PSRC.P5', sourceIndicator: 'VC.IHR.PSRC.P5', definition: 'Intentional homicides per 100,000 people, latest year per country.' },

  // ───────────────────────────── batch 2 ─────────────────────────────
  { chartId: 'safe-water-by-country', title: 'Safe drinking water by country', unit: 'Using safely managed drinking water, %',
    src: { kind: 'wb', indicator: 'SH.H2O.SMDW.ZS' }, dir: 'higher-good', xmax: 100, xTicks: [0, 25, 50, 75, 100],
    set: [['CHE', 'Switzerland'], ['DEU', 'Germany'], ['JPN', 'Japan'], ['USA', 'United States'], ['CHN', 'China'], ['BRA', 'Brazil'], ['IND', 'India'], ['BGD', 'Bangladesh'], ['NGA', 'Nigeria'], ['ETH', 'Ethiopia'], ['COD', 'DR Congo'], ['TCD', 'Chad']],
    attribution: 'WHO/UNICEF JMP, via World Bank', primarySource: 'WHO/UNICEF Joint Monitoring Programme', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SH.H2O.SMDW.ZS', sourceIndicator: 'SH.H2O.SMDW.ZS', definition: 'Share of population using safely managed drinking water, latest year per country.' },
  { chartId: 'literacy-by-country', title: 'Adult literacy by country', unit: 'Adults able to read and write, %',
    src: { kind: 'owid', slug: 'cross-country-literacy-rates' }, dir: 'higher-good', xmax: 100, xTicks: [0, 25, 50, 75, 100],
    set: [['NER', 'Niger'], ['TCD', 'Chad'], ['MLI', 'Mali'], ['NGA', 'Nigeria'], ['IND', 'India'], ['BGD', 'Bangladesh'], ['EGY', 'Egypt'], ['BRA', 'Brazil'], ['CHN', 'China'], ['ZAF', 'South Africa'], ['USA', 'United States']],
    attribution: 'UNESCO, via Our World in Data', primarySource: 'UNESCO Institute for Statistics', license: 'CC BY 4.0', sourceUrl: 'https://ourworldindata.org/grapher/cross-country-literacy-rates', sourceIndicator: 'cross-country-literacy-rates', definition: 'Adult literacy rate (share of people 15+ who can read and write), latest year per country.' },
  { chartId: 'hunger-by-country', title: 'Undernourishment by country', unit: 'Population that is undernourished, %',
    src: { kind: 'wb', indicator: 'SN.ITK.DEFC.ZS' }, dir: 'higher-bad', xmax: 60, xTicks: [0, 20, 40, 60],
    set: [['MDG', 'Madagascar'], ['COD', 'DR Congo'], ['CAF', 'Central African Rep.'], ['ETH', 'Ethiopia'], ['NGA', 'Nigeria'], ['IND', 'India'], ['BGD', 'Bangladesh'], ['CHN', 'China'], ['BRA', 'Brazil'], ['USA', 'United States']],
    attribution: 'FAO, via World Bank', primarySource: 'UN Food and Agriculture Organization (FAO)', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SN.ITK.DEFC.ZS', sourceIndicator: 'SN.ITK.DEFC.ZS', definition: 'Prevalence of undernourishment (share below minimum dietary energy), latest year per country; values below 2.5% are reported at that floor.' },
  { chartId: 'gender-gap-by-country', title: 'Gender inequality by country', unit: 'Gender Inequality Index (0 = equal · 1 = most unequal)', decimals: 2,
    src: { kind: 'owid', slug: 'gender-inequality-index-from-the-human-development-report' }, dir: 'higher-bad', xmax: 0.9, xTicks: [0, 0.2, 0.4, 0.6, 0.8],
    set: [['YEM', 'Yemen'], ['NGA', 'Nigeria'], ['COD', 'DR Congo'], ['AFG', 'Afghanistan'], ['IND', 'India'], ['EGY', 'Egypt'], ['BRA', 'Brazil'], ['USA', 'United States'], ['CHN', 'China'], ['DEU', 'Germany'], ['NOR', 'Norway'], ['DNK', 'Denmark']],
    attribution: 'UNDP HDR, via Our World in Data', primarySource: 'UN Development Programme — Human Development Report', license: 'CC BY 4.0', sourceUrl: 'https://ourworldindata.org/grapher/gender-inequality-index-from-the-human-development-report', sourceIndicator: 'gender-inequality-index-from-the-human-development-report', definition: 'Gender Inequality Index (reproductive health, empowerment, labour-market participation), latest year per country.' },
  { chartId: 'internet-by-country', title: 'Internet use by country', unit: 'People using the internet, %',
    src: { kind: 'owid', slug: 'share-of-individuals-using-the-internet' }, dir: 'higher-good', xmax: 100, xTicks: [0, 25, 50, 75, 100],
    set: [['ARE', 'UAE'], ['KOR', 'South Korea'], ['USA', 'United States'], ['CHN', 'China'], ['BRA', 'Brazil'], ['IND', 'India'], ['NGA', 'Nigeria'], ['BGD', 'Bangladesh'], ['ETH', 'Ethiopia'], ['COD', 'DR Congo'], ['TCD', 'Chad']],
    attribution: 'ITU, via Our World in Data', primarySource: 'International Telecommunication Union (ITU)', license: 'CC BY 4.0', sourceUrl: 'https://ourworldindata.org/grapher/share-of-individuals-using-the-internet', sourceIndicator: 'share-of-individuals-using-the-internet', definition: 'Share of the population using the internet, latest year per country.' },
  { chartId: 'road-deaths-by-country', title: 'Road deaths by country', unit: 'Road traffic deaths per 100,000 people',
    src: { kind: 'wb', indicator: 'SH.STA.TRAF.P5' }, dir: 'higher-bad', xmax: 40, xTicks: [0, 10, 20, 30, 40],
    set: [['ZAF', 'South Africa'], ['NGA', 'Nigeria'], ['COD', 'DR Congo'], ['THA', 'Thailand'], ['SAU', 'Saudi Arabia'], ['IND', 'India'], ['BRA', 'Brazil'], ['USA', 'United States'], ['CHN', 'China'], ['JPN', 'Japan'], ['GBR', 'United Kingdom'], ['SWE', 'Sweden']],
    attribution: 'WHO, via World Bank', primarySource: 'World Health Organization — Global Status Report on Road Safety', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SH.STA.TRAF.P5', sourceIndicator: 'SH.STA.TRAF.P5', definition: 'Estimated road traffic deaths per 100,000 people, latest year per country.' },
  { chartId: 'co2-per-capita-by-country', title: 'CO₂ per person by country', unit: 'CO₂ emissions per person, tonnes per year', logColor: true,
    src: { kind: 'owid', slug: 'co2-emissions-per-capita' }, dir: 'higher-bad', xmax: 45, xTicks: [0, 10, 20, 30, 40],
    set: [['QAT', 'Qatar'], ['USA', 'United States'], ['RUS', 'Russia'], ['DEU', 'Germany'], ['CHN', 'China'], ['BRA', 'Brazil'], ['IND', 'India'], ['IDN', 'Indonesia'], ['NGA', 'Nigeria'], ['ETH', 'Ethiopia'], ['COD', 'DR Congo']],
    attribution: 'Global Carbon Project, via Our World in Data', primarySource: 'Global Carbon Project', license: 'CC BY 4.0', sourceUrl: 'https://ourworldindata.org/grapher/co2-emissions-per-capita', sourceIndicator: 'co2-emissions-per-capita', definition: 'Production-based CO₂ emissions per person (tonnes/year), latest year per country.' },
  { chartId: 'science-output-by-country', title: 'Scientific output by country', unit: 'Scientific & technical articles per year, thousand', scale: 1000, logColor: true,
    src: { kind: 'owid', slug: 'scientific-and-technical-journal-articles' }, dir: 'higher-good', xmax: 900, xTicks: [0, 300, 600, 900],
    set: [['CHN', 'China'], ['USA', 'United States'], ['IND', 'India'], ['DEU', 'Germany'], ['GBR', 'United Kingdom'], ['JPN', 'Japan'], ['RUS', 'Russia'], ['BRA', 'Brazil'], ['IRN', 'Iran'], ['ZAF', 'South Africa'], ['NGA', 'Nigeria']],
    attribution: 'NSF, via Our World in Data', primarySource: 'US National Science Foundation — Science & Engineering Indicators', license: 'CC BY 4.0', sourceUrl: 'https://ourworldindata.org/grapher/scientific-and-technical-journal-articles', sourceIndicator: 'scientific-and-technical-journal-articles', definition: 'Scientific and technical journal articles published per year, latest year per country, shown in thousands.' },
  { chartId: 'trade-by-country', title: 'Trade openness by country', unit: 'Trade as a share of GDP, %',
    src: { kind: 'wb', indicator: 'NE.TRD.GNFS.ZS' }, dir: 'neutral', xmax: 350, xTicks: [0, 100, 200, 300],
    set: [['SGP', 'Singapore'], ['VNM', 'Vietnam'], ['DEU', 'Germany'], ['MEX', 'Mexico'], ['KOR', 'South Korea'], ['CHN', 'China'], ['IND', 'India'], ['JPN', 'Japan'], ['USA', 'United States'], ['BRA', 'Brazil'], ['NGA', 'Nigeria']],
    attribution: 'World Bank national accounts', primarySource: 'World Bank — World Development Indicators', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/NE.TRD.GNFS.ZS', sourceIndicator: 'NE.TRD.GNFS.ZS', definition: 'Trade (exports plus imports) as a share of GDP, latest year per country. A measure of openness and economic structure, not of welfare.' },
  { chartId: 'fertility-by-country', title: 'Fertility by country', unit: 'Births per woman', decimals: 2,
    src: { kind: 'wb', indicator: 'SP.DYN.TFRT.IN' }, dir: 'pivot', pivot: 2.1, xmax: 7, xTicks: [0, 2, 4, 6],
    set: [['NER', 'Niger'], ['COD', 'DR Congo'], ['NGA', 'Nigeria'], ['ETH', 'Ethiopia'], ['PAK', 'Pakistan'], ['EGY', 'Egypt'], ['IND', 'India'], ['IDN', 'Indonesia'], ['FRA', 'France'], ['BRA', 'Brazil'], ['USA', 'United States'], ['IRN', 'Iran'], ['CHN', 'China'], ['JPN', 'Japan'], ['ITA', 'Italy'], ['ESP', 'Spain'], ['KOR', 'South Korea']],
    attribution: 'UN Population Division, via World Bank', primarySource: 'UN Population Division — World Population Prospects', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SP.DYN.TFRT.IN', sourceIndicator: 'SP.DYN.TFRT.IN', definition: 'Total fertility rate (births per woman), latest year per country. Replacement level is about 2.1.' },
  { chartId: 'pop-65plus-by-country', title: 'Share over 65 by country', unit: 'Population aged 65 and over, %',
    src: { kind: 'wb', indicator: 'SP.POP.65UP.TO.ZS' }, dir: 'higher-bad', xmax: 30, xTicks: [0, 10, 20, 30],
    set: [['JPN', 'Japan'], ['ITA', 'Italy'], ['DEU', 'Germany'], ['KOR', 'South Korea'], ['CHN', 'China'], ['USA', 'United States'], ['BRA', 'Brazil'], ['IND', 'India'], ['EGY', 'Egypt'], ['NGA', 'Nigeria'], ['NER', 'Niger']],
    attribution: 'UN Population Division, via World Bank', primarySource: 'UN Population Division — World Population Prospects', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SP.POP.65UP.TO.ZS', sourceIndicator: 'SP.POP.65UP.TO.ZS', definition: 'Share of the population aged 65 and over, latest year per country.' },
  { chartId: 'tobacco-use-by-country', title: 'Tobacco use by country', unit: 'Adults who use tobacco, %',
    src: { kind: 'wb', indicator: 'SH.PRV.SMOK' }, dir: 'higher-bad', xmax: 45, xTicks: [0, 15, 30, 45],
    set: [['IDN', 'Indonesia'], ['RUS', 'Russia'], ['CHN', 'China'], ['GRC', 'Greece'], ['DEU', 'Germany'], ['GBR', 'United Kingdom'], ['USA', 'United States'], ['BRA', 'Brazil'], ['IND', 'India'], ['NGA', 'Nigeria'], ['ETH', 'Ethiopia']],
    attribution: 'WHO, via World Bank', primarySource: 'World Health Organization', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SH.PRV.SMOK', sourceIndicator: 'SH.PRV.SMOK', definition: 'Prevalence of current tobacco use (any product, including smokeless) among adults, latest year per country.' },
  { chartId: 'unemployment-by-country', title: 'Unemployment by country', unit: 'Unemployment, % of the labour force',
    src: { kind: 'wb', indicator: 'SL.UEM.TOTL.ZS' }, dir: 'neutral', xmax: 35, xTicks: [0, 10, 20, 30],
    set: [['ZAF', 'South Africa'], ['ESP', 'Spain'], ['BRA', 'Brazil'], ['EGY', 'Egypt'], ['IND', 'India'], ['USA', 'United States'], ['MEX', 'Mexico'], ['CHN', 'China'], ['DEU', 'Germany'], ['JPN', 'Japan'], ['VNM', 'Vietnam'], ['THA', 'Thailand']],
    attribution: 'ILO, via World Bank', primarySource: 'International Labour Organization (ILO modelled estimate)', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS', sourceIndicator: 'SL.UEM.TOTL.ZS', definition: 'Unemployment as a share of the labour force (ILO modelled estimate), latest year per country. In low-income economies a low rate reflects informal survival work, not security.' },
  { chartId: 'working-poverty-by-country', title: 'Working poverty by country', unit: 'Employed people living on under $2.15 a day, %',
    src: { kind: 'ilostat', dataflow: 'DF_SDG_0111_SEX_AGE_RT', dims: { SEX: 'SEX_T', AGE: 'AGE_YTHADULT_YGE15' } }, dir: 'higher-bad', xmax: 90, xTicks: [0, 30, 60, 90],
    set: [['MDG', 'Madagascar'], ['COD', 'DR Congo'], ['MOZ', 'Mozambique'], ['MWI', 'Malawi'], ['ETH', 'Ethiopia'], ['NGA', 'Nigeria'], ['KEN', 'Kenya'], ['BGD', 'Bangladesh'], ['IND', 'India'], ['IDN', 'Indonesia'], ['VNM', 'Vietnam'], ['BRA', 'Brazil'], ['CHN', 'China'], ['USA', 'United States']],
    attribution: 'ILOSTAT — International Labour Organization', primarySource: 'ILOSTAT — ILO (SDG 1.1.1)', license: 'CC BY 4.0', sourceUrl: 'https://ilostat.ilo.org', sourceIndicator: 'DF_SDG_0111_SEX_AGE_RT [SEX_T, AGE_YTHADULT_YGE15]', definition: 'Share of employed people aged 15+ living in extreme poverty — a household income below $2.15 a day (2017 PPP) — latest year per country. Work that does not lift a family out of poverty.' },
  { chartId: 'social-protection-by-country', title: 'Social protection by country', unit: 'People covered by at least one cash benefit, %',
    src: { kind: 'ilostat', dataflow: 'DF_SDG_0131_SEX_SOC_RT', dims: { SEX: 'SEX_T', SOC: 'SOC_CONTIG_TOTAL' } }, dir: 'higher-good', xmax: 100, xTicks: [0, 25, 50, 75, 100],
    set: [['DNK', 'Denmark'], ['FRA', 'France'], ['JPN', 'Japan'], ['USA', 'United States'], ['BRA', 'Brazil'], ['CHN', 'China'], ['ZAF', 'South Africa'], ['IND', 'India'], ['IDN', 'Indonesia'], ['BGD', 'Bangladesh'], ['NGA', 'Nigeria'], ['ETH', 'Ethiopia'], ['COD', 'DR Congo']],
    attribution: 'ILOSTAT — International Labour Organization', primarySource: 'ILOSTAT — ILO (SDG 1.3.1)', license: 'CC BY 4.0', sourceUrl: 'https://ilostat.ilo.org', sourceIndicator: 'DF_SDG_0131_SEX_SOC_RT [SEX_T, SOC_CONTIG_TOTAL]', definition: 'Share of the population receiving at least one social-protection cash benefit (SDG 1.3.1), latest year per country. The safety net behind a job, where it exists.' },
  { chartId: 'vulnerable-employment-by-country', title: 'Vulnerable employment by country', unit: 'Own-account & unpaid family workers, % of employment',
    src: { kind: 'wb', indicator: 'SL.EMP.VULN.ZS' }, dir: 'higher-bad', xmax: 90, xTicks: [0, 30, 60, 90],
    set: [['NER', 'Niger'], ['TCD', 'Chad'], ['ETH', 'Ethiopia'], ['NGA', 'Nigeria'], ['BGD', 'Bangladesh'], ['IND', 'India'], ['VNM', 'Vietnam'], ['IDN', 'Indonesia'], ['EGY', 'Egypt'], ['BRA', 'Brazil'], ['CHN', 'China'], ['ZAF', 'South Africa'], ['USA', 'United States'], ['DEU', 'Germany']],
    attribution: 'ILO, via World Bank', primarySource: 'International Labour Organization (ILO modelled estimate)', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SL.EMP.VULN.ZS', sourceIndicator: 'SL.EMP.VULN.ZS', definition: 'Vulnerable employment — own-account and contributing family workers as a share of total employment (ILO modelled estimate), latest year per country. Work with no employer behind it.' },
  // NOTE: a labour-share-by-country bar was tried and dropped — country-level labour share inverts
  // (informal subsistence economies impute most income as labour, so Nigeria reads ~75% > Switzerland),
  // which would contradict FIG.7's GDP-weighted income-group chart and mislead. The income strip stands.
  { chartId: 'working-poverty-youth-by-country', title: 'Youth working poverty by country', unit: 'Employed youth (15–24) in extreme poverty, %',
    src: { kind: 'ilostat', dataflow: 'DF_SDG_0111_SEX_AGE_RT', dims: { SEX: 'SEX_T', AGE: 'AGE_YTHADULT_Y15-24' } }, dir: 'higher-bad', xmax: 95, xTicks: [0, 30, 60, 90],
    set: [['MDG', 'Madagascar'], ['COD', 'DR Congo'], ['MOZ', 'Mozambique'], ['MWI', 'Malawi'], ['ETH', 'Ethiopia'], ['NGA', 'Nigeria'], ['KEN', 'Kenya'], ['BGD', 'Bangladesh'], ['IND', 'India'], ['IDN', 'Indonesia'], ['VNM', 'Vietnam'], ['BRA', 'Brazil'], ['CHN', 'China']],
    attribution: 'ILOSTAT — International Labour Organization', primarySource: 'ILOSTAT — ILO (SDG 1.1.1)', license: 'CC BY 4.0', sourceUrl: 'https://ilostat.ilo.org', sourceIndicator: 'DF_SDG_0111_SEX_AGE_RT [SEX_T, AGE_YTHADULT_Y15-24]', definition: 'Share of employed young people aged 15–24 living in extreme poverty (under $2.15 a day), latest year per country. The young carry the worst of working poverty.' },
  { chartId: 'female-labour-by-country', title: 'Women in the labour force by country', unit: 'Women aged 15+ in the labour force, %',
    src: { kind: 'wb', indicator: 'SL.TLF.CACT.FE.ZS' }, dir: 'higher-good', xmax: 90, xTicks: [0, 30, 60, 90],
    set: [['SWE', 'Sweden'], ['VNM', 'Vietnam'], ['CHN', 'China'], ['BRA', 'Brazil'], ['USA', 'United States'], ['IDN', 'Indonesia'], ['BGD', 'Bangladesh'], ['IND', 'India'], ['EGY', 'Egypt'], ['IRN', 'Iran'], ['IRQ', 'Iraq'], ['DZA', 'Algeria']],
    attribution: 'ILO, via World Bank', primarySource: 'International Labour Organization (ILO modelled estimate)', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SL.TLF.CACT.FE.ZS', sourceIndicator: 'SL.TLF.CACT.FE.ZS', definition: 'Female labour-force participation — share of women aged 15+ working or seeking paid work (ILO modelled estimate), latest year per country. Most unpaid care and subsistence work is not counted here.' },
  { chartId: 'animals-slaughtered-by-country', title: 'Animals slaughtered by country', unit: 'Land animals slaughtered for meat per year, billion', scale: 1e9, logColor: true,
    src: { kind: 'owid', slug: 'animals-slaughtered-for-meat', sumCols: [3, 9] }, dir: 'neutral', xmax: 20, xTicks: [0, 5, 10, 15, 20],
    set: [['CHN', 'China'], ['USA', 'United States'], ['IDN', 'Indonesia'], ['BRA', 'Brazil'], ['IND', 'India'], ['MEX', 'Mexico'], ['RUS', 'Russia'], ['JPN', 'Japan'], ['FRA', 'France'], ['DEU', 'Germany'], ['NGA', 'Nigeria']],
    attribution: 'FAO, via Our World in Data', primarySource: 'UN Food and Agriculture Organization (FAO)', license: 'CC BY 4.0', sourceUrl: 'https://ourworldindata.org/grapher/animals-slaughtered-for-meat', sourceIndicator: 'animals-slaughtered-for-meat', definition: 'Land animals (cattle, pigs, chickens, ducks, turkeys, goats, sheep) slaughtered for meat per year, summed across species, latest year per country, shown in billions.' },

  // ───────────────────────────── batch 3 · health (the country lens for "Are we beating disease and death?") ─────────────────────────────
  { chartId: 'life-expectancy-by-country', title: 'Life expectancy by country', unit: 'Life expectancy at birth, years',
    src: { kind: 'wb', indicator: 'SP.DYN.LE00.IN' }, dir: 'higher-good', xmax: 90, xTicks: [0, 30, 60, 90],
    set: [['TCD', 'Chad'], ['NGA', 'Nigeria'], ['CAF', 'Central African Rep.'], ['COD', 'DR Congo'], ['IND', 'India'], ['BGD', 'Bangladesh'], ['BRA', 'Brazil'], ['USA', 'United States'], ['CHN', 'China'], ['JPN', 'Japan'], ['CHE', 'Switzerland']],
    attribution: 'UN WPP / WHO, via World Bank', primarySource: 'UN World Population Prospects', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SP.DYN.LE00.IN', sourceIndicator: 'SP.DYN.LE00.IN', definition: 'Life expectancy at birth in years, latest year per country.' },
  { chartId: 'maternal-mortality-by-country', title: 'Maternal mortality by country', unit: 'Maternal deaths per 100,000 live births',
    src: { kind: 'wb', indicator: 'SH.STA.MMRT' }, dir: 'higher-bad', xmax: 1200, xTicks: [0, 400, 800, 1200],
    set: [['TCD', 'Chad'], ['NGA', 'Nigeria'], ['SSD', 'South Sudan'], ['COD', 'DR Congo'], ['ETH', 'Ethiopia'], ['IND', 'India'], ['BGD', 'Bangladesh'], ['BRA', 'Brazil'], ['USA', 'United States'], ['CHN', 'China'], ['SWE', 'Sweden']],
    attribution: 'WHO/UNICEF/UNFPA/WB/UNDESA (MMEIG), via World Bank', primarySource: 'Maternal Mortality Estimation Inter-agency Group (MMEIG)', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SH.STA.MMRT', sourceIndicator: 'SH.STA.MMRT', definition: 'Maternal deaths per 100,000 live births (modelled estimate), latest year per country.' },
  { chartId: 'hiv-prevalence-by-country', title: 'HIV prevalence by country', unit: 'Adults 15–49 living with HIV, %', decimals: 1,
    src: { kind: 'wb', indicator: 'SH.DYN.AIDS.ZS' }, dir: 'higher-bad', xmax: 30, xTicks: [0, 10, 20, 30],
    set: [['SWZ', 'Eswatini'], ['LSO', 'Lesotho'], ['ZAF', 'South Africa'], ['BWA', 'Botswana'], ['ZWE', 'Zimbabwe'], ['NGA', 'Nigeria'], ['KEN', 'Kenya'], ['IND', 'India'], ['BRA', 'Brazil'], ['USA', 'United States'], ['CHN', 'China']],
    attribution: 'UNAIDS, via World Bank', primarySource: 'UNAIDS', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SH.DYN.AIDS.ZS', sourceIndicator: 'SH.DYN.AIDS.ZS', definition: 'Share of adults aged 15–49 living with HIV, latest year per country.' },
  { chartId: 'tb-incidence-by-country', title: 'Tuberculosis incidence by country', unit: 'New TB cases per 100,000 people',
    src: { kind: 'wb', indicator: 'SH.TBS.INCD' }, dir: 'higher-bad', xmax: 600, xTicks: [0, 200, 400, 600],
    set: [['CAF', 'Central African Rep.'], ['PHL', 'Philippines'], ['ZAF', 'South Africa'], ['COD', 'DR Congo'], ['IDN', 'Indonesia'], ['IND', 'India'], ['BGD', 'Bangladesh'], ['BRA', 'Brazil'], ['CHN', 'China'], ['USA', 'United States'], ['JPN', 'Japan']],
    attribution: 'WHO, via World Bank', primarySource: 'WHO Global Tuberculosis Report', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SH.TBS.INCD', sourceIndicator: 'SH.TBS.INCD', definition: 'Estimated new and relapse tuberculosis cases per 100,000 people, latest year per country.' },
  { chartId: 'vaccine-dtp3-by-country', title: 'Childhood vaccination by country', unit: 'Children with 3 doses of DTP vaccine, %',
    src: { kind: 'wb', indicator: 'SH.IMM.IDPT' }, dir: 'higher-good', xmax: 100, xTicks: [0, 25, 50, 75, 100],
    set: [['SOM', 'Somalia'], ['COD', 'DR Congo'], ['NGA', 'Nigeria'], ['ETH', 'Ethiopia'], ['IND', 'India'], ['BGD', 'Bangladesh'], ['BRA', 'Brazil'], ['USA', 'United States'], ['CHN', 'China'], ['JPN', 'Japan'], ['GBR', 'United Kingdom']],
    attribution: 'WHO/UNICEF, via World Bank', primarySource: 'WHO/UNICEF Estimates of National Immunization Coverage', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SH.IMM.IDPT', sourceIndicator: 'SH.IMM.IDPT', definition: 'Share of children aged 12–23 months who received three doses of the diphtheria-tetanus-pertussis vaccine, latest year per country.' },

  // ──── batch 4 · the cause-of-death transition & the within-country gap (HNP, CC BY) ────
  { chartId: 'cause-ncd-by-country', title: 'Share of deaths from chronic disease by country', unit: 'Deaths from noncommunicable disease, % of all deaths',
    src: { kind: 'wb', indicator: 'SH.DTH.NCOM.ZS' }, dir: 'neutral', xmax: 100, xTicks: [0, 25, 50, 75, 100],
    set: [['JPN', 'Japan'], ['CHE', 'Switzerland'], ['USA', 'United States'], ['CHN', 'China'], ['BRA', 'Brazil'], ['IND', 'India'], ['BGD', 'Bangladesh'], ['ETH', 'Ethiopia'], ['COD', 'DR Congo'], ['NGA', 'Nigeria'], ['TCD', 'Chad']],
    attribution: 'WHO Global Health Estimates, via World Bank', primarySource: 'WHO Global Health Estimates', license: 'CC BY 4.0', sourceUrl: 'https://data.worldbank.org/indicator/SH.DTH.NCOM.ZS', sourceIndicator: 'SH.DTH.NCOM.ZS', definition: 'Share of all deaths caused by noncommunicable (chronic) disease — heart disease, cancer, diabetes, and the like — latest year per country. A high share marks the late stage of the transition, where infections no longer kill the young.' },
  { chartId: 'u5mr-wealth-gap-by-country', title: 'Child survival gap, poorest vs richest fifth', unit: 'Under-5 deaths, poorest fifth ÷ richest fifth', decimals: 1,
    src: { kind: 'wb-ratio', num: 'SH.DYN.MORT.Q1', den: 'SH.DYN.MORT.Q5' }, dir: 'higher-bad', xmax: 5, xTicks: [0, 1, 2, 3, 4, 5],
    set: [['PER', 'Peru'], ['IND', 'India'], ['NGA', 'Nigeria'], ['COD', 'DR Congo'], ['ETH', 'Ethiopia'], ['BGD', 'Bangladesh'], ['PAK', 'Pakistan'], ['NER', 'Niger'], ['EGY', 'Egypt'], ['COL', 'Colombia'], ['PHL', 'Philippines']],
    attribution: 'DHS & UNICEF MICS, via World Bank (HNP by wealth quintile)', primarySource: 'Demographic and Health Surveys / UNICEF MICS', license: 'CC BY 4.0', sourceUrl: 'https://databank.worldbank.org/source/health-nutrition-and-population-statistics-by-wealth-quintile', sourceIndicator: 'SH.DYN.MORT.Q1 ÷ SH.DYN.MORT.Q5', definition: 'Under-five mortality among the poorest 20% of households divided by that of the richest 20%, latest survey per country. A ratio of 3 means a child in the poorest fifth is three times as likely to die before five as one in the richest fifth of the same country.' },

  // ── Climate mega-article: the responsibility & offshoring bars (country-level). ──
  { chartId: 'cumulative-co2-by-country', title: 'Cumulative CO₂ emissions by country', unit: 'Cumulative CO₂ since 1750, billion tonnes', scale: 1e9, logColor: true,
    src: { kind: 'owid', slug: 'cumulative-co2-emissions' }, dir: 'higher-bad', xmax: 450, xTicks: [0, 100, 200, 300, 400],
    set: [['USA', 'United States'], ['CHN', 'China'], ['RUS', 'Russia'], ['DEU', 'Germany'], ['GBR', 'United Kingdom'], ['JPN', 'Japan'], ['IND', 'India'], ['BRA', 'Brazil'], ['IDN', 'Indonesia'], ['NGA', 'Nigeria'], ['ETH', 'Ethiopia']],
    attribution: 'Global Carbon Budget, via Our World in Data', primarySource: 'Global Carbon Budget (2025)', license: 'CC BY 4.0', sourceUrl: 'https://ourworldindata.org/grapher/cumulative-co2-emissions', sourceIndicator: 'cumulative-co2-emissions', definition: 'Cumulative production-based CO₂ emissions since 1750 (billion tonnes), latest year per country — the stock of historical responsibility.' },
  { chartId: 'consumption-co2-pc-by-country', title: 'Consumption-based CO₂ per person by country', unit: 'Consumption-based CO₂ per person, tonnes per year', logColor: true,
    src: { kind: 'owid', slug: 'consumption-co2-per-capita' }, dir: 'higher-bad', xmax: 25, xTicks: [0, 5, 10, 15, 20, 25],
    set: [['USA', 'United States'], ['AUS', 'Australia'], ['DEU', 'Germany'], ['GBR', 'United Kingdom'], ['SWE', 'Sweden'], ['CHN', 'China'], ['BRA', 'Brazil'], ['IND', 'India'], ['NGA', 'Nigeria'], ['ETH', 'Ethiopia']],
    attribution: 'Global Carbon Budget, via Our World in Data', primarySource: 'Global Carbon Budget (2025)', license: 'CC BY 4.0', sourceUrl: 'https://ourworldindata.org/grapher/consumption-co2-per-capita', sourceIndicator: 'consumption-co2-per-capita', definition: 'Consumption-based CO₂ emissions per person (tonnes/year, counting the carbon embodied in imports), latest year per country.' },
];

const ONLY = process.env.ONLY;

for (const d of CONFIG) {
  if (ONLY && !d.chartId.includes(ONLY)) continue;
  const latest = d.src.kind === 'owid'
    ? parseOwid(await owidCsv(d.src.slug), d.src.col, d.src.sumCols)
    : d.src.kind === 'wb-ratio'
    ? ratioLatest(await wbLatest(d.src.num), await wbLatest(d.src.den))
    : d.src.kind === 'ilostat'
    ? await ilostatLatest(d.src.dataflow, d.src.dims)
    : await wbLatest(d.src.indicator);
  const scale = d.scale ?? 1, dec = d.decimals ?? 1;
  const ok = (c: string) => latest[c] && latest[c].year >= MIN_YEAR;
  const missing = d.set.filter(([c]) => !ok(c)).map(([, n]) => n);
  const bars = d.set
    .filter(([c]) => ok(c))
    .map(([c, name]) => ({ label: name, value: +(latest[c].value / scale).toFixed(dec), year: latest[c].year, color: '' }))
    .sort((a, b) => b.value - a.value);
  const vals = bars.map((b) => b.value), min = Math.min(...vals), max = Math.max(...vals);
  bars.forEach((b) => { b.color = colorize(b.value, min, max, d.dir, d.logColor, d.pivot); });
  const years = bars.map((b) => b.year);
  const yearSpan = `${Math.min(...years)}–${Math.max(...years)}`;

  const artifact = {
    chartId: d.chartId, kind: 'bars', title: d.title, unit: d.unit, yearSpan,
    bars: bars.map(({ label, value, color }) => ({ label, value, color })),
    xmax: d.xmax, xTicks: d.xTicks,
    provenance: {
      source: d.src.kind, sourceIndicator: d.sourceIndicator, url: d.sourceUrl, license: d.license,
      vintage: yearSpan, checksum: sha256(JSON.stringify(bars)),
      definition: `${d.definition} A curated ${bars.length}-country spread sorted descending.`,
      attribution: d.attribution, primarySource: d.primarySource,
    },
    recipe: [{ op: 'cross_section_latest', detail: `latest value per country${scale !== 1 ? `, ÷${scale}` : ''}, ${bars.length} curated countries sorted descending` }],
  };
  writeFileSync(join(ROOT, `src/data/derived/${d.chartId}.json`), JSON.stringify(artifact, null, 2));
  if (missing.length) console.log(`  ⚠ ${d.chartId} missing: ${missing.join(', ')}`);
  console.log(`✓ ${d.chartId}: ${bars.length} (${bars[0].label} ${bars[0].value} → ${bars[bars.length - 1].label} ${bars[bars.length - 1].value}) · ${yearSpan}`);
}
