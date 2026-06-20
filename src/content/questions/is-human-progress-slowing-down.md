---
question: "Is human progress slowing down?"
dek: "For seventy-five years almost every measure of human well-being improved. The world average is now rising slower than it has in generations. But the average is a fiction: progress did not fade evenly, it split apart."
theme: "Human Development"
kickerNumber: "14"
verdict: "Not slowing so much as diverging — the regions that drove the gains have nearly arrived, while the frontier that needs them most has barely moved."
order: 14
publishedAt: 2026-06-17
illustrative: false
status: "published"

atlas:
  hope:
    pos: 0.42
    lens: "Every line is near its best level ever; child death keeps falling, the internet keeps spreading, and the regions that won did so completely."
  despair:
    pos: 0.6
    lens: "The remaining poverty has pooled in one region, two gains have reversed outright, and the engine that drove the last great surge cannot fire again."

caveats:
  - "World totals hide more than they show here, which is the point. Wherever the data allows, this piece drops from the global line to regions and to individual countries, because the average is the least honest number on the page."
  - "We borrow the question from the World Bank's Atlas of Global Development 2026, but not its method. The Atlas uses a stage-conditional, country-level model; we use a simpler world-and-region trend comparison we can show in full. The direction agrees; our magnitudes are our own."
  - "Pace is measured against 2000–2013, an extraordinary period. Some of what reads as a slowdown is the end of an exceptional sprint, not the onset of decline. The piece keeps that distinction in view."

intro:
  - "Ask whether the world is still getting better and the data answers yes, then quietly adds a second word: slower. The lines that defined the last three-quarters of a century — longer lives, fewer poor, more children surviving — almost all still bend the right way. The rate at which they bend has dropped to a third or a quarter of what it was a decade ago."
  - "But a single world line is the wrong place to read this story, because the slowdown is not something happening to everyone at once. It is the sum of two opposite motions. The regions that powered the great surge, above all East and South Asia, drove their numbers so close to the finish that there is little distance left to cover. The region that still has the furthest to go, Sub-Saharan Africa, has barely moved. Average those together and you get a gentle global fade that nobody actually lives in."
  - "So the honest version of the question is not whether progress is slowing, but where it stopped and where it never really started. This piece follows it down from the world to the region to the country, because that is the only altitude where the word means anything. Along the way two gains have not merely slowed but reversed, and one, the internet, is moving faster than ever. The picture is not a fade. It is a map."

