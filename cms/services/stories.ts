import type { Story, StoryCategory } from "@/types/content";
import { mockStories } from "./mock-data";

function byPublishedDateDesc(a: Story, b: Story): number {
  return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
}

interface GetStoriesOptions {
  category?: StoryCategory | null;
}

// Mock implementation — Milestone 10 replaces the body with a Sanity
// fetch (category becomes a GROQ filter) behind this same signature.
export async function getStories({ category }: GetStoriesOptions = {}): Promise<Story[]> {
  const sorted = [...mockStories].sort(byPublishedDateDesc);
  return category ? sorted.filter((story) => story.category === category) : sorted;
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  return mockStories.find((story) => story.slug === slug) ?? null;
}

// Mock curation by array position. Milestone 10 replaces this with a
// real "featured" query (a boolean field or editor-ordered GROQ query) —
// callers (getFeaturedStories/getFeaturedContent) keep the same signature.

export async function getFeaturedStories(limit = 3): Promise<Story[]> {
  return mockStories.slice(0, limit);
}

export async function getFeaturedContent(limit = 3): Promise<Story[]> {
  return mockStories.slice(limit, limit * 2);
}
