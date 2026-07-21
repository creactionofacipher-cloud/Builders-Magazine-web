import { firstLineOf } from "../../lib/plainText";
import { GLYPH_BOX, TextLine } from "./shared";

interface TwoColumnSelection {
  content?: unknown;
}

function TwoColumnMedia() {
  const column = (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
      <TextLine />
      <TextLine style={{ width: "80%" }} />
      <TextLine />
      <TextLine style={{ width: "60%" }} />
    </div>
  );

  return (
    <div
      style={{
        ...GLYPH_BOX,
        display: "flex",
        gap: 5,
        border: "1px solid #d0d0d0",
        borderRadius: 3,
        padding: 4,
        boxSizing: "border-box",
      }}
    >
      {column}
      {column}
    </div>
  );
}

// Two bordered stacks of lines side by side — the block's whole purpose
// is the desktop two-column flow (see
// components/ui/richtext/RichTextTwoColumns.tsx), so the preview's job is
// just to signal "this is the two-column block", not to render actual
// nested content in miniature.
export const twoColumnPreview = {
  select: { content: "content" },
  prepare({ content }: TwoColumnSelection) {
    const snippet = firstLineOf(content);
    return {
      title: "Two-Column Text",
      subtitle: snippet || undefined,
      media: <TwoColumnMedia />,
    };
  },
};
