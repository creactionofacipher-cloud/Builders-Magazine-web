import type { RichTextImageTextBlock } from "@/types/content";
import { cn } from "@/utils/cn";
import { Image } from "@/components/ui/Image";

const WIDTH_CLASSES: Record<string, string> = {
  "35%": "md:w-[35%]",
  "40%": "md:w-[40%]",
  "50%": "md:w-[50%]",
};

// Floats the image within the shared RichText body (see RichText.tsx's
// `flow-root` container) so the plain-paragraph blocks that follow it in
// the same article genuinely wrap around it — a flex/grid layout can't do
// this, since CSS float has no effect between flex/grid item siblings,
// which is exactly why RichText.tsx's container is block-flow rather than
// flex. `md:` prefixes on every positioning class keep this desktop-only:
// on mobile the image is always a plain full-width block above/below the
// text, never floated.
export function RichTextImageText({ value }: { value: RichTextImageTextBlock }) {
  if (!value.image) return null;

  const position = value.position ?? "left";
  const width = value.width ?? "40%";
  const widthClass = WIDTH_CLASSES[width] ?? WIDTH_CLASSES["40%"];
  const wraps = value.textWrap ?? true;

  return (
    <Image
      asset={value.image}
      preset="editorial"
      lightbox
      showCaption
      sizes={`(min-width: 768px) ${width}, 100vw`}
      className={cn(
        "w-full clear-both",
        widthClass,
        wraps
          ? cn("mb-4", position === "right" ? "md:float-right md:ml-6" : "md:float-left md:mr-6")
          : position === "right"
            ? "md:ml-auto"
            : "md:mr-auto",
      )}
    />
  );
}
