import type { MediaAsset } from "@/types/content";
import { cn } from "@/utils/cn";
import { Image } from "./Image";

interface ImageGridProps {
  images: MediaAsset[];
  columns?: 2 | 3;
  className?: string;
}

// Compact multi-column grid — thumbnail collections, not the primary
// immersive reading path (that's Gallery).
export function ImageGrid({ images, columns = 3, className }: ImageGridProps) {
  return (
    <div
      className={cn(
        "grid gap-[var(--spacing-gutter)]",
        columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3",
        className,
      )}
    >
      {images.map((asset) => (
        <Image key={asset.id} asset={asset} sizes="(min-width: 640px) 33vw, 50vw" lightbox />
      ))}
    </div>
  );
}
