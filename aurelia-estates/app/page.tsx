import { CtaBand } from "@/components/home/CtaBand";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Neighborhoods } from "@/components/home/Neighborhoods";
import { Services } from "@/components/home/Services";
import { ServicesMarquee } from "@/components/home/ServicesMarquee";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesMarquee />
      <FeaturedProperties />
      <Intro />
      <Services />
      <Neighborhoods />
      <Stats />
      <Testimonials />
      <CtaBand />
    </>
  );
}
