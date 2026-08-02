import { cache } from "react";
import type { LandingPage } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { ALL_LANDING_PAGES_QUERY, LANDING_PAGE_BY_SLUG_QUERY } from "@/cms/queries/landingPage";
import { mapLandingPage, type RawLandingPage } from "@/cms/mappers/landingPage";
import { resolveDynamicBlocks } from "./layoutBlocks";
import { mockLandingPages } from "./mock-data";

// Both wrapped in React's cache() so multiple call sites within the same
// render (a page's generateMetadata() plus its page body — confirmed
// app/[locale]/p/[slug]/page.tsx calls getLandingPageBySlug from both)
// share one underlying fetch instead of each triggering its own (see
// cms/services/siteSettings.ts's getSiteSettings for the original
// precedent of this pattern) — this isn't limited to singletons like
// getSiteSettings/getHomepage, any function called more than once per
// render benefits equally.
// Mirrors the Sanity path's PUBLISHED_FILTER (cms/queries/landingPage.ts) —
// an untouched status field is treated as visible, only an explicit
// "draft" hides it.
function isPublished(page: LandingPage): boolean {
  return page.status !== "draft";
}

export const getLandingPages = cache(async (): Promise<LandingPage[]> => {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawLandingPage[]>(ALL_LANDING_PAGES_QUERY);
    return raw.map(mapLandingPage);
  }
  return mockLandingPages.filter(isPublished);
});

export const getLandingPageBySlug = cache(async (slug: string): Promise<LandingPage | null> => {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawLandingPage | null>(LANDING_PAGE_BY_SLUG_QUERY, { slug });
    if (!raw) return null;
    const page = mapLandingPage(raw);
    return { ...page, blocks: await resolveDynamicBlocks(page.blocks) };
  }
  const page = mockLandingPages.find((p) => p.slug === slug);
  if (!page || !isPublished(page)) return null;
  return { ...page, blocks: await resolveDynamicBlocks(page.blocks) };
});
