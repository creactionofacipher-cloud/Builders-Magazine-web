import type { GalleryGap, GalleryHeight, GalleryLayout, MediaAsset } from "@/types/content";
import { cn } from "@/utils/cn";
import { Image } from "./Image";
import { Text } from "./Text";

interface GalleryProps {
  images: MediaAsset[];
  layout?: GalleryLayout;
  imageHeight?: GalleryHeight;
  gap?: GalleryGap;
  showCaptions?: boolean;
  showScrollbar?: boolean;
  className?: string;
}

const HEIGHT_CLASSES: Record<GalleryHeight, string> = {
  small: "md:h-[190px] lg:h-[220px]",
  medium: "md:h-[260px] lg:h-[320px]",
  large: "md:h-[340px] lg:h-[460px]",
};

const SIZES_BY_HEIGHT: Record<GalleryHeight, string> = {
  small: "(min-width: 1024px) 330px, (min-width: 768px) 285px, 85vw",
  medium: "(min-width: 1024px) 480px, (min-width: 768px) 390px, 85vw",
  large: "(min-width: 1024px) 690px, (min-width: 768px) 510px, 85vw",
};

const GAP_CLASSES: Record<GalleryGap, string> = {
  none: "gap-0",
  small: "gap-2",
  medium: "gap-4",
  large: "gap-8",
};

const PHONE_WIDTH_CLASS = "w-[85vw] md:w-auto";

// The single reusable image-gallery renderer — "grid" (immersive,
// single-column, generous vertical rhythm; the component's original and
// still-default behavior) or "strip" (full-width, horizontally
// scrollable film strip, used by HorizontalImageStripBlock and
// RichTextImageStrip, both of which hardcode layout="strip" and pass
// their own Studio-authored settings through unchanged). `showCaptions`
// defaults differently per layout to preserve each mode's prior,
// independent default (grid: always on; strip: off) with zero explicit
// caller changes required.
export function Gallery({
  images,
  layout = "grid",
  imageHeight = "medium",
  gap = "medium",
  showCaptions = layout === "grid",
  showScrollbar = true,
  className,
}: GalleryProps) {
  if (layout === "strip") {
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

  // Always inside <Container> (max-w-7xl = 1280px) — `sizes` reflects
  // that real cap instead of a raw 100vw, which would over-request
  // resolution on any monitor wider than 1280px.
  return (
    <div className={cn("flex flex-col gap-[var(--spacing-gutter-lg)]", className)}>
      {images.map((asset) => (
        <Image
          key={asset.id}
          asset={asset}
          preset="gallery"
          showCaption={showCaptions}
          sizes="(min-width: 1280px) 1280px, 100vw"
          lightbox
        />
      ))}
    </div>
  );
}
