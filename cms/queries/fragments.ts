// Shared GROQ projections. Every projection here fetches enough fields
// to satisfy the *required* fields on its corresponding types/content.ts
// interface — used both for full entity fetches and for nested/embedded
// relations, so there's only one shape per entity to keep correct rather
// than a separate "summary" shape that could drift out of sync with
// which fields are actually required.

export const mediaAssetProjection = `{
  "id": _id,
  "url": file.asset->url,
  "width": file.asset->metadata.dimensions.width,
  "height": file.asset->metadata.dimensions.height,
  caption,
  copyright,
  altText,
  relatedObject
}`;

export const personProjection = `{
  "id": _id,
  "slug": slug.current,
  name,
  role,
  "photo": photo->${mediaAssetProjection}
}`;

// Shallow — id/slug/name/location only. Bike.builder?/Builder itself are
// optional on every type that references Builder, and no current page
// renders more than name/location for a nested builder reference
// (BikeCard, ProductCard-adjacent contexts). Deliberately does not
// re-expand projects/stories to avoid needless recursion depth.
export const builderRefProjection = `{
  "id": _id,
  "slug": slug.current,
  name,
  location
}`;

// Bike.images is required on the Bike type, so every projection that can
// stand in for a Bike (nested or top-level) must include it.
export const bikeProjection = `{
  "id": _id,
  "slug": slug.current,
  name,
  brand,
  model,
  year,
  style,
  engine,
  description,
  "specifications": specifications[]{key, value},
  "images": images[]->${mediaAssetProjection},
  "builder": builder->${builderRefProjection}
}`;

// Story.content is required on the Story type, so this must be used
// everywhere a Story can appear — nested (Issue.featuredStories,
// BuildersCup.stories) or top-level — not a lighter "card" variant that
// would omit it and fail the type.
export const storyProjection = `{
  "id": _id,
  "slug": slug.current,
  title,
  "coverImage": coverImage->${mediaAssetProjection},
  shortDescription,
  content,
  category,
  "author": author->${personProjection},
  publishedDate,
  "gallery": gallery[]->${mediaAssetProjection},
  "relatedBike": relatedBike[]->${bikeProjection},
  "relatedBuilder": relatedBuilder[]->${builderRefProjection},
  status
}`;
// Story.issue is intentionally never fetched (left undefined, a valid
// optional field) — no current page reads it, and fetching it would
// require a further Issue projection nested inside a Story nested inside
// Issue.featuredStories, which is exactly the circular depth this
// dependency graph should avoid without a real need for it.
