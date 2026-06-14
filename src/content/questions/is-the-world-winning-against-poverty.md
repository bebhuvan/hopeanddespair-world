---
question: "Is the world winning against poverty?"
dek: "The steepest fall in the history of need — and it stalled, climbed the wrong way up the income ladder, and pooled into Africa. Whether a tenth of humanity is poor or four-fifths of it depends on where you draw a line."
theme: "Poverty"
kickerNumber: "04"
verdict: "The great escape, half-finished and slowing"
order: 4
publishedAt: 2026-06-12
status: "published"
illustrative: false

atlas:
  hope: { pos: 0.14, lens: "the two-century arc" }
  despair: { pos: 0.7, lens: "the $8.30 line, since 2019" }

caveats:
  - "“Poverty” here is mostly <b>money poverty</b> — income or consumption set against an international line. The poverty that is not money (poor health, no schooling, no safety, no voice) shows up only where a separate index catches it."
  - "The international line is a <b>price, not a fact</b>. It converts every currency through purchasing-power estimates that are rebased every few years, which moves every number on these charts with nobody's actual life changing."
  - "Every chart runs on <b>real ingested data</b> — the World Bank's Poverty and Inequality Platform, the World Development Indicators, the World Inequality Database, the ILO, and the WHO/UNICEF water programme — with source, data package, and lineage downloadable under each figure. The evidence panel at the top is a hand-composited orientation graphic, not a single measured series."
  - "Years after a country's last household survey are <b>nowcasts</b> — model estimates, not counts. They are drawn here as the Bank publishes them; read the most recent points as projection, not observation."

evidence:
  heroLabel: "Living under $3 a day · % of the world"
  hero: [[1820,76],[1850,74],[1900,70],[1950,60],[1981,47.1],[1990,43.4],[2000,36.2],[2010,21],[2019,10.8],[2020,11.4],[2022,10.9],[2024,10.4],[2026,10]]
  windows:
    - { lab: "Two centuries", range: "1820 — 2026", from: 1820, to: 2026, verdict: "Yes", temp: "cool" }
    - { lab: "Postwar", range: "1950 — 2026", from: 1950, to: 2026, verdict: "Yes", temp: "cool" }
    - { lab: "This century", range: "2000 — 2026", from: 2000, to: 2026, verdict: "Mostly", temp: "cool" }
    - { lab: "Since 2019", range: "2019 — 2026", from: 2019, to: 2026, verdict: "Stalled", temp: "warm" }
  readout: "Stand back two hundred years and the answer is unambiguous: almost everyone was poor, and now most people are not. Stand close to the last few years and the line goes flat — the count of the extreme-poor has barely moved since 2019, and in Africa it is rising."
  signals:
    - { fig: "FIG. 2", name: "Extreme-poor, worldwide", unit: "millions of people", badUp: true, data: [[1981,2129],[1990,2301],[2000,2231],[2010,1469],[2019,837],[2022,870],[2024,847],[2026,826]] }
    - { fig: "FIG. 3", name: "Africa's poor", unit: "millions, Sub-Saharan", badUp: true, data: [[1981,231],[1990,321],[2000,425],[2010,442],[2019,500],[2022,562],[2024,582],[2026,587]] }
    - { fig: "FIG. 4", name: "Below the $8.30 line", unit: "% of the world", badUp: true, data: [[1981,69.5],[1990,70.4],[2000,70.6],[2010,60.2],[2019,49.6],[2022,48.3],[2026,44.4]] }
    - { fig: "FIG. 5", name: "Relative poverty", unit: "% of the world", badUp: true, data: [[1981,53.6],[1990,49.8],[2000,42.6],[2010,32],[2019,26.2],[2022,25.5],[2026,24.3]] }
  recentFrom: 2019
  recentTo: 2026
  recentVerdict: "Stalled"
  recentTemp: "warm"
  synthesis: "The world count of the extreme-poor stopped falling around 2019 and Africa's count kept rising, which is what turns a four-decade success into an open question about the next decade rather than a finished victory."
  vantageNote: "A global rate of one-in-ten is no description of a village in the Sahel, where the rate never fell below one-in-two and the number of poor keeps climbing year on year."

