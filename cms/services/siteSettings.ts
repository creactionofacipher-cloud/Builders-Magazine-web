import { cache } from "react";
import type { SiteSettings } from "@/types/content";
import { mockSiteSettings } from "./mock-data";

// Singleton — one document, not a collection.
//
// Wrapped in React's cache() so multiple call sites within the same
// render (a route's generateMetadata() plus its page body, or the root
// layout plus the locale layout) share one underlying fetch instead of
// each triggering its own. This is what keeps per-page siteName/siteTitle
// lookups cheap: pages call getSiteSettings() directly wherever they need
// it rather than threading it down as a prop, without turning that into
// a real duplicate fetch. See the architecture note in
// app/[locale]/layout.tsx for the full reasoning.
//
// Mock implementation now; Milestone 10 replaces the body with a Sanity
// fetch behind this same signature and cache() continues to dedupe it
// exactly the same way. Callers never change either way.
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return mockSiteSettings;
});
