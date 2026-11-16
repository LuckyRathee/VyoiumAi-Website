# Roadmap

## Done 2026-11-16
- Hero particle bust in the founder's chosen style (glowing cyan head and shoulders with binary digits). It replaces the earlier reference-face brief.
- Visual polish: two-column content sections, styled lists and refined hero and CTA backgrounds.
- `.env.example` and automatic pruning of expired rate-limit counters.

## Possible hero refinements
- Tune the bust colour toward the brand pink/chartreuse if the cyan feels off-brand.
- Add subtle mouse parallax (respecting reduced motion).

## Engineering follow-ups
1. Deployment environment examples and an operations runbook.
2. Proxy-aware client IP, once hosting is known (opt-in only; never trust `X-Forwarded-For` by default).
3. Schema and CSP validation. Routes, assets and the no-JavaScript form are already covered by the browser suite.
4. Reduce the size of `head.svg` (about 290 KB).
5. A decision on analytics and consent.

## Launch
Tracked in [../LAUNCH.md](../LAUNCH.md).
