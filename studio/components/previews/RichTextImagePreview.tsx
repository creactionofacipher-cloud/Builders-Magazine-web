import { previewImageUrl } from "../../lib/imageUrl";
import { GlyphFrame, MiniImage } from "./shared";

interface RichTextImageSelection {
  file?: unknown;
  caption?: string;
  altText?: string;
  variant?: string;
}

// select/prepare for the single "Image" block — thumbnail plus the
// referenced MediaAsset's own caption, so an editor sees what the image
// actually is without opening it (was previously just a generic
// "Image (variant)" title with no visual). `image.file`/`image.caption`/
// `image.altText` use Sanity's dot-path-through-reference select syntax
// (synchronous, live-subscribed) — the same mechanism this block's
// preview already relied on before this task, just extended to also
// pull the caption.
export const richTextImagePreview = {
  select: {
    file: "image.file",
    caption: "image.caption",
    altText: "image.altText",
    variant: "variant",
  },
  prepare({ file, caption, altText, variant }: RichTextImageSelection) {
    return {
      title: caption || altText || "Изображение без подписи",
      subtitle: `Вариант: ${variant ?? "inline"}`,
      media: (
        <GlyphFrame>
          <MiniImage url={previewImageUrl(file)} alt={altText} />
        </GlyphFrame>
      ),
    };
  },
};
