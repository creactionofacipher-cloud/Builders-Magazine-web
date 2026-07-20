import type { SchemaTypeDefinition } from "./types";

// Mirrors types/content.ts's PERSON_GROUPS exactly (also duplicated in
// studio/schemas/person.ts for the same reason — kept in sync manually).
const PERSON_GROUPS = ["Команда", "Фотографы"];

// Not in the requested schema list, but a structural dependency:
// Story.author and MediaAsset.author both reference "person" — without
// this schema those references would point at a non-existent type.
export const person: SchemaTypeDefinition = {
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    { name: "role", title: "Role", type: "string" },
    { name: "photo", title: "Photo", type: "reference", to: [{ type: "mediaAsset" }] },
    { name: "bio", title: "Bio", type: "array", of: [{ type: "block" }] },
    {
      name: "groups",
      title: "Groups",
      type: "array",
      of: [{ type: "string" }],
      options: { list: PERSON_GROUPS },
    },
  ],
  // "articles" (Story[]) is intentionally not a stored field — it's a
  // back-reference, resolved via GROQ
  // (*[_type == "story" && author._ref == ^._id]) rather than a field
  // editors would have to keep in sync on both sides.
};
