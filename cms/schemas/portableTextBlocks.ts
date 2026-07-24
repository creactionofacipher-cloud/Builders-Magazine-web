import type { SchemaArrayMember } from "./types";

// Mirrors studio/schemas/portableTextBlocks.ts exactly (also duplicated
// there for the same reason — kept in sync manually). Field-level
// validation/initialValue/preview live Studio-side only, same reasoning
// as the currency field in cms/schemas/product.ts: those need the real
// Rule-builder API, which this lightweight type intentionally doesn't
// model.
export const RICH_TEXT_IMAGE_VARIANTS = ["inline", "wide", "fullWidth"];
export const EMBED_PROVIDERS = ["youtube", "vimeo", "other"];
export const IMAGE_ROW_LAYOUTS = ["equal", "2-1", "1-2", "large-left", "large-right"];
export const IMAGE_ROW_GAPS = ["small", "medium", "large"];
export const IMAGE_TEXT_POSITIONS = ["left", "right"];
export const IMAGE_TEXT_WIDTHS = ["35%", "40%", "50%"];
export const IMAGE_STRIP_HEIGHTS = ["small", "medium", "large"];
export const IMAGE_STRIP_GAPS = ["none", "small", "medium", "large"];

// Mirrors studio/schemas/portableTextBlocks.ts's BASE_PORTABLE_TEXT_BLOCKS
// — the block set allowed inside twoColumnText's own `content` array. Kept
// separate from `portableTextBlocks` below for the same reason (avoids a
// self-reference).
const baseBlocks: SchemaArrayMember[] = [
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

export const portableTextBlocks: SchemaArrayMember[] = [
  ...baseBlocks,
  {
    name: "imageRow",
    title: "Image Row",
    type: "object",
    fields: [
      {
        name: "images",
        title: "Images",
        type: "array",
        of: [{ type: "reference", to: [{ type: "mediaAsset" }] }],
      },
      { name: "layout", title: "Layout", type: "string", options: { list: IMAGE_ROW_LAYOUTS } },
      { name: "gap", title: "Gap", type: "string", options: { list: IMAGE_ROW_GAPS } },
      { name: "caption", title: "Caption", type: "string" },
    ],
  },
  {
    name: "imageText",
    title: "Image + Text",
    type: "object",
    fields: [
      { name: "image", title: "Image", type: "reference", to: [{ type: "mediaAsset" }] },
      {
        name: "position",
        title: "Position",
        type: "string",
        options: { list: IMAGE_TEXT_POSITIONS },
      },
      { name: "width", title: "Width", type: "string", options: { list: IMAGE_TEXT_WIDTHS } },
      { name: "textWrap", title: "Wrap text around image", type: "boolean" },
    ],
  },
  {
    name: "fullBleedImage",
    title: "Full Bleed Image",
    type: "object",
    fields: [{ name: "image", title: "Image", type: "reference", to: [{ type: "mediaAsset" }] }],
  },
  {
    name: "imageStrip",
    title: "Image Strip",
    type: "object",
    fields: [
      {
        name: "images",
        title: "Images",
        type: "array",
        of: [{ name: "imageRef", type: "reference", to: [{ type: "mediaAsset" }] }],
      },
      { name: "imageHeight", title: "Image Height", type: "string", options: { list: IMAGE_STRIP_HEIGHTS } },
      { name: "gap", title: "Gap", type: "string", options: { list: IMAGE_STRIP_GAPS } },
      { name: "showCaptions", title: "Show Captions", type: "boolean" },
      { name: "showScrollbar", title: "Show Scrollbar", type: "boolean" },
      { name: "caption", title: "Caption", type: "string" },
    ],
  },
  {
    name: "twoColumnText",
    title: "Two-Column Text",
    type: "object",
    fields: [{ name: "content", title: "Content", type: "array", of: baseBlocks }],
  },
];
