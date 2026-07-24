import { defineArrayMember, defineField, defineType } from "sanity";
import { SortedMediaAssetReferenceInput } from "../components/inputs/SortedMediaAssetReferenceInput";

// Ported from cms/schemas/bike.ts — field-for-field.
export default defineType({
  name: "bike",
  title: "Bike",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "brand", title: "Brand", type: "string" }),
    defineField({ name: "model", title: "Model", type: "string" }),
    defineField({ name: "year", title: "Year", type: "number" }),
    defineField({ name: "style", title: "Style", type: "string" }),
    defineField({ name: "engine", title: "Engine", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      // Record<string, string> in the app type — Sanity has no dynamic
      // key/value object field, so this is modeled as an array of
      // {key, value} pairs; cms/mappers/bike.ts converts array -> Record.
      name: "specifications",
      title: "Specifications",
      type: "array",
      of: [
        defineArrayMember({
          name: "specification",
          type: "object",
          fields: [
            defineField({ name: "key", title: "Key", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          name: "bikeImage",
          type: "reference",
          to: [{ type: "mediaAsset" }],
          components: { input: SortedMediaAssetReferenceInput },
        }),
      ],
    }),
    defineField({
      name: "builder",
      title: "Builder",
      type: "reference",
      to: [{ type: "builder" }],
    }),
    defineField({
      name: "stories",
      title: "Stories",
      type: "array",
      // weak: deleting a Story shouldn't be blocked by a Bike still
      // listing it. Not currently fetched by any GROQ query in the app
      // (see cms/queries/bike.ts), so no dangling-reference filtering
      // is needed on the query side.
      of: [
        defineArrayMember({
          name: "bikeStory",
          type: "reference",
          to: [{ type: "story" }],
          weak: true,
        }),
      ],
    }),
    // Weak: a Bike's issue-appearance history shouldn't block deleting an
    // Issue it lists (this field is never actually dereferenced by any
    // current query/page — see cms/queries/fragments.ts's bikeProjection —
    // so there's no dangling-reference behavior to guard against either).
    defineField({
      name: "issues",
      title: "Issues",
      type: "array",
      of: [
        defineArrayMember({
          name: "bikeIssue",
          type: "reference",
          to: [{ type: "issue" }],
          weak: true,
        }),
      ],
    }),
  ],
});
