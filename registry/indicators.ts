import type { IndicatorSpec } from '../src/lib/data/types.ts';

/* The indicator registry — the backbone (DATA.md §4). An article references a stable internal
   id; this maps it to a source, the transform recipe, and per-indicator validation bounds.
   Units must match the source's declared unit exactly (validation enforces it). */

// Region → clean slug: "Sub-Saharan Africa (SDG)" → "sub-saharan-africa". Used by the regional
// divergence-cut .map blocks (keystone §5) so one carrying slug spawns one indicator per region.
const rslug = (s: string) =>
  s.toLowerCase().replace(/\s*\(.*\)\s*$/, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// The standard World Bank region aggregates (name as the API returns it → ISO-ish code). Most WDI
// indicators carry all six; a missing one just skips (caught by the pipeline, never fatal).
const WB_REGIONS = [
  ['Sub-Saharan Africa', 'SSF'], ['South Asia', 'SAS'], ['East Asia & Pacific', 'EAS'],
  ['Europe & Central Asia', 'ECS'], ['Latin America & Caribbean', 'LCN'],
  ['Middle East, North Africa, Afghanistan & Pakistan', 'MEA'],   // WB renamed this aggregate (was "Middle East & North Africa")
] as const;

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
  {
    id: 'violence.battle_deaths.world',
    title: 'Battle-related deaths, World',
    unit: 'deaths',
    chartId: 'battle-deaths-world',
    adapter: 'owid',
    slug: 'battle-related-deaths-in-state-based-conflicts-since-1946',
    // The grapher splits deaths across four conflict types; the total is their sum. Without this the
    // adapter would read only the last column (interstate), badly undercounting (e.g. the Syrian war).
    sourceColumns: [
      'number_deaths_ongoing_conflicts__conflict_type_intrastate__internationalized',
      'number_deaths_ongoing_conflicts__conflict_type_intrastate__non_internationalized',
      'number_deaths_ongoing_conflicts__conflict_type_extrasystemic',
      'number_deaths_ongoing_conflicts__conflict_type_interstate',
    ],
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 2000000, monotonicJump: 100000, requireProvenance: true },
    primarySource: 'Uppsala Conflict Data Program (UCDP)',
  },
  // Nuclear arsenals — the state's capacity for mass violence. FAS estimates via OWID (CC BY).
  // World total, 1945→present; peaked ~70,300 in 1986, down ~80% since.
  {
    id: 'violence.nuclear_warheads.world',
    title: 'Nuclear warhead stockpiles, World',
    unit: 'warheads',
    chartId: 'nuclear-warheads-world',
    adapter: 'owid',
    slug: 'nuclear-warhead-stockpiles',
    sourceColumn: 'number_of_warheads',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    // Early Cold-War years jump fast (6→11→32…); monotonicJump only warns, never blocks.
    validate: { min: 0, max: 80000, monotonicJump: 3, requireProvenance: true },
    primarySource: 'Federation of American Scientists — Nuclear Notebook',
  },
  // Global military expenditure — SIPRI via OWID (CC BY). World total, constant USD, 1988→present.
  {
    id: 'violence.military_spending.world',
    title: 'Military expenditure, World (constant US$)',
    unit: 'constant 2024 US$',
    chartId: 'military-spending-world',
    adapter: 'owid',
    slug: 'military-spending-sipri',
    sourceColumn: 'constant_usd',          // the grapher also carries an owid_region text column
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 5_000_000_000_000, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'Stockholm International Peace Research Institute (SIPRI)',
  },
  // Deaths from terrorism — Global Terrorism Database (START, U. Maryland) via OWID (CC BY).
  // World total, 1970→2021. Spiky by nature (2014 peak ~44k) — large jumps are content, not error.
  {
    id: 'violence.terrorism_deaths.world',
    title: 'Terrorism deaths, World',
    unit: 'deaths',
    chartId: 'terrorism-deaths-world',
    adapter: 'owid',
    slug: 'terrorism-deaths',
    sourceColumn: 'total_killed',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 200000, monotonicJump: 5, requireProvenance: true },
    primarySource: 'Global Terrorism Database (START, University of Maryland)',
  },

  // Active state-based conflicts — UCDP/PRIO via OWID (CC BY). The grapher splits counts by type;
  // we sum the state-based types (extrasystemic + intrastate + interstate) into one total, matching
  // the battle-deaths series' "state-based" scope.
  {
    id: 'violence.active_conflicts.world',
    title: 'Active state-based conflicts, World',
    unit: 'conflicts',
    chartId: 'active-conflicts-world',
    adapter: 'owid',
    slug: 'number-of-armed-conflicts',
    sourceColumns: [
      'number_ongoing_conflicts__conflict_type_extrasystemic',
      'number_ongoing_conflicts__conflict_type_intrastate',
      'number_ongoing_conflicts__conflict_type_interstate',
    ],
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 120, monotonicJump: 1, requireProvenance: true },
    primarySource: 'Uppsala Conflict Data Program (UCDP) / PRIO',
  },
  // Refugees by country of origin — UNHCR via OWID (CC BY). No World line in the source, so we sum
  // all countries of origin per year. NB: refugees only — excludes internally-displaced people.
  {
    id: 'violence.refugees.world',
    title: 'Refugees by country of origin, World',
    unit: 'people',
    chartId: 'refugees-world',
    adapter: 'owid',
    slug: 'refugee-population-by-country-or-territory-of-origin',
    sourceColumn: 'refugees',
    derive: { op: 'sum_across_entities' },
    validate: { min: 0, max: 60_000_000, monotonicJump: 1, requireProvenance: true },
    primarySource: 'UNHCR Refugee Data Finder',
  },

  // ── UCDP direct (first primary-source adapter; CC BY 4.0). Datasets ship as zipped CSVs at
  //    conflict/actor-year grain; the adapter sums the best fatality estimate to a World total. ──
  // One-sided violence — civilians deliberately killed by a state or organised group (the atrocity
  // dimension OWID doesn't re-host). World total, 1989→present; spikes hard (Rwanda 1994).
  {
    id: 'violence.onesided_deaths.world',
    title: 'Deaths from one-sided violence, World',
    unit: 'deaths',
    chartId: 'onesided-deaths-world',
    adapter: 'ucdp',
    slug: 'onesided',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 1_500_000, monotonicJump: 100, requireProvenance: true },
    primarySource: 'UCDP One-sided Violence Dataset',
  },
  // Non-state conflict — fighting between two armed groups, neither a state (militias, cartels,
  // communal violence). World total, 1989→present.
  {
    id: 'violence.nonstate_deaths.world',
    title: 'Deaths in non-state conflict, World',
    unit: 'deaths',
    chartId: 'nonstate-deaths-world',
    adapter: 'ucdp',
    slug: 'nonstate',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 200_000, monotonicJump: 100, requireProvenance: true },
    primarySource: 'UCDP Non-state Conflict Dataset',
  },

  // Battle deaths by world region (UCDP brd, 1989→). One indicator per region for the regional
  // dispersion chart; the adapter sums bd_best per region and the fetch is memoised across them.
  ...(['Middle East', 'Africa', 'Asia', 'Europe'] as const).map((region) => ({
    id: `violence.battle_deaths.${region.toLowerCase().replace(/ /g, '_')}`,
    title: `Battle-related deaths, ${region}`,
    unit: 'deaths',
    chartId: `battle-deaths-${region.toLowerCase().replace(/ /g, '-')}`,
    adapter: 'ucdp' as const,
    slug: 'brd',
    entityFilter: [region],
    derive: { op: 'pick_entity' as const, entity: region },
    validate: { min: 0, max: 300_000, monotonicJump: 200, requireProvenance: true },
    primarySource: 'UCDP Battle-Related Deaths Dataset',
  })),

  // Homicide rate by world region — UNODC, re-published by the World Bank under CC BY (the open
  // route around OWID's 403). World + four contrasting regions for the dispersion chart.
  ...([
    ['World', 'WLD'], ['Latin America & Caribbean', 'LCN'], ['Sub-Saharan Africa', 'SSF'],
    ['East Asia & Pacific', 'EAS'], ['Europe & Central Asia', 'ECS'],
  ] as const).map(([name, code]) => ({
    id: `violence.homicide_rate.${code.toLowerCase()}`,
    title: `Homicide rate, ${name}`,
    unit: 'homicides per 100,000 people',
    chartId: `homicide-rate-${code.toLowerCase()}`,
    adapter: 'worldbank' as const,
    slug: 'VC.IHR.PSRC.P5',
    entityFilter: [name],
    derive: { op: 'pick_entity' as const, entity: code },
    validate: { min: 0, max: 60, monotonicJump: 2, requireProvenance: true },
    primarySource: 'UNODC, via World Bank World Development Indicators',
  })),

  // Long-run conflict death rate — deaths in armed conflict per 100k, World, 1400→present (OWID,
  // CC BY). The deep companion to the homicide arc: war's per-capita toll across six centuries.
  {
    id: 'violence.conflict_death_rate.world',
    title: 'Death rate in armed conflicts, World (long run)',
    unit: 'deaths per 100,000 people',
    chartId: 'conflict-death-rate-world',
    adapter: 'owid',
    slug: 'global-death-rate-in-violent-political-conflicts-over-the-long-run',
    sourceColumn: 'number_deaths_ongoing_conflicts_per_capita__conflict_type_all',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    // Brecke's reconstruction ends at 2000; continue with UCDP's per-capita rate (summed types) to 2024.
    stitch: {
      slug: 'death-rate-in-armed-conflicts-by-type',
      after: 2000,
      sourceColumns: [
        'number_deaths_ongoing_conflicts_per_capita__conflict_type_one_sided_violence',
        'number_deaths_ongoing_conflicts_per_capita__conflict_type_non_state_conflict',
        'number_deaths_ongoing_conflicts_per_capita__conflict_type_extrasystemic',
        'number_deaths_ongoing_conflicts_per_capita__conflict_type_intrastate',
        'number_deaths_ongoing_conflicts_per_capita__conflict_type_interstate',
      ],
    },
    validate: { min: 0, max: 500, monotonicJump: 50, requireProvenance: true },
    primarySource: 'Brecke (to 2000), UCDP (from 2001) — via Our World in Data',
  },
  // Homicide rate by sex — World, 2000→ (WHO/UNODC via OWID, CC BY). Male and female as two
  // indicators feed one multi-line chart: who the remaining violence falls on.
  {
    id: 'violence.homicide_rate_male.world',
    title: 'Homicide rate, male, World',
    unit: 'homicides per 100,000 population',
    chartId: 'homicide-rate-male-world',
    adapter: 'owid',
    slug: 'homicide-rate-by-sex',
    sourceColumn: 'value__category_total__sex_male__age_total__unit_of_measurement_rate_per_100_000_population',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 50, monotonicJump: 1, requireProvenance: true },
    primarySource: 'WHO Mortality Database / UNODC — via Our World in Data',
  },
  {
    id: 'violence.homicide_rate_female.world',
    title: 'Homicide rate, female, World',
    unit: 'homicides per 100,000 population',
    chartId: 'homicide-rate-female-world',
    adapter: 'owid',
    slug: 'homicide-rate-by-sex',
    sourceColumn: 'value__category_total__sex_female__age_total__unit_of_measurement_rate_per_100_000_population',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 50, monotonicJump: 1, requireProvenance: true },
    primarySource: 'WHO Mortality Database / UNODC — via Our World in Data',
  },

  // Current wars — battle deaths in the deadliest active conflicts (UCDP brd, by location). Feeds
  // the "wars of the 2020s" chart. Labels are display names; entityFilter is the exact UCDP location.
  ...([
    ['Russia (Soviet Union), Ukraine', 'ukraine', 'Ukraine'],
    ['Ethiopia', 'ethiopia', 'Ethiopia'],
    ['Sudan', 'sudan', 'Sudan'],
    ['Israel', 'israel', 'Israel & Gaza'],
    ['Burkina Faso', 'burkina-faso', 'Sahel'],
  ] as const).map(([loc, slug, label]) => ({
    id: `violence.current_war.${slug.replace(/-/g, '_')}`,
    title: `Battle deaths, ${label}`,
    unit: 'deaths',
    chartId: `war-${slug}`,
    adapter: 'ucdp' as const,
    slug: 'brd',
    entityFilter: [loc],
    derive: { op: 'pick_entity' as const, entity: loc },
    validate: { min: 0, max: 200_000, monotonicJump: 1000, requireProvenance: true },
    primarySource: 'UCDP Battle-Related Deaths Dataset',
  })),

  /* TODO — indicators the violence article wants but the current pipeline can't yet re-host
     cleanly (see docs/ARTICLE-violence-plan.md §Data). Tracked here so they aren't forgotten:
       • UNODC homicide-by-region ('homicide-rate'): OWID returns HTTP 403 non-redistributable
         → LINK-ONLY per DATA.md license gate; cite, don't re-host.
       • Forcibly displaced (UNHCR): OWID slug renamed/restricted; needs a direct UNHCR adapter.
       • Active conflicts & deaths by type (UCDP 'number-of-armed-conflicts',
         'deaths-in-armed-conflicts-by-type'): multi-column → a single total needs a `sum_columns`
         derive op (multi-series rendering); deferred to the stacked-chart treatment.
       • Intimate-partner violence ('…-intimate-partner-un'): a single 2018 cross-section, not a
         time series → belongs in a country-spread chart, not a line.
       • Death penalty abolition / executions, modern slavery, attitudes (WVS): OWID slugs renamed
         or link-only; resolve per-chart in a later pass. */

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

  // ── Convergence (confusion). GDP per capita in PPP — the welfare-relevant income measure for the
  //    catch-up question (the market-FX series above overstates poor-country gaps). World + the six
  //    WB regions: the divergence cut behind "is the world's income converging?" — East Asia & South
  //    Asia rocketing, Sub-Saharan Africa and Latin America near-flat. PPP aggregates run 1990→.
  //    The β/σ convergence metrics themselves are computed across the country panel (scripts/analysis
  //    /convergence.ts), not pick_entity series — these regional lines are the readable companion. ──
  {
    id: 'economy.gdp_per_capita_ppp.world',
    title: 'GDP per capita, PPP (constant 2021 international $), World',
    unit: 'constant 2021 international $',
    chartId: 'gdp-per-capita-ppp-world',
    adapter: 'worldbank',
    slug: 'NY.GDP.PCAP.PP.KD',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 200000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'World Bank, International Comparison Program / OECD',
  },
  ...WB_REGIONS.map(([name, code]) => ({
    id: `economy.gdp_per_capita_ppp.${code.toLowerCase()}`,
    title: `GDP per capita, PPP (constant 2021 international $), ${name}`,
    unit: 'constant 2021 international $',
    chartId: `gdp-per-capita-ppp-${code.toLowerCase()}`,
    adapter: 'worldbank' as const,
    slug: 'NY.GDP.PCAP.PP.KD',
    entityFilter: [name],
    derive: { op: 'pick_entity' as const, entity: code },
    validate: { min: 0, max: 200000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'World Bank, International Comparison Program / OECD',
  })),

  // ── The convergence engine (confusion). Panel-derived metrics computed across ~180 countries
  //    (GDP per capita PPP × population) by the `convergence` adapter. The two headline lenses:
  //    σ — does the SPREAD of income shrink? Unweighted (countries) is flat; population-weighted
  //    (people) falls → "converging for people, not for places" (Galton's-fallacy point made
  //    visible). MLD — population-weighted between-country inequality; the all-vs-excluding-giants
  //    pair shows the fall is almost entirely China & India (the Johnson–Papageorgiou caveat). ──
  {
    id: 'economy.convergence_sigma_unweighted.world',
    title: 'Income dispersion across countries (unweighted), World',
    unit: 'standard deviation of ln(GDP per capita)',
    chartId: 'convergence-sigma-unweighted',
    adapter: 'convergence', slug: 'sigma_unweighted',
    validate: { min: 0, max: 3, monotonicJump: 0.2, requireProvenance: true },
    primarySource: 'World Bank — World Development Indicators (ICP PPP & population)',
  },
  {
    id: 'economy.convergence_sigma_weighted.world',
    title: 'Income dispersion across people (population-weighted), World',
    unit: 'standard deviation of ln(GDP per capita)',
    chartId: 'convergence-sigma-weighted',
    adapter: 'convergence', slug: 'sigma_weighted',
    validate: { min: 0, max: 3, monotonicJump: 0.2, requireProvenance: true },
    primarySource: 'World Bank — World Development Indicators (ICP PPP & population)',
  },
  {
    id: 'economy.convergence_mld_all.world',
    title: 'Between-country income inequality (population-weighted), World',
    unit: 'mean log deviation',
    chartId: 'convergence-mld-all',
    adapter: 'convergence', slug: 'mld_all',
    validate: { min: 0, max: 3, monotonicJump: 0.2, requireProvenance: true },
    primarySource: 'World Bank — World Development Indicators (ICP PPP & population)',
  },
  {
    id: 'economy.convergence_mld_ex_giants.world',
    title: 'Between-country income inequality, excluding China & India, World',
    unit: 'mean log deviation',
    chartId: 'convergence-mld-ex-giants',
    adapter: 'convergence', slug: 'mld_ex_chn_ind',
    validate: { min: 0, max: 3, monotonicJump: 0.2, requireProvenance: true },
    primarySource: 'World Bank — World Development Indicators (ICP PPP & population)',
  },

  // ── Ember (direct, CC BY 4.0) — the green-energy transition. OWID's energy graphers blend in
  //    Energy Institute proprietary data (link-only); going to Ember directly is cleanly
  //    re-hostable. These three tell the direction-and-pace story in one breath: wind+solar
  //    exploding (0.2%→15% of electricity), the low-carbon share rising only slowly, yet absolute
  //    fossil generation still climbing — renewables are adding to supply, not yet replacing it. ──
  {
    id: 'energy.wind_solar_share_electricity.world',
    title: 'Share of electricity from wind and solar, World',
    unit: '% of electricity generation',
    chartId: 'wind-solar-share-world',
    adapter: 'ember',
    slug: 'electricity-generation/yearly',
    seriesName: 'Wind and solar',
    sourceColumn: 'share_of_generation_pct',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    // From near-zero, early relative jumps are large but real (content, not error) → warn only.
    validate: { min: 0, max: 100, monotonicJump: 3, requireProvenance: true },
    primarySource: 'Ember — Yearly Electricity Data',
  },
  {
    id: 'energy.clean_share_electricity.world',
    title: 'Share of electricity from low-carbon sources, World',
    unit: '% of electricity generation',
    chartId: 'clean-share-world',
    adapter: 'ember',
    slug: 'electricity-generation/yearly',
    seriesName: 'Clean',                   // Ember "Clean" = renewables + nuclear (low-carbon)
    sourceColumn: 'share_of_generation_pct',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'Ember — Yearly Electricity Data (low-carbon = renewables + nuclear)',
  },
  {
    id: 'energy.fossil_generation.world',
    title: 'Electricity generated from fossil fuels, World',
    unit: 'terawatt-hours',
    chartId: 'fossil-generation-world',
    adapter: 'ember',
    slug: 'electricity-generation/yearly',
    seriesName: 'Fossil',
    sourceColumn: 'generation_twh',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 40000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'Ember — Yearly Electricity Data',
  },
  // Low-carbon electricity share by region (Ember continents) — the transition's several speeds.
  ...(['Europe', 'North America', 'Asia', 'Africa'] as const).map((region) => ({
    id: `energy.clean_share_electricity.${rslug(region)}`,
    title: `Share of electricity from low-carbon sources, ${region}`,
    unit: '% of electricity generation',
    chartId: `clean-share-${rslug(region)}`,
    adapter: 'ember' as const, slug: 'electricity-generation/yearly', seriesName: 'Clean', sourceColumn: 'share_of_generation_pct',
    entityFilter: [region], derive: { op: 'pick_entity' as const, entity: region },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'Ember — Yearly Electricity Data',
  })),

  // ── Green-transition deep article (docs/ARTICLE-green-transition-plan.md). Two more World series
  //    sharpen the "adding, not replacing" catch: solar's lonely exponential (the single fastest-
  //    growing source) and the coal floor that keeps rising despite it. Demand is the mechanism —
  //    clean raced up, but electricity demand raced faster, so fossils kept climbing in absolute TWh. ──
  {
    id: 'energy.solar_share_electricity.world',
    title: 'Share of electricity from solar, World',
    unit: '% of electricity generation',
    chartId: 'solar-share-world',
    adapter: 'ember', slug: 'electricity-generation/yearly', seriesName: 'Solar', sourceColumn: 'share_of_generation_pct',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    // Solar starts at ~0.01% in 2000; early doublings are huge but real → warn only.
    validate: { min: 0, max: 100, monotonicJump: 5, requireProvenance: true },
    primarySource: 'Ember — Yearly Electricity Data',
  },
  {
    id: 'energy.coal_generation.world',
    title: 'Electricity generated from coal, World',
    unit: 'terawatt-hours',
    chartId: 'coal-generation-world',
    adapter: 'ember', slug: 'electricity-generation/yearly', seriesName: 'Coal', sourceColumn: 'generation_twh',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 20000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'Ember — Yearly Electricity Data',
  },
  {
    id: 'energy.electricity_demand.world',
    title: 'Electricity demand, World',
    unit: 'terawatt-hours',
    chartId: 'electricity-demand-world',
    adapter: 'ember', slug: 'electricity-generation/yearly', seriesName: 'Demand', sourceColumn: 'generation_twh',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 50000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'Ember — Yearly Electricity Data',
  },

  // The four-speed world — one entity per transition archetype, three series each (one Ember fetch
  // per country, cached across series). US: the coal collapse (52%→16%). China: most wind+solar AND
  // most coal at once. India: still industrializing — coal share rising. Africa (regional, above) is
  // the fourth speed, where the question is access, not transition.
  ...(['China', 'India', 'United States'] as const).flatMap((country) => {
    const s = rslug(country); // china / india / united-states
    const ember = { adapter: 'ember' as const, slug: 'electricity-generation/yearly', entityFilter: [country], derive: { op: 'pick_entity' as const, entity: country } };
    return [
      {
        id: `energy.clean_share_electricity.${s}`,
        title: `Share of electricity from low-carbon sources, ${country}`,
        unit: '% of electricity generation', chartId: `clean-share-${s}`,
        ...ember, seriesName: 'Clean', sourceColumn: 'share_of_generation_pct',
        validate: { min: 0, max: 100, monotonicJump: 2, requireProvenance: true },
        primarySource: 'Ember — Yearly Electricity Data (low-carbon = renewables + nuclear)',
      },
      {
        id: `energy.wind_solar_share_electricity.${s}`,
        title: `Share of electricity from wind and solar, ${country}`,
        unit: '% of electricity generation', chartId: `wind-solar-share-${s}`,
        ...ember, seriesName: 'Wind and solar', sourceColumn: 'share_of_generation_pct',
        validate: { min: 0, max: 100, monotonicJump: 5, requireProvenance: true },
        primarySource: 'Ember — Yearly Electricity Data',
      },
      {
        id: `energy.coal_generation.${s}`,
        title: `Electricity generated from coal, ${country}`,
        unit: 'terawatt-hours', chartId: `coal-generation-${s}`,
        ...ember, seriesName: 'Coal', sourceColumn: 'generation_twh',
        validate: { min: 0, max: 15000, monotonicJump: 0.5, requireProvenance: true },
        primarySource: 'Ember — Yearly Electricity Data',
      },
    ];
  }),

  // ════════════════════════════════════════════════════════════════════════════════════════════
  // EV ARTICLE (docs/ARTICLE-ev-plan.md) — the electric-car transition. Series come DIRECT from the
  // IEA Global EV Data Explorer (api.iea.org/evs), which is licensed CC BY 4.0 → re-hostable, with
  // downloads (DATA.md §9). LICENCE SPLIT (verified 2026-06-13): the Explorer is CC BY 4.0; the
  // Global EV Outlook *report* data product is "Non-CC Material" (restricted). We re-host only the
  // CC BY Explorer, attribute it, and cite the report. One CSV per region, cached across picks.
  // ════════════════════════════════════════════════════════════════════════════════════════════
  ...((): IndicatorSpec[] => {
    // Pick one IEA (parameter, mode, powertrain) tuple; one region per indicator (cached per region).
    const iea = (parameter: string, mode: string, powertrain: string) => ({
      adapter: 'iea' as const, slug: 'evs',
      license: 'CC BY 4.0',
      primarySource: 'IEA — Global EV Data Explorer (CC BY 4.0)',
      iea: { parameter, mode, powertrain },
    });
    // IEA uses its own region labels for a few entities; keep our slugs/display names friendly.
    const IEA_REGION: Record<string, string> = { 'United States': 'USA', 'Turkey': 'Turkiye' };
    const pick = (entity: string) => {
      const region = IEA_REGION[entity] ?? entity;
      return { entityFilter: [region], derive: { op: 'pick_entity' as const, entity: region } };
    };
    // Units must match the Explorer's declared unit exactly ("percent" / "Vehicles") or validation blocks.

    // Global + regional + country, incl. emerging markets — the four-speed EV world.
    const SHARE_ENTITIES = [
      'World', 'China', 'United States', 'Europe', 'Norway', 'Netherlands', 'Sweden', 'Iceland',
      'Germany', 'United Kingdom', 'France', 'Japan', 'India', 'Brazil', 'Mexico', 'Turkey', 'Chile',
    ] as const;
    const share = SHARE_ENTITIES.map((entity) => ({
      id: `transport.ev_sales_share.${rslug(entity)}`,
      title: `Share of new cars sold that are electric, ${entity}`,
      unit: 'percent', chartId: `ev-sales-share-${rslug(entity)}`,
      ...iea('EV sales share', 'Cars', 'EV'), ...pick(entity),
      // Sales share climbs from a near-zero base; early year-on-year jumps are huge but real.
      validate: { min: 0, max: 100, monotonicJump: 80, requireProvenance: true },
    }));
    // Stocks (cars on the road) — World + the cases that carry the "China dominance" + "stock lags sales".
    const stock = (['World', 'China', 'United States', 'Europe', 'India'] as const).map((entity) => ({
      id: `transport.ev_stock.${rslug(entity)}`,
      title: `Electric cars on the road, ${entity}`,
      unit: 'Vehicles', chartId: `ev-stock-${rslug(entity)}`,
      ...iea('EV stock', 'Cars', 'EV'), ...pick(entity),
      validate: { min: 0, max: 300_000_000, monotonicJump: 80, requireProvenance: true },
    }));
    // Annual units sold — World + China, for "almost two of every three EVs sold are sold in China".
    const sales = (['World', 'China'] as const).map((entity) => ({
      id: `transport.ev_sales.${rslug(entity)}`,
      title: `New electric cars sold per year, ${entity}`,
      unit: 'Vehicles', chartId: `ev-sales-${rslug(entity)}`,
      ...iea('EV sales', 'Cars', 'EV'), ...pick(entity),
      validate: { min: 0, max: 100_000_000, monotonicJump: 80, requireProvenance: true },
    }));
    // The FLEET share — share of cars actually on the road that are electric (the flow-vs-fleet gap).
    const fleet = (['World', 'China', 'United States', 'Norway', 'Europe', 'India'] as const).map((entity) => ({
      id: `transport.ev_fleet_share.${rslug(entity)}`,
      title: `Share of cars on the road that are electric, ${entity}`,
      unit: 'percent', chartId: `ev-fleet-share-${rslug(entity)}`,
      ...iea('EV stock share', 'Cars', 'EV'), ...pick(entity),
      validate: { min: 0, max: 100, monotonicJump: 80, requireProvenance: true },
    }));
    // What's INSIDE the "electric" share: battery-electric vs plug-in hybrid as a share of ALL new
    // car sales. OWID pre-computes this breakdown from the same IEA data; re-hosted under the
    // Explorer's CC BY 4.0 (two value columns → sourceColumn is mandatory, CLAUDE.md gotcha).
    const ievOwid = {
      adapter: 'owid' as const, slug: 'share-car-sales-battery-plugin', license: 'CC BY 4.0',
      primarySource: 'IEA — Global EV Data Explorer (CC BY 4.0), via Our World in Data',
    };
    const split = (['World', 'China'] as const).flatMap((entity) => [
      {
        id: `transport.ev_bev_share.${rslug(entity)}`,
        title: `Battery-electric share of new cars sold, ${entity}`,
        unit: '%', chartId: `ev-bev-share-${rslug(entity)}`,
        ...ievOwid, sourceColumn: 'bev_share_car_sales', ...pick(entity),
        validate: { min: 0, max: 100, monotonicJump: 80, requireProvenance: true },
      },
      {
        id: `transport.ev_phev_share.${rslug(entity)}`,
        title: `Plug-in hybrid share of new cars sold, ${entity}`,
        unit: '%', chartId: `ev-phev-share-${rslug(entity)}`,
        ...ievOwid, sourceColumn: 'phev_share_car_sales', ...pick(entity),
        validate: { min: 0, max: 100, monotonicJump: 80, requireProvenance: true },
      },
    ]);
    // NEW (IEA Explorer, CC BY 4.0): two/three-wheeler electrification — the emerging-Asia story the
    // car metric misses (India's two-wheeler share is ~2.5× its car share; China's is ~50%).
    const twoWheeler = (['World', 'China', 'Viet Nam', 'India', 'Indonesia'] as const).map((entity) => ({
      id: `transport.ev_2_3_wheeler_share.${rslug(entity)}`,
      title: `Share of new two/three-wheelers sold that are electric, ${entity}`,
      unit: 'percent', chartId: `ev-2-3-wheeler-share-${rslug(entity)}`,
      ...iea('EV sales share', '2 and 3 wheelers', 'EV'), ...pick(entity),
      validate: { min: 0, max: 100, monotonicJump: 80, requireProvenance: true },
    }));
    // NEW: electrification by vehicle MODE (World) — cars race ahead, freight lags. Cars + two/three-
    // wheelers are reused from above; here are the heavier modes that round out the picture.
    const byMode = ([['Buses', 'buses'], ['Trucks', 'trucks'], ['Vans', 'vans']] as const).map(([mode, slugm]) => ({
      id: `transport.ev_sales_share_mode.${slugm}`,
      title: `Share of new ${mode.toLowerCase()} sold that are electric, World`,
      unit: 'percent', chartId: `ev-sales-share-mode-${slugm}`,
      ...iea('EV sales share', mode, 'EV'), ...pick('World'),
      validate: { min: 0, max: 100, monotonicJump: 80, requireProvenance: true },
    }));
    return [...share, ...stock, ...sales, ...fleet, ...split, ...twoWheeler, ...byMode];
  })(),

  // ════════════════════════════════════════════════════════════════════════════════════════════
  // KEYSTONE DIMENSIONS — the verified re-host (CC BY/CC0/PD) carrying + counter series for the
  // "Is the world getting better or worse?" hub (docs/ARTICLE-keystone-plan.md, Appendix A). Every
  // slug, column, World row, and unit was curl-verified 2026-06-11. Units match the source's first
  // metadata column exactly (or fall back to the registry unit where the source declares none).
  // ════════════════════════════════════════════════════════════════════════════════════════════

  // ── Climate (despair). CO₂ emissions still rising; concentration the highest in 800k years. ──
  {
    id: 'climate.co2_emissions.world',
    title: 'Annual CO₂ emissions, World',
    unit: 'tonnes',
    chartId: 'co2-emissions-world',
    adapter: 'owid',
    slug: 'annual-co2-emissions-per-country',
    sourceColumn: 'emissions_total',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 60_000_000_000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'Global Carbon Budget (2025) — via Our World in Data',
  },
  {
    id: 'climate.co2_concentration.world',
    title: 'Atmospheric CO₂ concentration, World',
    unit: 'parts per million',
    chartId: 'co2-concentration-world',
    adapter: 'owid',
    slug: 'co2-long-term-concentration',
    sourceColumn: 'co2_concentration',
    entityFilter: ['World'],
    yearMin: 1750,                         // trim the 800,000-year ice-core tail to the modern arc
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 1000, monotonicJump: 0.2, requireProvenance: true },
    primarySource: 'NOAA; EPICA Dome C ice cores — via Our World in Data',
  },
  // CO₂ emissions by world region — the climate **divergence cut** ("who is heating the planet?").
  // Same GCP slug, regional aggregates already inside it → one indicator per region, zero new code;
  // the keystone plots them together via dataRefs[] (the violence article's multi-line pattern).
  ...(['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'] as const).map((region) => ({
    id: `climate.co2_emissions.${region.toLowerCase().replace(/ /g, '_')}`,
    title: `Annual CO₂ emissions, ${region}`,
    unit: 'tonnes',
    chartId: `co2-emissions-${region.toLowerCase().replace(/ /g, '-')}`,
    adapter: 'owid' as const,
    slug: 'annual-co2-emissions-per-country',
    sourceColumn: 'emissions_total',
    entityFilter: [`${region} (GCP)`],
    derive: { op: 'pick_entity' as const, entity: `${region} (GCP)` },
    validate: { min: 0, max: 30_000_000_000, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'Global Carbon Budget (2025) — via Our World in Data',
  })),

  // ── Hunger (confusion). WB FAOSTAT mirror — CC BY (the OWID/FAO series is CC BY-NC-SA, link-only). ──
  {
    id: 'hunger.undernourishment_share.world',
    title: 'Prevalence of undernourishment, World',
    unit: '% of population',
    chartId: 'undernourishment-world',
    adapter: 'worldbank',
    slug: 'SN.ITK.DEFC.ZS',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'FAO, via World Bank World Development Indicators',
  },

  // ── Education (hope). World literacy, 1820→ — the spine of the optimist case. ──
  {
    id: 'education.literacy_rate.world',
    title: 'Literacy rate, World (long run)',
    unit: '%',
    chartId: 'literacy-rate-world',
    adapter: 'owid',
    slug: 'cross-country-literacy-rates',
    sourceColumn: 'literacy_rate',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'UNESCO; Buringh & van Zanden — via Our World in Data',
  },
  // Mean years of schooling — the deeper measure of how much education a population actually got.
  // 1870→2020, World + continents; complements literacy by measuring duration, not just threshold.
  {
    id: 'education.mean_years_schooling.world',
    title: 'Average years of schooling, World',
    unit: 'years',
    chartId: 'mean-years-schooling-world',
    adapter: 'owid',
    slug: 'mean-years-of-schooling',
    sourceColumn: 'mf_youth_and_adults__15_64_years__average_years_of_education',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 20, monotonicJump: 1, requireProvenance: true },
    primarySource: 'UNESCO Institute for Statistics; Lee & Lee — via Our World in Data',
  },
  // School enrollment ladder — primary → secondary → tertiary. WB gross enrollment ratios,
  // World + the six standard WB regions, showing how far up the ladder the average child climbs.
  ...([
    ['primary', 'SE.PRM.ENRR', 'Primary school enrolment', '% gross'],
    ['secondary', 'SE.SEC.ENRR', 'Secondary school enrolment', '% gross'],
    ['tertiary', 'SE.TER.ENRR', 'Tertiary school enrolment', '% gross'],
  ] as const).flatMap(([level, code, title, unit]) => ([
    ['World', 'WLD'],
    ...WB_REGIONS,
  ] as const).map(([name, ent]) => ({
    id: `education.${level}_enrollment.${ent.toLowerCase()}`,
    title: `${title}, ${name}`,
    unit,
    chartId: `${level}-enrollment-${ent.toLowerCase()}`,
    adapter: 'worldbank' as const, slug: code,
    entityFilter: [name], derive: { op: 'pick_entity' as const, entity: ent },
    validate: { min: 0, max: 160, monotonicJump: 5, requireProvenance: true },
    primarySource: 'UNESCO Institute for Statistics, via World Bank',
  }))),

  // Completion rates — the "finishing" story. Enrollment is access; completion is the outcome.
  // WB has clean World + regional series for primary and lower-secondary completion.
  ...([
    ['primary_completion', 'SE.PRM.CMPT.ZS', 'Primary completion rate', '% of relevant age group'],
    ['lower_secondary_completion', 'SE.SEC.CMPT.LO.ZS', 'Lower-secondary completion rate', '% of relevant age group'],
  ] as const).flatMap(([level, code, title, unit]) => ([
    ['World', 'WLD'],
    ...WB_REGIONS,
  ] as const).map(([name, ent]) => ({
    id: `education.${level}.${ent.toLowerCase()}`,
    title: `${title}, ${name}`,
    unit,
    chartId: `${level}-${ent.toLowerCase()}`,
    adapter: 'worldbank' as const, slug: code,
    entityFilter: [name], derive: { op: 'pick_entity' as const, entity: ent },
    validate: { min: 0, max: 120, monotonicJump: 5, requireProvenance: true },
    primarySource: 'UNESCO Institute for Statistics, via World Bank',
  }))),

  // Adult vs youth literacy — the generational gap. Youth literacy is higher everywhere,
  // showing that the rise is still underway and concentrated in younger cohorts.
  ...([
    ['adult_literacy', 'SE.ADT.LITR.ZS', 'Adult literacy rate (15+)', '%'],
    ['youth_literacy', 'SE.ADT.1524.LT.ZS', 'Youth literacy rate (15-24)', '%'],
  ] as const).flatMap(([level, code, title, unit]) => ([
    ['World', 'WLD'],
    ...WB_REGIONS,
  ] as const).map(([name, ent]) => ({
    id: `education.${level}.${ent.toLowerCase()}`,
    title: `${title}, ${name}`,
    unit,
    chartId: `${level}-${ent.toLowerCase()}`,
    adapter: 'worldbank' as const, slug: code,
    entityFilter: [name], derive: { op: 'pick_entity' as const, entity: ent },
    validate: { min: 0, max: 100, monotonicJump: 3, requireProvenance: true },
    primarySource: 'UNESCO Institute for Statistics, via World Bank',
  }))),

  // Out-of-school children — the despair counterpoint to enrollment. OWID carries a clean World
  // series plus SDG-region splits of primary-school-age children not in school (~71M in 2023).
  {
    id: 'education.out_of_school_primary.world',
    title: 'Out-of-school children of primary school age, World',
    unit: 'children',
    chartId: 'out-of-school-primary-world',
    adapter: 'owid',
    slug: 'out-of-school-children-of-primary-school-age-by-world-region',
    sourceColumn: 'out_of_school_children_of_primary_school_age__both_sexes__number',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 200_000_000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UNESCO Institute for Statistics — via Our World in Data',
  },
  ...([
    ['Sub-Saharan Africa (SDG)', 'sub-saharan-africa'],
    ['Central and Southern Asia (SDG)', 'central-and-southern-asia'],
    ['Eastern and South-Eastern Asia (SDG)', 'eastern-and-south-eastern-asia'],
    ['Europe and Northern America (SDG)', 'europe-and-northern-america'],
    ['Northern Africa and Western Asia (SDG)', 'northern-africa-and-western-asia'],
  ] as const).map(([entity, slug]) => ({
    id: `education.out_of_school_primary.${slug.replace(/-/g, '_')}`,
    title: `Out-of-school children of primary school age, ${entity.replace(' (SDG)', '')}`,
    unit: 'children',
    chartId: `out-of-school-primary-${slug}`,
    adapter: 'owid' as const,
    slug: 'out-of-school-children-of-primary-school-age-by-world-region',
    sourceColumn: 'out_of_school_children_of_primary_school_age__both_sexes__number',
    entityFilter: [entity],
    derive: { op: 'pick_entity' as const, entity },
    validate: { min: 0, max: 120_000_000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UNESCO Institute for Statistics — via Our World in Data',
  })),

  // Government education spending — "are we paying for it?" context. World + the six WB regions.
  {
    id: 'education.govt_expenditure.world',
    title: 'Government expenditure on education, World',
    unit: '% of GDP',
    chartId: 'education-expenditure-world',
    adapter: 'worldbank',
    slug: 'SE.XPD.TOTL.GD.ZS',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 20, monotonicJump: 1, requireProvenance: true },
    primarySource: 'UNESCO Institute for Statistics, via World Bank',
  },
  ...WB_REGIONS.map(([name, code]) => ({
    id: `education.govt_expenditure.${code.toLowerCase()}`,
    title: `Government expenditure on education, ${name}`,
    unit: '% of GDP',
    chartId: `education-expenditure-${code.toLowerCase()}`,
    adapter: 'worldbank' as const,
    slug: 'SE.XPD.TOTL.GD.ZS',
    entityFilter: [name],
    derive: { op: 'pick_entity' as const, entity: code },
    validate: { min: 0, max: 20, monotonicJump: 1, requireProvenance: true },
    primarySource: 'UNESCO Institute for Statistics, via World Bank',
  })),

  // Youth NEET — not in employment, education, or training. The post-schooling disengagement
  // indicator: even where schooling is high, the transition to work or further study can fail.
  {
    id: 'youth.neet.world',
    title: 'Youth not in employment, education or training (NEET), World',
    unit: '% of youth population',
    chartId: 'youth-neet-world',
    adapter: 'ilostat',
    slug: 'DF_EIP_2EET_SEX_RT',
    filter: { SEX: 'SEX_T' },
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 50, monotonicJump: 2, requireProvenance: true },
    primarySource: 'International Labour Organization (ILOSTAT, modelled estimates)',
  },

  // ── Freedom (confusion). V-Dem liberal-democracy index — long rise, post-2010s reversal. ──
  {
    id: 'freedom.liberal_democracy_index.world',
    title: 'Liberal democracy index, World',
    unit: 'index (0–1)',                   // source declares no unit → falls back to this
    chartId: 'liberal-democracy-world',
    adapter: 'owid',
    slug: 'liberal-democracy-index',
    sourceColumn: 'libdem_vdem__estimate_best',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 1, monotonicJump: 1, requireProvenance: true },
    primarySource: 'V-Dem (v16) — via Our World in Data',
  },

  // ── Tolerance (hope, in law). Women, Business and the Law index, 1970→. ──
  {
    id: 'rights.women_business_law.world',
    title: 'Women, Business and the Law index, World',
    unit: 'index (0–100)',
    chartId: 'women-business-law-world',
    adapter: 'owid',
    slug: 'women-business-and-the-law-index',
    sourceColumn: 'sg_law_indx',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'World Bank — Women, Business and the Law',
  },

  // ── Nature (despair). Red List (clean) + Living Planet (contested) + forest area (counter). ──
  {
    id: 'nature.red_list_index.world',
    title: 'Red List Index of species survival, World',
    unit: 'index',
    chartId: 'red-list-index-world',
    adapter: 'owid',
    slug: 'red-list-index',
    sourceColumn: '_15_5_1__er_rsk_lst',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 1, monotonicJump: 0.1, requireProvenance: true },
    primarySource: 'BirdLife International & IUCN — via Our World in Data',
  },
  {
    id: 'nature.living_planet_index.world',
    title: 'Living Planet Index, World',
    unit: '(1970 = 1)',
    chartId: 'living-planet-index-world',
    adapter: 'owid',
    slug: 'living-planet-index-by-region',
    sourceColumn: 'lpi_final',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    // CONTESTED (WWF/ZSL vs mean-of-ratios critics) — render with a `contested` epistemic tag.
    // lpi_final is indexed to 1970 = 100 (2020 ≈ 27 → the headline "−73% since 1970").
    validate: { min: 0, max: 200, monotonicJump: 0.2, requireProvenance: true },
    primarySource: 'WWF & Zoological Society of London (2024) — via Our World in Data',
  },
  {
    id: 'nature.forest_area.world',
    title: 'Forest area, World',
    unit: 'hectares',
    chartId: 'forest-area-world',
    adapter: 'owid',
    slug: 'forest-area-km',
    sourceColumn: '_1a_forestarea',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 10_000_000_000, monotonicJump: 0.1, requireProvenance: true },
    primarySource: 'FAO (2025) — via Our World in Data',
  },

  // ── Happiness (confusion). Cantril life-satisfaction (flat) vs the falling suicide rate. ──
  {
    id: 'wellbeing.life_satisfaction.world',
    title: 'Self-reported life satisfaction (Cantril ladder), World',
    unit: 'score (0–10)',                  // source declares no unit → falls back to this
    chartId: 'life-satisfaction-world',
    adapter: 'owid',
    slug: 'happiness-cantril-ladder',
    sourceColumn: 'cantril_ladder_score',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 10, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'World Happiness Report — via Our World in Data',
  },
  {
    id: 'wellbeing.suicide_rate.world',
    title: 'Suicide death rate (age-standardized), World',
    unit: 'deaths per 100,000 people',
    chartId: 'suicide-rate-world',
    adapter: 'owid',
    slug: 'death-rate-from-suicides-gho',   // multi-column by age/sex → pin the age-standardized both-sexes col
    sourceColumn: 'death_rate100k__age_group_age_standardized__sex_both_sexes__cause_self_harm',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 50, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'WHO Global Health Observatory — via Our World in Data',
  },

  // ── Wealth & inequality (despair/confusion). Global top-1% income share + the $6.85 line. ──
  {
    id: 'inequality.income_share_top1.world',
    title: 'Income share of the top 1%, World (before tax)',
    unit: '%',
    chartId: 'income-share-top1-world',
    adapter: 'owid',
    slug: 'income-share-top-1-before-tax-wid',
    sourceColumn: 'share_top_1__welfare_type_before_tax__extrapolated_no',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 100, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'World Inequality Database (WID.world) — via Our World in Data',
  },
  {
    id: 'economy.poverty_685.world',
    title: 'Population below $6.85/day (2017 PPP), World',
    unit: '% of population',
    chartId: 'poverty-685-world',
    adapter: 'worldbank',
    slug: 'SI.POV.UMIC',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'World Bank — Poverty and Inequality Platform',
  },
  // The $8.30/day upper-middle-income line (2021 PPP) — via OWID's PIP mirror. The World Bank rebased
  // its poverty lines from 2017 to 2021 PPP in 2025; $8.30 is the re-expression of the old $6.85 line.
  {
    id: 'economy.poverty_830.world',
    title: 'Population below $8.30/day (2021 PPP), World',
    unit: '%',
    chartId: 'poverty-830-world',
    adapter: 'owid',
    slug: 'share-living-with-less-than-upper-middle-income-poverty-line',
    sourceColumn: 'headcount_ratio__ppp_version_2021__poverty_line_830__welfare_type_income_or_consumption__table_income_or_consumption_consolidated__survey_comparability_no_spells',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'World Bank PIP (2021 PPP) — via Our World in Data',
  },
  // Extreme poverty re-based to the WB's current 2021-PPP line ($3.00/day), via OWID's PIP mirror —
  // the modern standard replacing the 2017-PPP $2.15 line. World + the four regions the chart shows.
  ...[
    ['world', 'World'],
    ['ssf', 'Sub-Saharan Africa (WB)'],
    ['sas', 'South Asia (WB)'],
    ['eas', 'East Asia and Pacific (WB)'],
    ['lcn', 'Latin America and Caribbean (WB)'],
  ].map(([slug, entity]) => ({
    id: `economy.poverty_300.${slug}`,
    title: `Population below $3.00/day (2021 PPP), ${entity.replace(' (WB)', '')}`,
    unit: '%',
    chartId: `poverty-300-${slug}`,
    adapter: 'owid' as const,
    slug: 'share-of-population-in-extreme-poverty',
    sourceColumn: 'headcount_ratio__ppp_version_2021__poverty_line_300__welfare_type_income_or_consumption__table_income_or_consumption_consolidated__survey_comparability_no_spells',
    entityFilter: [entity],
    derive: { op: 'pick_entity' as const, entity },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'World Bank PIP (2021 PPP) — via Our World in Data',
  })),

  // ── Science (confusion). R&D intensity rising (input) vs the productivity question (output). ──
  {
    id: 'science.rnd_spend_gdp.world',
    title: 'Research & development spending (% of GDP), World',
    unit: '% of GDP',
    chartId: 'rnd-spending-world',
    adapter: 'owid',
    slug: 'research-spending-gdp',
    sourceColumn: 'gb_xpd_rsdv_gd_zs',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 10, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UNESCO Institute for Statistics — via Our World in Data',
  },
  {
    id: 'science.publications.world',
    title: 'Scientific and technical journal articles, World',
    unit: 'articles',                      // source declares no unit → falls back to this
    chartId: 'publications-world',
    adapter: 'owid',
    slug: 'scientific-and-technical-journal-articles',
    sourceColumn: 'ip_jrn_artc_sc',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 10_000_000, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'US National Science Foundation — via World Bank / Our World in Data',
  },

  // ── Water & sanitation (hope, with a hard tail). WB mirror is CC BY (OWID's JMP series are
  //    CC BY-NC-SA → link-only); route through the World Bank. ──
  {
    id: 'water.safe_drinking_water.world',
    title: 'Population using safely-managed drinking water, World',
    unit: '% of population',
    chartId: 'safe-drinking-water-world',
    adapter: 'worldbank', slug: 'SH.H2O.SMDW.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'WHO/UNICEF JMP, via World Bank',
  },
  {
    id: 'water.safe_sanitation.world',
    title: 'Population using safely-managed sanitation, World',
    unit: '% of population',
    chartId: 'safe-sanitation-world',
    adapter: 'worldbank', slug: 'SH.STA.SMSS.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'WHO/UNICEF JMP, via World Bank',
  },
  {
    id: 'water.open_defecation.world',
    title: 'Population practising open defecation, World',
    unit: '% of population',
    chartId: 'open-defecation-world',
    adapter: 'worldbank', slug: 'SH.STA.ODFC.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'WHO/UNICEF JMP, via World Bank',
  },

  // ── Technology & connectivity (hope, with a divide). Internet/mobile/electricity — all CC BY. ──
  {
    id: 'technology.internet_users.world',
    title: 'Share of the population using the internet, World',
    unit: '% of population',
    chartId: 'internet-users-world',
    adapter: 'owid', slug: 'share-of-individuals-using-the-internet', sourceColumn: 'it_net_user_zs',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'International Telecommunication Union — via World Bank / Our World in Data',
  },
  {
    id: 'technology.mobile_subscriptions.world',
    title: 'Mobile-cellular subscriptions per 100 people, World',
    unit: 'per 100 people',
    chartId: 'mobile-subscriptions-world',
    adapter: 'owid', slug: 'mobile-cellular-subscriptions-per-100-people', sourceColumn: 'it_cel_sets_p2',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 200, monotonicJump: 2, requireProvenance: true },
    primarySource: 'International Telecommunication Union — via World Bank / Our World in Data',
  },
  {
    id: 'technology.electricity_access.world',
    title: 'Share of the population with access to electricity, World',
    unit: '% of population',
    chartId: 'electricity-access-world',
    adapter: 'owid', slug: 'share-of-the-population-with-access-to-electricity', sourceColumn: 'eg_elc_accs_zs',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'World Bank — Sustainable Development Goals (SDG 7.1.1)',
  },

  // ── Work & jobs (confusion). Vulnerable employment is the clean re-host carrying series;
  //    child labour has no ingestible global time series (gap register). ──
  {
    id: 'work.vulnerable_employment.world',
    title: 'Vulnerable employment (own-account + family workers), World',
    unit: '% of total employment',
    chartId: 'vulnerable-employment-world',
    adapter: 'worldbank', slug: 'SL.EMP.VULN.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'International Labour Organization (modelled), via World Bank',
  },
  {
    id: 'work.unemployment.world',
    title: 'Unemployment rate, World',
    unit: '% of total labor force',
    chartId: 'unemployment-world',
    adapter: 'worldbank', slug: 'SL.UEM.TOTL.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'International Labour Organization (modelled), via World Bank',
  },

  // ── Gender equality (hope, plateauing). Outcomes, not law (the WBL legal index is in tolerance). ──
  {
    id: 'gender.education_parity.world',
    title: 'Gender parity index, school enrolment (female ÷ male), World',
    unit: 'ratio, female to male',
    chartId: 'gender-education-parity-world',
    adapter: 'worldbank', slug: 'SE.ENR.PRSC.FM.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 2, monotonicJump: 0.2, requireProvenance: true },
    primarySource: 'UNESCO Institute for Statistics, via World Bank',
  },
  {
    id: 'gender.maternal_mortality.world',
    title: 'Maternal mortality ratio, World',
    unit: 'deaths per 100,000 live births',
    chartId: 'maternal-mortality-world',
    adapter: 'worldbank', slug: 'SH.STA.MMRT',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 2000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'WHO, UNICEF, UNFPA, World Bank Group (MMEIG)',
  },
  {
    id: 'gender.women_in_parliament.world',
    title: 'Share of parliamentary seats held by women, World',
    unit: '% of seats',
    chartId: 'women-in-parliament-world',
    adapter: 'worldbank', slug: 'SG.GEN.PARL.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'Inter-Parliamentary Union, via World Bank',
  },
  {
    id: 'gender.labour_force_ratio.world',
    title: 'Female-to-male labour-force participation ratio, World',
    unit: '%',
    chartId: 'gender-labour-ratio-world',
    adapter: 'worldbank', slug: 'SL.TLF.CACT.FM.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'International Labour Organization (modelled), via World Bank',
  },
  // The Gender Inequality Index (UNDP HDR, CC BY 3.0 IGO) — the gender gap as one composite number
  // (reproductive health + empowerment + labour), 0 = full equality → 1 = maximum inequality. Gives
  // the dimension a regional split of the WHOLE gap, not just schooling. World + four regions worst→best.
  ...[
    ['world', 'World'],
    ['ssf', 'Sub-Saharan Africa (UNDP)'],
    ['sas', 'South Asia (UNDP)'],
    ['lcn', 'Latin America and the Caribbean (UNDP)'],
    ['eca', 'Europe and Central Asia (UNDP)'],
  ].map(([slug, entity]) => ({
    id: `gender.gii.${slug}`,
    title: `Gender Inequality Index, ${entity.replace(' (UNDP)', '')}`,
    unit: 'index (0 = parity)',
    chartId: `gender-gii-${slug}`,
    adapter: 'owid' as const,
    slug: 'gender-inequality-index-from-the-human-development-report',
    sourceColumn: 'gii',
    entityFilter: [entity],
    derive: { op: 'pick_entity' as const, entity },
    validate: { min: 0, max: 1, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UNDP, Human Development Report',
  })),

  // ── Demography (confusion). Fertility collapsing toward replacement; the world aging. ──
  {
    id: 'demography.fertility_rate.world',
    title: 'Fertility rate (children per woman), World',
    unit: 'live births per woman',
    chartId: 'fertility-rate-world',
    adapter: 'owid', slug: 'children-per-woman-un',
    sourceColumn: 'fertility_rate__sex_all__age_all__variant_estimates',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 10, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UN World Population Prospects (2024) — via Our World in Data',
  },
  {
    id: 'demography.pop_65plus.world',
    title: 'Share of the population aged 65 and over, World',
    unit: '% of total population',
    chartId: 'pop-65plus-world',
    adapter: 'worldbank', slug: 'SP.POP.65UP.TO.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UN World Population Prospects, via World Bank',
  },

  // ── "Is the world running out of children?" (the fertility deep-dive). The population trajectory,
  // its growth rate, and the births/deaths flows — each split into history (estimates, solid) and the
  // UN WPP medium projection (dashed), as ONE indicator per OWID column. NB the OWID adapter reads the
  // unit of the *first* metadata column, so each slug's col0 unit is pinned in `unit` below (births →
  // `number-of-births-per-year` where col0 IS births; deaths → `…projected-to-2100` where col0 IS deaths).
  {
    id: 'demography.pop_growth_rate.world',
    title: 'Population growth rate, World (historical)',
    unit: '%',
    chartId: 'pop-growth-rate-world',
    adapter: 'owid', slug: 'population-growth-rates',
    sourceColumn: 'growth_rate__sex_all__age_all__variant_estimates',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: -3, max: 4, monotonicJump: 1, requireProvenance: true },
    primarySource: 'UN World Population Prospects (2024) — via Our World in Data',
  },
  {
    id: 'demography.pop_growth_rate_proj.world',
    title: 'Population growth rate, World (UN medium projection)',
    unit: '%',
    chartId: 'pop-growth-rate-proj-world',
    adapter: 'owid', slug: 'population-growth-rates',
    sourceColumn: 'growth_rate__sex_all__age_all__variant_medium__projected',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: -3, max: 4, monotonicJump: 1, requireProvenance: true },
    primarySource: 'UN World Population Prospects (2024) — via Our World in Data',
  },
  {
    id: 'demography.births.world',
    title: 'Births per year, World (historical)',
    unit: 'births',
    chartId: 'births-world',
    adapter: 'owid', slug: 'number-of-births-per-year',
    sourceColumn: 'births__sex_all__age_all__variant_estimates',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 200000000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UN World Population Prospects (2024) — via Our World in Data',
  },
  {
    id: 'demography.births_proj.world',
    title: 'Births per year, World (UN medium projection)',
    unit: 'births',
    chartId: 'births-proj-world',
    adapter: 'owid', slug: 'number-of-births-per-year',
    sourceColumn: 'births__sex_all__age_all__variant_medium__projected',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 200000000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UN World Population Prospects (2024) — via Our World in Data',
  },
  {
    id: 'demography.deaths.world',
    title: 'Deaths per year, World (historical)',
    unit: 'deaths',
    chartId: 'deaths-world',
    adapter: 'owid', slug: 'births-and-deaths-projected-to-2100',
    sourceColumn: 'deaths__sex_all__age_all__variant_estimates',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 200000000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UN World Population Prospects (2024) — via Our World in Data',
  },
  {
    id: 'demography.deaths_proj.world',
    title: 'Deaths per year, World (UN medium projection)',
    unit: 'deaths',
    chartId: 'deaths-proj-world',
    adapter: 'owid', slug: 'births-and-deaths-projected-to-2100',
    sourceColumn: 'deaths__sex_all__age_all__variant_medium__projected',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 200000000, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UN World Population Prospects (2024) — via Our World in Data',
  },
  {
    id: 'demography.median_age.world',
    title: 'Median age, World (historical)',
    unit: 'years',
    chartId: 'median-age-world',
    adapter: 'owid', slug: 'median-age',
    sourceColumn: 'median_age__sex_all__age_all__variant_estimates',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 80, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UN World Population Prospects (2024) — via Our World in Data',
  },
  {
    id: 'demography.median_age_proj.world',
    title: 'Median age, World (UN medium projection)',
    unit: 'years',
    chartId: 'median-age-proj-world',
    adapter: 'owid', slug: 'median-age',
    sourceColumn: 'median_age__sex_all__age_all__variant_medium__projected',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 80, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UN World Population Prospects (2024) — via Our World in Data',
  },
  {
    id: 'demography.old_age_dependency.world',
    title: 'Old-age dependency ratio, World',
    unit: '% of working-age population',
    chartId: 'old-age-dependency-world',
    adapter: 'worldbank', slug: 'SP.POP.DPND.OL',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UN World Population Prospects, via World Bank',
  },
  {
    id: 'demography.population.world',
    title: 'Population, World (historical)',
    unit: 'people',
    chartId: 'population-world',
    adapter: 'owid', slug: 'population-long-run-with-projections',
    sourceColumn: 'population_historical',
    yearMin: 1950,
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 12000000000, monotonicJump: 0.2, requireProvenance: true },
    primarySource: 'UN World Population Prospects (2024); HYDE; Gapminder — via Our World in Data',
  },
  {
    id: 'demography.population_proj.world',
    title: 'Population, World (UN medium projection)',
    unit: 'people',
    chartId: 'population-proj-world',
    adapter: 'owid', slug: 'population-long-run-with-projections',
    sourceColumn: 'population_projection__projected',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 12000000000, monotonicJump: 0.2, requireProvenance: true },
    primarySource: 'UN World Population Prospects (2024); HYDE; Gapminder — via Our World in Data',
  },
  // The canary countries — the lowest-low (Korea, China, Japan) and the high-fertility contrast
  // (Niger), all from the SAME world-line slug, one pick per country (zero new code).
  ...(['South Korea', 'China', 'Japan', 'Italy', 'Niger', 'Nigeria'] as const).map((c) => ({
    id: `demography.fertility_rate.${rslug(c)}`,
    title: `Fertility rate (children per woman), ${c}`,
    unit: 'live births per woman',
    chartId: `fertility-${rslug(c)}`,
    adapter: 'owid' as const, slug: 'children-per-woman-un',
    sourceColumn: 'fertility_rate__sex_all__age_all__variant_estimates',
    entityFilter: [c], derive: { op: 'pick_entity' as const, entity: c },
    validate: { min: 0, max: 10, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UN World Population Prospects (2024) — via Our World in Data',
  })),

  // ── UN WPP 2024 direct (authoritative, CC BY 3.0 IGO) — the cuts the OWID/WB mirrors don't carry.
  // One bulk file (slug 'wpp-medium') serves all of these; pick the column with `sourceColumn`,
  // the location with `entityFilter` (name / ISO3 / LocID). Trimmed to the estimate era (≤2024).
  {
    id: 'demography.mean_age_childbearing.world',
    title: 'Mean age of mothers at childbearing, World',
    unit: 'years',
    chartId: 'mean-age-childbearing-world',
    adapter: 'unwpp', slug: 'wpp-medium', sourceColumn: 'MAC',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    yearMax: 2024,
    validate: { min: 20, max: 40, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UN World Population Prospects 2024',
  },
  ...([['World', 'World'], ['China', 'China'], ['India', 'India'], ['Republic of Korea', 'South Korea'], ['Azerbaijan', 'Azerbaijan']] as const).map(([loc, disp]) => ({
    id: `demography.sex_ratio_birth.${rslug(disp)}`,
    title: `Sex ratio at birth, ${disp}`,
    unit: 'male births per 100 female births',
    chartId: `sex-ratio-birth-${rslug(disp)}`,
    adapter: 'unwpp' as const, slug: 'wpp-medium', sourceColumn: 'SRB',
    entityFilter: [loc], derive: { op: 'pick_entity' as const, entity: loc },
    yearMax: 2024,
    validate: { min: 90, max: 130, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UN World Population Prospects 2024',
  })),
  ...([
    ['High-income countries', 'high-income'],
    ['Upper-middle-income countries', 'upper-middle-income'],
    ['Lower-middle-income countries', 'lower-middle-income'],
    ['Low-income countries', 'low-income'],
  ] as const).map(([name, slug]) => ({
    id: `demography.net_migration_rate.${slug.replace(/-/g, '_')}`,
    title: `Net migration rate, ${name}`,
    unit: 'net migrants per 1,000 people',
    chartId: `net-migration-${slug}`,
    adapter: 'unwpp' as const, slug: 'wpp-medium', sourceColumn: 'CNMR',
    entityFilter: [name], derive: { op: 'pick_entity' as const, entity: name },
    yearMax: 2024,
    validate: { min: -50, max: 50, monotonicJump: 3, requireProvenance: true },
    primarySource: 'UN World Population Prospects 2024',
  })),
  // The genuine projection fan — UN low & high variants for World population (the medium is the
  // OWID series `population-proj-world`). Source is in thousands → valueScale 1000 to match (people).
  ...(['Low', 'High'] as const).map((variant) => ({
    id: `demography.population_${variant.toLowerCase()}.world`,
    title: `Population, World (UN ${variant} variant projection)`,
    unit: 'people',
    chartId: `population-${variant.toLowerCase()}-world`,
    adapter: 'unwpp' as const, slug: 'wpp-variants', sourceColumn: 'TPopulation1July',
    filter: { variant }, valueScale: 1000,
    entityFilter: ['World'], derive: { op: 'pick_entity' as const, entity: 'World' },
    validate: { min: 0, max: 16000000000, monotonicJump: 0.2, requireProvenance: true },
    primarySource: 'UN World Population Prospects 2024',
  })),

  // ── The drivers — the "why it fell" (the choice story). Existing OWID/WB adapters, World lines.
  {
    id: 'demography.female_secondary_enrolment.world',
    title: 'Girls in secondary school, World',
    unit: '% gross enrolment',
    chartId: 'female-secondary-world',
    adapter: 'worldbank', slug: 'SE.SEC.ENRR.FE',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 160, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UNESCO Institute for Statistics, via World Bank',
  },
  {
    id: 'demography.female_labour.world',
    title: "Women's labour-force participation, World",
    unit: '% of women aged 15+',
    chartId: 'female-labour-world',
    adapter: 'worldbank', slug: 'SL.TLF.CACT.FE.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'International Labour Organization (modelled), via World Bank',
  },
  {
    id: 'demography.adolescent_fertility.world',
    title: 'Adolescent fertility rate, World',
    unit: 'births per 1,000 women aged 15–19',
    chartId: 'adolescent-fertility-world',
    adapter: 'worldbank', slug: 'SP.ADO.TFRT',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 250, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'UN Population Division, via World Bank',
  },
  {
    id: 'demography.contraception_modern.world',
    title: 'Women using modern contraception, World',
    unit: '% of women aged 15–49',
    chartId: 'contraception-modern-world',
    adapter: 'worldbank', slug: 'SP.DYN.CONM.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'UN Population Division; DHS — via World Bank',
  },

  // ════════════════════════════════════════════════════════════════════════════════════════════
  // THE REGIONAL PASS — divergence cuts ("who the average hides"). Each block spawns one indicator
  // per region from the SAME carrying slug, zero new code (proven on climate). Region entity names
  // are curl-verified from each slug's aggregate rows (keystone §8 step 2b).
  // ════════════════════════════════════════════════════════════════════════════════════════════

  // Education — literacy by UN-SDG region.
  ...(['Sub-Saharan Africa (SDG)', 'Central and Southern Asia (SDG)', 'Eastern and South-Eastern Asia (SDG)',
       'Latin America and the Caribbean (SDG)', 'Europe and Northern America (SDG)', 'Northern Africa and Western Asia (SDG)'
  ] as const).map((region) => ({
    id: `education.literacy_rate.${rslug(region)}`,
    title: `Literacy rate, ${region.replace(/ \(SDG\)/, '')}`,
    unit: '%',
    chartId: `literacy-rate-${rslug(region)}`,
    adapter: 'owid' as const, slug: 'cross-country-literacy-rates', sourceColumn: 'literacy_rate',
    entityFilter: [region], derive: { op: 'pick_entity' as const, entity: region },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'UNESCO; Buringh & van Zanden — via Our World in Data',
  })),

  // Freedom — liberal democracy by region (population-weighted: the average person's experience).
  ...(['Africa (population-weighted)', 'Asia (population-weighted)', 'Europe (population-weighted)',
       'North America (population-weighted)', 'South America (population-weighted)', 'Oceania (population-weighted)'
  ] as const).map((region) => ({
    id: `freedom.liberal_democracy_index.${rslug(region)}`,
    title: `Liberal democracy index, ${region.replace(/ \(population-weighted\)/, '')}`,
    unit: 'index (0–1)',
    chartId: `liberal-democracy-${rslug(region)}`,
    adapter: 'owid' as const, slug: 'liberal-democracy-index', sourceColumn: 'libdem_vdem__estimate_best',
    entityFilter: [region], derive: { op: 'pick_entity' as const, entity: region },
    validate: { min: 0, max: 1, monotonicJump: 1, requireProvenance: true },
    primarySource: 'V-Dem (v16) — via Our World in Data',
  })),

  // Inequality — top-1% income share by WID region.
  ...(['Sub-Saharan Africa (WID)', 'East Asia (WID)', 'South & South-East Asia (WID)', 'Europe (WID)',
       'North America (WID)', 'Latin America (WID)', 'Russia and Central Asia (WID)', 'Oceania (WID)'
  ] as const).map((region) => ({
    id: `inequality.income_share_top1.${rslug(region)}`,
    title: `Income share of the top 1%, ${region.replace(/ \(WID\)/, '')} (before tax)`,
    unit: '%',
    chartId: `income-share-top1-${rslug(region)}`,
    adapter: 'owid' as const, slug: 'income-share-top-1-before-tax-wid',
    sourceColumn: 'share_top_1__welfare_type_before_tax__extrapolated_no',
    entityFilter: [region], derive: { op: 'pick_entity' as const, entity: region },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'World Inequality Database (WID.world) — via Our World in Data',
  })),

  // World-Bank-sourced dimensions — regional cut via the standard WB region aggregates (one
  // indicator per dimension × region). Poverty · water · gender parity · vulnerable employment.
  ...([
    { cid: 'extreme-poverty', base: 'economy.extreme_poverty', code: 'SI.POV.DDAY', title: 'Population in extreme poverty', unit: '% of population', max: 100, src: 'World Bank — Poverty and Inequality Platform' },
    { cid: 'undernourishment', base: 'hunger.undernourishment_share', code: 'SN.ITK.DEFC.ZS', title: 'Prevalence of undernourishment', unit: '% of population', max: 100, src: 'FAO, via World Bank' },
    { cid: 'safe-drinking-water', base: 'water.safe_drinking_water', code: 'SH.H2O.SMDW.ZS', title: 'Population using safely-managed drinking water', unit: '% of population', max: 100, src: 'WHO/UNICEF JMP, via World Bank' },
    { cid: 'gender-education-parity', base: 'gender.education_parity', code: 'SE.ENR.PRSC.FM.ZS', title: 'Gender parity index, school enrolment', unit: 'ratio, female to male', max: 2, src: 'UNESCO Institute for Statistics, via World Bank' },
    { cid: 'vulnerable-employment', base: 'work.vulnerable_employment', code: 'SL.EMP.VULN.ZS', title: 'Vulnerable employment', unit: '% of total employment', max: 100, src: 'International Labour Organization (modelled), via World Bank' },
    { cid: 'gdp-per-capita', base: 'economy.gdp_per_capita', code: 'NY.GDP.PCAP.KD', title: 'GDP per capita', unit: 'constant 2015 US$', max: 200000, src: 'World Bank / OECD' },
    { cid: 'internet-users', base: 'technology.internet_users', code: 'IT.NET.USER.ZS', title: 'Internet users', unit: '% of population', max: 100, src: 'ITU, via World Bank' },
    { cid: 'fertility-rate', base: 'demography.fertility_rate', code: 'SP.DYN.TFRT.IN', title: 'Fertility rate', unit: 'live births per woman', max: 10, src: 'UN WPP, via World Bank' },
    { cid: 'road-deaths', base: 'safety.road_deaths', code: 'SH.STA.TRAF.P5', title: 'Road traffic death rate', unit: 'per 100,000', max: 100, src: 'WHO, via World Bank' },
    { cid: 'smoking', base: 'substance.smoking', code: 'SH.PRV.SMOK', title: 'Adult smoking', unit: '% of adults', max: 100, src: 'WHO, via World Bank' },
    { cid: 'child-mortality', base: 'health.child_mortality_wb', code: 'SH.DYN.MORT', title: 'Under-5 mortality rate', unit: 'per 1,000 live births', max: 400, src: 'UN IGME, via World Bank' },
    { cid: 'trade-share-gdp', base: 'trade.trade_share_gdp', code: 'NE.TRD.GNFS.ZS', title: 'Trade as a share of GDP', unit: '% of GDP', max: 300, src: 'World Bank national accounts' },
    { cid: 'rnd-spending', base: 'science.rnd_spend_gdp', code: 'GB.XPD.RSDV.GD.ZS', title: 'Research & development spending', unit: '% of GDP', max: 10, src: 'UNESCO Institute for Statistics, via World Bank' },
    { cid: 'forest-pct', base: 'nature.forest_pct', code: 'AG.LND.FRST.ZS', title: 'Forest area', unit: '% of land area', max: 100, src: 'FAO, via World Bank' },
  ] as const).flatMap((ind) => WB_REGIONS.map(([name, code]) => ({
    id: `${ind.base}.${code.toLowerCase()}`,
    title: `${ind.title}, ${name}`,
    unit: ind.unit,
    chartId: `${ind.cid}-${code.toLowerCase()}`,
    adapter: 'worldbank' as const, slug: ind.code,
    entityFilter: [name], derive: { op: 'pick_entity' as const, entity: code },
    validate: { min: 0, max: ind.max, monotonicJump: 2, requireProvenance: true },
    primarySource: ind.src,
  }))),

  // ── World Bank PIP — the authoritative poverty surface, via the `pip` adapter. The COUNT of poor
  // (pop_in_poverty), mean income, and the societal (relative) rate (spr) — the numbers the WDI REST
  // API does NOT carry (it has only the RATE). We pull these straight from the source rather than
  // reconstruct them (DATA.md §1.3 — never magic-number what the producer publishes). One (povline)
  // fetch carries every measure for World + all WB regions, so these 35 indicators issue just three
  // network calls. The grp endpoint gives the combined Sub-Saharan Africa (SSF) AND the AFE/AFW split
  // AND North America (NAC) — more granular than the WDI region set. 2021 PPP throughout.
  ...((): IndicatorSpec[] => {
    // [PIP region_code, display name, chart slug]
    const PIP = [
      ['WLD', 'World', 'world'], ['SSF', 'Sub-Saharan Africa', 'ssf'],
      ['EAS', 'East Asia & Pacific', 'eas'], ['SAS', 'South Asia', 'sas'],
      ['ECS', 'Europe & Central Asia', 'ecs'], ['LCN', 'Latin America & Caribbean', 'lcn'],
      ['MEA', 'Middle East, North Africa, Afghanistan & Pakistan', 'mea'], ['NAC', 'North America', 'nac'],
      ['AFE', 'Eastern & Southern Africa', 'afe'], ['AFW', 'Western & Central Africa', 'afw'],
    ] as const;
    const base = (line: number) => ({
      adapter: 'pip' as const, pipEndpoint: 'pip-grp' as const, pppVersion: 2021, povline: line,
      slug: `pip-grp/wb/${line.toFixed(2)}/2021`,   // shared per line → one snapshot + one memoised fetch
      primarySource: 'World Bank — Poverty and Inequality Platform',
    });
    const out: IndicatorSpec[] = [];
    // 1. Authoritative COUNT of extreme poor (millions) at $3.00 — World + all regions (M6/M11).
    //    The rate falls everywhere; the COUNT rises where population outruns progress (the SSA crossover).
    for (const [code, name, slug] of PIP) out.push({
      ...base(3.0), id: `economy.poor_count.${slug}`,
      title: `Number of people in extreme poverty (below $3.00/day, 2021 PPP), ${name}`,
      unit: 'million people', chartId: `poor-count-${slug}`,
      sourceColumn: 'pop_in_poverty', valueScale: 1e-6, entityFilter: [code],
      validate: { min: 0, max: 2500, monotonicJump: 0.5, requireProvenance: true },
    });
    // 2. Mean income/consumption (PPP$/day) by region — "who is getting richer" (M15).
    for (const [code, name, slug] of PIP) out.push({
      ...base(3.0), id: `economy.mean_income.${slug}`,
      title: `Mean income or consumption per day, ${name}`,
      unit: 'PPP$ per day (2021)', chartId: `mean-income-${slug}`,
      sourceColumn: 'mean', entityFilter: [code],
      validate: { min: 0, max: 300, monotonicJump: 0.5, requireProvenance: true },
    });
    // 3. Societal (relative) poverty rate (spr) — rises with the median, so you can't grow out of it (M9).
    for (const [code, name, slug] of PIP) out.push({
      ...base(3.0), id: `economy.societal_poverty.${slug}`,
      title: `Societal (relative) poverty rate, ${name}`,
      unit: '% of population', chartId: `societal-poverty-${slug}`,
      sourceColumn: 'spr', valueScale: 100, entityFilter: [code],
      validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    });
    // 4. The ladder of lines — World headcount RATE at $3.00 / $4.20 / $8.30 (M5), plus the
    //    rich-country reference line $30.00 (Roser's thought experiment: the poverty line a wealthy
    //    country draws for itself, applied to the world), and the COUNT at the two upper WB lines
    //    (M6; the $3.00 count is already above). Each line is its own fetch.
    for (const [line, ls] of [[3.0, '300'], [4.2, '420'], [8.3, '830'], [30.0, '3000']] as const) out.push({
      ...base(line), id: `economy.poverty_rate_${ls}.world`,
      title: `Population below $${line.toFixed(2)}/day (2021 PPP), World`,
      unit: '% of population', chartId: `poverty-rate-${ls}-world`,
      sourceColumn: 'headcount', valueScale: 100, entityFilter: ['WLD'],
      validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    });
    for (const [line, ls] of [[4.2, '420'], [8.3, '830']] as const) out.push({
      ...base(line), id: `economy.poor_count_${ls}.world`,
      title: `Number of people below $${line.toFixed(2)}/day (2021 PPP), World`,
      unit: 'million people', chartId: `poor-count-${ls}-world`,
      sourceColumn: 'pop_in_poverty', valueScale: 1e-6, entityFilter: ['WLD'],
      validate: { min: 0, max: 7000, monotonicJump: 0.5, requireProvenance: true },
    });
    // 5. The poverty GAP at $3.00 — depth, not headcount: the mean shortfall below the line as a
    //    share of the line (the poor counted at their distance, the non-poor at zero). Incidence asks
    //    HOW MANY are poor; the gap asks HOW POOR. Asia's gap collapsed with its count; Africa's holds.
    for (const [code, name, slug] of PIP) out.push({
      ...base(3.0), id: `economy.poverty_gap.${slug}`,
      title: `Poverty gap at $3.00/day (2021 PPP), ${name}`,
      unit: '% of the poverty line', chartId: `poverty-gap-${slug}`,
      sourceColumn: 'poverty_gap', valueScale: 100, entityFilter: [code],
      validate: { min: 0, max: 60, monotonicJump: 0.5, requireProvenance: true },
    });
    return out;
  })(),

  // ════════════════════════════════════════════════════════════════════════════════════════════
  // NEW SOURCE ADAPTERS — open databases beyond OWID/WB that tell stories those two can't re-host.
  // ════════════════════════════════════════════════════════════════════════════════════════════

  // Climate — surface-temperature anomaly, NASA GISTEMP v4 (Public Domain). The iconic warming
  // curve, re-hostable (the OWID temperature series is OGL v3, outside the gate).
  {
    id: 'climate.temperature_anomaly.world',
    title: 'Global surface temperature anomaly (vs 1951–1980), World',
    unit: '°C',
    chartId: 'temperature-anomaly-world',
    adapter: 'nasa', slug: 'GISTEMP',
    yearMax: 2025,
    validate: { min: -2, max: 4, monotonicJump: 2, requireProvenance: true },
    primarySource: 'NASA Goddard Institute for Space Studies — GISTEMP v4',
  },
  // Land vs land+ocean — the split the single global curve hides. Berkeley Earth (CC BY 4.0), same
  // Jan 1951–Dec 1980 baseline as GISTEMP, so the two lines share one axis: land air temperature
  // has warmed far faster than the planet as a whole, because the oceans (70% of the surface) soak
  // up most of the heat and warm slowly. The gap between these lines IS the ocean's drag.
  // The same global warming from an independent record: Copernicus/ECMWF ERA5 reanalysis, via the
  // Climate Pulse flat-CSV service (C3S, free reuse w/ attribution). Daily 2 m temperature averaged
  // to annual and re-baselined to 1951–1980 so it overlays GISTEMP — two independent methods, one
  // answer. The most current record (updated daily); the annual line runs to the last complete year.
  {
    id: 'climate.temperature_anomaly_era5.world',
    title: 'Global temperature anomaly, ERA5 reanalysis (vs 1951–1980), World',
    unit: '°C',
    chartId: 'temperature-anomaly-era5-world',
    adapter: 'copernicus', slug: '2t_global',
    yearMin: 1940,
    validate: { min: -1, max: 3, monotonicJump: 2, requireProvenance: true },
    primarySource: 'Copernicus Climate Change Service (C3S) / ECMWF — ERA5',
  },
  {
    id: 'climate.temperature_anomaly_land.world',
    title: 'Land surface temperature anomaly (vs 1951–1980), World',
    unit: '°C',
    chartId: 'temperature-anomaly-land-world',
    adapter: 'berkeley', slug: 'land',
    yearMin: 1850, yearMax: 2024,
    validate: { min: -3, max: 4, monotonicJump: 2, requireProvenance: true },
    primarySource: 'Berkeley Earth — Rohde & Hausfather (2020)',
  },
  {
    id: 'climate.temperature_anomaly_landocean.world',
    title: 'Land and ocean temperature anomaly (vs 1951–1980), World',
    unit: '°C',
    chartId: 'temperature-anomaly-landocean-world',
    adapter: 'berkeley', slug: 'land_ocean',
    yearMin: 1850, yearMax: 2024,
    validate: { min: -2, max: 4, monotonicJump: 2, requireProvenance: true },
    primarySource: 'Berkeley Earth — Rohde & Hausfather (2020)',
  },
  // The visible consequences. Global mean sea level, 1880→ (CSIRO reconstruction + NOAA satellite,
  // Public Domain via U.S. EPA) — the rising ocean, in centimetres on a 1880 = 0 datum.
  {
    id: 'climate.sea_level.world',
    title: 'Global mean sea-level rise (vs 1880), World',
    unit: 'centimetres',
    chartId: 'sea-level-world',
    adapter: 'sealevel', slug: 'epa-sea-level',
    validate: { min: -5, max: 60, monotonicJump: 1, requireProvenance: true },
    primarySource: 'CSIRO; NOAA Laboratory for Satellite Altimetry — via U.S. EPA',
  },
  // Arctic sea ice at its September minimum, 1979→ (NSIDC Sea Ice Index, Public Domain; reached via
  // the OWID grapher, year-grained so the standard OWID adapter handles it). The clearest single
  // fingerprint of warming: the frozen cap shrinking by roughly a third in four decades.
  {
    id: 'climate.arctic_sea_ice.world',
    title: 'Arctic sea-ice extent, September minimum, World',
    unit: 'million square kilometers',
    chartId: 'arctic-sea-ice-world',
    adapter: 'owid', slug: 'arctic-sea-ice',
    sourceColumn: 'arctic_sea_ice_extent_min',
    entityFilter: ['Arctic Ocean'],
    derive: { op: 'pick_entity', entity: 'Arctic Ocean' },
    license: 'Public Domain (NSIDC Sea Ice Index)',
    validate: { min: 2, max: 20, monotonicJump: 2, requireProvenance: true },
    primarySource: 'National Snow and Ice Data Center (NSIDC) — Sea Ice Index v3',
  },
  // The human cost (link-only — EM-DAT and IHME are restricted; chart + cite, never re-host). The
  // decoupling: recorded weather/climate disasters rose steeply over the century (much of it better
  // reporting), yet the death toll did not climb with them — early warning and response keep cutting
  // the lethality per disaster. Earthquakes excluded from the event count (geophysical, not climate).
  {
    id: 'climate.disaster_events.world',
    title: 'Recorded climate-related disasters (excl. earthquakes), World',
    unit: 'events',
    chartId: 'disaster-events-world',
    adapter: 'owid', slug: 'number-of-natural-disaster-events',
    sourceColumn: 'n_events',
    entityFilter: ['All disasters excluding earthquakes'],
    derive: { op: 'pick_entity', entity: 'All disasters excluding earthquakes' },
    gate: 'link-only',
    license: 'EM-DAT, CRED / UCLouvain — link-only (restricted)',
    // From a handful a year to hundreds; early relative jumps are large but real (reporting growth) → warn only.
    validate: { min: 0, max: 1000, monotonicJump: 5, requireProvenance: true },
    primarySource: 'EM-DAT — CRED / UCLouvain, via Our World in Data',
  },
  {
    id: 'climate.disaster_deaths.world',
    title: 'Deaths from natural disasters, World',
    unit: 'deaths',
    chartId: 'disaster-deaths-world',
    adapter: 'owid', slug: 'deaths-from-natural-disasters',
    sourceColumn: 'death_count__age_group_allages__sex_both_sexes__cause_natural_disasters',
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    gate: 'link-only',
    license: 'IHME Global Burden of Disease — link-only (non-commercial)',
    // Spiky by nature — single catastrophes (2004 tsunami) dwarf ordinary years → warn only.
    validate: { min: 0, max: 1_000_000, monotonicJump: 50, requireProvenance: true },
    primarySource: 'IHME Global Burden of Disease (2021), via Our World in Data',
  },

  // ════════════════════════════════════════════════════════════════════════════════════════════
  // CLIMATE MEGA-ARTICLE (docs/ARTICLE-climate-plan.md) — the comprehensive build. ACT I: THE CAUSE.
  // Cumulative responsibility · the other gases · what emits, by sector · decoupling · offshoring.
  // All Global Carbon Budget / Jones et al. (2025) / Climate Watch via OWID (CC BY). World + the six
  // continents; country bars are emitted by scripts/analysis/country-cross-sections.ts.
  // ════════════════════════════════════════════════════════════════════════════════════════════
  // Cumulative CO₂ — historical responsibility. World total ≈ 1.85 trillion tonnes; the country bar
  // carries the split (US 23.5%, EU 16%, China 15%).
  {
    id: 'climate.cumulative_co2.world', title: 'Cumulative CO₂ emissions, World', unit: 'tonnes',
    chartId: 'cumulative-co2-world', adapter: 'owid', slug: 'cumulative-co2-emissions',
    sourceColumn: 'cumulative_emissions_total', entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 3_000_000_000_000, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'Global Carbon Budget (2025) — via Our World in Data',
  },
  // The other greenhouse gases — methane (CH₄) and nitrous oxide (N₂O), in CO₂-equivalent tonnes.
  {
    id: 'climate.methane.world', title: 'Methane (CH₄) emissions, World', unit: 'tonnes of CO₂ equivalents',
    chartId: 'methane-world', adapter: 'owid', slug: 'methane-emissions',
    sourceColumn: 'annual_emissions_ch4_total_co2eq', entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 20_000_000_000, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'Jones et al. (2025); Global Carbon Project — via Our World in Data',
  },
  {
    id: 'climate.n2o.world', title: 'Nitrous oxide (N₂O) emissions, World', unit: 'tonnes of CO₂ equivalents',
    chartId: 'n2o-world', adapter: 'owid', slug: 'nitrous-oxide-emissions',
    sourceColumn: 'annual_emissions_n2o_total_co2eq', entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 10_000_000_000, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'Jones et al. (2025); Global Carbon Project — via Our World in Data',
  },
  // What emits — GHG by sector (World, CO₂eq tonnes). One indicator per sector; land-use can be
  // negative (sequestration). Climate Watch (2026) via OWID.
  ...([
    ['electricity_and_heat', 'electricity-heat'], ['transport', 'transport'],
    ['manufacturing_and_construction', 'manufacturing'], ['agriculture', 'agriculture'],
    ['industry', 'industry'], ['buildings', 'buildings'],
    ['land_use_change_and_forestry', 'land-use'], ['waste', 'waste'],
    ['fugitive', 'fugitive'], ['aviation_and_shipping', 'aviation-shipping'],
  ] as const).map(([col, slug]) => ({
    id: `climate.ghg_sector_${slug.replace(/-/g, '_')}.world`,
    title: `GHG emissions — ${slug.replace(/-/g, ' ')}, World`, unit: 'tonnes',
    chartId: `ghg-sector-${slug}-world`, adapter: 'owid' as const, slug: 'ghg-emissions-by-sector',
    sourceColumn: `${col}_ghg_emissions`, entityFilter: ['World'], derive: { op: 'pick_entity' as const, entity: 'World' },
    validate: { min: -5_000_000_000, max: 60_000_000_000, monotonicJump: 2, requireProvenance: true },
    primarySource: 'Climate Watch (2026) — via Our World in Data',
  })),
  // Decoupling — CO₂ per $ of GDP. World + the six continents.
  ...([['World', 'World'], ['Asia', 'Asia'], ['Europe', 'Europe'], ['Africa', 'Africa'],
       ['North America', 'North America'], ['South America', 'South America']] as const).map(([name, ent]) => ({
    id: `climate.co2_intensity.${rslug(name)}`, title: `CO₂ intensity of GDP, ${name}`, unit: 'kilograms per international-$',
    chartId: `co2-intensity-${rslug(name)}`, adapter: 'owid' as const, slug: 'co2-intensity',
    sourceColumn: 'emissions_total_per_gdp', entityFilter: [ent], derive: { op: 'pick_entity' as const, entity: ent },
    validate: { min: 0, max: 5, monotonicJump: 1, requireProvenance: true },
    primarySource: 'Global Carbon Budget (2025); Maddison Project — via Our World in Data',
  })),
  // Offshoring — consumption-based CO₂ per capita (counts the carbon in imports). World + continents.
  ...([['World', 'World'], ['Asia', 'Asia'], ['Europe', 'Europe'], ['Africa', 'Africa'],
       ['North America', 'North America'], ['South America', 'South America']] as const).map(([name, ent]) => ({
    id: `climate.consumption_co2_pc.${rslug(name)}`, title: `Consumption-based CO₂ per capita, ${name}`, unit: 'tonnes per person',
    chartId: `consumption-co2-pc-${rslug(name)}`, adapter: 'owid' as const, slug: 'consumption-co2-per-capita',
    sourceColumn: 'consumption_emissions_per_capita', entityFilter: [ent], derive: { op: 'pick_entity' as const, entity: ent },
    validate: { min: 0, max: 50, monotonicJump: 2, requireProvenance: true },
    primarySource: 'Global Carbon Budget (2025) — via Our World in Data',
  })),
  // ACT II partial — uneven warming. Country/regional temperature anomaly vs 1991–2020 (ERA5/C3S via
  // OWID, free reuse w/ attribution). Arctic amplification: high-latitude land warms far faster than
  // the tropics. World + a fast-warming set (Greenland, Russia, Canada) vs a slow-warming set
  // (Brazil, Indonesia). A different baseline (1991–2020) from the GISTEMP charts — flagged in prose.
  ...([['World', 'World'], ['Greenland', 'Greenland'], ['Russia', 'Russia'], ['Canada', 'Canada'],
       ['Brazil', 'Brazil'], ['Indonesia', 'Indonesia']] as const).map(([name, ent]) => ({
    id: `climate.temperature_country.${rslug(name)}`, title: `Temperature anomaly vs 1991–2020, ${name}`, unit: '°C',
    chartId: `temperature-country-${rslug(name)}`, adapter: 'owid' as const, slug: 'annual-temperature-anomalies',
    sourceColumn: 'temperature_anomaly', entityFilter: [ent], derive: { op: 'pick_entity' as const, entity: ent },
    license: 'Copernicus Climate Change Service (C3S) — free reuse with attribution',
    validate: { min: -6, max: 8, monotonicJump: 8, requireProvenance: true },
    primarySource: 'Copernicus/ECMWF ERA5 — via Our World in Data',
  })),
  // ACT II/III — THE STATE & THE CONSEQUENCES. The other gases in the air, the ocean's heat, and the
  // ice. All global-by-nature (no regional cut). NOAA GML (PD), NOAA NCEI (PD), NASA GRACE (PD), WGMS (CC BY).
  {
    id: 'climate.ch4_concentration.world', title: 'Atmospheric methane concentration, World', unit: 'parts per billion',
    chartId: 'ch4-concentration-world', adapter: 'noaagml', slug: 'ch4',
    validate: { min: 1500, max: 2200, monotonicJump: 1, requireProvenance: true },
    primarySource: 'NOAA Global Monitoring Laboratory',
  },
  {
    id: 'climate.n2o_concentration.world', title: 'Atmospheric nitrous oxide concentration, World', unit: 'parts per billion',
    chartId: 'n2o-concentration-world', adapter: 'noaagml', slug: 'n2o',
    validate: { min: 300, max: 380, monotonicJump: 1, requireProvenance: true },
    primarySource: 'NOAA Global Monitoring Laboratory',
  },
  {
    id: 'climate.ocean_heat.world', title: 'Global ocean heat content (0–2000 m), World', unit: '10^22 joules',
    chartId: 'ocean-heat-world', adapter: 'oceanheat', slug: 'h22-w0-2000m',
    validate: { min: -5, max: 60, monotonicJump: 3, requireProvenance: true },
    primarySource: 'NOAA NCEI — Levitus et al.',
  },
  {
    id: 'climate.ice_greenland.world', title: 'Greenland ice-sheet mass change, World', unit: 'billion tonnes',
    chartId: 'ice-greenland-world', adapter: 'icesheet', slug: 'ice-sheet-mass-balance',
    sourceColumn: 'land_ice_mass_nasa', entityFilter: ['Greenland'],
    validate: { min: -8000, max: 500, monotonicJump: 5, requireProvenance: true },
    primarySource: 'NASA/JPL — GRACE & GRACE-FO, via Our World in Data',
  },
  {
    id: 'climate.ice_antarctica.world', title: 'Antarctica ice-sheet mass change, World', unit: 'billion tonnes',
    chartId: 'ice-antarctica-world', adapter: 'icesheet', slug: 'ice-sheet-mass-balance',
    sourceColumn: 'land_ice_mass_nasa', entityFilter: ['Antarctica'],
    validate: { min: -6000, max: 500, monotonicJump: 5, requireProvenance: true },
    primarySource: 'NASA/JPL — GRACE & GRACE-FO, via Our World in Data',
  },
  {
    id: 'climate.glaciers.world', title: 'Glacier mass balance (reference glaciers), World', unit: 'metres water equivalent',
    chartId: 'glaciers-world', adapter: 'wgms', slug: 'mb_ref',
    validate: { min: -40, max: 10, monotonicJump: 5, requireProvenance: true },
    primarySource: 'World Glacier Monitoring Service (WGMS)',
  },

  // Science — the whole scholarly literature, OpenAlex (CC0). Output volume exploding (the
  // confusion beat: more papers ≠ more progress) and the rise of open access (the hope beat).
  {
    id: 'science.works_total.world',
    title: 'Scholarly works published per year, World',
    unit: 'works per year',
    chartId: 'works-total-world',
    adapter: 'openalex', slug: 'works?group_by=publication_year',
    yearMin: 1900, yearMax: 2024,
    validate: { min: 0, max: 50_000_000, monotonicJump: 1, requireProvenance: true },
    primarySource: 'OpenAlex',
  },
  {
    id: 'science.works_open_access.world',
    title: 'Open-access scholarly works published per year, World',
    unit: 'works per year',
    chartId: 'works-open-access-world',
    adapter: 'openalex', slug: 'works?filter=is_oa:true&group_by=publication_year',
    yearMin: 1900, yearMax: 2024,
    validate: { min: 0, max: 50_000_000, monotonicJump: 1, requireProvenance: true },
    primarySource: 'OpenAlex',
  },

  // Deep-history income — Maddison Project (via OWID, CC BY). The 2,000-year arc: the Great
  // Divergence and Asia's catch-up. The deep hero for poverty & inequality.
  {
    id: 'economy.gdp_per_capita_maddison.world',
    title: 'GDP per capita, World (Maddison, long run)',
    unit: 'international-$ in 2011 prices',
    chartId: 'gdp-per-capita-maddison-world',
    adapter: 'owid', slug: 'gdp-per-capita-maddison-project-database', sourceColumn: 'gdp_per_capita',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 200000, monotonicJump: 1, requireProvenance: true },
    primarySource: 'Maddison Project Database (2023) — via Our World in Data',
  },
  // The solar-cost collapse — OWID (CC BY). ~$106/W (1976) → well under $1/W: the single most
  // hopeful energy chart, the engine under the renewables share.
  {
    id: 'energy.solar_pv_price.world',
    title: 'Solar photovoltaic module price, World',
    unit: 'constant 2024 US$ per watt',
    chartId: 'solar-pv-price-world',
    adapter: 'owid', slug: 'solar-pv-prices', sourceColumn: 'cost',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 200, monotonicJump: 1, requireProvenance: true },
    primarySource: 'Nemet (2009); Farmer & Lafond (2016); IRENA — via Our World in Data',
  },

  // ── Trade & globalization (confusion). The rise of an interconnected world — and its stall.
  //    All World Bank (CC BY), no new adapter. TiVA/UNCTAD/WITS are deep-article tools, not this. ──
  {
    id: 'trade.trade_share_gdp.world',
    title: 'Trade as a share of GDP, World',
    unit: '% of GDP',
    chartId: 'trade-share-gdp-world',
    adapter: 'worldbank', slug: 'NE.TRD.GNFS.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'World Bank national accounts; OECD',
  },
  {
    id: 'trade.tariff_rate.world',
    title: 'Applied tariff rate, weighted mean, all products, World',
    unit: '%',
    chartId: 'tariff-rate-world',
    adapter: 'worldbank', slug: 'TM.TAX.MRCH.WM.AR.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'World Bank / WITS — UNCTAD TRAINS & WTO',
  },
  {
    id: 'trade.fdi_inflows.world',
    title: 'Foreign direct investment, net inflows, World',
    unit: '% of GDP',
    chartId: 'fdi-inflows-world',
    adapter: 'worldbank', slug: 'BX.KLT.DINV.WD.GD.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: -10, max: 20, monotonicJump: 2, requireProvenance: true },
    primarySource: 'IMF Balance of Payments — via World Bank',
  },

  // ── Inequality, deepened — the stark pairing. Top 1% takes ~20% of world income; the bottom
  //    HALF takes ~8%. WID via OWID (CC BY). The top-1% line alone undersells the story. ──
  {
    id: 'inequality.income_share_bottom50.world',
    title: 'Income share of the bottom 50%, World (before tax)',
    unit: '%',
    chartId: 'income-share-bottom50-world',
    adapter: 'owid', slug: 'income-share-distribution-before-tax-wid',   // multi-column → pin bottom-50
    sourceColumn: 'share_bottom_50__welfare_type_before_tax__extrapolated_no',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 100, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'World Inequality Database (WID.world) — via Our World in Data',
  },
  {
    id: 'inequality.income_share_top10.world',
    title: 'Income share of the top 10%, World (before tax)',
    unit: '%',
    chartId: 'income-share-top10-world',
    adapter: 'owid', slug: 'income-share-top-10-before-tax-wid',
    sourceColumn: 'share_top_10__welfare_type_before_tax__extrapolated_no',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 100, monotonicJump: 0.3, requireProvenance: true },
    primarySource: 'World Inequality Database (WID.world) — via Our World in Data',
  },

  // ── Work, deepened with ILO modelled estimates — delivered via the World Bank (CC BY), which
  //    re-publishes ILOSTAT's modelled series with clean World aggregates (a dedicated ILOSTAT
  //    SDMX adapter is high-effort for data already reachable here). Primary source credited to ILO. ──
  {
    id: 'work.wage_salaried.world',
    title: 'Wage & salaried workers, World',
    unit: '% of total employment',
    chartId: 'wage-salaried-world',
    adapter: 'worldbank', slug: 'SL.EMP.WORK.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'International Labour Organization (modelled), via World Bank',
  },
  {
    id: 'work.employment_ratio.world',
    title: 'Employment-to-population ratio (15+), World',
    unit: '% of population 15+',
    chartId: 'employment-ratio-world',
    adapter: 'worldbank', slug: 'SL.EMP.TOTL.SP.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'International Labour Organization (modelled), via World Bank',
  },
  {
    id: 'work.youth_unemployment.world',
    title: 'Youth unemployment rate (15–24), World',
    unit: '% of labour force aged 15–24',
    chartId: 'youth-unemployment-world',
    adapter: 'worldbank', slug: 'SL.UEM.1524.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'International Labour Organization (modelled), via World Bank',
  },

  // ── ILOSTAT direct (SDMX, CC BY) — what the World Bank's ILO mirror lacks. Working poverty is a
  //    rich annual series the WB doesn't carry; child labour is the ILO/UNICEF global estimate. ──
  {
    id: 'work.working_poverty.world',
    title: 'Working poverty rate — employed living in extreme poverty (<$2.15/day), World',
    unit: '% of employed',
    chartId: 'working-poverty-world',
    adapter: 'ilostat', slug: 'DF_SDG_0111_SEX_AGE_RT',
    filter: { SEX: 'SEX_T', AGE: 'AGE_YTHADULT_YGE15' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'ILOSTAT — International Labour Organization (SDG 1.1.1)',
  },
  {
    id: 'work.child_labour.world',
    title: 'Children in child labour, aged 5–17, World',
    unit: 'children',
    chartId: 'child-labour-world',
    adapter: 'ilostat', slug: 'DF_CLD_XCHL_SEX_AGE_NB',
    filter: { SEX: 'SEX_T', AGE: 'AGE_CLDVERSION_Y05-17' },
    validate: { min: 0, max: 500_000_000, monotonicJump: 1, requireProvenance: true },
    primarySource: 'ILO & UNICEF — Global Estimates of Child Labour',
  },
  {
    // The despair counter-melody to working poverty: most of the world's workers have no contract
    // and no safety net. ILO modelled estimates (Nov. 2025), aggregates only (no per-country).
    id: 'work.informal_employment.world',
    title: 'Informal employment rate, World',
    unit: '% of total employment',
    chartId: 'informal-employment-world',
    adapter: 'ilostat', slug: 'DF_EMP_2IFL_SEX_RT',
    filter: { SEX: 'SEX_T' }, yearMax: 2024, // the ILO modelled series nowcasts to 2027; cap at the last settled year
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'ILOSTAT — International Labour Organization (SDG 8.3.1 family, modelled)',
  },

  // ════════ HEALTH, deepened — the great wins (and the counter-arc). All re-host (CC BY). ════════
  {
    id: 'health.child_mortality.world',
    title: 'Child mortality rate (under-5), World',
    unit: 'deaths per 100 live births',
    chartId: 'child-mortality-world',
    adapter: 'owid', slug: 'child-mortality', sourceColumn: 'child_mortality_rate',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    // "the single most hopeful series on earth": ~42.8% of newborns (1800) → 3.7% (2023).
    validate: { min: 0, max: 50, monotonicJump: 1, requireProvenance: true },
    primarySource: 'UN IGME; Gapminder — via Our World in Data',
  },
  {
    id: 'health.vaccine_dtp3.world',
    title: 'Vaccination coverage — DTP3 (diphtheria/tetanus/pertussis), World',
    unit: '%',
    chartId: 'vaccine-dtp3-world',
    adapter: 'owid', slug: 'global-vaccination-coverage', sourceColumn: 'coverage__antigen_dtpcv3',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'WHO & UNICEF — via Our World in Data',
  },
  {
    id: 'health.vaccine_measles.world',
    title: 'Vaccination coverage — measles (1st dose), World',
    unit: '%',
    chartId: 'vaccine-measles-world',
    adapter: 'owid', slug: 'global-vaccination-coverage', sourceColumn: 'coverage__antigen_mcv1',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'WHO & UNICEF — via Our World in Data',
  },
  {
    id: 'health.malaria_incidence.world',
    title: 'Malaria incidence, World',
    unit: 'cases per 1,000 population at risk',
    chartId: 'malaria-incidence-world',
    adapter: 'worldbank', slug: 'SH.MLR.INCD.P3',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 1000, monotonicJump: 1, requireProvenance: true },
    primarySource: 'WHO World Malaria Report, via World Bank',
  },
  {
    id: 'health.hiv_incidence.world',
    title: 'New HIV infections, World',
    unit: 'new infections per 1,000 uninfected',
    chartId: 'hiv-incidence-world',
    adapter: 'worldbank', slug: 'SH.HIV.INCD.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'UNAIDS, via World Bank',
  },
  // HIV PREVALENCE (the stock) — distinct from incidence (the flow) above. New infections fall while
  // prevalence stays high because antiretrovirals keep people alive: "success" looks like more people
  // living with HIV, not fewer. World + Sub-Saharan Africa (two-thirds of cases). Snapshotting this WDI
  // code also feeds the hiv-prevalence-by-country bar (eSwatini/Lesotho vs the world).
  {
    id: 'health.hiv_prevalence.world',
    title: 'People living with HIV (ages 15–49), World',
    unit: '% of population ages 15–49',
    chartId: 'hiv-prevalence-world',
    adapter: 'worldbank', slug: 'SH.DYN.AIDS.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'UNAIDS, via World Bank',
  },
  {
    id: 'health.hiv_prevalence.ssf',
    title: 'People living with HIV (ages 15–49), Sub-Saharan Africa',
    unit: '% of population ages 15–49',
    chartId: 'hiv-prevalence-ssf',
    adapter: 'worldbank', slug: 'SH.DYN.AIDS.ZS',
    entityFilter: ['Sub-Saharan Africa'], derive: { op: 'pick_entity', entity: 'SSF' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'UNAIDS, via World Bank',
  },
  {
    id: 'health.tb_incidence.world',
    title: 'Tuberculosis incidence, World',
    unit: 'cases per 100,000 people',
    chartId: 'tb-incidence-world',
    adapter: 'worldbank', slug: 'SH.TBS.INCD',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 1000, monotonicJump: 1, requireProvenance: true },
    primarySource: 'WHO Global Tuberculosis Report, via World Bank',
  },

  // ── WHO Global Health Observatory (link-only, CC BY-NC-SA 3.0 IGO via the GHO OData API). The two
  //    series the World Bank mirror does NOT carry: HEALTHY life expectancy (HALE) at birth — the gap
  //    between lifespan and healthspan, i.e. the "problem of success" made quantitative — and the NCD
  //    premature-mortality frontier (probability of dying 30–70 of the chronic four). WHO direct is
  //    non-commercial + share-alike, so it is CHARTED AND CITED, never re-hosted: gate 'link-only'
  //    makes the pipeline write the derived series but no downloadable CSV (DATASET-ATLAS §168, DATA.md
  //    §9). World + the six WHO regions. GHO codes WHOSIS_000002 (HALE) · NCDMORT3070 (CVD/cancer/
  //    diabetes/CRD, ages 30–70), both-sexes (SEX_BTSX). ──
  ...([
    { cid: 'hale', base: 'health.healthy_life_expectancy', code: 'WHOSIS_000002', title: 'Healthy life expectancy at birth', unit: 'years', max: 90 },
    { cid: 'ncd-premature-mortality', base: 'health.ncd_premature_mortality', code: 'NCDMORT3070', title: 'Premature death from noncommunicable disease (ages 30–70)', unit: '% probability of dying 30–70', max: 60 },
  ] as const).flatMap((ind) => ([
    ['GLOBAL', 'World', 'world'], ['AFR', 'Africa (WHO)', 'afr'], ['AMR', 'Americas (WHO)', 'amr'],
    ['SEAR', 'South-East Asia (WHO)', 'sear'], ['EUR', 'Europe (WHO)', 'eur'],
    ['EMR', 'Eastern Mediterranean (WHO)', 'emr'], ['WPR', 'Western Pacific (WHO)', 'wpr'],
  ] as const).map(([code, name, rslg]) => ({
    id: `${ind.base}.${rslg}`,
    title: `${ind.title}, ${name.replace(/ \(WHO\)/, '')}`,
    unit: ind.unit,
    chartId: `${ind.cid}-${rslg}`,
    adapter: 'who' as const, slug: ind.code,
    filter: { SEX: 'SEX_BTSX' },
    derive: { op: 'pick_entity' as const, entity: code },
    validate: { min: 0, max: ind.max, monotonicJump: 4, requireProvenance: true },
    gate: 'link-only' as const, license: 'CC BY-NC-SA 3.0 IGO',
    primarySource: 'WHO Global Health Observatory — Global Health Estimates',
  }))),

  // ── Health at three magnifications: World + the six World Bank regions, via the WB mirror (CC BY
  //    4.0, re-hostable). The world line here is the WB aggregate (`*-wld`), kept SEPARATE from the
  //    deep-history OWID world series (`*-world`, back to 1770/1800) so each regional chart is
  //    internally consistent in source, units, and vintage — the regional cut behind "where is it
  //    true, and where is the opposite?". One WDI code → World + every region. Codes verified live
  //    2026-06-13. (child-mortality, smoking, undernourishment regions live already, above.) ──
  ...([
    { cid: 'life-expectancy',   base: 'health.life_expectancy_wb',    code: 'SP.DYN.LE00.IN',    title: 'Life expectancy at birth',    unit: 'years',                              max: 100,  src: 'UN WPP / WHO, via World Bank' },
    { cid: 'maternal-mortality', base: 'health.maternal_mortality_wb', code: 'SH.STA.MMRT',        title: 'Maternal mortality ratio',    unit: 'deaths per 100,000 live births',      max: 2000, src: 'WHO/UNICEF/UNFPA/WB/UNDESA (MMEIG), via World Bank' },
    { cid: 'vaccine-dtp3',      base: 'health.vaccine_dtp3_wb',       code: 'SH.IMM.IDPT',        title: 'DTP3 immunization coverage',  unit: '% of children 12–23 months',         max: 100,  src: 'WHO/UNICEF, via World Bank' },
    { cid: 'vaccine-measles',   base: 'health.vaccine_measles_wb',    code: 'SH.IMM.MEAS',        title: 'Measles immunization coverage', unit: '% of children 12–23 months',        max: 100,  src: 'WHO/UNICEF, via World Bank' },
    { cid: 'hiv-incidence',     base: 'health.hiv_incidence_wb',      code: 'SH.HIV.INCD.ZS',     title: 'New HIV infections',          unit: 'per 1,000 uninfected (ages 15–49)',   max: 50,   src: 'UNAIDS, via World Bank' },
    { cid: 'tb-incidence',      base: 'health.tb_incidence_wb',       code: 'SH.TBS.INCD',        title: 'Tuberculosis incidence',      unit: 'per 100,000 people',                  max: 1000, src: 'WHO Global TB Report, via World Bank' },
    { cid: 'malaria-incidence', base: 'health.malaria_incidence_wb',  code: 'SH.MLR.INCD.P3',     title: 'Malaria incidence',           unit: 'per 1,000 population at risk',         max: 800,  src: 'WHO World Malaria Report, via World Bank' },
    { cid: 'suicide-rate',      base: 'wellbeing.suicide_rate_wb',    code: 'SH.STA.SUIC.P5',     title: 'Suicide mortality rate',      unit: 'per 100,000 people',                  max: 60,   src: 'WHO, via World Bank' },
    { cid: 'pop-65plus',        base: 'demography.pop_65plus_wb',     code: 'SP.POP.65UP.TO.ZS',  title: 'Population aged 65 and over',  unit: '% of total population',               max: 40,   src: 'UN WPP, via World Bank' },
    // Cause-of-death composition (HNP, WHO Global Health Estimates via WB, CC BY) — the epidemiological
    // transition made visible: communicable deaths give way to chronic ones, and COVID briefly reverses
    // it. Sparse years (2000, 2010, 2015, 2019–21); the three shares sum to ~100. This is the cause-of-
    // death surface IHME GBD holds under a non-CC licence (link-only) — here re-hostable.
    { cid: 'cause-communicable', base: 'health.cause_communicable_wb', code: 'SH.DTH.COMM.ZS', title: 'Deaths from communicable disease', unit: '% of total deaths', max: 100, src: 'WHO Global Health Estimates, via World Bank' },
    { cid: 'cause-ncd',          base: 'health.cause_ncd_wb',          code: 'SH.DTH.NCOM.ZS', title: 'Deaths from noncommunicable disease', unit: '% of total deaths', max: 100, src: 'WHO Global Health Estimates, via World Bank' },
    { cid: 'cause-injury',       base: 'health.cause_injury_wb',       code: 'SH.DTH.INJR.ZS', title: 'Deaths from injury', unit: '% of total deaths', max: 100, src: 'WHO Global Health Estimates, via World Bank' },
  ] as const).flatMap((ind) => ([
    ['World', 'WLD'], ...WB_REGIONS,
  ] as const).map(([name, code]) => ({
    id: `${ind.base}.${code.toLowerCase()}`,
    title: `${ind.title}, ${name}`,
    unit: ind.unit,
    chartId: `${ind.cid}-${code.toLowerCase()}`,
    adapter: 'worldbank' as const, slug: ind.code,
    entityFilter: [name], derive: { op: 'pick_entity' as const, entity: code },
    validate: { min: 0, max: ind.max, monotonicJump: 3, requireProvenance: true },
    primarySource: ind.src,
  }))),

  // ── Substance & addiction. Smoking's collapse (hope) — both via WB (CC BY). ──
  {
    id: 'substance.smoking.world',
    title: 'Tobacco use among adults, World',
    unit: '% of adults',
    chartId: 'smoking-world',
    adapter: 'worldbank', slug: 'SH.PRV.SMOK',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'WHO, via World Bank',
  },
  {
    id: 'substance.alcohol.world',
    title: 'Alcohol consumption per capita, World',
    unit: 'litres of pure alcohol per capita',
    chartId: 'alcohol-world',
    adapter: 'worldbank', slug: 'SH.ALC.PCAP.LI',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 30, monotonicJump: 1, requireProvenance: true },
    primarySource: 'WHO Global Health Observatory, via World Bank',
  },

  // ── Safety & accidents. Road deaths is the one re-hostable carrying series (WB, CC BY);
  //    drowning/falls/disasters are IHME/WHO-GHE link-only (cited, see gap register). ──
  {
    id: 'safety.road_deaths.world',
    title: 'Road traffic death rate, World',
    unit: 'deaths per 100,000 people',
    chartId: 'road-deaths-world',
    adapter: 'worldbank', slug: 'SH.STA.TRAF.P5',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 1, requireProvenance: true },
    primarySource: 'WHO Global Status Report on Road Safety, via World Bank',
  },

  // ── Housing & shelter. Urbanization is the re-hostable World series; the falling-slums story is
  //    link-only (UN-Habitat terms); affordability/homelessness have no open global series (gaps). ──
  {
    id: 'housing.urban_share.world',
    title: 'Share of the population living in urban areas, World',
    unit: '% of population',
    chartId: 'urban-share-world',
    adapter: 'worldbank', slug: 'SP.URB.TOTL.IN.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 0.5, requireProvenance: true },
    primarySource: 'UN DESA World Urbanization Prospects, via World Bank',
  },

  // ── Animal welfare — the honesty dimension nobody charts. Land animals slaughtered for food,
  //    summed across all seven species (chickens dominate). FAO is CC BY-NC-SA → LINK-ONLY: we
  //    display the chart and cite the source, but generate no downloads (the user-approved
  //    image-only treatment). The first true exercise of the link-only gate. ──
  {
    id: 'animals.land_slaughtered.world',
    title: 'Land animals slaughtered for food per year, World',
    unit: 'animals',
    chartId: 'animals-slaughtered-world',
    adapter: 'owid', slug: 'animals-slaughtered-for-meat',
    sourceColumns: [
      'meat_of_cattle_with_the_bone__fresh_or_chilled__00000867__producing_or_slaughtered_animals__005320__animals',
      'meat__goat__00001017__producing_or_slaughtered_animals__005320__animals',
      'meat__chicken__00001058__producing_or_slaughtered_animals__005321__animals',
      'meat__turkey__00001080__producing_or_slaughtered_animals__005321__animals',
      'meat__pig__00001035__producing_or_slaughtered_animals__005320__animals',
      'meat__lamb_and_mutton__00000977__producing_or_slaughtered_animals__005320__animals',
      'meat__duck__00001069__producing_or_slaughtered_animals__005321__animals',
    ],
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'World' },
    gate: 'link-only',
    license: 'CC BY-NC-SA 3.0 IGO (FAO) — link-only',
    validate: { min: 0, max: 200_000_000_000, monotonicJump: 1, requireProvenance: true },
    primarySource: 'FAOSTAT — via Our World in Data',
  },

  /* ── "Is human progress slowing down?" — two new series pulled via the Data360 adapter
     (WB-origin, CC BY 4.0). The rest of the story composes series already on disk. ── */
  {
    // A concrete, hard-counted component of women's political standing — share of national-parliament
    // seats held by women (FIG. 9). The Atlas's actual sixth headline, the V-Dem *empowerment index*,
    // is carried exactly by progress.women_empowerment.* below (FIG. 10); this is its companion, not a
    // proxy for it.
    id: 'progress.women_parliament.world',
    title: 'Seats held by women in national parliaments',
    unit: '% of seats',
    chartId: 'women-parliament-world',
    adapter: 'data360',
    slug: 'WB_WDI_SG_GEN_PARL_ZS',
    data360: { databaseId: 'WB_WDI', refArea: 'WLD' },
    derive: { op: 'identity' },
    validate: { min: 0, max: 60, monotonicJump: 5, requireProvenance: true },
    primarySource: 'IPU & UN Women — via World Bank WDI / Data360',
  },
  {
    // The Atlas's sixth headline, the EXACT metric (not the parliament proxy): V-Dem women's
    // political empowerment index, via OWID — same source and path as our liberal-democracy series.
    id: 'progress.women_empowerment.world',
    title: "Women's political empowerment index, World",
    unit: 'index (0–1)',
    chartId: 'women-empowerment-world',
    adapter: 'owid',
    slug: 'women-political-empowerment-index',
    sourceColumn: 'wom_emp_vdem__estimate_best',   // MUST set: the trailing column is owid_region (a label)
    entityFilter: ['World'],
    derive: { op: 'pick_entity', entity: 'World' },
    validate: { min: 0, max: 1, monotonicJump: 1, requireProvenance: true },
    primarySource: 'V-Dem (Democracy report v16) — via Our World in Data',
  },
  // Women's political empowerment by continent (population-weighted: the average woman's experience).
  // The twist this surfaces: the index does NOT track income — Asia sits below Africa, unlike poverty
  // or health. A different map, which is the whole "depends on the lens" point.
  ...(['Asia (population-weighted)', 'Africa (population-weighted)', 'South America (population-weighted)',
       'Europe (population-weighted)'] as const).map((region) => ({
    id: `progress.women_empowerment.${rslug(region)}`,
    title: `Women's political empowerment index, ${region.replace(/ \(population-weighted\)/, '')}`,
    unit: 'index (0–1)',
    chartId: `women-empowerment-${rslug(region)}`,
    adapter: 'owid' as const, slug: 'women-political-empowerment-index', sourceColumn: 'wom_emp_vdem__estimate_best',
    entityFilter: [region], derive: { op: 'pick_entity' as const, entity: region },
    validate: { min: 0, max: 1, monotonicJump: 1, requireProvenance: true },
    primarySource: 'V-Dem (Democracy report v16) — via Our World in Data',
  })),
  {
    // World population — the denominator that turns the poverty-rate counterfactual into people.
    id: 'progress.population.world',
    title: 'World population',
    unit: 'people',
    chartId: 'population-world',
    adapter: 'data360',
    slug: 'WB_WDI_SP_POP_TOTL',
    data360: { databaseId: 'WB_WDI', refArea: 'WLD' },
    derive: { op: 'identity' },
    validate: { min: 0, max: 10_000_000_000, monotonicJump: 0.05, requireProvenance: true },
    primarySource: 'UN World Population Prospects — via World Bank WDI / Data360',
  },
  {
    // Child stunting — an Atlas slowdown indicator (lower is better).
    id: 'progress.stunting.world', title: 'Child stunting', unit: '% of under-5s',
    chartId: 'stunting-world', adapter: 'data360', slug: 'WB_WDI_SH_STA_STNT_ME_ZS',
    data360: { databaseId: 'WB_WDI', refArea: 'WLD' }, derive: { op: 'identity' },
    validate: { min: 0, max: 60, monotonicJump: 5, requireProvenance: true },
    primarySource: 'UNICEF/WHO/World Bank Joint Malnutrition Estimates — via Data360',
  },
  {
    // Measles immunization coverage — an Atlas access indicator (higher is better).
    id: 'progress.immunization.world', title: 'Measles immunization coverage', unit: '% of children',
    chartId: 'immunization-world', adapter: 'data360', slug: 'WB_WDI_SH_IMM_MEAS',
    data360: { databaseId: 'WB_WDI', refArea: 'WLD' }, derive: { op: 'identity' },
    validate: { min: 0, max: 100, monotonicJump: 10, requireProvenance: true },
    primarySource: 'WHO/UNICEF — via World Bank WDI / Data360',
  },
  {
    // Tertiary enrolment — one of the Atlas's three accelerating measures (higher is better).
    id: 'progress.tertiary.world', title: 'Tertiary-education enrolment', unit: '% gross',
    chartId: 'tertiary-world', adapter: 'data360', slug: 'WB_WDI_SE_TER_ENRR',
    data360: { databaseId: 'WB_WDI', refArea: 'WLD' }, derive: { op: 'identity' },
    validate: { min: 0, max: 100, monotonicJump: 6, requireProvenance: true },
    primarySource: 'UNESCO Institute for Statistics — via World Bank WDI / Data360',
  },

  // ── Q14 · Air pollution (air_pollution.*) ─────────────────────────────────────────────────
  // The re-hostable World Bank WDI spine (CC BY 4.0) for "is the air cleaner or deadlier?" — the
  // exposure + clean-cooking series that carry the verifiable load while GBD burden stays
  // link-only (see docs/ARTICLE-airpollution-plan.md). Run with `ONLY=air_pollution pnpm data`.
  // PM2.5 exposure EN.ATM.PM25.MC.M3 (µg/m³, 1990–2020, ACAG-sourced); clean cooking
  // EG.CFT.ACCS.ZS (%, 2000–2023); air-pollution mortality SH.STA.AIRP.P5 (per 100k, 2019 x-sec).
  // PM2.5 exposure — the CURRENT ACAG V6 series via OWID (1998–2024, population-weighted), not the
  // World Bank mirror (which stalled at 2020/V5 and told a falsely tidy "30-year decline"). V6 shows
  // the truer arc: world rose to a ~2015 peak then fell; South Asia worsened while the rich world cleaned up.
  {
    id: 'air_pollution.pm25_exposure.world',
    title: 'PM2.5 population-weighted mean exposure, World', unit: 'micrograms per cubic metre',
    chartId: 'pm25-exposure-world', adapter: 'owid', slug: 'pm25-air-pollution',
    sourceColumn: 'population_weighted_pm25', sourceUnit: 'micrograms per cubic metre',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'OWID_WRL' },
    validate: { min: 0, max: 200, monotonicJump: 10, requireProvenance: true },
    primarySource: 'Atmospheric Composition Analysis Group (van Donkelaar et al., V6.GL) — via Our World in Data',
  },
  // …by income group — the gradient. OWID income aggregates: OWID_HIC/UMC/LMC/LIC.
  ...(([['High-income countries', 'OWID_HIC', 'hic'], ['Upper-middle-income countries', 'OWID_UMC', 'umc'], ['Lower-middle-income countries', 'OWID_LMC', 'lmc'], ['Low-income countries', 'OWID_LIC', 'lic']]) as const).map(([name, code, slug]) => ({
    id: `air_pollution.pm25_exposure.${slug}`,
    title: `PM2.5 population-weighted mean exposure, ${name}`, unit: 'micrograms per cubic metre',
    chartId: `pm25-exposure-${slug}`, adapter: 'owid' as const, slug: 'pm25-air-pollution',
    sourceColumn: 'population_weighted_pm25', sourceUnit: 'micrograms per cubic metre',
    entityFilter: [name], derive: { op: 'pick_entity' as const, entity: code },
    validate: { min: 0, max: 200, monotonicJump: 10, requireProvenance: true },
    primarySource: 'Atmospheric Composition Analysis Group (van Donkelaar et al., V6.GL) — via Our World in Data',
  })),
  // …key countries — South Asia rose, China plateaued, the US floor kept dropping. Wide spread so the
  // article can cut the trend by country in several sections: the South-Asian epicentre (IND/BGD/PAK/NPL,
  // all rising), the cleanups (CHN's post-2014 cliff, USA/GBR/DEU low-and-falling), the Gulf + Nigeria.
  ...(([['India', 'IND'], ['China', 'CHN'], ['United States', 'USA'], ['Bangladesh', 'BGD'], ['Pakistan', 'PAK'], ['Nepal', 'NPL'], ['Nigeria', 'NGA'], ['Indonesia', 'IDN'], ['United Kingdom', 'GBR'], ['Germany', 'DEU'], ['Saudi Arabia', 'SAU']]) as const).map(([name, code]) => ({
    id: `air_pollution.pm25_exposure.${code.toLowerCase()}`,
    title: `PM2.5 population-weighted mean exposure, ${name}`, unit: 'micrograms per cubic metre',
    chartId: `pm25-exposure-${code.toLowerCase()}`, adapter: 'owid' as const, slug: 'pm25-air-pollution',
    sourceColumn: 'population_weighted_pm25', sourceUnit: 'micrograms per cubic metre',
    entityFilter: [name], derive: { op: 'pick_entity' as const, entity: code },
    validate: { min: 0, max: 200, monotonicJump: 20, requireProvenance: true },
    primarySource: 'Atmospheric Composition Analysis Group (van Donkelaar et al., V6.GL) — via Our World in Data',
  })),
  // Clean-cooking access — World (the hope beat: 49→74%) + regions (S Asia surges, SSA crawls).
  {
    id: 'air_pollution.clean_cooking.world',
    title: 'Access to clean cooking fuels & technologies, World', unit: '% of population',
    chartId: 'clean-cooking-world', adapter: 'worldbank', slug: 'EG.CFT.ACCS.ZS',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 100, monotonicJump: 5, requireProvenance: true },
    primarySource: 'WHO Household Energy Database — via World Bank WDI',
  },
  ...WB_REGIONS.map(([name, code]) => ({
    id: `air_pollution.clean_cooking.${code.toLowerCase()}`,
    title: `Access to clean cooking, ${name}`, unit: '% of population',
    chartId: `clean-cooking-${code.toLowerCase()}`, adapter: 'worldbank' as const, slug: 'EG.CFT.ACCS.ZS',
    entityFilter: [name], derive: { op: 'pick_entity' as const, entity: code },
    validate: { min: 0, max: 100, monotonicJump: 6, requireProvenance: true },
    primarySource: 'WHO Household Energy Database — via World Bank WDI',
  })),
  // …and by country — India's near-miracle (the LPG push), Indonesia's fast climb, China high, vs
  // Nigeria and Bangladesh where births outran connections. The country cut the regional view hides.
  ...(([['India', 'IND'], ['China', 'CHN'], ['Indonesia', 'IDN'], ['Nigeria', 'NGA'], ['Bangladesh', 'BGD']]) as const).map(([name, code]) => ({
    id: `air_pollution.clean_cooking.${code.toLowerCase()}`,
    title: `Access to clean cooking, ${name}`, unit: '% of population',
    chartId: `clean-cooking-${code.toLowerCase()}`, adapter: 'worldbank' as const, slug: 'EG.CFT.ACCS.ZS',
    entityFilter: [name], derive: { op: 'pick_entity' as const, entity: code },
    validate: { min: 0, max: 100, monotonicJump: 6, requireProvenance: true },
    primarySource: 'WHO Household Energy Database — via World Bank WDI',
  })),
  // Air-pollution mortality rate — World + regions (2019 cross-section → ranked bars).
  {
    id: 'air_pollution.mortality.world',
    title: 'Mortality attributed to air pollution, World', unit: 'per 100,000 (age-standardised)',
    chartId: 'airpoll-mortality-world', adapter: 'worldbank', slug: 'SH.STA.AIRP.P5',
    entityFilter: ['World'], derive: { op: 'pick_entity', entity: 'WLD' },
    validate: { min: 0, max: 400, monotonicJump: 400, requireProvenance: true },
    primarySource: 'WHO Global Health Observatory — via World Bank WDI',
  },
  ...WB_REGIONS.map(([name, code]) => ({
    id: `air_pollution.mortality.${code.toLowerCase()}`,
    title: `Mortality attributed to air pollution, ${name}`, unit: 'per 100,000 (age-standardised)',
    chartId: `airpoll-mortality-${code.toLowerCase()}`, adapter: 'worldbank' as const, slug: 'SH.STA.AIRP.P5',
    entityFilter: [name], derive: { op: 'pick_entity' as const, entity: code },
    validate: { min: 0, max: 400, monotonicJump: 400, requireProvenance: true },
    primarySource: 'WHO Global Health Observatory — via World Bank WDI',
  })),
  // The decoupling, made concrete: absolute ambient PM2.5 deaths over time (State of Global Air /
  // IHME via OWID) — RISING in fast-growing Asia even as concentration fell, because population grew
  // and aged. IHME-derived → link-only (the OWID death-RATE graphers 403 outright; this absolute slug
  // serves but stays non-commercial). 1990–2015, per country (no World row → pick named countries).
  ...(([['India', 'IND'], ['China', 'CHN'], ['United States', 'USA'], ['Bangladesh', 'BGD'], ['Pakistan', 'PAK'], ['Indonesia', 'IDN'], ['Nigeria', 'NGA']]) as const).map(([name, code]) => ({
    id: `air_pollution.ambient_deaths.${code.toLowerCase()}`,
    title: `Deaths from ambient PM2.5 air pollution, ${name}`, unit: 'deaths per year',
    chartId: `ambient-deaths-${code.toLowerCase()}`, adapter: 'owid' as const,
    slug: 'absolute-number-of-deaths-from-ambient-particulate-air-pollution',
    sourceColumn: 'absolute_deaths_from_ambient_pm2_5_air_pollution__state_of_global_air',
    sourceUnit: 'deaths per year', // OWID metadata mislabels this count column as "Percent"; renderer auto-formats (737k, 1.1M)
    entityFilter: [name], derive: { op: 'pick_entity' as const, entity: code },
    validate: { min: 0, max: 2000000, monotonicJump: 500000, requireProvenance: true },
    gate: 'link-only' as const, license: 'IHME / State of Global Air — link-only (non-commercial)',
    primarySource: 'State of Global Air (Health Effects Institute; IHME GBD), via Our World in Data',
  })),
  // ── The aerosol-masking paradox + the unregulated pollutant — CEDS emissions over time (Hoesly et
  //    al.) via OWID, CC BY 4.0 (re-hostable). The story is in the long arc: sulphur peaked in 1979 and
  //    fell (cleaning lungs, unmasking warming); China's SO2 cliff after its 2006 peak; ammonia, which
  //    no clean-air law touches, just keeps climbing. Multi-column grapher → sourceColumn is MANDATORY
  //    (CLAUDE.md gotcha: the adapter silently reads the LAST column otherwise).
  ...(([
    ['so2', 'World', 'OWID_WRL', 'world', 'Sulphur dioxide (SO₂) emissions, World', 2.0e8],
    ['so2', 'China', 'CHN', 'chn', 'Sulphur dioxide (SO₂) emissions, China', 5.0e7],
    ['nh3', 'World', 'OWID_WRL', 'world', 'Ammonia (NH₃) emissions, World', 1.0e8],
    ['nox', 'World', 'OWID_WRL', 'world', 'Nitrogen oxides (NOₓ) emissions, World', 2.0e8],
  ]) as const).map(([pol, name, code, slug, title, max]) => ({
    id: `air_pollution.${pol}.${slug}`,
    title, unit: 'tonnes per year',
    chartId: `airpoll-${pol}-${slug}`, adapter: 'owid' as const, slug: 'long-run-air-pollution',
    sourceColumn: `emissions__pollutant_${pol}__sector_all_sectors`, sourceUnit: 'tonnes per year',
    entityFilter: [name], derive: { op: 'pick_entity' as const, entity: code }, yearMin: 1900,
    validate: { min: 0, max, monotonicJump: max, requireProvenance: true },
    primarySource: 'Community Emissions Data System (CEDS; Hoesly et al.) — via Our World in Data',
  })),
  // ── Wildfire, the honest history: the planet burns LESS land overall (savanna fires receding) yet
  //    the dangerous forest fires grow — "less fire, more smoke." MODIS/GWIS burned area by land cover
  //    via OWID, CC BY 4.0. World, 2002–2024. Multi-column → sourceColumn mandatory.
  ...(([
    ['savanna', 'savannas', 'Savanna & grassland area burned, World', 3.0e8],
    ['forest', 'forest', 'Forest area burned, World', 1.0e8],
  ]) as const).map(([slug, col, title, max]) => ({
    id: `air_pollution.burn_${slug}.world`,
    title, unit: 'hectares per year',
    chartId: `airpoll-burn-${slug}`, adapter: 'owid' as const, slug: 'annual-burned-area-by-landcover',
    sourceColumn: col, sourceUnit: 'hectares per year',
    entityFilter: ['World'], derive: { op: 'pick_entity' as const, entity: 'OWID_WRL' },
    validate: { min: 0, max, monotonicJump: max, requireProvenance: true },
    primarySource: 'Global Wildfire Information System (GWIS) / MODIS — via Our World in Data',
  })),
];

export const byId = (id: string) => INDICATORS.find((s) => s.id === id);
