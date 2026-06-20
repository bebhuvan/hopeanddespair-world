import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* What a default feels like — consumer-price inflation around the moment three frontier economies
   stopped paying. The article's top-down spine never lets the reader feel the break; this is the
   human cost made of a sourced number. When a government defaults its currency collapses and the
   price of everything imported — fuel, food, medicine — soars in months. The same three characters
   from FIG. 2 (Zambia, Ghana, Sri Lanka), now shown by the inflation each suffered the year it
   broke: Sri Lanka 7% → ~50% (2022), Ghana ~10% → ~38% (2023), Zambia spiking past 20% (2021,
   after its Nov-2020 default). World Bank WDI (FP.CPI.TOTL.ZG) is CC BY 4.0 — re-hostable. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const CODE = 'FP.CPI.TOTL.ZG';
const Y0 = 2018, Y1 = 2024;

const CAST: { iso: string; entity: string; name: string; slug: string; defaulted: number }[] = [
  { iso: 'LKA', entity: 'LK', name: 'Sri Lanka', slug: 'inflation-srilanka', defaulted: 2022 },
  { iso: 'GHA', entity: 'GH', name: 'Ghana', slug: 'inflation-ghana', defaulted: 2022 },
  { iso: 'ZMB', entity: 'ZM', name: 'Zambia', slug: 'inflation-zambia', defaulted: 2020 },
];

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
const snapDir = join(ROOT, 'data/sources/worldbank-trade', VINTAGE);
mkdirSync(snapDir, { recursive: true });

for (const c of CAST) {
  const url = `https://api.worldbank.org/v2/country/${c.iso}/indicator/${CODE}?format=json&per_page=400&date=${Y0}:${Y1}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WB ${CODE} ${c.iso}: HTTP ${res.status}`);
  const text = await res.text();
  writeFileSync(join(snapDir, `${CODE}.${c.iso}.json`), text);
  const pts = ((JSON.parse(text)[1] ?? []) as any[])
    .filter((r) => r?.value != null).map((r) => ({ t: parseInt(r.date, 10), value: Math.round(Number(r.value) * 10) / 10 }))
    .sort((a, b) => a.t - b.t);
  const series = {
    indicatorId: `inflation.cpi.${c.entity.toLowerCase()}`, entity: c.entity, entityName: c.name,
    unit: 'consumer-price inflation, % per year',
    points: pts, provenance: {
      source: 'worldbank', sourceIndicator: CODE, url: 'https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG',
      license: 'CC BY 4.0', vintage: VINTAGE, checksum: sha256(text),
      definition: `Annual consumer-price inflation, ${c.name}, ${Y0}–${Y1}; the cost-of-living shock around its sovereign default (${c.defaulted}).`,
      attribution: 'World Bank — World Development Indicators', primarySource: 'IMF International Financial Statistics & World Bank',
    },
    recipe: [{ op: 'pick_entity', detail: `${c.name} CPI inflation, ${Y0}–${Y1}` }],
  };
  writeFileSync(join(ROOT, `src/data/derived/${c.slug}.json`), JSON.stringify(series, null, 2));
  const peak = pts.reduce((m, p) => (p.value > m.value ? p : m), pts[0]);
  console.log(`✓ ${c.slug}: ${pts[0].t}=${pts[0].value}% → peak ${peak.t}=${peak.value}%`);
}
