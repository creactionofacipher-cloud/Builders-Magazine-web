import type { Issue } from "@/types/content";
import { mockIssues } from "./mock-data";

// Mock implementation — Milestone 10 replaces the body with a Sanity
// fetch behind this same signature. Callers never change.
export async function getCurrentIssue(): Promise<Issue | null> {
  return mockIssues[0] ?? null;
}
