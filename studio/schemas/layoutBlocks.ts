import { defineArrayMember, defineField } from "sanity";
import { portableTextBlocks } from "./portableTextBlocks";
import { horizontalImageStripPreview } from "../components/previews/HorizontalImageStripPreview";

// General-purpose, reusable editorial composition system — not specific
// to the homepage. `layoutBlocks` is the `of:` value for any document's
// own `blocks` array field (see studio/schemas/homePage.ts, its first
// consumer); a future landing page / Builders Cup promo page / digital
// issue schema reuses this exact same array with zero duplication.
// Mirrors the structure of studio/schemas/portableTextBlocks.ts (this
// codebase's existing precedent for "a shared block set used by more
// than one field/schema").
//
// GROQ-side resolution: cms/queries/layoutBlocks.ts's layoutBlocksField().
// App-side types: types/content.ts's LayoutBlock union.
export const STORY_GRID_LAYOUTS = ["2-columns", "3-columns", "editorial"];
export const SPACER_SIZES = ["sm", "md", "lg", "xl"];
export const STORY_DATA_SOURCES = ["manual", "automatic"];
export const STORY_SORT_ORDERS = ["newest", "oldest"];
// Mirrors types/content.ts's STORY_CATEGORIES (also duplicated in
// studio/schemas/story.ts for the same reason — kept in sync manually).
export const STORY_CATEGORIES = ["Bike", "Builder", "Culture", "Interview", "Event"];
export const BLOCK_BACKGROUNDS = ["none", "surface", "custom"];
export const CONTAINER_WIDTHS = ["normal", "wide", "full"];
export const CTA_ALIGNMENTS = ["left", "center", "right"];
export const SOCIAL_PROVIDERS = ["instagram"];
export const DIVIDER_VARIANTS = ["line", "dot", "diamond", "label", "minimal"];
export const HORIZONTAL_IMAGE_STRIP_HEIGHTS = ["small", "medium", "large"];
export const HORIZONTAL_IMAGE_STRIP_GAPS = ["none", "small", "medium", "large"];

// Generic overrides available on every block (types/content.ts's
// BlockSettings) — one shared field definition, spread into every block
// member's `fields` below, rather than duplicated per block. A single
// nested `object` field (not a top-level fieldset) so its shape mirrors
// BlockSettings exactly and needs no GROQ change — the layoutBlocksField()
// leading `...` already passes any plain nested object through unchanged.
// Collapsed by default to stay out of the way of each block's own
// primary fields.
const blockSettingsField = defineField({
  name: "settings",
  title: "Block Settings",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "spacingTop",
      title: "Extra Spacing (Top)",
      type: "string",
      options: { list: SPACER_SIZES },
    }),
    defineField({
      name: "spacingBottom",
      title: "Extra Spacing (Bottom)",
      type: "string",
      options: { list: SPACER_SIZES },
    }),
    defineField({
      name: "background",
      title: "Background",
      type: "string",
      options: { list: BLOCK_BACKGROUNDS },
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      description: 'Hex color (e.g. #1a1a1a) — only used when Background is "Custom".',
      type: "string",
      hidden: ({ parent }) => parent?.background !== "custom",
    }),
    defineField({
      name: "containerWidth",
      title: "Container Width",
      type: "string",
      options: { list: CONTAINER_WIDTHS },
    }),
    defineField({
      name: "anchor",
      title: "Anchor ID",
      description: "Optional — lets a CTA button elsewhere link directly here via #anchor.",
      type: "string",
    }),
  ],
});

