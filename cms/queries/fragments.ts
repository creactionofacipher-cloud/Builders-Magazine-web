// Shared GROQ projections. Every projection here fetches enough fields
// to satisfy the *required* fields on its corresponding types/content.ts
// interface — used both for full entity fetches and for nested/embedded
// relations, so there's only one shape per entity to keep correct rather
// than a separate "summary" shape that could drift out of sync with
// which fields are actually required.

// "author" is deliberately a shallow inline projection (id/slug/name/role
// — Person's *required* fields only), not personProjection, which would
// nest a full mediaAssetProjection for the person's own photo and risk
// circular-depth queries (mediaAsset -> author -> photo -> mediaAsset -> ...).
// No page currently renders more than the author's name (lightbox
// photographer credit — see components/lightbox/useLightbox.ts).
export const mediaAssetProjection = `{
  "id": _id,
  "url": file.asset->url,
  "width": file.asset->metadata.dimensions.width,
  "height": file.asset->metadata.dimensions.height,
  caption,
  copyright,
  altText,
  relatedObject,
  "author": author->{"id": _id, "slug": slug.current, name, role},
  "blurDataURL": file.asset->metadata.lqip
}`;

// Story.content / Issue.description / BuildersCup.description use the
// shared print-magazine block set (cms/schemas/portableTextBlocks.ts),
// which mixes plain Portable Text blocks with richTextImage objects that
// hold a *reference* to a mediaAsset. `...` passes every other block type
// (block, pullQuote, divider) through unchanged; only richTextImage needs
// its `image` reference resolved into a full MediaAsset.
export function richTextField(fieldName: string): string {
  return `"${fieldName}": ${fieldName}[]{
    ...,
    _type == "richTextImage" => {
      "image": image->${mediaAssetProjection}
    },
    _type == "imageRow" => {
      "images": images[]->${mediaAssetProjection}
    },
    _type == "imageText" => {
      "image": image->${mediaAssetProjection}
    },
    _type == "fullBleedImage" => {
      "image": image->${mediaAssetProjection}
    },
    _type == "imageStrip" => {
      "images": images[]->${mediaAssetProjection}
    },
    _type == "twoColumnText" => {
      "content": content[]{
        ...,
        _type == "richTextImage" => {
          "image": image->${mediaAssetProjection}
        }
      }
    }
  }`;
}

export const personProjection = `{
  "id": _id,
  "slug": slug.current,
  name,
  role,
  groups,
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

// Fuller than builderRefProjection — includes projects[] (with each
// project's own images) since BuilderCard reads projects[0].images[0]
// for its cover photo. Used by the top-level ALL_BUILDERS_QUERY
// (cms/queries/builder.ts) and the Builder Spotlight Layout Block (needs
// BuilderCard rendered exactly the same way), not by contexts that only
// need a shallow builder reference.
export const builderProjection = `{
  "id": _id,
  "slug": slug.current,
  name,
  location,
  "projects": projects[]->${bikeProjection}
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
  ${richTextField("content")},
  category,
  "author": author->${personProjection},
  publishedDate,
  "gallery": gallery[]->${mediaAssetProjection},
  "relatedBike": relatedBike[]->${bikeProjection},
  "relatedBuilder": relatedBuilder[]->${builderRefProjection},
  tags,
  status
}`;
// Story.issue is intentionally never fetched (left undefined, a valid
// optional field) — no current page reads it, and fetching it would
// require a further Issue projection nested inside a Story nested inside
// Issue.featuredStories, which is exactly the circular depth this
// dependency graph should avoid without a real need for it.
