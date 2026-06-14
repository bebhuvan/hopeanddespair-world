import type { Rendered } from './charts';

/* The convergence scatter — a NEW chart job (CHARTS.md): growth-vs-initial-level with population
   bubbles and weighted/unweighted fit lines (the Goldman Exhibit-3/4 signature, on open data).
   A downward fit = poorer economies grew faster = convergence. Two lines because the whole story
   is that the WEIGHTED (people) and UNWEIGHTED (countries) fits disagree. Build-time inline SVG,
   no client JS — same contract as charts.ts (returns { viewBox, inner }). */

export interface ScatterPoint { x: number; y: number; pop: number; region: string; label?: string }
export interface Fit { slope: number; intercept: number }   // y = intercept + slope·ln(x)
export interface ScatterSpec {
  points: ScatterPoint[];
  fits: { weighted: Fit; unweighted: Fit };
  xTicks: number[];                 // initial GDP/cap in $ (log-spaced)
  yTicks: number[];                 // growth %/yr (may be negative)
  regionColors: Record<string, string>;
  xLabel?: string; yLabel?: string;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmtUsd = (t: number) => (t >= 1000 ? `$${Math.round(t / 1000)}k` : `$${t}`);
const wm = (W: number, H: number) => `<text x="${W - 2}" y="${H - 3}" text-anchor="end" class="wm">hopeanddespair.world</text>`;

export function scatterChart(o: ScatterSpec): Rendered {
  const W = 920, H = 470, m = { l: 56, r: 24, t: 26, b: 56 };
  const ln = Math.log;
  const xs = o.xTicks, ys = o.yTicks;
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const ymin = Math.min(...ys), ymax = Math.max(...ys);
  const X = (v: number) => m.l + ((ln(v) - ln(x0)) / (ln(x1) - ln(x0))) * (W - m.l - m.r);
  const Y = (v: number) => (H - m.b) - ((v - ymin) / (ymax - ymin)) * (H - m.t - m.b);
  const popMax = Math.max(...o.points.map((p) => p.pop));
  const R = (pop: number) => Math.max(2.4, Math.sqrt(pop / popMax) * 26);

  let g = '';
  // grid + axes
  for (const t of ys) {
    const y = Y(t);
    g += `<line class="${t === 0 ? 'grid0' : 'grid'}" x1="${m.l}" y1="${y}" x2="${W - m.r}" y2="${y}"/>`;
    g += `<text x="${m.l - 8}" y="${y + 3.5}" text-anchor="end">${t > 0 ? '+' : ''}${t}</text>`;
  }
  for (const t of xs) g += `<text x="${X(t)}" y="${H - m.b + 18}" text-anchor="middle">${fmtUsd(t)}</text>`;
  // axis titles
  g += `<text x="${(m.l + (W - m.r)) / 2}" y="${H - 10}" text-anchor="middle" class="axt">${esc(o.xLabel ?? 'GDP per capita at start (PPP, log scale)')}</text>`;
  g += `<text transform="translate(14 ${(m.t + (H - m.b)) / 2}) rotate(-90)" text-anchor="middle" class="axt">${esc(o.yLabel ?? 'Growth, %/yr')}</text>`;

  // bubbles (sorted big→small so small ones sit on top and stay visible)
  for (const p of [...o.points].sort((a, b) => b.pop - a.pop)) {
    const col = o.regionColors[p.region] ?? '#6E7E92';
    g += `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="${R(p.pop).toFixed(1)}" fill="${col}" fill-opacity="0.30" stroke="${col}" stroke-width="1"/>`;
  }
  // labelled callouts for the named giants
  for (const p of o.points.filter((p) => p.label)) {
    const cx = X(p.x), cy = Y(p.y);
    g += `<text class="scl" x="${(cx + R(p.pop) + 3).toFixed(1)}" y="${(cy + 3.5).toFixed(1)}">${esc(p.label!)}</text>`;
  }

  // fit lines — weighted (solid) and unweighted (dashed). y = intercept + slope·ln(x)
  const line = (fit: Fit, dash: boolean, col: string) => {
    const ya = fit.intercept + fit.slope * ln(x0), yb = fit.intercept + fit.slope * ln(x1);
    return `<line x1="${X(x0).toFixed(1)}" y1="${Y(ya).toFixed(1)}" x2="${X(x1).toFixed(1)}" y2="${Y(yb).toFixed(1)}" stroke="${col}" stroke-width="2.4"${dash ? ' stroke-dasharray="6 5"' : ''}/>`;
  };
  g += line(o.fits.weighted, false, '#14130F');
  g += line(o.fits.unweighted, true, '#7C7A72');

  // legend for the two fits (top-right, inside plot)
  const lx = W - m.r - 188, ly = m.t + 6;
  g += `<line x1="${lx}" y1="${ly}" x2="${lx + 22}" y2="${ly}" stroke="#14130F" stroke-width="2.4"/><text class="leg" x="${lx + 28}" y="${ly + 4}">weighted by people</text>`;
  g += `<line x1="${lx}" y1="${ly + 17}" x2="${lx + 22}" y2="${ly + 17}" stroke="#7C7A72" stroke-width="2.4" stroke-dasharray="6 5"/><text class="leg" x="${lx + 28}" y="${ly + 21}">one country, one point</text>`;

  g += wm(W, H);
  return { viewBox: `0 0 ${W} ${H}`, inner: g, m: scatterMobile(o) };
}

/** Portrait mobile variant: a near-square plot so the cloud has room, the two-fit legend lifted to
    the top (no room inside a narrow plot), bigger baked fonts. Same data, same fits. */
export function scatterMobile(o: ScatterSpec): Rendered {
  const W = 390, H = 430, m = { l: 40, r: 12, t: 50, b: 46 };
  const ln = Math.log;
  const xs = o.xTicks, ys = o.yTicks;
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const ymin = Math.min(...ys), ymax = Math.max(...ys);
  const X = (v: number) => m.l + ((ln(v) - ln(x0)) / (ln(x1) - ln(x0))) * (W - m.l - m.r);
  const Y = (v: number) => (H - m.b) - ((v - ymin) / (ymax - ymin)) * (H - m.t - m.b);
  const popMax = Math.max(...o.points.map((p) => p.pop));
  const R = (pop: number) => Math.max(2.2, Math.sqrt(pop / popMax) * 20);
  const FT = 'font-size:12px';
  let g = '';
  for (const t of ys) {
    const y = Y(t);
    g += `<line class="${t === 0 ? 'grid0' : 'grid'}" x1="${m.l}" y1="${y.toFixed(1)}" x2="${W - m.r}" y2="${y.toFixed(1)}"/>`;
    g += `<text x="${m.l - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" style="${FT}">${t > 0 ? '+' : ''}${t}</text>`;
  }
  // subsample x-ticks on the narrow log axis, clamped so the end tick ($100k) can't bleed off-edge
  const xt = xs.length <= 4 ? xs : xs.filter((_, i) => i === 0 || i === xs.length - 1 || i % 2 === 0);
  for (const t of xt) {
    const tw = fmtUsd(t).length * 7.5, tx = Math.min(Math.max(X(t), 3 + tw / 2), W - 3 - tw / 2);
    g += `<text x="${tx.toFixed(1)}" y="${(H - m.b + 17).toFixed(1)}" text-anchor="middle" style="${FT}">${fmtUsd(t)}</text>`;
  }
  g += `<text x="${((m.l + (W - m.r)) / 2).toFixed(1)}" y="${(H - 8).toFixed(1)}" text-anchor="middle" class="axt" style="${FT}">${esc(o.xLabel ?? 'GDP per capita at start (log)')}</text>`;
  g += `<text transform="translate(12 ${((m.t + (H - m.b)) / 2).toFixed(1)}) rotate(-90)" text-anchor="middle" class="axt" style="${FT}">${esc(o.yLabel ?? 'Growth, %/yr')}</text>`;
  for (const p of [...o.points].sort((a, b) => b.pop - a.pop)) {
    const col = o.regionColors[p.region] ?? '#6E7E92';
    g += `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="${R(p.pop).toFixed(1)}" fill="${col}" fill-opacity="0.30" stroke="${col}" stroke-width="1"/>`;
  }
  // white halo so a country label stays readable over the bubble cloud and the fit lines
  const HALO = 'paint-order:stroke;stroke:#FFFFFF;stroke-width:3px;stroke-linejoin:round';
  // Labels collide where bubbles cluster (Brazil/US, Nigeria/Pakistan). Place the biggest economies
  // first, then nudge each next label up/down off any already-placed box so names stay readable.
  const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
  const hit = (b: { x0: number; x1: number; y0: number; y1: number }) =>
    placed.some((o) => b.x0 < o.x1 - 1 && b.x1 > o.x0 + 1 && b.y0 < o.y1 - 1 && b.y1 > o.y0 + 1);
  for (const p of [...o.points].filter((p) => p.label).sort((a, b) => b.pop - a.pop)) {
    const cx = X(p.x), cy = Y(p.y), rr = R(p.pop), w = p.label!.length * 7;
    const right = cx + rr + 4 + w > W - m.r;
    const tx = right ? cx - rr - 4 : cx + rr + 4;
    let ty = cy + 3.5;
    for (const dy of [0, -13, 13, -26, 26, -39]) {
      const y = cy + 3.5 + dy, x0 = right ? tx - w : tx;
      if (!hit({ x0, x1: x0 + w, y0: y - 10, y1: y + 2 })) { ty = y; break; }
    }
    const x0 = right ? tx - w : tx;
    placed.push({ x0, x1: x0 + w, y0: ty - 10, y1: ty + 2 });
    if (Math.abs(ty - (cy + 3.5)) > 11) g += `<line x1="${cx.toFixed(1)}" y1="${cy.toFixed(1)}" x2="${tx.toFixed(1)}" y2="${(ty - 3).toFixed(1)}" stroke="#7C7A72" stroke-width="1" opacity="0.35"/>`;
    g += `<text class="scl" x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${right ? 'end' : 'start'}" style="${FT};${HALO}">${esc(p.label!)}</text>`;
  }
  const line = (fit: Fit, dash: boolean, col: string) => {
    const ya = fit.intercept + fit.slope * ln(x0), yb = fit.intercept + fit.slope * ln(x1);
    return `<line x1="${X(x0).toFixed(1)}" y1="${Y(ya).toFixed(1)}" x2="${X(x1).toFixed(1)}" y2="${Y(yb).toFixed(1)}" stroke="${col}" stroke-width="2.4"${dash ? ' stroke-dasharray="6 5"' : ''}/>`;
  };
  g += line(o.fits.weighted, false, '#14130F');
  g += line(o.fits.unweighted, true, '#7C7A72');
  // two-fit legend across the top
  g += `<line x1="2" y1="14" x2="22" y2="14" stroke="#14130F" stroke-width="2.6"/><text class="leg" x="28" y="18" style="${FT}">weighted by people</text>`;
  g += `<line x1="2" y1="33" x2="22" y2="33" stroke="#7C7A72" stroke-width="2.6" stroke-dasharray="6 5"/><text class="leg" x="28" y="37" style="${FT}">one country, one point</text>`;
  // page-only twin — no watermark (the desktop render carries it for downloads)
  return { viewBox: `0 0 ${W} ${H}`, inner: g };
}
