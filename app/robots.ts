import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /dev (the internal component catalog) is the only real disallow — it's
// not public content and never should be crawled.
//
// /search is deliberately NOT disallowed here even though its results
// shouldn't be indexed: that's handled by the page's own `robots:
// { index: false }` meta tag (see app/[locale]/search/page.tsx).
// Disallowing it in robots.txt would stop crawlers from ever reaching
// the page to see that directive in the first place — the two
// mechanisms solve different problems and shouldn't be combined here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dev",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
