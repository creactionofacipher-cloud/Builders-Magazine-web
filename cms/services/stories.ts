import type { Story, StoryCategory, StorySortOrder } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { STORIES_QUERY, STORY_BY_SLUG_QUERY } from "@/cms/queries/story";
import { mapStory, type RawStory } from "@/cms/mappers/story";
import { mockStories } from "./mock-data";

function byPublishedDateDesc(a: Story, b: Story): number {
  return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
}

interface GetStoriesOptions {
  category?: StoryCategory | null;
  /** Story.tags membership filter — no-op when unset. */
  tag?: string | null;
  /** Caps the result length, applied after sorting. */
  limit?: number;
  /** Defaults to "newest" (publishedDate desc), matching every existing
   * caller's prior (implicit) behavior. */
  sort?: StorySortOrder;
}

// Sanity path when configured (see cms/sanity/client.ts), mock fallback
// otherwise — same signature either way, callers never change. Consumed
// directly by Story Grid's "automatic" data source
// (cms/services/layoutBlocks.ts's resolveDynamicBlocks()) as well as
// every pre-existing caller — `tag`/`limit`/`sort` are all optional so
// none of those callers need to change.
export async function getStories({
  category,
  tag,
  limit,
  sort = "newest",
}: GetStoriesOptions = {}): Promise<Story[]> {
  let stories: Story[];
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawStory[]>(STORIES_QUERY, {
      category: category ?? null,
      tag: tag ?? null,
    });
    stories = raw.map(mapStory);
  } else {
    stories = [...mockStories].sort(byPublishedDateDesc);
    if (category) stories = stories.filter((story) => story.category === category);
    if (tag) stories = stories.filter((story) => story.tags?.includes(tag));
  }
  // Both paths fetch/sort newest-first already — "oldest" just reverses
  // that, avoiding a second GROQ query shape for the opposite direction.
  if (sort === "oldest") stories = [...stories].reverse();
  return limit ? stories.slice(0, limit) : stories;
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawStory | null>(STORY_BY_SLUG_QUERY, { slug });
    return raw ? mapStory(raw) : null;
  }
  return mockStories.find((story) => story.slug === slug) ?? null;
}

// Mock curation is by raw array position (authoring order), not
// re-sorted — preserved exactly as-is so the mock path's output can't
// change. The Sanity path curates the same way over date-sorted real
// data, since no dedicated "featured" field exists in the schema yet;
// a later phase could replace this with a real featured query without
// touching callers (getFeaturedStories/getFeaturedContent keep their
// signature either way).

export async function getFeaturedStories(limit = 3): Promise<Story[]> {
  if (isSanityConfigured) {
    const stories = await getStories();
    return stories.slice(0, limit);
  }
  return mockStories.slice(0, limit);
}

export async function getFeaturedContent(limit = 3): Promise<Story[]> {
  if (isSanityConfigured) {
    const stories = await getStories();
    return stories.slice(limit, limit * 2);
  }
  return mockStories.slice(limit, limit * 2);
}
