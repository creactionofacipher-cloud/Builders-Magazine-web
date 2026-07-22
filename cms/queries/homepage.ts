import { layoutBlocksField } from "./layoutBlocks";

// Fetched by fixed _id (the conventional Sanity singleton pattern),
// same as SITE_SETTINGS_QUERY — see cms/schemas/homePage.ts.
export const HOMEPAGE_QUERY = `*[_id == "homePage"][0]{
  ${layoutBlocksField("blocks")}
}`;
