import { barChart } from './bars';
import { COL } from './article-charts';

/* Per-question chart galleries — a curated cluster of share-worthy cross-sections for one article.
   NOT a decontextualized stat wall: each chart keeps its lens (the one-line hook), its source, and a
   link back to the figure it came from. The clusters are authored, ordered so a meta-argument lands
   (for debt: the same world ranked many ways, a different country worst each time). Charts render
   with the real `barChart()` kit from committed `kind:'bars'` artifacts, so the gallery and the
   article can never drift. Build-time only, zero client JS. Keyed by question slug. */

const derived = import.meta.glob<{ default: any }>('../data/derived/*.json', { eager: true });
const byId: Record<string, any> = {};
for (const [path, mod] of Object.entries(derived)) byId[path.split('/').pop()!.replace('.json', '')] = (mod as any).default;

export function galleryBars(ref: string) {
  const a = byId[ref];
  if (!a || a.kind !== 'bars') return null;
  const r = barChart({ ...a, bars: a.bars.map((b: any) => ({ ...b, color: COL[b.color] ?? b.color })) });
  return { ...r, unit: a.unit, license: a.provenance?.license ?? '', attribution: a.provenance?.attribution ?? '' };
}

export type GalleryItem = { ref: string; kicker: string; top: string; hook: string; fig: string };
export type Gallery = { headline: string; blurb: string; items: GalleryItem[] };

export const GALLERIES: Record<string, Gallery> = {
  'is-the-world-drowning-in-debt': {
    headline: 'Same world, a different worst list every time',
    blurb:
      "Rank the world’s debt one way and Japan tops it; rank it another and the answer is Ethiopia, or Pakistan, or Venezuela. These are the same countries measured nine ways. The disagreement between the charts is the whole point: the level of a debt tells you little, and the lens you choose decides who looks like they are drowning.",
    items: [
      { ref: 'debt-gdp-by-country', kicker: 'Most indebted', top: 'Japan',
        hook: 'Japan tops the pile at well over twice its yearly output — and sleeps fine. The level alone tells you almost nothing.', fig: 'FIG. 1' },
      { ref: 'debt-external-share', kicker: 'Most owed abroad', top: 'Ethiopia',
        hook: 'Debt in a currency you cannot print is the dangerous kind. Ethiopia owes three-fifths of its public debt to foreigners; India under a tenth.', fig: 'FIG. 5' },
      { ref: 'debt-owed-china-by-country', kicker: 'Most owed to China', top: 'Pakistan',
        hook: 'In two decades China went from a rounding error to the developing world’s biggest bilateral lender. This is the official figure — loans through its commercial banks push it higher.', fig: 'FIG. 7' },
      { ref: 'debt-service-exports-by-country', kicker: 'Most of its exports owed', top: 'El Salvador',
        hook: 'El Salvador sends about eighty cents of every export dollar straight back out to creditors. A quarter is the level lenders read as a warning.', fig: 'FIG. 8' },
      { ref: 'interest-revenue-by-country', kicker: 'Most of the budget eaten', top: 'Pakistan',
        hook: 'Before a nurse is paid or a road is fixed, the interest comes first. Pakistan spends about sixty cents of every tax dollar on it.', fig: 'FIG. 8' },
      { ref: 'debt-cost-classrooms', kicker: 'Debt before schools', top: 'Nigeria',
        hook: 'Nigeria pays six and a half times as much servicing its debt as it spends on educating its children.', fig: 'FIG. 8' },
      { ref: 'debt-redlines-by-country', kicker: 'Closest to the edge', top: 'Pakistan',
        hook: 'Six classic danger lines; Pakistan trips five. Read the dagger: a short bar can mean the crisis already came and went.', fig: 'FIG. 6' },
      { ref: 'defaults-by-country', kicker: 'Most dollars in default', top: 'Venezuela',
        hook: 'Thirteen countries hold most of the world’s defaulted debt. Venezuela alone accounts for ninety-six billion dollars of it.', fig: 'FIG. 19' },
      { ref: 'restructuring-haircuts', kicker: 'Where creditors lost most', top: 'Iraq',
        hook: 'When a country restructures, creditors lose about 45% on average across two centuries — almost never everything. Iraq’s lost nearly ninety.', fig: 'FIG. 16' },
    ],
  },
};
