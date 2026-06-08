import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

// RSS for the atlas — published questions, newest first. Drafts are excluded until they ship.
export async function GET(context: APIContext) {
  const questions = (await getCollection('questions'))
    .filter((q) => q.data.status === 'published')
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());

  return rss({
    title: 'Hope & Despair',
    description: 'A living atlas of human progress, suffering, and uncertainty. The world is getting better. The world is getting worse. Both are true.',
    site: context.site ?? 'https://hopeanddespair.world',
    items: questions.map((q) => ({
      title: q.data.question,
      description: q.data.dek,
      link: `/questions/${q.id}/`,
      pubDate: q.data.publishedAt,
      categories: [q.data.theme],
    })),
    customData: '<language>en-us</language>',
  });
}
