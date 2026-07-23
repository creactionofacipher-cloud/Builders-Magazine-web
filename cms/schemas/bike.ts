import type { SchemaTypeDefinition } from "./types";

export const bike: SchemaTypeDefinition = {
  name: "bike",
  title: "Bike",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    { name: "brand", title: "Brand", type: "string" },
    { name: "model", title: "Model", type: "string" },
    { name: "year", title: "Year", type: "number" },
    { name: "style", title: "Style", type: "string" },
    { name: "engine", title: "Engine", type: "string" },
    { name: "description", title: "Description", type: "array", of: [{ type: "block" }] },
    {
      // Record<string, string> in the app type — Sanity has no dynamic
      // key/value object field, so this is modeled as an array of
      // {key, value} pairs; the mapper converts array -> Record.
      name: "specifications",
      title: "Specifications",
      type: "array",
      of: [
        {
          name: "specification",
          type: "object",
          fields: [
            { name: "key", title: "Key", type: "string" },
            { name: "value", title: "Value", type: "string" },
          ],
        },
      ],
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [{ name: "bikeImage", type: "reference", to: [{ type: "mediaAsset" }] }],
    },
    { name: "builder", title: "Builder", type: "reference", to: [{ type: "builder" }] },
    {
      name: "stories",
      title: "Stories",
      type: "array",
      of: [{ name: "bikeStory", type: "reference", to: [{ type: "story" }], weak: true }],
    },
    {
      name: "issues",
      title: "Issues",
      type: "array",
      of: [{ name: "bikeIssue", type: "reference", to: [{ type: "issue" }], weak: true }],
    },
  ],
};
