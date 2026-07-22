import { defineField, defineType } from "sanity";
import { layoutBlocks } from "./layoutBlocks";

// Singleton, not a collection — the document is created with
// _id: "homePage" (see cms/queries/homepage.ts and studio/structure.ts's
// pinned entry), the same conventional Sanity singleton pattern as
// siteSettings. The homepage as a "magazine spread": editors compose it
// as a freely reorderable sequence of Layout Blocks (layoutBlocks.ts) —
// this schema itself has no opinion about which blocks exist or what
// order they're in.
export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "blocks",
      title: "Blocks",
      type: "array",
      of: layoutBlocks,
    }),
  ],
  // No title/name field exists on this singleton for Sanity's default
  // preview logic to pick up, so without this it falls back to
  // stringifying the blocks array itself (e.g. "blocks: [{story: ...},
  // ...]") as the document title everywhere it's listed — the content
  // list, search, references. A fixed title is correct here: there's
  // only ever one Home Page document.
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
