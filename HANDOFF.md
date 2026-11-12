# Vyoium AI — development handoff

## Working agreement
- Repository: `D:\GitRepo\VyouimAi-website` (preserve this folder spelling).
- GitHub: https://github.com/LuckyRathee/VyoiumAi-Website
- Work and commit tested milestones on `dev`. Keep `main` unchanged until an approved release.
- Live preview: `http://localhost:4321`; start with `node dev.mjs` from this repository. Automatically rebuilds/reloads source changes.

## Verified milestone
- Twelve static marketing pages with native navigation, FAQs and contact form.
- Responsive dark/pink/chartreuse design and supplied VAi logo.
- Procedural particle head with defined facial features and reduced-motion fallback.
- SMTP enquiry delivery implementation, server validation, honeypot, persisted rate limiting, bounded bodies and honest failure states.
- `npm run build`, all 15 `npm test` checks and `npm run test:browser` pass.
- SMTP integration tested against a local test server only; no real business inbox delivery verified.

## Next work — user correction takes precedence
The founder wants a **rendered particle face closely matching the supplied three-quarter monochrome reference**, not a pasted image and not the current generic front-facing head. Preserve its facial proportions, dark eye sockets, nose/lips/chin silhouette, white/grey particles and two bright eye-region highlights. Build and visually verify actual particle rendering before claiming a match. The reference is not sufficient to claim a reconstructed true 3D mesh; distinguish image-derived particle positions from actual 3D geometry.

Unfinished reference-face work was removed from the working tree to retain the last passing milestone and preserved at `D:\GitRepo\VyouimAi-website-wip`:
- `reference-face.patch` (unfinished build/test edits; do not apply as finished code)
- `particle-face.webp` (lossless copy of reference, useful as input for particle mapping only)
- `hero-image.css`
- `particles-browser.mjs` (test exists; renderer has not been implemented)

Original reference: `C:\Users\Lucky Rathee\AppData\Roaming\Hermes\composer-images\image_f0a9c6.png`.

## Before public launch
Real recipient/SMTP configuration and verified inbox receipt; approved service prices/currency/taxes; actual founder photo; logo source/vector asset; confirmed capabilities/business/legal identity; reviewed privacy and terms; canonical domain/hosting; completed crawler/indexing/schema/accessibility/performance checks. Build intentionally remains noindex and blocks `--production`. Do not represent the current state as launch-ready.

## Known engineering follow-ups
- Add deployment-specific environment examples and operational instructions.
- Configure rate-limit retention/cleanup and proxy-aware client IP only after hosting is known.
- Validate all routes/assets, deployed schema/CSP and no-JavaScript behaviour comprehensively.
- The dev proxy is local-only, not a production deployment setup.
