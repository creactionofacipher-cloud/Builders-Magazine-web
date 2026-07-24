import { defineArrayMember, defineField, defineType } from "sanity";
import { portableTextBlocks } from "./portableTextBlocks";
import { SortedMediaAssetReferenceInput } from "../components/inputs/SortedMediaAssetReferenceInput";

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
      components: { input: SortedMediaAssetReferenceInput },
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
    // Weak: a Story shouldn't block deleting an Issue it happens to
    // reference (this field is never actually dereferenced by any
    // current query/page — see cms/queries/fragments.ts's storyProjection —
    // so there's no dangling-reference behavior to guard against either).
    defineField({
      name: "issue",
      title: "Issue",
      type: "reference",
      to: [{ type: "issue" }],
      weak: true,
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
          components: { input: SortedMediaAssetReferenceInput },
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
      name: "tags",
      title: "Tags",
      description: "Free-form tags — used by Story Grid's automatic/query data source to filter.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["draft", "published"] },
    }),
  ],
});
