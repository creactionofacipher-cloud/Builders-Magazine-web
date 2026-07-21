// Single source of truth for next/image `quality` values — every
// components/ui/Image.tsx caller picks one of these by editorial weight
// instead of passing (or hardcoding) a raw number. See Image.tsx's
// `preset` prop, the only place this map is read.
export const IMAGE_QUALITY_PRESETS = {
  /** Full-bleed promotional/section heroes (Hero.tsx). */
  hero: 90,
  /** Primary editorial content: RichText body images, detail-page cover
   * images, homepage spotlight images. */
  editorial: 88,
  /** Immersive galleries and image grids (Gallery.tsx, ImageGrid.tsx). */
  gallery: 82,
  /** Listing/grid cards (StoryCard, IssueCard, ProductCard, etc.). */
  card: 72,
  /** Small supplementary imagery not otherwise covered above. */
  thumbnail: 65,
} as const;

export type ImageQualityPreset = keyof typeof IMAGE_QUALITY_PRESETS;

export function getImageQuality(preset: ImageQualityPreset): number {
  return IMAGE_QUALITY_PRESETS[preset];
}
