import { defineArrayMember, defineField } from "sanity";

// Shared print-magazine-style rich text block set — reused by every field
// that needs it (story.content, issue.description, buildersCup.description;
// see cms/schemas/portableTextBlocks.ts for the lightweight app-side
// mirror). One definition, imported wherever it's needed, so the three
// schemas can never drift out of sync with each other.
export const RICH_TEXT_IMAGE_VARIANTS = ["inline", "wide", "fullWidth"];
export const EMBED_PROVIDERS = ["youtube", "vimeo", "other"];

export const portableTextBlocks = [
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
