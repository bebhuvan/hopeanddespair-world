---
question: "Is humanity becoming less violent?"
dek: "One question, fifteen charts, every one real. The long arc of violence falls hard — and the closer you stand, the worse it looks. This is the verdict read at every distance at once."
theme: "War & Peace"
kickerNumber: "01"
verdict: "Long-run collapse, short-run reversal"
order: 1
publishedAt: 2026-06-08
status: "published"
illustrative: false

atlas:
  hope: { pos: 0.12, lens: "10,000-year lens" }
  despair: { pos: 0.68, lens: "since 2020" }

caveats:
  - "“Violence” here means mostly <b>direct lethal violence</b> — homicide and war dead. Coercion, structural harm, and much violence against women, especially inside the home, sit outside these lethal-violence curves."
  - "Pre-1900 numbers are <b>regional and sparse</b>. The deep arc is reconstructed from European records and archaeology — reliable in direction, rough in level."
  - "Every chart here runs on <b>real ingested data</b> from openly-licensed sources (Our World in Data, UCDP, the World Bank, UNHCR, SIPRI), with the source, data package, and lineage downloadable under each figure. The evidence-panel overview up top — the hero curve and the four small signal sparklines — is a hand-composited orientation graphic, not a single measured series."
  - "The composite verdict is an <b>editorial</b> reading of the signals, not a computed index. Full method below."

evidence:
  heroLabel: "Violent deaths / 100k"
  hero: [[-8000,520],[-5000,470],[-3000,360],[-1000,300],[0,255],[800,235],[1300,205],[1500,170],[1700,130],[1820,95],[1870,60],[1900,42],[1914,205],[1918,120],[1929,55],[1939,255],[1945,90],[1950,38],[1970,22],[1990,17],[2005,11],[2011,8],[2018,7],[2020,11],[2022,33],[2024,29]]
  windows:
    - { lab: "Deep history", range: "8000 BCE — 2024", from: -8000, to: 2024, verdict: "Yes", temp: "cool" }
    - { lab: "Since 1900", range: "1900 — 2024", from: 1900, to: 2024, verdict: "Mostly", temp: "cool" }
    - { lab: "Since 2020", range: "2018 — 2024", from: 2018, to: 2024, verdict: "No", temp: "warm" }
    - { lab: "A lived day", range: "right now", from: 2022, to: 2024, verdict: "No", temp: "warm" }
  readout: "Zoom out to the millennium and the story is clear: homicide in Europe fell from about 25 per 100,000 people in 1250 to under 1 today. Zoom in to the last few years and the picture flips: conflict deaths and nuclear threats are rising, and the global decline of the past century is stalling."
  signals:
    - { fig: "FIG. 2", name: "Battle deaths", unit: "worldwide / year", badUp: true, data: [[1946,140],[1950,498000],[1970,300000],[1990,75000],[2005,28000],[2018,52000],[2022,120000],[2024,76000]] }
    - { fig: "FIG. 3", name: "Forcibly displaced", unit: "millions of people", badUp: true, data: [[1951,2],[1980,8],[2000,16],[2011,38],[2018,70],[2020,82],[2022,103],[2024,120]] }
    - { fig: "FIG. 4", name: "Homicide rate", unit: "per 100,000 / year", badUp: true, data: [[1300,40],[1500,30],[1800,15],[1900,8],[1950,7],[2000,6],[2018,5.4],[2024,5.0]] }
    - { fig: "FIG. 5", name: "Nuclear warheads", unit: "thousands, worldwide", badUp: true, data: [[1945,0],[1965,38],[1986,70],[2000,33],[2015,15],[2024,12.1]] }
  recentFrom: 2018
  recentTo: 2024
  recentVerdict: "No"
  recentTemp: "warm"
  synthesis: "Battle deaths, active conflicts, displacement, and military spending have all turned upward at once, which is what makes the recent pattern look like the long peace fraying rather than a single bad year."
  vantageNote: "A calm world average tells you nothing about a street in Khartoum today, where war has pushed violent death far above anything the global line would suggest."

