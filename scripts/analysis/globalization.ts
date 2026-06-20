import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The closing escalator — world trade as a share of GDP (World Bank, NE.TRD.GNFS.ZS). The
   development model the indebted periphery relied on, exporting its way out of debt, ran on an
   ever-more-open world. That escalator has stopped: trade climbed from a quarter of world GDP in
   1970 to nearly 60% by 2008, then plateaued and slipped as supply chains fragmented and friend-
   shoring spread (docs/ARTICLE-debt-plan.md, Act III). World Bank IDS/WDI is CC BY 4.0. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const code = 'NE.TRD.GNFS.ZS';
const url = `https://api.worldbank.org/v2/country/WLD/indicator/${code}?format=json&per_page=400&date=1970:2023`;
const res = await fetch(url);
if (!res.ok) throw new Error(`WB ${code}: HTTP ${res.status}`);
const text = await res.text();
const snapDir = join(ROOT, 'data/sources/worldbank-trade', VINTAGE);
mkdirSync(snapDir, { recursive: true });
writeFileSync(join(snapDir, `${code}.json`), text);
const pts = ((JSON.parse(text)[1] ?? []) as any[])
  .filter((r) => r?.value != null).map((r) => ({ t: parseInt(r.date, 10), value: Math.round(Number(r.value) * 10) / 10 }))
  .sort((a, b) => a.t - b.t);
const series = {
  indicatorId: 'trade.openness.world', entity: 'WLD', entityName: 'World', unit: '% of GDP (exports + imports)',
  points: pts, provenance: {
    source: 'worldbank', sourceIndicator: code, url: 'https://data.worldbank.org/indicator/NE.TRD.GNFS.ZS',
    license: 'CC BY 4.0', vintage: VINTAGE, checksum: sha256(text),
    definition: 'Trade (exports plus imports of goods and services) as a share of world GDP — the standard openness measure.',
    attribution: 'World Bank — World Development Indicators', primarySource: 'World Bank national accounts',
  },
  recipe: [{ op: 'pick_entity', detail: 'World trade openness, 1970–2023' }],
};
mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/globalization-trade.json'), JSON.stringify(series, null, 2));
const peak = pts.reduce((m, p) => (p.value > m.value ? p : m), pts[0]);
console.log(`✓ globalization-trade: ${pts[0].t}=${pts[0].value}% → peak ${peak.t}=${peak.value}% → ${pts[pts.length - 1].t}=${pts[pts.length - 1].value}%`);
