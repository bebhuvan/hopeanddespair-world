export type Point = [number, number];

/**
 * Monotone-cubic interpolation (Fritsch–Carlson). Cosmetic smoothing only — it never moves,
 * adds, or hides a data point and cannot overshoot a real value. Disclosed in methodology.
 * Returns an SVG path `d` string through the given pixel-space points.
 */
export function smooth(p: Point[], prec = 2): string {
  // `prec` = decimal places in the emitted path. The desktop 920-unit charts want 2 (sub-pixel
  // smoothness); the small mobile twins render at ~1:1, so 1 place is invisible and ~10% lighter
  // across a chart-heavy page — payload that the dual render would otherwise add.
  const f = (v: number) => v.toFixed(prec);
  const n = p.length;
  if (n < 3) return p.map((q, i) => (i ? 'L' : 'M') + f(q[0]) + ' ' + f(q[1])).join(' ');
  const x = p.map((q) => q[0]);
  const y = p.map((q) => q[1]);
  const dx: number[] = [], dy: number[] = [], d: number[] = [], m: number[] = [];
  for (let i = 0; i < n - 1; i++) { dx[i] = x[i + 1] - x[i]; dy[i] = y[i + 1] - y[i]; d[i] = dy[i] / (dx[i] || 1e-6); }
  m[0] = d[0];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  m[n - 1] = d[n - 2];
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; }
    else {
      const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
  }
  let s = 'M' + f(x[0]) + ' ' + f(y[0]);
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i];
    s += ' C' + f(x[i] + h / 3) + ' ' + f(y[i] + (m[i] * h) / 3) +
      ' ' + f(x[i + 1] - h / 3) + ' ' + f(y[i + 1] - (m[i + 1] * h) / 3) +
      ' ' + f(x[i + 1]) + ' ' + f(y[i + 1]);
  }
  return s;
}

/** Clip a [year, value] series to a window, keeping at least the last two points. */
export function windowSeries(series: Point[], from: number, to: number): Point[] {
  let w = series.filter((p) => p[0] >= from - 0.001 && p[0] <= to + 0.001);
  if (w.length < 2) w = series.filter((p) => p[0] <= to).slice(-2);
  return w;
}
