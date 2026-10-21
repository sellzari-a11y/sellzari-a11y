"use client";

import { useId, useState } from "react";
import { monthlyPayment } from "@/lib/mortgage";
import { formatPrice } from "@/lib/utils";

const terms = [15, 20, 30];

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="label text-white/75">
          {label}
        </label>
        <output htmlFor={id} className="font-bold tabular-nums">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

export function MortgageCalculator({ price }: { price: number }) {
  const [homePrice, setHomePrice] = useState(price);
  const [downPct, setDownPct] = useState(25);
  const [rate, setRate] = useState(6.25);
  const [term, setTerm] = useState(30);

  const down = (homePrice * downPct) / 100;
  const loan = homePrice - down;
  const monthly = monthlyPayment(loan, rate, term);
  const totalInterest = monthly * term * 12 - loan;

  return (
    <div className="grid gap-10 rounded-sm bg-navy p-6 text-white md:grid-cols-2 md:p-10">
      <div className="flex flex-col gap-7">
        <Slider
          label="Home price"
          value={homePrice}
          display={formatPrice(homePrice)}
          min={Math.round(price * 0.5)}
          max={Math.round(price * 1.5)}
          step={10_000}
          onChange={setHomePrice}
        />
        <Slider
          label="Down payment"
          value={downPct}
          display={`${downPct}% · ${formatPrice(down)}`}
          min={10}
          max={80}
          step={1}
          onChange={setDownPct}
        />
        <Slider
          label="Interest rate"
          value={rate}
          display={`${rate.toFixed(2)}%`}
          min={2}
          max={10}
          step={0.05}
          onChange={setRate}
        />
        <fieldset>
          <legend className="mb-3 label text-white/75">Loan term</legend>
          <div className="flex gap-2">
            {terms.map((t) => (
              <label key={t} className="flex-1">
                <input
                  type="radio"
                  name="term"
                  value={t}
                  checked={term === t}
                  onChange={() => setTerm(t)}
                  className="peer sr-only"
                />
                <span className="flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-white/25 text-sm font-bold transition-colors peer-checked:border-sand peer-checked:bg-sand peer-checked:text-navy peer-focus-visible:outline-2 peer-focus-visible:outline-sand">
                  {t} yrs
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col justify-between gap-8 border-t border-white/15 pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-10">
        <div>
          <p className="label text-sand">Estimated monthly payment</p>
          <p
            className="mt-3 text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-bold tracking-[-0.04em] tabular-nums"
            aria-live="polite"
          >
            {formatPrice(monthly)}
          </p>
          <p className="mt-2 text-sm text-white/70">Principal & interest</p>
        </div>
        <dl className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <dt className="text-white/70">Loan amount</dt>
            <dd className="mt-1 text-lg font-bold tabular-nums">{formatPrice(loan)}</dd>
          </div>
          <div>
            <dt className="text-white/70">Total interest</dt>
            <dd className="mt-1 text-lg font-bold tabular-nums">{formatPrice(totalInterest)}</dd>
          </div>
        </dl>
        <p className="text-xs text-white/60">
          Illustrative only. Excludes taxes, insurance and HOA dues. Speak to a lender for a personalised quote.
        </p>
      </div>
    </div>
  );
}