movements:
  - eyebrow: "The long arc"
    fig: "FIG. 6"
    question: "Over centuries, has everyday violence actually fallen?"
    claim: "Homicide has fallen for seven centuries."
    dropCap: true
    explainer: "In a medieval town of forty thousand, ten people might be murdered in an ordinary year, and in the worst decades nearer fourteen. A town that size today could go three or four years between killings. A medieval European was something like thirty-five times more likely than you to die at another's hand — a gap so wide it is less a number than a different climate of life, one in which sudden violence was part of the weather.\n\nWhat closed it was not a change in the human heart but in who was allowed to answer an insult. Over centuries, kings and courts took the settling of scores out of private hands; the feud and the duel gave way to the magistrate, and killing a rival stopped being a point of honour and became a crime you could hang for. That is how Manuel Eisner, the criminologist whose court records run beneath this chart, reads the long descent: fewer men reaching for a blade, more of them reaching for the law. The small rise since its low around 1950 is the reminder underneath it all — this was hard-won, and it is reversible, never a law of nature."
    sidenote: { mark: "a", text: "Pre-modern figures come from coroners’ rolls and court archives — trustworthy in their <em>direction</em>, rough in their absolute level." }
    captionLeft: "<b>Homicides per 100,000 / year</b> · Western Europe (mean of recorded countries)"
    captionRight: "1250 — 2023"
    source: "Source · Our World in Data — Eisner (2003) & WHO Mortality Database · CC BY 4.0"
    chart:
      id: "m1"
      dataRef: "homicide-western-europe"
      ymax: 40
      yTicks: [0,10,20,30,40]
      xTicks: [1300,1500,1700,1900,2020]
      annots: [{ x: 1375, y: 34.4, label: "the medieval peak" }, { x: 1950, y: 0.5, label: "a postwar low" }]
      series:
        - { name: "Homicide", color: "hope", data: [[1300,41],[1500,32],[1700,11],[1900,3.2],[2020,1.0]] }
    take:
      hope: "The deadliest everyday threat our ancestors lived with has all but vanished from modern life."
      despair: "This clean line is European; most of the world has no record this deep, and the global rate has nudged up since 1950."
      confusion: "Old counts come from coroners and court rolls; the direction is solid, but the exact numbers are not."
  - eyebrow: "The long arc"
    fig: "FIG. 7"
    question: "Across the centuries, has war grown more or less deadly?"
    claim: "War's deadliest century is the one we just left."
    dropCap: true
    explainer: "Measured against the number of people alive, the twentieth century was the most violent in six hundred years of record. The two world wars drove the global death rate from armed conflict to a peak in 1941, over 300 deaths a year for every 100,000 people, a level with no rival going back to 1400. Even the wars of the 2020s have pushed today's rate only to around two.\n\nThen it broke the other way. After 1945 the rate collapsed and stayed low for the rest of the century, the long stretch historians call the Long Peace: no war between the great powers, and nothing close to the world wars' toll. The line is two stories at once. War became, for a while, more industrial and more lethal than ever, and then more avoided than ever. Which of those is the real trend is what the last few years are testing. The line stops in 2024, but the story has not: Ukraine pushed the rate sharply upward in 2022, and the wars still burning in 2025, in Sudan, Gaza, and the Sahel, have held it well above the lull of the 2000s. The charts that follow carry that recent toll in full."
    captionLeft: "<b>Death rate in armed conflict</b> · per 100,000 people, worldwide"
    sidenote: { mark: "b", text: "The deep history (to 2000) is Brecke's historical reconstruction; from 2001 the line continues on UCDP's modern count. Two sources, one measure — joined where they meet." }
    captionRight: "1400 — 2024"
    source: "Source · Our World in Data — UCDP, Brecke & PRIO · CC BY 4.0"
    chart:
      id: "m_warrate"
      dataRef: "conflict-death-rate-world"
      ymax: 360
      yTicks: [0,100,200,300]
      xTicks: [1400,1600,1800,1941,2024]
      annots: [{ x: 1800, y: 34, label: "Napoleonic Wars" }, { x: 1917, y: 248, label: "First World War" }, { x: 1941, y: 334, label: "Second World War" }]
      series:
        - { name: "War deaths", color: "despair", data: [[1400,0.8],[1800,34],[1941,334],[2000,1.2]] }
    take:
      hope: "Since 1945 the per-capita toll of war has stayed a fraction of what the world wars exacted."
      despair: "The bloodiest year on this six-century chart is within living memory, and the recent line is rising."
      confusion: "Per-capita rates flatten the deep past, where one local war could devastate a region while the world average stayed low."
  - eyebrow: "The break"
    fig: "FIG. 8"
    question: "Are the world’s wars killing fewer people?"
    claim: "War deaths fell far below their Cold-War peaks — then turned back up."
    dropCap: true
    explainer: "In 1950, about half a million people died in battle, most of them in the Korean War. The toll then fell for half a century, down to roughly twelve thousand by 2005, a forty-fold drop that looked like proof the world had left mass warfare behind.\n\nThat fall had a cause worth naming. After 1945 the great powers stopped fighting each other head-on, held back partly by the fear of nuclear weapons, and the wars that remained were mostly smaller civil and proxy conflicts. What the right of the chart shows is that arrangement straining: Syria, then Ethiopia's Tigray war, then Russia's invasion of Ukraine and the war in Gaza have pushed the annual toll back above a hundred thousand. One thing the line hides is that it counts only deaths in combat, not the larger numbers who die from the hunger and disease that war drags behind it."
    sidenote: { mark: "c", text: "Fig. 2 divided the dead by the living so centuries could be compared. From here the lines count <em>bodies</em>, not rates — and since the world's population keeps growing, a flat line in bodies is a falling line in risk." }
    captionLeft: "<b>Battle-related deaths</b> · worldwide / year"
    captionRight: "1946 — 2024"
    source: "Source · Our World in Data — UCDP / PRIO · CC BY 4.0"
    chart:
      id: "m4"
      dataRef: "battle-deaths-world"
      ymax: 600000
      yTicks: [0,200000,400000,600000]
      xTicks: [1950,1970,1990,2010,2024]
      annots: [{ x: 1950, y: 550676, label: "Korean War" }, { x: 1971, y: 258085, label: "Vietnam War" }, { x: 2022, y: 276893, label: "Ukraine" }]
      series:
        - { name: "Battle deaths", color: "despair", data: [[1950,550676],[1970,300000],[1990,75000],[2005,28000],[2024,128439]] }
    take:
      hope: "For most of the last eighty years, the global toll of war has fallen, and even today's number is barely a quarter of the Cold War peak."
      despair: "The direction has reversed, and no one can say whether the new wars will burn out or keep climbing."
      confusion: "Battle-death counts miss the far larger toll of displacement, hunger, and disease that wars cause — so the full human cost may be rising even when the fighting shrinks."
  - eyebrow: "The break"
    fig: "FIG. 9"
    question: "How much did the last five years actually undo?"
    claim: "Three wars reversed two decades of progress."
    explainer: "In 2010, about 21,000 people died in the world's wars. Then came Syria, Yemen, Ethiopia, Ukraine, and Gaza. By 2022 the annual toll had hit 276,893, and even after easing it sat above 128,000 in 2024. That is still well short of the 550,000 killed in 1950, but the line on this zoomed-in view climbs more than tenfold in a decade. The long decline historians celebrate is real; these last years show how fast it can be undone."
    captionLeft: "<b>Battle deaths</b> · worldwide / year (recent)"
    captionRight: "2010 — 2024"
    source: "Source · Our World in Data — UCDP / PRIO · CC BY 4.0 · recent zoom of Fig. 3"
    chart:
      id: "m7"
      dataRef: "battle-deaths-world"
      ymax: 300000
      x0: 2010
      x1: 2024
      yTicks: [0,100000,200000,300000]
      xTicks: [2010,2015,2020,2024]
      series:
        - { name: "Battle deaths", color: "despair", data: [[2010,21088],[2014,115972],[2020,73228],[2022,276893],[2024,128439]] }
    take:
      hope: "The 2024 figure is still below the Cold War average, and most of the world remains far more peaceful than it was."
      despair: "Three wars — Syria, Ukraine, and Gaza — account for most of the rise, and none shows signs of ending soon."
      confusion: "How much of the post-2005 rise reflects better data collection and counting, not more actual killing."
  - eyebrow: "The break"
    fig: "FIG. 10"
    question: "If deaths fell, why does the world feel more violent?"
    claim: "There are more active conflicts now than at any point in the record."
    explainer: "In 2010 the world had 31 state-based conflicts running, the fewest in the modern record. By 2024 it had 61, the most in the thirty-six years anyone has counted this way; the number nearly doubled even through stretches when the death toll was falling.\n\nTwo things drive the multiplication. Insurgencies spread: the jihadist war that began in Mali in 2012 now burns across its neighbours, and every border it crosses adds another conflict to the ledger. And outside powers keep joining other people's civil wars, with money, drones, and mercenaries, which is precisely what makes wars longer and harder to settle. So a falling death toll and a rising conflict count are not a contradiction. The world is not always fighting bigger wars. It is fighting more of them, in more places, with more hands in each."
    captionLeft: "<b>Active state-based conflicts</b> · worldwide"
    captionRight: "1989 — 2024"
    source: "Source · Our World in Data — UCDP / PRIO · CC BY 4.0"
    chart:
      id: "m6"
      dataRef: "active-conflicts-world"
      ymax: 70
      yTicks: [0,20,40,60]
      xTicks: [1990,2000,2010,2024]
      series:
        - { name: "Conflicts", color: "despair", data: [[1989,41],[2000,38],[2010,38],[2024,61]] }
    take:
      hope: "The rise is concentrated in a small number of countries, not spread everywhere — most of the world remains in a long peace."
      despair: "The number of active conflicts has doubled in fourteen years, and the record keeps breaking in the wrong direction."
      confusion: "Conflict counts treat a skirmish and a full war the same way, so the rise may be more about fragmentation than a true increase in killing."
  - eyebrow: "The break"
    fig: "FIG. 11"
    question: "If the death rate is falling, why are the human totals rising?"
    claim: "More people are refugees now than at any time on record."
    explainer: "In 1960, the world counted 150,000 refugees. Today the figure has crossed 30 million, a two-hundred-fold rise, and it has roughly tripled just since 2010. The surge is not mainly that the world grew more violent per person; it is that more states have shattered and more people have somewhere worse to flee. The death rate from violence has fallen. The number of people forced across a border to escape it has never been higher."
    sidenote: { mark: "d", text: "This counts <em>refugees</em> only — people who crossed a border. Add those displaced inside their own countries and the total runs far higher, past 100 million." }
    captionLeft: "<b>Refugees</b> · by country of origin, worldwide"
    captionRight: "1960 — 2024"
    source: "Source · Our World in Data — UNHCR Refugee Data Finder · CC BY 4.0"
    chart:
      id: "m8"
      dataRef: "refugees-world"
      ymax: 33000000
      yTicks: [0,10000000,20000000,30000000]
      xTicks: [1960,1980,2000,2024]
      annot: { x: 2022, label: "UKRAINE" }
      series:
        - { name: "Refugees", color: "despair", data: [[1960,150000],[1980,5000000],[2010,10166436],[2022,29000000],[2024,30685940]] }
    take:
      hope: "The refugee count is also a measure of survival: more people escape death and make it across a border to be counted."
      despair: "Thirty million is the highest number on record, and it is still rising."
      confusion: "How many of those 30 million would have died in earlier eras rather than fleeing is unknowable — the same violence now produces refugees where it once produced corpses."
  - eyebrow: "Who the average hides"
    fig: "FIG. 12"
    question: "Where are the world's wars actually killing people?"
    claim: "War never spreads evenly. It concentrates, and the place keeps moving."
    dropCap: true
    explainer: "Follow the deadliest place to fight a war and it keeps moving. In the mid-2010s it was the Middle East, where Syria and the war against ISIS killed more than 80,000 people in 2014 alone. Then the centre of gravity slid to Africa: Ethiopia's Tigray war helped make 2022 the deadliest year on this chart, with around 175,000 killed. By 2024 it had moved again, to Europe, where the trenches of Ukraine were taking more than 100,000 lives a year.\n\nThis is what a flat global line hides. The world's total can hold almost steady while underneath it the killing migrates from one region to the next, each taking its turn to carry most of the dead. For the people living through it there is no global average — only the war on their own doorstep, which in that moment is the entire world. The map of war is never blank; it just keeps redrawing where the darkest patch falls."
    captionLeft: "<b>Battle-related deaths</b> · by world region / year"
    captionRight: "1989 — 2025"
    source: "Source · UCDP Battle-Related Deaths Dataset · CC BY 4.0"
    chart:
      id: "m13"
      dataRefs: ["battle-deaths-middle-east","battle-deaths-africa","battle-deaths-asia","battle-deaths-europe"]
      ymax: 190000
      yTicks: [0,50000,100000,150000]
      xTicks: [1989,2000,2010,2024]
      series:
        - { name: "Middle East", color: "ochre", data: [[2014,83685]] }
        - { name: "Africa", color: "despair", data: [[2022,175302]] }
        - { name: "Asia", color: "uncertain", data: [[2021,37881]] }
        - { name: "Europe", color: "hope", data: [[2024,102201]] }
    take:
      hope: "No region stays the epicentre for long; the worst place to be is never fixed."
      despair: "There is always an epicentre, and the most recent one is among the deadliest in the whole record."
      confusion: "Where a war's deaths land depends on how its region is coded; a conflict that spills across borders can sit in one bucket or be split."
  - eyebrow: "Who the average hides"
    fig: "FIG. 13"
    question: "What are the world's wars actually killing people right now?"
    claim: "A cluster of wars broke out in the 2020s, and most are still burning."
    dropCap: true
    explainer: "Name the deadliest wars of the decade and you have named most of the recent rise. Ethiopia's Tigray war was, for a moment in 2022, the bloodiest on earth: more than 160,000 people killed in a single year before a ceasefire ended it. Russia's invasion of Ukraine has been the most relentless, taking close to 100,000 lives a year since 2022 with no end in sight. Since 2023, Sudan's civil war and Israel's war in Gaza have each killed tens of thousands more, while a jihadist insurgency keeps spreading across the Sahel.\n\nWhat makes this stretch dangerous is not any single war but the pile-up. For two decades after the Cold War the world rarely had more than one conflict killing at this scale; now several burn at once, on three continents, and the chart names only the largest. Beyond it, eastern Congo is sliding back toward full-scale war, Myanmar's junta is losing a civil war almost no one watches, and al-Shabaab still bleeds Somalia. A few are winding down: Syria's long war collapsed when Assad fell in late 2024, and the Israel-Iran strikes of 2025 flared and then stopped short of the regional war everyone feared. The through-line is a world with too many fires lit at once, and not enough being put out."
    sidenote: { mark: "e", text: "Gaza's line here is UCDP's count of <em>battle deaths</em>. The UN humanitarian office (OCHA) and Gaza's Health Ministry, which count <em>all</em> conflict-related deaths, report a far higher toll. Different method, not a different war — and wartime figures are revised upward later. Read the line as a floor." }
    captionLeft: "<b>Battle deaths</b> · selected active conflicts / year"
    captionRight: "2018 — 2025"
    source: "Source · UCDP Battle-Related Deaths Dataset · CC BY 4.0"
    chart:
      id: "m_currentwars"
      dataRefs: ["war-ukraine","war-ethiopia","war-israel","war-sudan","war-burkina-faso"]
      ymax: 170000
      x0: 2018
      x1: 2025
      yTicks: [0,50000,100000,150000]
      xTicks: [2018,2020,2022,2024]
      series:
        - { name: "Ukraine", color: "despair", data: [[2022,99473],[2025,94741]] }
        - { name: "Ethiopia", color: "ochre", data: [[2022,163219],[2025,4312]] }
        - { name: "Israel & Gaza", color: "uncertain", data: [[2023,26928],[2025,14771]] }
        - { name: "Sudan", color: "hope", data: [[2023,11760],[2025,12269]] }
        - { name: "Burkina Faso", color: "stone", data: [[2018,79],[2023,4806],[2025,3031]] }
    take:
      hope: "Several of these wars have already burned out; Tigray's ceasefire took the deadliest of them off the map within a year."
      despair: "Not since the Cold War have so many large wars run at once, and the two biggest show no sign of ending."
      confusion: "Battle-death counts in active wars are contested and usually revised upward later; these numbers are likely floors."
  - eyebrow: "Who the average hides"
    fig: "FIG. 14"
    question: "What about the wars no state is fighting?"
    claim: "Between war and murder sits a violence the categories barely name."
    explainer: "When two cartels fight over a smuggling route, no state is at war and no murder is ordinary. Researchers call it non-state conflict: organised armed groups killing each other, with the government on neither side. In 1989 this kind of fighting took about 4,200 lives worldwide. In 2017, its worst recorded year, it took just over 31,000, much of it in Mexico's cartel wars and in militia fighting across Africa.\n\nIt is the violence our categories are built to miss. Too organised to sit among ordinary murders, too stateless to count as war, it fell between the lines of both for decades, which is why this chart starts only in 1989. The toll has eased since the peak, to around 14,500 last year, but it never goes quiet. Whether the world is at peace depends a great deal on whether you count the wars nobody declares."
    captionLeft: "<b>Deaths in non-state conflict</b> · worldwide / year"
    captionRight: "1989 — 2025"
    source: "Source · UCDP Non-State Conflict Dataset · CC BY 4.0"
    chart:
      id: "m_nonstate"
      dataRef: "nonstate-deaths-world"
      ymax: 35000
      yTicks: [0,10000,20000,30000]
      xTicks: [1989,2000,2010,2025]
      annots: [{ x: 2017, y: 31051, label: "the 2017 peak" }]
      series:
        - { name: "Non-state deaths", color: "despair", data: [[1989,4170],[2005,2192],[2017,31051],[2025,14483]] }
    take:
      hope: "Even at its worst, this fighting kills a fraction of what state wars take, and the toll has fallen by more than half since 2017."
      despair: "The deadliest years in this record are recent ones, and the gangs and militias doing the killing answer to no peace treaty."
      confusion: "Whether a body lands in this column or in the homicide column is a coder's judgment call, made in places where counting anything is hard."
  - eyebrow: "Who the average hides"
    fig: "FIG. 15"
    question: "Is “the homicide rate” even a single number?"
    claim: "Where you live changes your odds more than anything else about you."
    explainer: "Wars cluster in a handful of places, and so does ordinary murder. There is no such thing as the homicide rate. In Latin America and the Caribbean, around twenty people per 100,000 are murdered every year; in East Asia and the Pacific, fewer than one. That is a twenty-fold gap between whole regions, and country to country it stretches past a hundredfold. Your odds of being killed are set more by where you were born than by almost anything else about you.\n\nThese are recent numbers, and they cut against the comfortable global average of about five. Latin America's toll is driven by organised crime and overwhelmed courts, not war; Sub-Saharan Africa sits high too, while Europe and East Asia have pushed murder to the edge of statistical noise. The single world figure everyone quotes is a fiction no one actually lives in. It averages Caracas into Tokyo, and so describes neither."
    captionLeft: "<b>Homicide rate per 100,000</b> · by world region"
    captionRight: "2010 — 2023"
    source: "Source · UNODC, via the World Bank · CC BY 4.0"
    chart:
      id: "m3"
      dataRefs: ["homicide-rate-lcn","homicide-rate-ssf","homicide-rate-wld","homicide-rate-ecs","homicide-rate-eas"]
      ymax: 26
      x0: 2010
      x1: 2023
      yTicks: [0,10,20]
      xTicks: [2010,2015,2020,2023]
      series:
        - { name: "Latin America", color: "despair", data: [[2010,24],[2023,19.7]] }
        - { name: "Sub-Saharan", color: "ochre", data: [[2010,14],[2023,12.2]] }
        - { name: "World", color: "uncertain", data: [[2010,6],[2023,5.2]] }
        - { name: "Europe & C. Asia", color: "stone", data: [[2010,3.6],[2023,2.1]] }
        - { name: "East Asia", color: "hope", data: [[2010,1],[2023,0.8]] }
    take:
      hope: "Several countries that were among the most violent a generation ago have brought murder down to European levels; the gap is not fixed."
      despair: "Where you are born still decides, more than almost anything, whether you will be killed by another person."
      confusion: "Part of the gap is real and part is policing and counting, and the worst-affected places are often where the data is weakest."
  - eyebrow: "Who the average hides"
    fig: "FIG. 16"
    question: "Who does the remaining violence actually kill?"
    claim: "The world's murder victims are overwhelmingly men."
    explainer: "The average homicide rate hides who is dying. Worldwide, men are killed at about four times the rate of women: roughly eight per 100,000 against two. Most of those men are young, and most are killed by other men, in fights, feuds, and the business of organised crime. The single global figure averages a relatively safe group and a far more dangerous one into a number that fits neither.\n\nThis is not the whole of gendered violence, only its lethal, public part. Women are far more likely to be killed at home, by a partner or a relative, than by a stranger in the street, a kind of killing the headline rate barely distinguishes. So the chart says something true and narrow: in the open, among strangers, it is mostly men who kill and men who die. The violence aimed at women tends to happen behind a door the data struggles to see."
    captionLeft: "<b>Homicide rate per 100,000</b> · by sex, worldwide"
    captionRight: "2000 — 2023"
    source: "Source · Our World in Data — WHO Mortality Database & UNODC · CC BY 4.0"
    chart:
      id: "m_homsex"
      dataRefs: ["homicide-rate-male-world","homicide-rate-female-world"]
      ymax: 12
      yTicks: [0,4,8,12]
      xTicks: [2000,2010,2020]
      series:
        - { name: "Men", color: "despair", data: [[2000,11],[2023,8.3]] }
        - { name: "Women", color: "hope", data: [[2000,2.8],[2023,2.1]] }
    take:
      hope: "Knowing exactly who is most at risk, young men in specific places, is what makes the violence preventable."
      despair: "For young men in the most dangerous cities, homicide is not a rare event but a leading way to die."
      confusion: "The street/home split is blurry; a killing recorded as a homicide can hide a long history of domestic abuse."
  - eyebrow: "The state's two hands"
    fig: "FIG. 17"
    question: "Has humanity stepped back from the ultimate violence?"
    claim: "The world’s nuclear stockpile is a fifth of its Cold-War peak."
    dropCap: true
    explainer: "In 1945 the world held six nuclear warheads, all American. By 1986 the two superpowers had built 70,374 between them, enough to end civilization several times over. Since then the stockpile has fallen to roughly 12,000, about a fifth of the peak.\n\nThis is the largest deliberate disarmament in history, and it had names and dates: the end of the Cold War, and a run of arms-control treaties from the 1987 INF agreement to START, under which the United States and Russia cut the arsenals that make up most of the world's warheads. The reduction was political, not technological; the weapons never became less terrible. And it has stalled. Twelve thousand warheads is still enough to kill hundreds of millions, and what remains is being modernised rather than retired."
    captionLeft: "<b>Nuclear warheads in stockpiles</b> · worldwide"
    captionRight: "1945 — 2026"
    source: "Source · Our World in Data — Federation of American Scientists · CC BY 4.0"
    chart:
      id: "m9"
      dataRef: "nuclear-warheads-world"
      ymax: 75000
      yTicks: [0,25000,50000,75000]
      xTicks: [1945,1970,1986,2010,2026]
      annots: [{ x: 1986, y: 70374, label: "Cold-War peak" }]
      series:
        - { name: "Warheads", color: "hope", data: [[1945,6],[1986,70374],[2000,33000],[2026,12187]] }
    take:
      hope: "The peak is behind us, and the trend has been downward for nearly forty years."
      despair: "Twelve thousand warheads is still a number with no human scale—it only takes a few hundred to cause a nuclear winter."
      confusion: "How many of the remaining warheads are truly operational, and how quickly could the stockpile be rebuilt if treaties unravel?"
  - eyebrow: "The state's two hands"
    fig: "FIG. 18"
    question: "Is the world disarming, or just rearming differently?"
    claim: "Even as warheads fell, military spending hit an all-time high."
    explainer: "In 1998, the world spent about 1.2 trillion dollars on armies, navies, and air forces. That was the low point after the Cold War. By 2025, the bill had climbed past 2.7 trillion, an all-time high. Warhead counts fell, treaties were signed, but the money never stopped flowing. The planet is not disarming; it is spending more than ever, just on different things — drones, cyber, special forces, the quiet machinery of modern conflict."
    captionLeft: "<b>Military expenditure</b> · worldwide · constant 2024 US$"
    captionRight: "1988 — 2025"
    source: "Source · Our World in Data — SIPRI · CC BY 4.0"
    chart:
      id: "m10"
      dataRef: "military-spending-world"
      ymax: 3000000000000
      yTicks: [0,1000000000000,2000000000000,3000000000000]
      xTicks: [1990,2000,2010,2020,2025]
      series:
        - { name: "Spending", color: "despair", data: [[1988,1760000000000],[1998,1100000000000],[2010,2200000000000],[2025,2771000000000]] }
    take:
      hope: "The peak spending comes from richer countries, not from the places where people are actually dying."
      despair: "Nearly three trillion dollars a year buys a lot of violence, even if the weapons look different than they used to."
      confusion: "Whether this spending buys more security or just more fear depends on who is spending it and why, and the data alone cannot say."
  - eyebrow: "The state's two hands"
    fig: "FIG. 19"
    question: "What about the violence aimed at civilians on purpose?"
    claim: "Sometimes the killing has no battlefield."
    explainer: "In a hundred days in 1994, close to 780,000 people were killed in Rwanda — not in battle, but hunted down, mostly with machetes, for belonging to the wrong group. That single year towers over everything else on this chart. One-sided violence is the deliberate killing of people who cannot fight back, and at its extreme it is the arithmetic of genocide.\n\nThis kind of killing has no front line and no symmetry: a state or a militia on one side, unarmed civilians on the other. In most years the global toll runs in the low tens of thousands, far beneath the Rwandan peak, and yet it never settles at zero. It rises whenever a government turns on its own people, or the losing side of a war is made to pay, and it has climbed sharply again these last two years. The capacity for massacre did not die in the twentieth century. It only went quiet."
    captionLeft: "<b>Deaths from one-sided violence</b> · worldwide / year"
    captionRight: "1989 — 2025"
    source: "Source · UCDP One-sided Violence Dataset · CC BY 4.0"
    chart:
      id: "m7b"
      dataRef: "onesided-deaths-world"
      ymax: 800000
      yTicks: [0,200000,400000,600000,800000]
      xTicks: [1989,1994,2005,2015,2025]
      annot: { x: 1994, label: "RWANDA" }
      series:
        - { name: "One-sided deaths", color: "despair", data: [[1989,20000],[1994,779685],[2005,20000],[2015,15000],[2025,76453]] }
    take:
      hope: "The genocidal scale of 1994 has not been matched since; the worst case has become the rare case."
      despair: "It never falls to zero, and it has climbed sharply again in the last two years."
      confusion: "The line counts only the deaths that get documented; in the chaos of a massacre the true number is often unknowable."
  - eyebrow: "What we fear, what we miss"
    fig: "FIG. 20"
    question: "Does the violence we fear most match what actually kills us?"
    claim: "Terrorism kills a rounding error of the violent dead — and rules the fear."
    explainer: "In 1970, 174 people died in terrorist attacks worldwide. In 2014, the deadliest year on record, the toll was 44,581. That sounds like a lot until you set it beside the rest of this article: the wars of that same year killed more than twice as many people, and everyday homicide quietly takes more lives than either. Terrorism dominates headlines, security budgets, and the fear of violence, yet for any one person the risk is vanishingly small. The gap between what we fear and what actually kills us is its own kind of damage, the one that warps how we spend money, attention, and freedom."
    captionLeft: "<b>Terrorism deaths</b> · worldwide / year"
    captionRight: "1970 — 2021"
    source: "Source · Our World in Data — Global Terrorism Database (START) · CC BY 4.0"
    chart:
      id: "m18"
      dataRef: "terrorism-deaths-world"
      ymax: 48000
      yTicks: [0,15000,30000,45000]
      xTicks: [1970,1985,2001,2014,2021]
      annot: { x: 2001, label: "9/11" }
      series:
        - { name: "Terrorism deaths", color: "ochre", data: [[1970,174],[2001,7700],[2014,44581],[2021,11528]] }
    take:
      hope: "Even terrorism's worst year on record killed fewer than half as many people as the wars of that same year; for any one person, the risk is vanishingly small."
      despair: "The trend is upward: 174 deaths in 1970 became 11,528 in 2021, and the fear it sows distorts policy and public life far beyond the body count."
      confusion: "How many of those deaths are counted as terrorism depends on who is defining the term — one state's terrorist is another's freedom fighter, and the data carries that political weight."
