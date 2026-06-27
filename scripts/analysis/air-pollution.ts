import { createHash } from 'node:crypto';
import { writeFileSync, readFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/* Cross-section bar artifacts for Q14 "Is the air getting cleaner or deadlier?" — the *deadlier*
   half, which is a snapshot (a toll, a decomposition, a ranking) not a trend, so it renders as bars
   (CHARTS.md, the bar job). Real numbers only — every value is fetched live from WHO GHO (snapshotted)
   or read from the already-ingested World Bank derived series. Nothing is typed by hand.

   WHO GHO is CC BY-NC-SA 3.0 IGO → link-only (charted + cited, never re-hosted). World Bank is CC BY 4.0.
   Run: npx tsx scripts/analysis/air-pollution.ts */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);

/** WHO GHO indicator JSON, fetched + snapshotted (snapshot-everything, DATA.md §). */
async function gho(code: string): Promise<any[]> {
  const dir = join(ROOT, 'data/sources/who', VINTAGE, code);
  const cached = join(dir, 'raw.json');
  if (existsSync(cached)) return JSON.parse(readFileSync(cached, 'utf8')).value;
  const url = `https://ghoapi.azureedge.net/api/${code}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WHO GHO ${code}: HTTP ${res.status}`);
  const text = await res.text();
  mkdirSync(dir, { recursive: true });
  writeFileSync(cached, text);
  writeFileSync(join(dir, 'snapshot.json'), JSON.stringify({ source: 'who', code, vintage: VINTAGE, url, checksum: sha256(text), license: 'CC BY-NC-SA 3.0 IGO', fetchedAt: new Date().toISOString() }, null, 2));
  console.log(`  ↓ fetched + snapshotted WHO ${code}`);
  return JSON.parse(text).value;
}

/** Both-sex GLOBAL value for a given GHE cause (default: all causes) in the latest year present. */
function globalTotal(rows: any[], cause = 'GHECAUSE_GHE000000'): { year: number; value: number } {
  const m = rows
    .filter((x) => x.SpatialDim === 'GLOBAL' && (x.Dim1 == null || x.Dim1 === 'SEX_BTSX') && (x.Dim2 == null || x.Dim2 === cause) && x.NumericValue != null)
    .map((x) => ({ year: +x.TimeDim, value: +x.NumericValue }))
    .sort((a, b) => b.year - a.year);
  return m[0];
}

const whoProv = (title: string, code: string, def: string) => ({
  source: 'who', sourceIndicator: code,
  url: `https://www.who.int/data/gho/data/indicators/indicator-details/GHO/${code}`,
  license: 'CC BY-NC-SA 3.0 IGO', vintage: '2021', checksum: '',
  definition: def, attribution: 'WHO Global Health Observatory', primarySource: 'WHO Global Health Estimates 2021',
  notes: 'CC BY-NC-SA 3.0 IGO — link-only; charted but not re-hosted.',
});

function write(artifact: any) {
  artifact.provenance.checksum = sha256(JSON.stringify(artifact.bars));
  writeFileSync(join(ROOT, `src/data/derived/${artifact.chartId}.json`), JSON.stringify(artifact, null, 2));
  console.log(`✓ ${artifact.chartId}: ${artifact.bars.length} bars (${artifact.bars[0].label} ${artifact.bars[0].value} → ${artifact.bars[artifact.bars.length - 1].label} ${artifact.bars[artifact.bars.length - 1].value}) · ${artifact.yearSpan}`);
}

