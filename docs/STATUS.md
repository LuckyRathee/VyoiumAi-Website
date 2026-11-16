# Completeness assessment

_Assessed 2026-11-16 on branch `dev`._

**Summary:** The engineering for the development preview is complete. The site is **not launch-ready**. The remaining launch blockers are mostly business inputs and hosting decisions, not code.

## Done and verified
- 12 static pages generated from `src/content.mjs` and `scripts/build.mjs`.
- Responsive design and the logo; two-column content sections and styled lists.
- Hero: procedural cyan particle bust with floating binary digits, a pause toggle, a reduced-motion fallback and a static SVG for no-JS.
- `.env.example` and automatic pruning of expired rate-limit counters.
- Enquiry backend: validation, honeypot, origin check, body limit, persisted rate limiting, SMTP delivery through Nodemailer and honest failure states.
- Security headers and a Content Security Policy (CSP) in `server.mjs`.
- Sitemap, `robots.txt` (disallows all crawlers in the preview), JSON-LD structured data and a 404 page.
- All 16 automated tests pass (`npm test`, 2026-11-16).
- The browser suite passes (`npm run test:browser`, 2026-11-16). It checks the particle render, pause toggle, every route and asset, the dialog, FAQs, overflow, the no-JS form and reduced motion.

## Partial
- **Real SMTP delivery:** tested only against a local test server.
- **Privacy and Terms:** drafts, not legally reviewed.

## Not started or blocked on business input
- Approved prices, currency and taxes.
- A real founder photo and a vector source for the logo.
- Confirmation of the business and legal identity; domain, hosting and TLS.
- Production deployment configuration and proxy-aware client IP.
- A full accessibility, performance, no-JavaScript and route audit.
- A decision on analytics and consent handling.

See [../LAUNCH.md](../LAUNCH.md).
