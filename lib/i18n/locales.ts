// docs/04_TECH_STACK.md — Internationalization:
// architecture must support ru/en via App Router locale segments without
// changing URLs later. MVP enables only "ru"; "en" is prepared but not
// generated until a post-MVP phase (docs/10_POST_MVP.md, Phase 7).

export const SUPPORTED_LOCALES = ["ru", "en"] as const;
export const ENABLED_LOCALES = ["ru"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export type EnabledLocale = (typeof ENABLED_LOCALES)[number];

export const DEFAULT_LOCALE: EnabledLocale = "ru";

export function isEnabledLocale(value: string): value is EnabledLocale {
  return (ENABLED_LOCALES as readonly string[]).includes(value);
}
