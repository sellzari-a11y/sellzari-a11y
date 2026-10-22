import type { Metadata } from "next";
import { TeamGrid } from "@/components/about/TeamGrid";
import { CtaBand } from "@/components/home/CtaBand";
import { Stats } from "@/components/home/Stats";
import { PageHeader } from "@/components/layout/PageHeader";
import { RevealImage } from "@/components/ui/RevealImage";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SmartImage } from "@/components/ui/SmartImage";
import { aboutImage, values } from "@/data/content";
import { properties } from "@/data/properties";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `The story, team and values behind ${site.name} — a boutique luxury real estate agency founded in 2004.`,
  alternates: { canonical: "/about" },
  openGraph: { title: "About", url: "/about" },
};

const storyImage = properties[1].images[0];

export default function AboutPage() {
  return (
    <>
      <PageHeader label="About us" title="A quieter kind of agency">
        <p>
          Founded in Beverly Hills in 2004, {site.name} has grown by referral alone. Twenty-two years on, we remain
          deliberately small.
        </p>
      </PageHeader>

      <section aria-labelledby="story-heading" className="bg-white py-24 md:py-40">
        <div className="container-x grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionLabel index="01" className="text-walnut">
              Our story
            </SectionLabel>
            <RevealText id="story-heading" text="Built on referrals, not billboards" className="mt-5 text-headline" />
          </div>
          <div className="flex flex-col gap-6 text-lg leading-relaxed text-navy/80 md:col-span-6 md:col-start-7 md:pt-14">
            <p>
              Isabella Marchetti opened our first office above a bookshop on Canon Drive with a simple conviction: that
              people buying extraordinary homes deserve advice that is as considered as the architecture itself.
            </p>
            <p>
              Today our advisors, architects and negotiators work across the California coast — from Montecito to Laguna
              — representing many of the region’s most significant residences. More than half of our transactions never
              reach the open market.
            </p>
            <p>
              We still measure success the same way: by the number of clients who come back, and who send their friends.
            </p>
          </div>
          <RevealImage className="aspect-[16/10] rounded-sm md:col-span-7">
            <SmartImage
              src={storyImage.src}
              alt={storyImage.alt}
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
          </RevealImage>
          <RevealImage className="aspect-[4/5] rounded-sm md:col-span-4 md:col-start-9 md:mt-32" delay={0.15}>
            <SmartImage
              src={aboutImage}
              alt="Interior styled by the Aurelia team"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </RevealImage>
        </div>
      </section>

      <Stats />

      <section aria-labelledby="values-heading" className="bg-offwhite py-24 md:py-40">
        <div className="container-x">
          <SectionLabel index="02" className="text-walnut">
            What we value
          </SectionLabel>
          <RevealText
            id="values-heading"
            text="Principles we won’t trade"
            className="mt-5 max-w-[14ch] text-headline"
          />
          <ol className="mt-16 grid gap-px overflow-hidden rounded-sm bg-sand md:mt-24 md:grid-cols-2">
            {values.map((value, i) => (
              <li
                key={value.title}
                className="group bg-offwhite p-8 transition-colors duration-500 hover:bg-navy hover:text-white md:p-12"
              >
                <span className="label text-walnut transition-colors group-hover:text-sand">0{i + 1}</span>
                <h3 className="mt-8 text-title">{value.title}</h3>
                <p className="mt-4 max-w-md text-navy/75 transition-colors group-hover:text-white/80">{value.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="team-heading" className="bg-white py-24 md:py-40">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel index="03" className="text-walnut">
                The team
              </SectionLabel>
              <RevealText
                id="team-heading"
                text="The people behind the keys"
                className="mt-5 max-w-[14ch] text-headline"
              />
            </div>
            <p className="max-w-sm text-navy/75">
              Every client works directly with a partner. No hand-offs, no juniors learning on your sale.
            </p>
          </div>
          <div className="mt-16 md:mt-24">
            <TeamGrid />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
