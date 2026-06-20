import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* The divide, over time — public-debt-to-GDP trajectories, 2010–2024 (UNCTAD "A World of Debt").
   The asymmetry at the heart of the flagship (docs/ARTICLE-debt-plan.md, Act I): in fifteen years
   the frontier economies' debt exploded and they defaulted, while Japan — owing far more — barely
   moved and never missed a payment. Zambia 19→115% of GDP, Ghana 33→71%, Sri Lanka 69→99%; Japan
   206→237%. Same direction, opposite fate, because of what the debt is made of. Link-only (UNCTAD
   publication terms): displayed and cited, not re-hosted. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
function parseCSV(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; } else field += c; }
    else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1);
}

const dir = join(ROOT, 'data/sources/unctad');
const vintage = readdirSync(dir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!;
const csv = readFileSync(join(dir, vintage, 'wod-2025-consolidated.csv'), 'utf8');
const checksum = sha256(csv);
const rows = parseCSV(csv); const h = rows[0];
const cId = h.indexOf('ID'), cInd = h.indexOf('Indicator'), cYear = h.indexOf('year'), cVal = h.indexOf('value');
const PD = 'Public debt as a share of GDP';

const TARGETS: [string, string, string][] = [ // iso2, name, chartId
  ['JP', 'Japan', 'debt-traj-japan'], ['ZM', 'Zambia', 'debt-traj-zambia'],
  ['GH', 'Ghana', 'debt-traj-ghana'], ['LK', 'Sri Lanka', 'debt-traj-srilanka'],
];
mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
for (const [iso, name, chartId] of TARGETS) {
  const pts = rows.slice(1)
    .filter((r) => r[cId] === iso && r[cInd] === PD && Number.isFinite(parseFloat(r[cVal])))
    .map((r) => ({ t: parseInt(String(r[cYear]), 10), value: Math.round(parseFloat(r[cVal]) * 1000) / 10 }))
    .filter((p) => Number.isFinite(p.t)).sort((a, b) => a.t - b.t);
  const series = {
    indicatorId: `debt.public_debt_gdp.${iso.toLowerCase()}`, entity: iso, entityName: name, unit: '% of GDP',
    points: pts, provenance: {
      source: 'unctad', sourceIndicator: 'Public debt as a share of GDP', url: 'https://unctad.org/publication/world-of-debt',
      license: 'Link-only — UNCTAD publication terms (display + cite; not re-hosted)', vintage, checksum,
      definition: `General government gross debt, % of GDP, ${name}, 2010–2024.`,
      attribution: 'UN Trade and Development (UNCTAD) — A World of Debt 2025', primarySource: 'UNCTAD; IMF WEO',
    },
    recipe: [{ op: 'pick_entity', detail: `${name} public-debt %GDP time series` }],
  };
  writeFileSync(join(ROOT, `src/data/derived/${chartId}.json`), JSON.stringify(series, null, 2));
  console.log(`✓ ${chartId}: ${pts[0].t}=${pts[0].value}% → ${pts[pts.length - 1].t}=${pts[pts.length - 1].value}%`);
}
