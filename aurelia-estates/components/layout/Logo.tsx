import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn("text-2xl font-bold tracking-[-0.04em]", className)}
    >
      {site.shortName}
      <span className="text-sand">.</span>
    </Link>
  );
}
