import type { SchemaArrayMember } from "./types";

// Mirrors studio/schemas/portableTextBlocks.ts exactly (also duplicated
// there for the same reason — kept in sync manually). Field-level
// validation/initialValue/preview live Studio-side only, same reasoning
// as the currency field in cms/schemas/product.ts: those need the real
// Rule-builder API, which this lightweight type intentionally doesn't
// model.
export const RICH_TEXT_IMAGE_VARIANTS = ["inline", "wide", "fullWidth"];
export const EMBED_PROVIDERS = ["youtube", "vimeo", "other"];

export const portableTextBlocks: SchemaArrayMember[] = [
  { type: "block" },
  {
    name: "richTextImage",
    title: "Image",
    type: "object",
    fields: [
      { name: "image", title: "Image", type: "reference", to: [{ type: "mediaAsset" }] },
      {
        name: "variant",
        title: "Display",
        type: "string",
        options: { list: RICH_TEXT_IMAGE_VARIANTS },
      },
    ],
  },
  {
    name: "pullQuote",
    title: "Pull Quote",
    type: "object",
    fields: [
      { name: "text", title: "Text", type: "text" },
      { name: "attribution", title: "Attribution", type: "string" },
    ],
  },
  {
    name: "divider",
    title: "Divider",
    type: "object",
    // Sanity requires every object type to have at least one field — see
    // the matching comment in studio/schemas/portableTextBlocks.ts.
    fields: [{ name: "marker", title: "Marker", type: "boolean" }],
  },
  {
    name: "embed",
    title: "Embed",
    type: "object",
    fields: [
      { name: "url", title: "URL", type: "url" },
      { name: "provider", title: "Provider", type: "string", options: { list: EMBED_PROVIDERS } },
    ],
  },
];
