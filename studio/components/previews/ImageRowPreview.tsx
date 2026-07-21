import type { ReactNode } from "react";
import { previewImageUrl } from "../../lib/imageUrl";
import { GLYPH_BOX, MiniImage } from "./shared";

interface ImageRowSelection {
  file0?: unknown;
  file1?: unknown;
  file2?: unknown;
  file3?: unknown;
  layout?: string;
  gap?: string;
  caption?: string;
  count?: number;
}

const GAP_PX: Record<string, number> = { small: 1, medium: 2, large: 3 };

// Same width-ratio rule the frontend renderer uses (see
// components/ui/richtext/RichTextImageRow.tsx's widthClassFor) — mirrored
// here in miniature so the Studio preview visually matches what actually
// renders on the page.
function widthRatio(layout: string, index: number): number {
  if (layout === "2-1") return index === 0 ? 2 : 1;
  if (layout === "1-2") return index === 0 ? 1 : 2;
  return 1;
}

export const imageRowPreview = {
  // The schema caps images at 2–4 (see the block's own validation), so
  // four fixed index paths cover every possible row — Sanity's select
  // can't dereference through an *array* of references in one path the
  // way it can through a single reference (image.file), so this is the
  // one case where richTextImage/imageText/fullBleedImage's simpler
  // single dot-path isn't available; fixed indices are the equivalent
  // for a bounded-size array.
  select: {
    file0: "images.0.file",
    file1: "images.1.file",
    file2: "images.2.file",
    file3: "images.3.file",
    layout: "layout",
    gap: "gap",
    caption: "caption",
    count: "images.length",
  },
  prepare({ file0, file1, file2, file3, layout, gap, caption, count }: ImageRowSelection) {
    const files = [file0, file1, file2, file3].slice(0, count ?? 0);
    const resolvedLayout = layout ?? "equal";
    const gapPx = GAP_PX[gap ?? "medium"] ?? GAP_PX.medium;
    const n = files.length;

    let media: ReactNode;
    if ((resolvedLayout === "large-left" || resolvedLayout === "large-right") && n > 1) {
      const [heroFile, ...restFiles] = files;
      const hero = (
        <div style={{ flexGrow: 2, height: "100%" }}>
          <MiniImage url={previewImageUrl(heroFile)} />
        </div>
      );
      const rest = (
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: gapPx }}>
          {restFiles.map((file, index) => (
            <div key={index} style={{ flex: 1 }}>
              <MiniImage url={previewImageUrl(file)} />
            </div>
          ))}
        </div>
      );
      media = (
        <div style={{ ...GLYPH_BOX, display: "flex", gap: gapPx, overflow: "hidden", borderRadius: 3 }}>
          {resolvedLayout === "large-left" ? (
            <>
              {hero}
              {rest}
            </>
          ) : (
            <>
              {rest}
              {hero}
            </>
          )}
        </div>
      );
    } else if (n > 0) {
      media = (
        <div style={{ ...GLYPH_BOX, display: "flex", gap: gapPx, overflow: "hidden", borderRadius: 3 }}>
          {files.map((file, index) => (
            <div key={index} style={{ flexGrow: widthRatio(resolvedLayout, index) }}>
              <MiniImage url={previewImageUrl(file)} />
            </div>
          ))}
        </div>
      );
    }

    return {
      title: caption || `Image Row — ${resolvedLayout}`,
      subtitle: `${n} изображени${n === 1 ? "е" : n < 5 ? "я" : "й"}`,
      media,
    };
  },
};
