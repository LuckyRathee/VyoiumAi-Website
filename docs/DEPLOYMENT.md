# Deployment

**Status: not configured yet.** Hosting, the domain and TLS are still undecided. `dev.mjs` is for local development only and is not a production setup.

## Requirements
- Either a Node.js 22+ process running `server.mjs`, or static `dist/` hosting that proxies `/api/enquiry` to such a process.
- HTTPS with HSTS at the edge.
- Server-side environment variables (see [ENQUIRY-BACKEND.md](ENQUIRY-BACKEND.md)) and a persistent, writable `.data/` directory.
- `SITE_URL` set to the canonical origin at build time.

## Release procedure
Do this only after [LAUNCH.md](../LAUNCH.md) is complete.

1. Replace the disallow-all `robots.txt` with a crawl policy that allows Googlebot, Bingbot, OAI-SearchBot and PerplexityBot. Remove the `noindex,nofollow` meta tag.
2. Deliberately remove the `--production` guard in `scripts/build.mjs`.
3. Build with `SITE_URL` set, run all test suites and deploy `dist/` with the server.
4. Send a real enquiry and confirm it arrives in the business inbox.
5. Submit the sitemap to search consoles, then merge `dev` into `main` and tag the release.
