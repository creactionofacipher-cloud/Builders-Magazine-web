import type { BuildersCup } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { ALL_BUILDERS_CUP_QUERY, BUILDERS_CUP_BY_SLUG_QUERY } from "@/cms/queries/buildersCup";
import { mapBuildersCup, type RawBuildersCup } from "@/cms/mappers/buildersCup";
import { mockBuildersCupEvents } from "./mock-data";

function byDateDesc(a: BuildersCup, b: BuildersCup): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

// Sanity path when configured (see cms/sanity/client.ts), mock fallback
// otherwise — same signature either way, callers never change.

export async function getAllBuildersCupEvents(): Promise<BuildersCup[]> {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawBuildersCup[]>(ALL_BUILDERS_CUP_QUERY);
    return raw.map(mapBuildersCup);
  }
  return [...mockBuildersCupEvents].sort(byDateDesc);
}

export async function getBuildersCupEventBySlug(slug: string): Promise<BuildersCup | null> {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawBuildersCup | null>(BUILDERS_CUP_BY_SLUG_QUERY, { slug });
    return raw ? mapBuildersCup(raw) : null;
  }
  return mockBuildersCupEvents.find((event) => event.slug === slug) ?? null;
}
