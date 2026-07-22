import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLandingPageBySlug, getLandingPages } from "@/cms/services/landingPages";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { DEFAULT_LOCALE, isEnabledLocale } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { LayoutBlocksRenderer } from "@/components/layout-blocks/LayoutBlocksRenderer";

export async function generateStaticParams() {
  const pages = await getLandingPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) {
    return { title: "Страница не найдена | Builders Magazine" };
  }

  const settings = await getSiteSettings();
  const title = `${page.title} | ${settings.siteTitle}`;
  const url = `${SITE_URL}/${DEFAULT_LOCALE}/p/${page.slug}`;

  return {
    title,
    alternates: { canonical: url },
  };
}

// A standalone promo/campaign page, not part of the site's main
// navigation — same Layout Blocks rendering as the homepage
// (app/[locale]/page.tsx), just backed by a different, slug-addressable
// document collection (cms/services/landingPages.ts) instead of the one
// fixed HomePage singleton.
export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const activeLocale = isEnabledLocale(locale) ? locale : DEFAULT_LOCALE;

  const page = await getLandingPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <LayoutBlocksRenderer blocks={page.blocks} locale={activeLocale} />;
}
