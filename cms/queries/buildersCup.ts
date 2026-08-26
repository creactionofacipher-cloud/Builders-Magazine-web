import { mediaAssetProjection, bikeProjection, richTextField } from "./fragments";

// Exported so cms/queries/layoutBlocks.ts's layoutBlocksField() can resolve
// a buildersCupHighlight Layout Block's `event` reference through this
// exact same projection — no second, drifting copy of the shape.
// participants[] mixes two array-member shapes (see
// studio/schemas/buildersCup.ts): a legacy plain `bike` reference
// (_type == "participant", authored before nominations existed) and the
// current `participantEntry` object (participant reference + winner +
// nomination key). Both branches resolve to the same flat shape — Bike
// fields plus `winner`/`nomination` — so the mapper and frontend never
// need to know which one a given entry came from. `^.winners[]._ref`
// reads the sibling legacy `winners` field (see below) to mark a
// pre-nominations winner without any data migration; such a bike has no
// nomination, which the frontend already renders as a plain participant
// badge-free (see components/editorial/BikeCard.tsx).
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
    _type == "participant" => {
      ...@->${bikeProjection},
      "winner": @._ref in ^.winners[]._ref,
      "nomination": null
    },
    _type == "participantEntry" => {
      ...participant->${bikeProjection},
      winner,
      "nomination": ^.nominations[_key == ^.nomination][0]{title}
    }
  }
}`;

export const ALL_BUILDERS_CUP_QUERY = `*[_type == "buildersCup"] | order(date desc) ${buildersCupFields}`;

export const BUILDERS_CUP_BY_SLUG_QUERY = `*[_type == "buildersCup" && slug.current == $slug][0] ${buildersCupFields}`;
