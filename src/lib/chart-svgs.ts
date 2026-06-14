import { getCollection } from 'astro:content';
import { buildMovements } from './article-charts';
import { buildDimensions } from './keystone-charts';
import { standaloneSvg } from './charts';
import { smartenDeep } from './typo';

/* The downloadable chart artifacts — one self-contained SVG per real chart, with a baked title +
   subtitle + source. Shared by the .svg endpoint (serves it as-is) and the .png endpoint (rasterises
   it via sharp), so the two formats can never list different charts or drift. */
export async function chartSvgs(): Promise<{ ref: string; name: string; svg: string }[]> {
  const questions = await getCollection('questions');
  const seen = new Set<string>();
  const out: { ref: string; name: string; svg: string }[] = [];
  const clean = (s: string) => (s ?? '').replace(/<[^>]+>/g, '').trim();
  const joinDot = (...xs: (string | undefined)[]) => xs.map((x) => clean(x ?? '')).filter(Boolean).join(' · ');
  const srcOf = (prov: any) => (prov ? joinDot('Source', prov.attribution, prov.license) : undefined);
  const add = (ref: string, name: string, chart: any, meta: { title: string; subtitle?: string; source?: string }) => {
    const key = `${ref}/${name}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ ref, name, svg: standaloneSvg(chart, meta) });
  };
  for (const q of questions) {
    const d = smartenDeep(q.data);
    if (d.status === 'published' && (d.evidence || (d.movements?.length ?? 0) > 0)) {
      buildMovements(d.movements ?? []).forEach((mv: any, i: number) => {
        if (mv.real && mv.dataRef) add(mv.dataRef, `fig${i + 1}`, mv, { title: clean(mv.captionLeft), subtitle: joinDot(mv.captionRight), source: clean(mv.source) || srcOf(mv.prov) });
        // a movement's region/country sub-charts have download links too — register them so they
        // resolve (the old endpoint missed these, 404-ing their .svg) and get a .png twin.
        const rg = mv.regionalChart;
        if (rg && rg.dataRef && !rg.linkOnly) add(rg.dataRef, 'regions', rg, { title: clean(rg.label), subtitle: joinDot(rg.span), source: srcOf(rg.prov) });
        const ct = mv.countryChart;
        if (ct && ct.dataRef && !ct.linkOnly) add(ct.dataRef, 'bars', ct, { title: clean(ct.label), subtitle: joinDot(ct.unit, ct.span), source: srcOf(ct.prov) });
      });
    }
    for (const dm of buildDimensions(d.dimensions ?? [])) {
      for (const c of [dm.carryingChart, dm.counterChart, ...(dm.secondaryCharts ?? [])]) {
        if (c && c.dataRef && !c.linkOnly) add(c.dataRef, 'chart', c, { title: clean(c.label), subtitle: joinDot(c.unit, c.span), source: srcOf(c.prov) });
      }
      const r = dm.regionalChart;
      if (r && r.dataRef && !r.linkOnly) add(r.dataRef, 'regions', r, { title: clean(r.label), subtitle: joinDot(r.span), source: srcOf(r.prov) });
    }
  }
  return out;
}
