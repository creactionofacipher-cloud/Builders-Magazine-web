import { defineField, defineType } from "sanity";
import { layoutBlocks } from "./layoutBlocks";

// A collection (not a singleton, unlike homePage) — any number of these
// can exist, each reachable at /ru/p/[slug]. Second consumer of the
// reusable Layout Blocks system (layoutBlocks.ts): standalone promo/
// campaign pages composed the same way HomePage is, without any of that
// system needing to change.
export default defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["draft", "published"] },
    }),
    defineField({
      name: "blocks",
      title: "Blocks",
      type: "array",
      of: layoutBlocks,
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({
      title: title || "Untitled",
      subtitle: slug ? `/ru/p/${slug}` : undefined,
    }),
  },
});
