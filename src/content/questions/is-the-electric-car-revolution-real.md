---
question: "Is the electric-car revolution real?"
dek: "One in four new cars sold in the world is now electric, and in China it is more than half. Yet most cars on the road still burn petrol, and an electric car is only as clean as the grid that charges it. The revolution is real; it is also just beginning."
theme: "Energy"
kickerNumber: "07"
verdict: "The sales flipped; the fleet hasn't"
order: 6
publishedAt: 2026-06-13
status: "published"
illustrative: false

atlas:
  hope: { pos: 0.30, lens: "new-car sales" }
  despair: { pos: 0.66, lens: "the petrol fleet on the road" }

caveats:
  - "<b>This is about cars, and mostly about new ones.</b> The headline number is the electric share of <em>new car sales</em>, not of all the cars on the road, and not of trucks, buses, ships, or planes. Sales flip years before the fleet does."
  - "<b>The EV data is CC BY 4.0, with downloads.</b> Sales, stock, and share come from the IEA's <b>Global EV Data Explorer</b>, which is licensed CC BY 4.0, so every figure is re-hosted with its data downloadable below it and credited to the IEA. One caveat on the licence: the separate Global EV Outlook <em>report</em> is restricted (Non-CC); we take the data only from the CC BY Explorer and cite the report. The grid chart is from Ember, also CC BY 4.0."
  - "<b>An electric car is not zero-carbon.</b> It moves the emissions from the tailpipe to the power plant, and to the mine and factory that built the battery. How clean it really is depends on the grid that charges it and how the battery was made."
  - "Figures are 2025, the latest IEA estimate. Some country series begin in 2011 or 2012, where earlier sales were too small to register."

