---
question: "Is the air getting cleaner or deadlier?"
dek: "The air over the rich world keeps clearing. The air over South Asia keeps thickening. The death toll keeps climbing. Every one of those is measured — and all three are true at once."
theme: "Environment"
kickerNumber: "14"
verdict: "Cleaner for some, dirtier for most, deadlier overall — the rich world's air clears as South Asia's thickens and the toll climbs."
order: 14
publishedAt: 2026-06-26
illustrative: false
status: "published"

atlas:
  hope: { pos: 0.27, lens: "concentrations, where they're measured" }
  despair: { pos: 0.71, lens: "the total toll, and who goes uncounted" }

intro:
  - "Two facts, both measured, both true. Air pollution has eased over the rich world and worsened over the global South — and the global average, after climbing for most of a generation, only lately began to fall. And it kills more people now than when the century began. This piece is about how all of that is a single answer."
  - "We follow it the way the data honestly allows, and mostly country by country over time: from the global average down the income ladder to the South-Asian cities where it is still climbing and the long-cleaned economies that show what 'solved' looks like; through the contested toll and the uncounted harm beneath it; to who breathes the worst, who it actually kills, who even measures it, and which yardstick we grade against. Where a figure is modelled rather than counted, or missing because no one measures it, we say so out loud."

caveats:
  - "Most burden estimates in this field are modelled from satellites, not measured at the ground — and the people worst affected live where the monitors aren't. The headline toll is a range, not a point: published estimates for outdoor particulate alone span three to nine million deaths a year."
  - "The trends — exposure, clean cooking, the precursor-gas emissions, wildfire burned area — run on fully ingested, re-hostable ACAG, World Bank, CEDS and GWIS data. Several of the deadlier snapshots — the contested toll, lead, the smoke-death geography, the data deserts, the standards — are charted from named published figures (Ghosh, Xue, Chen, OpenAQ, the Illinois consumption dataset, the WHO guidelines); CC-BY tables are re-hosted with attribution, while GBD/IHME-derived figures are charted and cited but not offered for download. The toll and cause-of-death stay as single-year snapshots because the only open over-time series for them is non-redistributable. The remaining planned act — the satellite atlas — is mapped in docs/ARTICLE-airpollution-plan.md but not yet built."

