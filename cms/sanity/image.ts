// Sanity's image CDN accepts sizing/format params directly on the asset
// URL (https://www.sanity.io/docs/image-urls) — no need for the
// @sanity/image-url SDK just to cap the source size before handing off
// to next/image, which does its own responsive resizing from there.
const MAX_SOURCE_WIDTH = 2400;

export function capImageUrl(assetUrl: string): string {
  if (!assetUrl) return assetUrl;
  return `${assetUrl}?w=${MAX_SOURCE_WIDTH}&fit=max&auto=format`;
}
