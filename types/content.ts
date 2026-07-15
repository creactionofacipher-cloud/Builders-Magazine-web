// Mirrors docs/03_CONTENT_MODEL.md exactly, including fields not yet
// consumed by any MVP page (e.g. Person.slug, most of Bike/Builder),
// so the CMS integration milestone (10) requires no type changes.

import type { PortableTextBlock } from "@portabletext/types";

export type RichText = PortableTextBlock[];

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

export interface Person {
  id: string;
  slug: string;
  name: string;
  role: string;
  photo?: MediaAsset;
  bio?: RichText;
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
