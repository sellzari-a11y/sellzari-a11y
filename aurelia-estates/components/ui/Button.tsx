import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "light" | "dark" | "outline" | "outline-light";

const styles: Record<Variant, { base: string; fill: string; hoverText: string }> = {
  primary: { base: "bg-royal text-white", fill: "bg-navy", hoverText: "group-hover:text-white" },
  light: { base: "bg-white text-navy", fill: "bg-sand", hoverText: "group-hover:text-navy" },
  dark: { base: "bg-navy text-white", fill: "bg-royal", hoverText: "group-hover:text-white" },
  outline: { base: "border border-navy/25 text-navy", fill: "bg-navy", hoverText: "group-hover:text-white" },
  "outline-light": { base: "border border-white/30 text-white", fill: "bg-white", hoverText: "group-hover:text-navy" },
};

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  magnetic?: boolean;
  icon?: boolean;
}

/** Pill button with a fill-from-below hover and optional magnetic pull. */
export function Button({
  children,
  href,
  variant = "primary",
  magnetic = true,
  icon = true,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const s = styles[variant];
  const classes = cn(
    "group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-sm font-bold tracking-tight transition-colors duration-500 disabled:pointer-events-none disabled:opacity-60",
    s.base,
    className,
  );
  const inner = (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 translate-y-[101%] rounded-[inherit] transition-transform duration-500 ease-expo group-hover:translate-y-0",
          s.fill,
        )}
      />
      <span className={cn("relative z-10 transition-colors duration-500", s.hoverText)}>{children}</span>
      {icon && (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={cn(
            "relative z-10 size-4 transition-all duration-500 ease-expo group-hover:translate-x-1 group-hover:-rotate-45",
            s.hoverText,
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </>
  );

  const el = href ? (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  ) : (
    <button type={type} className={classes} {...rest}>
      {inner}
    </button>
  );

  return magnetic ? <Magnetic strength={0.25}>{el}</Magnetic> : el;
}
