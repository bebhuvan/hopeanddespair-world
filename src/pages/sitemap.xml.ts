import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { categories } from '../lib/categories';
import { gitHistory } from '../lib/repo';

// Hand-rolled sitemap (no extra integration). Lists every indexable URL with a last-modified
// date drawn from git where we have one, so search and AI crawlers see a fresh, complete map.
const SITE = 'https://hopeanddespair.world';

export const GET: APIRoute = async () => {
  const questions = await getCollection('questions');
  const today = new Date().toISOString().slice(0, 10);

  const urls: { loc: string; lastmod?: string; priority?: string }[] = [
    { loc: '/', priority: '1.0', lastmod: today },
    { loc: '/about', priority: '0.5' },
    { loc: '/methodology', priority: '0.5' },
    { loc: '/sources', priority: '0.5' },
    { loc: '/license', priority: '0.4' },
    { loc: '/archive', priority: '0.4' },
    { loc: '/search', priority: '0.3' },
    ...categories.map((c) => ({ loc: `/categories/${c.slug}`, priority: '0.6' })),
    ...questions.map((q) => {
      const hist = gitHistory(`src/content/questions/${q.id}.md`, 1);
      return { loc: `/questions/${q.id}`, priority: '0.8', lastmod: hist[0]?.date ?? today };
    }),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}${u.priority ? `<priority>${u.priority}</priority>` : ''}</url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
