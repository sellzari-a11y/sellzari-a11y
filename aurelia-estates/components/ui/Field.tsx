import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Label + control + error message, wired together for screen readers. */
export function Field({
  id,
  label,
  error,
  children,
  className,
  dark = false,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className={cn("label", dark ? "text-white/70" : "text-navy/80")}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className={cn("text-sm", dark ? "text-sand" : "text-red-700")}>
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "w-full border-b border-navy/20 bg-transparent py-3 text-base text-navy placeholder:text-navy/50 transition-colors focus:border-royal focus:outline-none aria-[invalid=true]:border-red-700";
