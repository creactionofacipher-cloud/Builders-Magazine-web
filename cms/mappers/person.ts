import type { Person } from "@/types/content";

// personProjection (cms/queries/fragments.ts) already produces a shape
// matching Person exactly — no array-to-Record or similar transform is
// needed. Kept as an explicit boundary function anyway, consistent with
// every other entity, so a future GROQ shape change has one place to
// absorb it without touching services or UI.
export function mapPerson(raw: Person): Person {
  return raw;
}
