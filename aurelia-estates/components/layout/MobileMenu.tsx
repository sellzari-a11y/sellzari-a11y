"use client";

import { AnimatePresence, m } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function MobileMenu({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const lenis = useLenis();
  const pathname = usePathname();
  const firstLink = useRef<HTMLAnchorElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Close whenever the route changes.
  useEffect(() => {
    onCloseRef.current();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[45] flex flex-col justify-between bg-navy px-5 pt-28 pb-10 text-white md:hidden"
          initial={{ clipPath: "circle(0% at 90% 2.5rem)" }}
          animate={{ clipPath: "circle(150% at 90% 2.5rem)" }}
          exit={{ clipPath: "circle(0% at 90% 2.5rem)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <nav aria-label="Mobile">
            <ul className="flex flex-col gap-2">
              {site.nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <m.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      ref={i === 0 ? firstLink : undefined}
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "flex items-baseline gap-4 text-[clamp(3rem,15vw,5rem)] leading-[1] font-bold tracking-[-0.05em]",
                        isActive(item.href) && "text-sand",
                      )}
                    >
                      <span className="label text-sand/80">0{i + 1}</span>
                      {item.label}
                    </Link>
                  </m.div>
                </li>
              ))}
            </ul>
          </nav>
          <m.div
            className="flex flex-col gap-1 border-t border-white/15 pt-6 text-sm text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
            exit={{ opacity: 0 }}
          >
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