pullQuote:
  text: "Humanity is not a line chart. A single average can bury a million tragedies."
  cite: "Progress and catastrophe coexist"

lenses:
  - { who: "The historian", confidence: "high", hope: "The organized state slowly crowded out the raid, the feud, and the duel.", despair: "The same state perfected industrial war when it chose to wage it." }
  - { who: "The statistician", confidence: "medium", hope: "Per-capita death rates sit far below their historical band.", despair: "The denominator hides the dead; rare mega-wars dominate true risk." }
  - { who: "The criminologist", confidence: "medium", hope: "Homicide is concentrated, which means it is preventable where we focus.", despair: "Most violence against women never reaches a statistic at all." }
  - { who: "Someone living it", confidence: "absolute", despair: "A global average is no comfort under a drone. My street is the only dataset that matters." }
  - { who: "The forecaster", confidence: "low", hope: "The nuclear taboo and economic entanglement still raise the cost of total war.", despair: "Cheap drones, autonomy, and disinformation lower the cost of mass harm." }

hopeCase: "The long view is the real story. Homicide has fallen more than thirty-fold over the centuries, and nuclear arsenals, though still enormous, are down to about a fifth of their Cold-War peak. The forces that drove violence down, from stronger states to economic growth to a hardening norm against killing, have not vanished. A bad five years does not erase a better five hundred."
despairCase: "The recent upturn in battle deaths and the reversal of nuclear disarmament show that the peace is fragile and reversible. The same forces that brought violence down could unwind in a generation, and the global average hides the places where violence is already catastrophic."
whatWouldChangeIt: "A sustained rise in homicide rates across multiple world regions over a decade would challenge the hope narrative. A verified, verifiable reduction in nuclear warheads below 5,000 and a decade of declining battle deaths would weaken the despair case."

