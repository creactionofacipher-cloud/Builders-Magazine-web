import { PortableText } from "@portabletext/react";
import type { RichTextTwoColumnTextBlock } from "@/types/content";
import { cn } from "@/utils/cn";
import { basePortableTextComponents, groupInlineImages } from "./base";

// True CSS multi-column (not a 2-cell grid) — text flows down the first
// column and continues into the second, the correct behavior for long
// flowing interview copy. Grid would instead place alternating blocks
// into alternating cells, which reads wrong for prose. break-inside-avoid
// keeps non-paragraph blocks (headings, images, quotes, dividers, embeds)
// from splitting across the column break; plain paragraphs are left free
// to break, since forcing every paragraph whole would leave large gaps at
// column bottoms in long copy.
export function RichTextTwoColumns({ value }: { value: RichTextTwoColumnTextBlock }) {
  if (!value.content || value.content.length === 0) return null;

  return (
    <div
      className={cn(
        "clear-both",
        "md:columns-2 md:gap-8",
        "flow-root [&>*+*]:mt-4 [&>*:not(p)]:break-inside-avoid",
      )}
    >
      <PortableText
        value={groupInlineImages(value.content)}
        components={basePortableTextComponents}
      />
    </div>
  );
}
