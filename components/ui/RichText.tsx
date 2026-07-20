import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { RichText as RichTextValue } from "@/types/content";
import { cn } from "@/utils/cn";
import { basePortableTextComponents, groupInlineImages } from "./richtext/base";
import { RichTextImageRow } from "./richtext/RichTextImageRow";
import { RichTextImageText } from "./richtext/RichTextImageText";
import { RichTextFullBleed } from "./richtext/RichTextFullBleed";
import { RichTextTwoColumns } from "./richtext/RichTextTwoColumns";

const portableTextComponents: PortableTextComponents = {
  ...basePortableTextComponents,
  types: {
    ...basePortableTextComponents.types,
    imageRow: RichTextImageRow,
    imageText: RichTextImageText,
    fullBleedImage: RichTextFullBleed,
    twoColumnText: RichTextTwoColumns,
  },
};

interface RichTextProps {
  value: RichTextValue;
  className?: string;
}

export function RichText({ value, className }: RichTextProps) {
  return (
    // flow-root (not flex): a RichTextImageText block floats its image
    // (see components/ui/richtext/RichTextImageText.tsx) so the plain
    // paragraphs that follow it can genuinely wrap around it — CSS float
    // has no effect between flex-item siblings, only within normal block
    // flow. flow-root also keeps the container's height wrapping around a
    // trailing float instead of collapsing around it. [&>*+*]:mt-4
    // reproduces the same "gap-4 between siblings, none before the first
    // or after the last" rhythm the previous flex layout gave every block,
    // via margin instead of gap — visually identical for every existing
    // (non-floating) block, and required for float wrapping to work here.
    <div className={cn("flow-root [&>*+*]:mt-4", className)}>
      <PortableText value={groupInlineImages(value)} components={portableTextComponents} />
    </div>
  );
}