methodology:
  - { term: "Every figure is real", detail: "Every chart runs on data ingested through our open pipeline, with downloadable source, data package, and lineage files under each. The only hand-made element is the evidence-panel overview at the top (the hero curve and the four signal sparklines), a composited orientation graphic flagged as such." }
  - { term: "Derived totals", detail: "Where a source has no single “World” line, we build one and record the recipe: battle deaths and active conflicts are <b>summed across conflict types</b>; refugees are <b>summed across every country of origin</b>. The recipe travels with each chart’s downloadable lineage." }
  - { term: "Source & vintage", detail: "Each real series is pinned to a snapshot at a fixed vintage with a recorded checksum. The vintage and the source’s own revision travel with the figure’s metadata." }
  - { term: "Transformations", detail: "Counts are reported as the source provides them, or converted to <b>rates per 100,000</b> using mid-year population. Currencies are in constant 2024 US$. No series is re-based, capped, or seasonally adjusted." }
  - { term: "Display smoothing", detail: "Lines use <b>monotone-cubic interpolation</b> purely for legibility. It is cosmetic — it never moves, adds, or hides a data point." }
  - { term: "Re-host vs. link-only", detail: "We re-host only openly-licensed data (CC BY / CC0). Some sources — UNODC homicide, IHME, Amnesty, the World Values Survey — restrict redistribution, so we <b>cite and link</b> them rather than re-publishing the numbers." }
  - { term: "The verdict", detail: "Each signal is classed improving or worsening by the sign of its change across the visible window. The headline verdict is an <b>editorial</b> reading of those signals — deliberately <b>not</b> a single computed index." }