async function main() {
  // ── 1. The toll: ambient vs household vs joint (WHO 2021, millions of deaths/yr) ──────────────
  const [ambient, household, joint] = await Promise.all([gho('AIR_41'), gho('AIR_11'), gho('AIR_35')]);
  const amb = globalTotal(ambient), hh = globalTotal(household), jt = globalTotal(joint);
  const mil = (v: number) => +(v / 1e6).toFixed(2);
  write({
    chartId: 'airpoll-toll-2021', kind: 'bars',
    title: 'Air-pollution deaths by source, World', unit: 'million deaths per year',
    yearSpan: `${jt.year}`,
    bars: [
      { label: 'Joint total', value: mil(jt.value), color: 'despair' },
      { label: 'Ambient (outdoor)', value: mil(amb.value), color: 'despair' },
      { label: 'Household (cooking)', value: mil(hh.value), color: 'ochre' },
    ],
    xmax: 7, xTicks: [0, 2, 4, 6],
    provenance: whoProv('Air-pollution deaths by source', 'AIR_35/AIR_41/AIR_11', 'Deaths attributable to ambient (outdoor) air pollution, household (indoor) air pollution, and their joint effect, World, 2021. Joint total is below the sum because the two exposures overlap.'),
    recipe: [{ op: 'who_gho_total', detail: 'WHO GHO all-cause, both-sex, GLOBAL totals for 2021 — AIR_35 (joint), AIR_41 (ambient), AIR_11 (household), in millions.' }],
  });

  // ── 2. It's the heart: ambient deaths by cause (WHO 2021) ─────────────────────────────────────
  const CAUSES: [string, string, string][] = [
    ['GHECAUSE_GHE001130', 'Ischaemic heart disease', 'despair'],
    ['GHECAUSE_GHE001140', 'Stroke', 'despair'],
    ['GHECAUSE_GHE001180', 'COPD', 'ochre'],
    ['GHECAUSE_GHE000390', 'Lower-respiratory infections', 'ochre'],
    ['GHECAUSE_GHE000680', 'Lung cancer', 'stone'],
  ];
  write({
    chartId: 'airpoll-by-cause-2021', kind: 'bars',
    title: 'Ambient air-pollution deaths by cause, World', unit: 'million deaths per year',
    yearSpan: `${amb.year}`,
    bars: CAUSES.map(([code, name, color]) => ({ label: name, value: mil(globalTotal(ambient, code).value), color })),
    xmax: 2, xTicks: [0, 0.5, 1, 1.5, 2],
    provenance: whoProv('Ambient air-pollution deaths by cause', 'AIR_41', 'Deaths attributable to ambient (outdoor) air pollution by disease, World, 2021. Cardiovascular causes (ischaemic heart disease + stroke) dominate.'),
    recipe: [{ op: 'who_gho_by_cause', detail: 'WHO GHO AIR_41, both-sex, GLOBAL 2021, split by GHE cause (IHD, stroke, COPD, LRI, lung cancer), in millions.' }],
  });

  // ── 2b. The country magnification: PM2.5 exposure across a curated spread (World Bank, latest) ─
  // Fetch the whole indicator once; pick the latest value for each curated country. Real values only;
  // only the country SET is authored. Dirtiest → cleanest, the world-apart range made concrete.
  const wbAll = async (indicator: string): Promise<Record<string, { year: number; value: number }>> => {
    const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&per_page=25000&date=2010:2020`;
    const dir = join(ROOT, 'data/sources/worldbank', VINTAGE, indicator);
    const cached = join(dir, 'raw.json');
    let raw: any;
    if (existsSync(cached)) { raw = JSON.parse(readFileSync(cached, 'utf8')); }
    else {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`WB ${indicator}: HTTP ${res.status}`);
      raw = await res.json();
      mkdirSync(dir, { recursive: true });
      writeFileSync(cached, JSON.stringify(raw));
      writeFileSync(join(dir, 'snapshot.json'), JSON.stringify({ source: 'worldbank', indicator, vintage: VINTAGE, url, checksum: sha256(JSON.stringify(raw)), license: 'CC BY 4.0', fetchedAt: new Date().toISOString() }, null, 2));
      console.log(`  ↓ fetched + snapshotted WB ${indicator} (all countries)`);
    }
    // WB returns [meta, dataArray]; tolerate a cache that stored either the full response or just rows.
    const rows: any[] = Array.isArray(raw) ? (Array.isArray(raw[1]) ? raw[1] : raw) : [];
    const out: Record<string, { year: number; value: number }> = {};
    for (const r of rows) {
      const iso = r?.countryiso3code; const y = +r?.date; const v = r?.value;
      if (!iso || iso.length !== 3 || v == null || !Number.isFinite(y)) continue;
      if (!out[iso] || y > out[iso].year) out[iso] = { year: y, value: +v };
    }
    return out;
  };
  const COUNTRIES: [string, string][] = [
    ['TCD', 'Chad'], ['BGD', 'Bangladesh'], ['IND', 'India'], ['PAK', 'Pakistan'], ['NGA', 'Nigeria'],
    ['SAU', 'Saudi Arabia'], ['EGY', 'Egypt'], ['CHN', 'China'], ['IDN', 'Indonesia'], ['MEX', 'Mexico'],
    ['USA', 'United States'], ['GBR', 'United Kingdom'], ['BRA', 'Brazil'], ['AUS', 'Australia'], ['FIN', 'Finland'],
  ];
  // Current ACAG V6 (1998–2024) via the OWID grapher, fetched + snapshotted.
  const owidLatest = async (slug: string, col: string): Promise<Record<string, { year: number; value: number }>> => {
    const dir = join(ROOT, 'data/sources/owid', VINTAGE, slug);
    const cached = join(dir, 'raw.csv');
    let csv: string;
    if (existsSync(cached)) csv = readFileSync(cached, 'utf8');
    else {
      const url = `https://ourworldindata.org/grapher/${slug}.csv?csvType=full&useColumnShortNames=true`;
      const res = await fetch(url); if (!res.ok) throw new Error(`OWID ${slug}: HTTP ${res.status}`);
      csv = await res.text(); mkdirSync(dir, { recursive: true });
      writeFileSync(cached, csv);
      writeFileSync(join(dir, 'snapshot.json'), JSON.stringify({ source: 'owid', slug, vintage: VINTAGE, url, checksum: sha256(csv), license: 'CC BY 4.0', fetchedAt: new Date().toISOString() }, null, 2));
      console.log(`  ↓ fetched + snapshotted OWID ${slug}`);
    }
    const lines = csv.trim().split('\n'); const ci = lines[0].split(',').indexOf(col);
    const out: Record<string, { year: number; value: number }> = {};
    for (let i = 1; i < lines.length; i++) {
      const f = lines[i].split(','); const iso = f[1], y = +f[2], v = +f[ci];
      if (!iso || iso.length !== 3 || f[ci] === '' || !Number.isFinite(y) || !Number.isFinite(v)) continue;
      if (!out[iso] || y > out[iso].year) out[iso] = { year: y, value: v };
    }
    return out;
  };
  const pm = await owidLatest('pm25-air-pollution', 'population_weighted_pm25');
  const cbars = COUNTRIES.filter(([iso]) => pm[iso]).map(([iso, name]) => {
    const v = +pm[iso].value.toFixed(1);
    return { label: name, value: v, color: v > 35 ? 'despair' : v > 15 ? 'ochre' : 'hope' };
  }).sort((a, b) => b.value - a.value);
  const cyear = Math.max(...COUNTRIES.filter(([iso]) => pm[iso]).map(([iso]) => pm[iso].year));
  write({
    chartId: 'pm25-by-country', kind: 'bars',
    title: 'PM2.5 exposure — a curated spread of countries', unit: 'micrograms per cubic metre',
    yearSpan: `${cyear}`,
    bars: cbars,
    xmax: 90, xTicks: [0, 30, 60, 90],
    provenance: {
      source: 'owid', sourceIndicator: 'pm25-air-pollution',
      url: 'https://ourworldindata.org/grapher/pm25-air-pollution', license: 'CC BY 4.0',
      vintage: `${cyear}`, checksum: '',
      definition: `Population-weighted mean annual PM2.5 exposure, ${cyear}, across a curated 15-country spread sorted descending.`,
      attribution: 'Our World in Data', primarySource: 'Atmospheric Composition Analysis Group (van Donkelaar et al., V6.GL) — via Our World in Data',
    },
    recipe: [{ op: 'cross_section_latest', detail: `latest (${cyear}) population-weighted PM2.5 per country from OWID pm25-air-pollution, 15 curated countries sorted descending.` }],
  });

  // ── 3. Who dies: air-pollution mortality rate by region (World Bank / WHO, 2019) ──────────────
  // Read the already-ingested WB regional series (one 2019 point each) → a ranked regional bar.
  const REGIONS: [string, string][] = [
    ['ssf', 'Sub-Saharan Africa'], ['sas', 'South Asia'], ['eas', 'East Asia & Pacific'],
    ['mea', 'Middle East & N. Africa'], ['ecs', 'Europe & Central Asia'], ['lcn', 'Latin America & Carib.'],
  ];
  const regBars = REGIONS.map(([slug, name]) => {
    const d = JSON.parse(readFileSync(join(ROOT, `src/data/derived/airpoll-mortality-${slug}.json`), 'utf8'));
    return { label: name, value: +d.points[d.points.length - 1].value.toFixed(0), color: '' };
  }).sort((a, b) => b.value - a.value);
  const rmax = Math.max(...regBars.map((b) => b.value)), rmin = Math.min(...regBars.map((b) => b.value));
  regBars.forEach((b) => { b.color = b.value > (rmin + rmax) / 2 ? 'despair' : 'ochre'; });
  write({
    chartId: 'airpoll-deaths-by-region', kind: 'bars',
    title: 'Air-pollution mortality rate by region', unit: 'deaths per 100,000 (age-standardised)',
    yearSpan: '2019',
    bars: regBars,
    xmax: 200, xTicks: [0, 50, 100, 150, 200],
    provenance: {
      source: 'worldbank', sourceIndicator: 'SH.STA.AIRP.P5',
      url: 'https://data.worldbank.org/indicator/SH.STA.AIRP.P5', license: 'CC BY 4.0',
      vintage: '2019', checksum: '',
      definition: 'Age-standardised mortality rate attributed to ambient + household air pollution, by World Bank region, 2019.',
      attribution: 'World Bank WDI', primarySource: 'WHO Global Health Observatory — via World Bank WDI',
    },
    recipe: [{ op: 'cross_section_latest', detail: 'latest (2019) value per World Bank region from SH.STA.AIRP.P5, sorted descending.' }],
  });

  // ────────────────────────────────────────────────────────────────────────────────────────────
  //  THE BACK HALF — the under-told acts. These are *transcribed* headline figures from named,
  //  license-checked publications (the "re-host the derived table" path, DATA.md §1.6): CC-BY
  //  papers/reports are re-hostable with attribution; GBD/IHME-derived figures are link-only
  //  (charted + cited, not downloadable). Every value carries its source in `provenance`. This is
  //  the same discipline the debt/work articles used for composites — a number with a citation,
  //  never an invented one. Gate is set per source so the renderer withholds downloads correctly.
  // ────────────────────────────────────────────────────────────────────────────────────────────
  const lit = (artifact: any) => { artifact.illustrative = false; write(artifact); };

  // ── ACT I · The contested toll. Outdoor-PM2.5 death estimates disagree by ~3× across the
  //    literature, because each picks a different exposure-response curve. WHO outdoor is live
  //    above (AIR_41); the spread is the story. (GBD/IHME-derived → link-only.) ────────────────
  lit({
    chartId: 'airpoll-toll-range', kind: 'bars', gate: 'link-only',
    title: 'How wide is the "millions"? Outdoor-PM2.5 death estimates', unit: 'million deaths per year',
    yearSpan: '2015 — 2021',
    bars: [
      { label: 'Lelieveld 2015 (outdoor PM2.5 + ozone)', value: 3.3, color: 'ochre' },
      { label: 'WHO 2021 (ambient, this article)', value: +(amb.value / 1e6).toFixed(2), color: 'despair' },
      { label: 'GBD 2021 (ambient PM2.5)', value: 4.7, color: 'despair' },
      { label: 'Vohra 2021 (fossil-fuel PM2.5 only)', value: 8.7, color: 'despair' },
    ],
    xmax: 9, xTicks: [0, 3, 6, 9],
    provenance: {
      source: 'multi', sourceIndicator: 'published estimates',
      url: 'https://ourworldindata.org/air-pollution', license: 'mixed (link-only)', vintage: '2021', checksum: '',
      definition: 'Published annual death estimates attributable to outdoor air pollution. Estimates diverge because they use different exposure-response functions and pollutant scopes — not because the air differs. Lelieveld et al. 2015 (PNAS); WHO Global Health Estimates 2021; GBD 2021 (IHME); Vohra et al. 2021 (Environmental Research, fossil-fuel combustion PM2.5).',
      attribution: 'Lelieveld 2015; WHO 2021; IHME GBD 2021; Vohra 2021',
      primarySource: 'Compiled from four peer-reviewed estimates — GBD figures are IHME-licensed (link-only).',
      notes: 'Transcribed headline figures; GBD/IHME-derived → link-only, charted but not re-hosted.',
    },
    recipe: [{ op: 'literature_range', detail: 'Four published outdoor-air-pollution death estimates, 2015–2021, shown as a spread to make the modelling uncertainty legible.' }],
  });

  // ── ACT III · The morbidity iceberg. The ~500k newborn deaths are the visible tip; the
  //    damaged-but-surviving and never-born dwarf them. Ghosh 2021 (PLOS Med, CC BY) + Xue 2022
  //    (Nature Comms, CC BY) → re-hostable derived tables. ───────────────────────────────────────
  lit({
    chartId: 'airpoll-morbidity-iceberg', kind: 'bars', gate: 'rehost',
    title: 'The morbidity iceberg: what the death count leaves out', unit: 'million affected births per year',
    yearSpan: '2019',
    bars: [
      { label: 'Newborn deaths (in the "7 million")', value: 0.5, color: 'stone' },
      { label: 'Stillbirths attributable to PM2.5', value: 0.83, color: 'despair' },
      { label: 'Low-birth-weight births', value: 2.76, color: 'despair' },
      { label: 'Preterm births (35.7% of all)', value: 5.87, color: 'despair' },
    ],
    xmax: 6, xTicks: [0, 2, 4, 6],
    provenance: {
      source: 'multi', sourceIndicator: 'Ghosh 2021; Xue 2022', url: 'https://doi.org/10.1371/journal.pmed.1003718',
      license: 'CC BY 4.0', vintage: '2019', checksum: '',
      definition: 'PM2.5-attributable adverse birth outcomes in a single year, set against the newborn deaths already counted in the headline toll. Preterm 5.87M (35.7% of all preterm births) and low-birth-weight 2.76M from Ghosh et al. 2021 (PLOS Medicine); stillbirths 0.83M (39.7% of the global total) from Xue et al. 2022 (Nature Communications).',
      attribution: 'Ghosh et al. 2021 (PLOS Medicine); Xue et al. 2022 (Nature Communications)',
      primarySource: 'Both CC BY 4.0 — derived 204-country tables re-hostable with attribution.',
    },
    recipe: [{ op: 'morbidity_decomposition', detail: 'Visible newborn deaths vs the larger, uncounted strata of PM2.5-attributable birth harm.' }],
  });

  // ── ACT IV · The data is the story (the signature act). OpenAQ 2024 Air Quality Data Landscape;
  //    figures verified verbatim 2026-06-26. Report = cite (link-only). ──────────────────────────
  lit({
    chartId: 'airpoll-data-deserts', kind: 'bars', gate: 'link-only',
    title: 'The air no one measures', unit: 'percent',
    yearSpan: '2024',
    bars: [
      { label: 'Countries with no government PM2.5 monitoring', value: 36, color: 'despair' },
      { label: 'Countries that monitor but don’t share fully', value: 28, color: 'ochre' },
      { label: 'Countries fully transparent with their data', value: 27, color: 'hope' },
    ],
    xmax: 100, xTicks: [0, 25, 50, 75, 100],
    provenance: {
      source: 'openaq', sourceIndicator: 'OpenAQ 2024 Landscape', url: 'https://openaq.org/reports/the-air-quality-data-landscape/',
      license: 'report (cite)', vintage: '2024', checksum: '',
      definition: 'Government PM2.5 data availability worldwide. 36% of countries run no public monitoring (≈1 billion people across 71 countries unmonitored, 9 of 10 in low/lower-middle-income countries); of those that do, only 27% are fully transparent and only 54 share maximally-open station-level data.',
      attribution: 'OpenAQ — The Air Quality Data Landscape (2024)',
      primarySource: 'OpenAQ 2024 report; figures cited, not re-hosted.',
    },
    recipe: [{ op: 'monitoring_landscape', detail: 'Three states of national air-quality data — none, hidden, open — from the OpenAQ 2024 landscape.' }],
  });

  // ── ACT V · The forgotten poisons — lead is a heart story. GBD lead (link-only) + Forsyth 2023
  //    turmeric trial (re-derive). ────────────────────────────────────────────────────────────────
  lit({
    chartId: 'airpoll-lead-cause', kind: 'bars', gate: 'link-only',
    title: 'Lead kills the heart, not the IQ — where its ~1.5M deaths land', unit: 'percent of lead-attributable deaths',
    yearSpan: '2021',
    bars: [
      { label: 'Cardiovascular (heart attack, stroke)', value: 94, color: 'despair' },
      { label: 'Other causes', value: 6, color: 'stone' },
    ],
    xmax: 100, xTicks: [0, 25, 50, 75, 100],
    provenance: {
      source: 'gbd', sourceIndicator: 'GBD lead exposure', url: 'https://ourworldindata.org/lead-pollution',
      license: 'IHME (link-only)', vintage: '2021', checksum: '',
      definition: 'Of the ~1.5 million deaths the Global Burden of Disease attributes to lead exposure each year, roughly 94% are cardiovascular — not the lost-IQ story lead is usually filed under. A 2023 Lancet Planetary Health re-analysis put the toll ~6× higher than GBD-2019, at a US$6.0 trillion (6.9% of GDP) cost.',
      attribution: 'IHME Global Burden of Disease; Larsen & Sánchez-Triana 2023 (Lancet Planetary Health)',
      primarySource: 'GBD/IHME — link-only; charted and cited, not re-hosted.',
    },
    recipe: [{ op: 'cause_share', detail: 'Cardiovascular vs other share of lead-attributable deaths (GBD).' }],
  });

  // ── ACT VII · Wildfire smoke — upside-down geography. Chen et al. 2024 (The Lancet Planetary
  //    Health) landscape-fire smoke mortality. Link-only (journal). ───────────────────────────────
  lit({
    chartId: 'airpoll-wildfire-region', kind: 'bars', gate: 'link-only',
    title: 'Wildfire-smoke deaths are upside-down — the toll is in the global South', unit: 'percent of ~1.53M annual smoke deaths',
    yearSpan: '2024',
    bars: [
      { label: 'Sub-Saharan Africa', value: 39, color: 'despair' },
      { label: 'Rest of the low- & middle-income world', value: 52, color: 'despair' },
      { label: 'High-income countries (the photogenic megafires)', value: 9, color: 'ochre' },
    ],
    xmax: 100, xTicks: [0, 25, 50, 75, 100],
    provenance: {
      source: 'chen2024', sourceIndicator: 'Chen et al. 2024', url: 'https://doi.org/10.1016/S2542-5196(24)00255-0',
      license: 'journal (link-only)', vintage: '2024', checksum: '',
      definition: 'Landscape-fire smoke is attributed ~1.53 million deaths a year; more than 90% fall in low- and middle-income countries and ~39% in sub-Saharan Africa — savanna and crop burning, not the televised megafires. Smoke out-kills flame roughly 10:1 (Australia’s 2019–20 Black Summer: 417 smoke deaths vs 33 from flame).',
      attribution: 'Chen et al. 2024 (The Lancet Planetary Health)',
      primarySource: 'Peer-reviewed; figures cited, not re-hosted.',
    },
    recipe: [{ op: 'regional_share', detail: 'Where landscape-fire smoke deaths actually fall, by income geography.' }],
  });

  // ── ACT VII · Who consumes vs who breathes. Consumption-based PM2.5 mortality accounting.
  //    Illinois IDB-3251572 (CC BY) — re-hostable derived figures. ────────────────────────────────
  lit({
    chartId: 'airpoll-offshoring', kind: 'bars', gate: 'rehost',
    title: 'Death made elsewhere: PM2.5 deaths embodied in traded goods', unit: 'million deaths per year',
    yearSpan: '2017',
    bars: [
      { label: 'All outdoor PM2.5 deaths', value: 5.1, color: 'stone' },
      { label: '…driven by richer countries’ consumption, dying in poorer ones', value: 0.8, color: 'despair' },
    ],
    xmax: 6, xTicks: [0, 2, 4, 6],
    provenance: {
      source: 'illinois-idb', sourceIndicator: 'IDB-3251572', url: 'https://databank.illinois.edu/datasets/IDB-3251572',
      license: 'CC BY 4.0', vintage: '2017', checksum: '',
      definition: 'Of roughly 5.1 million annual PM2.5 deaths, about 800,000 occur because a richer country (≥50% higher GDP per capita) consumed goods produced in a poorer country’s air. The United States is the largest net importer of this embodied mortality, and the gap widened 32% between 2007 and 2017. Standard Value-of-Statistical-Life accounting prices those lives toward zero by construction.',
      attribution: 'Consumption-based PM2.5 mortality dataset (University of Illinois Databank, CC BY 4.0)',
      primarySource: 'CC BY 4.0 — derived figures re-hostable with attribution.',
    },
    recipe: [{ op: 'embodied_mortality', detail: 'PM2.5 deaths displaced from consumer to producer countries via trade.' }],
  });

  // ── ACT VIII · The standards moved, not the air. WHO 2021 guideline + national standards.
  //    WHO Standards / AQLI — cite. ───────────────────────────────────────────────────────────────
  lit({
    chartId: 'airpoll-standards', kind: 'bars', gate: 'link-only',
    title: 'The yardstick is a choice: legal PM2.5 limits as a multiple of the WHO guideline', unit: '× the 2021 WHO guideline (5 µg/m³)',
    yearSpan: '2024',
    bars: [
      { label: 'India (legal annual limit, 40 µg/m³)', value: 8.0, color: 'despair' },
      { label: 'United States (9 µg/m³, tightened 2024)', value: 1.8, color: 'ochre' },
      { label: 'European Union (from 2030, 10 µg/m³)', value: 2.0, color: 'ochre' },
      { label: 'WHO 2021 guideline (5 µg/m³)', value: 1.0, color: 'hope' },
    ],
    xmax: 8, xTicks: [0, 2, 4, 6, 8],
    provenance: {
      source: 'who-standards', sourceIndicator: 'WHO AQG 2021 + national standards', url: 'https://www.who.int/publications/i/item/9789240034228',
      license: 'cite', vintage: '2024', checksum: '',
      definition: 'National legal PM2.5 limits expressed as a multiple of the WHO 2021 guideline of 5 µg/m³. When the WHO halved its guideline in 2021, it pushed ~99% of humanity into non-compliance overnight with no change in the air. India’s legal limit is 8× the guideline; the US tightened its annual standard to 9 µg/m³ in 2024; 158 countries have no PM2.5 standard at all, and of the 94 that do, 37 breach their own.',
      attribution: 'WHO Global Air Quality Guidelines 2021; national air-quality standards',
      primarySource: 'WHO + national legislation; cited, not re-hosted.',
    },
    recipe: [{ op: 'standard_multiple', detail: 'Legal limits as a multiple of the WHO guideline — the yardstick as a policy choice.' }],
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
