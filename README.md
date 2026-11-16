# Vyoium AI Website

Static-first marketing website for **Vyoium AI**: AI agents, automation and integrations, websites, consulting, and managed support.

> **Development preview, not launch-ready.** Pages are intentionally `noindex`. The voice-agent product is in development. Prices, policies and business details require approval before publication.

## Stack

Node.js 22+, JavaScript ES modules, generated static HTML, plain CSS/JavaScript, Canvas particles, a Node HTTP backend, Nodemailer and Playwright. No frontend framework or client-side router is required. Navigation, FAQs and the contact submission path work without JavaScript.

## Run locally

From the repository root:

```bash
npm ci
npm run build
node dev.mjs
```

Open **http://localhost:4321**. The development server watches source/content/assets, rebuilds the pages and reloads the browser. Enquiries are proxied to a local backend on port `4322`. Stop a foreground server with `Ctrl+C`.

To run the standalone server instead:

```bash
npm run build
npm start
```

It defaults to `127.0.0.1:4321`, serves `dist/`, and handles `POST /api/enquiry`. This is not a configured public deployment.

## Verify

```bash
npm test
npm run test:browser
npm audit
```

Browser checks require the local preview running and Google Chrome installed. They exercise responsive overflow, dialog focus/Escape, native FAQs, a no-JavaScript enquiry failure and reduced-motion behaviour. Screenshots go into the ignored `artifacts/` directory.

The saved milestone passed **15 automated tests** and the browser suite. SMTP was tested against a **local test SMTP server**, not a real business inbox.

## Pages

Home (`/`), services (`/services`), five service detail pages, voice-agent development preview (`/voice-agent`), About, Contact, Privacy and Terms — **12 pages** in total.

Service detail routes:

- `/services/ai-agents`
- `/services/automation-integrations`
- `/services/websites`
- `/services/ai-consulting`
- `/services/managed-support`

Privacy and Terms are drafts, not reviewed legal policies.

## Project structure

```text
src/content.mjs              Shared services and FAQs
scripts/build.mjs            Static pages, metadata, schema and sitemap
scripts/head-fallback.mjs    Particle-head static fallback generation
public/assets/               CSS, scripts and brand assets
lib/enquiry.mjs              Validation, SMTP configuration and HTML responses
server.mjs                   Static server and enquiry endpoint
dev.mjs                      Local rebuild/reload server and backend proxy
tests/                       Automated and browser checks
HANDOFF.md                   Milestone, pending work and launch dependencies
LAUNCH.md                    Launch checklist (production build guard)
CHANGELOG.md                 Notable changes
docs/                        Full documentation — start at docs/README.md
```

Full documentation lives in [docs/](docs/README.md).

Generated output (`dist/`), dependencies, `.data/`, environment secrets, logs and screenshots are ignored by Git.

## Enquiry configuration

Set these in the **server process environment**, never frontend assets:

| Variable | Purpose |
| --- | --- |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | Port; defaults to `587` |
| `SMTP_USER` | Authentication identifier |
| `SMTP_PASS` | Authentication secret |
| `SMTP_FROM` | Sender email address |
| `ENQUIRY_TO` | Business inbox recipient |
| `SMTP_SECURE` | `true` for implicit TLS; defaults to true on port `465` |
| `SMTP_REQUIRE_TLS` | TLS required unless explicitly set to `false` |
| `SITE_URL` | Allowed origin; also used for canonical URLs at build time |
| `PORT` | Standalone port; defaults to `4321` |
| `HOST` | Bind address; defaults to `127.0.0.1` |
| `RATE_LIMIT` | Attempts per ten minutes per socket address; defaults to `6` |

The application does **not** automatically load `.env`. Supply the process environment or use Node's `--env-file` option when starting the server. Never commit credentials.

Missing SMTP configuration produces an honest unavailable response; entered fields are retained. Success requires SMTP recipient acceptance, which does not itself prove final inbox delivery. The endpoint includes server validation, body limits, honeypot handling, origin checks and persisted rate limiting. Proxy trust and rate-limit storage cleanup require deployment-specific review.

## Git workflow

- **`dev`**: working branch; commit and push tested milestones here.
- **`main`**: remains unchanged until an approved release.

```bash
git switch dev
# Build and test changes before committing.
git add <changed-files>
git commit -m "Describe the tested milestone"
git push origin dev
```

GitHub: https://github.com/LuckyRathee/VyoiumAi-Website

Local folder: `D:\GitRepo\VyouimAi-website` (preserve this folder spelling).

## Next milestone

Build a **rendered particle face closely matching the supplied monochrome three-quarter reference**, not a pasted image. This is unfinished. Draft work is preserved outside the repository; see [HANDOFF.md](HANDOFF.md) for its location and continuation notes. The website currently retains the verified procedural head.

## Before public launch

- Approve numerical service prices, currency, scope, taxes and third-party charges.
- Configure the real SMTP recipient and verify receipt in that exact business inbox.
- Supply the actual founder photo and final logo/source assets.
- Confirm capabilities, team claims and legal/business identity.
- Review Privacy and Terms against actual deployed data practices.
- Configure domain, hosting, TLS and operational protections.
- Complete comprehensive accessibility, performance, schema, route and no-JavaScript verification.
- Verify deployed crawler access, robots/headers, sitemap submissions and indexing.

The build currently rejects `--production` to prevent accidental publication before these dependencies are resolved. Crawl permission and structured data do not guarantee search ranking or AI citations.
