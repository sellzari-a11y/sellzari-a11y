import Link from "next/link";
import { site } from "@/lib/site";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <div className="container-x pt-24 pb-10 md:pt-32">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="text-[clamp(2rem,4.5vw,4rem)] leading-[1] font-bold tracking-[-0.04em]">
              Let’s find the home <span className="text-sand">you’ll never want to leave.</span>
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-10 border-t border-white/15 pt-12 text-sm md:grid-cols-4">
          <div>
            <h2 className="mb-5 label text-sand">Visit</h2>
            <address className="leading-relaxed text-white/80 not-italic">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.region} {site.address.postalCode}
            </address>
          </div>
          <div>
            <h2 className="mb-5 label text-sand">Contact</h2>
            <ul className="space-y-2 text-white/80">
              <li>
                <a className="link-underline hover:text-white" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </li>
              <li>
                <a className="link-underline hover:text-white" href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>
                  {site.phone}
                </a>
              </li>
              <li>{site.hours}</li>
            </ul>
          </div>
          <div>
            <h2 className="mb-5 label text-sand">Explore</h2>
            <ul className="space-y-2 text-white/80">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link className="link-underline hover:text-white" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-5 label text-sand">Follow</h2>
            <ul className="space-y-2 text-white/80">
              {site.social.map((item) => (
                <li key={item.label}>
                  <a
                    className="link-underline hover:text-white"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        data-text={site.shortName}
        className="wordmark-ghost pointer-events-none -mb-[0.18em] text-center text-[23vw] leading-[0.8] font-bold tracking-[-0.06em] whitespace-nowrap text-white/[0.06] select-none"
      />

      <div className="container-x flex flex-col gap-2 border-t border-white/15 py-6 text-xs text-white/60 md:flex-row md:justify-between">
        <p>
          © {year} {site.name}. All rights reserved. DRE #02145678
        </p>
        <p>Equal Housing Opportunity. Information deemed reliable but not guaranteed.</p>
      </div>
    </footer>
  );
}
