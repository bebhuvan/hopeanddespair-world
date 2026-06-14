---
question: "Is the world running out of children?"
dek: "The average woman now has about two children, half what her grandmother had, and in the richest countries far fewer. It is the quietest revolution of our age, and it is read two opposite ways: a liberation, and a reckoning."
theme: "Population"
kickerNumber: "08"
verdict: "A liberation and a reckoning at once"
order: 8
publishedAt: 2026-06-13
status: "published"
illustrative: false

atlas:
  hope: { pos: 0.30, lens: "fewer children, by choice" }
  despair: { pos: 0.82, lens: "the aging bill, and the lowest-low" }

caveats:
  - "This is a single number doing enormous work. The <b>total fertility rate</b> is the children a woman would have if she lived through one year's birth rates at every age. It is not a headcount of any real generation, and it bounces with the timing of births, so a low year can overstate a lasting fall. Read the direction and the spread, not the third decimal."
  - "Everything past the present year is a <b>projection, drawn dashed</b>. The history is measured; the future is the UN's medium variant, one path among many. Where the assumptions are pushed to their plausible edges, the world of 2100 swings by more than seven billion people — a fork this article gives its own chart."
  - "Replacement fertility is <b>about 2.1 children per woman</b> in a rich, low-mortality country, and somewhat higher where more children die young. We use 2.1 as the reference line throughout; it is a useful marker, not a magic threshold."
  - "Most series are real and individually sourced: fertility, births, deaths, growth, median age, and the projection variants from the <b>UN World Population Prospects 2024</b> (taken directly, CC BY 3.0 IGO, and via Our World in Data), the regional and dependency cuts and the drivers from the <b>World Bank</b>. Where the best evidence is a survey or a paper we cannot re-host — the desire gap, the rival projection, the academic debate — it is cited and linked, never invented, and tagged as such."
  - "The verdict at the top, and the three reads under every chart, are an <b>editorial synthesis</b>. For this question we deliberately refuse a single answer: the same fall is genuinely a gift and genuinely a problem, and which one you see depends on where you stand."

evidence:
  heroLabel: "Children per woman, worldwide / the total fertility rate"
  hero: [[1950,4.85],[1963,5.31],[1980,3.73],[2000,2.75],[2010,2.55],[2023,2.25]]
  windows:
    - { lab: "Since 1950", range: "1950 — 2023", from: 1950, to: 2023, verdict: "Halved", temp: "cool" }
    - { lab: "Since the peak", range: "1963 — 2023", from: 1963, to: 2023, verdict: "Down 58%", temp: "cool" }
    - { lab: "At replacement", range: "2000 — 2023", from: 2000, to: 2023, verdict: "On the line", temp: "warm" }
    - { lab: "The recent slide", range: "2010 — 2023", from: 2010, to: 2023, verdict: "And falling", temp: "warm" }
  readout: "Whatever window you pick, the line points down. The average woman in 1950 had nearly five children; the woman of the early 1960s, just over five, as fewer babies died and families had not yet thought to shrink; the woman of 2023, about 2.25, a whisker above the 2.1 it takes to replace a generation. Most of that fall is the best news of the last century, fewer children dying and more women choosing. The worry is only in the last stretch of the line, and in the places it has already passed through the floor."
  signals:
    - { fig: "FIG. 2", name: "Babies born each year", unit: "births worldwide", badUp: false, data: [[1950,91823940],[2012,146054880],[2023,132110264]] }
    - { fig: "FIG. 3", name: "Median age of humanity", unit: "years", badUp: true, data: [[1970,20.31],[2000,25.13],[2023,30.36]] }
    - { fig: "FIG. 4", name: "Share of people over 65", unit: "% of the world", badUp: true, data: [[1960,5.0],[1990,6.1],[2024,10.2]] }
    - { fig: "FIG. 5", name: "Children dying before age five", unit: "per 100 born", badUp: true, data: [[1950,24.7],[1990,9.36],[2023,3.67]] }
  recentFrom: 2000
  recentTo: 2023
  recentVerdict: "Past the line"
  recentTemp: "warm"
  synthesis: "Four signals, and they do not agree on a mood. Fewer children die than ever, which is pure relief and the root cause of all the rest. But the babies born each year peaked back in 2012, the median person has aged a full decade since 1970, and one in ten humans is now over 65, the most ever. The same root, child survival and women's choice, feeds a hopeful chart and three uneasy ones. That is the whole question in one panel."
  vantageNote: "Stand with a woman who now finishes school, works, and has the two children she wants instead of the six her grandmother bore and half-buried, and this is liberation. Stand with a pension system that needs four workers per retiree and is sliding toward two, and it is a slow emergency. Same number, opposite verdicts."

