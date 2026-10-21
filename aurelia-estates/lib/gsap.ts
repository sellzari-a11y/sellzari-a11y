import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

type GsapBundle = { gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType };

let bundle: Promise<GsapBundle> | null = null;

/**
 * Lazily loads GSAP + ScrollTrigger so the animation runtime stays out of
 * the initial JS bundle. Plugins are registered exactly once.
 */
export function loadGsap() {
  bundle ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return bundle;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
