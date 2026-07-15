import type { Product } from "@/types/content";
import { mockProducts } from "./mock-data";

// Mock implementations — Milestone 10 replaces each body with a Sanity
// fetch behind the same signature. Callers never change.

export async function getMerchandise(): Promise<Product[]> {
  return mockProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return mockProducts.find((product) => product.slug === slug) ?? null;
}

// No "related products" relation field exists on Product — related items
// are simply other catalog entries. Kept as a service function (not
// filtered inline on the page) so the curation strategy can change later
// (e.g. a real "related" reference, or same-category matching) without
// touching the detail page.
export async function getRelatedProducts(slug: string, limit = 3): Promise<Product[]> {
  const all = await getMerchandise();
  return all.filter((product) => product.slug !== slug).slice(0, limit);
}
