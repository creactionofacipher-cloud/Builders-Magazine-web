import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ENABLED_LOCALES, isEnabledLocale } from "@/lib/i18n/locales";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LightboxProvider } from "@/components/lightbox/LightboxProvider";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo/structuredData";
import { JsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return ENABLED_LOCALES.map((locale) => ({ locale }));
}

// "en" is a supported locale (docs/04_TECH_STACK.md) but not yet enabled
// (docs/10_POST_MVP.md, Phase 7), so any locale outside ENABLED_LOCALES 404s
// instead of being rendered on demand.
export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isEnabledLocale(locale)) {
    notFound();
  }

  const settings = await getSiteSettings();

  return (
    <>
      <JsonLd data={buildOrganizationJsonLd(settings)} />
      <JsonLd data={buildWebSiteJsonLd(settings)} />
      <Header locale={locale} siteTitle={settings.siteTitle} />
      <main>
        <LightboxProvider>{children}</LightboxProvider>
      </main>
      <Footer locale={locale} siteTitle={settings.siteTitle} footerText={settings.footerText} />
    </>
  );
}
