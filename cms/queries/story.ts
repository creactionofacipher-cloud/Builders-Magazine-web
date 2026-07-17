import { storyProjection } from "./fragments";

// $category is nullable — `!defined($category)` makes the filter a
// no-op when no category is passed, matching getStories({ category })'s
// optional-filter behavior in the mock implementation.
export const STORIES_QUERY = `*[_type == "story" && (!defined($category) || category == $category)] | order(publishedDate desc) ${storyProjection}`;

export const STORY_BY_SLUG_QUERY = `*[_type == "story" && slug.current == $slug][0] ${storyProjection}`;
