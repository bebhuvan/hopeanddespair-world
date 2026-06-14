import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { categories } from '../lib/categories';

// /llms.txt — the emerging convention for making a site legible to language models: a clean,
// linked map of what this is and where the substance lives. Generated from the questions so it
// never drifts. (Everything here is open data, openly licensed; crawl freely.)
const SITE = 'https://hopeanddespair.world';

export const GET: APIRoute = async () => {
  const questions = (await getCollection('questions')).sort((a, b) => a.data.order - b.data.order);

  const qLines = questions
    .map((q) => `- [${q.data.question}](${SITE}/questions/${q.id}): ${q.data.verdict}.`)
    .join('\n');

  const catLines = categories
    .map((c) => `- [${c.name}](${SITE}/categories/${c.slug}): ${c.blurb}`)
    .join('\n');

  const body = `# Hope & Despair

> A living atlas answering one question — is the world getting better or worse? — across many dimensions, with open, cited data and plain-spoken narrative. Its thesis: progress and catastrophe coexist, and the answer depends on the lens. Every question is read at two distances (the long arc of history and the world as it feels now) and in three temperatures (hope, despair, and confusion).

This site is static HTML with zero client JavaScript for comprehension; every chart is build-time inline SVG with downloadable data and full lineage. Original prose, code, and chart designs are licensed CC BY 4.0; source datasets keep their own licences and are cited per chart. Crawl and quote freely, with attribution to hopeanddespair.world.

## The questions
${qLines}

## Browse by domain
${catLines}

## How it works
- [Method](${SITE}/methodology): how a source becomes a chart, and an honest note on the limits of counting.
- [Sources](${SITE}/sources): every dataset behind the atlas, with licence and vintage.
- [License](${SITE}/license): CC BY 4.0 for our work; the data carries its own terms.
- [About](${SITE}/about): why this exists and who makes it (a one-person project, written with AI assistance, edited by a human).
- [RSS feed](${SITE}/rss.xml)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
