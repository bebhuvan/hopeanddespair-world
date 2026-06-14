---
question: "Are we beating disease and death?"
dek: "The retreat of early death is the best news on Earth, and most people have never heard it. Then the pandemic took a piece of it back — and where you are born still decides whether your child sees five."
theme: "Health"
kickerNumber: "02"
verdict: "Better than it feels"
order: 2
publishedAt: 2026-06-13
status: "published"
illustrative: false

atlas:
  hope: { pos: 0.06, lens: "the long view" }
  despair: { pos: 0.30, lens: "still-preventable deaths" }

caveats:
  - "“Disease and death” here is mostly <b>mortality</b> — who dies, of what, and how young — plus a few headline infections. Chronic pain, disability, and mental illness are thinly counted; the absence of dying is not the same as health, and this article keeps tripping over that gap."
  - "The deep curves — child mortality before 1950, life expectancy before 1900 — are <b>modelled reconstructions</b> (UN IGME, Gapminder, historical demography). Trustworthy in their direction and shape; rough in their exact level."
  - "<b>Life expectancy at birth</b> is not how long a typical adult lives. It is an average dragged down hard by babies who die, so most of its long rise is fewer infant deaths, not more old age. Said again where it matters below."
  - "Every section reads at <b>three magnifications</b> — the world line, the regional spread, and named countries — all on <b>real ingested data</b> (UN IGME, the World Bank's mirror of WHO, UNAIDS, and the UN agencies, CC BY 4.0), with source, data package, and lineage downloadable under each figure. Two series come straight from the <b>WHO Global Health Observatory</b> (healthy life expectancy, premature NCD death); WHO's licence forbids re-hosting, so those are charted and cited but carry no download. The deep world curve and the regional cuts sometimes use different units (child mortality is per 100 in the long view, per 1,000 by region) — flagged where it matters."
  - "World averages <b>hide the chasm</b>, which is why no section stops at the global line. A child in Helsinki and a child in Lagos do not live on the same line, and most of this article is the distance between them."

evidence:
  heroLabel: "Life expectancy at birth / years"
  hero: [[1770,28.5],[1820,29],[1870,30],[1900,32],[1918,28],[1930,46],[1950,46.5],[1970,58],[1990,64.5],[2000,66.5],[2010,70.4],[2019,72.6],[2020,71.9],[2021,70.9],[2023,73.2]]
  windows:
    - { lab: "Deep history", range: "1770 — 2023", from: 1770, to: 2023, verdict: "Yes", temp: "cool" }
    - { lab: "Since 1950", range: "1950 — 2023", from: 1950, to: 2023, verdict: "Yes", temp: "cool" }
    - { lab: "The pandemic", range: "2019 — 2021", from: 2019, to: 2021, verdict: "No", temp: "warm" }
    - { lab: "The recovery", range: "2021 — 2023", from: 2021, to: 2023, verdict: "Again", temp: "cool" }
  readout: "Zoom out to the centuries and the news is overwhelming: a person born in 1770 could expect under thirty years, and a person born today gets past seventy. Zoom in to 2020 and the line does something it had not done in living memory. It falls. Then, within two years, it climbs back."
  signals:
    - { fig: "FIG. 2", name: "Child mortality", unit: "% dead before age 5", badUp: true, data: [[1800,42.8],[1900,36],[1950,22.5],[1990,9.3],[2010,5.2],[2023,3.7]] }
    - { fig: "FIG. 3", name: "Basic vaccine coverage", unit: "% of infants, DTP3", badUp: false, data: [[1980,20],[1990,42],[2000,72],[2010,84],[2019,86],[2024,85]] }
    - { fig: "FIG. 4", name: "Maternal deaths", unit: "per 100,000 births", badUp: true, data: [[1985,460],[2000,339],[2015,228],[2019,207],[2021,242],[2023,197]] }
    - { fig: "FIG. 5", name: "New HIV infections", unit: "per 1,000 uninfected", badUp: true, data: [[1990,0.78],[1995,0.91],[2005,0.55],[2015,0.36],[2024,0.28]] }
  recentFrom: 2019
  recentTo: 2023
  recentVerdict: "Mixed"
  recentTemp: "warm"
  synthesis: "Life expectancy fell in 2020 and 2021 for the first time in generations, maternal progress stalled before the pandemic and has barely restarted, and malaria has crept back up since 2019. A cluster of small reversals after decades of one-way traffic."
  vantageNote: "The calm world average says nothing about a delivery room in northern Nigeria, where a birth is hundreds of times more likely to kill the mother than the same birth in Sweden."

