import { createImageUrlBuilder } from "@sanity/image-url";

// projectId/dataset match sanity.config.ts's own hardcoded values (not
// env-driven there either) — hardcoding here too avoids needing a client
// instance just to build thumbnail URLs, and avoids a second source of
// truth for the same two constants.
const builder = createImageUrlBuilder({ projectId: "l1slax0i", dataset: "production" });

// Small, fixed-size preview thumbnails only — every block preview glyph
// in studio/components/previews/ that shows a real photo uses this, so a
// resolved image always renders at the same crop/quality instead of each
// glyph requesting its own arbitrary size. `source` is whatever a
// schema-level `select` path resolved (e.g. "image.file" — the Sanity
// image value living on the referenced MediaAsset) — undefined while
// still loading or if the reference is unset, in which case this
// returns undefined and callers fall back to a placeholder.
export function previewImageUrl(source: unknown, size = 96): string | undefined {
  if (!source) return undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- @sanity/image-url's SanityImageSource is a broad structural type; `select`-resolved values satisfy it at runtime but aren't worth re-declaring here.
    return builder.image(source as any).width(size).height(size).fit("crop").url();
  } catch {
    return undefined;
  }
}
