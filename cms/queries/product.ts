import { mediaAssetProjection } from "./fragments";

// Exported so cms/queries/layoutBlocks.ts's layoutBlocksField() can resolve
// a merchandise Layout Block's `products` references through this exact
// same projection — no second, drifting copy of the shape.
export const productFields = `{
  "id": _id,
  "slug": slug.current,
  name,
  shortDescription,
  description,
  "mainImage": mainImage->${mediaAssetProjection},
  "gallery": gallery[defined(@->_id)]->${mediaAssetProjection},
  "gallerySettings": gallerySettings,
  price,
  currency,
  sizes,
  materials,
  externalBuyUrl,
  soldOut,
  status
}`;

// See cms/queries/story.ts's PUBLISHED_FILTER for why this treats an
// unset status as visible rather than requiring an explicit "published".
const PUBLISHED_FILTER = `(!defined(status) || status == "published")`;

export const ALL_PRODUCTS_QUERY = `*[_type == "product" && ${PUBLISHED_FILTER}] ${productFields}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug && ${PUBLISHED_FILTER}][0] ${productFields}`;

// Dedicated, lighter query for cms/services/products.ts's
// getRelatedProducts — ProductCard (the only thing that renders these)
// reads just name/shortDescription/mainImage/price/currency/soldOut,
// never description or gallery. Reusing productFields/ALL_PRODUCTS_QUERY
// here would mean re-fetching every product's full portable-text
// description and entire dereferenced gallery on every single product
// detail page view just to compute 3 related cards — description/
// gallery/gallerySettings are all optional on Product, so omitting them
// here is type-safe. Excludes the current product in GROQ (not after
// fetching) and caps at 12 so this stays cheap regardless of catalog
// size; the service layer slices to the actual requested limit.
export const RELATED_PRODUCTS_QUERY = `*[_type == "product" && slug.current != $slug && ${PUBLISHED_FILTER}] | order(_createdAt desc) [0...12] {
  "id": _id,
  "slug": slug.current,
  name,
  shortDescription,
  "mainImage": mainImage->${mediaAssetProjection},
  price,
  currency,
  sizes,
  materials,
  externalBuyUrl,
  soldOut,
  status
}`;
