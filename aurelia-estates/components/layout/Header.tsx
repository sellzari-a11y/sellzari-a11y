"use client";

import { m, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

/** Sticky header: hides while scrolling down, returns on scroll up. */
export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggle = useRef<HTMLButtonElement>(null);

  // Lets other sticky UI (e.g. the listings filter bar) sit below the header while it is visible.
  useEffect(() => {
    document.documentElement.dataset.header = hidden ? "hidden" : "shown";
  }, [hidden]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160 && !menuOpen);
    setScrolled(y > 40);
  });

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <m.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 text-white transition-[background-color,backdrop-filter,border-color] duration-500",
          scrolled && !menuOpen
            ? "border-b border-white/10 bg-navy/85 backdrop-blur-md"
            : "border-b border-transparent",
        )}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-x flex h-20 items-center justify-between">
          <Logo className="relative z-[70]" />

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-10">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "link-underline py-1 text-sm font-bold tracking-tight transition-colors",
                      isActive(item.href) ? "text-sand" : "text-white hover:text-sand",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden md:block">
            <Button href="/contact" variant="light" className="min-h-11 px-5 py-2.5">
              Book a viewing
            </Button>
          </div>

          <button
            ref={menuToggle}
            type="button"
            className="relative z-[70] flex h-11 items-center gap-3 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="text-sm font-bold">{menuOpen ? "Close" : "Menu"}</span>
            <span aria-hidden className="relative block h-3 w-7">
              <span
                className={cn(
                  "absolute left-0 h-0.5 w-full bg-current transition-transform duration-500 ease-expo",
                  menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-0.5 w-full bg-current transition-transform duration-500 ease-expo",
                  menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
                )}
              />
            </span>
          </button>
        </div>
      </m.header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} isActive={isActive} toggleRef={menuToggle} />
    </>
  );
}