movements:
  - eyebrow: "The long ascent"
    fig: "FIG. 6"
    question: "Were our ancestors as poor as the poorest people alive today?"
    claim: "For all but the last two centuries, almost everyone was poor."
    dropCap: true
    explainer: "Go back far enough and the rich countries look like the poor ones look like everywhere else: a person produced in a year about what a subsistence farmer produces now. In 1820 the average human lived on the equivalent of a little over three dollars a day, and that figure had scarcely moved in a thousand years. Then, across a couple of centuries, world output per person multiplied roughly fifteen times over, to around forty-six dollars a day.\n\nWhat broke the long flat was industry — first in Britain, then across the West, much later in Asia — and it arrived in different places centuries apart. That is the catch hidden inside this clean rising curve. It is a world average, and for most of its length the average was pulled up by a handful of countries while the rest stayed close to where humanity had always been. The escape was real, but for a long time it belonged to very few."
    sidenote: { mark: "a", text: "Incomes here are Maddison's historical reconstruction in constant international dollars. Trustworthy in <em>shape</em> — the timing of the takeoff — rougher in the exact level of any single early year." }
    captionLeft: "<b>World GDP per person</b> · constant international $ / year"
    captionRight: "1820 — 2022"
    source: "Source · Our World in Data — Maddison Project Database · CC BY 4.0"
    chart:
      id: "m1"
      dataRef: "gdp-per-capita-maddison-world"
      ymax: 18000
      yTicks: [0,6000,12000,18000]
      xTicks: [1820,1900,1950,2000,2022]
      annots: [{ x: 1950, y: 3360, label: "postwar takeoff" }]
      series:
        - { name: "Income", color: "hope", data: [[1820,1128],[1900,2265],[1950,3360],[2000,9904],[2022,16677]] }
    take:
      hope: "Mass poverty was the normal condition of humanity for all of recorded history, and in two centuries we left it behind."
      despair: "The escape was wildly uneven — for most of this curve, the gains belonged to a few countries and bypassed the rest."
      confusion: "A single world average says nothing about who got rich and when; it blends the first industrial nations with the last and describes neither."
  - eyebrow: "The long ascent"
    fig: "FIG. 7"
    question: "And lately — is the average income still climbing?"
    claim: "Adjusted for inflation, the world is more than three times richer per person than in 1960."
    dropCap: false
    explainer: "Hold the measuring stick still — count in dollars of one fixed year — and the modern slice of that long arc comes into focus. The average person had about 3,700 of today's dollars to live on in 1960; by 2024 the figure was close to 11,900, a little more than three times as much. The climb is not smooth: you can read the 2008 financial crisis and the 2020 pandemic straight off the line, each a visible notch where the world economy shrank for a year before resuming.\n\nThis is the inflation-adjusted version of the figure most often quoted in plain dollars, and it sits lower than the curve above because it converts currencies at market exchange rates rather than by what money actually buys. The warning underneath it is the same one the rest of this article keeps returning to. An average is not a floor. The same growth that tripled the mean left the poorest region almost exactly where it began, which is why a rising world income and a stalled war on poverty can both be true."
    sidenote: { mark: "b", text: "Constant 2015 US$ at market exchange rates — the inflation-adjusted sibling of the “current US$” figure headlines usually cite. It reads lower than the purchasing-power curve above because a dollar stretches further in poorer countries than the exchange rate admits." }
    captionLeft: "<b>World GDP per person</b> · constant 2015 US$ / year"
    captionRight: "1960 — 2024"
    source: "Source · World Bank — World Development Indicators · CC BY 4.0"
    chart:
      id: "m1b"
      dataRef: "gdp-per-capita-world"
      ymax: 13000
      yTicks: [0,4000,8000,12000]
      xTicks: [1960,1980,2000,2024]
      annots: [{ x: 2009, y: 9005, label: "2008 crisis" }, { x: 2020, y: 10542, label: "the pandemic" }]
      series:
        - { name: "Income", color: "hope", data: [[1960,3664],[1980,5965],[2000,7859],[2024,11852]] }
    take:
      hope: "Even measured at market exchange rates, real income per person has more than tripled in two generations."
      despair: "An average is not a floor — the same tripling left the poorest region almost exactly where it started."
      confusion: "Market-rate dollars and purchasing-power dollars give different levels, so this line and the one above measure one idea on two rulers."
  - eyebrow: "The long ascent"
    fig: "FIG. 8"
    question: "How fast did the modern fall in poverty actually happen?"
    claim: "In forty years the share of humanity in extreme poverty fell by more than three quarters."
    dropCap: false
    explainer: "In 1981, measured against the line the World Bank now draws at three dollars a day, about 47 of every 100 people alive were extreme-poor. By 2024 it was close to 10. No previous span of human history moved the number that far that fast, and most of the distance was covered in a single generation between 1990 and 2015.\n\nThe engine was growth in Asia, which is the rest of this article waiting to be told. But the line on the right is the warning. The fall slowed after 2015, the pandemic pushed the rate back up in 2020, and since then it has crept rather than plunged. A curve that looked unstoppable for thirty years now looks like it is approaching something it cannot easily cross — the poverty that growth alone has never reached."
    sidenote: { mark: "b", text: "The $3.00 line is the 2021 update. Charts you may remember used $1.90 or $2.15 — the same idea repriced for inflation and new exchange-rate data, which is why the exact percentage shifts between vintages." }
    captionLeft: "<b>Share in extreme poverty</b> · under $3.00 a day, worldwide"
    captionRight: "1981 — 2026"
    source: "Source · World Bank — Poverty and Inequality Platform · CC BY 4.0"
    chart:
      id: "m2"
      dataRef: "poverty-rate-300-world"
      ymax: 50
      yTicks: [0,10,20,30,40,50]
      xTicks: [1981,1995,2010,2026]
      annots: [{ x: 2020, y: 11.41, label: "the pandemic" }]
      series:
        - { name: "Extreme poverty", color: "hope", data: [[1981,47.1],[1990,43.4],[2000,36.2],[2010,21],[2026,10]] }
    take:
      hope: "Roughly a billion people crossed out of extreme poverty in a single generation — the headline achievement of our age."
      despair: "The fall has stalled near a tenth of the world, and the last stretch is the one growth has never managed on its own."
      confusion: "The exact figure swings every time the line is repriced, so the precise percentage matters less than the shape."
  - eyebrow: "How many, really"
    fig: "FIG. 9"
    question: "How many people are poor — is that even a single number?"
    claim: "Move the line, and a tenth of the world becomes four in five."
    dropCap: true
    explainer: "Ask how many people are poor and the honest first answer is another question: poor by which line? At three dollars a day, about 11 of every 100 people qualified in 2022. Raise the line to $4.20 — a typical poverty line for a lower-middle-income country — and it is 21. Raise it again to $8.30, where many middle-income countries set theirs, and it is 48. Push it all the way to $30 a day, the line a rich country like the United Kingdom draws for its own citizens, and roughly four in every five people on Earth fall below it. Same planet, same year, four different headlines.\n\nNone of these lines is arbitrary, and none is the truth. The first three are the average of the national poverty lines that countries at each income level actually use, so the lowest tracks what the poorest countries call destitution and the highest tracks what a middle-income country calls getting by. The fourth is not a World Bank line at all — it is what a wealthy society considers the bottom, turned on the whole world as a thought experiment. Which one you quote decides whether the story is a near-finished triumph or a planet where most people are still scraping. The number is real. So is the choice behind it."
    captionLeft: "<b>Share below each poverty line</b> · % of the world"
    captionRight: "1981 — 2026"
    source: "Source · World Bank — Poverty and Inequality Platform · CC BY 4.0"
    chart:
      id: "m3"
      dataRefs: ["poverty-rate-3000-world","poverty-rate-830-world","poverty-rate-420-world","poverty-rate-300-world"]
      ymax: 100
      yTicks: [0,25,50,75,100]
      xTicks: [1981,1995,2010,2026]
      valueSuffix: "%"
      series:
        - { name: "$30 a day", color: "stone", data: [[1981,88.4],[2024,80.64],[2026,80.04]] }
        - { name: "$8.30 a day", color: "despair", data: [[1981,69.5],[2026,44.4]] }
        - { name: "$4.20 a day", color: "ochre", data: [[1981,56.7],[2026,17.7]] }
        - { name: "$3.00 a day", color: "hope", data: [[1981,47.1],[2026,10]] }
    take:
      hope: "By every line, the share has fallen hard over forty years — the direction does not depend on the ruler."
      despair: "By the line rich countries draw for themselves, the great escape barely happened — nearly nine in ten people were poor in 1981, and four in five still are."
      confusion: "There is no single true poverty line; the most-quoted number is the most flattering one."
  - eyebrow: "How many, really"
    fig: "FIG. 10"
    question: "If the rate keeps falling, why doesn't the headcount empty out?"
    claim: "Nearly four billion people live on less than $8.30 a day."
    dropCap: false
    explainer: "Counts behave differently from rates. At the three-dollar line, about 870 million people were extreme-poor in 2022 — a number that has roughly halved since 1990. At $4.20 it was 1.6 billion. At $8.30 it was 3.9 billion, and that top figure has barely fallen in forty years: 3.1 billion in 1981, 3.9 billion now.\n\nThe reason the upper count holds while the rate drops is that the world kept adding people. A falling share of a growing population can leave the absolute number almost unchanged, and at the higher line it has. So the most quoted figure — the few hundred million in extreme poverty — is the one shrinking fastest, and the figure that covers most of humanity is the one standing nearly still. Both come from the same surveys; they just answer different questions."
    sidenote: { mark: "c", text: "Earlier charts on this page count <em>shares</em> so eras can be compared. From here several charts count <em>people</em> — and because world population keeps rising, a flat line in people is a falling line in risk." }
    captionLeft: "<b>People below each poverty line</b> · millions, worldwide"
    captionRight: "1981 — 2026"
    source: "Source · World Bank — Poverty and Inequality Platform · CC BY 4.0"
    chart:
      id: "m4"
      dataRefs: ["poor-count-830-world","poor-count-420-world","poor-count-world"]
      ymax: 4500
      yTicks: [0,1500,3000,4500]
      xTicks: [1981,1995,2010,2026]
      series:
        - { name: "$8.30 a day", color: "despair", data: [[1981,3142],[2026,3675]] }
        - { name: "$4.20 a day", color: "ochre", data: [[1981,2564],[2026,1468]] }
        - { name: "$3.00 a day", color: "hope", data: [[1981,2129],[2026,826]] }
    take:
      hope: "The number in extreme poverty has roughly halved since its peak, even as the world added billions of people."
      despair: "By the higher line, the count of the poor is no lower than it was in 1981 — growth ran in place against population."
      confusion: "Whether poverty is shrinking or stuck depends entirely on which line you count people under."
  - eyebrow: "How many, really"
    fig: "FIG. 11"
    question: "Can a country simply grow its way out of poverty altogether?"
    claim: "You cannot grow your way out of relative poverty."
    dropCap: false
    explainer: "The World Bank keeps a second kind of line that moves as a country gets richer — set at half the national median income, with a floor underneath it. By that societal line, about a quarter of the world was poor in 2022, and that share has barely shifted while absolute poverty collapsed: 54 percent in 1981, 26 percent in 2019, 25 today.\n\nThe two lines tell opposite stories on purpose. Absolute poverty asks whether you can meet basic needs, and growth answers it. Relative poverty asks how far you sit below the middle of your own society, and growth lifts the floor and the middle together, so the distance holds. A country can end destitution and still leave a quarter of its people poor by the standards of their neighbours. One of these is a problem economies can outgrow. The other one travels with them."
    captionLeft: "<b>Relative vs extreme poverty</b> · % of the world"
    captionRight: "1981 — 2026"
    source: "Source · World Bank — Poverty and Inequality Platform · CC BY 4.0"
    chart:
      id: "m5"
      dataRefs: ["societal-poverty-world","poverty-rate-300-world"]
      ymax: 60
      yTicks: [0,20,40,60]
      xTicks: [1981,1995,2010,2026]
      series:
        - { name: "Relative line", color: "uncertain", data: [[1981,53.6],[2026,24.3]] }
        - { name: "Extreme ($3)", color: "hope", data: [[1981,47.1],[2026,10]] }
    take:
      hope: "Even the relative measure fell by half — growth narrowed the gap to the middle, not only the distance to survival."
      despair: "A quarter of humanity is still poor relative to its own society, and that share has hardly moved in fifteen years."
      confusion: "Relative and absolute poverty are different things wearing the same word, and they can move in opposite directions at once."
  - eyebrow: "Who climbed, who didn't"
    fig: "FIG. 12"
    question: "Did poverty fall everywhere, or only in some places?"
    claim: "Every region's poverty rate fell — and they did not fall together."
    dropCap: true
    explainer: "Follow each region's poverty rate down and the spread is the story. East Asia went from 77 percent extreme-poor in 1981 to 2 percent in 2024 — the steepest mass escape ever recorded. South Asia fell from 56 to about 4. Latin America roughly quartered its rate. These are the great convergences: the regions that started poorest fell furthest and fastest.\n\nTwo lines bend the other way. Sub-Saharan Africa is the exception that shapes the whole article: its rate fell too, from about 61 percent in 1990 to the mid-forties, but it never collapsed the way Asia's did, and after 2020 it ticked back up from 44 to 46 percent. The Middle East and North Africa is the quieter warning — down to about 12 percent by 2019, then climbing back toward 14 as war spread through Yemen, Syria, and Sudan. A region can be making progress and losing ground at once, and these two are doing both: their rates broadly improving over the long run, their grip on the world's remaining poverty tightening. The next chart is why."
    captionLeft: "<b>Extreme poverty rate</b> · under $3.00 a day, by region"
    captionRight: "1981 — 2024"
    source: "Source · World Bank — World Development Indicators · CC BY 4.0"
    chart:
      id: "m6"
      dataRefs: ["extreme-poverty-eas","extreme-poverty-sas","extreme-poverty-ssf","extreme-poverty-lcn","extreme-poverty-mea"]
      ymax: 80
      yTicks: [0,20,40,60,80]
      xTicks: [1981,1995,2010,2024]
      series:
        - { name: "East Asia", color: "hope", data: [[1981,77.2],[2024,2]] }
        - { name: "South Asia", color: "uncertain", data: [[1981,55.9],[2024,3.8]] }
        - { name: "Sub-Saharan", color: "despair", data: [[1990,61.5],[2024,45.1]] }
        - { name: "Latin America", color: "stone", data: [[1981,20],[2024,4.3]] }
        - { name: "Mid. East & N. Africa", color: "ochre", data: [[1990,34.2],[2024,14.4]] }
    take:
      hope: "Over the long run every region cut its poverty rate, several of them to near zero."
      despair: "Two regions — Africa and the Middle East — are now moving the wrong way, their rates rising since the pandemic."
      confusion: "A falling regional rate can still hide a rising number of poor people — the rate is only half the picture."
  - eyebrow: "Who climbed, who didn't"
    fig: "FIG. 13"
    question: "Where do the world's poor actually live now?"
    claim: "The world's poor used to live in Asia. Now they live in Africa."
    dropCap: false
    explainer: "Forty years ago, East Asia held about 1.2 billion extreme-poor people — more than half of everyone on earth below the line. By 2026 it holds around 39 million. Over the same stretch Sub-Saharan Africa's count climbed the other way, from 231 million to 587 million. The two lines cross near 2007, and after that Africa carries the largest single share of the world's poverty.\n\nThis is the rate-and-count trap made visible. Africa's poverty rate did fall — but its population grew faster than the rate dropped, so the number of poor rose even as the share declined. The global poor were not so much defeated as relocated: out of an Asia that grew explosively and into an Africa whose growth has not yet outrun its needs. Where the previous chart showed progress, this one shows where progress hasn't gone."
    captionLeft: "<b>People in extreme poverty</b> · millions, by region"
    captionRight: "1981 — 2026"
    source: "Source · World Bank — Poverty and Inequality Platform · CC BY 4.0"
    chart:
      id: "m7"
      dataRefs: ["poor-count-eas","poor-count-sas","poor-count-ssf","poor-count-mea","poor-count-lcn"]
      ymax: 1300
      yTicks: [0,400,800,1200]
      xTicks: [1981,1995,2010,2026]
      annot: { x: 2007, label: "ASIA & AFRICA CROSS" }
      series:
        - { name: "East Asia", color: "hope", data: [[1981,1218],[2026,39]] }
        - { name: "South Asia", color: "uncertain", data: [[1981,462],[2026,43]] }
        - { name: "Sub-Saharan", color: "despair", data: [[1981,231],[2026,587]] }
        - { name: "Mid. East & N. Africa", color: "ochre", data: [[1981,111],[2026,122]] }
        - { name: "Latin America", color: "stone", data: [[1981,73],[2026,27]] }
    take:
      hope: "Asia drained its poverty almost completely — East Asia's count fell by more than 1.1 billion people."
      despair: "Africa's poor more than doubled in number, and the continent now holds most of the world's remaining poverty."
      confusion: "A region can lower its poverty rate and raise its poverty count at once, if its population grows faster than its rate falls."
  - eyebrow: "Who climbed, who didn't"
    fig: "FIG. 14"
    question: "Is “Sub-Saharan Africa” even one story?"
    claim: "Even inside Africa the poverty is not spread evenly — it is piling up in the east and south."
    dropCap: false
    explainer: "Split that one Sub-Saharan line in two and the continent stops looking like a single place. The World Bank counts Africa as east-and-south and west-and-central, and the two halves have pulled apart. Eastern and Southern Africa — Ethiopia, the Sudans, Tanzania, Mozambique, Madagascar — saw its extreme-poor nearly triple, from about 142 million in 1981 to roughly 402 million. Western and Central Africa, where Nigeria and the Sahel sit, roughly doubled, from 89 to 185 million, even dipping for a stretch in the 2010s before turning back up.\n\nBoth halves are rising, which is the headline the continent shares. But the bulk and the steeper climb are in the east and south, where a long row of mid-sized, very poor countries stacks up and population is growing fastest. The single \"Sub-Saharan\" line in the previous chart is an average laid over a region coming apart — useful for the world picture, misleading if you read it as one economy. Where Africa's poverty is worst, and where it is growing fastest, are questions the continental line cannot answer."
    sidenote: { mark: "f", text: "These are the World Bank's two African groupings; together they sum to the single Sub-Saharan line in the previous chart. The split is a statistical convenience, not a sharp economic border — Nigeria alone holds a large share of the western total." }
    captionLeft: "<b>People in extreme poverty</b> · millions, the two halves of Sub-Saharan Africa"
    captionRight: "1981 — 2026"
    source: "Source · World Bank — Poverty and Inequality Platform · CC BY 4.0"
    chart:
      id: "m7b"
      dataRefs: ["poor-count-afe","poor-count-afw"]
      ymax: 450
      yTicks: [0,150,300,450]
      xTicks: [1981,1995,2010,2026]
      series:
        - { name: "East & Southern", color: "despair", data: [[1981,142],[2026,402]] }
        - { name: "West & Central", color: "ochre", data: [[1981,89],[2026,185]] }
    take:
      hope: "Splitting the continent shows it is not a uniform failure — some countries within are holding their numbers down while others rise."
      despair: "Both halves of Sub-Saharan Africa are adding poor people, and the east and south have nearly tripled their count in four decades."
      confusion: "Where the African line is drawn changes the story; one regional average can hide a continent diverging inside it."
  - eyebrow: "Who climbed, who didn't"
    fig: "FIG. 15"
    question: "How far apart are the richest and poorest regions, really?"
    claim: "The richest region's average income is about nineteen times the poorest's — and the gap is not closing."
    dropCap: false
    explainer: "By the day, the average North American lived on about 88 dollars in 2022 and the average sub-Saharan African on about 4.70 — a gap of roughly nineteen to one. That alone is stark. What makes it a poverty story is the movement underneath: North America's average income nearly doubled since 1981, while Africa's has barely stirred, from about 4.40 to 4.90 dollars a day across more than four decades.\n\nThis is the engine the crossover chart was missing. Poverty empties out of a region when average incomes rise fast enough to pull people over the line, the way they did across Asia. Where the world's poverty is now concentrated, that lift is not happening — incomes are nearly flat in real terms. A region cannot drain poverty it is not growing out of, and the poorest region has spent forty years close to standing still."
    captionLeft: "<b>Mean income or consumption</b> · PPP$ per day, by region"
    captionRight: "1981 — 2026"
    source: "Source · World Bank — Poverty and Inequality Platform · CC BY 4.0"
    chart:
      id: "m8"
      dataRefs: ["mean-income-nac","mean-income-world","mean-income-ssf"]
      ymax: 100
      yTicks: [0,25,50,75,100]
      xTicks: [1981,1995,2010,2026]
      series:
        - { name: "North America", color: "stone", data: [[1981,54.6],[2026,96.1]] }
        - { name: "World", color: "uncertain", data: [[1981,11.8],[2026,22.3]] }
        - { name: "Sub-Saharan", color: "despair", data: [[1981,4.4],[2026,4.9]] }
    take:
      hope: "The world's average income roughly doubled in a generation — the middle of humanity is markedly richer."
      despair: "The poorest region's average has not moved in forty years, while the richest's pulled further ahead."
      confusion: "Averages hide the spread inside each region; a regional mean can rise while its poorest people gain nothing."
  - eyebrow: "Who climbed, who didn't"
    fig: "FIG. 16"
    question: "Among the people still poor, how far below the line do they fall?"
    claim: "Africa's poverty is the deepest in the world, as well as the most widespread."
    dropCap: false
    explainer: "A headcount treats everyone below the line alike, whether they are a cent short or living on almost nothing. The poverty gap corrects for that: it measures how far below the line people fall on average, counted as a share of the line itself. Read that way, the regions pull apart. East Asia's gap has all but closed — about half a percent — so the few who remain poor there sit just under the line. South Asia's is nearly as small. Sub-Saharan Africa's is around 16 percent, down from the high twenties in the 1980s but a world away from Asia's near-zero.\n\nThat figure is the hard core of the whole problem. A shallow gap can be closed by a little growth nudging people over a line they already sit close to. A deep gap means the poor are a long way down, and the same growth lifts them without carrying them across. So Africa shoulders a burden the count chart only half revealed: not the most poor people alone, but the poor who are furthest from the line they need to clear. The depth is what turns a hard problem into an entrenched one."
    sidenote: { mark: "g", text: "The gap counts the non-poor as zero and each poor person at their distance below the line, then averages over everyone. A headcount and a gap falling together means fewer poor people, and those left are less far down." }
    captionLeft: "<b>Poverty gap at $3.00 a day</b> · mean shortfall as % of the line, by region"
    captionRight: "1981 — 2026"
    source: "Source · World Bank — Poverty and Inequality Platform · CC BY 4.0"
    chart:
      id: "m8b"
      dataRefs: ["poverty-gap-ssf","poverty-gap-eas","poverty-gap-sas","poverty-gap-world"]
      ymax: 45
      yTicks: [0,15,30,45]
      xTicks: [1981,1995,2010,2026]
      series:
        - { name: "Sub-Saharan", color: "despair", data: [[1981,26.8],[2026,16.3]] }
        - { name: "East Asia", color: "hope", data: [[1981,43.1],[2026,0.4]] }
        - { name: "South Asia", color: "uncertain", data: [[1981,16.6],[2026,0.4]] }
        - { name: "World", color: "stone", data: [[1981,22.4],[2026,3.5]] }
    take:
      hope: "In Asia the gap has all but vanished — the poor who remain sit within a hair of the line."
      despair: "Africa's poverty gap has narrowed only slowly and still sits near 16 percent — its poor are both the most numerous and the deepest down."
      confusion: "Depth and headcount can move apart; a region can lower its count while the poverty of those left behind stays just as deep."
  - eyebrow: "More than money"
    fig: "FIG. 17"
    question: "Is poverty only about money?"
    claim: "By the measures that aren't money, the floor rose almost everywhere."
    dropCap: true
    explainer: "Money is one axis of poverty, and on the others the news is better. The share of the world with safely managed drinking water climbed from 61 percent in 2000 to 74 percent. Safe sanitation went from 31 percent to 58. Access to electricity reached 92 percent of the planet. These are the living-standards rungs a multidimensional poverty index actually counts, and they kept rising even through the income stall.\n\nThat matters because it means a person can be poor in dollars and less poor in daily life — gaining a tap, a toilet, a light — at the same time. It also splits the verdict in a useful way. The slowest progress is in the same places the count chart flagged: Sub-Saharan Africa still trails on every one of these. But the direction, almost everywhere, is up, and these are gains a wage figure on its own will never show you."
    captionLeft: "<b>Access to basic services</b> · % of the world"
    captionRight: "2000 — 2024"
    source: "Source · World Bank — WHO/UNICEF Joint Monitoring Programme · CC BY 4.0"
    chart:
      id: "m9"
      dataRefs: ["electricity-access-world","safe-drinking-water-world","safe-sanitation-world"]
      ymax: 100
      x0: 2000
      yTicks: [0,25,50,75,100]
      xTicks: [2000,2010,2020,2024]
      series:
        - { name: "Electricity", color: "hope", data: [[2000,78.2],[2024,91.6]] }
        - { name: "Safe water", color: "uncertain", data: [[2000,61.2],[2024,73.7]] }
        - { name: "Safe sanitation", color: "ochre", data: [[2000,31.3],[2024,58.5]] }
    take:
      hope: "Water, power, and sanitation reached hundreds of millions more people even while incomes stalled — real gains money charts miss."
      despair: "Two in five people still lack safe sanitation, and the gaps sit in the same poorest places."
      confusion: "Income poverty and material deprivation overlap but aren't the same set of people, so the two can move at different speeds."
  - eyebrow: "More than money"
    fig: "FIG. 18"
    question: "If you measure poverty by deprivation instead of dollars, where is it worst?"
    claim: "By a yardstick that counts health and schooling, not just cash, the poorest places look poorer still."
    dropCap: false
    explainer: "The dollar line asks one question — can you buy a basket of goods — and answers it with a single number. The Multidimensional Poverty Index asks a different set: is a child in the household out of school, is anyone undernourished, does the home have a clean floor, a toilet, electricity, safe water. It counts a person as poor if they are deprived on enough of these at once, and weights the count by how many deprivations pile up. The result is a map that mostly agrees with the income map — and sometimes sharply doesn't.\n\nThe agreement is the Sahel and central Africa, where the bars run highest: in Chad and Niger around half the population is multidimensionally poor, deprived across health, schooling, and the basics of a home. The disagreement is more telling. India's score is modest here even though it holds an enormous number of the income-poor, because schools and water reached further than wages did. South Africa's is low on deprivation yet the country is among the most unequal on earth. Money and deprivation are two readings of the same word, taken with different instruments, and where they part is exactly where a single poverty number misleads."
    sidenote: { mark: "h", text: "These are single survey points, not a trend — most countries have one or two MPI readings, taken in different years. The index combines how many people are deprived with how many deprivations they face at once, so it is not a headcount you can set beside the dollar rate one-to-one." }
    captionLeft: "<b>Multidimensional Poverty Index</b> · ×100 · most-deprived to least, recent surveys"
    captionRight: "latest available"
    source: "Source · Our World in Data — OPHI & UNDP Global MPI · CC BY 4.0"
    chart:
      id: "mpi-bars"
      dataRef: "mpi-by-country"
      ymax: 1
      yTicks: [0]
      xTicks: [0]
      series: []
    take:
      hope: "By this fuller measure too, deprivation has retreated to a shrinking set of countries — most of Asia now scores near zero."
      despair: "Where it remains, it is severe: half of Chad and Niger are deprived across health, schooling, and home at once."
      confusion: "Money poverty and deprivation poverty rank countries differently, so which places are 'poorest' depends on the instrument you pick."
  - eyebrow: "More than money"
    fig: "FIG. 19"
    question: "Are the poor poor because they don't work?"
    claim: "Most of the world's poor have jobs."
    dropCap: false
    explainer: "Idleness is rarely the cause. In 2000, about 35 percent of the world's workers earned too little to clear the extreme line even while employed; by 2024 that working-poverty rate had fallen to 8 percent. The drop tracks the broader poverty fall almost exactly, because the same thing drove both — work in Asia became far more productive, and a more productive day's labour pays its way over the line.\n\nWhat the fall hides is how thin the margin still is. Most jobs in poor countries are informal, off the books and without a contract, and a wage can sit just above the poverty line while a single illness or a failed harvest drops the household back under it. Having work stopped being a guarantee of escaping poverty somewhere in there. For a great many people it became the more precarious thing: enough to be counted as not-poor, not enough to be safe."
    captionLeft: "<b>Working poverty</b> · % of workers below the extreme line"
    captionRight: "2000 — 2025"
    source: "Source · World Bank — International Labour Organization · CC BY 4.0"
    chart:
      id: "m10"
      dataRef: "working-poverty-world"
      ymax: 40
      x0: 2000
      yTicks: [0,10,20,30,40]
      xTicks: [2000,2010,2020,2024]
      series:
        - { name: "Working poverty", color: "hope", data: [[2000,34.7],[2010,18.9],[2024,8.1]] }
    take:
      hope: "The share of workers too poor to clear the line fell by three quarters — work became a way out, not a trap."
      despair: "Most poor people already work; for them poverty is not about jobs but about what a job pays and how easily it vanishes."
      confusion: "Being counted just above the line is not the same as being secure — the figure hides how many sit one shock from falling back."
  - eyebrow: "What holds them, what we can't see"
    fig: "FIG. 20"
    question: "As poverty fell, did the gap between rich and poor close too?"
    claim: "Between countries the gap narrowed; inside them it widened."
    dropCap: true
    explainer: "As Asia caught up to the West, the gap between nations shrank — and that convergence is the main reason global poverty fell at all. But look inside the world rather than between its countries and a different line appears. The share of all world income going to the poorest half of people is about 8 percent today, against more than half for the richest tenth, and the poorest half's share has hardly climbed.\n\nThe long view sharpens it. In 1820 the bottom half of humanity took around 14 percent of world income; industrialisation cut their share as the West pulled away, and it has only partly recovered. So the poor of the world caught up to other countries faster than they caught up to the rich inside their own. Two true things, pointing opposite ways: the distance between nations is the smallest in a century, and the distance within them is wide and stubborn."
    captionLeft: "<b>Share of world income</b> · richest tenth vs poorest half"
    captionRight: "1900 — 2024"
    source: "Source · Our World in Data — World Inequality Database · CC BY 4.0"
    chart:
      id: "m11"
      dataRefs: ["income-share-top10-world","income-share-bottom50-world"]
      ymax: 65
      x0: 1900
      yTicks: [0,20,40,60]
      xTicks: [1900,1950,2000,2024]
      series:
        - { name: "Richest 10%", color: "despair", data: [[1900,58.9],[2024,53.6]] }
        - { name: "Poorest 50%", color: "hope", data: [[1900,8.7],[2024,8]] }
    take:
      hope: "The gap between countries is the narrowest in a century — the poorest nations are catching up to the richest."
      despair: "The poorest half of the world still receives about 8 percent of its income, a share that has barely moved."
      confusion: "Inequality between countries and within them move separately; falling global poverty hides a widening gap inside many societies."
  - eyebrow: "What holds them, what we can't see"
    fig: "FIG. 21"
    question: "How unequal are countries inside their own borders?"
    claim: "Some middle-income countries are far more unequal than either the rich world or the poorest."
    dropCap: false
    explainer: "The Gini index squeezes a whole income distribution into one number: zero if everyone holds an equal share, a hundred if one person holds it all. Ranked that way, the most unequal places are not the richest or the poorest but a particular band in between. Southern Africa and Latin America sit at the top — Namibia near 59, Colombia and South Africa in the low fifties, Brazil at 50 — levels where the distance between a country's rich and poor is its own kind of poverty.\n\nThe surprises are in the order. The United States, at around 42, is markedly more unequal than Germany or the United Kingdom in the thirties, and far above Sweden near 29. India comes in low, around 26, which sounds like good news until you remember the previous charts: a country can spread a small pie evenly and still leave most of its people poor. So inequality and poverty are not the same problem. A place can be poor and equal, rich and unequal, or — as Southern Africa shows — carry deep inequality layered on top of deprivation, the hardest combination to shift."
    sidenote: { mark: "i", text: "Each bar is a country's most recent available survey, and the years differ. Poorer countries usually measure the spread of <em>consumption</em>, richer ones of <em>income</em>, so cross-country comparisons are indicative rather than exact." }
    captionLeft: "<b>Income inequality (Gini index)</b> · 0 = everyone equal · 100 = one person holds all"
    captionRight: "latest available survey"
    source: "Source · World Bank — Poverty and Inequality Platform, via Our World in Data · CC BY 4.0"
    chart:
      id: "gini-bars"
      dataRef: "gini-by-country"
      ymax: 1
      yTicks: [0]
      xTicks: [0]
      series: []
    take:
      hope: "High inequality is not destiny — countries at similar income levels span the whole range, so policy clearly moves it."
      despair: "In the most unequal countries the gap between rich and poor rivals anything in the historical record, and it barely shifts."
      confusion: "A low Gini can hide widespread poverty, and a high one can sit atop real prosperity — the number rates the spread, not the level."
  - eyebrow: "What holds them, what we can't see"
    fig: "FIG. 22"
    question: "Is the world still on track to end extreme poverty?"
    claim: "The fastest fall in the history of need ran out of speed."
    dropCap: false
    explainer: "For three decades the count of the extreme-poor fell at a pace with no precedent in the human record. Averaged across every year since 1990, about 115,000 people crossed out of extreme poverty each day; at the height of it, in the 2000s, the figure ran past 200,000. Then it levelled off. The number dropped from 1.47 billion in 2010 to 837 million in 2019, and there it more or less stopped, the pandemic nudging it back up in 2020. Since then the daily pace has collapsed to a few thousand, and by 2026 the count sits near 826 million, almost exactly where 2019 left it. The plunge of the earlier chapters became a plateau.\n\nThe goal the world signed up to — extreme poverty effectively gone by 2030 — will be missed: the Bank's own projection has about 740 million people still below the line in 2030, the low point of the dashed path. Then the line turns back up. On the Bank's numbers the count climbs toward 890 million by 2040, as the poor who remain concentrate in economies that are barely growing — the first sustained rise in extreme poverty since the 1980s, the long descent going into reverse. What is left is the hard core of the problem, dug into fragile and conflict-ridden states where ordinary growth has never reached and a survey often cannot go. Whether this flat stretch is the story's ending or only a pause is genuinely unknown, which is the honest temperature of it. The recent points here are nowcasts: trust the shape of the line, not its last decimal."
    sidenote: { mark: "d", text: "Points after a country's most recent survey are <em>nowcasts</em> — modelled from growth estimates, not counted from households. They are drawn as the Bank publishes them; read the last few years as projection." }
    captionLeft: "<b>People in extreme poverty</b> · millions, worldwide · dashed = World Bank projection"
    captionRight: "2010 — 2040"
    source: "Source · World Bank — Poverty and Inequality Platform (projection to 2040) · CC BY 4.0"
    chart:
      id: "m12"
      dataRefs: ["poor-count-world", "poor-count-projection-world"]
      ymax: 1600
      x0: 2010
      yTicks: [0,500,1000,1500]
      xTicks: [2010,2020,2030,2040]
      annots: [{ x: 2020, y: 896.38, label: "the pandemic" }, { x: 2030, y: 738, label: "the projected turn" }]
      series:
        - { name: "Extreme-poor", color: "despair", data: [[2010,1469],[2019,837],[2020,896],[2026,826]] }
        - { name: "Projected", color: "stone", dashed: true, data: [[2026,826],[2030,738],[2035,806],[2040,888]] }
    take:
      hope: "Even after the stall, the count sits near its lowest level ever — the long fall has not reversed, only paused."
      despair: "Progress flattened after 2019, the 2030 goal is out of reach, and the Bank's own projection has the count climbing again toward 890 million by 2040."
      confusion: "The reversal after 2030 is a projection, not a measurement — but so is much of the recent line; these are model estimates, not counts."
