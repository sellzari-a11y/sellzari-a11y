import { cn } from "@/lib/utils";

/**
 * Stylised map stand-in. Swap for Mapbox / Google Maps by rendering a map at
 * the given coordinates.
 */
export function MapPlaceholder({
  label,
  coordinates,
  className,
}: {
  label: string;
  coordinates: { lat: number; lng: number };
  className?: string;
}) {
  return (
    <figure className={cn("relative overflow-hidden rounded-sm bg-offwhite", className)}>
      <svg
        aria-hidden
        viewBox="0 0 800 450"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
      >
        <rect width="800" height="450" fill="#F7F5F2" />
        <path d="M0 330 Q200 280 360 320 T800 290 V450 H0Z" fill="#D9C3A5" opacity="0.45" />
        <g stroke="#0B2545" strokeOpacity="0.08" strokeWidth="1">
          {Array.from({ length: 20 }, (_, i) => (
            <line key={`v${i}`} x1={i * 42} y1="0" x2={i * 42 + 60} y2="450" />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40 - 30} />
          ))}
        </g>
        <path d="M-10 120 C200 160 300 60 520 140 S760 220 820 180" fill="none" stroke="#FFFFFF" strokeWidth="14" />
        <path d="M120 -10 C160 140 260 260 240 460" fill="none" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M560 -10 C520 120 600 260 640 460" fill="none" stroke="#FFFFFF" strokeWidth="8" />
        <circle cx="400" cy="210" r="70" fill="#1D4ED8" opacity="0.08" />
        <circle cx="400" cy="210" r="36" fill="#1D4ED8" opacity="0.14" />
      </svg>
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <span className="rounded-full bg-navy px-4 py-2 text-xs font-bold whitespace-nowrap text-white shadow-lg">
          {label}
        </span>
        <span aria-hidden className="h-4 w-px bg-navy" />
        <span aria-hidden className="size-3 rounded-full border-2 border-white bg-royal shadow" />
      </div>
      <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-navy/80 tabular-nums">
        {coordinates.lat.toFixed(4)}°, {coordinates.lng.toFixed(4)}° · Approximate location
      </figcaption>
    </figure>
  );
}
