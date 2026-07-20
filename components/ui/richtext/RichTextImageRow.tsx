import type { ReactNode } from "react";
import type { RichTextImageRowBlock } from "@/types/content";
import { cn } from "@/utils/cn";
import { Image } from "@/components/ui/Image";
import { Text } from "@/components/ui/Text";

const GAP_CLASSES: Record<string, string> = {
  small: "gap-2",
  medium: "gap-4",
  large: "gap-8",
};

// A shared crop height keeps every image in the row visually level on
// desktop — without it, each image would keep its own natural aspect
// ratio and produce a jagged row. Mobile instead gives each stacked image
// its own aspect-ratio box (see aspectClass below) rather than sharing
// this fixed height across the whole stack.
const ROW_HEIGHT = "md:h-[26rem]";

// "2-1"/"1-2" distribute width ratios across a single row of images at
// equal height. "large-left"/"large-right" are a different editorial
// pattern: one hero image next to the *rest* stacked in a sidebar column
// — not a variation of the same ratio math.
function widthClassFor(layout: string, index: number): string {
  if (layout === "2-1") return index === 0 ? "md:flex-[2]" : "md:flex-1";
  if (layout === "1-2") return index === 0 ? "md:flex-1" : "md:flex-[2]";
  return "md:flex-1";
}

const aspectClass = "aspect-[4/3] md:aspect-auto";

export function RichTextImageRow({ value }: { value: RichTextImageRowBlock }) {
  const images = value.images ?? [];
  if (images.length === 0) return null;

  const layout = value.layout ?? "equal";
  const gapClass = GAP_CLASSES[value.gap ?? "medium"] ?? GAP_CLASSES.medium;

  let content: ReactNode;

  if ((layout === "large-left" || layout === "large-right") && images.length > 1) {
    const [hero, ...rest] = images;
    const heroEl = (
      <Image
        key={hero.id}
        asset={hero}
        fill
        lightbox
        sizes="(min-width: 768px) 50vw, 100vw"
        className={cn(aspectClass, "w-full md:h-full md:flex-[2]")}
      />
    );
    const restEl = (
      <div className={cn("flex flex-1 flex-col md:h-full", gapClass)}>
        {rest.map((asset) => (
          <Image
            key={asset.id}
            asset={asset}
            fill
            lightbox
            sizes="(min-width: 768px) 25vw, 100vw"
            className={cn(aspectClass, "w-full flex-1")}
          />
        ))}
      </div>
    );
    content = (
      <div className={cn("flex flex-col md:flex-row", ROW_HEIGHT, gapClass)}>
        {layout === "large-left" ? (
          <>
            {heroEl}
            {restEl}
          </>
        ) : (
          <>
            {restEl}
            {heroEl}
          </>
        )}
      </div>
    );
  } else {
    content = (
      <div className={cn("flex flex-col md:flex-row", ROW_HEIGHT, gapClass)}>
        {images.map((asset, index) => (
          <Image
            key={asset.id}
            asset={asset}
            fill
            lightbox
            sizes={`(min-width: 768px) ${Math.round(100 / images.length)}vw, 100vw`}
            className={cn(aspectClass, "w-full md:h-full", widthClassFor(layout, index))}
          />
        ))}
      </div>
    );
  }

  return (
    <figure className="clear-both">
      {content}
      {value.caption && (
        <Text variant="muted" as="figcaption" className="mt-2">
          {value.caption}
        </Text>
      )}
    </figure>
  );
}
