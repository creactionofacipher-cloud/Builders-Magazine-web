import { mediaAssetProjection } from "./fragments";

const productFields = `{
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

export const ALL_PRODUCTS_QUERY = `*[_type == "product"] ${productFields}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] ${productFields}`;
