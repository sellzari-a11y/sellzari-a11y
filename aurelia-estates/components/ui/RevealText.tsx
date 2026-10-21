"use client";

import { m } from "framer-motion";
import type { ElementType } from "react";
import { useLoader } from "@/components/providers/LoaderProvider";
import { cn } from "@/lib/utils";

interface RevealTextProps {
  text: string;
  id?: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate as soon as the preloader has finished instead of on scroll. */
  immediate?: boolean;
}

/** Splits text into words that slide up from behind a mask. */
export function RevealText({
  text,
  id,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: RevealTextProps) {
  const { ready } = useLoader();
  const words = text.split(" ");
  const trigger = immediate
    ? { animate: ready ? "shown" : "hidden" }
    : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <Tag id={id} className={cn(className)}>
      <m.span className="block" initial="hidden" {...trigger}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
              <m.span
                className="inline-block"
                variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
              >
                {word}
              </m.span>
            </span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </m.span>
    </Tag>
  );
}
