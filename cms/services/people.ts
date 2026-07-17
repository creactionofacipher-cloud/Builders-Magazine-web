import type { Person } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { ALL_PEOPLE_QUERY } from "@/cms/queries/person";
import { mapPerson } from "@/cms/mappers/person";
import { mockCrew } from "./mock-data";

// Sanity path when configured (see cms/sanity/client.ts), mock fallback
// otherwise — same signature either way, callers never change.
//
// "Crew" here means every Person document — there is no schema field
// distinguishing team members from other contributors (story authors,
// photo credits). Real editorial curation of who appears on the About
// page's team grid would need a dedicated field (e.g. a boolean) added
// later; this preserves exact parity with the mock path, which already
// treats its whole mockCrew array as the team.
export async function getCrew(): Promise<Person[]> {
  if (isSanityConfigured) {
    const raw = await sanityFetch<Person[]>(ALL_PEOPLE_QUERY);
    return raw.map(mapPerson);
  }
  return mockCrew;
}