movements:
  - eyebrow: "The long arc"
    fig: "FIG. 6"
    question: "Across the centuries, how many children lived to grow up — and where do they still die?"
    claim: "Two centuries ago, nearly half of all children died before five. Now it is under four in a hundred — but where you are born still swings the odds ninefold."
    dropCap: true
    explainer: "Picture a hundred babies born in the year 1800. Before their fifth birthday, about forty-three of them would be dead. A mother who carried six children to term could expect to bury two or three; burying a child was not a tragedy that befell the unlucky, it was the ordinary texture of a life. Today that number is 3.67 in a hundred and still falling, pulled down by a stack of unglamorous wins: clean water, the germ theory, oral rehydration salts, antibiotics, and above all vaccines.\n\nBut the world line is an average, and the average is a lie of composition. Split it by region and it splinters into different centuries living at once. In Europe and Central Asia about 8 children in a thousand die before five; in Sub-Saharan Africa it is 71, nine times higher, roughly where the rich world stood in the 1950s. Drop to single countries and the spread widens again: a child in Nigeria is about 48 times more likely to die than a child in Finland or Japan. None of that gap is mystery. It tracks the things that travel with poverty, a clinic an hour away or a day away, a fever treated or not.\n\nThe hopeful half is that every one of these lines is falling, and falling fastest where it started highest, so the gap narrows even as it stays wide. The grim half is the level. Of all the lines on this site, the world curve is the one to remember; the regional and country ones are the reminder that the work is unfinished, and exactly where."
    sidenote: { mark: "a", text: "Units shift with the lens: the deep world curve is per 100 children (so 3.67 means 3.67%), the regional and country charts are per 1,000 (so 71 means 7.1%). Same measure, different scale." }
    captionLeft: "<b>Child mortality</b> · share of children dying before age 5 · World"
    captionRight: "1800 — 2023"
    source: "Source · Our World in Data — UN IGME & Gapminder · CC BY 4.0"
    chart:
      id: "m1"
      dataRef: "child-mortality-world"
      ymax: 45
      yTicks: [0,15,30,45]
      xTicks: [1800,1850,1900,1950,2000,2023]
      series:
        - { name: "Child mortality", color: "hope", data: [[1800,42.8],[2023,3.67]] }
    regional:
      label: "<b>Where children still die</b> · deaths before age 5, per 1,000 · by region"
      note: "Where a child is born still swings the odds ninefold: Sub-Saharan Africa loses 71 children per 1,000 before five, against 8 in Europe. But it is a closing gap. South Asia fell from 129 to 27 in a single generation, one of the fastest declines ever recorded, and Africa is on the same path a decade or two behind."
      refs:
        - { ref: "child-mortality-ssf", name: "Sub-Saharan Africa", color: "despair" }
        - { ref: "child-mortality-sas", name: "South Asia", color: "ochre" }
        - { ref: "child-mortality-lcn", name: "Latin America", color: "uncertain" }
        - { ref: "child-mortality-eas", name: "East Asia", color: "stone" }
        - { ref: "child-mortality-ecs", name: "Europe & Central Asia", color: "hope" }
    countries:
      label: "<b>From Lagos to Helsinki</b> · under-5 deaths per 1,000, latest year"
      note: "Nigeria buries about 116 children per 1,000; Finland and Japan, fewer than 3. That fortyfold gap is not science the rich world hoards. It is clinics, midwives, and cold chains the poorest places still lack."
      ref: "child-mortality-by-country"
    take:
      hope: "The likeliest death our ancestors faced, the death of a small child, has been pushed to the edge of modern life, and is retreating fastest where it was worst."
      despair: "A ninefold regional gap and a fortyfold country gap mean millions of children still die every year of causes we mastered decades ago."
      confusion: "How much credit goes to medicine versus clean water, food, and simple wealth is genuinely hard to disentangle."
  - eyebrow: "The long arc"
    fig: "FIG. 7"
    question: "And how long does a single life last — the same everywhere?"
    claim: "A life lasted under thirty years in 1770; now it lasts past seventy. But a baby in Switzerland is handed thirty years more than one in Nigeria."
    explainer: "For most of human history the average life ran out before the average person finished being young. Around 1770 a newborn could expect roughly twenty-eight years, and that barely moved for a century. Then, over a few generations, it more than doubled, to 73 today. The catch lives inside the word average: life expectancy at birth is pulled down hard by every baby who dies, so most of that doubling is simply children surviving who once would not have. What changed was less that the old got much older and more that far more people got to grow old at all.\n\nThe world figure hides a familiar split. Sub-Saharan Africa sits at about 63 years; Europe and Central Asia at nearly 79, a gap of sixteen years between regions. By country the distance stretches to thirty: Switzerland and Japan clear 84, while Nigeria, Chad, and the Central African Republic sit in the mid-50s, about where Europe was a century ago. The line also remembers its wounds. The deep notch in 1918 is the influenza pandemic, which killed enough young adults to knock years off the world in a single season, a preview of a smaller dip this article reaches later."
    sidenote: { mark: "b", text: "“At birth” is the key phrase. A high-mortality society can have an adult who lives to seventy and still post a life expectancy of fifty, because so many never reach adulthood." }
    captionLeft: "<b>Life expectancy at birth</b> · years · World"
    captionRight: "1770 — 2023"
    source: "Source · Our World in Data — UN WPP, Human Mortality Database & Riley (2005) · CC BY 4.0"
    chart:
      id: "m2"
      dataRef: "life-expectancy-world"
      ymax: 80
      yTicks: [0,20,40,60,80]
      xTicks: [1800,1850,1900,1950,2000,2023]
      annots: [{ x: 1918, label: "the 1918 flu" }]
      series:
        - { name: "Life expectancy", color: "hope", data: [[1770,28.5],[2023,73.2]] }
    regional:
      label: "<b>The lifespan gap</b> · life expectancy at birth, years · by region"
      note: "Sixteen years separate the regions: Europe and Central Asia near 79, Sub-Saharan Africa about 63. Most of that gap is still the very young dying, not the old dying sooner. Every line climbs, and the lowest climbs fastest, so the distance is closing even now."
      refs:
        - { ref: "life-expectancy-ssf", name: "Sub-Saharan Africa", color: "despair" }
        - { ref: "life-expectancy-sas", name: "South Asia", color: "ochre" }
        - { ref: "life-expectancy-lcn", name: "Latin America", color: "uncertain" }
        - { ref: "life-expectancy-eas", name: "East Asia", color: "stone" }
        - { ref: "life-expectancy-ecs", name: "Europe & Central Asia", color: "hope" }
    countries:
      label: "<b>A thirty-year spread</b> · life expectancy at birth, latest year"
      note: "Switzerland and Japan clear 84 years; Nigeria, Chad, and the Central African Republic sit in the mid-50s. That is roughly where Switzerland itself stood a century ago, a full thirty years apart within one world."
      ref: "life-expectancy-by-country"
    take:
      hope: "The typical human now gets a second half of life almost none of our ancestors were granted, and the poorest regions are closing on the richest."
      despair: "A thirty-year gap between the longest- and shortest-lived countries is a gap in whole decades of a single human life."
      confusion: "Because the number is dominated by infant survival, it tells you less about how the old fare than people assume."
  - eyebrow: "The engine"
    fig: "FIG. 8"
    question: "Why did the dying stop — and who does the engine still miss?"
    claim: "In 1980 one infant in five got the basic vaccines; now five in six do. South Asia has overtaken the world average; Central Africa still trails it."
    explainer: "In 1974 the World Health Organization launched something with a dull name and an enormous reach: the Expanded Programme on Immunization. Fewer than one child in twenty in poor countries was then vaccinated against the routine killers. The idea was simple and relentless, get a handful of cheap vaccines to every child on the planet, cold chain by cold chain. Coverage for the three-dose diphtheria-tetanus-pertussis course, the standard test of whether a health system reaches its babies, climbed from 20 percent in 1980 to about 85 today; measles tracks just behind. The basic vaccines travel together, given at the same infant visits, so hepatitis B and polio coverage sit within a point of that figure, and one line stands in for the whole routine schedule. Each point is millions of children who never caught what used to be a death sentence.\n\nThe regional picture carries the surprise. South Asia, once a byword for unreached children, now vaccinates 94 percent of its infants, several points above the world average, the fruit of India's vast immunization drives. Sub-Saharan Africa trails at 74. By country the laggards are specific and knowable: Japan, Bangladesh, China, and India clear the mid-90s, while the Democratic Republic of Congo, Nigeria, and Somalia sit in the high 60s. That is the whole story of the stalled global line in miniature. The engine works; it has simply not reached the last, hardest places, which are exactly where the health system is weakest. A vaccine only works if it reaches an arm."
    captionLeft: "<b>Childhood vaccine coverage</b> · % of infants · World"
    captionRight: "1980 — 2024"
    source: "Source · WHO/UNICEF Estimates (WUENIC), via Our World in Data · CC BY 4.0"
    chart:
      id: "m3"
      dataRefs: ["vaccine-dtp3-world", "vaccine-measles-world"]
      ymax: 100
      yTicks: [0,25,50,75,100]
      xTicks: [1980,1990,2000,2010,2024]
      valueSuffix: "%"
      series:
        - { name: "DTP, 3 doses", color: "hope", data: [[1980,20],[2024,85]] }
        - { name: "Measles", color: "ochre", data: [[1980,16],[2024,84]] }
    regional:
      label: "<b>Coverage by region</b> · DTP3, % of infants"
      note: "South Asia now vaccinates 94 percent of its infants, above the world average, on the back of India's mass campaigns. Sub-Saharan Africa, at 74, is the drag that holds the global line flat. The work left is not inventing the vaccine; it is the last hard mile to each child."
      refs:
        - { ref: "vaccine-dtp3-sas", name: "South Asia", color: "hope" }
        - { ref: "vaccine-dtp3-eas", name: "East Asia", color: "stone" }
        - { ref: "vaccine-dtp3-mea", name: "Middle East & N. Africa", color: "uncertain" }
        - { ref: "vaccine-dtp3-lcn", name: "Latin America", color: "ochre" }
        - { ref: "vaccine-dtp3-ssf", name: "Sub-Saharan Africa", color: "despair" }
    countries:
      label: "<b>Who the engine misses</b> · DTP3 coverage, % of infants, latest year"
      note: "The floor is not the poorest countries but the most broken ones. Bangladesh, poor but peaceful, reaches 97 percent of its infants. The Democratic Republic of Congo, Nigeria, and Somalia sit in the high 60s, held down by conflict, distance, and distrust as much as by money. A child goes unvaccinated not where money is shortest but where the state's reach gives out."
      ref: "vaccine-dtp3-by-country"
    take:
      hope: "One of the cheapest interventions ever devised reaches roughly six in seven of the world's children, and South Asia shows the last stretch is winnable."
      despair: "Coverage has stalled for a decade and slipped in the pandemic, leaving pockets of unvaccinated children exactly where outbreaks catch."
      confusion: "Whether the last unreached fraction is a logistics problem or a trust problem differs sharply from place to place."
  - eyebrow: "The great infections"
    fig: "FIG. 9"
    question: "Are the epidemics in retreat — and are they everyone's?"
    claim: "New HIV infections have fallen by two-thirds. But the burden that remains is not the world's evenly; it sits in one region and a handful of countries."
    explainer: "In the 1990s a positive HIV test was, across much of the world, a death sentence with a timetable. New infections worldwide peaked near 0.9 per thousand uninfected people in 1995 and now sit around 0.28, a fall of roughly two-thirds, driven by antiretroviral therapy scaled up after 2003 until the drugs reached millions who could never have paid. The success has a strange shape: the number of people living with HIV has risen, from about 0.3 percent of adults in 1990 to 0.7, because the treatment that stops the dying keeps people alive for decades. Winning, on this measure, looks like more sick people, not fewer.\n\nWhat the world line buries is how concentrated the remaining burden is. Malaria is the clearest case: across Sub-Saharan Africa there are about 229 cases a year for every thousand people at risk, against roughly one in South Asia, a regional gap of more than two hundredfold. HIV is concentrated by country instead. In Eswatini about 23 percent of adults live with the virus, in Lesotho and South Africa around 17, in India 0.2. The epidemics that defined a generation have become, in effect, the burden of specific places, which is grim and also the reason they can be planned against. The danger is that the programmes holding them down depend on outside money, and a budget written elsewhere can move every line here."
    sidenote: { mark: "c", text: "<b>Incidence</b> is how many people newly catch a disease in a year; <b>prevalence</b> is how many live with it at a given moment. They can move opposite ways — falling incidence, rising prevalence — which is exactly the HIV story." }
    captionLeft: "<b>New HIV infections</b> · per 1,000 uninfected people · World"
    captionRight: "1990 — 2024"
    source: "Source · UNAIDS, via World Bank · CC BY 4.0"
    chart:
      id: "m4"
      dataRef: "hiv-incidence-world"
      ymax: 1
      yTicks: [0,0.25,0.5,0.75,1]
      xTicks: [1990,2000,2010,2024]
      series:
        - { name: "New HIV infections", color: "hope", data: [[1990,0.78],[2024,0.28]] }
    regional:
      label: "<b>Malaria, a Sub-Saharan burden</b> · cases per 1,000 at risk · by region"
      note: "Malaria is now almost entirely a Sub-Saharan disease: about 229 cases a year per 1,000 at risk there, against one in South Asia. The burden did not fade everywhere evenly. It retreated to a single region."
      refs:
        - { ref: "malaria-incidence-ssf", name: "Sub-Saharan Africa", color: "despair" }
        - { ref: "malaria-incidence-mea", name: "Middle East & N. Africa", color: "ochre" }
        - { ref: "malaria-incidence-lcn", name: "Latin America", color: "uncertain" }
        - { ref: "malaria-incidence-eas", name: "East Asia", color: "stone" }
        - { ref: "malaria-incidence-sas", name: "South Asia", color: "hope" }
    countries:
      label: "<b>The geography of HIV</b> · % of adults 15–49 living with HIV, latest year"
      note: "About 23 percent of adults in Eswatini live with HIV, against 0.2 percent in India. On this map an 'epidemic' is the weight carried by a handful of southern African countries, not a global event."
      ref: "hiv-prevalence-by-country"
    take:
      hope: "A diagnosis that meant death in 1995 is a manageable condition today, and a burden concentrated in a few places is a burden that can be targeted."
      despair: "Malaria has turned back upward since 2019 and tuberculosis has stalled, while whole nations carry an HIV weight the rest of the world has forgotten."
      confusion: "Prevalence rising as new infections fall makes 'are we winning?' genuinely ambiguous on any single number."
  - eyebrow: "The frontier"
    fig: "FIG. 10"
    question: "Is it as safe to give birth — and where is it not?"
    claim: "Maternal deaths halved, then stalled. A woman in Nigeria is still about 250 times more likely to die giving birth than a woman in Sweden."
    explainer: "Of all the curves here, childbirth carries the cruelest gap. The world maternal death rate fell from about 460 per 100,000 births in 1985 to 197 today, but the fall stalled in the late 2010s and the pandemic briefly pushed it back up. The stall is the global story; the gap is the real one. By region, Sub-Saharan Africa loses about 448 mothers per 100,000 births while Europe and Central Asia lose 11, a fortyfold difference. By country the spread becomes almost hard to believe: Sweden loses about 4 mothers per 100,000 births, Nigeria 993, nearly one in every hundred, with Chad and South Sudan close behind.\n\nA birth in the most dangerous country is on the order of 250 times likelier to kill the woman than the same birth in the safest. Nothing else in global health carries a rich-to-poor gap this brutal, and nothing else is as purely a problem of distribution rather than discovery. What closes it is unglamorous and known: a trained attendant, a way to stop a haemorrhage, a road to a clinic, blood to transfuse. The countries at the bottom of this chart are not waiting on a breakthrough; they are waiting on the staff and supplies to deliver the ones we already have. That makes maternal death, in principle, one of the most solvable catastrophes on this list. It has just not been solved."
    captionLeft: "<b>Maternal mortality</b> · maternal deaths per 100,000 live births · World"
    captionRight: "1985 — 2023"
    source: "Source · MMEIG (WHO/UNICEF/UNFPA/World Bank/UNDESA), via World Bank · CC BY 4.0"
    chart:
      id: "m5"
      dataRef: "maternal-mortality-world"
      ymax: 500
      yTicks: [0,125,250,375,500]
      xTicks: [1985,1995,2005,2015,2023]
      series:
        - { name: "Maternal deaths", color: "hope", data: [[1985,460],[2023,197]] }
    regional:
      label: "<b>Maternal deaths by region</b> · per 100,000 live births"
      note: "Sub-Saharan Africa loses about 448 mothers per 100,000 births; Europe and Central Asia, 11. It is a fortyfold gap. Africa is falling, from about 610 a decade ago, but nowhere near fast enough to close it."
      refs:
        - { ref: "maternal-mortality-ssf", name: "Sub-Saharan Africa", color: "despair" }
        - { ref: "maternal-mortality-sas", name: "South Asia", color: "ochre" }
        - { ref: "maternal-mortality-lcn", name: "Latin America", color: "uncertain" }
        - { ref: "maternal-mortality-eas", name: "East Asia", color: "stone" }
        - { ref: "maternal-mortality-ecs", name: "Europe & Central Asia", color: "hope" }
    countries:
      label: "<b>Where birth is most dangerous</b> · maternal deaths per 100,000 births, latest year"
      note: "Sweden loses 4 mothers per 100,000 births, Nigeria 993, nearly one in a hundred. The fix is a trained attendant and blood to transfuse, not a discovery. That is what makes the gap as solvable as it is shameful."
      ref: "maternal-mortality-by-country"
    take:
      hope: "Because the fix is delivery, not discovery, the worst maternal death rates are among the most reversible numbers on this site."
      despair: "A 250-fold gap in surviving childbirth is a quiet, ongoing catastrophe that stalled even before the pandemic."
      confusion: "Maternal deaths are notoriously under-recorded, so the true figures in the worst-affected places may be worse than shown."
  - eyebrow: "The reversal"
    fig: "FIG. 11"
    question: "Did any of this ever go backwards?"
    claim: "In 2020 and 2021, for the first time in a generation, human life got shorter — and in Latin America it fell off a cliff."
    explainer: "For most people alive today, life expectancy was a number that only ever went up. Then the world caught a new virus and in 2020 the line bent down. By 2021 the global figure had fallen from 72.6 years to 70.9, the planet aged backward by more than a year and a half, erasing roughly a decade of gains in two seasons. This is the single fact behind the verdict at the top of this piece. Progress this large is not a law of nature; it is a thing that can be lost.\n\nThe world figure understates how hard it hit some places. Latin America lost about three and a half years off its life expectancy between 2019 and 2021, falling from 75.2 to 71.8, a regional collapse with few peers in peacetime. And then, almost as fast, it came back. By 2023 the global figure had climbed past its pre-pandemic peak to 73.2. The dip and the rebound together are the honest answer to whether we are beating death: yes, on a scale that should be front-page news, and no, not safely, not permanently. The recovery is the hopeful part. The speed of the fall is the warning. This is the one section with no clean regional or country chart, because a pandemic's toll lands in a single notch that a flat-scaled line cannot show; the numbers above come straight from the same series."
    sidenote: { mark: "d", text: "The axis here is zoomed to a narrow band of years so the dip is visible; on the full 0-to-80 scale of FIG. 7 it is a small notch in a tall climb, which is also why the regional lines can't show it." }
    captionLeft: "<b>Life expectancy at birth</b> · years · World"
    captionRight: "2008 — 2023"
    source: "Source · Our World in Data — UN WPP & Human Mortality Database · CC BY 4.0"
    chart:
      id: "m6"
      dataRef: "life-expectancy-world"
      x0: 2008
      ymin: 68
      ymax: 74
      yTicks: [68,70,72,74]
      xTicks: [2008,2012,2016,2020,2023]
      annots: [{ x: 2021, label: "the pandemic low", y: 70.9 }]
      series:
        - { name: "Life expectancy", color: "uncertain", data: [[2008,70.1],[2023,73.2]] }
    take:
      hope: "The rebound was almost as fast as the fall — within two years the world had recovered all of it and more."
      despair: "A single pathogen subtracted a decade of progress in two years, and in places like Latin America it took three and a half."
      confusion: "How much of the recovery is durable versus a bounce off an artificially low base will only be clear with hindsight."
  - eyebrow: "The hidden cost"
    fig: "FIG. 12"
    question: "We added the years. Are they healthy years — anywhere?"
    claim: "We live about nine years longer than we live well, and that gap follows the same map as wealth."
    explainer: "Underneath life expectancy sits a quieter number, and it complicates the whole celebration. Healthy life expectancy counts only the years lived in good health, before chronic illness or disability sets in. Worldwide in 2021 it was about 61.9 years, while overall life expectancy was near 70.9. The gap is roughly nine years: close to a decade, on average, lived in declining health at the end of a life. It is not closing as we live longer; if anything it widens, because the diseases we are best at surviving are the slow ones.\n\nThe regional picture maps onto wealth almost exactly. Healthy life expectancy runs from about 55 years across the WHO's African region to 66 in Europe and 68 in the Western Pacific, a thirteen-year spread in good health on top of the gap in life itself. There is no country breakdown shown here, and that is deliberate: these figures come from the World Health Observatory, whose licence lets us chart and cite them but not re-host the file, so they sit beside the rest as borrowed evidence and stop at the regional line. Read together, the lines say something true and uncomfortable: we are winning years of life faster than we are winning years of health, and most unevenly where health was already shortest."
    sidenote: { mark: "e", text: "Healthy life expectancy (HALE) is from the <b>WHO Global Health Observatory</b> (CC BY-NC-SA) — charted and credited here, but not offered for download, per WHO's terms. The regional strip carries the same restriction." }
    captionLeft: "<b>Life expectancy vs healthy life expectancy</b> · years · World"
    captionRight: "2000 — 2021"
    source: "Source · Life expectancy: World Bank (CC BY 4.0) · Healthy life expectancy: WHO Global Health Observatory (CC BY-NC-SA, link-only)"
    chart:
      id: "m7"
      dataRefs: ["life-expectancy-wld", "hale-world"]
      x1: 2021
      ymax: 80
      yTicks: [0,20,40,60,80]
      xTicks: [2000,2005,2010,2015,2021]
      series:
        - { name: "Life expectancy", color: "stone", data: [[2000,66.5],[2021,71]] }
        - { name: "Healthy life expectancy", color: "hope", data: [[2000,58.1],[2021,61.9]] }
    regional:
      label: "<b>Healthy years by region</b> · HALE at birth, years · WHO regions"
      note: "Healthy life follows the same map as wealth, and the poorest places lose twice. WHO's African region gets about 55 healthy years, Europe 66, the Western Pacific 68. That thirteen-year spread sits on top of the gap in life itself, so the shortest lives are also the least healthy. WHO data, link-only."
      refs:
        - { ref: "hale-afr", name: "Africa", color: "despair" }
        - { ref: "hale-emr", name: "E. Mediterranean", color: "ochre" }
        - { ref: "hale-sear", name: "South-East Asia", color: "uncertain" }
        - { ref: "hale-amr", name: "Americas", color: "stone" }
        - { ref: "hale-eur", name: "Europe", color: "hope" }
        - { ref: "hale-wpr", name: "Western Pacific", color: "hope" }
    take:
      hope: "Even the healthy years are rising, and the gap to life expectancy is a measure of how many people now reach old age at all."
      despair: "We are banking longevity as a growing stock of years in poor health, widest where health was already shortest."
      confusion: "Measuring 'healthy' across cultures and clinics is hard, so the exact size of the gap is more uncertain than life expectancy itself."
  - eyebrow: "The problem of success"
    fig: "FIG. 13"
    question: "If we are beating the old killers, what is left — and for whom?"
    claim: "We live long enough now to meet the slow diseases. But the world's grey hair is spread wildly unevenly."
    explainer: "Hold all the good news at once and a new shape appears. As infections retreat and children survive, populations age: the share of the world over 65 has doubled from about 5 percent in 1960 to 10 today, and it is still climbing. That is success, written as a problem. The killers of an old population are not cholera and measles; they are heart disease, cancer, diabetes, and dementia, the slow conditions a body only reaches if nothing fast got there first.\n\nAgeing, though, is mostly a rich-region story so far. Europe and Central Asia are already 18 percent over 65; Sub-Saharan Africa is 3 percent, still a young continent finishing the fight against early death the older regions won. So the frontier arrives in sequence, not all at once. Some of it is already yielding: smoking, the great accelerant, has fallen worldwide from about 34 percent of adults in 2000 to 22, and the probability of dying early from the four big chronic diseases has edged down from 22 to 18 percent. But there is no single shot for ageing, no cold chain that delivers a cure for the slow diseases, and the years we are adding are not all healthy ones. We spent a century learning to keep people from dying young. The next century's question is quieter and harder: not whether people live, but how well, and for how long after."
    sidenote: { mark: "f", text: "The premature-NCD figure (22→18 percent) is WHO Global Health Observatory data (CC BY-NC-SA), cited here but not re-hosted, like the healthy-life-expectancy series above." }
    captionLeft: "<b>Population aged 65 and over</b> · % of the world · World"
    captionRight: "1960 — 2024"
    source: "Source · UN World Population Prospects, via World Bank · CC BY 4.0"
    chart:
      id: "m8"
      dataRef: "pop-65plus-world"
      ymax: 12
      yTicks: [0,4,8,12]
      xTicks: [1960,1980,2000,2024]
      valueSuffix: "%"
      series:
        - { name: "Aged 65+", color: "uncertain", data: [[1960,4.97],[2024,10.2]] }
    regional:
      label: "<b>An ageing world, unevenly</b> · % of population aged 65+ · by region"
      note: "Europe and Central Asia are already 18 percent over 65; Sub-Saharan Africa, 3 percent. Ageing is a rich-region condition the poorer regions have not yet reached, so the frontier of chronic disease arrives in sequence, not all at once."
      refs:
        - { ref: "pop-65plus-ecs", name: "Europe & Central Asia", color: "uncertain" }
        - { ref: "pop-65plus-eas", name: "East Asia", color: "stone" }
        - { ref: "pop-65plus-lcn", name: "Latin America", color: "ochre" }
        - { ref: "pop-65plus-sas", name: "South Asia", color: "hope" }
        - { ref: "pop-65plus-ssf", name: "Sub-Saharan Africa", color: "hope" }
    take:
      hope: "Mass old age is itself the prize — billions now reach the decades that chronic disease occupies, which almost no one used to."
      despair: "The slow diseases have no vaccine, and the ageing regions are stacking up years of poor health faster than they can prevent them."
      confusion: "Whether ageing societies can stay healthy and solvent at once is an experiment no country has finished running."
  - eyebrow: "The shape of death"
    fig: "FIG. 14"
    question: "As the old killers retreat, what takes their place?"
    claim: "In one generation the world flipped from dying of infections to dying of chronic disease — and then the pandemic flipped a piece of it back."
    explainer: "In 2000, about a third of all deaths on Earth came from infectious disease, childbirth, and hunger. By 2019 that share had fallen to 18 percent, while deaths from the chronic diseases, heart attacks, cancer, diabetes, climbed from 59 percent to nearly three-quarters. That flip is the epidemiological transition, the quiet signature of a world where children stop dying young. Then the pandemic put a notch in it: communicable deaths jumped back to 27 percent in 2021, the first reversal of the trend in living memory.\n\nHow far a place has traveled along that path is itself a map of development. In East Asia and Europe, around 80 and 74 percent of deaths are now chronic; across Sub-Saharan Africa it is 34 percent, with the majority of deaths still infectious. By country the spread runs from China at 91 percent to Chad at 24. None of this is simply good or bad. Dying of heart disease at 78 is the prize for not dying of measles at 2. The transition is what success looks like from the inside, and most of the world now lives in its second half, where the enemy is slow, chronic, and far harder to vaccinate against."
    sidenote: { mark: "g", text: "The <b>epidemiological transition</b> is the shift, as a society develops, from a death toll dominated by infectious disease to one dominated by chronic, non-communicable disease. The three shares here are drawn straight from WHO's cause-of-death estimates and sum to roughly 100." }
    captionLeft: "<b>What the world dies of</b> · share of all deaths, by cause · World"
    captionRight: "2000 — 2021"
    source: "Source · WHO Global Health Estimates, via World Bank · CC BY 4.0"
    chart:
      id: "m9"
      dataRefs: ["cause-ncd-wld", "cause-communicable-wld", "cause-injury-wld"]
      ymax: 100
      yTicks: [0,25,50,75,100]
      xTicks: [2000,2010,2015,2021]
      valueSuffix: "%"
      series:
        - { name: "Chronic (NCDs)", color: "uncertain", data: [[2000,59],[2021,63]] }
        - { name: "Infectious & maternal", color: "hope", data: [[2000,32],[2021,27]] }
        - { name: "Injury", color: "stone", data: [[2000,8],[2021,7]] }
    regional:
      label: "<b>How far the transition has gone</b> · chronic-disease share of deaths · by region"
      note: "East Asia is 81 percent chronic, Sub-Saharan Africa 34, where most deaths are still infectious. The transition is a development clock, set differently in each region."
      refs:
        - { ref: "cause-ncd-eas", name: "East Asia", color: "hope" }
        - { ref: "cause-ncd-ecs", name: "Europe & Central Asia", color: "stone" }
        - { ref: "cause-ncd-lcn", name: "Latin America", color: "uncertain" }
        - { ref: "cause-ncd-sas", name: "South Asia", color: "ochre" }
        - { ref: "cause-ncd-ssf", name: "Sub-Saharan Africa", color: "despair" }
    countries:
      label: "<b>Where the transition has and hasn't happened</b> · chronic-disease share of deaths, latest year"
      note: "China and Japan now lead the world in dying of chronic disease, above 85 percent, precisely because they have beaten the infections that kill the young. Chad's deaths are barely a quarter chronic. A high share is grim and a milestone at once, the price of having survived everything that used to come first."
      ref: "cause-ncd-by-country"
    take:
      hope: "Dying old of a chronic disease is the prize for surviving everything that once killed the young, and most of the world has now claimed it."
      despair: "The chronic diseases that dominate death now carry no vaccine, and the pandemic showed the infectious ones can still surge back."
      confusion: "A rising share of chronic death is at once a marker of progress and a warning of the burden ahead, genuinely both at the same time."
  - eyebrow: "The deepest cut"
    fig: "FIG. 15"
    question: "Zoom past the country line. Is survival equal even within one nation?"
    claim: "No country is one place. In India the poorest fifth's children die at more than four times the rate of the richest fifth's."
    explainer: "Take the country averages that rank every other chart here, and zoom past them entirely. Within India, children in the poorest fifth of households die before five at about 4.4 times the rate of children in the richest fifth: the same country, the same year, the same flag. Colombia and the Philippines run close behind. Every national average on this page hides a second country folded inside it, where the poor still live by older rules.\n\nThe strange part is where the gap is widest. It is not the poorest countries; it is the middle-income ones. In Niger and Ethiopia the ratio sits below two, not because they are fair but because they are poor enough that the rich bury children too. A wide internal gap is, perversely, a sign that some families have already escaped, that survival has become something money can buy inside a single border. This is the last magnification on the page, the one no global headline reaches. The average launders the spread, and even one country is never one place."
    sidenote: { mark: "h", text: "A <b>wealth quintile</b> is one-fifth of households, ranked by assets. These figures come from household surveys (DHS and UNICEF MICS), so they are snapshots from the latest survey year rather than annual series, and cover mostly low- and middle-income countries — rich countries do not run these surveys." }
    captionLeft: "<b>Child survival, poorest vs richest fifth</b> · under-5 deaths, ratio within each country"
    captionRight: "latest survey, per country"
    source: "Source · Demographic and Health Surveys & UNICEF MICS, via World Bank (HNP by wealth quintile) · CC BY 4.0"
    chart:
      id: "m10"
      dataRef: "u5mr-wealth-gap-by-country"
      ymax: 5
      yTicks: [0,1,2,3,4,5]
      xTicks: [0,1,2,3,4,5]
      series: []
    take:
      hope: "Within most countries the survival gap is narrowing as the poorest families gain the basics the richest always had."
      despair: "In the same city, under the same government, a poor child can be several times more likely to die than a rich one."
      confusion: "The widest internal gaps sit in middle-income countries, so a closing national average can hide a widening one inside."

