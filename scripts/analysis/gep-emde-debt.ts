import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The rising burden — the World Bank's Global Economic Prospects (June 2026, figure 3.1) shows the
   aggregate EMDE government-debt load roughly doubling: a GDP-weighted 36.7% of GDP in 2010 to a
   projected 76.9% by 2026 (excluding China, 37.9% -> 56.2%). Largely as a result, the cost of
   servicing that debt — net interest as a share of government revenue — climbed from 7% in 2010 to
   an estimated 10.9% in 2025. Built from our snapshot of the GEP June 2026 chart pack (figures
   3.1.A and 3.1.B), the underlying numbers compiled by the World Bank and IMF. GEP is CC BY 3.0 IGO:
   re-hosted with attribution. Data cutoff for the report was 2 June 2026. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const dir = join(ROOT, 'data/sources/worldbank-gep');
const vintage = readdirSync(dir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!;

function parseCSV(t: string): string[][] {
  return t.trim().split('\n').map((line) => line.split(',').map((c) => c.trim()));
}

const debtFile = join(dir, vintage, 'fig3-1-A-government-debt.csv');
const svcFile = join(dir, vintage, 'fig3-1-B-debt-service.csv');
const debtText = readFileSync(debtFile, 'utf8');
const svcText = readFileSync(svcFile, 'utf8');
const debtChecksum = sha256(debtText);
const svcChecksum = sha256(svcText);

const debtRows = parseCSV(debtText).slice(1);
const svcRows = parseCSV(svcText).slice(1);

// figure 3.1.A — year, EMDEs, EMDEs excl. China (% of GDP)
const emde = debtRows.map((r) => ({ t: parseInt(r[0], 10), value: parseFloat(r[1]) }));
const emdeExCh = debtRows.map((r) => ({ t: parseInt(r[0], 10), value: parseFloat(r[2]) }));
// figure 3.1.B — year ("2025e" => 2025), net interest as % of government revenue
const service = svcRows.map((r) => ({ t: parseInt(r[0], 10), value: parseFloat(r[1]) }));

const prov = (checksum: string, def: string, primary: string) => ({
  source: 'worldbank-gep',
  sourceIndicator: 'Global Economic Prospects, June 2026 — figure 3.1',
  url: 'https://www.worldbank.org/en/publication/global-economic-prospects',
  license: 'CC BY 3.0 IGO — World Bank, re-hosted with attribution',
  vintage,
  checksum,
  definition: def,
  attribution: 'World Bank — Global Economic Prospects, June 2026 (CC BY 3.0 IGO)',
  primarySource: primary,
});

const mkLine = (id: string, name: string, unit: string, points: { t: number; value: number }[], checksum: string, def: string, primary: string, recipeDetail: string) => ({
  indicatorId: id, entity: id, entityName: name, unit,
  points, provenance: prov(checksum, def, primary), recipe: [{ op: 'transcribe_chart_pack', detail: recipeDetail }],
});

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/debt-emde-gdp.json'), JSON.stringify(
  mkLine('debt-emde-gdp', 'EMDEs', 'general government debt, % of GDP', emde, debtChecksum,
    'GDP-weighted average government debt as a share of GDP across emerging market and developing economies; weights use average 2010–19 prices and market exchange rates. Sample of 139 EMDEs; 2025–26 are projections.',
    'IMF; World Bank', 'figure 3.1.A, GEP June 2026, EMDE GDP-weighted aggregate'), null, 2));
writeFileSync(join(ROOT, 'src/data/derived/debt-emde-gdp-exchina.json'), JSON.stringify(
  mkLine('debt-emde-gdp-exchina', 'EMDEs excl. China', 'general government debt, % of GDP', emdeExCh, debtChecksum,
    'GDP-weighted average government debt as a share of GDP across emerging market and developing economies excluding China; 2025–26 are projections.',
    'IMF; World Bank', 'figure 3.1.A, GEP June 2026, EMDE excl. China aggregate'), null, 2));
writeFileSync(join(ROOT, 'src/data/derived/debt-emde-service.json'), JSON.stringify(
  mkLine('debt-emde-service', 'EMDE debt-service cost', 'net interest, % of government revenue', service, svcChecksum,
    'Net interest payments as a share of government revenue, weighted by government revenue in US$, across up to 148 EMDEs. Net interest is the gap between primary and overall fiscal balances. 2025 is an estimate.',
    'IMF; Kose et al. (2022); World Bank', 'figure 3.1.B, GEP June 2026, revenue-weighted EMDE aggregate'), null, 2));

console.log('✓ gep-emde-debt');
console.log(`   EMDE debt %GDP     ${emde[0].value} (2010) -> ${emde.at(-1)!.value} (${emde.at(-1)!.t})`);
console.log(`   excl. China        ${emdeExCh[0].value} (2010) -> ${emdeExCh.at(-1)!.value} (${emdeExCh.at(-1)!.t})`);
console.log(`   debt service %rev  ${service[0].value} (2010) -> ${service.at(-1)!.value} (${service.at(-1)!.t})`);
