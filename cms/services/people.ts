import type { Person } from "@/types/content";
import { mockCrew } from "./mock-data";

// Mock implementation — Milestone 10 replaces the body with a Sanity
// fetch behind this same signature. Callers never change.
export async function getCrew(): Promise<Person[]> {
  return mockCrew;
}
