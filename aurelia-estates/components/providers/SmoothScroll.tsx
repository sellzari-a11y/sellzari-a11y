"use client";

import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";
import { useLoader } from "./LoaderProvider";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis
 * share one animation frame. Disabled entirely for reduced-motion users.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const isFirstRoute = useRef(true);
  const { ready } = useLoader();

  useEffect(() => {
    if (!ready || prefersReducedMotion()) return;
    let cancelled = false;
    let cleanup = () => {};

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    idle(() => {
      if (cancelled) return;
      Promise.all([import("lenis"), loadGsap()]).then(([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
        if (cancelled) return;
        const instance = new LenisCtor({ duration: 1.15, smoothWheel: true, anchors: true });
        instance.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => instance.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        setLenis(instance);
        cleanup = () => {
          gsap.ticker.remove(tick);
          instance.destroy();
        };
      });
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [ready]);

  // Each new route starts at the top.
  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
