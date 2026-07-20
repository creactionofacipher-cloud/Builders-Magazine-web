import type { SiteSettings } from "@/types/content";

// Combines Site Settings' default keywords with a page's own additions,
// deduplicated — so a route that wants extra keywords only ever lists
// what's specific to it, never repeating the site-wide defaults (see
// app/layout.tsx, the only current caller; any page can call this too
// once it has its own keywords to append).
export function buildKeywords(settings: SiteSettings, pageKeywords?: string[]): string[] {
  const combined = [...(settings.defaultSEO?.keywords ?? []), ...(pageKeywords ?? [])];
  return Array.from(new Set(combined));
}
