import type { Builder } from "@/types/content";
import { mapBike, type RawBike } from "./bike";

export interface RawBuilder extends Omit<Builder, "projects"> {
  projects?: RawBike[];
}

export function mapBuilder(raw: RawBuilder): Builder {
  return {
    ...raw,
    projects: raw.projects?.map(mapBike),
  };
}