pullQuote:
  text: "We learned to stop people from dying young so well that the world's hardest health question changed underneath us — from whether you live to how well, and for how long after."
  cite: "The whole argument, in one line"

lenses:
  - { who: "The demographer", confidence: "high", hope: "Child survival is the most reliable upward trend in human history, and it has not truly reversed.", despair: "The same survival ages every population into a wall of chronic disease no society has solved." }
  - { who: "The epidemiologist", confidence: "medium", hope: "HIV, smallpox, and measles prove that a coordinated push can bend an entire disease curve downward.", despair: "Malaria's turn upward and TB's stall show those gains reverse the moment attention or money slips." }
  - { who: "A midwife in a high-mortality district", confidence: "absolute", despair: "A national average is no comfort in a room with no blood to transfuse. The mother in front of me is the only dataset that counts." }
  - { who: "Someone who lost a parent in 2021", confidence: "absolute", despair: "The world recovered its life expectancy in two years. My family did not recover anything." }
  - { who: "The global-health funder", confidence: "low", hope: "The cheapest wins, vaccines and antiretrovirals, still return more life per dollar than almost anything humans buy.", despair: "Most of these curves bend on donor money, and the budgets that hold them up are not guaranteed." }

hopeCase: "The long view is overwhelming and it is the true story. Child mortality has fallen more than tenfold, life expectancy has more than doubled, and a diagnosis that meant death in 1995 is now a manageable condition. The engines of that progress, from vaccines and clean water to antiretrovirals and trained birth attendants, have not stopped working, and the regions that started worst are improving fastest, so the global gaps are narrowing. The pandemic took a piece back and the world recovered it in two years. A bad five years does not undo a better two hundred."
despairCase: "The one-way traffic is over. Life expectancy fell for the first time in a generation, maternal progress stalled before the pandemic and has barely restarted, malaria has turned back upward, and TB has flatlined. The averages hide a ninefold gap in whether a child survives and a 250-fold gap in whether a mother does, sustained in many places by foreign money that can vanish with one budget. And the very success of beating early death has handed us an ageing world full of slow diseases we are far better at surviving than preventing."
whatWouldChangeIt: "The hope case weakens if life expectancy fails to keep rising through the late 2020s, or if vaccine coverage and malaria continue to slide across multiple regions for another five years. The despair case weakens if Sub-Saharan child and maternal mortality resume falling at their pre-2015 pace, if the healthy-life-expectancy gap stops widening, and if the big infection programmes survive intact through a period of donor retrenchment."

