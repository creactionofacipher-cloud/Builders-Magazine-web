import type { SchemaTypeDefinition } from "./types";
import { layoutBlocks } from "./layoutBlocks";

// Mirrors studio/schemas/homePage.ts. Singleton — see cms/schemas/siteSettings.ts's
// comment for the fixed-_id convention this assumes (_id: "homePage",
// see cms/queries/homepage.ts).
export const homePage: SchemaTypeDefinition = {
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [{ name: "blocks", title: "Blocks", type: "array", of: layoutBlocks }],
};
