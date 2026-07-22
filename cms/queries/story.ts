import { storyProjection } from "./fragments";

// `(!defined(status) || status == "published")` treats a never-touched
// status field as visible (matching every existing document, since
// nothing has historically set this field — see cms/services/stories.ts)
// while still hiding anything an editor explicitly flips to "draft".
// Without this, draft-status stories were fetched, statically generated,
// and included in app/sitemap.ts with no filter anywhere in the pipeline.
const PUBLISHED_FILTER = `(!defined(status) || status == "published")`;

// $category/$tag are nullable — `!defined(...)` makes each filter a
// no-op when its param isn't passed, matching getStories({ category, tag })'s
// optional-filter behavior in the mock implementation. Sort direction and
// limit aren't parametrized here — cms/services/stories.ts applies those
// in JS after fetching newest-first (GROQ has no parametrized sort
// direction), same as the mock path.
export const STORIES_QUERY = `*[_type == "story" && ${PUBLISHED_FILTER} && (!defined($category) || category == $category) && (!defined($tag) || $tag in tags)] | order(publishedDate desc) ${storyProjection}`;

export const STORY_BY_SLUG_QUERY = `*[_type == "story" && slug.current == $slug && ${PUBLISHED_FILTER}][0] ${storyProjection}`;
