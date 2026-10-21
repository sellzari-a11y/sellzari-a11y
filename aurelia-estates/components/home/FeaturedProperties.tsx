"use client";

import { useRef } from "react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { featuredProperties } from "@/data/properties";
import { useScrollTriggerEffect } from "@/hooks/useScrollTriggerEffect";

/**
 * Featured listings. On desktop the section pins and the row of cards is
 * scrubbed horizontally by vertical scroll; on touch/small screens it falls
 * back to a native swipeable row.
 */
export function FeaturedProperties() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useScrollTriggerEffect(({ gsap }) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - el.clientWidth;
      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(progress.current, { scaleX: self.progress }),
        },
      });
    });
  }, []);

  return (
    <section
      ref={section}
      aria-labelledby="featured-heading"
      className="overflow-hidden bg-offwhite py-20 md:flex md:h-[100svh] md:flex-col md:justify-center md:py-0"
    >
      <div className="container-x flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel index="01" className="text-walnut">
            Featured residences
          </SectionLabel>
          <RevealText id="featured-heading" text="Homes worth the detour" className="mt-5 max-w-[14ch] text-headline" />
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden h-px w-40 bg-navy/15 md:block" aria-hidden>
            <div ref={progress} className="h-full origin-left scale-x-0 bg-royal" />
          </div>
          <Button href="/listings" variant="outline">
            All listings
          </Button>
        </div>
      </div>

      <div
        ref={track}
        className="mt-12 no-scrollbar flex snap-x snap-mandatory scroll-px-[clamp(1.25rem,4vw,4rem)] gap-5 overflow-x-auto px-[clamp(1.25rem,4vw,4rem)] md:mt-16 md:snap-none md:gap-10 md:overflow-visible"
      >
        {featuredProperties.map((property) => (
          <PropertyCard
            key={property.slug}
            property={property}
            layout="feature"
            className="w-[82vw] shrink-0 snap-start sm:w-[60vw] md:w-[min(42vw,52svh)] xl:w-[min(30vw,56svh)]"
          />
        ))}
      </div>
    </section>
  );
}
