import type { SchemaTypeDefinition } from "./types";
import { gallerySettingsField } from "./gallerySettings";

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
    gallerySettingsField,
    { name: "price", title: "Price", type: "number" },
    // Required + defaults to "RUB" in studio/schemas/product.ts — that
    // needs the real Rule-builder API (a function, not plain data), which
    // this lightweight type intentionally doesn't model. See types.ts.
    {
      name: "currency",
      title: "Currency",
      type: "string",
      options: { list: ["RUB", "USD", "EUR"] },
    },
    { name: "sizes", title: "Sizes", type: "array", of: [{ type: "string" }] },
    { name: "materials", title: "Materials", type: "string" },
    { name: "externalBuyUrl", title: "External Buy URL", type: "url" },
    { name: "status", title: "Status", type: "string", options: { list: ["draft", "published"] } },
  ],
};
