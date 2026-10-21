import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/providers/Providers";
import { JsonLd } from "@/components/ui/JsonLd";
import { Preloader } from "@/components/ui/Preloader";
import { site } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Luxury Real Estate`, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: `${site.name} — Luxury Real Estate`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0B2545",
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: site.name,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  description: site.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-dvh overflow-x-clip">
        <noscript>
          <style>{`.preloader,.page-curtain{display:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-royal px-5 py-3 text-sm font-bold text-white transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Providers>
          <Preloader />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
        <div className="grain" aria-hidden />
        <JsonLd data={organizationLd} />
      </body>
    </html>
  );
}
