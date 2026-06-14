---
question: "Are poor countries catching up?"
dek: "The same income data says yes and no at once. Weigh the world by people and the gap is closing fast; weigh it by countries and it barely moves. Which answer you get depends on what you decide to count."
theme: "Wealth & Growth"
kickerNumber: "05"
verdict: "Converging for people, not for places"
order: 7
publishedAt: 2026-06-12
status: "published"
illustrative: false

atlas:
  hope: { pos: 0.30, lens: "weighted by people" }
  despair: { pos: 0.62, lens: "weighted by countries" }

caveats:
  - "Income here is <b>GDP per capita at purchasing-power parity</b> (constant 2021 international dollars) from the World Bank. PPP adjusts for the lower cost of living in poorer countries, so it tracks living standards better than market exchange rates — but the conversion factors are themselves estimates, revised with each price survey."
  - "<b>“Convergence” is not one question.</b> It splits into at least three — does the spread of incomes shrink (σ), do poorer economies grow faster (β), and does it hold for people or for countries. They can point opposite ways at once, and most of this article is that disagreement."
  - "The country panel is <b>balanced from 1990</b> (the first year PPP figures cover most economies) to 2024. Earlier catch-up, and the deeper history of the Great Divergence, sit outside this window."
  - "Every chart runs on <b>real ingested data</b> from the World Bank (CC BY 4.0), with the source, data package, and lineage downloadable under each figure. The convergence metrics are computed across roughly 180 countries; the recipe is in the method note."

