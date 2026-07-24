import type { MediaAsset } from "@/types/content";
import { Image } from "@/components/ui/Image";
import { Text } from "@/components/ui/Text";
import { cn } from "@/utils/cn";

export type ImageStripHeight = "small" | "medium" | "large";
export type ImageStripGap = "none" | "small" | "medium" | "large";

interface ImageStripProps {
  images: MediaAsset[];
  imageHeight?: ImageStripHeight;
  gap?: ImageStripGap;
  showCaptions?: boolean;
  showScrollbar?: boolean;
  className?: string;
}

// Desktop height matches the stated presets (220/320/460px) exactly;
// smaller breakpoints step down from there rather than holding the same
// fixed height at every viewport, so the strip doesn't shrink the whole
// page's tablet layout down to a full-height desktop image. Mobile has
// no explicit height at all — see PHONE_WIDTH_CLASS below, width leads
// there instead and height is derived from each image's own aspect
// ratio (never a hardcoded 220/320/460 number that would clip or letterbox
// whatever the editor uploaded).
const HEIGHT_CLASSES: Record<ImageStripHeight, string> = {
  small: "md:h-[190px] lg:h-[220px]",
  medium: "md:h-[260px] lg:h-[320px]",
  large: "md:h-[340px] lg:h-[460px]",
};

// Rough upper-bound width estimate per height preset (assumes a
// landscape-ish 3:2 image, the common case) — next/image `sizes` only
// needs to be a reasonable hint for srcset selection, not pixel-exact;
// each image's *actual* rendered width still varies with its own aspect
// ratio (see the inline aspectRatio style below), same approximation
// RichTextImageRow already makes for its own multi-image sizes strings.
const SIZES_BY_HEIGHT: Record<ImageStripHeight, string> = {
  small: "(min-width: 1024px) 330px, (min-width: 768px) 285px, 85vw",
  medium: "(min-width: 1024px) 480px, (min-width: 768px) 390px, 85vw",
  large: "(min-width: 1024px) 690px, (min-width: 768px) 510px, 85vw",
};

const GAP_CLASSES: Record<ImageStripGap, string> = {
  none: "gap-0",
  small: "gap-2",
  medium: "gap-4",
  large: "gap-8",
};

// Fixed 85vw on phone (the ~80-90% "native mobile gallery" feel) —
// overridden back to auto at md+, where height leads instead (see
// HEIGHT_CLASSES). Only one of width/height is ever a fixed length at a
// given breakpoint; the other stays auto so the per-image `aspectRatio`
// inline style (asset.width/asset.height, no cropping math needed)
// computes it — this is what keeps every frame at its own natural aspect
// ratio instead of a uniform cropped box.
const PHONE_WIDTH_CLASS = "w-[85vw] md:w-auto";

// Horizontally scrollable film-strip of photographs — the shared visual
// used by both HorizontalImageStripBlock (a standalone full-page Layout
// Block section) and RichTextImageStrip (the same idea embedded inline
// in an article). This component owns none of the page-section chrome
// (Section/Container/title) or the article breakout width — callers
// compose those around it via `className`. No custom scroll JS: plain
// overflow-x-auto + scroll-snap gives native momentum scrolling, swipe,
// and keyboard/wheel scrolling for free, and keeps every caller a Server
// Component — only the per-image lightbox trigger inside
// components/ui/Image.tsx crosses the client boundary.
export function ImageStrip({
  images,
  imageHeight = "medium",
  gap = "medium",
  showCaptions = false,
  showScrollbar = true,
  className,
}: ImageStripProps) {
  if (images.length < 2) return null;

  const heightClass = HEIGHT_CLASSES[imageHeight];
  const sizes = SIZES_BY_HEIGHT[imageHeight];
  const gapClass = GAP_CLASSES[gap];

  return (
    <div
      className={cn(
        "flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden pb-2",
        gapClass,
        !showScrollbar && "hide-scrollbar",
        className,
      )}
    >
      {images.map((asset, index) => (
        <figure
          key={asset.id}
          className={cn(
            "flex flex-shrink-0 flex-col gap-2 snap-start",
            index === 0 && "ml-[var(--spacing-gutter)] md:ml-[var(--spacing-gutter-lg)]",
            index === images.length - 1 && "mr-[var(--spacing-gutter)] md:mr-[var(--spacing-gutter-lg)]",
          )}
        >
          <div
            className={cn("relative flex-shrink-0", PHONE_WIDTH_CLASS, heightClass)}
            style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
          >
            <Image
              asset={asset}
              preset="gallery"
              fill
              lightbox
              priority={index === 0}
              sizes={sizes}
              className="h-full w-full"
            />
          </div>
          {showCaptions && (asset.caption || asset.copyright) && (
            <Text variant="muted" as="figcaption" className={PHONE_WIDTH_CLASS}>
              {asset.caption}
              {asset.copyright && <span className="ml-2 text-muted">© {asset.copyright}</span>}
            </Text>
          )}
        </figure>
      ))}
    </div>
  );
}
