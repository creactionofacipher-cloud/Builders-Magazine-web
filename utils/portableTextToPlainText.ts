import type { RichText } from "@/types/content";

// Card excerpts derive their blurb from the entity's existing rich-text
// field rather than requiring a separate plain-text field in the content
// model.
export function portableTextToPlainText(value: RichText | undefined, maxLength?: number): string {
  if (!value) return "";

  const text = value
    .filter((block) => block._type === "block")
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
