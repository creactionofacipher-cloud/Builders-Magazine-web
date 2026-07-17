import type { Bike } from "@/types/content";

// GROQ's projection returns specifications as an array of {key, value}
// pairs (cms/queries/fragments.ts) since Sanity has no dynamic-key
// object field — this is the one real transform every Bike-shaped
// response needs, whether fetched top-level or nested (Story.relatedBike,
// Builder.projects, BuildersCup.participants/winners).
export interface RawBike extends Omit<Bike, "specifications"> {
  specifications?: { key: string; value: string }[];
}

export function mapBike(raw: RawBike): Bike {
  return {
    ...raw,
    specifications: raw.specifications?.length
      ? Object.fromEntries(raw.specifications.map(({ key, value }) => [key, value]))
      : undefined,
  };
}