movements:
  - eyebrow: "The descent"
    fig: "FIG. 6"
    question: "Has the world's fertility really fallen — and how far?"
    claim: "The average woman had about five children in the early 1960s and has about two today. The world rate sits at 2.25, a hair above the 2.1 it takes to replace a generation."
    dropCap: true
    explainer: "Start with one woman and her granddaughter. The woman of the early 1960s bore, on average, 5.31 children; her granddaughter today has about 2.25. That is the total fertility rate, and it has more than halved within three generations of the same family. The world figure climbed a little first, to its 1963 peak, because children had begun to survive before parents had begun to plan, and then it fell without a serious pause for sixty years.\n\nThis is the demographic transition, the single most reliable pattern in population science, first named by Frank Notestein in the 1940s. It runs in the same order almost everywhere: first the death rate drops, so families that once buried half their children stop needing to bear so many, and a generation or two later the birth rate follows it down. Britain and France walked this path across the whole nineteenth century. Iran walked it in two decades. The shape is universal; only the speed changes.\n\nThe single clean line hides the only thing that matters next. A world average of 2.25 can mean a planet of identical middling families, or it can mean Seoul and Niamey averaged into a number that describes neither. It is the second. Before the worry or the relief, the honest move is to break this line apart, which is the rest of this page."
    sidenote: { mark: "a", text: "<b>Replacement</b> is about 2.1, not 2.0, because not every girl born survives to have her own children, and slightly more boys are born than girls. Where child death is still high it takes more births to replace a generation; the 2.1 line assumes the low mortality most of the world now has." }
    captionLeft: "<b>Children per woman</b> · total fertility rate · World"
    captionRight: "1950 — 2023"
    source: "Source · UN World Population Prospects (2024), via Our World in Data · CC BY 4.0"
    chart:
      id: "m1"
      dataRef: "fertility-rate-world"
      ymin: 0
      ymax: 6
      yTicks: [0,2,4,6]
      xTicks: [1950,1970,1990,2010,2023]
      annots: [{ x: 1963, label: "the peak — 5.3", y: 5.31 }]
      series:
        - { name: "Children per woman", color: "uncertain", data: [[1950,4.85],[2023,2.25]] }
    take:
      hope: "Almost the entire fall is good news arriving: children surviving, and women with the schooling, the contraception, and the freedom to choose a smaller family than their mothers had."
      despair: "The line has not levelled at replacement; it has sailed through it, and in much of the world it is still dropping with no floor in sight."
      confusion: "Whether 2.25 is a resting point or a waystation on the road to the ones and the zeroes below depends on places that have not finished falling."
  - eyebrow: "The descent"
    fig: "FIG. 7"
    question: "Weren't we recently terrified of the opposite problem?"
    claim: "We were. The population bomb was real, and it was defused without catastrophe. World population growth peaked at 2.3% a year in 1963 and is now under 1%, on course to reach zero around 2084."
    explainer: "In 1968 a famous book opened by declaring the battle to feed humanity already lost, with hundreds of millions to starve in the 1970s. The fear was not stupid. In 1963 the human population was growing by 2.3% every year, fast enough to double in a single generation, and the food supply looked finite. The mass starvation did not come; better seeds and fertiliser bought time, and then the thing nobody had ordered happened on its own. Families chose to get smaller.\n\nThe growth rate has fallen by more than half since that peak, to about 0.9% a year, and the dashed line shows where the UN expects it to go: down through the floor, reaching zero around 2084 and turning slightly negative by 2100. The number that once frightened the world is now headed below the line where the population stops growing at all. Almost no one alive in 1968 expected to see it.\n\nHere is the trick the growth rate plays. A rate can fall for sixty years while the thing it measures keeps rising, because a smaller percentage of a much bigger number is still an enormous number of people. The bomb was defused. The population it set ticking is still climbing, and will keep climbing for most of this century, which is the knot the last chart on this page has to untie."
    sidenote: { mark: "b", text: "The <b>growth rate</b> is births minus deaths, plus migration, as a share of the population. It can stay positive even below replacement fertility, for decades, because a young population has many more potential parents than dying elders. That lag is called <b>population momentum</b>, and it is why the peak is still sixty years out." }
    captionLeft: "<b>Population growth rate</b> · % change per year · World · history solid, UN projection dashed"
    captionRight: "1950 — 2100"
    source: "Source · UN World Population Prospects (2024), via Our World in Data · CC BY 4.0"
    chart:
      id: "m2"
      dataRefs: ["pop-growth-rate-world", "pop-growth-rate-proj-world"]
      ymin: -0.5
      ymax: 2.5
      yTicks: [0,1,2]
      xTicks: [1950,1980,2010,2050,2084,2100]
      valueSuffix: "%"
      annots: [{ x: 1963, label: "the peak — 2.3%/yr", y: 2.28 }, { x: 2084, label: "growth ends", y: 0 }]
      series:
        - { name: "", color: "uncertain", data: [[1950,1.74],[2023,0.87]] }
        - { name: "UN projection", color: "ochre", dashed: true, data: [[2024,0.86],[2100,-0.13]] }
    take:
      hope: "This is one of the great averted disasters of the century: the fear of a starving, overrun planet dissolved, not through coercion or famine, but because freer, richer, healthier people wanted fewer children."
      despair: "The same line, followed far enough, is a world that shrinks every year, with all the strain on workforces and pensions that a falling number brings."
      confusion: "Exactly when growth ends, and whether it stabilises or keeps sliding, hangs on fertility choices that have already broken every past forecast."
  - eyebrow: "The descent"
    fig: "FIG. 8"
    question: "Are fewer babies actually being born?"
    claim: "Yes, in absolute numbers now, not just per woman. The number of babies born each year peaked around 2012 at about 146 million and has been drifting down since. Peak baby has passed."
    explainer: "For most of history the count of babies climbed simply because the count of people did. More potential mothers meant more births, even as each mother had fewer children. Around 2012 those two trends finally crossed. The world recorded about 146 million births that year, the most it ever has, and the number has slipped a little every year since, to roughly 132 million now. The moment has a nickname among demographers: peak baby.\n\nFourteen million fewer babies a year is not a rounding error; it is roughly a tenth of all the babies the world makes, gone from the annual tally in a decade. And the dashed projection does not recover it. The UN expects annual births to wobble near today's level for a couple of decades, then fall away toward 110 million by 2100, as the smaller generations being born now grow up to become a smaller pool of parents. The future is being narrowed at the base.\n\nThis is the hinge between the per-woman story and the headcount story. Fertility per woman fell first, quietly, for decades; only now is it pulling the raw number of human arrivals down with it. Everything that follows, the aging, the shrinking workforce, the eventual peak in total population, is the long echo of this one curve turning over."
    sidenote: { mark: "c", text: "Total births depend on two things at once: how many children each woman has, and how many women of childbearing age there are. The second is still high thanks to past growth, which is why births only just peaked even though fertility per woman peaked back in 1963. The base of the age pyramid is where a population's future is written." }
    captionLeft: "<b>Babies born each year</b> · annual births · World · history solid, UN projection dashed"
    captionRight: "1950 — 2100"
    source: "Source · UN World Population Prospects (2024), via Our World in Data · CC BY 4.0"
    chart:
      id: "m3"
      dataRefs: ["births-world", "births-proj-world"]
      ymin: 0
      ymax: 160000000
      yTicks: [0,40000000,80000000,120000000,160000000]
      xTicks: [1950,1980,2012,2050,2100]
      annots: [{ x: 2012, label: "peak baby — 146M", y: 146054880 }]
      series:
        - { name: "", color: "uncertain", data: [[1950,91823940],[2023,132110264]] }
        - { name: "UN projection", color: "ochre", dashed: true, data: [[2024,132405930],[2100,110028470]] }
    take:
      hope: "Fewer births, freely chosen, mean more able to be invested in each child: more schooling, more care, more of a parent's attention and a society's resources per young life."
      despair: "A permanently narrowing base means every future generation is smaller than the last, and the arithmetic of that, compounded, is severe."
      confusion: "Whether births level off near here or keep sliding is the single assumption that swings every long-range population forecast."
  - eyebrow: "Who the average hides"
    fig: "FIG. 9"
    question: "Is the fall happening everywhere at once?"
    claim: "No. Sub-Saharan Africa still averages 4.3 children per woman while East Asia is down to 1.3. The world's 2.25 is a midpoint almost no region actually sits at."
    explainer: "Run the same line for each part of the world and it splays into a fan. In 1960 nearly every region clustered high, between five and seven children per woman, with only Europe already low. Six decades later they have pulled wildly apart. East Asia and the Pacific has fallen to about 1.3, Europe and Central Asia to 1.55, Latin America to 1.79, South Asia to 1.98, all at or below replacement. The Middle East and North Africa sit just above it at 2.98. Sub-Saharan Africa is still up at 4.26, where the rest of the world was two generations ago.\n\nThe gap is not a mystery; it is a stopwatch. The transition runs everywhere in the same direction, but it started at different times, so a region's fertility today is mostly a record of when its girls began going to school and its children began reliably surviving. Sub-Saharan Africa is not refusing the path. It is simply earlier on it, and falling fast.\n\nThat is why the world's tidy 2.25 is almost a fiction. It is the weighted average of a continent still growing quickly and a continent that has stopped, and it describes the lived reality of almost no one. The interesting questions are all at the ends of this fan, not in its middle."
    captionLeft: "<b>Children per woman, by region</b> · total fertility rate"
    captionRight: "1960 — 2024"
    source: "Source · World Bank (UN Population Division) · SP.DYN.TFRT.IN · CC BY 4.0"
    chart:
      id: "m4"
      dataRefs: ["fertility-rate-ssf", "fertility-rate-mea", "fertility-rate-sas", "fertility-rate-ecs", "fertility-rate-eas"]
      ymin: 0
      ymax: 8
      yTicks: [0,2,4,6,8]
      xTicks: [1960,1980,2000,2024]
      refLines: [{ y: 2.1, label: "replacement 2.1" }]
      series:
        - { name: "Sub-Saharan Africa", color: "despair", data: [[1960,6.57],[2024,4.26]] }
        - { name: "Middle East & N. Africa", color: "ochre", data: [[1960,6.95],[2024,2.98]] }
        - { name: "South Asia", color: "uncertain", data: [[1960,6.0],[2024,1.98]] }
        - { name: "Europe & Central Asia", color: "stone", data: [[1960,2.84],[2024,1.55]] }
        - { name: "East Asia & Pacific", color: "hope", data: [[1960,4.55],[2024,1.34]] }
    take:
      hope: "The whole world is on the same road, and the high-fertility regions are descending it faster than the early ones ever did: Africa is compressing into decades what Europe took a century to do."
      despair: "The spread means the strains arrive unevenly and early for some: East Asia is aging into a workforce crisis while parts of Africa still strain to school and feed the young."
      confusion: "Whether Africa's fall keeps accelerating, or stalls at a middling rate the way a few countries have, decides the population of the year 2100 more than any other single thing."
  - eyebrow: "Who the average hides"
    fig: "FIG. 10"
    question: "Where are the real extremes?"
    claim: "From about six children per woman in DR Congo and Niger down to 0.75 in South Korea — the lowest national rate ever recorded. The whole human range fits on one chart."
    explainer: "Line the countries up and the range is staggering. At the top, the Democratic Republic of Congo and Niger still average close to six children per woman, the level the whole planet sat at in 1963. At the bottom sits South Korea at 0.75, the lowest figure any nation has ever recorded in peacetime, less than a third of what it takes to keep a population steady. One species, one chart, an eightfold gap from end to end.\n\nThe middle is where the surprises hide. India, long shorthand for overpopulation, has quietly dropped to 1.96, below replacement. The United States sits at 1.63, Brazil at 1.61, both well under the line. Italy and Japan are down near 1.15. China, the country that spent a generation forcing births down by law, is now at 1.01 and cannot persuade them back up. The anxiety of the twentieth century and the anxiety of the twenty-first are stacked on the same axis.\n\nWhat the bar cannot show is which way each country is travelling, only where it has arrived. For that you have to watch a few of them fall over time, which is the next chart. But the spread alone makes one thing plain: there is no single human fertility story. There is a fast, young one and a stalled, graying one, and most of the famous countries are quietly in the second."
    captionLeft: "<b>Children per woman, by country</b> · total fertility rate · latest year"
    captionRight: "2024"
    source: "Source · World Bank (UN Population Division) · SP.DYN.TFRT.IN · CC BY 4.0"
    chart:
      id: "m5"
      dataRef: "fertility-by-country"
      ymin: 0
      ymax: 7
      yTicks: [0,2,4,6]
      xTicks: [2024,2024]
      series:
        - { name: "Children per woman", color: "stone", data: [[2024,5.98],[2024,0.75]] }
    take:
      hope: "The countries at the bottom got there mostly through prosperity, education, and women's choice, the same forces that lifted billions out of poverty in the same decades."
      despair: "A rate of 0.75 is not low fertility; it is a society that, left unchanged, more than halves with each generation, and nobody has shown how to reverse it."
      confusion: "Whether the very bottom of this chart is a floor others will stop short of, or a preview of where the rest are heading, is genuinely unknown."
  - eyebrow: "Who the average hides"
    fig: "FIG. 11"
    question: "What does the bottom of the range actually look like over time?"
    claim: "A collapse, not a dip. South Korea fell from six children per woman to 0.7 in a single lifetime; China has dropped below one. Against them, Niger has barely moved."
    explainer: "Follow a handful of countries down the decades and the word collapse stops being hyperbole. In the 1950s a South Korean woman had about six children; by 2023 she has 0.72, a fall of nearly nine-tenths inside one long human life. China bore more than seven children per woman at its 1963 peak, was driven down by the one-child policy, and has kept falling on its own to below a single child for the first time in its history. Japan and Italy, an Asian society and a European one, both slid under replacement in the 1970s and now rest near 1.2 — proof this is not an Asian peculiarity but a rich-world destination.\n\nAgainst that low cluster, the African lines tilt slowly. Niger averaged about 7.6 children per woman in 1950 and still averages 6.1 today; Nigeria has come down from over six to about 4.5. The descent that swept East Asia and Europe has begun there too, but it has decades left to run. On the same chart, in the same years, four of these countries face too few young people and two face too many. The transition is the same everywhere; the clock it runs on is not.\n\nThe lowest lines carry the warning the world averages soften. These are not gentle settlings toward replacement. They are overshoots, falling past 2.1 and continuing to a half or a third of it, in rich, peaceful, well-governed countries that have tried cash, leave, and exhortation to slow the fall and watched it continue. Whatever pulls fertility down does not let go at the bottom."
    sidenote: { mark: "d", text: "South Korea's 0.72 is a single-year snapshot and bounces year to year; its provisional figure has dipped near 0.7 and is the lowest a country has ever posted. Whatever the exact decimal, it sits at about a third of the 2.1 needed to hold a population steady, the deepest below-replacement rate on record." }
    captionLeft: "<b>Children per woman, six countries</b> · total fertility rate"
    captionRight: "1950 — 2023"
    source: "Source · UN World Population Prospects (2024), via Our World in Data · CC BY 4.0"
    chart:
      id: "m6"
      dataRefs: ["fertility-niger", "fertility-nigeria", "fertility-japan", "fertility-italy", "fertility-china", "fertility-south-korea"]
      ymin: 0
      ymax: 8
      yTicks: [0,2,4,6,8]
      xTicks: [1950,1970,1990,2010,2023]
      refLines: [{ y: 2.1, label: "replacement 2.1" }]
      series:
        - { name: "Niger", color: "stone", data: [[1950,7.56],[2023,6.06]] }
        - { name: "Nigeria", color: "ochre", data: [[1950,6.4],[2023,4.4]] }
        - { name: "Japan", color: "uncertain", data: [[1950,3.62],[2023,1.21]] }
        - { name: "Italy", color: "uncertain", data: [[1950,2.4],[2023,1.21]] }
        - { name: "China", color: "ochre", data: [[1950,5.81],[2023,1.0]] }
        - { name: "South Korea", color: "despair", data: [[1950,6.06],[2023,0.72]] }
    take:
      hope: "Every one of these falls began with something good: Korean and Chinese women moved in a generation from farm labour and early marriage to universities and cities and careers."
      despair: "South Korea and China show that below-replacement fertility is not self-correcting; it deepens, and a half-dozen national governments have failed to lift it back."
      confusion: "No one knows why the East Asian bottom is so much lower than Europe's, nor whether it is culturally specific or simply further down a road everyone is on."
  - eyebrow: "Why it fell"
    fig: "FIG. 12"
    question: "Why did people stop having so many children?"
    claim: "Mostly because their children stopped dying. A century ago a quarter of children died before five; now fewer than one in twenty-five do. When survival became reliable, families became small."
    explainer: "The deepest cause of the whole story is the happiest chart in it. In 1950 about 24.7 of every 100 children born died before their fifth birthday, almost one in four. By 2023 that figure is 3.67, fewer than one in twenty-five. This is among the greatest achievements in human history, and it is also, quietly, the engine of the fertility fall, because for all of history people bore many children partly because they expected to bury some.\n\nWhen that grim expectation lifted, fertility followed it down, with a delay of a generation or so while families learned to trust the new survival. The economist Gary Becker put the logic plainly: as children became more likely to live and more expensive to raise and school, parents shifted from quantity to quality, investing more in fewer. A mother confident her two children will live does not need to bear six as insurance.\n\nThis is why the framing matters so much. The fertility fall is not, in the main, a sickness or a failure of nerve. It is the downstream signal of children surviving and parents investing, the two things almost everyone agrees we wanted. The discomfort of this whole article is that those unambiguous goods produced a genuinely hard problem, and you cannot wish the problem away without wishing away its causes."
    sidenote: { mark: "e", text: "Child survival is the strongest single correlate of falling fertility, but it never acts alone — education, cities, women's work, and contraception all move with it. What is clear is the order: deaths fall first, births follow." }
    captionLeft: "<b>Children dying before age five</b> · deaths per 100 live births · World"
    captionRight: "1950 — 2023"
    source: "Source · UN Inter-agency Group for Child Mortality Estimation, via Our World in Data · CC BY 4.0"
    chart:
      id: "m7"
      dataRef: "child-mortality-world"
      x0: 1950
      ymin: 0
      ymax: 28
      yTicks: [0,7,14,21,28]
      xTicks: [1950,1970,1990,2010,2023]
      series:
        - { name: "Deaths before age five", color: "hope", data: [[1950,24.7],[2023,3.67]] }
    take:
      hope: "This is the chart the whole question rests on: the near-elimination of child death, the clearest unambiguous good in modern history, freely chosen smaller families its direct result."
      despair: "The very success that ended the dying set in motion the aging and shrinking that now worry every treasury, with no way to keep the first and refuse the second."
      confusion: "How much of the fertility fall is survival versus education versus economics is still genuinely debated, which means no one is sure which levers, if any, could move it."
  - eyebrow: "Why it fell"
    fig: "FIG. 13"
    question: "What changed for the girls who became these women?"
    claim: "They stayed in school and stopped becoming mothers as teenagers. Girls' secondary enrolment nearly doubled since 1970, and the birth rate among teenagers has more than halved."
    explainer: "Behind the fertility line is a quieter one about whose lives changed. In 1970 only about 40 of every 100 girls of secondary-school age were enrolled; by 2024 it is 77. A girl in a classroom at sixteen is not a mother at sixteen, and the adolescent birth rate shows it, falling from about 92 births per thousand teenage girls in 1960 to 38 today. Later first births, more schooling, more say over her own life: this is the texture under the abstraction.\n\nThe order of events matters, because it tells you what is cause and what is effect. Across countries, girls' education rises first and fertility falls after, not the reverse. A woman who finishes school marries later, knows more about and has more access to contraception, has more earning power to lose by leaving work, and more standing to decide for herself how many children to have. None of those is a tragedy. Most are the explicit goals of half a century of development policy.\n\nWhich is the uncomfortable centre of this section. The clearest drivers of the fall are things we built on purpose and would build again: schools for girls, clinics, the slow extension of women's choice. The smaller family is not what went wrong. It is, in large part, what went right, billed to a future that has to pay for it."
    sidenote: { mark: "f", text: "Adolescent fertility is among the most hopeful demographic series there is, and it carries no ambiguity: a fall means girls staying in school, marrying later, and bearing children, if at all, as adults by choice. It is the one line on this page that almost everyone reads the same way." }
    captionLeft: "<b>Adolescent fertility rate</b> · births per 1,000 women aged 15–19 · World"
    captionRight: "1960 — 2024"
    source: "Source · UN Population Division, via World Bank · SP.ADO.TFRT · CC BY 4.0"
    chart:
      id: "m8"
      dataRef: "adolescent-fertility-world"
      ymin: 0
      ymax: 100
      yTicks: [0,25,50,75,100]
      xTicks: [1960,1980,2000,2024]
      series:
        - { name: "Births per 1,000 teenage girls", color: "hope", data: [[1960,92.1],[2024,38.3]] }
    take:
      hope: "Almost nobody, anywhere on the hope–despair spectrum, wishes the teenage birth rate were higher: this driver of the fertility fall is a pure gain in girls' freedom and futures."
      despair: "It is also irreversible by any decent means: no society that has educated its girls has found a way to raise its fertility that does not start by un-educating them, which none will do."
      confusion: "How much of the total fall this single channel explains, versus the economic forces in the next chart, is exactly the debate that makes fertility so hard to steer."
  - eyebrow: "Why it fell"
    fig: "FIG. 14"
    question: "So is it just development? Then why won't money buy it back?"
    claim: "Because the old rule broke. Fertility used to fall as women worked and countries grew rich — but among today's richest countries, the most equal and family-friendly now have more children, not fewer."
    explainer: "For most of the twentieth century the rule looked simple: as women moved into paid work and countries grew rich, fertility fell. The global female labour-force participation rate, though, has barely moved in a generation, holding near half, even as fertility kept dropping, a first hint that the simple story is incomplete. Work is part of the picture, but it is not the lever it was taken to be.\n\nThen, among the wealthiest countries, the rule reversed. In a finding now associated with the demographers Mikko Myrskylä and Hans-Peter Kohler, and developed by economists including Matthias Doepke and colleagues, the relationship at the top of the income scale flipped: the richest, most gender-equal societies, the Nordics, now tend to have higher fertility than the rich countries where men do little at home and mothers are forced to choose between a career and a child. Where the second shift is shared, women have more children, not fewer. South Korea, where the burden falls hardest on mothers, sits at the bottom of the whole world.\n\nThat reversal is why money alone fails. Hungary has poured the price of a small war into baby bonuses; South Korea has spent on the order of a couple of hundred billion dollars over two decades; both still sit far below replacement. What seems to move the needle, where anything does, is not cash but whether a woman can have a child without surrendering her work, her independence, or her share of the housework. That is slow, structural, and cultural, and no government has bought it quickly."
    sidenote: { mark: "g", text: "This is the live frontier of fertility research, and it is genuinely contested. The older economic model (Gary Becker) predicted ever-lower fertility with rising income and women's wages; the newer work argues that once gender norms at home catch up with those at work, the sign can flip. Treat the reversal as a real and important finding still being argued over, not a settled law." }
    captionLeft: "<b>Women's labour-force participation</b> · % of women aged 15+ · World"
    captionRight: "1990 — 2024"
    source: "Source · International Labour Organization (modelled), via World Bank · SL.TLF.CACT.FE.ZS · CC BY 4.0"
    chart:
      id: "m9"
      dataRef: "female-labour-world"
      ymin: 0
      ymax: 80
      yTicks: [0,20,40,60,80]
      xTicks: [1990,2000,2010,2024]
      valueSuffix: "%"
      series:
        - { name: "Women in the labour force", color: "stone", data: [[1990,51.2],[2024,49.1]] }
    take:
      hope: "If the rich-world reversal holds, it points to a humane exit: not coercing births, but making children compatible with women's working lives — shared parenting, real childcare, secure housing."
      despair: "If it is a mirage or a local quirk, then nothing decent reliably lifts fertility once it falls, and the lowest countries are simply the future arriving early."
      confusion: "Whether gender equality at home can genuinely reverse the decline, and at what level it settles, is perhaps the most important open question in demography."
  - eyebrow: "The reckoning"
    fig: "FIG. 15"
    question: "What does a low-fertility world slowly turn into?"
    claim: "An old one. The share of people over 65 has doubled since 1960 to one in ten worldwide, and reaches nearly one in five across Europe. The young base narrows; the top grows heavy."
    explainer: "Fewer children does not only mean fewer children. Run the arithmetic forward and it means, inexorably, more old people as a share of everyone, because the small generations being born now sit beneath large generations living longer than any before them. In 1960 about one person in twenty was over 65. Today it is one in ten, and the line is steepening. The age pyramid that every society used to have, broad-based and tapering, is rolling over into a column.\n\nThe global figure is gentle only because the young regions still weigh it down. Pull the regions apart and the future is already here in places. Across Europe and Central Asia, 18% of people are now over 65, nearly one in five. In East Asia, 14% and climbing fast, the legacy of those collapsing fertility lines a generation on. Sub-Saharan Africa, still young, sits near 3%. The same split that ran through the fertility fan runs through its consequence.\n\nNone of this is a forecast that might not happen. The people who will be old in 2050 are already born and already counted; barring catastrophe, the aging is locked in. A society can argue about how to pay for it, but not about whether it is coming. The children not born in 2012 are the workers missing in 2050, and that subtraction has already been made."
    captionLeft: "<b>Share of people aged 65 and over</b> · % of population · World"
    captionRight: "1960 — 2024"
    source: "Source · World Bank (UN Population Division) · SP.POP.65UP.TO.ZS · CC BY 4.0"
    chart:
      id: "m10"
      dataRef: "pop-65plus-world"
      ymin: 0
      ymax: 20
      yTicks: [0,5,10,15,20]
      xTicks: [1960,1980,2000,2024]
      valueSuffix: "%"
      series:
        - { name: "Share over 65", color: "despair", data: [[1960,5.0],[2024,10.2]] }
    regional:
      label: "<b>Some regions are already there</b> · share of people over 65 · % of population"
      note: "Europe is nearly one in five over 65; East Asia, near one in seven and rising fastest, is the echo of its collapsed fertility a generation back. Sub-Saharan Africa, still high-fertility, stays young. The world line is gentle only because the young regions outweigh the old ones — for now."
      refs:
        - { ref: "pop-65plus-ecs", name: "Europe & Central Asia", color: "despair" }
        - { ref: "pop-65plus-eas", name: "East Asia & Pacific", color: "ochre" }
        - { ref: "pop-65plus-world", name: "World", color: "stone" }
        - { ref: "pop-65plus-lcn", name: "Latin America", color: "uncertain" }
        - { ref: "pop-65plus-ssf", name: "Sub-Saharan Africa", color: "hope" }
    countries:
      label: "<b>The oldest countries on Earth</b> · share of people over 65 · % of population · latest"
      note: "Japan and Italy are already more than a fifth elderly; South Korea and China climb the same curve fast, a generation behind. The young, high-fertility countries — Niger, Nigeria — sit at the far end, barely one person in twenty over 65. A society's age is the fertility of its past, read forward."
      ref: "pop-65plus-by-country"
    take:
      hope: "An old society is also a long-lived one: the rising share over 65 is partly just the triumph that people now reliably reach old age, which almost no population before us did."
      despair: "A column-shaped population strains every system built when the young vastly outnumbered the old, from pensions to elder care to the simple supply of working hands."
      confusion: "Whether longer working lives, automation, and migration can offset the shift, or only soften it, is the open economic question of the century."
  - eyebrow: "The reckoning"
    fig: "FIG. 16"
    question: "How old is the typical person becoming?"
    claim: "The median human was 20 in 1970 and is 30 now, heading for 42 by 2100. Humanity is aging faster than any individual ever could."
    explainer: "There is a number that captures the whole shift in one figure: the median age, the age at which exactly half the world is younger and half is older. In 1970 it was 20.3. Half of all the people alive were children or teenagers. By 2023 it had climbed to 30.4, and the dashed projection carries it on to about 42 by the end of the century. The middle of humanity has moved from adolescence to middle age inside a hundred years.\n\nIt is worth sitting with how strange that is. An individual ages a year every year, helplessly. A population does not have to; for most of history the median age barely moved, because each large young generation was replaced by a larger one. What we are watching is the median age rising almost as fast as the calendar, which can only happen when the young stop outnumbering the old, year after year, deliberately.\n\nThe figure is not evenly shared, and that is the rub. A median of 42 will be the rich world and East Asia; much of Africa will still be a continent of the young. The planet is not aging together. It is splitting into the gray and the green, and a great deal of this century's migration, labour, and politics will be the friction along that seam."
    sidenote: { mark: "h", text: "Median age and fertility are tightly linked but not identical: a society can have a young median age for years after its fertility falls, living off the momentum of past large generations. The median is the slow, honest readout of a change the fertility rate signals decades earlier." }
    captionLeft: "<b>Median age of the world</b> · years · history solid, UN projection dashed"
    captionRight: "1950 — 2100"
    source: "Source · UN World Population Prospects (2024), via Our World in Data · CC BY 4.0"
    chart:
      id: "m11"
      dataRefs: ["median-age-world", "median-age-proj-world"]
      ymin: 15
      ymax: 45
      yTicks: [15,25,35,45]
      xTicks: [1950,1980,2024,2060,2100]
      series:
        - { name: "", color: "despair", data: [[1950,22.16],[2023,30.36]] }
        - { name: "UN projection", color: "ochre", dashed: true, data: [[2024,30.62],[2100,42.13]] }
    take:
      hope: "A median age of 30 is also a world where most people survive childhood, reach adulthood, and can expect decades more, a profile no large society ever had before the last century."
      despair: "Aging societies tend to grow more cautious, more weighed down by care costs, and slower to take the risks that growth and innovation need."
      confusion: "Whether an older world is a wiser, calmer one or a sclerotic, stagnant one is a question we are about to answer by living it."
  - eyebrow: "The reckoning"
    fig: "FIG. 17"
    question: "Who is left to support the old?"
    claim: "Fewer and fewer workers. There are now about 16 people over 65 for every 100 of working age, nearly double the 1960 figure, and the ratio climbs steeply from here."
    explainer: "The aging finally bites through one ratio: how many elders each working-age adult has to carry. In 1960 there were about nine people over 65 for every hundred adults of working age. Today there are nearly sixteen. The figure has almost doubled, and because the large generations of the late twentieth century are only now reaching retirement, the steep part of the climb is still ahead.\n\nThis is where demography turns into a budget. Pensions, in most countries, are paid by today's workers to today's retirees, a chain that holds only while the workers comfortably outnumber the pensioners. As the ratio tightens, the same promises require higher taxes, later retirement, or thinner benefits, in some combination no electorate enjoys choosing between. The arithmetic is not ideological; it falls due the same way under every flag.\n\nAnd this is the global figure, softened by the young countries again. In the places furthest down the fertility road the squeeze is far sharper: parts of East Asia and Europe are heading toward two workers per retiree, or fewer. The children chosen against, quietly, one family at a time over the past forty years, arrive on the public ledger now, as a bill no policy can send back."
    sidenote: { mark: "i", text: "The <b>old-age dependency ratio</b> counts people over 65 against those aged 15 to 64. It is a crude proxy: many over-65s work, many under-65s do not, and the boundary is an accident of convention. But its direction is unambiguous, and direction is what decides whether a pension promise can be kept." }
    captionLeft: "<b>Old-age dependency ratio</b> · people 65+ per 100 of working age · World"
    captionRight: "1960 — 2024"
    source: "Source · World Bank (UN Population Division) · SP.POP.DPND.OL · CC BY 4.0"
    chart:
      id: "m12"
      dataRef: "old-age-dependency-world"
      ymin: 0
      ymax: 20
      yTicks: [0,5,10,15,20]
      xTicks: [1960,1980,2000,2024]
      series:
        - { name: "Elders per 100 workers", color: "despair", data: [[1960,8.62],[2024,15.68]] }
    take:
      hope: "Healthier, longer-lived people can work later than their parents did, and a smaller young generation costs less to raise and school, freeing resources to offset some of the elder bill."
      despair: "The pension and care systems of the rich world were built for ratios that are vanishing, and every fix, later retirement, higher taxes, leaner benefits, is politically toxic."
      confusion: "Whether productivity and automation can grow fast enough to support more retirees on fewer workers is the bet every aging economy is now forced to place."
  - eyebrow: "The reckoning"
    fig: "FIG. 18"
    question: "Can't aging countries just import the young people they lack?"
    claim: "Some are, heavily. Rich countries have flipped from sending migrants to absorbing them, and now take in net newcomers fast enough to slow their decline. But globally it is a zero-sum fix."
    explainer: "There is one release valve, and the rich world is leaning on it hard. Sort the world by income and track net migration, and the high-income countries have swung from roughly balanced in 1950 to taking in, by 2024, nearly three net migrants a year for every thousand people, with a spike above seven around 2022. The middle and lower-income groups sit near zero or send people out. For aging, low-fertility societies, immigration is increasingly what keeps the working-age population from shrinking outright.\n\nIt works, up to a point, and that point is arithmetic. Migration can refill one country's workforce, but it cannot add a single person to the planet; every migrant the rich world gains is one a poorer country loses, often one it educated. As a global answer to falling fertility it is zero-sum, a redistribution of the young rather than a creation of them. And it leans on a supply that the first half of this article quietly undermines: the regions that still send migrants are themselves aging, on a delay.\n\nThere is a harder limit, too, and it is not economic. The scale of migration that would fully offset rich-world fertility is far larger than what most of their electorates will accept, as the politics of the last decade has made unmistakable. Migration is a real and powerful cushion. It is not, and cannot be, the whole answer, and pretending otherwise has already deformed the politics of half the aging world."
    sidenote: { mark: "j", text: "Net migration rate is migrants in minus migrants out, per thousand people. At the country level it is a genuine demographic lever; at the world level it nets to zero by definition. The high-income spike around 2022 reflects post-pandemic movement and major refugee flows, so read the trend, not the single year." }
    captionLeft: "<b>Net migration rate, by income group</b> · net migrants per 1,000 people"
    captionRight: "1950 — 2024"
    source: "Source · UN World Population Prospects 2024 · CC BY 3.0 IGO"
    chart:
      id: "m13"
      dataRefs: ["net-migration-high-income", "net-migration-upper-middle-income", "net-migration-low-income"]
      ymin: -10
      ymax: 8
      yTicks: [-8,-4,0,4,8]
      xTicks: [1950,1980,2010,2024]
      refLines: [{ y: 0, label: "balance" }]
      series:
        - { name: "High-income", color: "ochre", data: [[1950,-0.24],[2024,2.75]] }
        - { name: "Upper-middle-income", color: "stone", data: [[1950,0.12],[2024,-0.32]] }
        - { name: "Low-income", color: "despair", data: [[1950,-2.41],[2024,-0.2]] }
    take:
      hope: "Migration genuinely cushions the shock, matching young workers who need jobs to old economies that need workers, and where it is managed well both sides gain."
      despair: "It is zero-sum for the planet, drains the young from the countries that raised them, and runs into a political ceiling far below what the demographic arithmetic would require."
      confusion: "How much migration aging societies will actually accept, and how long the sending regions stay young enough to supply it, are unknowable and already explosive."
  - eyebrow: "What the data half-sees"
    fig: "FIG. 19"
    question: "Is the choice always freely made — or are some children missing?"
    claim: "Not always. In parts of Asia, a preference for sons plus small families and ultrasound produced a generation of missing girls. China's sex ratio at birth hit 118 boys per 100 girls in 2004."
    explainer: "Naturally, about 105 boys are born for every 100 girls, a near-constant of human biology. When that line lifts, it is not nature; it is choice of the darkest kind. In China the ratio climbed to about 118 boys per 100 girls by 2004, in India to nearly 110 around 2010, and across the Caucasus — Azerbaijan among the most extreme on Earth — to similar heights, as a strong preference for sons collided with shrinking family size and cheap ultrasound. If you can only have one or two children and you want a son, and you can know the sex before birth, the arithmetic ends in sex-selective abortion, and millions of girls were never born.\n\nThis is the shadow side of the small family, and it complicates the clean story of choice the rest of this page tells. The fertility fall is mostly women gaining freedom. But in these societies the same fall, crossed with son preference, took freedom from the daughters who were never allowed to exist, leaving a generation with tens of millions more young men than young women, with all the strain on marriage and stability that implies.\n\nThere is a thread of hope in the lines, and South Korea is its proof. Korea spiked toward 115 in the early 1990s and then came almost all the way back to the natural ratio, the one clear case of a society that distorted its births and then undistorted them as daughters gained value and worth. China and India have edged down from their peaks too, China toward 110, India toward 107, though neither is yet back to baseline, and Azerbaijan and its neighbours remain stubbornly high. The missing girls of the 1990s and 2000s are missing still, grown now, and the societies that selected against them are living with the gap."
    sidenote: { mark: "k", text: "The natural sex ratio at birth is about 105 boys per 100 girls; anything sustained above roughly 107 signals sex selection. The world figure stays near normal because most countries never distorted; the signal lives in specific places, which is why this chart names China and India rather than a global average." }
    captionLeft: "<b>Sex ratio at birth</b> · boys born per 100 girls"
    captionRight: "1950 — 2024"
    source: "Source · UN World Population Prospects 2024 · CC BY 3.0 IGO"
    chart:
      id: "m14"
      dataRefs: ["sex-ratio-birth-azerbaijan", "sex-ratio-birth-china", "sex-ratio-birth-india", "sex-ratio-birth-south-korea", "sex-ratio-birth-world"]
      ymin: 100
      ymax: 120
      yTicks: [100,105,110,115,120]
      xTicks: [1950,1980,2010,2024]
      refLines: [{ y: 105, label: "natural 105" }]
      series:
        - { name: "Azerbaijan", color: "ochre", data: [[1950,105.0],[2024,113.0]] }
        - { name: "China", color: "despair", data: [[1950,106.1],[2024,110.3]] }
        - { name: "India", color: "uncertain", data: [[1950,105.1],[2024,107.1]] }
        - { name: "South Korea", color: "hope", data: [[1950,105.0],[2024,105.0]] }
        - { name: "World", color: "stone", data: [[1950,105.4],[2024,105.4]] }
    take:
      hope: "Both peaks are past: as daughters gain value and the law catches up, the ratios are slowly returning toward nature, a sign the worst of son preference is receding."
      despair: "Tens of millions of girls were never born, and the men who would have been their husbands are a lasting distortion, the dark proof that smaller families are not always freer ones."
      confusion: "How fast son preference fades as societies modernise, and whether it appears next wherever ultrasound meets small families, is uncertain and under-watched."
  - eyebrow: "The contested future"
    fig: "FIG. 20"
    question: "How sure can we be about any of this?"
    claim: "Not very. The same model that peaks population near 10.3 billion splits, on slightly different fertility, between 7 and 14 billion by 2100. The future of humanity's size is a genuine fork."
    explainer: "Every projected line on this page rests on a guess about how many children people not yet born will have, and small differences in that guess compound into enormous ones. The UN publishes the fork honestly. Its medium path peaks world population near 10.3 billion around 2084 and eases down. Its low path, with fertility about half a child lower, peaks sooner and falls below seven billion by 2100. Its high path, half a child higher, never peaks this century and reaches more than fourteen billion. Same model, same year, a spread of seven billion people, the difference between a crowded world and a hollowing one.\n\nIndependent modellers disagree even with the UN's centre. A widely cited 2020 study from the University of Washington's Institute for Health Metrics and Evaluation, published in the Lancet, has world population peaking earlier, around the 2060s, and falling more steeply, to roughly nine billion by 2100, on the view that fertility will drop faster than the UN assumes. Several economists argue it is falling faster still. Nobody who tells you the population of 2100 to the nearest billion is doing anything but choosing which assumption to trust.\n\nThis is the honest centre of the whole question, and it is why the confusion reading is first-class here, not a hedge. The measurement of where we are is rock-solid. The direction is clear. But the destination is not knowable, because it depends on billions of private decisions not yet made, by people not yet born, under conditions we cannot foresee. The future of human numbers is not a prediction. It is a fork, and we are standing at it."
    sidenote: { mark: "l", text: "The fan shown is the UN's own low / medium / high variants, which differ only in the assumed long-run fertility (roughly ±0.5 children per woman). The IHME (Lancet, 2020) figure is an independent projection cited here, not re-hosted. That two careful teams disagree by a billion-plus is the point: the uncertainty is real, not a failure of one model." }
    captionLeft: "<b>World population, the projection fan</b> · UN low / medium / high variants"
    captionRight: "1950 — 2100"
    source: "Source · UN World Population Prospects 2024 (variants, CC BY 3.0 IGO; medium via Our World in Data). IHME 2020 cited, link-only."
    chart:
      id: "m15"
      dataRefs: ["population-high-world", "population-proj-world", "population-low-world"]
      ymin: 0
      ymax: 15000000000
      yTicks: [0,5000000000,10000000000,15000000000]
      xTicks: [1950,2024,2060,2084,2100]
      annots: [{ x: 2084, label: "medium peak ≈ 10.3bn", y: 10289315239 }]
      series:
        - { name: "UN high", color: "despair", dashed: true, data: [[2024,8170000000],[2100,14400000000]] }
        - { name: "UN medium", color: "stone", data: [[2024,8161972574],[2100,10180160744]] }
        - { name: "UN low", color: "hope", dashed: true, data: [[2024,8150000000],[2100,6986814000]] }
    take:
      hope: "The honesty is itself reassuring: demographers publish their uncertainty rather than hide it, and most of the fan is a world that has stabilised rather than one in crisis."
      despair: "A spread this wide means we are steering a civilisational supertanker half-blind, committing pensions, cities, and economies on numbers that could be off by billions."
      confusion: "This is the purest confusion on the page: two careful teams, the same data, projections a billion or more apart, and no way to know who is right until we live it."
  - eyebrow: "The contested future"
    fig: "FIG. 21"
    question: "So — is the world running out of people, and would that be so bad?"
    claim: "Not soon. Population keeps growing to about 10.3 billion around 2084, then begins to fall as deaths overtake births. The deeper question is whether a shrinking humanity can still grow richer."
    explainer: "Put the medium path together and the blunt answer is no, not for sixty years, and then slowly. World population was 2.5 billion in 1950 and is about 8.2 billion now. The projection keeps climbing, on momentum, to a peak near 10.3 billion around 2084, and only then turns down. The mechanism of the peak is the quiet crossover beneath it: today the world records about 132 million births a year against 62 million deaths, so it grows, but the projection has those lines meeting around 2084, near 118 million each, after which deaths win every year and the population gently recedes.\n\nThe interesting fear is not emptiness; it is stagnation. The economist Charles Jones has made the unsettling argument that sustained economic growth may depend on a growing population, because ideas, the engine of progress, are found by people, and fewer people means fewer ideas. A world that peaks and declines, on this view, risks not catastrophe but a slow fading of the dynamism we have treated as permanent, an 'empty planet' where living standards stop rising not because we run out of resources but because we run out of each other.\n\nWhich leaves the honest verdict, the one this whole page has been circling. The world is not running out of children in the sense of vanishing. It is running low on them, in a growing share of itself, in the sense that matters: too few to keep populations young, workforces full, and pension promises whole, and no society has yet found how to choose more once it has learned to choose few. That is not a catastrophe and it is not a triumph. It is the bill for a victory, coming due in slow motion, and we genuinely do not know how it reads in the end."
    sidenote: { mark: "m", text: "The peak year and height shown are the UN's medium scenario, the centre of the fan in the previous chart. The births-and-deaths crossover, the growth rate hitting zero, and the population peak all land in the mid-2080s because they are three views of one model — three faces of the same turn, not three independent confirmations." }
    captionLeft: "<b>World population</b> · history solid, UN medium projection dashed"
    captionRight: "1950 — 2100"
    source: "Source · UN World Population Prospects (2024); HYDE; Gapminder, via Our World in Data · CC BY 4.0"
    chart:
      id: "m16"
      dataRefs: ["population-world", "population-proj-world"]
      ymin: 0
      ymax: 11000000000
      yTicks: [0,2500000000,5000000000,7500000000,10000000000]
      xTicks: [1950,1990,2024,2084,2100]
      annots: [{ x: 2084, label: "peak — 10.3bn", y: 10289315239 }]
      series:
        - { name: "", color: "uncertain", data: [[1950,2493092852],[2023,8091734933]] }
        - { name: "UN projection", color: "ochre", dashed: true, data: [[2024,8161972574],[2100,10180160744]] }
    regional:
      label: "<b>The crossover that ends growth</b> · births and deaths per year · World"
      note: "The world grows while births outrun deaths, and stops when they meet — about 118 million each around 2084. Births peaked in 2012 and slope down; deaths climb as the large mid-century generations age. After the lines cross, more people die each year than are born, and population recedes."
      refs:
        - { ref: "births-world", name: "", color: "hope" }
        - { ref: "births-proj-world", name: "Births", color: "hope" }
        - { ref: "deaths-world", name: "", color: "despair" }
        - { ref: "deaths-proj-world", name: "Deaths", color: "despair" }
    take:
      hope: "Ten billion people fed, housed, and mostly out of poverty would be a civilisational triumph, and a gently shrinking population thereafter eases the pressure on land, climate, and every finite thing."
      despair: "A peak is also a turn, and a permanently shrinking, aging population may slowly lose the dynamism and growth that modern life quietly assumes will always be there."
      confusion: "Whether fewer people means a calmer, greener world or a stagnant, fading one is the deepest open question here, and it turns on things no demographer can measure."

