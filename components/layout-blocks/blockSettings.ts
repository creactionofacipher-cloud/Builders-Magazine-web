import type { CSSProperties } from "react";
import type { BlockSettings, ContainerWidth, SpacerSize } from "@/types/content";

// Same px scale as SpacerBlock.tsx's own SPACER_HEIGHT_CLASSES (h-8/h-16/
// h-24/h-40 → 32/64/96/160px at Tailwind's 4px unit) — kept here as the
// single source of truth so Spacer's own sizing and Block Settings'
// spacing overrides can never drift out of sync with each other.
export const SPACER_HEIGHT_CLASSES: Record<SpacerSize, string> = {
  sm: "h-8",
  md: "h-16",
  lg: "h-24",
  xl: "h-40",
};

const SPACER_HEIGHT_PX: Record<SpacerSize, number> = {
  sm: 32,
  md: 64,
  lg: 96,
  xl: 160,
};

interface BlockSectionProps {
  id?: string;
  surface?: boolean;
  style?: CSSProperties;
}

// Applied by every block renderer that wraps in <Section> — spreads
// straight onto that <Section> call (see components/layout/Section.tsx's
// id/style passthrough). `defaultSurface` is the block's own pre-v2
// default (e.g. Merchandise always used a surface background); an
// explicit Block Settings `background` overrides it, leaving it unset
// preserves that default exactly, so no pre-existing document's
// rendering changes just from this field existing.
export function getBlockSectionProps(
  settings: BlockSettings | undefined,
  defaultSurface = false,
): BlockSectionProps {
  const surface =
    settings?.background === "surface"
      ? true
      : settings?.background === "none" || settings?.background === "custom"
        ? false
        : defaultSurface;

  const style: CSSProperties = {};
  if (settings?.spacingTop) style.marginTop = SPACER_HEIGHT_PX[settings.spacingTop];
  if (settings?.spacingBottom) style.marginBottom = SPACER_HEIGHT_PX[settings.spacingBottom];
  if (settings?.background === "custom" && settings.backgroundColor) {
    style.backgroundColor = settings.backgroundColor;
  }

  return {
    id: settings?.anchor || undefined,
    surface,
    style: Object.keys(style).length > 0 ? style : undefined,
  };
}

// Only meaningful for blocks that wrap their content in <Container> —
// intentionally full-bleed blocks (Hero, the CTA banner's own background)
// don't read this, same reasoning as getBlockSectionProps' defaultSurface:
// not every setting applies to every block.
export function resolveContainerWidth(
  settings: BlockSettings | undefined,
): ContainerWidth | undefined {
  return settings?.containerWidth;
}
