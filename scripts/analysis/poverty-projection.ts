import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/* Emit poor-count-projection-world.json — the World Bank's forward projection of the extreme-poor
   count ($3.00/day, 2021 PPP), 2026→2040. The observed nowcast (poor-count-world) ends ~2026; this
   carries the dashed continuation in the "still on track?" movement. The shape: it bottoms out near
   2030 (~738M) and then CLIMBS BACK to ~888M by 2040 — Roser's "end of progress" reversal, drawn from
   the Bank's own numbers, not ours. Starts at 2026 so it anchors to the last observed point. Bespoke
   committed artifact (a forecast, never an observation), but snapshots its OWID input. */

const ROOT = process.cwd();
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const VINTAGE = new Date().toISOString().slice(0, 10);
const SLUG = 'projections-extreme-poverty-wb';
const START = 2026;

async function owid(slug: string): Promise<string> {
  const url = `https://ourworldindata.org/grapher/${slug}.csv?useColumnShortNames=true`;
  const dir = join(ROOT, 'data/sources/owid', VINTAGE, slug);
  const raw = join(dir, 'raw.csv');
  if (existsSync(raw)) return readFileSync(raw, 'utf8');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OWID ${slug}: HTTP ${res.status}`);
  const text = await res.text();
  mkdirSync(dir, { recursive: true });
  writeFileSync(raw, text);
  writeFileSync(join(dir, 'snapshot.json'), JSON.stringify({ source: 'owid', slug, vintage: VINTAGE, url, checksum: sha256(text), license: 'CC BY 4.0', fetchedAt: new Date().toISOString() }, null, 2));
  return text;
}

const csv = await owid(SLUG);
const lines = csv.trim().split('\n');
const head = lines[0].split(',');
const vi = head.findIndex((h) => /headcount__povertyline_300/i.test(h));
if (vi < 0) throw new Error(`projection value column not found in: ${head.join('|')}`);

const points = lines.slice(1)
  .map((l) => l.split(','))
  .filter((f) => f[0] === 'World' && +f[2] >= START && f[vi] !== '' && isFinite(+f[vi]))
  .map((f) => ({ t: +f[2], value: +(+f[vi] / 1e6).toFixed(3) }))
  .sort((a, b) => a.t - b.t);

const artifact = {
  indicatorId: 'economy.poor_count_projection.world',
  entity: 'WLD', entityName: 'World',
  unit: 'million people',
  points,
  provenance: {
    source: 'owid', sourceIndicator: 'headcount__povertyline_300 (World Bank projection)',
    url: `https://ourworldindata.org/grapher/${SLUG}`, license: 'CC BY 4.0', vintage: VINTAGE,
    checksum: sha256(JSON.stringify(points)),
    definition: `World Bank projection of the number of people below $3.00/day (2021 PPP), ${START}–${points[points.length - 1].t}. A forward forecast on the Bank's growth path, not an observation — it falls to a trough near 2030, then rises as the remaining poor concentrate in slow-growing economies.`,
    attribution: 'World Bank — Poverty and Inequality Platform (projection), via Our World in Data',
    primarySource: 'World Bank — Poverty and Inequality Platform',
  },
};
writeFileSync(join(ROOT, 'src/data/derived/poor-count-projection-world.json'), JSON.stringify(artifact, null, 2));
console.log(`✓ poor-count-projection-world: ${points.length} pts ${points[0].t}→${points[points.length - 1].t} (trough→${Math.min(...points.map((p) => p.value)).toFixed(0)}M, end ${points[points.length - 1].value.toFixed(0)}M)`);
