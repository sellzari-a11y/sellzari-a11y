"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { SmartImage } from "@/components/ui/SmartImage";
import { ctaImage } from "@/data/content";

/** Full-bleed call to action with a parallax background. */
export function CtaBand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden bg-navy py-32 text-white md:py-48"
    >
      <m.div className="absolute inset-x-0 -inset-y-[15%] -z-10" style={{ y }}>
        <SmartImage src={ctaImage} alt="" fill sizes="100vw" tone="navy" className="object-cover" />
        <div className="absolute inset-0 bg-navy/70" />
      </m.div>
      <div className="container-x flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
        <RevealText
          id="cta-heading"
          text="Ready when you are."
          className="max-w-[12ch] text-[clamp(3rem,9vw,10rem)] leading-[0.9] font-bold tracking-[-0.05em]"
        />
        <div className="flex flex-col gap-6 md:items-end">
          <p className="max-w-xs text-white/85 md:text-right">
            Book a private consultation and we’ll curate a shortlist within 48 hours.
          </p>
          <div className="flex flex-wrap gap-3 sm:flex-nowrap">
            <Button href="/contact" variant="light">
              Book a consultation
            </Button>
            <Button href="/listings" variant="outline-light" icon={false}>
              Browse homes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
