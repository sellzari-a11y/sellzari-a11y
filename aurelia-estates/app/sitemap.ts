import type { MetadataRoute } from "next";
import { properties } from "@/data/properties";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/listings", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const listings = properties.map((p) => ({
    url: `${site.url}/listings/${p.slug}`,
    lastModified: new Date(p.listedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...pages, ...listings];
}
