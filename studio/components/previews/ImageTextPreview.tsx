import { previewImageUrl } from "../../lib/imageUrl";
import { GLYPH_BOX, MiniImage, TextLine } from "./shared";

interface ImageTextSelection {
  file?: unknown;
  altText?: string;
  position?: string;
  width?: string;
  textWrap?: boolean;
}

const WIDTH_FRACTION: Record<string, number> = { "35%": 0.35, "40%": 0.4, "50%": 0.5 };

// Three short lines mock up the paragraphs wrapping beside the image —
// faded when textWrap is off, since the frontend then positions the
// image without any surrounding text actually wrapping around it (see
// components/ui/richtext/RichTextImageText.tsx).
function ImageTextGlyph({
  url,
  altText,
  position,
  width,
  textWrap,
}: {
  url?: string;
  altText?: string;
  position: string;
  width: string;
  textWrap: boolean;
}) {
  const imageFraction = WIDTH_FRACTION[width] ?? WIDTH_FRACTION["40%"];

  const image = (
    <div style={{ width: `${imageFraction * 100}%`, height: "100%" }}>
      <MiniImage url={url} alt={altText} />
    </div>
  );

  const lines = (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 4,
        opacity: textWrap ? 1 : 0.35,
      }}
    >
      <TextLine style={{ width: "90%" }} />
      <TextLine style={{ width: "70%" }} />
      <TextLine style={{ width: "85%" }} />
    </div>
  );

  return (
    <div
      style={{
        ...GLYPH_BOX,
        display: "flex",
        gap: 4,
        border: "1px solid #d0d0d0",
        borderRadius: 3,
        padding: 3,
        boxSizing: "border-box",
      }}
    >
      {position === "right" ? (
        <>
          {lines}
          {image}
        </>
      ) : (
        <>
          {image}
          {lines}
        </>
      )}
    </div>
  );
}

// A tiny mockup of the image + wrapped-text layout — image on the
// selected side at roughly the selected width, with faded lines when
// textWrap is off (matching the frontend, where the image then just sits
// positioned without anything actually wrapping around it).
export const imageTextPreview = {
  select: {
    file: "image.file",
    altText: "image.altText",
    position: "position",
    width: "width",
    textWrap: "textWrap",
  },
  prepare({ file, altText, position, width, textWrap }: ImageTextSelection) {
    const resolvedPosition = position ?? "left";
    const resolvedWidth = width ?? "40%";
    return {
      title: `Image + Text — ${resolvedPosition}, ${resolvedWidth}`,
      subtitle: textWrap === false ? "без обтекания" : "текст обтекает",
      media: (
        <ImageTextGlyph
          url={previewImageUrl(file)}
          altText={altText}
          position={resolvedPosition}
          width={resolvedWidth}
          textWrap={textWrap !== false}
        />
      ),
    };
  },
};
