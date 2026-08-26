import type { BuildersCup, BuildersCupParticipant } from "@/types/content";
import { mapBike, type RawBike } from "./bike";

export interface RawBuildersCupParticipant extends RawBike {
  winner?: boolean;
  nomination?: { title: string } | null;
}

export interface RawBuildersCup extends Omit<BuildersCup, "participants"> {
  participants?: RawBuildersCupParticipant[];
}

function mapParticipant(raw: RawBuildersCupParticipant): BuildersCupParticipant {
  return {
    ...mapBike(raw),
    winner: Boolean(raw.winner),
    nomination: raw.nomination ?? undefined,
  };
}

export function mapBuildersCup(raw: RawBuildersCup): BuildersCup {
  return {
    ...raw,
    participants: raw.participants?.map(mapParticipant),
  };
}