sources:
  - { id: "s1", name: "Our World in Data — War & Peace", url: "https://ourworldindata.org/war-and-peace", license: "CC BY 4.0", vintage: "2026-06", note: "Keystone aggregator; long-run homicide after Eisner (2003)." }
  - { id: "s2", name: "Uppsala Conflict Data Program (UCDP / PRIO)", url: "https://ucdp.uu.se", license: "CC BY 4.0", vintage: "2026", note: "Battle-related deaths, active conflicts, one-sided violence." }
  - { id: "s3", name: "Federation of American Scientists — Nuclear Notebook", url: "https://fas.org/initiative/nuclear-information-project/", license: "CC BY 4.0 (via OWID)", vintage: "2026", note: "Nuclear warhead stockpile estimates." }
  - { id: "s4", name: "Stockholm International Peace Research Institute (SIPRI)", url: "https://www.sipri.org/databases/milex", license: "CC BY 4.0 (via OWID)", vintage: "2026", note: "Global military expenditure, constant USD." }
  - { id: "s5", name: "Global Terrorism Database (START, U. Maryland)", url: "https://www.start.umd.edu/gtd/", license: "CC BY 4.0 (via OWID)", vintage: "2026", note: "Deaths from terrorism worldwide, 1970–2021." }
  - { id: "s6", name: "UNODC Global Study on Homicide", url: "https://www.unodc.org/unodc/en/data-and-analysis/global-study-on-homicide.html", license: "Link-only (non-redistributable)", vintage: "2025", note: "Homicide rates by country and region." }
  - { id: "s7", name: "UNHCR Refugee Data Finder", url: "https://www.unhcr.org/refugee-statistics/", license: "CC BY 4.0 (via OWID)", vintage: "2026", note: "Refugees by country of origin; world total summed across countries." }
  - { id: "s8", name: "World Bank — World Development Indicators", url: "https://data.worldbank.org/indicator/VC.IHR.PSRC.P5", license: "CC BY 4.0", vintage: "2026", note: "Homicide rate by world region (re-hosts UNODC under an open licence)." }
  - { id: "s9", name: "WHO Mortality Database / UNODC", url: "https://platform.who.int/mortality", license: "CC BY 4.0 (via OWID)", vintage: "2026", note: "Homicide rate by sex, World." }
  - { id: "s10", name: "UN OCHA — occupied Palestinian territory", url: "https://www.ochaopt.org/data/casualties", license: "Cited (not re-hosted)", vintage: "2026", note: "Authoritative count of all conflict-related deaths in Gaza and the West Bank; the fuller toll behind the battle-death figure." }

