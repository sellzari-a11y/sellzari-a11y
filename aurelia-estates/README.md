# Aurelia Estates

An editorial, award-style real estate website built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, GSAP + ScrollTrigger and Lenis.

> “Aurelia Estates” is a placeholder brand. Rename it in one place: `lib/site.ts`.

## Getting started

Requires Node.js 18.18+ (Node 20 or newer recommended).

```bash
cd aurelia-estates
npm install
npm run dev        # http://localhost:3000
```

| Script              | What it does                           |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Start the dev server                   |
| `npm run build`     | Production build                       |
| `npm start`         | Serve the production build             |
| `npm run lint`      | ESLint (Next.js core-web-vitals + TS)  |
| `npm run typecheck` | TypeScript, no emit                    |
| `npm run format`    | Prettier (with Tailwind class sorting) |

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://aurelia-estates.com`) in production so canonical URLs, Open Graph tags, the sitemap and JSON-LD use your real domain.

## Project structure

```
app/
  layout.tsx              Root layout: Poppins via next/font, metadata, header/footer, preloader
  template.tsx            Page transition (navy curtain + fade) on every route change
  page.tsx                Home
  listings/page.tsx       Filterable listings
  listings/[slug]/        Property detail (static params, metadata, JSON-LD)
  about/  contact/        Inner pages
  not-found.tsx           Custom 404
  sitemap.ts robots.ts    SEO routes
  opengraph-image.tsx     Generated Open Graph image
components/
  layout/                 Header (hide-on-scroll), MobileMenu, Footer, NewsletterForm, PageHeader
  providers/              Lenis + GSAP smooth scroll, preloader state, MotionConfig
  ui/                     Button, Magnetic, Cursor, Preloader, RevealText, RevealImage,
                          Marquee, Counter, SmartImage, Field, MapPlaceholder, JsonLd
  home/                   Hero, SearchBar, FeaturedProperties (pinned horizontal scroll),
                          Intro, Services, Neighborhoods, Stats, Testimonials, CtaBand
  listings/               ListingsExplorer, FilterSelect
  property/               PropertyCard, PropertyGallery (lightbox), MortgageCalculator, InquiryForm
  about/ contact/         TeamGrid, ContactForm
data/
  properties.ts           14 typed mock listings
  content.ts              Services, neighborhoods, stats, values, section images
  team.ts testimonials.ts
lib/
  site.ts                 Brand name, contact details, navigation, socials
  filters.ts              Listing filter/sort logic + URL (de)serialisation
  schemas.ts              Zod schemas for every form
  gsap.ts                 Lazy GSAP/ScrollTrigger loader
  motion-features.ts      Framer Motion features, loaded async via <LazyMotion>
  images.ts mortgage.ts utils.ts
hooks/
  useMediaQuery.ts        Media-query + fine-pointer detection
  useScrollTriggerEffect.ts  Scoped, lazily-loaded GSAP effects with cleanup
```

## Customising

### Brand name and contact details

Edit `lib/site.ts`. The name, short name (used for the wordmark), tagline, email, phone, address, hours, socials and navigation all flow from there.

### Colours

Colours are defined once as CSS variables in `app/globals.css` and exposed to Tailwind via `@theme`:

```css
:root {
  --navy: #0b2545; /* primary: hero, footer, dark sections */
  --royal: #1d4ed8; /* accents, links, hover states */
  --walnut: #6b4423; /* warm secondary highlight */
  --sand: #d9c3a5; /* soft tint for cards and dividers */
  --white: #ffffff;
  --offwhite: #f7f5f2; /* alternate section background */
}
```

Change a value there and every `bg-navy`, `text-royal`, `border-sand`, etc. updates. The fluid type scale (`text-display`, `text-headline`, `text-title`) lives in the same `@theme` block.

### Fonts

Poppins (400/500/700) is loaded with `next/font/google` in `app/layout.tsx`. It is self-hosted at build time, so visitors make no requests to Google. Swap the import to change typeface.

### Listings

All listings live in `data/properties.ts` and are fully typed (`Property`). To add one, append an object to the `properties` array — the listings grid, filters, detail page, sitemap and JSON-LD pick it up automatically. Set `featured: true` to include it in the home page’s horizontal scroller. `status: "rent"` treats `price` as monthly rent.

Price-range filter bands are in `lib/filters.ts` (`priceBands`).

### Images

Images are served from Unsplash through `next/image` (`images.unsplash.com` is whitelisted in `next.config.ts`). Use the `unsplash(id)` helper in `lib/images.ts`, or swap to your own CDN by adding its host to `remotePatterns`. `SmartImage` adds a branded blur placeholder and degrades gracefully if an image fails to load.

### Forms

The newsletter, contact and viewing-request forms validate with `react-hook-form` + `zod` (`lib/schemas.ts`). Submissions currently call `fakeSubmit()`; replace it with your API route, CRM or form service.

### Map

`components/ui/MapPlaceholder.tsx` is a stylised stand-in that receives coordinates — replace it with Mapbox or Google Maps when you have an API key.

## Motion and accessibility notes

- **Preloader** counts 0–100 then wipes away with a clip-path; the hero animates in underneath.
- **Lenis** drives scrolling from GSAP’s ticker so ScrollTrigger stays in sync. GSAP and Lenis are dynamically imported after the preloader finishes, Framer Motion’s animation features load asynchronously through `LazyMotion`, and the custom cursor only loads on fine-pointer devices.
- **Reduced motion:** when `prefers-reduced-motion` is set, Lenis, GSAP scroll effects, the preloader animation and the stat counters are skipped, Framer Motion drops transform animations (`MotionConfig reducedMotion="user"`), and CSS animations are neutralised.
- Skip link, visible focus rings, labelled controls, ARIA on the carousel, menu, lightbox and filters, keyboard support for the slider (←/→) and lightbox (←/→/Esc).
- JSON-LD: `RealEstateAgent` site-wide and `RealEstateListing` on each property page.
