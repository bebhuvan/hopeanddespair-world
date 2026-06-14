import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import type { Adapter, IndicatorSpec, RawSnapshot, CanonicalSeries } from '../../src/lib/data/types.ts';

/* UN World Population Prospects 2024 — the authoritative demographic source (CC BY 3.0 IGO),
   pulled from the ungated bulk CSV. The Data Portal /data API now requires a bearer token, so we
   take the published "Demographic Indicators" file instead: one gzip carries EVERY indicator (TFR,
   births, deaths, growth, median age, mean age at childbearing, sex ratio at birth, net migration,
   life expectancy, dependency …) for EVERY location, 1950–2100, on the medium variant. Pick the
   column with spec.sourceColumn, the location with spec.entityFilter (Location name / ISO3 / LocID).

   The source file is tens of MB; fetch() keeps only the handful of locations the atlas charts, so
   the re-hosted snapshot stays ~1 MB. One download serves every WPP indicator in a run (module
   cache keyed by URL). The file is CRLF-terminated, so the trailing \r is stripped on load. */

const ADAPTER_VERSION = '1.0.0';
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

const BASE = 'https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES';
const FILES: Record<string, string> = {
  'wpp-medium': `${BASE}/WPP2024_Demographic_Indicators_Medium.csv.gz`,
  // The low/high/etc. projection variants — one row per (location, variant, year). The genuine
  // uncertainty fan (World 2100 swings ~7bn → ~14bn). Filter the variant with spec.filter.variant.
  'wpp-variants': `${BASE}/WPP2024_Demographic_Indicators_OtherVariants.csv.gz`,
};

// Locations the atlas ever charts, by WPP LocID: World · the four World-Bank income groups ·
// the featured countries (Korea, China, Japan, Niger, Nigeria, India, USA, Brazil, Italy).
const KEEP = new Set(['900', '1500', '1501', '1502', '1503', '410', '156', '392', '562', '566', '356', '840', '76', '380', '31']);

const _full = new Map<string, string>(); // url → gunzipped CSV text, shared across specs in a run

/** Minimal RFC-4180 splitter (Location names can contain commas, e.g. "Bolivia (...)"). */
function splitCSV(line: string): string[] {
  const out: string[] = []; let f = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"') { if (line[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { out.push(f); f = ''; }
    else f += c;
  }
  out.push(f); return out;
}

export const unwpp: Adapter = {
  id: 'unwpp',
  homepage: 'https://population.un.org/wpp/',

  async fetch(spec: IndicatorSpec): Promise<RawSnapshot> {
    const url = FILES[spec.slug];
    if (!url) throw new Error(`unwpp: unknown file slug "${spec.slug}" (expected: ${Object.keys(FILES).join(', ')})`);
    let full = _full.get(url);
    if (!full) {
      const res = await fetch(url, { headers: { 'User-Agent': 'hopeanddespair.world data pipeline (research, non-commercial)' } });
      if (!res.ok) throw new Error(`unwpp ${spec.slug}: HTTP ${res.status}`);
      full = gunzipSync(Buffer.from(await res.arrayBuffer())).toString('utf8').replace(/\r/g, '');
      _full.set(url, full);
    }
    // Keep header + only allowlisted locations → a small, re-hostable snapshot. LocID is the 2nd
    // field (after SortOrder), always a bare integer, so a two-comma scan is robust to later quoting.
    const lines = full.split('\n');
    const kept: string[] = [lines[0]];
    for (let i = 1; i < lines.length; i++) {
      const ln = lines[i];
      if (!ln) continue;
      const c1 = ln.indexOf(','); const c2 = ln.indexOf(',', c1 + 1);
      if (c1 < 0 || c2 < 0) continue;
      if (KEEP.has(ln.slice(c1 + 1, c2))) kept.push(ln);
    }
    const body = kept.join('\n');
    return {
      source: 'unwpp', slug: spec.slug,
      vintage: new Date().toISOString().slice(0, 10),
      url: 'https://population.un.org/wpp/', checksum: sha256(body), license: 'CC BY 3.0 IGO',
      body, ext: 'csv', meta: {}, fetchedAt: new Date().toISOString(), adapterVersion: ADAPTER_VERSION,
    };
  },

  normalize(raw: RawSnapshot, spec: IndicatorSpec): CanonicalSeries[] {
    const lines = raw.body.split('\n').filter(Boolean);
    const header = splitCSV(lines[0]);
    const iLoc = header.indexOf('LocID');
    const iIso = header.indexOf('ISO3_code');
    const iName = header.indexOf('Location');
    const iTime = header.indexOf('Time');
    const iVar = header.indexOf('Variant');
    const iVal = header.indexOf(spec.sourceColumn ?? '');
    if (iName < 0 || iTime < 0 || iVal < 0)
      throw new Error(`unwpp ${spec.id}: column "${spec.sourceColumn}" not found among ${header.length} columns`);
    const wantVariant = spec.filter?.variant;        // e.g. 'Low' / 'High' in the OtherVariants file
    const scale = spec.valueScale ?? 1;              // e.g. WPP populations are in thousands → ×1000
    const byEntity = new Map<string, CanonicalSeries>();
    for (let r = 1; r < lines.length; r++) {
      const row = splitCSV(lines[r]);
      const name = row[iName], iso = iIso >= 0 ? row[iIso] : '', locId = row[iLoc];
      if (spec.entityFilter && !(spec.entityFilter.includes(name) || spec.entityFilter.includes(iso) || spec.entityFilter.includes(locId))) continue;
      if (wantVariant && iVar >= 0 && row[iVar] !== wantVariant) continue;
      const cell = row[iVal];
      if (cell === '' || cell == null) continue;
      const year = parseInt(row[iTime], 10);
      const value = Number(cell) * scale;
      if (!Number.isFinite(year) || !Number.isFinite(value)) continue;
      if (spec.yearMin != null && year < spec.yearMin) continue;
      if (spec.yearMax != null && year > spec.yearMax) continue;
      const entity = iso || locId;
      if (!byEntity.has(entity)) {
        byEntity.set(entity, {
          indicatorId: spec.id, entity, entityName: name, unit: spec.unit, points: [],
          provenance: {
            source: 'unwpp', sourceIndicator: spec.sourceColumn!, url: raw.url, license: raw.license,
            vintage: raw.vintage, checksum: raw.checksum, definition: spec.title,
            attribution: 'UN DESA, Population Division — World Population Prospects 2024',
            primarySource: spec.primarySource,
          },
        });
      }
      byEntity.get(entity)!.points.push({ t: year, value });
    }
    for (const s of byEntity.values()) s.points.sort((a, b) => a.t - b.t);
    return [...byEntity.values()];
  },
};
