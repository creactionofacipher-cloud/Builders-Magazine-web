import type { ReactNode } from "react";
import type { BlockSettings } from "@/types/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { isExternalUrl } from "@/utils/isExternalUrl";
import { getBlockSectionProps, resolveContainerWidth } from "./blockSettings";

interface SpotlightBlockShellProps {
  heading: string;
  ctaText?: string;
  ctaUrl?: string;
  settings?: BlockSettings;
  children: ReactNode;
}

// Shared skeleton behind BikeSpotlightBlock.tsx and BuilderSpotlightBlock.tsx
// — identical Section/Container/Heading/CTA shell, only the entity card
// itself (passed as `children`) and its heading/CTA text differ.
export function SpotlightBlockShell({
  heading,
  ctaText,
  ctaUrl,
  settings,
  children,
}: SpotlightBlockShellProps) {
  const hasCta = Boolean(ctaText && ctaUrl);
  const external = hasCta && isExternalUrl(ctaUrl as string);

  return (
    <Section {...getBlockSectionProps(settings)}>
      <Container width={resolveContainerWidth(settings)} className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Heading level={2}>{heading}</Heading>
          {hasCta && (
            <ButtonLink
              href={ctaUrl as string}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {ctaText}
            </ButtonLink>
          )}
        </div>
        {children}
      </Container>
    </Section>
  );
}
