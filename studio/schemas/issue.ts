import { defineArrayMember, defineField, defineType } from "sanity";
import { portableTextBlocks } from "./portableTextBlocks";
import { SortedMediaAssetReferenceInput } from "../components/inputs/SortedMediaAssetReferenceInput";
import { gallerySettingsField } from "./gallerySettings";

// Ported from cms/schemas/issue.ts — field-for-field.
export default defineType({
  name: "issue",
  title: "Issue",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "number", title: "Number", type: "number" }),
    defineField({ name: "year", title: "Year", type: "number" }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "reference",
      to: [{ type: "mediaAsset" }],
      components: { input: SortedMediaAssetReferenceInput },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: portableTextBlocks,
    }),
    defineField({ name: "releaseDate", title: "Release Date", type: "date" }),
    defineField({
      name: "advertisers",
      title: "Advertisers",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "buyLinks",
      title: "Buy Links",
      type: "array",
      of: [
        defineArrayMember({
          name: "buyLink",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["draft", "published"] },
    }),
    defineField({
      name: "featuredStories",
      title: "Featured Stories",
      type: "array",
      of: [
        // weak: deleting a Story shouldn't be blocked by an Issue still
        // "featuring" it — see cms/queries/issue.ts, which filters out
        // any now-dangling reference before rendering.
        defineArrayMember({
          name: "featuredStory",
          type: "reference",
          to: [{ type: "story" }],
          weak: true,
        }),
      ],
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
    gallerySettingsField,
  ],
});
