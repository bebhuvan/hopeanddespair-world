---
question: "Who shapes science now?"
dek: "Science is no longer a small Western archive. It is a ten-million-work-a-year machine, increasingly open, increasingly Asian, increasingly collaborative, and still brutally unequal in who gets seen."
theme: "Knowledge"
kickerNumber: "09"
verdict: "Open, global, unequal"
order: 9
publishedAt: 2026-06-13
status: "published"
illustrative: false

atlas:
  hope: { pos: 0.24, lens: "open and global" }
  despair: { pos: 0.68, lens: "attention and power" }

caveats:
  - "<b>OpenAlex counts scholarly works, not only journal articles.</b> Its graph includes articles, books, proceedings, preprints, repositories, and other research objects where metadata exists. That breadth is the point, but it is broader than older journal-article statistics."
  - "<b>Country counts are country-attributed, not nationally exclusive.</b> A paper with authors in China and Germany can count for both. That is correct for collaboration, but it means country bars are not slices of one pie."
  - "<b>Citations are an influence proxy, not a truth meter.</b> Citation-normalized top-10% status is useful because it adjusts for field and year, but citations still follow language, prestige, network, and topic fashions, and some national literatures cite heavily within themselves."
  - "Everything OpenAlex-derived here is snapshotted through the official API under CC0. The article uses grouped aggregates, not live requests at page load."

intro:
  - "The lazy story is that science publishes more papers every year. True, but thin. <a href=\"https://openalex.org\" rel=\"noopener\">OpenAlex</a> lets us ask the better question: <em>who is connected to the graph of knowledge, where are they, what fields dominate, what is open, and who gets attention?</em>"
  - "Read that way, the answer is not one mood. The hopeful version is real: knowledge is more open, less Western, and more collaborative than it was in 2000. The despairing version is also real: visibility still concentrates around rich institutions, old prestige systems, and fields with money, labs, English, and citation machinery behind them."

