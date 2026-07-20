import type { RichTextFullBleedBlock } from "@/types/content";
import { Image } from "@/components/ui/Image";
import { Text } from "@/components/ui/Text";
import { IMAGE_VARIANT_CLASSES } from "./base";

// Reuses the exact same breakout mechanism as RichTextImageBlock's own
// "fullWidth" variant (see base.tsx) — "the page content width" in this
// codebase's existing vocabulary is that breakout, not true 100vw, so a
// full-bleed image stays visually consistent with every other wide image
// already in the article. The caption is rendered separately, constrained
// to the same max-w-2xl reading-column width the "inline" variant uses,
// so it never stretches edge-to-edge with the image above it.
export function RichTextFullBleed({ value }: { value: RichTextFullBleedBlock }) {
  if (!value.image) return null;
  const { image } = value;
  const hasCaption = Boolean(image.caption || image.copyright);

  return (
    <figure className="clear-both">
      <Image asset={image} lightbox sizes="100vw" className={IMAGE_VARIANT_CLASSES.fullWidth} />
      {hasCaption && (
        <Text variant="muted" as="figcaption" className="mx-auto mt-2 max-w-2xl">
          {image.caption}
          {image.copyright && <span className="ml-2">© {image.copyright}</span>}
        </Text>
      )}
    </figure>
  );
}
