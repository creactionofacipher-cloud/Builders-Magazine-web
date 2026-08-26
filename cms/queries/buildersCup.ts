import { mediaAssetProjection, bikeProjection, richTextField } from "./fragments";

// Exported so cms/queries/layoutBlocks.ts's layoutBlocksField() can resolve
// a buildersCupHighlight Layout Block's `event` reference through this
// exact same projection — no second, drifting copy of the shape.
// Each participants[] entry (studio/schemas/buildersCup.ts's
// `participantEntry`) is a bike reference plus a `winner` flag and,
// when won, the `_key` of one of this same document's `nominations`.
// `^.nominations[_key == ^.nomination][0]` resolves that key against the
// sibling nominations array — a nomination only ever makes sense scoped
// to the event it belongs to, so there's nothing to dereference across
// documents.
export const buildersCupFields = `{
  "id": _id,
  "slug": slug.current,
  name,
  date,
  location,
  ${richTextField("description")},
  "coverImage": coverImage->${mediaAssetProjection},
  "gallery": gallery[defined(@->_id)]->${mediaAssetProjection},
  "gallerySettings": gallerySettings,
  "nominations": nominations[]{"id": _key, title, description},
  "participants": participants[]{
    ...participant->${bikeProjection},
    winner,
    "nomination": ^.nominations[_key == ^.nomination][0]{title}
  }
}`;

export const ALL_BUILDERS_CUP_QUERY = `*[_type == "buildersCup"] | order(date desc) ${buildersCupFields}`;

export const BUILDERS_CUP_BY_SLUG_QUERY = `*[_type == "buildersCup" && slug.current == $slug][0] ${buildersCupFields}`;
