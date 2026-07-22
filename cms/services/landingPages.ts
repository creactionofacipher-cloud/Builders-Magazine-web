import type { LandingPage } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { ALL_LANDING_PAGES_QUERY, LANDING_PAGE_BY_SLUG_QUERY } from "@/cms/queries/landingPage";
import { mapLandingPage, type RawLandingPage } from "@/cms/mappers/landingPage";
import { resolveDynamicBlocks } from "./layoutBlocks";
import { mockLandingPages } from "./mock-data";

// Collection, not a singleton — same mock/Sanity dual-path shape as
// cms/services/stories.ts, no cache() wrapper needed (that's only used
// where the same singleton gets fetched from more than one call site per
// render, e.g. getSiteSettings/getHomepage). Only used for slug
// enumeration (sitemap.ts, generateStaticParams) — never rendered
// directly — so blocks are left un-resolved here; getLandingPageBySlug
// below is the one that actually renders a page's blocks.
export async function getLandingPages(): Promise<LandingPage[]> {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawLandingPage[]>(ALL_LANDING_PAGES_QUERY);
    return raw.map(mapLandingPage);
  }
  return mockLandingPages;
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawLandingPage | null>(LANDING_PAGE_BY_SLUG_QUERY, { slug });
    if (!raw) return null;
    const page = mapLandingPage(raw);
    return { ...page, blocks: await resolveDynamicBlocks(page.blocks) };
  }
  const page = mockLandingPages.find((p) => p.slug === slug);
  if (!page) return null;
  return { ...page, blocks: await resolveDynamicBlocks(page.blocks) };
}
