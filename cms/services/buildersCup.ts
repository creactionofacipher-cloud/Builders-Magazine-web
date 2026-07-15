import type { BuildersCup } from "@/types/content";
import { mockBuildersCupEvents } from "./mock-data";

// Mock implementation — Milestone 10 replaces the body with a Sanity
// fetch behind this same signature. Callers never change.
export async function getLatestBuildersCup(): Promise<BuildersCup | null> {
  return mockBuildersCupEvents[0] ?? null;
}