movements:
  - eyebrow: "The machine"
    fig: "FIG. 1"
    question: "How large is the visible research system?"
    claim: "OpenAlex records about 10.6 million scholarly works published in 2024, up from under 100,000 in 1900."
    dropCap: true
    sidenote: { mark: "a", text: "<b>Why the recent years dip.</b> OpenAlex keeps finding and adding older works for years after they appear, so the last few years of any count are provisional and read low. The 2020 peak partly reflects this: 2020 has simply had more time to fill in than 2024. Read the recent slope as unsettled, not as proof that science is shrinking." }
    explainer: "Start with the scale, because it changes the meaning of every other chart. In 1900, OpenAlex records about 92,000 scholarly works. By 2000 it records 3.8 million. By 2024, 10.6 million. The line is not a clean climb to the present. It peaks near 11.4 million around 2020, then dips, but that dip is mostly a counting effect: the newest years are still being indexed. A real slowdown and a simple lag look the same for now. Some of the long-run rise is better indexing too. The broad fact survives all of it: science became an industrial-scale human activity.\n\nThat is hopeful if your problem needs more eyes, instruments, languages, and local knowledge. It is terrifying if your problem is judgment. The scarce resource is no longer a place to publish. It is attention, synthesis, replication, and knowing which claims actually changed the map."
    captionLeft: "<b>Scholarly works published per year</b> · World · OpenAlex records"
    captionRight: "1900 - 2024"
    source: "Source · OpenAlex · CC0 1.0"
    chart:
      id: "s1"
      dataRef: "works-total-world"
      ymax: 12000000
      yTicks: [0,3000000,6000000,9000000,12000000]
      xTicks: [1900,1950,2000,2024]
      series:
        - { name: "Scholarly works", color: "uncertain", data: [[1900,91928],[2024,10631183]] }
    take:
      hope: "More people, institutions, and fields can now contribute to the formal record of knowledge."
      despair: "A literature this large can bury signal under output, incentives, and unreadable abundance."
      confusion: "The count mixes real growth with better indexing, and the post-2020 years are still filling in, so recent dips may be lag, not decline."

  - eyebrow: "The geography"
    fig: "FIG. 2"
    question: "Where is new science being produced now?"
    claim: "In 2024, China and the United States are nearly tied in OpenAlex country-attributed works."
    sidenote: { mark: "b", text: "<b>Indonesia at number four</b> surprises most readers, and it is part real, part measurement quirk. Indonesia built strong national open-access repositories and journal platforms that OpenAlex indexes well, which lifts its visible count above what its research spending alone would predict. The bar is a footprint in the graph, not a claim that Indonesia out-produces Germany in every sense." }
    explainer: "This is the first big map change. In OpenAlex's 2024 country grouping, China appears on about 1.28 million works and the United States on about 1.21 million. India and Indonesia follow at about 450,000 each, with the United Kingdom, Germany, France, Brazil, Italy, Japan, Canada, and Spain behind them.\n\nDo not read this as a quality ranking. It is a presence ranking. Large countries, large university systems, publication incentives, and collaboration all matter. But presence matters. The old mental picture of science as a North Atlantic archive with everyone else reading along is obsolete."
    captionLeft: "<b>Works by author-institution country</b> · 2024 · million"
    captionRight: "country-attributed, not exclusive"
    source: "Source · OpenAlex · CC0 1.0"
    chart:
      id: "s2"
      dataRef: "openalex-works-by-country-2024"
      ymax: 1.4
      yTicks: [0,0.35,0.7,1.05,1.4]
      xTicks: [0,0.35,0.7,1.05,1.4]
      series:
        - { name: "Works", color: "hope", data: [[2024,1.28]] }
    take:
      hope: "The production of formal knowledge is no longer monopolized by old Western research powers."
      despair: "Raw output rewards scale, incentives, and indexing; it does not tell us whose work shapes the field."
      confusion: "A collaborative paper counts for every represented country, so the bars show footprint, not ownership."

  - eyebrow: "The geography"
    fig: "FIG. 3"
    question: "How fast did the map move?"
    claim: "China's country-attributed OpenAlex output rose about 23.6x from 2000 to 2024; India's rose about 19.2x."
    explainer: "The 2024 bar is a snapshot. This is the motion behind it. Put each country's OpenAlex footprint on a 2000 = 1x scale and the shift becomes obvious: China reaches about 23.6x by 2024, India 19.2x, and Brazil 9.4x. The United States, Germany, and Japan remain large research systems, but their visible output grew much more slowly from already large bases.\n\nThis is why the map feels different. The United States did not vanish; it grew. But China and India grew much faster, enough to change the center of gravity of the visible research system inside one generation."
    captionLeft: "<b>Country-attributed OpenAlex works</b> · multiple of 2000 output"
    captionRight: "2000 - 2024"
    source: "Source · OpenAlex · CC0 1.0"
    chart:
      id: "s3"
      dataRefs: ["openalex-country-china-multiple", "openalex-country-india-multiple", "openalex-country-brazil-multiple", "openalex-country-united-states-multiple", "openalex-country-germany-multiple", "openalex-country-japan-multiple"]
      ymax: 25
      yTicks: [0,5,10,15,20,25]
      xTicks: [2000,2005,2010,2015,2020,2024]
      valueSuffix: "x"
      series:
        - { name: "China", color: "hope", data: [[2000,1],[2024,23.58]] }
        - { name: "India", color: "uncertain", data: [[2000,1],[2024,19.18]] }
        - { name: "Brazil", color: "ochre", data: [[2000,1],[2024,9.38]] }
        - { name: "United States", color: "stone", data: [[2000,1],[2024,2.68]] }
        - { name: "Germany", color: "despair", data: [[2000,1],[2024,2.84]] }
        - { name: "Japan", color: "stone", data: [[2000,1],[2024,1.67]] }
    take:
      hope: "A much larger share of humanity now has institutions visible in the formal research graph."
      despair: "Growth multiples can make smaller bases look explosive; they say nothing by themselves about influence or quality."
      confusion: "This is country footprint, not exclusive national production; collaborations lift more than one line."

  - eyebrow: "The geography"
    fig: "FIG. 4"
    question: "Who gained share of the whole graph?"
    claim: "China's share of all OpenAlex works rose from about 1.4% in 2000 to 12.0% in 2024."
    explainer: "The share chart asks a stricter question than the multiple: not just who grew, but who grew faster than the whole research system. China rises from about 1.4 percent of OpenAlex works in 2000 to about 12.0 percent in 2024. India rises from about 0.6 percent to 4.3 percent. Brazil rises from about 0.7 percent to 2.2 percent. The United States remains huge, the United Kingdom and Germany are roughly stable, and Japan's share falls as the rest of the system grows around it.\n\nThis is the better chart for 'who gained ground.' The story is not American collapse. It is the end of an old monopoly."
    captionLeft: "<b>Country-attributed works as share of all OpenAlex works</b>"
    captionRight: "2000 - 2024"
    source: "Source · OpenAlex · CC0 1.0"
    chart:
      id: "s4"
      dataRefs: ["openalex-country-china-share", "openalex-country-united-states-share", "openalex-country-india-share", "openalex-country-united-kingdom-share", "openalex-country-germany-share", "openalex-country-japan-share", "openalex-country-brazil-share"]
      ymax: 18
      yTicks: [0,3,6,9,12,15,18]
      xTicks: [2000,2005,2010,2015,2020,2024]
      valueSuffix: "%"
      series:
        - { name: "China", color: "hope", data: [[2000,1.43],[2024,12]] }
        - { name: "United States", color: "stone", data: [[2000,11.9],[2024,11.4]] }
        - { name: "India", color: "uncertain", data: [[2000,0.6],[2024,4.28]] }
        - { name: "United Kingdom", color: "ochre", data: [[2000,3.4],[2024,3.35]] }
        - { name: "Germany", color: "despair", data: [[2000,2.73],[2024,2.76]] }
        - { name: "Japan", color: "stone", data: [[2000,3.06],[2024,1.82]] }
        - { name: "Brazil", color: "ochre", data: [[2000,0.65],[2024,2.18]] }
    take:
      hope: "The formal record of science is less concentrated in one old center than it was in 2000."
      despair: "A larger share of works is not the same as a larger share of funding, prestige, or agenda-setting power."
      confusion: "Fast-rising shares can reflect real capacity, indexing changes, publication incentives, or all three."

  - eyebrow: "The fields"
    fig: "FIG. 5"
    question: "How did the field mix change?"
    claim: "Medicine remains the largest selected field, but computer science grew fastest: about fivefold since 2000."
    explainer: "A 2024 field ranking tells us what is large now. The time series tells us what changed. Medicine grows from about 0.56 million works in 2000 to 1.63 million in 2024. Social sciences rise from 0.44 million to 1.44 million. Engineering starts high and grows more slowly, from 0.76 million to 1.43 million. Computer science rises from 0.14 million to 0.71 million.\n\nThat shape is the modern research agenda in motion: health remains enormous; society and environment expand; computing becomes a general-purpose research language rather than one field among others."
    captionLeft: "<b>Works by OpenAlex field</b> · million per year"
    captionRight: "2000 - 2024"
    source: "Source · OpenAlex · CC0 1.0"
    chart:
      id: "s5"
      dataRefs: ["openalex-field-medicine", "openalex-field-social-sciences", "openalex-field-engineering", "openalex-field-computer-science", "openalex-field-environmental-science"]
      ymax: 2.1
      yTicks: [0,0.7,1.4,2.1]
      xTicks: [2000,2005,2010,2015,2020,2024]
      series:
        - { name: "Medicine", color: "hope", data: [[2000,0.56],[2024,1.63]] }
        - { name: "Social sciences", color: "uncertain", data: [[2000,0.44],[2024,1.44]] }
        - { name: "Engineering", color: "stone", data: [[2000,0.76],[2024,1.43]] }
        - { name: "Computer science", color: "ochre", data: [[2000,0.14],[2024,0.71]] }
        - { name: "Environmental science", color: "despair", data: [[2000,0.14],[2024,0.48]] }
    take:
      hope: "The system is broad enough to work on disease, engineering, environment, society, culture, and computation at once."
      despair: "Fields with money, institutions, and publication volume can dominate the visible archive and the public imagination."
      confusion: "Field labels simplify messy interdisciplinary work; the same paper can belong intellectually to more than one frontier."

  - eyebrow: "The fields"
    fig: "FIG. 6"
    question: "Which fields accelerated most?"
    claim: "Among these large fields, computer science output is about five times its 2000 level."
    explainer: "Normalize each field to its own 2000 level and the hierarchy changes. Computer science is the clear accelerator, roughly five times its 2000 output by 2024. Environmental science and social sciences more than triple. Medicine almost triples. Engineering, already large in 2000, roughly doubles.\n\nThis is why the field story needs a transformation. Raw counts tell you what is biggest. Indexed growth tells you what is changing fastest."
    captionLeft: "<b>Field output growth</b> · 2024 as multiple of 2000"
    captionRight: "selected OpenAlex fields"
    source: "Source · OpenAlex · CC0 1.0"
    chart:
      id: "s6"
      dataRef: "openalex-field-growth-multiple-2000-2024"
      ymax: 6
      yTicks: [0,1,2,3,4,5,6]
      xTicks: [0,1,2,3,4,5,6]
      series:
        - { name: "Growth multiple", color: "hope", data: [[2000,1],[2024,5]] }
    take:
      hope: "New fields and cross-cutting tools can scale quickly through the research system."
      despair: "Acceleration can reflect publication incentives and hype as much as genuine discovery."
      confusion: "A fast-growing field may still be smaller than a slower-growing field; growth and size answer different questions."

  - eyebrow: "The opening"
    fig: "FIG. 7"
    question: "Where is research most open to read?"
    claim: "In large fields, open-access shares now commonly sit above 60%."
    explainer: "The access story is more interesting by field than in total. In 2024, large OpenAlex fields such as earth and planetary sciences, agricultural and biological sciences, biochemistry, environmental science, mathematics, physics, neuroscience, and medicine all sit around the low-to-high sixties or low seventies in open-access share.\n\nThat is a real change in the social contract of science. It means a student, patient advocate, engineer, journalist, or small-city researcher can often reach the paper without a subscription wall. It does not make the paper understandable, trustworthy, translated, or reusable. But the locked door is opening."
    captionLeft: "<b>Open-access share by field</b> · 2024 · % of field output"
    captionRight: "fields with at least 100,000 works"
    source: "Source · OpenAlex · CC0 1.0"
    chart:
      id: "s7"
      dataRef: "openalex-open-access-by-field-2024"
      ymax: 100
      yTicks: [0,25,50,75,100]
      xTicks: [0,25,50,75,100]
      valueSuffix: "%"
      series:
        - { name: "Open access", color: "hope", data: [[2024,72.1]] }
    take:
      hope: "The frontier is less locked away than it used to be; access is becoming normal in many major fields."
      despair: "Open to read is not open to understand, reproduce, translate, or build on."
      confusion: "Open-access metadata is imperfect, and fields differ in preprint, repository, and journal culture."

  - eyebrow: "The collaboration"
    fig: "FIG. 8"
    question: "Is science becoming more international?"
    claim: "The share of works with institutions in more than one country rose from about 5.0% in 2000 to 12.6% in 2024."
    explainer: "The graph is knitting together. In 2000, only about one in twenty OpenAlex works had authorship institutions from more than one country. By 2024 it is about one in eight. That is not a majority. Most research is still nationally contained. But the direction is clear.\n\nInternational collaboration is not automatically virtuous. It can reproduce hierarchy, with rich-country labs setting agendas and poorer-country partners supplying sites, samples, or local access. But it also means problems can be attacked at the scale they actually exist: pandemics, climate, food systems, migration, oceans, and AI are not domestic objects."
    captionLeft: "<b>Internationally co-authored works</b> · World · % of OpenAlex works"
    captionRight: "2000 - 2024"
    source: "Source · OpenAlex · CC0 1.0"
    chart:
      id: "s8"
      dataRef: "openalex-international-collaboration-share"
      ymax: 15
      yTicks: [0,5,10,15]
      xTicks: [2000,2005,2010,2015,2020,2024]
      valueSuffix: "%"
      series:
        - { name: "International collaboration", color: "hope", data: [[2000,5.03],[2024,12.58]] }
    take:
      hope: "More of science is now made across borders, which fits the scale of the problems science is asked to solve."
      despair: "Collaboration can still be unequal: one institution writes the agenda while another supplies the terrain."
      confusion: "Country counts depend on institutional metadata, so unaffiliated or poorly parsed works are easier to miss."

  - eyebrow: "The missing world"
    fig: "FIG. 9"
    question: "Is the Global South entering the visible graph?"
    claim: "The share of works with a Global South institution rose from about 4.5% in 2000 to 30.4% in 2024."
    explainer: "This is the most hopeful line in the piece. OpenAlex's Global South institution flag appears on about 4.5 percent of works in 2000 and about 30.4 percent in 2024. That is not equality. It is a large opening in the formal map of knowledge.\n\nThe hard part is what the line does not say. A paper can include a Global South institution while the money, journal prestige, equipment, language, citation network, and theory-making power sit elsewhere. Participation is not control. Still, a world where more researchers can appear in the graph is different from one where they are invisible."
    captionLeft: "<b>Works with a Global South institution</b> · World · % of OpenAlex works"
    captionRight: "2000 - 2024"
    source: "Source · OpenAlex · CC0 1.0"
    chart:
      id: "s9"
      dataRef: "openalex-global-south-share"
      ymax: 35
      yTicks: [0,10,20,30]
      xTicks: [2000,2005,2010,2015,2020,2024]
      valueSuffix: "%"
      series:
        - { name: "Global South participation", color: "hope", data: [[2000,4.54],[2024,30.39]] }
    take:
      hope: "The visible research system is far less exclusively rich-world than it was at the start of the century."
      despair: "Being present in the graph is not the same as setting the agenda or receiving equal credit."
      confusion: "OpenAlex's Global South flag is institution-based; author identity, funding control, and leadership are harder questions."

  - eyebrow: "The institutions"
    fig: "FIG. 10"
    question: "Who produces the visible record?"
    claim: "Education institutions dominate, but hospitals, facilities, governments, companies, and nonprofits all appear at scale."
    explainer: "OpenAlex is useful because it does not stop at papers. It connects works to institutions, and those institutions have types. In 2024, education institutions appear on about 5.5 million works. Healthcare and facilities each appear around one million. Government, companies, nonprofits, funders, archives, and others form the rest.\n\nThat is the modern research system: universities, hospitals, national labs, companies, field stations, repositories, funders, and infrastructure. Treating science as only universities misses how medicine, AI, energy, defence, agriculture, and climate knowledge are actually made."
    captionLeft: "<b>Works by institution type</b> · 2024 · million"
    captionRight: "author institutions"
    source: "Source · OpenAlex · CC0 1.0"
    chart:
      id: "s10"
      dataRef: "openalex-institution-types-2024"
      ymax: 6
      yTicks: [0,1.5,3,4.5,6]
      xTicks: [0,1.5,3,4.5,6]
      series:
        - { name: "Works", color: "stone", data: [[2024,5.51]] }
    take:
      hope: "Knowledge production is a broad infrastructure, not just a campus activity."
      despair: "Corporate, government, and funder power can shape what questions are asked and what stays invisible."
      confusion: "Institution-type metadata is coarse; the same organization can play several roles in the research system."

  - eyebrow: "The attention"
    fig: "FIG. 11"
    question: "Who gets highly cited?"
    claim: "Among large 2020 producers, smaller rich research systems can have a higher top-cited share than the biggest producers."
    explainer: "Volume and attention are different maps, and laying one over the other breaks the obvious story. Using 2020 works so citations have time to accumulate, OpenAlex's citation-normalized top-10% flag ranks Australia first at about 27 percent, with the Netherlands, Switzerland, Italy, and the United Kingdom close behind. The surprise is lower down the list. China, the largest producer by raw volume, sits sixth at about 22 percent, above Germany and Canada. The United States, the old prestige center, lands near the bottom of this group at about 16 percent.\n\nRead this as a signal, not a scoreboard. Highly cited work follows field mix, language, collaboration networks, journal placement, and rich-country visibility. China's high share in particular is contested, because part of its citation flow circulates inside its own fast-growing literature. The United States reads low partly because OpenAlex indexes a wide American tail of reports and repository items that almost nothing cites. The narrow but real takeaway: producing the most work is not the same as producing the most-noticed work."
    captionLeft: "<b>Top-cited share by country</b> · 2020 works · % in top citation percentile band"
    captionRight: "countries with at least 75,000 works"
    source: "Source · OpenAlex · CC0 1.0"
    chart:
      id: "s11"
      dataRef: "openalex-top10-share-by-country-2020"
      ymax: 30
      yTicks: [0,5,10,15,20,25,30]
      xTicks: [0,5,10,15,20,25,30]
      valueSuffix: "%"
      series:
        - { name: "Top-cited share", color: "uncertain", data: [[2020,27.4]] }
    take:
      hope: "Influence is not only a brute-volume game; smaller systems can punch above their output."
      despair: "Citations still reward prestige, English, networks, and fashionable fields, not just truth or usefulness."
      confusion: "Citation influence should be read with field, collaboration, and time-lag context; it is a signal, not a verdict."

