import type { QuoteBlock as QuoteBlockType } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Quote } from "@/components/ui/Quote";
import { getBlockSectionProps, resolveContainerWidth } from "./blockSettings";

interface QuoteBlockProps {
  block: QuoteBlockType;
}

// Same shape as the pullQuote portable-text renderer in
// components/ui/richtext/base.tsx.
export function QuoteBlock({ block }: QuoteBlockProps) {
  if (!block.text) return null;

  return (
    <Section {...getBlockSectionProps(block.settings)}>
      <Container width={resolveContainerWidth(block.settings)}>
        <Quote className="mx-auto max-w-2xl">
          {block.text}
          {block.author && (
            <footer className="mt-2 text-sm text-muted not-italic">— {block.author}</footer>
          )}
        </Quote>
      </Container>
    </Section>
  );
}