pullQuote:
  text: "Poverty was never one number. It is a line someone draws, and a place someone is born."
  cite: "Progress and catastrophe coexist"

lenses:
  - { who: "The development economist", confidence: "high", hope: "Growth in Asia did what no aid programme could — it carried a billion people over the line.", despair: "Growth has stopped reaching the poorest, and Africa's count of the poor is still climbing." }
  - { who: "The statistician of poverty", confidence: "medium", hope: "By every absolute line, the share of the poor has fallen for forty straight years.", despair: "The line is a choice and the surveys miss the rich, so the real distance is wider than the numbers admit." }
  - { who: "The demographer", confidence: "medium", hope: "Falling birth rates across Asia turned a falling rate into a falling number.", despair: "Africa's population is still outgrowing its incomes, so its number of poor keeps rising even as its rate dips." }
  - { who: "Someone living it", confidence: "absolute", despair: "A world rate of one-in-ten means nothing in a village where it is still one-in-two and no surveyor has come in years." }
  - { who: "The relative-poverty scholar", confidence: "medium", hope: "The material floor — water, power, sanitation — rose almost everywhere, even where wages did not.", despair: "A quarter of the world is still poor next to its own neighbours, and growth does not close that gap." }

hopeCase: "The long view is the real story. In two centuries the normal human condition flipped from almost everyone poor to most people not, and in a single recent generation roughly a billion people crossed out of extreme poverty — the fastest such fall ever measured. The forces behind it, broad-based growth and rising productivity, have not vanished, and the non-money floor of water, power and sanitation is still rising. A stalled decade does not undo a transformed century."
despairCase: "The fall has stalled near a tenth of the world, the 2030 goal of ending extreme poverty will be missed, and the remaining poverty has concentrated into Africa and fragile states where growth has never reached. Africa's count of the poor is still rising. By the higher lines most countries actually use, half of humanity is still poor and that number has scarcely fallen in forty years."
whatWouldChangeIt: "A decade of sub-Saharan African incomes growing faster than its population, pulling the regional poverty count down rather than up, would strengthen the hope case decisively. A second consecutive decade with the global extreme-poverty count flat or rising — growth failing to resume in the poorest places — would confirm the despair reading that the great escape is over."

