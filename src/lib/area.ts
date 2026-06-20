import type { Rendered } from './charts';

/* The composition over time — a 100%-stacked area (CHARTS.md "the composition" job, finally built).
   Each year's bands are normalised to sum to 100%, so the chart reads as shifting SHARE, not size:
   how a mix (creditors, instruments) re-weighted over decades. Build-time inline SVG, no client JS;
   same contract as the rest of the kit (returns { viewBox, inner, m }). Fully inline-styled so it
   renders identically on the page and as a standalone artifact. Used sparingly — stacks can mislead,
   so the bands are few, ordered, and directly labelled at the right edge. */

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FONT = "font-family:'Geist','Inter',system-ui,sans-serif";
const MUT = '#7C7A72';

export interface AreaBand { name: string; color: string; data: [number, number][] }
export interface AreaSpec {
  bands: AreaBand[];           // drawn bottom → top in the given order; colours are literal hex
  xTicks: number[];
  x0?: number; x1?: number;
  // Absolute mode: stack the raw values (a count/total over time) instead of normalising each
  // year to 100%. Needs ymax + yTicks (in the raw unit); gridline labels drop the "%".
  absolute?: boolean; ymax?: number; yTicks?: number[];
}

function render(o: AreaSpec, W: number, H: number, m: { l: number; r: number; t: number; b: number }, fs: number): string {
  // common, sorted year axis from the first band (the analysis script aligns every band to it)
  const years = o.bands[0].data.map((d) => d[0]).sort((a, b) => a - b);
  const x0 = o.x0 ?? years[0], x1 = o.x1 ?? years[years.length - 1];
  const val = (b: AreaBand, t: number) => (b.data.find((d) => d[0] === t)?.[1] ?? 0);
  const X = (t: number) => m.l + ((t - x0) / (x1 - x0)) * (W - m.l - m.r);
  const MAXY = o.absolute ? (o.ymax ?? 100) : 100;
  const Y = (p: number) => (H - m.b) - (p / MAXY) * (H - m.t - m.b);

  // per-year totals (for share mode) and the stacked unit value of a band (raw if absolute)
  const totals: Record<number, number> = {};
  for (const t of years) totals[t] = o.bands.reduce((s, b) => s + val(b, t), 0) || 1;
  const stk = (b: AreaBand, t: number) => (o.absolute ? val(b, t) : (val(b, t) / totals[t]) * 100);

  let g = '';
  // gridlines + labels — raw ticks in absolute mode, 0–100% otherwise
  const ticks = o.absolute ? (o.yTicks ?? [0, MAXY]) : [0, 25, 50, 75, 100];
  for (const p of ticks) {
    const y = Y(p);
    g += `<line x1="${m.l}" y1="${y.toFixed(1)}" x2="${W - m.r}" y2="${y.toFixed(1)}" stroke="rgba(20,19,15,0.08)" stroke-width="1"/>`;
    g += `<text x="${m.l - 7}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" style="${FONT};font-size:${fs - 1}px;fill:${MUT}">${o.absolute ? p : p + '%'}</text>`;
  }
  // year ticks
  for (const t of o.xTicks) g += `<text x="${X(t).toFixed(1)}" y="${(H - m.b + 16).toFixed(1)}" text-anchor="middle" style="${FONT};font-size:${fs - 1}px;fill:${MUT}">${t}</text>`;

  // draw bottom → top; each band fills between its running bottom and top edge
  const cum: Record<number, number> = {};
  for (const t of years) cum[t] = 0;
  for (const b of o.bands) {
    const tops: [number, number][] = [], bots: [number, number][] = [];
    for (const t of years) {
      const bot = cum[t];
      const top = bot + stk(b, t);
      bots.push([t, bot]); tops.push([t, top]);
      cum[t] = top;
    }
    let d = `M ${X(tops[0][0]).toFixed(1)} ${Y(tops[0][1]).toFixed(1)}`;
    for (let i = 1; i < tops.length; i++) d += ` L ${X(tops[i][0]).toFixed(1)} ${Y(tops[i][1]).toFixed(1)}`;
    for (let i = bots.length - 1; i >= 0; i--) d += ` L ${X(bots[i][0]).toFixed(1)} ${Y(bots[i][1]).toFixed(1)}`;
    d += ' Z';
    g += `<path d="${d}" fill="${b.color}" fill-opacity="0.74" stroke="#FBFCFE" stroke-width="0.8"/>`;
  }

  // right-edge direct labels at each band's mid-height in the final year
  let acc = 0;
  const labelFloor = o.absolute ? MAXY * 0.04 : 4;
  for (const b of o.bands) {
    const v = stk(b, x1);
    const mid = acc + v / 2; acc += v;
    if (v < labelFloor) continue; // skip slivers
    const y = Y(mid);
    g += `<text x="${(W - m.r + 6).toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="start" style="${FONT};font-size:${fs}px;fill:${b.color};font-weight:500">${esc(b.name)}</text>`;
  }
  g += `<text x="${W - 2}" y="${H - 3}" text-anchor="end" class="wm" style="${FONT};font-size:10px;fill:rgba(124,122,114,0.6)">hopeanddespair.world</text>`;
  return g;
}

export function stackedArea(o: AreaSpec): Rendered {
  const W = 920, H = 460, m = { l: 44, r: 132, t: 18, b: 44 };
  const inner = render(o, W, H, m, 14);
  const mob = (): Rendered => {
    const Wm = 390, Hm = 360, mm = { l: 34, r: 96, t: 14, b: 38 };
    return { viewBox: `0 0 ${Wm} ${Hm}`, inner: render(o, Wm, Hm, mm, 12) };
  };
  return { viewBox: `0 0 ${W} ${H}`, inner, m: mob() };
}
