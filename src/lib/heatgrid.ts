import type { Rendered } from './charts';

/* The divergence grid — a NEW chart job (CHARTS.md): a small-multiples heat grid that reads one
   region per column and one measure per row, each cell shaded by where that region stands TODAY on
   that measure. Shading is per-row min–max (worst region red → best region green), independently
   scaled — NO cross-measure compositing, so the colour never claims that a year of life and a point
   of poverty are commensurable. It exists to make a single fact undeniable at a glance: read down a
   column and a region's whole story appears; one column is dark all the way down. Build-time inline
   SVG, no client JS — same contract as bars.ts (returns { viewBox, inner, m }).

   Cell text colour MUST be set via inline `style` (fill:), not the `fill` attribute: Chart.astro's
   stylesheet sets `.chart text { fill: var(--ink-3) }`, and a CSS property beats a presentation
   attribute — so a `fill="#fff"` on dark cells would be silently overridden to muted grey. */

export interface HeatCell { col: string; value: number; year: number; t: number; display: string }
export interface HeatRow { label: string; short: string; unit: string; cells: HeatCell[] }
export interface HeatCol { key: string; label: string; short: string }
export interface HeatSpec { cols: HeatCol[]; rows: HeatRow[] }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Diverging ramp: 0 = worst (despair red) → 0.5 = warm paper → 1 = best (hope green). Mirrors the
// temperature tokens so the grid reads as the page's own good/bad axis, not a generic rainbow.
const RED = [192, 73, 43], MID = [237, 232, 223], GRN = [15, 122, 82];
function cellColors(t: number): { fill: string; text: string } {
  const u = Math.max(0, Math.min(1, t));
  const lerp = (a: number[], b: number[], k: number) => a.map((x, i) => x + (b[i] - x) * k);
  const c = u <= 0.5 ? lerp(RED, MID, u / 0.5) : lerp(MID, GRN, (u - 0.5) / 0.5);
  const L = (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255;
  return { fill: `rgb(${c.map(Math.round).join(',')})`, text: L < 0.58 ? '#FFFFFF' : '#2B2823' };
}

export function heatGrid(o: HeatSpec): Rendered {
  const cols = o.cols, rows = o.rows, nc = cols.length, nr = rows.length;
  const W = 920, L = 198, R = 16, T = 56, B = 30, rowH = 42;
  const plotW = W - L - R, colW = plotW / nc;
  const H = T + nr * rowH + B;
  const cellOf = (r: HeatRow, key: string) => r.cells.find((c) => c.col === key);

  let g = '';
  // income-ordering cue + column headers
  g += `<text x="${L}" y="${T - 34}" text-anchor="start" style="fill:#9A978D;font-size:10.5px">← lower income per person</text>`;
  g += `<text x="${W - R}" y="${T - 34}" text-anchor="end" style="fill:#9A978D;font-size:10.5px">higher income per person →</text>`;
  cols.forEach((c, i) => {
    const x = L + i * colW + colW / 2;
    g += `<text x="${x.toFixed(1)}" y="${T - 14}" text-anchor="middle" style="fill:#6E7E92;font-size:13px;font-weight:600">${esc(c.short)}</text>`;
  });
  // rows
  rows.forEach((r, j) => {
    const yTop = T + j * rowH, cy = yTop + rowH / 2;
    g += `<text x="${(L - 12).toFixed(1)}" y="${(cy - 1).toFixed(1)}" text-anchor="end" style="fill:#2B2823;font-size:14px">${esc(r.label)}</text>`;
    g += `<text x="${(L - 12).toFixed(1)}" y="${(cy + 13).toFixed(1)}" text-anchor="end" style="fill:#9A978D;font-size:10.5px">${esc(r.unit)}</text>`;
    cols.forEach((c, i) => {
      const cell = cellOf(r, c.key);
      if (!cell) return;
      const x = L + i * colW;
      const { fill, text } = cellColors(cell.t);
      g += `<rect x="${(x + 2).toFixed(1)}" y="${(yTop + 3).toFixed(1)}" width="${(colW - 4).toFixed(1)}" height="${rowH - 6}" rx="2.5" fill="${fill}"/>`;
      g += `<text x="${(x + colW / 2).toFixed(1)}" y="${(cy + 4).toFixed(1)}" text-anchor="middle" style="fill:${text};font-size:13.5px;font-weight:600">${esc(cell.display)}</text>`;
    });
  });
  // one-line legend (bottom-left) — restates the per-row shading for the standalone SVG
  g += `<text x="${L - 12}" y="${(H - 9).toFixed(1)}" text-anchor="end" style="fill:#9A978D;font-size:10.5px">each row shaded on its own scale ·</text>`;
  g += `<rect x="${L}" y="${(H - 19).toFixed(1)}" width="13" height="11" rx="1.5" fill="${cellColors(0).fill}"/>`;
  g += `<text x="${L + 17}" y="${(H - 10).toFixed(1)}" style="fill:#9A978D;font-size:10.5px">worst region</text>`;
  g += `<rect x="${L + 96}" y="${(H - 19).toFixed(1)}" width="13" height="11" rx="1.5" fill="${cellColors(1).fill}"/>`;
  g += `<text x="${L + 113}" y="${(H - 10).toFixed(1)}" style="fill:#9A978D;font-size:10.5px">best region</text>`;
  g += `<text x="${W - 2}" y="${H - 3}" text-anchor="end" class="wm">hopeanddespair.world</text>`;
  return { viewBox: `0 0 ${W} ${H}`, inner: g, m: heatGridMobile(o) };
}

/** Portrait mobile twin — same grid, tighter gutters, short row labels, baked-legible fonts. */
function heatGridMobile(o: HeatSpec): Rendered {
  const cols = o.cols, rows = o.rows, nc = cols.length, nr = rows.length;
  const W = 390, L = 72, R = 6, T = 40, B = 8, rowH = 33;
  const plotW = W - L - R, colW = plotW / nc;
  const H = T + nr * rowH + B;
  const cellOf = (r: HeatRow, key: string) => r.cells.find((c) => c.col === key);

  let g = '';
  g += `<text x="${L}" y="${T - 24}" text-anchor="start" style="fill:#9A978D;font-size:8px">← poorer</text>`;
  g += `<text x="${W - R}" y="${T - 24}" text-anchor="end" style="fill:#9A978D;font-size:8px">richer →</text>`;
  cols.forEach((c, i) => {
    const x = L + i * colW + colW / 2;
    g += `<text x="${x.toFixed(1)}" y="${T - 11}" text-anchor="middle" style="fill:#6E7E92;font-size:9px;font-weight:600">${esc(c.short)}</text>`;
  });
  rows.forEach((r, j) => {
    const yTop = T + j * rowH, cy = yTop + rowH / 2;
    g += `<text x="2" y="${(cy + 3.5).toFixed(1)}" text-anchor="start" style="fill:#2B2823;font-size:10px">${esc(r.short)}</text>`;
    cols.forEach((c, i) => {
      const cell = cellOf(r, c.key);
      if (!cell) return;
      const x = L + i * colW;
      const { fill, text } = cellColors(cell.t);
      g += `<rect x="${(x + 1).toFixed(1)}" y="${(yTop + 2.5).toFixed(1)}" width="${(colW - 2).toFixed(1)}" height="${rowH - 5}" rx="2" fill="${fill}"/>`;
      g += `<text x="${(x + colW / 2).toFixed(1)}" y="${(cy + 3.5).toFixed(1)}" text-anchor="middle" style="fill:${text};font-size:9.5px;font-weight:600">${esc(cell.display)}</text>`;
    });
  });
  return { viewBox: `0 0 ${W} ${H}`, inner: g };
}
