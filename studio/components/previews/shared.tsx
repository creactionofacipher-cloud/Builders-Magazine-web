import type { CSSProperties, ReactNode } from "react";
import { previewImageUrl } from "../../lib/imageUrl";

// Fixed footprint every custom block preview media renders into — Sanity
// gives the `media` slot in a Portable Text block's collapsed row a
// small, consistent square, so every glyph here targets that same size
// rather than each block guessing its own.
export const GLYPH_BOX: CSSProperties = { width: 48, height: 48, position: "relative" };

// Small resolved-thumbnail <img>, reused by every preview that shows an
// actual photo (RichTextImagePreview, ImageRowPreview, ImageTextPreview,
// FullBleedPreview) instead of each one re-implementing image styling —
// a flat gray placeholder while the async lookup resolves (useResolvedImages)
// or when it's simply missing, so a broken/removed reference never
// renders as a broken-image icon.
export function MiniImage({ url, alt, style }: { url?: string; alt?: string; style?: CSSProperties }) {
  if (!url) {
    return <div style={{ background: "#e0e0e0", width: "100%", height: "100%", ...style }} />;
  }
  return (
    <img
      src={url}
      alt={alt ?? ""}
      style={{ objectFit: "cover", width: "100%", height: "100%", display: "block", ...style }}
    />
  );
}

// Thin absolutely-positioned line, reused to sketch "text" in glyphs that
// mock up a text layout (ImageTextPreview's wrap lines, TwoColumnPreview's
// column lines) — a repeated visual language instead of each glyph
// inventing its own line-drawing markup.
export function TextLine({ style }: { style?: CSSProperties }) {
  return (
    <div
      style={{
        height: 3,
        borderRadius: 1,
        background: "#b3b3b3",
        ...style,
      }}
    />
  );
}

export function GlyphFrame({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        ...GLYPH_BOX,
        overflow: "hidden",
        borderRadius: 3,
        border: "1px solid #d0d0d0",
        background: "#f4f4f4",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Row of MiniImage thumbnails with a "+N" overflow tile — shared by
// HorizontalImageStripPreview (Layout Block) and ImageStripPreview
// (RichText block), the two places an image count can run well past
// what a handful of fixed `select` index paths can cover (see either
// preview's own comment on that constraint). `files` is already sliced
// to the resolved thumbnail paths; `overflow` is how many more images
// exist beyond those.
export function ImageStripThumbnails({ files, overflow }: { files: unknown[]; overflow: number }) {
  if (files.length === 0) return undefined;
  return (
    <div style={{ ...GLYPH_BOX, display: "flex", gap: 1, overflow: "hidden", borderRadius: 3 }}>
      {files.map((file, index) => (
        <div key={index} style={{ flex: 1, position: "relative" }}>
          <MiniImage url={previewImageUrl(file)} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#e0e0e0",
            fontSize: 9,
            color: "#666",
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
