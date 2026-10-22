import type { Property } from "@/data/properties";
import { formatPrice } from "@/lib/utils";

export function PropertyPrice({ property, className }: { property: Property; className?: string }) {
  return (
    <p className={className}>
      {formatPrice(property.price)}
      {property.status === "rent" && <span className="text-[0.6em] font-medium opacity-70"> / month</span>}
    </p>
  );
}
