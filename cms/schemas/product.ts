import type { SchemaTypeDefinition } from "./types";

export const product: SchemaTypeDefinition = {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    { name: "shortDescription", title: "Short Description", type: "string" },
    { name: "description", title: "Description", type: "array", of: [{ type: "block" }] },
    { name: "mainImage", title: "Main Image", type: "reference", to: [{ type: "mediaAsset" }] },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ name: "galleryImage", type: "reference", to: [{ type: "mediaAsset" }] }],
    },
    { name: "price", title: "Price", type: "number" },
    { name: "currency", title: "Currency", type: "string" },
    { name: "sizes", title: "Sizes", type: "array", of: [{ type: "string" }] },
    { name: "materials", title: "Materials", type: "string" },
    { name: "externalBuyUrl", title: "External Buy URL", type: "url" },
    { name: "status", title: "Status", type: "string", options: { list: ["draft", "published"] } },
  ],
};
