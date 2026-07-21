import { previewImageUrl } from "../../lib/imageUrl";
import { MiniImage } from "./shared";

interface FullBleedSelection {
  file?: unknown;
  caption?: string;
  altText?: string;
}

// Outward-pointing arrows on both edges signal "breaks out of the
// reading column" — the one thing that distinguishes this block from a
// plain richTextImage at a glance (see
// components/ui/richtext/RichTextFullBleed.tsx, which reuses the exact
// same breakout as richTextImage's "fullWidth" variant on the frontend;
// the Studio preview needs its own visual cue since the two blocks would
// otherwise look identical here).
export const fullBleedPreview = {
  select: { file: "image.file", caption: "image.caption", altText: "image.altText" },
  prepare({ file, caption, altText }: FullBleedSelection) {
    return {
      title: caption || altText || "Full Bleed Image",
      subtitle: "Во всю ширину страницы",
      media: (
        <div style={{ width: 56, height: 40, display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#999" }}>◀</span>
          <div style={{ flex: 1, height: "100%" }}>
            <MiniImage url={previewImageUrl(file)} alt={altText} />
          </div>
          <span style={{ fontSize: 10, color: "#999" }}>▶</span>
        </div>
      ),
    };
  },
};