methodology:
  - { term: "Under-five mortality", detail: "The share of children who die before their fifth birthday. The world series (per 100 live births) runs on UN IGME and Gapminder via Our World in Data, back to 1800; the regional and country cuts (per 1,000 live births) are UN IGME via the World Bank. Note the unit differs between the deep world curve and the regional charts." }
  - { term: "Life expectancy at birth", detail: "Average years a newborn would live under current mortality rates. Dominated by infant survival, so most of its long rise reflects fewer child deaths, not longer old age. World series from Our World in Data (UN WPP, Human Mortality Database, Riley 2005); regional and country cuts from the World Bank." }
  - { term: "Healthy life expectancy (HALE)", detail: "Years lived in full health, with time in illness or disability discounted. From the WHO Global Health Observatory (CC BY-NC-SA), so it is charted and cited here, world and WHO-region only, but not offered for download. The gap to life expectancy is the years lived in poor health." }
  - { term: "Incidence vs prevalence", detail: "Incidence counts new cases in a year; prevalence counts everyone living with a condition at a moment. For HIV the two diverge: incidence falls while prevalence rises, because treatment keeps people alive with the virus. Both via UNAIDS / WHO through the World Bank." }
  - { term: "Maternal mortality ratio", detail: "Maternal deaths per 100,000 live births, modelled by the MMEIG (WHO, UNICEF, UNFPA, World Bank, UNDESA), via the World Bank. Maternal deaths are heavily under-recorded where systems are weakest, so the worst figures are likely undercounts." }
  - { term: "Regional and country lenses", detail: "Each section reads at three magnifications, and the last at a fourth. Regional aggregates are the World Bank's (six WDI regions) or the WHO's (for HALE); country bars show a curated, recognizable spread at the latest available year. Where the World Bank computes no regional aggregate (HIV incidence for some regions, malaria for Europe) the line is simply absent, never invented." }
  - { term: "Cause-of-death composition", detail: "The share of deaths from communicable (with maternal and nutritional), non-communicable, and injury causes — WHO Global Health Estimates via the World Bank (CC BY). Sparse years (2000, 2010, 2015, 2019–2021); the three shares sum to roughly 100. The deeper cause-by-cause and disability detail lives at IHME's Global Burden of Disease, whose licence is non-commercial, so we link to it rather than re-host it." }
  - { term: "Wealth-quintile gap", detail: "Under-five mortality among the poorest 20% of households divided by the richest 20%, from DHS and UNICEF MICS household surveys via the World Bank's HNP database (CC BY). Latest survey per country, low- and middle-income countries only — the within-country lens below the national average." }
  - { term: "The composite verdict", detail: "The evidence-panel overview and the temperature reading are an editorial synthesis of the signals, not a computed index. Every underlying chart is real, ingested, and individually sourced." }

