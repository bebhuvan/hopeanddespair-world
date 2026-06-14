import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

// One branded Open Graph card (1200×630), rasterised once into public/og.png. Typographic,
// in the site's palette — the thesis stated plainly. Run: pnpm tsx scripts/make-og.ts
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FFFFFF"/>
  <g transform="translate(96,86)">
    <path d="M34 2 a32 32 0 0 0 0 64 z" fill="#0F7A52"/>
    <path d="M34 2 a32 32 0 0 1 0 64 z" fill="#C0492B"/>
    <line x1="34" y1="0" x2="34" y2="68" stroke="#ffffff" stroke-width="3.5"/>
    <circle cx="34" cy="34" r="32" fill="none" stroke="#14130F" stroke-width="4"/>
    <text x="86" y="46" font-family="Georgia, 'Times New Roman', serif" font-size="40" font-weight="600" fill="#14130F">Hope <tspan fill="#0F7A52" font-style="italic">&amp;</tspan> Despair</text>
  </g>
  <text x="96" y="320" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" fill="#0F7A52">The world is getting better.</text>
  <text x="96" y="398" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" fill="#C0492B">The world is getting worse.</text>
  <text x="96" y="476" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-style="italic" fill="#14130F">Both are true.</text>
  <text x="96" y="566" font-family="monospace" font-size="24" fill="#7C7A72">hopeanddespair.world  ·  a living atlas, read at every distance</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync('public/og.png', png);
console.log('wrote public/og.png', png.length, 'bytes');
