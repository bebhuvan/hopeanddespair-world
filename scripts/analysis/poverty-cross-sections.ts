import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/* Emit two cross-section bar artifacts consumed by src/lib/bars.ts:
   - gini-by-country.json   — within-country income inequality, a curated spread (most → least equal)
   - mpi-by-country.json     — the multidimensional-poverty geography (most-deprived countries)
   MPI and Gini are one or two survey points per country, so a trend line would lie — these are
   honest cross-sections (CHARTS.md, the bar job). Like convergence-scatter, this lives outside the
   registry pipeline as a committed artifact but snapshots its OWID inputs (snapshot-everything). */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);

async function owid(slug: string): Promise<string> {
  const url = `https://ourworldindata.org/grapher/${slug}.csv`;
  const dir = join(ROOT, 'data/sources/owid', VINTAGE, slug);
  const raw = join(dir, 'raw.csv');
  if (existsSync(raw)) return readFileSync(raw, 'utf8');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OWID ${slug}: HTTP ${res.status}`);
  const text = await res.text();
  mkdirSync(dir, { recursive: true });
  writeFileSync(raw, text);
  writeFileSync(join(dir, 'snapshot.json'), JSON.stringify({ source: 'owid', slug, vintage: VINTAGE, url, checksum: sha256(text), license: 'CC BY 4.0', fetchedAt: new Date().toISOString() }, null, 2));
  return text;
}

/** Parse an OWID grapher CSV to the latest value per country code.
    Columns are entity,code,year,<value>,owid_region — value at index 3, region last. */
function latestByCode(csv: string, minYear = 0): Record<string, { name: string; year: number; value: number; region: string }> {
  const lines = csv.trim().split('\n');
  const out: Record<string, { name: string; year: number; value: number; region: string }> = {};
  for (let i = 1; i < lines.length; i++) {
    const f = lines[i].split(',');
    const name = f[0], code = f[1], year = +f[2], value = +f[3], region = f[f.length - 1];
    if (!code || code.length !== 3 || !isFinite(year) || !isFinite(value) || f[3] === '' || year < minYear) continue;
    if (!out[code] || year > out[code].year) out[code] = { name, year, value, region };
  }
  return out;
}

const REGION_COL: Record<string, string> = {
  Africa: 'despair', Asia: 'uncertain', 'South America': 'ochre', 'North America': 'stone',
  Europe: 'hope', Oceania: 'hope',
};

// ── Gini — a curated spread so the ranking spans the real range (Southern Africa & Latin America
//    most unequal; Europe least). ISO3 → display name. Value = Gini × 100 (the grapher gives 0–1).
const GINI_SET: [string, string][] = [
  ['ZAF', 'South Africa'], ['NAM', 'Namibia'], ['BRA', 'Brazil'], ['COL', 'Colombia'],
  ['MEX', 'Mexico'], ['USA', 'United States'], ['CHN', 'China'], ['IDN', 'Indonesia'],
  ['IND', 'India'], ['GBR', 'United Kingdom'], ['POL', 'Poland'], ['DEU', 'Germany'],
  ['SWE', 'Sweden'], ['SVN', 'Slovenia'],
];

const giniRaw = await owid('economic-inequality-gini-index');
const gini = latestByCode(giniRaw);
const giniBars = GINI_SET
  .filter(([c]) => gini[c])
  .map(([c, name]) => ({ label: name, value: +(gini[c].value * 100).toFixed(1), color: '', year: gini[c].year }))
  .sort((a, b) => b.value - a.value);
// colour: top third despair (most unequal), middle ochre, bottom hope (most equal)
giniBars.forEach((b, i) => { b.color = i < giniBars.length / 3 ? 'despair' : i < (2 * giniBars.length) / 3 ? 'ochre' : 'hope'; });
const giniYears = giniBars.map((b) => b.year);
const giniYearSpan = `${Math.min(...giniYears)}–${Math.max(...giniYears)}`;

const giniArtifact = {
  chartId: 'gini-by-country', kind: 'bars',
  title: 'Income inequality (Gini) — a curated spread, latest available survey',
  unit: 'Gini index (0 = everyone equal · 100 = one person holds all)',
  bars: giniBars.map(({ label, value, color }) => ({ label, value, color })),
  xmax: 70, xTicks: [0, 20, 40, 60],
  provenance: {
    source: 'owid', sourceIndicator: 'economic-inequality-gini-index',
    url: 'https://ourworldindata.org/grapher/economic-inequality-gini-index', license: 'CC BY 4.0', vintage: VINTAGE,
    checksum: sha256(JSON.stringify(giniBars)),
    definition: `Gini index of income or consumption, latest available survey per country (${giniYearSpan}); rescaled ×100. A curated ${giniBars.length}-country spread.`,
    attribution: 'World Bank — Poverty and Inequality Platform, via Our World in Data',
    primarySource: 'World Bank — Poverty and Inequality Platform',
  },
  recipe: [{ op: 'cross_section_latest', detail: `latest Gini survey per country, ×100, ${giniBars.length} curated countries sorted descending` }],
};
writeFileSync(join(ROOT, 'src/data/derived/gini-by-country.json'), JSON.stringify(giniArtifact, null, 2));

// ── MPI — a curated spread (worst → near-zero) so the geography reads: the Sahel & Central Africa
//    at the top, big South-Asian countries in the middle, the income-success stories near zero.
//    MPI = share poor × average intensity of their deprivation, on health/education/living standards.
const MPI_SET: [string, string][] = [
  ['TCD', 'Chad'], ['NER', 'Niger'], ['ETH', 'Ethiopia'], ['NGA', 'Nigeria'],
  ['COD', 'DR Congo'], ['PAK', 'Pakistan'], ['IND', 'India'], ['BGD', 'Bangladesh'],
  ['IDN', 'Indonesia'], ['PHL', 'Philippines'], ['ZAF', 'South Africa'], ['EGY', 'Egypt'],
  ['COL', 'Colombia'], ['CHN', 'China'],
];
const mpiRaw = await owid('multidimensional-poverty-index-mpi');
const mpi = latestByCode(mpiRaw);
const mpiMissing = MPI_SET.filter(([c]) => !mpi[c]).map(([, n]) => n);
const mpiBars = MPI_SET
  .filter(([c]) => mpi[c])
  .map(([c, name]) => ({ code: c, label: name, value: +(mpi[c].value * 100).toFixed(1), color: REGION_COL[mpi[c].region] ?? 'stone', year: mpi[c].year }))
  .sort((a, b) => b.value - a.value);
if (mpiMissing.length) console.log(`  ⚠ MPI missing (no survey): ${mpiMissing.join(', ')}`);

const mpiArtifact = {
  chartId: 'mpi-by-country', kind: 'bars',
  title: 'Multidimensional poverty — the most-deprived countries, recent surveys',
  unit: 'Multidimensional Poverty Index (×100) — deprivation in health, schooling & living standards',
  bars: mpiBars.map(({ label, value, color }) => ({ label, value, color })),
  xmax: 65, xTicks: [0, 20, 40, 60],
  provenance: {
    source: 'owid', sourceIndicator: 'multidimensional-poverty-index-mpi',
    url: 'https://ourworldindata.org/grapher/multidimensional-poverty-index-mpi', license: 'CC BY 4.0', vintage: VINTAGE,
    checksum: sha256(JSON.stringify(mpiBars)),
    definition: `Global Multidimensional Poverty Index (national, current-margin estimate), latest available survey per country, ×100; a curated ${mpiBars.length}-country spread. MPI = headcount × average deprivation intensity across 10 indicators.`,
    attribution: 'OPHI & UNDP, via Our World in Data',
    primarySource: 'Oxford Poverty & Human Development Initiative (OPHI) — Global MPI',
  },
  recipe: [{ op: 'cross_section_latest', detail: `MPI ×100, latest available survey per country, ${mpiBars.length} curated countries sorted descending` }],
};
writeFileSync(join(ROOT, 'src/data/derived/mpi-by-country.json'), JSON.stringify(mpiArtifact, null, 2));

// ── Extreme poverty ($3.00/day) by country — a curated spread so the geography reads: the poverty
//    that remains is overwhelmingly African, while the Asian giants that drove the global collapse
//    (China, Vietnam, Indonesia) now sit near zero and India is mid-escape. Same $3.00 line as the
//    keystone carrying series (poverty-300), so the country bars and the regional lines agree.
const POV_SET: [string, string][] = [
  ['COD', 'DR Congo'], ['MDG', 'Madagascar'], ['MOZ', 'Mozambique'], ['NGA', 'Nigeria'],
  ['ZMB', 'Zambia'], ['ETH', 'Ethiopia'], ['IND', 'India'], ['KEN', 'Kenya'],
  ['BGD', 'Bangladesh'], ['IDN', 'Indonesia'], ['VNM', 'Vietnam'], ['CHN', 'China'],
];
const povRaw = await owid('share-of-population-in-extreme-poverty');
const pov = latestByCode(povRaw);
const povMissing = POV_SET.filter(([c]) => !pov[c]).map(([, n]) => n);
const povBars = POV_SET
  .filter(([c]) => pov[c])
  .map(([c, name]) => ({ label: name, value: +pov[c].value.toFixed(1), color: '', year: pov[c].year }))
  .sort((a, b) => b.value - a.value);
// colour by where poverty still stands, not by rank — the distribution is bimodal (a cliff between
// the African countries and the escaped Asian ones), so a rank tercile would split near-equal values.
// ≥20% still in extreme poverty = despair; 5–20% = ochre; under 5% = hope (largely escaped).
povBars.forEach((b) => { b.color = b.value >= 20 ? 'despair' : b.value >= 5 ? 'ochre' : 'hope'; });
if (povMissing.length) console.log(`  ⚠ poverty-by-country missing (no survey): ${povMissing.join(', ')}`);
const povYears = povBars.map((b) => b.year);
const povYearSpan = `${Math.min(...povYears)}–${Math.max(...povYears)}`;

const povArtifact = {
  chartId: 'extreme-poverty-by-country', kind: 'bars',
  title: 'Extreme poverty by country — where it remains, latest available survey',
  unit: 'Share living below $3.00 a day (2021 PPP), %',
  yearSpan: povYearSpan,
  bars: povBars.map(({ label, value, color }) => ({ label, value, color })),
  xmax: 90, xTicks: [0, 20, 40, 60, 80],
  provenance: {
    source: 'owid', sourceIndicator: 'share-of-population-in-extreme-poverty',
    url: 'https://ourworldindata.org/grapher/share-of-population-in-extreme-poverty', license: 'CC BY 4.0', vintage: VINTAGE,
    checksum: sha256(JSON.stringify(povBars)),
    definition: `Share of population living below the international extreme-poverty line of $3.00 a day (2021 PPP), latest available survey per country (${povYearSpan}); a curated ${povBars.length}-country spread sorted descending.`,
    attribution: 'World Bank — Poverty and Inequality Platform, via Our World in Data',
    primarySource: 'World Bank — Poverty and Inequality Platform',
  },
  recipe: [{ op: 'cross_section_latest', detail: `share below $3.00/day, latest available survey per country, ${povBars.length} curated countries sorted descending` }],
};
writeFileSync(join(ROOT, 'src/data/derived/extreme-poverty-by-country.json'), JSON.stringify(povArtifact, null, 2));

// ── A two-country trajectory: India vs Nigeria, $3.00/day over time. The regional chart already shows
//    East Asia falling while Africa stalls; this shows what a regional average HIDES — two countries
//    that began equally poor (India even poorer) and split. Committed cross-section, snapshot-everything.
//    Survey points are sparse (poverty is measured by household survey, not yearly) — that's honest.
function seriesByCode(csv: string, code: string, minYear = 1960): [number, number][] {
  const lines = csv.trim().split('\n');
  const out: [number, number][] = [];
  for (let i = 1; i < lines.length; i++) {
    const f = lines[i].split(',');
    if (f[1] !== code || f[3] === '' || !isFinite(+f[2]) || !isFinite(+f[3]) || +f[2] < minYear) continue;
    out.push([+f[2], +(+f[3]).toFixed(2)]);
  }
  return out.sort((a, b) => a[0] - b[0]);
}

const TREND_SET: [string, string][] = [['IND', 'India'], ['NGA', 'Nigeria']];
for (const [code, name] of TREND_SET) {
  const pts = seriesByCode(povRaw, code);
  const artifact = {
    indicatorId: `economy.poverty_300.${code.toLowerCase()}`,
    entity: code, entityName: name, unit: '%',
    points: pts.map(([t, value]) => ({ t, value })),
    provenance: {
      source: 'owid', sourceIndicator: 'share-of-population-in-extreme-poverty',
      url: 'https://ourworldindata.org/grapher/share-of-population-in-extreme-poverty', license: 'CC BY 4.0', vintage: VINTAGE,
      checksum: sha256(JSON.stringify(pts)),
      definition: `Share of ${name}'s population living below $3.00 a day (2021 PPP), all available survey years ${pts[0][0]}–${pts[pts.length - 1][0]}.`,
      attribution: 'World Bank — Poverty and Inequality Platform, via Our World in Data',
      primarySource: 'World Bank — Poverty and Inequality Platform',
    },
    recipe: [{ op: 'country_series', detail: `${name} ($3.00/day) survey points extracted from the OWID grapher` }],
  };
  writeFileSync(join(ROOT, `src/data/derived/poverty-300-${code.toLowerCase()}.json`), JSON.stringify(artifact, null, 2));
  console.log(`✓ poverty-300-${code.toLowerCase()}: ${name} ${pts.length} pts (${pts[0][1]}% ${pts[0][0]} → ${pts[pts.length - 1][1]}% ${pts[pts.length - 1][0]})`);
}

console.log(`✓ gini-by-country: ${giniBars.length} countries (${giniBars[0].label} ${giniBars[0].value} → ${giniBars[giniBars.length - 1].label} ${giniBars[giniBars.length - 1].value})`);
console.log(`✓ mpi-by-country: top ${mpiBars.length} (${mpiBars[0].label} ${mpiBars[0].value} → ${mpiBars[mpiBars.length - 1].label} ${mpiBars[mpiBars.length - 1].value})`);
console.log(`✓ extreme-poverty-by-country: ${povBars.length} countries (${povBars[0].label} ${povBars[0].value} → ${povBars[povBars.length - 1].label} ${povBars[povBars.length - 1].value})`);
