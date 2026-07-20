import { defineArrayMember, defineField } from "sanity";

// Shared print-magazine-style rich text block set — reused by every field
// that needs it (story.content, issue.description, buildersCup.description;
// see cms/schemas/portableTextBlocks.ts for the lightweight app-side
// mirror). One definition, imported wherever it's needed, so the three
// schemas can never drift out of sync with each other.
export const RICH_TEXT_IMAGE_VARIANTS = ["inline", "wide", "fullWidth"];
export const EMBED_PROVIDERS = ["youtube", "vimeo", "other"];
export const IMAGE_ROW_LAYOUTS = ["equal", "2-1", "1-2", "large-left", "large-right"];
export const IMAGE_ROW_GAPS = ["small", "medium", "large"];
export const IMAGE_TEXT_POSITIONS = ["left", "right"];
export const IMAGE_TEXT_WIDTHS = ["35%", "40%", "50%"];

// The block set allowed inside a twoColumnText's own `content` array (see
// below) — plain blocks plus the simple single-object blocks, not the
// other three "editorial layout" blocks and not twoColumnText itself.
// Kept as its own array (not computed from `portableTextBlocks`, which is
// defined below and would create a self-reference) so twoColumnText can
// reference it directly.
const BASE_PORTABLE_TEXT_BLOCKS = [
  defineArrayMember({ type: "block" }),
  defineArrayMember({
    name: "richTextImage",
    title: "Image",
    type: "object",
    fields: [
      defineField({
        name: "image",
        title: "Image",
        type: "reference",
        to: [{ type: "mediaAsset" }],
      }),
      defineField({
        name: "variant",
        title: "Display",
        description: "How wide this image renders in the article layout.",
        type: "string",
        options: { list: RICH_TEXT_IMAGE_VARIANTS },
        initialValue: "inline",
      }),
    ],
    preview: {
      select: { media: "image.file", variant: "variant" },
      prepare({ media, variant }) {
        return { title: `Image (${variant ?? "inline"})`, media };
      },
    },
  }),
  defineArrayMember({
    name: "pullQuote",
    title: "Pull Quote",
    type: "object",
    fields: [
      defineField({ name: "text", title: "Text", type: "text", validation: (Rule) => Rule.required() }),
      defineField({ name: "attribution", title: "Attribution", type: "string" }),
    ],
    preview: {
      select: { title: "text" },
    },
  }),
  defineArrayMember({
    name: "divider",
    title: "Divider",
    type: "object",
    // Sanity requires every object type to declare at least one field —
    // divider is a pure marker with nothing for an editor to fill in, so
    // this exists only to satisfy that constraint and is hidden from the
    // Studio UI.
    fields: [defineField({ name: "marker", type: "boolean", hidden: true, initialValue: true })],
    preview: {
      prepare() {
        return { title: "— Divider —" };
      },
    },
  }),
  defineArrayMember({
    name: "embed",
    title: "Embed",
    type: "object",
    fields: [
      defineField({
        name: "url",
        title: "URL",
        type: "url",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "provider",
        title: "Provider",
        description:
          "Optional — the renderer auto-detects YouTube/Vimeo from the URL either way. Only set this to override that.",
        type: "string",
        options: { list: EMBED_PROVIDERS },
      }),
    ],
    preview: {
      select: { subtitle: "url" },
      prepare({ subtitle }) {
        return { title: "Embed", subtitle };
      },
    },
  }),
];

// Full block set for top-level RichText fields (story.content,
// issue.description, buildersCup.description) — the base set above plus
// the four advanced editorial layout blocks.
export const portableTextBlocks = [
  ...BASE_PORTABLE_TEXT_BLOCKS,
  defineArrayMember({
    name: "imageRow",
    title: "Image Row",
    description: "2–4 images laid out as one editorial row.",
    type: "object",
    fields: [
      defineField({
        name: "images",
        title: "Images",
        type: "array",
        of: [{ type: "reference", to: [{ type: "mediaAsset" }] }],
        validation: (Rule) => Rule.min(2).max(4).required(),
      }),
      defineField({
        name: "layout",
        title: "Layout",
        type: "string",
        options: { list: IMAGE_ROW_LAYOUTS },
        initialValue: "equal",
      }),
      defineField({
        name: "gap",
        title: "Gap",
        type: "string",
        options: { list: IMAGE_ROW_GAPS },
        initialValue: "medium",
      }),
      defineField({ name: "caption", title: "Caption", type: "string" }),
    ],
    preview: {
      select: { media: "images.0.file", layout: "layout", count: "images.length" },
      prepare({ media, layout, count }) {
        return { title: `Image Row — ${layout ?? "equal"} (${count ?? 0})`, media };
      },
    },
  }),
  defineArrayMember({
    name: "imageText",
    title: "Image + Text",
    description:
      "Floats an image beside the surrounding paragraphs, magazine-article style. Desktop only — stacks on mobile.",
    type: "object",
    fields: [
      defineField({
        name: "image",
        title: "Image",
        type: "reference",
        to: [{ type: "mediaAsset" }],
      }),
      defineField({
        name: "position",
        title: "Position",
        type: "string",
        options: { list: IMAGE_TEXT_POSITIONS },
        initialValue: "left",
      }),
      defineField({
        name: "width",
        title: "Width",
        type: "string",
        options: { list: IMAGE_TEXT_WIDTHS },
        initialValue: "40%",
      }),
      defineField({
        name: "textWrap",
        title: "Wrap text around image",
        description: "When off, the image is positioned but surrounding text does not wrap around it.",
        type: "boolean",
        initialValue: true,
      }),
    ],
    preview: {
      select: { media: "image.file", position: "position", width: "width" },
      prepare({ media, position, width }) {
        return { title: `Image + Text — ${position ?? "left"}, ${width ?? "40%"}`, media };
      },
    },
  }),
  defineArrayMember({
    name: "fullBleedImage",
    title: "Full Bleed Image",
    description: "Breaks the image outside the reading column; its caption stays inside the column.",
    type: "object",
    fields: [
      defineField({
        name: "image",
        title: "Image",
        type: "reference",
        to: [{ type: "mediaAsset" }],
      }),
    ],
    preview: {
      select: { media: "image.file" },
      prepare({ media }) {
        return { title: "Full Bleed Image", media };
      },
    },
  }),
  defineArrayMember({
    name: "twoColumnText",
    title: "Two-Column Text",
    description: "Two columns on desktop, single column on mobile — useful for long interviews.",
    type: "object",
    fields: [
      defineField({
        name: "content",
        title: "Content",
        type: "array",
        of: BASE_PORTABLE_TEXT_BLOCKS,
      }),
    ],
    preview: {
      prepare() {
        return { title: "Two-Column Text" };
      },
    },
  }),
];
