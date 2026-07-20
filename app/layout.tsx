import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { getSiteSettings } from "@/cms/services/siteSettings";
import { buildKeywords } from "@/lib/seo/keywords";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  // Every route currently defines its own full title/description/openGraph/
  // twitter (see each page's own generateMetadata), so this rarely shows
  // up as-is in practice — it's the fallback for any route that doesn't.
  // defaultSEO is Site Settings' dedicated field for exactly this (see
  // types/content.ts's SiteSettings.defaultSEO); siteTitle/siteDescription
  // are the fallback when no one has filled that in yet.
  const title = settings.defaultSEO?.title || settings.siteTitle;
  const description = settings.defaultSEO?.description || settings.siteDescription;
  const siteName = settings.defaultSEO?.siteName || settings.siteTitle;
  const ogImage = settings.defaultSEO?.ogImage;
  // Falls back to the OG image rather than requiring editors to upload a
  // second near-identical asset just to have *a* Twitter image.
  const twitterImage = settings.defaultSEO?.twitterImage || ogImage;
  const favicon = settings.defaultSEO?.favicon;
  const keywords = buildKeywords(settings);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: siteName,
    ...(keywords.length > 0 && { keywords }),
    ...(settings.defaultSEO?.robots && { robots: settings.defaultSEO.robots }),
    appleWebApp: { title: siteName },
    ...(favicon && {
      icons: {
        icon: favicon.url,
        shortcut: favicon.url,
        apple: favicon.url,
      },
    }),
    openGraph: {
      title,
      description,
      siteName,
      locale: "ru_RU",
      type: "website",
      images: ogImage ? [{ url: ogImage.url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: twitterImage ? [{ url: twitterImage.url }] : undefined,
    },
  };
}

// Sets [data-theme] on <html> before first paint, so there's no flash of
// the wrong theme between server render and hydration. Stored preference
// wins; otherwise falls back to system preference, defaulting to the
// site's dark theme unless the OS explicitly prefers light. Plain script,
// no dependency — mirrors the pattern next-themes uses internally.
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('theme');var l=window.matchMedia('(prefers-color-scheme: light)').matches;var t=(s==='light'||s==='dark')?s:(l?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={DEFAULT_LOCALE} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
