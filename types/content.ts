// Mirrors docs/03_CONTENT_MODEL.md exactly, including fields not yet
// consumed by any MVP page (e.g. Person.slug, most of Bike/Builder),
// so the CMS integration milestone (10) requires no type changes.

import type { PortableTextBlock } from "@portabletext/types";

// Print-magazine-style rich text blocks beyond plain paragraphs/marks —
// shared by Story.content, Issue.description, and BuildersCup.description
// (see cms/schemas/portableTextBlocks.ts / studio/schemas/portableTextBlocks.ts,
// the single source of truth for which block types exist and their
// fields). Person.bio and Product.description also use RichText but their
// schemas only allow plain blocks — this union is a superset, not a claim
// that every RichText field can contain these.
export const RICH_TEXT_IMAGE_VARIANTS = ["inline", "wide", "fullWidth"] as const;
export type RichTextImageVariant = (typeof RICH_TEXT_IMAGE_VARIANTS)[number];

export interface RichTextImageBlock {
  _type: "richTextImage";
  _key: string;
  image?: MediaAsset;
  variant?: RichTextImageVariant;
}

export interface RichTextPullQuote {
  _type: "pullQuote";
  _key: string;
  text: string;
  attribution?: string;
}

export interface RichTextDivider {
  _type: "divider";
  _key: string;
}

// Provider is optional in the schema — the renderer (components/ui/Embed.tsx)
// auto-detects YouTube/Vimeo from the URL regardless, so an editor never has
// to set it correctly for the embed to work.
export const EMBED_PROVIDERS = ["youtube", "vimeo", "other"] as const;
export type EmbedProvider = (typeof EMBED_PROVIDERS)[number];

export interface RichTextEmbed {
  _type: "embed";
  _key: string;
  url: string;
  provider?: EmbedProvider;
}

// Advanced editorial layout blocks (docs: "advanced editorial image
// layouts for Rich Text"). Each has its own renderer component under
// components/ui/richtext/ — see RichText.tsx. Nested inside a
// twoColumnText (below), only the base block set is allowed — none of
// these four may nest inside each other or inside a twoColumnText.
export const IMAGE_ROW_LAYOUTS = ["equal", "2-1", "1-2", "large-left", "large-right"] as const;
export type ImageRowLayout = (typeof IMAGE_ROW_LAYOUTS)[number];

export const IMAGE_ROW_GAPS = ["small", "medium", "large"] as const;
export type ImageRowGap = (typeof IMAGE_ROW_GAPS)[number];

export interface RichTextImageRowBlock {
  _type: "imageRow";
  _key: string;
  images: MediaAsset[];
  layout?: ImageRowLayout;
  gap?: ImageRowGap;
  caption?: string;
}

export const IMAGE_TEXT_POSITIONS = ["left", "right"] as const;
export type ImageTextPosition = (typeof IMAGE_TEXT_POSITIONS)[number];

export const IMAGE_TEXT_WIDTHS = ["35%", "40%", "50%"] as const;
export type ImageTextWidth = (typeof IMAGE_TEXT_WIDTHS)[number];

// No dedicated text field — when textWrap is on, the image floats and
// whatever plain-paragraph blocks follow it elsewhere in the same
// RichText body wrap around it via CSS float (see RichText.tsx's
// flow-root container and RichTextImageText.tsx). Desktop only; always
// stacks full-width on mobile regardless of textWrap.
export interface RichTextImageTextBlock {
  _type: "imageText";
  _key: string;
  image?: MediaAsset;
  position?: ImageTextPosition;
  width?: ImageTextWidth;
  textWrap?: boolean;
}

// Caption comes from the referenced MediaAsset's own caption/copyright
// (see MediaAsset above) — no separate field, same as every other image
// block in this file. The image itself breaks out to the existing
// "fullWidth" breakout used by RichTextImageBlock's own fullWidth
// variant; the caption stays constrained to the normal reading column.
export interface RichTextFullBleedBlock {
  _type: "fullBleedImage";
  _key: string;
  image?: MediaAsset;
}

// Nested Portable Text, restricted Studio-side to the base block set
// (block/richTextImage/pullQuote/divider/embed — see
// studio/schemas/portableTextBlocks.ts's BASE_PORTABLE_TEXT_BLOCKS).
// Reuses the full RichText union here for simplicity rather than a
// separate narrower type; content that somehow contained one of the four
// blocks above just renders nothing for that entry (no matching handler
// in RichTextTwoColumns's nested PortableText components).
export interface RichTextTwoColumnTextBlock {
  _type: "twoColumnText";
  _key: string;
  content: RichText;
}

export type RichText = (
  | PortableTextBlock
  | RichTextImageBlock
  | RichTextPullQuote
  | RichTextDivider
  | RichTextEmbed
  | RichTextImageRowBlock
  | RichTextImageTextBlock
  | RichTextFullBleedBlock
  | RichTextTwoColumnTextBlock
)[];

export type PublishStatus = "draft" | "published";

export interface MediaAsset {
  id: string;
  url: string;
  width: number;
  height: number;
  caption?: string;
  author?: Person;
  copyright?: string;
  altText: string;
  relatedObject?: string;
}