pullQuote:
  text: "Children stopped dying, and women got to choose, and so families got smaller. Everything else on this page — the aging, the shrinking, the missing girls, the bill — is the long shadow of those two good things, and we cannot keep them while refusing it."
  cite: "The whole argument, in one line"

lenses:
  - { who: "The demographer", confidence: "high", hope: "This is the demographic transition completing on schedule, the arc Notestein described eighty years ago: death rates fall, birth rates follow, population stabilises. The textbook is working.", despair: "Except the East Asian tail was not in the textbook. Fertility was meant to settle near replacement, not plunge to a third of it and keep going, and the low-fertility-trap researchers warn that below a point it may become self-reinforcing." }
  - { who: "A 33-year-old who wants a third child", confidence: "absolute", despair: "The surveys say I want more children than I will have, and they are right. It is not that I chose a small family; housing, hours, and childcare chose it for me. Call it freedom if you like.", hope: "And yet the two I have will grow up healthier, better schooled, and more attended-to than I could have managed with five. The choice I resent is also one my grandmother never had." }
  - { who: "The pension actuary", confidence: "high", despair: "My models only balance on assumptions already false. The ratio of workers to retirees is collapsing on a schedule fixed by births that already happened; no rebound in fertility could change the next thirty years even if it came tomorrow.", hope: "Later retirement, higher productivity, and migration can each take a slice from the gap. None closes it alone, but the problem is arithmetic, not mystery, and arithmetic can be managed if we are honest early." }
  - { who: "An economist of growth", confidence: "low", despair: "If Jones is right that ideas need people, a shrinking population could quietly end the economic growth we treat as a law of nature, not with a bang but with a long, grey flattening.", hope: "Or a smaller, richer, better-educated humanity, amplified by machines, keeps finding ideas with fewer heads. We have never run this experiment, so the pessimism is a hypothesis, not a forecast." }
  - { who: "A planner in Niger", confidence: "medium", despair: "The world frets about too few children while my country has six per woman and not enough schools, clinics, or jobs for them. The crisis here is the old one, and the global panic about empty cradles can sound like a rich world's luxury.", hope: "But the same fall is coming for us, faster than it came for anyone before, if we can get girls through school and children through their fifth year. A youthful population is a dividend if it is educated and employed, and a danger if it is not." }

