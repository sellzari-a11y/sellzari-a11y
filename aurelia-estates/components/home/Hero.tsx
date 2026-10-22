"use client";

import { m } from "framer-motion";
import { useRef } from "react";
import { useLoader } from "@/components/providers/LoaderProvider";
import { SmartImage } from "@/components/ui/SmartImage";
import { heroImage } from "@/data/content";
import { useScrollTriggerEffect } from "@/hooks/useScrollTriggerEffect";
import { SearchBar } from "./SearchBar";

const lines = ["Live beyond", "the ordinary"];
const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { ready } = useLoader();
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useScrollTriggerEffect(({ gsap }) => {
    const trigger = { trigger: section.current, start: "top top", end: "bottom top", scrub: true };
    gsap.to(media.current, { yPercent: 22, scale: 1.08, ease: "none", scrollTrigger: trigger });
    gsap.to(content.current, { yPercent: -12, opacity: 0.2, ease: "none", scrollTrigger: trigger });
  }, []);

  let charIndex = 0;

  return (
    <section ref={section} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy text-white">
      <div ref={media} className="absolute inset-0 -z-10 will-change-transform">
        <m.div
          className="absolute inset-0"
          initial={{ scale: 1.25 }}
          animate={ready ? { scale: 1 } : undefined}
          transition={{ duration: 2.4, ease }}
        >
          <SmartImage
            src={heroImage}
            alt="Contemporary villa with an illuminated pool at dusk"
            fill
            priority
            sizes="100vw"
            tone="navy"
            className="object-cover"
          />
        </m.div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/35 to-navy/90" />
      </div>

      <div ref={content} className="container-x flex flex-1 flex-col justify-end gap-10 pt-32 pb-8 md:pb-12">
        <m.p
          className="label text-sand"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, ease, delay: 0.2 }}
        >
          Luxury real estate — California coast
        </m.p>

        <h1
          aria-label={lines.join(" ")}
          className="text-[clamp(3.25rem,12.5vw,14rem)] leading-[0.86] font-bold tracking-[-0.055em]"
        >
          {lines.map((line, li) => (
            <span key={line} aria-hidden className={li === 1 ? "block md:pl-[12vw]" : "block"}>
              {line.split("").map((char) => {
                const i = charIndex++;
                return (
                  <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                    <m.span
                      className="inline-block"
                      initial={{ y: "105%" }}
                      animate={ready ? { y: "0%" } : undefined}
                      transition={{ duration: 1.2, ease, delay: 0.1 + i * 0.03 }}
                    >
                      {char === " " ? " " : char}
                    </m.span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <m.p
            className="max-w-md text-base text-white/85 md:col-span-4 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease, delay: 0.7 }}
          >
            Architecturally significant homes, penthouses and estates — represented with discretion since 2004.
          </m.p>
          <m.div
            className="md:col-span-8"
            initial={{ opacity: 0, y: 40 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.2, ease, delay: 0.85 }}
          >
            <SearchBar />
          </m.div>
        </div>
      </div>
    </section>
  );
}
