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

export type RichText = (
  | PortableTextBlock
  | RichTextImageBlock
  | RichTextPullQuote
  | RichTextDivider
  | RichTextEmbed
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
  // Not consumed yet either — per-page metadata is currently
  // self-contained (see each route's own generateMetadata). Reserved for
  // Milestone 11 (SEO) as the site-wide fallback.
  defaultSEO?: {
    title: string;
    description: string;
    ogImage?: MediaAsset;
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
