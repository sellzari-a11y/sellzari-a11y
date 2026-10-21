import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Property } from "@/data/properties";
import { cn } from "@/lib/utils";
import { PropertyMeta } from "./PropertyMeta";
import { PropertyPrice } from "./PropertyPrice";

type Layout = "grid" | "list" | "feature";

/**
 * Listing card. The image zooms on hover while a "View" pill slides in; in
 * list layout the card becomes a horizontal row.
 */
export function PropertyCard({
  property,
  layout = "grid",
  priority = false,
  className,
}: {
  property: Property;
  layout?: Layout;
  priority?: boolean;
  className?: string;
}) {
  const isList = layout === "list";
  const sizes = {
    grid: "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw",
    list: "(min-width: 768px) 40vw, 100vw",
    feature: "(min-width: 768px) 45vw, 85vw",
  }[layout];

  return (
    <article className={cn("group relative", className)}>
      <Link
        href={`/listings/${property.slug}`}
        data-cursor="View"
        className={cn("flex flex-col gap-5", isList && "md:grid md:grid-cols-12 md:items-center md:gap-10")}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-sm bg-sand",
            layout === "feature" ? "aspect-[4/5] md:aspect-[4/3]" : "aspect-[4/3]",
            isList && "md:col-span-5",
          )}
        >
          <SmartImage
            src={property.images[0].src}
            alt={property.images[0].alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy backdrop-blur">
              {property.status === "sale" ? "For Sale" : "For Rent"}
            </span>
            <span className="rounded-full bg-navy/80 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              {property.type}
            </span>
          </div>
          <span
            aria-hidden
            className="absolute right-4 bottom-4 flex size-12 translate-y-3 items-center justify-center rounded-full bg-royal text-white opacity-0 transition-all duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" className="size-5 -rotate-45" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>

        <div className={cn("flex flex-col gap-3", isList && "md:col-span-7")}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label text-walnut">{property.neighborhood}</p>
              <h3 className="mt-2 text-xl leading-tight font-bold tracking-tight md:text-2xl">
                <span className="link-underline">{property.title}</span>
              </h3>
            </div>
            {!isList && <PropertyPrice property={property} className="shrink-0 pt-6 text-lg font-bold" />}
          </div>
          {isList && (
            <>
              <p className="max-w-xl text-navy/75">{property.summary}</p>
              <PropertyPrice property={property} className="text-2xl font-bold" />
            </>
          )}
          <PropertyMeta property={property} className="border-t border-navy/10 pt-3 text-navy/80" />
        </div>
      </Link>
    </article>
  );
}
