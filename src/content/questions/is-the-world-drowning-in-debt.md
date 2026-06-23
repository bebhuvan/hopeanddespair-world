---
question: "Is the world drowning in debt?"
dek: "Government debt has never been larger, yet the size of the pile predicts almost nothing. What a debt is made of, and who holds it, decides whether it is a tool or a trap. And the trap is tightening on the countries least able to escape it."
theme: "Money & Debt"
kickerNumber: "13"
verdict: "A tool for the rich and a tightening trap for the poor, as the bills grow where the borrowing room is smallest."
order: 13
publishedAt: 2026-06-17
illustrative: false
status: "published"

atlas:
  hope:
    pos: 0.34
    lens: "Debt crises get worked through; the share of world debt in default has collapsed from the 1990s."
  despair:
    pos: 0.75
    lens: "The debt divide is structural and widening, with climate, a closing trade era and stalled African poverty all loading onto the weakest balance sheets."

caveats:
  - "Debt figures are reported by governments and compiled by the IMF, World Bank, BIS and UNCTAD. Where a country is in crisis, its own numbers are often the least reliable — a gap this piece treats as part of the story, not a footnote."
  - "Several gauges here mix sources with different licences. The composite charts are displayed and cited but not offered for download, per UNCTAD and BIS terms."
  - "A handful of countries stand in for a pattern. The cast is curated to show the spread, not to rank every nation."
  - "This piece is about public, sovereign debt, what governments owe. Household and corporate debt, which in the rich world dwarfs it, is shown once for scale and then set aside as a separate story for another question."

intro:
  - "Ask whether the world is drowning in debt and the honest first answer is a question back: whose debt, and in whose money? The global total is at a record, and that headline is true. It is also nearly useless on its own."
  - "This piece follows the debt down from the planetary number to the country, because that is the only altitude where the word means anything. The thread running through it is simple. The danger in a debt has little to do with its size and almost everything to do with its shape."
  - "And the shape is getting worse for the countries that can least afford it. Three pressures are loading onto the weakest balance sheets at once: the cost of adapting to a changing climate, a green transition that is dearest where capital is scarcest, and a fight against poverty that has stalled across Sub-Saharan Africa. The escalator of ever-more-open trade that earlier developers rode out of debt is slowing at the same time. The divide is not just wide. It is widening."

