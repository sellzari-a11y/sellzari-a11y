"use client";

import { useEffect, type DependencyList } from "react";
import { useLoader } from "@/components/providers/LoaderProvider";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";

type Setup = (lib: Awaited<ReturnType<typeof loadGsap>>) => void;

/**
 * Lazily loads GSAP once the preloader has finished, runs `setup` inside a
 * gsap.context, and reverts everything on unmount. Skipped for
 * reduced-motion users.
 */
export function useScrollTriggerEffect(setup: Setup, deps: DependencyList) {
  const { ready } = useLoader();

  useEffect(() => {
    if (!ready || prefersReducedMotion()) return;
    let revert = () => {};
    let cancelled = false;
    loadGsap().then((lib) => {
      if (cancelled) return;
      const ctx = lib.gsap.context(() => setup(lib));
      revert = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, ...deps]);
}
