import type { SchemaField } from "./types";

// Docs-only mirror of studio/schemas/gallerySettings.ts — structure only,
// no Studio-only behavior (initialValue/hidden/preview), matching this
// directory's existing convention (see cms/schemas/layoutBlocks.ts's
// horizontalImageStrip mirror).
export const GALLERY_LAYOUTS = ["grid", "strip"];
export const GALLERY_HEIGHTS = ["small", "medium", "large"];
export const GALLERY_GAPS = ["none", "small", "medium", "large"];

export const gallerySettingsField: SchemaField = {
  name: "gallerySettings",
  title: "Gallery Display",
  type: "object",
  fields: [
    { name: "layout", title: "Layout", type: "string", options: { list: GALLERY_LAYOUTS } },
    { name: "imageHeight", title: "Image Height", type: "string", options: { list: GALLERY_HEIGHTS } },
    { name: "gap", title: "Gap", type: "string", options: { list: GALLERY_GAPS } },
    { name: "showCaptions", title: "Show Captions", type: "boolean" },
    { name: "showScrollbar", title: "Show Scrollbar", type: "boolean" },
  ],
};
