const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

/** ₹1,23,456.78 — falls back to a dash for anything non-numeric. */
export const money = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? currencyFormatter.format(n) : "—";
};

/** Plain grouped number, e.g. 1,23,456. */
export const number = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString("en-IN") : "—";
};
