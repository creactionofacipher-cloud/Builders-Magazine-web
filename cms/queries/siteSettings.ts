import { mediaAssetProjection } from "./fragments";

// Fetched by fixed _id (the conventional Sanity singleton pattern) —
// see cms/schemas/siteSettings.ts.
// `contacts` is fetched as a whole object — its nested `socialLinks`
// comes along automatically, no separate projection line needed.
export const SITE_SETTINGS_QUERY = `*[_id == "siteSettings"][0]{
  siteTitle,
  siteDescription,
  philosophy,
  mission,
  contacts,
  cooperation,
  footerText,
  "defaultSEO": defaultSEO{
    title,
    description,
    keywords,
    "ogImage": ogImage->${mediaAssetProjection},
    "favicon": favicon->${mediaAssetProjection},
    "twitterImage": twitterImage->${mediaAssetProjection},
    robots,
    siteName
  }
}`;
