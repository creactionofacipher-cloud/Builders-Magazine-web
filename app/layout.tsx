import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

export const metadata: Metadata = {
  title: "Builders Magazine",
  description: "Builders Magazine — digital platform for custom motorcycle culture.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body>{children}</body>
    </html>
  );
}
