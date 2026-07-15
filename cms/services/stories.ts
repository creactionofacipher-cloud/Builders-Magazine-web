import type { Story } from "@/types/content";
import { mockStories } from "./mock-data";

// Mock curation by array position. Milestone 10 replaces this with a
// real "featured" query (a boolean field or editor-ordered GROQ query) —
// callers (getFeaturedStories/getFeaturedContent) keep the same signature.

export async function getFeaturedStories(limit = 3): Promise<Story[]> {
  return mockStories.slice(0, limit);
}

export async function getFeaturedContent(limit = 3): Promise<Story[]> {
  return mockStories.slice(limit, limit * 2);
}
