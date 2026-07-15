import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

export default function RootPage(): never {
  redirect(`/${DEFAULT_LOCALE}`);
}
