const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

/*
 * Every amount the API sends or receives is a whole number of paise, because
 * a bill is a sum and floating-point rupees do not survive being added up.
 * Rupees exist at two places only: what someone types into a field, and what
 * they read on screen. These four helpers are that boundary.
 */

/** Paise -> "₹1,23,456.78". A dash for anything that is not a number. */
export const money = (paise) => {
  const n = Number(paise);
  return Number.isFinite(n) ? currencyFormatter.format(n / 100) : "—";
};

/** What someone typed, in rupees, as whole paise. */
export const toPaise = (rupees) => {
  const n = Number(rupees);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : 0;
};

/** Paise as a plain rupee number — for charts and stat tiles, not for display. */
export const fromPaise = (paise) => (Number(paise) || 0) / 100;

/**
 * Paise as the string a rupee input field should hold. Empty for a missing
 * value, so a new form shows its placeholder rather than a zero to delete.
 */
export const rupeeInput = (paise) => {
  if (paise === null || paise === undefined || paise === "") return "";
  const n = Number(paise);
  if (!Number.isFinite(n)) return "";
  // Trailing zeros would fight the user as they type, so 100000 reads "1000".
  return String(n / 100);
};

/** Plain grouped number, e.g. 1,23,456. */
export const number = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString("en-IN") : "—";
};
