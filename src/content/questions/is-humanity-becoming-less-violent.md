---
question: "Is humanity becoming less violent?"
dek: "No single chart can answer it, so we don’t ask one to. Five signals are read at once — and the verdict depends entirely on how far back you set the lens. The same evidence converges, then breaks apart."
theme: "War & Peace"
kickerNumber: "01"
verdict: "Long-run progress, short-run reversal"
order: 1
publishedAt: 2026-06-08
status: "published"
illustrative: true

atlas:
  hope: { pos: 0.12, lens: "10,000-year lens" }
  despair: { pos: 0.68, lens: "since 2020" }

caveats:
  - "Figures in this draft are <b>illustrative</b> pending real ingestion — treat absolute levels as placeholders."
  - "“Violence” here means <b>direct lethal violence</b>; it excludes coercion, structural harm, and the threat of force."
  - "Pre-1900 numbers are <b>regional and sparse</b> — the global long arc is reconstructed, not measured."
  - "The composite verdict is an <b>editorial</b> reading of the signals, not a computed index. Full method below."

evidence:
  heroLabel: "Violent deaths / 100k"
  hero: [[-8000,520],[-5000,470],[-3000,360],[-1000,300],[0,255],[800,235],[1300,205],[1500,170],[1700,130],[1820,95],[1870,60],[1900,42],[1914,205],[1918,120],[1929,55],[1939,255],[1945,90],[1950,38],[1970,22],[1990,17],[2005,11],[2011,8],[2018,7],[2020,11],[2022,33],[2024,29]]
  windows:
    - { lab: "Deep history", range: "8000 BCE — 2024", from: -8000, to: 2024, verdict: "Yes", temp: "cool" }
    - { lab: "Since 1900", range: "1900 — 2024", from: 1900, to: 2024, verdict: "Mostly", temp: "cool" }
    - { lab: "Since 2020", range: "2018 — 2024", from: 2018, to: 2024, verdict: "No", temp: "warm" }
    - { lab: "A lived day", range: "right now", from: 2022, to: 2024, verdict: "No", temp: "warm" }
  readout: "Stand ten thousand years back and the answer is <em>yes</em> — the deep arc of everyday violence falls. Step to the last few years and it <em>inverts</em>. Same data, opposite verdicts; the only thing that changed is how closely you looked."
  signals:
    - { fig: "FIG. 2", name: "Active armed conflicts", unit: "count, worldwide", badUp: true, data: [[-8000,4],[1500,12],[1816,20],[1946,18],[1960,30],[1992,52],[2010,38],[2016,50],[2020,56],[2022,57],[2024,59]] }
    - { fig: "FIG. 3", name: "Forcibly displaced", unit: "millions of people", badUp: true, data: [[-8000,0.2],[1900,1],[1951,2],[1980,8],[2000,16],[2011,38],[2018,70],[2020,82],[2022,103],[2024,120]] }
    - { fig: "FIG. 4", name: "Homicide rate", unit: "per 100,000 / year", badUp: true, data: [[-8000,60],[1300,40],[1500,30],[1800,15],[1900,8],[1950,7],[2000,6],[2018,5.4],[2022,5.2],[2024,5]] }
    - { fig: "FIG. 5", name: "Great-power tension", unit: "index, 0–100", badUp: true, data: [[-8000,30],[1946,70],[1990,20],[2000,18],[2014,40],[2020,55],[2022,60],[2024,68]] }
  recentFrom: 2018
  recentTo: 2024
  recentVerdict: "No"
  recentTemp: "warm"
  synthesis: "Nearly every recent signal turns upward at once — <em>convergence, not noise.</em> Only the homicide rate still holds."
  vantageNote: "And the global average is its own lens: pull from the world line to a single street in Khartoum or Gaza, and “low risk” becomes total."

