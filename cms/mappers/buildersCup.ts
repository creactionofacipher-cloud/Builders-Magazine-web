import type { BuildersCup } from "@/types/content";
import { mapBike, type RawBike } from "./bike";

export interface RawBuildersCup extends Omit<BuildersCup, "participants" | "winners"> {
  participants?: RawBike[];
  winners?: RawBike[];
}

export function mapBuildersCup(raw: RawBuildersCup): BuildersCup {
  return {
    ...raw,
    participants: raw.participants?.map(mapBike),
    winners: raw.winners?.map(mapBike),
  };
}