movements:
  - eyebrow: "The headline trend"
    fig: "FIG. 1"
    dropCap: true
    question: "Is the air actually getting cleaner?"
    claim: "The world's air got worse for a generation, crested around 2015, and has only just begun to clear — still six times the safe limit."
    explainer: "Population-weighted, the average lungful held 24 micrograms of fine particulate in 1998 and 30 in 2024 — but the line between them is a hump, not a slope. It climbed through the 2000s as Asia industrialised, crested near 36 around 2011 to 2015, and has eased for about a decade since, almost entirely on the back of China's cleanup. So the honest answer to 'is it getting cleaner' is: only lately, only partly, and from a worse place than where it started. Even now the average sits six times above the World Health Organization's safe limit of five."
    captionLeft: "<b>PM2.5 — population-weighted mean exposure</b> · micrograms per cubic metre"
    captionRight: "1998 — 2024"
    source: "Source · Our World in Data — Atmospheric Composition Analysis Group (ACAG V6) · CC BY 4.0"
    chart:
      id: "m1"
      dataRef: "pm25-exposure-world"
      ymax: 40
      yTicks: [0, 10, 20, 30, 40]
      xTicks: [2000, 2010, 2020]
      refLines:
        - { y: 5, label: "WHO safe limit (2021)" }
      annots:
        - { x: 2015, y: 35.9, label: "the 2015 peak" }
      series:
        - { name: "World", color: "stone", data: [[1998, 24.4], [2024, 29.9]] }
    countries:
      label: "By country — a twelvefold spread"
      note: "Bangladesh's air carries twelve times the fine particulate of Finland's (2024). The global average is a midpoint almost nobody actually breathes."
      ref: "pm25-by-country"
    take:
      hope: "The last decade bends down, and China's cleanup shows a big dirty economy can reverse fast."
      despair: "The air got worse for a generation and still sits six times above safe — the recent dip barely undoes the climb."
      confusion: "'Is it getting better?' depends entirely on which decade you stand in — the 2000s say no, the 2010s say yes."

  - eyebrow: "Cleaner for whom?"
    fig: "FIG. 2"
    question: "Has the cleaner air reached everyone?"
    claim: "Rich-world air kept clearing while the poorer half's got dirtier — the gap didn't just hold, it widened."
    explainer: "Split the global hump by income and it splits into opposite stories. High-income countries drifted down from 16 micrograms to 12 across the period — a slow, steady clean. The lower-middle-income world, home to most of South Asia, went the other way: 31 up to a peak near 49, settling at 41, more than three times the rich-world level and eight times the safe limit. Low-income countries rose too. The world's air did not get cleaner for everyone; it got cleaner for the people who already breathed the cleanest air."
    captionLeft: "<b>PM2.5 exposure by national income group</b> · micrograms per cubic metre"
    captionRight: "1998 — 2024"
    source: "Source · Our World in Data — Atmospheric Composition Analysis Group (ACAG V6) · CC BY 4.0"
    chart:
      id: "m2"
      dataRefs: ["pm25-exposure-hic", "pm25-exposure-umc", "pm25-exposure-lmc", "pm25-exposure-lic"]
      ymax: 60
      yTicks: [0, 20, 40, 60]
      xTicks: [2000, 2010, 2020]
      refLines:
        - { y: 5, label: "WHO limit" }
      series:
        - { name: "High income", color: "hope", data: [[1998, 15.5], [2024, 12.5]] }
        - { name: "Upper-middle", color: "ochre", data: [[1998, 23.5], [2024, 26.1]] }
        - { name: "Lower-middle", color: "despair", data: [[1998, 31.1], [2024, 41.3]] }
        - { name: "Low income", color: "stone", data: [[1998, 23.2], [2024, 30.0]] }
    take:
      hope: "The high-income line shows where the others could land — a steady glide down toward, if not to, safe."
      despair: "The poorer half breathes dirtier air than it did in 1998, and the distance to the rich world grew, not shrank."
      confusion: "One global average, four income groups, two opposite directions inside it — the mean hides the divergence."

  - eyebrow: "A world apart"
    fig: "FIG. 3"
    question: "Did the big polluters bend the curve?"
    claim: "America kept clearing, China cleaned up fast after a brutal peak — and India just kept getting worse."
    explainer: "Three giants, three different curves. The United States, already the cleanest, drifted from 13 micrograms down to 7.5 in a quiet, decades-long decline. China is the dramatic one: it climbed to a punishing peak above 52 around 2014, then bent the curve hard after declaring a 'war on pollution,' falling back to 31. That was the fastest cleanup of a large economy on record. India did the opposite of all of it. No peak, no turn, just a steady climb from 31 to 44, until it passed China and became the dirtiest of the three. The cleanup was real. It simply wasn't shared."
    captionLeft: "<b>PM2.5 exposure — China, India, United States</b> · micrograms per cubic metre"
    captionRight: "1998 — 2024"
    source: "Source · Our World in Data — Atmospheric Composition Analysis Group (ACAG V6) · CC BY 4.0"
    chart:
      id: "m3"
      dataRefs: ["pm25-exposure-chn", "pm25-exposure-ind", "pm25-exposure-usa"]
      ymax: 65
      yTicks: [0, 20, 40, 60]
      xTicks: [2000, 2010, 2020]
      annots:
        - { x: 2014, y: 52.2, label: "China's 2014 peak" }
      refLines:
        - { y: 5, label: "WHO limit" }
      series:
        - { name: "China", color: "ochre", data: [[1998, 29.4], [2024, 31.3]] }
        - { name: "India", color: "despair", data: [[1998, 31.3], [2024, 44.2]] }
        - { name: "United States", color: "hope", data: [[1998, 12.7], [2024, 7.5]] }
    take:
      hope: "China proved a dirty giant can reverse course in a decade — the curve can bend when a government decides it must."
      despair: "India never had a peak to fall from. Its line only climbs, and it now breathes the dirtiest air of the three."
      confusion: "China's start and end points are almost identical — yet between them sits a peak and a cliff that the two-number summary erases entirely."

  - eyebrow: "The new epicentre"
    fig: "FIG. 4"
    question: "If China turned the corner, where did the crisis go?"
    claim: "It moved to South Asia — where four countries' air kept thickening for a quarter-century with no peak in sight."
    explainer: "The story the global average buries is a regional handover. As China bent its curve down after 2014, the centre of gravity of dirty air slid west and south, onto the Indo-Gangetic Plain. India climbed from 31 micrograms to 44. Bangladesh is the extreme case: its population-weighted exposure reached 80 in 2018 — sixteen times the safe limit, the dirtiest national air the satellite record has measured — before easing only slightly to 65. Pakistan rose from 38 to 54, Nepal from 25 to 41. These are not industrial relics cleaning up; they are countries still on the way up, with crop-burning seasons, growing vehicle fleets, and shared airsheds that no single government controls. The world's worst air is no longer in China. It is here, and it is still getting worse."
    captionLeft: "<b>PM2.5 exposure — South Asia</b> · micrograms per cubic metre"
    captionRight: "1998 — 2024"
    source: "Source · Our World in Data — Atmospheric Composition Analysis Group (ACAG V6) · CC BY 4.0"
    chart:
      id: "m-epicentre"
      dataRefs: ["pm25-exposure-bgd", "pm25-exposure-pak", "pm25-exposure-ind", "pm25-exposure-npl"]
      ymax: 90
      yTicks: [0, 30, 60, 90]
      xTicks: [2000, 2010, 2020]
      annots:
        - { x: 2018, y: 80.0, label: "Bangladesh, 2018: 16× the safe limit" }
      refLines:
        - { y: 5, label: "WHO limit" }
      series:
        - { name: "Bangladesh", color: "despair", data: [[1998, 43.0], [2024, 65.0]] }
        - { name: "Pakistan", color: "ochre", data: [[1998, 37.8], [2024, 53.8]] }
        - { name: "India", color: "despair", data: [[1998, 31.3], [2024, 44.2]] }
        - { name: "Nepal", color: "stone", data: [[1998, 24.8], [2024, 40.7]] }
    take:
      hope: "China's reversal proves the same airshed can turn — South Asia's curve is not a law of nature, only a choice not yet made."
      despair: "A fifth of humanity lives under air that has worsened for a generation, peaking dirtier than China ever did."
      confusion: "The 'global crisis is easing' headline is true on average and false for the two billion people who matter most to it."

  - eyebrow: "The template"
    fig: "FIG. 5"
    question: "Has anyone actually solved this and made it stick?"
    claim: "The rich world did — decades ago, and quietly. But even its 'clean' air still breaks the safe limit."
    explainer: "Set the dirtiest air against the cleanest and a second lesson appears: this is a solved problem, where the will exists. The United States drifted from 13 micrograms to 7.5, the United Kingdom from 13 to 9, Germany from 16 to 9 — three industrial economies that scrubbed their air over decades through fuel standards, filters, and the slow death of coal, then held it there. That is the template South Asia hasn't begun. But look where the lines settle, and the comfort curdles: every one of them still sits above the WHO's safe limit of five. The rich world's air is clean only by comparison. 'Solved' here means twice as dirty as health advises, not safe."
    captionLeft: "<b>PM2.5 exposure — long-cleaned economies</b> · micrograms per cubic metre"
    captionRight: "1998 — 2024"
    source: "Source · Our World in Data — Atmospheric Composition Analysis Group (ACAG V6) · CC BY 4.0"
    chart:
      id: "m-template"
      dataRefs: ["pm25-exposure-deu", "pm25-exposure-gbr", "pm25-exposure-usa"]
      ymax: 20
      yTicks: [0, 5, 10, 15, 20]
      xTicks: [2000, 2010, 2020]
      refLines:
        - { y: 5, label: "WHO limit" }
      series:
        - { name: "Germany", color: "ochre", data: [[1998, 16.5], [2024, 9.1]] }
        - { name: "United Kingdom", color: "stone", data: [[1998, 13.1], [2024, 8.8]] }
        - { name: "United States", color: "hope", data: [[1998, 12.7], [2024, 7.5]] }
    take:
      hope: "Three big economies cut their particulate by a third to a half and kept it down — the cleanup is durable, not a blip."
      despair: "Even the success stories never reached the safe line; decades of effort bought air that's still officially unhealthy."
      confusion: "'Clean' and 'safe' are different countries — these nations are the first and still not the second."

  - eyebrow: "The decoupling"
    fig: "FIG. 6"
    question: "If the air thinned, why did the dying grow?"
    claim: "Even where the death rate per person fell, the body count climbed — more people, living longer, breathing it in."
    explainer: "Here is the cruel arithmetic in one chart. A death rate can fall while a death count rises, if the population grows and ages fast enough — and that is exactly what happened. India's outdoor-air deaths rose 48 percent between 1990 and 2015, from 737,000 to 1.09 million, even as the risk to any single person eased, because there were far more people living long enough to die of heart disease instead of something else first. Pakistan's toll rose 65 percent, Bangladesh's 51, Indonesia's 49. China rose even as it began to clean up. The exceptions prove the rule: the United States, already clean and barely growing, drifted down, and Nigeria's count actually fell as other causes of death receded faster. A safer cigarette and a bigger crowd smoking it produce more funerals, not fewer."
    captionLeft: "<b>Deaths from outdoor PM2.5 air pollution</b> · per year"
    captionRight: "1990 — 2015"
    source: "Source · State of Global Air (Health Effects Institute; IHME) — via Our World in Data · link-only"
    chart:
      id: "m4"
      dataRefs: ["ambient-deaths-ind", "ambient-deaths-chn", "ambient-deaths-bgd", "ambient-deaths-pak", "ambient-deaths-usa"]
      ymax: 1200000
      yTicks: [0, 400000, 800000, 1200000]
      xTicks: [1990, 2000, 2010, 2015]
      series:
        - { name: "India", color: "despair", data: [[1990, 737400], [2015, 1090400]] }
        - { name: "China", color: "ochre", data: [[1990, 945300], [2015, 1108100]] }
        - { name: "Bangladesh", color: "despair", data: [[1990, 81200], [2015, 122400]] }
        - { name: "Pakistan", color: "ochre", data: [[1990, 81800], [2015, 135300]] }
        - { name: "United States", color: "hope", data: [[1990, 106000], [2015, 88400]] }
    take:
      hope: "Per person, the risk fell everywhere — the rate is winning even where the count is losing."
      despair: "More people died of dirty air in 2015 than in 1990, full stop, in the places with the most people."
      confusion: "The single clearest proof that 'cleaner or deadlier' has no scalar answer: this one chart is both."

  - eyebrow: "The contested number"
    fig: "FIG. 7"
    question: "So how many does it actually kill?"
    claim: "Somewhere between three and nine million a year — and the disagreement is about science, not air."
    explainer: "Reach for a single death toll and the ground moves under you. For outdoor particulate alone, published estimates run from 3.3 million a year to 8.7 million, a near-threefold spread over the same planet in roughly the same years. The gap is not measurement error; it is method. No one counts these deaths the way you count road crashes. They are inferred: take how much particulate people breathe, multiply by how much each microgram raises the risk of a heart attack or stroke, and sum. Change the dose-response curve, making it steeper at high exposures or extending it to fossil-fuel particles specifically, as Vohra and colleagues did to reach 8.7 million, and the total swings by millions without a single new death. The honest figure is a range. Anyone who quotes you one number to the decimal is selling certainty that the data doesn't contain."
    captionLeft: "<b>Annual deaths from outdoor air pollution</b> · four published estimates · million per year"
    captionRight: "2015 — 2021"
    source: "Source · Lelieveld 2015 · WHO 2021 · IHME GBD 2021 · Vohra 2021 · link-only"
    chart:
      id: "m-toll-range"
      dataRef: "airpoll-toll-range"
      ymax: 9
      yTicks: [0, 9]
      xTicks: [2021]
      series:
        - { name: "Vohra 2021", color: "despair", data: [[2021, 8.7]] }
    take:
      hope: "The wide band is science being honest about what it doesn't know — better than a confident wrong number."
      despair: "Even the lowest estimate is millions of avoidable deaths a year; the argument is only about how many millions."
      confusion: "A threefold range on the headline statistic — and every figure in this article inherits some of that uncertainty."

  - eyebrow: "The toll"
    fig: "FIG. 8"
    question: "If the air is cleaner, why does it still kill millions?"
    claim: "Cleaner air, and still nearly seven million dead a year — the toll and the trend point opposite ways."
    explainer: "Concentration is how dirty the air is; the toll is how many it kills — and the two have come apart. The air thinned, but the world added people and added years to every life, and dirty air kills slowly, through heart disease that takes decades to mature. In 2021 the WHO counted 4.3 million deaths from outdoor air and 2.9 million from the smoke of indoor cooking fires; their joint total, after the overlap, is 6.6 million. That is more than HIV, tuberculosis and road crashes put together."
    captionLeft: "<b>Deaths attributable to air pollution</b> · million per year"
    captionRight: "WHO · 2021"
    source: "Source · WHO Global Health Observatory — Global Health Estimates 2021 · CC BY-NC-SA 3.0 IGO"
    chart:
      id: "m4"
      dataRef: "airpoll-toll-2021"
      ymax: 7
      yTicks: [0, 7]
      xTicks: [2021]
      series:
        - { name: "Joint total", color: "despair", data: [[2021, 6.57]] }
    take:
      hope: "Per person, the age-standardised death rate is falling — the world is slowly winning the ratio."
      despair: "Nearly seven million people a year, and the raw count hasn't fallen even as the air thinned."
      confusion: "Rate down, toll flat: the same phenomenon improves or worsens depending on the denominator you pick."

  - eyebrow: "Cause of death"
    fig: "FIG. 9"
    question: "What does dirty air actually kill you with?"
    claim: "Not your lungs, mostly. Your heart."
    explainer: "The mental image of air pollution is a wheezing chest, so the real anatomy of the harm tends to surprise people. Of the 4.3 million outdoor-air deaths in 2021, ischaemic heart disease took 1.9 million and stroke another 1.0 million — two-thirds of the toll is cardiovascular. Fine particles cross from the lung into the bloodstream, inflame the artery walls, and thicken the blood until a vessel closes. Lung cancer, the disease the public most associates with bad air, is the smallest slice on the chart."
    captionLeft: "<b>Outdoor air-pollution deaths by cause</b> · million per year"
    captionRight: "WHO · 2021"
    source: "Source · WHO Global Health Observatory — Global Health Estimates 2021 · CC BY-NC-SA 3.0 IGO"
    chart:
      id: "m5"
      dataRef: "airpoll-by-cause-2021"
      ymax: 2
      yTicks: [0, 2]
      xTicks: [2021]
      series:
        - { name: "Ischaemic heart disease", color: "despair", data: [[2021, 1.93]] }
    take:
      hope: "Because the killer is cardiovascular, the drugs and habits that protect hearts also blunt the damage."
      despair: "A 'lung' problem is really a heart-attack-and-stroke problem — so it hides inside the world's leading cause of death and goes uncredited."
      confusion: "Filed in the records as heart disease, air-pollution deaths are everywhere and nowhere in the statistics at once."

  - eyebrow: "The forgotten poison"
    fig: "FIG. 10"
    question: "What about the metal we thought we'd dealt with?"
    claim: "We banned leaded petrol and filed lead under lost IQ points — while it was quietly stopping hearts."
    explainer: "The end of leaded petrol in 2021 felt like a closed chapter, and the harm we still talk about is the one to children's developing brains. But that is not where lead does most of its killing. Of the roughly 1.5 million deaths a year the Global Burden of Disease attributes to lead, about 94 percent are cardiovascular — the same mechanism as particulate air pollution, hardened arteries and stopped hearts. A 2023 re-analysis put the toll six times higher than the previous estimate, at a cost near six trillion dollars. And the exposure didn't vanish with petrol; it moved into the cupboard, into metal cookware and ceramic glazes and spices. The hopeful coda: Bangladesh erased lead-chromate from turmeric with market testing and fines, cutting contaminated samples from 47 percent to zero and children's blood-lead by a third in sixteen months — at about a dollar per year of healthy life saved."
    captionLeft: "<b>Where lead's ~1.5 million annual deaths land</b> · % of lead-attributable deaths"
    captionRight: "GBD · 2021"
    source: "Source · IHME Global Burden of Disease; Larsen & Sánchez-Triana 2023 (Lancet Planetary Health) · link-only"
    chart:
      id: "m-lead"
      dataRef: "airpoll-lead-cause"
      ymax: 100
      yTicks: [0, 100]
      xTicks: [2021]
      series:
        - { name: "Cardiovascular", color: "despair", data: [[2021, 94]] }
    take:
      hope: "Turmeric proved a poison can be pulled from the food supply in months, for almost nothing, when someone tests and tells."
      despair: "The deadliest thing about lead was never the IQ loss the headlines fixed on — it's a heart-disease toll we still barely name."
      confusion: "Counted as cardiovascular deaths, lead's toll hides inside the world's biggest killer, just like particulate pollution does."

  - eyebrow: "The pollutant no law touches"
    fig: "FIG. 11"
    question: "We regulated the smokestack gases — what did we miss?"
    claim: "Two of the three big precursor gases have peaked and turned down. Ammonia just keeps climbing."
    explainer: "Particulate doesn't only come out of chimneys as soot; much of it forms in the air when gases react. Three gases do most of that work, and their century-long histories have split apart. Sulphur dioxide, the classic smokestack poison, peaked worldwide around 1979 at 141 million tonnes and has fallen to 74 as the rich world scrubbed it and China turned hard after 2006. Nitrogen oxides, mostly from engines, crested around 2012 and have begun to ease. But ammonia — which comes almost entirely from agriculture, from fertiliser and livestock manure — answers to no clean-air law anywhere, and it has risen without pause, from 16 million tonnes in 1950 to 64 today, an all-time high. As the regulated gases retreat, ammonia becomes the limiting ingredient in the particulate that's left: the next great source of dirty air is a farm, and almost no one is regulating it."
    captionLeft: "<b>Global emissions of the three PM2.5 precursor gases</b> · tonnes per year"
    captionRight: "1900 — 2022"
    source: "Source · Our World in Data — Community Emissions Data System (CEDS) · CC BY 4.0"
    chart:
      id: "m-ammonia"
      dataRefs: ["airpoll-so2-world", "airpoll-nox-world", "airpoll-nh3-world"]
      ymax: 160000000
      yTicks: [0, 50000000, 100000000, 150000000]
      xTicks: [1950, 1985, 2020]
      series:
        - { name: "Sulphur dioxide", color: "hope", data: [[1900, 22800000], [2022, 73500000]] }
        - { name: "Nitrogen oxides", color: "ochre", data: [[1950, 31500000], [2022, 113400000]] }
        - { name: "Ammonia", color: "despair", data: [[1950, 16400000], [2022, 64000000]] }
    take:
      hope: "The two pollutants we chose to regulate both turned the corner — proof that regulation, applied, works."
      despair: "The one we never regulated keeps rising, and it's the future of fine-particle pollution."
      confusion: "Air-quality law fought the last war: it beat sulphur and is winning on nitrogen while the new front, agriculture, goes unguarded."

  - eyebrow: "The uncounted"
    fig: "FIG. 12"
    question: "Who never makes it into the death toll at all?"
    claim: "The body count is the tip. Beneath it: millions of babies born too soon, too small, or not alive at all."
    explainer: "Every toll in this article counts the dead. None of them counts the harm that doesn't end in a death certificate — and for air pollution that submerged mass is enormous. In a single year, fine-particulate exposure was linked to 2.76 million low-birth-weight babies and 5.87 million preterm births — more than a third of every premature birth on Earth. Separately, dirty air is tied to some 830,000 stillbirths a year, about two in five of the global total, a category that falls outside under-five mortality and outside the 'seven million' alike. Set beside roughly half a million newborn deaths, the visible number, the iceberg is mostly underwater. The genre counts bodies; the damaged-but-surviving and the never-born have no number, so they go missing from the story of how much air pollution costs."
    captionLeft: "<b>PM2.5-attributable harm to births</b> · million per year"
    captionRight: "2019"
    source: "Source · Ghosh 2021 (PLOS Medicine) · Xue 2022 (Nature Communications) · CC BY 4.0"
    chart:
      id: "m-iceberg"
      dataRef: "airpoll-morbidity-iceberg"
      ymax: 6
      yTicks: [0, 6]
      xTicks: [2019]
      series:
        - { name: "Preterm births", color: "despair", data: [[2019, 5.87]] }
    take:
      hope: "Each of these is preventable harm, not death — clean a mother's air and most of it simply doesn't happen."
      despair: "More than a third of the world's premature births trace partly to the air, and not one of them is in the headline toll."
      confusion: "The most-quoted number for air pollution's cost may understate the human damage by an order of magnitude — by definition."

  - eyebrow: "Who dies"
    fig: "FIG. 13"
    question: "Where does the dying actually happen?"
    claim: "Where the air is least measured and the people pollute least — sub-Saharan Africa's rate is four times Latin America's."
    explainer: "Put the death rate on a map and it inverts the usual picture of pollution as a problem of smoggy industrial megacities. Age-standardised, sub-Saharan Africa loses 168 people per 100,000 to air pollution — about four times Latin America's 41 — driven less by traffic than by cooking smoke and wind-blown desert dust, and concentrated exactly where there are almost no monitors to measure it. The places that did least to dirty the world's air carry the heaviest share of its dying."
    captionLeft: "<b>Air-pollution mortality rate by region</b> · per 100,000, age-standardised"
    captionRight: "2019"
    source: "Source · World Bank WDI — WHO Global Health Observatory · CC BY 4.0"
    chart:
      id: "m6"
      dataRef: "airpoll-deaths-by-region"
      ymax: 200
      yTicks: [0, 200]
      xTicks: [2019]
      series:
        - { name: "Sub-Saharan Africa", color: "despair", data: [[2019, 168]] }
    take:
      hope: "East Asia's rate fell hard after China's cleanup — proof the number is movable, not fixed by geography."
      despair: "The lightest polluters breathe the deadliest air, and they're the least counted, so even this rate is an estimate."
      confusion: "A 'global' crisis whose burden is wildly local — the world average hides a fourfold regional gap."

  - eyebrow: "The wrong fires"
    fig: "FIG. 14"
    question: "And the smoke we actually see on the news?"
    claim: "The planet burns less land every decade — yet the kind of fire that makes the deadliest smoke keeps growing."
    explainer: "Almost everything intuition tells you about wildfire is wrong, and the history proves it. The total area the world burns has been falling for two decades, because the great driver of fire is the seasonal burning of African and Australian savanna, and that has receded as grassland turns to farmland — from about 184 million hectares in 2002 to 165 million by 2024. But look at forests: their burned area climbed over the same span, from 25 to 35 million hectares, as hotter, drier seasons lengthen the fire window. Less fire, smokier fire. And the dying matches the smoke, not the flames: this smoke is tied to about 1.53 million deaths a year, more than nine in ten in low- and middle-income countries and nearly four in ten in sub-Saharan Africa. Smoke out-kills flame roughly ten to one — Australia's Black Summer took 33 people by fire and an estimated 417 by the smoke. This is the seam where this question meets climate."
    captionLeft: "<b>Area burned by wildfire, by land cover — World</b> · hectares per year"
    captionRight: "2002 — 2024"
    source: "Source · Our World in Data — Global Wildfire Information System / MODIS · CC BY 4.0"
    chart:
      id: "m-wildfire"
      dataRefs: ["airpoll-burn-savanna", "airpoll-burn-forest"]
      ymax: 250000000
      yTicks: [0, 125000000, 250000000]
      xTicks: [2005, 2015, 2024]
      series:
        - { name: "Savanna & grassland", color: "ochre", data: [[2002, 184000000], [2024, 165000000]] }
        - { name: "Forest", color: "despair", data: [[2002, 25300000], [2024, 35300000]] }
    take:
      hope: "The total area burned is shrinking — the planet is not, on the whole, catching fire faster."
      despair: "The fires that reach the most lungs are the growing ones, and their smoke kills ten times more than the flames."
      confusion: "Less land burns and more people die from the smoke — the headline and the harm point opposite ways."

  - eyebrow: "The accidental sunscreen"
    fig: "FIG. 15"
    question: "Could cleaning the air ever be bad?"
    claim: "We scrubbed the sulphur out of the sky to save lungs — and removed a haze that was quietly holding down the heat."
    explainer: "Here is the most uncomfortable twist in the whole story. Sulphur dioxide doesn't just harm lungs; high in the atmosphere its particles reflect sunlight and seed brighter clouds, cooling the planet. For a century we pumped out more and more of it, peaking globally around 1979, and it masked some of the warming we were causing. Then we cleaned it up — the rich world first, China dramatically after its 2006 peak, and global shipping almost overnight when a 2020 rule cut marine-fuel sulphur by about 86 percent. Lungs benefited enormously. But as the haze thinned, the warming it had hidden surfaced: the shipping rule alone is estimated to have added a few hundredths of a degree, and China's roughly three-quarters cut in sulphur since its 2006 peak may account for a meaningful share of the recent jump in global temperature. Cleaner air, hotter planet — both real, from the same act. (How much warming, exactly, is genuinely disputed; some studies argue it sits within natural variability.)"
    captionLeft: "<b>Sulphur dioxide emissions — World and China</b> · tonnes per year"
    captionRight: "1900 — 2022"
    source: "Source · Our World in Data — Community Emissions Data System (CEDS) · CC BY 4.0"
    chart:
      id: "m-aerosol"
      dataRefs: ["airpoll-so2-world", "airpoll-so2-chn"]
      ymax: 160000000
      yTicks: [0, 50000000, 100000000, 150000000]
      xTicks: [1950, 1985, 2020]
      annots:
        - { x: 2006, y: 38100000, label: "China's 2006 sulphur peak" }
      series:
        - { name: "World", color: "stone", data: [[1900, 22800000], [2022, 73500000]] }
        - { name: "China", color: "despair", data: [[1900, 60000], [2022, 10400000]] }
    take:
      hope: "The sulphur cleanup is saving hundreds of thousands of lives a year — that benefit is immediate and certain."
      despair: "We were leaning on a poison to shade the planet, and pulling it away reveals warming that was always in the bill."
      confusion: "The same chart is a public-health triumph and a climate setback, and honest scientists still argue over how big the second effect is."

  - eyebrow: "Made elsewhere"
    fig: "FIG. 16"
    question: "Whose air pays for whose stuff?"
    claim: "About one in six outdoor-pollution deaths happens so someone richer, somewhere cleaner, can buy the thing."
    explainer: "Pollution is usually pinned on the country where the smokestack stands. Switch the accounting to who consumes what the smokestack makes, and the moral geography shifts. Of roughly 5.1 million annual deaths from outdoor particulate, about 800,000, close to one in six, occur because a richer country, with at least half again the income per head, consumed goods produced in a poorer country's air. The United States is the largest net importer of this embodied death; the gap widened by nearly a third between 2007 and 2017. And the machinery economists use to value lives, the Value of a Statistical Life, prices a death in a poor country far below one in a rich country, so the offshored toll, by construction, barely registers in the cost-benefit sums that set policy."
    captionLeft: "<b>Outdoor PM2.5 deaths, and the share consumed abroad</b> · million per year"
    captionRight: "2017"
    source: "Source · Consumption-based PM2.5 mortality dataset (University of Illinois Databank) · CC BY 4.0"
    chart:
      id: "m-offshoring"
      dataRef: "airpoll-offshoring"
      ymax: 6
      yTicks: [0, 6]
      xTicks: [2017]
      series:
        - { name: "All outdoor PM2.5 deaths", color: "stone", data: [[2017, 5.1]] }
    take:
      hope: "Naming the flow is the first step to pricing it honestly — and the data to do so now exists, openly."
      despair: "Hundreds of thousands die each year for consumption that happens somewhere they'll never benefit from."
      confusion: "Blame the producer or the consumer and you get two different maps of the same deaths."

  - eyebrow: "The data is the story"
    fig: "FIG. 17"
    question: "How much of this do we actually measure?"
    claim: "A third of the world's countries don't monitor their air at all — and most of the dying is in the dark."
    explainer: "Step back and the most unsettling fact is not a number but the absence of one. Roughly 36 percent of countries operate no public air-quality monitoring whatsoever; about a billion people, across seventy-one countries, live with no government measurement of the air they breathe, and nine in ten of them are in low- or lower-middle-income countries — the exact places where the death rates run highest. Of the countries that do monitor, only about a quarter share their data fully and openly. So the heaviest tolls in this article are precisely where the instruments aren't: modelled from satellites, not read off the ground. In 2025 it got darker still, when the United States switched off the embassy monitors that were the only regulatory-grade source in more than a dozen countries. Where citizens and researchers fill the gap with low-cost sensors, they out-measure governments — but those cheap sensors over-read in humid, tropical air, so some of the most alarming numbers from the data deserts are part artifact. We are arguing about a crisis we can barely see."
    captionLeft: "<b>Government air-quality data worldwide</b> · % of countries"
    captionRight: "OpenAQ · 2024"
    source: "Source · OpenAQ — The Air Quality Data Landscape (2024) · link-only"
    chart:
      id: "m-deserts"
      dataRef: "airpoll-data-deserts"
      ymax: 100
      yTicks: [0, 100]
      xTicks: [2024]
      series:
        - { name: "No monitoring", color: "despair", data: [[2024, 36]] }
    take:
      hope: "Citizen sensors and satellites are lighting up the deserts faster than governments ever wired them — the gap is closing from below and above."
      despair: "The people dying most are the people measured least, and in 2025 a major source of measurement was switched off."
      confusion: "Every figure here rests on a map with holes — and the holes are not random, they're where the worst air is."

  - eyebrow: "The quiet victory"
    fig: "FIG. 18"
    question: "Is anything clearly, unambiguously getting better?"
    claim: "A billion more people cook with clean fuel than in 2000 — but the poorest region barely moved."
    explainer: "The deadliest air for most of human history was never outdoors. It was the smoke of a cooking fire in a closed room, and it still kills more newborns than urban smog does. That story is turning, and the country cuts show how unevenly. The share of humanity cooking with clean fuels and electricity climbed from 49 percent in 2000 to 74 in 2023. Indonesia is the standout — 7 percent to 91 in a single generation, on the back of a national push to swap kerosene for bottled gas. India went from 23 to 77 as it handed out LPG cylinders by the tens of millions; China is at 89. But Nigeria crawled from 1 percent to 26, and Bangladesh from 8 to 28 — and because their populations grew so fast, more people cook over open flame in those countries today than when the century began. The rate is a triumph; the headcount is not."
    captionLeft: "<b>Access to clean cooking fuels and technologies, World</b> · % of population"
    captionRight: "2000 — 2023"
    source: "Source · World Bank WDI — WHO Household Energy Database · CC BY 4.0"
    chart:
      id: "m4"
      dataRef: "clean-cooking-world"
      ymax: 100
      yTicks: [0, 25, 50, 75, 100]
      xTicks: [2000, 2010, 2020]
      series:
        - { name: "World", color: "hope", data: [[2000, 48.93], [2023, 74.42]] }
    regional:
      label: "By country — the same victory, wildly uneven"
      refs:
        - { ref: "clean-cooking-idn", name: "Indonesia", color: "hope" }
        - { ref: "clean-cooking-ind", name: "India", color: "ochre" }
        - { ref: "clean-cooking-nga", name: "Nigeria", color: "despair" }
    take:
      hope: "A billion people stopped breathing kitchen smoke in two decades — one of the great unheralded health gains."
      despair: "In sub-Saharan Africa the share rose but the raw number of people exposed grew, because births outran connections."
      confusion: "Percent up, count up too — whether this is winning depends on whether you count rates or people."

  - eyebrow: "The verdict"
    fig: "FIG. 19"
    question: "So — cleaner, or deadlier?"
    claim: "Both, and the yardstick is a choice. When the WHO halved its guideline in 2021, it made 99% of humanity non-compliant overnight without changing the air."
    explainer: "There is no single answer, and that is the answer. Concentrations are down where anyone measures them, and the total toll is up; the rich world's air cleared while South Asia's thickened; the wins are real but relocate the harm and, by unmasking warming, carry a sting. Even the line we grade against is a decision. In 2021 the World Health Organization halved its recommended limit to five micrograms — and with no change in the actual air, pushed about 99 percent of humanity into non-compliance. India's legal limit is eight times the guideline. A hundred and fifty-eight countries have no particulate standard at all, and of the ninety-four that do, thirty-seven breach their own. 'Is the air getting cleaner or deadlier?' has no scalar answer. It depends on whether you count concentrations or bodies, rates or totals, where you live, and which yardstick you pick up."
    captionLeft: "<b>Legal PM2.5 limits as a multiple of the WHO guideline</b> · × 5 µg/m³"
    captionRight: "2024"
    source: "Source · WHO Global Air Quality Guidelines 2021; national air-quality standards · cited"
    chart:
      id: "m-standards"
      dataRef: "airpoll-standards"
      ymax: 8
      yTicks: [0, 8]
      xTicks: [2024]
      series:
        - { name: "India", color: "despair", data: [[2024, 8.0]] }
    take:
      hope: "Halving the guideline reset the ambition for everyone — most of the planet now has an honest target it can see it's failing."
      despair: "Most countries don't even have a legal limit, and a third of those that do break it — the air is unregulated for most of humanity."
      confusion: "The same air can be 'compliant' or 'dangerous' depending only on which year's guideline you grade it against."

