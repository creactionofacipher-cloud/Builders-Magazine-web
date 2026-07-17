import type { Product } from "@/types/content";

// The query already projects directly into Product's shape — no
// transform needed. Kept as an explicit boundary function for
// consistency with every other entity.
export function mapProduct(raw: Product): Product {
  return raw;
}
