import type { SiteSettings } from "@/types/content";

// The query already projects directly into SiteSettings's shape — no
// transform needed. Kept as an explicit boundary function for
// consistency with every other entity.
export function mapSiteSettings(raw: SiteSettings): SiteSettings {
  return raw;
}
