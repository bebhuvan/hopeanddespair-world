import { generate, providerInfo } from './lib/llm.ts';

/* `pnpm llm:check` — verifies the DeepSeek key is set and the provider is reachable, without
   ever printing the key. Runs locally with your .env. */

const info = providerInfo();
console.log(`provider · ${info.provider}`);
console.log(`base     · ${info.base}`);
console.log(`model    · ${info.model}`);
console.log(`key set  · ${info.keySet ? 'yes' : 'NO'}`);

if (!info.keySet) {
  console.error('\n✗ DEEPSEEK_API_KEY not found.\n  Run:  cp .env.example .env   then add your key to .env (it is gitignored).');
  process.exit(1);
}

try {
  const out = await generate('Reply with exactly: OK', {
    system: 'You are a terse test assistant.', temperature: 0, maxTokens: 10,
  });
  console.log(`\n✓ provider reachable — sample reply: ${JSON.stringify(out)}`);
} catch (e) {
  console.error(`\n✗ call failed: ${(e as Error).message}`);
  process.exit(1);
}
