import type { Story } from "@/types/content";
import { mapBike, type RawBike } from "./bike";

export interface RawStory extends Omit<Story, "relatedBike"> {
  relatedBike?: RawBike[];
}

export function mapStory(raw: RawStory): Story {
  return {
    ...raw,
    relatedBike: raw.relatedBike?.map(mapBike),
  };
}
