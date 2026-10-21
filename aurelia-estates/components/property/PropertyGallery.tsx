"use client";

import { AnimatePresence, m } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import { SmartImage } from "@/components/ui/SmartImage";
import type { PropertyImage } from "@/data/properties";
import { cn } from "@/lib/utils";

/** Asymmetric image mosaic that opens a keyboard-friendly lightbox. */
export function PropertyGallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const lenis = useLenis();
  const closeButton = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const count = images.length;
  const isOpen = open !== null;

  const step = useCallback((dir: number) => setOpen((i) => (i === null ? i : (i + dir + count) % count)), [count]);
  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, lenis, close, step]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:grid-rows-2 md:gap-3">
        {images.slice(0, 5).map((image, i) => (
          <button
            key={image.src + i}
            type="button"
            data-cursor="Expand"
            onClick={(e) => {
              lastTrigger.current = e.currentTarget;
              setOpen(i);
            }}
            className={cn(
              "group relative overflow-hidden rounded-sm bg-sand",
              i === 0 ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto" : "aspect-[4/3]",
            )}
            aria-label={`Open image ${i + 1} of ${count}: ${image.alt}`}
          >
            <SmartImage
              src={image.src}
              alt={image.alt}
              fill
              priority={i === 0}
              sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
              className="object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-105"
            />
            {i === 4 && count > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-navy/60 text-lg font-bold text-white">
                +{count - 5} more
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — image gallery`}
            className="fixed inset-0 z-[95] flex flex-col bg-navy/97 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between p-4 md:p-8">
              <p className="text-sm font-medium tabular-nums" aria-live="polite">
                {open + 1} / {count}
              </p>
              <button
                ref={closeButton}
                type="button"
                onClick={close}
                className="flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-sm font-bold hover:bg-white hover:text-navy"
              >
                Close
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="relative flex-1">
              <AnimatePresence initial={false} mode="popLayout">
                <m.div
                  key={open}
                  className="absolute inset-4 md:inset-x-28 md:inset-y-4"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SmartImage
                    src={images[open].src}
                    alt={images[open].alt}
                    fill
                    sizes="100vw"
                    tone="navy"
                    className="object-contain"
                  />
                </m.div>
              </AnimatePresence>
              {(["prev", "next"] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => step(dir === "next" ? 1 : -1)}
                  aria-label={dir === "next" ? "Next image" : "Previous image"}
                  className={cn(
                    "absolute top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy transition-colors hover:bg-sand md:size-16",
                    dir === "next" ? "right-4 md:right-8" : "left-4 md:left-8",
                  )}
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className={cn("size-5", dir === "prev" && "rotate-180")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              ))}
            </div>
            <p className="p-4 text-center text-sm text-white/75 md:p-8">{images[open].alt}</p>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