movements:
  - eyebrow: "The divergence cut"
    fig: "FIG. 1"
    question: "Did every poor region rise together?"
    claim: "East Asia edged ahead of Africa in 1990. By 2024 it was five times richer."
    dropCap: true
    explainer: "In 1990 East Asia was only a little richer than Sub-Saharan Africa, and both sat far below the world average. Then they split. By 2024 East Asia had more than quadrupled, to about $24,000 a person, while Sub-Saharan Africa crawled to $4,873. South Asia more than quadrupled too, from a lower base, and now sits second-poorest, above only Africa. One generation, one region sprinting and one standing still."
    captionLeft: "<b>GDP per capita, PPP</b> · constant 2021 international $ · by region"
    captionRight: "1990 — 2024"
    source: "Source · World Bank — World Development Indicators (ICP PPP) · CC BY 4.0"
    chart:
      id: "c1"
      dataRefs: ["gdp-per-capita-ppp-world", "gdp-per-capita-ppp-eas", "gdp-per-capita-ppp-sas", "gdp-per-capita-ppp-lcn", "gdp-per-capita-ppp-ssf"]
      ymax: 50000
      yTicks: [0,10000,20000,30000,40000,50000]
      xTicks: [1990,2000,2010,2020,2024]
      series:
        - { name: "World", color: "stone", data: [[1990,11257],[2024,21405]] }
        - { name: "East Asia", color: "hope", data: [[1990,5756],[2024,24016]] }
        - { name: "South Asia", color: "ochre", data: [[1990,2221],[2024,9654]] }
        - { name: "Latin America", color: "uncertain", data: [[1990,12426],[2024,19959]] }
        - { name: "Sub-Saharan Africa", color: "despair", data: [[1990,3775],[2024,4873]] }
    take:
      hope: "East Asia's leap proves that a poor region can lift millions out of poverty in a few decades."
      despair: "Sub-Saharan Africa's stagnation shows that growth is not automatic, and the gap between the fastest and slowest growers is now wider than ever."
      confusion: "How much of East Asia's rise was due to deliberate policy versus lucky timing and global demand is still hotly debated."
  - eyebrow: "The lens flip"
    fig: "FIG. 2"
    question: "Is the spread of incomes actually shrinking?"
    claim: "Weigh by people and the world converges. Weigh by countries and it does not."
    explainer: "Imagine lining up every person on Earth by their country's average income. In 1990, that line stretched from a poor farmer in Malawi to a banker in Zurich, and the gap between them was wide. By 2024, the line had compressed: the poor farmer's grandchildren are still poorer, but the distance to the banker has shrunk by a quarter. That is the people-weighted view: China and India pulled hundreds of millions upward, so the global person-to-person spread narrowed. But line up countries instead, each with one vote, and the spread barely budged — the rich countries stayed rich, the poor ones stayed poor, and the middle barely grew. The two numbers tell one story: a few big countries got richer, but most small countries did not."
    sidenote: { mark: "a", text: "σ-convergence asks whether the <em>spread</em> of incomes narrows. A falling line means rich and poor are drawing closer; a flat line means the distance is unchanged, whatever individual countries do." }
    captionLeft: "<b>Income dispersion</b> · standard deviation of ln(GDP per capita)"
    captionRight: "1990 — 2024"
    source: "Source · World Bank — WDI (PPP × population) · CC BY 4.0"
    chart:
      id: "c2"
      dataRefs: ["convergence-sigma-unweighted", "convergence-sigma-weighted"]
      ymax: 1.4
      yTicks: [0,0.4,0.8,1.2]
      xTicks: [1990,2000,2010,2024]
      series:
        - { name: "Across countries", color: "stone", data: [[1990,1.19],[2024,1.16]] }
        - { name: "Across people", color: "hope", data: [[1990,1.22],[2024,0.92]] }
    take:
      hope: "Billions of people in the world's two most populous countries have seen their incomes rise dramatically, shrinking the gap between the typical global citizen."
      despair: "For the majority of countries — especially small, poor ones — the income gap with the rich world has hardly closed at all."
      confusion: "How much of the people-weighted convergence is just China and India, and how much is a broader trend among all poor countries?"
  - eyebrow: "The two giants"
    fig: "FIG. 3"
    question: "If the world is converging, who is doing the converging?"
    claim: "Almost all of the catch-up is two countries."
    explainer: "In 1990, if you lined up every country by average income and measured how far apart they were, the gap was a chasm. By 2024, that chasm had narrowed by half — but almost all the closing came from two places. Exclude China and India, and the gap barely budged: 0.54 in 1990, 0.52 in 2024. The rest of the world, taken together, is not catching up. The global story of convergence is really the story of more than a third of humanity pulling the rest of the line."
    captionLeft: "<b>Between-country income inequality</b> · population-weighted mean log deviation"
    captionRight: "1990 — 2024"
    source: "Source · World Bank — WDI (PPP × population) · CC BY 4.0"
    chart:
      id: "c3"
      dataRefs: ["convergence-mld-all", "convergence-mld-ex-giants"]
      ymax: 0.9
      yTicks: [0,0.3,0.6,0.9]
      xTicks: [1990,2000,2010,2024]
      series:
        - { name: "All countries", color: "despair", data: [[1990,0.77],[2024,0.38]] }
        - { name: "Excluding China & India", color: "stone", data: [[1990,0.54],[2024,0.52]] }
    take:
      hope: "Two countries lifted more than a third of humanity toward rich-world incomes; that is real, and it is huge."
      despair: "For the other 180-odd countries, the gap to the rich world has not shrunk in thirty-five years."
      confusion: "How much of the stagnation is bad policy versus rich-world trade rules versus geography — the data alone cannot apportion blame."
  - eyebrow: "The test itself"
    fig: "FIG. 4"
    question: "Do poorer economies simply grow faster?"
    claim: "Poorer economies did grow faster — but lean on the populous ones."
    explainer: "China and India alone hold a third of the world's people. Between 2000 and 2024, both grew far faster than rich countries, and the statistical line that tracks all 183 economies shows a clear pattern: the poorer a country started, the faster it tended to grow. The slope is three times steeper when you weight by population — meaning the big poor countries pulled the average up. That is the catch: the convergence is real, but it leans heavily on a few giants."
    sidenote: { mark: "b", text: "Each bubble is a country, sized by population; the axis runs from poor on the left to rich on the right. A downward-sloping fit means poorer economies grew faster — convergence. The two fits weight every country equally (dashed) or by its population (solid)." }
    captionLeft: "<b>Growth 2000–2024 vs starting income</b> · 183 countries · bubble = population"
    captionRight: "2000 — 2024"
    source: "Source · World Bank — WDI (PPP × population) · CC BY 4.0"
    chart:
      id: "c4"
      dataRef: "convergence-scatter"
      ymax: 8
      yTicks: [-4,0,4,8]
      xTicks: [1000,10000,100000]
      series: []
    take:
      hope: "The world's two most populous nations have lifted hundreds of millions out of poverty by growing faster than the rich world."
      despair: "For most small or medium poor countries, the catch-up is much weaker — the unweighted slope is barely a third as steep."
      confusion: "Whether the pattern holds for the next twenty years depends on whether the giants keep growing fast and whether smaller economies can break into the club."

pullQuote:
  text: "If the unit you count is people, convergence is alive and well. If it is countries, the catch-up of the last few decades is mostly the story of two of them."
  cite: "The whole argument, in one line"

