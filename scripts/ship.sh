#!/usr/bin/env bash
# One command to save AND publish your work. No branches, no merging.
#
#   pnpm ship "a short note on what you changed"
#
# It runs the safety checks, saves everything to GitHub, then publishes the live site.
# If the checks fail, it stops BEFORE saving or publishing — so the live site never breaks.

set -euo pipefail

msg="${1:-}"
if [ -z "$msg" ]; then
  echo "Usage: pnpm ship \"a short note on what you changed\"" >&2
  echo "  e.g. pnpm ship \"Debt: fix the China numbers\"" >&2
  exit 1
fi

echo "→ Checking the build (prose, charts, size, zero-JS)…"
pnpm verify

echo "→ Saving to GitHub…"
git add -A
if git diff --cached --quiet; then
  echo "  (nothing new to save — re-publishing the current state)"
else
  git commit -m "$msg"
  git push
fi

echo "→ Publishing to hopeanddespair.world…"
pnpm deploy

echo ""
echo "✓ Live: \"$msg\""
