import { fullChart } from './charts';
import { scatterChart } from './scatter';
import { barChart } from './bars';
import { multiLine, countryBars } from './keystone-charts';
import { stackedArea } from './area';
import { heatGrid } from './heatgrid';

/* Literal temperature hexes (mirrors tokens.css): charts must render identically on the
   page and in the standalone downloadable SVG, where CSS custom properties don't exist. */
export const COL: Record<string, string> = {
  hope: '#0F7A52', despair: '#C0492B', uncertain: '#5A55E6', ochre: '#C7901A', stone: '#6E7E92',
};

// Real derived series produced by the pipeline (DATA.md). dataRef swaps in real points + provenance.
const derivedSeries = import.meta.glob<{ default: any }>('../data/derived/*.json', { eager: true });
const derivedById: Record<string, any> = {};
for (const [path, mod] of Object.entries(derivedSeries)) {
  derivedById[path.split('/').pop()!.replace('.json', '')] = (mod as any).default;
}

/** Build the rendered movement charts for a question — shared by the article page and the
    standalone chart.svg endpoint, so the two can never drift. */
export function buildMovements(mvs: any[]) {
  return mvs.map((mv: any) => {
    // The other two magnifications, built from the same keystone machinery so every section can read
    // world → region → country (docs/ARTICLE-keystone-plan.md). Optional per movement; null if absent.
    const reg = mv.regional ? multiLine(mv.regional.refs) : null;
    const ctry = mv.countries ? countryBars(mv.countries.ref) : null;
    const regionalChart = reg ? { ...reg, label: mv.regional.label, note: mv.regional.note } : null;
    const countryChart = ctry ? { ...ctry, label: mv.countries.label, note: mv.countries.note } : null;
    // The convergence scatter is a different chart job (population bubbles + weighted/unweighted fit
    // lines), not a {t,value} line — render it from its bespoke artifact, skip the line machinery.
    if (mv.chart.dataRef === 'convergence-scatter') {
      const sc = derivedById['convergence-scatter'];
      const r = scatterChart(sc);
      return { ...mv, ...r, real: true, prov: sc?.provenance ?? null, recipe: sc?.recipe ?? null, dataRef: undefined, regionalChart, countryChart };
    }
    // Cross-section bar artifacts (kind: 'bars') — MPI, Gini: a ranking across categories, not a
    // line over time. Render with barChart; colours arrive as tokens, resolved to literal hex here.
    const barArt = mv.chart.dataRef ? derivedById[mv.chart.dataRef] : null;
    if (barArt?.kind === 'bars') {
      const r = barChart({ ...barArt,
        bars: barArt.bars.map((b: any) => ({ ...b, color: COL[b.color] ?? b.color,
          segments: b.segments?.map((s: any) => ({ ...s, color: COL[s.color] ?? s.color })) })),
        legend: barArt.legend?.map((l: any) => ({ ...l, color: COL[l.color] ?? l.color })) });
      return { ...mv, ...r, real: true, kind: 'bars', prov: barArt.provenance ?? null, recipe: barArt.recipe ?? null, dataRef: undefined, regionalChart, countryChart };
    }
    // 100%-stacked composition over time (kind: 'area') — creditor / instrument mix re-weighting by
    // decade. Bands carry colour tokens, resolved to literal hex here; rendered by the area kit.
    if (barArt?.kind === 'area') {
      const r = stackedArea({ ...barArt, bands: barArt.bands.map((b: any) => ({ ...b, color: COL[b.color] ?? b.color })) });
      return { ...mv, ...r, real: true, kind: 'area', prov: barArt.provenance ?? null, recipe: barArt.recipe ?? null, dataRef: undefined, regionalChart, countryChart };
    }
    // Divergence heat grid (kind: 'heatgrid') — region × measure, each cell shaded by where that
    // region stands today. Cells carry their own literal colours, so no token resolution here.
    if (barArt?.kind === 'heatgrid') {
      const r = heatGrid(barArt);
      return { ...mv, ...r, real: true, kind: 'heatgrid', prov: barArt.provenance ?? null, recipe: barArt.recipe ?? null, dataRef: undefined, regionalChart, countryChart };
    }
    const win = (pts: any[]) => pts.filter((p: any) =>
      (mv.chart.x0 == null || p.t >= mv.chart.x0) && (mv.chart.x1 == null || p.t <= mv.chart.x1));
    // Multi-line real chart: one derived series per authored line, BY INDEX (keeps name + colour).
    // Keep the slot even when a line's derived series isn't present yet (e.g. a newly added dataRef
    // awaiting `pnpm data`) so a missing ref falls back to its OWN authored points — never to another
    // line's, which `filter(Boolean)` would do by shifting the index and silently mislabelling.
    const rawRefs = mv.chart.dataRefs?.map((id: string) => derivedById[id] ?? null) ?? null;
    const refs = rawRefs && rawRefs.some(Boolean) ? rawRefs : null;
    const ref = mv.chart.dataRef ? derivedById[mv.chart.dataRef] : null;
    // When a real chart sets x0/x1, window the derived points to that span (e.g. a recent-years
    // zoom of a full-history series) so the line doesn't draw off-canvas.
    const series = refs
      ? refs.map((rf: any, i: number) => {
          const sp = mv.chart.series[i];
          return { name: sp?.name ?? rf?.entityName, color: COL[sp?.color ?? 'hope'], dashed: sp?.dashed,
            data: rf ? win(rf.points).map((p: any) => [p.t, p.value]) : (sp?.data ?? []) };
        })
      : ref
      ? [{ name: mv.chart.series[0]?.name ?? 'Series', color: COL[mv.chart.series[0]?.color ?? 'hope'], data: win(ref.points).map((p: any) => [p.t, p.value]) }]
      : mv.chart.series.map((s: any) => ({ ...s, color: COL[s.color] }));
    const r = fullChart({ ...mv.chart, series });
    const primary = ref ?? refs?.find(Boolean) ?? null;
    return { ...mv, ...r, real: !!primary, prov: primary?.provenance ?? null, recipe: primary?.recipe ?? null,
      dataRef: mv.chart.dataRef ?? mv.chart.dataRefs?.find((id: string) => derivedById[id]) ?? mv.chart.dataRefs?.[0],
      regionalChart, countryChart };
  });
}
