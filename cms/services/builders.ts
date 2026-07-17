import type { Builder } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { ALL_BUILDERS_QUERY } from "@/cms/queries/builder";
import { mapBuilder, type RawBuilder } from "@/cms/mappers/builder";
import { mockBuilders } from "./mock-data";

// Sanity path when configured (see cms/sanity/client.ts), mock fallback
// otherwise — same signature either way, callers never change.
export async function getAllBuilders(): Promise<Builder[]> {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawBuilder[]>(ALL_BUILDERS_QUERY);
    return raw.map(mapBuilder);
  }
  return mockBuilders;
}
