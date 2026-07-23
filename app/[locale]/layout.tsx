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
// (docs/10_POST_MVP.md, Phase 7) — rejected below via isEnabledLocale +
// notFound() at request time, not via `dynamicParams = false` here.
// That flag would reject unsupported locales too, but it also propagates
// to every dynamic segment nested under this layout ([slug] in
// /stories, /magazine, /builders-cup, /buy/merchandise, /p) — any
// document created after the last production build has a slug absent
// from generateStaticParams(), so Next.js 404s it outright regardless of
// what Sanity actually has. Confirmed live (2026-07): a freshly published
// Issue 404'd in both the public site and Presentation's draft-mode
// preview even though the drafts/published/CDN perspectives all agreed
// the document existed — this flag, not stale data, was the cause.

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
      <main id="main-content">
        <LightboxProvider>{children}</LightboxProvider>
      </main>
      <Footer locale={locale} siteTitle={settings.siteTitle} footerText={settings.footerText} />
    </>
  );
}
