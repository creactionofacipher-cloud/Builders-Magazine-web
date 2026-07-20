"use client";

import NextImage from "next/image";
import type { MediaAsset } from "@/types/content";
import { cn } from "@/utils/cn";
import { useLightboxImage } from "@/components/lightbox/useLightbox";
import { LightboxImage } from "@/components/lightbox/LightboxImage";

interface ImageProps {
  asset: MediaAsset;
  sizes?: string;
  priority?: boolean;
  className?: string;
  showCaption?: boolean;
  /** Full-bleed mode: fills the nearest positioned ancestor instead of
   * using the asset's intrinsic aspect ratio. For backgrounds like Hero. */
  fill?: boolean;
  /** Registers this image in the current page's shared lightbox gallery —
   * clicking it opens a fullscreen viewer with keyboard/swipe navigation
   * across every other lightbox-enabled image on the page, in reading
   * order (see components/lightbox/). Off by default: not every Image
   * usage is page content — card thumbnails that already link to a
   * detail page shouldn't also open a lightbox. Gallery and ImageGrid
   * enable it unconditionally for their own images. */
  lightbox?: boolean;
}

export function Image({
  asset,
  sizes = "100vw",
  priority,
  className,
  showCaption = false,
  fill = false,
  lightbox = false,
}: ImageProps) {
  const hasCaption = showCaption && Boolean(asset.caption || asset.copyright);
  const { lightboxId, onOpen } = useLightboxImage(asset, lightbox);

  return (
    <figure className={cn(fill && "h-full w-full", className)}>
      <LightboxImage
        lightboxId={lightboxId}
        onOpen={onOpen}
        className={cn("relative overflow-hidden bg-surface", fill && "h-full w-full")}
      >
        <NextImage
          src={asset.url}
          alt={asset.altText}
          {...(fill ? { fill: true } : { width: asset.width, height: asset.height })}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </LightboxImage>
      {hasCaption && (
        <figcaption className="mt-2 font-body text-sm text-muted">
          {asset.caption}
          {asset.copyright && <span className="ml-2 text-muted">© {asset.copyright}</span>}
        </figcaption>
      )}
    </figure>
  );
}
