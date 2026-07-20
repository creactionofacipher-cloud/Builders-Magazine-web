import { mediaAssetProjection, richTextField, storyProjection } from "./fragments";

const issueFields = `{
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
  "gallery": gallery[]->${mediaAssetProjection}
}`;

export const ALL_ISSUES_QUERY = `*[_type == "issue"] | order(releaseDate desc) ${issueFields}`;

export const ISSUE_BY_SLUG_QUERY = `*[_type == "issue" && slug.current == $slug][0] ${issueFields}`;
