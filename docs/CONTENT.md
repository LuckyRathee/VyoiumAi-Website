# Content guide

## Where content lives
- **Services and their FAQs:** `src/content.mjs` (`services` and `faqs`).
- **Page-level copy** (Home, About, Contact, Voice Agent, Privacy, Terms): templates in `scripts/build.mjs`.
- **Styling:** `public/assets/styles.css`.

## Service structure
Each service object has these fields:

- `slug`, `title`, `summary`
- `question`, `answer` (the answer-first intro)
- `problem`, `audience`, `examples`
- `deliverables`, organised as Understand / Build / Connect / Support
- `exclusions`, `inputs`, `integrations`, `support`, `faqs`

Services: AI Agents, Automation & Integrations, Websites, AI Consulting, Managed Support.

To add a service, add an object to `services`. The build then creates `/services/<slug>`, adds a card on `/services` and the home page, and adds the page to the sitemap.

## Content rules (do not break)
- Label every example "Illustrative example, not a client result".
- Publish no numerical prices until the founder approves them. Pricing FAQs say prices are "pending founder approval".
- Make no claims of building or training foundation models, and no guaranteed rankings, return on investment or accuracy.
- Describe the voice agent only as in development.
- Never ask visitors to send passwords or API keys.
- Use no fabricated testimonials, client names or legal assertions.

## Editing workflow
1. Edit the content.
2. With `node dev.mjs` running, check the page at `http://localhost:4321`. It rebuilds and reloads automatically.
3. Run `npm test`. Some tests assert page content.