methodology:
  - { term: "GDP per capita, PPP", detail: "World Bank series NY.GDP.PCAP.PP.KD — constant 2021 international dollars, adjusted for price differences across countries. The welfare-relevant income measure; market-exchange-rate GDP overstates the gap to poor countries." }
  - { term: "σ-convergence", detail: "The population-weighted and unweighted standard deviation of ln(GDP per capita) across a balanced panel of ~180 countries, each year. Falling = the spread of incomes is narrowing." }
  - { term: "β-convergence", detail: "An ordinary-least-squares fit of annualized growth (2000–2024) on the log of starting income, weighted by population and unweighted. A negative slope means poorer economies grew faster. The weighted slope is roughly three times steeper than the unweighted one." }
  - { term: "Mean log deviation", detail: "A population-weighted measure of between-country income inequality. Computed for all countries and again with China and India removed, to isolate how much of the fall is those two." }
  - { term: "Galton's fallacy", detail: "A negative growth-on-initial-income slope need not mean the gap is closing — regression to the mean can produce it while the spread holds constant. This is why the σ chart and the β chart are shown side by side; they are different questions (Friedman 1992; Quah 1993)." }

sources:
  - { id: "wb-gdp-ppp", name: "World Bank — GDP per capita, PPP (NY.GDP.PCAP.PP.KD)", url: "https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.KD", license: "CC BY 4.0", vintage: "2026-06-12", note: "International Comparison Program / OECD national accounts." }
  - { id: "wb-pop", name: "World Bank — Population, total (SP.POP.TOTL)", url: "https://data.worldbank.org/indicator/SP.POP.TOTL", license: "CC BY 4.0", vintage: "2026-06-12", note: "Used as the weighting series for the people-vs-countries metrics." }
  - { id: "wb-china-poverty", name: "World Bank — “Lifting 800 Million People Out of Poverty: Lessons from China’s Experience” (2022)", url: "https://www.worldbank.org/en/news/press-release/2022/04/01/lifting-800-million-people-out-of-poverty-new-report-looks-at-lessons-from-china-s-experience", license: "link-only", vintage: "2022", note: "China contributed close to three-quarters of the global fall in extreme poverty over 1981–2020 — the basis for the “two countries” framing." }
  - { id: "wir-2022", name: "Chancel, Piketty, Saez & Zucman — World Inequality Report 2022", url: "https://wir2022.wid.world/", license: "link-only", vintage: "2022", note: "Between-country inequality has fallen since 1980 while inequality within most countries has risen — the within-country gap now exceeds the between-country gap." }
  - { id: "kremer-2021", name: "Kremer, Willis & You — “Converging to Convergence” (NBER 29484)", url: "https://www.nber.org/papers/w29484", license: "link-only", vintage: "2021", note: "The β-convergence coefficient flipped from divergence in the 1960s to convergence around 2000, as the correlates of growth — human capital, policies, institutions — themselves converged across countries." }
  - { id: "patel-2021", name: "Patel, Sandefur & Subramanian — “The New Era of Unconditional Convergence” (J. Development Economics, 2021)", url: "https://www.cgdev.org/publication/new-era-unconditional-convergence", license: "link-only", vintage: "2021", note: "Documents that poorer countries have, on average, been catching up since the mid-1990s — driven by faster, steadier developing-world growth rather than a slowing rich-world frontier." }
  - { id: "johnson-2020", name: "Johnson & Papageorgiou — “What Remains of Cross-Country Convergence?” (J. Econ. Literature)", url: "https://www.aeaweb.org/articles?id=10.1257/jel.20181207", license: "link-only", vintage: "2020", note: "The skeptical survey: recent convergence is fragile and concentrated in China and India." }
---

### Still lost? Read this.

Take a room with a hundred people. The poorest ones have been getting richer faster than the rich ones — but only if you count by person, not by country. That's the whole trick. If you weight by population, the world looks like it's converging, because China and India are in the room and they are huge. If you count each country equally, the world looks stuck, because most small poor countries are not catching up at all.

Almost all of the global catch-up is two countries. East Asia began barely ahead of Africa and is now five times richer. China alone accounts for close to three-quarters of the world's entire fall in extreme poverty — more people than the rest of the world combined. But that success story is not a blueprint that works everywhere. It depended on specific history, geopolitics, and luck. Most of the other poor countries are still waiting for their turn.

The one thing you can say at dinner and be right: the world is getting more equal if you count by people, not by countries. That is a true statement. It is also a fragile one, because it leans almost entirely on two places — and because even as the gap between countries has narrowed, the gap within most of them has widened. The headline is hopeful. The catch is that the headline is hiding who it is about.

