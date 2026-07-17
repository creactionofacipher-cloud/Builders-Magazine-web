import { mediaAssetProjection, bikeProjection } from "./fragments";

const buildersCupFields = `{
  "id": _id,
  "slug": slug.current,
  name,
  date,
  location,
  description,
  "coverImage": coverImage->${mediaAssetProjection},
  "gallery": gallery[]->${mediaAssetProjection},
  "participants": participants[]->${bikeProjection},
  "winners": winners[]->${bikeProjection}
}`;

export const ALL_BUILDERS_CUP_QUERY = `*[_type == "buildersCup"] | order(date desc) ${buildersCupFields}`;

export const BUILDERS_CUP_BY_SLUG_QUERY = `*[_type == "buildersCup" && slug.current == $slug][0] ${buildersCupFields}`;
