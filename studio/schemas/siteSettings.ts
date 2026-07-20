import { defineArrayMember, defineField, defineType } from "sanity";

// Mirrors types/content.ts's SiteSettings.defaultSEO.robots exactly
// (also duplicated in cms/schemas/siteSettings.ts) — a plain string
// field with a curated list of common values, not a structured
// boolean-toggle set. Next.js's Metadata.robots accepts this string
// directly (see app/layout.tsx).
const ROBOTS_OPTIONS = ["index, follow", "noindex, follow", "index, nofollow", "noindex, nofollow"];

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
      description:
        "Site-wide SEO fallback — used whenever a specific page doesn't define its own title, description, image, etc. (see app/layout.tsx).",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text" }),
        defineField({
          name: "keywords",
          title: "Keywords",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "ogImage",
          title: "OG Image",
          description: "Open Graph fallback image — used by any page that doesn't set its own.",
          type: "reference",
          to: [{ type: "mediaAsset" }],
        }),
        defineField({
          name: "favicon",
          title: "Favicon",
          description: "Reused for the browser tab icon, shortcut icon, and Apple touch icon.",
          type: "reference",
          to: [{ type: "mediaAsset" }],
        }),
        defineField({
          name: "twitterImage",
          title: "Twitter Image",
          description: "Falls back to OG Image above when left empty.",
          type: "reference",
          to: [{ type: "mediaAsset" }],
        }),
        defineField({
          name: "robots",
          title: "Robots",
          type: "string",
          options: { list: ROBOTS_OPTIONS },
          initialValue: "index, follow",
        }),
        defineField({
          name: "siteName",
          title: "Site Name",
          description:
            "What OpenGraph/Twitter/structured data call the site — falls back to Site Title above when left empty.",
          type: "string",
        }),
      ],
    }),
    defineField({ name: "footerText", title: "Footer Text", type: "text" }),
  ],
});
