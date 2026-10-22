import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ListingsExplorer } from "@/components/listings/ListingsExplorer";
import { properties } from "@/data/properties";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "Browse exceptional homes for sale and lease — villas, penthouses, estates and townhouses across coastal California.",
  alternates: { canonical: "/listings" },
  openGraph: { title: "Listings", url: "/listings" },
};

export default function ListingsPage() {
  return (
    <>
      <PageHeader label="Listings" title="Find your place">
        <p>
          {properties.length} hand-selected residences across California’s most sought-after neighborhoods. Filter by
          location, price and type — or ask us about off-market homes.
        </p>
      </PageHeader>
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <ListingsExplorer />
      </Suspense>
    </>
  );
}
