import { createHash } from 'node:crypto';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* Convergence adapter — a COMPUTED source (DATA.md §4 derivations, but cross-country): it reduces
   the whole World Bank country panel (GDP per capita PPP × population) into a single annual metric
   series. This is the income-convergence engine behind "is the world's income converging?".

   Why an adapter and not a derive op: the standard derive() ops reduce ONE indicator's entities;
   these metrics join TWO panels (income + population) across ~180 countries and emit one series.
   Modelling it as an adapter (like ucdp/ember) keeps the shared pipeline untouched and snapshots
   the exact inputs used, checksummed.

   spec.slug selects the metric:
     sigma_unweighted  — SD of ln(GDPpc) across countries (one country = one unit). Flat = no
                          convergence between PLACES.
     sigma_weighted    — population-weighted SD of ln(GDPpc). Falling = convergence between PEOPLE.
     mld_all           — population-weighted mean log deviation (between-country inequality).
     mld_ex_chn_ind    — same, excluding China & India (the "is it just the two giants?" test).

   Income: NY.GDP.PCAP.PP.KD (PPP, constant 2021 international $). Population: SP.POP.TOTL.
   Real-country mask from the country metadata endpoint (region !== "Aggregates"). All CC BY 4.0. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

const INCOME = 'NY.GDP.PCAP.PP.KD';
const POP = 'SP.POP.TOTL';
const Y0 = 1990, Y1 = 2024;                 // PPP aggregate/country coverage span

// One network round shared across all convergence indicators.
let _inputs: Promise<{ income: any; pop: any; meta: any }> | null = null;
async function wbGet(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`convergence: WB HTTP ${res.status} for ${url}`);
  return JSON.parse(await res.text());
}
function loadInputs() {
  if (!_inputs) _inputs = (async () => ({
    income: await wbGet(`https://api.worldbank.org/v2/country/all/indicator/${INCOME}?format=json&per_page=25000&date=${Y0}:${Y1}`),
    pop: await wbGet(`https://api.worldbank.org/v2/country/all/indicator/${POP}?format=json&per_page=25000&date=${Y0}:${Y1}`),
    meta: await wbGet(`https://api.worldbank.org/v2/country?format=json&per_page=400`),
  }))();
  return _inputs;
}

// WB indicator JSON → { iso3 → { year → value } }
function panel(json: any): Record<string, Record<number, number>> {
  const out: Record<string, Record<number, number>> = {};
  for (const r of (json[1] ?? []) as any[]) {
    const iso3 = r?.countryiso3code;
    if (!iso3 || r.value == null) continue;
    const y = parseInt(r.date, 10), v = Number(r.value);
    if (!Number.isFinite(y) || !Number.isFinite(v)) continue;
    (out[iso3] ??= {})[y] = v;
  }
  return out;
}

// ── stats ─────────────────────────────────────────────────────────────────────────────────────
const ln = Math.log;
const wMean = (xs: number[], w: number[]) => { let s = 0, sw = 0; for (let i = 0; i < xs.length; i++) { s += w[i] * xs[i]; sw += w[i]; } return s / sw; };
const wSD = (xs: number[], w: number[]) => { const m = wMean(xs, w); let s = 0, sw = 0; for (let i = 0; i < xs.length; i++) { s += w[i] * (xs[i] - m) ** 2; sw += w[i]; } return Math.sqrt(s / sw); };

export const convergence: Adapter = {
  id: 'convergence',
  homepage: 'https://data.worldbank.org',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const { income, pop, meta } = await loadInputs();

    // real-country mask + the compact, checksummed extract that the computation actually consumes
    const region: Record<string, string> = {};
    for (const c of (meta[1] ?? []) as any[]) {
      if (c?.id && c?.region?.value && c.region.value !== 'Aggregates') region[c.id] = c.region.value;
    }
    const inc = panel(income), pp = panel(pop);
    const extract = { income: inc, pop: pp, region, span: [Y0, Y1] };
    const body = JSON.stringify(extract);
    return {
      source: 'worldbank', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url: `https://data.worldbank.org/indicator/${INCOME}`,
      checksum: sha256(body), license: 'CC BY 4.0',
      body, ext: 'json',
      meta: { income: INCOME, population: POP, countries: Object.keys(region).length },
      fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const { income, pop, region } = JSON.parse(raw.body) as {
      income: Record<string, Record<number, number>>; pop: Record<string, Record<number, number>>; region: Record<string, string>;
    };
    const years: number[] = [];
    for (let y = Y0; y <= Y1; y++) years.push(y);

    // balanced panel: real countries with BOTH income and population in EVERY year (no composition drift)
    const drop = spec.slug === 'mld_ex_chn_ind' ? new Set(['CHN', 'IND']) : new Set<string>();
    const set = Object.keys(region).filter((c) =>
      !drop.has(c) && income[c] && pop[c] && years.every((y) => income[c][y] != null && pop[c][y] != null));

    const points = years.map((y) => {
      const xs = set.map((c) => ln(income[c][y]));
      const w = set.map((c) => pop[c][y]);
      let value: number;
      if (spec.slug === 'sigma_unweighted') value = wSD(xs, xs.map(() => 1));
      else if (spec.slug === 'sigma_weighted') value = wSD(xs, w);
      else { // mld_all | mld_ex_chn_ind — population-weighted mean log deviation GE(0)
        const ybar = wMean(set.map((c) => income[c][y]), w);
        value = wMean(set.map((c) => ln(ybar / income[c][y])), w);
      }
      return { t: y, value };
    });

    const what: Record<string, string> = {
      sigma_unweighted: `Unweighted standard deviation of ln(GDP per capita, PPP) across ${set.length} countries (one country = one unit)`,
      sigma_weighted: `Population-weighted standard deviation of ln(GDP per capita, PPP) across ${set.length} countries (one person = one unit)`,
      mld_all: `Population-weighted between-country mean log deviation of GDP per capita (PPP), ${set.length} countries`,
      mld_ex_chn_ind: `Population-weighted between-country mean log deviation of GDP per capita (PPP), ${set.length} countries, excluding China & India`,
    };
    return [{
      indicatorId: spec.id, entity: spec.slug.toUpperCase(), entityName: spec.title, unit: spec.unit, points,
      provenance: {
        source: 'worldbank', sourceIndicator: `${INCOME} × ${POP}`,
        url: raw.url, license: raw.license, vintage: raw.vintage, checksum: raw.checksum,
        definition: what[spec.slug] ?? spec.title,
        attribution: 'World Bank — World Development Indicators (ICP PPP & population)',
        primarySource: spec.primarySource,
      },
      derivedFrom: [INCOME, POP],
      recipe: [{ op: spec.slug, detail: `${what[spec.slug]}, ${Y0}–${Y1}, balanced panel of ${set.length} countries` }],
    }];
  },
};
