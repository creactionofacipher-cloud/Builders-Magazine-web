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
  "/ru/p/",
];

// The homepage itself (the "homePage" singleton's preview target — see
// studio/lib/previewUrl.ts) has no sub-path to prefix-match against; it's
// checked for an exact match instead, not folded into the prefix list
// above (a bare "/ru" prefix would loosely match anything starting with
// those two characters, e.g. a hypothetical "/ru-fake").
const ALLOWED_PREVIEW_EXACT_PATHS = ["/ru"];

export function isAllowedPreviewPath(path: string): boolean {
  return (
    ALLOWED_PREVIEW_EXACT_PATHS.includes(path) ||
    ALLOWED_PREVIEW_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))
  );
}
