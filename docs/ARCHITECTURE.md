# Architecture

```text
src/content.mjs            Service and FAQ data (the single source of service copy)
scripts/build.mjs          Generates dist/: page HTML, sitemap.xml, robots.txt, 404.html and JSON-LD
scripts/head-fallback.mjs  Regenerates head.svg from the bust geometry (run manually)
public/assets/             styles.css; app.js (dialog, form, live reload, canvas renderer); head.js (bust geometry); head.svg (static fallback); logos
lib/enquiry.mjs            Field validation, SMTP configuration and HTML response rendering
server.mjs                 Static file server, POST /api/enquiry and security headers
dev.mjs                    Watch/rebuild/live-reload server on 4321; proxies the API to 4322
tests/                     node:test suites and Playwright browser checks
dist/                      Generated output (git-ignored)
.data/                     Rate-limit counters (git-ignored)
```

## Build flow
`npm run build` reads `content.mjs` and renders each page template with the shared navigation, footer and call to action. It writes the result to `dist/` and copies `public/assets` into it. `SITE_URL` sets the canonical URLs and the sitemap origin. The `--production` flag deliberately throws an error until launch is approved.

## Request flow
The browser requests pages from `server.mjs`, which serves `dist/` with the CSP and other hardening headers.

The enquiry form posts to `/api/enquiry`, either as a plain HTML form or as a JavaScript `fetch` with JSON. The server then runs these checks in order:

1. Rate limit
2. Content type and body size
3. Parse the body
4. Validate the fields
5. Origin check
6. Honeypot
7. Send through SMTP

The server reports success only if SMTP accepted the configured recipient.

## Design decisions
- **Static HTML generated at build time,** for crawlability and resilience without JavaScript.
- **Strict CSP** (`script-src 'self'`, `style-src 'self'`). Templates must not contain inline scripts or styles.
- **File-based rate limits.** Counters are keyed by a SHA-256 hash of the socket address and stored in files, so they survive restarts.
- **Server-only secrets.** The server reads secrets from its environment only, and it does not load `.env` automatically.

## Tests
| File | Covers |
| --- | --- |
| `tests/site.test.mjs` | Generated pages and metadata |
| `tests/server.test.mjs` | Static serving, headers, rate limiting and counter pruning |
| `tests/enquiry.test.mjs` | Validation, SMTP behaviour, rate limiting and error states |
| `tests/head.test.mjs` | Particle bust geometry: size, determinism, silhouette regions |
| `tests/browser.mjs` | Playwright: particle render and pause, all routes and assets, overflow, dialog, FAQs, no-JS form and reduced motion |

## Hero particle bust
`head.js` defines `bustInside(x, y)` (a stylised head, ears, neck and sloping shoulders) and `createBustPoints(small)`, which samples a seeded point cloud inside it. Points near the outline are denser and brighter, so the form reads as a glowing shell. `app.js` draws the points on the canvas with additive blending, a pre-rendered glow sprite and gentle twinkle and sway, plus floating binary digits. It runs at about 30 fps, pauses when off-screen or when the tab is hidden, and stops entirely with reduced motion. Mobile uses fewer points. After changing the geometry, run `node scripts/head-fallback.mjs` to regenerate `head.svg`.