movements:
  - eyebrow: "The S-curve"
    fig: "FIG. 1"
    question: "Are electric cars actually selling?"
    claim: "One in four new cars sold in the world is now electric."
    dropCap: true
    explainer: "Fifteen years ago you could count the world's electric cars in the thousands. In 2010 they were about one in every eight thousand new cars sold, a curiosity for early adopters and city pilots. By 2025 they were one in four. Nothing else on four wheels has climbed an adoption curve this steep, not the automatic gearbox, not the airbag. The shift came when an electric car stopped being an environmental statement and became, in many markets, simply the better car: quieter, quicker off the line, cheaper to fuel and to service. This is the classic S-curve of a technology tipping over from novelty to default. Where it bends next, and in which countries, is the rest of the story."
    captionLeft: "<b>Share of new cars sold that are electric</b> · World · % of new car sales"
    captionRight: "2010 — 2025"
    source: "Source · IEA — Global EV Data Explorer · CC BY 4.0"
    chart:
      id: "e1"
      dataRef: "ev-sales-share-world"
      ymax: 30
      yTicks: [0,10,20,30]
      xTicks: [2010,2015,2020,2025]
      valueSuffix: "%"
      series:
        - { name: "Electric share of new cars", color: "hope", data: [[2010,0.012],[2025,25]] }
    take:
      hope: "Electric cars went from a rounding error to a quarter of the global market in fifteen years, an adoption curve as fast as any in the car's history."
      despair: "A quarter of new sales still means three of every four new cars burn petrol or diesel, locking in tailpipe emissions for the next fifteen years."
      confusion: "Whether the S-curve keeps climbing or stalls near a third depends on charging, prices, and policy that differ wildly by country."
  - eyebrow: "The China engine"
    fig: "FIG. 2"
    question: "Who is actually driving the boom?"
    claim: "In China, most new cars are now electric."
    explainer: "A decade ago the world's largest car market barely made a single plug-in; today you would struggle to buy a petrol model on some forecourts in Shanghai. More than half of every new car sold in China in 2025 runs on a battery, up from about one in ten thousand in 2010. No large market has crossed the halfway line before, and it happened from a standing start in fifteen years. The push was deliberate: a decade of subsidies and sales quotas, a near-total grip on the battery supply chain, and homegrown makers like BYD turning out plug-in models that undercut the petrol cars they replace. The result is a market where the default new car increasingly has a plug, and a battery industry that now sets the price for everyone else. To a large degree, the rest of the world is buying what China built."
    captionLeft: "<b>Share of new cars sold that are electric</b> · China · % of new car sales"
    captionRight: "2010 — 2025"
    source: "Source · IEA — Global EV Data Explorer · CC BY 4.0"
    chart:
      id: "e2"
      dataRef: "ev-sales-share-china"
      ymax: 60
      yTicks: [0,20,40,60]
      xTicks: [2010,2015,2020,2025]
      valueSuffix: "%"
      series:
        - { name: "China", color: "hope", data: [[2010,0.01],[2025,53]] }
    take:
      hope: "China proved a giant car market can flip to majority-electric in a single decade, and built the cheap models that make it possible elsewhere."
      despair: "A transition this concentrated in one state-directed market is fragile, and ties the world's clean-car future to one country's industrial policy."
      confusion: "How much was subsidy and how much is now self-sustaining demand is genuinely unclear, and matters for whether others can copy it."
  - eyebrow: "The China engine"
    fig: "FIG. 3"
    question: "Where on Earth are the electric cars actually sold?"
    claim: "Almost two of every three electric cars sold on Earth are sold in China."
    explainer: "Share percentages can hide where the metal actually moves. In 2025 the world bought about 21 million new electric cars, and China alone bought roughly 13 million of them. That is close to two in every three, sold in a single country. Set that volume beside the leaders' headline percentages and the geography snaps into focus: Norway has the highest electric share on Earth, yet on raw numbers it barely registers next to China's output. The boom is not spread evenly across the map. It is concentrated, overwhelmingly, in the one country that set out to win it, which is why a wobble in Chinese demand or policy would be felt in every carmaker's plan."
    captionLeft: "<b>New electric cars sold per year</b> · World vs China · number of cars"
    captionRight: "2010 — 2025"
    source: "Source · IEA — Global EV Data Explorer · CC BY 4.0"
    chart:
      id: "e3"
      dataRefs: ["ev-sales-world", "ev-sales-china"]
      ymax: 25000000
      yTicks: [0,10000000,20000000]
      xTicks: [2010,2015,2020,2025]
      series:
        - { name: "World", color: "stone", data: [[2010,7450],[2025,21200000]] }
        - { name: "China", color: "hope", data: [[2010,1440],[2025,13300000]] }
    take:
      hope: "China's sheer volume is dragging down the price of every electric car and battery on the planet, for everyone."
      despair: "With the boom this concentrated, a slowdown or trade war in one country could stall the global transition overnight."
      confusion: "Whether other large markets can build their own volume, or only import China's, is the open industrial question of the decade."
  - eyebrow: "The leaders"
    fig: "FIG. 4"
    question: "What does a finished transition look like?"
    claim: "In the leading countries, the new petrol car is already nearly extinct."
    explainer: "Norway is the country that has effectively finished. In 2025, 97 of every 100 new cars sold there are electric, and a new petrol car has become an oddity on the forecourt. It got there with two decades of patient policy, exempting electric cars from the steep taxes that make any car expensive in Norway until plugging in was simply the obvious buy. Iceland, Sweden, and the Netherlands sit a step behind, all past the point where electric is the majority choice. These are small, rich, cold countries, and that is part of the catch: their route leaned on generous public money and high baseline car prices most of the world does not share. They prove the destination is reachable. They do not prove the road there is the same for everyone."
    captionLeft: "<b>Share of new cars sold that are electric</b> · the leaders · % of new car sales"
    captionRight: "2010 — 2025"
    source: "Source · IEA — Global EV Data Explorer · CC BY 4.0"
    chart:
      id: "e4"
      dataRefs: ["ev-sales-share-norway", "ev-sales-share-iceland", "ev-sales-share-sweden", "ev-sales-share-netherlands"]
      ymax: 100
      yTicks: [0,25,50,75,100]
      xTicks: [2010,2015,2020,2025]
      valueSuffix: "%"
      series:
        - { name: "Norway", color: "hope", data: [[2010,0.28],[2025,97]] }
        - { name: "Iceland", color: "ochre", data: [[2012,0.33],[2025,62]] }
        - { name: "Sweden", color: "uncertain", data: [[2010,0.0013],[2025,61]] }
        - { name: "Netherlands", color: "stone", data: [[2010,0.025],[2025,58]] }
    take:
      hope: "A fully electric new-car market is not a fantasy; Norway is living in it now, with no loss of mobility."
      despair: "The leaders won with subsidies and taxes that depend on small, wealthy populations, a model that does not transfer to most of the world."
      confusion: "How fast the last few percent of petrol holdouts disappear, even in Norway, is harder than the first ninety."
  - eyebrow: "The rich split"
    fig: "FIG. 5"
    question: "Why do equally rich countries differ so much?"
    claim: "Among wealthy countries, the gap between leaders and laggards is enormous."
    explainer: "Wealth does not predict who electrifies. Western Europe is most of the way into the switch (the United Kingdom at 35 percent of new sales, Germany at 30, the bloc as a whole near 28), while two of the richest countries on the planet sit near the bottom. The United States, home to both the assembly line and Tesla, electrifies only about one new car in ten. Japan, which more or less invented the modern hybrid, makes barely three in a hundred new cars fully electric. The split is politics and product, not money: Europe set hard targets and built dense charging, America's incentives lurched with each election, and Japan's carmakers bet on hybrids and hydrogen instead. Being rich is not the same as being ready."
    captionLeft: "<b>Share of new cars sold that are electric</b> · the rich split · % of new car sales"
    captionRight: "2010 — 2025"
    source: "Source · IEA — Global EV Data Explorer · CC BY 4.0"
    chart:
      id: "e5"
      dataRefs: ["ev-sales-share-europe", "ev-sales-share-united-kingdom", "ev-sales-share-germany", "ev-sales-share-united-states", "ev-sales-share-japan"]
      ymax: 40
      yTicks: [0,10,20,30,40]
      xTicks: [2010,2015,2020,2025]
      valueSuffix: "%"
      series:
        - { name: "Europe", color: "stone", data: [[2010,0.012],[2025,28]] }
        - { name: "United Kingdom", color: "hope", data: [[2010,0.013],[2025,35]] }
        - { name: "Germany", color: "ochre", data: [[2010,0.0049],[2025,30]] }
        - { name: "United States", color: "despair", data: [[2010,0.012],[2025,10]] }
        - { name: "Japan", color: "uncertain", data: [[2010,0.058],[2025,3]] }
    take:
      hope: "Where governments set clear targets and built charging, adoption followed fast, which means the laggards know exactly what works."
      despair: "The world's largest rich economy is barely electrifying, and policy whiplash there can stall investment across the whole industry."
      confusion: "Whether the US and Japan are merely late or have chosen a different path entirely, through hybrids, is not yet settled."
  - eyebrow: "The emerging world"
    fig: "FIG. 6"
    question: "Is the rest of humanity in this, or locked out?"
    claim: "In the emerging world the car is barely electric, which misses the real revolution."
    explainer: "Outside the rich world the picture looks thin, and the numbers are easy to misread. Turkey has jumped to 22 percent of new cars, lifted by its homegrown brand Togg, but Brazil sits near 9, Mexico 7, and India and Chile around 4. For India that figure badly understates what is happening, because India's electric revolution is not in cars at all. It is in the two- and three-wheelers, the scooters and auto-rickshaws that most Indians actually drive, where electric models far outsell electric cars and never show up in a car statistic. The lesson cuts both ways. Emerging markets are years behind on electric cars, and they may leapfrog the car entirely, the way they leapfrogged landlines for mobile phones."
    captionLeft: "<b>Share of new cars sold that are electric</b> · emerging markets · % of new car sales"
    captionRight: "2011 — 2025"
    source: "Source · IEA — Global EV Data Explorer · CC BY 4.0"
    chart:
      id: "e6"
      dataRefs: ["ev-sales-share-turkey", "ev-sales-share-brazil", "ev-sales-share-mexico", "ev-sales-share-india", "ev-sales-share-chile"]
      ymax: 25
      yTicks: [0,5,10,15,20,25]
      xTicks: [2011,2015,2020,2025]
      valueSuffix: "%"
      series:
        - { name: "Turkey", color: "hope", data: [[2012,0.016],[2025,22]] }
        - { name: "Brazil", color: "ochre", data: [[2010,0.00035],[2025,9]] }
        - { name: "Mexico", color: "uncertain", data: [[2011,0.0004],[2025,7]] }
        - { name: "India", color: "despair", data: [[2010,0.021],[2025,4]] }
        - { name: "Chile", color: "stone", data: [[2011,0.0024],[2025,4]] }
    take:
      hope: "Emerging markets can buy cheap Chinese EVs and electrify their scooters and rickshaws, skipping the petrol era as they skipped landlines."
      despair: "On cars alone, most of the developing world is a decade or more behind, and importing EVs means importing the industry's jobs too."
      confusion: "Because the car metric misses two-wheelers, the true pace of electrification across the emerging world is genuinely hard to read."
  - eyebrow: "The emerging world"
    fig: "FIG. 7"
    question: "If not cars, then what is the emerging world electrifying?"
    claim: "Where the emerging world electrifies fastest, it is on two wheels, not four."
    explainer: "Look at scooters and rickshaws instead of cars and the map turns over. In China, half of the two- and three-wheelers sold in 2025 were electric; in Viet Nam, where the motorbike is the family car, more than a fifth were. India, stuck near 4 percent on cars, is already at 10 percent on its two- and three-wheelers and climbing fast, because an electric scooter costs little, charges from a wall socket, and earns its price back in saved fuel within a couple of years. This is the vehicle most of humanity actually rides. The rich world's car-first story does not describe how most of the planet will go electric, and on two wheels much of it already is."
    captionLeft: "<b>Share of new two- and three-wheelers sold that are electric</b> · by region · %"
    captionRight: "2010 — 2025"
    source: "Source · IEA — Global EV Data Explorer · CC BY 4.0"
    chart:
      id: "e12"
      dataRefs: ["ev-2-3-wheeler-share-china", "ev-2-3-wheeler-share-viet-nam", "ev-2-3-wheeler-share-world", "ev-2-3-wheeler-share-india", "ev-2-3-wheeler-share-indonesia"]
      ymax: 60
      yTicks: [0,20,40,60]
      xTicks: [2010,2015,2020,2025]
      valueSuffix: "%"
      series:
        - { name: "China", color: "hope", data: [[2012,13],[2025,50]] }
        - { name: "Viet Nam", color: "ochre", data: [[2014,0.045],[2025,22]] }
        - { name: "World", color: "stone", data: [[2010,0.083],[2025,15]] }
        - { name: "India", color: "uncertain", data: [[2010,0.34],[2025,10]] }
        - { name: "Indonesia", color: "despair", data: [[2015,0.00012],[2025,1]] }
    take:
      hope: "In the markets where most people ride two and three wheels, electric is already mainstream: half of China's, a fifth of Viet Nam's."
      despair: "Outside Asia the two-wheeler shift is barely starting, and electric scooters do nothing about the cars and trucks that dominate rich-world emissions."
      confusion: "Two-wheeler data is patchy and recent, so the true global pace of small-vehicle electrification is harder to pin down than the car numbers."
  - eyebrow: "The catches"
    fig: "FIG. 8"
    question: "Is the whole road electrifying, or mostly the cars?"
    claim: "Cars and scooters are electrifying fast; the trucks and vans that move freight are not."
    explainer: "The revolution has a clear pecking order, set by what each vehicle is for. About a quarter of new cars and a sixth of new two- and three-wheelers are electric, but only some 9 percent of trucks, 5 percent of buses, and 4 percent of vans. The split follows the physics and the money: a battery big enough to haul forty tonnes all day still costs and weighs too much, while a city car or a scooter is an easy electric win. Buses are the quiet success in between, because a fixed route and a depot to charge at overnight suit a battery well. The freight that moves the economy is the hard part, and it has barely started to move."
    captionLeft: "<b>Share of new vehicles sold that are electric</b> · by mode · World · %"
    captionRight: "2010 — 2025"
    source: "Source · IEA — Global EV Data Explorer · CC BY 4.0"
    chart:
      id: "e13"
      dataRefs: ["ev-sales-share-world", "ev-2-3-wheeler-share-world", "ev-sales-share-mode-trucks", "ev-sales-share-mode-buses", "ev-sales-share-mode-vans"]
      ymax: 30
      yTicks: [0,10,20,30]
      xTicks: [2010,2015,2020,2025]
      valueSuffix: "%"
      series:
        - { name: "Cars", color: "hope", data: [[2010,0.012],[2025,25]] }
        - { name: "Two & three-wheelers", color: "ochre", data: [[2010,0.083],[2025,15]] }
        - { name: "Trucks", color: "despair", data: [[2010,0.00089],[2025,9]] }
        - { name: "Buses", color: "uncertain", data: [[2010,0.056],[2025,5]] }
        - { name: "Vans", color: "stone", data: [[2010,0.014],[2025,4]] }
    take:
      hope: "The two biggest vehicle categories by number, cars and two-wheelers, are the ones electrifying fastest, so the volume win is real."
      despair: "Heavy trucks, the backbone of freight emissions, are stuck in single digits, and they are the hardest battery problem of all."
      confusion: "Whether trucks follow cars down the cost curve or need a different fix entirely, like hydrogen or overhead wires, is unresolved."
  - eyebrow: "The catches"
    fig: "FIG. 9"
    question: "How many of the cars on the road are actually electric?"
    claim: "A quarter of new cars are electric. Only a twentieth of the cars on the road are."
    explainer: "This is the gap every headline skips. In 2025 a quarter of the cars rolling out of showrooms were electric, but only about one in twenty of the cars actually on the road were. The two lines measure different things: one is what people are buying now, the other is what they bought over the last fifteen years and are still driving. A car is a long-lived thing, kept for a decade or more and then sold on rather than scrapped, so the fleet turns over slowly even when the showroom flips fast. The sales line is the future arriving. The fleet line is the past refusing to leave. Closing the distance between the two is the whole job, and it takes about as long as a car lasts."
    captionLeft: "<b>Electric share: new cars sold vs cars on the road</b> · World · %"
    captionRight: "2010 — 2025"
    source: "Source · IEA — Global EV Data Explorer · CC BY 4.0"
    chart:
      id: "e7"
      dataRefs: ["ev-sales-share-world", "ev-fleet-share-world"]
      ymax: 30
      yTicks: [0,10,20,30]
      xTicks: [2010,2015,2020,2025]
      valueSuffix: "%"
      series:
        - { name: "New cars sold", color: "hope", data: [[2010,0.012],[2025,25]] }
        - { name: "Cars on the road", color: "despair", data: [[2010,0.0046],[2025,5]] }
    take:
      hope: "The fleet share is rising for the most durable of reasons: every year's record sales become next year's cars on the road, and they stay there for over a decade."
      despair: "Only one car in twenty on the road is electric, so the tailpipe emissions from the existing fleet are barely dented yet."
      confusion: "How fast the fleet share climbs depends on scrappage rates and second-hand markets, which almost no one tracks closely."
  - eyebrow: "The catches"
    fig: "FIG. 10"
    question: "Where has the fleet itself actually gone electric?"
    claim: "Even in Norway, only about a third of the cars on the road are electric."
    explainer: "Saturation in the showroom is not the same as saturation on the street. After years of near-total plug-in sales, only about 36 percent of the vehicles on Norwegian roads actually run on a battery, and Norway is the world leader by a distance. China, the sales juggernaut, sits at 14 percent of its fleet; the world is around 5; the United States is at 3; India is below 1. The pattern is identical everywhere, just frozen at different stages, because what is on the road always trails what is being sold by a wide margin. A country has to keep selling mostly-electric for a decade or more before its fleet catches up. Even the front-runners are closer to the start of that wait than its end."
    captionLeft: "<b>Share of cars on the road that are electric</b> · by region · %"
    captionRight: "2010 — 2025"
    source: "Source · IEA — Global EV Data Explorer · CC BY 4.0"
    chart:
      id: "e8"
      dataRefs: ["ev-fleet-share-norway", "ev-fleet-share-china", "ev-fleet-share-world", "ev-fleet-share-united-states", "ev-fleet-share-india"]
      ymax: 40
      yTicks: [0,10,20,30,40]
      xTicks: [2010,2015,2020,2025]
      valueSuffix: "%"
      series:
        - { name: "Norway", color: "hope", data: [[2010,0.12],[2025,36]] }
        - { name: "China", color: "ochre", data: [[2010,0.0031],[2025,14]] }
        - { name: "World", color: "stone", data: [[2010,0.0046],[2025,5]] }
        - { name: "United States", color: "uncertain", data: [[2010,0.0018],[2025,3]] }
        - { name: "India", color: "despair", data: [[2010,0.0051],[2025,0.75]] }
    take:
      hope: "Norway proves a fleet can be turned over within a generation, not a century, once sales stay high for long enough."
      despair: "Outside a handful of small leaders, the share of cars on the road that are electric is still in the low single digits."
      confusion: "Whether the laggards follow Norway's curve or stall partway is the difference between a transition that finishes and one that plateaus."
  - eyebrow: "The catches"
    fig: "FIG. 11"
    question: "How many electric cars are actually out there?"
    claim: "Seventy-five million electric cars are on the road, and well over half are in China."
    explainer: "Behind the percentages are real cars, tens of millions of them. About 75 million electric cars were on the world's roads in 2025, up from some 39,000 in 2010, a nearly two-thousandfold rise in fifteen years. Well over half of them, about 44 million, are in China; Europe and the United States trail with a fraction each, and India, for all its size, has only a few hundred thousand. This is the same lopsidedness as the sales, now hardened into the fleet: the country that bought the most is the country that drives by far the most electric cars. The absolute count is enormous and the growth is relentless. Set against the size of the world's car fleet, it is also still early days."
    captionLeft: "<b>Electric cars on the road</b> · by region · number of cars"
    captionRight: "2010 — 2025"
    source: "Source · IEA — Global EV Data Explorer · CC BY 4.0"
    chart:
      id: "e9"
      dataRefs: ["ev-stock-world", "ev-stock-china", "ev-stock-europe", "ev-stock-united-states", "ev-stock-india"]
      ymax: 80000000
      yTicks: [0,20000000,40000000,60000000,80000000]
      xTicks: [2010,2015,2020,2025]
      series:
        - { name: "World", color: "stone", data: [[2010,39000],[2025,75000000]] }
        - { name: "China", color: "hope", data: [[2010,1900],[2025,44000000]] }
        - { name: "Europe", color: "uncertain", data: [[2010,29000],[2025,17000000]] }
        - { name: "United States", color: "ochre", data: [[2010,3800],[2025,7800000]] }
        - { name: "India", color: "despair", data: [[2010,880],[2025,410000]] }
    take:
      hope: "Seventy-five million electric cars on the road is a real, growing dent, and it compounds every year as sales climb."
      despair: "Electric cars are still a small slice of the world's fleet; the billion-plus petrol cars already built will burn fuel for decades."
      confusion: "How fast old cars get scrapped, not how fast new ones sell, sets the real pace, and that is mostly invisible in the headlines."
  - eyebrow: "The catches"
    fig: "FIG. 12"
    question: "Is an electric car always engine-free?"
    claim: "About a third of the world's electric cars still carry a petrol engine."
    explainer: "The word electric hides a split. Of the quarter of new cars that counted as electric in 2025, about 16 percent were fully battery-powered with no engine at all, while another 8 percent were plug-in hybrids that carry both a battery and a petrol engine. That second group is the asterisk on the headline: a plug-in hybrid is only clean if its owner actually plugs it in, and studies keep finding that many do not, driving on petrol with a dead battery in the boot. China leans on these cars harder than most, with a fifth of its new cars being plug-in hybrids. They are a genuine bridge for buyers nervous about range, and a genuine loophole for anyone counting tailpipes. How much of the electric boom is truly engine-free depends on which half of this chart you trust."
    captionLeft: "<b>What's inside the electric share</b> · World · battery-electric vs plug-in hybrid · %"
    captionRight: "2010 — 2025"
    source: "Source · IEA — Global EV Data Explorer · CC BY 4.0"
    chart:
      id: "e10"
      dataRefs: ["ev-bev-share-world", "ev-phev-share-world"]
      ymax: 20
      yTicks: [0,5,10,15,20]
      xTicks: [2010,2015,2020,2025]
      valueSuffix: "%"
      series:
        - { name: "Battery-electric", color: "hope", data: [[2010,0.011],[2025,16.51]] }
        - { name: "Plug-in hybrid", color: "ochre", data: [[2010,0.0007],[2025,8.49]] }
    take:
      hope: "Most of the electric share, and a rising majority of it, is fully battery-powered cars that never burn a drop of fuel."
      despair: "A growing slice is plug-in hybrids that still have an engine and, too often, run on it; the clean-car number is flattered by them."
      confusion: "Whether plug-in hybrids are a useful bridge or a delay tactic is genuinely disputed, and the honest answer depends on whether owners charge them."
  - eyebrow: "The catches"
    fig: "FIG. 13"
    question: "Does an electric car actually cut carbon?"
    claim: "An electric car is only as clean as the electricity that charges it."
    explainer: "An electric car has no tailpipe, but it does have a power cord, and that cord runs back to a grid that is still more than half fossil-fueled. Charge a car on coal power and you have not erased the emissions so much as moved them from the street to the smokestack, where at least they can be cleaned up at one big source rather than a million small ones. This is why the electric car and the clean grid are one project, not two. Plugging in hundreds of millions of cars also adds to electricity demand, which has already more than doubled this century, from about 15,300 to nearly 31,700 terawatt-hours. The car gets cleaner every year only because the grid behind it does too. The honest verdict on the electric car is, in the end, the verdict on the power station it draws from."
    captionLeft: "<b>World electricity demand</b> · terawatt-hours · the load the cars plug into"
    captionRight: "2000 — 2025"
    source: "Source · Ember — Yearly Electricity Data · CC BY 4.0"
    chart:
      id: "e11"
      dataRef: "electricity-demand-world"
      ymax: 35000
      yTicks: [0,10000,20000,30000]
      xTicks: [2000,2005,2010,2015,2020,2025]
      series:
        - { name: "Electricity demand", color: "stone", data: [[2000,15278.78],[2025,31739.74]] }
    take:
      hope: "As the grid cleans up, every electric car already on the road quietly gets greener with it, with no new purchase needed."
      despair: "On a fossil-heavy grid an electric car's climate gain is partial, and the new charging load can itself lean on coal and gas."
      confusion: "The net carbon saving depends on local grid mix and battery manufacturing, so it varies enormously from one country to the next."

