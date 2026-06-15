import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

/* Axis guard. A hand-authored chart `ymax` can fall BELOW the data after a re-ingest (`pnpm data`),
   so the line overflows the plot — into the title, even (CLAUDE.md's recurring gotcha: "the top tick
   must sit at or ABOVE the data max"). This fails the build when any movement chart's WINDOWED data
   (respecting x0/x1) exceeds its ymax. Pure frontmatter + derived-series read; no Astro needed. */

const dir = 'src/content/questions';
const points = (ref: string): { t: number; value: number }[] | null => {
  const f = `src/data/derived/${ref}.json`;
  if (!existsSync(f)) return null;
  try { return JSON.parse(readFileSync(f, 'utf8')).points; } catch { return null; }
};

const offenders: string[] = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const fm = (readFileSync(path.join(dir, file), 'utf8').match(/^---\n([\s\S]*?)\n---/) || [, ''])[1] as string;
  const lines = fm.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const ym = lines[i].match(/^\s*ymax:\s*([\d.]+)/);
    if (!ym) continue;
    const ymax = parseFloat(ym[1]);
    // the dataRef(s) this ymax belongs to sit a few lines above it
    let refs: string[] | null = null, base = i;
    for (let j = i; j >= Math.max(0, i - 8); j--) {
      const rs = lines[j].match(/^\s*dataRefs:\s*(\[.*\])/), r1 = lines[j].match(/^\s*dataRef:\s*"([^"]+)"/);
      if (rs) { try { refs = JSON.parse(rs[1]); } catch { /* skip */ } base = j; break; }
      if (r1) { refs = [r1[1]]; base = j; break; }
    }
    if (!refs) continue;
    // window to the chart's plotted x-range, so a zoomed panel isn't judged on off-screen history
    let x0 = -Infinity, x1 = Infinity;
    for (let j = base; j < Math.min(lines.length, base + 8); j++) {
      const a = lines[j].match(/^\s*x0:\s*(-?[\d.]+)/), b = lines[j].match(/^\s*x1:\s*(-?[\d.]+)/);
      if (a) x0 = parseFloat(a[1]);
      if (b) x1 = parseFloat(b[1]);
    }
    let max = -Infinity;
    for (const r of refs) for (const q of points(r) ?? []) if (q.t >= x0 && q.t <= x1) max = Math.max(max, q.value);
    if (max > ymax + 1e-9) offenders.push(`  ${file.replace('.md', '')} · [${refs[0]}…] ymax=${ymax} but data reaches ${max.toFixed(2)}`);
  }
}

if (offenders.length) {
  console.error(`FAIL: ${offenders.length} chart axis(es) below the data — line would overflow the plot:\n${offenders.join('\n')}\n  Raise ymax/yTicks to sit at or above the value.`);
  process.exit(1);
}
console.log('OK: every movement chart ymax sits at or above its (windowed) data');