pullQuote:
  text: "Science is becoming more open and more global. The question is whether power is moving as fast as participation."
  cite: "Hope & Despair"

lenses:
  - who: "A student outside a rich university"
    confidence: "high"
    hope: "The open-access charts matter most. Much more of the literature is reachable without a campus login."
    despair: "Reachable is not equal. Language, training, compute, journals, and networks still decide who can use the work."
  - who: "A researcher in the Global South"
    confidence: "medium"
    hope: "Participation in the visible graph has changed dramatically since 2000."
    despair: "Participation can be subordinate. Credit, authorship order, funding, and agenda-setting power may still sit elsewhere."
  - who: "A science funder"
    confidence: "medium"
    hope: "The graph shows where new capacity exists and where collaboration could solve problems too large for one country."
    despair: "Funding can amplify existing prestige rather than build neglected institutions, languages, and local questions."

hopeCase: "The hopeful case is strong: knowledge is multiplying, more of it is open, Asia and the Global South are far more visible, and cross-border science is rising. OpenAlex makes a public graph of a system that used to be mostly locked behind commercial indexes."
despairCase: "The despairing case is that visibility is not equality. The graph can expand while power remains concentrated: rich institutions, English-language journals, citation networks, funders, companies, and prestige systems still shape what gets counted, cited, trusted, and turned into policy."
whatWouldChangeIt: "This verdict would move toward hope if Global South participation kept rising together with leadership measures: corresponding authorship, first authorship, local funding, open data, local-language dissemination, and top-cited work across neglected fields. It would move toward despair if participation rose only as junior partnership while citations, money, infrastructure, and agenda-setting stayed concentrated."