methodology:
  - { term: "Every figure is real", detail: "Every chart runs on data ingested through our open pipeline, with downloadable source, data package, and lineage under each. The only hand-made element is the evidence panel at the top — the long-run hero curve and the four signal sparklines — a composited orientation graphic, flagged as such." }
  - { term: "Counts come straight from the source", detail: "The number-of-poor charts are the World Bank's own <b>Poverty and Inequality Platform</b> figures (its <code>pop_in_poverty</code> field), not a rate multiplied by a population. Where the Bank publishes the count, we publish the count." }
  - { term: "The line and the price base", detail: "Each poverty figure carries its line (<b>$3.00, $4.20, $8.30</b> a day) and its purchasing-power base (<b>2021 PPP</b>). Lines from different price bases are never drawn on one axis — a $2.15 point beside a $3.00 point would be a unit error, not a trend." }
  - { term: "The $30-a-day line", detail: "The top rung of the ladder chart is <b>not a World Bank line</b>. The first three ($3.00 / $4.20 / $8.30) are the Bank's low-, lower-middle-, and upper-middle-income lines; <b>$30</b> is the order of magnitude a wealthy country like the UK uses for its own citizens, re-expressed in the same 2021 PPP and applied to the whole world — Max Roser's thought experiment for what global poverty looks like judged by rich-world standards. The share below it is pulled live from the World Bank PIP at the $30 line, not borrowed from a different price base." }
  - { term: "Nowcasts, marked as such", detail: "Years after a country's last survey are <b>model nowcasts</b>, not counts, and most recent global points lean on them. The line's shape is trustworthy; its final decimals are projection, and the prose says so wherever it leans on them." }
  - { term: "Consumption vs income", detail: "Poor countries usually measure poverty by <b>consumption</b>, richer ones by <b>income</b>; the two are not strictly comparable, which slightly biases cross-region and relative-poverty comparisons. We report each series as its source measures it." }
  - { term: "Re-host vs. link-only", detail: "We re-host only openly-licensed data (CC BY / CC0). The World Bank PIP and WDI, the World Inequality Database (via OWID), the ILO, the WHO/UNICEF water programme, and Maddison all qualify; restricted sources would be cited and linked instead." }
  - { term: "The verdict", detail: "Each signal is classed improving or worsening by the sign of its change across the visible window. The headline verdict is an <b>editorial</b> reading of those signals — deliberately not a single computed index." }

