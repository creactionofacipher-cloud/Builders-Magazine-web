import type { BuilderSpotlightBlock as BuilderSpotlightBlockType } from "@/types/content";
import { BuilderCard } from "@/components/editorial/BuilderCard";
import { SpotlightBlockShell } from "./SpotlightBlockShell";

interface BuilderSpotlightBlockProps {
  block: BuilderSpotlightBlockType;
}

// Reuses BuilderCard (components/editorial/BuilderCard.tsx) unmodified —
// no detail page to link the card itself to yet (post-MVP), so the CTA
// is a free-form editor-authored URL instead (confirmed with user).
export function BuilderSpotlightBlock({ block }: BuilderSpotlightBlockProps) {
  if (!block.builder) return null;

  return (
    <SpotlightBlockShell
      heading={block.heading || block.builder.name}
      ctaText={block.ctaText}
      ctaUrl={block.ctaUrl}
      settings={block.settings}
    >
      <BuilderCard builder={block.builder} className="mx-auto w-full max-w-md" />
    </SpotlightBlockShell>
  );
}
