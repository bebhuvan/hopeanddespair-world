import { writeFileSync, mkdirSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

/* Open Graph cards (1200×630), rasterised into public/. Run: `pnpm og`.
   - public/og.png            — the site/home default (the thesis, stated plainly)
   - public/og/<slug>.png     — one per published article: its question + verdict + its own
                                two-tone carrying sparkline (the long arc + the recent turn).
   Rendered in the REAL site faces: scripts/og-fonts.py instances the variable woff2s to static
   TTFs and points fontconfig at them, so sharp/librsvg draws Source Serif 4 / Spline Sans Mono,
   not a generic system serif. The PNGs are committed; the deploy build never runs this. */

// 1) Prepare the real fonts (once), then load sharp so it picks up FONTCONFIG_FILE.
const CACHE = path.resolve('scripts/.og-fonts');
if (!existsSync(path.join(CACHE, 'og-serif.ttf'))) {
  console.log('instancing site fonts for the OG cards…');
  execFileSync('python3', ['scripts/og-fonts.py', CACHE], { stdio: 'inherit' });
}
process.env.FONTCONFIG_FILE = path.join(CACHE, 'fonts.conf');
const sharp = (await import('sharp')).default;

const SERIF = 'OG Serif', ITALIC = 'OG Serif Italic', MONO = 'OG Mono';
const COL = { hope: '#0F7A52', despair: '#C0492B', stone: '#6E7E92', ink: '#14130F', ink2: '#2B2823', ink3: '#7C7A72', faint: '#9A988F' };
const W = 1200, H = 630, PAD = 96;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tempCol = (t?: string) => (t === 'cool' ? COL.hope : t === 'warm' ? COL.despair : COL.stone);

// the split-circle emblem + wordmark, top-left
const brand = `<g transform="translate(${PAD},56) scale(0.62)"><path d="M34 2 a32 32 0 0 0 0 64 z" fill="${COL.hope}"/><path d="M34 2 a32 32 0 0 1 0 64 z" fill="${COL.despair}"/><line x1="34" y1="0" x2="34" y2="68" stroke="#fff" stroke-width="3.5"/><circle cx="34" cy="34" r="32" fill="none" stroke="${COL.ink}" stroke-width="4"/></g>`
  + `<text x="${PAD + 58}" y="98" font-family="${SERIF}" font-size="30" fill="${COL.ink}">Hope <tspan fill="${COL.hope}" font-family="${ITALIC}">&amp;</tspan> Despair</text>`;

/** Catmull-Rom → cubic bézier, for a soft sparkline through pixel points. */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  if (pts.length < 3) return pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Size the title to fit one line at the largest comfortable size; wrap to two balanced lines
    only when even the smallest one-line size would overflow. (~0.49 em average glyph advance.) */
function fitTitle(q: string): { size: number; lines: string[] } {
  const avail = W - 2 * PAD, f = 0.49;
  for (const s of [66, 60, 54]) if (q.length * s * f <= avail) return { size: s, lines: [q] };
  const words = q.split(' ');
  let split = 1, best = Infinity;
  for (let i = 1; i < words.length; i++) {
    const left = words.slice(0, i).join(' ').length, diff = Math.abs(left - (q.length - left));
    if (diff < best) { best = diff; split = i; }
  }
  const lines = [words.slice(0, split).join(' '), words.slice(split).join(' ')];
  const longest = Math.max(...lines.map((l) => l.length));
  let size = 44;
  for (const s of [56, 52, 48, 44]) if (longest * s * f <= avail) { size = s; break; }
  return { size, lines };
}

interface Card { kicker: string; theme: string; question: string; verdict: string; hero?: [number, number][]; heroLabel?: string; bodyTemp?: string; recentTemp?: string; recentFrom?: number; }

function articleCard(c: Card): string {
  const hasHero = !!(c.hero && c.hero.length >= 2);
  // With a sparkline anchoring the lower third, the block sits high; without one, drop it so the
  // eyebrow/title/verdict sit centred between the wordmark and the foot — no bottom-heavy void.
  const yOff = hasHero ? 0 : 96;
  const t = fitTitle(c.question), eyebrowY = 210 + yOff, titleTop = 286 + yOff, lineH = t.size * 1.04;
  let s = `<rect width="${W}" height="${H}" fill="#FFFFFF"/>` + brand;
  s += `<text x="${PAD}" y="${eyebrowY}" font-family="${MONO}" font-size="22" letter-spacing="3" fill="${COL.ink3}">${esc(c.kicker)} · ${esc(c.theme.toUpperCase())}</text>`;
  t.lines.forEach((ln, i) => { s += `<text x="${PAD}" y="${(titleTop + i * lineH).toFixed(0)}" font-family="${SERIF}" font-size="${t.size}" fill="${COL.ink}">${esc(ln)}</text>`; });
  const verdY = titleTop + (t.lines.length - 1) * lineH + 62;
  s += `<text x="${PAD}" y="${verdY.toFixed(0)}" font-family="${ITALIC}" font-size="32" fill="${COL.ink2}">${esc(c.verdict.replace(/\.\s*$/, ''))}.</text>`;
  if (hasHero) {
    const sx0 = PAD, sx1 = W - PAD, sy0 = 472, sy1 = 560;
    const ys = c.hero.map((p) => p[1]), ymin = Math.min(...ys), ymax = Math.max(...ys);
    const X = (i: number) => sx0 + (i / (c.hero!.length - 1)) * (sx1 - sx0);
    const Y = (v: number) => (ymax === ymin ? (sy0 + sy1) / 2 : sy1 - ((v - ymin) / (ymax - ymin)) * (sy1 - sy0));
    const pts = c.hero.map((p, i) => [X(i), Y(p[1])]) as [number, number][];
    let split = c.recentFrom != null ? c.hero.findIndex((p) => p[0] >= c.recentFrom!) : -1;
    if (split < 1) split = Math.max(1, c.hero.length - 4);
    s += `<path d="${smoothPath(pts.slice(0, split + 1))}" fill="none" stroke="${tempCol(c.bodyTemp)}" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>`;
    s += `<path d="${smoothPath(pts.slice(split))}" fill="none" stroke="${tempCol(c.recentTemp)}" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>`;
    const e = pts[pts.length - 1];
    s += `<circle cx="${e[0].toFixed(1)}" cy="${e[1].toFixed(1)}" r="5" fill="${tempCol(c.recentTemp)}"/>`;
  }
  s += `<text x="${PAD}" y="600" font-family="${MONO}" font-size="21" fill="${COL.ink3}">hopeanddespair.world</text>`;
  if (c.heroLabel) s += `<text x="${W - PAD}" y="600" text-anchor="end" font-family="${MONO}" font-size="21" fill="${COL.faint}">${esc(c.heroLabel)}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${s}</svg>`;
}

// minimal frontmatter field readers — the content format is fixed (see content.config.ts)
const fmOf = (md: string) => (md.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1] as string;
const sc = (fm: string, k: string) => (fm.match(new RegExp(`^\\s*${k}:\\s*"?(.*?)"?\\s*$`, 'm')) || [])[1];
const num = (fm: string, k: string) => { const m = (fm.match(new RegExp(`^\\s*${k}:\\s*(-?\\d+)`, 'm')) || [])[1]; return m == null ? undefined : Number(m); };

// 2) The default site card — the thesis, in the real faces.
const thesis = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
  + `<rect width="${W}" height="${H}" fill="#FFFFFF"/>${brand}`
  + `<text x="${PAD}" y="318" font-family="${SERIF}" font-size="62" fill="${COL.hope}">The world is getting better.</text>`
  + `<text x="${PAD}" y="396" font-family="${SERIF}" font-size="62" fill="${COL.despair}">The world is getting worse.</text>`
  + `<text x="${PAD}" y="474" font-family="${ITALIC}" font-size="62" fill="${COL.ink}">Both are true.</text>`
  + `<text x="${PAD}" y="566" font-family="${MONO}" font-size="23" fill="${COL.ink3}">hopeanddespair.world  ·  a living atlas, read at every distance</text></svg>`;
writeFileSync('public/og.png', await sharp(Buffer.from(thesis)).png().toBuffer());
console.log('wrote public/og.png');

// 3) One card per published article.
mkdirSync('public/og', { recursive: true });
const dir = 'src/content/questions';
let n = 0;
for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const md = readFileSync(path.join(dir, file), 'utf8'), fm = fmOf(md);
  if (sc(fm, 'status') !== 'published') continue;
  const slug = file.replace(/\.md$/, '');
  let hero: [number, number][] | undefined;
  const hm = fm.match(/^\s*hero:\s*(\[.*\])\s*$/m);
  if (hm) { try { hero = JSON.parse(hm[1]); } catch { /* leave undefined */ } }
  const bodyTemp = (fm.match(/windows:[\s\S]*?temp:\s*"?(cool|warm)"?/) || [])[1];
  const svg = articleCard({
    kicker: sc(fm, 'kickerNumber') ?? '', theme: sc(fm, 'theme') ?? '', question: sc(fm, 'question') ?? '',
    verdict: sc(fm, 'verdict') ?? '', hero, heroLabel: sc(fm, 'heroLabel'), bodyTemp,
    recentTemp: (fm.match(/^\s*recentTemp:\s*"?(cool|warm)"?/m) || [])[1], recentFrom: num(fm, 'recentFrom'),
  });
  writeFileSync(`public/og/${slug}.png`, await sharp(Buffer.from(svg)).png().toBuffer());
  console.log('wrote public/og/' + slug + '.png');
  n++;
}
console.log(`done — ${n} article cards`);