movements:
  - eyebrow: "The reframe"
    fig: "FIG. 1"
    dropCap: true
    question: "Does a big debt mean a country is in trouble?"
    claim: "Japan owes more than twice its yearly output and sleeps fine; Sri Lanka defaulted owing far less."
    explainer: "Japan's government owes about two and a third times everything the country earns in a year, and nobody expects it to miss a payment. It borrows in yen, a currency its own central bank prints, from savers who are mostly Japanese. Sri Lanka stopped paying its foreign creditors in 2022 while owing a little under one year of output. The gap between those two stories is not the size of the debt. It is what the debt is made of: which currency it is written in, who holds it, and whether it can be rolled over when it comes due. Read the bars and the colours together. High debt sits in calm rich economies and in the wreckage of collapse, side by side."
    captionLeft: "<b>Public debt</b> · % of GDP · latest year · green = calm advanced borrower, red = in distress"
    captionRight: "the level alone tells you little"
    source: "Source · UN Trade and Development (UNCTAD), A World of Debt 2025 · displayed with attribution"
    chart:
      id: "m1"
      dataRef: "debt-gdp-by-country"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    take:
      hope: "Most of the world's heaviest debts are owed by countries that can carry them indefinitely."
      despair: "Owing less than Japan was no protection for Sri Lanka, because its debt was the dangerous kind."
      confusion: "The single number everyone quotes, debt to GDP, is close to meaningless without knowing the currency and the creditor."
  - eyebrow: "The whole pile"
    fig: "FIG. 2"
    question: "And how much of that record pile is governments, anyway?"
    claim: "The world owes about two and a half times its yearly output, and roughly two-thirds of that is private, not government."
    explainer: "Step back from governments for a single chart and look at every dollar of debt on earth, sorted by who borrowed it. The record-breaking pile that fills the headlines is not mainly governments at all. Across the reporting economies, total credit runs to about two and a half times the world's annual output, and of that, governments owe only around a third. Companies owe roughly as much again, and households about a quarter. The mix has tilted since the 2008 crash: the government slice has swelled, from under a third toward two-fifths, while the household share has thinned. The rest of this piece follows that government third, because that is where a debt can curdle into a sovereign default, a currency collapse, a creditor that can take a country to court. The larger and quieter debt is owed by firms and families, in the rich world most of all."
    captionLeft: "<b>World debt by borrower</b> · share of total credit · governments vs companies vs households"
    captionRight: "mostly private"
    source: "Source · Bank for International Settlements, Total Credit Statistics · displayed and cited"
    chart:
      id: "m1b"
      dataRef: "debt-by-borrower"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    take:
      hope: "Most of the world's debt is owed by companies and households in wealthy economies that can comfortably carry it."
      despair: "Governments owe only a third of the pile, but that third holds every sovereign default and currency collapse in this piece."
      confusion: "The phrase 'world debt' bundles a Japanese mortgage with a Zambian dollar bond, two things that behave nothing alike."
  - eyebrow: "Two speeds"
    fig: "FIG. 3"
    question: "Is that government debt piling up evenly across the world?"
    claim: "Since 2010 the developing world's public debt has nearly quadrupled while the rich world's grew by two-thirds; the poorer countries' share of the global total has jumped from 16% to 31%."
    explainer: "Index every government's debt to its own 2010 level and the two worlds pull visibly apart. Developed-country debt, much the larger pile in dollars, rose by about two-thirds over fourteen years, a steady climb. Developing-country debt nearly quadrupled. The gap is not a story about China alone: strip China out and the developing line still more than doubles, far outrunning the rich world. Behind the divergence sits a simple asymmetry in the price of money. A poorer economy borrows dearer: tapping private bond markets it pays around six percent, against the two to four it pays on cheaper official loans, and well above what a wealthy government is charged. The same road or power line therefore leaves it a far bigger debt behind. Their share of all the world's public debt has climbed from 16% in 2010 to 31% now, even though these countries hold 39% of global output and are home to 83% of its people. The debt is migrating toward the economies least equipped to carry it."
    captionLeft: "<b>Public debt growth</b> · index, outstanding public debt 2010 = 100 · developing vs developed"
    captionRight: "two speeds"
    source: "Source · UNCTAD A World of Debt 2025 (IMF World Economic Outlook) · aggregated, displayed with attribution"
    chart:
      id: "m2d"
      dataRefs: ["debt-index-developing", "debt-index-developing-exchina", "debt-index-developed"]
      ymax: 400
      yTicks: [0, 100, 200, 300, 400]
      xTicks: [2010, 2014, 2018, 2024]
      x0: 2010
      x1: 2024
      series:
        - { name: "Developing countries", color: "despair", data: [[2010, 100], [2024, 383.2]] }
        - { name: "Developing excl. China", color: "ochre", data: [[2010, 100], [2024, 239.7]] }
        - { name: "Developed countries", color: "stone", data: [[2010, 100], [2024, 165.1]] }
    regional:
      label: "The price of money"
      note: "Official lenders charge a low, concessional rate; private markets charge more, and both jumped in 2023 as global rates climbed. The poorest borrow mostly official and cheap; the premium bites the middle-income countries that lean on the bond market."
      refs:
        - { ref: "borrowing-cost-private", name: "Private markets", color: "despair" }
        - { ref: "borrowing-cost-official", name: "Official lenders", color: "stone" }
    take:
      hope: "Borrowing is how a poorer country builds the roads, grids and schools a richer one already has."
      despair: "Public debt is now accumulating fastest exactly where the capacity to repay it is thinnest."
      confusion: "A faster-rising debt can mean a country is investing in its future or sliding into a trap, and the index alone cannot say which."
  - eyebrow: "The rising burden"
    fig: "FIG. 4"
    question: "How fast is that government debt actually growing?"
    claim: "Across emerging economies, government debt has more than doubled as a share of output since 2010, and interest now swallows nearly one revenue dollar in nine."
    explainer: "The World Bank's latest reckoning, in June 2026, puts hard numbers on the climb. Government debt across emerging market and developing economies has risen from under 37% of their combined output in 2010 to a projected 77% by 2026, more than doubling in fifteen years. China is much of that weight but not all of it: strip China out and the line still climbs from 38% to 56%. The cost follows the stock up. Net interest, the slice of government revenue that goes to creditors before anything else, has grown from about 7% in 2010 to an estimated 11% in 2025, one dollar in nine. And the market sorts the borrowers ruthlessly. When the pandemic hit in 2020, sovereign spreads on the weakest-rated economies blew out by about 520 basis points, against 190 for the investment-grade ones; when the Federal Reserve began raising rates in 2022, the gap was 310 against 30. The share of low- and middle-income countries in or near debt distress rose from about a quarter in 2015 to roughly half by 2026. And the deeper a country already is, the steeper each new step: the World Bank's own modelling finds that the same ten-point rise in debt that adds about 40 basis points to a lightly indebted government's borrowing rate adds nearer 190 to a stretched one. The burden is not just heavier. It is heaviest where the shoulders are weakest, and it compounds against them."
    captionLeft: "<b>EMDE government debt</b> · % of GDP · GDP-weighted · 2010–2026 (2025–26 projected)"
    captionRight: "the burden doubles"
    source: "Source · World Bank — Global Economic Prospects, June 2026 · CC BY 3.0 IGO"
    chart:
      id: "m1c"
      dataRefs: ["debt-emde-gdp", "debt-emde-gdp-exchina"]
      ymax: 80
      yTicks: [0, 20, 40, 60, 80]
      xTicks: [2010, 2015, 2020, 2026]
      x0: 2010
      x1: 2026
      valueSuffix: "%"
      annots: [{ x: 2020, label: "pandemic" }]
      series:
        - { name: "EMDEs", color: "despair", data: [[2010, 36.7], [2026, 76.9]] }
        - { name: "EMDEs excl. China", color: "ochre", data: [[2010, 37.9], [2026, 56.2]] }
    regional:
      label: "What it costs to carry"
      note: "Net interest payments have climbed from about 7% of government revenue in 2010 to an estimated 11% in 2025 — the rising toll of a bigger debt met at higher rates. Every point is revenue that never reaches a clinic or a classroom."
      refs:
        - { ref: "debt-emde-service", name: "Interest, % of revenue", color: "despair" }
    take:
      hope: "Borrowing at this scale built infrastructure and cushioned a pandemic, and for most of these economies it remains serviceable."
      despair: "The debt has doubled, the interest bill is climbing, and each further point of borrowing costs more the deeper a country already is, so the burden compounds against those least able to bear it."
      confusion: "A debt that doubles can mean a decade of investment or the approach of a wall, and the aggregate alone cannot tell the two apart."
  - eyebrow: "The divide"
    fig: "FIG. 5"
    question: "Is a heavy debt a rich-country luxury, or does it come for everyone?"
    claim: "In fifteen years Zambia's debt grew sixfold and it defaulted; Japan's drifted higher and nothing happened."
    explainer: "Watch four countries climb the same hill over fifteen years. Zambia's public debt ran from a fifth of its economy in 2010 to more than its entire output by 2024, and it stopped paying in 2020. Ghana more than doubled, then defaulted in 2022. Sri Lanka crept up and broke in that same year. Japan, meanwhile, drifted from about twice its output to two and a third times, the heaviest load on the chart, and never came near a default. The frontier economies had borrowed in dollars and euros from lenders who could turn and leave. Japan borrows in yen from its own savers, who stay. Same rising line, opposite ending."
    captionLeft: "<b>Public debt</b> · % of GDP · 2010–2024 · three frontier economies against Japan"
    captionRight: "same climb, opposite fate"
    source: "Source · UN Trade and Development (UNCTAD), A World of Debt 2025 · displayed with attribution"
    chart:
      id: "m2"
      dataRefs: ["debt-traj-japan", "debt-traj-zambia", "debt-traj-ghana", "debt-traj-srilanka"]
      ymax: 280
      yTicks: [0, 70, 140, 210, 280]
      xTicks: [2010, 2014, 2018, 2024]
      x0: 2010
      x1: 2024
      valueSuffix: "%"
      series:
        - { name: "Japan", color: "stone", data: [[2010, 205.9], [2024, 236.7]] }
        - { name: "Zambia", color: "despair", data: [[2010, 18.9], [2024, 114.9]] }
        - { name: "Ghana", color: "ochre", data: [[2010, 32.9], [2024, 70.5]] }
        - { name: "Sri Lanka", color: "uncertain", data: [[2010, 68.7], [2024, 99.4]] }
    take:
      hope: "Debt itself is not destiny: the country carrying the most is also the calmest."
      despair: "The frontier economies that borrowed least are the ones that broke, because they borrowed in the wrong money."
      confusion: "Two debts can rise along nearly the same path and end in opposite places, which makes any single warning level misleading."
  - eyebrow: "The currency trap"
    fig: "FIG. 6"
    question: "And what is a dangerous debt actually made of?"
    claim: "India owes almost nothing abroad; Ethiopia owes most of its debt to foreigners, in money it cannot print."
    explainer: "A debt owed at home, in your own currency, can be lived with: the central bank stands behind it and a falling exchange rate does not enlarge it. A debt owed abroad, in dollars or euros, cannot. This chart sorts countries by how much of their public debt is external. India and Brazil sit at the safe end, owing under a tenth of it to foreigners, because both built deep home markets that lend in rupees and reais. The frontier and Sub-Saharan economies sit at the other extreme. Ethiopia owes about three-fifths of its debt abroad; Ghana, Kenya and Sri Lanka roughly half. Economists call this original sin: a poor country cannot persuade foreigners to lend to it long-term in its own money, so it borrows in dollars and carries the currency risk itself. The danger is not the size of the debt but the money it is trapped in, and it falls hardest on the poorest. And because a foreign-currency debt does not shrink when the local currency weakens, a sliding exchange rate can swell the repayment bill overnight, turning a debt a country could comfortably afford into one it cannot, with nothing in its own budget able to stop it."
    captionLeft: "<b>External debt</b> · % of public debt owed to foreign creditors · latest year"
    captionRight: "borrowed at home, or abroad"
    source: "Source · UN Trade and Development (UNCTAD), A World of Debt 2025 · displayed with attribution"
    chart:
      id: "m3e"
      dataRef: "debt-external-share"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    take:
      hope: "Countries that build deep domestic debt markets, as India and Brazil have, largely escape the trap."
      despair: "The poorest economies owe most of their debt abroad, in currencies that grow more expensive exactly when they are in trouble."
      confusion: "External capital is both a lifeline for a poor economy and the fuse of most defaults, and which one shows depends on the year."
  - eyebrow: "The warning signs"
    fig: "FIG. 7"
    question: "If the level isn't the warning sign, what is?"
    claim: "India crosses three danger lines and is fine; Argentina crosses three and is in default, because India's are all the survivable kind."
    explainer: "Lenders watch a handful of tripwires that tend to come before a debt crisis, but they are not the same kind of warning. Three are external: reserves below three months of imports, short-term foreign debt larger than the reserves on hand, debt service eating more than a quarter of export earnings. These are what actually trigger a default, because they turn on foreign money a government cannot print and reserves it can run dry. The other three are domestic: debt above 70% of GDP, interest taking a fifth of revenue, interest outrunning the schools budget — a real burden, but in your own currency a survivable one. Read in colour, the chart sorts itself. India crosses three lines and not one is red: a heavy load carried safely in rupees, the same shape as Japan. Pakistan crosses five, on both sides of the ledger, and sits genuinely near the edge. And the defaulters read low for a telling reason: once Venezuela and Lebanon stopped paying, their external gauges fell quiet, leaving only domestic marks. So read the colour and the dagger, not the length: a tall amber bar is a burden a country can carry; a short red one can be a fuse."
    captionLeft: "<b>Red lines crossed</b> · six cited danger thresholds, split into external (red) and domestic (amber) · † = in default"
    captionRight: "two kinds of warning"
    source: "Source · UNCTAD A World of Debt 2025 + World Bank International Debt Statistics · composite, displayed not re-hosted"
    chart:
      id: "m3"
      dataRef: "debt-redlines-by-country"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    take:
      hope: "Most countries cross only the domestic lines, the kind a country can carry for decades in its own currency."
      despair: "The economies lit up in red, their reserves and export cover failing, are the ones a single shock could tip into default."
      confusion: "The same number of red lines can mean a survivable burden or an imminent default; only which lines, and in what currency, tells them apart."
  - eyebrow: "The hidden debt"
    fig: "FIG. 8"
    question: "What if the official debt number is the wrong number?"
    claim: "When Senegal audited its books in 2025, its debt jumped from 74% of output to 111% overnight, borrowing the previous government had never disclosed."
    explainer: "Every chart so far trusts the number a government reports. Sometimes that number is a fiction. Hidden debt is borrowing a state has already taken on but kept off its books, and when it surfaces the repricing is brutal. Senegal is the rawest recent case: an audit ordered by the government elected in 2024, released in early 2025, restated end-2023 debt from a reported 74% of GDP to 111%, and the deficit from 5% to 13%. An IMF programme froze, and the sovereign spread roughly doubled, from about 530 basis points to 940 in two months. Mozambique's was the notorious one. In 2016 it emerged that state firms had secretly borrowed about 1.15 billion dollars, near a tenth of the economy, partly for a tuna-fishing fleet; the revelation suspended its IMF programme, drove the spread up some 700 points toward 1,800, and growth fell from about 7% a year to 3.6%. The bars size seven such reveals. Across all of them the World Bank finds spreads rose about 250 basis points in the two months after disclosure, and even the small reveals stung, because the market reprices not just the new debt but the discovery that the books cannot be trusted."
    captionLeft: "<b>Debt revealed after concealment</b> · % of GDP added when hidden borrowing surfaced · seven episodes"
    captionRight: "the books were wrong"
    source: "Source · World Bank — Global Economic Prospects, June 2026, Box 3.1 (Manger et al. 2025) · CC BY 3.0 IGO"
    chart:
      id: "m3h"
      dataRef: "debt-hidden-revisions"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    take:
      hope: "Most of these debts surfaced through a government's own audit; transparency arriving, however late, is how the problem starts to get fixed."
      despair: "A debt nobody disclosed is on none of the warning charts until the day it detonates, and the market then punishes the concealment as much as the loan."
      confusion: "The reported debt is the foundation every gauge is built on, and these episodes show it can be quietly wrong by tens of points of GDP."
  - eyebrow: "The creditor"
    fig: "FIG. 9"
    question: "When a country can't pay, who is it failing to pay?"
    claim: "China's lending to the developing world grew roughly thirtyfold in two decades, from five billion dollars to over 150 billion, remaking who a country in trouble must answer to."
    explainer: "For most of the last century, a government in trouble owed Western banks and the Paris Club of rich-world governments, who sorted it out together at a table in Paris. Then China started lending. The stock of developing-country debt owed to Beijing ran from about five billion dollars in 2000 to over a hundred and fifty billion by 2023, a thirtyfold climb that made China the developing world's largest single government creditor. As some of those loans soured, the consequence shows up in the chart above: China's share of the world's defaulted debt rose from barely one percent in 1990 to close to a quarter, level with the entire Paris Club. The change matters because creditors who do not coordinate are far harder to bargain with. A restructuring that once needed a dozen rich governments to agree now waits on Beijing, private funds and the old club at once, each with its own rules and its own idea of patience."
    captionLeft: "<b>Who the world's defaulted debt is owed to</b> · share by creditor · 5-year smoothed"
    captionRight: "1980 — 2024"
    source: "Source · BoC–BoE Sovereign Default Database 2025 · Bank of Canada, with attribution"
    chart:
      id: "m5"
      dataRef: "debt-creditor-history"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    regional:
      label: "The lending boom behind the shift"
      note: "Developing-country debt owed to China ran from a rounding error in 2000 to over 150 billion dollars, much of it in Africa and the lowest-income borrowers. The bilateral loans came fast and cheap; restructuring them, when they sour, has proved slow."
      refs:
        - { ref: "debt-owed-china", name: "Owed to China", color: "despair" }
    take:
      hope: "Private bondholders, the hardest creditors to restructure, hold well under a fifth of the defaulted total."
      despair: "With official lending split between Beijing and the West, the system for fixing a default is jammed."
      confusion: "Who holds the debt now decides how fast a crisis can be resolved, and the holders no longer agree."
  - eyebrow: "The cost"
    fig: "FIG. 10"
    question: "How much of a government's money does the debt eat, and what does it crowd out?"
    claim: "Pakistan spends about sixty cents of every tax dollar on interest; Nigeria pays six and a half times as much on interest as on its schools."
    explainer: "Before a government pays a nurse or fixes a road, it must first meet the interest on what it already owes. In Pakistan that first claim now takes about sixty cents of every dollar the state collects; Sri Lanka and Egypt hand over more than half. Lenders treat a fifth of revenue as the warning line, and sixty-one developing countries are already past a tenth. But the sharpest way to see the cost is to set interest against a single thing it displaces. UNCTAD divides interest payments by public spending on education: above one, a country pays its creditors more than its schools. Nigeria sits at six and a half. Sri Lanka is near five, Lebanon just above four. The debt was real and most of it bought real things, yet the bill is now paid in classrooms that were never built. Counting health alongside schools, 46 developing countries spend more on interest than on either, and about 3.4 billion people, more than two in five of humanity, live in one of them."
    captionLeft: "<b>The cost in classrooms</b> · interest payments ÷ education spending · above 1× = more on debt than schools"
    captionRight: "what gets crowded out"
    source: "Source · UNCTAD A World of Debt 2025 · displayed with attribution"
    chart:
      id: "m6"
      dataRef: "debt-cost-classrooms"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    take:
      hope: "Most large economies stay well under the line, spending far more on people than on interest."
      despair: "For the worst-hit, a generation's schooling is being mortgaged to bondholders."
      confusion: "The same loans that built infrastructure now compete directly with the next generation's education."
  - eyebrow: "The reversal"
    fig: "FIG. 11"
    question: "Is the money at least still flowing toward these countries?"
    claim: "After global rates rose, private creditors swung from financing developing countries to draining them, by more than 230 billion dollars a year."
    explainer: "Debt is supposed to move money toward a developing country: a loan arrives, a grid or a port gets built, the repayments come later out of the growth it paid for. Through the 2010s it did, and private money led the way, with bondholders and banks sending well over a hundred billion dollars a year, on net, into the developing world by 2014. Then global interest rates jumped. In 2022 the private line did not just shrink, it inverted. Private creditors took roughly a hundred billion dollars more out than they put in, and did the same again in 2023. Official lenders, the IMF, the World Bank and bilateral governments among them, kept their own flows positive and cushioned part of the blow, but not enough to stop the total turning negative for the first time since the debt-relief years. The capital a developing economy most needs to keep arriving has, for now, gone into reverse."
    captionLeft: "<b>Net transfers on developing-country debt</b> · US$ billions a year · private vs official creditors"
    captionRight: "the arrow flips"
    source: "Source · World Bank — International Debt Statistics · CC BY 4.0"
    chart:
      id: "m9n"
      dataRefs: ["net-transfers-private", "net-transfers-official"]
      ymin: -120
      ymax: 200
      yTicks: [-100, 0, 100, 200]
      xTicks: [2010, 2014, 2018, 2023]
      x0: 2010
      x1: 2023
      valueSuffix: "bn"
      annots: [{ x: 2022, label: "rates spike" }]
      series:
        - { name: "Private creditors", color: "despair", data: [[2010, 45.5], [2023, -100.1]] }
        - { name: "Official creditors", color: "stone", data: [[2010, 40.2], [2023, 51.1]] }
    take:
      hope: "Official lenders kept money flowing in even as private creditors fled, and a reversal driven by high rates can ease when rates fall."
      despair: "Private capital is now flowing out of the developing world on net, draining the economies that most need it to keep arriving."
      confusion: "Money leaving a country can mean it is repaying past loans on schedule or being abandoned by its lenders, and the flow alone cannot say which."
  - eyebrow: "The climate bill"
    fig: "FIG. 12"
    question: "And what new bills are landing on the countries least able to pay?"
    claim: "The countries most exposed to climate change are the same ones with the least room to borrow to adapt."
    explainer: "There is a cruel overlap buried in the data, if not a perfect one. Rank the world by exposure to climate change, using the ND-GAIN index of how much harm a warming planet will do and how poorly a country can cope, and the top of the list reads like a roll-call of the debt-distressed: Chad, Niger, Somalia, the Democratic Republic of Congo, Ethiopia. Ethiopia, among the most exposed on earth, already owes about three-fifths of its public debt abroad and has itself stopped paying; DR Congo is a recent defaulter too. These are the places that most need to spend on flood defences, drought-resistant seed and seawalls, at the very moment their debt forecloses the borrowing to build any of it. The overlap is not iron. India scores high on the same exposure index yet owes under a tenth of its debt abroad, and is largely spared. But for the poorest, the bill for a warming climate falls heaviest exactly where the means to meet it is thinnest."
    captionLeft: "<b>Climate vulnerability</b> · ND-GAIN index · 0 = safest, higher = more exposed and less able to cope"
    captionRight: "the exposed are the indebted"
    source: "Source · Notre Dame Global Adaptation Initiative (ND-GAIN) · displayed and cited"
    chart:
      id: "m8c"
      dataRef: "climate-vulnerability-by-country"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    take:
      hope: "Debt-for-climate swaps and new adaptation funds are early attempts to break this overlap."
      despair: "The places that did least to warm the planet must spend the most to survive it, with the least ability to borrow."
      confusion: "Adaptation is an investment that pays for itself over decades, which is exactly the horizon a debt crisis destroys."
  - eyebrow: "The closing exit"
    fig: "FIG. 13"
    question: "Can poor countries still grow their way out, the way earlier ones did?"
    claim: "World trade stopped opening around 2008, closing the export escalator that lifted Korea and China."
    explainer: "The standard cure for a debt problem is growth, and for sixty years the surest path to growth was selling into a steadily more open world. Trade climbed from a quarter of global output in 1970 to nearly sixty percent by 2008. Then it stalled. Supply chains began to shorten, tariffs crept back, and rich countries started reshoring and friend-shoring the production they had once scattered around the globe. Korea and China rode the open-trade escalator from poverty to wealth in a few decades. The frontier economies now carrying the heaviest debts have reached the bottom of that escalator just as it grinds to a stop. The exit that worked for earlier developers is quietly narrowing."
    captionLeft: "<b>World trade</b> · exports + imports, % of global GDP"
    captionRight: "1970 — 2023"
    source: "Source · World Bank — World Development Indicators · CC BY 4.0"
    chart:
      id: "m9g"
      dataRef: "globalization-trade"
      ymax: 70
      yTicks: [0, 20, 40, 60]
      xTicks: [1970, 1985, 2000, 2023]
      x0: 1970
      x1: 2023
      annots: [{ x: 2008, label: "peak openness" }]
      valueSuffix: "%"
      series:
        - { name: "Trade", color: "uncertain", data: [[1970, 25.8], [2023, 58.2]] }
    take:
      hope: "Services, digital trade and regional African markets may open new escalators the old map misses."
      despair: "The one development model with a proven record is closing just as the poorest economies queue to use it."
      confusion: "Whether trade has truly peaked or merely paused is genuinely unsettled, and the answer changes everything."
  - eyebrow: "The poorest"
    fig: "FIG. 14"
    question: "And where does all of this leave the world's poorest?"
    claim: "Extreme poverty has all but vanished in Asia, yet in Sub-Saharan Africa it has barely moved and sits near 45%."
    explainer: "Two generations of progress against poverty happened mostly in Asia. South Asia drove extreme poverty from more than half its people in the early 1980s to under four percent today, and the world line followed it down. Sub-Saharan Africa did not follow. Its rate has fallen only from about two-thirds in 1990 to forty-five percent now, and the absolute number of poor people there has risen, because the population grew faster than poverty fell. Almost six in ten of the world's extreme poor now live in the region. This is where debt does its quietest harm, taking the revenue that might have built the schools and clinics that turn growth into fewer poor."
    captionLeft: "<b>Extreme poverty</b> · % below $2.15/day · Sub-Saharan Africa vs South Asia vs the world"
    captionRight: "the great divergence"
    source: "Source · World Bank — Poverty and Inequality Platform · CC BY 4.0"
    chart:
      id: "m10p"
      dataRefs: ["extreme-poverty-ssf", "extreme-poverty-sas", "extreme-poverty-world"]
      ymax: 70
      yTicks: [0, 20, 40, 60]
      xTicks: [1990, 2000, 2010, 2024]
      x0: 1990
      x1: 2024
      valueSuffix: "%"
      series:
        - { name: "Sub-Saharan Africa", color: "despair", data: [[1990, 64.6], [2024, 45.1]] }
        - { name: "South Asia", color: "hope", data: [[1990, 49], [2024, 3.8]] }
        - { name: "World", color: "stone", data: [[1990, 38], [2024, 10.4]] }
    countries:
      label: "<b>The poorest, by country</b> · share below $2.15/day, latest year"
      note: "The countries deepest in debt are the same ones deepest in poverty. DR Congo, Mozambique and Zambia, all recent defaulters, each leave most of their people below the line."
      ref: "extreme-poverty-by-country"
    take:
      hope: "Africa's poverty rate is still falling, and its young population could yet power a catch-up."
      despair: "Where poverty is most stubborn, debt service is draining the budget that might have ended it."
      confusion: "A falling rate and a rising headcount are both true at once, so progress and failure share the same chart."
  - eyebrow: "The reckoning"
    fig: "FIG. 15"
    question: "Add all of this up: how many countries are actually caught?"
    claim: "Half the world's low-income countries are now in debt distress or close to it, twice the share of a decade ago."
    explainer: "Every pressure in this section, the climate bill, the closing trade exit, the interest crowding out schools, the money flowing back out, lands finally as a single count. The IMF and World Bank grade every low-income country on a four-rung scale of how likely it is to be overwhelmed by what it owes, refreshed each month; counting the top two rungs turns the red-lines diagnosis into a running tally. In 2013 fifteen of these countries, about one in five, were rated in distress or at high risk of it. By 2019 the figure had passed thirty, and it has hovered near half the group ever since, cresting at thirty-seven in 2022. The number actually in distress, no longer merely close to it, rose from two to around ten over the same span. The plateau since is the genuinely ambiguous part. It can be read as the wave finally breaking, or as a queue of unresolved cases held in place by emergency loans and paused payments that no one has yet worked through. Either way, a single decade doubled the share of the poorest economies living one shock from a debt they cannot manage."
    captionLeft: "<b>Low-income countries at risk</b> · count rated in debt distress or at high risk of it"
    captionRight: "the danger zone, 2013 — 2026"
    source: "Source · IMF–World Bank Debt Sustainability Framework, List of LIC DSAs · displayed and cited"
    chart:
      id: "m11d"
      dataRefs: ["distress-zone", "distress-indefault"]
      ymax: 40
      yTicks: [0, 10, 20, 30, 40]
      xTicks: [2013, 2018, 2022, 2026]
      x0: 2013
      x1: 2026
      annots: [{ x: 2022, label: "the 2022 peak" }]
      series:
        - { name: "In distress or at high risk", color: "ochre", data: [[2013, 15], [2026, 32]] }
        - { name: "Already in debt distress", color: "despair", data: [[2013, 2], [2026, 9]] }
    take:
      hope: "The count stopped climbing after 2022 and has edged down, a sign the worst of the wave may have passed."
      despair: "About half of all low-income countries now sit one shock away from a debt they cannot service, twice the share of 2013."
      confusion: "Whether the plateau is recovery or a frozen backlog of cases no one has resolved is exactly what cannot yet be said."
  - eyebrow: "The human cost"
    fig: "FIG. 16"
    question: "And what does a default actually feel like to the people inside it?"
    claim: "The year Sri Lanka defaulted, prices rose by half; a lifetime of savings lost a third of its worth in twelve months."
    explainer: "A default is an abstraction until you watch what it does to a shopping basket. When a government stops paying its foreign creditors, its currency falls, and the price of everything the country imports, fuel, medicine, cooking gas, rice, climbs almost overnight. These are the same three frontier economies from earlier, now traced through the cost of living around the year each one broke. Sri Lanka's inflation ran from about 2% before the crisis to nearly 50% in 2022, the year it defaulted and queues for fuel and gas stretched around city blocks. Ghana's reached almost 40%, Zambia's past 20%. At fifty percent inflation a year, money set aside for a child's schooling or an old age loses a third of its purchasing power in twelve months, while wages lag behind. The dollars in default are a small number on a balance sheet. The price of bread is not."
    captionLeft: "<b>Consumer-price inflation</b> · % per year · the cost-of-living shock around each default"
    captionRight: "what the break feels like"
    source: "Source · World Bank — World Development Indicators · CC BY 4.0"
    chart:
      id: "m11i"
      dataRefs: ["inflation-srilanka", "inflation-ghana", "inflation-zambia"]
      ymax: 55
      yTicks: [0, 10, 20, 30, 40, 50]
      xTicks: [2018, 2020, 2022, 2024]
      x0: 2018
      x1: 2024
      annots: [{ x: 2020, label: "Zambia defaults" }, { x: 2022, label: "Sri Lanka & Ghana default" }]
      valueSuffix: "%"
      series:
        - { name: "Sri Lanka", color: "despair", data: [[2018, 2.1], [2024, -0.4]] }
        - { name: "Ghana", color: "ochre", data: [[2018, 7.8], [2024, 22.8]] }
        - { name: "Zambia", color: "uncertain", data: [[2018, 7.5], [2024, 15]] }
    take:
      hope: "The worst spikes pass: Sri Lanka's inflation fell back to near zero within two years of the break."
      despair: "The damage lands on people who never borrowed a cent, as their savings and wages are quietly halved."
      confusion: "A default rescues a government's balance sheet by wrecking its citizens' cost of living first, so relief and ruin arrive together."
  - eyebrow: "Outgrown"
    fig: "FIG. 17"
    question: "Do these mountains of debt ever actually get repaid?"
    claim: "Britain owed 270% of its output after 1945 and never paid it back; growth and inflation melted it to a third of that by 1970."
    explainer: "The same force that gutted Sri Lankan savings has a second face. After 1945 Britain's government owed about 270% of everything the country produced, a heavier load than any frontier economy carries today, and the United States owed 121%. Neither ran the brutal surpluses that paying it down would have demanded. The mountains shrank anyway. A generation of growth lifted the denominator while mild, steady inflation and interest rates held below it quietly taxed the people holding the bonds, a transfer from savers to the state that economists call financial repression and reckon ran to several percent of output a year. By 1970 Britain was near 73% and still falling, the United States near 36%. The catch is the whole argument of this piece in one line. That escape works only when the debt is long-dated, owed at home, and written in a currency you control. Borrow short, abroad, in dollars, and inflation does the opposite, swelling the debt instead of dissolving it. The rich world's way out is bolted shut to the countries that need it most."
    captionLeft: "<b>Public debt</b> · % of GDP · how the last great debt mountain came down"
    captionRight: "1900 — 2015"
    source: "Source · IMF Historical Public Debt Database · with attribution"
    chart:
      id: "m12h"
      dataRefs: ["debt-history-uk", "debt-history-us"]
      ymax: 280
      yTicks: [0, 70, 140, 210, 280]
      xTicks: [1900, 1930, 1960, 1990, 2015]
      x0: 1900
      x1: 2015
      valueSuffix: "%"
      annots: [{ x: 1946, label: "WW2 peak" }]
      series:
        - { name: "United Kingdom", color: "stone", data: [[1900, 32.4], [2015, 89]] }
        - { name: "United States", color: "uncertain", data: [[1900, 6.5], [2015, 105.2]] }
    take:
      hope: "The largest debt loads in modern history were carried, then dissolved, without default or collapse."
      despair: "The mechanism was a quiet tax on savers, and it is unavailable to a country that borrows abroad in dollars."
      confusion: "Whether a debt melts away or hardens into a crisis turns on its currency and its holders, not its size, the same as ever."
  - eyebrow: "Coming back"
    fig: "FIG. 18"
    question: "Once a country falls into a debt crisis, does it ever climb out?"
    claim: "The share of world debt in default has fallen from 6.4% in 1990 to under half a percent today."
    explainer: "Debt crises feel permanent from inside them, and yet the record says most are survived. At the start of the 1990s, after a decade of Latin American and African defaults, more than six cents of every dollar of public debt on earth was not being paid. Then came a long run of restructurings, write-downs and the relief programmes that cleared the poorest countries' books. By 2024 the figure had fallen below half a cent. The stock of broken debt did not vanish so much as get worked through, country by country, deal by deal. A default looks less like a death than a hard weather event. Painful, sometimes drawn out for years, but rarely the end of the story."
    captionLeft: "<b>World debt in default</b> · % of all public debt"
    captionRight: "1980 — 2024"
    source: "Source · BoC–BoE Sovereign Default Database 2025 · Bank of Canada, with attribution"
    chart:
      id: "m7"
      dataRef: "default-rate-world"
      ymax: 8
      yTicks: [0, 2, 4, 6, 8]
      xTicks: [1980, 1990, 2000, 2010, 2024]
      x0: 1980
      x1: 2024
      annots: [{ x: 1990, label: "the 1980s debt crisis" }]
      valueSuffix: "%"
      series:
        - { name: "Share in default", color: "hope", data: [[1980, 1.61], [2024, 0.41]] }
    take:
      hope: "The world is far better at resolving debt crises than it was a generation ago."
      despair: "Resolution often means a lost decade first, paid for by the country's poorest."
      confusion: "The tools work, but slowly, and a country can spend years in limbo before relief arrives."
  - eyebrow: "The haircut"
    fig: "FIG. 19"
    question: "When a country does stop paying, what happens to the money?"
    claim: "Across two centuries of defaults, creditors have lost about 45 cents on the dollar on average, almost never the whole of it."
    explainer: "When Argentina restructured in 2005, the investors holding its bonds were handed new ones worth about a quarter of the old, a loss of roughly seventy-seven cents on the dollar. Iraq's creditors, after the 2003 war, lost closer to ninety. Greece's, in 2012, about sixty-five. These sound like wipeouts, and for an individual lender they can be. Step back across two hundred years and 327 restructurings, though, and the average loss settles near forty-five cents on the dollar, a figure that has barely moved since 1815. Defaults are almost always partial. A government that stops paying is not refusing the debt so much as forcing a renegotiation of it, and creditors, knowing they will get most of it back, keep coming back to lend. The catch sits on the other side of the table. The size of the cut tracks power more than fairness. Uruguay, restructuring early and politely in 2003, gave up barely a tenth, while the deepest losses fell on the collapses with the least left to bargain with. And a deal that closes on paper can still take a lost decade to reach."
    captionLeft: "<b>What creditors lose</b> · present-value haircut in selected restructurings · % · dashed = 200-year average"
    captionRight: "default is partial"
    source: "Source · Cruces & Trebesch 2013; Graf von Luckner et al. 2024; Zettelmeyer et al. 2013 · displayed and cited"
    chart:
      id: "m13h"
      dataRef: "restructuring-haircuts"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    take:
      hope: "Creditors recover most of their money and markets reopen, which is why lending survives every default."
      despair: "How deep the loss cuts is decided by leverage, not justice, and the country still pays in lost years."
      confusion: "A successful restructuring still means someone lost half their money and a country lost a decade, so resolution and damage are the same event."
  - eyebrow: "The safety net"
    fig: "FIG. 20"
    question: "And who keeps coming back to the lender of last resort?"
    claim: "Ukraine has signed thirteen IMF arrangements since 1992; a string of poor countries have spent most of the years since under one programme or another."
    explainer: "The IMF is the institution a government turns to when no one else will lend. For some countries that turn has become a habit. Counting every financing arrangement since 1992, Ukraine leads with thirteen, Pakistan and Armenia with eleven apiece, and a long tail of small economies, Senegal, Rwanda, Mozambique, Burkina Faso, sits just behind, most having spent more of the period inside a Fund programme than outside one. The colour marks two different stories. The red bars are crisis bailouts, the emergency loans that follow a currency collapse. The grey bars are concessional programmes for low-income countries, cheaper and longer, that roll over almost without a break. One caveat sits under the count: it begins in 1992, as far back as the Fund's public database reaches. Argentina's famous tally of about twenty-one arrangements runs back to 1958; over the past three decades alone it sits at eight. Whether a repeat customer is being rescued or merely managed is the one thing the chart cannot settle."
    captionLeft: "<b>IMF arrangements since 1992</b> · count per country · red = crisis bailouts, grey = concessional programmes"
    captionRight: "the regulars"
    source: "Source · IMF Monitoring of Fund Arrangements (MONA) · displayed and cited"
    chart:
      id: "m14i"
      dataRef: "imf-arrangements-by-country"
      ymax: 1
      yTicks: [0, 1]
      xTicks: [0, 1]
      series: []
    take:
      hope: "A working lender of last resort means a country in crisis is rarely left entirely on its own."
      despair: "For a string of poor economies the Fund has become less a rescue than a permanent supervisor of the books."
      confusion: "Going back to the IMF can mean the safety net is working or that nothing underneath it ever gets fixed."
  - eyebrow: "The verdict"
    fig: "FIG. 21"
    question: "So is the world drowning in debt?"
    claim: "The pile is at record size, but only a small, concentrated tail is actually drowning."
    explainer: "Two facts have to be held at once. The dollars in default come to about 425 billion, a rounding error against total public debt, under half of one percent. Yet they are owed by a great many countries: roughly 86 sovereigns carry some defaulted debt, down from over a hundred in the 1990s but still a large share of the developing world. Thirteen of them hold ninety percent of the dollars, named below, running from petrostate collapse in Venezuela through sanctioned Russia to the frontier defaulters. For most of the planet, a bigger debt bought roads, pensions and pandemic survival without any crisis. For that tail, the same instrument meant default and lost decades. Whether the world is drowning depends almost entirely on which group you happen to be born into."
    captionLeft: "<b>Total sovereign debt in default</b> · US$ billions"
    captionRight: "1960 — 2024"
    source: "Source · BoC–BoE Sovereign Default Database 2025 · Bank of Canada, with attribution"
    chart:
      id: "m8"
      dataRef: "defaults-total-world"
      ymax: 600
      yTicks: [0, 200, 400, 600]
      xTicks: [1960, 1980, 2000, 2024]
      x0: 1960
      x1: 2024
      annots: [{ x: 2013, label: "recent peak" }]
      series:
        - { name: "In default", color: "ochre", data: [[1960, 13.4], [2024, 425]] }
    countries:
      label: "<b>Who actually holds it</b> · US$ billions in default · 2024"
      note: "Thirteen sovereigns hold about 92% of the world's defaulted debt. The roster mixes petrostate collapse, sanctioned and conflict states, and frontier defaulters, which is why no single villain explains it."
      ref: "defaults-by-country"
    take:
      hope: "Measured against the world's total debt, the part actually in crisis is tiny and contained."
      despair: "For the thirteen countries that are most of that total, the crisis is the whole of life."
      confusion: "A number this concentrated cannot be answered with a single global verdict, which is the honest finding."

