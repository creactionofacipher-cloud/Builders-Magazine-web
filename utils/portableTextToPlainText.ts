import type { PortableTextBlock } from "@portabletext/types";
import type { RichText } from "@/types/content";

function isTextBlock(block: RichText[number]): block is PortableTextBlock {
  return block._type === "block";
}

// Card excerpts derive their blurb from the entity's existing rich-text
// field rather than requiring a separate plain-text field in the content
// model. Non-block entries (richTextImage, pullQuote, divider — see
// types/content.ts) are skipped, same as before this filter needed a type
// predicate to narrow the wider RichText union.
export function portableTextToPlainText(value: RichText | undefined, maxLength?: number): string {
  if (!value) return "";

  const text = value
    .filter(isTextBlock)
    .map((block) =>
      block.children
        .filter((child) => child._type === "span" && "text" in child)
        .map((child) => (child as { text: string }).text)
        .join(""),
    )
    .join(" ")
    .trim();

  if (maxLength && text.length > maxLength) {
    return `${text.slice(0, maxLength).trimEnd()}…`;
  }

  return text;
}
