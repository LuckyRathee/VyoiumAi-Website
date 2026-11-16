# Completeness assessment

_Assessed 2026-11-16 on branch `dev`._

**Summary:** The engineering for the development preview is largely complete. The site is **not launch-ready**. The remaining launch blockers are mostly business inputs and hosting decisions, not code.

## Done and verified
- 12 static pages generated from `src/content.mjs` and `scripts/build.mjs`.
- Responsive design, the logo, and the particle head with its static fallback and reduced-motion handling.
- Enquiry backend: validation, honeypot, origin check, body limit, persisted rate limiting, SMTP delivery through Nodemailer and honest failure states.
- Security headers and a Content Security Policy (CSP) in `server.mjs`.
- Sitemap, `robots.txt` (disallows all crawlers in the preview), JSON-LD structured data and a 404 page.
- All 15 automated tests pass (`npm test`, re-run 2026-11-16).
- A browser suite exists (`npm run test:browser`). It passed at the last milestone and was not re-run in this assessment.

## Partial
- **Real SMTP delivery:** tested only against a local test server.
- **Privacy and Terms:** drafts, not legally reviewed.
- **Particle head:** a generic procedural head. The founder wants a face that matches a supplied reference image (see [ROADMAP.md](ROADMAP.md)).

## Not started or blocked on business input
- Approved prices, currency and taxes.
- A real founder photo and a vector source for the logo.
- Confirmation of the business and legal identity; domain, hosting and TLS.
- Production deployment configuration, proxy-aware client IP and rate-limit cleanup.
- A full accessibility, performance, no-JavaScript and route audit.
- A decision on analytics and consent handling.

See [../LAUNCH.md](../LAUNCH.md).
