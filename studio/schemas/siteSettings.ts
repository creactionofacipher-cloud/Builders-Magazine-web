import { defineArrayMember, defineField, defineType } from "sanity";

// Ported from cms/schemas/siteSettings.ts. Singleton, not a collection —
// this integration assumes the document is created with
// _id: "siteSettings" (see cms/queries/siteSettings.ts), the
// conventional Sanity pattern for fetching a singleton directly instead
// of querying a collection. No desk-structure restriction is configured
// here (that would be new functionality beyond the existing schemas) —
// editors should simply not create a second document of this type.
export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteTitle", title: "Site Title", type: "string" }),
    defineField({ name: "siteDescription", title: "Site Description", type: "text" }),
    defineField({ name: "mission", title: "Mission", type: "text" }),
    defineField({ name: "philosophy", title: "Philosophy", type: "text" }),
    defineField({
      name: "contacts",
      title: "Contacts",
      type: "object",
      fields: [
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
      ],
    }),
    defineField({ name: "cooperation", title: "Cooperation", type: "text" }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineArrayMember({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "defaultSEO",
      title: "Default SEO",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text" }),
        defineField({
          name: "ogImage",
          title: "OG Image",
          type: "reference",
          to: [{ type: "mediaAsset" }],
        }),
      ],
    }),
    defineField({ name: "footerText", title: "Footer Text", type: "text" }),
  ],
});
