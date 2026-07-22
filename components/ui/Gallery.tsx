import type { MediaAsset } from "@/types/content";
import { cn } from "@/utils/cn";
import { Image } from "./Image";

interface GalleryProps {
  images: MediaAsset[];
  className?: string;
}

// Immersive, single-column editorial gallery — large images, generous
// vertical rhythm. Used within Story/Issue/Builders Cup detail pages,
// always inside <Container> (max-w-7xl = 1280px) — `sizes` reflects that
// real cap instead of a raw 100vw, which was over-requesting resolution
// on any monitor wider than 1280px.
export function Gallery({ images, className }: GalleryProps) {
  return (
    <div className={cn("flex flex-col gap-[var(--spacing-gutter-lg)]", className)}>
      {images.map((asset) => (
        <Image
          key={asset.id}
          asset={asset}
          preset="gallery"
          showCaption
          sizes="(min-width: 1280px) 1280px, 100vw"
          lightbox
        />
      ))}
    </div>
  );
}
