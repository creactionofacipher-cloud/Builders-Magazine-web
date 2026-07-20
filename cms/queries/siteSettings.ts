import { mediaAssetProjection } from "./fragments";

// Fetched by fixed _id (the conventional Sanity singleton pattern) —
// see cms/schemas/siteSettings.ts.
export const SITE_SETTINGS_QUERY = `*[_id == "siteSettings"][0]{
  siteTitle,
  siteDescription,
  mission,
  philosophy,
  contacts,
  cooperation,
  socialLinks,
  "defaultSEO": defaultSEO{
    title,
    description,
    keywords,
    "ogImage": ogImage->${mediaAssetProjection},
    "favicon": favicon->${mediaAssetProjection},
    "twitterImage": twitterImage->${mediaAssetProjection},
    robots,
    siteName
  },
  footerText
}`;
