import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/* Default is partial. When a sovereign restructures, creditors take a "haircut" — a present-value
   loss — but almost never lose everything. Across 327 restructurings since 1815 the average loss is
   ~45% (Graf von Luckner, Meyer, Reinhart & Trebesch 2024, NBER WP 32599), and that figure has been
   strikingly stable for two centuries; defaults are renegotiations, not repudiations, which is why
   lenders keep coming back. The size of the cut tracks bargaining power more than fairness:
   cooperative, pre-emptive deals (Uruguay 2003) are shallow; the collapses with nothing left to
   offer (Iraq, Argentina) cut deepest.

   Named present-value (SZ) haircuts transcribed from the published tables:
     Cruces & Trebesch 2013 (AEJ:Macro), Table 2 — Russia 2000 50.8, Argentina 2005 76.8,
       Iraq 2006 89.4, Uruguay 2003 9.8, Ecuador 2009 67.7.
     Zettelmeyer, Trebesch & Gulati 2013 (Economic Policy), Table 2 — Greece 2012 PSI 64.6.
   The 200-year average reference line (≈45%) is GMRT 2024, abstract / Table 1.
   Academic datasets, link-only: the named values are displayed and cited, not re-hosted as a file. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);

type Bar = { label: string; value: number; color: string };
// Descending by haircut. Above the 200-year ~45% average = ochre; the soft, pre-emptive case = stone.
const BARS: Bar[] = [
  { label: 'Iraq 2006', value: 89, color: 'ochre' },
  { label: 'Argentina 2005', value: 77, color: 'ochre' },
  { label: 'Ecuador 2009', value: 68, color: 'ochre' },
  { label: 'Greece 2012', value: 65, color: 'ochre' },
  { label: 'Russia 2000', value: 51, color: 'ochre' },
  { label: 'Uruguay 2003', value: 10, color: 'stone' },
];

const snapDir = join(ROOT, 'data/sources/trebesch', VINTAGE);
mkdirSync(snapDir, { recursive: true });
const csv = 'restructuring,haircut_pct_present_value,source\n' +
  'Iraq 2006,89.4,Cruces-Trebesch 2013 Table 2\n' +
  'Argentina 2005,76.8,Cruces-Trebesch 2013 Table 2\n' +
  'Ecuador 2009,67.7,Cruces-Trebesch 2013 Table 2\n' +
  'Greece 2012 PSI,64.6,Zettelmeyer-Trebesch-Gulati 2013 Table 2\n' +
  'Russia 2000,50.8,Cruces-Trebesch 2013 Table 2\n' +
  'Uruguay 2003,9.8,Cruces-Trebesch 2013 Table 2\n';
writeFileSync(join(snapDir, 'named-haircuts.csv'), csv);
const checksum = sha256(csv);

const artifact = {
  chartId: 'restructuring-haircuts', kind: 'bars',
  title: 'What creditors lose when a country restructures',
  unit: 'present-value haircut, % · selected restructurings',
  yearSpan: '2000–2012', xmax: 100, xTicks: [0, 25, 50, 75, 100], decimals: 0,
  refLines: [{ y: 45, label: '200-year average' }],
  bars: BARS,
  provenance: {
    source: 'trebesch',
    sourceIndicator: 'Sovereign-debt restructuring present-value (SZ) haircuts, selected cases',
    url: 'https://www.nber.org/papers/w32599',
    license: 'Academic datasets — link-only (displayed and cited, not re-hosted)',
    vintage: VINTAGE, checksum,
    definition: 'Present-value creditor loss (1 − PV new / PV old) in selected sovereign-debt restructurings. Reference line is the ~45% average across 327 restructurings since 1815.',
    attribution: 'Cruces & Trebesch (2013); Graf von Luckner, Meyer, Reinhart & Trebesch (2024); Zettelmeyer, Trebesch & Gulati (2013)',
    primarySource: 'Published haircut tables (transcribed, not re-hosted)',
  },
  recipe: [{ op: 'transcribe', detail: 'present-value haircuts from published Table 2 of each paper; ref line = GMRT 2024 200-year average' }],
};

mkdirSync(join(ROOT, 'src/data/derived'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/derived/restructuring-haircuts.json'), JSON.stringify(artifact, null, 2));
console.log('✓ Restructuring haircuts (named cases + 200-yr avg ref line):');
for (const b of BARS) console.log(`   ${b.label.padEnd(16)} ${b.value}%`);
