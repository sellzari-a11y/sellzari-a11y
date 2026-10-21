"use client";

import { AnimatePresence, m } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { neighborhoodOptions, properties, propertyTypes } from "@/data/properties";
import {
  applyFilters,
  defaultFilters,
  parseFilters,
  priceBands,
  serializeFilters,
  sortOptions,
  type Filters,
} from "@/lib/filters";
import { cn } from "@/lib/utils";
import { FilterSelect } from "./FilterSelect";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "sale", label: "Buy" },
  { value: "rent", label: "Rent" },
] as const;

const countOptions = [0, 1, 2, 3, 4, 5];

export function ListingsExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => parseFilters(new URLSearchParams(searchParams.toString())));
  const [view, setView] = useState<"grid" | "list">("grid");
  const [panelOpen, setPanelOpen] = useState(false);

  const results = useMemo(() => applyFilters(properties, filters), [filters]);

  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    // A price band only makes sense for its own listing status.
    const band = priceBands.find((b) => b.id === next.price);
    if (band && next.status !== "all" && band.status !== next.status) next.price = "";
    setFilters(next);
    const query = serializeFilters(next);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const bandGroups = (["sale", "rent"] as const).filter((s) => filters.status === "all" || filters.status === s);
  const activeCount = (["location", "type", "price", "beds", "baths"] as const).filter(
    (key) => filters[key] !== defaultFilters[key],
  ).length;

  return (
    <section aria-label="Property search" className="bg-white pb-24 md:pb-40">
      <div className="sticky top-0 z-30 border-b border-navy/10 bg-white/90 backdrop-blur-md">
        <div className="container-x flex flex-col gap-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div role="radiogroup" aria-label="Listing status" className="flex rounded-full bg-offwhite p-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={filters.status === option.value}
                  onClick={() => update({ status: option.value })}
                  className="relative rounded-full px-5 py-2 text-sm font-bold"
                >
                  {filters.status === option.value && (
                    <m.span
                      layoutId="status-pill"
                      className="absolute inset-0 rounded-full bg-navy"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative transition-colors",
                      filters.status === option.value ? "text-white" : "text-navy",
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="flex min-h-11 items-center gap-2 rounded-full border border-navy/20 px-5 text-sm font-bold md:hidden"
              aria-expanded={panelOpen}
              aria-controls="filter-panel"
              onClick={() => setPanelOpen((o) => !o)}
            >
              Filters
              {activeCount > 0 && <span className="rounded-full bg-royal px-2 text-xs text-white">{activeCount}</span>}
            </button>
          </div>

          <div
            id="filter-panel"
            className={cn("grid grid-cols-2 gap-x-6 gap-y-4 md:grid md:grid-cols-5", panelOpen ? "grid" : "hidden")}
          >
            <FilterSelect
              id="filter-location"
              label="Location"
              value={filters.location}
              onChange={(v) => update({ location: v })}
            >
              <option value="">Any location</option>
              {neighborhoodOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect id="filter-type" label="Type" value={filters.type} onChange={(v) => update({ type: v })}>
              <option value="">Any type</option>
              {propertyTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect id="filter-price" label="Price" value={filters.price} onChange={(v) => update({ price: v })}>
              <option value="">Any price</option>
              {bandGroups.map((status) => (
                <optgroup key={status} label={status === "sale" ? "Buy" : "Rent"}>
                  {priceBands
                    .filter((b) => b.status === status)
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label}
                      </option>
                    ))}
                </optgroup>
              ))}
            </FilterSelect>
            <FilterSelect
              id="filter-beds"
              label="Bedrooms"
              value={filters.beds}
              onChange={(v) => update({ beds: Number(v) })}
            >
              {countOptions.map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "Any" : `${n}+`}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              id="filter-baths"
              label="Bathrooms"
              value={filters.baths}
              onChange={(v) => update({ baths: Number(v) })}
            >
              {countOptions.slice(0, 5).map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "Any" : `${n}+`}
                </option>
              ))}
            </FilterSelect>
          </div>
        </div>
      </div>

      <div className="container-x">
        <h2 className="sr-only">Results</h2>
        <div className="flex flex-wrap items-center justify-between gap-4 py-8">
          <p aria-live="polite" className="text-sm text-navy/75">
            <span className="text-2xl font-bold text-navy tabular-nums">{results.length}</span>{" "}
            {results.length === 1 ? "residence" : "residences"}
            {activeCount > 0 && (
              <button
                type="button"
                onClick={() => update({ ...defaultFilters, sort: filters.sort })}
                className="ml-4 link-underline font-bold text-royal"
              >
                Clear filters
              </button>
            )}
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="label text-[0.65rem] text-walnut">
                Sort
              </label>
              <select
                id="sort"
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as Filters["sort"] })}
                className="cursor-pointer bg-transparent text-sm font-bold text-navy focus:outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden items-center gap-1 md:flex" role="group" aria-label="Layout">
              {(["grid", "list"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={view === mode}
                  aria-label={`${mode} view`}
                  onClick={() => setView(mode)}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full transition-colors",
                    view === mode ? "bg-navy text-white" : "text-navy hover:bg-offwhite",
                  )}
                >
                  {mode === "grid" ? (
                    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="currentColor">
                      <rect x="3" y="3" width="8" height="8" rx="1" />
                      <rect x="13" y="3" width="8" height="8" rx="1" />
                      <rect x="3" y="13" width="8" height="8" rx="1" />
                      <rect x="13" y="13" width="8" height="8" rx="1" />
                    </svg>
                  ) : (
                    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="currentColor">
                      <rect x="3" y="4" width="18" height="4" rx="1" />
                      <rect x="3" y="10" width="18" height="4" rx="1" />
                      <rect x="3" y="16" width="18" height="4" rx="1" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-start gap-6 border-t border-navy/10 py-24">
            <p className="text-title">No homes match those filters — yet.</p>
            <p className="max-w-md text-navy/75">
              Many of our listings are shared privately. Loosen your search, or tell us what you’re looking for and
              we’ll reach out when the right home appears.
            </p>
            <button
              type="button"
              onClick={() => update(defaultFilters)}
              className="rounded-full bg-royal px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-navy"
            >
              Reset search
            </button>
          </div>
        ) : (
          <m.ul
            layout
            className={cn(
              "grid gap-x-8",
              view === "grid" ? "gap-y-14 sm:grid-cols-2 xl:grid-cols-3" : "gap-y-10 md:divide-y md:divide-navy/10",
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((property, i) => (
                <m.li
                  key={property.slug}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 6) * 0.04 }}
                  className={cn(view === "list" && "md:pt-10")}
                >
                  <PropertyCard property={property} layout={view} priority={i < 3} />
                </m.li>
              ))}
            </AnimatePresence>
          </m.ul>
        )}
      </div>
    </section>
  );
}