revisions:
  - { date: "2026-06-10", text: "Closed the tier-A gaps from the audit: a new movement on non-state conflict (cartels and militias — a type of violence the war/murder categories miss), the Europe & Central Asia line on the regional homicide chart, and Burkina Faso on the named-wars chart so the Sahel the prose describes is finally drawn. Chart labels now dodge collisions, and a quiet fifth series colour (stone) joins the palette." }
  - { date: "2026-06-10", text: "Restructured into five acts by magnification — the long arc, the break, who the average hides, the state's two hands, what we fear — so the charts read as one argument. Rewrote the active-conflicts explainer to name the mechanism behind the rise, marked the rates-to-bodies seam at Fig. 3, and retied the terrorism and spending takes to series charted in this article." }
  - { date: "2026-06-10", text: "Wired three more real charts — active conflicts (summed conflict types), refugees (summed across origins), and the recent-war zoom. Corrected the battle-deaths total, which had been counting interstate deaths only and undercounting the Syrian and Ukrainian wars." }
  - { date: "2026-06-09", text: "Rebuilt from scratch as the rigorous flagship: five vantages, twenty movements. Wired five real series (homicide, battle deaths, nuclear stockpiles, military spending, terrorism) through the open pipeline; remaining charts illustrative pending ingestion." }
  - { date: "2026-06-08", text: "Original three-movement draft (illustrative)." }
---

### Still lost? Read this.

If you had to live in any century before your own, pick the one you're in. The chance that someone kills you has fallen, century after century, for a thousand years. A medieval European was about thirty-five times more likely to be murdered than you are. Your ancestors lived with a risk that would feel like a war zone to you.

But here is the catch. That long, beautiful decline mostly measures one kind of violence: men killing other men in public, in fights and feuds and raids. The violence that happens behind a locked door, against women and children and enslaved people, barely shows up on that chart because for most of history nobody thought to count it. And the last five years have broken the trend. The world got more violent, not less, for the first time in living memory.

So the honest answer is both. Over the long arc of history, we are astonishingly less violent than our ancestors. Over the last five years, we are more violent than we were. And for whole categories of cruelty, we never had a chart at all. The one thing you can say at dinner, and be right: the story of violence is not one line. It is a handful of different stories, and they do not all go the same direction.

