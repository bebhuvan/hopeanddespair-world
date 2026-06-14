// @ts-check
import { defineConfig } from 'astro/config';

// hopeanddespair.world — static-first ([[PERFORMANCE.md]]).
// Output is a static site; the chart-heavy pages are pre-rendered HTML + inline SVG with
// no client charting library. Interactivity (if ever added) is opt-in islands only.
export default defineConfig({
  site: 'https://hopeanddespair.world',
  output: 'static',
  // Slash-FREE canonical URLs (`/questions/slug`, no trailing slash). Internal links and the
  // sitemap are already authored slash-free; this makes the canonical tag and Astro.url agree with
  // them, so there is one canonical shape site-wide. The worker (html_handling: drop-trailing-slash)
  // redirects any `/slug/` → `/slug`, so existing trailing-slash links keep working — nothing breaks.
  trailingSlash: 'never',
  build: {
    // content-hashed, immutable assets → cache-forever on the CDN
    assets: '_assets',
    // inline ALL CSS into the HTML — kills the render-blocking stylesheet requests (the biggest
    // LCP/FCP cost on a static page). Our per-page CSS is small and brotli-compresses well.
    inlineStylesheets: 'always',
  },
  prefetch: false,
  compressHTML: true,
});
