import type { Rendered } from './charts';

/* The cross-section bar — a NEW chart job (CHARTS.md): a ranked horizontal bar for measures that
   are a snapshot across categories (countries/regions) rather than a series over time. MPI and Gini
   are one or two survey points per country, so a trend line would lie; a ranking tells the truth.
   Build-time inline SVG, no client JS — same contract as charts.ts (returns { viewBox, inner }).
   Colours are passed as literal hex (from article-charts' COL) so the page and the standalone SVG
   render identically. */

export interface Bar { label: string; value: number; color: string; note?: string }
export interface BarSpec {
  bars: Bar[];              // pre-sorted; drawn top → bottom in the given order
  xmax: number;
  xTicks: number[];
  xLabel?: string;
  fmt?: (v: number) => string;   // value-label formatter (default: one decimal)
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const wm = (W: number, H: number) => `<text x="${W - 2}" y="${H - 3}" text-anchor="end" class="wm">hopeanddespair.world</text>`;

export function barChart(o: BarSpec): Rendered {
  const fmt = o.fmt ?? ((v: number) => v.toFixed(1));
  const n = o.bars.length;
  const rowH = 30, barH = 17;
  const W = 920, m = { l: 196, r: 64, t: 14, b: 42 };
  const H = m.t + m.b + n * rowH;
  const x0 = m.l, x1 = W - m.r;
  const X = (v: number) => x0 + (Math.max(0, v) / o.xmax) * (x1 - x0);

  let g = '';
  // vertical gridlines + x-axis tick labels
  for (const t of o.xTicks) {
    const x = X(t);
    g += `<line class="${t === 0 ? 'grid0' : 'grid'}" x1="${x.toFixed(1)}" y1="${m.t}" x2="${x.toFixed(1)}" y2="${H - m.b}"/>`;
    g += `<text x="${x.toFixed(1)}" y="${H - m.b + 18}" text-anchor="middle">${t}</text>`;
  }
  // bars + labels
  o.bars.forEach((b, i) => {
    const cy = m.t + i * rowH + rowH / 2;
    const w = Math.max(1.5, X(b.value) - x0);
    g += `<rect x="${x0}" y="${(cy - barH / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${barH}" rx="1.5" fill="${b.color}" fill-opacity="0.86"/>`;
    // category label (left gutter, right-aligned to the axis). Classed so mobile can size it to
    // the row height without overlap (it lives in a tight 30-unit band, unlike the axis ticks).
    g += `<text class="cat" x="${(x0 - 10).toFixed(1)}" y="${(cy + 4).toFixed(1)}" text-anchor="end" fill="#2B2823">${esc(b.label)}</text>`;
    // value label (just past the bar end)
    const vl = b.note ? `${fmt(b.value)}  ${b.note}` : fmt(b.value);
    g += `<text x="${(X(b.value) + 7).toFixed(1)}" y="${(cy + 4).toFixed(1)}" fill="#7C7A72" class="ser">${esc(vl)}</text>`;
  });
  // axis title
  if (o.xLabel) g += `<text x="${((x0 + x1) / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle" class="axt" fill="#7C7A72">${esc(o.xLabel)}</text>`;
  g += wm(W, H);
  return { viewBox: `0 0 ${W} ${H}`, inner: g, m: barChartMobile(o) };
}

/** Portrait mobile variant. The desktop bar reserves a 196-unit left gutter for country names —
    scaled to a phone that gutter eats the plot and the names turn to 6px mush. Here the name sits
    ABOVE its bar at full width, the value rides the bar end, rows are taller, fonts baked legible. */
export function barChartMobile(o: BarSpec): Rendered {
  const fmt = o.fmt ?? ((v: number) => v.toFixed(1));
  const n = o.bars.length;
  const W = 390, m = { l: 4, r: 10, t: 4, b: 26 };
  const rowH = 44, barH = 15;
  const H = m.t + n * rowH + m.b;
  const x0 = m.l, x1 = W - m.r;
  const X = (v: number) => x0 + (Math.max(0, v) / o.xmax) * (x1 - x0);
  let g = '';
  // faint vertical gridlines spanning the rows + x-tick labels at the foot
  for (const t of o.xTicks) {
    const x = X(t);
    g += `<line class="${t === 0 ? 'grid0' : 'grid'}" x1="${x.toFixed(1)}" y1="${m.t}" x2="${x.toFixed(1)}" y2="${H - m.b}"/>`;
    // keep the label box on-canvas (the rightmost tick at xmax would otherwise bleed past the edge)
    const tw = String(t).length * 8, tx = Math.min(Math.max(x, 3 + tw / 2), W - 3 - tw / 2);
    g += `<text x="${tx.toFixed(1)}" y="${(H - m.b + 17).toFixed(1)}" text-anchor="middle" style="font-size:12px">${t}</text>`;
  }
  o.bars.forEach((b, i) => {
    const top = m.t + i * rowH;
    const labelY = top + 15, barY = top + 23;
    const bw = Math.max(1.5, X(b.value) - x0);
    // name above the bar, full width
    g += `<text x="${x0.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="start" fill="#2B2823" style="font-size:14px">${esc(b.label)}</text>`;
    g += `<rect x="${x0}" y="${barY.toFixed(1)}" width="${bw.toFixed(1)}" height="${barH}" rx="1.5" fill="${b.color}" fill-opacity="0.86"/>`;
    // value rides just past the bar end, or tucks inside when the bar runs to the edge
    const vl = b.note ? `${fmt(b.value)}  ${b.note}` : fmt(b.value);
    const past = X(b.value) + 6, inside = past + vl.length * 7.4 > W - m.r;
    g += `<text x="${(inside ? X(b.value) - 6 : past).toFixed(1)}" y="${(barY + barH - 3).toFixed(1)}" text-anchor="${inside ? 'end' : 'start'}" fill="${inside ? '#FFFFFF' : '#7C7A72'}" class="ser" style="font-size:13px">${esc(vl)}</text>`;
  });
  if (o.xLabel) g += `<text x="${((x0 + x1) / 2).toFixed(1)}" y="${(H - 6).toFixed(1)}" text-anchor="middle" class="axt" fill="#7C7A72" style="font-size:12px">${esc(o.xLabel)}</text>`;
  // page-only twin — no watermark (the desktop render carries it for downloads)
  return { viewBox: `0 0 ${W} ${H}`, inner: g };
}
