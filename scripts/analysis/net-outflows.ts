import { writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The flow reverses — the number of developing countries where debt service now exceeds the new
   money coming in (a net negative transfer on external public debt) has doubled in a decade, from
   28 in 2010 to 51 in 2023. For these countries the lender of last resort has become a net drain:
   they pay creditors more than they receive. Transcribed from UNCTAD's A World of Debt 2025
   (figure 11; values are labelled on the bars), itself built on World Bank International Debt
   Statistics. UNCTAD is link-only — chart + cite + link, the figure is not re-hosted as a file.
   Rendered as an absolute (non-normalised) stacked area: total height = the count, bands = regions. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

// UNCTAD A World of Debt 2025, figure 11 — countries with net negative transfers, by region.
// Columns: year, Africa, Asia & Oceania, Latin America & the Caribbean. (2023 total 51 per report text.)
const TABLE: [number, number, number, number][] = [
  [2010, 11, 11, 6], [2011, 8, 12, 11], [2012, 10, 5, 9], [2013, 9, 8, 5],
  [2014, 5, 11, 3], [2015, 9, 11, 3], [2016, 8, 9, 9], [2017, 12, 10, 11],
  [2018, 11, 12, 14], [2019, 11, 15, 11], [2020, 14, 17, 7], [2021, 15, 14, 9],
  [2022, 20, 19, 10], [2023, 17, 22, 12],
];

const vintage = readdirSync(join(ROOT, 'data/sources/unctad')).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!;
const csv = 'year,Africa,Asia and Oceania,Latin America and the Caribbean\n' + TABLE.map((r) => r.join(',')).join('\n') + '\n';
mkdirSync(join(ROOT, 'data/sources/unctad', vintage), { recursive: true });
writeFileSync(join(ROOT, 'data/sources/unctad', vintage, 'net-outflows-figure11.csv'), csv);
const checksum = sha256(csv);

const band = (name: string, color: string, i: 1 | 2 | 3) => ({ name, color, data: TABLE.map((r) => [r[0], r[i]] as [number, number]) });
const artifact = {
  chartId: 'net-outflows-by-region', kind: 'area', absolute: true,
  title: 'Number of developing countries with net debt outflows doubled over the last decade',
  unit: 'developing countries with a net negative transfer on external public debt',
  x0: 2010, x1: 2023, xTicks: [2010, 2014, 2018, 2023],
  ymax: 55, yTicks: [0, 10, 20, 30, 40, 50],
  bands: [band('Africa', 'ochre', 1), band('Asia & Oceania', 'uncertain', 2), band('Latin America', 'stone', 3)],
  provenance: {
    source: 'unctad', sourceIndicator: 'Number of developing countries with net negative transfers on external public debt, by region',
    url: 'https://unctad.org/publication/world-of-debt',
    license: 'Link-only — UNCTAD publication terms (display + cite; figure not re-hosted)', vintage, checksum,
    definition: 'Count of developing countries whose net transfer on external public and publicly guaranteed (PPG) debt is negative — i.e. debt-service payments to foreign creditors exceed new disbursements — by region, each year. Transcribed from UNCTAD A World of Debt 2025, figure 11.',
    attribution: 'UN Trade and Development (UNCTAD) — A World of Debt 2025', primarySource: 'UNCTAD; World Bank International Debt Statistics (April 2025)',
  },
  recipe: [{ op: 'transcribe_figure', detail: 'UNCTAD WoD 2025 figure 11 labelled values; absolute stacked area, total = count of countries' }],
};

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/net-outflows-by-region.json'), JSON.stringify(artifact, null, 2));
const tot = (r: [number, number, number, number]) => r[1] + r[2] + r[3];
console.log(`✓ net-outflows-by-region: ${TABLE[0][0]}=${tot(TABLE[0])} → ${TABLE.at(-1)![0]}=${tot(TABLE.at(-1)!)} countries (doubled)`);
