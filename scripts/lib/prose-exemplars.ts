/* Gold-standard explainers — hand-written to the bar we want, used as few-shot examples in the
   generator and quoted in docs/PROSE-SYSTEM.md. Each one: opens on a concrete hook (never the
   claim restated), turns a number into something a person can feel, varies its rhythm, takes a
   view, names what it can't know, and leans on commas and full stops instead of em-dashes.
   These are the reference. If the generated prose isn't this good, the system isn't done. */

export interface Exemplar {
  claim: string; facts: string; explainer: string;
  hope: string; despair: string; confusion: string;
}

export const EXEMPLARS: Exemplar[] = [
  {
    claim: 'Homicide has fallen for seven centuries.',
    facts: 'REAL DATA (homicides per 100,000): 1250≈25; peak 1370s≈34; today≈0.7; the fall is ~35-fold.',
    explainer:
      "Take a town of 40,000 people. In Western Europe around 1250, about ten of them were murdered " +
      "every year; by the 1370s, closer to fourteen. The same town today would go three or four years " +
      "between killings. Per person, a medieval European faced roughly thirty-five times your odds of " +
      "being murdered. The fall wasn't steady; it bottomed out near 1950 and has crept up a little since. " +
      "But across seven centuries, the line only ever pointed down.",
    hope: "The deadliest everyday threat our ancestors lived with has all but vanished from modern life.",
    despair: "The clean line is European; most of the world has no record this deep, and the rate has nudged up since 1950.",
    confusion: "Old counts come from coroners and court rolls. The direction is solid; the exact numbers are not.",
  },
  {
    claim: 'Roughly one in four women has faced violence from a partner.',
    facts: 'ILLUSTRATIVE chart — placeholder data; stay qualitative. The widely-cited figure is about one in four.',
    explainer:
      "One in four. That is roughly how many women, asked in careful surveys, say a partner has hit or " +
      "forced them, and the true share is almost certainly higher, because shame and fear keep most of it " +
      "unspoken. The famous curve of falling homicide is mostly men killing men in public. It barely sees " +
      "the violence behind a locked door, in kitchens and bedrooms, mostly against women. That violence has " +
      "no seven-century chart. For most of those centuries, nobody thought to count it.",
    hope: "We finally measure and name this violence; a generation ago it was invisible to the data.",
    despair: "One in four is a floor, and no country has made it fall the way it made homicide fall.",
    confusion: "How much the share really varies between countries is blurred by how differently women are able to report it.",
  },
];

/** Render the exemplars as few-shot text for a prompt. */
export const exemplarsBlock = () =>
  EXEMPLARS.map((e, i) => `EXAMPLE ${i + 1}
CLAIM (headline, already shown — do NOT restate it): ${e.claim}
FACTS: ${e.facts}
GOOD explainer:
${e.explainer}
GOOD takes — hope: ${e.hope}
GOOD takes — despair: ${e.despair}
GOOD takes — confusion: ${e.confusion}`).join('\n\n');