pullQuote:
  text: "The question is never how much a country owes. It is what the debt is made of, and who is born holding it."
  cite: "the through-line of this piece"

lenses:
  - who: "An emerging-market finance minister"
    confidence: "Lives the numbers daily"
    hope: "Restructuring frameworks exist, and the IMF door is open when the math stops working."
    despair: "Half my revenue can vanish into interest before a single road is built, and a creditor I cannot vote out sets my rate."
  - who: "A sovereign bondholder"
    confidence: "Prices the risk for a living"
    hope: "Defaults are rarer and better-resolved than the headlines suggest, and recovery values have held."
    despair: "When official and Chinese lending will not coordinate, my restructuring can sit frozen for years."
  - who: "A teacher in a high-interest country"
    confidence: "Sees the cost directly"
    despair: "The class sizes grew and the new school never came, while the interest line in the budget kept rising."
    hope: "Debt relief, when it finally lands, has reopened school doors before."
  - who: "A debt-restructuring negotiator"
    confidence: "At the table"
    hope: "Even the hardest cases get worked through eventually; the record is one of resolution, not ruin."
    despair: "The old Paris Club logic is gone, and no one has built the thing that replaces it."
  - who: "An economic historian"
    confidence: "Takes the long view"
    hope: "Sovereign default is as old as sovereign debt, and the world keeps lending because the world keeps recovering."
    despair: "Every era believes its debts are different, and the tail of ruined countries is never empty."

