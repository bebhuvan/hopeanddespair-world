import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The arrow flips, in dollars. "Net transfers" on external public (PPG) debt = the new money a
   country draws down in a year minus what it pays back in principal and interest. Positive means
   capital is flowing IN; negative means the country is, on net, paying its creditors more than it
   receives — exporting capital to the world's financial centres.

   Split by creditor, the 2022 reversal has one author. PRIVATE creditors (bondholders, banks)
   financed the developing world heavily through the 2010s, peaking near +$132bn in 2021, then
   slammed into reverse as global rates spiked: about -$100bn in both 2022 and 2023. OFFICIAL
   lenders (the IMF, World Bank, bilateral governments incl. China) kept flows positive (+$51bn in
   2023), partly cushioning the blow. The net effect: total PPG transfers to developing countries
   turned negative in 2022 for the first time since the 2000s debt-relief era.

   World Bank International Debt Statistics (CC BY 4.0). The aggregate is served only by the
   IDS-specific "source 6" endpoint, not the generic v2 indicator API. Low & middle income
   borrowers (country=LMY), all creditors (counterpart-area=World). */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const Y0 = 2005, Y1 = 2023;

const SERIES = {
  private: { code: 'DT.NTR.PRVT.CD', name: 'Private creditors' },
  official: { code: 'DT.NTR.OFFT.CD', name: 'Official creditors' },
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
    if (r.value == null) continue;
    out[parseInt(v.Time.id.slice(2), 10)] = r.value;
  }
  return out;
}

const priv = await pull(SERIES.private.code);
const off = await pull(SERIES.official.code);
const years = Array.from({ length: Y1 - Y0 + 1 }, (_, i) => Y0 + i);

const checksum = sha256(JSON.stringify({ priv, off }));
const prov = (code: string, def: string) => ({
  source: 'worldbank-ids', sourceIndicator: `World Bank IDS ${code} — net transfers on external debt`,
  url: 'https://databank.worldbank.org/source/international-debt-statistics',
  license: 'CC BY 4.0', vintage: VINTAGE, checksum, definition: def,
  attribution: 'World Bank International Debt Statistics',
  primarySource: 'World Bank IDS (source 6) API, low & middle income, all creditors',
});

const mk = (id: string, name: string, code: string, def: string, src: Record<number, number>) => ({
  indicatorId: id, entity: 'LMY', entityName: name, unit: 'US$ billions, net transfer on PPG external debt',
  points: years.filter((y) => src[y] != null).map((y) => ({ t: y, value: Math.round(src[y] / 1e8) / 10 })),
  provenance: prov(code, def),
  recipe: [{ op: 'fetch', detail: `WB IDS ${code}, country=LMY, counterpart=World, US$ → US$bn` }],
});

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/net-transfers-private.json'), JSON.stringify(
  mk('debt.net_transfers_private.lmy', SERIES.private.name, SERIES.private.code,
    'Net transfers on external PPG debt from private creditors (bondholders, commercial banks) to low & middle income countries, US$ billions, by year.', priv), null, 2));
writeFileSync(join(ROOT, 'src/data/derived/net-transfers-official.json'), JSON.stringify(
  mk('debt.net_transfers_official.lmy', SERIES.official.name, SERIES.official.code,
    'Net transfers on external PPG debt from official creditors (IMF, World Bank, bilateral governments) to low & middle income countries, US$ billions, by year.', off), null, 2));

console.log('✓ Net transfers on PPG external debt to developing countries (US$bn):');
console.log('   year   private  official    total');
for (const y of years) {
  if (priv[y] == null && off[y] == null) continue;
  const p = (priv[y] ?? 0) / 1e9, o = (off[y] ?? 0) / 1e9;
  console.log(`   ${y}  ${p.toFixed(1).padStart(7)} ${o.toFixed(1).padStart(8)} ${(p + o).toFixed(1).padStart(8)}`);
}
