import type { ListingStatus, Property } from "@/data/properties";

export interface PriceBand {
  id: string;
  label: string;
  status: ListingStatus;
  min: number;
  max: number;
}

export const priceBands: PriceBand[] = [
  { id: "under-4m", label: "Under $4M", status: "sale", min: 0, max: 4_000_000 },
  { id: "4m-10m", label: "$4M – $10M", status: "sale", min: 4_000_000, max: 10_000_000 },
  { id: "10m-20m", label: "$10M – $20M", status: "sale", min: 10_000_000, max: 20_000_000 },
  { id: "20m-plus", label: "$20M+", status: "sale", min: 20_000_000, max: Infinity },
  { id: "rent-under-15k", label: "Under $15K / mo", status: "rent", min: 0, max: 15_000 },
  { id: "rent-15k-plus", label: "$15K+ / mo", status: "rent", min: 15_000, max: Infinity },
];

export const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "area-desc", label: "Largest" },
] as const;

export type SortValue = (typeof sortOptions)[number]["value"];

export interface Filters {
  status: "all" | ListingStatus;
  location: string;
  type: string;
  price: string;
  beds: number;
  baths: number;
  sort: SortValue;
}

export const defaultFilters: Filters = {
  status: "all",
  location: "",
  type: "",
  price: "",
  beds: 0,
  baths: 0,
  sort: "newest",
};

/** Reads filters from URL search params, ignoring anything invalid. */
export function parseFilters(params: URLSearchParams): Filters {
  const status = params.get("status");
  const sort = params.get("sort");
  const price = params.get("price") ?? "";
  const band = priceBands.find((b) => b.id === price);
  return {
    status: status === "sale" || status === "rent" ? status : (band?.status ?? "all"),
    location: params.get("location") ?? "",
    type: params.get("type") ?? "",
    price: band ? band.id : "",
    beds: Math.max(0, Number(params.get("beds")) || 0),
    baths: Math.max(0, Number(params.get("baths")) || 0),
    sort: sortOptions.some((o) => o.value === sort) ? (sort as SortValue) : "newest",
  };
}

/** Serialises only the non-default filters back to a query string. */
export function serializeFilters(filters: Filters) {
  const params = new URLSearchParams();
  (Object.keys(defaultFilters) as (keyof Filters)[]).forEach((key) => {
    if (filters[key] !== defaultFilters[key]) params.set(key, String(filters[key]));
  });
  return params.toString();
}

export function applyFilters(list: Property[], f: Filters) {
  const band = priceBands.find((b) => b.id === f.price);
  const result = list.filter(
    (p) =>
      (f.status === "all" || p.status === f.status) &&
      (!f.location || p.neighborhood === f.location) &&
      (!f.type || p.type === f.type) &&
      (!band || (p.status === band.status && p.price >= band.min && p.price < band.max)) &&
      p.bedrooms >= f.beds &&
      p.bathrooms >= f.baths,
  );

  const sorters: Record<SortValue, (a: Property, b: Property) => number> = {
    newest: (a, b) => b.listedAt.localeCompare(a.listedAt),
    "price-desc": (a, b) => b.price - a.price,
    "price-asc": (a, b) => a.price - b.price,
    "area-desc": (a, b) => b.area - a.area,
  };
  return result.sort(sorters[f.sort]);
}
