import { defineArrayMember, defineField, defineType } from "sanity";
import { portableTextBlocks } from "./portableTextBlocks";

// Mirrors types/content.ts's STORY_CATEGORIES exactly (also duplicated
// in cms/schemas/story.ts for the same reason — kept in sync manually).
const STORY_CATEGORIES = ["Bike", "Builder", "Culture", "Interview", "Event"];

// Ported from cms/schemas/story.ts — field-for-field.
export default defineType({
  name: "story",
  title: "Story",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "reference",
      to: [{ type: "mediaAsset" }],
    }),
    defineField({ name: "shortDescription", title: "Short Description", type: "string" }),
    defineField({ name: "content", title: "Content", type: "array", of: portableTextBlocks }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: STORY_CATEGORIES },
    }),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "person" }] }),
    defineField({ name: "publishedDate", title: "Published Date", type: "date" }),
    defineField({ name: "issue", title: "Issue", type: "reference", to: [{ type: "issue" }] }),
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
      name: "relatedBike",
      title: "Related Bike",
      type: "array",
      of: [
        defineArrayMember({ name: "relatedBikeRef", type: "reference", to: [{ type: "bike" }] }),
      ],
    }),
    defineField({
      name: "relatedBuilder",
      title: "Related Builder",
      type: "array",
      of: [
        defineArrayMember({
          name: "relatedBuilderRef",
          type: "reference",
          to: [{ type: "builder" }],
        }),
      ],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["draft", "published"] },
    }),
  ],
});
