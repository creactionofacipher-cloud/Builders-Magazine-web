import { defineField } from "sanity";

// Reusable "how should this document's Gallery field render" sub-object —
// shared by story.ts, issue.ts, product.ts, buildersCup.ts, one
// definition so the four schemas can never drift out of sync (same
// pattern as layoutBlocks.ts's own blockSettingsField: a shared field
// constant, not a registered Sanity type). Purely additive: documents
// authored before this field existed simply lack `gallerySettings`,
// which the frontend (components/ui/Gallery.tsx) treats as
// `layout: "grid"` — today's exact, only behavior. Zero migration
// required.
export const GALLERY_LAYOUTS = ["grid", "strip"];
export const GALLERY_HEIGHTS = ["small", "medium", "large"];
export const GALLERY_GAPS = ["none", "small", "medium", "large"];

export const gallerySettingsField = defineField({
  name: "gallerySettings",
  title: "Gallery Display",
  // Sanity doesn't surface a computed preview.prepare() subtitle on a
  // plain (non-array-member) object field's collapsed header — verified
  // live in Studio — so this static description covers the same "what
  // is this" need at a glance; the preview below is kept for any Studio
  // surface (e.g. search results) that does support it.
  description: 'Defaults to Grid. Switch to "Image Strip" to reveal the strip-specific settings below.',
  type: "object",
  options: { collapsible: true, collapsed: true },
  preview: {
    select: { layout: "layout" },
    prepare({ layout }: { layout?: string }) {
      return {
        title: "Gallery Display",
        subtitle: layout === "strip" ? "Gallery • Image Strip" : "Gallery • Grid",
      };
    },
  },
  fields: [
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: { list: GALLERY_LAYOUTS },
      initialValue: "grid",
    }),
    defineField({
      name: "imageHeight",
      title: "Image Height",
      type: "string",
      options: { list: GALLERY_HEIGHTS },
      initialValue: "medium",
      hidden: ({ parent }) => parent?.layout !== "strip",
    }),
    defineField({
      name: "gap",
      title: "Gap",
      type: "string",
      options: { list: GALLERY_GAPS },
      initialValue: "medium",
      hidden: ({ parent }) => parent?.layout !== "strip",
    }),
    defineField({
      name: "showCaptions",
      title: "Show Captions",
      type: "boolean",
      initialValue: false,
      hidden: ({ parent }) => parent?.layout !== "strip",
    }),
    defineField({
      name: "showScrollbar",
      title: "Show Scrollbar",
      type: "boolean",
      initialValue: true,
      hidden: ({ parent }) => parent?.layout !== "strip",
    }),
  ],
});
