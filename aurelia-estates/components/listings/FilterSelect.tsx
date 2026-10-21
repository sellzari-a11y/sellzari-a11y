import type { ReactNode } from "react";

export function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="label text-[0.65rem] text-walnut">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none border-b border-navy/20 bg-transparent py-2 pr-6 text-sm font-bold text-navy transition-colors hover:border-navy focus:border-royal focus:outline-none"
        >
          {children}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-navy/60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