pullQuote:
  text: "One in four new cars is electric, and most cars on the road still are not. The first number is the revolution; the second is how long revolutions take."
  cite: "Flow versus fleet"

lenses:
  - who: "The car buyer"
    confidence: "high"
    hope: "In many markets an electric car is now cheaper to own over its life, and nicer to drive: instant torque, no fuel stops, almost no servicing."
    despair: "The sticker price is still higher, public charging is patchy outside rich cities, and a flat battery on a long drive is a real fear, not an imagined one."
  - who: "The climate accountant"
    confidence: "high"
    hope: "Every petrol car not sold is roughly fifteen years of tailpipe CO₂ that never happens; the sales shift is locking in future savings now."
    despair: "More than a billion combustion cars are already on the road, and they will keep burning fuel for decades whatever the new-sales number does."
  - who: "The grid engineer"
    confidence: "medium"
    despair: "Hundreds of millions of chargers are an enormous new load, and if everyone plugs in at 6pm the peaks could strain networks built for less."
    hope: "Cars sit parked 95 percent of the time, so a smart fleet is a giant, distributed battery that can charge on cheap midday solar and steady the grid."
  - who: "The development economist"
    confidence: "medium"
    hope: "Cheap Chinese EVs and electric two-wheelers let poor countries skip the petrol era the way they skipped landlines, cutting both emissions and oil import bills."
    despair: "Without a domestic industry, going electric means importing finished cars and the jobs and value that come with them, deepening dependence on China."

