import type { Bike } from "@/types/content";
import { mockBikes } from "./mock-data";

// Mock implementation — Milestone 10 replaces the body with a Sanity
// fetch behind this same signature. Callers never change.
export async function getAllBikes(): Promise<Bike[]> {
  return mockBikes;
}
