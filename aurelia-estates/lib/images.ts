/** Build an Unsplash CDN URL; next/image handles resizing on top of it. */
export function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=80`;
}

const tones = {
  sand: ["#D9C3A5", "#b89b78"],
  navy: ["#0B2545", "#1a3a63"],
  warm: ["#e8dccb", "#6B4423"],
} as const;

export type BlurTone = keyof typeof tones;

/**
 * Tiny inline SVG used as a blur placeholder while remote images stream in.
 * Keeps the layout stable and avoids a flash of empty space.
 */
export function blurDataURL(tone: BlurTone = "sand") {
  const [a, b] = tones[tone];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="10"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="16" height="10" fill="url(#g)"/></svg>`;
  const encoded = typeof window === "undefined" ? Buffer.from(svg).toString("base64") : window.btoa(svg);
  return `data:image/svg+xml;base64,${encoded}`;
}