hopeCase: "The fertility fall is, at its root, the best news of the modern age wearing an alarming costume. It is what it looks like when children stop dying and women start choosing. A quarter of children died before five within living memory; now it is one in twenty-five, girls' schooling has nearly doubled, and the smaller families that followed are the direct, intended consequence. The population bomb that terrified 1968 was defused without the famines or coercion that were predicted. We are headed for a peak near ten billion, most of them out of poverty, then a gentle easing of pressure on a strained planet. The aging that follows is the flip side of people reliably reaching old age, the thing every generation before us wanted and almost none achieved. And there is a humane exit beginning to show in the data: where men share the home and the state shares the cost, the richest, most equal societies are nudging their fertility back up. These are problems of success, and the tools to manage them are the same ones that caused them."
despairCase: "A society with fewer than one child per woman is not balancing; it is liquidating, halving itself each generation, and South Korea, China, Japan, Italy, and a lengthening list have crossed into that territory with no example anywhere of climbing back out. The aging is already locked: the workers of 2050 are the children not born in 2012, and that subtraction can only be paid for, through higher taxes and later retirements and thinner pensions no electorate will choose. Migration buys time for the rich world only by draining the young from the poor one, and runs into a political wall far below what the arithmetic needs. Underneath the language of free choice sits the desire gap: people report wanting more children than they have, so some of this fall is not preference but a world too costly and rushed to raise the families it claims to want. The same shrinking, crossed with son preference, erased tens of millions of girls before birth. And if growth itself needs people, the quiet end of this story is not a green calm but a long, graying stagnation."
whatWouldChangeIt: "The single thing to watch is not the world fertility rate but whether any low-fertility society sustainably climbs back through replacement. None has yet; a country that managed it, and showed how, would turn the verdict from a one-way slide into a manageable cycle, and the early rich-world reversal toward higher fertility where gender equality is greatest is the place to look.\n\nWatch South Korea and China for whether the bottom has a floor. Watch Sub-Saharan Africa, whose pace of decline sets the height of the 2084 peak more than any other factor.\n\nIt darkens if below-replacement fertility proves contagious and irreversible, if the desire gap widens as children grow costlier, and if aging societies turn to coercing births rather than supporting them. It brightens if shared parenting and real childcare make children compatible with the lives people actually lead, and the family people want and the family they have finally meet."

