import { defineField, defineType } from "sanity";

// Ported from cms/schemas/mediaAsset.ts — field-for-field, no new
// functionality (no validation rules, hotspot, etc. that weren't there).
export default defineType({
  name: "mediaAsset",
  title: "Media Asset",
  type: "document",
  fields: [
    defineField({ name: "file", title: "File", type: "image" }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "person" }] }),
    defineField({ name: "copyright", title: "Copyright", type: "string" }),
    defineField({
      name: "altText",
      title: "Alt Text",
      description: "Required for accessibility — describes the image for screen reader users.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "relatedObject", title: "Related Object", type: "string" }),
  ],
});
