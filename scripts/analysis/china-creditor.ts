import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The lending boom behind the creditor shift. The article's creditor-mix chart shows China's share
   of the world's *defaulted* debt rising from ~1% to ~24% — the consequence. This is the cause: the
   stock of developing-country public debt actually owed to China, which ran from about $5bn in 2000
   to over $150bn by 2023, a roughly thirtyfold rise that made Beijing the developing world's largest
   bilateral creditor. World Bank International Debt Statistics, counterpart-area = China (730),
   indicator DT.DOD.BLAT.CD (bilateral PPG debt stock). CC BY 4.0. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const Y0 = 2000, Y1 = 2023;

const snapDir = join(ROOT, 'data/sources/worldbank-ids', VINTAGE);
mkdirSync(snapDir, { recursive: true });

const url = `https://api.worldbank.org/v2/sources/6/country/LMY/series/DT.DOD.BLAT.CD/counterpart-area/730/time/all/data?format=json&per_page=600`;
const res = await fetch(url);
if (!res.ok) throw new Error(`WB IDS China stock: HTTP ${res.status}`);
const raw = await res.text();
writeFileSync(join(snapDir, 'DT.DOD.BLAT.CD-china.json'), raw);
const d = JSON.parse(raw);
const pts: Record<number, number> = {};
for (const r of d.source?.data ?? []) {
  const v = Object.fromEntries((r.variable as any[]).map((x) => [x.concept, x]));
  if (r.value == null) continue;
  pts[parseInt(v.Time.id.slice(2), 10)] = r.value;
}
const years = Array.from({ length: Y1 - Y0 + 1 }, (_, i) => Y0 + i).filter((y) => pts[y] != null);

const checksum = sha256(raw);
const artifact = {
  indicatorId: 'debt.owed_china.lmy', entity: 'LMY', entityName: 'Owed to China',
  unit: 'US$ billions owed to China (bilateral PPG)',
  points: years.map((y) => ({ t: y, value: Math.round(pts[y] / 1e8) / 10 })),
  provenance: {
    source: 'worldbank-ids', sourceIndicator: 'World Bank IDS DT.DOD.BLAT.CD, counterpart-area = China',
    url: 'https://databank.worldbank.org/source/international-debt-statistics',
    license: 'CC BY 4.0', vintage: VINTAGE, checksum,
    definition: 'Outstanding bilateral public & publicly guaranteed debt of low & middle income countries owed to China, US$ billions, by year.',
    attribution: 'World Bank International Debt Statistics',
    primarySource: 'World Bank IDS (source 6) API, counterpart-area China (730)',
  },
  recipe: [{ op: 'fetch', detail: 'WB IDS DT.DOD.BLAT.CD, country=LMY, counterpart=China(730), US$ → US$bn' }],
};

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/debt-owed-china.json'), JSON.stringify(artifact, null, 2));
console.log('✓ Developing-country debt owed to China (US$bn):',
  Object.fromEntries([2000, 2010, 2015, 2020, 2023].filter((y) => pts[y]).map((y) => [y, Math.round(pts[y] / 1e9)])));
