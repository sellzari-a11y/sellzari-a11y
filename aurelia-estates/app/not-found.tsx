import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-navy pt-32 pb-12 text-white">
      <div className="container-x">
        <p className="label text-sand">Error 404</p>
        <h1 className="mt-6 text-[clamp(8rem,32vw,30rem)] leading-[0.8] font-bold tracking-[-0.07em]">
          4<span className="text-sand">0</span>4
        </h1>
        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <p className="text-title md:col-span-6">This address isn’t on the market — or anywhere else.</p>
          <div className="flex flex-wrap gap-3 md:col-span-5 md:col-start-8 md:justify-end">
            <Button href="/" variant="light">
              Back home
            </Button>
            <Button href="/listings" variant="outline-light" icon={false}>
              Browse listings
            </Button>
          </div>
        </div>
      </div>
      <Marquee duration={35} className="mt-16 text-white/15">
        {["Lost", "Not found", "Wrong turn", "Try again"].map((word) => (
          <span key={word} aria-hidden className="px-8 text-6xl font-bold tracking-[-0.05em] md:text-8xl">
            {word} —
          </span>
        ))}
      </Marquee>
    </section>
  );
}
