/* PNG twin of each downloadable chart SVG — the "↓ png" link. Phones often can't open a downloaded
   .svg; a PNG always opens. Rasterised at build time from the same self-contained SVG (lib/chart-svgs.ts),
   so the two formats stay identical. Separate files, fetched only on a download tap → zero page cost. */
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { chartSvgs } from '../../../lib/chart-svgs';

export async function getStaticPaths() {
  return (await chartSvgs()).map((a) => ({ params: { ref: a.ref, name: a.name }, props: { svg: a.svg } }));
}

export const GET: APIRoute = async ({ props }) => {
  // render the vector at ~1230px wide — crisp for sharing, modest file size (these are download-only)
  const png = await sharp(Buffer.from((props as { svg: string }).svg, 'utf8'), { density: 96 }).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
