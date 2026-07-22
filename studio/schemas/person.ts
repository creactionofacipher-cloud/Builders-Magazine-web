import { defineField, defineType } from "sanity";

// Mirrors types/content.ts's PERSON_GROUPS exactly (also duplicated in
// cms/schemas/person.ts for the same reason — kept in sync manually).
// Adding a new team block later means adding one entry here (plus the
// two mirrors) — nothing else changes. English values shown as-is to
// editors here, same convention as Story's category list below; the
// Russian label used on the public site lives in
// types/content.ts's PERSON_GROUP_LABELS.
const PERSON_GROUPS = ["Team", "Photographers"];

// Ported from cms/schemas/person.ts. "articles" (Story[]) is
// intentionally not a stored field — it's a back-reference, resolved via
// GROQ (*[_type == "story" && author._ref == ^._id]) rather than a field
// editors would have to keep in sync on both sides.
export default defineType({
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "photo", title: "Photo", type: "reference", to: [{ type: "mediaAsset" }] }),
    defineField({ name: "bio", title: "Bio", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "groups",
      title: "Groups",
      description:
        "В каких блоках страницы «О журнале» показывать этого человека — можно выбрать несколько.",
      type: "array",
      of: [{ type: "string" }],
      options: { list: PERSON_GROUPS, layout: "grid" },
    }),
  ],
});