sources:
  - { id: "s1", name: "World Bank — Poverty and Inequality Platform (PIP)", url: "https://pip.worldbank.org", license: "CC BY 4.0", vintage: "2026-06", note: "Counts, rates, mean income, and relative poverty by world region, 1981–2026 (2021 PPP)." }
  - { id: "s2", name: "World Bank — World Development Indicators", url: "https://data.worldbank.org", license: "CC BY 4.0", vintage: "2026-06", note: "Regional extreme-poverty rates and basic-services access." }
  - { id: "s3", name: "World Inequality Database (WID)", url: "https://wid.world", license: "CC BY 4.0 (via OWID)", vintage: "2026", note: "Income shares of the top 10% and bottom 50%, worldwide." }
  - { id: "s4", name: "Maddison Project Database", url: "https://www.rug.nl/ggdc/historicaldevelopment/maddison/", license: "CC BY 4.0 (via OWID)", vintage: "2026", note: "World GDP per person in the long run, from 1820." }
  - { id: "s5", name: "International Labour Organization (ILOSTAT)", url: "https://ilostat.ilo.org", license: "CC BY 4.0", vintage: "2026", note: "Working poverty — workers below the extreme line." }
  - { id: "s6", name: "WHO/UNICEF Joint Monitoring Programme", url: "https://washdata.org", license: "CC BY 4.0 (via the World Bank)", vintage: "2026", note: "Access to safe drinking water, sanitation, and electricity." }
  - { id: "s7", name: "Our World in Data — Poverty", url: "https://ourworldindata.org/poverty", license: "CC BY 4.0", vintage: "2026-06", note: "Keystone aggregator and documentation for the poverty and inequality series." }
  - { id: "s8", name: "Our World in Data — Extreme poverty in brief (Max Roser)", url: "https://ourworldindata.org/extreme-poverty-in-brief", license: "link-only", vintage: "2026", note: "The $30-a-day thought experiment: apply the poverty line rich countries use for themselves to the world, and roughly four in five people fall below it." }
  - { id: "s9", name: "Our World in Data — “$3 a day: a new poverty line — what changed, and why?”", url: "https://ourworldindata.org/new-international-poverty-line-3-dollars-per-day", license: "link-only", vintage: "2026", note: "The World Bank's 2025 rebasing to 2021 PPP — why the lines moved to $3.00 / $4.20 / $8.30 and the rich-country line stays near $30; grounds the “line is a price, not a fact” caveat." }
  - { id: "s10", name: "Our World in Data — Projections of extreme poverty (World Bank)", url: "https://ourworldindata.org/grapher/projections-extreme-poverty-wb", license: "CC BY 4.0", vintage: "2026", note: "World Bank projection of the extreme-poor count to 2030 (~740 million still below $3.00/day) — the dashed line in the “still on track?” chart." }
  - { id: "s11", name: "Our World in Data — “The end of progress against extreme poverty?” (Max Roser)", url: "https://ourworldindata.org/end-progress-extreme-poverty", license: "link-only", vintage: "2026", note: "Roser's 2026 essay: about 115,000 people left extreme poverty each day since 1990, but the poorest now live in economies that have not grown, so on current trends progress halts and reverses after 2030. Grounds the pace figure and the post-2030 reversal in the “still on track?” movement." }

