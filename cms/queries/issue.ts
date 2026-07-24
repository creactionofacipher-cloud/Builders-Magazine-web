import { mediaAssetProjection, richTextField, storyProjection } from "./fragments";

// Exported so cms/queries/layoutBlocks.ts's layoutBlocksField() can resolve
// a featuredIssue Layout Block's `issue` reference through this exact
// same projection — no second, drifting copy of the Issue shape.
export const issueFields = `{
  "id": _id,
  "slug": slug.current,
  number,
  year,
  title,
  "coverImage": coverImage->${mediaAssetProjection},
  ${richTextField("description")},
  releaseDate,
  advertisers,
  buyLinks,
  status,
  // featuredStory is a weak reference (studio/schemas/issue.ts) — filters
  // out any entry whose target was deleted before dereferencing, so a
  // stale reference never surfaces as a null Story to the app.
  "featuredStories": featuredStories[defined(@->_id)]->${storyProjection},
  // Same defined(@->_id) guard as featuredStories above — an array member
  // with no _ref at all (e.g. an "Add item" click in Studio's gallery
  // picker that never had an asset selected) would otherwise dereference
  // to null and crash the Gallery component, which assumes every entry is
  // a real MediaAsset.
  "gallery": gallery[defined(@->_id)]->${mediaAssetProjection},
  "gallerySettings": gallerySettings
}`;

// See cms/queries/story.ts's PUBLISHED_FILTER for why this treats an
// unset status as visible rather than requiring an explicit "published".
const PUBLISHED_FILTER = `(!defined(status) || status == "published")`;

export const ALL_ISSUES_QUERY = `*[_type == "issue" && ${PUBLISHED_FILTER}] | order(releaseDate desc) ${issueFields}`;

export const ISSUE_BY_SLUG_QUERY = `*[_type == "issue" && slug.current == $slug && ${PUBLISHED_FILTER}][0] ${issueFields}`;