movements:
  - eyebrow: "The reframe"
    fig: "FIG. 1"
    dropCap: true
    question: "Is the world's progress really slowing for everyone?"
    claim: "No: East Asia drove extreme poverty from two in three people to one in fifty, while Sub-Saharan Africa is still near one in two."
    explainer: "Four regions, the same line, opposite endings. In 1990 about two-thirds of East Asians and half of South Asians lived in extreme poverty. By 2024 East Asia was near one in fifty and South Asia under one in twenty-five. They did not slow down so much as run out of poverty to cut. Latin America made the same trip from a lower start. Sub-Saharan Africa is the line that refuses to fall: more than six in ten in 1990, still about four and a half in ten today. The world average drops because three of these lines reached the floor, and it flattens because the fourth never left the ceiling. There is no single global pace here. There are regions that finished and a region that has scarcely begun."
    captionLeft: "<b>Extreme poverty</b> · % living on under $3.00 a day · by region · 2021 PPP"
    captionRight: "three regions reached the floor; one did not"
    source: "Source · World Bank — Poverty and Inequality Platform · CC BY 4.0"
    chart:
      id: "m1"
      dataRefs: ["poverty-300-eas", "poverty-300-sas", "poverty-300-lcn", "poverty-300-ssf"]
      ymax: 80
      yTicks: [0, 20, 40, 60, 80]
      xTicks: [1990, 2000, 2010, 2024]
      x0: 1990
      x1: 2024
      valueSuffix: "%"
      series:
        - { name: "East Asia & Pacific", color: "hope", data: [[1990, 67], [2024, 2]] }
        - { name: "South Asia", color: "uncertain", data: [[1990, 49.7], [2024, 3.8]] }
        - { name: "Latin America", color: "ochre", data: [[1990, 20.7], [2024, 4.3]] }
        - { name: "Sub-Saharan Africa", color: "despair", data: [[1990, 61.5], [2024, 45.1]] }
    take:
      hope: "Two of the most populous regions on earth all but eliminated extreme poverty inside a single generation."
      despair: "The poverty that remains has pooled almost entirely in the one region least able to grow its way out."
      confusion: "The global slowdown is mostly an arithmetic illusion: it is what you get from averaging a finished race with one that has barely started."
  - eyebrow: "The frontier"
    fig: "FIG. 2"
    question: "Where does the world's remaining poverty actually live?"
    claim: "Sub-Saharan Africa now carries an extreme-poverty rate ten times any other region's, and the gap shows up country by country."
    explainer: "Stand the regions side by side at their latest reading and the divergence becomes a cliff. East Asia, South Asia and Latin America all sit between two and four percent. Sub-Saharan Africa sits near forty-five. The same split runs underneath, between countries that look alike from a distance until you check the numbers. India cut its extreme-poverty rate from about sixty percent in the late 1970s to around five percent by 2022, one of the great escapes in economic history. Nigeria started from a similar height and has barely moved, still above forty percent. Both get named in the same breath as giant developing economies, yet on this measure they live in different worlds. Where you are born inside the average decides everything: whether the escape already happened, or never came."
    captionLeft: "<b>Extreme poverty today</b> · % under $3.00 a day · latest year · by region"
    captionRight: "one region, ten times the rest"
    source: "Source · World Bank — Poverty and Inequality Platform · CC BY 4.0"
    chart:
      id: "m2"
      dataRef: "progress-poverty-by-region"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    regional:
      label: "Two countries, two endings"
      note: "India and Nigeria began at similar heights; only one made the escape."
      refs:
        - { ref: "poverty-300-ind", name: "India", color: "hope" }
        - { ref: "poverty-300-nga", name: "Nigeria", color: "despair" }
    take:
      hope: "Most of the developing world has pushed extreme poverty down to a few percent, which once seemed impossible."
      despair: "A billion-person region has been left holding nearly all of the problem, and its largest economy is stuck near where it started."
      confusion: "Two countries called peers can sit forty points apart, so the category 'developing' hides as much as it explains."
  - eyebrow: "The number that grew"
    fig: "FIG. 3"
    question: "If the rate fell almost everywhere, did the problem shrink?"
    claim: "In headcount the world's poor fell from 2.3 billion to about 850 million, but Sub-Saharan Africa's nearly doubled, and it now holds seven in ten of all the extreme poor."
    explainer: "A falling rate and a falling number are not the same thing, and the space between them is where this story turns. Counted in people rather than percentages, the world's retreat from poverty is staggering: about 2.3 billion lived in extreme poverty in 1990 and roughly 850 million do today, even as the planet added more than two and a half billion people. Almost all of that drop happened in Asia. East Asia went from 1.2 billion poor to under fifty million; South Asia from about 500 million to some sixty. Sub-Saharan Africa moved the opposite way. It counted 321 million poor in 1990 and about 582 million now, close to double, because its poverty rate eased only slowly while its population grew fast enough to outrun the decline. That reorders the whole map. In 1990 roughly one in seven of the world's extreme poor lived in Sub-Saharan Africa; today it is nearly seven in ten. Subtract that one region and global poverty looks all but finished. Add it back and most of what remains sits in a single place."
    captionLeft: "<b>People in extreme poverty</b> · millions under $3.00 a day · by region · 2021 PPP"
    captionRight: "every region emptied but one"
    source: "Source · World Bank — Poverty and Inequality Platform · CC BY 4.0"
    chart:
      id: "m3"
      dataRefs: ["poor-count-eas", "poor-count-sas", "poor-count-lcn", "poor-count-ssf"]
      ymax: 1300
      yTicks: [0, 400, 800, 1200]
      xTicks: [1990, 2000, 2010, 2024]
      x0: 1990
      x1: 2024
      series:
        - { name: "East Asia & Pacific", color: "hope", data: [[1990, 1218], [2024, 47]] }
        - { name: "South Asia", color: "uncertain", data: [[1990, 503], [2024, 63]] }
        - { name: "Latin America", color: "ochre", data: [[1990, 91], [2024, 28]] }
        - { name: "Sub-Saharan Africa", color: "despair", data: [[1990, 321], [2024, 582]] }
    take:
      hope: "There are about 1.4 billion fewer people in extreme poverty than in 1990, the steepest fall ever recorded."
      despair: "Sub-Saharan Africa now holds nearly seven in ten of the world's extreme poor, up from one in seven, and its count is still rising."
      confusion: "A rate that falls while the headcount climbs is one region read two ways, and only the flattering reading fits on a poster."
  - eyebrow: "The engine"
    fig: "FIG. 4"
    question: "Why did some regions finish while others stalled?"
    claim: "Growth. In 1960 Sub-Saharan Africa was richer per person than East Asia; today East Asia is eight times richer."
    explainer: "Behind every poverty line on this page sits one machine: economic growth. In 1960 the average East Asian and the average sub-Saharan African earned almost the same, a little over a thousand of today's dollars a year. Then East Asia's income multiplied more than tenfold, past thirteen thousand. South Asia's grew sevenfold. Sub-Saharan Africa's barely moved, from about 1,160 dollars to 1,590 in sixty-four years. A region that began the era slightly ahead of East Asia ended it eight times poorer. This is the engine under all the other charts. Where incomes climbed, poverty fell, lives lengthened and schools filled. Where they stalled, so did everything else."
    captionLeft: "<b>GDP per capita</b> · constant 2015 US$ · by region"
    captionRight: "Africa and East Asia began level"
    source: "Source · World Bank — World Development Indicators · CC BY 4.0"
    chart:
      id: "m4"
      dataRefs: ["gdp-per-capita-eas", "gdp-per-capita-sas", "gdp-per-capita-lcn", "gdp-per-capita-ssf"]
      ymax: 14000
      yTicks: [0, 3500, 7000, 10500, 14000]
      xTicks: [1960, 1980, 2000, 2024]
      x0: 1960
      x1: 2024
      series:
        - { name: "East Asia & Pacific", color: "hope", data: [[1960, 1147], [2024, 13253]] }
        - { name: "South Asia", color: "uncertain", data: [[1960, 332], [2024, 2355]] }
        - { name: "Latin America", color: "ochre", data: [[1960, 3336], [2024, 8873]] }
        - { name: "Sub-Saharan Africa", color: "despair", data: [[1960, 1158], [2024, 1589]] }
    countries:
      label: "Income per person today, a handful of countries"
      note: "From Switzerland to Burundi, a three-hundred-fold spread."
      ref: "gdp-per-capita-by-country"
    take:
      hope: "Two regions turned themselves from poor to middle-income in two generations, the engine that drove every other gain."
      despair: "An entire region's average income is essentially where it was sixty years ago, and the growth gap is still widening."
      confusion: "The same starting line led to a tenfold gap, so 'development' describes an outcome far more than a shared path."
  - eyebrow: "The clearest cost"
    fig: "FIG. 5"
    question: "Does the slowdown show up in how long we live?"
    claim: "World life expectancy is about 73 years, roughly two short of where the old trend pointed — and the gap behind the average is wider still."
    explainer: "Through the 2000s, world life expectancy rose by a little over a third of a year, every year. Had that pace held, a person born in 2023 could expect almost 75 years. The real figure is about 73. Part of the shortfall is the pandemic, which erased years of gains and has not been fully repaid; part is the harder, dearer grind against the diseases of middle and old age. The regional lines tell the deeper story. Europe and Central Asia, already near 79, has little room left to climb. East Asia has all but caught the rich world. Sub-Saharan Africa rose from 41 years in 1960 to about 63, a vast gain, and still sits more than fifteen years behind. The average slows because the leaders are near the ceiling, not because humanity has stopped reaching."
    captionLeft: "<b>World life expectancy</b> · years at birth · actual against the continued 2000–2013 pace"
    captionRight: "the gap a single decade opened"
    source: "Source · World Bank & UN World Population Prospects, via Data360 · CC BY 4.0; the counterfactual line is the author's"
    chart:
      id: "m5"
      dataRefs: ["progress-lifeexp-actual", "progress-lifeexp-counterfactual"]
      ymin: 60
      ymax: 80
      yTicks: [60, 65, 70, 75, 80]
      xTicks: [1990, 2000, 2010, 2023]
      x0: 1990
      x1: 2023
      series:
        - { name: "Actual", color: "ochre", data: [[1990, 64.2], [2023, 73.17]] }
        - { name: "If the 2000s pace had held", color: "stone", dashed: true, data: [[2013, 71.1], [2023, 74.84]] }
    regional:
      label: "The gap behind the average"
      note: "Rich regions near the ceiling; Africa still fifteen years behind, still climbing."
      refs:
        - { ref: "life-expectancy-ecs", name: "Europe & Central Asia", color: "stone" }
        - { ref: "life-expectancy-eas", name: "East Asia", color: "hope" }
        - { ref: "life-expectancy-ssf", name: "Sub-Saharan Africa", color: "despair" }
    countries:
      label: "The spread behind the line"
      note: "Life expectancy in 2024: Switzerland 84, Nigeria 55 — a thirty-year gap."
      ref: "life-expectancy-by-country"
    take:
      hope: "Seventy-three years is the longest average life humans have ever lived, and Africa's climb has not stopped."
      despair: "Two years of expected life were lost against trend in a decade, and a fifteen-year regional gap remains."
      confusion: "A flattening world line can mean a problem solved at the top or one untouched at the bottom, and here it means both."
  - eyebrow: "The deepest victory"
    fig: "FIG. 6"
    question: "What about the thing humanity has fought longest?"
    claim: "Child death still falls almost everywhere, but at under two-fifths of its 2000s pace."
    explainer: "Of every hundred children born in 1800, more than forty died before their fifth birthday. By 2023 the figure was under four. No statistic on earth bends more steeply toward mercy, and unlike the others on this page it is still falling in nearly every country. But even this line has eased: child mortality fell in the last decade at under two-fifths of its 2000s speed. That is the shape of the whole question in one measure. The direction is still toward survival, almost everywhere. The speed is no longer what it was. A slowdown in the greatest thing the species has ever done is still not the same as it stopping."
    captionLeft: "<b>Child mortality</b> · deaths before age five per 100 live births · world"
    captionRight: "1800 — 2023"
    source: "Source · Our World in Data — UN IGME & Gapminder · CC BY 4.0"
    chart:
      id: "m6"
      dataRef: "child-mortality-world"
      ymax: 45
      yTicks: [0, 15, 30, 45]
      xTicks: [1800, 1900, 2000, 2023]
      x0: 1800
      x1: 2023
      series:
        - { name: "Child deaths per 100 births", color: "hope", data: [[1800, 42.8], [2023, 3.67]] }
    countries:
      label: "Where a child's odds are worst, 2024"
      note: "Deaths before age five per 1,000 births: Nigeria 116, Finland 2."
      ref: "child-mortality-by-country"
    take:
      hope: "The single greatest achievement in human history is still advancing, even at a gentler grade."
      despair: "If the world's most unstoppable line can lose this much speed, the more fragile gains have further to fall."
      confusion: "Slowing and falling at once is the honest state of nearly every line here, and neither word alone is the answer."
  - eyebrow: "The starkest gap"
    fig: "FIG. 7"
    question: "Where is the divergence most extreme of all?"
    claim: "In childbirth: the world halved maternal deaths, yet a Nigerian mother's risk runs over 200 times a Swedish mother's."
    explainer: "If the divergence has a sharpest edge, it is here. Worldwide, deaths in childbirth fell from about 460 per hundred thousand births in the mid-1980s to under 200 today, a fall of more than half. But the regional spread is the widest on this page. Europe and Central Asia sits near eleven. Sub-Saharan Africa, after its own steep drop from over a thousand, still sits near 450. The country figures are starker still: about 990 maternal deaths per hundred thousand in Nigeria against four in Sweden. The same act of giving birth carries a two-hundred-fold difference in whether a mother survives it. Almost all of these deaths are preventable with basic care, which is why the gap is really a map of where that care reaches and where it does not."
    captionLeft: "<b>Maternal mortality</b> · deaths per 100,000 live births · by region"
    captionRight: "the widest gap on the page"
    source: "Source · WHO, UNICEF, World Bank & UN — via World Development Indicators · CC BY 4.0"
    chart:
      id: "m7"
      dataRefs: ["maternal-mortality-ssf", "maternal-mortality-sas", "maternal-mortality-eas", "maternal-mortality-ecs"]
      ymax: 1200
      yTicks: [0, 300, 600, 900, 1200]
      xTicks: [1985, 2000, 2010, 2023]
      x0: 1985
      x1: 2023
      series:
        - { name: "Sub-Saharan Africa", color: "despair", data: [[1985, 1120], [2023, 448]] }
        - { name: "South Asia", color: "ochre", data: [[1985, 697], [2023, 120]] }
        - { name: "East Asia", color: "uncertain", data: [[1985, 199], [2023, 66]] }
        - { name: "Europe & Central Asia", color: "stone", data: [[1985, 48], [2023, 11]] }
    countries:
      label: "A mother's odds, by country, 2023"
      note: "Maternal deaths per 100,000 births: Nigeria 993, Sweden 4 — a 250-fold gap."
      ref: "maternal-mortality-by-country"
    take:
      hope: "Even Sub-Saharan Africa cut maternal death by more than half, and the rich world has nearly eliminated it."
      despair: "A two-hundred-fold gap in surviving childbirth is the single most unequal number on this page."
      confusion: "A huge global gain and a brutal remaining gap are the same fact read at two different altitudes."
  - eyebrow: "Schooling"
    fig: "FIG. 8"
    question: "Did the ability to read spread evenly?"
    claim: "Adult literacy passed 95 percent across Asia and Latin America, but still sits near 69 percent in Sub-Saharan Africa."
    explainer: "The same map turns up in who can read. Latin America and East Asia have pulled adult literacy up to ninety-five percent and above. South Asia climbed from under forty percent in the 1970s to about three-quarters today, a huge gain from a low base. Sub-Saharan Africa rose too, from roughly half in the mid-1980s to near seventy percent, but it stays the one region where almost a third of adults still cannot read. Across most of the world the fight for basic literacy is essentially won. On the frontier it is still being fought, two generations after it was settled elsewhere."
    captionLeft: "<b>Adult literacy</b> · % of adults who can read · by region"
    captionRight: "near-universal, except on the frontier"
    source: "Source · UNESCO via Our World in Data · CC BY 4.0"
    chart:
      id: "m8"
      dataRefs: ["literacy-rate-europe-and-northern-america", "literacy-rate-eastern-and-south-eastern-asia", "literacy-rate-latin-america-and-the-caribbean", "literacy-rate-central-and-southern-asia", "literacy-rate-sub-saharan-africa"]
      ymax: 100
      yTicks: [0, 25, 50, 75, 100]
      xTicks: [1980, 1995, 2010, 2023]
      x0: 1980
      x1: 2023
      valueSuffix: "%"
      series:
        - { name: "Europe & N. America", color: "stone", data: [[2003, 98], [2022, 99]] }
        - { name: "East & SE Asia", color: "hope", data: [[1976, 66], [2023, 97]] }
        - { name: "Latin America", color: "ochre", data: [[1974, 79], [2023, 95]] }
        - { name: "Central & South Asia", color: "uncertain", data: [[1975, 39], [2023, 77]] }
        - { name: "Sub-Saharan Africa", color: "despair", data: [[1984, 49], [2023, 69]] }
    take:
      hope: "Basic literacy is now close to universal across most of humanity, a goal that looked distant a lifetime ago."
      despair: "One region still leaves nearly a third of its adults unable to read, the same region that lags on income and life."
      confusion: "A near-flat line at the top and a still-climbing one at the bottom are both 'progress', measured from opposite ends."
  - eyebrow: "The women's frontier"
    fig: "FIG. 9"
    question: "Did women's gains slow with the rest?"
    claim: "Less than most: women's share of parliamentary seats more than doubled since 1997, and girls' secondary enrolment nearly doubled since 1970."
    explainer: "Two measures of women's lives barely flinched. In 1997 women held under twelve percent of the world's parliamentary seats; by 2025 they held more than twenty-seven. Girls' secondary-school enrolment rose from about forty percent in 1970 to over seventy-five today. Neither has reached parity, and a seat in a chamber is not the same as power inside it. But both kept climbing through the decade that slowed almost everything else, for the same reason connectivity did: they started far from finished, with a long way still to run. The pattern of the whole piece holds even here. Where the gap is widest, the movement stays fast; it is the gains nearest completion that stall."
    captionLeft: "<b>Women's advancement</b> · % · parliamentary seats and girls' secondary enrolment"
    captionRight: "the gains still climbing"
    source: "Source · IPU, UN Women & UNESCO — via World Bank WDI, Data360 · CC BY 4.0"
    chart:
      id: "m9"
      dataRefs: ["female-secondary-world", "women-parliament-world"]
      ymax: 100
      yTicks: [0, 25, 50, 75, 100]
      xTicks: [1970, 1990, 2010, 2024]
      x0: 1970
      x1: 2024
      valueSuffix: "%"
      series:
        - { name: "Girls in secondary school", color: "uncertain", data: [[1970, 39.7], [2024, 77.1]] }
        - { name: "Women in parliament", color: "hope", data: [[1997, 11.7], [2025, 27.2]] }
    take:
      hope: "On two fronts where women had the furthest to go, progress hardly broke stride."
      despair: "A quarter of the seats and three-quarters of the desks is still well short of equal."
      confusion: "Presence and enrolment are easier to count than power and learning, so the cleanest lines measure the thinnest things."
  - eyebrow: "The fuller measure"
    fig: "FIG. 10"
    question: "And when you measure power, not just seats?"
    claim: "Measured broadly, women's political empowerment more than doubled since 1950, and its regional map is unlike any other here: income does not decide it."
    explainer: "Seats and school desks are the parts of women's lives that are simplest to count. The harder thing, whether women hold civil liberties, can organise, and reach real political power, is what V-Dem's political empowerment index tries to capture on a scale from zero to one. By that fuller measure the global figure climbed from about 0.33 in 1950 to 0.71 today, more than doubling, though it edged down a little after a peak in 2019 as democratic backsliding spread. What sets this measure apart is its map. Everywhere else in this piece the frontier is Sub-Saharan Africa and the rich regions lead. Here the order scrambles. Africa began in 1950 far below everyone, near 0.13, and has climbed the furthest of any region to about 0.67, passing Asia on the way. Asia, richer on average, now sits lowest at about 0.62, held down by populous states where women's political voice stays tightly constrained. Europe and South America lead, both above 0.80. Income built the schools and the clinics, but it did not buy women a political voice. That followed a different and more uneven path, and it is the one domain here where the poorest region is not the one left behind."
    captionLeft: "<b>Women's political empowerment index</b> · 0 = none, 1 = full · world"
    captionRight: "more than doubled since 1950"
    source: "Source · V-Dem (Democracy report v16) — via Our World in Data · CC BY 4.0"
    chart:
      id: "m10"
      dataRef: "women-empowerment-world"
      ymax: 1
      yTicks: [0, 0.25, 0.5, 0.75, 1]
      xTicks: [1950, 1975, 2000, 2025]
      x0: 1950
      x1: 2025
      series:
        - { name: "Women's political empowerment", color: "hope", data: [[1950, 0.327], [2025, 0.714]] }
    regional:
      label: "A map income doesn't draw"
      note: "Africa climbed from lowest to mid; Asia, richer, now trails. The poorest region is not last here."
      refs:
        - { ref: "women-empowerment-asia", name: "Asia", color: "despair" }
        - { ref: "women-empowerment-africa", name: "Africa", color: "ochre" }
        - { ref: "women-empowerment-south-america", name: "South America", color: "uncertain" }
        - { ref: "women-empowerment-europe", name: "Europe", color: "hope" }
    take:
      hope: "On the broadest measure of women's political standing, the world more than doubled since 1950, and the region that started last has climbed the most."
      despair: "Even this gain stalled after 2019 as democratic backsliding spread, and the most populous region still ranks lowest."
      confusion: "Women's political power is the one domain here where wealth doesn't set the order, so the usual frontier map simply does not apply."
  - eyebrow: "The reversals"
    fig: "FIG. 11"
    question: "Has anything actually gone backwards?"
    claim: "Yes: world hunger fell to about 8 percent by the mid-2010s, then climbed back — and measles vaccination has slipped since the pandemic."
    explainer: "Two gains did not merely slow. They turned. The share of the world that is undernourished fell through the 2000s to a low around the mid-2010s, then began rising again as conflict, climate shocks, food-price spikes and the pandemic stacked up. By 2023 it sat near eight and a half percent, back where it had been years earlier. Measles vaccination tells a sharper version: coverage that had climbed into the mid-eighties dropped during the pandemic and has not fully recovered, leaving more children exposed than a decade ago. These are small numbers against the long sweep of the page, but they are the only lines pointing the wrong way, and they sit on exactly the gains, food and disease, that the world thought it had locked in."
    captionLeft: "<b>Undernourishment</b> · % of the world · the gain that turned around"
    captionRight: "fell, then climbed back after the mid-2010s"
    source: "Source · FAO via World Bank — World Development Indicators · CC BY 4.0"
    chart:
      id: "m11"
      dataRef: "undernourishment-world"
      ymax: 15
      yTicks: [0, 5, 10, 15]
      xTicks: [2001, 2008, 2015, 2023]
      x0: 2001
      x1: 2023
      valueSuffix: "%"
      annots: [{ x: 2015, label: "the low point" }]
      series:
        - { name: "Undernourished", color: "despair", data: [[2001, 12.8], [2023, 8.5]] }
    take:
      hope: "Even after the rise, far less of the world goes hungry than at the century's start."
      despair: "Hunger and vaccination both moving the wrong way means some of the most basic gains are not locked in at all."
      confusion: "A line that falls for fifteen years and then climbs is neither victory nor defeat, but a warning that progress can spend itself."
  - eyebrow: "The unprotected"
    fig: "FIG. 12"
    question: "And the second reversal?"
    claim: "Measles vaccination climbed for decades, then slipped after the pandemic, leaving more children exposed than ten years ago."
    explainer: "The second line that turned is a needle. Measles vaccination coverage rose from the low double digits in 1980 to the mid-eighties by the late 2010s, one of the quiet triumphs of global health. Then the pandemic broke routine immunisation, and coverage fell, recovering only partly to about eighty-four percent by 2024. That leaves a larger share of children unprotected than a decade earlier. Measles is unforgiving of gaps: it spreads so easily that coverage has to stay very high to hold it back, so even a small slip reopens the door to outbreaks. Like hunger, it is a gain the world had nearly secured and then allowed to slacken, and the cost of that is paid by children too young to have chosen it."
    captionLeft: "<b>Measles vaccination</b> · % of one-year-olds covered · world"
    captionRight: "a rise, then a pandemic dip"
    source: "Source · WHO & UNICEF — via World Bank WDI, Data360 · CC BY 4.0"
    chart:
      id: "m12"
      dataRef: "immunization-world"
      ymax: 100
      yTicks: [0, 25, 50, 75, 100]
      xTicks: [1980, 1995, 2010, 2024]
      x0: 1980
      x1: 2024
      valueSuffix: "%"
      annots: [{ x: 2019, label: "peak, then the pandemic" }]
      series:
        - { name: "Measles coverage", color: "ochre", data: [[1980, 12.9], [2024, 84.3]] }
    take:
      hope: "Five in six of the world's children are still vaccinated against measles, up from almost none in 1980."
      despair: "Coverage going backwards at all means a disease the world had cornered is being handed back room to spread."
      confusion: "A line near its all-time high that has just ticked down is both a triumph and an early warning."
  - eyebrow: "The exception"
    fig: "FIG. 13"
    question: "Is anything moving faster than before?"
    claim: "One thing is: internet use spread faster after 2013 than before it, the lone line on the page that accelerated."
    explainer: "Against the broad slowdown, the internet ran the other way. In 2005 about one person in six was online; by 2024 it was roughly seven in ten, and the climb was steeper in the last decade than the one before. It is the clearest accelerator on this page. But even here the map matters more than the line. Europe and East Asia are above eighty and ninety percent, near saturation. Sub-Saharan Africa, starting from almost nothing in 2005, has reached only about a third. The frontier that lags on poverty and lifespan lags online too. Mobile phones, by contrast, have hit their ceiling: with more than one subscription per person worldwide, their once-explosive growth has slowed to a fifth of its old pace, not because the spread failed but because it finished."
    captionLeft: "<b>Internet use</b> · % of people online · world"
    captionRight: "the one line that sped up"
    source: "Source · ITU via World Bank — World Development Indicators, Data360 · CC BY 4.0"
    chart:
      id: "m13"
      dataRef: "internet-users-world"
      ymax: 80
      yTicks: [0, 20, 40, 60, 80]
      xTicks: [2005, 2010, 2017, 2024]
      x0: 2005
      x1: 2024
      valueSuffix: "%"
      series:
        - { name: "Internet users", color: "hope", data: [[2005, 15.6], [2024, 71.2]] }
    regional:
      label: "Online, but unevenly"
      note: "Near-saturation in the rich world and East Asia; about a third in Sub-Saharan Africa."
      refs:
        - { ref: "internet-users-ecs", name: "Europe & Central Asia", color: "hope" }
        - { ref: "internet-users-eas", name: "East Asia", color: "uncertain" }
        - { ref: "internet-users-ssf", name: "Sub-Saharan Africa", color: "despair" }
    take:
      hope: "Connectivity is the one measure here still gaining speed, and it is reaching the poor world fast."
      despair: "The same regional gap that defines poverty and lifespan has opened online, a generation late for Africa."
      confusion: "Faster growth and a widening gap describe the same line, depending on whether you read the rate or the distance."
  - eyebrow: "Did the poor catch up?"
    fig: "FIG. 14"
    question: "Across every economy, did poorer countries grow faster?"
    claim: "Only the giant ones. Count people and the poor caught up; count countries equally and they did not."
    explainer: "Here is the whole divergence in one frame. Each bubble is a country, placed by how rich it was in 2000 and how fast it grew afterward, sized by population. If poverty were a starting line everyone left at the same speed, the cloud would slope down: the poorer you began, the faster you would grow. Weighted by people, it does slope down, because China and India were enormous, poor and fast, and they bend the entire world toward catch-up. But weight every country equally and the slope nearly flattens. The typical poor country did not grow toward the rich. A handful of giant ones did, and pulled the global average along with them. 'The world is converging' and 'most poor countries are not' are both true at once, and the only difference between them is whether you are counting people or countries."
    captionLeft: "<b>Growth vs starting income</b> · 183 economies · 2000–2024 · bubble = population"
    captionRight: "a downward slope means the poor caught up"
    source: "Source · World Bank & Maddison Project — via Our World in Data · CC BY 4.0"
    chart:
      id: "m14"
      dataRef: "convergence-scatter"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    take:
      hope: "Weighted by humanity, the poor world really did grow faster and close the gap on the rich."
      despair: "Strip out a few giant winners and the typical poor country made no ground at all on the rich in a quarter-century."
      confusion: "The same scatter shows convergence and its absence, depending only on whether a country or a person is the unit."
  - eyebrow: "The verdict"
    fig: "FIG. 15"
    question: "So is human progress slowing down?"
    claim: "Across twelve measures, most improved at a fraction of their 2000s pace; a few held or sped up; the answer is divergence, not decline."
    explainer: "Set each measure's recent pace against its own pace a decade earlier, where a hundred percent would mean no change in speed. Most sit well below it. The deepest gains, against poverty, early death and child mortality, run at a quarter to two-fifths of their old rate. The access measures, sanitation, electricity and the internet, held their pace or beat it. The pattern is not a uniform fade. It is the signature of a world where the easiest and most concentrated wins were banked first, by the regions that could move fastest, while the unfinished work, online access, the African frontier, the slow diseases, is what remains. Progress did not stop. It arrived in some places, reversed in a couple, and still has not reached others. Whether the global line turns back up depends almost entirely on whether the frontier that has barely moved finally gets its own decade of speed."
    captionLeft: "<b>Pace of progress, 2013–2024</b> · as a share of the 2000–2013 pace · red = slowed, green = sped up"
    captionRight: "the dashed line is the 2000s pace"
    source: "Source · Author's calculation on World Bank & Our World in Data series · CC BY 4.0"
    chart:
      id: "m15"
      dataRef: "progress-pace-ratio"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    take:
      hope: "Almost every line is at or near its best level ever, and the worst news is that good things improved more slowly."
      despair: "A pace cut to a quarter, sustained, is the difference between finishing a job in a generation and abandoning it."
      confusion: "The single word 'slowing' hides a divergence — finished, reversed, accelerating and stalled, all at once."
  - eyebrow: "The map"
    fig: "FIG. 16"
    question: "If progress has an address, where is it?"
    claim: "On all seven measures this piece tracks, Sub-Saharan Africa is the region doing worst, and no other region is worst on even one."
    explainer: "The introduction promised a map, and here it is. Each row is one of the seven measures the piece has followed; each column is a world region, placed left to right from the poorest to the richest. A cell turns red where that region does worst on its row and green where it does best, with every row scored on its own scale, so the colours rank the regions against each other rather than against a single yardstick that would pretend a year of life and a point of poverty are the same thing. Read across a row and you see the spread on one measure. Read down a column and the argument of the whole piece assembles itself. The Sub-Saharan column is the darkest shade on all seven rows; no other region is worst on a single one. The numbers under the colour are not close. Nine in ten Europeans are online and one in three sub-Saharan Africans; a mother's risk of dying in childbirth is 448 per 100,000 births there against 11 in Europe. The gradient is not perfectly tidy: South Asia is poorer than Latin America yet vaccinates more of its children against measles, the ordinary texture of real development. The dominant pattern is still unmistakable, and it is the one thing a single world average is built to hide. Progress has an address. On most of these measures it has reached nearly everywhere except the place that needed it most."
    captionLeft: "<b>Where each region stands today</b> · seven measures · shaded worst (red) to best (green) within each row"
    captionRight: "one column is dark all the way down"
    source: "Source · World Bank, WHO, UNICEF, FAO & ITU — via WDI and the Poverty and Inequality Platform · CC BY 4.0"
    chart:
      id: "m16"
      dataRef: "progress-divergence-grid"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    take:
      hope: "Outside one region, most of these seven measures have reached nearly the whole world, which no earlier generation could say."
      despair: "One region places last on every one of these measures at once, the divergence compressed into a single dark column."
      confusion: "Income predicts most of the shading but not every cell, so even the clearest map keeps an argument inside it."

