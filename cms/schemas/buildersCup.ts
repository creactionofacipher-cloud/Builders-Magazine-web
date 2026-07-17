import type { SchemaTypeDefinition } from "./types";

export const buildersCup: SchemaTypeDefinition = {
  name: "buildersCup",
  title: "Builders Cup",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    { name: "date", title: "Date", type: "date" },
    { name: "location", title: "Location", type: "string" },
    { name: "description", title: "Description", type: "array", of: [{ type: "block" }] },
    { name: "coverImage", title: "Cover Image", type: "reference", to: [{ type: "mediaAsset" }] },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ name: "galleryImage", type: "reference", to: [{ type: "mediaAsset" }] }],
    },
    {
      name: "participants",
      title: "Participants",
      type: "array",
      of: [{ name: "participant", type: "reference", to: [{ type: "bike" }] }],
    },
    {
      name: "winners",
      title: "Winners",
      type: "array",
      of: [{ name: "winner", type: "reference", to: [{ type: "bike" }] }],
    },
    {
      name: "stories",
      title: "Stories",
      type: "array",
      of: [{ name: "cupStory", type: "reference", to: [{ type: "story" }] }],
    },
  ],
};