hopeCase: "Step back far enough and the debt story bends toward competence. The share of world debt in default has fallen roughly fifteen-fold since 1990. The crisis tail is small and shrinking as a fraction of the whole, the tools to resolve a default are real, and for most countries a larger balance sheet has financed genuine progress without catastrophe. The largest debt the modern world ever carried, Britain's after 1945, was not repaid but outgrown and gently inflated away. Even the defaults that do happen are partial: creditors lose less than half their money on average and keep lending, so the road back to markets rarely stays closed for long. Borrowing is how a poor country builds a school before it can afford one. Most of the time, it works."

despairCase: "Step close and the same data turns grim. For a concentrated group of countries, debt has stopped being a tool and become a sentence. Interest now outranks education spending across dozens of governments. A currency slide can double the burden through no fault of the borrower, and the rate that triggers it is set abroad. The system for fixing a default has broken down just as the creditor base fragmented. Worse, the bills are growing: the cost of adapting to a changing climate, a green transition priced out of reach, a closing trade era, and a fight against poverty that has stalled across Sub-Saharan Africa, all landing on the balance sheets least able to bear them. For the people inside that tail, the lost decade is not a statistic."

whatWouldChangeIt: "Watch the tail, not the total. The number that matters is not global debt to GDP but how many countries cross four or more of the danger lines, and whether the interest-versus-schools ratio keeps climbing across the poorer world. A working successor to the Paris Club, one that includes China and private creditors, would speed resolution and shrink the lost decades. Debt contracts that absorb shocks on their own, with clauses that pause payments when a hurricane or a price collapse hits so a cash crunch never hardens into a default, would protect the most vulnerable borrowers before the crisis rather than after. Cheaper capital for clean energy in poor countries, and debt-for-climate swaps that trade relief for adaptation, would ease the tightening directly. Faster on all of these, and the hope case wins. If the tail instead widens as the new bills land, the verdict tilts."

