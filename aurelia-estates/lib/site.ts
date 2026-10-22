/**
 * Brand configuration. Rename the agency, change contact details or
 * navigation here and it propagates across the whole site.
 */
export const site = {
  name: "Aurelia Estates",
  shortName: "Aurelia",
  tagline: "Extraordinary homes, quietly brokered.",
  description:
    "Aurelia Estates is a boutique luxury real estate agency representing architecturally significant homes, penthouses and estates across the West Coast.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  email: "hello@aurelia-estates.com",
  phone: "+1 (310) 555-0142",
  address: {
    street: "9450 Wilshire Boulevard, Suite 300",
    city: "Beverly Hills",
    region: "CA",
    postalCode: "90212",
    country: "US",
  },
  hours: "Mon – Sat, 9am – 7pm",
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Pinterest", href: "https://pinterest.com" },
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "Listings", href: "/listings" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