methodology:
  - { term: "Total fertility rate", detail: "The number of children a woman would bear if she experienced, at each age, the age-specific birth rates of a single given year. It is a period snapshot, not a completed family size, so it reacts to the timing of births and can dip or spike without a matching change in how many children people ultimately have. World, regional, and country series are from the UN World Population Prospects (2024) via Our World in Data and the World Bank's mirror of the UN Population Division. Replacement is taken as about 2.1." }
  - { term: "History versus projection, and the fan", detail: "Every chart that crosses the present draws measured history as a solid line and projection as a dashed one. Single projected lines use the UN's medium variant; Fig. 20 shows the full fan — the UN low, medium, and high variants, which differ by roughly half a child per woman sustained and span more than seven billion people by 2100. The variants and the demographic-indicator series are taken directly from the UN WPP 2024 bulk files (CC BY 3.0 IGO); the medium population line and the long history also appear via Our World in Data." }
  - { term: "The rival projection (cited, not re-hosted)", detail: "Fig. 20 cites an independent projection from the Institute for Health Metrics and Evaluation (Vollset et al., The Lancet, 2020), which peaks world population earlier and lower than the UN. It is referenced and linked, not charted from re-hosted data, because its terms are non-commercial. The disagreement between two careful teams is shown precisely because it is the honest measure of how uncertain the long-run future is." }
  - { term: "The drivers", detail: "Child mortality (UN IGME, deaths before five per 100 live births) is shown as the principal cause; girls' secondary enrolment and women's labour-force participation (World Bank, from UNESCO and the ILO) and the adolescent fertility rate (UN Population Division via the World Bank) trace the human mechanism. The reversal of the fertility–development relationship at high incomes is attributed to the research of Myrskylä, Kohler & Billari (Nature, 2009) and Doepke, Hannusch, Kindermann & Tertilt (2022); the quantity–quality framing to Gary Becker; the transition framework to Frank Notestein; the low-fertility-trap hypothesis to Lutz and colleagues; and the depopulation-and-growth argument to Charles I. Jones (2022). These are characterised qualitatively and cited, never converted into numbers we did not measure." }
  - { term: "Aging, dependency, migration, sex ratio", detail: "Share of population aged 65+ and the old-age dependency ratio are World Bank series from the UN Population Division. Net migration rate by income group and sex ratio at birth are taken directly from the UN WPP 2024 file. The income groups are the World Bank's; the natural sex ratio at birth is about 105 boys per 100 girls, so sustained values above ~107 indicate sex selection." }
  - { term: "The desire gap (cited, not charted)", detail: "The finding that people report wanting more children than they have draws on survey programmes — the Demographic and Health Surveys and rich-country equivalents — whose micro-data we do not re-host. It is discussed qualitatively and informs the despair reading; no specific figure is asserted as our own measurement." }
  - { term: "The composite verdict", detail: "The headline verdict and the hope / despair / confusion reading on each chart are an editorial synthesis of the evidence, not a calculated score. For this question the synthesis deliberately holds the two readings unresolved, because the benign cause and the structural cost are the same fact seen from different positions. Every charted series is real, ingested, validated, and individually sourced and downloadable; cited research and surveys are linked, not re-hosted." }