methodology:
  - term: "The composites are counts and positions, not scores"
    detail: "The red-lines chart counts how many of six named, cited thresholds a country breaches, split into two families rather than flattened into one bar. Three are external/liquidity, the lines that actually trigger a default (Guidotti-Greenspan short-term-debt-to-reserves; reserves under three months of imports; debt service over a quarter of exports); three are domestic/fiscal, a heavy but in one's own currency survivable load (debt over 70% of GDP; interest over a fifth of revenue; interest above education spending). The bar is a stacked count of each family, never a weighted index, so a country deep in domestic lines but with none external — India, like Japan — reads as heavy, not in danger. Each line is evaluated on the latest year available for its indicator, so a single country's checks can span several years; a defaulted country's interest-based gauges in particular can rest on stale or post-default values, which is why the daggers, not the bar length, carry the warning."
  - term: "The gauges lie where a country has defaulted"
    detail: "A country that has stopped paying posts an artificially low interest-to-revenue figure, because it is no longer paying that interest. Such countries are flagged with a dagger and are never read as healthy on the strength of a low score. The distortion is itself a finding about how debt data thins out exactly where crisis is deepest."
  - term: "Data availability and sourcing"
    detail: "Public-debt and interest-to-spending figures are UNCTAD's (A World of Debt 2025), displayed and cited under the publication's terms rather than re-hosted. Liquidity gauges and the net-transfer flows are World Bank International Debt Statistics (CC BY 4.0). The default census is the BoC–BoE Sovereign Default Database, reused with attribution. The century-long debt arc is the IMF Historical Public Debt Database, reused with IMF attribution. Restructuring haircuts are transcribed from the published academic tables (Cruces–Trebesch and successors), displayed and cited but not re-hosted as a file."
  - term: "The distress count reads the IMF's own list"
    detail: "The count of low-income countries in debt distress or at high risk is the IMF–World Bank Debt Sustainability Framework rating, totalled across all PRGT-eligible countries. The IMF overwrites that list at a single web address each month, so the historical points here are read from dated Internet Archive captures of the list, one per year, using the IMF's own summary count where it is printed. The as-of dates fall in different months, so the line is annual, not to-the-day."
  - term: "Hidden debt is sized with one consistent proxy"
    detail: "The hidden-debt chart sizes each revelation by the World Bank's comparable measure across all seven episodes — the revision between data vintages in its International Debt Statistics (Manger et al. 2025). A country's own audit can restate debt by more: Senegal's 2025 audit moved reported end-2023 debt from 74% to 111% of GDP, larger than the vintage proxy charted. Both figures are the World Bank's; the chart uses the proxy that is comparable country to country, the prose quotes the audit."
  - term: "Prose and number audit"
    detail: "Explanatory text was drafted with AI assistance and then checked line by line against the derived data series; every quantitative claim traces to a figure produced by the project's pipeline. No outside numbers were introduced. The June 2026 update adds the World Bank's Global Economic Prospects (figure 3.1 and box 3.1) for the EMDE-aggregate debt and debt-service series and the hidden-debt revisions, re-hosted with attribution under CC BY 3.0 IGO. The non-linearity figures cited at FIG. 4 — how many basis points a given rise in debt adds at different debt levels — are the report's own published model estimates (its figure 3.4), cited rather than re-derived by this project's pipeline."

