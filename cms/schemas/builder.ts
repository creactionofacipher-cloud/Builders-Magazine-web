import type { SchemaTypeDefinition } from "./types";

export const builder: SchemaTypeDefinition = {
  name: "builder",
  title: "Builder",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    { name: "location", title: "Location", type: "string" },
    { name: "bio", title: "Bio", type: "array", of: [{ type: "block" }] },
    {
      // Record<string, string> in the app type — same array-of-pairs
      // modeling as Bike.specifications; mapper converts to Record.
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          name: "socialLink",
          type: "object",
          fields: [
            { name: "platform", title: "Platform", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        },
      ],
    },
    {
      name: "projects",
      title: "Projects",
      type: "array",
      of: [{ name: "project", type: "reference", to: [{ type: "bike" }] }],
    },
    {
      name: "stories",
      title: "Stories",
      type: "array",
      of: [{ name: "builderStory", type: "reference", to: [{ type: "story" }], weak: true }],
    },
  ],
};
