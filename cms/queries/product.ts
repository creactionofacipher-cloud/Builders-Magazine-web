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
  "gallery": gallery[]->${mediaAssetProjection},
  price,
  currency,
  sizes,
  materials,
  externalBuyUrl,
  status
}`;

// See cms/queries/story.ts's PUBLISHED_FILTER for why this treats an
// unset status as visible rather than requiring an explicit "published".
const PUBLISHED_FILTER = `(!defined(status) || status == "published")`;

export const ALL_PRODUCTS_QUERY = `*[_type == "product" && ${PUBLISHED_FILTER}] ${productFields}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug && ${PUBLISHED_FILTER}][0] ${productFields}`;
