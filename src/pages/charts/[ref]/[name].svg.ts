/* Pre-baked, self-contained SVG artifact per real chart — the "↓ svg" link under each figure.
   Generated at build time; zero runtime cost, zero page weight. Lives beside the data artifacts
   under /charts/<dataRef>/. The chart list is built once in lib/chart-svgs.ts (shared with .png). */
import type { APIRoute } from 'astro';
import { chartSvgs } from '../../../lib/chart-svgs';

export async function getStaticPaths() {
  return (await chartSvgs()).map((a) => ({ params: { ref: a.ref, name: a.name }, props: { svg: a.svg } }));
}

export const GET: APIRoute = ({ props }) =>
  new Response((props as { svg: string }).svg, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
