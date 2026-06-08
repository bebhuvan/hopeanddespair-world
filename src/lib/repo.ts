import { execFileSync } from 'node:child_process';

/* Build-time git helpers for the "living atlas" revision trail (PLAN §6, DATA.md §10).
   The revision history is generated FROM git — never hand-maintained, so it can't go stale.
   Diff links auto-resolve from the `origin` remote; until a remote exists, entries show the
   short SHA without a link.

   Uses execFileSync with an argument array (no shell) — paths are passed as args, never
   interpolated into a command string. */

function git(args: string[]): string {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

let _base: string | null | undefined;
/** https://github.com/<owner>/<repo> derived from the origin remote, or null if none. */
export function repoBaseUrl(): string | null {
  if (_base !== undefined) return _base;
  const url = git(['remote', 'get-url', 'origin']);
  const m = url.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);
  _base = m ? `https://github.com/${m[1]}/${m[2]}` : null;
  return _base;
}

export interface Revision { sha: string; short: string; date: string; subject: string; url: string | null; }

/** Commit history for one file (follows renames). Each entry links to its diff when a remote exists. */
export function gitHistory(relPath: string, limit = 25): Revision[] {
  const out = git(['log', '--follow', '--format=%H%x1f%cs%x1f%s', '-n', String(limit), '--', relPath]);
  if (!out) return [];
  const base = repoBaseUrl();
  return out.split('\n').filter(Boolean).map((line) => {
    const [sha, date, subject] = line.split('\x1f');
    return { sha, short: sha.slice(0, 7), date, subject, url: base ? `${base}/commit/${sha}` : null };
  });
}

/** Link to a file's full commit history on the remote (every diff), or null. */
export function fileHistoryUrl(relPath: string): string | null {
  const base = repoBaseUrl();
  return base ? `${base}/commits/main/${relPath}` : null;
}
