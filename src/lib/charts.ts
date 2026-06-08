import { smooth, windowSeries, type Point } from './smooth';

/* Build-time SVG renderers. Each returns { viewBox, inner } so an .astro component can emit
   static inline SVG — no client charting library. The watermark is baked into every full
   chart (survives crops/exports). Ported from the proven mockups (CHARTS.md is the spec). */

export type Rendered = { viewBox: string; inner: string };
const wm = (W: number, H: number) =>
  `<text x="${W - 2}" y="${H - 3}" text-anchor="end" class="wm">hopeanddespair.world</text>`;

/** Small line (the lens window charts + the signal small-multiples). Area is optional. */
export function miniLine(opts: {
  data: Point[]; color: string; width?: number; height?: number; area?: boolean; baseline?: boolean; id?: string;
}): Rendered {
  const W = opts.width ?? 300, H = opts.height ?? 60, pad = 5, id = opts.id ?? 'm';
  const xs = opts.data.map((p) => p[0]), ys = opts.data.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y1 = Math.max(...ys) * 1.1, y0 = Math.min(...ys) * 0.9;
  const X = (v: number) => (x1 === x0 ? W / 2 : pad + ((v - x0) / (x1 - x0)) * (W - 2 * pad));
  const Y = (v: number) => (y1 === y0 ? H / 2 : H - pad - ((v - y0) / (y1 - y0)) * (H - 2 * pad));
  const pts: Point[] = opts.data.map((p) => [X(p[0]), Y(p[1])]);
  const d = smooth(pts), last = pts[pts.length - 1];
  let inner = '';
  if (opts.baseline) inner += `<line x1="0" y1="${H - 2}" x2="${W}" y2="${H - 2}" stroke="var(--rule)" stroke-width="1"/>`;
  if (opts.area) {
    const a = `${d} L ${X(x1).toFixed(1)} ${H} L ${X(x0).toFixed(1)} ${H} Z`;
    inner += `<defs><linearGradient id="g${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${opts.color}" stop-opacity="0.26"/><stop offset="1" stop-color="${opts.color}" stop-opacity="0"/></linearGradient></defs><path d="${a}" fill="url(#g${id})"/>`;
  }
  inner += `<path d="${d}" fill="none" stroke="${opts.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;
  inner += `<circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3.2" fill="${opts.color}" stroke="var(--bg)" stroke-width="1.4"/>`;
  return { viewBox: `0 0 ${W} ${H}`, inner };
}

/** Direction read for a signal over a window: does it improve or worsen? */
export function signalRead(series: Point[], from: number, to: number, badUp: boolean) {
  const data = windowSeries(series, from, to);
  const up = data[data.length - 1][1] > data[0][1];
  const good = up ? !badUp : badUp;
  const v = data[data.length - 1][1];
  const value = v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v % 1 === 0 ? v.toFixed(0) : v.toFixed(1);
  return { data, up, good, value };
}

export type Series = { name: string; color: string; data: Point[] };
export interface FullChartSpec {
  id: string; series: Series[]; ymax: number; yTicks: number[]; xTicks: number[];
  x0?: number; x1?: number; annot?: { x: number; label: string };
}

/** Full axed chart (real axes, dotted gridlines, annotations, watermark) for the movements. */
export function fullChart(o: FullChartSpec): Rendered {
  const W = 760, H = 410, m = { l: 50, r: o.series.length > 1 ? 78 : 24, t: 24, b: 38 };
  const xsAll = ([] as number[]).concat(...o.series.map((s) => s.data.map((p) => p[0])));
  const x0 = o.x0 ?? Math.min(...xsAll), x1 = o.x1 ?? Math.max(...xsAll), ymax = o.ymax;
  const X = (v: number) => m.l + ((v - x0) / (x1 - x0)) * (W - m.l - m.r);
  const Y = (v: number) => H - m.b - (v / ymax) * (H - m.t - m.b);
  let g = '';
  for (const t of o.yTicks) {
    const y = Y(t);
    g += `<line class="${t === 0 ? 'grid0' : 'grid'}" x1="${m.l}" y1="${y}" x2="${W - m.r}" y2="${y}"/>`;
    g += `<text x="${m.l - 8}" y="${y + 3.5}" text-anchor="end">${t}</text>`;
  }
  for (const t of o.xTicks) g += `<text x="${X(t)}" y="${H - m.b + 18}" text-anchor="middle">${t}</text>`;
  if (o.annot) {
    const x = X(o.annot.x);
    g += `<line class="annot" x1="${x}" y1="${m.t}" x2="${x}" y2="${H - m.b}"/>`;
    g += `<text class="annotL" x="${x - 6}" y="${m.t + 9}" text-anchor="end">${o.annot.label}</text>`;
  }
  for (const s of o.series) {
    const pts: Point[] = s.data.map((p) => [X(p[0]), Y(p[1])]);
    const d = smooth(pts), L = pts[pts.length - 1];
    if (o.series.length === 1) {
      const a = `${d} L ${X(s.data[s.data.length - 1][0]).toFixed(1)} ${H - m.b} L ${X(s.data[0][0]).toFixed(1)} ${H - m.b} Z`;
      g += `<defs><linearGradient id="fcg${o.id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity="0.24"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient></defs><path d="${a}" fill="url(#fcg${o.id})"/>`;
    }
    g += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>`;
    g += `<circle cx="${L[0].toFixed(1)}" cy="${L[1].toFixed(1)}" r="3.7" fill="${s.color}" stroke="var(--panel)" stroke-width="1.8"/>`;
    if (o.series.length > 1) g += `<text class="ser" x="${(L[0] + 8).toFixed(1)}" y="${(L[1] + 3.5).toFixed(1)}" fill="${s.color}">${s.name}</text>`;
  }
  g += wm(W, H);
  return { viewBox: `0 0 ${W} ${H}`, inner: g };
}
