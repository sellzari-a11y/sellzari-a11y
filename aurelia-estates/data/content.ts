import { unsplash } from "@/lib/images";

export const services = [
  {
    title: "Buy",
    description: "Private access to on- and off-market homes, negotiated with discretion and deep local insight.",
    image: unsplash("1600607687939-ce8a6c25118c"),
    href: "/listings?status=sale",
  },
  {
    title: "Sell",
    description: "Editorial-grade marketing, global buyer networks and pricing strategy built on data.",
    image: unsplash("1600596542815-ffad4c1539a9"),
    href: "/contact",
  },
  {
    title: "Rent",
    description: "A curated portfolio of furnished and long-term luxury leases, managed end to end.",
    image: unsplash("1560448204-e02f11c3d0e2"),
    href: "/listings?status=rent",
  },
  {
    title: "Invest",
    description: "Residential investment advisory, from single assets to multi-property portfolios.",
    image: unsplash("1545324418-cc1a3fa10c00"),
    href: "/contact",
  },
] as const;

export const neighborhoods = [
  { name: "Malibu", image: unsplash("1613490493576-7fde63acd811"), homes: 24 },
  { name: "Bel Air", image: unsplash("1600596542815-ffad4c1539a9"), homes: 18 },
  { name: "Santa Monica", image: unsplash("1545324418-cc1a3fa10c00"), homes: 31 },
  { name: "Montecito", image: unsplash("1564013799919-ab600027ffc6"), homes: 12 },
  { name: "Laguna Beach", image: unsplash("1613977257363-707ba9348227"), homes: 15 },
  { name: "Silver Lake", image: unsplash("1605276374104-dee2a0ed3cd6"), homes: 20 },
] as const;

export const stats = [
  { value: 1240, suffix: "+", label: "Properties sold" },
  { value: 22, suffix: "", label: "Years of experience" },
  { value: 4.8, suffix: "B", prefix: "$", decimals: 1, label: "In closed sales" },
  { value: 98, suffix: "%", label: "Happy clients" },
] as const;

export const values = [
  {
    title: "Discretion",
    text: "Many of our clients prefer privacy. We operate with confidentiality as a default, not an option.",
  },
  {
    title: "Craft",
    text: "We treat every listing as an editorial project — photography, film, and storytelling worthy of the architecture.",
  },
  {
    title: "Candour",
    text: "Honest pricing advice, even when it isn’t what you hoped to hear. Long relationships are built on it.",
  },
  {
    title: "Community",
    text: "We live where we work. One percent of every commission funds local housing and arts programmes.",
  },
] as const;

export const heroImage = unsplash("1600585154340-be6161a56a0c");
export const aboutImage = unsplash("1600210492486-724fe5c67fb0");
export const ctaImage = unsplash("1600566753086-00f18fb6b3ea");
