import { Counter } from "@/components/ui/Counter";
import { stats } from "@/data/content";

export function Stats() {
  return (
    <section aria-label="Aurelia in numbers" className="bg-navy py-24 text-white md:py-32">
      <dl className="container-x grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse gap-4 border-t border-white/15 pt-6">
            <dt className="label text-sand">{stat.label}</dt>
            <dd className="text-[clamp(2.75rem,7vw,7rem)] leading-none font-bold tracking-[-0.05em] tabular-nums">
              {"prefix" in stat && stat.prefix}
              <Counter value={stat.value} decimals={"decimals" in stat ? stat.decimals : 0} />
              <span className="text-sand">{stat.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
