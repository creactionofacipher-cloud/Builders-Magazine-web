import type { HomePage } from "@/types/content";
import { mapLayoutBlocks, type RawLayoutBlock } from "./layoutBlocks";

export interface RawHomePage {
  blocks?: RawLayoutBlock[];
}

export function mapHomePage(raw: RawHomePage): HomePage {
  return { blocks: mapLayoutBlocks(raw.blocks) };
}
