import type { RichTextLayoutBlock } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { RichText } from "@/components/ui/RichText";
import { getBlockSectionProps, resolveContainerWidth } from "./blockSettings";

interface RichTextBlockProps {
  block: RichTextLayoutBlock;
}

// Reuses components/ui/RichText.tsx wholesale — the exact same renderer
// and reading-column wrapper the Story detail page uses around its own
// <RichText> call (app/[locale]/stories/[slug]/page.tsx), so every
// feature (galleries, pull quotes, embeds, editorial layouts, lightbox)
// works identically here with zero duplicated rendering logic.
export function RichTextBlock({ block }: RichTextBlockProps) {
  const content = block.content ?? [];
  if (content.length === 0) return null;

  return (
    <Section {...getBlockSectionProps(block.settings)}>
      <Container width={resolveContainerWidth(block.settings)}>
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <RichText value={content} />
        </div>
      </Container>
    </Section>
  );
}
