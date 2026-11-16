# Architecture

```text
src/content.mjs            Service and FAQ data (the single source of service copy)
scripts/build.mjs          Generates dist/: page HTML, sitemap.xml, robots.txt, 404.html and JSON-LD
scripts/head-fallback.mjs  Regenerates head.svg from the bust geometry (run manually)
public/assets/             styles.css; app.js (dialog, form, live reload, canvas renderer); head.js (bust geometry); head.svg (static fallback); logos
lib/enquiry.mjs            Field validation, SMTP configuration and HTML response rendering
server.mjs                 Static file server, POST /api/enquiry and security headers
dev.mjs                    Watch/rebuild/live-reload server on 4321; proxies the API to 4322
tests/                     node:test suites, Playwright browser checks and the visual audit (audit.mjs)
dist/                      Generated output (git-ignored)
.data/                     Rate-limit counters (git-ignored)
```

## Build flow
`npm run build` reads `content.mjs` and renders each page template with the shared navigation, footer and call to action. It writes the result to `dist/` and copies `public/assets` into it. `SITE_URL` sets the canonical URLs and the sitemap origin. The `--production` flag deliberately throws an error until launch is approved.

## Request flow
The browser requests pages from `server.mjs`, which serves `dist/` with the CSP and other hardening headers. Unknown paths get the built `dist/404.html` with a 404 status. `/__reload` returns 204: the page script probes it on localhost for dev live reload, and 204 tells it to stop outside `dev.mjs`.

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
| `tests/head.test.mjs` | Particle bust: human proportions, smooth outline, determinism, particle counts |
| `tests/audit.mjs` | Visual and layout audit across every page and width (`npm run audit`) |
| `tests/browser.mjs` | Playwright: particle render and pause, all routes and assets, overflow, dialog, FAQs, no-JS form and reduced motion |

## Hero particle bust
`head.js` exposes `BUST` and `createBustPoints(small)`:

1. **Outline.** A smooth curve through anatomical landmarks (crown, temple, ear, jaw, neck, trapezius, deltoid) in head-height units gives the silhouette. `BUST.halfWidth(y)` and `BUST.inside(x, y)` query it.
2. **Depth field.** `BUST.depth(x, y)` combines a head ellipsoid with gentle facial relief, a neck and a chest, blended smoothly. Surface normals from it drive a key light and a rim light (`BUST.shade`).
3. **Particles.** Points are sampled with density proportional to the lighting, plus a traced outline and a set of burst particles that carry a direction, distance and speed.

`app.js` flattens the points into typed arrays, groups them into brightness buckets and draws them with additive blending at about 30 fps. The figure holds a slight three-quarter turn and sways a few degrees. Nothing follows the cursor. Burst particles travel outward, fade and re-form. A scan line passes down the figure. Rendering pauses off-screen, in a hidden tab, or when paused, and stops with reduced motion. Mobile uses fewer points.

The geometry is a stylised relief, not a scanned or modelled human. After changing it, run `node scripts/head-fallback.mjs` to regenerate `head.svg` with the same projection.

## Motion system
The end of `app.js` adds a scroll progress bar, the header's scrolled state, and scroll reveals (an `IntersectionObserver` adds `.in` to `.reveal` elements). Reveals only hide content after JavaScript adds `.motion` to `<html>`, so pages stay fully visible without JavaScript. See [DESIGN.md](DESIGN.md) for the rules.
