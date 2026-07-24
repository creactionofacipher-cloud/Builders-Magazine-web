import type { SchemaTypeDefinition } from "./types";
import { portableTextBlocks } from "./portableTextBlocks";
import { gallerySettingsField } from "./gallerySettings";

export const issue: SchemaTypeDefinition = {
  name: "issue",
  title: "Issue",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "number", title: "Number", type: "number" },
    { name: "year", title: "Year", type: "number" },
    { name: "coverImage", title: "Cover Image", type: "reference", to: [{ type: "mediaAsset" }] },
    { name: "description", title: "Description", type: "array", of: portableTextBlocks },
    { name: "releaseDate", title: "Release Date", type: "date" },
    { name: "advertisers", title: "Advertisers", type: "array", of: [{ type: "string" }] },
    // Optional, positive-only validation in studio/schemas/issue.ts —
    // needs the real Rule-builder API, which this lightweight type
    // intentionally doesn't model. See types.ts.
    { name: "price", title: "Price", type: "number" },
    {
      name: "buyLinks",
      title: "Buy Links",
      type: "array",
      of: [
        {
          name: "buyLink",
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        },
      ],
    },
    { name: "status", title: "Status", type: "string", options: { list: ["draft", "published"] } },
    {
      name: "featuredStories",
      title: "Featured Stories",
      type: "array",
      of: [{ name: "featuredStory", type: "reference", to: [{ type: "story" }], weak: true }],
    },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ name: "galleryImage", type: "reference", to: [{ type: "mediaAsset" }] }],
    },
    gallerySettingsField,
  ],
};