// Const array (not just a union type) so it can also drive the category
// filter UI and validate the ?category= search param at runtime —
// mirrors the SUPPORTED_LOCALES/ENABLED_LOCALES pattern in lib/i18n/locales.ts.
export const STORY_CATEGORIES = ["Bike", "Builder", "Culture", "Interview", "Event"] as const;
export type StoryCategory = (typeof STORY_CATEGORIES)[number];

// Which block(s) of the About page's team section a Person shows up in.
// A person can belong to more than one (e.g. someone who is both on the
// core team and a photographer) — see cms/services/people.ts. Adding a
// new block later (the team grid is expected to grow) means adding one
// entry here plus the two schema mirrors (cms/schemas/person.ts,
// studio/schemas/person.ts) — no other code changes, same pattern as
// STORY_CATEGORIES above.
export const PERSON_GROUPS = ["Команда", "Фотографы"] as const;
export type PersonGroup = (typeof PERSON_GROUPS)[number];

export interface Person {
  id: string;
  slug: string;
  name: string;
  role: string;
  photo?: MediaAsset;
  bio?: RichText;
  groups?: PersonGroup[];
  articles?: Story[];
}

export interface Builder {
  id: string;
  slug: string;
  name: string;
  location?: string;
  bio?: RichText;
  socialLinks?: Record<string, string>;
  projects?: Bike[];
  stories?: Story[];
}

export interface Bike {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  model?: string;
  year?: number;
  style?: string;
  engine?: string;
  description?: RichText;
  specifications?: Record<string, string>;
  images: MediaAsset[];
  builder?: Builder;
  stories?: Story[];
  issues?: Issue[];
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  coverImage: MediaAsset;
  shortDescription: string;
  content: RichText;
  category: StoryCategory;
  author?: Person;
  publishedDate: string;
  issue?: Issue;
  gallery?: MediaAsset[];
  relatedBike?: Bike[];
  relatedBuilder?: Builder[];
  status: PublishStatus;
}

export interface Issue {
  id: string;
  slug: string;
  number: number;
  year: number;
  title: string;
  coverImage: MediaAsset;
  description?: RichText;
  releaseDate: string;
  advertisers?: string[];
  buyLinks?: { label: string; url: string }[];
  status: PublishStatus;
  featuredStories?: Story[];
  gallery?: MediaAsset[];
}

export interface BuildersCup {
  id: string;
  slug: string;
  name: string;
  date: string;
  location?: string;
  description?: RichText;
  coverImage: MediaAsset;
  gallery?: MediaAsset[];
  participants?: Bike[];
  winners?: Bike[];
  stories?: Story[];
}

// Singleton (not a collection) — docs/10_POST_MVP.md: "Create Site
// Settings singleton in Sanity." Only one document of this shape exists.
export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  mission: string;
  philosophy: string;
  contacts: {
    email: string;
    city?: string;
  };
  cooperation: string;
  // Not consumed by any UI yet — no social links section exists on the
  // site. Populated in mock data anyway per the project's existing
  // practice of mirroring the full content model ahead of the UI that
  // will use it.
  socialLinks?: { label: string; url: string }[];
  // The single source of truth for site-wide SEO configuration (see
  // app/layout.tsx and lib/seo/*.ts) — every page still defines its own
  // title/description/openGraph/etc (see each route's own
  // generateMetadata), but whatever a page *doesn't* specify falls back
  // to these values via Next.js's normal parent/child metadata merging,
  // rather than being duplicated as a hardcoded literal in every page.
  defaultSEO?: {
    title: string;
    description: string;
    // Same string array shape Next.js's own `Metadata.keywords` expects
    // — see lib/seo/keywords.ts, which combines this with any
    // page-specific keywords a route wants to add later.
    keywords?: string[];
    ogImage?: MediaAsset;
    favicon?: MediaAsset;
    // Falls back to `ogImage` when unset (see app/layout.tsx) rather
    // than requiring every project to upload a second near-identical
    // image just to have *a* Twitter image.
    twitterImage?: MediaAsset;
    // Raw `<meta name="robots">` content (e.g. "index, follow") — a
    // plain string field in Sanity rather than a structured toggle set,
    // since Next.js's `Metadata.robots` accepts a string directly and
    // this covers the MVP need (global default, per-page override via
    // the page's own `robots` key — see app/[locale]/search/page.tsx
    // for an example of a page that already overrides it).
    robots?: string;
    // Distinct from `siteTitle` on purpose: this is specifically what
    // OpenGraph/Twitter/JSON-LD should call the site (falls back to
    // siteTitle when unset), not necessarily identical to the
    // editorial/branding title used elsewhere.
    siteName?: string;
  };
  footerText: string;
}

// Product catalog entity — docs/03_CONTENT_MODEL.md's Scalability
// section names "Product" as a future addition without a field list;
// this is that field list, scoped to catalog presentation only. No
// cart/checkout/stock fields — external-link purchase only, per
// docs/10_POST_MVP.md Phase 3 (Shop is still post-MVP).
export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: RichText;
  shortDescription: string;
  mainImage: MediaAsset;
  gallery?: MediaAsset[];
  price: number;
  currency: string;
  sizes?: string[];
  materials?: string;
  externalBuyUrl: string;
  status: PublishStatus;
}
