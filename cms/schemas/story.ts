import type { SchemaTypeDefinition } from "./types";
import { portableTextBlocks } from "./portableTextBlocks";

// Mirrors types/content.ts's STORY_CATEGORIES exactly.
const STORY_CATEGORIES = ["Bike", "Builder", "Culture", "Interview", "Event"];

export const story: SchemaTypeDefinition = {
  name: "story",
  title: "Story",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "coverImage", title: "Cover Image", type: "reference", to: [{ type: "mediaAsset" }] },
    { name: "shortDescription", title: "Short Description", type: "string" },
    { name: "content", title: "Content", type: "array", of: portableTextBlocks },
    { name: "category", title: "Category", type: "string", options: { list: STORY_CATEGORIES } },
    { name: "author", title: "Author", type: "reference", to: [{ type: "person" }] },
    { name: "publishedDate", title: "Published Date", type: "date" },
    { name: "issue", title: "Issue", type: "reference", to: [{ type: "issue" }] },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ name: "galleryImage", type: "reference", to: [{ type: "mediaAsset" }] }],
    },
    {
      name: "relatedBike",
      title: "Related Bike",
      type: "array",
      of: [{ name: "relatedBikeRef", type: "reference", to: [{ type: "bike" }] }],
    },
    {
      name: "relatedBuilder",
      title: "Related Builder",
      type: "array",
      of: [{ name: "relatedBuilderRef", type: "reference", to: [{ type: "builder" }] }],
    },
    { name: "status", title: "Status", type: "string", options: { list: ["draft", "published"] } },
  ],
};
