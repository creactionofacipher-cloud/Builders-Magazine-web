import { cache } from "react";
import type { SiteSettings } from "@/types/content";
import { isSanityConfigured, sanityFetch } from "@/cms/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/cms/queries/siteSettings";
import { mapSiteSettings } from "@/cms/mappers/siteSettings";
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
// Sanity path when configured (see cms/sanity/client.ts), mock fallback
// otherwise — same signature either way, callers never change. Also
// falls back to mock if Sanity is configured but the singleton document
// doesn't exist yet (a freshly created project with no content entered) —
// every page depends on siteTitle for its own metadata, so a missing
// singleton should never mean a broken site.
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (isSanityConfigured) {
    const raw = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY);
    if (raw) {
      return mapSiteSettings(raw);
    }
  }
  return mockSiteSettings;
});