sources:
  - { id: "igme", name: "UN Inter-agency Group for Child Mortality Estimation (UN IGME)", url: "https://childmortality.org", license: "CC BY 4.0", vintage: "2024", note: "Child and under-five mortality; via Our World in Data and the World Bank." }
  - { id: "owid-le", name: "Our World in Data — Life Expectancy", url: "https://ourworldindata.org/life-expectancy", license: "CC BY 4.0", vintage: "2024", note: "UN WPP, Human Mortality Database, Riley (2005)." }
  - { id: "wuenic", name: "WHO/UNICEF Estimates of National Immunization Coverage (WUENIC)", url: "https://www.who.int/teams/immunization-vaccines-and-biologicals/immunization-analysis-and-insights/global-monitoring/immunization-coverage", license: "CC BY 4.0", vintage: "2024", note: "DTP3 and measles coverage; via Our World in Data." }
  - { id: "unaids", name: "UNAIDS", url: "https://aidsinfo.unaids.org", license: "CC BY 4.0", vintage: "2024", note: "HIV incidence and prevalence; via the World Bank." }
  - { id: "wb-wdi", name: "World Bank — World Development Indicators", url: "https://data.worldbank.org", license: "CC BY 4.0", vintage: "2024", note: "The World Bank's open mirror of WHO, UN IGME, UNAIDS, MMEIG and UN WPP. It carries the regional and country cuts for life expectancy, maternal mortality, vaccines, TB, malaria, HIV, and ageing." }
  - { id: "mmeig", name: "Maternal Mortality Estimation Inter-agency Group (MMEIG)", url: "https://www.who.int/data/maternal-newborn-child-adolescent-ageing/maternal-health", license: "CC BY 4.0", vintage: "2023", note: "Maternal mortality ratio; via the World Bank." }
  - { id: "who-gho", name: "WHO Global Health Observatory", url: "https://www.who.int/data/gho", license: "CC BY-NC-SA 3.0 IGO", vintage: "2024", note: "Healthy life expectancy (HALE) and premature NCD mortality. Link-only: charted and cited, not re-hosted, per WHO's terms." }
  - { id: "hnp-quintile", name: "World Bank HNP — Health, Nutrition & Population by wealth quintile (DHS & UNICEF MICS)", url: "https://databank.worldbank.org/source/health-nutrition-and-population-statistics-by-wealth-quintile", license: "CC BY 4.0", vintage: "various surveys", note: "Under-five mortality by household wealth quintile — the within-country equity lens. Cause-of-death composition is WHO Global Health Estimates, via the World Bank." }
  - { id: "ihme-gbd", name: "IHME — Global Burden of Disease (link-only)", url: "https://vizhub.healthdata.org/gbd-results", license: "IHME Free-of-Charge Non-Commercial Agreement", vintage: "GBD 2021", note: "The deepest cause-of-death, disability, and risk-factor surface. Non-commercial licence, so linked for reference, never re-hosted; the re-hostable composition shown here is the CC BY WHO/World Bank equivalent." }
---

If you remember one thing from this page, remember the first chart. Two hundred years ago, nearly half of all children died before they turned five. Today it is under four in a hundred, and still dropping. There is no bigger or better-hidden piece of news about the human race. We made dying young rare, and we did it almost everywhere.

But the good news comes with three catches, and they are why the answer is "better than it feels" rather than just "better." The first: the last five years bent the line the wrong way. A new virus made human life shorter in 2020 and 2021 for the first time most people could remember, before the world clawed it back. The second: the average is a kind of lie. A child in Sub-Saharan Africa is still nine times likelier to die before five than a child in Europe, and a woman in Nigeria is hundreds of times likelier to die giving birth than a woman in Sweden, gaps that are mostly about who has a clinic and who does not, not about what medicine knows. The third: we got so good at stopping fast deaths that we now live long enough to meet the slow ones, the heart disease and dementia of old age, and we are winning years of life faster than we are winning years of good health.

So, are we beating disease and death? Yes, by a margin so large that not knowing it should count as being misinformed about the world. And also not yet, not safely, and not for everyone equally. The one thing to say at dinner and be right: the retreat of early death is the greatest achievement nobody talks about, and the work that is left is no longer mostly about discovering cures. It is about getting the ones we already have to the people who still die without them.

