/* The prose-generation seam (WRITING.md). DeepSeek by default, swappable behind one function.
   OFFLINE ONLY — used by authoring/update scripts, never at request time and never in the
   client. The site is static; generated prose is committed, not produced at build. The API key
   is read from the environment and is never logged, committed, or shipped to dist. */

// Load .env for local offline runs (Node 22). No-op in environments that inject env directly.
try { (process as any).loadEnvFile?.('.env'); } catch { /* .env optional */ }

export interface GenerateOpts {
  system?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export function providerInfo() {
  return {
    provider: 'deepseek',
    base: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    keySet: Boolean(process.env.DEEPSEEK_API_KEY),
  };
}

/**
 * Generate prose via the configured provider (DeepSeek — OpenAI-compatible chat completions).
 * To swap providers, change this one function; callers are unaffected.
 */
export async function generate(prompt: string, opts: GenerateOpts = {}): Promise<string> {
  const key = process.env.DEEPSEEK_API_KEY;
  const base = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  const model = opts.model || process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  if (!key) throw new Error('DEEPSEEK_API_KEY is not set. Copy .env.example to .env and add your key.');

  const messages: { role: string; content: string }[] = [];
  if (opts.system) messages.push({ role: 'system', content: opts.system });
  messages.push({ role: 'user', content: prompt });

  const res = await fetch(`${base.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model, messages, stream: false,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 2048,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`LLM provider HTTP ${res.status}: ${detail.slice(0, 300)}`);
  }
  const json: any = await res.json();
  const content: string | undefined = json?.choices?.[0]?.message?.content;
  if (!content) throw new Error('LLM returned no content: ' + JSON.stringify(json).slice(0, 300));
  return content.trim();
}
