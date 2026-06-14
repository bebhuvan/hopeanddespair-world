import { smooth, windowSeries, type Point } from './smooth';

/* Build-time SVG renderers. Each returns { viewBox, inner } so an .astro component can emit
   static inline SVG — no client charting library. The watermark is baked into every full
   chart (survives crops/exports). Ported from the proven mockups (CHARTS.md is the spec). */

export type Rendered = { viewBox: string; inner: string; m?: Rendered };

// Monotonic per-build counter for unique element ids (clip paths). Several charts share o.id
// (every regional strip is 'reg'), so the clip-path id must not collide across SVGs in one document.
let _seq = 0;

/** Compact axis-tick label: 70000 → 70k, 2.8e12 → 2.8T. Keeps big-number charts legible. */
const fmtTick = (t: number): string => {
  const a = Math.abs(t);
  const u = (v: number, s: string) => (Math.round(v * 10) % 10 === 0 ? v.toFixed(0) : v.toFixed(1)) + s;
  if (a >= 1e12) return u(t / 1e12, 'T');
  if (a >= 1e9) return u(t / 1e9, 'B');
  if (a >= 1e6) return u(t / 1e6, 'M');
  if (a >= 1e3) return u(t / 1e3, 'k');
  return String(t);
};

/** Escape author-supplied text (series names, annotation labels) for SVG text nodes. */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
  const d = smooth(pts, 1), last = pts[pts.length - 1];
  let inner = '';
  if (opts.baseline) inner += `<line x1="0" y1="${H - 2}" x2="${W}" y2="${H - 2}" stroke="var(--rule)" stroke-width="1"/>`;
  if (opts.area) {
    const a = `${d} L ${X(x1).toFixed(1)} ${H} L ${X(x0).toFixed(1)} ${H} Z`;
    inner += `<path d="${a}" fill="color-mix(in srgb, ${opts.color} 9%, transparent)"/>`;
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

export type Series = { name: string; color: string; data: Point[]; dashed?: boolean };
export interface FullChartSpec {
  id: string; series: Series[]; ymax: number; yTicks: number[]; xTicks: number[];
  ymin?: number;          // floor of the y-scale; < 0 for series that go below zero (e.g. temperature anomaly)
  x0?: number; x1?: number;
  annot?: { x: number; label: string };
  // Tufte-style annotations. No `y` → a dashed era line marking a period boundary. With `y` → a
  // callout: a dot placed on the line at (x, y) with the event named beside it, so the chart
  // explains itself. `y` must be a real value on the series.
  annots?: { x: number; label: string; y?: number }[];
  // Horizontal threshold rules (replacement fertility 2.1, the natural sex ratio 105, a zero
  // balance line): a faint dashed rule across the plot, labelled at the LEFT edge so it never
  // collides with the right-edge series labels.
  refLines?: { y: number; label: string }[];
  valueSuffix?: string;   // appended to end-of-line value labels (e.g. "%")
}

/** Portrait mobile variant of fullChart. A phone can't read a 920-wide chart scaled to ~360px —
    the plot becomes a 220px strip and multi-line end-labels crush together. This re-lays the same
    data tall: a near-1:1 viewBox (so baked font sizes render at real px), a wrapped legend on TOP
    instead of crammed right-edge labels, fewer x-ticks, thicker lines. Page-only (the downloadable
    SVG uses the desktop render), so it leans on the page's chart CSS for colour and bakes its sizes. */
export function fullChartMobile(o: FullChartSpec): Rendered {
  const multi = o.series.length > 1;
  const W = 390;
  const fmtV = (v: number) => (Math.abs(v) >= 1000 ? fmtTick(v) : v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + (o.valueSuffix ?? '');
  // Legend (multi-series): a swatch + "Name value" per line, packed into rows that fit the width.
  // The NAME rides in the display grotesk and the VALUE in mono (the editorial-data mix, per
  // DESIGN.md), so the legend reads as a publication, not a spreadsheet.
  const named = o.series.filter((s) => s.name);
  const SW = 16, PAD = 7, ROWGAP = 16, rowH = 23;   // swatch, swatch-pad, item gap
  const items = named.map((s) => {
    const val = fmtV(s.data[s.data.length - 1][1]);
    // display name ≈ 8.3px/char @15px (proportional, estimated generously), mono value ≈ 9px/char
    return { s, name: s.name, val, w: SW + PAD + s.name.length * 8.3 + 6 + val.length * 9 };
  });
  const rows: (typeof items)[] = [];
  let cur: typeof items = [], curW = 0;
  for (const it of items) {
    if (cur.length && curW + it.w > W - 4) { rows.push(cur); cur = []; curW = 0; }
    cur.push(it); curW += it.w + ROWGAP;
  }
  if (cur.length) rows.push(cur);
  const legendH = multi ? rows.length * rowH + 4 : 0;
  // left margin widens to fit the widest y-tick label — "12.5k"/"12.5M" overflow a fixed 38u gutter
  const maxYw = Math.max(2, ...o.yTicks.map((t) => fmtTick(t).length));
  // top margin clears the topmost y-tick label (≥16) and the legend band when there is one
  const m = { l: Math.max(38, Math.round(maxYw * 8.6) + 10), r: 16, t: Math.max(legendH + 10, 16), b: 34 };
  const PLOT_H = 300;
  const H = m.t + PLOT_H + m.b;
  const xsAll = ([] as number[]).concat(...o.series.map((s) => s.data.map((p) => p[0])));
  const x0 = o.x0 ?? Math.min(...xsAll), x1 = o.x1 ?? Math.max(...xsAll), ymax = o.ymax, ymin = o.ymin ?? 0;
  const X = (v: number) => m.l + ((v - x0) / (x1 - x0)) * (W - m.l - m.r);
  const Y = (v: number) => H - m.b - ((v - ymin) / (ymax - ymin)) * (H - m.t - m.b);
  const baseY = Y(Math.min(Math.max(0, ymin), ymax)).toFixed(1);
  const FT = 'font-size:13px', FA = 'font-size:12px';   // baked tick / annotation sizes (≈1:1 here)
  // A white halo (paint-order: stroke under fill) so any label sitting over a line or the area fill
  // stays legible — the phone plot is dense, labels can't always dodge clear of the ink behind them.
  const HALO = 'paint-order:stroke;stroke:var(--panel);stroke-width:3.4px;stroke-linejoin:round';
  let back = '', clip = '', g = '';
  // Label collision registry. Tight phone charts can't dodge labels into a wide margin like the
  // desktop does, so every text label books a bounding box; movable labels (eras, callouts, the
  // end value) then nudge to the nearest free slot instead of printing on top of an axis number,
  // a ref-line tag, or each other. Anchor: where x sits on the box (start | middle | end).
  type Anchor = 'start' | 'middle' | 'end';
  type Box = { x0: number; x1: number; t: number; b: number };
  const boxes: Box[] = [];
  const mkBox = (cx: number, y: number, w: number, fs: number, a: Anchor): Box => {
    const x0 = a === 'end' ? cx - w : a === 'middle' ? cx - w / 2 : cx;
    return { x0, x1: x0 + w, t: y - fs * 0.82, b: y + fs * 0.24 };
  };
  const hits = (bx: Box) => boxes.some((o) => bx.x0 < o.x1 - 1 && bx.x1 > o.x0 + 1 && bx.t < o.b - 1 && bx.b > o.t + 1);
  // Try the desired baseline, then step along `dirs` (e.g. [1,-1] = down first, then up) until a
  // free slot opens within [lo,hi]; book it and return the chosen y (the desired y if none is free).
  const place = (cx: number, y: number, w: number, fs: number, a: Anchor, dirs: number[], lo: number, hi: number) => {
    y = Math.min(Math.max(y, lo), hi);     // pull the desired baseline into range before searching
    const step = fs + 3;
    for (const dir of dirs) for (let k = 0; k <= 14; k++) {
      const yy = y + dir * k * step;
      if (yy < lo || yy > hi) break;
      const b = mkBox(cx, yy, w, fs, a);
      if (!hits(b)) { boxes.push(b); return yy; }
    }
    boxes.push(mkBox(cx, y, w, fs, a)); return y;
  };
  // Keep a label's box fully inside the canvas horizontally (long era/callout text would otherwise
  // shoot off the right edge when anchored at its mark). Returns the adjusted x for the given anchor.
  const clampX = (cx: number, w: number, a: Anchor) => {
    let x0 = a === 'start' ? cx : a === 'middle' ? cx - w / 2 : cx - w;
    if (x0 + w > W - 3) x0 = W - 3 - w;
    if (x0 < 3) x0 = 3;
    return a === 'start' ? x0 : a === 'middle' ? x0 + w / 2 : x0 + w;
  };
  for (const t of o.yTicks) {
    const y = Y(t), lbl = fmtTick(t);
    back += `<line class="${t === 0 ? 'grid0' : 'grid'}" x1="${m.l}" y1="${y.toFixed(1)}" x2="${W - m.r}" y2="${y.toFixed(1)}"/>`;
    back += `<text x="${m.l - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" style="${FT}">${lbl}</text>`;
    boxes.push(mkBox(m.l - 6, y + 4, lbl.length * 8.6, 13, 'end'));
  }
  // Subsample x-ticks (keep first + last + an even spread), THEN enforce a minimum pixel gap so two
  // ticks near the compressed end (2000 vs 2024 on a 1750→2024 axis) never touch. The latest year is
  // the one readers want, so when the tail crowds we keep the last tick and drop its neighbour.
  // Only ticks inside the rendered domain: a zoomed panel (x0=2024) can still list a 1950 tick,
  // which would otherwise be clamped on-screen and collide with the real first tick.
  const dom = o.xTicks.filter((t) => t >= x0 - 1e-6 && t <= x1 + 1e-6);
  const sub = dom.length <= 5 ? dom
    : dom.filter((_, i) => i === 0 || i === dom.length - 1 || i % Math.ceil(dom.length / 4) === 0);
  const MINGAP = 44, xt: number[] = [];
  for (const t of sub) if (!xt.length || X(t) - X(xt[xt.length - 1]) >= MINGAP) xt.push(t);
  const lastT = sub[sub.length - 1];
  if (xt[xt.length - 1] !== lastT) { if (X(lastT) - X(xt[xt.length - 1]) < MINGAP) xt.pop(); xt.push(lastT); }
  for (const t of xt) {
    const tw = String(t).length * 8.6, lx = clampX(X(t), tw, 'middle');   // 13px mono digit ≈ 8.6u; keep edge ticks in
    back += `<text x="${lx.toFixed(1)}" y="${(H - m.b + 20).toFixed(1)}" text-anchor="middle" style="${FT}">${t}</text>`;
    boxes.push(mkBox(lx, H - m.b + 20, tw, 13, 'middle'));
  }
  for (const rl of o.refLines ?? []) {
    if (rl.y < ymin || rl.y > ymax) continue;
    const y = Y(rl.y);
    back += `<line class="annot" x1="${m.l}" y1="${y.toFixed(1)}" x2="${W - m.r}" y2="${y.toFixed(1)}"/>`;
    back += `<text class="annotP" x="${(m.l + 5).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="start" style="${FA};${HALO}">${esc(rl.label)}</text>`;
    boxes.push(mkBox(m.l + 5, y - 5, rl.label.length * 6.4, 12, 'start'));
  }
  const uid = ++_seq;
  let areaColor = '';
  let endLabel: { cx: number; y: number; w: number; a: Anchor; color: string; txt: string } | null = null;
  for (const s of o.series) {
    const pts: Point[] = s.data.map((p) => [X(p[0]), Y(p[1])]);
    const d = smooth(pts, 1), L = pts[pts.length - 1];
    if (!multi) {
      areaColor = s.color;
      const a = `${d} L ${X(s.data[s.data.length - 1][0]).toFixed(1)} ${baseY} L ${X(s.data[0][0]).toFixed(1)} ${baseY} Z`;
      clip += `<path d="${a}" fill="url(#fillm-${uid})"/>`;
    }
    clip += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"${s.dashed ? ' stroke-dasharray="6 4"' : ''}/>`;
    g += `<circle cx="${L[0].toFixed(1)}" cy="${L[1].toFixed(1)}" r="3.6" fill="${s.color}" stroke="var(--panel)" stroke-width="1.8"/>`;
    if (!multi) {
      // The lone end value (drawn later, after the eras/callouts it must dodge).
      const a: Anchor = L[0] > W - m.r - 40 ? 'end' : 'start', txt = fmtV(s.data[s.data.length - 1][1]);
      endLabel = { cx: L[0] + (a === 'end' ? -6 : 6), y: L[1] - 9, w: txt.length * 8.4, a, color: s.color, txt };
    }
  }
  // Top legend: swatch (a short line, like the series) + name + value, row by row, inset from the edge.
  if (multi) {
    rows.forEach((row, ri) => {
      let x = 2;
      const y = 12 + ri * rowH;
      for (const it of row) {
        g += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + SW).toFixed(1)}" y2="${y.toFixed(1)}" stroke="${it.s.color}" stroke-width="3" stroke-linecap="round"${it.s.dashed ? ' stroke-dasharray="5 3"' : ''}/>`;
        g += `<text class="ser" x="${(x + SW + PAD).toFixed(1)}" y="${(y + 4.5).toFixed(1)}" text-anchor="start" style="font-size:15px;fill:${it.s.color}"><tspan class="nm">${esc(it.name)}</tspan><tspan class="vl">  ${esc(it.val)}</tspan></text>`;
        x += it.w + ROWGAP;
      }
    });
  }
  // Era lines + their labels, dodged DOWN from the plot top into free rows.
  const annAll = [...(o.annot ? [o.annot as { x: number; label: string; y?: number }] : []), ...(o.annots ?? [])];
  const eras = annAll.filter((a) => a.y == null).sort((a, b) => a.x - b.x);
  for (const a of eras) {
    const ax = X(a.x), w = a.label.length * 7.3;   // annotL is mono + 0.04em tracking → ~7.3px/char
    g += `<line class="annot" x1="${ax.toFixed(1)}" y1="${m.t}" x2="${ax.toFixed(1)}" y2="${H - m.b}"/>`;
    const flip = ax - 5 - w < m.l + 2;            // would clip the left edge → label rightward
    const anchor: Anchor = flip ? 'start' : 'end';
    const cx = clampX(flip ? ax + 5 : ax - 5, w, anchor);   // never let a long era label run off-canvas
    const y = place(cx, m.t + 12, w, 11.5, anchor, [1], m.t + 12, m.t + 12 + 5 * 16);
    g += `<text class="annotL" x="${cx.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" style="font-size:11.5px;${HALO}">${esc(a.label)}</text>`;
  }
  // The lone end value — dodged clear of the axis numbers and any era label near the end.
  if (endLabel) {
    const y = place(endLabel.cx, endLabel.y, endLabel.w, 14, endLabel.a, [-1, 1], m.t + 8, H - m.b - 2);
    g += `<text class="ser" x="${endLabel.cx.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${endLabel.a}" style="font-size:14px;fill:${endLabel.color};${HALO}">${esc(endLabel.txt)}</text>`;
  }
  // Callouts: dot on the curve, label dodged to the open side, then nudged off anything it lands on.
  // A faint leader ties the label back to its dot when the dodge pushed it away.
  for (const a of annAll.filter((a) => a.y != null)) {
    const ax = X(a.x), ay = Y(a.y!);
    const s = o.series.find((sr) => sr.data.some((p) => p[0] === a.x)) ?? o.series[0];
    const i = s ? s.data.findIndex((p) => p[0] === a.x) : -1;
    const yL = i > 0 ? s!.data[i - 1][1] : a.y!, yR = i >= 0 && i < s!.data.length - 1 ? s!.data[i + 1][1] : a.y!;
    let below = yL > a.y! && yR > a.y!;
    if (below && ay + 24 > H - m.b) below = false;
    if (!below && ay - 20 < m.t) below = true;
    const nearRight = ax > W - m.r - 50, nearLeft = ax < m.l + 50;
    const anchor: Anchor = nearRight ? 'end' : nearLeft ? 'start' : 'middle';
    const w = a.label.length * 6.4;
    const lx = clampX(nearRight ? ax - 1 : nearLeft ? ax + 1 : ax, w, anchor);   // keep it on-canvas
    const ly0 = below ? ay + 19 : ay - 11;
    const ly = place(lx, ly0, w, 12, anchor, below ? [1, -1] : [-1, 1], m.t + 8, H - m.b - 2);
    if (Math.abs(ly - ly0) > 14) g += `<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${lx.toFixed(1)}" y2="${(ly - (ly > ay ? 9 : -3)).toFixed(1)}" stroke="var(--ink-3)" stroke-width="1" opacity="0.35"/>`;
    g += `<circle class="annotDot" cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="2.8"/>`;
    g += `<text class="annotP" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" style="${FA};${HALO}">${esc(a.label)}</text>`;
  }
  // No watermark on the mobile twin: it's page-only (the page itself is branded; the downloadable
  // artifact is the desktop render, which keeps its mark), and dropping it frees the crowded foot.
  const cid = `cpm-${o.id}-${uid}`;
  const grad = areaColor
    ? `<linearGradient id="fillm-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${areaColor}" stop-opacity="0.14"/><stop offset="1" stop-color="${areaColor}" stop-opacity="0"/></linearGradient>`
    : '';
  const clipDef = `<defs>${grad}<clipPath id="${cid}"><rect x="${m.l}" y="${m.t - 3}" width="${W - m.l - m.r}" height="${PLOT_H + 6}"/></clipPath></defs>`;
  return { viewBox: `0 0 ${W} ${H}`, inner: `${clipDef}${back}<g clip-path="url(#${cid})">${clip}</g>${g}` };
}

