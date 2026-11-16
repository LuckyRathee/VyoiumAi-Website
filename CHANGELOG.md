# Changelog

## Unreleased (dev)
- fix: audit rounds 2 and 3: sticky headings clear the header, tablet figure dimming, ink focus ring on lime, wide-screen glow edge, mobile contact heading, favicons on the 404 and enquiry pages, lighter header logo, marquee pauses with the pause button.
- test: add `npm run audit`, a repeatable visual and layout audit; docs: add docs/AUDIT.md.
- style: final palette from the logo (lime and pink on ink) with a neutral white-blue figure; floating capsule header, lime featured service card, lime call-to-action panel, monospace labels and a tonal band behind services.
- style: apply the founder's rules: no shifting buttons, no cursor-following effects, no blended gradients, no glyph icons, no em dashes; record the rules in docs/DESIGN.md and the launch gates in LAUNCH.md.
- style: elevation pass with hairline borders, layered surfaces, rounded corners, a bento services grid with domain visuals, and one 1.5px stroke icon set.
- feat: rebuild the hero figure with human proportions, 3D lighting, bursting particles, a scan line and pointer response.
- style: new theme (deep ink, pink for actions, cyan for highlights) and a motion system: entrances, scroll reveals, sticky glass header, scroll progress, card spotlight, marquee band, page transitions.
- feat: styled enquiry result page; the server now serves the built 404 page.
- feat: replace the hero head with a procedural cyan particle bust and floating binary digits; regenerate the static fallback.
- style: two-column content sections, styled lists, hero edge fade, CTA glow, card hover lift; fix the missing space in the CTA heading on mobile.
- feat: prune expired rate-limit counters automatically; add `.env.example`.
- test: particle bust geometry, counter pruning, and browser checks for the hero, pause toggle and all routes and assets.
- docs: add the `docs/` documentation set, `LAUNCH.md` (referenced by the build's production guard) and this changelog.

## Earlier milestones
- docs: setup verification workflow and launch requirements.
- fix: define particle facial features and the static fallback.
- feat: validated SMTP enquiries and persisted rate limiting.
- feat: static Vyoium AI site and live development preview.
