import type { EnabledLocale } from "@/lib/i18n/locales";
import { PRIMARY_NAV, localizedNavHref } from "@/lib/navigation";
import { Link } from "@/components/ui/Link";
import { cn } from "@/utils/cn";

interface NavigationProps {
  locale: EnabledLocale;
  className?: string;
}

export function Navigation({ locale, className }: NavigationProps) {
  return (
    <nav aria-label="Primary" className={cn("flex flex-wrap gap-6", className)}>
      {PRIMARY_NAV.map((item) => (
        <Link
          key={item.path}
          href={localizedNavHref(locale, item.path)}
          variant="plain"
          className="font-body text-sm tracking-wide uppercase hover:text-muted"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
