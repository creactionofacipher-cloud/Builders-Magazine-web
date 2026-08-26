import type { SchemaTypeDefinition } from "./types";
import { portableTextBlocks } from "./portableTextBlocks";
import { gallerySettingsField } from "./gallerySettings";

export const buildersCup: SchemaTypeDefinition = {
  name: "buildersCup",
  title: "Builders Cup",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    { name: "date", title: "Date", type: "date" },
    { name: "location", title: "Location", type: "string" },
    { name: "description", title: "Description", type: "array", of: portableTextBlocks },
    { name: "coverImage", title: "Cover Image", type: "reference", to: [{ type: "mediaAsset" }] },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ name: "galleryImage", type: "reference", to: [{ type: "mediaAsset" }] }],
    },
    gallerySettingsField,
    {
      name: "nominations",
      title: "Nominations",
      type: "array",
      of: [
        {
          name: "nomination",
          title: "Nomination",
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text" },
          ],
        },
      ],
    },
    {
      name: "participants",
      title: "Participants",
      type: "array",
      of: [
        {
          name: "participantEntry",
          title: "Participant",
          type: "object",
          fields: [
            { name: "participant", title: "Bike", type: "reference", to: [{ type: "bike" }] },
            { name: "winner", title: "Winner", type: "boolean" },
            { name: "nomination", title: "Nomination", type: "string" },
          ],
        },
      ],
    },
    {
      name: "stories",
      title: "Stories",
      type: "array",
      of: [{ name: "cupStory", type: "reference", to: [{ type: "story" }], weak: true }],
    },
  ],
};
