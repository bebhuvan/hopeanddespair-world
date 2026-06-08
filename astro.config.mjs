// @ts-check
import { defineConfig } from 'astro/config';

// hopeanddespair.world — static-first ([[PERFORMANCE.md]]).
// Output is a static site; the chart-heavy pages are pre-rendered HTML + inline SVG with
// no client charting library. Interactivity (if ever added) is opt-in islands only.
export default defineConfig({
  site: 'https://hopeanddespair.world',
  output: 'static',
  build: {
    // content-hashed, immutable assets → cache-forever on the CDN
    assets: '_assets',
  },
  prefetch: false,
  compressHTML: true,
});
