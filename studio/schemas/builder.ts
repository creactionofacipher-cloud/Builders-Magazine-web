import { defineArrayMember, defineField, defineType } from "sanity";

// Ported from cms/schemas/builder.ts — field-for-field.
export default defineType({
  name: "builder",
  title: "Builder",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "array", of: [{ type: "block" }] }),
    defineField({
      // Record<string, string> in the app type — same array-of-pairs
      // modeling as Bike.specifications; mapper converts to Record.
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineArrayMember({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Platform", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [defineArrayMember({ name: "project", type: "reference", to: [{ type: "bike" }] })],
    }),
    defineField({
      name: "stories",
      title: "Stories",
      type: "array",
      // weak: deleting a Story shouldn't be blocked by a Builder still
      // listing it. Not currently fetched by any GROQ query in the app
      // (see cms/queries/builder.ts), so no dangling-reference filtering
      // is needed on the query side.
      of: [
        defineArrayMember({
          name: "builderStory",
          type: "reference",
          to: [{ type: "story" }],
          weak: true,
        }),
      ],
    }),
  ],
});
