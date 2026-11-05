const priceFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

export function formatPrice(price) {
  return priceFormatter.format(Number(price));
}
