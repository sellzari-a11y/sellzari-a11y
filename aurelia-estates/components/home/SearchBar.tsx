"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { neighborhoodOptions, propertyTypes } from "@/data/properties";
import { priceBands } from "@/lib/filters";
import { cn } from "@/lib/utils";

const selectClass =
  "w-full appearance-none bg-transparent pr-6 text-base font-bold text-navy focus:outline-none cursor-pointer";

function Chevron() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="pointer-events-none absolute right-0 bottom-1 size-4 text-navy/60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** Floating hero search that hands its query to the listings page. */
export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    if (price) params.set("price", price);
    const query = params.toString();
    router.push(query ? `/listings?${query}` : "/listings");
  };

  const fields = [
    {
      id: "search-location",
      label: "Location",
      value: location,
      set: setLocation,
      any: "Any location",
      options: neighborhoodOptions.map((n) => ({ value: n, label: n })),
    },
    {
      id: "search-type",
      label: "Property type",
      value: type,
      set: setType,
      any: "Any type",
      options: propertyTypes.map((t) => ({ value: t, label: t })),
    },
    {
      id: "search-price",
      label: "Price range",
      value: price,
      set: setPrice,
      any: "Any price",
      options: priceBands.filter((b) => b.status === "sale").map((b) => ({ value: b.id, label: b.label })),
    },
  ];

  return (
    <form
      role="search"
      aria-label="Search properties"
      onSubmit={onSubmit}
      className={cn(
        "grid gap-1 rounded-2xl bg-white p-2 text-navy shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] md:grid-cols-[1fr_1fr_1fr_auto] md:items-center md:rounded-full",
        className,
      )}
    >
      {fields.map((field, i) => (
        <div
          key={field.id}
          className={cn("relative px-5 py-3 md:px-7", i > 0 && "border-t border-navy/10 md:border-t-0 md:border-l")}
        >
          <label htmlFor={field.id} className="block label text-[0.65rem] text-walnut">
            {field.label}
          </label>
          <div className="relative mt-1">
            <select
              id={field.id}
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              className={selectClass}
            >
              <option value="">{field.any}</option>
              {field.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>
      ))}
      <Button type="submit" className="m-1 md:m-0" magnetic={false}>
        Search
      </Button>
    </form>
  );
}
