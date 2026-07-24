import type { RichTextImageStripBlock } from "@/types/content";
import { ImageStrip } from "@/components/ui/ImageStrip";
import { Text } from "@/components/ui/Text";
import { IMAGE_VARIANT_CLASSES } from "./base";

// In-article version of components/layout-blocks/HorizontalImageStripBlock.tsx
// — same components/ui/ImageStrip.tsx visual, breaking out of the reading
// column the same way RichTextFullBleed.tsx breaks its own image out
// (IMAGE_VARIANT_CLASSES.fullWidth — "full width" in this codebase's
// existing article vocabulary is that proportional breakout, not true
// 100vw; see base.tsx's comment on why). The caption stays inside the
// normal reading column, same as RichTextFullBleed's.
export function RichTextImageStrip({ value }: { value: RichTextImageStripBlock }) {
  const images = value.images ?? [];
  if (images.length < 2) return null;

  return (
    <figure className="clear-both">
      <ImageStrip
        images={images}
        imageHeight={value.imageHeight}
        gap={value.gap}
        showCaptions={value.showCaptions}
        showScrollbar={value.showScrollbar}
        className={IMAGE_VARIANT_CLASSES.fullWidth}
      />
      {value.caption && (
        <Text variant="muted" as="figcaption" className="mx-auto mt-2 max-w-2xl">
          {value.caption}
        </Text>
      )}
    </figure>
  );
}
