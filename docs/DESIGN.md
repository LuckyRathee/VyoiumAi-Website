# Design

## Direction
Minimal, dark and calm, with bold lime colour blocks and one piece of signature motion: the particle figure in the hero. About 80% of every page is flat, high-contrast content; about 20% is intentional motion.

## Colour
| Token | Value | Use |
| --- | --- | --- |
| `--black` / `--ink` | `#07090d` | Page background (deep blue-black ink); text on lime |
| `--ink-2` | `#0c1017` | Tonal band behind the services grid |
| `--surface` | `#0e1117` | Dialogs and menus |
| `--hair` | `rgba(255,255,255,.08)` | Hairline borders |
| `--text` | `#eef3f7` | Headings and body |
| `--muted` | `#9aa6b2` | Secondary text |
| `--lime` | `#d4ff3f` | **Brand and highlights**: labels, bullets, focus rings, active steps, the featured service card and the final call-to-action panel |
| `--pink` | `#ff2dab` | **Actions only**: buttons and the highlighted hero word |

Rules:
- The palette comes from the logo: lime and pink on ink. Do not add a third accent.
- Pink means "act". Lime is the brand colour. It marks small details, and it fills at most one block per screen.
- On lime, use ink text and an ink button with lime text. Never put pink on lime.
- The hero figure, glows and binary digits are neutral cool white-blue light, not a brand colour.
- Colours stay solid. No gradients between two colours.
- `--cyan` and `--accent` are aliases of `--lime`, kept so older rules keep working.

Inspiration: the layout ideas (floating capsule header, bold solid colour blocks, monospace labels, large tight headlines) follow the founder's other site, nimitai.com. The colours are deliberately different.

## Typography
System stack: `Satoshi, Avenir Next, Segoe UI, sans-serif`. Small section labels (eyebrows) use the system monospace stack in lime. Body copy uses a line-height of 1.6 to 1.65. No web fonts are loaded; self-hosting one is a roadmap option (the CSP blocks third-party font hosts).

## Motion
| Element | Spec |
| --- | --- |
| Hero and page intro entrance | Fade up 20px, 0.6s, ease-out, 60ms stagger |
| Scroll reveals | Fade up 20px, 0.5s, ease-out, 80ms stagger, trigger 20px inside the viewport |
| Buttons | Lighter pink and a soft glow on hover; `scale(0.98)` on press. Buttons never move on hover |
| Service cards | Lime border and a soft top glow on hover; the card's visual animates (typing dots, flowing connections, drawing lines); the same state on tap. Cards do not lift or tilt |
| Header | Floating capsule from 701px up, sticky with glass blur; becomes more opaque after 24px of scroll |
| Scroll progress | 2px solid lime bar at the top |
| Marquee | One slow capabilities band (60s loop), pauses on hover |
| Page transitions | Cross-fade via the View Transitions API where supported |
| Hero figure | Canvas particles at about 30 fps; pause button; stops off-screen |

Rules:
- Animate only `opacity`, `transform` and `translate`, so nothing shifts layout.
- No endless decorative loops other than the hero figure and the marquee.
- Everything stops under `prefers-reduced-motion`, and content is visible without JavaScript.
- The marquee lists services. Do not put testimonials in it until real, approved ones exist.

## Layout
- Generous whitespace; sections separated by hairlines.
- Content sections use two columns on desktop (question left, answer right) and one column below 1000px.
- Lists use lime bullets and dividers.
- One tonal band (`--ink-2`) sits behind the services grid to break up the page.
- The final call to action is a lime panel with 28px corners.

## Surfaces and depth
- Borders are 1px hairlines: `--hair` (`rgba(255,255,255,.08)`) and `--hair-strong` (`.14`). Avoid solid grey boxes.
- Cards, panels and dialogs use the `--card` gradient surface, an inner top highlight and `--radius` (18px). Buttons and inputs use `--radius-sm` (10px).
- Soft radial glows sit behind the hero, page intros, the founder panel and the final call to action. Keep them under 10% opacity.
- Headings use letter-spacing of -0.035em; the hero display line uses -0.04em.

## Services bento grid
- Six columns on desktop: the first service is a featured card (four columns, solid lime, text left and visual right); the others span two.
- Two columns on tablets with the featured card full width; one column on phones.
- Each card has a small abstract visual for its domain: chat for agents, connected nodes for automation, a browser frame for websites, a roadmap for consulting and a monitoring line for support.
- The visuals are decorative and `aria-hidden`. They contain no numbers, names or claims, and they animate only on hover or tap.

## Icons
One icon family, defined in `scripts/build.mjs` (`ICONS` and `icon()`): 24px grid, 1.5px round strokes, `currentColor`. Use it for arrows, the menu chevron, FAQ toggles, the dialog close button and the service icons. Do not mix in text glyphs or other icon sets.

## Founder's rules (never break these)
Set by the founder on 2026-11-16. They apply to every future change.

**Never use:**
- purple, or gradients that blend into purple (keep pink and lime as separate solid colours)
- buttons or links that shift, slide or tilt on hover
- effects that follow or animate with the cursor
- over-the-top scroll animation (the 20px fade-up is the ceiling)
- emoji or decorative text glyphs as icons (use the icon set)
- em dashes in any site copy
- fake reviews, testimonials, metrics, customer names or contact details
- placeholder or made-up hero text
- AI-generated photos or generic filler copy
- a "made with AI" tag or badge anywhere on the site

**Launch gates** are listed in [../LAUNCH.md](../LAUNCH.md).
