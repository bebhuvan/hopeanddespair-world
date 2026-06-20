import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The last time debt was this high, it didn't get repaid — it got outgrown and inflated away.
   After the Second World War, Britain's public debt stood at about 270% of GDP (1946) and the
   United States' at 121%. Neither country ran the giant surpluses that paying that down would have
   required. Instead the ratio melted: a generation of growth, plus inflation and capped interest
   rates that quietly transferred wealth from savers to the state ("financial repression",
   Reinhart & Sbrancia 2015, who put the erosion at roughly 3-4% of GDP a year), shrank the burden.
   By 1980 the UK was near 43% and the US near 41%.

   The catch, and the link to this whole piece: that escape route is open only to a country whose
   debt is long-dated, domestic and in its own currency. The frontier economies carrying today's
   heaviest burdens borrowed short, abroad, in dollars — so inflation and a weak currency enlarge
   their debt instead of dissolving it. The rich world's way out is closed to the poor.

   IMF Historical Public Debt Database (general government debt, % of GDP), fetched via the DBnomics
   mirror (the IMF portal blocks automated fetches). IMF data-reuse-with-attribution. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const Y0 = 1900, Y1 = 2015;

const COUNTRIES = [
  { iso: 'GB', name: 'United Kingdom', file: 'debt-history-uk' },
  { iso: 'US', name: 'United States', file: 'debt-history-us' },
] as const;

const snapDir = join(ROOT, 'data/sources/imf-hpdd', VINTAGE);
mkdirSync(snapDir, { recursive: true });

const dims = encodeURIComponent(JSON.stringify({ REF_AREA: COUNTRIES.map((c) => c.iso) }));
const url = `https://api.db.nomics.world/v22/series/IMF/HPDD?dimensions=${dims}&observations=1&format=json`;
const res = await fetch(url);
if (!res.ok) throw new Error(`DBnomics HPDD: HTTP ${res.status}`);
const raw = await res.text();
writeFileSync(join(snapDir, 'hpdd-uk-us.json'), raw);
const d = JSON.parse(raw);

const byIso: Record<string, Record<number, number>> = {};
for (const s of d.series.docs) {
  const iso = s.series_code.split('.')[1];
  const m: Record<number, number> = {};
  for (let i = 0; i < s.period.length; i++) {
    const y = parseInt(s.period[i], 10), v = s.value[i];
    if (v != null && y >= Y0 && y <= Y1) m[y] = v;
  }
  byIso[iso] = m;
}

const checksum = sha256(raw);
mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
for (const c of COUNTRIES) {
  const m = byIso[c.iso];
  const years = Object.keys(m).map(Number).sort((a, b) => a - b);
  const artifact = {
    indicatorId: `debt.hpdd.${c.iso.toLowerCase()}`, entity: c.iso, entityName: c.name,
    unit: 'general government debt, % of GDP',
    points: years.map((y) => ({ t: y, value: Math.round(m[y] * 10) / 10 })),
    provenance: {
      source: 'imf-hpdd', sourceIndicator: 'Historical Public Debt Database — general government debt, % of GDP',
      url: 'https://www.imf.org/external/datamapper/datasets/DEBT',
      license: 'IMF — data reuse with attribution', vintage: VINTAGE, checksum,
      definition: `General government gross debt as a share of GDP for ${c.name}, ${years[0]}–${years[years.length - 1]}.`,
      attribution: 'IMF Historical Public Debt Database',
      primarySource: 'IMF HPDD (via DBnomics mirror IMF/HPDD)',
    },
    recipe: [{ op: 'fetch', detail: `DBnomics IMF/HPDD REF_AREA=${c.iso}, windowed ${Y0}-${Y1}` }],
  };
  writeFileSync(join(ROOT, `src/data/derived/${c.file}.json`), JSON.stringify(artifact, null, 2));
  const peak = years.reduce((a, y) => (m[y] > m[a] ? y : a), years[0]);
  console.log(`✓ ${c.name}: ${years[0]}–${years[years.length - 1]}, peak ${peak} = ${Math.round(m[peak])}% · 1980 = ${m[1980]?.toFixed(0)}% · ${Y1} = ${m[Y1]?.toFixed(0)}%`);
}
