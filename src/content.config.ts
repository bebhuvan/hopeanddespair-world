import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One question per article. Frontmatter is structured data (the single source of truth);
// the article is rendered from it. See PLAN.md §6 and WRITING.md for the anatomy.
// Authored prose strings may contain light inline HTML (<em>, <b>) — trusted, we author it.

const point = z.tuple([z.number(), z.number()]);
const colorToken = z.enum(['hope', 'despair', 'uncertain', 'ochre']).default('hope');
const temp = z.enum(['cool', 'warm']);

const take = z.object({ hope: z.string(), despair: z.string(), confusion: z.string() });

const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/questions' }),
  schema: z.object({
    question: z.string(),
    dek: z.string(),
    theme: z.string(),                 // e.g. "War & Peace"
    kickerNumber: z.string(),          // e.g. "01"
    verdict: z.string(),               // the one-line home verdict
    order: z.number(),                 // home ordering
    publishedAt: z.coerce.date(),
    illustrative: z.boolean().default(true),
    // A question is listed on the home atlas as soon as it has core + atlas; the full article
    // body (evidence, movements, …) is optional until written. 'draft' renders a stub page.
    status: z.enum(['published', 'draft']).default('draft'),

    // home atlas placement on the hope↔despair axis (0 = hope, 1 = despair)
    atlas: z.object({
      hope: z.object({ pos: z.number().min(0).max(1), lens: z.string() }),
      despair: z.object({ pos: z.number().min(0).max(1), lens: z.string() }),
    }),

    caveats: z.array(z.string()).optional(),

    evidence: z.object({
      heroLabel: z.string(),
      hero: z.array(point),
      windows: z.array(z.object({
        lab: z.string(), range: z.string(), from: z.number(), to: z.number(),
        verdict: z.string(), temp,
      })),
      readout: z.string(),
      signals: z.array(z.object({
        fig: z.string(), name: z.string(), unit: z.string(), badUp: z.boolean(), data: z.array(point),
      })),
      recentFrom: z.number(),
      recentTo: z.number(),
      recentVerdict: z.string(),
      recentTemp: temp,
      synthesis: z.string(),
      vantageNote: z.string(),
    }).optional(),

    movements: z.array(z.object({
      eyebrow: z.string(),
      fig: z.string(),
      claim: z.string(),
      explainer: z.string(),
      dropCap: z.boolean().default(false),
      sidenote: z.object({ mark: z.string(), text: z.string() }).optional(),
      captionLeft: z.string(),
      captionRight: z.string(),
      source: z.string(),
      chart: z.object({
        id: z.string(),
        // when set, the page replaces the inline (illustrative) series with the real derived
        // series produced by the pipeline (src/data/derived/<dataRef>.json) + its provenance.
        dataRef: z.string().optional(),
        ymax: z.number(),
        yTicks: z.array(z.number()),
        xTicks: z.array(z.number()),
        x0: z.number().optional(),
        x1: z.number().optional(),
        annot: z.object({ x: z.number(), label: z.string() }).optional(),
        series: z.array(z.object({ name: z.string(), color: colorToken, data: z.array(point) })),
      }),
      take,
    })).optional(),

    pullQuote: z.object({ text: z.string(), cite: z.string() }).optional(),

    lenses: z.array(z.object({
      who: z.string(), confidence: z.string(),
      hope: z.string().optional(), despair: z.string().optional(),
    })).optional(),

    hopeCase: z.string().optional(),
    despairCase: z.string().optional(),
    whatWouldChangeIt: z.string().optional(),

    methodology: z.array(z.object({ term: z.string(), detail: z.string() })).optional(),
    sources: z.array(z.object({
      id: z.string(), name: z.string(), url: z.string(), license: z.string(),
      vintage: z.string(), note: z.string().optional(),
    })).optional(),
    // Revision history is generated from git later; authored for now.
    revisions: z.array(z.object({ date: z.string(), text: z.string() })).optional(),
  }),
});

export const collections = { questions };
