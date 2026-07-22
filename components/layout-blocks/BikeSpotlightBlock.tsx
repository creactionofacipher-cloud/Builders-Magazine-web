import type { BikeSpotlightBlock as BikeSpotlightBlockType } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { BikeCard } from "@/components/editorial/BikeCard";
import { getBlockSectionProps, resolveContainerWidth } from "./blockSettings";

interface BikeSpotlightBlockProps {
  block: BikeSpotlightBlockType;
}

// Reuses BikeCard (components/editorial/BikeCard.tsx) unmodified — no
// detail page to link the card itself to yet (post-MVP), so the CTA is a
// free-form editor-authored URL instead (confirmed with user).
export function BikeSpotlightBlock({ block }: BikeSpotlightBlockProps) {
  if (!block.bike) return null;

  const hasCta = Boolean(block.ctaText && block.ctaUrl);

  return (
    <Section {...getBlockSectionProps(block.settings)}>
      <Container width={resolveContainerWidth(block.settings)} className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Heading level={2}>{block.heading || block.bike.name}</Heading>
          {hasCta && <ButtonLink href={block.ctaUrl as string}>{block.ctaText}</ButtonLink>}
        </div>
        <BikeCard bike={block.bike} className="mx-auto w-full max-w-md" />
      </Container>
    </Section>
  );
}
