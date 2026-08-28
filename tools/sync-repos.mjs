/**
 * Refreshes src/data/repos.json from the GitHub API.
 *
 *   npm run sync:repos
 *
 * Why this is a script and not a build-time fetch:
 *
 *   1. The build stays hermetic. A deploy cannot silently lose the projects
 *      section because GitHub was slow, down, or rate-limiting the builder.
 *   2. Unauthenticated GitHub allows 60 requests/hour *per IP*, and CI builders
 *      share egress IPs. Running this locally, occasionally, never gets close.
 *   3. Fetching inside `astro build` crashes Node on Windows during teardown
 *      (libuv assertion in src\win\async.c), which makes the build exit 127
 *      even though it succeeded, breaking `npm run build && wrangler deploy`.
 *
 * Unlike the old inline fetch, this fails loudly. If GitHub cannot be reached
 * the script exits non-zero and leaves the existing snapshot untouched, so you
 * find out immediately instead of shipping an empty section.
 *
 * Set GITHUB_TOKEN to raise the rate limit from 60/hour to 5000/hour:
 *
 *   $env:GITHUB_TOKEN = "ghp_..."   # PowerShell
 *   export GITHUB_TOKEN=ghp_...     # bash
 *
 * The token needs no scopes at all for public repository data.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const GITHUB_USER = 'kurtkluth';
const MAX_REPOS = 6;
const OUT = fileURLToPath(new URL('../src/data/repos.json', import.meta.url));

/** Only the fields the Projects component actually renders. Keeping this
 *  narrow keeps the committed diff readable — no churn from star counts or
 *  metadata nothing displays. */
const pick = (r) => ({
  name: r.name,
  html_url: r.html_url,
  description: r.description,
  language: r.language,
  fork: r.fork,
  pushed_at: r.pushed_at,
});

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'sqlclr.com-sync-repos',
  'X-GitHub-Api-Version': '2022-11-28',
};
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const url = `https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=30`;

let res;
try {
  res = await fetch(url, { headers, signal: AbortSignal.timeout(20_000) });
} catch (err) {
  console.error(`Could not reach the GitHub API: ${err.message}`);
  console.error('Existing snapshot left unchanged.');
  process.exit(1);
}

if (!res.ok) {
  const remaining = res.headers.get('x-ratelimit-remaining');
  console.error(`GitHub API returned ${res.status} ${res.statusText}.`);
  if (res.status === 403 && remaining === '0') {
    const reset = Number(res.headers.get('x-ratelimit-reset') ?? 0) * 1000;
    console.error(
      `Rate limit exhausted. Resets at ${new Date(reset).toLocaleTimeString()}. ` +
        'Set GITHUB_TOKEN to raise the limit to 5000/hour.',
    );
  }
  console.error('Existing snapshot left unchanged.');
  process.exit(1);
}

const all = await res.json();

if (!Array.isArray(all)) {
  console.error('Unexpected response shape from the GitHub API; expected an array.');
  process.exit(1);
}

// Originals first, then the forks I contribute to; the API already sorted by
// most recently pushed, so the freshest work stays on top within each group.
const repos = [...all.filter((r) => !r.fork), ...all.filter((r) => r.fork)]
  .slice(0, MAX_REPOS)
  .map(pick);

if (repos.length === 0) {
  console.error('GitHub returned no repositories. Refusing to write an empty snapshot.');
  process.exit(1);
}

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify({ syncedAt: new Date().toISOString(), repos }, null, 2) + '\n');

console.log(`Wrote ${repos.length} repositories to src/data/repos.json`);
for (const r of repos) {
  console.log(`  ${r.fork ? 'fork' : '    '}  ${r.name}${r.language ? `  (${r.language})` : ''}`);
}
console.log(`\nRate limit remaining: ${res.headers.get('x-ratelimit-remaining')}`);