sources:
  - { id: "owid-fertility", name: "Our World in Data — Children per woman (UN WPP)", url: "https://ourworldindata.org/grapher/children-per-woman-un", license: "CC BY 4.0", vintage: "2026", note: "World total fertility rate and the four country series (South Korea, China, Japan, Niger); UN World Population Prospects 2024." }
  - { id: "wb-tfr", name: "World Bank — Fertility rate, total (SP.DYN.TFRT.IN)", url: "https://data.worldbank.org/indicator/SP.DYN.TFRT.IN", license: "CC BY 4.0", vintage: "2026", note: "The regional fertility fan and the by-country spread; UN Population Division via the World Bank." }
  - { id: "owid-growth", name: "Our World in Data — Population growth rate / births / median age (UN WPP)", url: "https://ourworldindata.org/grapher/population-growth-rates", license: "CC BY 4.0", vintage: "2026", note: "Growth rate, annual births, and median age, history and UN medium projection." }
  - { id: "owid-population", name: "Our World in Data — Population, with UN projections", url: "https://ourworldindata.org/grapher/population-long-run-with-projections", license: "CC BY 4.0", vintage: "2026", note: "World population, measured history and UN medium-variant projection to 2100." }
  - { id: "unwpp", name: "UN World Population Prospects 2024 — Demographic Indicators (direct)", url: "https://population.un.org/wpp/", license: "CC BY 3.0 IGO", vintage: "2024", note: "Taken directly from the published bulk files: the low/high projection fan, sex ratio at birth, and net migration by income group. UN DESA, Population Division." }
  - { id: "wb-drivers", name: "World Bank — girls' secondary enrolment, women's labour force, adolescent fertility", url: "https://data.worldbank.org/indicator/SP.ADO.TFRT", license: "CC BY 4.0", vintage: "2026", note: "SE.SEC.ENRR.FE (UNESCO), SL.TLF.CACT.FE.ZS (ILO), SP.ADO.TFRT (UN Population Division) — the drivers." }
  - { id: "wb-aging", name: "World Bank — aging & dependency (SP.POP.65UP.TO.ZS, SP.POP.DPND.OL)", url: "https://data.worldbank.org/indicator/SP.POP.65UP.TO.ZS", license: "CC BY 4.0", vintage: "2026", note: "Share over 65 (world and by region) and the old-age dependency ratio; UN Population Division via the World Bank." }
  - { id: "igme", name: "UN IGME — Under-five mortality, via Our World in Data", url: "https://childmortality.org", license: "CC BY 4.0", vintage: "2026", note: "Deaths before age five per 100 live births; the cause underlying the fertility fall." }
  - { id: "ihme-lancet", name: "IHME — Vollset et al., 'Fertility, mortality, migration, and population scenarios' (The Lancet, 2020)", url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(20)30677-2/fulltext", license: "academic — link-only", vintage: "2020", note: "The independent rival projection cited in Fig. 20 (peak earlier, ~9bn by 2100); referenced and linked, not re-hosted." }
  - { id: "doepke", name: "Doepke, Hannusch, Kindermann & Tertilt — 'The Economics of Fertility: A New Era' (2022); Myrskylä, Kohler & Billari (Nature, 2009)", url: "https://www.nber.org/papers/w29948", license: "academic — link-only", vintage: "2022", note: "The reversal of the fertility–development relationship at high incomes; cited qualitatively in Fig. 14." }
  - { id: "jones", name: "Charles I. Jones — 'The End of Economic Growth? Unintended Consequences of a Declining Population' (AER, 2022)", url: "https://www.aeaweb.org/articles?id=10.1257/aer.20201605", license: "academic — link-only", vintage: "2022", note: "The argument that ideas need people, so depopulation could end growth; cited in Fig. 21." }
  - { id: "lutz", name: "Lutz, Skirbekk & Testa — the low-fertility-trap hypothesis (2006); Pritchett — desired fertility and policy (1994)", url: "https://www.jstor.org/stable/20058983", license: "academic — link-only", vintage: "2006", note: "The trap (fertility self-reinforcing below ~1.5) and the policy-skeptic view (desired fertility drives actual); cited in the takes and back matter." }

revisions:
  - { date: "2026-06-13", text: "First publication, then expanded the same day from eleven to sixteen movements: added the 'why it fell' act (child survival, the girl effect, the contested rich-world reversal), the migration release valve, the missing-girls sex-ratio chart, and the full UN projection fan, with the academic debate (Notestein, Becker, Myrskylä, Doepke, Lutz, Pritchett, Jones) cited throughout. New `unwpp` adapter pulls the UN WPP 2024 bulk files directly (CC BY 3.0 IGO) for the variants, sex ratio, and migration. Verdict held deliberately unresolved." }
---

### Still lost? Read this.

Here is the whole thing in plain words. A hundred years ago, having a lot of children was partly insurance, because so many died young. About one in four children did not reach their fifth birthday. Today, almost everywhere, that number has collapsed to fewer than one in twenty-five. Once parents could trust that their children would live, and once girls could go to school, work, and decide for themselves, families got smaller, fast. The average woman went from about five children in the 1960s to about two today.

That sounds like a problem only if you stop there. Mostly it is the opposite: it is what success looks like. The terrifying "population bomb" people feared in the 1960s never went off, not because of famine or force, but because billions of people freely chose to have fewer kids as their lives got better. The world will still grow for another sixty years or so, to around ten billion people, before it gently starts to shrink — though honest forecasters disagree by billions about exactly where it lands.

The catch is what a world of few children slowly becomes: an old one. With fewer young people coming up behind, the share of people over 65 has doubled, and there are fewer workers to support each retiree. That strains pensions, care, and budgets. The hardest cases, like South Korea at 0.7 children per woman, are already halving themselves each generation with no proven way to turn it around — and the rich world's main fix, immigration, only works by drawing the young out of poorer countries. Quietly, too, surveys keep finding that people say they want more children than they actually have, which means some of this is not free choice but a world too expensive and rushed to raise the families people want.

So is the world running out of children? Not in the sense of disappearing. But in the places furthest down this road, there really are too few young people to keep things running the way they were built to run, and nobody has figured out how to change that without changing the good things that caused it. The honest one-liner for dinner: children stopped dying and women got to choose, so families got smaller, and now we have to pay for that gift by growing old — and we genuinely don't yet know whether that's a crisis or just a change.

