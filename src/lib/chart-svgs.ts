import { getCollection } from 'astro:content';
import { buildMovements } from './article-charts';
import { buildDimensions } from './keystone-charts';
import { standaloneSvg } from './charts';
import { smartenDeep } from './typo';

/* The downloadable chart artifacts — one self-contained SVG per real chart, with a baked title +
   subtitle + source. Shared by the .svg endpoint (serves it as-is) and the .png endpoint (rasterises
   it via sharp), so the two formats can never list different charts or drift. */
export async function chartSvgs(): Promise<{ ref: string; name: string; svg: string; file: string }[]> {
  const questions = await getCollection('questions');
  const seen = new Set<string>();
  const out: { ref: string; name: string; svg: string; file: string }[] = [];
  const clean = (s: string) => (s ?? '').replace(/<[^>]+>/g, '').trim();
  const joinDot = (...xs: (string | undefined)[]) => xs.map((x) => clean(x ?? '')).filter(Boolean).join(' · ');
  const srcOf = (prov: any) => (prov ? joinDot('Source', prov.attribution, prov.license) : undefined);
  // Slug from the chart title so a downloaded artifact reads "who-the-worlds-defaulted-debt…", not
  // the route placeholder "fig9". Used in the Content-Disposition header (forces a download with a
  // human filename even on direct navigation, regardless of the anchor's download attribute).
  const slug = (s: string) => clean(s).split('·')[0].trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 64) || 'chart';
  const add = (ref: string, name: string, chart: any, meta: { title: string; subtitle?: string; source?: string }) => {
    const key = `${ref}/${name}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ ref, name, svg: standaloneSvg(chart, meta), file: slug(meta.title) });
  };
  for (const q of questions) {
    const d = smartenDeep(q.data);
    if (d.status === 'published' && (d.evidence || (d.movements?.length ?? 0) > 0)) {
      buildMovements(d.movements ?? []).forEach((mv: any, i: number) => {
        // imgRef (not dataRef) gates the image artifact: composite charts (area/bars/heatgrid) withhold
        // their data but still get a downloadable png/svg, since the rendered image is a transformative
        // work we can always share. Line charts have imgRef === dataRef, so nothing changes for them.
        if (mv.real && mv.imgRef) add(mv.imgRef, `fig${i + 1}`, mv, { title: clean(mv.captionLeft), subtitle: joinDot(mv.captionRight), source: clean(mv.source) || srcOf(mv.prov) });
        // a movement's region/country sub-charts have download links too — register them so they
        // resolve (the old endpoint missed these, 404-ing their .svg) and get a .png twin. The image is
        // offered even for link-only sources; only their data files stay withheld (gated in the page).
        const rg = mv.regionalChart;
        if (rg && rg.dataRef) add(rg.dataRef, 'regions', rg, { title: clean(rg.label), subtitle: joinDot(rg.span), source: srcOf(rg.prov) });
        const ct = mv.countryChart;
        if (ct && ct.dataRef) add(ct.dataRef, 'bars', ct, { title: clean(ct.label), subtitle: joinDot(ct.unit, ct.span), source: srcOf(ct.prov) });
      });
    }
    for (const dm of buildDimensions(d.dimensions ?? [])) {
      for (const c of [dm.carryingChart, dm.counterChart, ...(dm.secondaryCharts ?? [])]) {
        if (c && c.dataRef) add(c.dataRef, 'chart', c, { title: clean(c.label), subtitle: joinDot(c.unit, c.span), source: srcOf(c.prov) });
      }
      const r = dm.regionalChart;
      if (r && r.dataRef) add(r.dataRef, 'regions', r, { title: clean(r.label), subtitle: joinDot(r.span), source: srcOf(r.prov) });
    }
  }
  return out;
}
