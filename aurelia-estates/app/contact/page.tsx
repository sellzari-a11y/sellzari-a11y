import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Speak with an advisor at ${site.name}. Visit our Beverly Hills office or send us a message.`,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact", url: "/contact" },
};

export default function ContactPage() {
  const tel = site.phone.replace(/[^+\d]/g, "");
  return (
    <>
      <PageHeader label="Contact" title="Let’s talk">
        <p>
          Whether you’re buying, selling or simply curious, a partner will respond personally within one business day.
        </p>
      </PageHeader>

      <section className="bg-white py-20 md:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <aside aria-label="Office information" className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9">
            <div>
              <h2 className="label text-walnut">Office</h2>
              <address className="mt-4 text-xl leading-snug font-bold tracking-tight not-italic">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postalCode}
              </address>
              <p className="mt-2 text-navy/75">{site.hours}</p>
            </div>
            <div className="h-px bg-sand" aria-hidden />
            <div>
              <h2 className="label text-walnut">Direct</h2>
              <ul className="mt-4 space-y-2 text-xl font-bold tracking-tight">
                <li>
                  <a href={`mailto:${site.email}`} className="link-underline hover:text-royal">
                    {site.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${tel}`} className="link-underline hover:text-royal">
                    {site.phone}
                  </a>
                </li>
              </ul>
            </div>
            <MapPlaceholder label={site.name} coordinates={{ lat: 34.0669, lng: -118.4004 }} className="aspect-[4/3]" />
          </aside>
        </div>
      </section>
    </>
  );
}
