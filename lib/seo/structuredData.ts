// schema.org JSON-LD builders. Rendered via components/seo/JsonLd.tsx.
//
// schema.org is a plain, loosely-typed graph with no first-party
// TypeScript definitions worth pulling in as a dependency for a handful
// of fields — these return plain objects. `JSON.stringify` drops `undefined`
// values automatically, so optional fields are just `condition ? value : undefined`
// rather than conditionally spreading keys in and out.

import type { BuildersCup, Issue, Product, SiteSettings, Story } from "@/types/content";
import { SITE_URL } from "@/lib/site";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { portableTextToPlainText } from "@/utils/portableTextToPlainText";

function absoluteUrl(path: string): string {
  return `${SITE_URL}/${DEFAULT_LOCALE}${path}`;
}

// Site-wide — rendered once, in app/[locale]/layout.tsx, not per-page.
export function buildOrganizationJsonLd(settings: SiteSettings) {
  // Sanity's `url` field on a socialLinks entry is optional even though
  // the app type doesn't say so (see the recurring "type says required,
  // real content can still be empty" pattern elsewhere in this project)
  // — filter those out rather than emitting `sameAs: [null]`, which
  // isn't a valid URL list.
  const sameAs = settings.contacts.socialLinks?.map((link) => link.url).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.defaultSEO?.siteName || settings.siteTitle,
    url: SITE_URL,
    description: settings.siteDescription,
    // Reuses the OG image rather than a dedicated logo field — see
    // types/content.ts's SiteSettings.defaultSEO ("do not introduce
    // duplicated image fields").
    logo: settings.defaultSEO?.ogImage?.url || undefined,
    email: settings.contacts.email || undefined,
    sameAs: sameAs && sameAs.length > 0 ? sameAs : undefined,
  };
}

export function buildWebSiteJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.defaultSEO?.siteName || settings.siteTitle,
    url: SITE_URL,
    // Lets Google render a sitelinks search box directly in results —
    // matches the ?q= param SearchInput already posts to /search.
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/search")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildArticleJsonLd(story: Story, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.shortDescription,
    image: [story.coverImage.url],
    // Typed as required (Story.publishedDate: string), but real content
    // can still leave it empty — same "type says required, CMS doesn't
    // enforce it" gap seen elsewhere. `|| undefined` drops it from the
    // JSON-LD output instead of emitting a literal `"datePublished":null`,
    // which Rich Results validation would flag.
    datePublished: story.publishedDate || undefined,
    author: story.author ? { "@type": "Person", name: story.author.name } : undefined,
    publisher: { "@type": "Organization", name: settings.siteTitle },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/stories/${story.slug}`),
    },
  };
}

export function buildEventJsonLd(event: BuildersCup, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: event.location ? { "@type": "Place", name: event.location } : undefined,
    image: [event.coverImage.url],
    description: event.description
      ? portableTextToPlainText(event.description, 300)
      : undefined,
    organizer: { "@type": "Organization", name: settings.siteTitle },
    url: absoluteUrl(`/builders-cup/${event.slug}`),
  };
}

// A print-magazine issue is a PublicationIssue of the site's own
// Periodical — the one content type that previously had no structured
// data at all (Story/Event/Product all did).
export function buildIssueJsonLd(issue: Issue, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "PublicationIssue",
    issueNumber: issue.number,
    name: issue.title,
    image: [issue.coverImage.url],
    datePublished: issue.releaseDate || undefined,
    description: issue.description
      ? portableTextToPlainText(issue.description, 300)
      : undefined,
    isPartOf: {
      "@type": "Periodical",
      name: settings.siteTitle,
    },
    url: absoluteUrl(`/magazine/${issue.slug}`),
    offers:
      issue.buyLinks && issue.buyLinks.length > 0
        ? issue.buyLinks.map((link) => ({ "@type": "Offer", url: link.url, name: link.label }))
        : undefined,
  };
}

export function buildProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: [product.mainImage.url],
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/buy/merchandise/${product.slug}`),
      price: product.price,
      priceCurrency: product.currency,
      availability:
        product.status === "published"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}
