# Touristt website prototype

An Arabic-first (RTL) website for Touristt, a Malaysia-based education and tourism services company, with an English toggle. Its tagline is "Your journey to Malaysia, from first step to arrival" (رحلتك إلى ماليزيا، من أول خطوة حتى الوصول).

The site is plain static HTML, CSS and JS, so it runs on any host (GitHub Pages, Netlify, Cloudflare Pages, or shared hosting) without a server.

## What's in it

| Page | Path | Purpose |
|---|---|---|
| Home | `site/index.html` | Hero, 6 services, university finder, cost calculator, 5-step journey, TikTok feed, tourism, stories, partners, FAQ, WhatsApp contact form |
| University finder | `site/universities/index.html` | Filter 20 universities by field, city, type, language of study and max budget |
| University pages | `site/universities/<slug>.html` | One SEO page per university (20 pages) with JSON-LD |
| Cost calculator | `site/cost-calculator.html` | Tuition, housing, living, visa and insurance in RM or USD; sends the budget to WhatsApp |
| Nationality pages | `site/countries/{sudan,yemen,iraq,libya}.html` | Separate landing pages for ad targeting and search |
| Sudanese certificate | `site/sudan-certificate.html` | "Congratulations, graduates" landing page, reusable each exam season (`SITE.examYear`) |
| Documents checklist | `site/checklist.html` + `assets/touristt-documents-checklist.pdf` | Interactive checklist plus a bilingual PDF to download |
| Application tracker | `site/tracker.html` | Students check their stage. **Demo data only** (try `TT-26-1042` / `4821`) |

SEO: Arabic titles and descriptions on every page (for example "الدراسة في ماليزيا للطلاب السودانيين"), canonical URLs, Open Graph tags, `EducationalOrganization`, `FAQPage` and `CollegeOrUniversity` structured data, plus `sitemap.xml` and `robots.txt`.

## Editing content

All text, universities, fees, countries, FAQ and checklist items live in **`data.mjs`**. Edit it, then rebuild:

```sh
node build.mjs          # rebuild the HTML into ./site
node build.mjs --pdf    # also re-render the checklist PDF (needs Playwright + Chromium)
```

Styles are in `assets/style.css` and behaviour in `assets/app.js`. The build copies `assets/` into `site/assets/`.

## Replace before going live

These values in `data.mjs` are placeholders:

- `SITE.whatsapp` / `whatsappDisplay`: Touristt's real WhatsApp number. Every button and the contact form use it.
- `SITE.instagram`, `SITE.tiktok`, `SITE.tiktokHandle`, `SITE.email`, `SITE.domain`
- `VIDEOS[].video`: paste real TikTok video IDs, and each card turns into the official TikTok embed.
- `STORIES`: these are illustrative and labelled as examples on the page. Replace them with real students who have given consent.
- `UNIVERSITIES`: confirm which ones are actual Touristt partners. The fee ranges are indicative planning figures; check them every intake.
- Calculator rates (rent, living, EMGS and insurance) sit at the top of the calculator block in `assets/app.js`.
- Tracker: replace `DEMO_APPLICATIONS` with a real data source (for example a Google Sheet, Airtable or Firebase lookup) before students use it.

## Deploy on GitHub Pages

Publish the `touristt/site` folder, either by pushing it to a `gh-pages` branch or with a Pages workflow that uploads `touristt/site` as the artifact.
