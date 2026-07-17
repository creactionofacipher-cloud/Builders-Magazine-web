import type { Issue } from "@/types/content";
import { mapStory, type RawStory } from "./story";

export interface RawIssue extends Omit<Issue, "featuredStories"> {
  featuredStories?: RawStory[];
}

export function mapIssue(raw: RawIssue): Issue {
  return {
    ...raw,
    featuredStories: raw.featuredStories?.map(mapStory),
  };
}