revisions:
  - { date: "2026-06-13", text: "Wove in Our World in Data's 2026 essay on the stall (Roser, “The end of progress against extreme poverty?”). Added the daily pace — derived from our own count series, about 115,000 people left extreme poverty each day on average since 1990, more than 200,000 at the 2000s peak, now a few thousand. Made the projection line real: ingested the World Bank's forward projection (`poor-count-projection-world`, 2026–2040) and extended the “still on track?” chart to 2040, where the count bottoms near 740 million in 2030 and climbs back toward 890 million — the reversal the essay names, drawn from the Bank's own numbers." }
  - { date: "2026-06-12", text: "First full build. Twelve real-data movements across five acts, all wired through the open pipeline: the long income arc (Maddison), the extreme-poverty rate, the line-ladder and people-count at three lines, relative poverty, the regional rate fan, the Asia–Africa crossover, mean income by region, the basic-services floor, working poverty, the income-share gap, and the post-2019 stall. Poverty counts come direct from the World Bank's Poverty and Inequality Platform rather than reconstructed from rates." }
---

### Still lost? Read this.

Here is the whole argument in one breath. Two hundred years ago almost every human being on earth was poor — living on the equivalent of about three dollars a day, the same line we now use to mark destitution. Today most people are not. Somewhere around a billion of them crossed out of extreme poverty in just the last generation, mostly because Asia grew. That is real, and it is the largest improvement in material life the species has ever recorded.

But hold two facts next to it. First, the number you hear depends on a line a committee chose: at three dollars a day a tenth of the world is poor, and at the line many middle-income countries actually use, it is half. Second, the fall has stalled. Since about 2019 the count of the extreme-poor has stopped dropping, and in Sub-Saharan Africa it is rising — the world's poverty has drained out of Asia and pooled into Africa and the fragile states, the places ordinary growth has never reached.

So the honest answer is both, and the seam between them is the whole point. Across two centuries, we are winning against poverty by a margin our ancestors could not have imagined. Across the last decade, the winning slowed to a crawl, and whether it resumes is genuinely unknown. The one thing you can say at dinner and be right: ask how many people are poor, and the truest first answer is a question back — poor by which line, and in which year, and where?

