# Vyoium AI: development handoff

## Working agreement
- Repository: `D:\GitRepo\VyouimAi-website` (preserve this folder spelling).
- GitHub: https://github.com/LuckyRathee/VyoiumAi-Website
- Work and commit tested milestones on `dev`. Keep `main` unchanged until an approved release.
- Live preview: `http://localhost:4321`; start with `node dev.mjs` from this repository. Automatically rebuilds/reloads source changes.

## Verified milestone
- Twelve static marketing pages with native navigation, FAQs and contact form.
- Responsive dark/pink/chartreuse design and supplied VAi logo.
- Procedural white-blue particle bust (anatomically proportioned head and shoulders, 3D-lit, with bursting particles and floating binary digits), pause toggle, reduced-motion and no-JS SVG fallback.
- Design system: deep ink background, logo lime for blocks and highlights, pink for actions, capsule header, restrained motion (see docs/DESIGN.md).
- Two-column content sections, styled lists and refined hero/CTA backgrounds.
- `.env.example`, expired rate-limit counter pruning and a `docs/` documentation set.
- SMTP enquiry delivery implementation, server validation, honeypot, persisted rate limiting, bounded bodies and honest failure states.
- `npm run build`, all 17 `npm test` checks, `npm run test:browser` and `npm run audit` (21 page captures) pass after three audit rounds (docs/AUDIT.md).
- SMTP integration tested against a local test server only; no real business inbox delivery verified.

## Hero direction (decided 2026-11-16)
The founder replaced the three-quarter monochrome reference-face brief with a **front-facing glowing particle bust surrounded by floating binary digits**. On the same day they asked for a minimal, distinctive palette and layout inspiration from nimitai.com; the result is lime and pink on ink with a neutral white-blue figure. They supplied a watermarked stock image as a style reference only; it is not used or copied. The current implementation is original procedural geometry in `public/assets/head.js`. The earlier reference-face drafts in `D:\GitRepo\VyouimAi-website-wip` are superseded and need not be continued.

## Before public launch
Real recipient/SMTP configuration and verified inbox receipt; approved service prices/currency/taxes; actual founder photo; logo source/vector asset; confirmed capabilities/business/legal identity; reviewed privacy and terms; canonical domain/hosting; completed crawler/indexing/schema/accessibility/performance checks. Build intentionally remains noindex and blocks `--production`. Do not represent the current state as launch-ready.

## Known engineering follow-ups
- Add deployment-specific environment examples and operational instructions.
- Configure proxy-aware client IP only after hosting is known (expired rate-limit counters are now pruned automatically).
- Validate all routes/assets, deployed schema/CSP and no-JavaScript behaviour comprehensively.
- The dev proxy is local-only, not a production deployment setup.
