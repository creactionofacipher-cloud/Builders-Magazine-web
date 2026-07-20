import { defineArrayMember, defineField, defineType } from "sanity";
import { portableTextBlocks } from "./portableTextBlocks";

// Ported from cms/schemas/buildersCup.ts — field-for-field.
export default defineType({
  name: "buildersCup",
  title: "Builders Cup",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: portableTextBlocks,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "reference",
      to: [{ type: "mediaAsset" }],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
          name: "galleryImage",
          type: "reference",
          to: [{ type: "mediaAsset" }],
        }),
      ],
    }),
    defineField({
      name: "participants",
      title: "Participants",
      type: "array",
      of: [defineArrayMember({ name: "participant", type: "reference", to: [{ type: "bike" }] })],
    }),
    defineField({
      name: "winners",
      title: "Winners",
      type: "array",
      of: [defineArrayMember({ name: "winner", type: "reference", to: [{ type: "bike" }] })],
    }),
    defineField({
      name: "stories",
      title: "Stories",
      type: "array",
      // weak: deleting a Story shouldn't be blocked by a Builders Cup
      // still listing it. Not currently fetched by any GROQ query in the
      // app (see cms/queries/buildersCup.ts), so no dangling-reference
      // filtering is needed on the query side.
      of: [
        defineArrayMember({
          name: "cupStory",
          type: "reference",
          to: [{ type: "story" }],
          weak: true,
        }),
      ],
    }),
  ],
});