hopeCase: "The hard part, getting people to want the thing, is done. An electric car is now the better product in a growing list of markets: cheaper to run, quicker, quieter, simpler. That is why sales went from a rounding error to a quarter of the world's new cars in fifteen years, the steepest adoption curve in the car's history, and why China, the largest market on Earth, is already majority-electric. The cost curve that did this to solar is now doing it to batteries, and China's volume is dragging prices down for everyone. Sales lead, the fleet follows, and the grid that charges these cars is cleaning up at the same time. The direction is no longer in doubt. Petrol's century is ending; the only argument left is about the year."
despairCase: "A quarter of new sales is not a quarter of the road. The world has well over a billion petrol and diesel cars already built, and they will keep burning fuel for the fifteen-plus years each one lasts, no matter what the showroom does. The boom is dangerously lopsided: almost two of every three electric cars are sold in one country, while the largest rich economy electrifies barely one new car in ten and much of the emerging world is years behind. And the win is conditional. On a grid that is still more than half fossil-fueled, an electric car cuts emissions only partly, and shifts the rest to a power plant and a battery mine. The revolution is real in the brochure. On the road, it has barely started."
whatWouldChangeIt: "The verdict turns decisively hopeful when the stock, not just the sales, goes electric — when the count of petrol cars on the road starts falling year on year, because new EVs are arriving faster than old cars are scrapped.\n\nWatch whether the laggards, above all the United States, join the curve or fall further off it; watch whether cheap EVs reach the emerging markets where most of the next billion cars will be bought; and watch the grid, because a clean car on a dirty grid is only half a solution.\n\nThe number that ultimately matters is not the share of new cars sold. It is the day the world's fleet of combustion engines begins to shrink."

