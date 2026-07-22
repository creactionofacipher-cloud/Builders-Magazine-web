import { mediaAssetProjection, bikeProjection, richTextField } from "./fragments";

// Exported so cms/queries/layoutBlocks.ts's layoutBlocksField() can resolve
// a buildersCupHighlight Layout Block's `event` reference through this
// exact same projection — no second, drifting copy of the shape.
export const buildersCupFields = `{
  "id": _id,
  "slug": slug.current,
  name,
  date,
  location,
  ${richTextField("description")},
  "coverImage": coverImage->${mediaAssetProjection},
  "gallery": gallery[]->${mediaAssetProjection},
  "participants": participants[]->${bikeProjection},
  "winners": winners[]->${bikeProjection}
}`;

export const ALL_BUILDERS_CUP_QUERY = `*[_type == "buildersCup"] | order(date desc) ${buildersCupFields}`;

export const BUILDERS_CUP_BY_SLUG_QUERY = `*[_type == "buildersCup" && slug.current == $slug][0] ${buildersCupFields}`;
