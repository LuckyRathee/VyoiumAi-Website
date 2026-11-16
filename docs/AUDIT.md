# Audit log

The site is built, audited and refined in rounds. This file records what each round checked, found and fixed, and how to repeat an audit.

## How to run an audit
1. Start a server: `node dev.mjs` (port 4321), or `PORT=4400 node server.mjs`.
2. Run the checks:

```bash
npm test
npm run test:browser
npm run audit
```

`npm run audit` captures every page at 1440, 1024 and 390 pixels wide, plus the open dialog, menu, FAQ and the no-JavaScript enquiry result. It reports horizontal overflow, heading count, text under 11px, clipped headings, tap targets under 24px, reveals that never appear and console errors. Screenshots go to `artifacts/audit/`. Set `TEST_URL` to audit another address.

Then look at the screenshots. The script finds measurable faults; a person still has to judge whether the page looks right.

Also check by hand, because the script only captures the top of each page:
- scroll a service page and confirm section headings stay clear of the header
- press Tab through the page and confirm every focus ring is visible, including on lime
- view the home page at 1920 and 2560 pixels wide
- open the menu and the enquiry dialog at phone width
- re-read [DESIGN.md](DESIGN.md) "Founder's rules" against the build

## Round 1 (2026-11-16): every page, three widths
| Found | Fixed |
| --- | --- |
| Text under 12px in labels, card links, footer and mobile nav | 12px minimum everywhere; card and footer text raised to 13 to 16px |
| Nav, footer, breadcrumb and scroll links under 24px tall | Minimum heights of 32 to 44px |
| "Discuss a Pilot" button stretched across its column on the voice page | Button keeps its natural width |
| No-JavaScript enquiry result page had an unstyled button and cramped labels | Styled button, spaced labels, clear links |
| 404 page secondary link cramped against the button | Spacing and size corrected |
| Brand name sat low beside the logo | Vertically centred |
| The standalone server logged a failed live-reload request on localhost | Server answers that probe with 204 |

## Round 2 (2026-11-16): re-capture and independent review
| Found | Fixed |
| --- | --- |
| Contact heading broke into three lines on phones | Line break removed below 700px |
| 404 and enquiry result pages had no favicon | Favicon linked on both; the result page is also `noindex` |
| Header loaded a 156 KB logo to draw it 34px tall | Header uses the 9.5 KB logo with `srcset` for phones |
| The review flagged states the capture could not see | Covered in round 3 |

## Round 3 (2026-11-16): scrolled, focused, wide and mobile states
| Found | Fixed |
| --- | --- |
| Sticky section headings slid under the capsule header | Sticky offset raised to 112px |
| The figure never dimmed on tablets, because the entrance animation forced full opacity | Entrance keyframe no longer sets an end state; tablets show the figure at 55% |
| Lime focus ring was invisible on the lime panel | Ink focus ring inside the panel |
| At 2560px the figure's glow ended in a hard vertical edge | Hero art fades out at both sides |
| "Explore what's possible" sat left of the text column on wide screens | Aligned to the column |
| The marquee could only be paused by hovering | The "Pause animation" button now pauses it too |

Measured in round 3: one frame of the hero animation costs about 5ms on a phone-sized viewport and about 11ms on desktop with the CPU throttled 4x (about 4ms unthrottled). That is inside the 33ms budget of its 30 fps loop.

## Result
After round 3: 17 of 17 unit tests pass, the browser suite passes, and `npm run audit` reports 21 page captures with no issues.

## Known limits
- The service copy was not rewritten or reviewed in these rounds.
- The hero figure is a stylised procedural relief, not a scan of a person. It is white-blue, not the cyan of the founder's original reference image; that was a deliberate palette decision (see [DESIGN.md](DESIGN.md)).
- Fonts are the system stack. A custom font would need font files added to the project.
- No full WCAG audit with a screen reader has been done.
- Launch blockers are in [../LAUNCH.md](../LAUNCH.md).
