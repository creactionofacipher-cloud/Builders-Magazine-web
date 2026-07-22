import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { getStories } from "@/cms/services/stories";
import { getAllIssues } from "@/cms/services/issues";
import { getAllBuildersCupEvents } from "@/cms/services/buildersCup";
import { getMerchandise } from "@/cms/services/products";
import { getLandingPages } from "@/cms/services/landingPages";

function url(path: string): string {
  return `${SITE_URL}/${DEFAULT_LOCALE}${path}`;
}

// /search is deliberately absent — every result page already sets
// `robots: { index: false }` (see app/[locale]/search/page.tsx), and a
// query-less /search entry here wouldn't represent real content anyway.
// /dev/components is absent for the same reason as robots.ts disallowing
// it: internal catalog, never public content.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stories, issues, events, products, landingPages] = await Promise.all([
    getStories(),
    getAllIssues(),
    getAllBuildersCupEvents(),
    getMerchandise(),
    getLandingPages(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url(""), changeFrequency: "daily", priority: 1 },
    { url: url("/stories"), changeFrequency: "daily", priority: 0.8 },
    { url: url("/magazine"), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/builders-cup"), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/buy"), changeFrequency: "monthly", priority: 0.5 },
    { url: url("/about"), changeFrequency: "monthly", priority: 0.4 },
  ];

  const storyRoutes: MetadataRoute.Sitemap = stories.map((story) => ({
    url: url(`/stories/${story.slug}`),
    lastModified: story.publishedDate,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const issueRoutes: MetadataRoute.Sitemap = issues.map((issue) => ({
    url: url(`/magazine/${issue.slug}`),
    lastModified: issue.releaseDate,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: url(`/builders-cup/${event.slug}`),
    lastModified: event.date,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: url(`/buy/merchandise/${product.slug}`),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const landingPageRoutes: MetadataRoute.Sitemap = landingPages.map((page) => ({
    url: url(`/p/${page.slug}`),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...storyRoutes,
    ...issueRoutes,
    ...eventRoutes,
    ...productRoutes,
    ...landingPageRoutes,
  ];
}
