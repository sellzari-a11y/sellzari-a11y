import { Marquee } from "@/components/ui/Marquee";

const words = ["Buy", "Sell", "Rent", "Invest"];

/** Sand-tinted ticker band separating the hero from the content below. */
export function ServicesMarquee() {
  return (
    <div className="border-y border-navy/10 bg-sand py-5 text-navy md:py-7">
      <p className="sr-only">Buy, sell, rent, invest</p>
      <Marquee duration={22}>
        {words.concat(words).map((word, i) => (
          <span key={i} aria-hidden className="flex items-center text-3xl font-bold tracking-[-0.03em] md:text-5xl">
            <span className="px-8 md:px-12">{word}</span>
            <svg viewBox="0 0 24 24" className="size-5 text-walnut md:size-7" fill="currentColor">
              <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
            </svg>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
