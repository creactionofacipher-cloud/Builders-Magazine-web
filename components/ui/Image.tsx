import NextImage from "next/image";
import type { MediaAsset } from "@/types/content";
import { cn } from "@/utils/cn";

interface ImageProps {
  asset: MediaAsset;
  sizes?: string;
  priority?: boolean;
  className?: string;
  showCaption?: boolean;
}

export function Image({
  asset,
  sizes = "100vw",
  priority,
  className,
  showCaption = false,
}: ImageProps) {
  const hasCaption = showCaption && Boolean(asset.caption || asset.copyright);

  return (
    <figure className={className}>
      <div className="relative overflow-hidden bg-surface">
        <NextImage
          src={asset.url}
          alt={asset.altText}
          width={asset.width}
          height={asset.height}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>
      {hasCaption && (
        <figcaption className={cn("mt-2 font-body text-sm text-muted")}>
          {asset.caption}
          {asset.copyright && <span className="ml-2 text-neutral-400">© {asset.copyright}</span>}
        </figcaption>
      )}
    </figure>
  );
}
