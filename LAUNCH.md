# Launch checklist

`node scripts/build.mjs --production` stays blocked until every item below is done. Tick each item once it is approved or verified.

## Founder's launch gates
Set by the founder on 2026-11-16. The site does not launch until all of these are true.

- [ ] Custom domain connected
- [ ] Favicon in place (an SVG favicon is linked today; confirm it is the final one)
- [ ] No "made with AI" tag or badge anywhere on the site (none exists today; re-check before launch)
- [ ] Privacy policy page final (a draft exists at `/privacy`)
- [ ] Terms and conditions page final (a draft exists at `/terms`)
- [ ] Site passes the "never use" rules in [docs/DESIGN.md](docs/DESIGN.md)

## Business decisions (founder)
- [ ] Numerical prices, currency, taxes and third-party charges approved
- [ ] Capabilities, team and business claims confirmed
- [ ] Legal and business identity and registered details confirmed
- [ ] Privacy and Terms reviewed against actual data practices

## Assets
- [ ] Actual founder photo
- [ ] Final logo with vector source

## Infrastructure
- [ ] Domain, hosting and TLS/HSTS
- [ ] SMTP credentials and `ENQUIRY_TO` configured, and **receipt in the real inbox verified**
- [ ] Proxy-aware client IP (expired counters are already pruned)

## Verification
- [ ] Accessibility, performance, schema, route and no-JavaScript audits
- [ ] Production `robots.txt`, headers and sitemap live; indexing verified
- [ ] `npm test`, `npm run test:browser` and `npm audit` clean

## Release
Follow [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
