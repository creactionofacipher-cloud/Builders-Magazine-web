import { cache } from "react";
import type { Person } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { ALL_PEOPLE_QUERY } from "@/cms/queries/person";
import { mapPerson } from "@/cms/mappers/person";
import { mockCrew } from "./mock-data";

// Sanity path when configured (see cms/sanity/client.ts), mock fallback
// otherwise — same signature either way, callers never change.
//
// Returns every Person document (story authors and photo credits
// included, not just people tagged for the About page). Callers that
// want a specific team block filter by Person.groups themselves — see
// app/[locale]/about/page.tsx, which renders one section per
// PERSON_GROUPS entry. Wrapped in cache() so rendering multiple sections
// from the same list in one request doesn't trigger multiple fetches.
export const getAllPeople = cache(async (): Promise<Person[]> => {
  if (isSanityConfigured) {
    const raw = await sanityFetch<Person[]>(ALL_PEOPLE_QUERY);
    return raw.map(mapPerson);
  }
  return mockCrew;
});
