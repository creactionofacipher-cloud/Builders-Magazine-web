import { cache } from "react";
import type { Product } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import {
  ALL_PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  RELATED_PRODUCTS_QUERY,
} from "@/cms/queries/product";
import { mapProduct } from "@/cms/mappers/product";
import { mockProducts } from "./mock-data";

// Sanity path when configured (see cms/sanity/client.ts), mock fallback
// otherwise — same signature either way, callers never change. Every
// exported function here is wrapped in React's cache() so multiple call
// sites within the same render (e.g. the merchandise detail page's
// generateMetadata() plus its page body both call getProductBySlug)
// share one underlying fetch instead of each triggering its own (see
// cms/services/siteSettings.ts's getSiteSettings for the original
// precedent of this pattern).

// Mirrors the Sanity path's PUBLISHED_FILTER (cms/queries/product.ts) —
// an untouched status field is treated as visible, only an explicit
// "draft" hides it.
function isPublished(product: Product): boolean {
  return product.status !== "draft";
}

export const getMerchandise = cache(async (): Promise<Product[]> => {
  if (isSanityConfigured) {
    const raw = await sanityFetch<Product[]>(ALL_PRODUCTS_QUERY);
    return raw.map(mapProduct);
  }
  return mockProducts.filter(isPublished);
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  if (isSanityConfigured) {
    const raw = await sanityFetch<Product | null>(PRODUCT_BY_SLUG_QUERY, { slug });
    return raw ? mapProduct(raw) : null;
  }
  const product = mockProducts.find((p) => p.slug === slug);
  return product && isPublished(product) ? product : null;
});

// No "related products" relation field exists on Product — related items
// are simply other catalog entries. Kept as a service function (not
// filtered inline on the page) so the curation strategy can change later
// (e.g. a real "related" reference, or same-category matching) without
// touching the detail page. Deliberately does NOT compose over
// getMerchandise() — that fetches every product's full description and
// entire dereferenced gallery, which ProductCard never renders; on a
// product detail page (which calls this once per view/build), that was
// a full-catalog, full-weight re-fetch just to show 3 cards. Uses its
// own lighter, capped RELATED_PRODUCTS_QUERY instead (see
// cms/queries/product.ts for why that's type-safe against Product).
export const getRelatedProducts = cache(async (slug: string, limit = 3): Promise<Product[]> => {
  if (isSanityConfigured) {
    const raw = await sanityFetch<Product[]>(RELATED_PRODUCTS_QUERY, { slug });
    return raw.map(mapProduct).slice(0, limit);
  }
  return mockProducts
    .filter((product) => product.slug !== slug && isPublished(product))
    .slice(0, limit);
});
