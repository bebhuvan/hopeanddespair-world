import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The hidden debt — debt a government already owes but has not disclosed. The World Bank's Global
   Economic Prospects (June 2026, box 3.1) tracks seven episodes where previously concealed borrowing
   was suddenly revealed, sized as the jump in reported government debt as a share of GDP (figure
   B3.1.1.A). Senegal's was the largest at 25.3% of GDP; Mozambique's "tuna bond" scandal, 9%. When
   the debt surfaced, sovereign spreads rose materially — about 250 basis points over the two months
   after a revelation, on average across the seven. Built from our snapshot of the GEP June 2026 box
   chart pack. The revision sizes are World Bank / Manger et al. (2025) and re-hosted with attribution
   (CC BY 3.0 IGO); the market-spread series in the same box are J.P.Morgan / Haver and are cited in
   prose, not re-hosted. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const dir = join(ROOT, 'data/sources/worldbank-gep');
const vintage = readdirSync(dir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!;
const file = join(dir, vintage, 'boxB3-1-1-A-debt-revisions.csv');
const text = readFileSync(file, 'utf8');
const checksum = sha256(text);

const rows = text.trim().split('\n').slice(1).map((line) => {
  const i = line.lastIndexOf(',');
  return { country: line.slice(0, i).trim().replace(/\s+/g, ' '), value: parseFloat(line.slice(i + 1)) };
});
rows.sort((a, b) => b.value - a.value);

// Colour by severity of the concealment: double-digit revelations in despair, the rest ochre.
const bars = rows.map((r) => ({ label: r.country, value: r.value, color: r.value >= 5 ? 'despair' : 'ochre' }));

const artifact = {
  chartId: 'debt-hidden-revisions',
  kind: 'bars',
  title: 'Debt revealed after concealment, by country',
  unit: '% of GDP added to reported government debt when hidden borrowing surfaced',
  yearSpan: vintage,
  xmax: 30,
  xTicks: [0, 10, 20, 30],
  bars,
  provenance: {
    source: 'worldbank-gep',
    sourceIndicator: 'Global Economic Prospects, June 2026 — figure B3.1.1.A',
    url: 'https://www.worldbank.org/en/publication/global-economic-prospects',
    license: 'CC BY 3.0 IGO — World Bank, re-hosted with attribution',
    vintage,
    checksum,
    definition: 'Debt-stock revision associated with a hidden-debt revelation, measured as a percent of GDP, for seven country episodes over the past two decades. Episode dates span 2005 (Dominican Republic, Türkiye) to 2025 (Senegal).',
    attribution: 'World Bank — Global Economic Prospects, June 2026 (CC BY 3.0 IGO)',
    primarySource: 'Manger et al. (2025); World Bank International Debt Statistics',
  },
  recipe: [{ op: 'transcribe_chart_pack', detail: 'figure B3.1.1.A, GEP June 2026, debt-stock revisions by country, sorted descending' }],
};

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/debt-hidden-revisions.json'), JSON.stringify(artifact, null, 2));

console.log('✓ gep-hidden-debt');
for (const b of bars) console.log(`   ${b.label.padEnd(20)} ${b.value}% of GDP  (${b.color})`);
