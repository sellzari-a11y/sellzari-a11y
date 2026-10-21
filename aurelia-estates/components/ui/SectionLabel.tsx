import { cn } from "@/lib/utils";

/** Small numbered eyebrow label, e.g. "01 — Featured". */
export function SectionLabel({ index, children, className }: { index?: string; children: string; className?: string }) {
  return (
    <p className={cn("flex items-center gap-3 label", className)}>
      {index && <span className="tabular-nums">{index}</span>}
      <span aria-hidden className="h-px w-10 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  );
}
