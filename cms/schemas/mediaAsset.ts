import type { SchemaTypeDefinition } from "./types";

export const mediaAsset: SchemaTypeDefinition = {
  name: "mediaAsset",
  title: "Media Asset",
  type: "document",
  fields: [
    { name: "file", title: "File", type: "image" },
    { name: "caption", title: "Caption", type: "string" },
    { name: "author", title: "Author", type: "reference", to: [{ type: "person" }] },
    { name: "copyright", title: "Copyright", type: "string" },
    { name: "altText", title: "Alt Text", type: "string" },
    { name: "relatedObject", title: "Related Object", type: "string" },
  ],
};
