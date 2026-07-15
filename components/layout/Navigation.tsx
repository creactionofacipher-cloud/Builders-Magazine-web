import type { EnabledLocale } from "@/lib/i18n/locales";
import { PRIMARY_NAV, localizedNavHref } from "@/lib/navigation";
import { Link } from "@/components/ui/Link";
import { cn } from "@/utils/cn";

interface NavigationProps {
  locale: EnabledLocale;
  /** Called when a link is clicked — used by MobileNav to close the panel. */
  onNavigate?: () => void;
  className?: string;
}

export function Navigation({ locale, onNavigate, className }: NavigationProps) {
  return (
    <nav aria-label="Primary" className={cn("flex flex-wrap gap-6", className)}>
      {PRIMARY_NAV.map((item) => (
        <Link
          key={item.path}
          href={localizedNavHref(locale, item.path)}
          variant="plain"
          onClick={onNavigate}
          className="font-body text-sm tracking-wide uppercase hover:text-muted"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
