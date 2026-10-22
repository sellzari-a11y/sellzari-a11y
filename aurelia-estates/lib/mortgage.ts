/** Standard amortised monthly payment. */
export function monthlyPayment(principal: number, annualRatePct: number, years: number) {
  const n = years * 12;
  if (principal <= 0 || n <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
}
