import { cache } from "react";
import type { Bike } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { ALL_BIKES_QUERY } from "@/cms/queries/bike";
import { mapBike, type RawBike } from "@/cms/mappers/bike";
import { mockBikes } from "./mock-data";

// Sanity path when configured (see cms/sanity/client.ts), mock fallback
// otherwise — same signature either way, callers never change. Wrapped
// in React's cache() so multiple call sites within the same render share
// one underlying fetch instead of each triggering its own (see
// cms/services/siteSettings.ts's getSiteSettings for the original
// precedent of this pattern).
export const getAllBikes = cache(async (): Promise<Bike[]> => {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawBike[]>(ALL_BIKES_QUERY);
    return raw.map(mapBike);
  }
  return mockBikes;
});
