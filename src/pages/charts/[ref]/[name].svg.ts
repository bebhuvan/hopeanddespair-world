/* Pre-baked, self-contained SVG artifact per real chart — the "↓ image, svg" link under
   each figure. Generated at build time (CHARTS.md: the four artifacts); zero runtime cost,
   zero page weight. Lives beside the data artifacts under /charts/<dataRef>/. */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildMovements } from '../../../lib/article-charts';
import { buildDimensions } from '../../../lib/keystone-charts';
import { standaloneSvg } from '../../../lib/charts';
import { smartenDeep } from '../../../lib/typo';

export async function getStaticPaths() {
  const questions = await getCollection('questions');
  const seen = new Set<string>();
  const paths: { params: { ref: string; name: string }; props: { svg: string } }[] = [];
  const add = (ref: string, name: string, chart: any, title: string) => {
    const key = `${ref}/${name}`;
    if (seen.has(key)) return;
    seen.add(key);
    paths.push({ params: { ref, name }, props: { svg: standaloneSvg(chart, title) } });
  };
  const clean = (s: string) => (s ?? '').replace(/<[^>]+>/g, '');
  for (const q of questions) {
    const d = smartenDeep(q.data);
    // Movement figures (single-metric articles).
    if (d.status === 'published' && (d.evidence || (d.movements?.length ?? 0) > 0)) {
      buildMovements(d.movements ?? []).forEach((mv: any, i: number) => {
        if (!mv.real || !mv.dataRef) return;
        add(mv.dataRef, `fig${i + 1}`, mv, `${clean(mv.captionLeft)} · ${mv.captionRight ?? ''} · hopeanddespair.world`);
      });
    }
    // Keystone hub: one pre-baked SVG per dimension chart (skip the link-only ones — no re-host).
    for (const dm of buildDimensions(d.dimensions ?? [])) {
      for (const c of [dm.carryingChart, dm.counterChart, ...(dm.secondaryCharts ?? [])]) {
        if (c && c.dataRef && !c.linkOnly) add(c.dataRef, 'chart', c, `${clean(c.label)} · ${c.unit} · ${c.span} · hopeanddespair.world`);
      }
      const r = dm.regionalChart;
      if (r && r.dataRef && !r.linkOnly) add(r.dataRef, 'regions', r, `${clean(r.label)} · ${r.span} · hopeanddespair.world`);
    }
  }
  return paths;
}

export const GET: APIRoute = ({ props }) =>
  new Response((props as { svg: string }).svg, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
