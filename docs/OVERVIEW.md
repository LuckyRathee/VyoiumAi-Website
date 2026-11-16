# Overview

## What it is
This is the marketing website for **Vyoium AI**. The company offers AI agents, automation and integrations, websites, AI consulting and managed support. Founder: Lucky Rathee.

## Who it is for
It targets established small and medium businesses that have a repeatable workflow, an accountable owner and approved data. Visitors should quickly understand what is on offer and be able to send a dependable enquiry.

## What it does
- Explains five services. Each one covers the problem, the audience, illustrative examples, deliverables, exclusions, required inputs, integrations, support and FAQs.
- Gives a transparent preview of the voice-agent product. It is **in development** and not available yet.
- Provides a contact form that delivers enquiries through SMTP. When delivery is unavailable, the form says so honestly.
- Provides About, Privacy and Terms pages. Privacy and Terms are drafts.

## Principles
1. **Honesty over hype.** Every example is labelled "Illustrative example, not a client result". The site has no invented testimonials, prices, rankings or capabilities.
2. **Static-first.** Every page is meaningful HTML without JavaScript. Navigation, FAQs and the enquiry form all work with JavaScript disabled.
3. **No overclaimed delivery.** The form reports success only when the SMTP server accepts the configured recipient.
4. **Not launch-ready until approved.** Pages are `noindex`, and `build --production` is blocked until the [launch checklist](../LAUNCH.md) is complete.

## Pages (12)
`/`, `/services`, `/services/ai-agents`, `/services/automation-integrations`, `/services/websites`, `/services/ai-consulting`, `/services/managed-support`, `/voice-agent`, `/about`, `/contact`, `/privacy`, `/terms`, plus a generated `404.html`.

## Design
The site uses a dark theme with pink and chartreuse accents and the supplied VAi logo. The hero has a procedural Canvas particle head with a static SVG fallback, reduced-motion support and a motion toggle.

## Stack
Node.js 22+, ES modules, generated static HTML (`scripts/build.mjs`), plain CSS and JavaScript, a Node HTTP server, Nodemailer and Playwright. There is no frontend framework.
