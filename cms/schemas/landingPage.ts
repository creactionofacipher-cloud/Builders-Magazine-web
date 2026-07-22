import type { SchemaTypeDefinition } from "./types";
import { layoutBlocks } from "./layoutBlocks";

// Mirrors studio/schemas/landingPage.ts. Collection (not a singleton) —
// see cms/queries/landingPage.ts.
export const landingPage: SchemaTypeDefinition = {
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "status", title: "Status", type: "string", options: { list: ["draft", "published"] } },
    { name: "blocks", title: "Blocks", type: "array", of: layoutBlocks },
  ],
};
