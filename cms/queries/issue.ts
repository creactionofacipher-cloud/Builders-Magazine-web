import { mediaAssetProjection, storyProjection } from "./fragments";

const issueFields = `{
  "id": _id,
  "slug": slug.current,
  number,
  year,
  title,
  "coverImage": coverImage->${mediaAssetProjection},
  description,
  releaseDate,
  advertisers,
  buyLinks,
  status,
  "featuredStories": featuredStories[]->${storyProjection},
  "gallery": gallery[]->${mediaAssetProjection}
}`;

export const ALL_ISSUES_QUERY = `*[_type == "issue"] | order(releaseDate desc) ${issueFields}`;

export const ISSUE_BY_SLUG_QUERY = `*[_type == "issue" && slug.current == $slug][0] ${issueFields}`;
