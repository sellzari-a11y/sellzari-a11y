"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const format = (n: number, decimals: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Counts up from zero once the number scrolls into view. */
export function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!inView) {
      el.textContent = format(0, decimals);
      return;
    }
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => (el.textContent = format(n, decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return <span ref={ref}>{format(value, decimals)}</span>;
}
