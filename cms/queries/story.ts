import { storyProjection } from "./fragments";

// $category/$tag are nullable — `!defined(...)` makes each filter a
// no-op when its param isn't passed, matching getStories({ category, tag })'s
// optional-filter behavior in the mock implementation. Sort direction and
// limit aren't parametrized here — cms/services/stories.ts applies those
// in JS after fetching newest-first (GROQ has no parametrized sort
// direction), same as the mock path.
export const STORIES_QUERY = `*[_type == "story" && (!defined($category) || category == $category) && (!defined($tag) || $tag in tags)] | order(publishedDate desc) ${storyProjection}`;

export const STORY_BY_SLUG_QUERY = `*[_type == "story" && slug.current == $slug][0] ${storyProjection}`;