sources:
  - id: "wb-pm25"
    name: "World Bank WDI — PM2.5 air pollution, mean annual exposure (EN.ATM.PM25.MC.M3)"
    url: "https://data.worldbank.org/indicator/EN.ATM.PM25.MC.M3"
    license: "CC BY 4.0"
    vintage: "2026-06-26"
    note: "Sourced from the Atmospheric Composition Analysis Group (van Donkelaar et al.) satellite-derived surface PM2.5."
  - id: "wb-cooking"
    name: "World Bank WDI — Access to clean fuels and technologies for cooking (EG.CFT.ACCS.ZS)"
    url: "https://data.worldbank.org/indicator/EG.CFT.ACCS.ZS"
    license: "CC BY 4.0"
    vintage: "2026-06-26"
    note: "Sourced from the WHO Household Energy Database."
  - id: "ceds"
    name: "Community Emissions Data System (CEDS) — long-run air-pollutant emissions"
    url: "https://ourworldindata.org/grapher/long-run-air-pollution"
    license: "CC BY 4.0"
    vintage: "2026-06-27"
    note: "SO₂, NOₓ and NH₃ emissions over time (Hoesly et al.), via Our World in Data — the precursor-gas and aerosol-paradox charts."
  - id: "gwis"
    name: "Global Wildfire Information System (GWIS) / MODIS — burned area by land cover"
    url: "https://ourworldindata.org/grapher/annual-burned-area-by-landcover"
    license: "CC BY 4.0"
    vintage: "2026-06-27"
    note: "Annual area burned by savanna and forest, World, 2002–2024, via Our World in Data."
  - id: "who-aqg"
    name: "WHO global air quality guidelines (2021)"
    url: "https://www.who.int/publications/i/item/9789240034228"
    license: "Cited (CC BY-NC-SA 3.0 IGO)"
    vintage: "2021"
    note: "The 5 µg/m³ annual PM2.5 guideline used as the reference line; also the basis for the legal-limit multiples."
  - id: "toll-literature"
    name: "Outdoor-air-pollution death estimates — Lelieveld et al. 2015 (PNAS); IHME GBD 2021; Vohra et al. 2021 (Environmental Research)"
    url: "https://ourworldindata.org/air-pollution"
    license: "Link-only (GBD/IHME-derived)"
    vintage: "2015–2021"
    note: "The range. GBD figures are charted and cited, not re-hosted."
  - id: "ghosh-2021"
    name: "Ghosh et al. 2021 — Ambient and household PM2.5 and adverse birth outcomes (PLOS Medicine)"
    url: "https://doi.org/10.1371/journal.pmed.1003718"
    license: "CC BY 4.0"
    vintage: "2021"
    note: "preterm (5.87M) and low-birth-weight (2.76M) births attributable to PM2.5."
  - id: "xue-2022"
    name: "Xue et al. 2022 — Stillbirths attributable to ambient PM2.5 (Nature Communications)"
    url: "https://doi.org/10.1038/s41467-022-34250-4"
    license: "CC BY 4.0"
    vintage: "2022"
    note: "~830,000 PM2.5-attributable stillbirths a year."
  - id: "gbd-lead"
    name: "IHME Global Burden of Disease — lead exposure; Larsen & Sánchez-Triana 2023 (Lancet Planetary Health)"
    url: "https://ourworldindata.org/lead-pollution"
    license: "Link-only (IHME)"
    vintage: "2021–2023"
    note: "~1.5M annual lead deaths, ~94% cardiovascular. Charted and cited, not re-hosted."
  - id: "chen-2024"
    name: "Chen et al. 2024 — Global mortality from landscape-fire smoke (The Lancet Planetary Health)"
    url: "https://doi.org/10.1016/S2542-5196(24)00255-0"
    license: "Link-only"
    vintage: "2024"
    note: "~1.53M annual smoke deaths and their income geography."
  - id: "openaq-2024"
    name: "OpenAQ — The Air Quality Data Landscape (2024)"
    url: "https://openaq.org/reports/the-air-quality-data-landscape/"
    license: "Cited"
    vintage: "2024"
    note: "monitoring and transparency figures (36% unmonitored, 27% fully transparent)."
  - id: "illinois-idb"
    name: "Consumption-based PM2.5 mortality dataset (University of Illinois Databank, IDB-3251572)"
    url: "https://databank.illinois.edu/datasets/IDB-3251572"
    license: "CC BY 4.0"
    vintage: "2017"
    note: "~800,000 deaths embodied in richer countries' consumption."
---

## Still lost? Read this.

**PM2.5** is soot and chemical haze fine enough to slip past your body's defences and into the
bloodstream — particles smaller than a thirtieth the width of a hair. It is the pollutant that does
most of the dying. The number on these charts is **µg/m³**: micrograms of it in a cubic metre of air,
averaged over a year and weighted by where people actually live.

The whole article turns on one split the headlines blur. **Concentration** is how dirty the air is.
**Toll** is how many it kills. Concentration is falling. The toll is not, because there are more of us,
we live longer (long enough for dirty air to cause the heart disease it takes decades to cause), and
the cleanup is slowest where the most people breathe. "Cleaner or deadlier?" isn't a trick question —
it's two questions wearing one coat.