sources:
  - id: "unctad-wod"
    name: "UN Trade and Development (UNCTAD) — A World of Debt 2025"
    url: "https://unctad.org/publication/world-of-debt"
    license: "UNCTAD publication terms (display + cite); underlying indicators UNCTAD Data Hub, CC BY 3.0 IGO"
    vintage: "2025"
    note: "Public debt %GDP, interest-to-revenue, interest-to-education and interest-to-health ratios, creditor composition; 200 countries."
  - id: "worldbank-ids"
    name: "World Bank — International Debt Statistics"
    url: "https://databank.worldbank.org/source/international-debt-statistics"
    license: "CC BY 4.0"
    vintage: "2024"
    note: "Short-term debt to reserves, reserves in months of imports, debt service as a share of exports; net transfers on external public debt by creditor type (the reversal chart), low & middle income."
  - id: "bis-tc"
    name: "Bank for International Settlements — Total Credit Statistics"
    url: "https://data.bis.org/topics/TOTAL_CREDIT"
    license: "BIS terms — link-only"
    vintage: "2025"
    note: "Credit to governments, non-financial corporations and households, % of GDP, all reporting countries; the world-debt-by-borrower composition."
  - id: "ndgain"
    name: "Notre Dame Global Adaptation Initiative — ND-GAIN Country Index"
    url: "https://gain.nd.edu/our-work/country-index/"
    license: "ND-GAIN — link-only (licence unstated)"
    vintage: "2026"
    note: "Climate vulnerability score (exposure, sensitivity, adaptive capacity); the climate double-bind chart."
  - id: "wb-trade-poverty"
    name: "World Bank — World Development Indicators & Poverty and Inequality Platform"
    url: "https://data.worldbank.org"
    license: "CC BY 4.0"
    vintage: "2024"
    note: "Trade as a share of world GDP; extreme-poverty headcount ratios by region; consumer-price inflation around recent sovereign defaults."
  - id: "worldbank-gep"
    name: "World Bank — Global Economic Prospects, June 2026"
    url: "https://www.worldbank.org/en/publication/global-economic-prospects"
    license: "CC BY 3.0 IGO"
    vintage: "2026 (data cutoff 2 June 2026)"
    note: "Aggregate EMDE government debt as a share of GDP and net interest as a share of revenue (figure 3.1); debt-stock revisions from hidden-debt revelations (box 3.1). Cite: World Bank. 2026. Global Economic Prospects, June 2026. The market-spread series in the same figures (J.P.Morgan, Moody's, Haver) are cited, not re-hosted."
  - id: "imf-dsf"
    name: "IMF–World Bank Debt Sustainability Framework — List of LIC DSAs"
    url: "https://www.imf.org/external/pubs/ft/dsa/dsalist.pdf"
    license: "IMF — published risk ratings (facts); displayed and cited, source PDF not re-hosted"
    vintage: "2013–2026"
    note: "Count of PRGT-eligible low-income countries rated in debt distress or at high risk, read from the monthly DSA lists (Internet Archive captures, one per year)."
  - id: "imf-mona"
    name: "IMF — Monitoring of Fund Arrangements (MONA)"
    url: "https://www.imf.org/external/np/fin/mona/"
    license: "IMF — arrangement records (facts); displayed and cited, source files not re-hosted"
    vintage: "1992–2026"
    note: "Count of IMF financing arrangements per country, 1992 onward (historical + current MONA files merged and deduplicated); the serial-borrower ranking. Pre-1992 arrangements are not in MONA."
  - id: "boc-boe"
    name: "Bank of Canada & Bank of England — Sovereign Default Database 2025"
    url: "https://www.bankofcanada.ca/2025/10/staff-analytical-note-2025-24/"
    license: "Bank of Canada — reuse with attribution"
    vintage: "2025"
    note: "Sovereign debt in default 1960–2024, by creditor and instrument; share of world public debt."
  - id: "imf-hpdd"
    name: "IMF — Historical Public Debt Database"
    url: "https://www.imf.org/external/datamapper/datasets/DEBT"
    license: "IMF — data reuse with attribution"
    vintage: "2015"
    note: "General government debt as a share of GDP, 1900–2015, for the United Kingdom and United States; the century-long debt arc (fetched via the DBnomics mirror)."
  - id: "trebesch"
    name: "Sovereign-debt haircut studies (Cruces & Trebesch 2013; Graf von Luckner et al. 2024; Zettelmeyer et al. 2013)"
    url: "https://www.nber.org/papers/w32599"
    license: "Academic datasets — link-only (displayed and cited, not re-hosted)"
    vintage: "2013–2024"
    note: "Present-value creditor losses in selected sovereign restructurings, and the ~45% two-century average; the haircut chart."

