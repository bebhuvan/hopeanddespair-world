import { miniLine } from './charts';
import { COL } from './article-charts';
import type { Point } from './smooth';

/* The home "state of the world" wall: one real signature series per question, rendered as a
   sparkline and coloured by the question's honest lean on the hope↔despair axis. The series is
   real data (the article's own evidence hero, or its first charted movement) — never invented;
   the full context lives in the article. */

const derived = import.meta.glob<{ default: any }>('../data/derived/*.json', { eager: true });
const byId: Record<string, any> = {};
for (const [p, m] of Object.entries(derived)) byId[p.split('/').pop()!.replace('.json', '')] = (m as any).default;

export interface HomeCell {
  id: string; num: string; theme: string; question: string; verdict: string;
  metric: string; color: string; lean: number;
  spark: { viewBox: string; inner: string } | null; live: boolean;
}

const stripTags = (s: string) => (s ?? '').replace(/<[^>]+>/g, '');
// a real time series (not a scatter or bar artifact): points carrying numeric t + value
const isSeries = (s: any) => Array.isArray(s?.points) && s.points.length > 1
  && typeof s.points[0]?.t === 'number' && typeof s.points[0]?.value === 'number';

export function homeCells(qs: any[]): HomeCell[] {
  return qs.map((q) => {
    const d = q.data;

    // signature series: the evidence hero if the article has one, else its first real charted movement.
    let pts: Point[] | null = null;
    let metric = '';
    if (d.evidence?.hero?.length) {
      pts = d.evidence.hero as Point[];
      metric = (d.evidence.heroLabel ?? '').split(/\s*[/·]\s*/)[0];
    } else {
      // the first movement with a real time series — singular dataRef OR the first usable
      // line of a multi-line dataRefs set (so convergence-style articles still get a sparkline)
      const refOf = (m: any): string | undefined =>
        (m.chart?.dataRef && isSeries(byId[m.chart.dataRef])) ? m.chart.dataRef
          : (m.chart?.dataRefs ?? []).find((r: string) => isSeries(byId[r]));
      const mv = (d.movements ?? []).find((m: any) => refOf(m));
      if (mv) {
        pts = byId[refOf(mv)!].points.map((p: any) => [p.t, p.value] as Point);
        metric = stripTags(mv.captionLeft).split(/\s*·\s*/)[0].trim();
      } else {
        // keystone hub / dimension-led: take the first dimension's carrying series
        const dim = (d.dimensions ?? []).find((dm: any) => dm.carrying?.ref && isSeries(byId[dm.carrying.ref]));
        if (dim) { pts = byId[dim.carrying.ref].points.map((p: any) => [p.t, p.value] as Point); metric = stripTags(dim.carrying.label); }
      }
    }
    if (pts) pts = pts.filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));

    // lean = the centre of gravity of the two readings (0 = pure hope, 1 = pure despair).
    const lean = (d.atlas.hope.pos + d.atlas.despair.pos) / 2;
    const color = lean < 0.45 ? COL.hope : lean > 0.58 ? COL.despair : COL.stone;

    const spark = pts && pts.length > 1
      ? miniLine({ data: pts, color, width: 360, height: 64, area: true, baseline: true })
      : null;

    return {
      id: q.id, num: d.kickerNumber, theme: d.theme, question: d.question, verdict: d.verdict,
      metric, color, lean, spark, live: d.status === 'published',
    };
  });
}
