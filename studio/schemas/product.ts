import { defineArrayMember, defineField, defineType } from "sanity";

// Ported from cms/schemas/product.ts — field-for-field.
export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "shortDescription", title: "Short Description", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "reference",
      to: [{ type: "mediaAsset" }],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
          name: "galleryImage",
          type: "reference",
          to: [{ type: "mediaAsset" }],
        }),
      ],
    }),
    defineField({ name: "price", title: "Price", type: "number" }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      options: { list: ["RUB", "USD", "EUR"] },
      initialValue: "RUB",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "sizes", title: "Sizes", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "materials", title: "Materials", type: "string" }),
    defineField({ name: "externalBuyUrl", title: "External Buy URL", type: "url" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["draft", "published"] },
    }),
  ],
});
