import type { Metadata } from "next";
import { getHomepage } from "@/cms/services/homepage";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { DEFAULT_LOCALE, isEnabledLocale } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { resolveOgImages, resolveTwitterImages } from "@/lib/seo/images";
import { LayoutBlocksRenderer } from "@/components/layout-blocks/LayoutBlocksRenderer";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = "Builders Magazine — независимый журнал о кастомных мотоциклах";
  const description =
    "Цифровая платформа Builders Magazine: архив печатных номеров, эксклюзивные истории и Builders Cup.";
  const url = `${SITE_URL}/${DEFAULT_LOCALE}`;

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
      images: resolveOgImages(settings),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: resolveTwitterImages(settings),
    },
  };
}

// The homepage as a magazine spread: renders exactly the sequence of
// Layout Blocks an editor composed in the "Home Page" singleton document
// (see cms/services/homepage.ts / components/layout-blocks/), in that
// exact order — no section here is hardcoded or assumed.
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = isEnabledLocale(locale) ? locale : DEFAULT_LOCALE;

  const homepage = await getHomepage();

  return <LayoutBlocksRenderer blocks={homepage.blocks} locale={activeLocale} />;
}
