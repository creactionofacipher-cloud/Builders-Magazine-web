import type { LandingPage } from "@/types/content";
import { mapLayoutBlocks, type RawLayoutBlock } from "./layoutBlocks";

export interface RawLandingPage extends Omit<LandingPage, "blocks"> {
  blocks?: RawLayoutBlock[];
}

export function mapLandingPage(raw: RawLandingPage): LandingPage {
  return { ...raw, blocks: mapLayoutBlocks(raw.blocks) };
}