methodology:
  - { term: "OpenAlex API", detail: "The article uses official OpenAlex <code>group_by</code> queries, snapshotted under <code>data/sources/openalex</code>. The page never calls the API at runtime." }
  - { term: "Country attribution", detail: "Country bars group works by <code>authorships.institutions.country_code</code>. A multi-country paper can count for every represented country, so the bars measure footprint in the graph, not exclusive ownership." }
  - { term: "Country growth multiple", detail: "The country-growth chart divides each country's yearly country-attributed work count by its own 2000 value, so 1x means that country's 2000 output. It shows pace, not absolute size." }
  - { term: "Country share", detail: "The country-share chart divides each country's yearly country-attributed work count by all OpenAlex works in that publication year. Because country counts are non-exclusive, shares should be read as footprint, not mutually exclusive slices." }
  - { term: "Field time series", detail: "Field lines filter works by <code>primary_topic.field.id</code>, group by publication year, and show selected large fields from 2000 through 2024. The article stops at 2024 because 2025 and 2026 are still subject to indexing lag." }
  - { term: "Field growth multiples", detail: "The field-growth bar divides each selected field's 2024 output by its 2000 output. This answers what accelerated fastest, not what is largest." }
  - { term: "Open access by field", detail: "The field openness chart divides 2024 <code>is_oa:true</code> field counts by all 2024 field counts and shows large fields with at least 100,000 works." }
  - { term: "International collaboration", detail: "The collaboration line divides yearly works with <code>countries_distinct_count &gt; 1</code> by all yearly works from 2000 to 2024." }
  - { term: "Global South participation", detail: "The Global South line divides yearly works with <code>authorships.institutions.is_global_south:true</code> by all yearly works. It is institution-based, not author-identity-based." }
  - { term: "Citation influence", detail: "The attention chart uses 2020 works marked by OpenAlex as <code>citation_normalized_percentile.is_in_top_10_percent:true</code>, divided by all 2020 works for countries with at least 75,000 country-attributed works." }

sources:
  - { id: "openalex", name: "OpenAlex", url: "https://openalex.org", license: "CC0 1.0", vintage: "2026-06-13", note: "Used for works, country attribution, fields, open access, collaboration, Global South participation, institution types, and citation-normalized top-cited shares." }

revisions:
  - { date: "2026-06-13", text: "Expanded from a thin output-count article into an OpenAlex graph story: geography, fields, openness, collaboration, Global South participation, institutions, and citation attention." }
---

If you only remember one thing, remember this: science is becoming more open and more global, but power is not the same thing as participation.

The old map of knowledge was simpler: a few rich countries, elite universities, subscription journals, and everyone else at the edge. That map is no longer true.

The new map is harder. More people are inside the graph. More work is open. More countries appear. But citation, funding, infrastructure, language, and agenda-setting still decide which parts of the graph become the story of science.
