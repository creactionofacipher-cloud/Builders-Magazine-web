import type { MediaAsset } from "@/types/content";
import { cn } from "@/utils/cn";
import { Image } from "./Image";

interface GalleryProps {
  images: MediaAsset[];
  className?: string;
}

// Immersive, single-column editorial gallery — large images, generous
// vertical rhythm. Used within Story/Issue/Builders Cup detail pages.
export function Gallery({ images, className }: GalleryProps) {
  return (
    <div className={cn("flex flex-col gap-[var(--spacing-gutter-lg)]", className)}>
      {images.map((asset) => (
        <Image key={asset.id} asset={asset} showCaption sizes="100vw" />
      ))}
    </div>
  );
}