movements:
  - eyebrow: "The long arc"
    fig: "FIG. 6"
    claim: "Homicide has fallen for seven centuries."
    dropCap: true
    explainer: "Where parish and coroner records survive, the everyday violence of private life has collapsed. A medieval European was tens of times more likely to be murdered than a person living in the same cities today — a decline so long it predates the state’s monopoly on force."
    sidenote: { mark: "a", text: "Pre-modern figures come from coroners’ rolls and court archives — reliable in their <em>direction</em>, rough in their absolute level." }
    captionLeft: "<b>Homicides per 100,000 / year</b> · Western Europe"
    captionRight: "1300 — 2020"
    source: "Source · Eisner (2003); Our World in Data — illustrative"
    chart:
      id: "A"
      ymax: 52
      yTicks: [0,10,20,30,40,50]
      xTicks: [1300,1500,1700,1900,2020]
      series:
        - { name: "Homicide", color: "hope", data: [[1300,41],[1400,45],[1500,32],[1600,19],[1700,11],[1800,7.5],[1900,3.2],[1950,1.4],[2000,1.3],[2020,1.1]] }
    take:
      hope: "A forty-fold fall. The medieval baseline of violent death has all but vanished from daily life."
      despair: "“Rare” is not “none,” and the clean line is European — much of the world is far thinner on history."
      confusion: "Definitions, coverage, and record-keeping all shift beneath the curve. The slope is real; the precision is not."
  - eyebrow: "The recent break"
    fig: "FIG. 7"
    claim: "Displacement is at an all-time high."
    dropCap: true
    explainer: "The rate signals improved while the human totals did not. The number of people forced from their homes has roughly doubled in a decade, and the curve bends sharply upward after 2022 — a reminder that a falling death <em>rate</em> can sit beside a rising count of ruined lives."
    captionLeft: "<b>Forcibly displaced people</b> · millions, worldwide"
    captionRight: "1951 — 2024"
    source: "Source · UNHCR Global Trends — illustrative"
    chart:
      id: "B"
      ymax: 132
      yTicks: [0,30,60,90,120]
      xTicks: [1951,1980,2000,2024]
      annot: { x: 2022, label: "UKRAINE" }
      series:
        - { name: "Displaced", color: "despair", data: [[1951,2],[1970,3],[1990,20],[2000,16],[2011,38],[2018,70],[2022,103],[2024,120]] }
    take:
      hope: "More people are counted, sheltered, and resettled than any system in history could once manage."
      despair: "120 million uprooted. The post-war institutions are buckling under a number they were never built for."
      confusion: "“Displaced” bundles refugees, the internally displaced, and the stateless — very different fates under one line."
  - eyebrow: "Who the average hides"
    fig: "FIG. 8"
    claim: "The global mean is a comfortable lie."
    dropCap: true
    explainer: "A single world line stays low and almost flat — and tells you nothing about where the violence actually lives. Pull the same measure apart by country and the average dissolves into catastrophe for some and calm for most. Both readings come from the same dataset."
    sidenote: { mark: "b", text: "A population-weighted mean would sit lower still — the unweighted average already buries the worst-off countries." }
    captionLeft: "<b>Violent deaths per 100,000</b> · world vs. selected states"
    captionRight: "2010 — 2024"
    source: "Source · UCDP; ACLED — illustrative"
    chart:
      id: "C"
      ymax: 66
      x0: 2010
      x1: 2024
      yTicks: [0,20,40,60]
      xTicks: [2010,2015,2020,2024]
      series:
        - { name: "Sudan", color: "despair", data: [[2010,5],[2015,8],[2020,12],[2023,40],[2024,55]] }
        - { name: "Syria", color: "ochre", data: [[2010,2],[2013,60],[2016,45],[2020,20],[2024,12]] }
        - { name: "World", color: "hope", data: [[2010,7],[2015,8],[2020,9],[2024,9]] }
    take:
      hope: "For most of humanity, the flat world line is the lived reality: violence is now a tail risk, not a daily one."
      despair: "To live inside the spike is to find the world average obscene. Sudan’s line is not a statistic to Sudan."
      confusion: "Which line is “the world”? The mean, the median, or the worst-off? Each answers a different moral question."

pullQuote:
  text: "Humanity is not a line chart."
  cite: "Progress and catastrophe coexist"

lenses:
  - { who: "The historian", confidence: "high", hope: "The organized state slowly crowded out the raid, the feud, and the duel.", despair: "The same state perfected industrial war when it chose to wage it." }
  - { who: "The statistician", confidence: "medium", hope: "Per-capita death rates sit far below their historical band.", despair: "The denominator hides the dead; rare mega-wars dominate true risk." }
  - { who: "Someone living it", confidence: "absolute", despair: "A global average is no comfort under a drone. My street is the only dataset that matters." }
  - { who: "The forecaster", confidence: "low", hope: "The nuclear taboo and economic entanglement still raise the cost of total war.", despair: "Cheap drones, autonomy, and disinformation lower the cost of mass harm." }

hopeCase: "Interstate conquest has become rare and largely illegitimate. For most people alive today, the statistical chance of dying violently is the lowest it has ever been."
despairCase: "That decline reversed after 2020. Every recent signal turns upward at once, and the technologies that once made killing expensive are becoming cheap."
whatWouldChangeIt: "A <b>sustained five-year rise</b> across all five signals would retire the long-run optimism. <b>One nuclear exchange</b> would end the argument entirely."

methodology:
  - { term: "Source & vintage", detail: "Each series is pulled from the datasets listed in Sources, archived at a fixed vintage. The vintage date and the dataset’s own revision are recorded in the figure’s metadata." }
  - { term: "Transformations", detail: "Counts are converted to <b>rates per 100,000</b> using mid-year population; currencies are deflated to constant 2021 USD. No series is re-based, capped, or seasonally adjusted." }
  - { term: "Display smoothing", detail: "Lines use <b>monotone-cubic interpolation</b> purely for legibility. It is cosmetic — it never moves, adds, or hides a data point, and it cannot overshoot a real value." }
  - { term: "The verdict & tally", detail: "Each signal is classed <i>improving</i> or <i>worsening</i> by the sign of its change across the visible window. The headline verdict is an <b>editorial</b> reading of those signals — deliberately <b>not</b> a single computed index." }
  - { term: "The vantage", detail: "“Khartoum, today” re-weights toward a worst-affected reading. It is illustrative of distributional reality, not a separate measured series." }

sources:
  - { id: "s1", name: "Uppsala Conflict Data Program", url: "https://ucdp.uu.se", license: "CC BY 4.0", vintage: "2026-Q1", note: "battle-related deaths, state-based conflict." }
  - { id: "s2", name: "UNHCR Global Trends", url: "https://unhcr.org", license: "public sector information", vintage: "2025", note: "forcibly displaced persons." }
  - { id: "s3", name: "Our World in Data — War & Peace", url: "https://ourworldindata.org/war-and-peace", license: "CC BY 4.0", vintage: "2025", note: "after Eisner (2003) for long-run homicide. Series in this draft are illustrative for layout review; real ingestion pending." }

revisions:
  - { date: "2026-06-08", text: "First publication — three movements, four-magnification evidence, illustrative data." }
  - { date: "2026-06-08", text: "Added methodology, caveats, and source vintages." }
---

This question is told through structured evidence, not a flowing essay; the article above is
rendered from the data in this file's frontmatter. See WRITING.md for the anatomy.
