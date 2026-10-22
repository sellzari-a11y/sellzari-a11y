import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/property/InquiryForm";
import { MortgageCalculator } from "@/components/property/MortgageCalculator";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyPrice } from "@/components/property/PropertyPrice";
import { JsonLd } from "@/components/ui/JsonLd";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getProperty, properties, type Property } from "@/data/properties";
import { site } from "@/lib/site";
import { formatNumber } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const property = getProperty((await params).slug);
  if (!property) return {};
  const url = `/listings/${property.slug}`;
  return {
    title: property.title,
    description: property.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: property.title,
      description: property.summary,
      images: [{ url: property.images[0].src, alt: property.images[0].alt }],
    },
  };
}

function listingLd(p: Property) {
  const typeMap: Record<Property["type"], string> = {
    Villa: "SingleFamilyResidence",
    House: "SingleFamilyResidence",
    Estate: "SingleFamilyResidence",
    Townhouse: "House",
    Penthouse: "Apartment",
    Apartment: "Apartment",
  };
  const url = `${site.url}/listings/${p.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    description: p.summary,
    url,
    datePosted: p.listedAt,
    image: p.images.map((i) => i.src),
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      businessFunction:
        p.status === "sale" ? "http://purl.org/goodrelations/v1#Sell" : "http://purl.org/goodrelations/v1#LeaseOut",
      seller: { "@type": "RealEstateAgent", name: site.name, url: site.url },
    },
    about: {
      "@type": typeMap[p.type],
      name: p.title,
      numberOfRooms: p.bedrooms,
      numberOfBedrooms: p.bedrooms,
      numberOfBathroomsTotal: p.bathrooms,
      floorSize: { "@type": "QuantitativeValue", value: p.area, unitCode: "FTK" },
      yearBuilt: p.yearBuilt,
      amenityFeature: p.amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
      address: { "@type": "PostalAddress", streetAddress: p.address, addressRegion: "CA", addressCountry: "US" },
      geo: { "@type": "GeoCoordinates", latitude: p.coordinates.lat, longitude: p.coordinates.lng },
    },
  };
}

export default async function PropertyPage({ params }: { params: Params }) {
  const property = getProperty((await params).slug);
  if (!property) notFound();

  const facts = [
    { label: "Bedrooms", value: property.bedrooms },
    { label: "Bathrooms", value: property.bathrooms },
    { label: "Interior", value: `${formatNumber(property.area)} sq ft` },
    { label: "Lot", value: property.lot ? `${property.lot} acres` : "—" },
    { label: "Year built", value: property.yearBuilt },
    { label: "Parking", value: `${property.parking} spaces` },
    { label: "Type", value: property.type },
    { label: "Status", value: property.status === "sale" ? "For sale" : "For lease" },
  ];

  const similar = properties
    .filter((p) => p.slug !== property.slug)
    .sort(
      (a, b) =>
        Number(b.type === property.type) - Number(a.type === property.type) ||
        Math.abs(a.price - property.price) - Math.abs(b.price - property.price),
    )
    .slice(0, 3);

  return (
    <>
      <JsonLd data={listingLd(property)} />
      <header className="bg-navy pt-32 pb-12 text-white md:pt-44 md:pb-16">
        <div className="container-x">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
              <li>
                <Link href="/listings" className="link-underline hover:text-white">
                  Listings
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/listings?location=${encodeURIComponent(property.neighborhood)}`}
                  className="link-underline hover:text-white"
                >
                  {property.neighborhood}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-white">
                {property.title}
              </li>
            </ol>
          </nav>
          <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <SectionLabel className="text-sand">{`${property.type} · ${property.city}`}</SectionLabel>
              <RevealText as="h1" text={property.title} immediate className="mt-5 text-headline" />
              <p className="mt-6 text-white/75">{property.address}</p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <p className="label text-sand">{property.status === "sale" ? "Asking price" : "Monthly lease"}</p>
              <PropertyPrice
                property={property}
                className="mt-2 text-[clamp(2rem,4vw,3.5rem)] leading-none font-bold tracking-[-0.04em]"
              />
              <a
                href="#inquiry"
                className="mt-6 inline-flex min-h-11 items-center rounded-full bg-white px-6 text-sm font-bold text-navy transition-colors hover:bg-sand lg:hidden"
              >
                Book a viewing
              </a>
            </div>
          </div>
        </div>
      </header>

      <section aria-label="Photo gallery" className="bg-navy pb-16 md:pb-24">
        <div className="container-x">
          <PropertyGallery images={property.images} title={property.title} />
        </div>
      </section>

      <div className="container-x grid gap-16 py-20 md:py-28 lg:grid-cols-12">
        <div className="flex flex-col gap-20 lg:col-span-7">
          <section aria-labelledby="facts-heading">
            <h2 id="facts-heading" className="label text-walnut">
              Key facts
            </h2>
            <dl className="mt-6 grid grid-cols-2 border-t border-navy/10 sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="border-b border-navy/10 py-5 pr-4">
                  <dt className="text-sm text-navy/70">{fact.label}</dt>
                  <dd className="mt-1 text-xl font-bold tracking-tight">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="description-heading">
            <h2 id="description-heading" className="label text-walnut">
              The residence
            </h2>
            <p className="mt-6 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.15] font-bold tracking-[-0.03em]">
              {property.summary}
            </p>
            <div className="mt-8 flex flex-col gap-5 text-lg leading-relaxed text-navy/80">
              {property.description.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section aria-labelledby="amenities-heading">
            <h2 id="amenities-heading" className="label text-walnut">
              Amenities
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <li key={amenity} className="rounded-full border border-sand bg-offwhite px-4 py-2 text-sm font-medium">
                  {amenity}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="location-heading">
            <h2 id="location-heading" className="label text-walnut">
              Location
            </h2>
            <MapPlaceholder
              label={property.neighborhood}
              coordinates={property.coordinates}
              className="mt-6 aspect-[16/9]"
            />
          </section>

          {property.status === "sale" && (
            <section aria-labelledby="mortgage-heading">
              <h2 id="mortgage-heading" className="label text-walnut">
                Mortgage calculator
              </h2>
              <div className="mt-6">
                <MortgageCalculator price={property.price} />
              </div>
            </section>
          )}
        </div>

        <aside id="inquiry" className="scroll-mt-24 lg:col-span-4 lg:col-start-9" aria-labelledby="inquiry-heading">
          <div className="rounded-sm border border-navy/10 bg-white p-6 md:p-8 lg:sticky lg:top-28">
            <h2 id="inquiry-heading" className="text-title">
              Book a private viewing
            </h2>
            <p className="mt-3 text-navy/75">
              Viewings are by appointment only. We’ll confirm within one business day.
            </p>
            <div className="mt-8">
              <InquiryForm propertyTitle={property.title} />
            </div>
          </div>
        </aside>
      </div>

      <section aria-labelledby="similar-heading" className="bg-offwhite py-20 md:py-28">
        <div className="container-x">
          <RevealText id="similar-heading" text="You may also like" className="text-title" />
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.slug} property={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
