import type { SchemaTypeDefinition } from "./types";

// Singleton, not a collection — in a real Studio this is enforced by
// desk-structure configuration (restricting creation to one document)
// and/or a fixed _id, not by anything in the schema itself. This
// integration assumes the document is created with _id: "siteSettings"
// (see cms/queries/siteSettings.ts), the conventional Sanity pattern for
// fetching a singleton directly instead of querying a collection.
export const siteSettings: SchemaTypeDefinition = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    { name: "siteTitle", title: "Site Title", type: "string" },
    { name: "siteDescription", title: "Site Description", type: "text" },
    { name: "mission", title: "Mission", type: "text" },
    { name: "philosophy", title: "Philosophy", type: "text" },
    {
      name: "contacts",
      title: "Contacts",
      type: "object",
      fields: [
        { name: "email", title: "Email", type: "string" },
        { name: "city", title: "City", type: "string" },
      ],
    },
    { name: "cooperation", title: "Cooperation", type: "text" },
    {
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          name: "socialLink",
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        },
      ],
    },
    {
      name: "defaultSEO",
      title: "Default SEO",
      type: "object",
      fields: [
        { name: "title", title: "Title", type: "string" },
        { name: "description", title: "Description", type: "text" },
        { name: "ogImage", title: "OG Image", type: "reference", to: [{ type: "mediaAsset" }] },
      ],
    },
    { name: "footerText", title: "Footer Text", type: "text" },
  ],
};
