# Eleventy build and delivery performance

Last verified: 2026-08-12

Optimize only from measured benchmark output. Do not add caches, split bundles,
or restructure collections speculatively — several changes that looked obviously
correct in advance turned out to be regressions when measured (see
[Rejected changes](#rejected-changes)).

## Current measurements

Three consecutive builds on the same workstation, `dist` removed before each.
CPU time (`user` + `sys`) is the comparison metric; wall time on a shared
machine varied by up to 3× during validation.

| | Before | After | Change |
| --- | ---: | ---: | ---: |
| Eleventy build (median CPU) | 16.48 s | 16.53 s | +0.3% |
| `dist` total | 864 MB | 439 MB | **−49%** |
| `src/assets/documents` | 773 MB | 368 MB | **−52%** |
| HTML total | 28,788 KB | 15,284 KB | **−47%** |
| HTML average page | 66.3 KB | 35.2 KB | **−47%** |
| HTML gzipped (site-wide) | 3,481 KB¹ | 2,609 KB | **−25%** |
| Output files | 2,098 | 1,699 | −19% |
| `feed.xml` | 748 KB | 136 KB | −82% |
| `feed.json` | 612 KB | 108 KB | −82% |
| HTML pages | 434 | 434 | unchanged |

¹ Measured with HTML minification disabled, which was the only way to isolate
the pre-existing figure; the like-for-like minified before-value was 2,614 KB.
The gzip win comes from removing per-page inlined CSS, not from minification.

Build time is deliberately flat. The work here targeted delivered bytes and
deploy payload, not build duration, and the two changes that would have cut
build time materially were both rejected on measurement.

## Supported commands

```bash
npm run build          # production build + Pagefind
npm run dev            # incremental dev server
npm run perf           # build with DEBUG=Eleventy:*Benchmark* diagnostics
npm run perf:file      # same, written to perf-output.txt
npm run docs:check     # report duplicate documents (exit 1 if any)
npm run docs:dedup     # collapse duplicates and regenerate redirects
```

Eleventy 4 alpha logs benchmarks under `Eleventy::Benchmark`; `perf` uses
`DEBUG=Eleventy:*Benchmark*` to match that namespace.

## Current implementation

### Assets and caching

- CSS and JS bundles are written to content-hashed files under
  `/assets/bundle/` and **linked**, not inlined. Inlining duplicated ~31 KB of
  CSS into all 434 pages — ~13.5 MB site-wide that no browser could cache
  across a session.
- `src/xmit.toml` is the only header config the deploy reads. Its
  `cache-control` patterns are mutually exclusive by construction, so no path
  can match two rules regardless of evaluation order.
- Content-hashed output (`/assets/bundle/`, `/pagefind/index/`,
  `/pagefind/fragment/`) is `immutable`. Anything served from a stable URL that
  changes in place — `pagefind.js`, `pagefind-ui.js`, `pagefind-entry.json`,
  the wasm blobs, and all HTML — must revalidate.
- Security headers (CSP, nosniff, frame-options, referrer-policy,
  permissions-policy) live in `src/xmit.toml`. They were previously defined only
  in `netlify.toml` and `vercel.json`, which this deploy never reads, so the
  live site served none of them.

### Documents

`src/assets/documents` carried every file twice — a flat `documents/X.pdf` and a
dated `documents/YYYY/MM/X.pdf` — from the WordPress migration. 236 redundant
copies, 404 MB. `scripts/dedup-documents.mjs` keeps one copy per unique file,
preferring whichever path the site links to, and writes a redirect for each
dropped path into a delimited block in `src/xmit.toml`.

Run `npm run docs:check` after adding documents. Do not hand-edit the generated
redirect block; the hand-written redirects above it are preserved.

### Images

- `eleventy-img` writes derivatives to `.cache/@11ty/img` so they survive
  between builds; they are copied into `dist` on `eleventy.after` with
  `force: false`, so an existing (content-hashed, therefore already correct)
  file is not rewritten. Without that, every watch rebuild recopied 53 MB.
- CI caches `.cache/@11ty/img` keyed on `hashFiles('src/assets/images/**')`.
  It was keyed on `package-lock.json`, which never changed when an image was
  added and needlessly busted when a dependency moved.

### Memoization

- `svgShortcode` caches read + SVGO output per file name. It is called ~2,200
  times per build (nav and footer icons appear on every page) and was
  re-reading and re-optimizing on every call.

Markdown rendering has never appeared as a hotspot and is not memoized.

## Latest benchmark findings

From a representative `npm run perf` run:

- `html-minify` transform: 30–40%, ~920 calls.
- Everything else is below 10% individually.

Percentages vary between runs and may overlap, because Eleventy records nested
operations. Use them to pick an investigation target, not to predict additive
savings.

## Rejected changes

Both of these were expected to be wins and were reverted after measurement.
Do not re-attempt without new evidence.

**Removing HTML minification.** Cut the build from 13.95 s to 9.99 s (−28%),
but grew delivered HTML from 2,614 KB to 3,481 KB gzipped (+33%, about +2 KB
per page). Four seconds of CI time is not worth 867 KB of visitor bandwidth on
every crawl and cold visit. `html-minifier-terser` stays.

**Removing unused markdown-it plugins.** `markdown-it-attrs`, `-footnote`,
`-emoji`, `-mark` and `-abbr` are used by zero content files today. They are
retained anyway: markdown rendering does not appear in the benchmark at all, so
removal has no measurable benefit, and footnote support is plausible future
content for an organization publishing UN statements. `markdown-it-prism` and
the syntax-highlight plugin **are** used — one post has a fenced code block and
two have inline code.

## Optimization policy

Leave collection and template structure alone while the median Eleventy build
stays below 25 s CPU. If it exceeds that:

1. Run `npm run perf` three times with warm caches.
2. Pick one repeated hotspot that materially affects total time.
3. Make the smallest change that addresses that hotspot.
4. Compare three before and three after runs on the same machine.
5. Verify page count (434), that every page's `/assets/bundle/*.css` link
   resolves, that no `http://localhost` survives a build with `URL` set, and
   that both feeds still parse.
6. Reject anything that regresses the median by more than 5% **or** increases
   delivered bytes without a matching build-time win.

Do not inline the CSS bundle again, do not cache `Date.now()`-keyed values, and
do not remove a markdown-it plugin without benchmark evidence that it is a
current hotspot.

## Known remaining issues

- Seven document links point at files that exist nowhere in the repo and were
  presumably never migrated from WordPress: `GIWC-2020-Poster.pdf`,
  `Mayor-Walsh-Columbus-15-Jun-20-final.pdf`,
  `The-Indian-Child-Welfare-Act.v3-1.pdf`, `2026/03/2026-GIWC-Poster-PR.pdf`,
  `auto-draft/UN-Handbook-2023-24.pdf`, `Haudenosaunee-women-influence-web.jpg`,
  `leaders-of-color-lunch.jpg`. They need the original files.
- `.git` is ~450 MB and still carries the deleted duplicate blobs. Shrinking it
  requires a history rewrite, which is a separate decision.
- 299 documents (~530 MB) are not linked from any page. They are retained
  deliberately — an advocacy organization's archive may be cited externally from
  URLs the site itself no longer links.
- `node-gyp` and `node-addon-api` are declared devDependencies with no imports.
  They look like a native-build workaround for `sharp`; removing them was not
  attempted because the CI install matrix cannot be tested locally.
