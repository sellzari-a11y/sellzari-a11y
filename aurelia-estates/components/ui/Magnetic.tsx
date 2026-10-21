"use client";

import { m, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/** Pulls its child toward the pointer while hovered. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const spring = { stiffness: 180, damping: 15, mass: 0.2 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const enabled = fine && !reduce;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div className={cn("inline-block", className)} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </m.div>
  );
}
