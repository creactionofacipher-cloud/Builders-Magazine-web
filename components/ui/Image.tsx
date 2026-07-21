import NextImage from "next/image";
import type { MediaAsset } from "@/types/content";
import { cn } from "@/utils/cn";
import { LightboxImage } from "@/components/lightbox/LightboxImage";
import { getImageQuality, type ImageQualityPreset } from "@/lib/imageConfig";

interface ImageProps {
  asset: MediaAsset;
  /** Quality preset (lib/imageConfig.ts) — this is the only place a
   * next/image `quality` number gets produced; callers pick the preset
   * matching this image's editorial weight rather than a raw number. */
  preset: ImageQualityPreset;
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
  preset,
  sizes = "100vw",
  priority,
  className,
  showCaption = false,
  fill = false,
  lightbox = false,
}: ImageProps) {
  const hasCaption = showCaption && Boolean(asset.caption || asset.copyright);
  // Sanity computes a tiny base64 LQIP for every uploaded image asset
  // automatically (file.asset->metadata.lqip, read via
  // cms/queries/fragments.ts's mediaAssetProjection) — never generated
  // here. Mock data has no Sanity asset behind it, so blurDataURL is
  // simply undefined there and this falls back to next/image's default
  // "empty" placeholder rather than erroring. Either way the placeholder
  // (when present) renders inside the same width/height or `fill` box the
  // real image occupies, so it introduces no layout shift.
  const blurDataURL = asset.blurDataURL;

  return (
    <figure className={cn(fill && "h-full w-full", className)}>
      <LightboxImage
        asset={asset}
        enabled={lightbox}
        className={cn("relative overflow-hidden bg-surface", fill && "h-full w-full")}
      >
        <NextImage
          src={asset.url}
          alt={asset.altText}
          {...(fill ? { fill: true } : { width: asset.width, height: asset.height })}
          sizes={sizes}
          priority={priority}
          quality={getImageQuality(preset)}
          {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
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
