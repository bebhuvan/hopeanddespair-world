import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One question per article. Frontmatter is structured data (the single source of truth);
// the article is rendered from it. See PLAN.md §6 and WRITING.md for the anatomy.
// Authored prose strings may contain light inline HTML (<em>, <b>) — trusted, we author it.

const point = z.tuple([z.number(), z.number()]);
const colorToken = z.enum(['hope', 'despair', 'uncertain', 'ochre', 'stone']).default('hope');
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
    // a denser opening — paragraphs shown after the dek, setting up the thesis + how to read
    intro: z.array(z.string()).optional(),

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
      // The sub-question this chart answers. When set, it leads the movement (the chart is a
      // sub-question; the claim is its plain answer; the explainer is the working). See WRITING.md.
      question: z.string().optional(),
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
        // multi-line real charts: one derived series per line, in the same order as `series`
        // (so each line keeps its authored name + colour). Used for regional dispersion.
        dataRefs: z.array(z.string()).optional(),
        ymax: z.number(),
        ymin: z.number().optional(),   // non-zero y floor (e.g. a recent-years zoom where a small dip must read)
        yTicks: z.array(z.number()),
        xTicks: z.array(z.number()),
        x0: z.number().optional(),
        x1: z.number().optional(),
        annot: z.object({ x: z.number(), label: z.string() }).optional(),
        // Tufte-style direct labels: { x, label } draws a dashed era line; adding y puts a dot on
        // the line at that real value and names the event beside it.
        annots: z.array(z.object({ x: z.number(), label: z.string(), y: z.number().optional() })).optional(),
        // Horizontal threshold rules (replacement 2.1, natural sex ratio 105) — drawn across the
        // plot, labelled at the left so they never collide with the right-edge series labels.
        refLines: z.array(z.object({ y: z.number(), label: z.string() })).optional(),
        // appended to every end-of-line value label (e.g. "%" for a share chart)
        valueSuffix: z.string().optional(),
        series: z.array(z.object({ name: z.string(), color: colorToken, data: z.array(point), dashed: z.boolean().optional() })),
      }),
      // The other two magnifications, so every section reads world → region → country (not just the
      // global line). Same shape as the keystone dimensions; axes auto-computed from the real series.
      // `regional`: a multi-line strip of derived regional refs. `countries`: a ranked bars artifact.
      regional: z.object({ label: z.string(), note: z.string().optional(), refs: z.array(z.object({ ref: z.string(), name: z.string(), color: colorToken })) }).optional(),
      countries: z.object({ label: z.string(), note: z.string().optional(), ref: z.string() }).optional(),
      take,
    })).optional(),

    // The keystone hub: each dimension is a mini-suite of real derived series (referenced by
    // chartId). Axes are auto-computed in src/lib/keystone-charts.ts — frontmatter stays light.
    dimensions: z.array(z.object({
      key: z.string(),
      name: z.string(),
      cluster: z.enum(['better', 'worse', 'both']),
      verdict: z.string(),
      verdictTemp: temp,
      verdict2: z.string().optional(),         // split (direction-and-pace) verdict
      verdict2Temp: temp.optional(),
      claim: z.string(),
      explainer: z.string().optional(),        // compact hub prose (the deep dive lives in the room)
      epistemic: z.enum(['measured', 'estimated', 'reconstructed', 'contested']).default('measured'),
      // each chart may carry a one-sentence `note` — the "what to take from this", shown under it
      carrying: z.object({ ref: z.string(), label: z.string(), note: z.string().optional(), color: colorToken.optional(), x0: z.number().optional(), x1: z.number().optional() }),
      counter: z.object({ ref: z.string(), label: z.string(), note: z.string().optional(), color: colorToken.optional(), x0: z.number().optional(), x1: z.number().optional() }).optional(),
      // extra full-size charts that back a prose claim the carrying/counter don't show
      secondary: z.array(z.object({ ref: z.string(), label: z.string(), note: z.string().optional(), color: colorToken.optional(), x0: z.number().optional(), x1: z.number().optional() })).optional(),
      regional: z.object({ label: z.string(), note: z.string().optional(), refs: z.array(z.object({ ref: z.string(), name: z.string(), color: colorToken })) }).optional(),
      // The country lens: a ranked bar strip from a committed kind:'bars' artifact — named countries
      // make the abstraction concrete where a regional average hides the spread.
      countries: z.object({ label: z.string(), note: z.string().optional(), ref: z.string() }).optional(),
      // A focused two-country trajectory (same shape as regional) — what a regional average hides:
      // a handful of named countries traced over time, for the curious reader.
      countryTrend: z.object({ label: z.string(), note: z.string().optional(), refs: z.array(z.object({ ref: z.string(), name: z.string(), color: colorToken })) }).optional(),
      hero: z.object({ ref: z.string(), windows: z.array(z.object({ lab: z.string(), range: z.string(), from: z.number(), to: z.number(), verdict: z.string(), temp })) }).optional(),
      signals: z.array(z.object({ ref: z.string(), name: z.string(), unit: z.string(), badUp: z.boolean() })).optional(),
      take,
      deepLink: z.string().optional(),
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
