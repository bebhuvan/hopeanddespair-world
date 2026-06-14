/* Build-time micro-typography for authored frontmatter prose. Markdown bodies get
   smartypants from Astro's remark pipeline; YAML fields bypass it, leaking typewriter
   apostrophes (world's) in among typographic ones (world’s) — the kind of mixed marks a
   reader feels as "clumsy" without being able to name. Conservative by design: only an
   apostrophe touching a word character is converted, so HTML attributes, URLs, and
   checksums pass through untouched. Function replacers only (CLAUDE.md: `$` in text
   corrupts string-arg replacements). */

export function smarten(s: string): string {
  return s
    .replace(/(\w)'(?=\w)/g, (_, a: string) => a + '’')   // another's, don't, you're
    .replace(/(\w)'(?!\w)/g, (_, a: string) => a + '’');  // coroners' rolls
}

/** Walk a content entry's data and smarten every string. Numbers/arrays/objects recurse. */
export function smartenDeep<T>(v: T): T {
  if (typeof v === 'string') return smarten(v) as unknown as T;
  if (Array.isArray(v)) return v.map(smartenDeep) as unknown as T;
  if (v && typeof v === 'object') {
    const o: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) o[k] = smartenDeep(val);
    return o as unknown as T;
  }
  return v;
}
