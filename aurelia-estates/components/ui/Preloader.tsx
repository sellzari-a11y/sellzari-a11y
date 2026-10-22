"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLoader } from "@/components/providers/LoaderProvider";
import { site } from "@/lib/site";

const DURATION = 1500;

/**
 * Brand wordmark with a 0–100 counter. When the count completes, the panel
 * is wiped away with a clip-path to reveal the page underneath.
 *
 * The wordmark animates with CSS so it is visible (and the largest paint)
 * before hydration; the counter writes to the DOM directly to avoid 100
 * React re-renders while the main thread is busiest.
 */
export function Preloader() {
  const { setReady } = useLoader();
  const reduceMotion = useReducedMotion();
  const [done, setDone] = useState(false);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      setReady(true);
      return;
    }
    document.documentElement.style.overflow = "hidden";
    let raf = 0;
    let timeout = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // easeInOutCubic keeps the count feeling physical
      const value = Math.round((t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2) * 100);
      if (counter.current) counter.current.textContent = String(value);
      if (bar.current) bar.current.style.transform = `scaleX(${value / 100})`;
      if (t < 1) raf = requestAnimationFrame(step);
      else
        timeout = window.setTimeout(() => {
          // The hero starts animating in underneath as the wipe begins.
          setDone(true);
          setReady(true);
        }, 200);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [setReady]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = "";
      }}
    >
      {!done && (
        <m.div
          key="preloader"
          role="status"
          aria-label={`Loading ${site.name}`}
          className="preloader fixed inset-0 z-[90] flex flex-col justify-between bg-navy p-6 text-white md:p-12"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <p className="label text-sand">Est. 2004 — Beverly Hills</p>
          <p className="preloader-wordmark text-[clamp(4.5rem,19vw,16rem)] leading-[0.85] font-bold" aria-hidden>
            {site.shortName}
            <span className="text-sand">.</span>
          </p>
          <div className="flex items-end justify-between gap-6">
            <p className="max-w-48 text-sm text-white/70">{site.tagline}</p>
            <p className="text-5xl font-bold tracking-tight tabular-nums md:text-7xl" aria-hidden>
              <span ref={counter}>0</span>
              <span className="text-sand">%</span>
            </p>
          </div>
          <div ref={bar} className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-royal" aria-hidden />
        </m.div>
      )}
    </AnimatePresence>
  );
}
