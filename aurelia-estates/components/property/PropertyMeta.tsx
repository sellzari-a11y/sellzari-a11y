import type { Property } from "@/data/properties";
import { cn, formatNumber } from "@/lib/utils";

/** Beds · baths · area summary line. */
export function PropertyMeta({ property, className }: { property: Property; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-sm", className)}>
      <li>
        <span className="font-bold">{property.bedrooms}</span> Beds
      </li>
      <li aria-hidden className="opacity-40">
        /
      </li>
      <li>
        <span className="font-bold">{property.bathrooms}</span> Baths
      </li>
      <li aria-hidden className="opacity-40">
        /
      </li>
      <li>
        <span className="font-bold">{formatNumber(property.area)}</span> Sq Ft
      </li>
    </ul>
  );
}