methodology:
  - { term: "Electric car sales share", detail: "The share of new passenger cars sold in a year that are fully electric (battery-electric) or plug-in hybrid, from the IEA Global EV Data Explorer. It is a flow measure: new sales, not the existing fleet." }
  - { term: "Stock vs. sales", detail: "Sales and sales-share charts cover new vehicles sold in a year; the fleet share (Figs. 9–10) and the stock count (Fig. 11) cover vehicles on the road. The fleet lags sales by many years because the average car lasts well over a decade — that gap is the article's central caveat." }
  - { term: "Modes and two-wheelers", detail: "The IEA reports each measure separately for cars, two/three-wheelers, vans, buses, and trucks. Figs. 7–8 use those modes to show that the boom is concentrated in cars and small two-wheelers, while freight lags. India's two/three-wheeler share runs well above its car share." }
  - { term: "Battery-electric vs plug-in hybrid", detail: "The IEA counts both as 'electric'. Battery-electric (BEV) cars have no engine; plug-in hybrids (PHEV) carry a battery and a petrol engine and only run clean when charged. Fig. 12 splits the two; the headline sales-share figures add them together." }
  - { term: "Licence", detail: "The EV series come from the IEA Global EV Data Explorer, licensed CC BY 4.0, and are re-hosted with downloads and attribution (DATA.md §9). The separate Global EV Outlook report is Non-CC and is cited, not re-hosted. Electricity demand (Fig. 13) is from Ember, also CC BY 4.0." }
  - { term: "The entities", detail: "Countries and regions are IEA/OWID definitions. 'Europe' and 'European Union (27)' are reported separately by IEA; this article uses 'Europe'. Emerging-market coverage is limited to the countries IEA reports, which omits several large ones." }
  - { term: "Electricity demand", detail: "World electricity demand in terawatt-hours, from Ember's Yearly Electricity Data (CC BY 4.0), shown as the load EVs plug into; see the companion green-transition article for how clean that load is." }
  - { term: "Battery costs", detail: "The collapse in lithium-ion battery-pack prices (BloombergNEF) is the mechanism behind the sales curve, but it traces to no series re-hostable here, so it is described qualitatively and not charted, per the never-invent-a-number rule." }

