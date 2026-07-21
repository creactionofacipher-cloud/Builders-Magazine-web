// Minimal mirror of utils/portableTextToPlainText.ts, scoped to just what
// TwoColumnPreview.tsx needs (a short first-line snippet for its
// subtitle) — Studio can't import the main app's utils/ directly (see
// studio/lib/embedProvider.ts for the same reasoning).
interface PlainTextBlock {
  _type?: string;
  children?: { _type?: string; text?: string }[];
}

export function firstLineOf(blocks: unknown, maxLength = 60): string {
  if (!Array.isArray(blocks)) return "";
  const firstTextBlock = (blocks as PlainTextBlock[]).find((block) => block._type === "block");
  if (!firstTextBlock?.children) return "";

  const text = firstTextBlock.children
    .filter((child) => child._type === "span" && typeof child.text === "string")
    .map((child) => child.text)
    .join("")
    .trim();

  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
}
