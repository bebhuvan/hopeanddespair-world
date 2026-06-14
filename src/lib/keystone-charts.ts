import { fullChart, miniLine } from './charts';
import { barChart } from './bars';
import { windowSeries } from './smooth';
import { COL } from './article-charts';

/* The keystone mini-suite builder (docs/ARTICLE-keystone-plan.md §5). Each dimension is rendered
   from real derived series (referenced by chartId), with axes computed automatically from the data
   — so ~100 charts don't need ~100 hand-authored axis configs. Pure: page + any export share it. */

const derivedSeries = import.meta.glob<{ default: any }>('../data/derived/*.json', { eager: true });
const derivedById: Record<string, any> = {};
for (const [path, mod] of Object.entries(derivedSeries)) {
  derivedById[path.split('/').pop()!.replace('.json', '')] = (mod as any).default;
}
const pts = (id: string): [number, number][] =>
  (derivedById[id]?.points ?? []).map((p: any) => [p.t, p.value]);

/** Round up to a "nice" number that leaves a clean axis (1, 1.5, 2, 2.5, 3, 4, 5, 6, 8 ×10ⁿ). */
function niceCeil(v: number): number {
  if (v <= 0) return 1;
  const base = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * base >= v - 1e-9) return m * base;
  return 10 * base;
}
const round = (v: number) => Math.round(v * 1000) / 1000;

/** A "nice" tick step (1, 2, 2.5, 5 ×10ⁿ) giving ~`target` round intervals up to max. */
function niceStep(max: number, target = 5): number {
  if (max <= 0) return 1;
  const raw = max / target, mag = 10 ** Math.floor(Math.log10(raw)), n = raw / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
}

/** Auto axes from one or more series: 0-based y to round ticks (5k, 10k — never 11.3k), nice x-ticks.
    The top tick must sit at or ABOVE the data max, or the line overflows the plot (smoking peaked at
    34.3 with a top tick of 30, drawing over the title) — so round the ceiling UP to a whole step. */
function axes(datas: [number, number][][]) {
  const all = datas.flat();
  const ys = all.map((p) => p[1]), xs = all.map((p) => p[0]);
  const maxY = Math.max(...ys), minY = Math.min(...ys);
  // Step sized over the full span so a series that dips below zero (temperature anomaly) gets a
  // floor tick below its minimum — otherwise the line drew past the 0-baseline into the x labels.
  const yStep = niceStep(Math.max(maxY, 0) - Math.min(minY, 0));
  const ymax = Math.max(yStep, Math.ceil(maxY / yStep) * yStep);
  const ymin = minY < 0 ? Math.floor(minY / yStep) * yStep : 0;
  const yTicks: number[] = [];
  for (let t = ymin; t <= ymax + 1e-9; t += yStep) yTicks.push(round(t));
  const x0 = Math.min(...xs), x1 = Math.max(...xs), span = x1 - x0;
  const step = span > 400 ? 100 : span > 150 ? 50 : span > 60 ? 20 : span > 25 ? 10 : span > 10 ? 5 : 2;
  const xTicks: number[] = [];
  for (let y = Math.ceil(x0 / step) * step; y <= x1; y += step) xTicks.push(y);
  return { ymin, ymax, yTicks, xTicks, x0, x1 };
}

const tempCol = (t: string) => (t === 'cool' ? 'var(--hope)' : 'var(--despair)');

const pctSuffix = (unit: string) => (unit.trim().startsWith('%') ? '%' : '');
const span = (data: [number, number][]) => `${data[0][0]} — ${data[data.length - 1][0]}`;

/** One full-axed line chart from a derived series ref, axes auto-computed. */
function oneLine(ref: string, color: string, opts: { x0?: number; x1?: number } = {}) {
  let data = pts(ref);
  if (opts.x0 != null) data = data.filter((p) => p[0] >= opts.x0!);
  if (opts.x1 != null) data = data.filter((p) => p[0] <= opts.x1!);
  if (!data.length) return null;
  const ax = axes([data]);
  const unit = derivedById[ref]?.unit ?? '';
  const prov = derivedById[ref]?.provenance ?? null;
  const r = fullChart({ id: ref, series: [{ name: '', color: COL[color] ?? color, data }], ...ax, valueSuffix: pctSuffix(unit) });
  return { ...r, prov, unit, dataRef: ref, span: span(data), linkOnly: /link-only|by-nc/i.test(prov?.license ?? '') };
}

