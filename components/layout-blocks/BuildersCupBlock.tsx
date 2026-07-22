import type { EnabledLocale } from "@/lib/i18n/locales";
import type { BuildersCupHighlightBlock } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { BuildersCupHighlight } from "@/components/editorial/BuildersCupHighlight";
import { getBlockSectionProps, resolveContainerWidth } from "./blockSettings";

interface BuildersCupBlockProps {
  block: BuildersCupHighlightBlock;
  locale: EnabledLocale;
}

export function BuildersCupBlock({ block, locale }: BuildersCupBlockProps) {
  if (!block.event) return null;

  return (
    <Section {...getBlockSectionProps(block.settings)}>
      <Container width={resolveContainerWidth(block.settings)}>
        <BuildersCupHighlight event={block.event} locale={locale} />
      </Container>
    </Section>
  );
}
