import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { structure } from "./structure";

// Document types with exactly one fixed-ID instance (see structure.ts).
const SINGLETON_TYPES = new Set(["siteSettings"]);

export default defineConfig({
  name: "default",
  title: "Builders Magazine",

  projectId: "l1slax0i",
  dataset: "production",

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Singletons are only reachable through their fixed-ID entry in
    // structure.ts, not the global "create new document" menu.
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter((template) => !SINGLETON_TYPES.has(template.templateId));
      }
      return prev;
    },
    // A singleton can't be duplicated (would recreate this exact bug) or
    // deleted (every page depends on it existing).
    actions: (prev, { schemaType }) => {
      if (SINGLETON_TYPES.has(schemaType)) {
        return prev.filter(({ action }) => action !== "duplicate" && action !== "delete");
      }
      return prev;
    },
  },
});
