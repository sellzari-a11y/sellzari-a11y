"use client";

import { AnimatePresence, m, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SmartImage } from "@/components/ui/SmartImage";
import { services } from "@/data/content";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/**
 * Interactive service list: hovering a row reveals a floating image that
 * trails the pointer. On touch devices each row simply shows its copy.
 */
export function Services() {
  const fine = useFinePointer();
  const [active, setActive] = useState<number | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 150, damping: 20, mass: 0.4 });
  const y = useSpring(0, { stiffness: 150, damping: 20, mass: 0.4 });

  const onMove = (e: PointerEvent) => {
    const rect = list.current!.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <section aria-labelledby="services-heading" className="bg-navy py-24 text-white md:py-40">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel index="03" className="text-sand">
              What we do
            </SectionLabel>
            <RevealText id="services-heading" text="Four ways we can help" className="mt-5 text-headline" />
          </div>
          <p className="max-w-sm text-white/75 md:col-span-4 md:col-start-9">
            Whether you’re buying your first landmark home or rebalancing a portfolio, one dedicated advisor leads from
            first conversation to closing.
          </p>
        </div>

        <div
          ref={list}
          className="relative mt-16 md:mt-24"
          onPointerMove={fine ? onMove : undefined}
          onPointerLeave={() => setActive(null)}
        >
          <ul className="border-t border-white/15">
            {services.map((service, i) => (
              <li key={service.title} className="border-b border-white/15">
                <Link
                  href={service.href}
                  data-cursor="Explore"
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-6 gap-y-3 py-8 md:grid-cols-12 md:py-10"
                >
                  <span className="label text-sand tabular-nums md:col-span-1">0{i + 1}</span>
                  <span
                    className={cn(
                      "text-[clamp(2.75rem,8vw,8rem)] leading-[0.9] font-bold tracking-[-0.05em] transition-all duration-700 ease-expo md:col-span-5",
                      active !== null && active !== i ? "md:text-white/25" : "",
                      "group-hover:md:translate-x-6",
                    )}
                  >
                    {service.title}
                  </span>
                  <span
                    aria-hidden
                    className="flex size-12 items-center justify-center rounded-full border border-white/25 transition-all duration-500 group-hover:border-sand group-hover:bg-sand group-hover:text-navy md:order-last md:col-span-1 md:justify-self-end"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5 -rotate-45 transition-transform duration-500 group-hover:rotate-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                  <span className="col-span-3 max-w-md text-white/75 md:col-span-4 md:col-start-8">
                    {service.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {fine && (
            <m.div
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 z-10 hidden h-72 w-56 -translate-x-1/2 -translate-y-1/2 md:block"
              style={{ x, y }}
            >
              <AnimatePresence>
                {active !== null && (
                  <m.div
                    key={active}
                    className="absolute inset-0 overflow-hidden rounded-sm"
                    initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.1 }}
                    animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
                    exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
                    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <SmartImage
                      src={services[active].image}
                      alt=""
                      fill
                      sizes="224px"
                      tone="navy"
                      className="object-cover"
                    />
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
          )}
        </div>
      </div>
    </section>
  );
}
