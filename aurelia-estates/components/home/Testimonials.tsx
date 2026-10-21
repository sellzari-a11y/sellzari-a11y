"use client";

import { AnimatePresence, m, type PanInfo } from "framer-motion";
import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

function Arrow({ flip }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("size-5", flip && "rotate-180")}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Testimonial slider with buttons, dots, keyboard arrows and swipe. */
export function Testimonials() {
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const count = testimonials.length;
  const go = (dir: number) => setState(([i]) => [(i + dir + count) % count, dir]);
  const current = testimonials[index];

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby="testimonials-heading"
      className="bg-white py-24 md:py-40"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="flex flex-col justify-between gap-8 md:col-span-3">
          <div>
            <SectionLabel index="05" className="text-walnut">
              Client stories
            </SectionLabel>
            <h2 id="testimonials-heading" className="mt-5 text-title">
              In their words
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex size-14 items-center justify-center rounded-full border border-navy/20 transition-colors hover:border-navy hover:bg-navy hover:text-white"
            >
              <Arrow flip />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex size-14 items-center justify-center rounded-full border border-navy/20 transition-colors hover:border-navy hover:bg-navy hover:text-white"
            >
              <Arrow />
            </button>
            <p className="ml-3 text-sm font-medium text-navy/70 tabular-nums" aria-hidden>
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
          </div>
        </div>

        <div
          className="relative min-h-[22rem] overflow-hidden md:col-span-9 md:min-h-[26rem]"
          aria-live="polite"
          data-cursor="Drag"
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <m.div
              key={index}
              custom={direction}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
              className="cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={onDragEnd}
              variants={{
                enter: (d: number) => ({ x: d * 80, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (d: number) => ({ x: d * -80, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <figure>
                <svg aria-hidden viewBox="0 0 48 36" className="h-9 w-12 text-sand" fill="currentColor">
                  <path d="M0 36V20Q0 6 14 0l3 5Q9 9 9 17h9v19zm28 0V20q0-14 14-20l3 5q-8 4-8 12h9v19z" />
                </svg>
                <blockquote className="mt-8 text-[clamp(1.5rem,3.4vw,3.25rem)] leading-[1.12] font-bold tracking-[-0.03em]">
                  “{current.quote}”
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4">
                  <span aria-hidden className="h-px w-10 bg-walnut" />
                  <span>
                    <span className="block font-bold">{current.name}</span>
                    <span className="text-sm text-navy/70">{current.detail}</span>
                  </span>
                </figcaption>
              </figure>
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="container-x mt-12 flex gap-2 md:justify-end">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            type="button"
            aria-label={`Show testimonial ${i + 1}`}
            aria-current={i === index}
            onClick={() => setState([i, i > index ? 1 : -1])}
            className="group flex h-6 items-center"
          >
            <span
              className={cn(
                "block h-0.5 transition-all duration-500",
                i === index ? "w-12 bg-royal" : "w-6 bg-navy/20 group-hover:bg-navy/50",
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
