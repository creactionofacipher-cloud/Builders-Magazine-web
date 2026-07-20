import type { Bike, Builder, BuildersCup, Issue, Person, Product, Story } from "@/types/content";
import { getStories } from "./stories";
import { getAllIssues } from "./issues";
import { getAllBuildersCupEvents } from "./buildersCup";
import { getMerchandise } from "./products";
import { getAllBikes } from "./bikes";
import { getAllBuilders } from "./builders";
import { getAllPeople } from "./people";
import { portableTextToPlainText } from "@/utils/portableTextToPlainText";

export interface SearchResults {
  stories: Story[];
  issues: Issue[];
  buildersCup: BuildersCup[];
  products: Product[];
  bikes: Bike[];
  builders: Builder[];
  people: Person[];
}

const EMPTY_RESULTS: SearchResults = {
  stories: [],
  issues: [],
  buildersCup: [],
  products: [],
  bikes: [],
  builders: [],
  people: [],
};

// Relevance tiers (docs-requested order: title exact > title partial >
// subtitle > body > metadata). Deliberately coarse buckets, not a real
// scoring model — good enough for MVP substring matching, and the exact
// numbers don't matter beyond preserving this ordering, since a future
// Algolia/Typesense swap replaces this whole ranking approach anyway.
const SCORE = {
  titleExact: 100,
  titlePartial: 60,
  subtitle: 30,
  body: 15,
  metadata: 5,
};

// What a single entity offers to be searched, split into the same tiers
// `SCORE` weights. Every field is optional — an entity with no bio, no
// description, etc. just contributes nothing at that tier.
interface SearchableFields {
  title?: string;
  subtitle?: string;
  body?: (string | undefined)[];
  metadata?: (string | undefined)[];
}

function scoreFields(query: string, fields: SearchableFields): number {
  let score = 0;

  const title = fields.title?.toLowerCase();
  if (title) {
    if (title === query) score += SCORE.titleExact;
    else if (title.includes(query)) score += SCORE.titlePartial;
  }

  if (fields.subtitle?.toLowerCase().includes(query)) {
    score += SCORE.subtitle;
  }

  for (const value of fields.body ?? []) {
    if (value?.toLowerCase().includes(query)) score += SCORE.body;
  }

  for (const value of fields.metadata ?? []) {
    if (value?.toLowerCase().includes(query)) score += SCORE.metadata;
  }

  return score;
}

// Shared by every entity type below — score, drop non-matches, sort by
// relevance descending. This (plus scoreFields above) is the one place
// ranking logic lives; a future search engine replaces this function's
// body, not each entity's call site.
function rank<T>(items: T[], query: string, toFields: (item: T) => SearchableFields): T[] {
  return items
    .map((item) => ({ item, score: scoreFields(query, toFields(item)) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

function storyFields(story: Story): SearchableFields {
  return {
    title: story.title,
    subtitle: story.shortDescription,
    body: [portableTextToPlainText(story.content)],
    metadata: [story.category, story.author?.name],
  };
}

function issueFields(issue: Issue): SearchableFields {
  return {
    title: issue.title,
    body: [portableTextToPlainText(issue.description)],
    metadata: [String(issue.number), String(issue.year)],
  };
}

function buildersCupFields(event: BuildersCup): SearchableFields {
  return {
    title: event.name,
    subtitle: event.location,
    body: [portableTextToPlainText(event.description)],
    // `date` is an ISO string ("2024-07-22") — a bare year query like
    // "2024" matches it as a substring, which covers "search by year"
    // without needing a separate parsed-out field.
    metadata: [event.date],
  };
}

function productFields(product: Product): SearchableFields {
  return {
    title: product.name,
    subtitle: product.shortDescription,
    body: [portableTextToPlainText(product.description)],
    metadata: [product.materials, ...(product.sizes ?? [])],
  };
}

function bikeFields(bike: Bike): SearchableFields {
  return {
    title: bike.name,
    subtitle: portableTextToPlainText(bike.description),
    metadata: [
      bike.builder?.name,
      ...(bike.specifications ? Object.entries(bike.specifications).flat() : []),
    ],
  };
}

function builderFields(builder: Builder): SearchableFields {
  return {
    title: builder.name,
    body: [portableTextToPlainText(builder.bio)],
    metadata: [builder.location],
  };
}

function personFields(person: Person): SearchableFields {
  return {
    title: person.name,
    subtitle: person.role,
    body: [portableTextToPlainText(person.bio)],
  };
}

// Single entry point (docs/04_TECH_STACK.md: "The architecture must
// allow future replacement with a dedicated search engine ... without
// requiring changes to UI components or page structure"). Swapping this
// body for Algolia/Typesense in a later phase touches only this file —
// the search page only ever sees a SearchResults object, never how it
// was produced or where the data came from.
//
// MVP implementation is case-insensitive substring matching across every
// public content type, with a coarse relevance ranking (see SCORE
// above) — no typo tolerance, no fuzzy search, per the documented MVP
// limitation.
export async function search(query: string): Promise<SearchResults> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return EMPTY_RESULTS;
  }

  const [stories, issues, buildersCup, products, bikes, builders, people] = await Promise.all([
    getStories(),
    getAllIssues(),
    getAllBuildersCupEvents(),
    getMerchandise(),
    getAllBikes(),
    getAllBuilders(),
    getAllPeople(),
  ]);

  return {
    stories: rank(stories, trimmed, storyFields),
    issues: rank(issues, trimmed, issueFields),
    buildersCup: rank(buildersCup, trimmed, buildersCupFields),
    products: rank(products, trimmed, productFields),
    bikes: rank(bikes, trimmed, bikeFields),
    builders: rank(builders, trimmed, builderFields),
    people: rank(people, trimmed, personFields),
  };
}