sources:
  - { id: "iea-ev-explorer", name: "IEA — Global EV Data Explorer", url: "https://www.iea.org/data-and-statistics/data-tools/global-ev-data-explorer", license: "CC BY 4.0", vintage: "2026-06-13", note: "The CC BY 4.0 source re-hosted here: sales, stock, fleet share, by-mode and two/three-wheeler series, by country and powertrain. Data downloadable under each figure." }
  - { id: "iea-evo-2026", name: "IEA — Global EV Outlook 2026 (report)", url: "https://www.iea.org/data-and-statistics/data-product/global-ev-outlook-2026", license: "link-only", vintage: "2026", note: "The IEA's flagship EV analysis. Its data product is licensed Non-CC (restricted), so it is cited here, not re-hosted — the figures are drawn from the CC BY Explorer instead." }
  - { id: "owid-ev", name: "Our World in Data — Electric car sales (IEA)", url: "https://ourworldindata.org/electric-car-sales", license: "CC BY 4.0", vintage: "2026-06-13", note: "Source for the battery-electric vs plug-in-hybrid breakdown (Fig. 12), processed from the same CC BY IEA data." }
  - { id: "ember-yearly", name: "Ember — Yearly Electricity Data", url: "https://ember-energy.org/data/yearly-electricity-data/", license: "CC BY 4.0", vintage: "2026-06-13", note: "World electricity demand (Fig. 13) — the grid the cars plug into. Downloadable under the figure." }
  - { id: "bnef-batteries", name: "BloombergNEF — Lithium-ion Battery Price Survey", url: "https://about.bnef.com/blog/lithium-ion-battery-pack-prices-see-largest-drop-since-2017/", license: "link-only", vintage: "2024", note: "The battery-cost decline behind the affordability of EVs. Cited as mechanism; not charted, as it traces to no re-hostable series." }
---

### Still lost? Read this.

Two numbers tell the whole story, and people argue about which one to say first.

The first is the brochure. One in four new cars sold in the world in 2025 was electric, up from basically none fifteen years ago. In China it was more than half. In Norway it was almost all of them. Electric cars got cheaper, quicker, and nicer to drive, so people started buying them not to save the planet but because they are the better car. That is a genuine technology tipping point, the fastest the car has ever seen, and it is not reversing.

The second is the road. Most of the cars actually driving around are still petrol, because a car you buy today is still on the road in fifteen years, so the fleet changes slowly even when sales flip fast. The boom is also lopsided. Almost two of every three electric cars are sold in China; the United States is barely electrifying; and much of the poorer world is years behind on cars, even where it is racing ahead on electric scooters and rickshaws. And an electric car is only as clean as the electricity it runs on, which is why this story and the story of the power grid are really one story.

The honest line for dinner: the electric car has already won the showroom and barely started on the road. The revolution is real, it is fast, and it is also going to take longer than the headline number makes it sound. Watch for the year the world's petrol cars start disappearing faster than new ones arrive. That is the day the revolution reaches the street.

