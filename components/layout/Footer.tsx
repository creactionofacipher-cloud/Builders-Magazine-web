import type { EnabledLocale } from "@/lib/i18n/locales";
import { Container } from "./Container";
import { Text } from "@/components/ui/Text";
import { Link } from "@/components/ui/Link";
import { PRIMARY_NAV, localizedNavHref } from "@/lib/navigation";

interface FooterProps {
  locale: EnabledLocale;
  siteTitle: string;
  footerText: string;
}

export function Footer({ locale, siteTitle, footerText }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-8 py-[var(--spacing-gutter-lg)] md:flex-row md:items-start md:justify-between">
        <Text variant="muted" className="max-w-sm">
          {footerText}
        </Text>
        <nav aria-label="Нижняя навигация" className="flex flex-wrap gap-4">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.path}
              href={localizedNavHref(locale, item.path)}
              variant="muted"
              className="text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
      <Container className="border-t border-border py-4">
        <Text variant="muted" className="text-xs">
          © {year} {siteTitle}
        </Text>
      </Container>
    </footer>
  );
}
