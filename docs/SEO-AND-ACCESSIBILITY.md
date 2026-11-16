# SEO and accessibility

## SEO
- **Per-page metadata:** a unique title and description, and a canonical URL built from `SITE_URL`.
- **JSON-LD structured data:** WebSite, WebPage, Organization (with founder Person), Service, FAQPage and BreadcrumbList.
- **Sitemap:** `sitemap.xml` lists all 12 pages.
- **Preview blocking:** the preview is `noindex,nofollow` and `robots.txt` disallows all crawlers. This is intentional; [DEPLOYMENT.md](DEPLOYMENT.md) explains how to enable crawling at launch.
- **Answer-first copy:** each service page opens with a question and a direct answer, which helps search and AI answer engines.
- **No guarantees:** allowing crawlers and adding structured data do not guarantee rankings or AI citations. Do not claim they do.

## Accessibility
- **Implemented:**
  - semantic landmarks and native `<details>` FAQs
  - labelled form fields
  - an enquiry dialog with focus management and Escape to close
  - a reduced-motion fallback and a pause toggle for the particle bust
  - `aria-hidden` on decorative images
- **Browser tests cover:** the particle render and pause toggle, every route and asset, horizontal overflow, dialog focus, FAQs, form failure without JavaScript, and reduced motion.
- **Pending:**
  - a full WCAG 2.2 AA audit (contrast and a screen-reader pass)
  - a Lighthouse performance budget; `public/assets/head.svg` is about 290 KB and could be optimised
