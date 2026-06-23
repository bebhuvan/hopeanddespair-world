/* PNG twin of each downloadable chart SVG — the "↓ png" link. Phones often can't open a downloaded
   .svg; a PNG always opens. Rasterised at build time from the same self-contained SVG (lib/chart-svgs.ts),
   so the two formats stay identical. Separate files, fetched only on a download tap → zero page cost. */
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { chartSvgs } from '../../../lib/chart-svgs';

export async function getStaticPaths() {
  return (await chartSvgs()).map((a) => ({ params: { ref: a.ref, name: a.name }, props: { svg: a.svg, file: a.file } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { svg, file } = props as { svg: string; file: string };
  // render the vector at ~1230px wide — crisp for sharing, modest file size (these are download-only)
  const png = await sharp(Buffer.from(svg, 'utf8'), { density: 96 }).png().toBuffer();
  // Content-Disposition forces a download with a human filename even on direct navigation or when a
  // browser ignores the anchor's download attribute — so the link always saves a file, never previews.
  return new Response(new Uint8Array(png), { headers: {
    'Content-Type': 'image/png',
    'Content-Disposition': `attachment; filename="${file}.png"`,
  } });
};
