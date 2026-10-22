"use client";

import { m } from "framer-motion";

/**
 * Re-mounts on every navigation: a navy curtain lifts away while the new page
 * fades in. Only opacity is animated on the content wrapper so pinned
 * ScrollTrigger sections are not affected by an ancestor transform.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <m.div
        aria-hidden
        className="page-curtain pointer-events-none fixed inset-0 z-[80] bg-navy"
        style={{ originY: 0 }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
      />
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}>
        {children}
      </m.div>
    </>
  );
}
