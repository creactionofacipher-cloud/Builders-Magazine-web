import NextImage from "next/image";
import type { MediaAsset } from "@/types/content";
import { cn } from "@/utils/cn";

interface ImageProps {
  asset: MediaAsset;
  sizes?: string;
  priority?: boolean;
  className?: string;
  showCaption?: boolean;
  /** Full-bleed mode: fills the nearest positioned ancestor instead of
   * using the asset's intrinsic aspect ratio. For backgrounds like Hero. */
  fill?: boolean;
}

export function Image({
  asset,
  sizes = "100vw",
  priority,
  className,
  showCaption = false,
  fill = false,
}: ImageProps) {
  const hasCaption = showCaption && Boolean(asset.caption || asset.copyright);

  return (
    <figure className={cn(fill && "h-full w-full", className)}>
      <div className={cn("relative overflow-hidden bg-surface", fill && "h-full w-full")}>
        <NextImage
          src={asset.url}
          alt={asset.altText}
          {...(fill ? { fill: true } : { width: asset.width, height: asset.height })}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>
      {hasCaption && (
        <figcaption className="mt-2 font-body text-sm text-muted">
          {asset.caption}
          {asset.copyright && <span className="ml-2 text-muted">© {asset.copyright}</span>}
        </figcaption>
      )}
    </figure>
  );
}
