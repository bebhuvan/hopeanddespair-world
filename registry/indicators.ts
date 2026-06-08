import type { IndicatorSpec } from '../src/lib/data/types.ts';

/* The indicator registry — the backbone (DATA.md §4). An article references a stable internal
   id; this maps it to a source, the transform recipe, and per-indicator validation bounds.
   Units must match the source's declared unit exactly (validation enforces it). */

export const INDICATORS: IndicatorSpec[] = [
  {
    id: 'violence.homicide_rate.western_europe',
    title: 'Homicide rate, Western Europe (long run)',
    unit: 'homicides per 100,000 people',
    chartId: 'homicide-western-europe',
    adapter: 'owid',
    slug: 'homicide-rates-across-western-europe',
    derive: { op: 'mean_across_entities', minEntities: 1 },
    validate: { min: 0, max: 120, monotonicJump: 4, requireProvenance: true },
    primarySource: 'Eisner (2003); WHO Mortality Database',
  },
  {
    id: 'health.life_expectancy.world',
    title: 'Life expectancy at birth, World',
    unit: 'years',
    chartId: 'life-expectancy-world',
    adapter: 'owid',
    slug: 'life-expectancy',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'UN WPP; Human Mortality Database; Riley (2005)',
  },

  // World Bank (second keystone — a JSON API, different shape from OWID). Economy indicators
  // for future articles; proves the framework is multi-source.
  {
    id: 'economy.extreme_poverty.world',
    title: 'Population in extreme poverty (below $2.15/day, 2017 PPP)',
    unit: '% of population',
    chartId: 'extreme-poverty-world',
    adapter: 'worldbank',
    slug: 'SI.POV.DDAY',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'World Bank — Poverty and Inequality Platform',
  },
  {
    id: 'economy.gdp_per_capita.world',
    title: 'GDP per capita (constant 2015 US$)',
    unit: 'constant 2015 US$',
    chartId: 'gdp-per-capita-world',
    adapter: 'worldbank',
    slug: 'NY.GDP.PCAP.KD',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 200000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'World Bank / OECD national accounts',
  },
];

export const byId = (id: string) => INDICATORS.find((s) => s.id === id);
