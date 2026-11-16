# Roadmap

## Next milestone: reference particle face
Render a particle face that closely matches the supplied three-quarter monochrome reference image. It must keep these features:

- dark eye sockets
- the nose, lips and chin silhouette
- white and grey particles
- two bright highlights in the eye region

It must be real particle rendering, not a pasted image. Particle positions derived from the image must be described as image-derived, not as true 3D geometry. Verify the result visually before claiming a match.

Unfinished draft work is preserved at `D:\GitRepo\VyouimAi-website-wip`; [HANDOFF.md](../HANDOFF.md) describes it.

## Engineering follow-ups
1. Deployment environment examples and an operations runbook.
2. Proxy-aware client IP and rate-limit cleanup.
3. A validation suite for routes, assets, no-JavaScript behaviour, schema and the CSP.
4. Reduce the size of `head.svg`.
5. A decision on analytics and consent.

## Launch
Tracked in [../LAUNCH.md](../LAUNCH.md).
