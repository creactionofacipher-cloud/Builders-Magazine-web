// Path prefixes app/api/draft-mode/enable is allowed to redirect to —
// mirrors studio/lib/previewUrl.ts's PREVIEWABLE_TYPES on the Studio
// side. Studio is a separate package and can't import this file
// directly, so the two are kept in sync manually, same as every other
// schema/type duplicated across the cms/schemas ↔ studio/schemas
// boundary. Restricting to known prefixes (rather than accepting any
// `path` value) keeps the route from being usable as an open redirect.
const ALLOWED_PREVIEW_PATH_PREFIXES = [
  "/ru/stories/",
  "/ru/magazine/",
  "/ru/builders-cup/",
  "/ru/buy/merchandise/",
];

export function isAllowedPreviewPath(path: string): boolean {
  return ALLOWED_PREVIEW_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}
