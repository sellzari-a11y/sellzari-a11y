"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { useLoader } from "@/components/providers/LoaderProvider";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Navy introduction band used at the top of inner pages. */
export function PageHeader({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  const { ready } = useLoader();
  return (
    <header className="bg-navy pt-36 pb-16 text-white md:pt-48 md:pb-24">
      <div className="container-x grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <SectionLabel className="text-sand">{label}</SectionLabel>
          <RevealText as="h1" text={title} immediate delay={0.15} className="mt-6 text-display" />
        </div>
        {children && (
          <m.div
            className="text-white/80 md:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {children}
          </m.div>
        )}
      </div>
    </header>
  );
}
