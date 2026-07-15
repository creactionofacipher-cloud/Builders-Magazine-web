import type { Bike, Builder, Issue, Story } from "@/types/content";
import { getStories } from "./stories";
import { getAllIssues } from "./issues";
import { getAllBikes } from "./bikes";
import { getAllBuilders } from "./builders";
import { portableTextToPlainText } from "@/utils/portableTextToPlainText";

export interface SearchResults {
  stories: Story[];
  issues: Issue[];
  bikes: Bike[];
  builders: Builder[];
}

const EMPTY_RESULTS: SearchResults = { stories: [], issues: [], bikes: [], builders: [] };

function matches(query: string, ...fields: (string | undefined)[]): boolean {
  return fields.some((field) => field?.toLowerCase().includes(query));
}

// Single entry point (docs/04_TECH_STACK.md: "The architecture must
// allow future replacement with a dedicated search engine ... without
// requiring changes to UI components or page structure"). Swapping this
// body for Algolia/Typesense in a later phase touches only this file.
//
// MVP implementation is simple case-insensitive substring matching, per
// the documented MVP limitation — no typo tolerance, no relevance
// ranking, no fuzzy search.
export async function search(query: string): Promise<SearchResults> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return EMPTY_RESULTS;
  }

  const [stories, issues, bikes, builders] = await Promise.all([
    getStories(),
    getAllIssues(),
    getAllBikes(),
    getAllBuilders(),
  ]);

  return {
    stories: stories.filter((story) => matches(trimmed, story.title, story.shortDescription)),
    issues: issues.filter((issue) =>
      matches(trimmed, issue.title, portableTextToPlainText(issue.description)),
    ),
    bikes: bikes.filter((bike) => matches(trimmed, bike.name, bike.brand, bike.model)),
    builders: builders.filter((builder) => matches(trimmed, builder.name, builder.location)),
  };
}
