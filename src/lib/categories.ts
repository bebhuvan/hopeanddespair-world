// The domains the atlas is browsed by. The home spectrum keeps every question on one axis;
// categories are a second way in — grouping the per-question `theme` into a handful of domains.
// One source of truth: a question's category is derived from its `theme`, never hand-tagged.

export interface Category {
  slug: string;
  name: string;
  blurb: string;        // one line — used in the home explorer and as the category-page lede
  themes: string[];     // which question `theme` values belong to this domain
  keystone?: boolean;   // the front-door question, shown apart from the thematic domains
}

export const categories: Category[] = [
  {
    slug: 'the-whole-question',
    name: 'The Whole Question',
    blurb: 'The keystone. Every dimension of “is the world getting better or worse?”, read in one place.',
    themes: ['The Whole Question'],
    keystone: true,
  },
  {
    slug: 'violence-and-peace',
    name: 'Violence & Peace',
    blurb: 'War, homicide, and terror, against the long arc of human cruelty bending down, then back up.',
    themes: ['War & Peace'],
  },
  {
    slug: 'health-and-life',
    name: 'Health & Life',
    blurb: 'How long we live, what we die of, and how many of us there will be.',
    themes: ['Health', 'Population'],
  },
  {
    slug: 'wealth-and-poverty',
    name: 'Wealth & Poverty',
    blurb: 'Growth, income, and whether the poorest are finally catching up.',
    themes: ['Wealth & Growth', 'Poverty'],
  },
  {
    slug: 'climate-and-energy',
    name: 'Climate & Energy',
    blurb: 'The carbon we burn, the heat it traps, and how fast the transition out is moving.',
    themes: ['Climate', 'Energy'],
  },
  {
    slug: 'knowledge-and-power',
    name: 'Knowledge & Power',
    blurb: 'Who makes the world’s knowledge, and whom it ends up serving.',
    themes: ['Knowledge'],
  },
];

/** The category a question's theme belongs to (or undefined if a theme isn't mapped yet). */
export function categoryForTheme(theme: string): Category | undefined {
  return categories.find((c) => c.themes.includes(theme));
}
