import type { EnabledLocale } from "@/lib/i18n/locales";
import { Container } from "./Container";
import { Navigation } from "./Navigation";
import { MobileNav } from "./MobileNav";
import { Link } from "@/components/ui/Link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface HeaderProps {
  locale: EnabledLocale;
  siteTitle: string;
}

export function Header({ locale, siteTitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-border bg-background">
      <Container className="flex items-center justify-between py-4">
        <Link href={`/${locale}`} variant="plain" className="font-display text-xl font-semibold">
          {siteTitle}
        </Link>
        <div className="flex items-center gap-2">
          <Navigation locale={locale} className="hidden md:flex" />
          <ThemeToggle />
          <MobileNav locale={locale} className="md:hidden" />
        </div>
      </Container>
    </header>
  );
}
