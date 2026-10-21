"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { RevealImage } from "@/components/ui/RevealImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SmartImage } from "@/components/ui/SmartImage";
import { aboutImage } from "@/data/content";
import { useScrollTriggerEffect } from "@/hooks/useScrollTriggerEffect";

const statement =
  "We believe a home is the most personal thing you will ever buy. For over twenty years we have paired remarkable architecture with the people who will love it most — quietly, carefully, and without compromise.";

/** Large-type introduction whose words light up as you scroll through it. */
export function Intro() {
  const text = useRef<HTMLParagraphElement>(null);

  useScrollTriggerEffect(({ gsap }) => {
    gsap.fromTo(
      text.current!.querySelectorAll("[data-word]"),
      { opacity: 0.55 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: { trigger: text.current, start: "top 80%", end: "bottom 45%", scrub: true },
      },
    );
  }, []);

  return (
    <section aria-labelledby="intro-heading" className="bg-white py-24 md:py-40">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel index="02" className="text-walnut">
            About Aurelia
          </SectionLabel>
          <h2 id="intro-heading" className="sr-only">
            About the agency
          </h2>
        </div>
        <div className="md:col-span-9">
          <p ref={text} className="text-[clamp(1.75rem,4.2vw,4.25rem)] leading-[1.08] font-bold tracking-[-0.035em]">
            {statement.split(" ").map((word, i) => (
              <span key={i} data-word>
                {word}{" "}
              </span>
            ))}
          </p>
        </div>

        <div className="grid gap-10 md:col-span-12 md:mt-16 md:grid-cols-12 md:items-end">
          <RevealImage className="aspect-[4/5] rounded-sm md:col-span-5 md:col-start-2">
            <SmartImage
              src={aboutImage}
              alt="Sunlit living room styled by the Aurelia team"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </RevealImage>
          <div className="flex flex-col gap-8 md:col-span-4 md:col-start-8 md:pb-10">
            <p className="text-lg leading-relaxed text-navy/80">
              A boutique team of twenty-four advisors, architects and negotiators. We take on fewer clients so that each
              one receives the full weight of our attention — and our network.
            </p>
            <div className="h-px w-full bg-sand" aria-hidden />
            <div>
              <Button href="/about" variant="dark">
                Our story
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
