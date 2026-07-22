import type { BikeSpotlightBlock as BikeSpotlightBlockType } from "@/types/content";
import { BikeCard } from "@/components/editorial/BikeCard";
import { SpotlightBlockShell } from "./SpotlightBlockShell";

interface BikeSpotlightBlockProps {
  block: BikeSpotlightBlockType;
}

// Reuses BikeCard (components/editorial/BikeCard.tsx) unmodified — no
// detail page to link the card itself to yet (post-MVP), so the CTA is a
// free-form editor-authored URL instead (confirmed with user).
export function BikeSpotlightBlock({ block }: BikeSpotlightBlockProps) {
  if (!block.bike) return null;

  return (
    <SpotlightBlockShell
      heading={block.heading || block.bike.name}
      ctaText={block.ctaText}
      ctaUrl={block.ctaUrl}
      settings={block.settings}
    >
      <BikeCard bike={block.bike} className="mx-auto w-full max-w-md" />
    </SpotlightBlockShell>
  );
}
