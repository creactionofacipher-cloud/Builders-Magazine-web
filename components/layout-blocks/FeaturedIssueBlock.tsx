import type { EnabledLocale } from "@/lib/i18n/locales";
import type { FeaturedIssueBlock as FeaturedIssueBlockType } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { FeaturedIssue } from "@/components/editorial/FeaturedIssue";
import { getBlockSectionProps, resolveContainerWidth } from "./blockSettings";

interface FeaturedIssueBlockProps {
  block: FeaturedIssueBlockType;
  locale: EnabledLocale;
}

export function FeaturedIssueBlock({ block, locale }: FeaturedIssueBlockProps) {
  if (!block.issue) return null;

  return (
    <Section {...getBlockSectionProps(block.settings)}>
      <Container width={resolveContainerWidth(block.settings)}>
        <FeaturedIssue issues={[block.issue]} locale={locale} />
      </Container>
    </Section>
  );
}
