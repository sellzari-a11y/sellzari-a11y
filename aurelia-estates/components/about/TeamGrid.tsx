import { SmartImage } from "@/components/ui/SmartImage";
import { team } from "@/data/team";

/** Portraits start desaturated and bloom into colour, revealing a bio on hover/focus. */
export function TeamGrid() {
  return (
    <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {team.map((member, i) => (
        <li key={member.name} className={i % 2 === 1 ? "lg:mt-20" : undefined}>
          <article tabIndex={0} className="group outline-none" aria-label={`${member.name}, ${member.role}`}>
            <div
              className="relative aspect-[3/4] overflow-hidden rounded-sm bg-sand group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-royal"
              data-cursor="Hello"
            >
              <SmartImage
                src={member.image}
                alt={`Portrait of ${member.name}`}
                fill
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover grayscale transition-all duration-[1.2s] ease-expo group-hover:scale-105 group-hover:grayscale-0 group-focus-visible:grayscale-0"
              />
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-navy/90 p-5 text-sm text-white backdrop-blur transition-transform duration-700 ease-expo group-hover:translate-y-0 group-focus-visible:translate-y-0">
                {member.bio}
              </div>
            </div>
            <h3 className="mt-5 text-xl font-bold tracking-tight">{member.name}</h3>
            <p className="mt-1 text-sm text-walnut">{member.role}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}
