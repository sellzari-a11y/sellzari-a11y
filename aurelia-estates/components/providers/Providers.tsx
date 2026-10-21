"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { LoaderProvider } from "./LoaderProvider";
import { SmoothScroll } from "./SmoothScroll";

const loadMotionFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

// The custom cursor is only downloaded on devices that can use it.
const Cursor = dynamic(() => import("@/components/ui/Cursor"), { ssr: false });

export function Providers({ children }: { children: ReactNode }) {
  const finePointer = useFinePointer();
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.9 }}>
        <LoaderProvider>
          <SmoothScroll>{children}</SmoothScroll>
          {finePointer && <Cursor />}
        </LoaderProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
