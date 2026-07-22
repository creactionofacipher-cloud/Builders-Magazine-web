"use client";

import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <nav aria-label="Основная навигация" className={cn("flex flex-wrap gap-6", className)}>
      {PRIMARY_NAV.map((item) => {
        const href = localizedNavHref(locale, item.path);
        // Exact match for the home root (otherwise it'd match every
        // page); every other section stays "active" for its own detail
        // pages too (e.g. /ru/magazine/some-issue under /ru/magazine).
        const isActive =
          item.path === "/" ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`);

        return (
          <Link
            key={item.path}
            href={href}
            variant="plain"
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "font-body text-sm tracking-wide uppercase hover:text-muted",
              isActive && "underline underline-offset-4",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
