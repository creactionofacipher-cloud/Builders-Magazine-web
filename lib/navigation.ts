// Primary navigation (docs/02_SITE_STRUCTURE.md). Labels are the MVP
// Russian nav copy — first draft, not reviewed brand translations.
// "path" is relative to the locale root; Header/Footer prefix it with
// `/${locale}`.
export interface NavItem {
  label: string;
  path: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Главная", path: "/" },
  { label: "Журнал", path: "/magazine" },
  { label: "Истории", path: "/stories" },
  { label: "Builders Cup", path: "/builders-cup" },
  { label: "Купить", path: "/buy" },
  { label: "О нас", path: "/about" },
  { label: "Поиск", path: "/search" },
];

export function localizedNavHref(locale: string, path: string): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
