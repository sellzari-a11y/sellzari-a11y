"use client";

import { m } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * Outgoing half of the route transition. Internal link clicks are held while a
 * navy panel wipes up over the current page; only then does the router
 * navigate. The incoming half lives in app/template.tsx, whose curtain starts
 * fully closed, so this panel can simply disappear once the route changes.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [target, setTarget] = useState<string | null>(null);
  const pushed = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string) => {
      if (pushed.current === href) return;
      pushed.current = href;
      router.push(href);
    },
    [router],
  );

  // The new page's own curtain has taken over.
  useEffect(() => {
    setTarget(null);
    pushed.current = null;
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      // Same-page links (filters, anchors) navigate normally; so does everything for reduced motion.
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (prefersReducedMotion()) return;
      // Capture phase runs before next/link, which skips navigating when default is prevented.
      e.preventDefault();
      setTarget(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Navigate even if the wipe never reports completion, and never leave the
  // screen covered if navigation stalls.
  useEffect(() => {
    if (!target) return;
    const fallback = window.setTimeout(() => navigate(target), 900);
    const uncover = window.setTimeout(() => setTarget(null), 6000);
    return () => {
      clearTimeout(fallback);
      clearTimeout(uncover);
    };
  }, [target, navigate]);

  if (!target) return null;

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] bg-navy"
      style={{ originY: 1 }}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => navigate(target)}
    />
  );
}
