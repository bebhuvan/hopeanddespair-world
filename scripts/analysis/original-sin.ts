import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* Original sin — the share of a country's international debt securities issued in FOREIGN currency,
   from BIS International Debt Securities (WS_DEBT_SEC2_PUB). The term, coined by Eichengreen and
   Hausmann, names the bind: most countries cannot borrow abroad in their own money, so a falling
   currency inflates their debt. The chart makes it measurable — emerging markets sit near 100%
   foreign-currency, while the issuers of reserve currencies (the US, Japan, the UK) borrow abroad
   largely in their own. The mechanism behind the article's currency thread (M1/M3). BIS is
   LINK-ONLY: charted and cited with attribution, never re-hosted.

   Aggregate key (found empirically): Q.3P.<NAT>.1.1.C.A.<CUR_GROUP>.TO1.A.A.A.A.A.I — nationality
   basis, all maturities/rates/risk, total currencies within the group, amounts outstanding. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const BASE = 'https://stats.bis.org/api/v1';
const PERIOD = '2024-Q4';

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

// CUR_GROUP is the 8th dim; NAT empty = all nationalities. One call per currency group.
async function pull(curGroup: 'A' | 'F'): Promise<{ body: string; byNat: Map<string, number> }> {
  const key = ['Q', '3P', '', '1', '1', 'C', 'A', curGroup, 'TO1', 'A', 'A', 'A', 'A', 'A', 'I'].join('.');
  const url = `${BASE}/data/WS_DEBT_SEC2_PUB/${key}?startPeriod=${PERIOD}&endPeriod=${PERIOD}`;
  const res = await fetch(url, { headers: { Accept: 'application/vnd.sdmx.data+csv', 'Accept-Language': 'en' } });
  if (!res.ok) throw new Error(`BIS IDS ${curGroup}: HTTP ${res.status}`);
  const body = await res.text();
  const rows = parseCSV(body); const h = rows[0];
  const iNat = h.indexOf('ISSUER_NAT'), iVal = h.indexOf('OBS_VALUE');
  const byNat = new Map<string, number>();
  for (let r = 1; r < rows.length; r++) { const v = parseFloat(rows[r][iVal]); if (Number.isFinite(v)) byNat.set(rows[r][iNat], v); }
  return { body, byNat };
}
const [all, fx] = await Promise.all([pull('A'), pull('F')]);
const snapDir = join(ROOT, 'data/sources/bis-ids', VINTAGE);
mkdirSync(snapDir, { recursive: true });
writeFileSync(join(snapDir, 'all.csv'), all.body);
writeFileSync(join(snapDir, 'foreign.csv'), fx.body);
const checksum = sha256(all.body + fx.body);

const CAST: [string, string, boolean][] = [ // iso2, name, reserve-currency issuer?
  ['AR', 'Argentina', false], ['TR', 'Türkiye', false], ['BR', 'Brazil', false], ['ID', 'Indonesia', false],
  ['ZA', 'South Africa', false], ['MX', 'Mexico', false], ['NG', 'Nigeria', false], ['CL', 'Chile', false],
  ['TH', 'Thailand', false], ['IN', 'India', false],
  ['US', 'United States', true], ['JP', 'Japan', true], ['GB', 'United Kingdom', true],
  ['AU', 'Australia', true], ['CA', 'Canada', true],
];
const rows = CAST.map(([iso, name]) => {
  const a = all.byNat.get(iso), f = fx.byNat.get(iso);
  if (a == null || f == null || a === 0) return null;
  return { name, share: Math.round((f / a) * 1000) / 10 };
}).filter(Boolean) as { name: string; share: number }[];

// Colour marks the privilege of escape, not danger: the few who borrow abroad in their own money
// stand out (hope); near-total foreign-currency reliance is the near-universal norm (ochre→despair).
const color = (s: number) => (s >= 95 ? 'despair' : s >= 70 ? 'ochre' : 'hope');
const bars = rows.sort((a, b) => b.share - a.share).map((r) => ({ label: r.name, value: r.share, color: color(r.share) }));

const artifact = {
  chartId: 'debt-foreign-currency-share', kind: 'bars',
  title: 'Share of international debt issued in foreign currency', unit: '% of international debt securities in a foreign currency · 2024',
  yearSpan: `${PERIOD}`, xmax: 100, xTicks: [0, 25, 50, 75, 100],
  bars,
  provenance: {
    source: 'bis', sourceIndicator: 'WS_DEBT_SEC2_PUB [foreign ÷ all currencies, amounts outstanding]',
    url: 'https://data.bis.org/topics/IDS', license: 'BIS terms — link-only (display with attribution; not re-hosted)',
    vintage: PERIOD, checksum,
    definition: `Foreign-currency international debt securities outstanding as a share of all international debt securities outstanding, by issuer nationality, ${PERIOD}. High = the country must borrow abroad in money it does not print ('original sin').`,
    attribution: 'Bank for International Settlements (BIS) — International Debt Securities',
    primarySource: 'BIS debt securities statistics',
  },
  recipe: [{ op: 'ratio', detail: 'foreign-currency outstanding ÷ all-currency outstanding (BIS IDS, nationality basis, total maturities); colour = share, not size' }],
};
mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/debt-foreign-currency-share.json'), JSON.stringify(artifact, null, 2));
console.log(`✓ debt-foreign-currency-share: ${bars.length} countries`);
bars.forEach((b) => console.log(`   ${b.label.padEnd(16)} ${b.value}%`));
