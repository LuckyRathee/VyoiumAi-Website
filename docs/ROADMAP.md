# Roadmap

## Done 2026-11-16
- Hero particle bust in the founder's chosen style: a human-proportioned, 3D-lit figure whose particles burst outward, with binary digits. It replaces the earlier reference-face brief.
- Design system: lime and pink on ink, capsule header, lime colour blocks and a restrained motion system across all pages.
- Visual polish: two-column content sections, styled lists and refined hero and CTA backgrounds.
- `.env.example` and automatic pruning of expired rate-limit counters.

## Possible design refinements
- Self-host a web font (for example Inter) if the system font stack is not distinctive enough.
- For closer anatomy than the procedural relief allows, sample particles from a licensed 3D bust model.
- Add real client testimonials to the marquee once they exist and are approved.

## Engineering follow-ups
1. Deployment environment examples and an operations runbook.
2. Proxy-aware client IP, once hosting is known (opt-in only; never trust `X-Forwarded-For` by default).
3. Schema and CSP validation. Routes, assets and the no-JavaScript form are already covered by the browser suite.
4. Reduce the size of `head.svg` (about 320 KB).
5. A decision on analytics and consent.

## Launch
Tracked in [../LAUNCH.md](../LAUNCH.md).
