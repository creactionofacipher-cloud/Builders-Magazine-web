import { cache } from "react";
import type { HomePage } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { HOMEPAGE_QUERY } from "@/cms/queries/homepage";
import { mapHomePage, type RawHomePage } from "@/cms/mappers/homepage";
import { resolveDynamicBlocks } from "./layoutBlocks";
import { mockHomePage } from "./mock-data";

// Singleton — one document, not a collection. Same cache()-wrapped,
// mock/Sanity dual-fallback shape as getSiteSettings (cms/services/siteSettings.ts):
// mock when Sanity isn't configured, and also when it is configured but
// no "homePage" document has been created yet, so a fresh project never
// renders a blank homepage. resolveDynamicBlocks() fills in any
// query-driven blocks (Story Grid in automatic mode, Social Feed) after
// the plain mapper/mock data is in hand, on both paths equally.
export const getHomepage = cache(async (): Promise<HomePage> => {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawHomePage | null>(HOMEPAGE_QUERY);
    if (raw) {
      const homepage = mapHomePage(raw);
      return { ...homepage, blocks: await resolveDynamicBlocks(homepage.blocks) };
    }
  }
  return { ...mockHomePage, blocks: await resolveDynamicBlocks(mockHomePage.blocks) };
});