pullQuote:
  text: "Progress did not fade evenly. It arrived in some places, reversed in a couple, and never quite reached the rest."
  cite: "the through-line of this piece"

lenses:
  - who: "A demographer"
    confidence: "Reads the mortality tables"
    hope: "Life expectancy recovered most of its pandemic loss within two years, and Africa is still closing the gap."
    despair: "The era of fast, cheap gains from beating childhood infection is over, and what kills us now moves slowly."
  - who: "A development economist"
    confidence: "Models the poverty numbers"
    hope: "Two of the most populous regions on earth all but eliminated extreme poverty, the fastest broad gain in history."
    despair: "The remaining poverty is concentrated in the region with the weakest growth, so the easy phase is behind us."
  - who: "A public-health official in the Sahel"
    confidence: "Sees the frontier daily"
    despair: "Hunger is rising again and a vaccinated child is no longer a given, after years when both seemed settled."
    hope: "The tools that drove the gains still exist, and the internet is reaching us faster than electricity ever did."
  - who: "An economic historian"
    confidence: "Takes the long view"
    hope: "Every measure here is at or near its best level ever; the worry is about acceleration, not direction."
    despair: "Exceptional decades end, and the record is full of climbs that flattened into long, quiet stalls."

hopeCase: "Read the levels, not the speeds, and the story is triumphant. People live longer than ever, fewer are poor than ever, fewer children die than ever, more are online than ever. Two of the most populous regions on earth crossed from mass poverty to near-elimination inside a generation. A slowdown from that pace is still forward motion, and much of it is the arithmetic of success: a number near its ceiling is hard to push higher. On the genuinely unfinished frontier, connectivity is still gaining speed, and Sub-Saharan Africa's lifespan and access are climbing even where its poverty is stuck. The job is not done, but the direction across almost every line is still up."