/** A multi-line regional divergence chart from several derived refs (each line's end value labelled). */
export function multiLine(refs: { ref: string; name: string; color: string }[]) {
  const series = refs.map((r) => ({ name: r.name, color: COL[r.color] ?? r.color, data: pts(r.ref) }))
    .filter((s) => s.data.length);
  if (!series.length) return null;
  const ax = axes(series.map((s) => s.data));
  const unit = derivedById[refs[0].ref]?.unit ?? '';
  const r = fullChart({ id: 'reg', series, ...ax, valueSuffix: pctSuffix(unit) });
  const years = series.flatMap((s) => s.data.map((p) => p[0]));
  const prov = derivedById[refs[0].ref]?.provenance ?? null;
  return { ...r, refs: refs.map((x) => x.ref), dataRef: refs[0].ref, prov, unit, isRegional: true,
    linkOnly: /link-only|by-nc/i.test(prov?.license ?? ''), span: `${Math.min(...years)} — ${Math.max(...years)}` };
}

/** A country cross-section: a ranked horizontal bar strip from a committed bars artifact (kind:'bars').
    The third lens below global + regional — named, recognizable countries make the abstraction concrete,
    where a regional average launders the spread away. Honest snapshot (latest survey), never a trend. */
export function countryBars(ref: string) {
  const art = derivedById[ref];
  if (!art || art.kind !== 'bars') return null;
  const r = barChart({ ...art, bars: art.bars.map((b: any) => ({ ...b, color: COL[b.color] ?? b.color })) });
  const prov = art.provenance ?? null;
  return { ...r, prov, unit: art.unit, dataRef: ref, isCountry: true, span: art.yearSpan ?? '',
    linkOnly: /link-only|by-nc/i.test(prov?.license ?? '') };
}

/** The four-magnification hero: one carrying series windowed into the authored spans, each a spark. */
function hero(ref: string, windows: any[]) {
  const data = pts(ref);
  if (!data.length || !windows?.length) return null;
  return windows.map((w: any, i: number) => {
    const wd = windowSeries(data, w.from, w.to);
    const r = miniLine({ data: wd, color: tempCol(w.temp), width: 300, height: 56, area: true, baseline: true, id: 'kh' + i });
    return { ...w, ...r, col: tempCol(w.temp) };
  });
}

/** A small-multiple signal grid: each ref a sparkline with its latest value + direction. */
function signals(sigs: any[]) {
  return (sigs ?? []).map((s: any, i: number) => {
    const data = pts(s.ref);
    if (!data.length) return null;
    const up = data[data.length - 1][1] > data[0][1];
    const good = up ? !s.badUp : s.badUp;
    const col = good ? 'var(--hope)' : 'var(--despair)';
    const v = data[data.length - 1][1];
    const value = Math.abs(v) >= 1000 ? (v / 1000).toFixed(0) + 'k' : v % 1 === 0 ? v.toFixed(0) : v.toFixed(1);
    const r = miniLine({ data, color: col, width: 300, height: 46, area: true, id: 'ks' + i });
    return { name: s.name, unit: s.unit, value, up, good, col, ...r };
  }).filter(Boolean);
}

/** Build every dimension's mini-suite for the keystone page. Each chart carries its provenance,
    chartId (dataRef) and label, so the page can render the download/source footer and the SVG
    endpoint can pre-bake the image — same lineage discipline as the movement figures. */
export function buildDimensions(dims: any[]) {
  const mk = (spec: any, defColor: string) => {
    if (!spec) return null;
    const c = oneLine(spec.ref, spec.color ?? defColor, spec);
    return c ? { ...c, label: spec.label, note: spec.note } : null;
  };
  return (dims ?? []).map((d: any) => {
    const reg = d.regional ? multiLine(d.regional.refs) : null;
    const ctry = d.countries ? countryBars(d.countries.ref) : null;
    const ctrend = d.countryTrend ? multiLine(d.countryTrend.refs) : null;
    return {
      ...d,
      carryingChart: mk(d.carrying, d.verdictTemp === 'cool' ? 'hope' : 'despair'),
      counterChart: mk(d.counter, 'despair'),
      secondaryCharts: (d.secondary ?? []).map((s: any) => mk(s, 'stone')).filter(Boolean),
      regionalChart: reg ? { ...reg, label: d.regional.label, note: d.regional.note } : null,
      countryChart: ctry ? { ...ctry, label: d.countries.label, note: d.countries.note } : null,
      countryTrendChart: ctrend ? { ...ctrend, label: d.countryTrend.label, note: d.countryTrend.note } : null,
    };
  });
}
