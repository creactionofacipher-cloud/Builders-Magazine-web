// Some uploaded mediaAsset originals are enormous (magazine page scans,
// 100MB+ uncompressed PNGs at ~14000px wide) — well beyond anything this
// site ever displays, and large enough that Vercel's Image Optimization
// API outright rejects fetching them (400 CONTENT_TOO_LARGE /
// INVALID_IMAGE_OPTIMIZE_REQUEST for the largest ones), silently breaking
// that image everywhere. Capping the source width via Sanity's own CDN
// resize (?w=&fit=max) before it ever reaches next/image or the lightbox
// fixes this for every asset, not just the two that happened to be large
// enough to trip Vercel's limit today.
//
// 3840 matches next.config.ts's (default, unoverridden) largest
// `deviceSizes` entry — next/image itself never requests a wider variant
// than that, so this cap is lossless for every current use case.
const MAX_SOURCE_WIDTH = 3840;

export function capSourceWidth(url: string, maxWidth: number = MAX_SOURCE_WIDTH): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}w=${maxWidth}&fit=max`;
}
