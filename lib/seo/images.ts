import type { MediaAsset, SiteSettings } from "@/types/content";

// Next.js does NOT deep-merge a child route's `openGraph`/`twitter` object
// with the root layout's — once a page defines its own `openGraph` (every
// route in this app does, for its own title/description), the whole object
// replaces the parent's, including `images`. So the "page image → Site
// Settings default → no image" priority from defaultSEO can't rely on
// metadata inheritance; each page's own `openGraph.images`/`twitter.images`
// must call these instead of hardcoding `pageImage ? [...] : undefined`.

function toOgImages(image: MediaAsset | undefined) {
  return image ? [{ url: image.url }] : undefined;
}

export function resolveOgImages(settings: SiteSettings, pageImage?: MediaAsset) {
  return toOgImages(pageImage ?? settings.defaultSEO?.ogImage);
}

// Falls back to the OG image before falling back to "no image" — same
// twitterImage-falls-back-to-ogImage rule as app/layout.tsx.
export function resolveTwitterImages(settings: SiteSettings, pageImage?: MediaAsset) {
  return toOgImages(pageImage ?? settings.defaultSEO?.twitterImage ?? settings.defaultSEO?.ogImage);
}
