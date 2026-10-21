import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Infinite CSS marquee. Content is rendered twice for a seamless loop. */
export function Marquee({
  children,
  duration = 30,
  reverse = false,
  className,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("group flex overflow-hidden", className)}>
      <div
        className="flex w-max shrink-0 animate-marquee group-hover:[animation-play-state:paused]"
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
