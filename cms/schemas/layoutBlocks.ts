import type { SchemaArrayMember, SchemaField } from "./types";
import { portableTextBlocks } from "./portableTextBlocks";

// Mirrors studio/schemas/layoutBlocks.ts field-for-field (kept in sync
// manually, same as every other file in this directory — documentation
// only, never executed by this Next.js app). General-purpose block set,
// not homepage-specific: cms/schemas/homePage.ts is its first consumer.
export const STORY_GRID_LAYOUTS = ["2-columns", "3-columns", "editorial"];
export const SPACER_SIZES = ["sm", "md", "lg", "xl"];
export const STORY_DATA_SOURCES = ["manual", "automatic"];
export const STORY_SORT_ORDERS = ["newest", "oldest"];
export const STORY_CATEGORIES = ["Bike", "Builder", "Culture", "Interview", "Event"];
export const BLOCK_BACKGROUNDS = ["none", "surface", "custom"];
export const CONTAINER_WIDTHS = ["normal", "wide", "full"];
export const CTA_ALIGNMENTS = ["left", "center", "right"];
export const SOCIAL_PROVIDERS = ["instagram"];
export const DIVIDER_VARIANTS = ["line", "dot", "diamond", "label", "minimal"];

// Mirrors studio/schemas/layoutBlocks.ts's blockSettingsField — one
// shared nested `settings` object field, spread into every block below.
const blockSettingsField: SchemaField = {
  name: "settings",
  title: "Block Settings",
  type: "object",
  fields: [
    { name: "spacingTop", title: "Extra Spacing (Top)", type: "string", options: { list: SPACER_SIZES } },
    { name: "spacingBottom", title: "Extra Spacing (Bottom)", type: "string", options: { list: SPACER_SIZES } },
    { name: "background", title: "Background", type: "string", options: { list: BLOCK_BACKGROUNDS } },
    { name: "backgroundColor", title: "Background Color", type: "string" },
    { name: "containerWidth", title: "Container Width", type: "string", options: { list: CONTAINER_WIDTHS } },
    { name: "anchor", title: "Anchor ID", type: "string" },
  ],
};

export const layoutBlocks: SchemaArrayMember[] = [
  {
    name: "heroStory",
    title: "Hero Story",
    type: "object",
    fields: [
      { name: "story", title: "Story", type: "reference", to: [{ type: "story" }] },
      blockSettingsField,
    ],
  },
  {
    name: "storyGrid",
    title: "Story Grid",
    type: "object",
    fields: [
      { name: "title", title: "Title", type: "string" },
      { name: "layout", title: "Layout", type: "string", options: { list: STORY_GRID_LAYOUTS } },
      {
        name: "dataSource",
        title: "Data Source",
        type: "string",
        options: { list: STORY_DATA_SOURCES },
      },
      {
        name: "stories",
        title: "Stories",
        type: "array",
        of: [{ name: "storyRef", type: "reference", to: [{ type: "story" }] }],
      },
      { name: "category", title: "Category", type: "string", options: { list: STORY_CATEGORIES } },
      { name: "tag", title: "Tag", type: "string" },
      { name: "count", title: "Count", type: "number" },
      { name: "sort", title: "Sort", type: "string", options: { list: STORY_SORT_ORDERS } },
      blockSettingsField,
    ],
  },
  {
    name: "fullWidthPhoto",
    title: "Full Width Photo",
    type: "object",
    fields: [
      { name: "image", title: "Image", type: "reference", to: [{ type: "mediaAsset" }] },
      { name: "caption", title: "Caption", type: "string" },
      blockSettingsField,
    ],
  },
  {
    name: "quote",
    title: "Quote",
    type: "object",
    fields: [
      { name: "text", title: "Text", type: "text" },
      { name: "author", title: "Author", type: "string" },
      blockSettingsField,
    ],
  },
  {
    name: "featuredIssue",
    title: "Featured Issue",
    type: "object",
    fields: [
      { name: "issue", title: "Issue", type: "reference", to: [{ type: "issue" }], weak: true },
      blockSettingsField,
    ],
  },
  {
    name: "buildersCupHighlight",
    title: "Builders Cup",
    type: "object",
    fields: [
      { name: "event", title: "Event", type: "reference", to: [{ type: "buildersCup" }] },
      blockSettingsField,
    ],
  },
  {
    name: "merchandise",
    title: "Merchandise",
    type: "object",
    fields: [
      { name: "title", title: "Title", type: "string" },
      {
        name: "products",
        title: "Products",
        type: "array",
        of: [{ name: "productRef", type: "reference", to: [{ type: "product" }] }],
      },
      blockSettingsField,
    ],
  },
  {
    name: "spacer",
    title: "Spacer",
    type: "object",
    fields: [
      { name: "size", title: "Size", type: "string", options: { list: SPACER_SIZES } },
      blockSettingsField,
    ],
  },
  {
    name: "richText",
    title: "Rich Text",
    type: "object",
    fields: [
      { name: "content", title: "Content", type: "array", of: portableTextBlocks },
      blockSettingsField,
    ],
  },
  {
    name: "bikeSpotlight",
    title: "Bike Spotlight",
    type: "object",
    fields: [
      { name: "bike", title: "Bike", type: "reference", to: [{ type: "bike" }] },
      { name: "heading", title: "Custom Heading", type: "string" },
      { name: "ctaText", title: "CTA Text", type: "string" },
      { name: "ctaUrl", title: "CTA URL", type: "url" },
      blockSettingsField,
    ],
  },
  {
    name: "builderSpotlight",
    title: "Builder Spotlight",
    type: "object",
    fields: [
      { name: "builder", title: "Builder", type: "reference", to: [{ type: "builder" }] },
      { name: "heading", title: "Custom Heading", type: "string" },
      { name: "ctaText", title: "CTA Text", type: "string" },
      { name: "ctaUrl", title: "CTA URL", type: "url" },
      blockSettingsField,
    ],
  },
  {
    name: "cta",
    title: "CTA / Banner",
    type: "object",
    fields: [
      { name: "title", title: "Title", type: "string" },
      { name: "subtitle", title: "Subtitle", type: "string" },
      { name: "buttonText", title: "Button Text", type: "string" },
      { name: "buttonUrl", title: "Button URL", type: "string" },
      { name: "backgroundImage", title: "Background Image", type: "reference", to: [{ type: "mediaAsset" }] },
      { name: "backgroundColor", title: "Background Color", type: "string" },
      { name: "alignment", title: "Alignment", type: "string", options: { list: CTA_ALIGNMENTS } },
      { name: "overlay", title: "Dark Overlay", type: "boolean" },
      blockSettingsField,
    ],
  },
  {
    name: "socialFeed",
    title: "Social Feed",
    type: "object",
    fields: [
      { name: "title", title: "Section Title", type: "string" },
      { name: "provider", title: "Provider", type: "string", options: { list: SOCIAL_PROVIDERS } },
      { name: "count", title: "Count", type: "number" },
      { name: "profileUrl", title: "Follow Link", type: "url" },
      blockSettingsField,
    ],
  },
  {
    name: "editorialDivider",
    title: "Editorial Divider",
    type: "object",
    fields: [
      { name: "variant", title: "Variant", type: "string", options: { list: DIVIDER_VARIANTS } },
      { name: "label", title: "Label", type: "string" },
      { name: "spacing", title: "Spacing", type: "string", options: { list: SPACER_SIZES } },
      blockSettingsField,
    ],
  },
];