export const layoutBlocks = [
  defineArrayMember({
    name: "heroStory",
    title: "Hero Story",
    type: "object",
    fields: [
      defineField({ name: "story", title: "Story", type: "reference", to: [{ type: "story" }] }),
      blockSettingsField,
    ],
    preview: {
      select: { title: "story.title" },
      prepare: ({ title }) => ({ title: "Hero Story", subtitle: title || "No story selected" }),
    },
  }),
  defineArrayMember({
    name: "storyGrid",
    title: "Story Grid",
    type: "object",
    fields: [
      defineField({ name: "title", title: "Title", type: "string" }),
      defineField({
        name: "layout",
        title: "Layout",
        type: "string",
        options: { list: STORY_GRID_LAYOUTS },
        initialValue: "3-columns",
      }),
      defineField({
        name: "dataSource",
        title: "Data Source",
        description: "Manual: pick stories yourself. Automatic: query by category/tag.",
        type: "string",
        options: { list: STORY_DATA_SOURCES },
        initialValue: "manual",
      }),
      defineField({
        name: "stories",
        title: "Stories",
        type: "array",
        of: [defineArrayMember({ name: "storyRef", type: "reference", to: [{ type: "story" }] })],
        // Same story picked twice in one grid renders the same card twice
        // side by side — always an authoring mistake, never intentional.
        validation: (Rule) => Rule.unique(),
        hidden: ({ parent }) => parent?.dataSource === "automatic",
      }),
      defineField({
        name: "category",
        title: "Category",
        description: "Automatic mode only. Leave unset to include every category.",
        type: "string",
        options: { list: STORY_CATEGORIES },
        hidden: ({ parent }) => parent?.dataSource !== "automatic",
      }),
      defineField({
        name: "tag",
        title: "Tag",
        description: "Automatic mode only. Leave unset to not filter by tag.",
        type: "string",
        hidden: ({ parent }) => parent?.dataSource !== "automatic",
      }),
      defineField({
        name: "count",
        title: "Count",
        description: "Automatic mode only — how many stories to show.",
        type: "number",
        initialValue: 6,
        hidden: ({ parent }) => parent?.dataSource !== "automatic",
      }),
      defineField({
        name: "sort",
        title: "Sort",
        description: "Automatic mode only.",
        type: "string",
        options: { list: STORY_SORT_ORDERS },
        initialValue: "newest",
        hidden: ({ parent }) => parent?.dataSource !== "automatic",
      }),
      blockSettingsField,
    ],
    preview: {
      select: { title: "title", count: "stories.length", dataSource: "dataSource" },
      prepare: ({ title, count, dataSource }) => ({
        title: title || "Story Grid",
        subtitle:
          dataSource === "automatic" ? "Automatic (query-driven)" : `${count || 0} stories`,
      }),
    },
  }),
  defineArrayMember({
    name: "fullWidthPhoto",
    title: "Full Width Photo",
    type: "object",
    fields: [
      defineField({
        name: "image",
        title: "Image",
        type: "reference",
        to: [{ type: "mediaAsset" }],
      }),
      defineField({ name: "caption", title: "Caption", type: "string" }),
      blockSettingsField,
    ],
    preview: {
      select: { title: "caption" },
      prepare: ({ title }) => ({ title: "Full Width Photo", subtitle: title }),
    },
  }),
  defineArrayMember({
    name: "quote",
    title: "Quote",
    type: "object",
    fields: [
      defineField({
        name: "text",
        title: "Text",
        type: "text",
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: "author", title: "Author", type: "string" }),
      blockSettingsField,
    ],
    preview: {
      select: { title: "text", subtitle: "author" },
    },
  }),
  defineArrayMember({
    name: "featuredIssue",
    title: "Featured Issue",
    type: "object",
    fields: [
      // Weak: a Featured Issue block shouldn't block deleting the Issue
      // it highlights. Unlike Story.issue/Bike.issues, this field IS
      // dereferenced (cms/queries/layoutBlocks.ts's layoutBlocksField())
      // — but cms/mappers/layoutBlocks.ts's featuredIssue case already
      // treats a null `issue` (a dangling weak reference, e.g. after the
      // target Issue is deleted) the same as "no issue selected yet",
      // and FeaturedIssueBlock.tsx already renders nothing in that case
      // — no additional defensive code needed for this to be safe.
      defineField({
        name: "issue",
        title: "Issue",
        type: "reference",
        to: [{ type: "issue" }],
        weak: true,
      }),
      blockSettingsField,
    ],
    preview: {
      select: { title: "issue.title" },
      prepare: ({ title }) => ({ title: "Featured Issue", subtitle: title || "No issue selected" }),
    },
  }),
  defineArrayMember({
    name: "buildersCupHighlight",
    title: "Builders Cup",
    type: "object",
    fields: [
      defineField({
        name: "event",
        title: "Event",
        type: "reference",
        to: [{ type: "buildersCup" }],
      }),
      blockSettingsField,
    ],
    preview: {
      select: { title: "event.name" },
      prepare: ({ title }) => ({ title: "Builders Cup", subtitle: title || "No event selected" }),
    },
  }),
  defineArrayMember({
    name: "merchandise",
    title: "Merchandise",
    type: "object",
    fields: [
      defineField({ name: "title", title: "Title", type: "string" }),
      defineField({
        name: "products",
        title: "Products",
        type: "array",
        of: [
          defineArrayMember({ name: "productRef", type: "reference", to: [{ type: "product" }] }),
        ],
        validation: (Rule) => Rule.unique(),
      }),
      blockSettingsField,
    ],
    preview: {
      select: { title: "title", count: "products.length" },
      prepare: ({ title, count }) => ({
        title: title || "Merchandise",
        subtitle: `${count || 0} products`,
      }),
    },
  }),
  defineArrayMember({
    name: "spacer",
    title: "Spacer",
    type: "object",
    fields: [
      defineField({
        name: "size",
        title: "Size",
        type: "string",
        options: { list: SPACER_SIZES },
        initialValue: "md",
      }),
      blockSettingsField,
    ],
    preview: {
      select: { title: "size" },
      prepare: ({ title }) => ({ title: "Spacer", subtitle: title }),
    },
  }),
  defineArrayMember({
    name: "richText",
    title: "Rich Text",
    type: "object",
    fields: [
      defineField({ name: "content", title: "Content", type: "array", of: portableTextBlocks }),
      blockSettingsField,
    ],
    preview: {
      select: { first: "content.0" },
      prepare: () => ({ title: "Rich Text" }),
    },
  }),
  defineArrayMember({
    name: "bikeSpotlight",
    title: "Bike Spotlight",
    type: "object",
    fields: [
      defineField({ name: "bike", title: "Bike", type: "reference", to: [{ type: "bike" }] }),
      defineField({ name: "heading", title: "Custom Heading", type: "string" }),
      defineField({ name: "ctaText", title: "CTA Text", type: "string" }),
      defineField({ name: "ctaUrl", title: "CTA URL", type: "url" }),
      blockSettingsField,
    ],
    preview: {
      select: { title: "bike.name" },
      prepare: ({ title }) => ({ title: "Bike Spotlight", subtitle: title || "No bike selected" }),
    },
  }),
  defineArrayMember({
    name: "builderSpotlight",
    title: "Builder Spotlight",
    type: "object",
    fields: [
      defineField({
        name: "builder",
        title: "Builder",
        type: "reference",
        to: [{ type: "builder" }],
      }),
      defineField({ name: "heading", title: "Custom Heading", type: "string" }),
      defineField({ name: "ctaText", title: "CTA Text", type: "string" }),
      defineField({ name: "ctaUrl", title: "CTA URL", type: "url" }),
      blockSettingsField,
    ],
    preview: {
      select: { title: "builder.name" },
      prepare: ({ title }) => ({
        title: "Builder Spotlight",
        subtitle: title || "No builder selected",
      }),
    },
  }),
  defineArrayMember({
    name: "cta",
    title: "CTA / Banner",
    type: "object",
    fields: [
      defineField({
        name: "title",
        title: "Title",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
      defineField({
        name: "buttonText",
        title: "Button Text",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "buttonUrl",
        title: "Button URL",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "backgroundImage",
        title: "Background Image",
        type: "reference",
        to: [{ type: "mediaAsset" }],
      }),
      defineField({
        name: "backgroundColor",
        title: "Background Color",
        description: "Hex color, used when no background image is set.",
        type: "string",
      }),
      defineField({
        name: "alignment",
        title: "Alignment",
        type: "string",
        options: { list: CTA_ALIGNMENTS },
        initialValue: "center",
      }),
      defineField({
        name: "overlay",
        title: "Dark Overlay",
        description: "Adds a dark overlay over the background image for text legibility.",
        type: "boolean",
        initialValue: false,
      }),
      blockSettingsField,
    ],
    preview: {
      select: { title: "title", subtitle: "buttonText" },
      prepare: ({ title, subtitle }) => ({ title: title || "CTA / Banner", subtitle }),
    },
  }),
  defineArrayMember({
    name: "socialFeed",
    title: "Social Feed",
    type: "object",
    fields: [
      defineField({ name: "title", title: "Section Title", type: "string" }),
      defineField({
        name: "provider",
        title: "Provider",
        type: "string",
        options: { list: SOCIAL_PROVIDERS },
        initialValue: "instagram",
      }),
      defineField({ name: "count", title: "Count", type: "number", initialValue: 6 }),
      defineField({
        name: "profileUrl",
        title: "Follow Link",
        description: 'Where the "Follow on ..." button points — the provider\'s own API has no reliable way to supply this, so it\'s set by hand.',
        type: "url",
      }),
      blockSettingsField,
    ],
    preview: {
      select: { title: "title", provider: "provider" },
      prepare: ({ title, provider }) => ({
        title: title || "Social Feed",
        subtitle: provider || "instagram",
      }),
    },
  }),
  defineArrayMember({
    name: "editorialDivider",
    title: "Editorial Divider",
    type: "object",
    fields: [
      defineField({
        name: "variant",
        title: "Variant",
        type: "string",
        options: { list: DIVIDER_VARIANTS },
        initialValue: "line",
      }),
      defineField({
        name: "label",
        title: "Label",
        description: 'Only used by the "Label" variant.',
        type: "string",
        hidden: ({ parent }) => parent?.variant !== "label",
      }),
      defineField({
        name: "spacing",
        title: "Spacing",
        type: "string",
        options: { list: SPACER_SIZES },
        initialValue: "md",
      }),
      blockSettingsField,
    ],
    preview: {
      select: { title: "variant" },
      prepare: ({ title }) => ({ title: "Editorial Divider", subtitle: title }),
    },
  }),
  defineArrayMember({
    name: "horizontalImageStrip",
    title: "Horizontal Image Strip",
    description: "A full-width, horizontally scrollable strip of 2–30 photographs.",
    type: "object",
    fields: [
      defineField({
        name: "images",
        title: "Images",
        type: "array",
        of: [{ type: "reference", to: [{ type: "mediaAsset" }] }],
        validation: (Rule) => Rule.min(2).max(30).required(),
      }),
      defineField({ name: "title", title: "Title", type: "string" }),
      defineField({ name: "caption", title: "Caption", type: "string" }),
      defineField({
        name: "imageHeight",
        title: "Image Height",
        type: "string",
        options: { list: HORIZONTAL_IMAGE_STRIP_HEIGHTS },
        initialValue: "medium",
      }),
      defineField({
        name: "gap",
        title: "Gap",
        type: "string",
        options: { list: HORIZONTAL_IMAGE_STRIP_GAPS },
        initialValue: "medium",
      }),
      defineField({
        name: "showCaptions",
        title: "Show Captions",
        description: "Shows each image's own caption underneath it as you scroll.",
        type: "boolean",
        initialValue: false,
      }),
      defineField({
        name: "showScrollbar",
        title: "Show Scrollbar",
        type: "boolean",
        initialValue: true,
      }),
      blockSettingsField,
    ],
    preview: horizontalImageStripPreview,
  }),
];
