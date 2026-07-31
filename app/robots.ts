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
    rules: [
      { userAgent: "*", allow: "/", disallow: "/dev" },
      // Googlebot's dedicated image-indexing crawler (separate from the
      // main Googlebot rule above) is the most aggressive at re-fetching
      // every size/format variant next/image's optimizer can generate for
      // a given source image — real bandwidth cost with no upside, since
      // this site doesn't rely on Google Images search traffic.
      { userAgent: "Googlebot-Image", disallow: "/_next/image" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
