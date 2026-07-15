import { STORY_CATEGORIES, type StoryCategory } from "@/types/content";

export function isStoryCategory(value: string | undefined): value is StoryCategory {
  if (!value) return false;
  return (STORY_CATEGORIES as readonly string[]).includes(value);
}
