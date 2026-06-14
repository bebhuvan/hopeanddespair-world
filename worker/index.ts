// Cloudflare Worker that serves the static build (Workers Static Assets, not Pages) and pins
// one canonical host. www → apex 301 so the site never splits across two hostnames, and the
// content-hashed assets are cached forever while HTML stays revalidatable.

interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Canonical host is the apex. Send any www.* (or a stray preview host hitting the domain) to it.
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    const res = await env.ASSETS.fetch(request);

    // Immutable, content-hashed bundles and the search index can cache forever.
    if (url.pathname.startsWith('/_assets/') || url.pathname.startsWith('/pagefind/')) {
      const r = new Response(res.body, res);
      r.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return r;
    }
    return res;
  },
};
