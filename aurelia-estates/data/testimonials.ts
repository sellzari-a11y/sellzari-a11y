export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Aurelia found us a home that was never on the market. The whole process felt less like a transaction and more like being looked after by old friends.",
    name: "Catherine & David Reyes",
    detail: "Purchased in Pacific Palisades",
  },
  {
    quote:
      "Their marketing for our Malibu villa was extraordinary — the film, the photography, the private previews. We closed above asking in eleven days.",
    name: "Marcus Hale",
    detail: "Sold in Malibu",
  },
  {
    quote:
      "As overseas buyers we needed a team we could trust completely. Every detail, from inspections to interiors, was handled with quiet precision.",
    name: "Yuki & Hiroshi Tanaka",
    detail: "Purchased in Bel Air",
  },
  {
    quote:
      "Isabella’s understanding of the market is unmatched. She advised us to wait three months — and it was the best financial decision we made all year.",
    name: "Priya Raman",
    detail: "Investment portfolio, Santa Monica",
  },
];
