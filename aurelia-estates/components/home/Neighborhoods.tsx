import Link from "next/link";
import { Marquee } from "@/components/ui/Marquee";
import { RevealImage } from "@/components/ui/RevealImage";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SmartImage } from "@/components/ui/SmartImage";
import { neighborhoods } from "@/data/content";
import { cn } from "@/lib/utils";

export function Neighborhoods() {
  return (
    <section aria-labelledby="neighborhoods-heading" className="overflow-hidden bg-offwhite py-24 md:py-40">
      <div className="container-x">
        <SectionLabel index="04" className="text-walnut">
          Neighborhoods
        </SectionLabel>
        <RevealText
          id="neighborhoods-heading"
          text="Where our clients call home"
          className="mt-5 max-w-[16ch] text-headline"
        />
      </div>

      <Marquee duration={40} className="mt-14 border-y border-navy/10 py-6 md:mt-20">
        {neighborhoods.map((n) => (
          <span
            key={n.name}
            className="flex items-center text-[clamp(2.5rem,7vw,7rem)] leading-none font-bold tracking-[-0.05em]"
          >
            <span className="px-6 md:px-10">{n.name}</span>
            <span aria-hidden className="size-3 rounded-full bg-walnut md:size-4" />
          </span>
        ))}
      </Marquee>

      <ul className="container-x mt-14 grid gap-5 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-8">
        {neighborhoods.map((n, i) => (
          <li key={n.name} className={cn(i % 3 === 1 && "lg:translate-y-16")}>
            <Link
              href={`/listings?location=${encodeURIComponent(n.name)}`}
              data-cursor="Explore"
              className="group relative block overflow-hidden rounded-sm bg-navy"
            >
              <RevealImage className="aspect-[4/5] rounded-sm" delay={(i % 3) * 0.1}>
                <SmartImage
                  src={n.image}
                  alt={`Homes in ${n.name}`}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
              </RevealImage>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
                <h3 className="text-3xl font-bold tracking-[-0.04em] md:text-4xl">{n.name}</h3>
                <span className="label text-sand">{n.homes} homes</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
