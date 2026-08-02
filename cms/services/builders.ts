import { cache } from "react";
import type { Builder } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { ALL_BUILDERS_QUERY } from "@/cms/queries/builder";
import { mapBuilder, type RawBuilder } from "@/cms/mappers/builder";
import { mockBuilders } from "./mock-data";

// Sanity path when configured (see cms/sanity/client.ts), mock fallback
// otherwise — same signature either way, callers never change. Wrapped
// in React's cache() so multiple call sites within the same render share
// one underlying fetch instead of each triggering its own (see
// cms/services/siteSettings.ts's getSiteSettings for the original
// precedent of this pattern).
export const getAllBuilders = cache(async (): Promise<Builder[]> => {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawBuilder[]>(ALL_BUILDERS_QUERY);
    return raw.map(mapBuilder);
  }
  return mockBuilders;
});