despairCase: "Read the speeds and the map, and the story darkens. The gains that matter most have been cut to a quarter or a third of their old pace, and the remaining poverty has pooled almost entirely in one region whose largest economies have barely moved. Two basic gains, freedom from hunger and protection from measles, have reversed outright. The surge that set the benchmark was powered by China's once-in-history rise and an open-trade era now closing, tailwinds that will not return. If the frontier that has stalled does not find its own decade of speed, the global line does not just slow. It splits permanently into a finished world and a stranded one."

whatWouldChangeIt: "Watch the frontier, not the average. The number that matters is whether Sub-Saharan Africa's poverty rate finally breaks downward and whether its life expectancy keeps closing the gap, because that single region now holds most of the unfinished work. Watch the two reversals: if undernourishment and vaccination turn back down, the backsliding was a shock, not a trend. And watch whether the world line reattaches to its old pace in even two or three measures, which would argue for a plateau after a sprint rather than a stall. Faster on the frontier and the hope case wins. A widening gap, and the verdict tilts toward a world permanently split."

methodology:
  - term: "Divergence, not a single line"
    detail: "Wherever the data allows, the piece reads world, then region, then country, because the global average is a weighted blend of opposite trends. The regional poverty, life-expectancy and internet series are the same World Bank and Our World in Data measures shown un-averaged; the country pairs (India and Nigeria) are drawn from the same poverty source."
  - term: "Pace, not level"
    detail: "For each world series we fit a straight line by least squares over 2000–2013 and again over 2013 to the latest year, giving an annual rate of change, signed so improvement is always positive. The pace-ratio chart is the recent rate divided by the earlier one; below 100% means the gain slowed. This is a deliberately simple, fully visible measure, not the World Bank Atlas's stage-conditional country model, which is why our numbers differ from theirs."
  - term: "Reversals are shown as lines, not bars"
    detail: "Two measures, undernourishment and measles coverage, have a recent rate that turned negative — they went backwards. A bar clamped to zero would read as 'barely moved', so they are pulled out of the pace chart and shown as their own series, where the turn is visible."
  - term: "The closing grid is shaded row by row, not as a score"
    detail: "The final chart colours each region on each measure from the worst region (red) to the best (green), but every row is scaled on its own. There is no overall index, and no cell is comparable to a cell in another row, because a year of life and a point of poverty do not share a scale. The columns are ordered by one stated variable, income per person, so the eye can see whether outcomes track wealth, not by a hidden ranking. The women's empowerment figure uses the exact V-Dem index the Atlas uses, where elsewhere we lean on World Bank measures."
  - term: "Why there is no headline 'cost in people'"
    detail: "It is tempting to extend the fast 2000s poverty trend forward and count the 'extra' poor today. We refuse that figure: a poverty rate is bounded at zero, so a straight line from the fast years runs below zero within a decade and manufactures a dramatic but meaningless number. The honest statements are about pace, about the actual headcount today (about 847 million), and about where that poverty now lives."
  - term: "Prose and number audit"
    detail: "Explanatory text was drafted with AI assistance and then checked line by line against the derived data series; every quantitative claim traces to a figure produced by the project's pipeline. No outside numbers were introduced."