/** Full axed chart (real axes, dotted gridlines, annotations, watermark) for the movements. */
export function fullChart(o: FullChartSpec): Rendered {
  // Right margin holds the direct series labels (multi-line charts) — sized to the longest
  // name at the real glyph width (14.5px mono ≈ 8.8px/char; the old 8px/char estimate
  // truncated short names like "Gaza" that end at the plot's right edge). Single-series
  // charts reserve room for the end-value label instead.
  // Right margin holds the direct end-labels (multi-line charts) — sized to the longest FULL label,
  // name + gap + the formatted end value at the real mono glyph width, so "Middle East & N. Africa
  // 3.0" doesn't clip off the right edge. Empty-named (suppressed) lines reserve nothing.
  const fmtLabel = (v: number) => (Math.abs(v) >= 1000 ? fmtTick(v) : v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + (o.valueSuffix ?? '');
  const maxLabel = Math.max(0, ...o.series.filter((s) => s.name).map((s) => s.name.length + 2 + fmtLabel(s.data[s.data.length - 1][1]).length));
  const W = 920, H = 466,
    m = { l: 50, r: o.series.length > 1 ? Math.min(300, Math.max(96, Math.ceil(maxLabel * 8.9) + 16)) : 64, t: 28, b: 42 };
  const xsAll = ([] as number[]).concat(...o.series.map((s) => s.data.map((p) => p[0])));
  const x0 = o.x0 ?? Math.min(...xsAll), x1 = o.x1 ?? Math.max(...xsAll), ymax = o.ymax;
  const ymin = o.ymin ?? 0;   // 0-based unless the series dips negative (temperature anomaly)
  const X = (v: number) => m.l + ((v - x0) / (x1 - x0)) * (W - m.l - m.r);
  const Y = (v: number) => H - m.b - ((v - ymin) / (ymax - ymin)) * (H - m.t - m.b);
  // Area baselines fill to zero (the reference line) when it's in view, else to the floor.
  const baseY = Y(Math.min(Math.max(0, ymin), ymax)).toFixed(1);
  // `back` = gridlines/rules (behind), `clip` = the data line+area (clipped to the plot so a value
  // beyond the axis can't paint over the prose above or the source line below — the chart draws only
  // inside its own box), `g` = dots/labels/annotations (outside the clip, free to sit at the edge).
  let back = '', clip = '', g = '';
  for (const t of o.yTicks) {
    const y = Y(t);
    back += `<line class="${t === 0 ? 'grid0' : 'grid'}" x1="${m.l}" y1="${y}" x2="${W - m.r}" y2="${y}"/>`;
    back += `<text x="${m.l - 8}" y="${y + 3.5}" text-anchor="end">${fmtTick(t)}</text>`;
  }
  for (const t of o.xTicks) back += `<text x="${X(t)}" y="${H - m.b + 18}" text-anchor="middle">${t}</text>`;
  // Horizontal threshold rules, labelled at the left (clear of the right-edge series labels).
  for (const rl of o.refLines ?? []) {
    if (rl.y < ymin || rl.y > ymax) continue;
    const y = Y(rl.y);
    back += `<line class="annot" x1="${m.l}" y1="${y.toFixed(1)}" x2="${W - m.r}" y2="${y.toFixed(1)}"/>`;
    back += `<text class="annotP" x="${(m.l + 6).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="start">${esc(rl.label)}</text>`;
  }
  const uid = ++_seq;       // one id per chart, shared by its clip-path and area gradient
  let areaColor = '';       // set when a single-series area is drawn, so we can build its gradient
  const labels: { x: number; y: number; color: string; name: string; val: number; dotX: number; dotY: number }[] = [];
  const fmtVal = (v: number) => (Math.abs(v) >= 1000 ? fmtTick(v) : v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + (o.valueSuffix ?? '');
  for (const s of o.series) {
    const pts: Point[] = s.data.map((p) => [X(p[0]), Y(p[1])]);
    const d = smooth(pts, 1), L = pts[pts.length - 1];   // 1 decimal at 920u wide is sub-pixel — invisible, lighter
    if (o.series.length === 1) {
      areaColor = s.color;
      const a = `${d} L ${X(s.data[s.data.length - 1][0]).toFixed(1)} ${baseY} L ${X(s.data[0][0]).toFixed(1)} ${baseY} Z`;
      // soft vertical fade — colour at the line, dissolving to nothing toward the baseline
      clip += `<path d="${a}" fill="url(#fill-${uid})"/>`;
    }
    clip += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"${s.dashed ? ' stroke-dasharray="6 4"' : ''}/>`;
    g += `<circle cx="${L[0].toFixed(1)}" cy="${L[1].toFixed(1)}" r="3.7" fill="${s.color}" stroke="var(--panel)" stroke-width="1.8"/>`;
    if (o.series.length === 1) {
      // The lone line's end-value label: answers "where are we now?" beside the end dot.
      g += `<text class="ser" x="${(L[0] + 9).toFixed(1)}" y="${(L[1] + 4.5).toFixed(1)}" style="fill:${s.color}">${fmtVal(s.data[s.data.length - 1][1])}</text>`;
    } else if (s.name) {
      // Multi-line: a dodged direct label per series. An EMPTY name suppresses it entirely (the
      // history half of a history+projection pair ends mid-plot and would print over the projection).
      labels.push({ x: L[0] + 8, y: L[1] + 3.5, color: s.color, name: s.name, val: s.data[s.data.length - 1][1], dotX: L[0], dotY: L[1] });
    }
  }
  // Direct labels, vertically dodged: lines that end near each other (Sudan vs Gaza; Europe vs
  // East Asia) would otherwise print on top of one another. Sweep top-down enforcing a minimum
  // gap, then push back inside the plot if the sweep ran past the bottom.
  const GAP = 19;   /* > the 14.5px label line-height, so dodged labels keep clear air between them */
  labels.sort((a, b) => a.y - b.y);
  for (let i = 1; i < labels.length; i++) labels[i].y = Math.max(labels[i].y, labels[i - 1].y + GAP);
  const floor = H - m.b;
  for (let i = labels.length - 1; i >= 0; i--) {
    const cap = i === labels.length - 1 ? floor : labels[i + 1].y - GAP;
    if (labels[i].y > cap) labels[i].y = cap;
  }
  for (const l of labels) {
    // leader line: when a label is dodged away from its line's end, a faint connector ties the two
    // together — so converging lines (Europe/Asia/Latin America near 95%) stay legible by line, not
    // just by colour. Drawn only when the label moved enough to need it.
    if (Math.abs((l.y - 3.5) - l.dotY) > 4)
      g += `<line x1="${(l.dotX + 4).toFixed(1)}" y1="${l.dotY.toFixed(1)}" x2="${(l.x - 2).toFixed(1)}" y2="${(l.y - 3.5).toFixed(1)}" stroke="${l.color}" stroke-width="1" opacity="0.4"/>`;
    g += `<text class="ser dodge" x="${l.x.toFixed(1)}" y="${l.y.toFixed(1)}" style="fill:${l.color}"><tspan class="nm">${esc(l.name)}</tspan><tspan class="vl">  ${fmtVal(l.val)}</tspan></text>`;
  }
  // Annotations last, so callout dots and labels sit on top of the lines.
  const annAll = [...(o.annot ? [o.annot as { x: number; label: string; y?: number }] : []), ...(o.annots ?? [])];
  // Era lines: their labels all sat on one baseline, so close-together eras (First/Second
  // World War) overprinted each other and clipped at the left edge. Estimate each label's
  // box, flip it to the right of its line when it would leave the plot, and drop it to a
  // second row when it would overlap the previous label.
  const eras = annAll.filter((a) => a.y == null).sort((a, b) => a.x - b.x);
  const rowEnd = [-Infinity, -Infinity];
  for (const a of eras) {
    const ax = X(a.x), w = a.label.length * 7.6;             // ~12.5px mono glyph width
    g += `<line class="annot" x1="${ax}" y1="${m.t}" x2="${ax}" y2="${H - m.b}"/>`;
    const flip = ax - 6 - w < m.l + 2;                       // would clip left → label rightward
    const xb0 = flip ? ax + 6 : ax - 6 - w;
    const row = xb0 < rowEnd[0] + 12 ? 1 : 0;
    rowEnd[row] = Math.max(rowEnd[row], xb0 + w);
    g += `<text class="annotL" x="${(flip ? ax + 6 : ax - 6).toFixed(1)}" y="${m.t + 10 + row * 16}" text-anchor="${flip ? 'start' : 'end'}">${esc(a.label)}</text>`;
  }
  // Callouts (a.y set): drop the label onto the OPEN side of the curve — below a notch, above a
  // peak — classified from the series' own neighbours, so the text never lies across the line.
  // Centre it over the dot, flipping to an inward anchor only when it would run off an edge.
  for (const a of annAll.filter((a) => a.y != null)) {
    const ax = X(a.x), ay = Y(a.y!);
    const s = o.series.find((sr) => sr.data.some((p) => p[0] === a.x)) ?? o.series[0];
    const i = s ? s.data.findIndex((p) => p[0] === a.x) : -1;
    const yL = i > 0 ? s!.data[i - 1][1] : a.y!, yR = i >= 0 && i < s!.data.length - 1 ? s!.data[i + 1][1] : a.y!;
    let below = yL > a.y! && yR > a.y!;                  // both neighbours higher → a notch (open below)
    if (below && ay + 26 > H - m.b) below = false;       // would fall off the bottom axis → flip up
    if (!below && ay - 22 < m.t) below = true;           // would rise off the top → flip down
    const ly = below ? ay + 21 : ay - 12;
    const nearRight = ax > W - m.r - 64, nearLeft = ax < m.l + 64;
    const lx = nearRight ? ax - 1 : nearLeft ? ax + 1 : ax;
    g += `<circle class="annotDot" cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="2.8"/>`;
    g += `<text class="annotP" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${nearRight ? 'end' : nearLeft ? 'start' : 'middle'}">${esc(a.label)}</text>`;
  }
  g += wm(W, H);
  // Plot clip: the data line+area is confined to the plot rect (a small bleed so a line exactly at
  // an axis edge isn't shaved), while gridlines, dots, labels and annotations sit outside it.
  const cid = `cp-${o.id}-${uid}`;
  const grad = areaColor
    ? `<linearGradient id="fill-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${areaColor}" stop-opacity="0.14"/><stop offset="1" stop-color="${areaColor}" stop-opacity="0"/></linearGradient>`
    : '';
  const clipDef = `<defs>${grad}<clipPath id="${cid}"><rect x="${m.l}" y="${m.t - 3}" width="${W - m.l - m.r}" height="${H - m.t - m.b + 6}"/></clipPath></defs>`;
  return { viewBox: `0 0 ${W} ${H}`, inner: `${clipDef}${back}<g clip-path="url(#${cid})">${clip}</g>${g}`, m: fullChartMobile(o) };
}

/* Literal token values (mirrors tokens.css) — the downloadable SVG lives outside the page,
   where CSS custom properties don't exist. */
const TOKENS: Record<string, string> = {
  '--panel': '#FFFFFF', '--bg': '#FFFFFF',
  '--line': 'rgba(20,19,15,0.11)', '--line-2': 'rgba(20,19,15,0.20)', '--rule': 'rgba(20,19,15,0.11)',
  '--hope': '#0F7A52', '--despair': '#C0492B', '--uncertain': '#5A55E6', '--ochre': '#C7901A', '--stone': '#6E7E92',
  '--ink': '#14130F', '--ink-2': '#2B2823', '--ink-3': '#7C7A72',
};

/** Wrap a rendered chart as a self-contained downloadable SVG: vars resolved to literals,
    the page's chart styles embedded, a white ground so viewers don't show transparency. */
export function standaloneSvg(r: Rendered, title: string): string {
  const inner = r.inner.replace(/var\((--[a-z0-9-]+)\)/g, (mm, name: string) => TOKENS[name] ?? mm);
  const style = [
    'text{font:14px ui-monospace,SFMono-Regular,Menlo,monospace;fill:#7C7A72}',
    'text.ser{font-size:14.5px;font-weight:500}',
    'text.ser tspan.nm{font-family:ui-sans-serif,system-ui,sans-serif;font-weight:560}',
    'text.ser tspan.vl{font-weight:650}',
    '.grid{stroke:rgba(20,19,15,0.05)}',
    '.grid0{stroke:rgba(20,19,15,0.13)}',
    '.annot{stroke:rgba(20,19,15,0.20);stroke-dasharray:2 5;stroke-width:1}',
    'text.annotL{fill:#C0492B;font-size:12.5px;letter-spacing:0.04em}',
    '.annotDot{fill:#2B2823;stroke:#fff;stroke-width:1.3}',
    'text.annotP{font:italic 13.5px Georgia,serif;fill:#2B2823}',
    'text.wm{fill:#7C7A72;opacity:0.22;font-size:9.5px;letter-spacing:0.08em}',
    'path[fill="none"]{stroke-width:2.4px}',
  ].join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r.viewBox}"><title>${esc(title)}</title><style>${style}</style><rect width="100%" height="100%" fill="#fff"/>${inner}</svg>`;
}
