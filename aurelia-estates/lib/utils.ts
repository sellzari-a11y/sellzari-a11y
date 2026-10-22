import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number) {
  return currency.format(value);
}

/** Today's date in the visitor's own timezone as YYYY-MM-DD (the format of <input type="date">). */
export function localDateISO() {
  const date = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
