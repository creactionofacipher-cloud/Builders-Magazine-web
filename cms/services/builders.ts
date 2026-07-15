import type { Builder } from "@/types/content";
import { mockBuilders } from "./mock-data";

// Mock implementation — Milestone 10 replaces the body with a Sanity
// fetch behind this same signature. Callers never change.
export async function getAllBuilders(): Promise<Builder[]> {
  return mockBuilders;
}
