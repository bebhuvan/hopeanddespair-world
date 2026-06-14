import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* Uppsala Conflict Data Program adapter — our first direct primary source (DATA.md: drop to
   primaries as needed). UCDP ships zipped CSVs at conflict/actor/dyad-year grain (CC BY 4.0); we
   fetch, unzip, and sum fatalities into a World total plus the five UCDP regions. `slug` selects
   the dataset. Battle deaths we already take from OWID; here the value is one-sided violence
   (civilians deliberately killed) and non-state conflict, which OWID doesn't re-host cleanly. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const V = '261'; // UCDP release 26.1

// Per-run memo: regional indicators share one dataset, so download+unzip each zip only once.
const _csvCache = new Map<string, string>();

const DATASETS: Record<string, { path: string; value: string; def: string }> = {
  brd: { path: `brd/ucdp-brd-conf-${V}-csv.zip`, value: 'bd_best',
    def: 'Best estimate of deaths in state-based armed conflict (combatants and civilians killed in the fighting).' },
  onesided: { path: `nsos/ucdp-onesided-${V}-csv.zip`, value: 'best_fatality_estimate',
    def: 'Best estimate of civilians deliberately killed by a government or a formally organised armed group.' },
  nonstate: { path: `nsos/ucdp-nonstate-${V}-csv.zip`, value: 'best_fatality_estimate',
    def: 'Best estimate of deaths in conflicts between two armed groups, neither of them a state.' },
};

// UCDP region codes → names. Multi-region conflicts (e.g. "1, 3") fold into World only.
const REGION: Record<string, string> = { '1': 'Europe', '2': 'Middle East', '3': 'Asia', '4': 'Africa', '5': 'Americas' };

/** RFC-4180-ish parser — UCDP actor names carry commas, so quotes must be respected. */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = '', inQ = false;
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
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''));
}

export const ucdp: Adapter = {
  id: 'ucdp',
  homepage: 'https://ucdp.uu.se',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const ds = DATASETS[spec.slug];
    if (!ds) throw new Error(`UCDP: unknown dataset "${spec.slug}" (have ${Object.keys(DATASETS).join(', ')})`);
    const url = `https://ucdp.uu.se/downloads/${ds.path}`;
    let csv = _csvCache.get(url);
    if (!csv) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`UCDP ${spec.slug}: HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const dir = mkdtempSync(join(tmpdir(), 'ucdp-'));
      const zip = join(dir, 'd.zip');
      writeFileSync(zip, buf);
      // -p extracts the CSV to stdout; the zip holds one .csv. The snapshot pins the extracted CSV.
      csv = execFileSync('unzip', ['-p', zip, '*.csv'], { maxBuffer: 1 << 30 }).toString('utf8');
      _csvCache.set(url, csv);
    }
    return {
      source: 'ucdp', slug: spec.slug, vintage: new Date().toISOString().slice(0, 10),
      url, checksum: sha256(csv), license: 'CC BY 4.0',
      body: csv, ext: 'csv', meta: { value: ds.value, def: ds.def },
      fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const ds = DATASETS[spec.slug];
    const rows = parseCSV(raw.body);
    const header = rows[0];
    const iVal = header.indexOf(spec.sourceColumn ?? ds.value);
    const iYear = header.indexOf('year');
    const iRegion = header.indexOf('region');
    const iLoc = header.indexOf('location_inc'); // battle-deaths only: per-conflict location
    if (iVal < 0 || iYear < 0) throw new Error(`UCDP ${spec.slug}: missing columns in ${header.join(',')}`);

    // Sum the best estimate by year, for World and (where the code is a single region) each region.
    const acc = new Map<string, Map<number, number>>();
    const add = (entity: string, yr: number, v: number) => {
      if (!acc.has(entity)) acc.set(entity, new Map());
      const m = acc.get(entity)!; m.set(yr, (m.get(yr) ?? 0) + v);
    };
    for (let r = 1; r < rows.length; r++) {
      const yr = parseInt(rows[r][iYear], 10);
      const v = Number(rows[r][iVal]);
      if (!Number.isFinite(yr) || !Number.isFinite(v)) continue;
      add('World', yr, v);
      if (iRegion >= 0) { const name = REGION[(rows[r][iRegion] || '').trim()]; if (name) add(name, yr, v); }
      // Per-conflict location, for the "current wars" chart. entityFilter keeps only the registered
      // ones, so this adds no noise to World/region indicators.
      if (iLoc >= 0 && rows[r][iLoc]) add(rows[r][iLoc], yr, v);
    }

    const prov = {
      source: 'ucdp', sourceIndicator: spec.sourceColumn ?? ds.value, url: raw.url, license: raw.license,
      vintage: raw.vintage, checksum: raw.checksum, definition: ds.def,
      attribution: 'Uppsala Conflict Data Program (UCDP), Uppsala University',
      primarySource: spec.primarySource ?? 'UCDP / PRIO',
    };
    const out: CanonicalSeries[] = [];
    for (const [entity, m] of acc) {
      if (spec.entityFilter && !spec.entityFilter.includes(entity)) continue;
      const points = [...m.entries()].map(([t, value]) => ({ t, value })).sort((a, b) => a.t - b.t);
      out.push({ indicatorId: spec.id, entity, entityName: entity, unit: spec.unit, points, provenance: { ...prov } });
    }
    return out;
  },
};
