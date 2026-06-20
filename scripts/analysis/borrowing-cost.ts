import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The price of money — the asymmetry the two-speed divide rests on. When a developing country
   borrows from official lenders (the World Bank, bilateral governments) it pays a low, concessional
   rate, around 2-4%. When it borrows from private markets it pays more, and that gap has widened
   since global rates jumped: by 2023 the average new private-market loan cost developing countries
   close to 6%, against ~3.7% on official loans — and far above the 1-3% a wealthy sovereign is
   charged (the rich-world benchmark is not in this open dataset, only the developing side is).

   So the same road or power line leaves a poorer country a bigger debt behind. The poorest borrow
   mostly official and cheap; the premium bites hardest on the middle-income countries that depend on
   the bond market. World Bank IDS, average interest on new external debt commitments (DT.INR.OFFT /
   DT.INR.PRVT), low & middle income. CC BY 4.0. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const Y0 = 2005, Y1 = 2023;

const SERIES = {
  official: { code: 'DT.INR.OFFT', name: 'Official lenders', file: 'borrowing-cost-official' },
  private: { code: 'DT.INR.PRVT', name: 'Private markets', file: 'borrowing-cost-private' },
} as const;

const snapDir = join(ROOT, 'data/sources/worldbank-ids', VINTAGE);
mkdirSync(snapDir, { recursive: true });

async function pull(code: string): Promise<Record<number, number>> {
  const url = `https://api.worldbank.org/v2/sources/6/country/LMY/series/${code}/counterpart-area/WLD/time/all/data?format=json&per_page=600`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WB IDS ${code}: HTTP ${res.status}`);
  const raw = await res.text();
  writeFileSync(join(snapDir, `${code}.json`), raw);
  const d = JSON.parse(raw);
  const out: Record<number, number> = {};
  for (const r of d.source?.data ?? []) {
    const v = Object.fromEntries((r.variable as any[]).map((x) => [x.concept, x]));
    if (r.value != null) out[parseInt(v.Time.id.slice(2), 10)] = r.value;
  }
  return out;
}

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
const years = Array.from({ length: Y1 - Y0 + 1 }, (_, i) => Y0 + i);
const summary: Record<string, Record<number, number>> = {};
for (const k of Object.keys(SERIES) as (keyof typeof SERIES)[]) {
  const s = SERIES[k];
  const src = await pull(s.code);
  summary[k] = src;
  const checksum = sha256(JSON.stringify(src));
  const artifact = {
    indicatorId: `debt.borrowing_cost_${k}.lmy`, entity: 'LMY', entityName: s.name,
    unit: 'average interest on new external debt commitments, %',
    points: years.filter((y) => src[y] != null).map((y) => ({ t: y, value: Math.round(src[y] * 10) / 10 })),
    provenance: {
      source: 'worldbank-ids', sourceIndicator: `World Bank IDS ${s.code} — average interest on new external debt commitments`,
      url: 'https://databank.worldbank.org/source/international-debt-statistics',
      license: 'CC BY 4.0', vintage: VINTAGE, checksum,
      definition: `Average interest rate on new external debt commitments from ${s.name.toLowerCase()} to low & middle income countries, % per year.`,
      attribution: 'World Bank International Debt Statistics',
      primarySource: 'World Bank IDS (source 6) API, low & middle income, all creditors',
    },
    recipe: [{ op: 'fetch', detail: `WB IDS ${s.code}, country=LMY, counterpart=World` }],
  };
  writeFileSync(join(ROOT, `src/data/derived/${s.file}.json`), JSON.stringify(artifact, null, 2));
}
console.log('✓ Average interest on new commitments (%):');
console.log('   year   official  private');
for (const y of years) {
  if (summary.official[y] == null && summary.private[y] == null) continue;
  console.log(`   ${y}  ${(summary.official[y] ?? NaN).toFixed(1).padStart(7)} ${(summary.private[y] ?? NaN).toFixed(1).padStart(8)}`);
}