revisions:
  - { date: "2026-06-23", text: "Deepened the red-lines warning chart (FIG. 7). The six danger thresholds are now split into <b>external/liquidity</b> (the lines that actually trigger a default) and <b>domestic/fiscal</b> (a heavy but, in one's own currency, survivable load), drawn as a two-colour stacked bar. This fixes a flat-count artefact where India — which crosses three purely domestic lines and zero external — read as near-distress; in colour it now plainly shows the Japan-style safe-but-heavy profile. The bar renderer gained stacked segments and a legend; the methodology note now discloses that each line is read on its own latest year, so a country's checks can span several years." }
  - { date: "2026-06-23", text: "Added two movements from the World Bank's <i>Global Economic Prospects</i> (June 2026). <b>The rising burden</b> (FIG. 4): emerging-market government debt has more than doubled to a projected 77% of GDP since 2010, and interest now takes nearly a ninth of revenue, with the report's non-linearity finding (the same rise in debt costs far more the deeper a country already is) folded into the prose. <b>The hidden debt</b> (FIG. 8): borrowing governments concealed and then revealed, from Senegal's books jumping to 111% of GDP to Mozambique's tuna bonds. New <code>worldbank-gep</code> snapshot (CC BY 3.0 IGO) and two analysis scripts; later figures renumbered." }
  - { date: "2026-06-17", text: "Published — seven sources, nineteen movements on the shape-not-size thesis." }
---

This article reads at one altitude after another, from the world's total debt down to a single
country's budget, because that is the only level where the question becomes answerable. The data
and methods are described in the panels and the methodology note above.
