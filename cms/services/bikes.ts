import type { Bike } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { ALL_BIKES_QUERY } from "@/cms/queries/bike";
import { mapBike, type RawBike } from "@/cms/mappers/bike";
import { mockBikes } from "./mock-data";

// Sanity path when configured (see cms/sanity/client.ts), mock fallback
// otherwise — same signature either way, callers never change.
export async function getAllBikes(): Promise<Bike[]> {
  if (isSanityConfigured) {
    const raw = await sanityFetch<RawBike[]>(ALL_BIKES_QUERY);
    return raw.map(mapBike);
  }
  return mockBikes;
}
