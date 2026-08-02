import { cache } from "react";
import type { BuildersCup } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { ALL_BUILDERS_CUP_QUERY, BUILDERS_CUP_BY_SLUG_QUERY } from "@/cms/queries/buildersCup";
import { mapBuildersCup, type RawBuildersCup } from "@/cms/mappers/buildersCup";
import { mockBuildersCupEvents } from "./mock-data";

function byDateDesc(a: BuildersCup, b: BuildersCup): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

// Sanity path when configured (see cms/sanity/client.ts), mock fallback
// otherwise — same signature either way, callers never change. Both
// wrapped in React's cache() so multiple call sites within the same
// render (e.g. a detail page's generateMetadata() plus its page body)
// share one underlying fetch instead of each triggering its own (see
// cms/services/siteSettings.ts's getSiteSettings for the original
// precedent of this pattern).

export const getAllBuildersCupEvents = cache(async (): Promise<BuildersCup[]> => {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawBuildersCup[]>(ALL_BUILDERS_CUP_QUERY);
    return raw.map(mapBuildersCup);
  }
  return [...mockBuildersCupEvents].sort(byDateDesc);
});

export const getBuildersCupEventBySlug = cache(
  async (slug: string): Promise<BuildersCup | null> => {
    if (isSanityConfigured) {
      const raw = await sanityFetch<RawBuildersCup | null>(BUILDERS_CUP_BY_SLUG_QUERY, { slug });
      return raw ? mapBuildersCup(raw) : null;
    }
    return mockBuildersCupEvents.find((event) => event.slug === slug) ?? null;
  },
);
