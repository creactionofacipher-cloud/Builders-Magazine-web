// Single source of truth for price display — was previously duplicated
// inline in ProductCard.tsx and the merchandise detail page; now also
// used by Issue's price (which has no currency field of its own, so
// callers pass "RUB" explicitly rather than this defaulting silently).
export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