sources:
  - id: "wb-pip"
    name: "World Bank — Poverty and Inequality Platform"
    url: "https://pip.worldbank.org"
    license: "CC BY 4.0"
    vintage: "2026"
    note: "Extreme-poverty headcount ratio at $3.00 a day (2021 PPP), world, six regions, and individual countries."
  - id: "wb-data360"
    name: "World Bank — World Development Indicators, via Data360"
    url: "https://data360.worldbank.org"
    license: "CC BY 4.0"
    vintage: "2026"
    note: "Life expectancy, internet use, stunting, measles coverage and more, pulled through the Data360 API."
  - id: "owid-progress"
    name: "Our World in Data — child mortality, life expectancy, literacy"
    url: "https://ourworldindata.org"
    license: "CC BY 4.0"
    vintage: "2024"
    note: "Long-run child mortality (UN IGME, Gapminder) and the deep-history lines; regional life-expectancy series."
  - id: "fao-undernourishment"
    name: "FAO — Prevalence of undernourishment (via World Bank WDI)"
    url: "https://data.worldbank.org/indicator/SN.ITK.DEFC.ZS"
    license: "CC BY 4.0"
    vintage: "2024"
    note: "Share of the world undernourished; the reversal after the mid-2010s."
  - id: "who-health"
    name: "WHO, UNICEF & UN — maternal mortality and immunization (via World Bank WDI)"
    url: "https://data.worldbank.org"
    license: "CC BY 4.0"
    vintage: "2024"
    note: "Maternal deaths per 100,000 births by region and country; measles vaccination coverage."
  - id: "maddison-convergence"
    name: "World Bank & Maddison Project — via Our World in Data"
    url: "https://ourworldindata.org/economic-growth"
    license: "CC BY 4.0"
    vintage: "2024"
    note: "GDP per capita levels and growth for 183 economies, 2000–2024; the convergence scatter."
  - id: "vdem-empowerment"
    name: "V-Dem (Democracy report v16) — via Our World in Data"
    url: "https://ourworldindata.org/grapher/women-political-empowerment-index"
    license: "CC BY 4.0"
    vintage: "2026"
    note: "The women's political empowerment index, scored 0 to 1, for the world and each continent. It is the exact measure the Atlas uses."
  - id: "wb-atlas-2026"
    name: "World Bank — Atlas of Global Development 2026"
    url: "https://data360.worldbank.org/en/atlas/global-progress/"
    license: "Cited for the question and framing, not re-hosted"
    vintage: "2026"
    note: "The source of the slowing-progress question; uses a different, stage-conditional method, so its magnitudes differ from ours."
---

This piece reads one question at three altitudes — world, region, country — because the global
average turned out to be the least honest number on the page. The method and its limits, including
the one counterfactual we kept and the one we refused, are described in the panels and the
methodology note above.

The explanatory text here was written with the help of a large language model, working only from the
open data series this project ingests and derives. Every number traces back to a figure in that
pipeline, and every change is tracked in the open.
