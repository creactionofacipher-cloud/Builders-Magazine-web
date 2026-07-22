import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { LayoutBlock, MediaAsset } from "@/types/content";
import { getLandingPageBySlug, getLandingPages } from "@/cms/services/landingPages";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { DEFAULT_LOCALE, isEnabledLocale } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { resolveOgImages, resolveTwitterImages } from "@/lib/seo/images";
import { portableTextToPlainText } from "@/utils/portableTextToPlainText";
import { LayoutBlocksRenderer } from "@/components/layout-blocks/LayoutBlocksRenderer";

export async function generateStaticParams() {
  const pages = await getLandingPages();
  return pages.map((page) => ({ slug: page.slug }));
}

// LandingPage has no dedicated description/cover-image field of its own
// (it's just a title + an editor-composed block sequence) — these scan
// the actual blocks for the first plausible candidate of each, so a
// promo page still gets a real description and share image instead of
// the bare title-only metadata every other content page avoids.
function findLandingPageImage(blocks: LayoutBlock[]): MediaAsset | undefined {
  for (const block of blocks) {
    if (block._type === "heroStory" && block.story?.coverImage) return block.story.coverImage;
    if (block._type === "fullWidthPhoto" && block.image) return block.image;
    if (block._type === "cta" && block.backgroundImage) return block.backgroundImage;
  }
  return undefined;
}

function findLandingPageDescription(blocks: LayoutBlock[]): string | undefined {
  for (const block of blocks) {
    if (block._type === "heroStory" && block.story?.shortDescription) {
      return block.story.shortDescription;
    }
    if (block._type === "cta" && block.subtitle) return block.subtitle;
    if (block._type === "quote" && block.text) return block.text;
    if (block._type === "richText" && block.content) {
      const text = portableTextToPlainText(block.content, 160);
      if (text) return text;
    }
  }
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) {
    return { title: "Страница не найдена | Builders Magazine", robots: { index: false } };
  }

  const settings = await getSiteSettings();
  const title = `${page.title} | ${settings.siteTitle}`;
  const url = `${SITE_URL}/${DEFAULT_LOCALE}/p/${page.slug}`;
  const description = findLandingPageDescription(page.blocks) || settings.siteDescription;
  const image = findLandingPageImage(page.blocks);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: settings.defaultSEO?.siteName || settings.siteTitle,
      locale: "ru_RU",
      type: "website",
      images: resolveOgImages(settings, image),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: resolveTwitterImages(settings, image),
    },
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
