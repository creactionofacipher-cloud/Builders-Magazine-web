import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { SITE_URL } from "@/lib/site";
import { getSiteSettings } from "@/cms/services/siteSettings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(SITE_URL),
    title: settings.siteTitle,
    description: settings.siteDescription,
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
